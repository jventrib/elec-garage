/**
 * Fiche d'un composant (FR-006, FR-007) et provenance de la maquette (FR-009).
 *
 * `caracteristiques` est une fonction pure : c'est elle qui garantit qu'une valeur
 * absente ressort comme inconnue et jamais comblée. Elle est testée à part, sans
 * navigateur.
 */

import { longueurCheminement } from '../geometrie/cheminement.js';
import { COTES_DE_FORME, sectionArretee } from '../geometrie/section.js';
import { ROLES } from '../geometrie/conducteurs.js';

export const INCONNU = 'inconnu';

const arrondi2 = (v) => Math.round(v * 100) / 100;

/** Les conduits se désignent en millimètres, jamais en mètres. */
const enMillimetres = (v) => (v === null || v === undefined ? v : Math.round(v * 1000));

/** Rend une valeur, ou la déclare inconnue. Ne fabrique jamais de valeur de repli. */
function valeur(v, suffixe = '') {
  if (v === null || v === undefined || v === '') return { texte: INCONNU, inconnu: true };
  return { texte: `${v}${suffixe}`, inconnu: false };
}

/**
 * Libellés et types viennent des données (data/presentation.json et
 * data/types-composants.json) : aucun vocabulaire n'est figé dans le code.
 */
/**
 * Les connecteurs d'une enveloppe de jonction, en trois lignes : le total par
 * référence, le détail circuit par circuit, et les circuits qui ne font que
 * traverser. Un connecteur sans référence se dit inconnu, et le total le dit aussi.
 */
export function lignesConnecteurs(res) {
  if (!res) return [];
  if (res.ambigu) return [{ libelle: 'Connecteurs', ...valeur(null) }];
  const inconnus = res.inconnus > 0 ? `${res.inconnus} ${INCONNU}${res.inconnus > 1 ? 's' : ''}` : null;
  const total = res.total.map((t) => `${t.nombre} × ${t.reference}`).join(', ');
  const lignes = [{
    libelle: 'Connecteurs',
    texte: [total, inconnus].filter(Boolean).join(', ') || 'aucun',
    inconnu: res.inconnus > 0,
  }];
  const detail = res.circuits
    .filter((c) => c.inconnu || c.connecteurs.length > 0)
    .map((c) => {
      if (c.inconnu) return `${c.libelle} : ${INCONNU}`;
      const k = c.connecteurs.map((x) => `${x.conducteur} ${x.references ? x.references.map((r) => r.reference).join(' + ') : INCONNU}`);
      return `${c.libelle} : ${k.join(', ')}`;
    });
  if (detail.length > 0) lignes.push({ libelle: 'dont', texte: detail.join(' · '), inconnu: res.inconnus > 0 });
  const traversants = res.circuits.filter((c) => c.traverse).map((c) => c.libelle);
  if (traversants.length > 0) lignes.push({ libelle: 'Sans connexion', texte: traversants.join(', '), inconnu: false });
  return lignes;
}

/**
 * Les trajets montrés sur la maquette, en une ligne : pour chaque circuit, sa
 * couleur et les appareils que ses conducteurs joignent. Un circuit dont le trajet
 * ne se dérive pas se dit inconnu — il n'est pas tracé.
 */
export function lignesTrajets(trajets, composants = [], couleurDe = () => null, couleurOrdreDe = () => null) {
  if (!trajets || trajets.length === 0) return [];
  const ref = new Map(composants.map((c) => [c.id, c.reference]));
  const texte = trajets
    .map((t) => {
      const couleur = couleurDe(t.circuit);
      const pastille = couleur ? `<span class="pastille" style="background:${couleur}"></span>` : '';
      const vers = t.inconnu ? `trajet ${INCONNU}` : t.appareils.map((id) => ref.get(id) ?? id).join(', ');
      // Le tracé plus foncé : les tronçons où passe un fil d'ordre du circuit.
      const foncee = couleurOrdreDe(t.circuit);
      const ordre = !t.inconnu && t.segments.some((s) => s.ordre)
        ? ` — ${foncee ? `<span class="pastille" style="background:${foncee}"></span>` : ''}foncé : fil d'ordre`
        : '';
      return `${pastille}${t.libelle} : ${vers}${ordre}`;
    })
    .join('<br>');
  return [{ libelle: 'Trajets', texte, inconnu: trajets.some((t) => t.inconnu) }];
}

