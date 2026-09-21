/**
 * Les connecteurs des enveloppes de jonction, dérivés du trajet des conducteurs.
 *
 * Un connecteur n'existe que là où un conducteur SE SÉPARE : trois brins ou plus
 * qui se rejoignent dans une même enveloppe. Un conducteur qui traverse une boîte
 * est tiré d'un seul tenant (décision du maître d'ouvrage du 2026-09-24).
 */

import test from 'node:test';
import assert from 'node:assert/strict';
import { SOCLE, PRISES, ECLAIRAGE, BORNE, AUTOMATISATION } from './_aides.js';
import { fusionner } from '../src/donnees/chargement.js';
import { construireGraphe } from '../src/geometrie/graphe.js';
import { conducteursDuCircuit } from '../src/geometrie/conducteurs.js';
import { defautsDuCatalogueDeConnecteurs } from '../src/donnees/validation.js';
import { connecteursParEnveloppe, noeudsDesEnveloppes, choisirConnecteurs } from '../src/geometrie/connecteurs.js';
import { caracteristiques } from '../src/ui/fiche-composant.js';

const modele = fusionner(SOCLE(), [PRISES(), ECLAIRAGE(), BORNE(), AUTOMATISATION()]);
const graphe = construireGraphe(modele);

test('l’union des chemins de chaque conducteur est un arbre', () => {
  // Deux plus courts chemins d'un même conducteur pourraient emprunter deux routes
  // distinctes : la boucle ferait compter un brin de trop. Ce n'est pas le cas du
  // projet, et ce test le tient.
  for (const circuit of modele.circuits) {
    for (const c of conducteursDuCircuit(graphe, modele, circuit.id)) {
      const noeuds = new Set(c.arbre.flatMap((x) => [x.a, x.b]));
      for (const e of c.extremites) noeuds.add(e);
      assert.equal(c.arbre.length, noeuds.size - 1, `${circuit.id} / ${c.libelle} n'est pas un arbre`);
      // Connexe : un parcours depuis une extrémité atteint tous les nœuds.
      const voisins = new Map([...noeuds].map((n) => [n, []]));
      for (const { a, b } of c.arbre) { voisins.get(a).push(b); voisins.get(b).push(a); }
      const vus = new Set([c.extremites[0]]);
      const pile = [c.extremites[0]];
      while (pile.length) for (const v of voisins.get(pile.pop())) if (!vus.has(v)) { vus.add(v); pile.push(v); }
      assert.equal(vus.size, noeuds.size, `${circuit.id} / ${c.libelle} n'est pas connexe`);
    }
  }
});

test('le catalogue des connecteurs se valide, et dit d’où il vient', () => {
  const cat = () => structuredClone(SOCLE().chantier.connecteurs);
  assert.deepEqual(defautsDuCatalogueDeConnecteurs(cat()), [], 'le catalogue du projet est valide');
  assert.deepEqual(defautsDuCatalogueDeConnecteurs(undefined), [], 'absent, il n’est pas un défaut : tout est inconnu');
  const avec = (f) => { const c = cat(); f(c); return defautsDuCatalogueDeConnecteurs(c).map((x) => x.message).join(' | '); };
  assert.match(avec((c) => delete c.source), /source/);
  assert.match(avec((c) => { c.references[0].entrees = 1; }), /entrées/);
  assert.match(avec((c) => { c.references[0].sectionMin = 5; }), /plage/);
  assert.match(avec((c) => { c.references[1].reference = c.references[0].reference; }), /double/);
  assert.match(avec((c) => { c.references = []; }), /aucune référence/);
});

const parRef = (m, r) => m.composants.find((c) => c.reference === r).id;
const derive = (m = modele) => connecteursParEnveloppe(m);
const de = (m, r) => derive(m).get(parRef(m, r));
const circuitDans = (res, id) => res.circuits.find((c) => c.circuit === id);

test('un conducteur qui traverse une boîte ne reçoit aucun connecteur', () => {
  // BD-05 ne fait que relier le parcours de plafond au socle du moteur et à la
  // montée de l'éclairage : rien ne s'y sépare.
  const r = de(modele, 'BD-05');
  assert.deepEqual(r.total, [], 'aucun connecteur dans BD-05');
  for (const c of r.circuits) assert.equal(c.traverse, true, `${c.circuit} traverse BD-05`);
});

