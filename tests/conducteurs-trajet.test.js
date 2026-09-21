/**
 * Le **trajet réel** de chaque conducteur, dérivé du pilotage déclaré.
 *
 * Écrit le 2026-09-22, en réponse à une question de trois mots : « pourquoi huit
 * conducteurs dans CH-07 ? ». Il n'y en a pas huit, il y en a six. Le huit était
 * un majorant appliqué uniformément à tout le tronc partagé, alors que seul CH-05
 * l'atteint. Les deux conducteurs manquants ailleurs sont la phase non commutée,
 * qui s'arrête à CM-01 dans BD-04, et le retour de CM-03, qui ne monte jamais au
 * plafond.
 *
 * La question ne visait qu'une ligne de fiche ; elle en a ouvert deux autres — la
 * liste des fournitures surestimait le fil de 57 %, et la réserve du § 2.3 de la
 * note d'éclairage restait ouverte faute de la même donnée. Une seule déclaration
 * les ferme toutes les trois : quelle commande pilote quel point.
 *
 * Les assertions portent sur des propriétés du trajet, pas sur des coordonnées.
 */

import test from 'node:test';
import assert from 'node:assert/strict';
import { SOCLE, PRISES, ECLAIRAGE, BORNE, AUTOMATISATION, DEMO, copie } from './_aides.js';
import { fusionner } from '../src/donnees/chargement.js';
import { validerApport, validerModele } from '../src/donnees/validation.js';
import { composerSequence } from '../src/sequence/ordonnancement.js';
import { construireGraphe } from '../src/geometrie/graphe.js';
import {
  conducteursDuCircuit,
  occupationParCheminement,
  longueurParConducteur,
  cheminDePhase,
} from '../src/geometrie/conducteurs.js';
import { conducteursDe, caracteristiquesCheminement } from '../src/ui/fiche-composant.js';
import { conducteursParSection } from '../src/donnees/fournitures.js';

const CIRCUIT = 'c-eclairage';
const modele = fusionner(SOCLE(), [PRISES(), ECLAIRAGE(), BORNE(), AUTOMATISATION()]);
const graphe = construireGraphe(modele);
const occupation = occupationParCheminement(modele, graphe);

const idDe = (ref) => modele.cheminements.find((c) => c.reference === ref).id;
const occupe = (ref) => occupation.get(idDe(ref));
/** Ce que l'éclairage seul met dans un conduit, rôles compris. */
const eclairageDans = (ref) => occupe(ref).parCircuit.find((l) => l.circuit === CIRCUIT);

test('CH-07 porte sept conducteurs, dont trois seulement de l’éclairage', () => {
  // Le cas qui a déclenché tout ceci. Il en portait six ; l'automatisation y
  // ajoute le fil d'ordre du bouton de porte, qui va à MC-02 au droit du moteur —
  // un seul, l'entrée du module commutant la phase. L'éclairage, lui, y met toujours trois conducteurs : neutre, PE, et ce
  // qui alimente le plafonnier — la SORTIE DE MC-01, qui a pris la place du retour
  // de CM-01. Ni la phase, qui s'arrête au module, ni le retour de CM-03.
  assert.equal(occupe('CH-07').total, 7);
  assert.equal(occupe('CH-07').majore, false, 'sept est dérivé, ce n’est pas une borne');
  assert.deepEqual(eclairageDans('CH-07').roles, ['neutre', 'pe', 'sortie-module']);
  assert.equal(
    eclairageDans('CH-07').roles.includes('phase'),
    false,
    'la phase non commutée ne dépasse pas le module',
  );
});

