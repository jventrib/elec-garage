/**
 * L'ordre de montage d'une installation en saillie.
 *
 * Arrêté par le maître d'ouvrage le 2026-09-22, et il a corrigé trois choses que
 * la version d'origine avait à l'envers. Le motif est unique et il est pratique :
 * **ne jamais avoir à percer ou fixer un élément déjà câblé.**
 *
 *   1. Il n'y avait **aucune phase de perçage**. On traçait et perçait au fil de
 *      la pose, ce qui met du béton en poudre sur des boîtes déjà posées et
 *      oblige à déposer un boîtier pour percer la traversée qu'il couvre.
 *   2. « cheminement » venait **avant** « boites ». Or les tubes s'emboîtent
 *      ENTRE les boîtes : les poser d'abord est impossible.
 *   3. « tableau » était en **deuxième position**, juste après la consignation.
 *      On y raccordait donc les départs d'un circuit qui n'existait pas encore.
 *
 * S'y ajoute « connexions », qui manquait : les raccordements en boîte se font
 * tous ensemble, entre le tirage et l'appareillage.
 *
 * Ce fichier teste l'ORDRE, pas le contenu des étapes. Il porte sur le catalogue
 * du socle et sur les quatre apports à la fois.
 */

import test from 'node:test';
import assert from 'node:assert/strict';
import { SOCLE, PRISES, ECLAIRAGE, BORNE } from './_aides.js';
import { fusionner } from '../src/donnees/chargement.js';
import { composerSequence } from '../src/sequence/ordonnancement.js';
import { rangPhase } from '../src/sequence/phases.js';

const socle = SOCLE();
const modele = fusionner(socle, [PRISES(), ECLAIRAGE(), BORNE()]);
const sequence = composerSequence(modele);
const rang = (p) => rangPhase(socle.chantier, p);

test('on perce tout avant de fixer quoi que ce soit', () => {
  assert.ok(rang('percage') >= 0, 'la phase de perçage doit exister');
  for (const apres of ['boites', 'cheminement', 'tirage', 'connexions', 'appareillage', 'tableau']) {
    assert.ok(
      rang('percage') < rang(apres),
      `le perçage doit précéder « ${apres} » : on ne perce pas à côté d'un élément déjà posé`,
    );
  }
});

test('les boîtes se posent avant les tubes, qui s’emboîtent entre elles', () => {
  assert.ok(
    rang('boites') < rang('cheminement'),
    'un tube se pose ENTRE deux boîtes : les boîtes d’abord',
  );
});

test('les départs du tableau se câblent en dernier, avant les seuls essais', () => {
  for (const avant of ['percage', 'boites', 'cheminement', 'tirage', 'connexions', 'appareillage']) {
    assert.ok(
      rang(avant) < rang('tableau'),
      `« ${avant} » doit précéder le raccordement au tableau`,
    );
  }
  assert.ok(rang('tableau') < rang('essais-hors-tension'), 'et le tableau précède les essais');
});

test('les connexions en boîte se font entre le tirage et l’appareillage', () => {
  assert.ok(rang('tirage') < rang('connexions'), 'on ne raccorde pas des fils non tirés');
  assert.ok(
    rang('connexions') < rang('appareillage'),
    'les couvercles de boîte se referment avant d’aborder l’appareillage',
  );
});

test('chaque traversée de paroi est percée avant la boîte qui la couvre', () => {
  // C'est le gain concret de l'ordre retenu : la contrainte « percer AVANT de
  // poser le boîtier » était une consigne écrite, répétée dans trois
  // instructions et qu'aucune règle ne vérifiait. Elle est devenue structurelle.
  const etapeDe = (genre) => {
    const par = new Map();
    for (const e of sequence.etapes) for (const id of e[genre] ?? []) par.set(id, e);
    return par;
  };
  const parTraversee = etapeDe('traversees');
  assert.ok(parTraversee.size > 0, 'des traversées doivent être posées, sinon ce test ne prouve rien');

  for (const [id, etape] of parTraversee) {
    assert.equal(
      etape.phase,
      'percage',
      `la traversée « ${id} » est posée en phase « ${etape.phase} » : un percement se fait au perçage`,
    );
  }

  // Et le perçage précède bien la pose de toute boîte, y compris celles dont le
  // fond est traversé — BD-01 et BD-04, percées par l'éclairage et posées par
  // les prises, dans deux apports différents.
  const boites = modele.composants.filter((c) => c.type === 'boite-derivation');
  const parComposant = etapeDe('composants');
  for (const b of boites) {
    const pose = parComposant.get(b.id);
    if (!pose) continue;
    for (const [, percage] of parTraversee) {
      assert.ok(
        sequence.etapes.indexOf(percage) < sequence.etapes.indexOf(pose),
        `« ${b.reference} » est posée avant un percement : il faudrait la déposer pour percer`,
      );
    }
  }
});

test('la séquence composée suit l’ordre des phases sans exception', () => {
  let precedent = -1;
  for (const e of sequence.etapes) {
    const r = rang(e.phase);
    assert.ok(r >= 0, `« ${e.id} » déclare une phase inconnue : ${e.phase}`);
    assert.ok(r >= precedent, `« ${e.id} » (${e.phase}) remonte dans l'ordre des phases`);
    precedent = r;
  }
});

test('les quatre apports n’emploient que des phases du catalogue', () => {
  // Une fonctionnalité choisit une phase, elle n'en invente pas. Le réordonnancement
  // du 2026-09-22 a renommé deux libellés et ajouté deux phases : ce test attrape
  // un apport resté sur l'ancien vocabulaire.
  for (const e of modele.etapes) {
    assert.ok(rang(e.phase) >= 0, `« ${e.id} » emploie une phase hors catalogue : ${e.phase}`);
  }
});