export function caracteristiques(composant, circuits = [], vocabulaire = {}, connecteurs = null) {
  const circuit = circuits.find((c) => c.id === composant.circuit);
  const libellesParois = vocabulaire.parois ?? {};
  const libellesFaces = vocabulaire.faces ?? {};
  const libellesZonesTablier = vocabulaire.zonesTablier ?? {};
  const types = vocabulaire.types ?? [];
  const typeLisible = types.find((t) => t.id === composant.type)?.libelle ?? composant.type;
  const role = types.find((t) => t.id === composant.type)?.role;
  return [
    { libelle: 'Référence', ...valeur(composant.reference) },
    { libelle: 'Type', ...valeur(typeLisible) },
    { libelle: 'Paroi', ...valeur(libellesParois[composant.paroi] ?? composant.paroi) },
    { libelle: 'Face', ...valeur(libellesFaces[composant.face] ?? composant.face) },
    { libelle: "Hauteur d'axe", ...valeur(composant.hauteurAxe, ' m') },
    { libelle: 'Indice de protection', ...valeur(composant.indiceProtection) },
    // Le dégagement d'une zone de travail se RELÈVE, il ne se calcule pas : rien
    // dans la géométrie ne peut le dire à la place d'un relevé. Il n'a donc rien à
    // faire dans le contrat de géométrie — mais il doit se voir ici, sinon il est
    // une information que personne ne lit et que personne ne maintient.
    ...(composant.zoneTablier
      ? [{ libelle: 'Zone de travail', ...valeur(libellesZonesTablier[composant.zoneTablier] ?? composant.zoneTablier) }]
      : []),
    { libelle: 'Circuit', ...valeur(circuit ? circuit.libelle : composant.circuit) },
    // Une enceinte qui déclare un volume le montre : c'est ce qui distingue une
    // goulotte d'une boîte, et le seul endroit où la maquette peut le dire.
    ...(composant.dimensions
      ? [{
          libelle: 'Encombrement',
          ...valeur(
            `${enMillimetres(composant.dimensions.largeur)} × ${enMillimetres(composant.dimensions.hauteur)} × ${enMillimetres(composant.dimensions.profondeur)} mm`,
          ),
        },
        { libelle: 'Entrées de conduit', ...valeur(composant.entrees ?? null) }]
      : []),
    // La contiguïté déclarée : une continuité sans conduit, qui ne se voit nulle
    // part ailleurs. Ne pas l'afficher la rendrait invérifiable à l'œil.
    ...(composant.contigu
      ? [{ libelle: 'Contigu à', ...valeur(composant.contigu.join(', ')) }]
      : []),
    ...lignesConnecteurs(connecteurs),
    // Un accessoire de conduit se reconnaît à ce qu'on N'Y FAIT PAS : l'ouvrir pour
    // y chercher des bornes, ou y vérifier une consignation. La fiche le dit.
    ...(role === 'accessoire'
      ? [{ libelle: 'Connexions', ...valeur('aucune — accessoire de conduit, rien ne s’y connecte') }]
      : []),
    { libelle: 'Apporté par', ...valeur(composant.apport) },
  ];
}

/** « 1 phase, 1 neutre, 1 PE, 2 retours commandés » — dans l'ordre des rôles. */
export function repartitionParRole(roles) {
  if (!roles || roles.length === 0) return null;
  return ROLES.filter((r) => roles.includes(r.role))
    .map((r) => {
      const n = roles.filter((x) => x === r.role).length;
      return `${n} ${n > 1 ? r.pluriel : r.singulier}`;
    })
    .join(', ');
}

/**
 * Ce qu'un tube contient, et la condition de remplissage qui en découle.
 *
 * Le décompte ne vivait que dans la note de calcul, en prose — donc là où
 * personne ne le lit au moment de tirer.
 *
 * Il ne se lisait, jusqu'au 2026-09-22, que sur le nombre **déclaré** par chaque
 * circuit, appliqué uniformément à tous ses conduits. C'était une **borne**
 * présentée comme un décompte, et la question « pourquoi huit conducteurs dans
 * CH-07 ? » n'avait pas de bonne réponse : il y en a six. Depuis que le pilotage
 * est déclaré, `occupation` porte le trajet réel de chaque conducteur, et la
 * fiche montre ce que le tube porte vraiment.
 *
 * Le nombre déclaré reste exigé — il devient le **garde-fou** du chiffre dérivé,
 * et le repli quand la dérivation n'est pas possible. Dans ce repli, `majore` est
 * vrai et l'affichage doit dire « au plus » : un majorant qui se donne pour un
 * décompte est exactement ce que le Principe VI interdit.
 *
 * La condition `D ≥ d·√(3n)` est **exacte** — c'est la règle du tiers écrite sans
 * approximation — et elle ne dépend d'aucune table : deux cotes de fiche produit
 * suffisent à la trancher.
 */