test('le tronc porte ce que la dérivation dit, et CH-05 est le conduit le plus chargé', () => {
  // Le décompte manuel de la conception annonçait huit partout où passe le bouton
  // de porte. Il oubliait que CM-01, dès qu'elle adresse un ordre à MC-01 dans la
  // goulotte, fait monter la sortie du module par CH-02 et descendre sa paire
  // d'ordre par CH-02 puis CH-05. CH-02 et CH-05 sont passés en IRL 25 sur
  // décision du maître d'ouvrage du 2026-09-23. Depuis le 2026-09-24, CH-02 et
  // CH-04 ont disparu dans la goulotte GL-02 : CH-05 reste le conduit le plus
  // chargé, et le seul en IRL 25 du tronc.
  const tronc = modele.cheminements.filter((ch) => (ch.circuits ?? []).length > 1);
  assert.ok(tronc.length > 1, 'le tronc partagé doit compter plusieurs conduits');

  const attendus = {
    // Les goulottes : leur condition de remplissage se lit sur la fiche produit et
    // non sur la règle du tiers (condition 6). GL-01 en porte QUINZE — les douze
    // de l'usage courant, dont le fil d'ordre du bouton de porte qui y remonte de
    // GL-02 vers CH-L1, plus les trois du câble de la borne ; GL-02 QUATORZE.
    'GL-01': 15,
    'GL-02': 14,
    'CH-05': 9,
    'CH-07': 7,
    // Le décompte est par cheminement : c'est celui du tronçon nord, le plus chargé.
    'CH-L1': 8,
    'CH-A1': 6,
  };
  assert.deepEqual(
    tronc.map((ch) => ch.reference).sort(),
    Object.keys(attendus).sort(),
    'le tronc partagé est celui-là',
  );
  for (const ch of tronc) {
    assert.equal(occupation.get(ch.id).total, attendus[ch.reference], `${ch.reference} n'en porte pas ${attendus[ch.reference]}`);
  }
  assert.equal(modele.cheminements.find((c) => c.reference === 'CH-05').section.diametre, 0.025, 'CH-05 est en IRL 25');

  // Et le maximum du circuit reste égal au nombre déclaré : celui-ci devient un
  // GARDE-FOU du chiffre dérivé, non plus sa source. S'ils divergent, l'un des
  // deux ment.
  for (const circuit of modele.circuits) {
    if (typeof circuit.conducteurs !== 'number') continue;
    const max = Math.max(
      ...modele.cheminements
        .filter((ch) => (ch.circuits ?? []).includes(circuit.id))
        .map((ch) => occupation.get(ch.id).parCircuit.find((l) => l.circuit === circuit.id).nombre),
    );
    assert.equal(max, circuit.conducteurs, `le maximum dérivé de « ${circuit.libelle} » doit valoir le déclaré`);
  }
});

test('une sortie qui dessert deux sorties reste un seul fil jusqu’à la fourche', () => {
  // Le point qui fait toute la différence entre une union de chemins et une somme
  // de chemins. La sortie de MC-01 dessert les DEUX sorties du plafonnier ; elle
  // n'en reste pas moins un fil unique jusqu'à BL-01, où elle se sépare. Et deux
  // boutons — CM-01 et CM-04 — ne font pas deux fils : c'est le module qui commute.
  const sorties = conducteursDuCircuit(graphe, modele, CIRCUIT).filter((c) => c.role === 'sortie-module');
  assert.equal(sorties.length, 1, 'une seule sortie pour deux boutons');
  const duPlafonnier = sorties[0];
  assert.match(duPlafonnier.libelle, /MC-01/);

  const compter = (ref) => eclairageDans(ref).roles.filter((r) => r === 'sortie-module').length;
  assert.equal(compter('CH-07'), 1, 'un seul retour sur le tronc, pour deux sorties');
  assert.equal(compter('CH-L2'), 1, 'un seul jusqu’à la fourche');
  assert.equal(compter('CH-L3'), 1, 'puis un par branche');
  assert.equal(compter('CH-L4'), 1);

  // Ce que l'union évite : compter deux fois le tronc commun. Le chemin de MC-01
  // à chaque sortie passe par CH-07, mais CH-07 n'est facturé qu'une fois. Et il
  // ne passe plus par CH-05 : la sortie part de la goulotte, pas de BD-04.
  const parRef = new Map(modele.cheminements.map((ch) => [ch.id, ch.reference]));
  assert.deepEqual(
    duPlafonnier.cheminements.map((id) => parRef.get(id)).sort(),
    ['CH-07', 'CH-L2', 'CH-L3', 'CH-L4', 'GL-01', 'GL-02'],
  );
});

