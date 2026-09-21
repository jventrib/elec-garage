/**
 * R2 — les boîtes deviennent des volumes.
 *
 * Trois fonctionnalités se sont contentées de boîtes-points : les conduits se
 * rejoignaient au centre, et le point disait exactement la topologie. La ligne
 * de la borne y met fin. Elle doit franchir deux conduits déjà posés, et le seul
 * endroit où l'on franchit légitimement un conduit est l'intérieur d'une boîte —
 * qui n'avait pas d'intérieur.
 *
 * Ce fichier vérifie les quatre parties de l'extension et, surtout, ses **deux
 * garde-fous** : que les apports déjà écrits ne bougent pas, et qu'un volume
 * déclaré ne soit pas une porte de sortie.
 *
 * Depuis le 2026-09-24, la goulotte GL-02 a remplacé BD-01 et la ligne ne franchit
 * plus rien. Le mécanisme reste, et il s'éprouve sur le tracé d'avant, que
 * `_aides.js` reconstruit.
 */

import test from 'node:test';
import assert from 'node:assert/strict';
import {
  SOCLE, PRISES_AVANT_GOULOTTE as PRISES, ECLAIRAGE_AVANT_GOULOTTE as ECLAIRAGE, copie,
} from './_aides.js';
import { fusionner } from '../src/donnees/chargement.js';
import { validerCheminements, validerApport } from '../src/donnees/validation.js';
import { construireGraphe, atteignablesDepuisTableau, longueursDepuisTableau } from '../src/geometrie/graphe.js';

const Z = 2.64;    // axe de la ligne de la borne
// 0,15 m au nord de l'aplomb des prises. C'était 0,05 m tant que la goulotte était
// une boîte à volume, que V20 ne regarde pas ; devenue un cheminement de 0,12 m de
// large, elle exige une garde de 0,073 m que cet écart ne tenait plus. L'amendement
// v1.14.0 AUTORISE la cohabitation dans un profilé, il ne dispense pas un conduit
// resté dehors d'avoir sa propre place.
const YR = 0.85;
const s = (face, de, a) => ({ face, de, a });

/**
 * Les prises **dépouillées** de leurs volumes, pour rejouer l'état d'avant
 * l'extension. Les cotes ont été déclarées dans l'apport à la tâche T006 : ces
 * montages ne peuvent donc plus compter sur leur absence, et doivent les retirer
 * explicitement. C'est la même leçon que pour les coordonnées — un test qui
 * s'appuie sur ce que les données ne contiennent pas encore casse au premier
 * enrichissement, sans avoir rien détecté.
 */
function prisesSansVolumes() {
  const pr = copie(PRISES());
  for (const c of pr.composants) {
    // OC-01 garde le sien : l'organe de connexion est la seule jonction du
    // profilé, et c'est par lui que les deux circuits d'usage se séparent. Le
    // dépouiller ne rejouerait pas l'état d'avant l'extension, ça couperait
    // l'installation.
    //
    // La goulotte, elle, n'a plus rien à garder : elle est devenue un cheminement,
    // et c'est sa contiguïté déclarée avec le tableau — non un volume — qui fait
    // passer les conducteurs.
    if (c.reference === 'OC-01') continue;
    delete c.dimensions;
    delete c.entrees;
  }
  return pr;
}

/** Les prises, avec BD-01 dimensionnée comme la borne l'exige. */
function prisesAvecVolumes({ bd01 = 0.105, entrees01 = 6, entrees02 = 4 } = {}) {
  const pr = prisesSansVolumes();
  const b1 = pr.composants.find((c) => c.reference === 'BD-01');
  b1.dimensions = { largeur: bd01, hauteur: bd01, profondeur: 0.05 };
  b1.entrees = entrees01;
  pr.composants.find((c) => c.reference === 'OC-01').entrees = entrees02;
  return pr;
}