test('la ligne de la borne traverse, et ne reçoit jamais de connecteur', () => {
  for (const ref of ['OC-01', 'OC-02']) {
    const borne = circuitDans(de(modele, ref), 'c-borne');
    assert.ok(borne, `la borne passe par ${ref}`);
    assert.equal(borne.traverse, true, `aucune connexion de la borne dans ${ref}`);
    assert.deepEqual(borne.connecteurs, []);
  }
});

test('la séparation de la phase vers MC-01 se compte dans l’organe de connexion', () => {
  // Le graphe la fait au bas de la goulotte ; le chantier la fait dans OC-01. La
  // frontière de la goulotte entière est ce qui les réconcilie.
  const phase = circuitDans(de(modele, 'OC-01'), 'c-eclairage').connecteurs.find((k) => k.role === 'phase');
  assert.ok(phase, 'la phase de l’éclairage se sépare dans OC-01');
  assert.equal(phase.brins, 4, 'depuis le tableau, vers MC-01, GL-02 et CH-L1');
  assert.deepEqual(phase.references.map((r) => r.reference), ['221-415']);
});

test('deux profilés, deux organes : chacun compte les connexions du profilé qui le porte', () => {
  // La goulotte GL-02 a remplacé BD-01 et son antenne. OC-02 y reçoit ce que la
  // boîte recevait, conducteur par conducteur ; OC-01 garde les siennes, et la
  // jonction en T des deux profilés n'appartient à aucun des deux : un conducteur
  // qui passe de l'un à l'autre y franchit une frontière, il ne s'y sépare pas.
  const brins = (ref) => de(modele, ref).circuits
    .flatMap((c) => c.connecteurs.map((k) => `${c.circuit}/${k.role}/${k.brins}`)).sort();
  assert.deepEqual(brins('OC-02'), [
    'c-eclairage/neutre/4', 'c-eclairage/pe/4',
    'c-prises/neutre/4', 'c-prises/pe/4', 'c-prises/phase/4',
  ], 'ce que BD-01 recevait');
  assert.deepEqual(de(modele, 'OC-02').total, [{ reference: '221-415', nombre: 5 }]);
  assert.deepEqual(de(modele, 'OC-01').total, [
    { reference: '221-413', nombre: 2 }, { reference: '221-415', nombre: 3 },
  ], 'OC-01 garde les siennes seules');

  const g = construireGraphe(modele);
  const ensembles = noeudsDesEnveloppes(modele, g);
  const cles = (ref) => new Set(ensembles.get(parRef(modele, ref)).map((n) => n.cle));
  const t = g.noeudAu({ x: 5.6, y: 0.7, z: 2.71 }).cle;
  assert.equal(cles('OC-01').has(t) || cles('OC-02').has(t), false, 'le T n’est à aucun des deux');
  for (const k of cles('OC-01')) assert.equal(cles('OC-02').has(k), false, 'aucun nœud n’est aux deux');
});

test('deux organes sur un même profilé rendent l’attribution ambiguë', () => {
  const m = structuredClone(modele);
  const oc = m.composants.find((c) => c.reference === 'OC-02');
  m.composants.push({ ...oc, id: 'pr-oc-x', reference: 'OC-X', position: { x: 5.6, y: 4.0, z: 2.69 } });
  assert.equal(de(m, 'OC-02').ambigu, true, 'un profilé, un organe : la frontière ne se devine pas');
});

