import test from 'node:test';
import assert from 'node:assert/strict';
import { SOCLE, DEMO, copie } from './_aides.js';
import { fusionner } from '../src/donnees/chargement.js';
import { construireGraphe, atteignablesDepuisTableau } from '../src/geometrie/graphe.js';

const socle = SOCLE();
const modeleDe = (apport) => fusionner(socle, [apport]);
const grapheDe = (apport) => construireGraphe(modeleDe(apport));
const pt = (x, y, z) => ({ x, y, z });

test('la boîte de jonction BD-01 est un nœud de degré 4', () => {
  const g = grapheDe(DEMO());
  const n = g.noeudAu(pt(5.6, 2.9, 2.5));
  assert.ok(n, 'le nœud doit exister');
  assert.equal(n.degre, 4);
  assert.deepEqual(n.composants, ['bd-01']);
});

test('la boîte de pied BD-03 est un nœud de degré 3', () => {
  const g = grapheDe(DEMO());
  const n = g.noeudAu(pt(5.6, 2.9, 1.5));
  assert.equal(n.degre, 3);
  assert.deepEqual(n.boites, ['bd-03']);
});

test('un coude interne à un cheminement est de degré 2 et n’exige pas de boîte', () => {
  const g = grapheDe(DEMO());
  assert.equal(g.noeudAu(pt(5.6, 0.6, 2.5)).degre, 2);
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
  a.cheminements.push({
    id: 'ch-fautif',
    reference: 'CH-FAUTIF',
    circuits: ['c-demo'],
    segments: [{ face: 'est', de: pt(5.6, 4.0, 2.5), a: pt(5.6, 4.0, 1.8) }],
    diametre: null,
  });
  const g = grapheDe(a);
  const n = g.noeudAu(pt(5.6, 4.0, 2.5));
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

test('une traversée relie le nu intérieur au nu extérieur', () => {
  const m = modeleDe(DEMO());
  const g = construireGraphe(m);
  const dedans = g.noeudAu(pt(5.6, 3.25, 1.5));
  const dehors = g.noeudAu(pt(5.8, 3.25, 1.5));
  assert.ok(dedans && dehors, 'les deux nœuds de la traversée doivent exister');
  assert.deepEqual(dedans.traversees, ['tv-01']);
  // Sans ce pontage, PC-02 serait orphelin.
  const r = atteignablesDepuisTableau(g, m, 'c-demo');
  assert.ok(r.atteignables.has('pc-02'));
});

test('un circuit que nul cheminement ne porte rend tous ses points orphelins', () => {
  const a = copie(DEMO());
  for (const c of a.cheminements) c.circuits = ['c-autre'];
  const m = modeleDe(a);
  const r = atteignablesDepuisTableau(construireGraphe(m), m, 'c-demo');
  assert.ok(r.orphelins.length >= 5);
});