/** Le tracé candidat de la borne, découpé aux deux boîtes qu'il traverse. */
function ligneDeBorne() {
  return {
    fonctionnalite: '004-borne-recharge',
    provenance: { schemaUnifilaire: null, noteDeCalcul: null, releve: null },
    circuits: [{ id: 'c-borne', libelle: 'Borne', couleur: '#d62728', section: null,
      sensibiliteDifferentielle: 30, chuteTensionCumulee: null, typeDifferentiel: null,
      calibreProtection: null, courantEmploi: 32 }],
    composants: [
      { id: 'br-br-01', reference: 'BR-01', type: 'socle-simple', paroi: 'nord',
        face: 'interieur', position: { x: 2.8, y: 5.6, z: 1.0 }, hauteurAxe: 1.0,
        indiceProtection: null, circuit: 'c-borne' },
      // La boîte de franchissement du BAS. Elle était jouée par GL-01 tant que la
      // goulotte était une enceinte à volume ; devenue un cheminement, elle ne
      // ponte plus rien, et ce fichier doit porter son propre montage plutôt que
      // de s'appuyer sur un objet du dossier — c'est la leçon qu'il énonce
      // lui-même en tête.
      { id: 'br-bd-x', reference: 'BD-X', type: 'boite-derivation', paroi: 'est',
        face: 'interieur', position: { x: 5.6, y: YR, z: 2.62 }, hauteurAxe: 2.62,
        indiceProtection: null, circuit: 'c-borne',
        dimensions: { largeur: 0.1, hauteur: 0.1, profondeur: 0.05 }, entrees: 4 },
    ],
    cheminements: [
      { id: 'br-ch-01', reference: 'CH-B1', circuits: ['c-borne'], section: { forme: 'circulaire', diametre: 0.025 }, apport: '004-borne-recharge',
        segments: [
          s('est', { x: 5.6, y: 0.7, z: 1.5 }, { x: 5.6, y: YR, z: 1.5 }),
          s('est', { x: 5.6, y: YR, z: 1.5 }, { x: 5.6, y: YR, z: 2.6 }),
        ] },
      { id: 'br-ch-02', reference: 'CH-B2', circuits: ['c-borne'], section: { forme: 'circulaire', diametre: 0.025 }, apport: '004-borne-recharge',
        segments: [s('est', { x: 5.6, y: YR, z: Z }, { x: 5.6, y: 2.6, z: Z })] },
      { id: 'br-ch-03', reference: 'CH-B3', circuits: ['c-borne'], section: { forme: 'circulaire', diametre: 0.025 }, apport: '004-borne-recharge',
        segments: [
          s('est', { x: 5.6, y: 2.6, z: Z }, { x: 5.6, y: 5.6, z: Z }),
          s('nord', { x: 5.6, y: 5.6, z: Z }, { x: 4.5, y: 5.6, z: Z }),
          s('nord', { x: 4.5, y: 5.6, z: Z }, { x: 4.5, y: 5.6, z: 1.4 }),
          s('nord', { x: 4.5, y: 5.6, z: 1.4 }, { x: 2.8, y: 5.6, z: 1.4 }),
          s('nord', { x: 2.8, y: 5.6, z: 1.4 }, { x: 2.8, y: 5.6, z: 1.0 }),
        ] },
    ],
    traversees: [], etapes: [],
  };
}

const modeleDe = (...apports) => fusionner(SOCLE(), apports);
const regles = (defauts) => [...new Set(defauts.map((d) => d.regle))].sort();

test('sans volume déclaré, le tracé de la borne est refusé — et c’est juste', () => {
  // L'état d'avant l'extension, et il est pire qu'un simple signalement :
  //   V20 — la ligne recouvre l'antenne, puis la montée vers le plafond ;
  //   V17 — le franchissement dans BD-01 ressort comme une jonction sans boîte ;
  //   V15 — la ligne est coupée en deux dans BD-02, dont les deux bouts pendent ;
  //   V16 — et BR-01 n'est donc PAS ATTEIGNABLE depuis le tableau.
  // Le tracé n'est pas seulement mal vu : il est inexprimable.
  //
  // Révisé le 2026-09-22 : la goulotte GL-01 garde son volume — il est devenu la
  // condition de la continuité —, si bien que le franchissement du BAS est couvert
  // et que seul celui du HAUT, dans BD-01, reste inexprimable. Les défauts sont
  // donc moins nombreux qu'à l'origine, et c'est le propre de l'installation qui a
  // changé, non la règle.
  const defauts = validerCheminements(modeleDe(prisesSansVolumes(), ECLAIRAGE(), ligneDeBorne()));
  assert.ok(regles(defauts).includes('V20'), 'le franchissement du haut n’est pas couvert');
  assert.ok(defauts.length > 0, 'un tracé qui franchit un conduit hors boîte doit être refusé');
});

