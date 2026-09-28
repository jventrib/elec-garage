/**
 * L'apport du rangement (006), et ce qu'il ne doit pas changer.
 *
 * Cet apport est le premier du projet qui ne touche pas au circuit : il ne déclare
 * ni composant, ni cheminement, ni traversée, ni étape. Il se lit donc **seul**, ce
 * qui rend ses tests possibles sans les quatre apports précédents.
 *
 * L'essentiel du fichier porte sur ce qu'il ne faut pas lui faire faire. Un genre
 * nouveau est un genre qui peut fuite : dans les contrôles électriques, dans la
 * séquence, dans le bilan de collisions. Ces trois fuites ne se voient pas — la
 * maquette reste identique — et chacune d'elles est un défaut silencieux. C'est
 * pourquoi les assertions d'ici portent sur des **propriétés invariantes**, et non
 * sur des valeurs.
 *
 * Le reste porte sur ce que le rangement **affiche** : ses trois états de cote et
 * leurs trois origines. C'est la seule chose que ce genre puisse introduire de
 * fausse, parce qu'il n'entre dans aucun calcul.
 */

import test from 'node:test';
import assert from 'node:assert/strict';
import { SOCLE, PRISES, ECLAIRAGE, BORNE, AUTOMATISATION, RANGEMENT, copie } from './_aides.js';
import { fusionner } from '../src/donnees/chargement.js';
import { composerSequence } from '../src/sequence/ordonnancement.js';
import { validerTout, validerApport, validerModele } from '../src/donnees/validation.js';
import { controlerCollisions } from '../src/geometrie/collision.js';
import { GENRES_POSABLES } from '../src/sequence/etat.js';

const SOCLE_ET_005 = () => [PRISES(), ECLAIRAGE(), BORNE(), AUTOMATISATION()];
const modeleDe = () => fusionner(SOCLE(), SOCLE_ET_005());
const modeleAvecRangement = () => fusionner(SOCLE(), [...SOCLE_ET_005(), RANGEMENT()]);
const apportsSans = () => SOCLE_ET_005();
const apportsAvec = () => [...SOCLE_ET_005(), RANGEMENT()];
const defautsDe = (m, apports) => validerTout(m, composerSequence(m), apports);

// ─── 3.1 — la fusion ne perd rien ────────────────────────────────────────────────

test('les trois rangements survivent à la fusion', () => {
  const m = modeleAvecRangement();
  assert.equal(m.rangements.length, 3);
  assert.deepEqual(
    m.rangements.map((r) => r.id),
    ['et-01', 'et-02', 'rg-01'],
  );
});

test('chaque rangement retenu porte le nom de son apport', () => {
  const m = modeleAvecRangement();
  for (const r of m.rangements) assert.equal(r.apport, '006-rangement');
});

test('le rangement est fusionné avec tous les apports, pas seulement avec lui', () => {
  const m = fusionner(SOCLE(), [RANGEMENT()]);
  assert.equal(m.rangements.length, 3);
  assert.equal(m.composants.length, 0);
  assert.equal(m.etapes.length, 0);
});

test('l\'ordre de lecture des fichiers n\'influe pas sur les apports retenus', () => {
  const a = fusionner(SOCLE(), [PRISES(), RANGEMENT(), ECLAIRAGE(), AUTOMATISATION(), BORNE()]);
  const b = fusionner(SOCLE(), [BORNE(), AUTOMATISATION(), RANGEMENT(), ECLAIRAGE(), PRISES()]);
  assert.deepEqual(a.apports, b.apports);
  assert.deepEqual(
    a.rangements.map((r) => r.id),
    b.rangements.map((r) => r.id),
  );
});

// ─── 3.2 — la validation structurelle ───────────────────────────────────────────

test('l\'apport du rangement ne rend aucun défaut', () => {
  assert.deepEqual(validerApport(RANGEMENT(), SOCLE()), []);
});

test('un rangement sans paroi est refusé', () => {
  const a = RANGEMENT();
  delete a.rangements[0].paroi;
  const d = validerApport(a, SOCLE());
  assert.equal(d.length, 1);
  assert.equal(d[0].regle, 'STRUCT');
  assert.match(d[0].message, /Paroi inconnue/);
});

test('un rangement sur une paroi qui n\'existe pas est refusé', () => {
  const a = RANGEMENT();
  a.rangements[0].paroi = 'sous-sol';
  assert.match(validerApport(a, SOCLE())[0].message, /Paroi inconnue/);
});

