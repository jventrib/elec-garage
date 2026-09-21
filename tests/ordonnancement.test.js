import test from 'node:test';
import assert from 'node:assert/strict';
import { SOCLE, DEMO, copie } from './_aides.js';
import { fusionner } from '../src/donnees/chargement.js';
import { composerSequence, dedupliquerEtapesCommunes } from '../src/sequence/ordonnancement.js';
import { rangPhase } from '../src/sequence/phases.js';
const CHANTIER = SOCLE().chantier;
const rang = (phase) => rangPhase(CHANTIER, phase);

const sequenceDe = (...apports) => composerSequence(fusionner(SOCLE(), apports));
const ids = (seq) => seq.etapes.map((e) => e.id);

/** Deuxième contributeur, pour éprouver la fusion. */
function secondApport() {
  return {
    fonctionnalite: '003-eclairage',
    provenance: { schemaUnifilaire: null, noteDeCalcul: null, releve: '2026-09-21' },
    circuits: [{ id: 'c-ecl', libelle: 'Éclairage' }],
    composants: [
      { id: 'l-01', reference: 'L-01', type: 'luminaire', paroi: 'plafond', face: 'interieur',
        position: { x: 1.5, y: 2.8, z: 2.75 }, hauteurAxe: 2.75, indiceProtection: null, circuit: 'c-ecl' },
    ],
    etapes: [
      { id: 'e-consignation', phase: 'consignation', nature: 'consignation', sousTension: false,
        instruction: 'Consigner (doublon volontaire).', composants: [], materiel: [], dependances: [] },
      { id: 'e-cheminement', phase: 'cheminement', nature: 'pose', sousTension: false,
        instruction: 'Poser les gaines d’éclairage.', composants: [], materiel: [], dependances: ['e-consignation'] },
      { id: 'e-appareillage', phase: 'appareillage', nature: 'pose', sousTension: false,
        instruction: 'Poser le luminaire.', composants: ['l-01'], materiel: [], dependances: ['e-cheminement'] },
      { id: 'e-levee', phase: 'levee-consignation', nature: 'levee-consignation', sousTension: false,
        instruction: 'Lever la consignation (doublon volontaire).', composants: [], materiel: [], dependances: ['e-appareillage'] },
    ],
  };
}

test('la séquence est identique d’une composition à l’autre', () => {
  assert.deepEqual(ids(sequenceDe(DEMO())), ids(sequenceDe(DEMO())));
});

test('l’ordre de présentation des apports ne change pas la séquence', () => {
  const direct = sequenceDe(DEMO(), secondApport());
  const inverse = sequenceDe(secondApport(), DEMO());
  assert.deepEqual(ids(direct), ids(inverse));
  assert.equal(direct.empreinte, inverse.empreinte);
});

test('réordonner les déclarations ne casse ni les phases ni les dépendances', () => {
  // L'ordre de déclaration départage volontairement les ex æquo (R6) : c'est le
  // levier dont dispose le concepteur pour ranger des étapes que ni la phase ni
  // une dépendance ne séparent. Le réordonner PEUT donc changer leur ordre
  // relatif. Ce qui ne doit jamais bouger, c'est tout le reste.
  const melange = copie(DEMO());
  melange.etapes.reverse();
  const seq = sequenceDe(melange);
  const reference = sequenceDe(DEMO());

  assert.deepEqual([...ids(seq)].sort(), [...ids(reference)].sort());
  assert.deepEqual(
    seq.etapes.map((e) => rang(e.phase)),
    reference.etapes.map((e) => rang(e.phase)),
  );
  const rangs = new Map(seq.etapes.map((e) => [e.id, e.rang]));
  for (const e of seq.etapes) {
    for (const d of e.dependances) assert.ok(rangs.get(d) < e.rang);
  }
});

test('à phase et dépendances égales, l’ordre de déclaration départage', () => {
  const a = copie(DEMO());
  const essais = a.etapes.filter((e) => e.phase === 'essais-hors-tension').map((e) => e.id);
  assert.ok(essais.length >= 2, 'le jeu de démonstration doit contenir des ex æquo');

  const attendu = sequenceDe(a).etapes.filter((e) => e.phase === 'essais-hors-tension').map((e) => e.id);
  assert.deepEqual(attendu, essais);

  // On permute deux ex æquo dans la déclaration : la séquence suit.
  const permute = copie(a);
  const i = permute.etapes.findIndex((e) => e.id === essais[0]);
  const j = permute.etapes.findIndex((e) => e.id === essais[1]);
  [permute.etapes[i], permute.etapes[j]] = [permute.etapes[j], permute.etapes[i]];
  const obtenu = sequenceDe(permute).etapes.filter((e) => e.phase === 'essais-hors-tension').map((e) => e.id);
  assert.deepEqual(obtenu.slice(0, 2), [essais[1], essais[0]]);
});

test('les rangs de phase sont croissants le long de la séquence', () => {
  const seq = sequenceDe(DEMO(), secondApport());
  const rangs = seq.etapes.map((e) => rang(e.phase));
  assert.deepEqual(rangs, [...rangs].sort((a, b) => a - b));
});

test('consignation et levée n’apparaissent qu’une fois malgré deux contributeurs', () => {
  const seq = sequenceDe(DEMO(), secondApport());
  assert.equal(seq.etapes.filter((e) => e.nature === 'consignation').length, 1);
  assert.equal(seq.etapes.filter((e) => e.nature === 'levee-consignation').length, 1);
  assert.deepEqual(seq.defauts, []);
});

test('les dépendances vers une étape dédupliquée sont redirigées', () => {
  const { etapes, redirection } = dedupliquerEtapesCommunes([
    ...DEMO().etapes,
    ...secondApport().etapes,
  ]);
  assert.ok(redirection.has('e-consignation'));
  const cheminement = etapes.find((e) => e.id === 'e-cheminement');
  assert.deepEqual(cheminement.dependances, ['d-consignation']);
});

test('toute dépendance précède l’étape qui la déclare', () => {
  const seq = sequenceDe(DEMO(), secondApport());
  const rangs = new Map(seq.etapes.map((e) => [e.id, e.rang]));
  for (const e of seq.etapes) {
    for (const d of e.dependances) assert.ok(rangs.get(d) < e.rang, `${d} doit précéder ${e.id}`);
  }
});

test('une boucle ressort comme défaut sans exception ni séquence partielle silencieuse', () => {
  const a = copie(DEMO());
  a.etapes.find((e) => e.id === 'd-boites').dependances = ['d-tirage'];
  a.etapes.find((e) => e.id === 'd-tirage').dependances = ['d-boites'];
  const seq = sequenceDe(a);
  assert.ok(seq.defauts.some((d) => d.regle === 'V5'));
});

test('l’empreinte change quand une instruction change', () => {
  const a = copie(DEMO());
  a.etapes[0].instruction += ' (modifiée)';
  assert.notEqual(sequenceDe(a).empreinte, sequenceDe(DEMO()).empreinte);
});
