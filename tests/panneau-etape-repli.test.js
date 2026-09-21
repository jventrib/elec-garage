/**
 * Le repli du panneau d'étape.
 *
 * Pas de DOM hors navigateur : l'élément et la racine sont simulés au plus juste.
 * Ce qui se vérifie ici, c'est l'état — classe posée sur la racine, mémorisé, et
 * qui survit au changement d'étape — et que l'en-tête rendu garde le rang et le
 * badge SOUS TENSION hors de ce que le repli masque.
 */

import test from 'node:test';
import assert from 'node:assert/strict';
import { SOCLE } from './_aides.js';
import { creerPanneauEtape, CLE_REPLIE, CLASSE_REPLIE } from '../src/ui/panneau-etape.js';
import { stockageMemoire } from '../src/sequence/lecteur.js';

function racineSimulee() {
  const classes = new Set();
  return { classes, classList: { toggle: (c, v) => (v ? classes.add(c) : classes.delete(c)) } };
}

function elementSimule() {
  const bouton = { textContent: '', attributs: {}, setAttribute(k, v) { this.attributs[k] = v; } };
  const ecouteurs = [];
  return {
    bouton,
    innerHTML: '',
    addEventListener: (t, f) => ecouteurs.push(f),
    querySelector: (s) => (s === '[data-replier]' ? bouton : null),
    cliquerReplier: () => ecouteurs.forEach((f) => f({ target: { closest: (s) => (s === '[data-replier]' ? bouton : null) } })),
  };
}

const etape = { id: 'e', phase: 'essais-sous-tension', nature: 'verification', sousTension: true, instruction: 'Essayer.' };

test('replier pose la classe sur la racine, le mémorise, et le rend à la réouverture', () => {
  const stockage = stockageMemoire();
  const racine = racineSimulee();
  const element = elementSimule();
  const p = creerPanneauEtape(element, {}, SOCLE().chantier, { stockage, racine });
  p.afficher(etape, 3, 40, new Map());
  assert.equal(racine.classes.has(CLASSE_REPLIE), false, 'déplié par défaut');
  assert.equal(element.bouton.attributs['aria-expanded'], 'true');

  element.cliquerReplier();
  assert.equal(racine.classes.has(CLASSE_REPLIE), true);
  assert.equal(stockage.lire(CLE_REPLIE), '1');
  assert.equal(element.bouton.attributs['aria-expanded'], 'false');

  // Changer d'étape ne déplie pas.
  p.afficher(etape, 4, 40, new Map());
  assert.equal(racine.classes.has(CLASSE_REPLIE), true);

  // Réouverture : un panneau neuf sur le même stockage part replié.
  const autre = racineSimulee();
  const q = creerPanneauEtape(elementSimule(), {}, SOCLE().chantier, { stockage, racine: autre });
  q.afficher(etape, 4, 40, new Map());
  assert.equal(autre.classes.has(CLASSE_REPLIE), true);
});

test('le bouton de repli est une icône nommée, et le rang reste dans l’en-tête', () => {
  const element = elementSimule();
  const p = creerPanneauEtape(element, {}, SOCLE().chantier, { stockage: stockageMemoire(), racine: racineSimulee() });
  p.afficher(etape, 3, 40, new Map());
  const entete = element.innerHTML.match(/<div class="entete">([\s\S]*?)<\/div>/)[1];
  assert.match(entete, /Étape 3 sur 40/);
  assert.match(entete, /SOUS TENSION/);
  // Une icône sans nom est un bouton muet pour un lecteur d'écran.
  assert.match(element.innerHTML, /^<button[^>]*data-replier[^>]*><svg[^>]*aria-hidden="true"/);
  assert.equal(element.bouton.attributs['aria-label'], 'Replier l’instruction');
  element.cliquerReplier();
  assert.equal(element.bouton.attributs['aria-label'], 'Déplier l’instruction');
});
