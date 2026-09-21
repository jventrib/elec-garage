/**
 * Le **trajet réel de chaque conducteur**, dérivé du pilotage déclaré.
 *
 * Question posée le 2026-09-22 : « pourquoi huit conducteurs dans CH-07 ? ». La
 * réponse était gênante — il n'y en a pas huit, il y en a six. Le huit était un
 * majorant appliqué uniformément à tout le tronc partagé, alors que seul CH-05
 * l'atteint : c'est lui qui descend la phase aux commandes et remonte les deux
 * retours. Une fiche qui présente une borne comme un décompte commet exactement la
 * faute que `volumeMajorant` et le majorant de section servent à éviter ailleurs.
 *
 * Ce qui manquait pour trancher était une seule donnée : **quelle commande pilote
 * quel point**, qui ne vivait que dans la prose de FR-038. Déclarée sur la
 * commande (`pilote`, `commutation`), elle rend dérivables le décompte par
 * conduit, le métré des conducteurs et la longueur du conducteur de phase.
 *
 * Deux règles portent tout le module :
 *
 *  - un conducteur occupe l'**union** des chemins qui le mènent à ses
 *    destinations, et compte **une fois par conduit**. C'est le point qui fait
 *    toute la différence : le retour de CM-01 dessert deux sorties du plafonnier
 *    mais reste **un seul fil** jusqu'à la fourche BL-01 ;
 *  - un pilotage **partiellement** déclaré n'est pas un pilotage. Le circuit
 *    retombe alors sur le majorant qu'il déclare, et ce qui l'affiche doit le dire.
 */

import { longueurCheminement } from './cheminement.js';
import { construireGraphe, cheminEntre } from './graphe.js';

/** Les rôles qu'un conducteur peut tenir, dans l'ordre où on les énonce. */
export const ROLES = [
  { role: 'phase', singulier: 'phase', pluriel: 'phases' },
  { role: 'neutre', singulier: 'neutre', pluriel: 'neutres' },
  { role: 'pe', singulier: 'PE', pluriel: 'PE' },
  { role: 'retour-commande', singulier: 'retour commandé', pluriel: 'retours commandés' },
  { role: 'retour-local', singulier: 'retour local', pluriel: 'retours locaux' },
  { role: 'sortie-module', singulier: 'sortie de module', pluriel: 'sorties de module' },
  { role: 'ordre', singulier: 'ordre', pluriel: 'ordres' },
];

const RANG = new Map(ROLES.map((r, i) => [r.role, i]));

const APPAREILS_HORS_POINT = ['commande', 'tableau'];
// Une ENVELOPPE — boîte, organe de connexion, accessoire de conduit — n'est pas
// desservie : les conducteurs y passent ou s'y séparent, ils n'y aboutissent pas.
// La liste de types d'origine ne connaissait que la boîte de dérivation ; l'organe
// de connexion et l'accessoire, venus avec la typologie des enveloppes, y étaient
// desservis comme des socles, et le premier recevait un brin de trop.
const ROLES_HORS_POINT = ['jonction', 'accessoire'];

/** Les points desservis par un circuit : ni commande, ni enveloppe, ni tableau. */
const pointsDe = (composants, modele) => {
  const role = (type) => (modele.types?.types ?? []).find((t) => t.id === type)?.role;
  return composants.filter(
    (c) => !APPAREILS_HORS_POINT.includes(c.type) && c.type !== 'boite-derivation' && !ROLES_HORS_POINT.includes(role(c.type)),
  );
};

/**
 * Les conducteurs d'un circuit, chacun avec les conduits qu'il emprunte et la
 * longueur qui en découle.
 *
 * Rend `null` quand la dérivation n'est pas possible — pilotage incomplet,
 * destination injoignable, tableau absent. Rendre un décompte partiel serait
 * rendre un décompte faux, et c'est le majorant déclaré qui doit alors servir.
 */
