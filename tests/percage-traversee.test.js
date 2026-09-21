/**
 * La géométrie de perçage d'une traversée.
 *
 * `penteVersExterieur` était un booléen, et V18 le contrôlait comme tel. Un
 * booléen se vérifie APRÈS le perçage, à l'eau ; il ne se perce pas. Deux
 * personnes lisant « pente vers l'extérieur » en tirent deux angles, dont l'un
 * peut être nul — et le nul est précisément la faute que la pente écarte.
 *
 * `position` est désormais l'AXE du perçage : la mèche entre un demi-dénivelé
 * au-dessus et ressort un demi-dénivelé au-dessous. C'est ce qui permet à deux
 * boîtiers dos à dos, à la même hauteur d'axe, de recevoir un perçage en biais
 * sans que l'un des deux sorte de son enveloppe.
 */

import test from 'node:test';
import assert from 'node:assert/strict';
import { SOCLE, PRISES, ECLAIRAGE, BORNE, copie } from './_aides.js';
import { fusionner, entreeDeTraversee, sortieDeTraversee } from '../src/donnees/chargement.js';
import { validerApport, validerCheminements } from '../src/donnees/validation.js';

const socle = () => SOCLE();
const modele = (pr) => fusionner(socle(), [pr ?? PRISES(), ECLAIRAGE(), BORNE()]);
const v18 = (m) => validerCheminements(m).filter((d) => d.regle === 'V18');

test('une traversée doit porter son dénivelé, fût-il inconnu', () => {
  const a = copie(PRISES());
  delete a.traversees[0].denivele;
  assert.ok(
    validerApport(a, socle()).some((x) => /denivele absent/.test(x.message)),
    'omettre la cote n’est pas la déclarer inconnue',
  );
});

test('un dénivelé négatif est refusé, null est admis', () => {
  const neg = copie(PRISES());
  neg.traversees[0].denivele = -0.05;
  assert.ok(validerApport(neg, socle()).some((x) => /denivele doit être un nombre positif/.test(x.message)));

  const nul = copie(PRISES());
  nul.traversees[0].denivele = null;
  assert.equal(
    validerApport(nul, socle()).some((x) => /denivele/.test(x.message)),
    false,
    'une cote non établie se déclare, elle ne se devine pas',
  );
});

test('sans dénivelé établi, la géométrie reste celle d’avant', () => {
  // Le contrat de non-régression : les traversées du dossier qui déclarent `null`
  // — toutes sauf TV-L2, cotée depuis la goulotte GL-02 — gardent leur géométrie.
  const m = modele();
  for (const t of m.traversees.filter((x) => x.denivele === null)) {
    const e = entreeDeTraversee(m.local, t);
    const s = sortieDeTraversee(m.local, t);
    assert.equal(e.z, t.position.z, `${t.reference} : entrée sur l’axe`);
    assert.equal(s.z, t.position.z, `${t.reference} : sortie sur l’axe`);
  }
  assert.deepEqual(v18(m), [], 'et aucune ne doit être en défaut');
});

test('un dénivelé déclaré fait descendre la sortie sous l’entrée', () => {
  const a = copie(PRISES());
  const t = a.traversees.find((x) => x.reference === 'TV-01');
  t.denivele = 0.04;
  const m = fusionner(socle(), [a, ECLAIRAGE(), BORNE()]);
  const tv = m.traversees.find((x) => x.reference === 'TV-01');
  const e = entreeDeTraversee(m.local, tv);
  const s = sortieDeTraversee(m.local, tv);
  assert.ok(Math.abs(e.z - (tv.position.z + 0.02)) < 1e-9, 'entrée un demi-dénivelé au-dessus de l’axe');
  assert.ok(Math.abs(s.z - (tv.position.z - 0.02)) < 1e-9, 'sortie un demi-dénivelé au-dessous');
  assert.ok(s.z < e.z, 'et la sortie est bien la plus basse');
});

test('V18 refuse un dénivelé qui ne fait pas descendre la sortie', () => {
  const a = copie(PRISES());
  a.traversees.find((x) => x.reference === 'TV-01').denivele = 0;
  const defauts = v18(fusionner(socle(), [a, ECLAIRAGE(), BORNE()]));
  assert.ok(
    defauts.some((d) => /percement horizontal annule la pente/.test(d.message)),
    'un dénivelé nul est un percement horizontal, et c’est la faute nommée',
  );
});

test('le dénivelé est borné par la réserve du boîtier qui reçoit la traversée', () => {
  // La mèche entre au-dessus de l'axe et sort au-dessous : les deux doivent
  // tenir dans l'enveloppe. Un dénivelé plus grand que la hauteur du boîtier
  // ferait sortir le perçage de la boîte qu'il est censé desservir.
  const a = copie(PRISES());
  a.traversees.find((x) => x.reference === 'TV-01').denivele = 0.5;
  const defauts = v18(fusionner(socle(), [a, ECLAIRAGE(), BORNE()]));
  assert.ok(
    defauts.some((d) => /supérieur à la réserve/.test(d.message)),
    'un dénivelé qui déborde l’enveloppe doit être refusé',
  );
});
