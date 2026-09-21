/**
 * La goulotte GL-02 de la paroi est, à la place de CH-02 / CH-03 et de CH-B2 / CH-B3.
 *
 * Décision du maître d'ouvrage du 2026-09-24 : un profilé collé au plafond, en 90 × 40
 * depuis le 2026-09-25,
 * de GL-01 à l'angle nord-est puis sur la paroi nord jusqu'à x = 4,50 m. Changement
 * OpenSpec `goulotte-paroi-est`, dont `etude.md` porte le raisonnement.
 *
 * Ce fichier garde ce que la goulotte a demandé au socle — un profilé s'aborde par
 * ses FACES, ses nœuds s'enchaînent le long de l'axe, un conducteur n'en compte que
 * ce qu'il parcourt, un organe de connexion n'en reçoit que son profilé — et ce
 * qu'elle engage sur le chantier : la ligne de la borne continue et sans connexion,
 * la traversée de EL-03 en pente depuis le fond, le coude du départ de plafond
 * déclaré en accessoire.
 */

import test from 'node:test';
import assert from 'node:assert/strict';
import { SOCLE, PRISES, ECLAIRAGE, BORNE, AUTOMATISATION, copie } from './_aides.js';
import { fusionner, entreeDeTraversee, sortieDeTraversee } from '../src/donnees/chargement.js';
import { composerSequence } from '../src/sequence/ordonnancement.js';
import { validerTout, validerCheminements } from '../src/donnees/validation.js';
import { construireGraphe, longueursDepuisTableau } from '../src/geometrie/graphe.js';
import { conducteursDuCircuit } from '../src/geometrie/conducteurs.js';
import { connecteursParEnveloppe } from '../src/geometrie/connecteurs.js';
import { controlerCollisions, VERDICTS } from '../src/geometrie/collision.js';
import { pointSurProfile } from '../src/geometrie/cheminement.js';
import { caracteristiques } from '../src/ui/fiche-composant.js';

const apports = () => [PRISES(), ECLAIRAGE(), BORNE(), AUTOMATISATION()];
const modeleDe = (a = apports()) => fusionner(SOCLE(), a);
const modele = modeleDe();
const ch = (m, ref) => m.cheminements.find((c) => c.reference === ref);
const regles = (d) => [...new Set(d.map((x) => x.regle))].sort();

test('les quatre apports passent les vingt-deux règles, sans aucun défaut', () => {
  assert.deepEqual(validerTout(modele, composerSequence(modele), apports()), []);
});

test('GL-02 est collée au plafond, de GL-01 à x = 4,50 m, par un seul angle', () => {
  const gl = ch(modele, 'GL-02');
  assert.equal(gl.raccordement, 'lateral');
  assert.equal(gl.modePose.nature, 'goulotte');
  assert.equal(gl.modePose.lettreSelection, null, 'la lettre de sélection reste inconnue');
  assert.deepEqual(gl.circuits.sort(), ['c-borne', 'c-eclairage', 'c-prises']);
  // Plus petit que GL-01 : le remplissage n'y impose rien, et aucun boîtier n'a plus
  // à s'y loger depuis la constitution v1.15.0.
  assert.deepEqual([gl.section.largeur, gl.section.profondeur], [0.09, 0.04]);
  for (const s of gl.segments) {
    assert.equal(s.de.z + gl.section.largeur / 2, modele.local.hauteurSousPlafond, 'jointive au plafond');
  }
  assert.deepEqual(gl.segments.map((s) => s.face), ['est', 'nord']);
  assert.deepEqual(gl.segments[0].de, { x: 5.6, y: 0.7, z: 2.705 }, 'en T sur GL-01');
  assert.deepEqual(gl.segments[1].a, { x: 4.5, y: 5.6, z: 2.705 }, 'jusqu’à la descente de la borne');
  const longueur = gl.segments.reduce((t, s) => t + Math.hypot(s.a.x - s.de.x, s.a.y - s.de.y), 0);
  assert.ok(Math.abs(longueur - 6.0) < 1e-9, `6,00 m, pas ${longueur}`);
  for (const ref of ['CH-02', 'CH-04', 'CH-B2', 'BD-01', 'BD-03']) {
    assert.equal(modele.cheminements.some((c) => c.reference === ref) || modele.composants.some((c) => c.reference === ref), false, `${ref} a disparu`);
  }
});

