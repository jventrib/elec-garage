import { calibreDe } from '../src/geometrie/section.js';
/**
 * V20 — deux conduits ne se recouvrent pas.
 *
 * La règle est née d'une erreur. Le 2026-09-22, en arbitrant le passage de la
 * ligne de la borne au-dessus de BD-01, l'assistant a recommandé un tracé qui
 * heurtait CH-04, la montée de 0,15 m reliant BD-01 à BD-03. Aucune des dix-neuf
 * règles ne l'a signalé : le contrôle de collision n'opposait les conduits qu'aux
 * obstacles relevés, jamais entre eux. La lacune était écrite au dossier depuis
 * `003-eclairage` (R4) et n'avait jamais mordu.
 *
 * Le premier test ci-dessous rejoue exactement ce tracé. CH-04 a disparu le
 * 2026-09-24 dans la goulotte GL-02 : les tests qui s'appuient sur l'antenne et sa
 * montée les rejouent sur le tracé d'avant, que `_aides.js` reconstruit.
 */

import test from 'node:test';
import assert from 'node:assert/strict';
import {
  SOCLE, PRISES, ECLAIRAGE, DEMO, copie, PRISES_AVANT_GOULOTTE, ECLAIRAGE_AVANT_GOULOTTE,
} from './_aides.js';
import { fusionner } from '../src/donnees/chargement.js';
import { validerCheminements } from '../src/donnees/validation.js';

const V20 = (modele) => validerCheminements(modele).filter((x) => x.regle === 'V20');
const modeleDe = (...apports) => fusionner(SOCLE(), apports);

test('V20 refuse le tracé de borne qui heurtait la montée vers le plafond', () => {
  const prises = copie(PRISES_AVANT_GOULOTTE());
  // L'horizontale recommandée à tort : 2,70 m sur le nu de la paroi est.
  prises.cheminements.push({
    id: 'br-ch-01',
    reference: 'CH-B1',
    circuits: ['c-prises'],
    section: { forme: 'circulaire', diametre: 0.025 },
    apport: '002-prises-de-courant',
    segments: [{ face: 'est', de: { x: 5.6, y: 0.8, z: 2.7 }, a: { x: 5.6, y: 5.6, z: 2.7 } }],
  });
  const defauts = V20(modeleDe(prises, ECLAIRAGE_AVANT_GOULOTTE()));
  assert.equal(defauts.length, 1, 'le heurt doit être signalé, une fois');
  assert.match(defauts[0].message, /CH-04/, 'et nommer le conduit heurté');
  assert.match(defauts[0].message, /5\.6 ; 2\.6 ; 2\.7/, 'et donner le point du heurt');
});

test('V20 laisse passer les deux apports réels, qui ne se recouvrent nulle part', () => {
  assert.deepEqual(V20(modeleDe(PRISES(), ECLAIRAGE())), []);
  // Le jeu de démonstration ne déclare presque aucun diamètre : la règle y est
  // affaiblie, mais elle ne doit pas pour autant inventer de défaut.
  assert.deepEqual(V20(modeleDe(DEMO())), []);
});

test('V20 ne confond pas une jonction avec un heurt', () => {
  // Quatre conduits se rejoignent sur BD-01 et deux d'entre eux sont colinéaires.
  // Une règle qui mesurerait bêtement la distance les déclarerait tous en heurt.
  const m = modeleDe(PRISES_AVANT_GOULOTTE(), ECLAIRAGE_AVANT_GOULOTTE());
  assert.deepEqual(V20(m), []);

  // Et la preuve que l'exemption tient au PARTAGE D'EXTRÉMITÉ et non au hasard :
  // décoller l'un des quatre au-delà de la tolérance de raccordement suffit à le
  // faire ressortir. La tolérance vaut 0,01 m ; on décolle de 0,02 m, donc les
  // extrémités ne se rejoignent plus, alors que la garde de 0,025 m reste violée.
  // Décollement de 0,015 m depuis le 2026-09-23. CH-07 file désormais droit vers
  // l'ouest au lieu de monter au nord, et la fenêtre où ce test mord est étroite :
  //
  //   <= 0,010 m  la tolérance de raccordement fusionne les nœuds : extrémité
  //               partagée, et V20 s'abstient à juste titre
  //   >= 0,020 m  la garde des deux IRL 20 est respectée : aucun heurt
  //   == 0,015 m  ni l'un ni l'autre — c'est là, et là seulement, que la règle
  //               doit parler
  //
  // Une valeur hors de cette fenêtre ne teste rien, et le test passerait au vert
  // sans rien exercer. C'est exactement la faiblesse relevée ailleurs dans cette
  // suite sur les seuils encadrants.
  const prises = copie(PRISES_AVANT_GOULOTTE());
  const ch04 = prises.cheminements.find((c) => c.reference === 'CH-04');
  for (const s of ch04.segments) {
    s.de.y += 0.015;
    s.a.y += 0.015;
  }
  const defauts = V20(modeleDe(prises, ECLAIRAGE_AVANT_GOULOTTE()));
  assert.ok(defauts.length > 0, 'un conduit décollé de 0,02 m ne partage plus d’extrémité et doit ressortir');
  assert.match(defauts[0].message, /garde/, 'et la garde exigée doit être dite');
});