test('avec les deux volumes déclarés, le tracé passe', () => {
  const m = modeleDe(prisesAvecVolumes(), ECLAIRAGE(), ligneDeBorne());
  assert.deepEqual(validerCheminements(m), [], 'zéro défaut de cheminement');

  // Et la continuité est vraie, non seulement tolérée : la borne est atteignable
  // bien que son conduit soit interrompu DANS BD-02 sans toucher son centre.
  const g = construireGraphe(m);
  const acces = atteignablesDepuisTableau(g, m, 'c-borne');
  assert.deepEqual(acces.orphelins, []);
  assert.ok(acces.atteignables.has('br-br-01'), 'BR-01 doit être atteignable');
  const plusLong = longueursDepuisTableau(g, m, 'c-borne').plusLong;
  assert.equal(plusLong.reference, 'BR-01');
  assert.ok(plusLong.longueur > 10 && plusLong.longueur < 11, `longueur ${plusLong.longueur}`);
});

test('les apports des prises et de l’éclairage restent sans défaut, avec ou sans volumes', () => {
  // Le garde-fou principal. Si l'extension changeait quoi que ce soit aux
  // apports existants, elle serait une régression déguisée en fonctionnalité.
  // Les deux formes sont éprouvées : sans volume, comportement d'origine ; avec
  // les volumes déclarés à T006, rien ne doit bouger non plus.
  assert.deepEqual(validerCheminements(modeleDe(prisesSansVolumes(), ECLAIRAGE())), [], 'sans volume');
  assert.deepEqual(validerCheminements(modeleDe(PRISES(), ECLAIRAGE())), [], 'avec les volumes de T006');
});

test('V21 refuse une boîte qui reçoit plus d’entrées qu’elle n’en déclare', () => {
  // La contrepartie de l'enveloppe. BD-01 reçoit quatre conduits des circuits
  // existants et deux de la borne, soit six. En déclarer cinq doit échouer.
  const defauts = validerCheminements(
    modeleDe(prisesAvecVolumes({ entrees01: 5 }), ECLAIRAGE(), ligneDeBorne()),
  );
  assert.deepEqual(regles(defauts), ['V21']);
  assert.match(defauts[0].message, /déclare 5 entrées et en reçoit 6/, 'et le message donne les deux nombres');
});

test('une enveloppe trop petite ne sauve pas le franchissement', () => {
  // Le second garde-fou, dans l'autre sens : l'exemption suit la géométrie, pas
  // la déclaration. Une boîte de 0,06 m ne couvre pas un point à 0,04 m de son axe.
  const defauts = validerCheminements(
    modeleDe(prisesAvecVolumes({ bd01: 0.06 }), ECLAIRAGE(), ligneDeBorne()),
  );
  assert.ok(defauts.some((d) => d.regle === 'V20'), 'le franchissement redevient un heurt');
  assert.ok(defauts.some((d) => d.regle === 'V17'), 'et la jonction redevient sans boîte');
});

test('un volume sans décompte d’entrées est refusé, et réciproquement', () => {
  // Les deux champs sont inséparables : un volume exempte, le décompte oblige.
  const socle = SOCLE();
  const sansEntrees = prisesSansVolumes();
  const bd = sansEntrees.composants.find((c) => c.reference === 'BD-01');
  bd.dimensions = { largeur: 0.12, hauteur: 0.12, profondeur: 0.05 };
  const d1 = validerApport(sansEntrees, socle).filter((x) => x.regle === 'STRUCT');
  assert.ok(d1.some((x) => /sans entrees/.test(x.message)), 'volume seul refusé');

  const sansVolume = prisesSansVolumes();
  sansVolume.composants.find((c) => c.reference === 'BD-01').entrees = 6;
  const d2 = validerApport(sansVolume, socle).filter((x) => x.regle === 'STRUCT');
  assert.ok(d2.some((x) => /sans dimensions/.test(x.message)), 'décompte seul refusé');
});
