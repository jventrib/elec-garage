/**
 * Les couches d'affichage : ce que les deux bascules doivent garantir.
 *
 * Trois exigences, et la troisième est de loin la plus importante.
 *
 *  1. **Chaque bascule est indépendante.** Masquer l'électricité ne doit pas
 *     toucher au rangement, ni l'inverse. Un geste qui commande deux choses n'en
 *     commande aucune.
 *  2. **La déclaration est exhaustive.** Tout groupe de la scène est soit dans une
 *     couche, soit explicitement exclu, et le motif de l'exclusion est écrit. Un
 *     groupe oublié resterait visible dans les deux cas, sans que rien ne le
 *     signale : c'est le seul défaut du sujet qui ne se voit pas.
 *  3. **Un objet masqué n'est pas désignable.** Le rayon de three.js ne teste PAS la
 *     visibilité. Sans filtre, on cliquerait un objet que l'on ne voit pas — et la
 *     fiche s'ouvrirait sur un composant absent de l'écran, sans explication.
 *
 * Le point 3 est le seul qui change réellement ce que l'utilisateur ressent, et le
 * seul qu'un test d'égalité sur les groupes ne rattraperait pas.
 */

import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const lireHtml = (chemin) => readFileSync(new URL(`../${chemin}`, import.meta.url), 'utf8');
import { SOCLE, PRISES, ECLAIRAGE, BORNE, AUTOMATISATION, RANGEMENT, avecCanevas } from './_aides.js';
import { fusionner } from '../src/donnees/chargement.js';
import { composerSequence } from '../src/sequence/ordonnancement.js';
import { etatParGenre } from '../src/sequence/etat.js';
import { construireComposants } from '../src/scene/composants.js';
import { construireCheminements } from '../src/scene/cheminements.js';
import { construireObstacles } from '../src/scene/obstacles.js';
import { construireRangements } from '../src/scene/rangement.js';
import {
  COUCHES,
  GROUPES,
  modulesDe,
  groupesDeScene,
  groupesEnfants,
  nonDeclares,
  declaresInabsents,
} from '../src/scene/couches.js';

const modele = () =>
  fusionner(SOCLE(), [PRISES(), ECLAIRAGE(), BORNE(), AUTOMATISATION(), RANGEMENT()]);

/** Les groupes de premier niveau que `main.js` pose dans la scène. */
const groupesDeLaScene = () => [
  'local', 'obstacles', 'composants', 'cheminements', 'cotes', 'percages', 'trajets', 'rangements',
];

const scene = () => avecCanevas(() => {
  const m = modele();
  const seq = composerSequence(m);
  const partition = etatParGenre(seq, m, seq.total);
  const composants = construireComposants(m);
  const cheminements = construireCheminements(m);
  composants.appliquerEtat(partition.composants);
  cheminements.appliquerEtat(partition);
  return {
    composants,
    cheminements,
    obstacles: construireObstacles(m.local, m.presentation),
    rangements: construireRangements(m),
  };
});

// ─── 5.2 — la déclaration est exhaustive ───────────────────────────────────────

test('les deux couches attendues existent, et rien d\'autre', () => {
  assert.deepEqual(COUCHES, ['electricite', 'rangement']);
});

test('tout groupe de la scène est déclaré dans une couche ou explicitement exclu', () => {
  assert.deepEqual(nonDeclares(groupesDeLaScene()), []);
  assert.deepEqual(declaresInabsents(groupesDeLaScene()), []);
});