test('chaque bouton sur module a sa paire d’ordre, sur son propre trajet', () => {
  // Deux fils d'ordre par bouton — celui qui l'alimente et celui qui en revient —,
  // partis du MODULE et non du tableau. Et ni phase ni neutre au bouton : il ne
  // coupe aucune puissance (décision du 2026-09-23).
  const parRef = new Map(modele.cheminements.map((ch) => [ch.id, ch.reference]));
  const ordres = (circuit, cm) =>
    conducteursDuCircuit(graphe, modele, circuit).filter((c) => c.role === 'ordre' && c.libelle.includes(cm));
  const trajet = (c) => c.cheminements.map((id) => parRef.get(id)).sort();

  assert.equal(ordres(CIRCUIT, 'CM-01').length, 2);
  assert.deepEqual(trajet(ordres(CIRCUIT, 'CM-01')[0]), ['CH-05', 'GL-01', 'GL-02']);
  assert.equal(ordres(CIRCUIT, 'CM-04').length, 2);
  assert.deepEqual(trajet(ordres(CIRCUIT, 'CM-04')[0]), ['CH-A1', 'CH-L1', 'GL-01']);

  // Le bouton de porte va à MC-02 par tout le tronc : la route directe par le
  // plafond est fermée par le majorant du tablier ouvert. Un fil seulement : l'entrée
  // de MC-02 commute la phase, et c'est la phase du circuit qui monte au bouton.
  assert.equal(ordres('c-prises', 'CM-05').length, 1);
  assert.deepEqual(trajet(ordres('c-prises', 'CM-05')[0]), ['CH-07', 'CH-08', 'CH-A1', 'CH-L1', 'GL-01', 'GL-02']);

  assert.deepEqual(occupe('CH-A1').parCircuit.map((l) => [l.circuit, l.roles]), [
    ['c-eclairage', ['pe', 'ordre', 'ordre']],
    // Au bouton de porte : la phase du circuit et le fil qui la renvoie à MC-02.
    ['c-prises', ['phase', 'pe', 'ordre']],
  ]);
});

test('la commutation sur place de CM-02 ne met aucun retour commandé dans le tronc', () => {
  // CM-02 est un détecteur alimenté EN PERMANENCE et commuté sur place (FR-042).
  // Sa topologie est l'inverse des deux autres : la phase va au POINT, et le
  // retour ne quitte pas la liaison de 0,30 m qui les relie. Rien ne permet de le
  // deviner, d'où le champ `commutation`.
  // CH-L1 porte en outre la paire d'ordre de CM-04, qui descend au boîtier double
  // par BD-06 : un ordre, pas une phase commandée.
  assert.deepEqual(eclairageDans('CH-L1').roles, ['phase', 'neutre', 'pe', 'ordre', 'ordre']);
  assert.equal(
    eclairageDans('CH-L1').roles.includes('retour-commande'),
    false,
    'aucune phase commandée ne descend vers la façade sud',
  );
  assert.deepEqual(eclairageDans('CH-L6').roles, ['neutre', 'pe', 'retour-local']);

  const local = conducteursDuCircuit(graphe, modele, CIRCUIT).filter((c) => c.role === 'retour-local');
  assert.equal(local.length, 1, 'un seul retour local, celui du détecteur');
  assert.equal(local[0].cheminements.length, 1, 'et il ne quitte pas la liaison point ↔ commande');
});

