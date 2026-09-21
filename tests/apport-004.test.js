/**
 * L'apport réel de la borne de recharge.
 *
 * Cet apport ne déclare ni le tableau ni aucune boîte : c'est un circuit dédié à
 * un **seul** point d'utilisation, donc un chemin unique du tableau à la borne,
 * sans jonction. Il traverse en revanche deux boîtes déclarées par `002`, et il
 * a besoin de leurs `dimensions` pour être seulement exprimable — les trois
 * apports se lisent donc toujours ensemble.
 *
 * Les assertions portent sur des **propriétés**, pas sur des coordonnées.
 */

import test from 'node:test';
import assert from 'node:assert/strict';
import { SOCLE, PRISES, ECLAIRAGE, BORNE, AUTOMATISATION, chuteAmont } from './_aides.js';
import { fusionner } from '../src/donnees/chargement.js';
import { composerSequence } from '../src/sequence/ordonnancement.js';
import { validerTout } from '../src/donnees/validation.js';
import { construireGraphe, atteignablesDepuisTableau, longueursDepuisTableau } from '../src/geometrie/graphe.js';
import { controlerCollisions, VERDICTS } from '../src/geometrie/collision.js';

const CIRCUIT = 'c-borne';
const apports = () => [PRISES(), ECLAIRAGE(), BORNE(), AUTOMATISATION()];
const modeleDe = () => fusionner(SOCLE(), apports());

test('les vingt-deux règles ne rendent aucun défaut sur les trois apports fusionnés', () => {
  const m = modeleDe();
  const defauts = validerTout(m, composerSequence(m), apports());
  assert.deepEqual(
    defauts.map((d) => `${d.regle} | ${d.cible} | ${d.message}`),
    [],
  );
});

test('la ligne de la borne ne partage aucun mètre de CONDUIT', () => {
  // Le Principe IV rendu vérifiable, dans sa rédaction v1.14.0. La dédicace ne
  // s'étend plus au contenant : le câble PEUT cohabiter dans un profilé de
  // goulotte, où son enveloppe propre tient le rôle que le conduit tenait. Elle
  // reste entière sur les portions en CONDUIT, qui n'offre pas d'enveloppe par
  // conducteur.
  //
  // Le facteur de groupement suit la même frontière : exigible là où la ligne
  // cohabite, sans objet là où elle est seule. Un facteur non appliqué à tort
  // reste un conducteur sous-dimensionné.
  const m = modeleDe();
  const siens = m.cheminements.filter((c) => (c.circuits ?? []).includes(CIRCUIT));
  assert.ok(siens.length > 0, 'la ligne doit exister dans les données');
  for (const ch of siens) {
    if (ch.raccordement === 'lateral') continue;
    assert.deepEqual(ch.circuits, [CIRCUIT], `« ${ch.reference} » est un conduit : il ne doit porter que la borne`);
  }
});

test('là où la borne cohabite, c’est dans un profilé et jamais dans un conduit', () => {
  const m = modeleDe();
  const partages = m.cheminements.filter(
    (c) => (c.circuits ?? []).includes(CIRCUIT) && c.circuits.length > 1,
  );
  for (const ch of partages) {
    assert.equal(
      ch.raccordement,
      'lateral',
      `« ${ch.reference} » porte la borne avec d'autres circuits : ce ne peut être qu'un profilé`,
    );
    assert.equal(ch.section.forme, 'rectangulaire', `« ${ch.reference} » doit avoir la section d'un profilé`);
  }
});

