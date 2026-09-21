import test from 'node:test';
import assert from 'node:assert/strict';
import { SOCLE, DEMO } from './_aides.js';
import { fusionner } from '../src/donnees/chargement.js';
import { composerSequence } from '../src/sequence/ordonnancement.js';
import { etatAuRang, rangsApparition } from '../src/sequence/etat.js';

const modele = fusionner(SOCLE(), [DEMO()]);
const sequence = composerSequence(modele);
const refs = (liste) => liste.map((c) => c.id).sort();

test('le rang d’apparition est déduit de la première étape de pose', () => {
  const rangs = rangsApparition(sequence);
  const appareillage = sequence.etapes.find((e) => e.id === 'd-appareillage');
  assert.equal(rangs.get('pc-01'), appareillage.rang);
  const tableau = sequence.etapes.find((e) => e.id === 'd-tableau');
  assert.equal(rangs.get('tableau'), tableau.rang);
  // Rien n'est déclaré dans les données : le champ n'existe pas.
  assert.equal('rangApparition' in modele.composants[0], false);
});

test('la partition couvre exactement tous les composants, à chaque rang', () => {
  for (let r = 1; r <= sequence.total; r++) {
    const e = etatAuRang(sequence, modele.composants, r);
    assert.equal(e.enPlace.length + e.ajoutes.length + e.absents.length, modele.composants.length);
    const tous = [...refs(e.enPlace), ...refs(e.ajoutes), ...refs(e.absents)].sort();
    assert.deepEqual(tous, refs(modele.composants));
  }
});

test('l’état est une fonction pure du rang : identique sur tous les rangs', () => {
  for (let r = 1; r <= sequence.total; r++) {
    const a = etatAuRang(sequence, modele.composants, r);
    const b = etatAuRang(sequence, modele.composants, r);
    assert.deepEqual(refs(a.enPlace), refs(b.enPlace));
    assert.deepEqual(refs(a.ajoutes), refs(b.ajoutes));
  }
});

test('un aller-retour de profondeur quelconque restitue le même état, sur tous les rangs', () => {
  for (let depart = 1; depart <= sequence.total; depart++) {
    const initial = etatAuRang(sequence, modele.composants, depart);
    for (let profondeur = 1; profondeur < sequence.total; profondeur++) {
      const bas = Math.max(1, depart - profondeur);
      etatAuRang(sequence, modele.composants, bas); // aller
      const retour = etatAuRang(sequence, modele.composants, depart); // et retour
      assert.deepEqual(refs(retour.enPlace), refs(initial.enPlace));
      assert.deepEqual(refs(retour.ajoutes), refs(initial.ajoutes));
      assert.deepEqual(refs(retour.absents), refs(initial.absents));
    }
  }
});

test('ce qui est posé ne disparaît jamais quand on avance', () => {
  let precedent = [];
  for (let r = 1; r <= sequence.total; r++) {
    const e = etatAuRang(sequence, modele.composants, r);
    const acquis = [...e.enPlace, ...e.ajoutes].map((c) => c.id);
    for (const id of precedent) assert.ok(acquis.includes(id), `${id} a disparu au rang ${r}`);
    precedent = acquis;
  }
});

test('au dernier rang, tout composant posé est en place', () => {
  const e = etatAuRang(sequence, modele.composants, sequence.total);
  assert.equal(e.absents.length, 0);
});
