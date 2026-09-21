/**
 * Contrôles de cohérence (FR-026). Tant qu'un seul échoue, la séquence n'est pas
 * présentée comme utilisable au chantier (FR-027).
 *
 * Les contrôles structurels sont écrits à la main, en miroir des schémas de
 * specs/001-visualisation-3d/contracts/, pour ne pas introduire de dépendance.
 * Toute évolution d'un schéma doit être répercutée ici.
 */

import { phases, naturesEtape, verifications, verificationsExigees, rangPhase, libelleDe } from '../sequence/phases.js';
import { segmentBaie, sortieDeTraversee } from './chargement.js';
import { estOrthogonal, appuiSurFace, extremites } from '../geometrie/cheminement.js';
import { construireGraphe, atteignablesDepuisTableau } from '../geometrie/graphe.js';

const PAROIS = ['sud', 'nord', 'est', 'ouest'];
const PAROIS_COMPOSANT = [...PAROIS, 'plafond'];
const FACES = ['interieur', 'exterieur'];
const CLES_RELEVE = ['oeuvre', 'epaisseurParois', 'hauteurSousPlafond', 'repere', 'baies', 'obstacles'];

const defaut = (regle, cible, message) => ({ regle, cible, message });

const estTexte = (v) => typeof v === 'string' && v.length > 0;
const estNombre = (v) => typeof v === 'number' && Number.isFinite(v);
const estNombreOuNul = (v) => v === null || estNombre(v);
const estTexteOuNul = (v) => v === null || estTexte(v);

/* ------------------------------------------------------------------ */
/* Contrôles structurels                                               */
/* ------------------------------------------------------------------ */

export function validerLocal(local) {
  const d = [];
  if (!local || typeof local !== 'object') return [defaut('STRUCT', 'local', 'Relevé absent.')];
  if (!local.oeuvre || !estNombre(local.oeuvre.x) || !estNombre(local.oeuvre.y))
    d.push(defaut('STRUCT', 'local.oeuvre', 'oeuvre.x et oeuvre.y doivent être des nombres.'));
  if (!estNombre(local.hauteurSousPlafond) || local.hauteurSousPlafond <= 0)
    d.push(defaut('STRUCT', 'local.hauteurSousPlafond', 'Hauteur sous plafond absente ou non positive.'));
  if (!estNombre(local.epaisseurParois) || local.epaisseurParois <= 0)
    d.push(defaut('STRUCT', 'local.epaisseurParois', 'Épaisseur des parois absente ou non positive.'));
  if (!local.repere || local.repere.origine !== 'angle-sud-ouest-interieur-sol-fini')
    d.push(defaut('STRUCT', 'local.repere', "Le repère doit être celui fixé par la constitution."));
  if (!local.provenance || !('schemaUnifilaire' in local.provenance) || !('noteDeCalcul' in local.provenance))
    d.push(defaut('STRUCT', 'local.provenance', 'Le bloc provenance est obligatoire (FR-009).'));

  const ids = new Set();
  for (const b of local.baies ?? []) {
    if (!estTexte(b.id)) d.push(defaut('STRUCT', 'baie', 'Baie sans identifiant.'));
    if (ids.has(b.id)) d.push(defaut('STRUCT', b.id, 'Identifiant de baie en double.'));
    ids.add(b.id);
    if (!PAROIS.includes(b.paroi)) d.push(defaut('STRUCT', b.id, `Paroi inconnue : ${b.paroi}.`));
    if (!estNombre(b.debut) || b.debut < 0) d.push(defaut('STRUCT', b.id, 'debut absent ou négatif.'));
    if (!estNombre(b.largeur) || b.largeur <= 0) d.push(defaut('STRUCT', b.id, 'largeur absente ou non positive.'));
    if (!estNombreOuNul(b.hauteur)) d.push(defaut('STRUCT', b.id, 'hauteur doit être un nombre ou null.'));
    if (typeof b.incertain !== 'boolean') d.push(defaut('STRUCT', b.id, 'incertain doit être un booléen.'));
    if (estNombre(b.debut) && estNombre(b.largeur) && local.oeuvre && segmentBaie(local, b).deborde)
      d.push(defaut('STRUCT', b.id, 'La baie déborde de sa paroi.'));
  }
  for (const o of local.obstacles ?? []) {
    if (!estTexte(o.id)) d.push(defaut('STRUCT', 'obstacle', 'Obstacle sans identifiant.'));
    // Le rattachement à une baie est facultatif : un obstacle sans baie décrit un
    // volume libre du local, comme le gabarit de manœuvre du véhicule.
    if (o.baie !== undefined && !ids.has(o.baie))
      d.push(defaut('STRUCT', o.id, `L'obstacle vise la baie « ${o.baie} », inconnue.`));
    if (!['ouvert', 'ferme'].includes(o.etat)) d.push(defaut('STRUCT', o.id, `État inconnu : ${o.etat}.`));
    if (typeof o.incertain !== 'boolean') d.push(defaut('STRUCT', o.id, 'incertain doit être un booléen.'));
  }
  return d;
}

