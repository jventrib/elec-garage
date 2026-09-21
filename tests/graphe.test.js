import test from 'node:test';
import assert from 'node:assert/strict';
import { SOCLE, DEMO, copie } from './_aides.js';
import { fusionner } from '../src/donnees/chargement.js';
import { construireGraphe, atteignablesDepuisTableau } from '../src/geometrie/graphe.js';
import { pointDansSegment } from '../src/geometrie/cheminement.js';

const socle = SOCLE();
const modeleDe = (apport) => fusionner(socle, [apport]);
const grapheDe = (apport) => construireGraphe(modeleDe(apport));
const pt = (x, y, z) => ({ x, y, z });

/*
 * Les positions sont lues dans le modèle et non écrites en dur : coder les
 * coordonnées du tracé réel faisait casser ces tests à chaque relevé, alors
 * qu'aucune règle n'avait bougé.
 */
const positionDe = (modele, id) => modele.composants.find((c) => c.id === id).position;
const noeudDuComposant = (modele, graphe, id) => graphe.noeudAu(positionDe(modele, id));

test('la boîte de jonction BD-01 est le nœud le plus ramifié du tracé', () => {
  const m = modeleDe(DEMO());
  const g = construireGraphe(m);
  const n = noeudDuComposant(m, g, 'bd-01');
  assert.ok(n, 'le nœud doit exister');
  assert.deepEqual(n.composants, ['bd-01']);
  const degres = g.noeuds.map((x) => x.degre);
  assert.equal(n.degre, Math.max(...degres), 'BD-01 porte la ramification principale');
  assert.ok(n.degre >= 3, 'et c’est donc bien une jonction');
});

test('chaque boîte de pied est une jonction de trois conduits', () => {
  const m = modeleDe(DEMO());
  const g = construireGraphe(m);
  for (const id of ['bd-03', 'bd-04']) {
    const n = noeudDuComposant(m, g, id);
    assert.equal(n.degre, 3, `${id} : une descente, un socle, une traversée`);
    assert.deepEqual(n.boites, [id]);
  }
});

test('un coude interne à un cheminement est de degré 2 et n’exige pas de boîte', () => {
  const m = modeleDe(DEMO());
  const g = construireGraphe(m);
  // Le coude est la jonction des deux segments du premier cheminement.
  const coude = m.cheminements.find((c) => c.segments.length > 1).segments[0].a;
  const n = g.noeudAu(coude);
  assert.equal(n.degre, 2);
  assert.equal(n.boites.length, 0);
});

test('tout nœud de degré 3 ou plus porte une boîte de dérivation', () => {
  const g = grapheDe(DEMO());
  const jonctions = g.noeudsDeDegreAuMoins(3);
  assert.ok(jonctions.length >= 2, 'le jeu doit contenir de vraies jonctions');
  for (const n of jonctions) {
    assert.equal(n.boites.length >= 1, true, `nœud ${n.cle} sans boîte`);
  }
});

test('un piquage au milieu d’un conduit, hors boîte, est détecté', () => {
  const a = copie(DEMO());
  // Le cas fautif réel : un départ qui se branche au milieu de l'antenne, sans
  // boîte. Le conduit traversé compte pour deux dans le degré du nœud, puisqu'il
  // y passe.
  //
  // Le départ part de z = 2,60, c'est-à-dire EXACTEMENT sur l'antenne de la
  // démonstration. Une version antérieure de cette fixture partait de 2,50, soit
  // dix centimètres plus bas, et passait quand même : pointDansSegment testait la
  // somme des distances aux extrémités, dont la sensibilité à un écart de côté est
  // quadratique. Le test validait donc le défaut au lieu de la règle.
  a.cheminements.push({
    id: 'ch-fautif',
    reference: 'CH-FAUTIF',
    circuits: ['c-demo'],
    segments: [{ face: 'est', de: pt(5.6, 4.0, 2.6), a: pt(5.6, 4.0, 1.8) }],
    section: { forme: 'circulaire', diametre: null },
  });
  const g = grapheDe(a);
  const n = g.noeudAu(pt(5.6, 4.0, 2.6));
  assert.equal(n.degre, 3, 'un piquage en T donne un degré 3');
  assert.equal(n.boites.length, 0, 'et aucune boîte ne le couvre');
});

test('tous les composants du circuit sont atteignables depuis le tableau', () => {
  const m = modeleDe(DEMO());
  const g = construireGraphe(m);
  const r = atteignablesDepuisTableau(g, m, 'c-demo');
  for (const c of m.composants.filter((x) => x.circuit === 'c-demo')) {
    assert.ok(r.atteignables.has(c.id), `${c.reference} inatteignable`);
  }
  assert.deepEqual(r.orphelins, []);
});

