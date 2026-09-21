/**
 * La répartition des colliers, et ce qu'elle refuse de faire.
 *
 * Elle est dérivée, jamais déclarée. Le test le plus important de ce fichier est
 * celui qui vérifie qu'un entraxe absent ne produit PAS d'espacement courant :
 * c'est la discipline que `fournitures` tient depuis le début — « l'entraxe est
 * une donnée du fabricant, pas une cote de projet » — et la seule chose qui
 * empêcherait un guide de perçage de présenter une hypothèse comme une cote.
 */

import test from 'node:test';
import assert from 'node:assert/strict';
import { SOCLE, PRISES, ECLAIRAGE, BORNE, copie } from './_aides.js';
import { fusionner } from '../src/donnees/chargement.js';
import { entraxeDe, chevilleDe } from '../src/donnees/validation.js';
import { colliersDeSegment, colliersDeCheminement, pointsExclus } from '../src/geometrie/fixations.js';

const seg = (z1, z2) => ({ face: 'est', de: { x: 5.6, y: 0.7, z: z1 }, a: { x: 5.6, y: 0.7, z: z2 } });

test('sans entraxe renseigné, rien n’est réparti', () => {
  // LE test du fichier. Un espacement courant substitué à un entraxe absent
  // ferait passer une hypothèse pour une cote, et le guide de perçage cesserait
  // d'être opposable.
  assert.equal(colliersDeSegment(seg(0, 3), null), null);
  assert.equal(colliersDeSegment(seg(0, 3), 0), null);
  const m = fusionner(SOCLE(), [PRISES(), ECLAIRAGE(), BORNE()]);
  assert.equal(entraxeDe(SOCLE()), null, 'le dépôt ne renseigne aucun entraxe à ce jour');
  assert.equal(colliersDeCheminement(m, m.cheminements[0], entraxeDe(SOCLE())), null);
});

test('sans cheville choisie, ni diamètre ni profondeur', () => {
  assert.equal(chevilleDe(SOCLE()), null);
  const s = copie(SOCLE());
  s.chantier.fixations.cheville.diametre = 0.008;
  assert.deepEqual(chevilleDe(s), { diametre: 0.008, profondeur: null },
    'un diamètre sans profondeur se déclare tel quel, il ne se complète pas');
});

test('un collier près de chaque extrémité de segment', () => {
  const pts = colliersDeSegment(seg(0, 3), 0.6);
  assert.ok(Math.abs(pts[0].z - 0) < 1e-9, 'un collier au départ');
  assert.ok(Math.abs(pts[pts.length - 1].z - 3) < 1e-9, 'un collier à l’arrivée');
});

test('l’entraxe n’est jamais dépassé', () => {
  for (const [L, e] of [[3, 0.6], [2.9, 0.6], [1.01, 0.5], [7.3, 0.8]]) {
    const pts = colliersDeSegment(seg(0, L), e);
    for (let i = 1; i < pts.length; i += 1) {
      const d = Math.abs(pts[i].z - pts[i - 1].z);
      assert.ok(d <= e + 1e-9, `portée de ${d.toFixed(3)} m pour un entraxe de ${e}`);
    }
  }
});

test('un segment plus court que l’entraxe ne porte qu’un collier', () => {
  // CH-04 mesurait 0,15 m : deux colliers d'extrémité y seraient absurdes, et le
  // plancher se dérive de l'entraxe plutôt que de s'ajouter comme un réglage.
  const pts = colliersDeSegment(seg(0, 0.15), 0.6);
  assert.equal(pts.length, 1);
  assert.ok(Math.abs(pts[0].z - 0.075) < 1e-9, 'et il est au milieu');
});

test('aucun collier sur un coude, une enveloppe ou une traversée', () => {
  const exclus = [{ x: 5.6, y: 0.7, z: 1.2 }];
  const sans = colliersDeSegment(seg(0, 3), 0.6);
  const avec = colliersDeSegment(seg(0, 3), 0.6, exclus);
  assert.equal(sans.length - avec.length, 1, 'le point occupé est écarté');
  assert.equal(avec.some((p) => Math.abs(p.z - 1.2) < 1e-9), false);
});

test('les points exclus couvrent les trois natures', () => {
  const m = fusionner(SOCLE(), [PRISES(), ECLAIRAGE(), BORNE()]);
  const ch = m.cheminements.find((c) => (c.segments ?? []).length > 1);
  const exclus = pointsExclus(m, ch);
  const dedans = (p) => exclus.some((e) => Math.abs(e.x - p.x) < 1e-9 && Math.abs(e.y - p.y) < 1e-9 && Math.abs(e.z - p.z) < 1e-9);
  assert.ok(dedans(m.composants[0].position), 'une enveloppe est exclue');
  assert.ok(dedans(m.traversees[0].position), 'une traversée est exclue');
  assert.ok(dedans(ch.segments[1].de), 'un changement de direction est exclu');
});

test('la répartition suit le tracé : elle ne déclare aucune position en dur', () => {
  const a = copie(PRISES());
  const ch = a.cheminements.find((c) => c.reference === 'CH-03');
  const avant = colliersDeSegment(ch.segments[0], 0.6).length;
  // On allonge le premier segment : la répartition doit suivre, sans rien de figé.
  ch.segments[0].a.y += 1.2;
  const apres = colliersDeSegment(ch.segments[0], 0.6).length;
  assert.ok(apres > avant, `${avant} colliers avant, ${apres} après : la dérivation suit le tracé`);
});
