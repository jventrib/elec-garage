import test from 'node:test';
import assert from 'node:assert/strict';
import { SOCLE, DEMO, copie } from './_aides.js';
import { fusionner } from '../src/donnees/chargement.js';
import { VERDICTS, verdictSegment, controlerCollisions } from '../src/geometrie/collision.js';

const socle = SOCLE();
const pt = (x, y, z) => ({ x, y, z });
const seg = (face, de, a) => ({ face, de, a });

const obstacleConnu = (min, max) => ({
  id: 'obs-connu',
  etat: 'ferme',
  incertain: false,
  volume: { min, max },
});
const obstacleIncertain = { id: 'obs-incertain', etat: 'ouvert', incertain: true, volume: null };

test('un segment qui traverse un obstacle de volume connu est en collision', () => {
  const o = obstacleConnu(pt(5.5, 2.0, 1.0), pt(5.9, 3.5, 2.6));
  assert.equal(verdictSegment(seg('est', pt(5.6, 2.9, 2.5), pt(5.6, 2.9, 1.5)), o), VERDICTS.COLLISION);
});

test('un segment à l’écart d’un obstacle de volume connu est conforme', () => {
  const o = obstacleConnu(pt(0.0, 0.0, 0.0), pt(1.0, 1.0, 1.0));
  assert.equal(verdictSegment(seg('est', pt(5.6, 2.9, 2.5), pt(5.6, 2.9, 1.5)), o), VERDICTS.CONFORME);
});

test('un obstacle de volume inconnu rend NON CONCLUANT, jamais conforme', () => {
  // L'assertion qui protège contre une réponse rassurante plutôt que contre une
  // erreur. Trois obstacles sur quatre sont dans ce cas aujourd'hui.
  const v = verdictSegment(seg('est', pt(5.6, 2.9, 2.5), pt(5.6, 2.9, 1.5)), obstacleIncertain);
  assert.equal(v, VERDICTS.NON_CONCLUANT);
  assert.notEqual(v, VERDICTS.CONFORME);
});

test('un obstacle marqué incertain avec un volume renseigné reste non concluant', () => {
  const o = { ...obstacleConnu(pt(0, 0, 0), pt(1, 1, 1)), incertain: true };
  assert.equal(verdictSegment(seg('est', pt(5.6, 2.9, 2.5), pt(5.6, 2.9, 1.5)), o), VERDICTS.NON_CONCLUANT);
});

test('les trois verdicts sont trois valeurs distinctes', () => {
  const v = new Set(Object.values(VERDICTS));
  assert.equal(v.size, 3);
});

test('sur le jeu de démonstration, aucun contrôle ne peut conclure favorablement', () => {
  // Les quatre obstacles du relevé ont un volume null : rail, vantail, gabarit
  // véhicule, débattement des portières.
  const m = fusionner(socle, [DEMO()]);
  const r = controlerCollisions(m);
  assert.ok(r.resultats.length > 0, 'il doit y avoir des contrôles à faire');
  assert.equal(r.conformes, 0);
  assert.equal(r.collisions, 0);
  assert.equal(r.nonConcluants, r.resultats.length);
});

test('le résumé nomme la cote manquante qui empêche de conclure', () => {
  const m = fusionner(socle, [DEMO()]);
  const r = controlerCollisions(m);
  assert.ok(r.obstaclesNonConcluants.length >= 1);
  for (const o of r.obstaclesNonConcluants) {
    assert.ok(typeof o.id === 'string' && o.id.length > 0);
    assert.ok(typeof o.raison === 'string' && o.raison.length > 0);
  }
});

test('un obstacle de volume connu produit un vrai verdict sur le jeu complet', () => {
  const socleModifie = copie(socle);
  const obs = socleModifie.local.obstacles.find((o) => o.id === 'tablier-sectionnelle-ouvert');
  obs.incertain = false;
  obs.volume = { min: { x: 0, y: 0, z: 2.2 }, max: { x: 5.6, y: 5.6, z: 2.75 } };
  const m = fusionner(socleModifie, [DEMO()]);
  const r = controlerCollisions(m);
  // Le tablier occupe le haut du volume : l'antenne horizontale à 2,50 m le rencontre.
  assert.ok(r.collisions > 0, 'une collision réelle doit être trouvée');
  assert.ok(r.resultats.some((x) => x.verdict === VERDICTS.COLLISION && x.obstacle === obs.id));
});
