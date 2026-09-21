/**
 * La distance entre deux segments, sur laquelle repose V20.
 *
 * Testée à part et sur des cas dont la réponse se calcule de tête : une fonction
 * de géométrie fausse fait taire une règle sans que rien ne le signale, et c'est
 * exactement ce qui est arrivé à `pointDansSegment`.
 */

import test from 'node:test';
import assert from 'node:assert/strict';
import { distanceSegments, plusProchesPoints, partagentUneExtremite } from '../src/geometrie/cheminement.js';

const seg = (x1, y1, z1, x2, y2, z2) => ({ de: { x: x1, y: y1, z: z1 }, a: { x: x2, y: y2, z: z2 } });
const proche = (v, attendu, message) =>
  assert.ok(Math.abs(v - attendu) < 1e-9, `${message} : ${v} au lieu de ${attendu}`);

test('deux segments sécants ont une distance nulle', () => {
  // Une horizontale et une verticale qui se croisent franchement.
  const h = seg(0, 0, 1, 2, 0, 1);
  const v = seg(1, 0, 0, 1, 0, 2);
  proche(distanceSegments(h, v), 0, 'croisement franc');
  const { p1 } = plusProchesPoints(h, v);
  proche(p1.x, 1, 'abscisse du point de croisement');
  proche(p1.z, 1, 'altitude du point de croisement');
});

test('deux segments parallèles rendent leur écartement, et non zéro', () => {
  // Le cas dégénéré du dénominateur nul : mal traité, il rend n'importe quoi.
  proche(distanceSegments(seg(0, 0, 0, 5, 0, 0), seg(0, 0, 0.1, 5, 0, 0.1)), 0.1, 'parallèles décalés');
  // Parallèles et décalés dans le sens de la longueur, sans recouvrement :
  // la distance est alors celle des extrémités en regard.
  proche(distanceSegments(seg(0, 0, 0, 1, 0, 0), seg(3, 0, 0, 4, 0, 0)), 2, 'colinéaires disjoints');
});

test('le rabattement sur les bords est fait : deux segments qui se manquent', () => {
  // Les axes se couperaient en (1 ; 0 ; 1) si les segments étaient des droites,
  // mais la verticale s'arrête à z = 0,4. Sans rabattement, la distance sortirait nulle.
  const h = seg(0, 0, 1, 2, 0, 1);
  const v = seg(1, 0, 0, 1, 0, 0.4);
  proche(distanceSegments(h, v), 0.6, 'la verticale s’arrête avant');
});

test('un segment de longueur nulle ne fait pas diverger le calcul', () => {
  const point = seg(1, 1, 1, 1, 1, 1);
  proche(distanceSegments(point, seg(0, 1, 1, 2, 1, 1)), 0, 'point sur le segment');
  proche(distanceSegments(point, seg(0, 0, 1, 2, 0, 1)), 1, 'point à un mètre du segment');
});

test('la distance est symétrique', () => {
  const a = seg(0, 0, 2.6, 5, 0, 2.6);
  const b = seg(2, -1, 2, 2, 1, 3);
  proche(distanceSegments(a, b) - distanceSegments(b, a), 0, 'symétrie');
});

test('partagentUneExtremite distingue la jonction du heurt', () => {
  const a = seg(0, 0, 0, 1, 0, 0);
  assert.equal(partagentUneExtremite(a, seg(1, 0, 0, 1, 0, 1), 1e-6), true, 'bout à bout');
  assert.equal(partagentUneExtremite(a, seg(0.5, 0, -1, 0.5, 0, 1), 1e-6), false, 'croisement en plein milieu');
});