test('un rangement au plafond est refusé — un rangement s\'accroche, il ne se suspend pas', () => {
  const a = RANGEMENT();
  a.rangements[0].paroi = 'plafond';
  assert.match(validerApport(a, SOCLE())[0].message, /Paroi inconnue/);
});

test('une origine de cote inconnue est refusée, et une seule fois', () => {
  const a = RANGEMENT();
  a.rangements[2].cotes.largeur.origine = 'wikipedia';
  const messages = validerApport(a, SOCLE()).map((x) => x.message);
  // Une seule erreur pour une seule cote : une origine fausse ne doit pas se
  // répercuter en cascade sur les axes voisins, qui sont indépendants.
  assert.equal(messages.filter((m) => /origine inconnue/.test(m)).length, 1);
});

test('un état de cote hors des trois valeurs est refusé', () => {
  const a = RANGEMENT();
  a.rangements[2].cotes.largeur.etat = 'approximatif';
  assert.match(validerApport(a, SOCLE())[0].message, /hors des trois valeurs/);
});

test('les trois états et les trois origines sont acceptés', () => {
  const a = RANGEMENT();
  const c = a.rangements[2].cotes;
  c.largeur.etat = 'releve';
  c.largeur.origine = 'releve';
  c.largeur.reserves = [];
  c.profondeur.etat = 'inconnu';
  c.profondeur.valeur = null;
  c.profondeur.origine = null;
  c.profondeur.reserves = [];
  assert.deepEqual(validerApport(a, SOCLE()), []);
});

test('une cote « inconnue » qui porte une valeur est refusée', () => {
  const a = RANGEMENT();
  a.rangements[2].cotes.hauteurMontage.valeur = 1.2;
  assert.match(validerApport(a, SOCLE())[0].message, /« inconnue » mais porte une valeur/);
});

test('une cote « inconnue » qui déclare une origine est refusée', () => {
  const a = RANGEMENT();
  a.rangements[2].cotes.hauteurMontage.origine = 'declaration-fabricant';
  assert.match(validerApport(a, SOCLE())[0].message, /« inconnue » mais déclare une origine/);
});

test('une cote « contradictoire » sans réserve est refusée', () => {
  const a = RANGEMENT();
  a.rangements[2].cotes.largeur.reserves = [];
  assert.match(validerApport(a, SOCLE())[0].message, /« contradictoire » sans réserve/);
});

test('une cote « relevée » qui porte des réserves est refusée', () => {
  const a = RANGEMENT();
  a.rangements[0].cotes.largeur.reserves = ['une réserve'];
  assert.match(validerApport(a, SOCLE())[0].message, /« relevée » mais porte des réserves/);
});

test('un rangement sans gabarit est refusé : le volume dessiné ne peut pas venir des cotes', () => {
  const a = RANGEMENT();
  delete a.rangements[2].gabarit;
  assert.match(validerApport(a, SOCLE())[0].message, /sans gabarit/);
});

test('un gabarit sans mention de convention est refusé', () => {
  const a = RANGEMENT();
  delete a.rangements[2].gabarit.mention;
  assert.match(validerApport(a, SOCLE())[0].message, /mention doit dire/);
});

test('un gabarit à origine inconnue est refusé', () => {
  const a = RANGEMENT();
  a.rangements[2].gabarit.origine = 'estimation';
  assert.match(validerApport(a, SOCLE())[0].message, /gabarit\.origine inconnue/);
});

test('un gabarit au volume inversé est refusé', () => {
  const a = RANGEMENT();
  a.rangements[2].gabarit.volume.min.z = 3;
  a.rangements[2].gabarit.volume.max.z = 1;
  const messages = validerApport(a, SOCLE()).map((x) => x.message);
  assert.ok(messages.some((m) => /gabarit\.volume/.test(m)));
});

test('un identifiant de rangement en double est refusé', () => {
  const m = modeleAvecRangement();
  m.rangements.push({ ...copie(m.rangements[0]), apport: '006-rangement' });
  const messages = validerModele(m, composerSequence(m)).map((x) => x.message);
  assert.ok(messages.some((x) => /en double : et-01/.test(x)));
});

test('un identifiant partagé entre un composant et un rangement est refusé', () => {
  const m = modeleAvecRangement();
  m.rangements.push({ ...copie(m.rangements[0]), id: 'au-mc-01', apport: '006-rangement' });
  const messages = validerModele(m, composerSequence(m)).map((x) => x.message);
  assert.ok(messages.some((x) => /en double : au-mc-01/.test(x)));
});

