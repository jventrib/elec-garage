import test from 'node:test';
import assert from 'node:assert/strict';
import { SOCLE, DEMO, copie } from './_aides.js';
import { fusionner } from '../src/donnees/chargement.js';
import {
  estOrthogonal,
  appuiSurFace,
  longueurCheminement,
  extremites,
  memePoint,
} from '../src/geometrie/cheminement.js';

const socle = SOCLE();
const local = socle.local;
const TOL = socle.presentation.toleranceRaccordement;
const pt = (x, y, z) => ({ x, y, z });
const seg = (face, de, a) => ({ face, de, a });

test('un segment vertical sur une paroi est orthogonal', () => {
  assert.equal(estOrthogonal(seg('est', pt(5.6, 2.9, 2.5), pt(5.6, 2.9, 1.5))), true);
});

test('un segment horizontal sur une paroi est orthogonal', () => {
  assert.equal(estOrthogonal(seg('est', pt(5.6, 0.6, 2.5), pt(5.6, 2.9, 2.5))), true);
});

test('un segment en diagonale sur une paroi est rejeté', () => {
  // Les deux axes de la face varient : c'est précisément ce que la constitution refuse.
  assert.equal(estOrthogonal(seg('est', pt(5.6, 0.6, 1.5), pt(5.6, 2.9, 2.3))), false);
});

test('un segment en diagonale au plafond est rejeté', () => {
  assert.equal(estOrthogonal(seg('plafond', pt(5.6, 2.9, 2.75), pt(2.8, 2.8, 2.75))), false);
});

test('un segment de longueur nulle est rejeté', () => {
  assert.equal(estOrthogonal(seg('est', pt(5.6, 2.9, 2.3), pt(5.6, 2.9, 2.3))), false);
});

test('un segment qui quitte le plan de sa face est rejeté', () => {
  // La coordonnée normale à la face doit rester constante : un conduit ne traverse
  // pas la paroi, il court dessus.
  assert.equal(estOrthogonal(seg('est', pt(5.6, 2.9, 2.3), pt(5.7, 2.9, 1.2))), false);
});

test('un segment repose sur le nu intérieur ou sur le nu extérieur', () => {
  assert.equal(appuiSurFace(local, seg('est', pt(5.6, 1, 1), pt(5.6, 2, 1))).ok, true);
  assert.equal(appuiSurFace(local, seg('est', pt(5.8, 1, 1), pt(5.8, 2, 1))).ok, true);
});

test('un segment flottant entre les deux nus est rejeté', () => {
  const r = appuiSurFace(local, seg('est', pt(5.7, 1, 1), pt(5.7, 2, 1)));
  assert.equal(r.ok, false);
  assert.match(r.message, /nu/);
});

test('un segment qui sort des limites de sa face est rejeté', () => {
  const r = appuiSurFace(local, seg('est', pt(5.6, 5.0, 1), pt(5.6, 6.4, 1)));
  assert.equal(r.ok, false);
  assert.match(r.message, /limites/);
});

test('un segment au plafond repose sur la sous-face et reste dans l’œuvre', () => {
  assert.equal(appuiSurFace(local, seg('plafond', pt(1, 1, 2.75), pt(3, 1, 2.75))).ok, true);
  assert.equal(appuiSurFace(local, seg('plafond', pt(1, 1, 2.6), pt(3, 1, 2.6))).ok, false);
});

test('la longueur d’un cheminement est dérivée de ses segments', () => {
  const modele = fusionner(socle, [DEMO()]);
  const ch01 = modele.cheminements.find((c) => c.id === 'ch-01');
  // 1,00 m de montée depuis le tableau puis 2,30 m jusqu'à la première boîte.
  assert.equal(Math.round(longueurCheminement(ch01) * 1000) / 1000, 3.3);
  // Rien n'est déclaré dans les données.
  assert.equal('longueur' in ch01, false);
});

test('les extrémités d’un cheminement sont son premier et son dernier point', () => {
  const modele = fusionner(socle, [DEMO()]);
  const ch01 = modele.cheminements.find((c) => c.id === 'ch-01');
  const [debut, fin] = extremites(ch01);
  assert.deepEqual(debut, { x: 5.6, y: 0.6, z: 1.5 });
  assert.deepEqual(fin, { x: 5.6, y: 2.9, z: 2.5 });
});

test('la tolérance de raccordement est réellement appliquée', () => {
  // Le test qui compte : il prouve que la tolérance n'est ni ignorée, ni infinie.
  const juste = TOL / 2;
  const trop = TOL * 2;
  assert.equal(memePoint(pt(1, 1, 1), pt(1 + juste, 1, 1), TOL), true);
  assert.equal(memePoint(pt(1, 1, 1), pt(1 + trop, 1, 1), TOL), false);
});

test('tous les segments du jeu de démonstration sont orthogonaux et appuyés', () => {
  const modele = fusionner(socle, [DEMO()]);
  for (const ch of modele.cheminements) {
    for (const [i, s] of ch.segments.entries()) {
      assert.equal(estOrthogonal(s), true, `${ch.id} segment ${i + 1} non orthogonal`);
      const a = appuiSurFace(local, s);
      assert.equal(a.ok, true, `${ch.id} segment ${i + 1} : ${a.message}`);
    }
  }
});

test('un jeu fautif est bien fautif — segment diagonal injecté', () => {
  const a = copie(DEMO());
  a.cheminements[0].segments[0].a = pt(5.6, 1.5, 2.5);
  const modele = fusionner(socle, [a]);
  const ch = modele.cheminements[0];
  assert.equal(estOrthogonal(ch.segments[0]), false);
});