export function conducteursDe(cheminement, circuits = [], occupation = null) {
  const portes = (cheminement.circuits ?? []).map((id) => circuits.find((c) => c.id === id) ?? { id });
  const connus = portes.filter((c) => typeof c.conducteurs === 'number');
  if (connus.length === 0 || connus.length !== portes.length) return null;

  const derive = occupation?.get?.(cheminement.id) ?? null;
  const parCircuit = connus.map((c) => {
    const ligne = derive?.parCircuit.find((l) => l.circuit === c.id) ?? null;
    const majore = !ligne || ligne.majore || ligne.nombre === null;
    return {
      libelle: c.libelle ?? c.id,
      nombre: majore ? c.conducteurs : ligne.nombre,
      majore,
      roles: majore ? null : repartitionParRole(ligne.roles),
      detail: c.detailConducteurs ?? null,
    };
  });
  const total = parCircuit.reduce((n, c) => n + c.nombre, 0);
  // Un câble entre dans un tube comme UN objet : la règle du tiers porte alors sur
  // son diamètre extérieur d'ensemble, et non sur ses conducteurs. La compter
  // conducteur par conducteur donnerait une condition exacte d'apparence, et fausse.
  const cables = connus.filter((c) => c.cable);
  const objets = parCircuit.reduce((n, c, i) => n + (connus[i].cable ? 1 : c.nombre), 0);
  return {
    total,
    majore: parCircuit.some((c) => c.majore),
    parCircuit,
    objets,
    cables: cables.map((c) => c.cable),
    facteur: Math.sqrt(3 * objets),
  };
}

/**
 * Caractéristiques d'un cheminement. Le diamètre vaut « inconnu » tant que la note
 * de calcul ne l'a pas arrêté — et jamais le diamètre conventionnel employé pour
 * le dessiner. Le dessin est une convention, la donnée reste déclarée absente.
 */
const LIBELLE_COTE = { diametre: 'Diamètre', largeur: 'Largeur', profondeur: 'Profondeur' };

