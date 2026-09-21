/**
 * L'enveloppe d'une boîte, sur laquelle reposent la fusion des nœuds, V20 et V21.
 *
 * Testée à part, et surtout sur les cas où le rangement des dimensions selon la
 * paroi peut se tromper : une largeur mise sur le mauvais axe donne une boîte
 * plausible et fausse, qui exempterait des points qu'elle ne couvre pas.
 */

import test from 'node:test';
import assert from 'node:assert/strict';
import { LOCAL } from './_aides.js';
import { enveloppeDeBoite, pointDansBoite } from '../src/geometrie/enveloppe.js';

const local = LOCAL();
const boite = (paroi, face, position, dimensions) => ({
  id: 'b', reference: 'B', type: 'boite-derivation', paroi, face, position, dimensions,
});
const CUBE = { largeur: 0.12, hauteur: 0.12, profondeur: 0.05 };
// Les bornes sont comparées arrondies : 2,70 + 0,06 vaut 2,7600000000000002 en
// binaire, et une géométrie ne se teste pas à l'égalité stricte de flottants.
const bornes = (e, axe) => [e.min[axe], e.max[axe]].map((v) => Math.round(v * 1e9) / 1e9);

test('une boîte sans dimensions n’a pas d’enveloppe', () => {
  assert.equal(enveloppeDeBoite(local, boite('est', 'interieur', { x: 5.6, y: 2.6, z: 2.6 })), null);
  assert.equal(
    pointDansBoite(local, boite('est', 'interieur', { x: 5.6, y: 2.6, z: 2.6 }), { x: 5.6, y: 2.6, z: 2.6 }),
    false,
    'et ne couvre donc aucun point, pas même le sien',
  );
});

test('sur un mur, la hauteur suit z et la largeur l’axe du plan', () => {
  const b = boite('est', 'interieur', { x: 5.6, y: 2.6, z: 2.6 }, CUBE);
  const e = enveloppeDeBoite(local, b);
  assert.deepEqual(bornes(e, 'y'), [2.54, 2.66], 'largeur sur y, l’axe du plan de la paroi est');
  assert.deepEqual(bornes(e, 'z'), [2.54, 2.66], 'hauteur sur z');
  // La saillie va vers l'INTÉRIEUR du local, donc vers les x décroissants.
  assert.deepEqual(bornes(e, 'x'), [5.55, 5.6], 'profondeur vers l’intérieur');
});

test('une boîte en face extérieure fait saillie vers le dehors', () => {
  const e = enveloppeDeBoite(local, boite('est', 'exterieur', { x: 5.8, y: 2.6, z: 2.6 }, CUBE));
  assert.deepEqual(bornes(e, 'x'), [5.8, 5.85], 'profondeur vers l’extérieur');
});

test('sur la paroi ouest, la saillie change de signe', () => {
  const e = enveloppeDeBoite(local, boite('ouest', 'interieur', { x: 0, y: 2.6, z: 2.6 }, CUBE));
  assert.deepEqual(bornes(e, 'x'), [0, 0.05], 'vers l’intérieur, donc x croissants');
});

test('au plafond, la boîte pend et la largeur suit x', () => {
  const e = enveloppeDeBoite(local, boite('plafond', 'interieur', { x: 2.7, y: 3.0, z: 2.75 }, CUBE));
  assert.deepEqual(bornes(e, 'x'), [2.64, 2.76], 'largeur sur x');
  assert.deepEqual(bornes(e, 'y'), [2.94, 3.06], 'hauteur sur y, faute de mieux au plafond');
  assert.deepEqual(bornes(e, 'z'), [2.7, 2.75], 'profondeur vers le bas');
});

test('pointDansBoite couvre le cas réel qui a motivé l’extension', () => {
  // BD-01, à laquelle la ligne de la borne arrive à z = 2,64 au lieu de 2,60.
  const bd01 = boite('est', 'interieur', { x: 5.6, y: 2.6, z: 2.6 }, CUBE);
  assert.equal(pointDansBoite(local, bd01, { x: 5.6, y: 2.6, z: 2.64 }), true, 'à 0,04 m du centre');
  assert.equal(pointDansBoite(local, bd01, { x: 5.6, y: 2.6, z: 2.68 }), false, 'à 0,08 m, hors d’une boîte de 0,12 m');
  // Et un conduit sur l'AUTRE nu de la même paroi n'est pas dedans.
  assert.equal(pointDansBoite(local, bd01, { x: 5.8, y: 2.6, z: 2.6 }), false, 'autre nu de la paroi');
});

test('une dimension absente ou nulle annule l’enveloppe, elle ne la devine pas', () => {
  for (const d of [{ largeur: 0.12, hauteur: 0.12 }, { largeur: 0, hauteur: 0.12, profondeur: 0.05 }]) {
    assert.equal(enveloppeDeBoite(local, boite('est', 'interieur', { x: 5.6, y: 2.6, z: 2.6 }, d)), null);
  }
});
