/**
 * Deux appareils dans un même boîtier.
 *
 * Un boîtier à deux postes porte deux mécanismes distants d'environ 8 cm. Le
 * second n'est l'extrémité d'aucun conduit : sans la notion de boîtier partagé,
 * la règle V16 le déclare **non atteignable depuis le tableau**, ce qui est faux —
 * il est raccordé aux bornes de son voisin, dans une enceinte accessible.
 *
 * Les deux contournements ont été écartés. Déclarer les deux au même point
 * superposerait deux marqueurs, alors que FR-006 de `001` exige la cote réelle.
 * Tracer entre eux un conduit de 8 cm fabriquerait un conduit qui n'existe pas —
 * exactement le genre de donnée fausse que ce dossier s'applique à éviter.
 *
 * Ce test est écrit AVANT l'extension et doit échouer : c'est le seul moyen de
 * savoir qu'il mesure quelque chose.
 */

import test from 'node:test';
import assert from 'node:assert/strict';
import { SOCLE, DEMO, copie } from './_aides.js';
import { fusionner } from '../src/donnees/chargement.js';
import { construireGraphe, atteignablesDepuisTableau } from '../src/geometrie/graphe.js';

const modeleDe = (apport) => fusionner(SOCLE(), [apport]);
const accesDe = (apport, circuit = 'c-demo') => {
  const m = modeleDe(apport);
  return atteignablesDepuisTableau(construireGraphe(m), m, circuit);
};

/** Ajoute un composant au jeu de démonstration, posé par l'étape d'appareillage. */
function ajouter(apport, composant) {
  apport.composants.push({
    type: 'commande', paroi: 'est', face: 'interieur',
    hauteurAxe: composant.position.z, indiceProtection: null, circuit: 'c-demo',
    ...composant,
  });
  apport.etapes.find((e) => e.id === 'd-appareillage').composants.push(composant.id);
  return apport;
}

test('un composant qui partage le boîtier d’un composant atteignable est atteignable', () => {
  const a = copie(DEMO());
  // PC-01 est à (5,6 ; 2,6 ; 0,3) et il est atteignable. On pose un second
  // appareil dans son boîtier, décalé de 8 cm comme dans un deux postes.
  const pc01 = a.composants.find((c) => c.reference === 'PC-01');
  pc01.boitier = 'bt-essai';
  ajouter(a, {
    id: 'cm-voisin', reference: 'CM-VOISIN',
    position: { x: pc01.position.x, y: pc01.position.y + 0.08, z: pc01.position.z },
    boitier: 'bt-essai',
  });

  const acces = accesDe(a);
  assert.ok(acces.atteignables.has(pc01.id), 'le premier doit rester atteignable');
  assert.ok(
    acces.atteignables.has('cm-voisin'),
    'le second partage son boîtier : il est raccordé à ses bornes, donc atteignable',
  );
  assert.deepEqual(acces.orphelins, [], 'aucun orphelin ne doit subsister');
});

test('un composant isolé au même endroit reste orphelin', () => {
  // La contrepartie, sans laquelle l'extension ne prouverait rien : la proximité
  // ne suffit pas, c'est le boîtier DÉCLARÉ qui rattache.
  const a = copie(DEMO());
  const pc01 = a.composants.find((c) => c.reference === 'PC-01');
  ajouter(a, {
    id: 'cm-isole', reference: 'CM-ISOLE',
    position: { x: pc01.position.x, y: pc01.position.y + 0.08, z: pc01.position.z },
  });

  const acces = accesDe(a);
  assert.equal(acces.atteignables.has('cm-isole'), false, 'sans boîtier déclaré, rien ne le rattache');
  assert.ok(acces.orphelins.includes('cm-isole'));
});

test('le partage ne fabrique pas d’atteignabilité à partir de rien', () => {
  // Deux composants partageant un boîtier, mais dont AUCUN n'est sur un conduit :
  // ils doivent rester orphelins tous les deux. Sans cette borne, l'extension
  // rendrait atteignable n'importe quel groupe isolé.
  const a = copie(DEMO());
  for (const [id, dy] of [['cm-a', 0], ['cm-b', 0.08]]) {
    ajouter(a, {
      id, reference: id.toUpperCase(),
      position: { x: 5.6, y: 4.5 + dy, z: 1.2 },
      boitier: 'bt-orphelin',
    });
  }
  const acces = accesDe(a);
  assert.equal(acces.atteignables.has('cm-a'), false);
  assert.equal(acces.atteignables.has('cm-b'), false);
  assert.ok(acces.orphelins.includes('cm-a') && acces.orphelins.includes('cm-b'));
});

test('un boîtier partagé par trois appareils les rattache tous', () => {
  const a = copie(DEMO());
  const pc01 = a.composants.find((c) => c.reference === 'PC-01');
  pc01.boitier = 'bt-triple';
  for (const [id, dy] of [['cm-x', 0.08], ['cm-y', 0.16]]) {
    ajouter(a, {
      id, reference: id.toUpperCase(),
      position: { x: pc01.position.x, y: pc01.position.y + dy, z: pc01.position.z },
      boitier: 'bt-triple',
    });
  }
  const acces = accesDe(a);
  assert.ok(acces.atteignables.has('cm-x') && acces.atteignables.has('cm-y'));
  assert.deepEqual(acces.orphelins, []);
});
