/**
 * Graphe des cheminements : nœuds, degrés, continuité des circuits.
 *
 * Deux questions que l'œil ne voit pas. Une rupture de continuité de trois
 * millimètres enverrait l'installateur percer au mauvais endroit ; un piquage au
 * milieu d'un conduit est une connexion inaccessible, donc invérifiable à vie.
 */

import { sortieDeTraversee } from '../donnees/chargement.js';
import { memePoint, pointDansSegment, pointsDeCheminement } from './cheminement.js';

const cle = (p) => `${p.x.toFixed(4)}|${p.y.toFixed(4)}|${p.z.toFixed(4)}`;

/**
 * Construit le graphe. Les nœuds sont obtenus par agglomération linéaire à la
 * tolérance déclarée, et non par quantification : deux points séparés par moins
 * que la tolérance doivent se rejoindre même s'ils tombent de part et d'autre
 * d'une frontière de grille.
 */
export function construireGraphe(modele) {
  const tol = modele.presentation.toleranceRaccordement;
  const noeuds = [];

  function noeudPour(point) {
    for (const n of noeuds) if (memePoint(n.point, point, tol)) return n;
    const n = {
      cle: cle(point),
      point: { ...point },
      degre: 0,
      composants: [],
      boites: [],
      traversees: [],
      aretes: [],
    };
    noeuds.push(n);
    return n;
  }

  // Les extrémités de segments d'abord : elles définissent la trame.
  const segments = [];
  for (const ch of modele.cheminements ?? []) {
    for (const s of ch.segments ?? []) {
      const a = noeudPour(s.de);
      const b = noeudPour(s.a);
      a.degre += 1;
      b.degre += 1;
      a.aretes.push({ vers: b, cheminement: ch.id, circuits: ch.circuits ?? [] });
      b.aretes.push({ vers: a, cheminement: ch.id, circuits: ch.circuits ?? [] });
      segments.push({ segment: s, cheminement: ch.id });
    }
  }

  // Puis les composants et les traversées, rattachés au nœud qui les porte.
  for (const c of modele.composants ?? []) {
    const n = noeudPour(c.position);
    n.composants.push(c.id);
    if (c.type === 'boite-derivation') n.boites.push(c.id);
  }
  for (const t of modele.traversees ?? []) {
    noeudPour(t.position).traversees.push(t.id);
    const sortie = sortieDeTraversee(modele.local, t);
    if (sortie) {
      const dedans = noeudPour(t.position);
      const dehors = noeudPour(sortie);
      dehors.traverseesSortie = [...(dehors.traverseesSortie ?? []), t.id];
      // Une traversée ponte les deux nus sans être une jonction : elle ne compte
      // pas dans le degré, car aucun conduit ne s'y raccorde à un autre.
      dedans.aretes.push({ vers: dehors, traversee: t.id, circuits: null });
      dehors.aretes.push({ vers: dedans, traversee: t.id, circuits: null });
    }
  }

  // Un piquage au milieu d'un conduit : le conduit traversé y passe, donc il
  // compte pour deux dans le degré du nœud.
  for (const n of noeuds) {
    for (const { segment } of segments) {
      if (pointDansSegment(n.point, segment, tol)) n.degre += 2;
    }
  }

  return {
    noeuds,
    noeudAu(point) {
      return noeuds.find((n) => memePoint(n.point, point, tol)) ?? null;
    },
    noeudsDeDegreAuMoins(n) {
      return noeuds.filter((x) => x.degre >= n);
    },
  };
}

/**
 * Composants d'un circuit atteignables depuis le tableau, en n'empruntant que des
 * cheminements portant ce circuit. Les traversées sont franchissables sans
 * condition : ce sont des passages, pas des conducteurs.
 */
export function atteignablesDepuisTableau(graphe, modele, idCircuit) {
  const tableaux = (modele.composants ?? []).filter((c) => c.type === 'tableau');
  const depart = tableaux
    .map((t) => graphe.noeudAu(t.position))
    .filter(Boolean);

  const vus = new Set();
  const aVoir = [...depart];
  for (const n of depart) vus.add(n.cle);
  while (aVoir.length) {
    const n = aVoir.shift();
    for (const arete of n.aretes) {
      const passable = arete.circuits === null || arete.circuits.includes(idCircuit);
      if (!passable) continue;
      if (vus.has(arete.vers.cle)) continue;
      vus.add(arete.vers.cle);
      aVoir.push(arete.vers);
    }
  }

  const atteignables = new Set();
  for (const n of graphe.noeuds) {
    if (!vus.has(n.cle)) continue;
    for (const id of n.composants) atteignables.add(id);
  }
  const orphelins = (modele.composants ?? [])
    .filter((c) => c.circuit === idCircuit && !atteignables.has(c.id))
    .map((c) => c.id);

  return { atteignables, orphelins, sansTableau: depart.length === 0 };
}

/** Points de tous les cheminements, utile au rendu comme aux contrôles. */
export { pointsDeCheminement };
