/**
 * Une étape de perçage déclare ce qu'elle fait percer.
 *
 * Les trois étapes de la phase `percage` déclaraient `composants: []` et
 * `cheminements: []` : pour la seule opération irréversible du chantier, la vue
 * était vide et l'instruction écrite portait tout.
 *
 * Le champ est `fixations`, et il est DISTINCT de `composants` : ce dernier
 * signifie POSER. Les y mettre a été essayé, et faisait apparaître socles, boîtes
 * et conduits en place pendant qu'on perce — ce que le registre visuel interdit,
 * et exactement l'ambiguïté qui conduit à raccorder trop tôt.
 */

import test from 'node:test';
import assert from 'node:assert/strict';
import { SOCLE, PRISES, ECLAIRAGE, BORNE, copie } from './_aides.js';
import { fusionner } from '../src/donnees/chargement.js';
import { composerSequence } from '../src/sequence/ordonnancement.js';
import { rangsApparition } from '../src/sequence/etat.js';
import { validerModele } from '../src/donnees/validation.js';

const modele = (...ap) => fusionner(SOCLE(), ap.length ? ap : [PRISES(), ECLAIRAGE(), BORNE()]);

test('chaque étape de perçage déclare des fixations ou des traversées', () => {
  const m = modele();
  const seq = composerSequence(m);
  const perc = seq.etapes.filter((e) => e.phase === 'percage');
  assert.ok(perc.length > 0, 'la phase de perçage doit exister');
  for (const e of perc) {
    const n = (e.fixations ?? []).length + (e.traversees ?? []).length;
    assert.ok(n > 0, `« ${e.id} » ne déclare aucun perçage`);
  }
});

test('V23 refuse une étape de perçage qui ne déclare rien', () => {
  const a = copie(PRISES());
  const e = a.etapes.find((x) => x.phase === 'percage');
  e.fixations = [];
  e.traversees = [];
  const m = modele(a, ECLAIRAGE(), BORNE());
  const d = validerModele(m, composerSequence(m));
  assert.ok(
    d.some((x) => x.regle === 'V23' && /sans rien déclarer/.test(x.message)),
    'une étape de perçage vide ne s’illustre pas',
  );
});

test('V23 refuse une fixation qui ne désigne rien', () => {
  const a = copie(PRISES());
  a.etapes.find((x) => x.phase === 'percage').fixations.push('fantome');
  const m = modele(a, ECLAIRAGE(), BORNE());
  const d = validerModele(m, composerSequence(m));
  assert.ok(d.some((x) => x.regle === 'V23' && /fantome/.test(x.message)));
});

test('percer pour un objet ne le pose pas', () => {
  // La régression que ce fichier existe pour empêcher. Si `fixations` venait à
  // être fusionné avec `composants`, tout le matériel apparaîtrait en place dès
  // le perçage et l'installateur verrait une installation déjà montée pendant
  // qu'il trace ses trous.
  const m = modele();
  const seq = composerSequence(m);
  const rangs = rangsApparition(seq);
  const percage = seq.etapes.filter((e) => e.phase === 'percage').map((e) => e.rang);
  for (const c of m.composants) {
    const r = rangs.get(c.id);
    assert.equal(
      percage.includes(r),
      false,
      `« ${c.reference} » serait posé à l’étape de perçage : percer n’est pas poser`,
    );
  }
});

test('une traversée, elle, EST posée au perçage', () => {
  // Et c'est juste : un trou à travers la paroi n'a pas d'autre existence que son
  // percement. Le distinguer d'une fixation est le fond de la règle.
  const m = modele();
  const seq = composerSequence(m);
  const rangs = rangsApparition(seq);
  const percage = seq.etapes.filter((e) => e.phase === 'percage').map((e) => e.rang);
  for (const t of m.traversees) {
    assert.ok(percage.includes(rangs.get(t.id)), `« ${t.reference} » doit être percée à la phase de perçage`);
  }
});

test('chaque étape de perçage dit de sonder, et ce qu’il faut chercher', () => {
  // Le risque que le design déclare hors périmètre — l'intérieur du béton —, et
  // qu'il faut donc NOMMER à l'installateur. Un guide silencieux dessus laisserait
  // croire qu'une vue conforme vaut autorisation de percer. La consigne se dit en
  // termes de chantier : quoi sonder, et non ce que la maquette ignore.
  const m = modele();
  for (const e of composerSequence(m).etapes.filter((x) => x.phase === 'percage')) {
    assert.match(e.instruction, /SONDER AVANT DE PERCER/, `« ${e.id} » ne dit pas de sonder`);
    assert.match(e.instruction, /gaine noyée, canalisation, fer/, `« ${e.id} » ne dit pas ce qu'il faut chercher`);
    assert.doesNotMatch(e.instruction, /MODÈLE NE SAIT|MAQUETTE/, `« ${e.id} » parle de la maquette à l'installateur`);
    assert.ok(
      (e.materiel ?? []).some((x) => /[Ss]onde/.test(x)),
      `« ${e.id} » exige de sonder sans porter la sonde à son matériel`,
    );
  }
});
