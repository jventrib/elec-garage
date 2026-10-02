import test from 'node:test';
import assert from 'node:assert/strict';
import { DEMO, ECLAIRAGE, SOCLE } from './_aides.js';
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
  const composant = trouver('pc-01');
  const ligne = caracteristiques(composant, apport.circuits, VOCA).find(
    (l) => l.libelle === "Hauteur d'axe",
  );
  assert.equal(ligne.texte, `${composant.hauteurAxe} m`, 'la valeur affichée vient des données');
  assert.equal(ligne.inconnu, false);
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

test('le dégagement de la zone de travail se lit, et se nomme', () => {
  // `zoneTablier` était un champ que personne ne lisait : la donnée le portait, la
  // fiche l'ignorait, et rien ne pouvait le déduire à sa place — c'est un relevé.
  // Un relevé invisible est une information que l'installateur ne peut pas utiliser,
  // et que personne ne maintient. Ces deux assertions le disent dans les deux sens :
  // la ligne existe quand le relevé existe, et elle n'apparaît pas quand il n'y en a pas.
  const el = ECLAIRAGE().composants.filter((c) => c.zoneTablier);
  assert.ok(el.length > 0, 'l’éclairage relève des zones de travail');

  for (const c of el) {
    const ligne = caracteristiques(c, [], { ...VOCA, zonesTablier: VOCA.zonesTablier }).find(
      (l) => l.libelle === 'Zone de travail',
    );
    assert.ok(ligne, `${c.reference} relève une zone de travail, la fiche doit la montrer`);
    assert.equal(ligne.texte, VOCA.zonesTablier[c.zoneTablier], 'et le nom vient du vocabulaire, pas du code');
    assert.equal(ligne.inconnu, false, '« non concluant » est une valeur, pas une absence de valeur');
  }

  const sans = ECLAIRAGE().composants.find((c) => !c.zoneTablier);
  if (sans) {
    const lignes = caracteristiques(sans, [], VOCA);
    assert.ok(!lignes.some((l) => l.libelle === 'Zone de travail'), 'pas de relevé, pas de ligne');
  }
});
