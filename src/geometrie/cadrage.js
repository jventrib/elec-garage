/**
 * D'où regarder un objet, et de quelle distance.
 *
 * Rien n'est choisi ici : tout se dérive de ce que l'objet déclare déjà.
 *
 *   - la PAROI et la FACE disent de quel côté se placer. Un objet de face
 *     extérieure se regarde depuis l'extérieur ; le regarder depuis l'intérieur
 *     n'en montrerait que la paroi.
 *   - l'ENCOMBREMENT dit à quelle distance. Un socle de 0,09 m et le tableau de
 *     0,36 m ne se regardent pas de la même distance, et une constante unique
 *     serait fausse pour l'un des deux.
 *
 * Un objet SANS étendue déclarée ne se cadre pas : lui en inventer une ferait
 * passer une absence de cote pour une cote, ce que le Principe VI proscrit au même
 * titre qu'une valeur plausible substituée à une valeur inconnue. Quatre des sept
 * obstacles du projet sont dans ce cas.
 */

/** Normale sortante du local, par paroi. */
export const NORMALE = {
  est: { x: 1, y: 0, z: 0 },
  ouest: { x: -1, y: 0, z: 0 },
  nord: { x: 0, y: 1, z: 0 },
  sud: { x: 0, y: -1, z: 0 },
  plafond: { x: 0, y: 0, z: 1 },
};

/**
 * Direction depuis laquelle l'objet se regarde, en s'éloignant de lui.
 *
 * Face extérieure : on suit la normale, donc on sort. Face intérieure : on prend
 * l'opposé, donc on reste dedans. Un objet de plafond se regarde par en dessous —
 * sa face utile est tournée vers le sol.
 */
export function directionDeVue(objet) {
  const n = NORMALE[objet?.paroi];
  if (!n) return null;
  const dehors = objet.face === 'exterieur';
  const signe = objet.paroi === 'plafond' ? -1 : dehors ? 1 : -1;
  // `+ 0` ramène -0 à 0. Sans ça une direction {x:-1, y:-0, z:-0} n'est pas
  // strictement égale à {x:-1, y:0, z:0}, et un zéro négatif n'a aucun sens pour
  // une composante de direction.
  return { x: n.x * signe + 0, y: n.y * signe + 0, z: n.z * signe + 0 };
}

/** Plus grande cote d'un volume aligné sur les axes. */
function etendueDeVolume(v) {
  if (!v?.min || !v?.max) return null;
  return Math.max(v.max.x - v.min.x, v.max.y - v.min.y, v.max.z - v.min.z);
}

/** Centre d'un volume. */
function centreDeVolume(v) {
  return { x: (v.min.x + v.max.x) / 2, y: (v.min.y + v.max.y) / 2, z: (v.min.z + v.max.z) / 2 };
}

/** Boîte englobant le parcours d'un cheminement. */
function boiteDeCheminement(ch) {
  const pts = (ch.segments ?? []).flatMap((s) => [s.de, s.a]);
  if (!pts.length) return null;
  const min = { x: Infinity, y: Infinity, z: Infinity };
  const max = { x: -Infinity, y: -Infinity, z: -Infinity };
  for (const p of pts) {
    for (const a of ['x', 'y', 'z']) {
      min[a] = Math.min(min[a], p[a]);
      max[a] = Math.max(max[a], p[a]);
    }
  }
  return { min, max };
}

/**
 * Ce qu'il faut pour cadrer un objet : le point à viser et son étendue.
 *
 * Rend `null` quand l'objet ne déclare AUCUNE étendue — auquel cas la caméra ne
 * doit pas bouger.
 */
export function cadrageDe(objet, nature, catalogue = null, local = null) {
  if (!objet) return null;

  if (nature === 'cheminement') {
    const b = boiteDeCheminement(objet);
    if (!b) return null;
    return { cible: centreDeVolume(b), etendue: etendueDeVolume(b), direction: null };
  }

  if (nature === 'obstacle') {
    // Le majorant cadre : il est une CONSÉQUENCE de cotes relevées, non une
    // invention. La fiche continue de le déclarer comme majorant — cadrer ne
    // change pas la nature de ce qui est affiché, ça regarde au bon endroit.
    const v = objet.volume ?? objet.volumeMajorant;
    if (!v) return null;
    return { cible: centreDeVolume(v), etendue: etendueDeVolume(v), direction: null };
  }

  // Rangement : même forme qu'un composant, donc même branche. `main.js` lui passe
  // un descripteur `{ id, paroi, face, volume, libelle }` — le volume étant celui du
  // GABARIT, c'est-à-dire ce qui est réellement dessiné. Sans ce descripteur, il
  // faudrait ici une forme de plus, et c'est exactement ce que la tâche interdit.
  if (nature === 'rangement') {
    const v = objet.volume;
    if (!v) return null;
    return { cible: centreDeVolume(v), etendue: etendueDeVolume(v), direction: directionDeVue(objet) };
  }

  if (nature === 'traversee') {
    const e = local?.epaisseurParois;
    if (!(e > 0)) return null;
    return { cible: { ...objet.position }, etendue: e, direction: directionDeVue(objet) };
  }

  // Composant : son volume déclaré s'il en porte un, le gabarit de son type sinon.
  const g = objet.dimensions
    ?? (catalogue?.types ?? []).find((t) => t.id === objet.type)?.gabarit
    ?? catalogue?.gabaritParDefaut;
  if (!g) return null;
  const etendue = Math.max(g.largeur, g.hauteur, g.profondeur);
  return { cible: { ...objet.position }, etendue, direction: directionDeVue(objet) };
}

/** Distance de recul, dérivée de l'étendue et bornée par les bornes d'orbite. */
export function distanceDeCadrage(etendue, reglages) {
  if (!(etendue > 0)) return null;
  const d = etendue * reglages.margeCadrage;
  return Math.min(reglages.rayonMax, Math.max(reglages.rayonMin, d));
}

/** Angles d'orbite (theta, phi) équivalents à une direction de vue. */
export function anglesDepuisDirection(d) {
  if (!d) return null;
  const n = Math.hypot(d.x, d.y, d.z);
  if (!(n > 0)) return null;
  return { theta: Math.atan2(d.y / n, d.x / n), phi: Math.acos(Math.min(1, Math.max(-1, d.z / n))) };
}