export function conducteursDuCircuit(graphe, modele, idCircuit) {
  const duCircuit = (modele.composants ?? []).filter((c) => c.circuit === idCircuit);
  const commandes = duCircuit.filter((c) => c.type === 'commande');
  const points = pointsDe(duCircuit, modele);
  if (points.length === 0) return null;

  // Un pilotage à moitié déclaré ne se complète pas au jugé : les liens manquants
  // seraient inventés, et le décompte qui en sortirait aurait l'apparence d'un
  // décompte dérivé. Une commande sur module fait exception : c'est son `module`
  // qui dit où va son ordre, et ce qu'elle commande peut n'être pas un point de
  // l'installation — le moteur de la porte.
  const sansPilote = (c) => !Array.isArray(c.pilote) || c.pilote.length === 0;
  if (commandes.some((c) => sansPilote(c) && c.commutation !== 'entree-module')) return null;

  const tableau = (modele.composants ?? []).find((c) => c.type === 'tableau');
  if (!tableau) return null;

  const surPlace = (cm) => cm.commutation === 'sur-place';
  // Un interrupteur qui commande un MODULE ne coupe aucune puissance : le module
  // détient la phase et la sortie, l'interrupteur lui adresse un ordre.
  const surModule = (cm) => cm.commutation === 'entree-module';
  const commandeDe = new Map();
  for (const cm of commandes) for (const id of cm.pilote ?? []) commandeDe.set(id, cm);

  // Le module d'une commande sur module est un point du même circuit. S'il manque
  // — un apport lu sans celui qui le déclare —, l'ordre n'a pas de départ, et
  // inventer ce départ rendrait un décompte faux.
  const moduleDe = new Map();
  for (const cm of commandes.filter(surModule)) {
    const module = points.find((p) => p.id === cm.module && p.type === 'module-commande');
    if (!module) return null;
    moduleDe.set(cm.id, module);
  }

  // Un module dont l'entrée commute la PHASE — `entree: "phase"` — n'alimente pas
  // son bouton : le bouton prend la phase de son circuit, et un seul fil en revient
  // au module. Sinon l'entrée est alimentée par le module, et le bouton ferme une
  // boucle : deux fils, un aller et un retour. C'est une propriété du produit.
  const surPhase = (cm) => surModule(cm) && moduleDe.get(cm.id).entree === 'phase';

  // FR-012 : le conducteur de protection va à CHAQUE point et à chaque commande,
  // les deux points extérieurs et le détecteur compris. Le neutre suit la même
  // desserte, sauf aux commandes sur module : un bouton sur l'entrée d'un module
  // n'en a pas l'usage (décision du maître d'ouvrage du 2026-09-23).
  const partout = [...points, ...commandes];
  const projet = [
    { role: 'pe', libelle: 'PE', destinations: partout },
    { role: 'neutre', libelle: 'neutre', destinations: partout.filter((c) => !surModule(c)) },
    {
      role: 'phase',
      libelle: 'phase',
      // La phase s'arrête aux commandes qui renvoient un retour ; elle va au point
      // lui-même quand la commutation se fait SUR PLACE, ou quand rien ne le
      // pilote — un module compris. Un point commuté par un module ne la reçoit
      // pas : c'est la sortie du module qui l'alimente.
      // Un bouton sur une entrée qui commute la phase la reçoit aussi : c'est la
      // phase qu'il renvoie au module.
      destinations: [
        ...commandes.filter((cm) => (!surPlace(cm) && !surModule(cm)) || surPhase(cm)),
        ...points.filter((p) => {
          const cm = commandeDe.get(p.id);
          return !cm || surPlace(cm);
        }),
      ],
    },
  ];

  // La sortie de chaque module va, en UN conducteur, à l'union des points que ses
  // commandes pilotent : CM-01 et CM-04 font allumer le même plafonnier, par le
  // même fil.
  const modules = [...new Set(moduleDe.values())];
  for (const module of modules) {
    const commutes = points.filter((p) =>
      commandes.some((cm) => moduleDe.get(cm.id) === module && (cm.pilote ?? []).includes(p.id)),
    );
    if (commutes.length === 0) continue;
    projet.push({
      role: 'sortie-module',
      libelle: `sortie de ${module.reference}`,
      depart: module,
      destinations: commutes,
    });
  }

  for (const cm of commandes) {
    if (surModule(cm)) {
      // Le module tient la phase et la sortie ; l'interrupteur lui adresse un ORDRE
      // et ne porte aucune puissance. Deux conducteurs vont du module à
      // l'interrupteur — celui qui l'alimente et celui qui en revient —, et chaque
      // commande a SA paire, sur son propre trajet.
      //
      // Sur une entrée qui commute la phase, le retour seul : l'aller est la phase
      // du circuit, déjà comptée, qui rejoint le bouton par le plus court.
      for (const brin of surPhase(cm) ? ['retour'] : ['aller', 'retour']) {
        projet.push({
          role: 'ordre',
          libelle: `ordre de ${cm.reference} (${brin})`,
          depart: moduleDe.get(cm.id),
          destinations: [cm],
        });
      }
      continue;
    }
    const pilotes = points.filter((p) => (cm.pilote ?? []).includes(p.id));
    if (pilotes.length === 0) continue;
    if (surPlace(cm)) {
      // Un retour local ne quitte pas la liaison point ↔ commande : le détecteur
      // est alimenté en permanence et commute ce qui est déjà chez lui.
      for (const p of pilotes) {
        projet.push({
          role: 'retour-local',
          libelle: `retour local de ${cm.reference}`,
          depart: p,
          destinations: [cm],
        });
      }
    } else {
      projet.push({
        role: 'retour-commande',
        libelle: `retour commandé de ${cm.reference}`,
        depart: cm,
        destinations: pilotes,
      });
    }
  }

  const parId = new Map((modele.cheminements ?? []).map((ch) => [ch.id, ch]));
  const conducteurs = [];
  for (const c of projet) {
    const depart = c.depart ?? tableau;
    const empruntes = [];
    // L'arbre du conducteur : l'union des arêtes de ses chemins, clés de nœuds
    // ordonnées pour qu'une arête parcourue dans les deux sens ne compte qu'une
    // fois. Et ses extrémités : les nœuds où il part et où il arrive. C'est ce qui
    // dit OÙ il se sépare — les conduits seuls ne le disent pas.
    const arbre = new Map();
    const extremites = new Set();
    // Sous un capot, les pas parcourus : un profilé à raccordement latéral se quitte
    // en chemin, et le conducteur n'en parcourt que ce que son trajet emprunte.
    const sousCapot = new Map();
    for (const d of c.destinations) {
      const chemin = cheminEntre(graphe, modele, idCircuit, depart.position, d.position);
      if (!chemin) return null;
      for (const id of chemin.cheminements) if (!empruntes.includes(id)) empruntes.push(id);
      extremites.add(chemin.depart.cle);
      extremites.add(chemin.arrivee.cle);
      for (const p of chemin.pas) {
        const [x, y] = [p.de.cle, p.vers.cle].sort();
        arbre.set(`${x}|${y}`, { a: x, b: y });
        if (parId.get(p.arete.cheminement)?.raccordement === 'lateral') {
          sousCapot.set(`${x}|${y}`, Math.hypot(p.vers.point.x - p.de.point.x, p.vers.point.y - p.de.point.y, p.vers.point.z - p.de.point.z));
        }
      }
    }
    conducteurs.push({
      role: c.role,
      libelle: c.libelle,
      cheminements: empruntes,
      arbre: [...arbre.values()],
      extremites: [...extremites],
      // Les APPAREILS où il part et où il arrive : ce sont eux, et non les nœuds du
      // graphe, que l'on montre au bout d'un trajet. Une commande logée dans un
      // boîtier est raccordée au nœud de ce boîtier, mais c'est elle l'extrémité.
      appareils: [...new Set([depart.id, ...c.destinations.map((d) => d.id)])],
      // Une fois par conduit, et sur la longueur du conduit : c'est la grandeur
      // qui s'achète, et elle ne se confond pas avec la distance parcourue par le
      // graphe, qui recale les extrémités sur le centre des boîtes.
      //
      // Un profilé à capot fait exception : on en sort par une face, en chemin, et
      // le compter entier porterait les 6,00 m de GL-02 sur un conducteur qui en
      // parcourt 1,90 m. Il compte pour ce que le trajet y parcourt.
      longueur: empruntes
        .filter((id) => parId.get(id)?.raccordement !== 'lateral')
        .reduce((t, id) => t + longueurCheminement(parId.get(id)), 0)
        + [...sousCapot.values()].reduce((t, l) => t + l, 0),
    });
  }
  return conducteurs;
}

