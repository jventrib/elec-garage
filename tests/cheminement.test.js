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

/*
 * Ces deux tests emploient une fixture et non le jeu de démonstration : coder en
 * dur les coordonnées d'un tracé réel les faisait casser à chaque relevé, sans
 * qu'aucune règle n'ait changé.
 */
const FIXTURE = {
  id: 'ch-fixture',
  reference: 'CH-FIXTURE',
  circuits: ['c-x'],
  section: { forme: 'circulaire', diametre: null },
  segments: [
    seg('est', pt(5.6, 1.0, 1.0), pt(5.6, 1.0, 2.0)), // 1,00 m de montée
    seg('est', pt(5.6, 1.0, 2.0), pt(5.6, 3.5, 2.0)), // 2,50 m d'antenne
  ],
};

test('la longueur d’un cheminement est la somme de ses segments', () => {
  assert.equal(longueurCheminement(FIXTURE), 3.5);
  // Rien n'est déclaré : la longueur se déduit.
  assert.equal('longueur' in FIXTURE, false);
});

test('les extrémités sont le premier et le dernier point du parcours', () => {
  const [debut, fin] = extremites(FIXTURE);
  assert.deepEqual(debut, FIXTURE.segments[0].de);
  assert.deepEqual(fin, FIXTURE.segments.at(-1).a);
});

test('la longueur de tout cheminement du dépôt est cohérente avec ses segments', () => {
  const modele = fusionner(socle, [DEMO()]);
  for (const ch of modele.cheminements) {
    const somme = ch.segments.reduce(
      (t, s) => t + Math.hypot(s.a.x - s.de.x, s.a.y - s.de.y, s.a.z - s.de.z),
      0,
    );
    assert.ok(Math.abs(longueurCheminement(ch) - somme) < 1e-9, ch.id);
    assert.ok(longueurCheminement(ch) > 0, `${ch.id} a une longueur nulle`);
  }
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
