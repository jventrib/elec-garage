/**
 * Géométrie d'un cheminement posé en apparent.
 *
 * Ce module décide, il ne dessine pas. L'orthogonalité d'un segment et son appui
 * sur une face sont des questions à réponse vraie ou fausse, testables sans
 * pixel — et ce sont précisément celles qui peuvent être fausses sans que cela se
 * voie à l'écran.
 */

import { nusDeParoi } from '../donnees/chargement.js';
import { cotesRetenues, encombrementDe } from './section.js';

/** Axe normal à chaque face : la coordonnée qui ne doit pas varier. */
export const AXE_NORMAL = { est: 'x', ouest: 'x', nord: 'y', sud: 'y', plafond: 'z' };

const EPS = 1e-9;

/**
 * Ce qu'un cheminement EST, et non seulement ce qu'il court sur.
 *
 * Un `conduit` est un tube ou un profilé : rigide, de section connue, il se pose
 * à la colle ou à la vis et son orthogonalité n'est pas une préférence. Un
 * `cordage` est un lien SOUPLE entre deux appareils : il relie un connecteur à un
 * connecteur, il n'a pas de section de conduit — celle d'un câble multiconducteur
 * ne se compare pas à un diamètre intérieur — et il ne se pose pas en ligne
 * droite. Lui appliquer les règles du tube reviendrait à déclarer une pose
 * impossible conforme.
 *
 * L'absence de `nature` vaut `conduit` : tous les apports déjà écrits restent
 * ce qu'ils étaient, sans migration.
 */
export const NATURES = ['conduit', 'cordage'];

export function estCordage(cheminement) {
  return cheminement?.nature === 'cordage';
}

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

/** Étendue d'une baie sur sa paroi : le long du mur, et en altitude. */
export function etendueDeBaie(local, baie) {
  const allege = baie.allege ?? 0;
  const haut = baie.hauteur === null ? local.hauteurSousPlafond : allege + baie.hauteur;
  return {
    axe: baie.paroi === 'sud' || baie.paroi === 'nord' ? 'x' : 'y',
    min: baie.debut,
    max: baie.debut + baie.largeur,
    bas: allege,
    haut,
  };
}

/**
 * Un segment traverse-t-il une baie de sa propre paroi ?
 *
 * La question ne se posait pas tant que les deux baies partaient du sol : un
 * conduit passe au-dessus d'une porte ou n'y passe pas. Une fenêtre à mi-hauteur
 * la rend concrète — rien n'empêche de tracer une antenne à 1,50 m en travers
 * d'une ouverture, sur le plan comme dans les données.
 *
 * Le contact franc est admis : un conduit qui longe exactement le bord de la baie
 * ne la traverse pas.
 */
export function croiseBaie(local, segment, baie) {
  if (segment.face !== baie.paroi) return false;
  const e = etendueDeBaie(local, baie);
  const EPSILON = 1e-6;
  const long = [
    Math.min(segment.de[e.axe], segment.a[e.axe]),
    Math.max(segment.de[e.axe], segment.a[e.axe]),
  ];
  const vert = [Math.min(segment.de.z, segment.a.z), Math.max(segment.de.z, segment.a.z)];
  const chevauche = (a, b) => a[0] < b[1] - EPSILON && b[0] < a[1] - EPSILON;
  return chevauche(long, [e.min, e.max]) && chevauche(vert, [e.bas, e.haut]);
}

/**
 * Un point se trouve-t-il à l'intérieur d'un segment, extrémités exclues ?
 * C'est ce qui permet de détecter un piquage au milieu d'un conduit.
 *
 * La distance PERPENDICULAIRE est mesurée explicitement. Une version antérieure
 * testait `|d1 + d2 - L| <= tolerance`, la somme des distances aux extrémités :
 * c'est exact sur le papier, mais sa sensibilité à un écart de côté est
 * **quadratique**. Le critère acceptait en fait un écart perpendiculaire allant
 * jusqu'à `sqrt(tolerance · L / 2)`, soit 12 cm sur un segment de 2,80 m et 17 cm
 * sur un segment de 6 m. Un point à 10 cm d'un conduit était donc déclaré posé
 * dessus, et la règle V17 signalait une jonction qui n'existait pas.
 *
 * Le sens de l'erreur était le bon — elle sur-signalait — mais une règle qui
 * refuse des tracés valides dans les zones encombrées est précisément une règle
 * dont on cesse de tenir compte. Et V17 est celle qui arbitre les tracés.
 */