test('le métré du 1,5 mm² tombe de 80,40 m à sa valeur réelle, les deux autres ne bougent pas', () => {
  // La surestimation était de 57 % : `n × longueur de tracé` portait les cinq
  // conducteurs du cas le plus chargé sur la totalité du circuit. Les circuits
  // SANS commande — prises, borne — n'ont jamais eu ce défaut, et leurs chiffres
  // doivent donc être rigoureusement inchangés : c'est ce qui prouve que la
  // correction porte sur le pilotage et non sur la façon de mesurer.
  //
  // Les trois métrés ont monté de 1,12 m par conducteur qui emprunte la goulotte,
  // devenue un CHEMINEMENT : sa longueur était invisible tant qu'elle était une
  // enceinte, alors que les conducteurs la parcourent bel et bien.
  //   1,5 mm²  47,94 -> 51,30   (+3,36 = 1,12 x 3)
  //   2,5 mm²  39,30 -> 42,66 -> 43,56 -> 41,91  (goulotte, PC-03 nord, puis BD-05 dans l'axe)
  //   10 mm²   31,32 -> 31,38   (+0,06)
  // Le dernier chiffre est le plus parlant : le câble de la borne perd les 1,10 m
  // de CH-B1, supprimé par l'amendement v1.14.0, et gagne les 1,12 m du profilé
  // qui le remplace. Deux centimètres d'écart pour un changement de contenant.
  //
  // L'automatisation (2026-09-23) remonte les deux premiers, et c'est du fil réel :
  //   1,5 mm²  51,30 -> 73,02   la sortie de MC-01 et les paires de CM-01, CM-04
  //   2,5 mm²  41,91 -> 62,31   le fil d'ordre du bouton de porte, et la phase et le PE qui l'accompagnent
  // Une part est MAJORÉE par construction : le décompte se fait par cheminement,
  // et les fils qui ne font que le tronçon nord de CH-L1 y sont comptés sur toute
  // sa longueur. L'erreur est du côté de l'achat.
  //
  // La goulotte GL-02 (2026-09-24) les redescend. Un profilé compte désormais pour
  // ce que chaque conducteur y parcourt, et non pour sa longueur entière : on en
  // sort par une face, en chemin, et GL-02 fait 6,00 m.
  //   1,5 mm²  73,02 -> 69,34   CH-02 et CH-04 disparus, GL-01 comptée au parcours
  //   2,5 mm²  62,31 -> 62,39
  //   10 mm²   31,38 -> 31,44   CH-B2 et 4,08 m de CH-B3 troqués contre 6,00 m de profilé
  // Puis compté en CÂBLE 3G10 (2026-09-24) : 10,48 m de câble, qui s'achète au mètre de câble.
  // Le profilé de GL-02 est un 90 × 40 : les descentes partent de 2,66 m.
  const par = (s) => conducteursParSection(modele).find((c) => c.section === s);
  assert.equal(par(1.5).longueur, 69.34, 'le trajet réel des conducteurs de l’éclairage, goulottes comprises');
  assert.ok(par(1.5).longueur < 131.36 * 0.7, 'la dérivation reste loin du produit majorant');
  assert.equal(par(2.5).longueur, 62.39, 'les prises portent désormais le fil d’ordre du bouton de porte');
  assert.equal(par(10).longueur, 10.48, 'la borne, un câble 3G10 : 10,48 m de câble, et non 31,47 m de conducteur');
  assert.equal(par(10).cable, '3G10');
  for (const s of [1.5, 2.5, 10]) assert.equal(par(s).majore, false, 'et rien n’est plus majoré');

  // Le total se recompose : chaque conducteur sur son trajet, une fois par conduit.
  const detail = longueurParConducteur(modele, graphe).get(CIRCUIT);
  assert.equal(
    detail.detail.length,
    10,
    'PE, neutre, phase, sortie de MC-01, deux paires d’ordre, un retour commandé, un retour local',
  );
  // Au centimètre : sous un capot, un conducteur sort par une face, à une demi-largeur
  // de l'axe, et sa longueur n'est plus une somme de cotes rondes.
  assert.equal(Math.round(detail.detail.reduce((t, c) => t + c.longueur, 0) * 100) / 100, 69.34);
});

