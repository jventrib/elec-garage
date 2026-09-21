/**
 * Les cotes d'implantation — de quoi tracer au mur avant de percer.
 *
 * Demandées le 2026-09-22 : « des indications visuelles des cotes pour aider au
 * placement des éléments, en prenant en référence les repères géométriques les
 * plus pertinents ».
 *
 * Rien n'est déclaré ici : **tout est dérivé**. Les repères sont ceux du relevé —
 * les angles du local, les bords et les allèges des baies, et l'emprise des
 * obstacles dont le volume est relevé. La cote retenue est celle qui va au
 * **repère le plus proche**, parce que c'est la mesure la plus courte, donc la
 * plus juste à reporter au mètre ruban.
 *
 * Que la règle du plus proche soit la bonne se vérifie sur le dossier lui-même :
 * elle redonne les cotes que les documents citent à la main. CH-05 ressort à
 * 0,20 m du jambage nord de la porte de service, et PC-05 à 0,20 m au nord de
 * l'extrémité du rail — ce sont mot pour mot les cotes de FR-030 et de R5.
 *
 * Un obstacle dont le volume n'est que **majorant** n'est pas un repère : on ne
 * mesure pas depuis une chose qu'on n'a pas mesurée.
 */

import { AXE_NORMAL, axesDeFace } from './cheminement.js';

const EPS = 1e-9;
const arrondi = (v) => Math.round(v * 1000) / 1000;

/**
 * Le mot qui dit de quel côté. Sans « de » : c'est le repère qui porte son
 * article, faute de quoi on écrit « au-dessus de le linteau ».
 */
function sensDit(axe, delta) {
  if (axe === 'x') return delta >= 0 ? "à l'est" : "à l'ouest";
  if (axe === 'y') return delta >= 0 ? 'au nord' : 'au sud';
  return delta >= 0 ? 'au-dessus' : 'en dessous';
}