// ─── 3.3 — le rangement n'entre dans aucun contrôle électrique ───────────────────

test('le rangement ne figure pas parmi les genres posables', () => {
  assert.ok(!GENRES_POSABLES.includes('rangements'));
  assert.ok(!GENRES_POSABLES.includes('rangement'));
});

test('V16 ne signale aucun composant non atteignable à cause des rangements', () => {
  const d = defautsDe(modeleAvecRangement(), apportsAvec());
  const v16 = d.filter((x) => x.regle === 'V16');
  assert.deepEqual(v16.map((x) => `${x.cible} | ${x.message}`), []);
});

test('le nombre d\'étapes est inchangé par la présence du rangement', () => {
  const sans = composerSequence(modeleDe());
  const avec = composerSequence(modeleAvecRangement());
  assert.equal(avec.total, sans.total);
  assert.equal(avec.total, 56);
  assert.deepEqual(avec.etapes.map((e) => e.id), sans.etapes.map((e) => e.id));
  assert.deepEqual(avec.defauts, sans.defauts);
});

test('aucune étape ne mentionne un rangement', () => {
  const s = composerSequence(modeleAvecRangement());
  for (const e of s.etapes) {
    const texte = JSON.stringify(e);
    for (const id of ['et-01', 'et-02', 'rg-01', 'rangements']) {
      assert.ok(!texte.includes(id), `l'étape ${e.id} mentionne ${id}`);
    }
  }
});

test('le rangement n\'apporte aucune étape, aucun composant et aucun cheminement', () => {
  const a = RANGEMENT();
  assert.equal(a.etapes, undefined);
  assert.equal(a.circuits, undefined);
  assert.equal(a.traversees, undefined);
  assert.deepEqual(a.composants, []);
  assert.deepEqual(a.cheminements, []);
});

test('V11 ne signale aucun défaut nouveau', () => {
  const sans = defautsDe(modeleDe(), apportsSans());
  const avec = defautsDe(modeleAvecRangement(), apportsAvec());
  const cle = (d) => d.map((x) => `${x.regle} | ${x.cible}`).sort();
  assert.deepEqual(cle(avec), cle(sans));
});

// ─── 3.5 — le bilan de collisions est inchangé ──────────────────────────────────

test('le bilan de collisions est strictement identique avec et sans les rangements', () => {
  const sans = controlerCollisions(modeleDe());
  const avec = controlerCollisions(modeleAvecRangement());
  assert.deepEqual(avec, sans);
});

test('aucun rangement ne devient un obstacle dans le bilan', () => {
  const avec = controlerCollisions(modeleAvecRangement());
  const idsObstacles = avec.resultats.map((r) => r.obstacle);
  for (const r of ['et-01', 'et-02', 'rg-01']) assert.ok(!idsObstacles.includes(r));
  assert.deepEqual(
    avec.obstaclesNonConcluants.map((o) => o.id),
    controlerCollisions(modeleDe()).obstaclesNonConcluants.map((o) => o.id),
  );
});

test('un cheminement qui traverse le volume d\'un rangement reste jugé sur les obstacles seuls', () => {
  // Le rangement n'est pas un obstacle : un conduit qui le traverserait ne serait
  // pas signalé. C'est un choix assumé, et ce test le fixe pour qu'il ne devienne
  // pas un accident quand quelqu'un ajoutera un contrôle de collision.
  const m = modeleAvecRangement();
  const avant = controlerCollisions(m).collisions;
  m.rangements[0].gabarit.volume = { min: { x: 0, y: 0, z: 0 }, max: { x: 5.6, y: 5.6, z: 2.75 } };
  assert.equal(controlerCollisions(m).collisions, avant);
});

// ─── les trois états et les trois origines, tels que déclarés ───────────────────

test('le rack porte les quatre contradictions attendues', () => {
  const rg = RANGEMENT().rangements.find((r) => r.id === 'rg-01');
  const etats = Object.fromEntries(Object.entries(rg.cotes).map(([k, v]) => [k, v.etat]));
  assert.deepEqual(etats, {
    largeur: 'contradictoire',
    profondeur: 'contradictoire',
    hauteur: 'contradictoire',
    hauteurMontage: 'inconnu',
    charge: 'contradictoire',
    nombreNiveaux: 'contradictoire',
  });
  for (const c of Object.values(rg.cotes)) {
    if (c.etat === 'contradictoire') assert.ok(c.reserves.length > 0, c.etat);
  }
});