export function caracteristiquesCheminement(cheminement, circuits = [], occupation = null) {
  const portes = (cheminement.circuits ?? [])
    .map((id) => circuits.find((c) => c.id === id)?.libelle ?? id)
    .join(', ');
  const groupement = (cheminement.circuits ?? []).length > 1;
  const fils = conducteursDe(cheminement, circuits, occupation);
  // La répartition nomme désormais les RÔLES, et plus seulement les circuits :
  // savoir qu'un tube porte trois fils de l'éclairage n'apprend rien tant qu'on
  // ignore lequel est la phase et lequel un retour — c'est pourtant ce qui décide
  // de ce qu'on trouve en ouvrant la boîte.
  const nommer = (c) =>
    `${c.nombre}${c.majore ? ' au plus' : ''} pour ${c.libelle}${c.roles ? ` (${c.roles})` : ''}`;
  const repartition = fils ? fils.parCircuit.map(nommer).join(' + ') : null;
  const seul = fils && fils.parCircuit.length === 1 ? fils.parCircuit[0] : null;
  return [
    { libelle: 'Référence', ...valeur(cheminement.reference) },
    { libelle: 'Circuits portés', ...valeur(portes) },
    // Un majorant se dit « au plus ». La fiche ne présente jamais une borne
    // comme un décompte — même faute que celle des volumes et des diamètres.
    { libelle: 'Conducteurs', ...valeur(fils ? `${fils.total}${fils.majore ? ' au plus' : ''}` : null) },
    // La répartition n'est utile que si le tube en porte plusieurs jeux ; sur un
    // conduit dédié, la répéter n'apprendrait rien.
    ...(fils && fils.parCircuit.length > 1 ? [{ libelle: 'dont', ...valeur(repartition) }] : []),
    // Sur un conduit dédié, ce qui est utile est QUELS fils. Les rôles dérivés le
    // disent pour ce tube-là ; le détail déclaré par le circuit ne sert que de
    // repli, et il vaut alors pour le cas le plus chargé, non pour ce conduit.
    ...(seul && (seul.roles || seul.detail)
      ? [{ libelle: 'soit', ...valeur(seul.roles ?? seul.detail) }]
      : []),
    {
      libelle: 'Remplissage exigé',
      ...valeur(
        fils
          ? fils.cables.length > 0 && fils.objets === fils.cables.length
            ? `D ≥ d × ${arrondi2(fils.facteur)}  (règle du tiers, n = ${fils.objets} — d est le diamètre du câble ${fils.cables.join(', ')})`
            : `D ≥ d × ${arrondi2(fils.facteur)}  (règle du tiers, n = ${fils.objets})`
          : null,
      ),
    },
    { libelle: 'Groupement', ...valeur(groupement ? 'oui — facteur de correction à appliquer' : 'non') },
    // Les cotes de la section, dans l'ordre que sa forme impose. Une goulotte
    // porte deux lignes — largeur et profondeur —, un conduit une seule.
    ...(COTES_DE_FORME[cheminement.section?.forme] ?? []).map((cote) => ({
      libelle: LIBELLE_COTE[cote],
      ...valeur(enMillimetres(cheminement.section?.[cote] ?? null), ' mm'),
    })),
    // Un majorant se lit sur ses propres lignes. Le porter sur celles de la cote
    // ferait passer une borne pour une cote arrêtée, ce que le Principe VI
    // interdit — et ce serait la même faute que celle relevée sur les volumes.
    //
    // Elles n'apparaissent que si la section N'EST PAS arrêtée : les deux étant
    // exclusifs, afficher « majorant : inconnu » sous une cote connue laisserait
    // croire qu'il manque quelque chose.
    ...(sectionArretee(cheminement.section)
      ? []
      : (COTES_DE_FORME[cheminement.section?.forme] ?? []).map((cote) => ({
          libelle: `${LIBELLE_COTE[cote]} majorant`,
          ...valeur(enMillimetres(cheminement.section?.majorant?.[cote] ?? null), ' mm au plus'),
        }))),
    { libelle: 'Longueur', ...valeur(arrondi2(longueurCheminement(cheminement)), ' m') },
    { libelle: 'Segments', ...valeur((cheminement.segments ?? []).length) },
    { libelle: 'Apporté par', ...valeur(cheminement.apport) },
  ];
}

export function caracteristiquesTraversee(traversee, vocabulaire = {}) {
  const parois = vocabulaire.parois ?? {};
  return [
    { libelle: 'Référence', ...valeur(traversee.reference) },
    { libelle: 'Paroi traversée', ...valeur(parois[traversee.paroi] ?? traversee.paroi) },
    { libelle: 'Sens', ...valeur(traversee.sens === 'interieur-vers-exterieur' ? "de l'intérieur vers l'extérieur" : "de l'extérieur vers l'intérieur") },
    { libelle: 'Pente vers l’extérieur', ...valeur(traversee.penteVersExterieur ? 'oui' : 'non') },
    // Le DÉNIVELÉ, et non plus le seul sens. Un sens se vérifie après coup, à
    // l'eau ; une cote se perce. La ligne dit « inconnu » tant qu'elle n'est pas
    // établie — c'est la seule chose qui empêche de la croire nulle.
    { libelle: 'Dénivelé de perçage', ...valeur(enMillimetres(traversee.denivele ?? null), ' mm') },
    {
      libelle: 'Entrée / sortie',
      ...valeur(
        typeof traversee.denivele === 'number' && traversee.denivele > 0
          ? `axe ± ${enMillimetres(traversee.denivele / 2)} mm`
          : null,
      ),
    },
    { libelle: 'Apporté par', ...valeur(traversee.apport) },
  ];
}

/** Une étendue se lit en mètres, bornes comprises, ou se déclare inconnue. */
function etendue(volume) {
  if (!volume) return valeur(null);
  const b = (p) => `${arrondi2(p.x)} / ${arrondi2(p.y)} / ${arrondi2(p.z)}`;
  return valeur(`${b(volume.min)} → ${b(volume.max)}`);
}

