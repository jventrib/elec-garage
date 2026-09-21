/**
 * Répartition des colliers le long d'un cheminement.
 *
 * Elle est **dérivée**, jamais déclarée point par point. Coter le trente-septième
 * collier donnerait une précision que personne ne reporte au chantier, et que la
 * moindre révision de tracé rendrait fausse. On tire un cordeau et on répartit ;
 * c'est le geste réel, et le modèle doit le décrire plutôt que le contredire.
 *
 * L'entraxe est une donnée PRODUIT. Absent, rien n'est réparti : le guide donne
 * alors les positions qu'il connaît et tait celles qu'il ne connaît pas, plutôt
 * que de proposer un espacement courant.
 */

import { longueurSegment } from './cheminement.js';

/** Interpolation linéaire entre les deux bouts d'un segment. */
function pointA(segment, t) {
  const { de, a } = segment;
  return { x: de.x + (a.x - de.x) * t, y: de.y + (a.y - de.y) * t, z: de.z + (a.z - de.z) * t };
}

const proche = (p, q, tol) =>
  Math.abs(p.x - q.x) <= tol && Math.abs(p.y - q.y) <= tol && Math.abs(p.z - q.z) <= tol;

/**
 * Les points à exclure : une enveloppe, une traversée, ou un changement de
 * direction. Un coude se traite par un accessoire de conduit, et serrer un
 * collier dessus le déforme ; au droit d'une enveloppe il n'y a rien à brider et
 * la place est prise.
 */
export function pointsExclus(modele, cheminement) {
  const exclus = [];
  for (const c of modele.composants ?? []) exclus.push(c.position);
  for (const t of modele.traversees ?? []) exclus.push(t.position);
  const segs = cheminement.segments ?? [];
  for (let i = 1; i < segs.length; i += 1) exclus.push(segs[i].de);
  return exclus;
}

/**
 * Répartit les colliers d'un segment.
 *
 * Un collier près de chaque extrémité — la portée libre en bout est la plus
 * sollicitée —, les intermédiaires régulièrement espacés sans jamais dépasser
 * l'entraxe. Un segment plus court que l'entraxe n'en porte qu'UN : lui en poser
 * deux serait absurde sur les quinze centimètres d'une montée au plafond.
 */
export function colliersDeSegment(segment, entraxe, exclus = [], tol = 0.01) {
  if (!(entraxe > 0)) return null;
  const L = longueurSegment(segment);
  if (L <= 1e-9) return [];

  // Le PLANCHER : en deçà d'un entraxe, un seul collier, au milieu. La valeur se
  // dérive de l'entraxe et ne s'invente pas — c'est pourquoi elle n'est pas un
  // réglage de plus.
  const points = [];
  if (L < entraxe) {
    points.push(pointA(segment, 0.5));
  } else {
    const n = Math.ceil(L / entraxe);
    for (let i = 0; i <= n; i += 1) points.push(pointA(segment, i / n));
  }
  return points.filter((p) => !exclus.some((e) => proche(p, e, tol)));
}

/** Répartition sur tout un cheminement. Rend `null` si l'entraxe est inconnu. */
export function colliersDeCheminement(modele, cheminement, entraxe, tol = 0.01) {
  if (!(entraxe > 0)) return null;
  const exclus = pointsExclus(modele, cheminement);
  return (cheminement.segments ?? []).flatMap((s) => colliersDeSegment(s, entraxe, exclus, tol));
}