export function validerApport(apport, socle) {
  const d = [];
  const chantier = socle.chantier;
  const typesConnus = socle.types.types.map((t) => t.id);
  if (!apport || typeof apport !== 'object') return [defaut('STRUCT', 'apport', 'Apport absent.')];
  if (!/^[0-9]{3}-[a-z0-9-]+$/.test(apport.fonctionnalite ?? ''))
    d.push(defaut('STRUCT', 'fonctionnalite', `Nom de fonctionnalité invalide : ${apport.fonctionnalite}.`));
  if (!apport.provenance) d.push(defaut('STRUCT', 'provenance', 'Le bloc provenance est obligatoire (FR-009).'));

  for (const c of apport.composants ?? []) {
    const ou = c.id ?? '(sans id)';
    if (!estTexte(c.id)) d.push(defaut('STRUCT', ou, 'Composant sans identifiant.'));
    if (!estTexte(c.reference)) d.push(defaut('STRUCT', ou, 'Composant sans référence.'));
    if (!estTexte(c.type)) d.push(defaut('STRUCT', ou, 'Composant sans type.'));
    else if (!typesConnus.includes(c.type))
      d.push(defaut('STRUCT', ou, `Type « ${c.type} » absent du catalogue data/types-composants.json.`));
    if (!PAROIS_COMPOSANT.includes(c.paroi)) d.push(defaut('STRUCT', ou, `Paroi inconnue : ${c.paroi}.`));
    if (!FACES.includes(c.face)) d.push(defaut('STRUCT', ou, `Face inconnue : ${c.face}.`));
    if (!c.position || !estNombre(c.position.x) || !estNombre(c.position.y) || !estNombre(c.position.z))
      d.push(defaut('STRUCT', ou, 'Position incomplète.'));
    if (!estNombreOuNul(c.hauteurAxe)) d.push(defaut('STRUCT', ou, 'hauteurAxe doit être un nombre ou null.'));
    if (!estTexteOuNul(c.indiceProtection)) d.push(defaut('STRUCT', ou, 'indiceProtection doit être un texte ou null.'));
    if (!estTexteOuNul(c.circuit)) d.push(defaut('STRUCT', ou, 'circuit doit être un texte ou null.'));
  }
  for (const e of apport.etapes ?? []) {
    const ou = e.id ?? '(sans id)';
    if (!estTexte(e.id)) d.push(defaut('STRUCT', ou, 'Étape sans identifiant.'));
    if (!phases(chantier).includes(e.phase)) d.push(defaut('STRUCT', ou, `Phase inconnue : ${e.phase}.`));
    if (!naturesEtape(chantier).includes(e.nature)) d.push(defaut('STRUCT', ou, `Nature inconnue : ${e.nature}.`));
    if (typeof e.sousTension !== 'boolean') d.push(defaut('STRUCT', ou, 'sousTension doit être un booléen.'));
    if (!Array.isArray(e.composants)) d.push(defaut('STRUCT', ou, 'composants doit être une liste.'));
    if (!Array.isArray(e.cheminements)) d.push(defaut('STRUCT', ou, 'cheminements doit être une liste.'));
    if (!Array.isArray(e.traversees)) d.push(defaut('STRUCT', ou, 'traversees doit être une liste.'));
    if (!Array.isArray(e.materiel)) d.push(defaut('STRUCT', ou, 'materiel doit être une liste.'));
    if (!Array.isArray(e.dependances)) d.push(defaut('STRUCT', ou, 'dependances doit être une liste.'));
    if (e.nature === 'verification') {
      if (!estTexte(e.verification))
        d.push(defaut('STRUCT', ou, "Une étape de vérification doit déclarer laquelle elle réalise."));
      else if (!verifications(chantier).includes(e.verification))
        d.push(defaut('STRUCT', ou, `Vérification « ${e.verification} » absente du catalogue.`));
    }
  }

  for (const ch of apport.cheminements ?? []) {
    const ou = ch.id ?? '(sans id)';
    if (!estTexte(ch.id)) d.push(defaut('STRUCT', ou, 'Cheminement sans identifiant.'));
    if (!estTexte(ch.reference)) d.push(defaut('STRUCT', ou, 'Cheminement sans référence.'));
    if (!Array.isArray(ch.circuits) || ch.circuits.length === 0)
      d.push(defaut('STRUCT', ou, 'Un cheminement doit déclarer au moins un circuit porté.'));
    if (!estNombreOuNul(ch.diametre)) d.push(defaut('STRUCT', ou, 'diametre doit être un nombre ou null.'));
    if (!Array.isArray(ch.segments) || ch.segments.length === 0) {
      d.push(defaut('STRUCT', ou, 'Un cheminement doit comporter au moins un segment.'));
      continue;
    }
    for (const [i, seg] of ch.segments.entries()) {
      if (!PAROIS_COMPOSANT.includes(seg.face))
        d.push(defaut('STRUCT', ou, `Segment ${i + 1} : face inconnue « ${seg.face} ».`));
      for (const bout of ['de', 'a']) {
        const pt = seg[bout];
        if (!pt || !estNombre(pt.x) || !estNombre(pt.y) || !estNombre(pt.z))
          d.push(defaut('STRUCT', ou, `Segment ${i + 1} : extrémité « ${bout} » incomplète.`));
      }
    }
  }

  for (const t of apport.traversees ?? []) {
    const ou = t.id ?? '(sans id)';
    if (!estTexte(t.id)) d.push(defaut('STRUCT', ou, 'Traversée sans identifiant.'));
    if (!estTexte(t.reference)) d.push(defaut('STRUCT', ou, 'Traversée sans référence.'));
    if (!PAROIS.includes(t.paroi)) d.push(defaut('STRUCT', ou, `Paroi inconnue : ${t.paroi}.`));
    if (!t.position || !estNombre(t.position.x) || !estNombre(t.position.y) || !estNombre(t.position.z))
      d.push(defaut('STRUCT', ou, 'Position de traversée incomplète.'));
    if (!['interieur-vers-exterieur', 'exterieur-vers-interieur'].includes(t.sens))
      d.push(defaut('STRUCT', ou, `Sens inconnu : ${t.sens}.`));
    if (typeof t.penteVersExterieur !== 'boolean')
      d.push(defaut('STRUCT', ou, 'penteVersExterieur doit être un booléen.'));
  }

  // V12 — aucune cote du relevé ne doit réapparaître dans un apport.
  const cherche = (valeur, chemin = '') => {
    if (!valeur || typeof valeur !== 'object') return;
    for (const [cle, sous] of Object.entries(valeur)) {
      if (CLES_RELEVE.includes(cle))
        d.push(defaut('V12', `${chemin}${cle}`, `« ${cle} » appartient au relevé et ne doit pas figurer dans un apport.`));
      cherche(sous, `${chemin}${cle}.`);
    }
  };
  cherche(apport);
  return d;
}