test('la longueur du conducteur de phase n’est pas celle du conduit', () => {
  // Pour un point commuté depuis une commande, la phase descend d'abord à
  // l'interrupteur et c'est le retour qui remonte. Le § 2.3 de la note d'éclairage
  // avait calculé ces valeurs à la main, faute de cette dérivation ; elles doivent
  // maintenant en sortir. Elles sont comparées au dixième de millimètre.
  //
  // Depuis que CM-01 adresse un ordre à MC-01, le plafonnier n'est plus dans ce
  // cas : la phase va au module, dans la goulotte, et sa sortie monte au plafond.
  // Le module étant sur le chemin, la phase de EL-01b retombe à la longueur de son
  // neutre — 8,20 m depuis le recul de l'axe au sud (9,00 avant, 12,00 avant MC-01).
  //
  // Depuis la goulotte GL-02, les conducteurs vont sous son capot jusqu'à l'axe du
  // départ, puis en sortent par une face : de l'axe du 90 × 40 au coude AC-01, 0,045 m
  // plus haut et 0,04 m devant, pour 0,15 m de CH-04 et 0,04 m de CH-07 en moins. EL-03 et sa commande prennent la
  // descente CH-05, qui part du dessous du profilé, et la traversée en pente.
  const proche = (v, attendu, quoi) => assert.ok(Math.abs(v - attendu) < 1e-6, `${quoi} : ${v} au lieu de ${attendu}`);
  const phase = (id) => cheminDePhase(graphe, modele, CIRCUIT, id);

  proche(phase('ec-el-01b').longueur, 8.115 + Math.hypot(0.04, 0.045), 'EL-01b par MC-01');
  proche(phase('ec-el-01b').neutre, 8.115 + Math.hypot(0.04, 0.045), 'et son neutre, qui va tout droit');
  assert.equal(phase('ec-el-01b').module, 'MC-01');
  proche(phase('ec-el-01b').jusquAuModule, 0.8, 'MC-01 est à 0,80 m du tableau, dans la goulotte');
  proche(phase('ec-el-01a').longueur, 7.915 + Math.hypot(0.04, 0.045), 'EL-01a');
  proche(phase('ec-el-03').longueur, 6.715 + Math.hypot(0.2, 0.105), 'EL-03 par CM-03, dehors au dos de BD-04');
  proche(phase('ec-el-03').jusquALaCommande, 4.91, 'CM-03 à 4,91 m du tableau');

  // Le détecteur commute sur place : la phase va au point, puis fait l'aller-retour
  // jusqu'au détecteur. Elle ne remonte pas au tableau par la commande.
  const el02 = phase('ec-el-02');
  assert.equal(el02.surPlace, true);
  proche(el02.longueur, el02.neutre + 0.6, 'aller-retour sur la liaison de 0,30 m');

  // Et c'est bien EL-01b qui dimensionne sous la forme exacte, comme sous l'autre.
  const somme = (id) => phase(id).longueur + phase(id).neutre;
  const points = ['ec-el-01a', 'ec-el-01b', 'ec-el-02', 'ec-el-03'];
  assert.equal(points.reduce((a, b) => (somme(a) >= somme(b) ? a : b)), 'ec-el-01b');
});

test('un circuit à commandes sans pilote retombe sur le majorant, et la fiche le dit', () => {
  // Le repli, et la seule forme honnête qu'il puisse prendre. Un pilotage à
  // moitié déclaré ne se complète pas au jugé : les liens manquants seraient
  // inventés, et le décompte aurait l'apparence d'un décompte dérivé.
  const sansPilote = copie(ECLAIRAGE());
  for (const c of sansPilote.composants) {
    delete c.pilote;
    delete c.commutation;
    delete c.module;
  }
  const m = fusionner(SOCLE(), [PRISES(), sansPilote, BORNE(), AUTOMATISATION()]);
  const occ = occupationParCheminement(m);
  const ch = m.cheminements.find((c) => c.reference === 'CH-07');

  // Quatre dérivés pour les prises, huit au plus pour l'éclairage.
  assert.equal(occ.get(ch.id).total, 12, 'le majorant déclaré, faute de mieux');
  assert.equal(occ.get(ch.id).majore, true);

  const lignes = caracteristiquesCheminement(ch, m.circuits, occ);
  assert.equal(lignes.find((x) => x.libelle === 'Conducteurs').texte, '12 au plus');
  assert.match(
    lignes.find((x) => x.libelle === 'dont').texte,
    /8 au plus pour Éclairage/,
    'et la répartition nomme la borne comme telle, circuit par circuit',
  );
  assert.equal(conducteursDe(ch, m.circuits, occ).majore, true);

  // Le métré retombe lui aussi sur le produit majorant : huit conducteurs sur tout
  // le tracé de l'éclairage, 20,39 m, soit 163,12 m. Le majorant compte les
  // profilés entiers, et c'est ce qu'un majorant doit faire : 16,42 m avant que la
  // goulotte GL-02 et ses 6,00 m ne remplacent CH-02 et CH-04.
  const par = conducteursParSection(m).find((c) => c.section === 1.5);
  assert.equal(par.longueur, 163.12);
  assert.equal(par.majore, true);
});