test('les trois exclusions portent un motif écrit', () => {
  const exclus = GROUPES.filter((g) => g.couches.length === 0);
  assert.ok(exclus.length >= 3, 'les exclusions sont le motif de la déclaration');
  for (const e of exclus) {
    assert.equal(typeof e.pourquoi, 'string', e.nom);
    assert.ok(e.pourquoi.length > 10, `${e.nom} : exclusion sans motif`);
  }
  const parNom = Object.fromEntries(GROUPES.map((g) => [g.nom, g]));
  assert.match(parNom.local.pourquoi, /pièce/);
  assert.match(parNom.obstacles.pourquoi, /pièce|local/);
  assert.match(parNom.cotes.pourquoi, /annotation/);
  assert.match(parNom.plafond.pourquoi, /caméra/);

  // Trois exclusions, trois raisons. Un motif copié d'un groupe à l'autre est la
  // trace du copier-coller : c'est la seule chose qui distingue une exclusion
  // justifiée d'une exclusion paresseuse.
  const motifs = exclus.map((e) => e.pourquoi);
  assert.equal(new Set(motifs).size, motifs.length);
});

test('les exclusions nommées par la spec sont bien exclues', () => {
  const parNom = Object.fromEntries(GROUPES.map((g) => [g.nom, g]));
  for (const nom of ['obstacles', 'cotes', 'plafond']) {
    assert.deepEqual(parNom[nom].couches, [], nom);
  }
});

test('le plafond est un enfant de `local`, et non un groupe de premier niveau', () => {
  // Le dire évite deux erreurs symétriques : le chercher dans le décor, et le
  // déclarer une seconde fois — donc le compter deux fois.
  const enfants = groupesEnfants();
  assert.deepEqual(enfants, [{ nom: 'plafond', parent: 'local' }]);
  assert.ok(!groupesDeScene().includes('plafond'));
});

test('l\'électricité ne porte aucun groupe de rangement, et inversement', () => {
  assert.deepEqual(modulesDe('electricite'), ['composants', 'cheminements', 'percages', 'trajets']);
  assert.deepEqual(modulesDe('rangement'), ['rangements']);
});

test('aucun groupe n\'appartient aux deux couches', () => {
  for (const g of GROUPES) {
    assert.ok(g.couches.length <= 1, `${g.nom} est dans ${g.couches.length} couches`);
  }
});

test('aucun groupe n\'appartient à une couche inconnue', () => {
  for (const g of GROUPES) {
    for (const c of g.couches) assert.ok(COUCHES.includes(c), `${g.nom} → couche « ${c} » inconnue`);
  }
});

test('chaque couche a au moins un groupe : une bascule vide serait un bouton mort', () => {
  for (const c of COUCHES) assert.ok(modulesDe(c).length > 0, c);
});

// ─── 5.3 — un objet masqué n\'est pas désignable ───────────────────────────────

test('masquer la couche électricité retire ses meshes de `meshes()`', () => {
  const s = scene();
  const avant = s.composants.meshes().length + s.cheminements.meshes().length;
  assert.ok(avant > 0);
  s.composants.basculer(false);
  s.cheminements.basculer(false);
  assert.equal(s.composants.meshes().length, 0);
  assert.equal(s.cheminements.meshes().length, 0);
});

test('le rangement reste désignable quand l\'électricité est masquée', () => {
  const s = scene();
  s.composants.basculer(false);
  s.cheminements.basculer(false);
  assert.equal(s.rangements.meshes().length, 3);
});

test('les deux bascules sont indépendantes, dans les deux sens', () => {
  const s = scene();
  s.rangements.basculer(false);
  assert.ok(s.composants.meshes().length > 0, 'masquer le rangement ne doit rien cacher d\'autre');
  s.rangements.basculer(true);
  s.composants.basculer(false);
  assert.equal(s.rangements.meshes().length, 3, 'masquer l\'électricité ne doit rien cacher du rangement');
});

test('un mesh rendu visible par la pose reste absent quand sa couche est masquée', () => {
  // Le défaut exact que three.js laisse passer : le noeud est visible, le groupe
  // parent ne l'est pas. Ne filtrer que sur le noeud laisserait l'objet désignable.
  const s = scene();
  assert.ok(s.composants.meshes().length > 0);
  s.composants.basculer(false);
  for (const e of s.composants.parId.values()) assert.equal(e.noeud.visible, true);
  assert.equal(s.composants.meshes().length, 0);
});

