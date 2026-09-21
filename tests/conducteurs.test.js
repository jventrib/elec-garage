/**
 * Le décompte des conducteurs d'un tube, tel que la fiche le montre.
 *
 * Demandé le 2026-09-22 : « avoir le détail du nombre de fils dans un tube
 * lorsque l'on clique dessus ». Le chiffre existait déjà — mais dans la note de
 * calcul, en prose, c'est-à-dire là où personne ne le lit au moment de tirer.
 *
 * Il n'est pas recopié dans la fiche : il se **dérive**. Le même jour, une
 * seconde question — « pourquoi huit conducteurs dans CH-07 ? » — a montré que la
 * première dérivation s'arrêtait à mi-chemin : elle sommait le nombre DÉCLARÉ par
 * chaque circuit, donc un majorant uniforme, alors que CH-07 n'en porte que six.
 * Le décompte suit maintenant le trajet réel de chaque conducteur ; le nombre
 * déclaré reste, comme garde-fou et comme repli.
 *
 * Ce fichier vérifie ce que la FICHE montre. Le trajet lui-même, et les cas qui
 * l'ont fait écrire, sont dans `conducteurs-trajet.test.js`.
 */

import test from 'node:test';
import assert from 'node:assert/strict';
import { SOCLE, PRISES, ECLAIRAGE, BORNE, AUTOMATISATION, DEMO, copie } from './_aides.js';
import { fusionner } from '../src/donnees/chargement.js';
import { validerApport } from '../src/donnees/validation.js';
import { occupationParCheminement } from '../src/geometrie/conducteurs.js';
import { conducteursDe, caracteristiquesCheminement, INCONNU } from '../src/ui/fiche-composant.js';

const modele = fusionner(SOCLE(), [PRISES(), ECLAIRAGE(), BORNE(), AUTOMATISATION()]);
const occupation = occupationParCheminement(modele);
const conduit = (ref) => modele.cheminements.find((c) => c.reference === ref);
const fils = (ref) => conducteursDe(conduit(ref), modele.circuits, occupation);
const lignesDe = (ref) => caracteristiquesCheminement(conduit(ref), modele.circuits, occupation);
const par = (lignes, l) => lignes.find((x) => x.libelle === l)?.texte;

test('le décompte dérivé suit le trajet des conducteurs, non le majorant du circuit', () => {
  // Le tronc ne porte pas un nombre uniforme : chaque conduit porte ce que ses
  // conducteurs y font passer. CH-02 était le plus chargé depuis l'automatisation ;
  // il a disparu dans la goulotte GL-02, et c'est CH-05, qui en descend avec la
  // paire de CM-01 — et CH-07 porte quatre fils des prises, dont le fil d'ordre du
  // bouton de porte, et trois de l'éclairage.
  assert.equal(fils('CH-05').total, 9, 'le conduit le plus chargé du tronc');
  assert.equal(fils('CH-07').total, 7, 'quatre des prises, trois de l’éclairage');
  assert.equal(fils('CH-03').total, 3, 'branche propre aux prises');
  assert.equal(fils('CH-L3').total, 3, 'une branche du plafonnier : neutre, PE, et la sortie du module');
  assert.equal(fils('CH-B3').total, 3, 'ligne de la borne');
  assert.equal(fils('GL-02').total, 14, 'la goulotte : onze de l’usage courant, trois de la borne');
  for (const ref of ['GL-02', 'CH-05', 'CH-07', 'CH-L3', 'CH-B3']) {
    assert.equal(fils(ref).majore, false, `${ref} est dérivé, ce n'est plus une borne`);
  }
});

test('la condition de remplissage suit le décompte, et elle est exacte', () => {
  // `D ≥ d·√(3n)` est la règle du tiers écrite sans approximation, conduit par
  // conduit : chacun a sa condition, et un décompte faux la fausse.
  const proche = (v, attendu) => assert.ok(Math.abs(v - attendu) < 1e-9, `${v} au lieu de ${attendu}`);
  proche(fils('CH-05').facteur, Math.sqrt(27));
  proche(fils('CH-07').facteur, Math.sqrt(21));
  // La borne est un câble 3G10 depuis le 2026-09-24 : un seul objet dans le tube,
  // et la condition porte sur son diamètre d'ensemble — D ≥ d·√3.
  proche(fils('CH-B3').facteur, Math.sqrt(3));
  assert.match(par(lignesDe('CH-B3'), 'Remplissage exigé'), /n = 1 — d est le diamètre du câble 3G10/);
});

