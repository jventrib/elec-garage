import test from 'node:test';
import assert from 'node:assert/strict';
import { SOCLE, DEMO, copie } from './_aides.js';
import { fusionner } from '../src/donnees/chargement.js';
import { composerSequence } from '../src/sequence/ordonnancement.js';
import { etatParGenre } from '../src/sequence/etat.js';
import { construireLocal } from '../src/scene/local.js';
import { construireObstacles } from '../src/scene/obstacles.js';
import { construireComposants, couleurDeCircuit, gabarit } from '../src/scene/composants.js';
import { construireCheminements } from '../src/scene/cheminements.js';

/*
 * Ces constructeurs n'emploient que des classes pures de three.js — géométries,
 * matériaux, groupes — et aucun contexte WebGL. Seul creerVue en a besoin. Les
 * exclure des tests était un angle mort injustifié : c'est lui qui a laissé passer
 * un appel de fonction privé de son second argument, et deux identifiants
 * référencés sans être déclarés. `node --check` ne voit ni l'un ni l'autre.
 */

const socle = SOCLE();
const modele = fusionner(socle, [DEMO()]);
const sequence = composerSequence(modele);

test('le local se construit et porte sol, plafond et parois', () => {
  const { groupe, plafond, sol } = construireLocal(modele.local, modele.presentation);
  assert.ok(groupe.children.length > 0);
  assert.equal(plafond.name, 'plafond');
  assert.equal(sol.name, 'sol');
  assert.ok(groupe.children.some((c) => c.name === 'paroi-est'));
  assert.ok(groupe.children.some((c) => c.name?.startsWith('linteau-')), 'la porte de service a une hauteur relevée, donc un linteau');
});

test('les obstacles se construisent, y compris ceux sans baie', () => {
  const o = construireObstacles(modele.local, modele.presentation);
  assert.ok(o.groupe.children.length > 0);
  const ids = o.incertains.map((x) => x.id);
  assert.ok(ids.includes('gabarit-manoeuvre-vehicule'), 'le gabarit véhicule ne se rattache à aucune baie');
  assert.ok(ids.includes('tablier-sectionnelle-ouvert'));
});

test('les composants se construisent — un marqueur par composant', () => {
  const c = construireComposants(modele);
  assert.equal(c.groupe.children.length, modele.composants.length);
  assert.equal(c.meshes().length, modele.composants.length);
  for (const composant of modele.composants) {
    assert.ok(c.parId.has(composant.id), `${composant.reference} absent de la scène`);
  }
});

test('les cheminements se construisent — un nœud par cheminement et par traversée', () => {
  const ch = construireCheminements(modele);
  assert.equal(ch.groupe.children.length, modele.cheminements.length + modele.traversees.length);
  assert.ok(ch.meshes().length >= modele.cheminements.length);
});

test('appliquerEtat traverse tous les rangs sans erreur', () => {
  // Le parcours complet de la séquence, sur les deux constructeurs qui réagissent
  // au rang. C'est ce qui exerce les identifiants du corps des fonctions.
  const composants = construireComposants(modele);
  const cheminements = construireCheminements(modele);
  for (let r = 1; r <= sequence.total; r++) {
    const partition = etatParGenre(sequence, modele, r);
    assert.doesNotThrow(() => composants.appliquerEtat(partition.composants));
    assert.doesNotThrow(() => cheminements.appliquerEtat(partition));
  }
});

test('souligner un circuit ne lève pas, sur les composants comme sur les tracés', () => {
  const composants = construireComposants(modele);
  const cheminements = construireCheminements(modele);
  const partition = etatParGenre(sequence, modele, sequence.total);
  composants.appliquerEtat(partition.composants);
  cheminements.appliquerEtat(partition);
  assert.doesNotThrow(() => composants.souligner('c-demo'));
  assert.doesNotThrow(() => cheminements.souligner('c-demo'));
  assert.doesNotThrow(() => composants.souligner(null));
});

test('au dernier rang, tout composant et tout conduit est visible', () => {
  const composants = construireComposants(modele);
  const cheminements = construireCheminements(modele);
  const partition = etatParGenre(sequence, modele, sequence.total);
  composants.appliquerEtat(partition.composants);
  cheminements.appliquerEtat(partition);
  const visibles = composants.groupe.children.filter((n) => n.visible).length;
  assert.equal(visibles, modele.composants.length);
  assert.equal(cheminements.groupe.children.filter((n) => n.visible).length,
    modele.cheminements.length + modele.traversees.length);
});

test('gabarit prend ses dimensions dans le catalogue', () => {
  const socleDouble = modele.composants.find((c) => c.type === 'socle-double');
  const g = gabarit(socleDouble, modele.types);
  const attendu = modele.types.types.find((t) => t.id === 'socle-double').gabarit;
  assert.ok(g.dims.includes(attendu.largeur));
  assert.ok(g.dims.includes(attendu.hauteur));
});

test('gabarit retombe sur le gabarit par défaut pour un type inconnu', () => {
  const g = gabarit({ type: 'inexistant', paroi: 'est', face: 'interieur' }, modele.types);
  const d = modele.types.gabaritParDefaut;
  assert.ok(g.dims.includes(d.largeur));
});

test('le décalage sort le marqueur du bon côté du nu', () => {
  const dedans = gabarit({ type: 'socle-simple', paroi: 'est', face: 'interieur' }, modele.types);
  const dehors = gabarit({ type: 'socle-simple', paroi: 'est', face: 'exterieur' }, modele.types);
  // Sur la paroi est, l'intérieur est du côté des x décroissants.
  assert.ok(dedans.decalage[0] < 0);
  assert.ok(dehors.decalage[0] > 0);
});

test('couleurDeCircuit exige sa présentation et ne la devine pas', () => {
  assert.equal(couleurDeCircuit(modele.circuits, 'c-demo', modele.presentation), '#1f77b4');
  assert.equal(
    couleurDeCircuit(modele.circuits, null, modele.presentation),
    modele.presentation.couleurs.composantSansCircuit,
  );
});

test('un modèle privé de son catalogue de types échoue au montage, sans silence', () => {
  const casse = { ...modele, types: undefined };
  assert.throws(() => construireComposants(casse));
});
