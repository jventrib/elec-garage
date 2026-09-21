/**
 * Les instructions d'étape, confrontées aux données qu'elles décrivent.
 *
 * Ce sont les seuls textes du dossier que l'installateur lit vraiment : la
 * maquette les affiche étape par étape, et c'est à elles qu'il se fie, pas aux
 * documents de spécification. Elles sont donc à la fois les plus importantes et
 * les plus faciles à laisser périmer, puisqu'aucune règle du socle ne les
 * regarde — les vingt-deux règles vérifient la géométrie, jamais la prose.
 *
 * Le test trouve ce qu'une relecture manque. À sa première exécution il a relevé
 * deux boîtes citées dans une instruction de vérification alors qu'elles avaient
 * été supprimées par la mutualisation des conduits.
 */

import test from 'node:test';
import assert from 'node:assert/strict';
import { SOCLE, PRISES, ECLAIRAGE, BORNE } from './_aides.js';
import { fusionner } from '../src/donnees/chargement.js';
import { composerSequence } from '../src/sequence/ordonnancement.js';

const modele = fusionner(SOCLE(), [PRISES(), ECLAIRAGE(), BORNE()]);
const sequence = composerSequence(modele);

/** Tous les repères réellement déclarés, quel que soit le genre d'objet. */
function reperes(m) {
  const r = new Set();
  for (const c of m.composants ?? []) r.add(c.reference);
  for (const c of m.cheminements ?? []) r.add(c.reference);
  for (const t of m.traversees ?? []) r.add(t.reference);
  return r;
}

// Un repère de ce projet : deux ou trois lettres, un tiret, un nombre, parfois une
// lettre de sortie. Couvre BD, BL, BX, CH, CH-L, PC, EL, CM, TV, TV-L, TD.
const MOTIF = /\b(?:BD|BL|BX|CH|PC|EL|CM|TV|TD)(?:-L)?-\d+[a-z]?\b/g;

test('aucune instruction ne nomme un repère qui n’existe pas', () => {
  const declares = reperes(modele);
  const fantomes = [];
  for (const e of sequence.etapes) {
    for (const cite of e.instruction.match(MOTIF) ?? []) {
      if (!declares.has(cite)) fantomes.push(`${e.id} cite « ${cite} »`);
    }
  }
  assert.deepEqual(fantomes, [], fantomes.join(' ; '));
});

test('aucune instruction ne nomme un repère qui n’existe pas, matériel compris', () => {
  const declares = reperes(modele);
  const fantomes = [];
  for (const e of sequence.etapes) {
    for (const ligne of e.materiel ?? []) {
      for (const cite of ligne.match(MOTIF) ?? []) {
        if (!declares.has(cite)) fantomes.push(`${e.id}, matériel : « ${cite} »`);
      }
    }
  }
  assert.deepEqual(fantomes, [], fantomes.join(' ; '));
});

test('toute étape qui pose un objet le nomme, ou le décrit par son genre', () => {
  // Une étape qui pose des objets sans en dire un mot laisse l'installateur
  // deviner. On n'exige pas d'énumérer chaque repère — ce serait illisible pour
  // onze conduits — mais l'instruction ne peut pas être muette sur ce qu'elle pose.
  const genres = { composants: /bo[îi]te|socle|sortie|commande|tableau|d[ée]tecteur|appareil|borne|BR-01/i,
                   cheminements: /conduit|tron[çc]|branche|parcours|antenne|descente|mont[ée]e/i,
                   traversees: /travers|percement|percer/i };
  for (const e of sequence.etapes) {
    for (const [genre, motif] of Object.entries(genres)) {
      if ((e[genre] ?? []).length === 0) continue;
      assert.match(
        e.instruction,
        motif,
        `${e.id} pose ${e[genre].length} ${genre} sans en parler`,
      );
    }
  }
});

