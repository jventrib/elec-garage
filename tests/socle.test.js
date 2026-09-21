import test from 'node:test';
import assert from 'node:assert/strict';
import { SOCLE, copie } from './_aides.js';
import { verifierSocle, FICHIERS_SOCLE, CLES_ATTENDUES } from '../src/donnees/chargement.js';

test('le socle du dépôt est complet', () => {
  assert.doesNotThrow(() => verifierSocle(SOCLE()));
});

test('un fichier de socle absent est nommé', () => {
  for (const cle of Object.keys(FICHIERS_SOCLE)) {
    const s = copie(SOCLE());
    delete s[cle];
    assert.throws(
      () => verifierSocle(s),
      (e) => e.message.includes(FICHIERS_SOCLE[cle]) && /absent ou illisible/.test(e.message),
      `le message doit nommer ${FICHIERS_SOCLE[cle]}`,
    );
  }
});

test('une clé manquante est nommée avec son fichier', () => {
  const s = copie(SOCLE());
  delete s.types.types;
  assert.throws(() => verifierSocle(s), (e) =>
    e.message.includes('data/types-composants.json') && e.message.includes('types'));
});

test('toute clé attendue manquante est détectée, sans exception', () => {
  for (const [cle, attendues] of Object.entries(CLES_ATTENDUES)) {
    for (const attendue of attendues) {
      const s = copie(SOCLE());
      delete s[cle][attendue];
      assert.throws(() => verifierSocle(s), (e) => e.message.includes(attendue),
        `${cle}.${attendue} doit être détectée`);
    }
  }
});

test('le message suggère la piste du cache, qui est la cause la plus fréquente', () => {
  const s = copie(SOCLE());
  delete s.presentation;
  assert.throws(() => verifierSocle(s), /cache/);
});

test('un socle entièrement absent ne provoque pas d’erreur opaque', () => {
  assert.throws(() => verifierSocle(undefined), /Socle de données incomplet/);
  assert.throws(() => verifierSocle({}), /Socle de données incomplet/);
});
