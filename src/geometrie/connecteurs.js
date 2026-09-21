/**
 * Les connecteurs à poser dans chaque enveloppe de jonction.
 *
 * Un connecteur n'existe que là où un conducteur SE SÉPARE. On le lit sur l'arbre
 * du conducteur, que la dérivation connaît : dans une enveloppe, on compte ses
 * BRINS — les arêtes de l'arbre qui franchissent la frontière de l'enveloppe, plus
 * les extrémités du conducteur qui s'y trouvent, aux bornes d'un appareil logé
 * dedans. Deux brins, le conducteur traverse ou s'arrête : il est d'un seul tenant
 * (décision du maître d'ouvrage du 2026-09-24). Trois ou plus : un connecteur.
 *
 * Compter la FRONTIÈRE et non le degré d'un nœud rend le décompte indifférent au
 * découpage interne : le graphe fait se séparer la phase de MC-01 au bas de la
 * goulotte, le chantier le fait dans son organe de connexion.
 *
 * La référence se tire d'un catalogue déclaré dans les données, et de lui seul.
 * Une section hors de toute plage, un catalogue absent, un circuit non dérivable :
 * le connecteur est INCONNU, et rien ne lui est substitué.
 */

import { pointSurProfile } from './cheminement.js';
import { construireGraphe } from './graphe.js';
import { conducteursDuCircuit } from './conducteurs.js';

const ROLES_JONCTION = new Set(['jonction']);

/** Les nœuds d'une enveloppe de jonction, ou null si l'attribution est ambiguë. */
function noeudsDe(enveloppe, modele, graphe, tol) {
  if (enveloppe.type === 'organe-connexion') {
    // Un organe de connexion abrité par un profilé à raccordement latéral reçoit
    // toutes les connexions du profilé : c'est le seul endroit où la constitution
    // y admet une connexion.
    //
    // Un parcours de goulotte peut compter plusieurs profilés, un par organe : le
    // profilé est le périmètre de l'organe. Leurs bouts partagés — la jonction en T
    // de deux profilés — n'appartiennent à aucun des deux, et un conducteur qui
    // passe de l'un à l'autre y franchit une frontière, sans s'y séparer.
    const lateraux = (modele.cheminements ?? []).filter((ch) => ch.raccordement === 'lateral');
    const porteurs = lateraux.filter((ch) => pointSurProfile(enveloppe.position, ch, tol));
    if (porteurs.length > 1) return null;
    const [profile] = porteurs;
    if (profile) {
      const organes = (modele.composants ?? []).filter(
        (c) => c.type === 'organe-connexion' && pointSurProfile(c.position, profile, tol),
      );
      if (organes.length > 1) return null;
      const autres = lateraux.filter((ch) => ch !== profile);
      return graphe.noeuds.filter(
        (n) => pointSurProfile(n.point, profile, tol) && !autres.some((ch) => pointSurProfile(n.point, ch, tol)),
      );
    }
  }
  if (enveloppe.dimensions && enveloppe.type === 'boite-derivation') return graphe.noeudsDansBoite(enveloppe);
  const propres = [graphe.noeudAu(enveloppe.position)];
  if (enveloppe.boitier) {
    for (const c of modele.composants ?? []) {
      if (c.id !== enveloppe.id && c.boitier === enveloppe.boitier) propres.push(graphe.noeudAu(c.position));
    }
  }
  return propres.filter(Boolean);
}

/** Les nœuds de chaque enveloppe de jonction, par identifiant — null si ambiguë. */
export function noeudsDesEnveloppes(modele, graphe = construireGraphe(modele)) {
  const tol = modele.presentation?.toleranceRaccordement ?? 0;
  const roleDe = (type) => (modele.types?.types ?? []).find((t) => t.id === type)?.role;
  const r = new Map();
  for (const env of modele.composants ?? []) {
    if (ROLES_JONCTION.has(roleDe(env.type))) r.set(env.id, noeudsDe(env, modele, graphe, tol));
  }
  return r;
}

/** Les références dont la plage de section admet `section`, par nombre d'entrées croissant. */
function referencesPour(catalogue, section) {
  if (!catalogue || !Array.isArray(catalogue.references) || typeof section !== 'number') return [];
  return catalogue.references
    .filter((r) => section >= r.sectionMin && section <= r.sectionMax)
    .sort((a, b) => a.entrees - b.entrees);
}