test('les tirages du tronc partagé se suivent, celui de la borne se distingue', () => {
  // Réécrit le 2026-09-22, en ajoutant la borne. La formulation d'origine
  // exigeait qu'il y ait EXACTEMENT DEUX tirages, tous deux sur le tronc
  // partagé. Elle est devenue fausse à l'arrivée d'un troisième circuit — dont
  // le conduit, lui, n'est partagé avec rien.
  //
  // Ce qui doit rester vrai est plus précis, et distingue les deux cas : les
  // tirages qui empruntent un conduit partagé doivent se suivre et le dire ; le
  // tirage d'un circuit entièrement en propre doit dire qu'il l'est, faute de
  // quoi l'installateur le croira concerné par le passage groupé.
  const tirages = sequence.etapes.filter((e) => e.phase === 'tirage');
  assert.ok(tirages.length >= 2, 'au moins deux tirages, un par circuit');

  const groupes = tirages.filter((e) => /partag/i.test(e.instruction));
  const seuls = tirages.filter((e) => !/partag/i.test(e.instruction));

  assert.ok(groupes.length >= 2, 'les circuits du tronc partagé doivent mentionner le partage');
  const rangs = groupes.map((e) => sequence.etapes.indexOf(e)).sort((x, y) => x - y);
  for (let i = 1; i < rangs.length; i += 1) {
    assert.equal(rangs[i] - rangs[i - 1], 1, 'les tirages du tronc partagé doivent être consécutifs');
  }
  for (const e of groupes) {
    assert.match(e.instruction, /en m[êe]me temps/i, `${e.id} doit dire de tirer les jeux ensemble`);
  }

  for (const e of seuls) {
    assert.match(
      e.instruction,
      /en propre|d.un seul tenant|aucune connexion/i,
      `${e.id} tire dans un conduit qui n'est partagé avec rien : l'instruction doit le dire`,
    );
  }
});

test('la levée de consignation avertit de ce qui reste sous tension', () => {
  // Deux réserves durables que la règle V8 ne peut pas contrôler : elle vérifie
  // l'ordre des étapes de pose, pas les conditions de la maintenance.
  const levee = sequence.etapes.find((e) => e.nature === 'levee-consignation');
  assert.ok(levee);
  assert.match(levee.instruction, /consignation/i);

  // L'avertissement sur les boîtes à plusieurs circuits doit figurer quelque part
  // dans la séquence : c'est l'exigence de la constitution v1.10.0.
  const partout = sequence.etapes.map((e) => e.instruction).join(' ');
  assert.match(partout, /deux circuits/i, 'la séquence doit avertir des boîtes à plusieurs circuits');
  assert.match(partout, /en permanence/i, 'et du point alimenté en permanence');
});

test('la consignation retenue porte les consignes de tous les circuits, pas seulement du premier', () => {
  // Trouvé le 2026-09-22, et par une vérification faite exprès — aucune règle ne
  // pouvait le voir. Le socle ne garde qu'UNE étape de consignation pour tout le
  // site, ce qui est juste : le geste est unique. Mais il écartait les autres
  // **avec leur instruction**, et la borne se consigne au disjoncteur d'abonné et
  // non à l'interrupteur du tableau, puisqu'elle en part en amont. La seule
  // consigne qui dise où couper disparaissait en silence.
  //
  // V3 ne pouvait rien y voir : elle contrôle les objets posés, et une étape de
  // consignation n'en pose aucun.
  const consignations = modele.etapes.filter((e) => e.nature === 'consignation');
  assert.ok(consignations.length > 1, 'plusieurs circuits doivent apporter leur consignation');

  const retenue = sequence.etapes.find((e) => e.nature === 'consignation');
  assert.ok(retenue, 'la séquence doit en garder une');
  for (const e of consignations) {
    if (e.id === retenue.id) continue;
    assert.ok(
      retenue.instruction.includes(e.instruction.trim()),
      `la consigne de « ${e.id} » a été perdue à la déduplication`,
    );
  }

  // Et le fond, non seulement la forme : le point de coupure de la borne doit
  // être nommé là où le geste se fait.
  const borne = modele.circuits.find((c) => c.id === 'c-borne');
  if (borne) {
    assert.match(
      retenue.instruction,
      /disjoncteur d.abonn/i,
      'la consignation doit dire de couper au disjoncteur d’abonné : la borne part du bornier, en amont de l’interrupteur du tableau',
    );
  }
});