/**
 * Caractéristiques d'un obstacle, et surtout **ce qui n'en est pas connu**.
 *
 * C'est la fiche qui manquait : les obstacles n'étaient pas sélectionnables, et
 * leurs réserves s'entassaient donc dans un bandeau permanent au-dessus de la
 * maquette. Chaque réserve se lit maintenant sur l'objet qu'elle concerne.
 *
 * `controles` est le bilan des contrôles de collision le concernant. Il dit ce
 * que le dossier peut conclure à son sujet, ce qui est la question utile devant
 * un obstacle dont la cote manque.
 */
export function caracteristiquesObstacle(obstacle, incertitude = null, vocabulaire = {}, controles = null) {
  const etats = vocabulaire.etatsObstacle ?? {};
  const rendus = vocabulaire.rendus ?? {};
  const cle = obstacle.volume && !obstacle.incertain ? 'releve' : incertitude?.borne ? 'borne' : 'inconnu';
  const releve = cle === 'releve';
  const lignes = [
    { libelle: 'État de la cote', ...valeur(etats[cle] ?? cle) },
    // Le libellé suit l'état : pour un obstacle borné, la raison ne dit pas ce qui
    // manque mais ce qui le borne. Coller une étiquette qui ne correspond pas au
    // contenu est le genre de petite fausseté qui finit par décrédibiliser le reste.
    {
      libelle: cle === 'borne' ? 'Borné par' : 'Ce qui manque',
      ...valeur(releve ? 'rien' : (incertitude?.raison ?? null)),
    },
    { libelle: 'Dessiné', ...valeur(releve ? 'volume relevé' : (rendus[incertitude?.rendu] ?? null)) },
    { libelle: "Position de l'ouvrant", ...valeur(obstacle.etat) },
    { libelle: 'Baie de rattachement', ...valeur(obstacle.baie ?? null) },
    { libelle: 'Étendue relevée', ...etendue(obstacle.volume) },
    { libelle: 'Majorant déduit', ...etendue(obstacle.volumeMajorant) },
  ];
  if (controles) {
    lignes.push(
      { libelle: 'Contrôles conformes', ...valeur(controles.conforme) },
      { libelle: 'En collision', ...valeur(controles.collision) },
      { libelle: 'Sans conclusion', ...valeur(controles.nonConcluant) },
    );
  }
  return lignes;
}

export function provenanceLisible(provenance = {}) {
  return [
    { libelle: 'Schéma unifilaire', ...valeur(provenance.schemaUnifilaire) },
    { libelle: 'Note de calcul', ...valeur(provenance.noteDeCalcul) },
    { libelle: 'Relevé géométrique', ...valeur(provenance.releve) },
  ];
}

/**
 * @param element  l'élément qui reçoit la fiche
 * @param surFermeture  crochet appelé quand l'utilisateur referme. C'est le SEUL
 *   endroit où « l'utilisateur a refermé » est connu. Le deviner depuis l'appelant
 *   en observant `hidden` marcherait et serait fragile : un futur appel à `vider()`
 *   ailleurs deviendrait un retour au centre silencieux et inexpliqué.
 */
