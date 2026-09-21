/**
 * Le rendu du perçage.
 *
 * Une traversée était dessinée DROITE, à altitude constante — c'est-à-dire
 * exactement la faute que l'instruction de l'étape met en garde de commettre. Un
 * avertissement écrit ne corrige pas un geste naturel ; une image qui le
 * contredit, si.
 */

import test from 'node:test';
import assert from 'node:assert/strict';
import { SOCLE, PRISES, ECLAIRAGE, BORNE, copie } from './_aides.js';
import { fusionner } from '../src/donnees/chargement.js';
import { construireCheminements } from '../src/scene/cheminements.js';
import { composerSequence } from '../src/sequence/ordonnancement.js';
import { percagesDeLEtape, gardesDuPercage, NATURES } from '../src/scene/percages.js';
import { caracteristiquesTraversee, caracteristiquesPercage } from '../src/ui/fiche-composant.js';
import { chevilleDe } from '../src/donnees/validation.js';

const modele = (pr) => fusionner(SOCLE(), [pr ?? PRISES(), ECLAIRAGE(), BORNE()]);

/** Les deux bouts du fourreau, lus sur ce que la scène a construit. */
function bouts(rendu, id) {
  const e = rendu.traverseesParId?.get(id) ?? null;
  return e ? { entree: e.entree, sortie: e.sortie, connu: e.deniveleConnu } : null;
}

test('une traversée cotée est dessinée en biais, sortie plus basse', () => {
  const a = copie(PRISES());
  a.traversees.find((x) => x.reference === 'TV-01').denivele = 0.04;
  const m = modele(a);
  const r = construireCheminements(m);
  const b = bouts(r, 'pr-tv-01');
  assert.ok(b, 'la traversée doit être rendue');
  assert.equal(b.connu, true);
  assert.ok(b.sortie.z < b.entree.z - 1e-9, 'la sortie doit être plus basse que l’entrée');
  assert.ok(Math.abs((b.entree.z - b.sortie.z) - 0.04) < 1e-6, 'et de la cote déclarée');
});

test('une traversée NON cotée n’est jamais dessinée horizontale', () => {
  // LE test du fichier. Le repli naturel — dessiner à plat faute de mieux —
  // figurerait la faute elle-même. On dessine donc à une pente conventionnelle,
  // et c'est la fiche qui dit « inconnu ».
  const m = modele();
  const r = construireCheminements(m);
  const nonCotees = m.traversees.filter((t) => typeof t.denivele !== 'number');
  assert.ok(nonCotees.length > 0, 'des traversées restent non cotées, sinon ce test ne prouve rien');
  for (const t of nonCotees) {
    const b = bouts(r, t.id);
    assert.equal(b.connu, false, `${t.reference} : son dénivelé n’est pas coté`);
    assert.ok(
      b.sortie.z < b.entree.z - 1e-9,
      `${t.reference} est dessinée horizontale : c’est exactement la faute que l’étape met en garde de commettre`,
    );
  }
});

test('la pente conventionnelle reste distincte de toute cote réelle', () => {
  // Même discipline que le diamètre de dessin d'un conduit : la convention ne
  // doit pas pouvoir se confondre avec une valeur arrêtée.
  const socle = SOCLE();
  const conventionnel = socle.presentation.deniveleConventionnel;
  assert.ok(conventionnel > 0, 'la convention doit exister');
  // Un seul dénivelé est arrêté à ce jour, celui de TV-L2 : il part du fond de la
  // goulotte GL-02, à 2,69 m, et ressort sous EL-03 à 2,60 m. C'est la géométrie
  // qui le fixe, et non un boîtier. Il ne doit pas se confondre avec la convention.
  const m = modele();
  const reels = m.traversees.filter((t) => t.denivele !== null && t.denivele !== undefined);
  assert.deepEqual(reels.map((t) => t.reference), ['TV-L2'], 'seul le dénivelé de TV-L2 est arrêté');
  assert.notEqual(reels[0].denivele, conventionnel, 'et il n’est pas la pente conventionnelle');
});

