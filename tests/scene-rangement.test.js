/**
 * Le rendu du rangement : ce que la maquette montre, et ce qu'elle doit montrer.
 *
 * Deux propriétés portent le fichier, et ni l'une ni l'autre ne se vérifie à
 * l'oreille :
 *
 *  - **le volume dessiné vient du gabarit, jamais des cotes.** Les cotes du rack
 *    sont toutes contradictoires ou inconnues ; si la figure en sortait, la
 *    maquette arbitrerait à la place du maître d'ouvrage, et elle le ferait
 *    silencieusement, puisque le résultat serait net ;
 *  - **la convention est dite à l'écran.** Un volume dessiné sans étiquette qui
 *    en effet, redeviendrait une donnée présentée comme établie. C'est le défaut que
 *    ce fichier cherche à empêcher.
 *
 * Les étiquettes sont peintes sur un canevas : `avecCanevas` en fournit un, sans
 * lequel le module ne s'instancie pas.
 */

import test from 'node:test';
import assert from 'node:assert/strict';
import { SOCLE, PRISES, ECLAIRAGE, BORNE, AUTOMATISATION, RANGEMENT, avecCanevas } from './_aides.js';
import { fusionner } from '../src/donnees/chargement.js';
import { construireRangements } from '../src/scene/rangement.js';

const modele = () =>
  fusionner(SOCLE(), [PRISES(), ECLAIRAGE(), BORNE(), AUTOMATISATION(), RANGEMENT()]);

const scene = () => avecCanevas(() => construireRangements(modele()));

// ─── 4.1 — le module s'instancie et rend ses éléments ───────────────────────────

test('le module s\'instancie et expose son contrat', () => {
  const s = scene();
  for (const nom of ['groupe', 'basculer', 'meshes', 'rangementDe'])
    assert.equal(typeof s[nom], nom === 'groupe' ? 'object' : 'function', nom);
  assert.equal(s.groupe.name, 'rangements');
});

test('il n\'expose aucun appliquerEtat : le rangement n\'est pas dans la séquence', () => {
  assert.equal(scene().appliquerEtat, undefined);
});

test('chaque rangement est rendu, à son volume de gabarit', () => {
  const s = scene();
  assert.equal(s.parId.size, 3);
  for (const r of RANGEMENT().rangements) {
    const e = s.parId.get(r.id);
    assert.ok(e, r.id);
    const { min, max } = r.gabarit.volume;
    const taille = e.corps.geometry.parameters;
    assert.deepEqual(
      [taille.width, taille.height, taille.depth],
      [max.x - min.x, max.y - min.y, max.z - min.z],
      r.id,
    );
    assert.deepEqual(
      [e.corps.position.x, e.corps.position.y, e.corps.position.z],
      [min.x + (max.x - min.x) / 2, min.y + (max.y - min.y) / 2, min.z + (max.z - min.z) / 2],
      r.id,
    );
  }
});

test('le volume rendu est bien celui du gabarit, et non celui des cotes', () => {
  // Les cotes du rack donnent 0,55 m de haut ; son gabarit en donne 1,50. Si la
  // figure suivait les cotes, elle serait trois fois trop basse — et le défaut
  // passerait inaperçu, parce que la figure serait encore plausible.
  const s = scene();
  const p = s.parId.get('rg-01').corps.geometry.parameters;
  // Tolérance : 2,3 − 0,8 ne vaut pas exactement 1,5 en binaire, et il serait
  // absurde qu'un arrondi de virgule flottante fasse échouer un test de fond.
  const proche = (a, b) => assert.ok(Math.abs(a - b) < 1e-9, `${a} ≠ ${b}`);
  proche(p.width, 0.55);
  proche(p.height, 1.44);
  proche(p.depth, 1.5);
  assert.equal(RANGEMENT().rangements.find((r) => r.id === 'rg-01').cotes.hauteur.valeur, 0.55);
});

test('un gabarit d\'épaisseur nulle ne produit pas une boîte dégénérée', () => {
  const m = modele();
  const rg = m.rangements.find((r) => r.id === 'et-01');
  rg.gabarit.volume.max.z = rg.gabarit.volume.min.z;
  const s = avecCanevas(() => construireRangements(m));
  assert.ok(s.parId.get('et-01').corps.geometry.parameters.depth > 0);
});

test('le rendu tient dans le local', () => {
  const { oeuvre, hauteurSousPlafond } = SOCLE().local;
  const s = scene();
  for (const [id, e] of s.parId) {
    const { min, max } = RANGEMENT().rangements.find((r) => r.id === id).gabarit.volume;
    assert.ok(min.x >= 0 && min.y >= 0 && min.z >= 0, id);
    assert.ok(max.x <= oeuvre.x && max.y <= oeuvre.y && max.z <= hauteurSousPlafond, id);
    assert.ok(e.corps.position.z > 0, id);
  }
});

