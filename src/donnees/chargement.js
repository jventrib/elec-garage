/**
 * Lecture et fusion des données. Aucune cote n'est écrite ici : tout vient de
 * data/local.json et des fichiers d'apport. Les valeurs dérivables sont calculées
 * et jamais saisies (FR-021).
 */

export const PRECISION = 4;

/** Arrondi de confort : les cotes sont au millimètre, le binaire ne l'est pas. */
export function arrondi(v, decimales = PRECISION) {
  const f = 10 ** decimales;
  return Math.round(v * f) / f;
}

/**
 * Emprise extérieure. Valeur dérivée, jamais lue d'un champ saisi : c'est ce qui
 * empêche 6,00 de diverger de 5,60 + 2 × 0,20.
 */
export function empriseExterieure(local) {
  const e = local.epaisseurParois;
  return { x: arrondi(local.oeuvre.x + 2 * e), y: arrondi(local.oeuvre.y + 2 * e) };
}

/** Les quatre parois, en boîtes englobantes dans le repère du local. */
export function paroisDuLocal(local) {
  const { x, y } = local.oeuvre;
  const e = local.epaisseurParois;
  const h = local.hauteurSousPlafond;
  return [
    { id: 'sud', min: { x: -e, y: -e, z: 0 }, max: { x: x + e, y: 0, z: h } },
    { id: 'nord', min: { x: -e, y, z: 0 }, max: { x: x + e, y: y + e, z: h } },
    { id: 'ouest', min: { x: -e, y: 0, z: 0 }, max: { x: 0, y, z: h } },
    { id: 'est', min: { x, y: 0, z: 0 }, max: { x: x + e, y, z: h } },
  ];
}

/** Axe le long duquel court une paroi. */
export function axeDeParoi(paroi) {
  return paroi === 'sud' || paroi === 'nord' ? 'x' : 'y';
}

/**
 * Segment occupé par une baie le long de sa paroi, et les trumeaux qui l'encadrent.
 * `debut` se lit depuis l'origine du repère, en œuvre intérieure.
 */
export function segmentBaie(local, baie) {
  const axe = axeDeParoi(baie.paroi);
  const longueur = axe === 'x' ? local.oeuvre.x : local.oeuvre.y;
  const min = baie.debut;
  const max = arrondi(baie.debut + baie.largeur);
  return {
    axe,
    min,
    max,
    longueurParoi: longueur,
    trumeauAvant: arrondi(min),
    trumeauApres: arrondi(longueur - max),
    deborde: max > longueur + 1e-9 || min < -1e-9,
  };
}

/** Fichiers de données du socle. Aucun n'est facultatif. */
export const FICHIERS_SOCLE = {
  local: 'data/local.json',
  chantier: 'data/chantier.json',
  types: 'data/types-composants.json',
  presentation: 'data/presentation.json',
};

/**
 * Les deux nus d'une paroi : la face intérieure et la face extérieure. Un
 * cheminement posé en apparent repose nécessairement sur l'un des deux.
 */
export function nusDeParoi(local, paroi) {
  const e = local.epaisseurParois;
  switch (paroi) {
    case 'est':
      return { axe: 'x', interieur: local.oeuvre.x, exterieur: arrondi(local.oeuvre.x + e) };
    case 'ouest':
      return { axe: 'x', interieur: 0, exterieur: -e };
    case 'nord':
      return { axe: 'y', interieur: local.oeuvre.y, exterieur: arrondi(local.oeuvre.y + e) };
    case 'sud':
      return { axe: 'y', interieur: 0, exterieur: -e };
    case 'plafond':
      return { axe: 'z', interieur: local.hauteurSousPlafond, exterieur: null };
    default:
      return null;
  }
}

/**
 * Point de sortie d'une traversée, sur le nu opposé. Dérivé de la position
 * déclarée et de l'épaisseur de la paroi : jamais saisi, donc jamais divergent.
 */
export function sortieDeTraversee(local, traversee) {
  const nus = nusDeParoi(local, traversee.paroi);
  if (!nus || nus.exterieur === null) return null;
  const p = traversee.position;
  const versExterieur = traversee.sens === 'interieur-vers-exterieur';
  const cible = versExterieur ? nus.exterieur : nus.interieur;
  return { ...p, [nus.axe]: cible, z: p.z - demiDenivele(traversee) };
}

/**
 * Le demi-dénivelé d'une traversée.
 *
 * `position` est l'AXE du perçage, et non son entrée : la mèche entre au-dessus
 * et ressort au-dessous, chaque côté à un demi-dénivelé de l'axe. C'est ce qui
 * permet à deux boîtiers dos à dos, posés à la même hauteur d'axe, de recevoir un
 * perçage en biais sans que l'un des deux sorte de son enveloppe.
 *
 * Un dénivelé non établi vaut ZÉRO ICI, et zéro seulement : la géométrie retombe
 * alors sur celle d'avant, ce qui laisse les tracés déjà arrêtés inchangés. Il NE
 * DOIT PAS pour autant être présenté comme une pente — c'est l'affaire de V18 et
 * de la vue, qui le signalent comme non coté.
 */