test('la fiche d’un conduit montre le nombre, sa répartition par rôle et la condition', () => {
  const lignes = lignesDe('CH-05');
  assert.equal(par(lignes, 'Conducteurs'), '9');
  assert.match(par(lignes, 'dont'), /3 pour .*\+ 6 pour /, 'la répartition doit nommer les deux circuits');
  // Ce qu'un installateur trouve en ouvrant la boîte : des rôles, pas un nombre.
  assert.match(par(lignes, 'dont'), /1 phase, 1 neutre, 1 PE\)/, 'et les rôles de chaque circuit');
  // L'ordre se nomme : c'est le fil qui ne porte aucune puissance, et qu'on ne
  // doit pas prendre pour un retour.
  assert.match(par(lignes, 'dont'), /1 phase, 1 neutre, 1 PE, 1 retour commandé, 2 ordres\)/);
  assert.match(par(lignes, 'Remplissage exigé'), /D ≥ d × 5\.2\b/, 'et donner le facteur, arrondi au centième');
  assert.match(par(lignes, 'Remplissage exigé'), /n = 9/);
});

test('un conduit dédié donne les rôles de ses fils plutôt qu’une répartition', () => {
  // Répéter « 3 pour la borne » sur un tube qui ne porte qu'elle n'apprend rien.
  // Ce qui est utile là, c'est QUELS fils.
  const lignes = lignesDe('CH-B3');
  assert.equal(par(lignes, 'dont'), undefined, 'pas de répartition sur un conduit dédié');
  assert.equal(par(lignes, 'soit'), '1 phase, 1 neutre, 1 PE');

  // Et sur une branche de l'éclairage, la sortie du module se nomme aussi — c'est
  // le fil qu'on ne trouve pas là où on le croit.
  assert.equal(par(lignesDe('CH-L3'), 'soit'), '1 neutre, 1 PE, 1 sortie de module');
});

test('un circuit sans décompte rend la ligne inconnue, il ne la devine pas', () => {
  // Le jeu de démonstration ne déclare rien de tel. La fiche doit le dire, et
  // surtout ne pas afficher une condition de remplissage fabriquée. Le nombre
  // déclaré reste exigé même depuis que le trajet est dérivé : il est le
  // garde-fou du chiffre dérivé.
  const demo = fusionner(SOCLE(), [DEMO()]);
  const ch = demo.cheminements[0];
  assert.equal(conducteursDe(ch, demo.circuits, occupationParCheminement(demo)), null);
  const lignes = caracteristiquesCheminement(ch, demo.circuits);
  assert.equal(lignes.find((x) => x.libelle === 'Conducteurs').texte, INCONNU);
  assert.equal(lignes.find((x) => x.libelle === 'Remplissage exigé').texte, INCONNU);
});

test('un conduit partagé dont un seul circuit compte ses fils ne rend pas un total faux', () => {
  // Le piège : sommer ce qu'on connaît et présenter le résultat comme le total.
  // Un décompte partiel est un décompte faux, et il vaut mieux ne rien dire.
  const sansCompte = modele.circuits.map((c) => (c.id === 'c-eclairage' ? { ...c, conducteurs: undefined } : c));
  assert.equal(
    conducteursDe(conduit('CH-05'), sansCompte, occupation),
    null,
    'un tronc partagé à moitié compté ne rend rien',
  );
});

test('un décompte mal formé est refusé, et un détail sans décompte aussi', () => {
  const socle = SOCLE();
  const a = copie(PRISES());
  a.circuits[0].conducteurs = 0;
  assert.ok(
    validerApport(a, socle).some((x) => /conducteurs doit être un entier/.test(x.message)),
    'zéro conducteur n’est pas un décompte',
  );

  const b = copie(PRISES());
  delete b.circuits[0].conducteurs;
  assert.ok(
    validerApport(b, socle).some((x) => /sans conducteurs/.test(x.message)),
    'un détail sans décompte ne se vérifie pas',
  );
});