// ─── 4.2 — l\'identité de l\'objet par le mesh ──────────────────────────────────

test('chaque mesh porte son rangement en userData', () => {
  const s = scene();
  for (const corps of s.meshes()) {
    const r = s.rangementDe(corps);
    assert.ok(r, 'un mesh sans rangement ne serait pas désignable');
    assert.equal(r.id, s.rangementDe(corps).id);
  }
  assert.equal(s.meshes().length, 3);
});

test('rangementDe rend null pour un objet d\'un autre module', () => {
  const s = scene();
  assert.equal(s.rangementDe(null), null);
  assert.equal(s.rangementDe({}), null);
  assert.equal(s.rangementDe({ userData: {} }), null);
  assert.equal(s.rangementDe({ userData: { obstacle: { id: 'rail-sectionnelle' } } }), null);
  assert.equal(s.rangementDe({ userData: { composant: { id: 'au-mc-01' } } }), null);
});

test('rangementDe rend l\'élément, avec ses cotes', () => {
  const s = scene();
  const corps = s.meshes().find((c) => s.rangementDe(c)?.id === 'rg-01');
  const r = s.rangementDe(corps);
  assert.equal(r.libelle, 'Rack mural pliable à roues');
  assert.equal(r.gabarit.origine, 'gabarit-catalogue');
  assert.equal(r.cotes.largeur.etat, 'contradictoire');
});

// ─── la convention se lit à l'écran ───────────────────────────────────────────

test('le rack se rend dans la teinte du doute, les étagères dans celle du rangement', () => {
  const s = scene();
  assert.equal(s.parId.get('rg-01').conteste, true);
  assert.equal(s.parId.get('et-01').conteste, false);
  assert.equal(s.parId.get('et-02').conteste, false);
  const p = s.groupe.position;
  assert.equal(p.x, 0);
  assert.notEqual(s.parId.get('rg-01').corps.material.color.getHexString(), s.parId.get('et-01').corps.material.color.getHexString());
});

test('un élément qui porte une seule cote non établie se rend contesté', () => {
  const m = modele();
  const rg = m.rangements.find((r) => r.id === 'rg-01');
  for (const c of Object.values(rg.cotes)) {
    c.etat = 'releve';
    c.origine = 'declaration-fabricant';
    c.reserves = [];
  }
  const s = avecCanevas(() => construireRangements(m));
  assert.equal(s.parId.get('rg-01').conteste, false);
});

test('chaque élément porte une étiquette de convention non escamotable', () => {
  const m = modele();
  const etiq = (s, id) => s.parId.get(id).noeud.children.filter((c) => c.isSprite);
  const s = avecCanevas(() => construireRangements(m));
  for (const id of ['et-01', 'et-02', 'rg-01']) {
    assert.ok(etiq(s, id).length >= 2, `${id} : la mention de convention doit être présente`);
  }
  // Le rack ajoute une ligne « contesté » : c'est ce qui le distingue à l'œil.
  assert.ok(etiq(s, 'rg-01').length > etiq(s, 'et-01').length);
});

test('la mention de convention vient de la donnée, et le code n\'en invente aucune', () => {
  const m = modele();
  // Ni le vocabulaire global, ni la donnée de l'élément : le code ne doit pas avoir
  // de phrase de repli. « conventionnel — non relevé » en dur qualifierait un volume
  // qui pourrait ne pas être conventionnel du tout.
  delete m.presentation.libelles.mentionGabarit;
  for (const r of m.rangements) delete r.gabarit.mention;
  const s = avecCanevas(() => construireRangements(m));
  assert.equal(s.parId.size, 3, 'les trois éléments sont rendus');
  const tous = [...s.parId.values()].flatMap((e) => e.noeud.children.map((c) => c.userData?.texte).filter(Boolean));
  assert.ok(tous.length > 0, 'les étiquettes de désignation restent');
  assert.ok(
    !tous.some((t) => /conventionnel|non relevé/.test(t)),
    `aucune mention de convention ne doit être inventée : ${tous.join(' | ')}`,
  );
});

test('la mention suit l\'élément, pas un vocabulaire global', () => {
  const m = modele();
  for (const r of m.rangements) r.gabarit.mention = `mention propre à ${r.id}`;
  const s = avecCanevas(() => construireRangements(m));
  const textes = [...s.parId.values()]
    .flatMap((e) => e.noeud.children.map((c) => c.userData?.texte).filter(Boolean));
  for (const r of m.rangements) assert.ok(textes.includes(`mention propre à ${r.id}`), r.id);
});

test('la bascule masque et réaffiche tous les rangements', () => {
  const s = scene();
  assert.equal(s.groupe.visible, true);
  s.basculer(false);
  assert.equal(s.groupe.visible, false);
  s.basculer(true);
  assert.equal(s.groupe.visible, true);
});