/**
 * Ce que chaque conduit porte réellement, circuit par circuit.
 *
 * Une ligne `majore` signale que le circuit n'a pas pu être dérivé et que le
 * nombre rendu est celui qu'il déclare — une borne, à annoncer comme telle.
 */
export function occupationParCheminement(modele, graphe = construireGraphe(modele)) {
  const parCircuit = new Map();
  for (const circuit of modele.circuits ?? []) {
    parCircuit.set(circuit.id, conducteursDuCircuit(graphe, modele, circuit.id));
  }

  const occupation = new Map();
  for (const ch of modele.cheminements ?? []) {
    const lignes = [];
    for (const id of ch.circuits ?? []) {
      const circuit = (modele.circuits ?? []).find((c) => c.id === id) ?? { id };
      const derive = parCircuit.get(id);
      if (derive) {
        const siens = derive.filter((c) => c.cheminements.includes(ch.id));
        lignes.push({
          circuit: id,
          libelle: circuit.libelle ?? id,
          nombre: siens.length,
          majore: false,
          roles: siens.map((c) => c.role).sort((a, b) => RANG.get(a) - RANG.get(b)),
          detail: null,
        });
      } else {
        lignes.push({
          circuit: id,
          libelle: circuit.libelle ?? id,
          nombre: typeof circuit.conducteurs === 'number' ? circuit.conducteurs : null,
          majore: true,
          roles: null,
          detail: circuit.detailConducteurs ?? null,
        });
      }
    }
    const inconnu = lignes.some((l) => l.nombre === null);
    occupation.set(ch.id, {
      parCircuit: lignes,
      total: inconnu ? null : lignes.reduce((n, l) => n + l.nombre, 0),
      majore: lignes.some((l) => l.majore),
    });
  }
  return occupation;
}