/* ------------------------------------------------------------------ */
/* Contrôles de cohérence V1 à V12                                     */
/* ------------------------------------------------------------------ */

export function validerModele(modele, sequence) {
  const d = [];
  const etapes = sequence.etapes;
  const composantsParId = new Map(modele.composants.map((c) => [c.id, c]));

  // V1 — instruction non vide
  for (const e of etapes) {
    if (!estTexte(e.instruction)) d.push(defaut('V1', e.id, `L'étape « ${e.id} » n'a pas d'instruction.`));
  }

  // V2 — toute référence d'étape désigne un objet existant
  const cheminementsParId = new Map((modele.cheminements ?? []).map((c) => [c.id, c]));
  const traverseesParId = new Map((modele.traversees ?? []).map((t) => [t.id, t]));
  const registres = {
    composants: [composantsParId, 'composant'],
    cheminements: [cheminementsParId, 'cheminement'],
    traversees: [traverseesParId, 'traversée'],
  };
  for (const e of etapes) {
    for (const [genre, [registre, libelle]] of Object.entries(registres)) {
      for (const id of e[genre] ?? []) {
        if (!registre.has(id))
          d.push(defaut('V2', e.id, `L'étape « ${e.id} » référence le ${libelle} « ${id} », absent de la maquette.`));
      }
    }
  }

  // V3 — tout objet posable est posé par au moins une étape, qu'il s'agisse d'un
  // socle ou de quinze mètres de conduit.
  const poses = new Set();
  for (const e of etapes) {
    if (e.nature !== 'pose') continue;
    for (const genre of ['composants', 'cheminements', 'traversees']) {
      for (const id of e[genre] ?? []) poses.add(id);
    }
  }
  const aPoser = [
    ...modele.composants.map((c) => [c, 'Le composant']),
    ...(modele.cheminements ?? []).map((c) => [c, 'Le cheminement']),
    ...(modele.traversees ?? []).map((t) => [t, 'La traversée']),
  ];
  for (const [objet, libelle] of aPoser) {
    if (!poses.has(objet.id))
      d.push(defaut('V3', objet.id, `${libelle} « ${objet.reference} » n'est posé par aucune étape : il ne serait jamais monté.`));
  }

  // V4 et V5 remontent de la composition de la séquence.
  d.push(...(sequence.defauts ?? []));

  // V6 — une dépendance ne doit pas contredire l'ordre des phases
  const parId = new Map(etapes.map((e) => [e.id, e]));
  for (const e of etapes) {
    for (const id of e.dependances ?? []) {
      const amont = parId.get(id);
      if (amont && rangPhase(modele.chantier, amont.phase) > rangPhase(modele.chantier, e.phase))
        d.push(
          defaut('V6', e.id, `« ${e.id} » (phase ${e.phase}) dépend de « ${id} » (phase ${amont.phase}), postérieure.`),
        );
    }
  }

  // V7 — exactement une consignation et une levée
  for (const nature of ['consignation', 'levee-consignation']) {
    const n = etapes.filter((e) => e.nature === nature).length;
    if (n !== 1) d.push(defaut('V7', nature, `Il doit y avoir exactement une étape « ${nature} », il y en a ${n}.`));
  }

  // V8 — aucun travail sous tension avant la levée de consignation.
  // La règle qui porte de la sécurité des personnes, et la seule qui se vérifie
  // par une simple comparaison de rangs.
  const levee = etapes.find((e) => e.nature === 'levee-consignation');
  if (levee) {
    for (const e of etapes) {
      if (e.sousTension && e.rang < levee.rang)
        d.push(
          defaut('V8', e.id, `L'étape « ${e.id} » est sous tension au rang ${e.rang}, avant la levée de consignation (rang ${levee.rang}).`),
        );
    }
  }

  // V9 — après la levée, une étape déclarée hors tension doit se justifier
  if (levee) {
    for (const e of etapes) {
      if (e.rang > levee.rang && !e.sousTension && !estTexte(e.justificationSousTension))
        d.push(defaut('V9', e.id, `« ${e.id} » suit la levée de consignation sans être sous tension, sans justification.`));
    }
  }

  // V10 — les six vérifications du Principe V sont présentes
  const presentes = new Set(etapes.filter((e) => e.nature === 'verification').map((e) => e.verification));
  for (const v of verificationsExigees(modele.chantier)) {
    if (!presentes.has(v))
      d.push(
        defaut('V10', v, `La vérification « ${libelleDe(modele.chantier.verifications, v)} » (${v}) exigée par le Principe V ne figure pas dans la séquence.`),
      );
  }

  // V11 — identifiants uniques, tous apports confondus
  const compte = (liste) => {
    const vus = new Set();
    const doubles = [];
    for (const x of liste) {
      if (vus.has(x.id)) doubles.push(x.id);
      vus.add(x.id);
    }
    return doubles;
  };
  for (const id of compte(modele.composants)) d.push(defaut('V11', id, `Identifiant de composant en double : ${id}.`));
  for (const id of compte(modele.etapes)) d.push(defaut('V11', id, `Identifiant d'étape en double : ${id}.`));
  for (const id of compte(modele.cheminements ?? [])) d.push(defaut('V11', id, `Identifiant de cheminement en double : ${id}.`));
  for (const id of compte(modele.traversees ?? [])) d.push(defaut('V11', id, `Identifiant de traversée en double : ${id}.`));

  d.push(...validerCheminements(modele));

  return d;
}

