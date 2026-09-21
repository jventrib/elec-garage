/**
 * D'où regarder un objet, et de quelle distance.
 *
 * Rien n'est choisi : l'objet déclare déjà sa paroi, sa face et son encombrement.
 * Le cas qui justifie la dérivation est celui d'une face extérieure — la regarder
 * depuis l'intérieur n'en montrerait que la paroi, et l'erreur serait invisible
 * dans le code et évidente à l'écran.
 */

import test from 'node:test';
import assert from 'node:assert/strict';
import { SOCLE, PRISES, ECLAIRAGE, BORNE } from './_aides.js';
import { fusionner } from '../src/donnees/chargement.js';
import { cadrageDe, distanceDeCadrage, directionDeVue, anglesDepuisDirection } from '../src/geometrie/cadrage.js';

const socle = () => SOCLE();
const modele = () => fusionner(socle(), [PRISES(), ECLAIRAGE(), BORNE()]);
const comp = (m, r) => m.composants.find((c) => c.reference === r);

test('une face extérieure se regarde du dehors, une face intérieure du dedans', () => {
  assert.deepEqual(directionDeVue({ paroi: 'est', face: 'exterieur' }), { x: 1, y: 0, z: 0 });
  assert.deepEqual(directionDeVue({ paroi: 'est', face: 'interieur' }), { x: -1, y: 0, z: 0 });
  assert.deepEqual(directionDeVue({ paroi: 'nord', face: 'exterieur' }), { x: 0, y: 1, z: 0 });
  assert.deepEqual(directionDeVue({ paroi: 'sud', face: 'interieur' }), { x: 0, y: 1, z: 0 });
});

test('un objet de plafond se regarde par en dessous', () => {
  // Sa face utile est tournée vers le sol : le regarder d'au-dessus montrerait
  // la dalle.
  assert.deepEqual(directionDeVue({ paroi: 'plafond', face: 'interieur' }), { x: 0, y: 0, z: -1 });
});

test('les cinq parois et les deux faces sont couvertes', () => {
  for (const paroi of ['est', 'ouest', 'nord', 'sud', 'plafond']) {
    for (const face of ['interieur', 'exterieur']) {
      const d = directionDeVue({ paroi, face });
      assert.ok(d, `${paroi}/${face} doit avoir une direction`);
      assert.ok(Math.hypot(d.x, d.y, d.z) > 0, 'et elle ne doit pas être nulle');
    }
  }
  assert.equal(directionDeVue({ paroi: 'inconnue', face: 'interieur' }), null);
});

test('PC-02 se regarde du dehors, PC-05 par en dessous', () => {
  const m = modele();
  assert.deepEqual(cadrageDe(comp(m, 'PC-02'), 'composant', m.types).direction, { x: 1, y: 0, z: 0 },
    'PC-02 est en face extérieure sur la paroi est');
  assert.deepEqual(cadrageDe(comp(m, 'PC-05'), 'composant', m.types).direction, { x: 0, y: 0, z: -1 },
    'PC-05 est au plafond');
});

test('la distance suit l’encombrement, et le tableau se regarde de plus loin', () => {
  const m = modele();
  const r = socle().presentation.camera;
  const d = (ref) => distanceDeCadrage(cadrageDe(comp(m, ref), 'composant', m.types).etendue, r);
  assert.ok(d('TD-01') > d('PC-02'), `tableau ${d('TD-01')} doit dépasser socle ${d('PC-02')}`);
  for (const ref of ['TD-01', 'PC-02', 'PC-05']) {
    assert.ok(d(ref) >= r.rayonMin && d(ref) <= r.rayonMax, `${ref} doit rester dans les bornes d’orbite`);
  }
});

test('les quatre natures rendent une étendue', () => {
  const m = modele();
  assert.ok(cadrageDe(comp(m, 'PC-01'), 'composant', m.types).etendue > 0);
  assert.ok(cadrageDe(m.cheminements[0], 'cheminement').etendue > 0);
  assert.ok(cadrageDe(m.traversees[0], 'traversee', m.types, m.local).etendue > 0, 'l’épaisseur de paroi');
  const avecVolume = m.local.obstacles.find((o) => o.volume);
  assert.ok(cadrageDe(avecVolume, 'obstacle').etendue > 0);
});

test('un obstacle SANS étendue ne se cadre pas', () => {
  // LE test du fichier. Un obstacle sans volume ni majorant ne se cadre pas : lui
  // inventer une étendue ferait passer une absence de cote pour une cote. Le
  // vantail et le tablier fermé en sont sortis le 2026-09-23, par relevé ; le cas
  // se construit ici pour que le test ne dépende pas de l'état du relevé.
  const m = modele();
  m.local.obstacles.push({ id: 'sans-etendue', libelle: 'Sans étendue', etat: 'ferme', volume: null, incertain: true });
  const sans = m.local.obstacles.filter((o) => !o.volume && !o.volumeMajorant);
  assert.ok(sans.length >= 1);
  for (const o of sans) {
    assert.equal(cadrageDe(o, 'obstacle'), null, `« ${o.libelle ?? o.id} » ne doit pas se cadrer`);
  }
});

test('un obstacle borné par un majorant se cadre, et reste un majorant', () => {
  // Un majorant est une CONSÉQUENCE de cotes relevées, pas une invention : on peut
  // regarder au bon endroit. Ce que le cadrage ne doit pas faire, c'est changer la
  // nature de ce qui est affiché.
  const m = modele();
  const maj = m.local.obstacles.find((o) => !o.volume && o.volumeMajorant);
  assert.ok(maj, 'le tablier remonté est borné par un majorant');
  const c = cadrageDe(maj, 'obstacle');
  assert.ok(c && c.etendue > 0, 'il se cadre');
  // Le relevé écrit `volume: null` plutôt que d'omettre la clé : une cote absente
  // se déclare, elle ne se devine pas à l'absence d'un champ.
  assert.equal(maj.volume ?? null, null, 'et il ne gagne pas de volume au passage');
  assert.equal(maj.incertain, true, 'ni ne cesse d’être incertain');
});

test('une direction se convertit en angles d’orbite', () => {
  const a = anglesDepuisDirection({ x: 1, y: 0, z: 0 });
  assert.ok(Math.abs(a.theta) < 1e-9, 'theta nul vers +x');
  assert.ok(Math.abs(a.phi - Math.PI / 2) < 1e-9, 'phi à l’horizontale');
  const b = anglesDepuisDirection({ x: 0, y: 0, z: -1 });
  assert.ok(Math.abs(b.phi - Math.PI) < 1e-9, 'phi au nadir pour une vue par en dessous');
  assert.equal(anglesDepuisDirection(null), null);
});
