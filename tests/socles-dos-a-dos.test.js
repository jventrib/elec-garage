/**
 * Un socle extérieur et le socle intérieur qui le dessert sont DOS À DOS.
 *
 * La traversée sort du FOND du boîtier intérieur. Elle franchit donc la paroi sur
 * laquelle ce boîtier est posé, et rien d'autre. Un boîtier vissé sur le mur droit
 * ne peut pas laisser sortir par son fond une traversée du mur du fond : les deux
 * parois sont perpendiculaires.
 *
 * Cette règle était IMPLICITE, et c'est ce qui a rendu le déplacement de PC-04 du
 * 2026-09-23 plus gros que demandé — PC-03 a dû suivre. Sans test, un futur
 * déplacement de l'un des deux passerait inaperçu jusqu'au chantier, et le
 * chantier c'est un trou dans du béton qui ne se rebouche pas.
 */

import test from 'node:test';
import assert from 'node:assert/strict';
import { SOCLE, PRISES, ECLAIRAGE, BORNE, copie } from './_aides.js';
import { fusionner } from '../src/donnees/chargement.js';
import { validerCheminements } from '../src/donnees/validation.js';

const modele = (pr) => fusionner(SOCLE(), [pr ?? PRISES(), ECLAIRAGE(), BORNE()]);

/** L'axe normal d'une paroi : celui que la traversée franchit. */
const NORMALE = { est: 'x', ouest: 'x', nord: 'y', sud: 'y' };

test('chaque traversée franchit la paroi de son boîtier intérieur', () => {
  const m = modele();
  for (const t of m.traversees) {
    const interieur = m.composants.find(
      (c) => c.face === 'interieur' && Math.abs(c.position.x - t.position.x) < 1e-9
        && Math.abs(c.position.y - t.position.y) < 1e-9 && Math.abs(c.position.z - t.position.z) < 1e-9,
    );
    if (!interieur) continue;
    assert.equal(
      interieur.paroi,
      t.paroi,
      `« ${t.reference} » franchit la paroi ${t.paroi} alors que « ${interieur.reference} » est posé sur la paroi ${interieur.paroi}`,
    );
  }
});

test('PC-03 et PC-04 sont dos à dos à travers la paroi nord', () => {
  const m = modele();
  const pc3 = m.composants.find((c) => c.reference === 'PC-03');
  const pc4 = m.composants.find((c) => c.reference === 'PC-04');
  assert.equal(pc3.paroi, 'nord', 'PC-03 est en façade nord depuis le 2026-09-23');
  assert.equal(pc4.paroi, 'nord', 'et PC-04 avec lui, sans quoi le repiquage tombe');
  assert.equal(pc3.face, 'interieur');
  assert.equal(pc4.face, 'exterieur');
  // Dos à dos : même axe dans le plan de la paroi, même hauteur, séparés par les
  // 0,20 m de béton sur la seule normale.
  const n = NORMALE[pc3.paroi];
  for (const axe of ['x', 'y', 'z']) {
    if (axe === n) continue;
    assert.ok(
      Math.abs(pc3.position[axe] - pc4.position[axe]) < 1e-9,
      `PC-03 et PC-04 divergent sur ${axe} : ils ne sont plus au droit l'un de l'autre`,
    );
  }
  assert.ok(
    Math.abs(pc4.position[n] - pc3.position[n] - m.local.epaisseurParois) < 1e-9,
    'ils doivent être séparés exactement par l’épaisseur de la paroi',
  );
});

test('PC-01 et PC-02 restent dos à dos à travers la paroi est', () => {
  // Le contrôle de non-régression : le déplacement du 2026-09-23 ne devait
  // toucher que le couple du fond.
  const m = modele();
  const pc1 = m.composants.find((c) => c.reference === 'PC-01');
  const pc2 = m.composants.find((c) => c.reference === 'PC-02');
  assert.equal(pc1.paroi, 'est');
  assert.equal(pc2.paroi, 'est');
  assert.ok(Math.abs(pc1.position.y - pc2.position.y) < 1e-9);
  assert.ok(Math.abs(pc1.position.z - pc2.position.z) < 1e-9);
});

test('un socle intérieur et son socle extérieur sur des parois perpendiculaires sont refusés', () => {
  // Le scénario que le delta de `installation/cheminements` ajoute. Il n'a
  // d'existence que si un test le porte : on remet PC-03 sur la paroi est en
  // laissant PC-04 et la traversée au nord, et le montage doit être rejeté.
  const a = copie(PRISES());
  const pc3 = a.composants.find((c) => c.reference === 'PC-03');
  pc3.paroi = 'est';
  pc3.position = { x: 5.6, y: 5.45, z: 0.3 };
  const d = validerCheminements(modele(a));
  assert.ok(
    d.length > 0,
    'un boîtier sur une paroi ne peut pas laisser sortir une traversée d’une paroi perpendiculaire',
  );
});
