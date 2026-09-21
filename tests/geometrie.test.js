import test from 'node:test';
import assert from 'node:assert/strict';
import { LOCAL, copie } from './_aides.js';
import { empriseExterieure, segmentBaie, paroisDuLocal } from '../src/donnees/chargement.js';
import { validerLocal } from '../src/donnees/validation.js';

test("l'emprise extérieure est dérivée et vaut 6,00 × 6,00", () => {
  const local = LOCAL();
  assert.deepEqual(empriseExterieure(local), { x: 6, y: 6 });
  // Le champ ne doit exister nulle part : c'est la garantie de FR-021.
  assert.equal('emprise' in local, false);
  assert.equal('empriseExterieure' in local, false);
});

test('la porte sectionnelle laisse 0,20 m à l’ouest et 0,40 m à l’est', () => {
  const local = LOCAL();
  const baie = local.baies.find((b) => b.id === 'porte-sectionnelle');
  const s = segmentBaie(local, baie);
  assert.equal(s.axe, 'x');
  assert.equal(s.min, 0.2);
  assert.equal(s.max, 5.2);
  assert.equal(s.trumeauAvant, 0.2);
  assert.equal(s.trumeauApres, 0.4);
  assert.equal(s.deborde, false);
});

test('la porte de service occupe y de 1,30 à 2,40 sur la paroi est', () => {
  const local = LOCAL();
  const baie = local.baies.find((b) => b.id === 'porte-service');
  const s = segmentBaie(local, baie);
  assert.equal(s.axe, 'y');
  assert.equal(s.min, 1.3);
  assert.equal(s.max, 2.4);
  assert.equal(s.deborde, false);
});

test('une baie qui déborde de sa paroi est rejetée', () => {
  const local = copie(LOCAL());
  local.baies.find((b) => b.id === 'porte-sectionnelle').largeur = 5.6;
  assert.equal(segmentBaie(local, local.baies[0]).deborde, true);
  assert.ok(validerLocal(local).some((d) => /déborde/.test(d.message)));
});

test('les quatre parois encadrent l’œuvre et donnent 6,00 m hors tout', () => {
  const local = LOCAL();
  const parois = paroisDuLocal(local);
  assert.equal(parois.length, 4);
  const sud = parois.find((p) => p.id === 'sud');
  const nord = parois.find((p) => p.id === 'nord');
  assert.equal(sud.min.y, -0.2);
  assert.equal(nord.max.y, 5.8);
  assert.equal(Math.round((nord.max.y - sud.min.y) * 1e4) / 1e4, 6);
});

test('le relevé du dépôt passe les contrôles structurels', () => {
  assert.deepEqual(validerLocal(LOCAL()), []);
});