test('les trois natures de perçage se distinguent', () => {
  const m = modele();
  const s = composerSequence(m);
  const e = s.etapes.find((x) => x.id === 'pr-percage');
  const p = percagesDeLEtape(m, SOCLE(), e);
  const natures = new Set(p.map((x) => x.nature));
  assert.deepEqual([...natures].sort(), ['collier', 'objet', 'traversee']);
  for (const x of p) assert.ok(NATURES[x.nature].outil, `${x.nature} doit porter son outil`);
});

test('l’étape de perçage ne rend plus une vue vide', () => {
  const m = modele();
  const s = composerSequence(m);
  for (const e of s.etapes.filter((x) => x.phase === 'percage')) {
    assert.ok(percagesDeLEtape(m, SOCLE(), e).length > 0, `« ${e.id} » ne rend aucun perçage`);
  }
});

test('sans entraxe, les colliers se déclarent inconnus et ne s’inventent pas', () => {
  const m = modele();
  const e = composerSequence(m).etapes.find((x) => x.id === 'br-percage');
  const colliers = percagesDeLEtape(m, SOCLE(), e).filter((x) => x.nature === 'collier');
  assert.ok(colliers.length > 0);
  for (const c of colliers) {
    assert.equal(c.inconnu, true, 'un entraxe absent ne produit pas de répartition');
    assert.equal(c.position, null, 'et surtout aucune position');
  }
});

test('avec un entraxe renseigné, les colliers se répartissent', () => {
  const socle = copie(SOCLE());
  socle.chantier.fixations.entraxe = 0.6;
  const m = fusionner(socle, [PRISES(), ECLAIRAGE(), BORNE()]);
  const e = composerSequence(m).etapes.find((x) => x.id === 'br-percage');
  const colliers = percagesDeLEtape(m, socle, e).filter((x) => x.nature === 'collier');
  assert.ok(colliers.length > 2, `${colliers.length} colliers répartis`);
  for (const c of colliers) assert.ok(c.position, 'chacun porte sa position');
});

test('les deux gardes serrées du projet se signalent sur le perçage', () => {
  // TV-L1 est le cas le plus contraint : la prose annonce 0,12 m sous le linteau
  // et 0,13 m sous le rail. Le calcul doit les retrouver, sans quoi la garde
  // resterait un paragraphe qu'on lit une fois.
  const m = modele();
  const e = composerSequence(m).etapes.find((x) => x.id === 'ec-percage');
  const tvl1 = percagesDeLEtape(m, SOCLE(), e).find((x) => x.reference === 'TV-L1');
  assert.ok(tvl1, 'TV-L1 doit être un perçage de cette étape');
  const gardes = gardesDuPercage(m, tvl1);
  assert.ok(gardes.length > 0, 'elle doit porter ses gardes');
  assert.ok(gardes.some((g) => g.serre), 'et signaler celles qui sont serrées');
  const rail = gardes.find((g) => /[Rr]ail/.test(g.quoi));
  assert.ok(rail && Math.abs(rail.distance - 0.13) < 0.005, `garde au rail : ${rail?.distance?.toFixed(3)} m, attendu 0,13`);
});

test('la fiche d’une traversée porte son dénivelé, et « inconnu » tant qu’il ne l’est pas', () => {
  const m = modele();
  const t = m.traversees[0];
  const lignes = caracteristiquesTraversee(t, {});
  const d = lignes.find((l) => l.libelle === 'Dénivelé de perçage');
  assert.ok(d, 'la ligne doit exister');
  assert.match(d.texte, /inconnu/i, 'et dire inconnu plutôt que de laisser croire à zéro');
});

test('la fiche d’un perçage tait le diamètre tant que la cheville n’est pas choisie', () => {
  const m = modele();
  const e = composerSequence(m).etapes.find((x) => x.id === 'pr-percage');
  const p = percagesDeLEtape(m, SOCLE(), e).find((x) => x.nature === 'objet');
  const lignes = caracteristiquesPercage(p, NATURES.objet, chevilleDe(SOCLE()), []);
  assert.match(lignes.find((l) => l.libelle === 'Outil').texte, /perforateur/);
  assert.match(lignes.find((l) => l.libelle === 'Diamètre de perçage').texte, /inconnu/i);
});