/**
 * Le métré des conducteurs, circuit par circuit.
 *
 * C'est ici que se joue l'écart relevé le 2026-09-22 : `n × longueur de tracé`
 * surestimait le 1,5 mm² de 57 %, parce qu'il portait les cinq conducteurs du cas
 * le plus chargé sur la totalité du tracé. Ce n'est plus de la réserve.
 */
export function longueurParConducteur(modele, graphe = construireGraphe(modele)) {
  const par = new Map();
  for (const circuit of modele.circuits ?? []) {
    const derive = conducteursDuCircuit(graphe, modele, circuit.id);
    if (derive) {
      par.set(circuit.id, {
        total: derive.reduce((t, c) => t + c.longueur, 0),
        majore: false,
        detail: derive.map((c) => ({ role: c.role, libelle: c.libelle, longueur: c.longueur })),
      });
      continue;
    }
    const trace = (modele.cheminements ?? [])
      .filter((ch) => (ch.circuits ?? []).includes(circuit.id))
      .reduce((t, ch) => t + longueurCheminement(ch), 0);
    par.set(circuit.id, {
      total: typeof circuit.conducteurs === 'number' ? circuit.conducteurs * trace : null,
      majore: true,
      detail: null,
    });
  }
  return par;
}

/**
 * La longueur du conducteur de **phase** jusqu'à un point, qui n'est pas celle du
 * conduit : pour un point commuté depuis une commande, la phase descend d'abord à
 * l'interrupteur, et c'est le retour commandé qui remonte jusqu'au point.
 *
 * Quatre formes, une par topologie :
 *
 *  - commuté depuis une commande : `L(tableau → commande) + L(commande → point)` ;
 *  - commuté par un **module** : `L(tableau → module) + L(module → point)`, la
 *    commande ne recevant qu'un ordre ;
 *  - commuté **sur place** : `L(tableau → point) + 2 × L(point → commande)`, la
 *    phase faisant l'aller-retour jusqu'au détecteur ;
 *  - non piloté : la longueur du conduit, sans détour.
 *
 * C'est la donnée qui manquait au § 2.3 de la note d'éclairage pour rebaser la
 * chute de tension sur `ρ·I·(L_phase + L_neutre)/S`.
 */
export function cheminDePhase(graphe, modele, idCircuit, idPoint) {
  const point = (modele.composants ?? []).find((c) => c.id === idPoint);
  const tableau = (modele.composants ?? []).find((c) => c.type === 'tableau');
  if (!point || !tableau) return null;

  const commandes = (modele.composants ?? []).filter(
    (c) => c.circuit === idCircuit && c.type === 'commande',
  );
  const commande = commandes.find((cm) => (cm.pilote ?? []).includes(idPoint)) ?? null;

  const direct = cheminEntre(graphe, modele, idCircuit, tableau.position, point.position);
  if (!direct) return null;
  if (!commande) return { longueur: direct.longueur, neutre: direct.longueur, commande: null };

  if (commande.commutation === 'entree-module') {
    // La phase va au module, et c'est sa sortie qui rejoint le point : elle ne
    // descend plus à l'interrupteur.
    const module = (modele.composants ?? []).find((c) => c.id === commande.module);
    if (!module) return null;
    const amont = cheminEntre(graphe, modele, idCircuit, tableau.position, module.position);
    const aval = cheminEntre(graphe, modele, idCircuit, module.position, point.position);
    if (!amont || !aval) return null;
    return {
      longueur: amont.longueur + aval.longueur,
      neutre: direct.longueur,
      commande: commande.reference,
      module: module.reference,
      jusquAuModule: amont.longueur,
      surPlace: false,
    };
  }

  if (commande.commutation === 'sur-place') {
    const liaison = cheminEntre(graphe, modele, idCircuit, point.position, commande.position);
    if (!liaison) return null;
    return {
      longueur: direct.longueur + 2 * liaison.longueur,
      neutre: direct.longueur,
      commande: commande.reference,
      surPlace: true,
    };
  }

  const amont = cheminEntre(graphe, modele, idCircuit, tableau.position, commande.position);
  const aval = cheminEntre(graphe, modele, idCircuit, commande.position, point.position);
  if (!amont || !aval) return null;
  return {
    longueur: amont.longueur + aval.longueur,
    neutre: direct.longueur,
    commande: commande.reference,
    jusquALaCommande: amont.longueur,
    surPlace: false,
  };
}