test('la bande au-dessus du linteau ne porte que la goulotte, jointive au plafond', () => {
  // FR-036, réécrit pour la goulotte de la paroi est. La bande utile fait 0,25 m
  // entre le linteau de la porte de service et le plafond. Elle portait deux
  // conduits superposés, le tronc à 2,60 m et la ligne de la borne à 2,64 m, et il
  // n'y restait pas la place d'un troisième. Elle porte désormais un seul profilé,
  // collé au plafond, où les trois circuits cheminent ensemble.
  //
  // La condition est RECALCULÉE sur la section déclarée : le profilé touche le
  // plafond, son dessous garde du jeu au linteau, et aucun conduit ne court plus
  // à l'horizontale dans la bande.
  const m = modeleDe();
  const porte = m.local.baies.find((b) => b.id === 'porte-service');
  const linteau = (porte.allege ?? 0) + porte.hauteur;
  const JEU = 0.01;
  const dansLaBande = m.cheminements
    .flatMap((c) => (c.segments ?? []).map((s, i) => ({ c, s, i })))
    .filter(({ s }) => s.face === 'est' && Math.abs(s.a.z - s.de.z) < 1e-9 && s.de.z > linteau - 1e-9)
    .filter(({ s }) => Math.min(s.de.y, s.a.y) < porte.debut + porte.largeur && Math.max(s.de.y, s.a.y) > porte.debut);
  assert.ok(dansLaBande.length > 0, 'la ligne doit franchir la porte de service');

  for (const { c, s, i } of dansLaBande) {
    assert.equal(c.raccordement, 'lateral', `« ${c.reference} » segment ${i + 1} court dans la bande sans être le profilé`);
    assert.ok(c.circuits.includes(CIRCUIT), `« ${c.reference} » doit porter la ligne de la borne`);
    const demi = c.section.largeur / 2;
    assert.ok(Math.abs(s.de.z + demi - m.local.hauteurSousPlafond) < 1e-9, `« ${c.reference} » doit être jointif au plafond`);
    assert.ok(s.de.z - demi >= linteau + JEU - 1e-9, `« ${c.reference} » : dessous à ${(s.de.z - demi).toFixed(3)} m, trop près du linteau`);
  }
});

test('BR-01 est abordée par le dessus, à son aplomb, et tient sous l’allège', () => {
  // Constitution v1.9.0 pour l'entrée par le haut ; FR-004 pour l'allège.
  const m = modeleDe();
  const br = m.composants.find((c) => c.reference === 'BR-01');
  assert.ok(br, 'BR-01 doit exister');

  const abords = m.cheminements
    .filter((c) => (c.circuits ?? []).includes(CIRCUIT))
    .flatMap((c) => (c.segments ?? []).map((s) => ({ c, s })))
    .filter(({ s }) => [s.de, s.a].some((p) => Math.hypot(p.x - br.position.x, p.y - br.position.y, p.z - br.position.z) < 1e-6));
  assert.equal(abords.length, 1, 'BR-01 doit être abordée par exactement un segment');
  const { c, s } = abords[0];
  const autre = Math.hypot(s.de.x - br.position.x, s.de.y - br.position.y, s.de.z - br.position.z) < 1e-6 ? s.a : s.de;
  assert.ok(autre.z > br.position.z + 1e-9, `« ${c.reference} » doit aborder BR-01 depuis un point strictement plus haut`);
  assert.ok(
    Math.abs(autre.x - br.position.x) < 1e-9 && Math.abs(autre.y - br.position.y) < 1e-9,
    'et depuis son aplomb, non de côté',
  );

  // FR-004 : tout doit tenir sous l'allège de la fenêtre nord. La condition
  // s'écrit sur la hauteur du coffret, qui est une cote produit : ce que le
  // dossier peut garantir, c'est la hauteur de coffret ADMISSIBLE.
  const fenetre = m.local.baies.find((b) => b.id === 'fenetre-nord');
  const admissible = 2 * (fenetre.allege - br.hauteurAxe);
  assert.ok(admissible > 0, 'l’axe de BR-01 doit être sous l’allège');
  assert.ok(
    admissible >= 1.0,
    `la hauteur de coffret admissible n'est que de ${admissible.toFixed(2)} m : l'axe est trop haut pour retirer la question`,
  );
});