/** « au nord » + « de la paroi sud » → « au nord de la paroi sud ». */
function joindre(sens, repere) {
  if (/^(du |de la |de l'|des |de )/.test(repere)) return `${sens} ${repere}`;
  return `${sens} de ${repere}`;
}

/** Distance d'un point à une boîte alignée sur les axes, zéro s'il est dedans. */
function distanceAuVolume(point, volume) {
  let carre = 0;
  for (const a of ['x', 'y', 'z']) {
    const d = Math.max(volume.min[a] - point[a], 0, point[a] - volume.max[a]);
    carre += d * d;
  }
  return Math.sqrt(carre);
}

/**
 * Tous les repères utilisables sur un axe donné : angles du local, bords et
 * altitudes des baies, emprise des obstacles relevés.
 */
export function reperesSurAxe(local, axe, paroi = null, options = {}) {
  const { libelles = {}, libellesObstacles = {}, point = null, portee = Infinity } = options;
  const reperes = [];
  const pousser = (valeur, libelle) => {
    if (typeof valeur === 'number' && Number.isFinite(valeur)) reperes.push({ valeur, libelle, axe });
  };

  if (axe === 'z') {
    pousser(0, 'du sol fini');
    pousser(local.hauteurSousPlafond, 'du plafond');
  } else {
    const nom = axe === 'x' ? ['de la paroi ouest', 'de la paroi est'] : ['de la paroi sud', 'de la paroi nord'];
    pousser(0, nom[0]);
    pousser(local.oeuvre[axe], nom[1]);
  }

  for (const baie of local.baies ?? []) {
    // Une baie ne sert de repère que sur sa propre paroi : mesurer la porte est
    // depuis la paroi nord n'aurait aucun sens au mètre ruban.
    if (paroi && baie.paroi !== paroi && axe !== 'z') continue;
    if (paroi && baie.paroi !== paroi) continue;
    const nomBaie = libelles[baie.id] ?? `« ${baie.id} »`;
    const axeBaie = baie.paroi === 'sud' || baie.paroi === 'nord' ? 'x' : 'y';
    if (axe === axeBaie) {
      pousser(baie.debut, `du bord ${sensDit(axe, -1).replace('au ', '').replace("à l'", '')} de ${nomBaie}`);
      pousser(baie.debut + baie.largeur, `du bord ${sensDit(axe, 1).replace('au ', '').replace("à l'", '')} de ${nomBaie}`);
    } else if (axe === 'z') {
      const allege = baie.allege ?? 0;
      if (allege > EPS) pousser(allege, `de l'allège de ${nomBaie}`);
      const haut = baie.hauteur === null ? local.hauteurSousPlafond : allege + baie.hauteur;
      if (haut < local.hauteurSousPlafond - EPS) pousser(haut, `du linteau de ${nomBaie}`);
    }
  }

  for (const o of local.obstacles ?? []) {
    // Seul un volume RELEVÉ est un repère. Un majorant borne, il ne se mesure pas.
    if (!o.volume || o.incertain) continue;
    // Et il faut pouvoir l'atteindre au mètre ruban depuis l'objet à tracer. Sans
    // cette portée, le rail servait de repère à un socle distant de 2,86 m sur une
    // AUTRE paroi : la cote était juste et intraçable.
    if (point && distanceAuVolume(point, o.volume) > portee + EPS) continue;
    // Le libellé de cote porte son article : « du rail de la porte sectionnelle ».
    // Le libellé du relevé, lui, est un titre de fiche — « Rail de motorisation
    // de la porte sectionnelle » — et ne se coud pas dans une phrase.
    const nom = libellesObstacles[o.id] ?? `de ${o.libelle ?? o.id}`;
    pousser(o.volume.min[axe], nom);
    pousser(o.volume.max[axe], nom);
  }
  return reperes;
}

/** La cote la plus courte depuis une valeur, sur un axe. */
export function coteLaPlusProche(local, axe, valeur, paroi = null, options = {}) {
  let meilleure = null;
  for (const r of reperesSurAxe(local, axe, paroi, options)) {
    const ecart = Math.abs(valeur - r.valeur);
    if (ecart <= EPS) continue; // un repère confondu avec l'objet ne cote rien
    if (!meilleure || ecart < meilleure.distance - EPS) {
      meilleure = { axe, distance: arrondi(ecart), de: valeur, vers: r.valeur, repere: r.libelle,
                    sens: sensDit(axe, valeur - r.valeur) };
    }
  }
  return meilleure;
}

/**
 * Les cotes d'un segment de conduit : **une seule**, celle qui fixe sa ligne.
 *
 * Un traceur n'a pas besoin de deux mesures pour un tracé droit. Une horizontale
 * se fixe par son altitude, une verticale par sa position le long de la paroi,
 * et une ligne de plafond par la coordonnée qui ne varie pas.
 */
export function coterSegment(local, segment, options = {}) {
  const axes = axesDeFace(segment.face);
  if (!axes) return [];
  const fixe = axes.find((a) => Math.abs(segment.a[a] - segment.de[a]) <= EPS);
  if (!fixe) return [];
  const paroi = segment.face === 'plafond' ? null : segment.face;
  const milieu = {};
  for (const a of ['x', 'y', 'z']) milieu[a] = (segment.de[a] + segment.a[a]) / 2;
  const cote = coteLaPlusProche(local, fixe, segment.de[fixe], paroi, { ...options, point: milieu });
  if (!cote) return [];
  return [{ ...cote, point: milieu, normale: AXE_NORMAL[segment.face] }];
}

/**
 * Les cotes d'un composant : **deux**, car un point demande deux mesures. Le
 * long de la paroi, et en altitude — ou les deux axes du plan pour le plafond.
 */
export function coterComposant(local, composant, options = {}) {
  const axes = axesDeFace(composant.paroi);
  if (!axes || !composant.position) return [];
  const paroi = composant.paroi === 'plafond' ? null : composant.paroi;
  return axes
    .map((a) => {
      const cote = coteLaPlusProche(local, a, composant.position[a], paroi, { ...options, point: composant.position });
      return cote ? { ...cote, point: { ...composant.position }, normale: AXE_NORMAL[composant.paroi] } : null;
    })
    .filter(Boolean);
}

/**
 * Les cotes d'une traversée de paroi : deux, comme un composant.
 *
 * Ce sont les cotes qui comptent le plus. Une traversée est un **trou**, et un
 * trou mal placé dans 0,20 m de béton ne se rattrape pas — c'est le seul objet
 * du dossier dont l'erreur est irréversible. Elle se pose en phase de perçage,
 * donc sa cote s'affiche au moment exact où quelqu'un tient le perforateur.
 */
export function coterTraversee(local, traversee, options = {}) {
  return coterComposant(local, traversee, options);
}

/** Toutes les cotes d'un cheminement, segment par segment. */
export function coterCheminement(local, cheminement, options = {}) {
  return (cheminement.segments ?? []).flatMap((s) => coterSegment(local, s, options));
}

/** Un libellé lisible : « 0,2 m au nord du bord nord de « porte-service » ». */
export function libelleDeCote(cote) {
  const n = cote.distance.toFixed(2).replace('.', ',');
  return `${n} m ${joindre(cote.sens, cote.repere)}`;
}
