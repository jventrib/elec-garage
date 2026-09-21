import test from 'node:test';
import assert from 'node:assert/strict';
import { SOCLE, DEMO } from './_aides.js';
import { fusionner } from '../src/donnees/chargement.js';
import { composerSequence } from '../src/sequence/ordonnancement.js';
import { creerLecteur, stockageMemoire, CLE_POSITION } from '../src/sequence/lecteur.js';

const sequence = composerSequence(fusionner(SOCLE(), [DEMO()]));
const neuf = (stockage = stockageMemoire()) => creerLecteur({ sequence, stockage });

test('le lecteur ouvre au rang 1 et connaît le total', () => {
  const l = neuf();
  assert.equal(l.rang, 1);
  assert.equal(l.total, sequence.total);
  assert.equal(l.etape().id, sequence.etapes[0].id);
});

test('reculer depuis la première étape est refusé sans erreur', () => {
  const l = neuf();
  assert.equal(l.peutReculer(), false);
  assert.equal(l.reculer(), false);
  assert.equal(l.rang, 1);
});

test('avancer depuis la dernière étape est refusé sans erreur', () => {
  const l = neuf();
  l.allerA(sequence.total);
  assert.equal(l.peutAvancer(), false);
  assert.equal(l.avancer(), false);
  assert.equal(l.rang, sequence.total);
});

test('un aller-retour ramène au même rang et à la même étape', () => {
  const l = neuf();
  l.allerA(6);
  const avant = l.etape().id;
  l.reculer();
  l.reculer();
  l.reculer();
  l.avancer();
  l.avancer();
  l.avancer();
  assert.equal(l.rang, 6);
  assert.equal(l.etape().id, avant);
});

test('l’accès direct refuse un rang hors limites sans bouger', () => {
  const l = neuf();
  l.allerA(3);
  assert.equal(l.allerA(0), false);
  assert.equal(l.allerA(sequence.total + 1), false);
  assert.equal(l.allerA(2.5), false);
  assert.equal(l.rang, 3);
});

test('la position est restituée à la réouverture', () => {
  const s = stockageMemoire();
  neuf(s).allerA(7);
  const repris = neuf(s);
  assert.equal(repris.rang, 7);
  assert.equal(repris.positionPerdue, false);
});

test('une empreinte périmée ramène au rang 1 en le signalant', () => {
  const s = stockageMemoire();
  s.ecrire(CLE_POSITION, JSON.stringify({ rang: 5, empreinte: 'obsolete' }));
  const l = neuf(s);
  assert.equal(l.rang, 1);
  assert.equal(l.positionPerdue, true);
});

test('un rang enregistré au-delà de la séquence ramène au rang 1 en le signalant', () => {
  const s = stockageMemoire();
  s.ecrire(CLE_POSITION, JSON.stringify({ rang: sequence.total + 10, empreinte: sequence.empreinte }));
  const l = neuf(s);
  assert.equal(l.rang, 1);
  assert.equal(l.positionPerdue, true);
});

test('une position illisible ramène au rang 1 sans exception', () => {
  const s = stockageMemoire();
  s.ecrire(CLE_POSITION, 'ceci n’est pas du JSON');
  const l = neuf(s);
  assert.equal(l.rang, 1);
  assert.equal(l.positionPerdue, true);
});

test('un stockage qui lève à l’écriture n’empêche pas la navigation', () => {
  const stockage = {
    lire: () => null,
    ecrire() {
      throw new Error('stockage indisponible');
    },
  };
  let lecteur;
  assert.doesNotThrow(() => {
    lecteur = creerLecteur({ sequence, stockage });
  });
  assert.equal(lecteur.avancer(), true);
  assert.equal(lecteur.rang, 2);
});

test('un stockage qui lève à la lecture n’empêche pas l’ouverture', () => {
  const stockage = {
    lire() {
      throw new Error('stockage indisponible');
    },
    ecrire() {},
  };
  let lecteur;
  assert.doesNotThrow(() => {
    lecteur = creerLecteur({ sequence, stockage });
  });
  assert.equal(lecteur.rang, 1);
  assert.equal(lecteur.positionPerdue, true);
});

test('le lecteur reste inerte sur une séquence vide', () => {
  const l = creerLecteur({ sequence: { etapes: [], total: 0, empreinte: 'x' }, stockage: stockageMemoire() });
  assert.equal(l.rang, 0);
  assert.equal(l.etape(), null);
  assert.equal(l.avancer(), false);
  assert.equal(l.reculer(), false);
});