test('un composant non encore posé n\'est pas désignable', () => {
  const m = modele();
  const seq = composerSequence(m);
  const c = construireComposants(m);
  c.appliquerEtat(etatParGenre(seq, m, 1).composants);
  assert.equal(c.meshes().length, 0, 'rien n\'est posé à la première étape');
  c.appliquerEtat(etatParGenre(seq, m, seq.total).composants);
  assert.equal(c.meshes().length, m.composants.length);
});

test('les obstacles ne sont pas concernés : ils n\'appartiennent à aucune couche', () => {
  const s = scene();
  s.composants.basculer(false);
  s.rangements.basculer(false);
  assert.equal(s.obstacles.groupe.visible, true);
  assert.ok(s.obstacles.meshes().length > 0);
});

// ─── 5.4 / 5.5 — la bascule ne fige pas la pose ────────────────────────────────

test('masquer puis réafficher laisse l\'état de pose strictement identique', () => {
  const m = modele();
  const seq = composerSequence(m);
  const c = construireComposants(m);
  const ch = construireCheminements(m);

  const poser = (r) => {
    const partition = etatParGenre(seq, m, r);
    c.appliquerEtat(partition.composants);
    ch.appliquerEtat(partition);
  };

  const etatAVant = (r) => {
    poser(r);
    return [...c.parId].map(([id, e]) => [id, e.noeud.visible]).sort((a, b) => a[0].localeCompare(b[0]));
  };

  for (const r of [1, 7, seq.total]) {
    const avant = etatAVant(r);
    c.basculer(false);
    ch.basculer(false);
    const pendantMasquage = [...c.parId].map(([id, e]) => [id, e.noeud.visible]).sort((a, b) => a[0].localeCompare(b[0]));
    assert.deepEqual(pendantMasquage, avant, `le masquage a figé l\'état au rang ${r}`);
    c.basculer(true);
    ch.basculer(true);
    assert.deepEqual(etatAVant(r), avant, `le réaffichage a recalculé l\'état au rang ${r}`);
  }
});

test('avancer d\'une étape pendant le masquage, puis réafficher, montre le bon état', () => {
  const m = modele();
  const seq = composerSequence(m);
  const c = construireComposants(m);
  const poser = (r) => c.appliquerEtat(etatParGenre(seq, m, r).composants);

  poser(1);
  c.basculer(false);
  poser(seq.total);
  assert.equal(c.meshes().length, 0, 'la couche masque, même posée');
  c.basculer(true);
  assert.equal(c.meshes().length, m.composants.length, 'le réaffichage rend l\'état courant, pas celui d\\avant');
});

// ─── 5.5 — la mise en évidence est suspendue, pas perdue ───────────────────────

/**
 * Les rangs qui ajoutent au moins un composant.
 *
 * Pas une valeur en dur : la moitié des étapes ne pose que des conduits ou du
 * mobilier, et choisir « la dernière » ne garantit rien. Un test qui suppose que la
 * dernière étape met quelque chose en évidence échouera le jour où le dernier rang
 * changera — pour une raison qui n'aura rien à voir avec ce qu'il vérifie.
 */
function rangsQuiAjoutent(seq, m) {
  const rangs = [];
  for (let r = 1; r <= seq.total; r++) {
    if (etatParGenre(seq, m, r).composants.ajoutes.length > 0) rangs.push(r);
  }
  return rangs;
}