test('un conduit qui sort par une face du profilé y est raccordé, un conduit qui s’arrête juste dessous ne l’est pas', () => {
  // CH-05 part du DESSOUS de GL-02, à 2,66 m, 4,5 centimètres sous l'axe. Le
  // profilé l'accueille ; une extrémité posée deux centimètres plus bas pend.
  assert.equal(ch(modele, 'CH-05').segments[0].de.z, 2.66);
  const tol = modele.presentation.toleranceRaccordement;
  assert.equal(pointSurProfile({ x: 5.6, y: 2.6, z: 2.66 }, ch(modele, 'GL-02'), tol), true, 'le dessous');
  assert.equal(pointSurProfile({ x: 5.56, y: 2.6, z: 2.75 }, ch(modele, 'GL-02'), tol), true, 'la face avant, au plafond');
  assert.equal(pointSurProfile({ x: 5.6, y: 2.6, z: 2.64 }, ch(modele, 'GL-02'), tol), false, 'deux centimètres sous le profilé');

  const a = apports();
  a[0].cheminements.find((c) => c.reference === 'CH-05').segments[0].de.z = 2.64;
  const d = validerCheminements(modeleDe(a));
  assert.ok(d.some((x) => x.regle === 'V15' && /CH-05/.test(x.message)), 'V15 : l’extrémité pend sous le profilé');
});

test('la ligne de la borne court d’un seul tenant, sans connecteur, et hors de tout conduit partagé', () => {
  const g = construireGraphe(modele);
  const conducteurs = conducteursDuCircuit(g, modele, 'c-borne');
  const refs = new Map(modele.cheminements.map((c) => [c.id, c.reference]));
  for (const c of conducteurs) {
    assert.deepEqual(c.cheminements.map((id) => refs.get(id)).sort(), ['CH-B3', 'GL-01', 'GL-02']);
  }
  for (const [id, r] of connecteursParEnveloppe(modele, g)) {
    const borne = r.circuits.find((x) => x.circuit === 'c-borne');
    if (borne) assert.equal(borne.traverse, true, `aucun connecteur de la borne dans ${id}`);
  }
  // Là où elle est en conduit, le conduit ne porte qu'elle.
  assert.deepEqual(ch(modele, 'CH-B3').circuits, ['c-borne']);
  // Et elle cohabite désormais sur 7,12 m : 1,12 m de GL-01 et 6,00 m de GL-02.
  const profiles = modele.cheminements.filter((c) => c.raccordement === 'lateral' && c.circuits.includes('c-borne'));
  const longueur = profiles.flatMap((c) => c.segments).reduce((t, s) => t + Math.hypot(s.a.x - s.de.x, s.a.y - s.de.y, s.a.z - s.de.z), 0);
  assert.ok(Math.abs(longueur - 7.12) < 1e-9);
  assert.ok(Math.abs(longueursDepuisTableau(g, modele, 'c-borne').plusLong.longueur - 10.61) < 0.005);
});

test('sous le capot, un conducteur ne compte que ce qu’il parcourt', () => {
  // Le retour de CM-03 monte CH-05 et ressort aussitôt par le fond vers EL-03 :
  // il parcourt 0,045 m de goulotte, du dessous à l'axe, et non les 6,00 m du profilé.
  // La traversée l'y reprend à son entrée, sur l'axe.
  const g = construireGraphe(modele);
  const retour = conducteursDuCircuit(g, modele, 'c-eclairage').find((c) => c.role === 'retour-commande');
  assert.ok(Math.abs(retour.longueur - (1.56 + 0.045)) < 1e-9, `${retour.longueur}`);
});