export function pointDansSegment(point, segment, tolerance) {
  if (memePoint(point, segment.de, tolerance) || memePoint(point, segment.a, tolerance)) return false;
  const v = {
    x: segment.a.x - segment.de.x,
    y: segment.a.y - segment.de.y,
    z: segment.a.z - segment.de.z,
  };
  const carre = v.x * v.x + v.y * v.y + v.z * v.z;
  if (carre <= tolerance * tolerance) return false;

  const w = { x: point.x - segment.de.x, y: point.y - segment.de.y, z: point.z - segment.de.z };
  // Projection sur l'axe du segment, en abscisse réduite.
  const t = (w.x * v.x + w.y * v.y + w.z * v.z) / carre;
  const l = Math.sqrt(carre);
  // Strictement entre les extrémités, la tolérance comptée en longueur réelle.
  if (t * l <= tolerance || (1 - t) * l <= tolerance) return false;

  // Écart perpendiculaire : la composante de w orthogonale à v.
  const ecart = Math.hypot(w.x - t * v.x, w.y - t * v.y, w.z - t * v.z);
  return ecart <= tolerance;
}

/**
 * Un point est-il DANS le profilé qu'un segment porte ?
 *
 * Un conduit se raccorde à un point : son bout. Un profilé à capot se laisse
 * aborder par l'une de ses FACES — un conduit sort par le dessous ou par la face
 * avant, une traversée par le fond —, à quelques centimètres de son axe. Tant
 * qu'un profilé montait à la verticale et qu'on l'abordait sur son axe, le test de
 * l'axe suffisait ; une goulotte horizontale de douze centimètres au plafond ne se
 * laisse pas réduire à une ligne.
 *
 * Le volume est celui de la section retenue, centré sur l'axe dans le plan de la
 * face et de part et d'autre du nu : l'autre côté est dans l'épaisseur de la
 * paroi, où aucun nœud ne se pose. Sans cote connue, le profilé retombe sur son
 * axe, extrémités comprises.
 */
export function pointDansProfile(point, segment, cotes, tolerance) {
  if (memePoint(point, segment.de, tolerance) || memePoint(point, segment.a, tolerance)) return true;
  if (!cotes) return pointDansSegment(point, segment, tolerance);
  const normal = AXE_NORMAL[segment.face];
  const axes = axesDeFace(segment.face);
  if (!normal || !axes) return false;
  const long = axes.find((a) => Math.abs(segment.a[a] - segment.de[a]) > EPS);
  const travers = axes.find((a) => a !== long);
  if (!long) return false;
  const lo = Math.min(segment.de[long], segment.a[long]);
  const hi = Math.max(segment.de[long], segment.a[long]);
  return point[long] >= lo - tolerance && point[long] <= hi + tolerance
    && Math.abs(point[travers] - segment.de[travers]) <= cotes.transversal / 2 + tolerance
    && Math.abs(point[normal] - segment.de[normal]) <= cotes.saillie + tolerance;
}

/** L'encombrement d'un profilé, ou null quand sa section n'a aucune cote connue. */
export function cotesDeProfile(section) {
  return cotesRetenues(section) ? encombrementDe(section, null) : null;
}

/** Le point est-il dans l'un des segments d'un profilé, à sa section retenue ? */
export function pointSurProfile(point, cheminement, tolerance) {
  const cotes = cotesDeProfile(cheminement.section);
  return (cheminement.segments ?? []).some((s) => pointDansProfile(point, s, cotes, tolerance));
}

/**
 * Point le plus proche entre deux segments, et distance entre leurs axes.
 *
 * Écrit pour la règle V20. Jusqu'au 2026-09-22 le socle n'opposait les conduits
 * qu'aux obstacles relevés, jamais entre eux : deux tubes pouvaient se traverser
 * sans qu'aucune des dix-neuf règles ne le voie. La lacune était connue et
 * inscrite au dossier depuis `003-eclairage` (R4) ; elle a fini par produire une
 * recommandation fausse sur le tracé de la borne, qui heurtait une montée de
 * 0,15 m que personne ne regardait.
 *
 * L'algorithme est celui, classique, des deux points les plus proches de deux
 * segments : on résout le minimum de |P1(s) − P2(t)|² sur le carré [0,1]², en
 * rabattant sur les bords quand l'optimum non contraint en sort. Les cas
 * dégénérés — segment de longueur nulle, segments parallèles — sont traités
 * explicitement, car ils sont fréquents ici : tous les conduits sont alignés sur
 * les axes, donc souvent parallèles.
 */
