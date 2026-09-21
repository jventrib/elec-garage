import test from 'node:test';
import assert from 'node:assert/strict';
import { SOCLE, DEMO } from './_aides.js';
import { fusionner } from '../src/donnees/chargement.js';
import {
  caracteristiquesCheminement,
  caracteristiquesTraversee,
  INCONNU,
} from '../src/ui/fiche-composant.js';

const socle = SOCLE();
const modele = fusionner(socle, [DEMO()]);
const VOCA = { ...socle.presentation.libelles, types: socle.types.types };
const ch = (id) => modele.cheminements.find((c) => c.id === id);
const ligne = (liste, libelle) => liste.find((l) => l.libelle === libelle);

test('un diamètre non arrêté ressort « inconnu » et jamais le diamètre de dessin', () => {
  const l = caracteristiquesCheminement(ch('ch-03'), modele.circuits);
  const d = ligne(l, 'Diamètre');
  assert.equal(d.texte, INCONNU);
  assert.equal(d.inconnu, true);
  // Le diamètre conventionnel sert à dessiner, pas à renseigner.
  assert.notEqual(d.texte, `${socle.presentation.diametreConduitConventionnel} m`);
});

test('un diamètre arrêté est affiché avec son unité', () => {
  const d = ligne(caracteristiquesCheminement(ch('ch-01'), modele.circuits), 'Diamètre');
  assert.equal(d.texte, '0.025 m');
  assert.equal(d.inconnu, false);
});

test('la longueur est dérivée des segments et non saisie', () => {
  const l = ligne(caracteristiquesCheminement(ch('ch-01'), modele.circuits), 'Longueur');
  assert.equal(l.texte, '3.3 m');
  assert.equal('longueur' in ch('ch-01'), false);
});

test('les circuits portés sont nommés par leur libellé', () => {
  const c = ligne(caracteristiquesCheminement(ch('ch-01'), modele.circuits), 'Circuits portés');
  assert.equal(c.texte, 'Démonstration — prises garage');
  assert.equal(c.inconnu, false);
});

test('un conduit portant plusieurs circuits est signalé comme groupement', () => {
  const multi = { ...ch('ch-03'), circuits: ['c-demo', 'c-autre'] };
  const g = ligne(caracteristiquesCheminement(multi, modele.circuits), 'Groupement');
  assert.match(g.texte, /facteur de correction/);
  const seul = ligne(caracteristiquesCheminement(ch('ch-03'), modele.circuits), 'Groupement');
  assert.equal(seul.texte, 'non');
});

test('la fiche d’une traversée annonce son sens et sa pente', () => {
  const t = modele.traversees[0];
  const l = caracteristiquesTraversee(t, VOCA);
  assert.match(ligne(l, 'Paroi traversée').texte, /est/);
  assert.match(ligne(l, 'Sens').texte, /vers l'extérieur/);
  assert.equal(ligne(l, 'Pente vers l’extérieur').texte, 'oui');
});

test('aucune caractéristique inconnue ne porte de valeur de remplacement', () => {
  for (const c of modele.cheminements) {
    for (const l of caracteristiquesCheminement(c, modele.circuits)) {
      if (l.inconnu) assert.equal(l.texte, INCONNU);
      else assert.notEqual(l.texte, INCONNU);
    }
  }
});