export function demiDenivele(traversee) {
  const d = traversee?.denivele;
  return typeof d === 'number' && d > 0 ? d / 2 : 0;
}

/** Point d'entrée du perçage, sur le nu que le sens désigne comme départ. */
export function entreeDeTraversee(local, traversee) {
  const nus = nusDeParoi(local, traversee.paroi);
  if (!nus || nus.exterieur === null) return null;
  const p = traversee.position;
  const versExterieur = traversee.sens === 'interieur-vers-exterieur';
  const cible = versExterieur ? nus.interieur : nus.exterieur;
  return { ...p, [nus.axe]: cible, z: p.z + demiDenivele(traversee) };
}

/**
 * Fusionne le socle et les apports en un modèle unique.
 *
 * `socle` réunit les quatre fichiers de données du projet : le relevé, le
 * catalogue de chantier, le catalogue de types de composants et la présentation.
 * Aucun de ces contenus ne vit dans le code.
 *
 * Les apports sont triés par nom de fonctionnalité : l'ordre de lecture des
 * fichiers ne doit jamais influencer le résultat (FR-024).
 */
export function fusionner(socle, apports) {
  const local = socle.local;
  const tries = [...apports].sort((a, b) => a.fonctionnalite.localeCompare(b.fonctionnalite));
  const circuits = [];
  const composants = [];
  const cheminements = [];
  const traversees = [];
  const etapes = [];
  for (const apport of tries) {
    const nom = apport.fonctionnalite;
    for (const c of apport.circuits ?? []) circuits.push({ ...c, apport: nom });
    for (const c of apport.composants ?? []) composants.push({ ...c, apport: nom });
    for (const c of apport.cheminements ?? []) cheminements.push({ ...c, apport: nom });
    for (const t of apport.traversees ?? []) traversees.push({ ...t, apport: nom });
    for (const e of apport.etapes ?? []) etapes.push({ ...e, apport: nom });
  }
  return {
    local,
    chantier: socle.chantier,
    types: socle.types,
    presentation: socle.presentation,
    circuits,
    composants,
    cheminements,
    traversees,
    etapes,
    apports: tries.map((a) => a.fonctionnalite),
    provenance: local.provenance,
  };
}

/**
 * Obtient les données selon l'environnement.
 * Dans le livrable chantier, elles sont déjà en ligne dans la page : rien n'est
 * chargé, ce qui est la seule façon de fonctionner depuis file:// (R2).
 */
/** Clés attendues au premier niveau de chaque fichier de socle. */
export const CLES_ATTENDUES = {
  local: ['oeuvre', 'hauteurSousPlafond', 'epaisseurParois', 'repere', 'baies', 'obstacles', 'provenance'],
  chantier: ['phases', 'naturesEtape', 'verifications'],
  types: ['types', 'gabaritParDefaut'],
  presentation: ['couleurs', 'paletteCircuits', 'epaisseurDalle', 'toleranceRaccordement', 'sectionConventionnelle', 'deniveleConventionnel', 'cordage', 'vues', 'libelles'],
};

/**
 * Vérifie que le socle est complet AVANT de s'en servir, et lève un message qui
 * nomme le fichier et la clé fautifs.
 *
 * Sans ce contrôle, un fichier absent, périmé ou mal formé ne se manifeste que
 * cinquante lignes plus loin, par un « Cannot read properties of undefined » qui
 * ne désigne rien. Un socle incomplet est une inconnue : il doit se déclarer comme
 * telle, pas se propager.
 */
export function verifierSocle(socle) {
  const manques = [];
  for (const [cle, chemin] of Object.entries(FICHIERS_SOCLE)) {
    const contenu = socle?.[cle];
    if (!contenu || typeof contenu !== 'object') {
      manques.push(`${chemin} est absent ou illisible`);
      continue;
    }
    for (const attendue of CLES_ATTENDUES[cle]) {
      if (!(attendue in contenu)) manques.push(`${chemin} : clé « ${attendue} » manquante`);
    }
  }
  if (manques.length > 0) {
    throw new Error(
      `Socle de données incomplet — ${manques.join(' ; ')}. ` +
        `Si la page a déjà fonctionné, un module ou un fichier de données peut être en cache : rechargez sans cache.`,
    );
  }
  return socle;
}

export async function obtenirDonnees() {
  if (globalThis.__DONNEES__) {
    const d = globalThis.__DONNEES__;
    verifierSocle(d.socle);
    return { modele: fusionner(d.socle, d.apports ?? []), apports: d.apports ?? [] };
  }

  const json = async (chemin) => {
    const reponse = await fetch(`./${chemin}`);
    if (!reponse.ok) throw new Error(`${chemin} : le serveur répond ${reponse.status}.`);
    try {
      return await reponse.json();
    } catch {
      throw new Error(`${chemin} : contenu illisible, ce n'est pas du JSON valide.`);
    }
  };

  const socle = {};
  for (const [cle, chemin] of Object.entries(FICHIERS_SOCLE)) socle[cle] = await json(chemin);
  verifierSocle(socle);

  const noms = await json('data/apports/index.json');
  const apports = [];
  for (const nom of noms) apports.push(await json(`data/apports/${nom}.json`));
  return { modele: fusionner(socle, apports), apports };
}