/**
 * Règles V13 à V18 : la géométrie de la pose apparente.
 * V17 est celle qui porte le plus de sécurité de pose — un piquage hors boîte est
 * une connexion inaccessible, donc invérifiable à vie.
 */
export function validerCheminements(modele) {
  const d = [];
  const local = modele.local;

  // V13 et V14 — orthogonalité et appui sur une face
  for (const ch of modele.cheminements ?? []) {
    for (const [i, segment] of (ch.segments ?? []).entries()) {
      if (!estOrthogonal(segment)) {
        d.push(
          defaut('V13', ch.id, `« ${ch.reference} » segment ${i + 1} n'est pas orthogonal : la constitution impose des parcours horizontaux ou verticaux.`),
        );
      }
      const appui = appuiSurFace(local, segment);
      if (!appui.ok) d.push(defaut('V14', ch.id, `« ${ch.reference} » segment ${i + 1} : ${appui.message}`));
    }
  }

  if ((modele.cheminements ?? []).length === 0) return d;
  const graphe = construireGraphe(modele);

  // V15 — aucune extrémité pendante
  for (const ch of modele.cheminements) {
    for (const [rang, bout] of extremites(ch).entries()) {
      const n = graphe.noeudAu(bout);
      const raccorde =
        n &&
        (n.composants.length > 0 ||
          n.traversees.length > 0 ||
          (n.traverseesSortie ?? []).length > 0 ||
          n.degre >= 2);
      if (!raccorde) {
        d.push(
          defaut('V15', ch.id, `« ${ch.reference} » a une extrémité ${rang === 0 ? 'de départ' : "d'arrivée"} qui ne rejoint ni composant, ni boîte, ni traversée, ni autre conduit.`),
        );
      }
    }
  }

  // V16 — continuité de chaque circuit depuis le tableau
  for (const circuit of modele.circuits ?? []) {
    const r = atteignablesDepuisTableau(graphe, modele, circuit.id);
    if (r.sansTableau) {
      d.push(defaut('V16', circuit.id, "Aucun composant de type « tableau » n'est déclaré : la continuité des circuits est invérifiable."));
      break;
    }
    for (const id of r.orphelins) {
      const c = modele.composants.find((x) => x.id === id);
      d.push(
        defaut('V16', id, `« ${c?.reference ?? id} » n'est atteignable depuis le tableau par aucun cheminement portant le circuit « ${circuit.libelle} ».`),
      );
    }
  }

  // V17 — toute jonction de trois conduits ou plus porte une boîte
  for (const n of graphe.noeudsDeDegreAuMoins(3)) {
    if (n.boites.length === 0) {
      d.push(
        defaut('V17', n.cle, `Jonction de ${n.degre} conduits en (${n.point.x} ; ${n.point.y} ; ${n.point.z}) sans boîte de dérivation : ce serait une connexion inaccessible.`),
      );
    }
  }

  // V18 — pente des traversées desservant l'extérieur
  for (const t of modele.traversees ?? []) {
    if (t.sens === 'interieur-vers-exterieur' && t.penteVersExterieur !== true) {
      d.push(
        defaut('V18', t.id, `« ${t.reference} » dessert l'extérieur sans pente vers l'extérieur : l'eau pourrait cheminer vers l'intérieur.`),
      );
    }
    if (!sortieDeTraversee(local, t)) {
      d.push(defaut('V18', t.id, `« ${t.reference} » est déclarée sur une face sans nu extérieur.`));
    }
  }

  return d;
}