test('masquer l\'électricité ne perd pas la mise en évidence de l\'étape', () => {
  const m = modele();
  const seq = composerSequence(m);
  const c = construireComposants(m);
  const [rang] = rangsQuiAjoutent(seq, m);
  assert.ok(rang !== undefined, 'la séquence ajoute au moins un composant');
  c.appliquerEtat(etatParGenre(seq, m, rang).composants);

  // La mise en évidence d'un objet posé par l'étape EST son contour, et il vit sur
  // le noeud — pas sur le groupe. Masquer le groupe le rend invisible sans l'effacer.
  const contoursAvant = [...c.parId.values()].filter((e) => e.contour.visible).length;
  assert.ok(contoursAvant > 0, `le rang ${rang} met bien quelque chose en évidence`);

  c.basculer(false);
  assert.equal([...c.parId.values()].filter((e) => e.contour.visible).length, contoursAvant);

  c.basculer(true);
  assert.equal([...c.parId.values()].filter((e) => e.contour.visible).length, contoursAvant);
});

test('reprendre l\'étape en cours de masquage, puis réafficher, montre l\'étape', () => {
  const m = modele();
  const seq = composerSequence(m);
  const c = construireComposants(m);
  const poser = (r) => c.appliquerEtat(etatParGenre(seq, m, r).composants);

  poser(1);
  c.basculer(false);
  // Changer d'étape pendant le masquage ne doit pas se souvenir de la bascule : une
  // couche masquée est unjugement d'affichage, pas un gel de la maquette.
  poser(seq.total);
  c.basculer(true);
  assert.equal(c.meshes().length, m.composants.length);
});

test('la mise en évidence suit l\'étape courante, et se rétablit au réaffichage', () => {
  const m = modele();
  const seq = composerSequence(m);
  const c = construireComposants(m);
  const misEnEvidence = (r) => {
    const partition = etatParGenre(seq, m, r);
    c.appliquerEtat(partition.composants);
    return partition.composants.ajoutes.map((x) => x.id).sort();
  };
  const contoursVisibles = () =>
    [...c.parId].filter(([, e]) => e.contour.visible).map(([id]) => id).sort();

  const rangs = rangsQuiAjoutent(seq, m);
  const [premier, dernier] = [rangs[0], rangs.at(-1)];
  const attendu = misEnEvidence(premier);
  assert.deepEqual(contoursVisibles(), attendu, 'le contour suit exactement ce que pose l\'étape');

  // Le trajet le plus long : masquer, changer d'étape, réafficher.
  c.basculer(false);
  const cible = misEnEvidence(dernier);
  c.basculer(true);
  assert.deepEqual(contoursVisibles(), cible, 'au réaffichage, c\'est l\'étape courante qui s\'annonce');
});

// ─── 5.7 — l'instruction reste lisible, couche masquée ─────────────────────────

test('l\'étape et sa consigne portent l\'instruction, indépendamment de la couche', () => {
  // Le compromis assumé au `design.md` : l'instruction est dans l'en-tête et le
  // bandeau, pas dans la 3D. Masquer l'électricité ne doit donc rien retirer au
  // texte — sans quoi l'utilisateur perdrait le seul endroit qui lui dit quoi faire.
  const libelles = modele().presentation.libelles;
  assert.equal(typeof libelles.couches.electricite, 'string');
  assert.equal(typeof libelles.couches.rangement, 'string');
  // Les libellés d'état de bouton existent pour les DEUX verbes : un bouton dont le
  // texte ne change pas ne dit pas ce que le geste va faire.
  for (const couche of ['electricite', 'rangement']) {
    assert.equal(typeof libelles.boutonsCouches[`${couche}Masquer`], 'string');
    assert.equal(typeof libelles.boutonsCouches[`${couche}Afficher`], 'string');
  }
});

test('l\'en-tête porte les deux bascules, et seulement les deux', () => {
  const entete = lireHtml('index.html');
  assert.match(entete, /id="couches"/);
  assert.match(entete, /role="group"/);
  // La bascule des cotes de tracé reste à part : elle ne cache qu'un calque
  // d'annotation, et la confondre avec les deux couches rendrait les trois gestes
  // indiscernables.
  assert.match(entete, /id="tracage"/);
  assert.ok(entete.indexOf('id="tracage"') < entete.indexOf('id="couches"'));
});