test('un composant privé de son cheminement est nommé comme orphelin', () => {
  const a = copie(DEMO());
  a.cheminements = a.cheminements.filter((c) => c.id !== 'ch-09');
  a.etapes.find((e) => e.id === 'd-cheminement').cheminements =
    a.cheminements.map((c) => c.id);
  const m = modeleDe(a);
  const r = atteignablesDepuisTableau(construireGraphe(m), m, 'c-demo');
  assert.deepEqual(r.orphelins, ['pc-05'], 'le défaut doit nommer le composant, pas seulement signaler');
});

test('un tronçon entier détaché du tableau est détecté', () => {
  const a = copie(DEMO());
  // On coupe l'amenée depuis le tableau : tout le reste devient inatteignable,
  // alors que chaque composant reste touché par un segment.
  a.cheminements = a.cheminements.filter((c) => c.id !== 'ch-01');
  a.etapes.find((e) => e.id === 'd-cheminement').cheminements = a.cheminements.map((c) => c.id);
  const m = modeleDe(a);
  const r = atteignablesDepuisTableau(construireGraphe(m), m, 'c-demo');
  assert.ok(r.orphelins.length >= 5, `attendu au moins 5 orphelins, obtenu ${r.orphelins.length}`);
});

test('une traversée relie le nu intérieur au nu extérieur', async () => {
  const { sortieDeTraversee } = await import('../src/donnees/chargement.js');
  const m = modeleDe(DEMO());
  const g = construireGraphe(m);
  const t = m.traversees[0];
  const dedans = g.noeudAu(t.position);
  const dehors = g.noeudAu(sortieDeTraversee(m.local, t));
  assert.ok(dedans && dehors, 'les deux nœuds de la traversée doivent exister');
  assert.deepEqual(dedans.traversees, [t.id]);
  assert.notEqual(dedans.cle, dehors.cle, 'les deux nus sont bien deux nœuds distincts');
  // Sans ce pontage, les points extérieurs seraient orphelins.
  const r = atteignablesDepuisTableau(g, m, 'c-demo');
  assert.ok(r.atteignables.has('pc-02'));
  assert.ok(r.atteignables.has('pc-04'));
});

test('un circuit que nul cheminement ne porte rend tous ses points orphelins', () => {
  const a = copie(DEMO());
  for (const c of a.cheminements) c.circuits = ['c-autre'];
  const m = modeleDe(a);
  const r = atteignablesDepuisTableau(construireGraphe(m), m, 'c-demo');
  assert.ok(r.orphelins.length >= 5);
});

/* ---------------- Longueurs depuis le tableau ---------------- */

test('la longueur jusqu’à un point vaut la somme du tracé qui y mène', async () => {
  const { longueursDepuisTableau } = await import('../src/geometrie/graphe.js');
  const { longueurCheminement } = await import('../src/geometrie/cheminement.js');
  const m = modeleDe(DEMO());
  const r = longueursDepuisTableau(construireGraphe(m), m, 'c-demo');
  // La première boîte est au bout du seul cheminement qui part du tableau.
  const amenee = m.cheminements.find((c) => c.id === 'ch-01');
  assert.ok(Math.abs(r.parComposant.get('bd-01') - longueurCheminement(amenee)) < 1e-9);
  // Aucune longueur n'est déclarée dans les données.
  assert.equal('longueur' in m.composants[0], false);
});

test('le point le plus éloigné est le maximum, et il est nommé', async () => {
  const { longueursDepuisTableau } = await import('../src/geometrie/graphe.js');
  const m = modeleDe(DEMO());
  const r = longueursDepuisTableau(construireGraphe(m), m, 'c-demo');
  const longueurs = m.composants
    .filter((c) => c.circuit === 'c-demo')
    .map((c) => r.parComposant.get(c.id))
    .filter((l) => l !== undefined);
  assert.ok(longueurs.length > 0);
  assert.equal(r.plusLong.longueur, Math.max(...longueurs));
  assert.ok(typeof r.plusLong.reference === 'string' && r.plusLong.reference.length > 0);
  // C'est cette longueur, et non le métré total, qui décide de la chute de tension.
  const metre = m.cheminements.reduce(
    (t, c) => t + c.segments.reduce((u, s) => u + Math.hypot(s.a.x - s.de.x, s.a.y - s.de.y, s.a.z - s.de.z), 0),
    0,
  );
  assert.ok(r.plusLong.longueur < metre, 'le chemin le plus long reste inférieur au métré total');
});

