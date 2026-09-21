/**
 * Le trajet des conducteurs d'un objet désigné.
 *
 * Demandé le 2026-09-25 : au clic sur un cheminement, voir le trajet des conducteurs
 * qui y passent, d'une extrémité à l'autre, une couleur par circuit, et cette couleur
 * aux appareils des extrémités. Changement OpenSpec `trajets-des-conducteurs`.
 */

import test from 'node:test';
import assert from 'node:assert/strict';
import { SOCLE, PRISES, ECLAIRAGE, BORNE, AUTOMATISATION, copie } from './_aides.js';
import { fusionner } from '../src/donnees/chargement.js';
import { trajetsDe } from '../src/geometrie/trajets.js';
import { formesDesTrajets, decalageDe } from '../src/scene/trajets.js';
import { lignesTrajets } from '../src/ui/fiche-composant.js';

const modele = fusionner(SOCLE(), [PRISES(), ECLAIRAGE(), BORNE(), AUTOMATISATION()]);
const idDe = (m, ref) =>
  (m.cheminements.find((c) => c.reference === ref) ?? m.composants.find((c) => c.reference === ref)
    ?? m.traversees.find((t) => t.reference === ref)).id;
const refs = (m, ids) => ids.map((id) => m.composants.find((c) => c.id === id)?.reference).sort();
const de = (genre, ref, m = modele) => trajetsDe(m, { genre, id: idDe(m, ref) });

test('un conduit partagé donne un trajet par circuit, jusqu’à toutes les extrémités', () => {
  const t = de('cheminement', 'CH-05');
  assert.deepEqual(t.map((x) => x.circuit).sort(), ['c-eclairage', 'c-prises']);
  const prises = t.find((x) => x.circuit === 'c-prises');
  // Le PE et le neutre desservent tous les points : le trajet d'un conduit du tronc
  // couvre donc tout le circuit, du tableau au dernier socle.
  assert.deepEqual(refs(modele, prises.appareils), ['CM-05', 'MC-02', 'PC-01', 'PC-02', 'PC-03', 'PC-04', 'PC-05', 'TD-01']);
  assert.ok(prises.segments.length > 0);
  assert.ok(prises.conducteurs.includes('phase'));
});

test('la ligne de la borne ne joint que le tableau et la borne', () => {
  const t = de('cheminement', 'CH-B3');
  assert.equal(t.length, 1);
  assert.equal(t[0].circuit, 'c-borne');
  assert.deepEqual(refs(modele, t[0].appareils), ['BR-01', 'TD-01']);
  // Et dans la goulotte partagée, elle court avec les deux autres.
  assert.deepEqual(de('cheminement', 'GL-02').map((x) => x.circuit).sort(), ['c-borne', 'c-eclairage', 'c-prises']);
});

test('une traversée ne donne que les conducteurs qui la franchissent', () => {
  const t = de('traversee', 'TV-L2');
  assert.deepEqual(t.map((x) => x.circuit), ['c-eclairage']);
  assert.ok(t[0].appareils.includes(idDe(modele, 'EL-03')));
  assert.equal(t[0].conducteurs.includes('phase'), false, 'la phase ne va pas à EL-03 : elle va à CM-03');
});

test('une boîte donne les conducteurs qui y passent ou s’y arrêtent', () => {
  const t = de('composant', 'BD-04');
  assert.deepEqual(t.map((x) => x.circuit).sort(), ['c-eclairage', 'c-prises']);
  const ecl = t.find((x) => x.circuit === 'c-eclairage');
  assert.ok(ecl.conducteurs.some((l) => /CM-01/.test(l)), 'la paire d’ordre de CM-01, logée dans son boîtier');
  // BL-01 ne voit pas la borne, qui ne passe pas au plafond.
  assert.equal(de('composant', 'BL-01').some((x) => x.circuit === 'c-borne'), false);
});

test('un circuit non dérivable n’est pas tracé, et se dit inconnu', () => {
  const sansPilote = copie(ECLAIRAGE());
  for (const c of sansPilote.composants) { delete c.pilote; delete c.commutation; delete c.module; }
  const m = fusionner(SOCLE(), [PRISES(), sansPilote, BORNE(), AUTOMATISATION()]);
  const t = de('cheminement', 'CH-05', m);
  const ecl = t.find((x) => x.circuit === 'c-eclairage');
  assert.equal(ecl.inconnu, true);
  assert.deepEqual(ecl.segments, [], 'aucun trajet n’est deviné');
  const ligne = lignesTrajets(t, m.composants)[0];
  assert.match(ligne.texte, /trajet inconnu/);
  assert.equal(ligne.inconnu, true);
  assert.equal(formesDesTrajets(m, t).tubes.some((x) => x.circuit === 'c-eclairage'), false);
});

test('les tracés de deux circuits courent côte à côte, chacun dans sa couleur', () => {
  const t = de('cheminement', 'CH-05');
  const { tubes } = formesDesTrajets(modele, t);
  // Hors des tronçons d'ordre, plus foncés (voir plus bas).
  const couleurs = new Set(tubes.filter((x) => !x.ordre).map((x) => x.couleur));
  assert.deepEqual([...couleurs].sort(), ['#2ca02c', '#ff7f0e'], 'la couleur que chaque circuit déclare');
  // Sur CH-05, les deux circuits partagent l'arête du conduit : leurs tracés sont
  // décalés l'un de l'autre, perpendiculairement au conduit.
  const surCH05 = (x) => Math.abs(x.de.y - 2.6) < 0.05 && Math.abs(x.a.y - 2.6) < 0.05 && Math.abs(x.de.z - x.a.z) > 1;
  const [p, e] = ['c-prises', 'c-eclairage'].map((id) => tubes.find((x) => x.circuit === id && surCH05(x)));
  const ecart = Math.hypot(p.de.x - e.de.x, p.de.y - e.de.y);
  assert.ok(Math.abs(ecart - modele.presentation.trajets.ecart) < 1e-9, `écart de ${ecart}`);
  // Un seul circuit ne se décale pas.
  assert.deepEqual(decalageDe({ x: 0, y: 0, z: 1 }, 0, 1, 0.016), { x: 0, y: 0, z: 0 });
});