test('un pilotage déclaré à moitié est refusé, et les deux champs sont inséparables', () => {
  const socle = SOCLE();
  // Sur CM-03, qui renvoie un retour commandé : sur une commande sur module, le
  // pilote est facultatif et c'est le module qui est obligatoire.
  const sans = (champ, id = 'ec-cm-03') => {
    const a = copie(ECLAIRAGE());
    delete a.composants.find((c) => c.id === id)[champ];
    return validerApport(a, socle);
  };
  assert.ok(sans('commutation').some((x) => /sans commutation/.test(x.message)));
  assert.ok(sans('pilote').some((x) => /sans pilote/.test(x.message)));
  assert.equal(sans('pilote', 'ec-cm-01').length, 0, 'une commande sur module peut ne rien piloter');
  assert.ok(sans('module', 'ec-cm-01').some((x) => /doit nommer son module/.test(x.message)));

  const surUnPoint = copie(ECLAIRAGE());
  const point = surUnPoint.composants.find((c) => c.id === 'ec-el-02');
  point.pilote = ['ec-el-03'];
  point.commutation = 'sur-place';
  assert.ok(
    validerApport(surUnPoint, socle).some((x) => /que sur une commande/.test(x.message)),
    'un luminaire ne pilote rien',
  );

  const topologie = copie(ECLAIRAGE());
  topologie.composants.find((c) => c.id === 'ec-cm-01').commutation = 'va-et-vient';
  assert.ok(validerApport(topologie, socle).some((x) => /Commutation inconnue/.test(x.message)));
});