test('la chute de tension cumulée déclarée est celle que le tracé redonne', () => {
  // Ajouté le 2026-09-22, avec la décision du maître d'ouvrage : section 10 mm²,
  // conducteurs isolés, IRL 25. Tant que la section n'était pas arrêtée, ce
  // circuit ne pouvait rien déclarer et la note donnait trois résultats, un par
  // section candidate. Maintenant qu'il déclare une valeur, elle doit être
  // RECALCULÉE — sans quoi ce serait un chiffre recopié, ce que le projet
  // s'interdit partout ailleurs.
  //
  // Ce circuit échappe à la correction du § 2.3 de l'éclairage : il n'est pas
  // commuté, aucun interrupteur ne détourne sa phase, donc phase et neutre ont la
  // même longueur et la forme `2ρLI/S` s'applique sans détour.
  const m = modeleDe();
  const circuit = m.circuits.find((c) => c.id === CIRCUIT);
  const longueurs = longueursDepuisTableau(construireGraphe(m), m, CIRCUIT);
  assert.ok(longueurs.plusLong);

  const RHO = 0.0225;
  const U = 230;
  const I = circuit.courantEmploi;
  assert.equal(I, 32, 'le courant d’emploi est une donnée du besoin, pas une hypothèse');
  const terminale = (100 * 2 * RHO * longueurs.plusLong.longueur * I) / (circuit.section * U);
  const cumul = chuteAmont() + terminale;
  assert.equal(
    Math.round(cumul * 100) / 100,
    circuit.chuteTensionCumulee,
    `le cumul déclaré (${circuit.chuteTensionCumulee} %) doit valoir amont + terminale = ${cumul.toFixed(4)} %`,
  );
  // La limite de ce circuit est 5 %, non 3 % : ce n'est pas de l'éclairage.
  assert.ok(circuit.chuteTensionCumulee < 5, 'le cumul déclaré doit rester sous 5 %');
});

test('le calibre du conduit est arrêté, et la section aussi — les valeurs normatives non', () => {
  // La décision du 2026-09-22 ferme deux inconnues et n'en ferme aucune autre.
  // Ce test porte sur cette frontière : ce qui relève d'une DÉCISION du maître
  // d'ouvrage est arrêté, ce qui relève d'une valeur NORMATIVE reste null jusqu'à
  // confirmation sur le texte (Principe I).
  const apport = BORNE();
  const circuit = apport.circuits.find((c) => c.id === CIRCUIT);
  assert.equal(circuit.section, 10, 'section décidée');
  assert.equal(circuit.conducteurs, 3, 'trois conducteurs isolés, mode de pose B1');
  for (const champ of ['typeDifferentiel', 'calibreProtection']) {
    assert.equal(circuit[champ], null, `${champ} est normatif : il reste à confirmer`);
  }

  for (const ch of apport.cheminements) {
    assert.equal(ch.section.diametre, 0.025, `« ${ch.reference} » est arrêté à l'IRL 25`);
    assert.equal(
      ch.section.majorant,
      undefined,
      `« ${ch.reference} » ne doit plus porter de majorant : un diamètre arrêté n'en a pas`,
    );
  }
});

test('la ligne de la borne reste seule dans son CONDUIT, calibre arrêté compris', () => {
  // La constitution v1.5.0 dédiait le CONDUIT autant que le circuit. L'amendement
  // v1.14.0 a retiré cette extension, faute de clause qui la fonde, et parce que le
  // tracé arrêté la contredisait déjà sur 0,04 m.
  //
  // Ce qui reste, et que ce test garde : un CONDUIT n'offre pas d'enveloppe propre
  // par conducteur, donc il reste dédié. Passer à l'IRL 25 met la borne au même
  // calibre que le tronc partagé, et c'est exactement le moment où l'on pourrait
  // être tenté de l'y faire entrer — ce que ce test interdit toujours.
  //
  // La cohabitation n'est admise que dans un PROFILÉ, où le câble porte sa propre
  // enveloppe. Elle s'y paie du facteur de groupement, que la dédicace rendait
  // « sans objet » et qui redevient exigible sur cette portion.
  const m = modeleDe();
  const siens = m.cheminements.filter((c) => (c.circuits ?? []).includes(CIRCUIT));
  assert.ok(siens.length > 0);
  for (const ch of siens) {
    if (ch.raccordement === 'lateral') continue;
    assert.deepEqual(ch.circuits, [CIRCUIT], `« ${ch.reference} » est un conduit : il doit rester dédié à la borne`);
  }
});