/**
 * Le ou les connecteurs qui réunissent `brins` brins.
 *
 * La plus petite référence qui suffit ; au-delà de la plus grande, une chaîne de
 * connecteurs, chaque liaison occupant une entrée de chacun des deux qu'elle relie.
 * La chaîne la plus courte, et à longueur égale celle qui perd le moins d'entrées.
 */
export function choisirConnecteurs(references, brins) {
  if (references.length === 0) return null;
  const seul = references.find((r) => r.entrees >= brins);
  if (seul) return [seul];
  for (let n = 2; n <= 8; n += 1) {
    let meilleure = null;
    const essayer = (debut, choix) => {
      if (choix.length === n) {
        const utiles = choix.reduce((t, r) => t + r.entrees, 0) - 2 * (n - 1);
        if (utiles < brins) return;
        const perte = utiles - brins;
        if (!meilleure || perte < meilleure.perte) meilleure = { choix: [...choix], perte };
        return;
      }
      for (let i = debut; i < references.length; i += 1) essayer(i, [...choix, references[i]]);
    };
    essayer(0, []);
    if (meilleure) return meilleure.choix.sort((a, b) => b.entrees - a.entrees);
  }
  return null;
}

/**
 * Les connecteurs de chaque enveloppe de jonction, par identifiant d'enveloppe.
 *
 * Chaque entrée : `circuits` — pour chaque circuit présent, ses `connecteurs`
 * (conducteur, brins, références ou null), s'il `traverse` sans connexion, s'il est
 * `inconnu` faute de dérivation —, le `total` par référence, et le nombre de
 * connecteurs `inconnus`. `ambigu` quand l'enveloppe ne peut pas se délimiter.
 */
export function connecteursParEnveloppe(modele, graphe = construireGraphe(modele)) {
  const tol = modele.presentation?.toleranceRaccordement ?? 0;
  const catalogue = modele.chantier?.connecteurs;
  const roleDe = (type) => (modele.types?.types ?? []).find((t) => t.id === type)?.role;
  const enveloppes = (modele.composants ?? []).filter((c) => ROLES_JONCTION.has(roleDe(c.type)));

  const derives = new Map();
  for (const circuit of modele.circuits ?? []) {
    derives.set(circuit.id, conducteursDuCircuit(graphe, modele, circuit.id));
  }

  const resultat = new Map();
  for (const env of enveloppes) {
    const noeuds = noeudsDe(env, modele, graphe, tol);
    if (!noeuds) {
      resultat.set(env.id, { ambigu: true, circuits: [], total: [], inconnus: 0 });
      continue;
    }
    const dedans = new Set(noeuds.map((n) => n.cle));

    // Les circuits présents : ceux d'un conduit qui aborde l'enveloppe.
    const presents = new Set();
    for (const n of noeuds) {
      for (const a of n.aretes) for (const id of a.circuits ?? []) presents.add(id);
    }

    const circuits = [];
    for (const circuit of modele.circuits ?? []) {
      if (!presents.has(circuit.id)) continue;
      const conducteurs = derives.get(circuit.id);
      if (!conducteurs) {
        circuits.push({ circuit: circuit.id, libelle: circuit.libelle, inconnu: true, connecteurs: [], traverse: false });
        continue;
      }
      const references = referencesPour(catalogue, circuit.section);
      const connecteurs = [];
      let touche = false;
      for (const c of conducteurs) {
        const franchies = c.arbre.filter((x) => dedans.has(x.a) !== dedans.has(x.b)).length;
        const bouts = c.extremites.filter((e) => dedans.has(e)).length;
        const internes = c.arbre.some((x) => dedans.has(x.a) && dedans.has(x.b));
        const brins = franchies + bouts;
        if (brins > 0 || internes) touche = true;
        if (brins < 3) continue;
        connecteurs.push({ conducteur: c.libelle, role: c.role, brins, references: choisirConnecteurs(references, brins) });
      }
      if (!touche) continue;
      circuits.push({ circuit: circuit.id, libelle: circuit.libelle, inconnu: false, connecteurs, traverse: connecteurs.length === 0 });
    }

    const compte = new Map();
    let inconnus = 0;
    for (const c of circuits) {
      if (c.inconnu) inconnus += 1;
      for (const k of c.connecteurs) {
        if (!k.references) { inconnus += 1; continue; }
        for (const r of k.references) compte.set(r.reference, (compte.get(r.reference) ?? 0) + 1);
      }
    }
    const total = [...compte.entries()]
      .map(([reference, nombre]) => ({ reference, nombre }))
      .sort((a, b) => a.reference.localeCompare(b.reference));
    resultat.set(env.id, { ambigu: false, circuits, total, inconnus });
  }
  return resultat;
}
