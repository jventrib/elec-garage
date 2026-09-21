/**
 * Géométrie d'un cheminement posé en apparent.
 *
 * Ce module décide, il ne dessine pas. L'orthogonalité d'un segment et son appui
 * sur une face sont des questions à réponse vraie ou fausse, testables sans
 * pixel — et ce sont précisément celles qui peuvent être fausses sans que cela se
 * voie à l'écran.
 */

import { nusDeParoi } from '../donnees/chargement.js';

/** Axe normal à chaque face : la coordonnée qui ne doit pas varier. */
export const AXE_NORMAL = { est: 'x', ouest: 'x', nord: 'y', sud: 'y', plafond: 'z' };

const EPS = 1e-9;

/** Les deux axes dans le plan de la face, c'est-à-dire ceux qui peuvent varier. */
export function axesDeFace(face) {
  const normal = AXE_NORMAL[face];
  if (!normal) return null;
  return ['x', 'y', 'z'].filter((a) => a !== normal);
}

export function memePoint(a, b, tolerance) {
  return Math.hypot(a.x - b.x, a.y - b.y, a.z - b.z) <= tolerance;
}

export function longueurSegment(segment) {
  const { de, a } = segment;
  return Math.hypot(a.x - de.x, a.y - de.y, a.z - de.z);
}

export function longueurCheminement(cheminement) {
  return (cheminement.segments ?? []).reduce((t, s) => t + longueurSegment(s), 0);
}

export function extremites(cheminement) {
  const segs = cheminement.segments ?? [];
  if (segs.length === 0) return [];
  return [segs[0].de, segs[segs.length - 1].a];
}

/** Tous les points d'un cheminement, dans l'ordre du parcours. */
export function pointsDeCheminement(cheminement) {
  const segs = cheminement.segments ?? [];
  if (segs.length === 0) return [];
  return [segs[0].de, ...segs.map((s) => s.a)];
}

/**
 * Un segment est orthogonal si la coordonnée normale à sa face ne varie pas, et
 * si exactement un des deux axes du plan varie. Un conduit ne traverse pas la
 * paroi, il court dessus ; et il ne part pas en biais.
 */
export function estOrthogonal(segment) {
  const axes = axesDeFace(segment.face);
  if (!axes) return false;
  const normal = AXE_NORMAL[segment.face];
  if (Math.abs(segment.a[normal] - segment.de[normal]) > EPS) return false;
  const variants = axes.filter((axe) => Math.abs(segment.a[axe] - segment.de[axe]) > EPS);
  return variants.length === 1;
}

/**
 * Un segment repose sur l'un des deux nus de sa paroi — intérieur ou extérieur —
 * et reste dans les limites de la face. Le plafond n'a qu'un nu utile, sa
 * sous-face.
 */
export function appuiSurFace(local, segment) {
  const nus = nusDeParoi(local, segment.face);
  if (!nus) return { ok: false, message: `Face inconnue « ${segment.face} ».` };

  const valeur = segment.de[nus.axe];
  const candidats = [nus.interieur, nus.exterieur].filter((v) => v !== null);
  const surUnNu = candidats.some((v) => Math.abs(valeur - v) <= 1e-6);
  if (!surUnNu) {
    return {
      ok: false,
      message: `Le segment flotte à ${nus.axe} = ${valeur} : il doit reposer sur un nu (${candidats.join(' ou ')}).`,
    };
  }

  const limites = {
    x: [0, local.oeuvre.x],
    y: [0, local.oeuvre.y],
    z: [0, local.hauteurSousPlafond],
  };
  for (const axe of axesDeFace(segment.face)) {
    const [min, max] = limites[axe];
    for (const bout of [segment.de, segment.a]) {
      if (bout[axe] < min - 1e-6 || bout[axe] > max + 1e-6) {
        return {
          ok: false,
          message: `Le segment sort des limites de la face : ${axe} = ${bout[axe]} hors [${min} ; ${max}].`,
        };
      }
    }
  }
  return { ok: true, message: '' };
}

/**
 * Un point se trouve-t-il à l'intérieur d'un segment, extrémités exclues ?
 * C'est ce qui permet de détecter un piquage au milieu d'un conduit.
 */
export function pointDansSegment(point, segment, tolerance) {
  if (memePoint(point, segment.de, tolerance) || memePoint(point, segment.a, tolerance)) return false;
  const l = longueurSegment(segment);
  if (l <= tolerance) return false;
  const d1 = Math.hypot(point.x - segment.de.x, point.y - segment.de.y, point.z - segment.de.z);
  const d2 = Math.hypot(point.x - segment.a.x, point.y - segment.a.y, point.z - segment.a.z);
  return Math.abs(d1 + d2 - l) <= tolerance;
}