test('TV-L2 part du fond de la goulotte en pente, et V18 borne son entrée au profilé', () => {
  // Dans le 90 × 40, l'axe du perçage, à 2,6525 m, frôle le dessous du profilé : c'est
  // l'ENTRÉE, à mi-hauteur, qui débouche dans la goulotte, et par elle que la
  // traversée s'y raccorde.
  const tv = modele.traversees.find((t) => t.reference === 'TV-L2');
  assert.equal(tv.denivele, 0.105);
  const entree = entreeDeTraversee(modele.local, tv);
  const sortie = sortieDeTraversee(modele.local, tv);
  assert.ok(Math.abs(entree.z - 2.705) < 1e-9, 'entrée à mi-hauteur du profilé');
  assert.ok(Math.abs(sortie.z - 2.6) < 1e-9, 'sortie sous EL-03, qui garde sa hauteur');
  assert.equal(modele.composants.find((c) => c.reference === 'EL-03').position.z, 2.6);
  assert.deepEqual(validerCheminements(modele).filter((d) => d.regle === 'V18'), []);

  // Son axe frôle le dessous du profilé, à 7,5 mm du bout de CH-05 : moins que la
  // tolérance de raccordement. Raccordée par son axe, la traversée fusionnerait avec
  // la descente, et le retour de CM-03 sauterait l'axe du profilé. Elle se raccorde
  // par son entrée, sur l'axe, et reste un nœud distinct.
  const g = construireGraphe(modele);
  const duTrou = g.noeuds.find((n) => n.traversees.includes(tv.id));
  assert.ok(Math.abs(duTrou.point.z - 2.705) < 1e-9, 'raccordée à son entrée, sur l’axe');
  assert.notEqual(duTrou, g.noeudAu(ch(modele, 'CH-05').segments[0].de), 'et non au bout de CH-05');

  // Un dénivelé qui ferait entrer la mèche au-dessus du profilé est refusé.
  const a = apports();
  Object.assign(a[1].traversees.find((t) => t.reference === 'TV-L2'), { position: { x: 5.6, y: 2.6, z: 2.7 }, denivele: 0.2 });
  const d = validerCheminements(modeleDe(a)).filter((x) => x.regle === 'V18');
  assert.equal(d.length, 1);
  assert.match(d[0].message, /sort de « GL-02 »/);
});

test('le coude du départ de plafond est un accessoire, et sa fiche dit qu’on n’y connecte rien', () => {
  const ac = modele.composants.find((c) => c.reference === 'AC-01');
  assert.equal(ac.type, 'accessoire-conduit');
  assert.deepEqual(ch(modele, 'CH-07').segments[0].de, ac.position, 'CH-07 part du coude');
  assert.equal(connecteursParEnveloppe(modele).has(ac.id), false, 'aucun connecteur à y compter');
  const l = caracteristiques(ac, modele.circuits, { types: modele.types.types });
  assert.match(l.find((x) => x.libelle === 'Connexions').texte, /aucune/);
  const bd04 = modele.composants.find((c) => c.reference === 'BD-04');
  assert.equal(caracteristiques(bd04, modele.circuits, { types: modele.types.types }).some((x) => x.libelle === 'Connexions'), false);
});

test('la goulotte ne heurte aucun obstacle relevé', () => {
  const bilan = controlerCollisions(modele);
  const gl = bilan.resultats.filter((c) => c.cheminement === ch(modele, 'GL-02').id);
  assert.ok(gl.length > 0, 'le contrôle doit s’exercer sur la goulotte');
  assert.equal(gl.some((c) => c.verdict === VERDICTS.COLLISION), false);
  assert.equal(bilan.collisions, 0, 'et le bilan d’ensemble reste sans collision');
});

test('aucun conduit horizontal ne double plus la goulotte sur la paroi est', () => {
  // Les parcours parallèles de la bande au-dessus du linteau ont disparu. Un
  // conduit qui y reviendrait longerait le profilé : V20 le refuse.
  const a = apports();
  a[2].cheminements.push({
    id: 'br-ch-x', reference: 'CH-BX', circuits: ['c-borne'], section: { forme: 'circulaire', diametre: 0.025 },
    segments: [{ face: 'est', de: { x: 5.6, y: 0.7, z: 2.6 }, a: { x: 5.6, y: 2.6, z: 2.6 } }],
  });
  assert.ok(regles(validerCheminements(modeleDe(copie(a)))).includes('V20'));
});

test('la borne est un câble 3G10 : le tube le reçoit comme un objet, et il s’achète au mètre de câble', async () => {
  // Décision du maître d'ouvrage du 2026-09-24, descente maintenue en IRL 25 :
  // dérogation au Principe III, écrite à la note de calcul de la borne.
  const { validerApport } = await import('../src/donnees/validation.js');
  const { conducteursParSection } = await import('../src/donnees/fournitures.js');
  const borne = modele.circuits.find((c) => c.id === 'c-borne');
  assert.equal(borne.cable, '3G10');
  assert.equal(borne.conducteurs, 3, 'ses conducteurs restent décomptés, rôle par rôle');
  const metre = conducteursParSection(modele).find((c) => c.section === 10);
  assert.equal(metre.longueur, 10.48, '10,48 m de câble, et non 31,44 m de conducteur');

  const sansDecompte = copie(BORNE());
  delete sansDecompte.circuits[0].conducteurs;
  delete sansDecompte.circuits[0].detailConducteurs;
  assert.ok(validerApport(sansDecompte, SOCLE()).some((x) => /cable est déclaré sans conducteurs/.test(x.message)));
});