export function plusProchesPoints(s1, s2) {
  const sous = (a, b) => ({ x: a.x - b.x, y: a.y - b.y, z: a.z - b.z });
  const prod = (a, b) => a.x * b.x + a.y * b.y + a.z * b.z;
  const avance = (p, d, t) => ({ x: p.x + d.x * t, y: p.y + d.y * t, z: p.z + d.z * t });
  const borne = (v) => (v < 0 ? 0 : v > 1 ? 1 : v);
  const EPSILON = 1e-12;

  const d1 = sous(s1.a, s1.de);
  const d2 = sous(s2.a, s2.de);
  const r = sous(s1.de, s2.de);
  const a = prod(d1, d1);
  const e = prod(d2, d2);
  const f = prod(d2, r);

  let s;
  let t;
  if (a <= EPSILON && e <= EPSILON) {
    s = 0;
    t = 0;
  } else if (a <= EPSILON) {
    s = 0;
    t = borne(f / e);
  } else {
    const c = prod(d1, r);
    if (e <= EPSILON) {
      t = 0;
      s = borne(-c / a);
    } else {
      const b = prod(d1, d2);
      const denom = a * e - b * b;
      // denom nul : les segments sont parallèles, tout s convient pour l'optimum
      // non contraint. On part de s = 0 et on laisse le rabattement décider.
      s = denom > EPSILON ? borne((b * f - c * e) / denom) : 0;
      t = (b * s + f) / e;
      if (t < 0) {
        t = 0;
        s = borne(-c / a);
      } else if (t > 1) {
        t = 1;
        s = borne((b - c) / a);
      }
    }
  }

  const p1 = avance(s1.de, d1, s);
  const p2 = avance(s2.de, d2, t);
  return { p1, p2, distance: Math.hypot(p1.x - p2.x, p1.y - p2.y, p1.z - p2.z) };
}

/** Distance entre les axes de deux segments. */
export function distanceSegments(s1, s2) {
  return plusProchesPoints(s1, s2).distance;
}

/** Deux segments partagent-ils une extrémité ? C'est alors une jonction, pas un heurt. */
export function partagentUneExtremite(s1, s2, tolerance) {
  for (const a of [s1.de, s1.a]) for (const b of [s2.de, s2.a]) if (memePoint(a, b, tolerance)) return true;
  return false;
}

/**
 * Deux segments parallèles se recouvrent-ils sur une LONGUEUR, et non en un point ?
 *
 * C'est le trou qu'avait la première écriture de V20. Elle exemptait toute paire
 * partageant une extrémité, au motif qu'une jonction n'est pas un heurt — vrai
 * pour deux conduits qui divergent depuis une boîte, faux pour deux conduits qui
 * partent du même point dans la MÊME direction. Le cas n'était pas théorique :
 * la ligne de la borne part du tableau, comme celle des prises, et deux montées
 * superposées sur le même aplomb auraient passé le contrôle sans un mot.
 *
 * Le recouvrement se mesure sur la longueur, seule façon de distinguer le
 * bout-à-bout — légitime, recouvrement de longueur nulle — de la superposition.
 */
export function recouvrementParallele(s1, s2, garde, tolerance) {
  const sous = (a, b) => ({ x: a.x - b.x, y: a.y - b.y, z: a.z - b.z });
  const prod = (a, b) => a.x * b.x + a.y * b.y + a.z * b.z;

  const u = sous(s1.a, s1.de);
  const v = sous(s2.a, s2.de);
  const lu = Math.hypot(u.x, u.y, u.z);
  const lv = Math.hypot(v.x, v.y, v.z);
  if (lu <= tolerance || lv <= tolerance) return null;

  // Parallélisme : le produit vectoriel est nul, à l'échelle des deux longueurs.
  const croix = Math.hypot(u.y * v.z - u.z * v.y, u.z * v.x - u.x * v.z, u.x * v.y - u.y * v.x);
  if (croix > 1e-9 * lu * lv) return null;

  // Écart entre les deux droites : composante de w orthogonale à u.
  const w = sous(s2.de, s1.de);
  const t = prod(w, u) / (lu * lu);
  const ecart = Math.hypot(w.x - t * u.x, w.y - t * u.y, w.z - t * u.z);
  if (ecart > garde - 1e-9) return null;

  // Recouvrement des projections sur l'axe de s1, compté en mètres.
  const abscisse = (p) => prod(sous(p, s1.de), u) / lu;
  const [b1, b2] = [abscisse(s2.de), abscisse(s2.a)].sort((a, b) => a - b);
  const debut = Math.max(0, b1);
  const fin = Math.min(lu, b2);
  const longueur = fin - debut;
  if (longueur <= tolerance) return null;

  const milieu = (debut + fin) / 2;
  return {
    longueur,
    ecart,
    point: { x: s1.de.x + (u.x * milieu) / lu, y: s1.de.y + (u.y * milieu) / lu, z: s1.de.z + (u.z * milieu) / lu },
  };
}