export function creerFiche(element, { surFermeture = null } = {}) {
  function lignes(liste) {
    return liste
      .map(
        (l) =>
          `<div class="ligne"><span class="libelle">${l.libelle}</span>` +
          `<span class="valeur${l.inconnu ? ' inconnu' : ''}">${l.texte}</span></div>`,
      )
      .join('');
  }

  return {
    afficher(composant, circuits, provenance, vocabulaire, connecteurs = null, trajets = []) {
      element.hidden = false;
      element.innerHTML =
        `<h2>${composant.reference}</h2>${lignes([...caracteristiques(composant, circuits, vocabulaire, connecteurs), ...trajets])}` +
        `<h3>Provenance</h3>${lignes(provenanceLisible(provenance))}` +
        `<p class="avertissement">La maquette n'est pas la source normative. En cas de divergence, ` +
        `le schéma unifilaire et la note de calcul l'emportent.</p>` +
        `<button type="button" class="fermer" data-fermer>Fermer</button>`;
      element.querySelector('[data-fermer]').addEventListener('click', () => this.vider());
    },
    /** Un cheminement se consulte comme un composant. */
    afficherCheminement(cheminement, circuits, provenance, occupation, trajets = []) {
      element.hidden = false;
      element.innerHTML =
        `<h2>${cheminement.reference}</h2>` +
        `<p class="avertissement">Conduit posé en apparent.</p>` +
        lignes([...caracteristiquesCheminement(cheminement, circuits, occupation), ...trajets]) +
        `<h3>Provenance</h3>${lignes(provenanceLisible(provenance))}` +
        `<button type="button" class="fermer" data-fermer>Fermer</button>`;
      element.querySelector('[data-fermer]').addEventListener('click', () => this.vider());
    },

    /**
     * Fiche d'un obstacle. La note du relevé est reprise telle quelle quand elle
     * existe : c'est là que vit la connaissance partielle, et la perdre serait
     * perdre ce que quelqu'un a pris la peine de constater.
     */
    afficherObstacle(obstacle, incertitude, vocabulaire, controles) {
      element.hidden = false;
      const borne = incertitude?.borne === true;
      const releve = obstacle.volume && !obstacle.incertain;
      const avertissement = releve
        ? 'Volume entièrement relevé : les deux verdicts de collision sont démontrables.'
        : borne
          ? "Encombrement borné, non mesuré. S'en tenir à l'écart du majorant prouve le dégagement ; le recouper ne prouve rien, l'obstacle réel y étant contenu."
          : "Encombrement non relevé. Aucun contrôle de collision ne peut conclure favorablement sur ce volume : « non concluant » n'est pas « conforme ».";
      element.innerHTML =
        `<h2>${obstacle.libelle ?? obstacle.id}</h2>` +
        `<p class="avertissement">${avertissement}</p>` +
        lignes(caracteristiquesObstacle(obstacle, incertitude, vocabulaire, controles)) +
        (obstacle.note ? `<h3>Note du relevé</h3><p class="avertissement">${obstacle.note}</p>` : '') +
        `<button type="button" class="fermer" data-fermer>Fermer</button>`;
      element.querySelector('[data-fermer]').addEventListener('click', () => this.vider());
    },

    /** Le récapitulatif de toutes les cotes manquantes, à la demande. */
    afficherIncertitudes(detail) {
      element.hidden = false;
      element.innerHTML =
        `<h2>Cotes manquantes</h2>${detail}` +
        `<p class="avertissement">Cliquer un obstacle dans la maquette ouvre sa fiche.</p>` +
        `<button type="button" class="fermer" data-fermer>Fermer</button>`;
      element.querySelector('[data-fermer]').addEventListener('click', () => this.vider());
    },

    afficherTraversee(traversee, provenance, vocabulaire, trajets = []) {
      element.hidden = false;
      element.innerHTML =
        `<h2>${traversee.reference}</h2>` +
        `<p class="avertissement">Traversée de paroi, 0,20 m de béton.</p>` +
        lignes([...caracteristiquesTraversee(traversee, vocabulaire), ...trajets]) +
        `<h3>Provenance</h3>${lignes(provenanceLisible(provenance))}` +
        `<button type="button" class="fermer" data-fermer>Fermer</button>`;
      element.querySelector('[data-fermer]').addEventListener('click', () => this.vider());
    },

    vider() {
      const etaitOuverte = element.hidden === false;
      element.hidden = true;
      element.innerHTML = '';
      if (etaitOuverte && surFermeture) surFermeture();
    },
  };
}

/**
 * Caractéristiques d'un point de perçage.
 *
 * Trois natures, trois outils, et une seule qui exige une cote juste. La fiche
 * d'un accessoire de tirage porte déjà qu'aucune connexion ne s'y fait ; celle
 * d'un perçage porte ce qu'il faut pour le faire, et TAIT ce qui n'est pas établi
 * plutôt que de proposer une valeur courante.
 */
export function caracteristiquesPercage(percage, nature, cheville = null, gardes = []) {
  const serrees = gardes.filter((g) => g.serre);
  return [
    { libelle: 'Repère', ...valeur(percage?.reference) },
    { libelle: 'Nature', ...valeur(nature?.libelle) },
    { libelle: 'Outil', ...valeur(nature?.outil) },
    { libelle: 'Diamètre de perçage', ...valeur(enMillimetres(cheville?.diametre ?? null), ' mm') },
    { libelle: 'Profondeur', ...valeur(enMillimetres(cheville?.profondeur ?? null), ' mm') },
    {
      libelle: 'Gardes serrées',
      ...valeur(
        serrees.length
          ? serrees.map((g) => `${g.quoi} à ${Math.round(g.distance * 1000)} mm`).join(' ; ')
          : gardes.length
            ? 'aucune'
            : null,
      ),
    },
  ];
}
