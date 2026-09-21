import test from 'node:test';
import assert from 'node:assert/strict';
import { DEMO, SOCLE } from './_aides.js';
import { caracteristiques, provenanceLisible, INCONNU } from '../src/ui/fiche-composant.js';
import { couleurDeCircuit } from '../src/scene/composants.js';

const apport = DEMO();
const socle = SOCLE();
const VOCA = { ...socle.presentation.libelles, types: socle.types.types };
const trouver = (id) => apport.composants.find((c) => c.id === id);

test('toutes les caractéristiques attendues sont présentes', () => {
  const libelles = caracteristiques(trouver('pc-01'), apport.circuits, VOCA).map((l) => l.libelle);
  for (const attendu of ['Référence', 'Type', 'Paroi', 'Face', "Hauteur d'axe", 'Indice de protection', 'Circuit']) {
    assert.ok(libelles.includes(attendu), `${attendu} manque`);
  }
});

test('une valeur nulle ressort comme inconnue, jamais comblée', () => {
  // PC-05 est au plafond : sa hauteur d'axe dépend du rail, non relevé.
  const lignes = caracteristiques(trouver('pc-05'), apport.circuits, VOCA);
  const hauteur = lignes.find((l) => l.libelle === "Hauteur d'axe");
  assert.equal(hauteur.texte, INCONNU);
  assert.equal(hauteur.inconnu, true);

  const ip = lignes.find((l) => l.libelle === 'Indice de protection');
  assert.equal(ip.texte, INCONNU);
  assert.equal(ip.inconnu, true);
});

test('aucune caractéristique inconnue ne porte de valeur de remplacement', () => {
  for (const composant of apport.composants) {
    for (const ligne of caracteristiques(composant, apport.circuits, VOCA)) {
      if (ligne.inconnu) assert.equal(ligne.texte, INCONNU);
      else assert.notEqual(ligne.texte, INCONNU);
    }
  }
});

test('une valeur connue est rendue avec son unité', () => {
  const lignes = caracteristiques(trouver('pc-01'), apport.circuits, VOCA);
  assert.equal(lignes.find((l) => l.libelle === "Hauteur d'axe").texte, '1.2 m');
  assert.equal(lignes.find((l) => l.libelle === "Hauteur d'axe").inconnu, false);
});

test('la face extérieure est nommée comme telle', () => {
  const dehors = caracteristiques(trouver('pc-02'), apport.circuits, VOCA).find((l) => l.libelle === 'Face');
  const dedans = caracteristiques(trouver('pc-01'), apport.circuits, VOCA).find((l) => l.libelle === 'Face');
  assert.equal(dehors.texte, 'extérieur');
  assert.equal(dedans.texte, 'intérieur');
});

test('un composant sans circuit affiche inconnu et non une valeur vide', () => {
  const ligne = caracteristiques(trouver('tableau'), apport.circuits, VOCA).find((l) => l.libelle === 'Circuit');
  assert.equal(ligne.texte, INCONNU);
  assert.equal(ligne.inconnu, true);
});

test('la provenance annonce l’absence de schéma et de note de calcul', () => {
  const lignes = provenanceLisible(apport.provenance);
  assert.equal(lignes.find((l) => l.libelle === 'Schéma unifilaire').texte, INCONNU);
  assert.equal(lignes.find((l) => l.libelle === 'Note de calcul').texte, INCONNU);
  assert.equal(lignes.find((l) => l.libelle === 'Relevé géométrique').inconnu, false);
});

test('la couleur de circuit déclarée est reprise, et le repli est déterministe', () => {
  const pres = socle.presentation;
  assert.equal(couleurDeCircuit(apport.circuits, 'c-demo', pres), '#1f77b4');
  const a = couleurDeCircuit([{ id: 'c-x', libelle: 'X' }], 'c-x', pres);
  const b = couleurDeCircuit([{ id: 'c-x', libelle: 'X' }], 'c-x', pres);
  assert.equal(a, b);
  assert.ok(pres.paletteCircuits.includes(a));
  // Sans circuit, la couleur vient aussi des données.
  assert.equal(couleurDeCircuit([], null, pres), pres.couleurs.composantSansCircuit);
});
