/**
 * Le trajet des conducteurs qui passent par un objet désigné.
 *
 * Désigner un conduit, une boîte ou un appareil, c'est demander d'où viennent et où
 * vont les conducteurs qui s'y trouvent. La réponse est dans la dérivation : chaque
 * conducteur connaît son arbre — les arêtes du graphe qu'il parcourt — et ses
 * appareils d'extrémité. Ce module choisit les conducteurs concernés et rend, circuit
 * par circuit, l'union de leurs arbres : leur trajet entier, jusqu'à chacune de leurs
 * arrivées, et non le seul morceau voisin de l'objet.
 *
 * Il ne dessine rien : il rend des segments et des identifiants.
 */

import { construireGraphe } from './graphe.js';
import { conducteursDuCircuit } from './conducteurs.js';
import { noeudsDesEnveloppes } from './connecteurs.js';
import { sortieDeTraversee } from '../donnees/chargement.js';

/**
 * Les conducteurs de chaque circuit, dérivés une fois. `null` pour un circuit dont
 * le trajet ne se dérive pas.
 */
export function deriverConducteurs(modele, graphe = construireGraphe(modele)) {
  return new Map((modele.circuits ?? []).map((c) => [c.id, conducteursDuCircuit(graphe, modele, c.id)]));
}

/** Les clés de nœud par lesquelles un appareil se reconnaît dans un arbre. */
function noeudsDeLAppareil(composant, graphe, enveloppes) {
  const ens = enveloppes.get(composant.id);
  if (ens) return new Set(ens.map((n) => n.cle));
  const n = graphe.noeudAu(composant.position);
  return new Set(n ? [n.cle] : []);
}

/**
 * Les trajets de l'objet désigné.
 *
 * `cible` : `{ genre: 'cheminement' | 'composant' | 'traversee', id }`.
 *
 * Rend un trajet par circuit concerné : `{ circuit, libelle, inconnu, conducteurs,
 * segments, appareils }`. `segments` sont des paires de points, sans doublon, et
 * portent `ordre` quand un fil d'ordre du circuit y passe — qu'il passe ou non par
 * l'objet désigné ;
 * `appareils` les identifiants des extrémités. Un circuit concerné dont le trajet ne
 * se dérive pas est rendu `inconnu`, sans segment : rien n'est deviné.
 */
export function trajetsDe(modele, cible, {
  graphe = construireGraphe(modele),
  derives = deriverConducteurs(modele, graphe),
  enveloppes = noeudsDesEnveloppes(modele, graphe),
} = {}) {
  if (!cible) return [];
  const points = new Map(graphe.noeuds.map((n) => [n.cle, n.point]));
  const composant = cible.genre === 'composant' ? (modele.composants ?? []).find((c) => c.id === cible.id) : null;
  const cheminement = cible.genre === 'cheminement' ? (modele.cheminements ?? []).find((c) => c.id === cible.id) : null;
  const traversee = cible.genre === 'traversee' ? (modele.traversees ?? []).find((t) => t.id === cible.id) : null;
  if (!composant && !cheminement && !traversee) return [];

  const noeudsAppareil = composant ? noeudsDeLAppareil(composant, graphe, enveloppes) : null;
  const sortie = traversee ? graphe.noeudAu(sortieDeTraversee(modele.local, traversee) ?? traversee.position) : null;

  const touche = (c) => {
    if (cheminement) return c.cheminements.includes(cheminement.id);
    if (traversee) return !!sortie && c.arbre.some((x) => x.a === sortie.cle || x.b === sortie.cle);
    if (c.appareils.includes(composant.id)) return true;
    return c.arbre.some((x) => noeudsAppareil.has(x.a) || noeudsAppareil.has(x.b));
  };

  // Les circuits qui peuvent être concernés, pour dire « inconnu » d'un circuit non
  // dérivable plutôt que de le taire.
  const candidats = new Set(
    cheminement ? cheminement.circuits ?? []
      : composant ? [composant.circuit, ...(modele.circuits ?? []).map((c) => c.id)].filter(Boolean)
        : (modele.circuits ?? []).map((c) => c.id),
  );

  const trajets = [];
  for (const circuit of modele.circuits ?? []) {
    if (!candidats.has(circuit.id)) continue;
    const conducteurs = derives.get(circuit.id);
    if (!conducteurs) {
      // Inconnu seulement là où le circuit est certainement en cause : il est porté
      // par le cheminement désigné, ou c'est celui de l'appareil désigné.
      const enCause = cheminement || (composant && composant.circuit === circuit.id);
      if (enCause) trajets.push({ circuit: circuit.id, libelle: circuit.libelle ?? circuit.id, inconnu: true, conducteurs: [], segments: [], appareils: [] });
      continue;
    }
    const concernes = conducteurs.filter(touche);
    if (concernes.length === 0) continue;
    // Les arêtes où passe un FIL D'ORDRE du circuit : il ne porte aucune puissance, et
    // se confondre avec la phase dans un tube est exactement ce qu'il ne faut pas.
    // TOUS les fils d'ordre du circuit, et non ceux seuls qui passent par l'objet
    // désigné : la teinte dit ce que chaque tronçon CONTIENT. Désigner CH-05, qui n'en
    // porte aucun des prises, montre quand même foncés les tronçons du circuit où
    // court le fil du bouton de porte.
    const cleDe = (a, b) => (a < b ? `${a}|${b}` : `${b}|${a}`);
    const avecOrdre = new Set(
      conducteurs.filter((c) => c.role === 'ordre').flatMap((c) => c.arbre.map(({ a, b }) => cleDe(a, b))),
    );
    const vus = new Set();
    const segments = [];
    for (const c of concernes) {
      for (const { a, b } of c.arbre) {
        const k = cleDe(a, b);
        if (vus.has(k)) continue;
        vus.add(k);
        if (points.has(a) && points.has(b)) segments.push({ de: points.get(a), a: points.get(b), ordre: avecOrdre.has(k) });
      }
    }
    trajets.push({
      circuit: circuit.id,
      libelle: circuit.libelle ?? circuit.id,
      inconnu: false,
      conducteurs: concernes.map((c) => c.libelle),
      segments,
      appareils: [...new Set(concernes.flatMap((c) => c.appareils))],
    });
  }
  return trajets;
}