test('les appareils d’extrémité sont connus, avec les circuits qui y aboutissent', () => {
  // Les pastilles qu'ils portaient ont été retirées le 2026-09-25 : un appareil
  // extrémité d'un seul circuit prend sa couleur, celui où en aboutissent plusieurs
  // est souligné de son contour.
  const t = de('cheminement', 'GL-02');
  const formes = formesDesTrajets(modele, t);
  assert.equal(formes.pastilles, undefined, 'plus aucune pastille');
  const td = idDe(modele, 'TD-01');
  assert.deepEqual(formes.appareils.get(td).sort(), ['c-borne', 'c-eclairage', 'c-prises'], 'le tableau : trois circuits');
  assert.deepEqual(formes.appareils.get(idDe(modele, 'BR-01')), ['c-borne'], 'la borne : le sien seul');
});
test('la fiche nomme, circuit par circuit, les appareils joints', () => {
  const l = lignesTrajets(de('cheminement', 'CH-B3'), modele.composants, () => '#d62728');
  assert.equal(l[0].libelle, 'Trajets');
  assert.match(l[0].texte, /Borne de recharge : TD-01, BR-01|Borne de recharge : BR-01, TD-01/);
  assert.match(l[0].texte, /class="pastille" style="background:#d62728"/);
  assert.deepEqual(lignesTrajets([], modele.composants), [], 'rien de désigné, rien à dire');
});

test('la scène dessine les trajets par-dessus le reste, et les efface', async () => {
  const { construireTrajets } = await import('../src/scene/trajets.js');
  const scene = construireTrajets(modele);
  const t = de('cheminement', 'CH-B3');
  const appareils = scene.afficher(t);
  assert.ok(scene.groupe.children.length > 0);
  assert.ok(scene.groupe.children.every((m) => m.material.depthTest === false), 'visibles à travers les conduits');
  const rayon = modele.presentation.trajets.diametre / 2;
  assert.ok(scene.groupe.children.every((m) => m.geometry.type === 'CylinderGeometry' || Math.abs(m.scale.x - rayon) < 1e-9), 'des tracés et leurs rotules, aucune pastille');
  assert.deepEqual(refs(modele, [...appareils.keys()]), ['BR-01', 'TD-01']);
  scene.effacer();
  assert.equal(scene.groupe.children.length, 0);
});

test('un tronçon où passe un fil d’ordre prend la couleur de son circuit, plus foncée', async () => {
  const { assombrir } = await import('../src/scene/trajets.js');
  const facteur = modele.presentation.trajets.assombrissementOrdre;
  assert.equal(assombrir('#ff7f0e', facteur), '#8c4608', 'l’orange de l’éclairage, assombri');
  assert.equal(assombrir('#ffffff', 0.5), '#808080');

  // CH-A1 porte les fils d'ordre des deux boutons du boîtier double : celui de CM-04
  // pour l'éclairage, celui de CM-05 pour les prises. Chacun dans la teinte foncée
  // de son circuit, sur ses seuls tronçons.
  const t = de('cheminement', 'CH-A1');
  const { tubes } = formesDesTrajets(modele, t);
  for (const [circuit, couleur] of [['c-eclairage', '#ff7f0e'], ['c-prises', '#2ca02c']]) {
    const siens = tubes.filter((x) => x.circuit === circuit);
    assert.ok(siens.some((x) => x.ordre && x.couleur === assombrir(couleur, facteur)), `${circuit} : tronçons d’ordre foncés`);
    assert.ok(siens.some((x) => !x.ordre && x.couleur === couleur), `${circuit} : les autres à la couleur du circuit`);
  }

  // La teinte dit ce que chaque tronçon CONTIENT, et non ce qui passe par l'objet
  // désigné. CH-05 ne porte aucun fil d'ordre des prises, mais le trajet des prises
  // qu'il montre traverse CH-07 et CH-08, où court celui du bouton de porte : ces
  // tronçons-là sont foncés, CH-05 ne l'est pas.
  const depuisCH05 = formesDesTrajets(modele, de('cheminement', 'CH-05')).tubes.filter((x) => x.circuit === 'c-prises');
  const verticalSurCH05 = (x) => Math.abs(x.de.y - 2.6) < 0.05 && Math.abs(x.a.y - 2.6) < 0.05 && Math.abs(x.de.z - x.a.z) > 1;
  assert.ok(depuisCH05.some((x) => x.ordre && x.couleur === assombrir('#2ca02c', facteur)), 'vert foncé là où court le fil d’ordre');
  assert.equal(depuisCH05.filter(verticalSurCH05).some((x) => x.ordre), false, 'et vert clair sur CH-05 lui-même');

  // Sans fil d'ordre, rien de foncé : la borne n'en a pas.
  assert.equal(formesDesTrajets(modele, de('cheminement', 'CH-B3')).tubes.some((x) => x.ordre), false);

  // Et la fiche le dit, avec la pastille foncée.
  const l = lignesTrajets(t, modele.composants, () => '#2ca02c', () => '#185818')[0];
  assert.match(l.texte, /background:#185818"><\/span>foncé : fil d'ordre/);
  assert.doesNotMatch(lignesTrajets(de('cheminement', 'CH-B3'), modele.composants)[0].texte, /fil d'ordre/);
});