test('chaque réserve de contradiction cite les deux termes du conflit', () => {
  const rg = RANGEMENT().rangements.find((r) => r.id === 'rg-01');
  assert.match(rg.cotes.largeur.reserves[0], /144W/);
  assert.match(rg.cotes.largeur.reserves[0], /81,3 à 121,9/);
  assert.match(rg.cotes.hauteur.reserves[0], /55H/);
  assert.match(rg.cotes.hauteur.reserves[0], /déployé/);
  assert.match(rg.cotes.charge.reserves[0], /par tablette/);
  assert.match(rg.cotes.charge.reserves[0], /rack entier/);
});

test('aucun axe du rack n\'est établi, et le gabarit le dit', () => {
  const rg = RANGEMENT().rangements.find((r) => r.id === 'rg-01');
  assert.equal(rg.gabarit.origine, 'gabarit-catalogue');
  assert.equal(rg.gabarit.mention, 'conventionnel — non relevé');
  for (const axe of ['largeur', 'profondeur', 'hauteur']) {
    assert.notEqual(rg.cotes[axe].etat, 'releve', axe);
  }
});

test('les deux étagères sont un gabarit de catalogue, sans produit', () => {
  for (const id of ['et-01', 'et-02']) {
    const e = RANGEMENT().rangements.find((r) => r.id === id);
    assert.equal(e.fabricant, null);
    assert.equal(e.gabarit.origine, 'gabarit-catalogue');
    for (const c of Object.values(e.cotes)) assert.equal(c.origine, 'gabarit-catalogue', id);
  }
});

test('le volume gabarit de chaque élément tient dans le local', () => {
  const { oeuvre, hauteurSousPlafond } = SOCLE().local;
  for (const r of RANGEMENT().rangements) {
    const { min, max } = r.gabarit.volume;
    assert.ok(min.x >= 0 && min.y >= 0 && min.z >= 0, r.id);
    assert.ok(max.x <= oeuvre.x, `${r.id} dépasse en x`);
    assert.ok(max.y <= oeuvre.y, `${r.id} dépasse en y`);
    assert.ok(max.z <= hauteurSousPlafond, `${r.id} dépasse en z`);
  }
});

test('aucun rangement n\'en recouvre un autre', () => {
  const vs = RANGEMENT().rangements;
  for (let i = 0; i < vs.length; i += 1) {
    for (let j = i + 1; j < vs.length; j += 1) {
      const a = vs[i].gabarit.volume;
      const b = vs[j].gabarit.volume;
      const disjoint = ['x', 'y', 'z'].some(
        (axe) => a.max[axe] <= b.min[axe] || b.max[axe] <= a.min[axe],
      );
      assert.ok(disjoint, `${vs[i].id} et ${vs[j].id} se recouvrent`);
    }
  }
});

test('tous les rangements sont portés par la paroi ouest, sans composant ni conduit', () => {
  const m = modeleAvecRangement();
  for (const r of m.rangements) assert.equal(r.paroi, 'ouest', r.id);
  const ouest = m.composants.filter((c) => c.paroi === 'ouest');
  const facesOuest = new Set(m.cheminements.flatMap((c) => (c.segments ?? []).map((s) => s.face)));
  assert.deepEqual(ouest, []);
  assert.ok(!facesOuest.has('ouest'));
});

test('le mode de fixation du rack est déclaré inconnu, et la réserve le dit', () => {
  const rg = RANGEMENT().rangements.find((r) => r.id === 'rg-01');
  assert.equal(rg.fixation.etat, 'inconnu');
  assert.equal(rg.fixation.mode, null);
  assert.ok(rg.fixation.reserves.length > 0);
  assert.match(rg.fixation.reserves[0], /expansion bolts/);
});

test('aucune cote de perçage n\'est produite par le rangement', () => {
  const rg = RANGEMENT().rangements.find((r) => r.id === 'rg-01');
  assert.ok(!('percages' in rg));
  assert.ok(!('traversees' in rg));
  for (const c of Object.values(rg.cotes)) {
    assert.ok(!/per[çc]age|entraxe|diam[èe]tre de tige|couple/i.test(JSON.stringify(c)), JSON.stringify(c));
  }
});