test('un pilote visant un id inexistant, d’un autre circuit, ou déjà piloté, est refusé', () => {
  const socle = SOCLE();
  const cm01 = (a) => a.composants.find((c) => c.id === 'ec-cm-01');

  const fantome = copie(ECLAIRAGE());
  cm01(fantome).pilote = ['ec-el-99'];
  assert.ok(
    validerApport(fantome, socle).some((x) => /n'existe pas dans cet apport/.test(x.message)),
    'un point piloté doit exister',
  );

  // Une commande ne franchit pas la protection d'un autre circuit : dériver un
  // conducteur au-delà ferait passer des fils là où il n'en passe aucun.
  const autreCircuit = copie(ECLAIRAGE());
  autreCircuit.composants.find((c) => c.id === 'ec-el-03').circuit = 'c-prises';
  assert.ok(
    validerApport(autreCircuit, socle).some((x) => /pas du même circuit/.test(x.message)),
    'un point piloté est du même circuit',
  );

  // Deux commandes sur un même point seraient un va-et-vient, que ce modèle ne
  // sait pas décrire — et qui produirait deux retours pour un seul fil.
  const deuxFois = copie(ECLAIRAGE());
  deuxFois.composants.find((c) => c.id === 'ec-cm-03').pilote = ['ec-el-03', 'ec-el-01a'];
  assert.ok(
    validerApport(deuxFois, socle).some((x) => /piloté deux fois/.test(x.message)),
    'un point n’a qu’une commande',
  );

  // Sauf si les deux commandes adressent le MÊME module : chacune a sa paire, et
  // aucun retour n'est partagé. Un autre module, en revanche, reste un va-et-vient.
  const memeModule = copie(ECLAIRAGE());
  memeModule.composants.push({
    ...copie(cm01(memeModule)),
    id: 'ec-cm-99',
    reference: 'CM-99',
  });
  assert.equal(validerApport(memeModule, socle).length, 0, 'deux boutons d’un même module sont équivalents');
  memeModule.composants.find((c) => c.id === 'ec-cm-99').module = 'au-mc-99';
  assert.ok(validerApport(memeModule, socle).some((x) => /piloté deux fois/.test(x.message)));

  const uneCommande = copie(ECLAIRAGE());
  cm01(uneCommande).pilote = ['ec-cm-03'];
  assert.ok(
    validerApport(uneCommande, socle).some((x) => /une commande ne se pilote pas/.test(x.message)),
  );
});

test('un circuit sans commande se dérive trivialement, et le jeu de démonstration tient', () => {
  // La borne n'a aucune commande : phase, neutre, PE du tableau au point, et la
  // dérivation doit couvrir TOUS ses conduits — un conduit qu'aucun conducteur
  // n'emprunte serait un tube posé pour rien. Les prises n'en avaient aucune jusqu'au
  // bouton de porte, qui leur ajoute son fil d'ordre.
  assert.deepEqual(
    conducteursDuCircuit(graphe, modele, 'c-prises').map((c) => c.role),
    ['pe', 'neutre', 'phase', 'ordre'],
  );
  for (const id of ['c-borne']) {
    const conducteurs = conducteursDuCircuit(graphe, modele, id);
    assert.deepEqual(conducteurs.map((c) => c.role), ['pe', 'neutre', 'phase']);
    for (const ch of modele.cheminements.filter((c) => (c.circuits ?? []).includes(id))) {
      assert.equal(
        occupation.get(ch.id).parCircuit.find((l) => l.circuit === id).nombre,
        3,
        `${ch.reference} porte les trois conducteurs de « ${id} »`,
      );
    }
  }

  // Le jeu de démonstration n'a ni pilotage ni décompte déclaré. Son trajet se
  // dérive quand même — il n'a pas de commande —, mais la FICHE reste muette :
  // le nombre déclaré est le garde-fou du chiffre dérivé, et un chiffre dérivé
  // que rien ne recoupe n'est pas un chiffre vérifié.
  const demo = fusionner(SOCLE(), [DEMO()]);
  const occDemo = occupationParCheminement(demo);
  for (const ch of demo.cheminements) {
    assert.equal(occDemo.get(ch.id).total, 3, 'le trajet se dérive sans rien déclarer');
    assert.equal(conducteursDe(ch, demo.circuits, occDemo), null, 'mais la fiche ne l’affiche pas');
  }
});

test('ce que l’entrée d’un module attend du bouton décide du nombre de fils d’ordre', () => {
  // `entree` est une propriété du PRODUIT, déclarée sur le module. MC-02 commute la
  // phase : un fil au bouton de porte. Rendu à une entrée alimentée par le module,
  // le même bouton reprend sa paire — et le tronc son conducteur.
  const boucle = copie(AUTOMATISATION());
  delete boucle.composants.find((c) => c.reference === 'MC-02').entree;
  const m = fusionner(SOCLE(), [PRISES(), ECLAIRAGE(), BORNE(), boucle]);
  const g = construireGraphe(m);
  const ordresCM05 = (mod, gr) =>
    conducteursDuCircuit(gr, mod, 'c-prises').filter((c) => c.role === 'ordre' && c.libelle.includes('CM-05'));
  assert.equal(ordresCM05(modele, graphe).length, 1, 'entrée qui commute la phase');
  assert.equal(ordresCM05(m, g).length, 2, 'entrée alimentée par le module');
  const occ = occupationParCheminement(m);
  const ch07 = m.cheminements.find((c) => c.reference === 'CH-07');
  assert.equal(occ.get(ch07.id).total, 8, 'le fil d’aller revient dans le tronc');
});

test('« entree » ne se déclare que sur un module, et ne prend que deux valeurs', () => {
  const a = copie(AUTOMATISATION());
  a.composants.find((c) => c.reference === 'CM-05').entree = 'phase';
  a.composants.find((c) => c.reference === 'MC-01').entree = 'secteur';
  const m = fusionner(SOCLE(), [PRISES(), ECLAIRAGE(), BORNE(), a]);
  const cibles = validerModele(m, composerSequence(m)).filter((d) => /entree/.test(d.message)).map((d) => d.cible);
  assert.deepEqual(cibles.sort(), ['au-cm-05', 'au-mc-01']);
});