test('le plus court chemin est retenu quand deux tracés mènent au même point', async () => {
  const { longueursDepuisTableau } = await import('../src/geometrie/graphe.js');
  // Fixture minimale : deux parcours de longueurs différentes vers un même point,
  // sur une paroi libre de toute baie.
  const P = (x, y, z) => ({ x, y, z });
  const S = (de, a) => ({ face: 'ouest', de, a });
  const composant = (id, y, z) => ({
    id, reference: id.toUpperCase(), type: id === 'tb' ? 'tableau' : 'socle-simple',
    paroi: 'ouest', face: 'interieur', position: P(0, y, z),
    hauteurAxe: z, indiceProtection: null, circuit: 'c-f',
  });
  const m = {
    ...modeleDe(DEMO()),
    circuits: [{ id: 'c-f', libelle: 'Fixture' }],
    composants: [composant('tb', 1, 1), composant('cible', 3, 1)],
    traversees: [],
    cheminements: [
      { id: 'court', reference: 'COURT', circuits: ['c-f'], section: { forme: 'circulaire', diametre: null },
        segments: [S(P(0, 1, 1), P(0, 3, 1))] },                       // 2,00 m
      { id: 'long', reference: 'LONG', circuits: ['c-f'], section: { forme: 'circulaire', diametre: null },
        segments: [S(P(0, 1, 1), P(0, 1, 2)), S(P(0, 1, 2), P(0, 3, 2)), S(P(0, 3, 2), P(0, 3, 1))] }, // 4,00 m
    ],
  };
  const r = longueursDepuisTableau(construireGraphe(m), m, 'c-f');
  assert.equal(Math.round(r.parComposant.get('cible') * 100) / 100, 2);
});

test('un circuit sans tableau ne prétend pas mesurer', async () => {
  const { longueursDepuisTableau } = await import('../src/geometrie/graphe.js');
  const a = copie(DEMO());
  a.composants = a.composants.filter((c) => c.type !== 'tableau');
  a.etapes.find((e) => e.id === 'd-tableau').composants = [];
  const m = modeleDe(a);
  const r = longueursDepuisTableau(construireGraphe(m), m, 'c-demo');
  assert.equal(r.plusLong, null);
  assert.equal(r.parComposant.size, 0);
});

test('un conduit voisin, non raccordé, ne compte pas comme piquage', () => {
  // La régression que la correction de pointDansSegment a fermée. Le critère
  // précédent — somme des distances aux extrémités — acceptait un écart
  // perpendiculaire de sqrt(tolerance · L / 2), soit 12 cm sur un segment de
  // 2,80 m. Deux conduits parallèles à 10 cm l'un de l'autre, ce qui est la
  // situation normale en pose apparente dès qu'un second circuit longe le
  // premier, étaient donc déclarés raccordés.
  const a = copie(DEMO());
  // L'antenne de la démonstration est à z = 2,60. Un départ à 2,50 ne la touche
  // pas : il passe dessous.
  a.cheminements.push({
    id: 'ch-voisin',
    reference: 'CH-VOISIN',
    circuits: ['c-demo'],
    segments: [{ face: 'est', de: pt(5.6, 4.0, 2.5), a: pt(5.6, 4.0, 1.8) }],
    section: { forme: 'circulaire', diametre: null },
  });
  const g = grapheDe(a);
  const n = g.noeudAu(pt(5.6, 4.0, 2.5));
  assert.equal(n.degre, 1, 'une extrémité pendante, non un piquage');
});

test('le piquage se détecte à la tolérance de raccordement, pas au-delà', () => {
  // La tolérance est celle de data/presentation.json. Ce test fixe la frontière :
  // ce qui est dedans est raccordé, ce qui est dehors ne l'est pas. Sans cette
  // borne, V17 refuse des tracés valides dans les zones encombrées — et une règle
  // qui refuse à tort est une règle dont on cesse de tenir compte.
  const tol = SOCLE().presentation.toleranceRaccordement;
  const antenne = { face: 'est', de: pt(5.6, 2.9, 2.6), a: pt(5.6, 5.4, 2.6) };
  assert.equal(pointDansSegment(pt(5.6, 4.0, 2.6), antenne, tol), true, 'pile dessus');
  assert.equal(pointDansSegment(pt(5.6, 4.0, 2.6 - tol / 2), antenne, tol), true, 'dans la tolérance');
  assert.equal(pointDansSegment(pt(5.6, 4.0, 2.6 - tol * 3), antenne, tol), false, 'au-delà');
  assert.equal(pointDansSegment(pt(5.6, 2.9, 2.6), antenne, tol), false, 'une extrémité n’est pas un piquage');
});