test('un piquage enfermé dans une boîte déclarée n’est pas un heurt', () => {
  // Un conduit qui aboutit au MILIEU d'un autre : V17 exige une boîte, V20 ne
  // doit rien dire tant que cette boîte est là. Les deux règles se partagent le
  // sujet, elles ne le traitent pas deux fois.
  //
  // Le montage prend un point LIBRE au milieu de l'antenne CH-03, et non un
  // départ de BD-01 : les quatre directions de BD-01 sont déjà prises, et une
  // dérivation de plus y serait superposée à un conduit existant. C'est ce que la
  // première version de ce test faisait, et le contrôle de superposition l'a
  // attrapée — le montage était faux, pas la règle.
  const prises = copie(PRISES_AVANT_GOULOTTE());
  const piquage = { x: 5.6, y: 4.0, z: 2.6 }; // au milieu de CH-03, entre 2,60 et 5,45
  prises.composants.push({
    id: 'pr-bd-90',
    reference: 'BD-90',
    type: 'boite-derivation',
    paroi: 'est',
    face: 'interieur',
    position: piquage,
    hauteurAxe: 2.6,
    indiceProtection: null,
    circuit: 'c-prises',
  });
  prises.cheminements.push({
    id: 'pr-ch-90',
    reference: 'CH-90',
    circuits: ['c-prises'],
    section: { forme: 'circulaire', diametre: 0.02 },
    apport: '002-prises-de-courant',
    segments: [{ face: 'est', de: piquage, a: { x: 5.6, y: 4.0, z: 2.75 } }],
  });
  assert.deepEqual(V20(modeleDe(prises, ECLAIRAGE_AVANT_GOULOTTE())), [], 'la boîte couvre le piquage');

  // La même dérivation sans sa boîte : le piquage redevient un heurt.
  const sansBoite = copie(prises);
  sansBoite.composants = sansBoite.composants.filter((c) => c.reference !== 'BD-90');
  const defauts = V20(modeleDe(sansBoite, ECLAIRAGE_AVANT_GOULOTTE()));
  assert.equal(defauts.length, 1, 'sans boîte, le piquage ressort');
  assert.match(defauts[0].message, /aucune boîte n'y est déclarée/, 'et la règle dit ce qui manque');
});

test('V20 refuse deux conduits superposés, même partant du même point', () => {
  // Le trou de la première écriture. La ligne de la borne part du tableau, comme
  // celle des prises : deux montées sur le même aplomb partagent une extrémité,
  // ce qui les exemptait du contrôle de contact ponctuel alors qu'elles occupent
  // le même tube d'air sur plus d'un mètre.
  //
  // Le montage est AUTONOME depuis le 2026-09-22 : il s'appuyait sur CH-01, la
  // montée du tableau, qui a cessé d'être un conduit quand la goulotte l'a
  // remplacée. Un test qui repose sur un objet du dossier casse au premier
  // changement de tracé sans avoir rien détecté — la leçon est déjà écrite
  // ailleurs dans cette suite, et elle valait pour celui-ci.
  const prises = copie(PRISES());
  const td = prises.composants.find((c) => c.type === 'tableau').position;
  const montee = (id, ref, haut) => ({
    id,
    reference: ref,
    circuits: ['c-prises'],
    section: { forme: 'circulaire', diametre: 0.025 },
    apport: '002-prises-de-courant',
    segments: [{ face: 'est', de: { ...td }, a: { x: td.x, y: td.y, z: haut } }],
  });
  prises.cheminements.push(montee('br-ch-00', 'CH-B0', 2.68));
  prises.cheminements.push(montee('br-ch-00b', 'CH-B0b', 2.6));
  const defauts = V20(modeleDe(prises, ECLAIRAGE()));
  // On cherche LA PAIRE, et non le premier défaut venu : la goulotte occupe le
  // même aplomb et produit ses propres signalements, dont l'ordre ne regarde pas
  // ce test.
  const paire = defauts.find((d) => /CH-B0 /.test(d.message) && /CH-B0b/.test(d.message));
  assert.ok(paire, 'la superposition des deux montées doit être signalée');
  assert.match(paire.message, /SUPERPOSÉS/, 'et nommée comme telle, non comme un contact');
  assert.match(paire.message, /1\.1 m/, 'avec la longueur réellement partagée');
});

test('deux conduits bout à bout ne sont pas superposés', () => {
  // Le cas légitime que le contrôle de superposition ne doit pas confondre :
  // CH-05 descend de BD-01 à BD-04, CH-06 continue de BD-04 au socle. Colinéaires,
  // même direction, mais un recouvrement de longueur nulle.
  const m = modeleDe(PRISES(), ECLAIRAGE());
  assert.deepEqual(V20(m), []);
});

test('le contrôle de collision retient bien le calibre de la section', () => {
  // Régression : la migration vers `section` avait laissé collision.js lire
  // `ch.diametre`, devenu absent. La garde tombait à zéro — un relâchement
  // qu'aucun test n'aurait vu, puisqu'un contrôle plus laxiste ne casse rien.
  const ch = { section: { forme: 'circulaire', diametre: 0.025 } };
  assert.equal(calibreDe(ch.section), 0.025);
  const rect = { section: { forme: 'rectangulaire', largeur: 0.12, profondeur: 0.06 } };
  assert.equal(calibreDe(rect.section), 0.12, 'la plus grande cote fait la garde');
  assert.equal(calibreDe(undefined), null, 'une section absente ne fabrique pas de garde');
});
