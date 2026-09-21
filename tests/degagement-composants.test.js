/**
 * Le dégagement des COMPOSANTS contre les obstacles.
 *
 * `collision.js:80` n'oppose que les **cheminements** aux obstacles. Les socles,
 * les boîtes et la borne ne sont contrôlés par rien : leurs marges ont toujours
 * été calculées à la main, dans les documents d'implantation, et aucune
 * vérification n'échouerait si l'une d'elles devenait négative.
 *
 * Ce fichier ne comble pas la lacune — il la borne, sur le cas où elle est la plus
 * serrée. Le contrôle général des composants relève d'un changement distinct et
 * concerne les onze socles du projet.
 *
 * PC-05 est le cas serré : il est passé de y = 2,70 à 2,60 le 2026-09-23 quand
 * BD-05 a rejoint l'axe ouest de BD-01, et sa marge au rail est tombée de 0,155 m
 * à 0,055 m. Contre un obstacle RELEVÉ, non borné.
 */

import test from 'node:test';
import assert from 'node:assert/strict';
import { SOCLE, PRISES, ECLAIRAGE, BORNE } from './_aides.js';
import { fusionner } from '../src/donnees/chargement.js';
import { gabarit } from '../src/scene/composants.js';

const modele = () => fusionner(SOCLE(), [PRISES(), ECLAIRAGE(), BORNE()]);

/** Enveloppe d'un composant, gabarit compris, dans le repère du local. */
function enveloppe(m, composant) {
  const { dims, decalage } = gabarit(composant, m.types);
  const p = composant.position;
  const c = { x: p.x + decalage[0], y: p.y + decalage[1], z: p.z + decalage[2] };
  return {
    min: { x: c.x - dims[0] / 2, y: c.y - dims[1] / 2, z: c.z - dims[2] / 2 },
    max: { x: c.x + dims[0] / 2, y: c.y + dims[1] / 2, z: c.z + dims[2] / 2 },
  };
}

/** Écart entre deux volumes ; négatif s'ils se recoupent. */
function ecart(a, b) {
  return Math.max(...['x', 'y', 'z'].map((k) => Math.max(a.min[k] - b.max[k], b.min[k] - a.max[k])));
}

test('le boîtier de PC-05 dégage le rail de motorisation', () => {
  const m = modele();
  const pc05 = m.composants.find((c) => c.reference === 'PC-05');
  const rail = m.local.obstacles.find((o) => /[Rr]ail/.test(o.libelle ?? '') && o.volume);
  assert.ok(rail, 'le rail doit porter un volume relevé');
  const d = ecart(enveloppe(m, pc05), rail.volume);
  assert.ok(d > 0, `PC-05 recoupe le rail : écart de ${d.toFixed(3)} m`);
  // La marge est de 0,055 m depuis le 2026-09-23, contre 0,155 auparavant. Si ce
  // chiffre baisse encore, c'est une décision, pas un effet de bord.
  assert.ok(
    d > 0.05,
    `marge de ${d.toFixed(3)} m au rail : elle est passée de 0,155 à 0,055 m le 2026-09-23, et descendre plus bas doit être décidé`,
  );
});

test('le boîtier de PC-05 dégage le majorant du tablier ouvert', () => {
  const m = modele();
  const pc05 = m.composants.find((c) => c.reference === 'PC-05');
  const tablier = m.local.obstacles.find((o) => /[Tt]ablier/.test(o.libelle ?? '') && o.volumeMajorant);
  assert.ok(tablier, 'le tablier ouvert doit porter un majorant');
  const d = ecart(enveloppe(m, pc05), tablier.volumeMajorant);
  // Un majorant n'autorise qu'un verdict : être à l'écart démontre le dégagement.
  assert.ok(d > 0, `PC-05 recoupe le majorant du tablier : écart de ${d.toFixed(3)} m`);
});

test('aucun composant du plafond ne recoupe le rail', () => {
  const m = modele();
  const rail = m.local.obstacles.find((o) => /[Rr]ail/.test(o.libelle ?? '') && o.volume);
  for (const c of m.composants.filter((x) => x.paroi === 'plafond')) {
    const d = ecart(enveloppe(m, c), rail.volume);
    assert.ok(d > 0, `« ${c.reference} » recoupe le rail : écart de ${d.toFixed(3)} m`);
  }
});

test('les trois branches de BD-05 partent dans trois directions distinctes', () => {
  // La contrainte qui a décidé de la position de PC-05, et que rien ne tient :
  // V20 ne voit une superposition que si elle se produit effectivement. Ici on
  // vérifie la cause plutôt que le symptôme.
  const m = modele();
  const bd05 = m.composants.find((c) => c.reference === 'BD-05');
  const p = bd05.position;
  const memePoint = (q) => ['x', 'y', 'z'].every((k) => Math.abs(q[k] - p[k]) < 1e-6);
  const directions = new Set();
  for (const ch of m.cheminements) {
    for (const s of ch.segments ?? []) {
      for (const [ici, la] of [[s.de, s.a], [s.a, s.de]]) {
        if (!memePoint(ici)) continue;
        for (const k of ['x', 'y', 'z']) {
          const delta = la[k] - ici[k];
          if (Math.abs(delta) > 1e-6) directions.add(`${k}${delta > 0 ? '+' : '-'}`);
        }
      }
    }
  }
  assert.equal(
    directions.size,
    3,
    `BD-05 a ${directions.size} direction(s) distincte(s) : ${[...directions].join(', ')} — trois conduits doivent diverger`,
  );
});