/** Tous les contrôles. Une séquence n'est utilisable que si la liste est vide. */
export function validerTout(modele, sequence, apports = []) {
  return [
    ...validerLocal(modele.local),
    ...validerCatalogues(modele),
    ...apports.flatMap((a) => validerApport(a, modele)),
    ...validerModele(modele, sequence),
  ];
}

/** Les catalogues du socle sont des données : ils se valident comme le reste. */
export function validerCatalogues(socle) {
  const d = [];
  const c = socle.chantier;
  if (!c || !Array.isArray(c.phases) || c.phases.length === 0)
    d.push(defaut('STRUCT', 'chantier', 'Le catalogue des phases est absent ou vide.'));
  if (!c || !Array.isArray(c.naturesEtape) || c.naturesEtape.length === 0)
    d.push(defaut('STRUCT', 'chantier', "Le catalogue des natures d'étape est absent ou vide."));
  if (!c || !Array.isArray(c.verifications) || verificationsExigees(c).length === 0)
    d.push(defaut('STRUCT', 'chantier', 'Aucune vérification exigée par le Principe V n’est déclarée.'));
  if (c?.phases) {
    for (const obligatoire of ['consignation', 'levee-consignation']) {
      if (!phases(c).includes(obligatoire))
        d.push(defaut('STRUCT', 'chantier', `La phase « ${obligatoire} » est obligatoire.`));
    }
    if (rangPhase(c, 'consignation') > rangPhase(c, 'levee-consignation'))
      d.push(defaut('STRUCT', 'chantier', 'La consignation doit précéder sa levée dans l’ordre des phases.'));
  }
  const t = socle.types;
  if (!t || !Array.isArray(t.types) || !t.gabaritParDefaut)
    d.push(defaut('STRUCT', 'types', 'Le catalogue des types de composants est incomplet.'));
  for (const type of t?.types ?? []) {
    const g = type.gabarit;
    if (!g || !(g.largeur > 0) || !(g.hauteur > 0) || !(g.profondeur > 0))
      d.push(defaut('STRUCT', type.id, `Gabarit invalide pour le type « ${type.id} ».`));
  }
  const p = socle.presentation;
  if (!p || !p.couleurs || !Array.isArray(p.paletteCircuits) || p.paletteCircuits.length === 0)
    d.push(defaut('STRUCT', 'presentation', 'La présentation est incomplète.'));
  if (p && !(p.epaisseurDalle > 0))
    d.push(defaut('STRUCT', 'presentation', 'epaisseurDalle doit être un nombre positif.'));
  if (p && (!p.eclairage?.hemispherique || !p.eclairage?.directionnel))
    d.push(defaut('STRUCT', 'presentation', "Les réglages d'éclairage sont incomplets."));
  if (p && (!Array.isArray(p.vues) || p.vues.length === 0 || !p.camera))
    d.push(defaut('STRUCT', 'presentation', 'Les vues prédéfinies ou les réglages de caméra manquent.'));
  return d;
}