test('aucun conducteur ne se sépare hors d’une enveloppe de jonction, sauf en repiquage', () => {
  // Une séparation hors enveloppe serait un piquage hors boîte. La seule admise est
  // le REPIQUAGE aux bornes d'un appareil — PC-01 et PC-03 vers le socle extérieur
  // qui leur fait dos —, qui n'appelle aucun connecteur.
  const g = construireGraphe(modele);
  const enveloppes = [...noeudsDesEnveloppes(modele, g).values()];
  const roleDe = (type) => modele.types.types.find((t) => t.id === type)?.role;
  const appareil = new Set(
    g.noeuds.filter((n) => n.composants.some((id) => roleDe(modele.composants.find((c) => c.id === id)?.type) === 'appareillage')).map((n) => n.cle),
  );
  const dansUneEnveloppe = (cle) => appareil.has(cle) || enveloppes.some((ns) => ns.some((n) => n.cle === cle));
  for (const circuit of modele.circuits) {
    for (const c of conducteursDuCircuit(g, modele, circuit.id)) {
      const degre = new Map();
      for (const { a, b } of c.arbre) { degre.set(a, (degre.get(a) ?? 0) + 1); degre.set(b, (degre.get(b) ?? 0) + 1); }
      for (const e of c.extremites) degre.set(e, (degre.get(e) ?? 0) + 1);
      for (const [cle, d] of degre) {
        if (d >= 3) assert.ok(dansUneEnveloppe(cle), `${circuit.id} / ${c.libelle} se sépare en ${cle}, hors de toute enveloppe`);
      }
    }
  }
});

test('la référence est la plus petite qui suffit, et se combine au-delà de la plus grande', () => {
  const refs = SOCLE().chantier.connecteurs.references.slice().sort((a, b) => a.entrees - b.entrees);
  const noms = (n) => choisirConnecteurs(refs, n).map((r) => r.reference);
  assert.deepEqual(noms(2), ['221-412']);
  assert.deepEqual(noms(3), ['221-413']);
  assert.deepEqual(noms(4), ['221-415'], 'quatre brins : un 221-415, une entrée libre');
  assert.deepEqual(noms(6), ['221-415', '221-413'], 'chaque liaison occupe une entrée de chacun');
  assert.deepEqual(noms(8), ['221-415', '221-415']);
  assert.equal(choisirConnecteurs([], 3), null, 'sans référence admise, aucune n’est inventée');
});

test('une section hors catalogue rend le connecteur inconnu, sans rien lui substituer', () => {
  const m = structuredClone(modele);
  m.circuits.find((c) => c.id === 'c-eclairage').section = 6;
  const bl01 = de(m, 'BL-01');
  assert.ok(bl01.inconnus > 0);
  for (const k of circuitDans(bl01, 'c-eclairage').connecteurs) assert.equal(k.references, null);
  assert.deepEqual(bl01.total, [], 'aucune référence au total');
});

test('un circuit non dérivable rend ses connecteurs inconnus', () => {
  const sansPilote = structuredClone(ECLAIRAGE());
  for (const c of sansPilote.composants) { delete c.pilote; delete c.commutation; delete c.module; }
  const m = fusionner(SOCLE(), [PRISES(), sansPilote, BORNE(), AUTOMATISATION()]);
  const bl01 = de(m, 'BL-01');
  assert.equal(circuitDans(bl01, 'c-eclairage').inconnu, true);
  assert.ok(bl01.inconnus > 0);
});

test('la fiche d’une boîte porte ses connecteurs, et nomme ce qui traverse', () => {
  const res = derive();
  const oc02 = modele.composants.find((c) => c.reference === 'OC-02');
  const l = new Map(caracteristiques(oc02, modele.circuits, modele.presentation.libelles, res.get(oc02.id)).map((x) => [x.libelle, x]));
  assert.equal(l.get('Connecteurs').texte, '5 × 221-415');
  assert.match(l.get('dont').texte, /Prises[^·]*PE 221-415/);
  assert.match(l.get('Sans connexion').texte, /[Bb]orne/, 'la borne traverse la goulotte sans connexion');
  // Un appareil n'a pas de ligne de connecteurs.
  const pc01 = modele.composants.find((c) => c.reference === 'PC-01');
  assert.equal(caracteristiques(pc01, modele.circuits, {}, null).some((x) => x.libelle === 'Connecteurs'), false);
});

test('un connecteur inconnu se lit comme tel dans la fiche', () => {
  const m = structuredClone(modele);
  m.circuits.find((c) => c.id === 'c-eclairage').section = 6;
  const bl01 = m.composants.find((c) => c.reference === 'BL-01');
  const l = new Map(caracteristiques(bl01, m.circuits, {}, derive(m).get(bl01.id)).map((x) => [x.libelle, x]));
  assert.equal(l.get('Connecteurs').inconnu, true, 'la ligne porte la classe des valeurs non établies');
  assert.match(l.get('Connecteurs').texte, /inconnu/);
  assert.match(l.get('dont').texte, /inconnu/);
});
