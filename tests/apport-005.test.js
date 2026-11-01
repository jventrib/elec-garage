/**
 * L'apport de l'automatisation locale, lu avec les trois autres.
 *
 * Il ne déclare ni tableau ni circuit : il **modifie** ce que les trois apports
 * précédents ont posé. La goulotte y remplace une boîte de dérivation, et deux
 * modules s'y ajoutent — l'un dans la goulotte, l'autre au droit du moteur.
 *
 * Deux propriétés portent tout le reste, et aucune des deux ne se voit à l'œil :
 *
 *  - la **contiguïté déclarée** entre la goulotte et le tableau qu'elle surmonte
 *    est le seul chemin du courant. Sans elle, les trois circuits sont coupés ;
 *  - la goulotte fait **1,12 m**, et une enceinte de cette taille ne doit pas
 *    raccourcir les longueurs qui la traversent. C'est la raison pour laquelle
 *    une boîte relie désormais ses points au lieu de les ramener à son centre.
 *
 * Les assertions portent sur des **propriétés**, pas sur des coordonnées.
 */

import test from 'node:test';
import assert from 'node:assert/strict';
import { SOCLE, PRISES, ECLAIRAGE, BORNE, AUTOMATISATION } from './_aides.js';
import { fusionner } from '../src/donnees/chargement.js';
import { composerSequence } from '../src/sequence/ordonnancement.js';
import { validerTout } from '../src/donnees/validation.js';
import { construireGraphe, atteignablesDepuisTableau, longueursDepuisTableau } from '../src/geometrie/graphe.js';
import { occupationParCheminement, conducteursDuCircuit } from '../src/geometrie/conducteurs.js';

const apports = () => [PRISES(), ECLAIRAGE(), BORNE(), AUTOMATISATION()];
const modeleDe = () => fusionner(SOCLE(), apports());

test('les vingt-deux règles ne rendent aucun défaut sur les quatre apports fusionnés', () => {
  const a = apports();
  const m = fusionner(SOCLE(), a);
  const defauts = validerTout(m, composerSequence(m), a);
  assert.deepEqual(
    defauts.map((d) => `${d.regle} | ${d.cible} | ${d.message}`),
    [],
  );
});

test('les trois circuits restent continus depuis le tableau, par la seule contiguïté', () => {
  // CH-01 a disparu : plus aucun conduit ne relie le tableau à la goulotte. Ce qui
  // les relie est une contiguïté DÉCLARÉE, et c'est le seul chemin du courant.
  const m = modeleDe();
  const g = construireGraphe(m);
  for (const c of m.circuits) {
    assert.deepEqual(
      atteignablesDepuisTableau(g, m, c.id).orphelins,
      [],
      `« ${c.libelle} » doit rester continu depuis le tableau`,
    );
  }

  // La goulotte est un CHEMINEMENT depuis le retypage des enveloppes : elle
  // achemine sur un parcours, ce qui est la définition d'un cheminement, et la
  // constitution l'admet « pour tenir lieu de conduit sur un parcours donné ».
  const goulotte = m.cheminements.find((c) => c.reference === 'GL-01');
  assert.ok(goulotte, 'la goulotte doit exister');
  assert.equal(goulotte.section.forme, 'rectangulaire', 'un profilé n’a pas une section de tube');
  assert.equal(goulotte.raccordement, 'lateral', 'elle se raccorde par ses côtés');
  assert.ok(
    (goulotte.contigu ?? []).length > 0,
    'et déclarer sa contiguïté : la proximité ne rattache rien',
  );
  // L'organe de connexion : le groupe de connexions repéré sous le capot. Depuis la
  // constitution v1.15.0, il n'est plus une enveloppe, et ne déclare donc ni
  // volume ni entrées — ceux qu'il portait n'étaient la cote d'aucun produit.
  const organe = m.composants.find((c) => c.reference === 'OC-01');
  assert.ok(organe, 'l’organe de connexion doit exister');
  assert.equal(organe.dimensions, undefined, 'il n’a plus de volume propre');
  assert.equal(
    m.composants.some((c) => c.reference === 'BD-02'),
    false,
    'BD-02 a été remplacée par la goulotte',
  );
  assert.equal(
    m.cheminements.some((c) => c.reference === 'CH-01'),
    false,
    'CH-01 cesse d’être un conduit : les conducteurs vont du tableau à la goulotte sans tube',
  );
});

test('aucune enceinte ne raccourcit les longueurs dimensionnantes', () => {
  // Le piège que la conception a failli ne pas voir. Une enceinte qui ramenait ses
  // points à son centre aurait raccourci de 0,37 m tout chemin qui la traverse, et
  // faussé deux chutes de tension DÉCLARÉES, dans le sens flatteur.
  const m = modeleDe();
  const g = construireGraphe(m);
  const par = (circuit) => longueursDepuisTableau(g, m, circuit).plusLong;

  // Le point dimensionnant a changé le 2026-09-26 pour une cause géométrique et non
  // d'une dérive : le plafond est passé à six réglettes, et la colonne ouest était
  // alors plus longue de 20 cm que la colonne est. EL-01a avait pris la place
  // d'EL-01b.
  //
  // Il est revenu à l'EST le 2026-10-01, avec le pontage par cordage, et pour une
  // raison qui tient en un nombre : BL-01 décroche à x = 2,70 alors que l'axe médian
  // de l'œuvre est à 2,80. La fourche est 10 cm à l'ouest du milieu, donc la colonne
  // est part à 3,10 et court 1,90 m jusqu'à 5,00, là où l'ouest part à 2,30 et n'en
  // court que 1,70. EL-01b, le plus éloigné de la chaîne, dimensionne à 17,17 m.
  //
  // Il est passé au NORD-EST avec le tronc en IRL sous trois boîtes (BD-07/08/09) :
  // plus de fourche ni de cordages, le chemin le plus long mène à EL-01f, à 10,03 m.
  assert.equal(par('c-eclairage').reference, 'EL-01f', 'le point dimensionnant est la colonne nord-est');
  const proche = (v, attendu, quoi) =>
    assert.ok(Math.abs(v - attendu) < 0.02, `${quoi} : ${v.toFixed(4)} au lieu de ${attendu}`);
  // EL-01f est la plus longue des six branches, et EL-02, près du tableau mais
  // alimenté par la goulotte GL-03 et la descente extérieure, ne la suit pas de loin.
  // EL-01f est la plus longue des six branches, à 10,03 m.
  proche(par('c-eclairage').longueur, 10.025, 'EL-01f');
  proche(par('c-borne').longueur, 10.61, 'BR-01');

  // Et la chute déclarée de la borne reste celle que le tracé redonne.
  const circuit = m.circuits.find((c) => c.id === 'c-borne');
  const terminale = (100 * 2 * 0.0225 * par('c-borne').longueur * circuit.courantEmploi) / (circuit.section * 230);
  const amont = (100 * 2 * 0.0225 * 30 * 45) / (16 * 230);
  assert.equal(Math.round((amont + terminale) * 100) / 100, circuit.chuteTensionCumulee);
});

test('les deux modules sont desservis, et aucun n’est l’extrémité d’un conduit', () => {
  // Un module vit DANS une enceinte : la goulotte pour l'éclairage, le boîtier du
  // socle du moteur pour la porte. Ni l'un ni l'autre n'a de conduit propre, et
  // c'est ce qui rend leur rattachement invisible sans déclaration.
  const m = modeleDe();
  const g = construireGraphe(m);
  const modules = m.composants.filter((c) => c.type === 'module-commande');
  assert.equal(modules.length, 2, 'un module d’éclairage, un module de porte');

  for (const mc of modules) {
    const n = g.noeudAu(mc.position);
    assert.ok(n, `${mc.reference} doit avoir un nœud`);
    // Aucun module n'est l'extrémité d'un CONDUIT. Le module d'éclairage est en
    // revanche relié au profilé qui l'abrite, par raccordement latéral — c'est ce
    // qui le rend joignable sans lui inventer un tube.
    const parId = new Map((m.cheminements ?? []).map((c) => [c.id, c]));
    const surConduit = (n.aretes ?? []).some(
      (a) => a.cheminement && parId.get(a.cheminement)?.raccordement !== 'lateral',
    );
    assert.equal(surConduit, false, `${mc.reference} n’est l’extrémité d’aucun conduit`);
    const acces = atteignablesDepuisTableau(g, m, mc.circuit);
    assert.ok(acces.atteignables.has(mc.id), `${mc.reference} doit être desservi`);
  }
});

test('le décompte des conducteurs est dérivé, et le garde-fou tient', () => {
  const m = modeleDe();
  const occ = occupationParCheminement(m);
  for (const circuit of m.circuits) {
    if (typeof circuit.conducteurs !== 'number') continue;
    const siens = m.cheminements.filter((ch) => (ch.circuits ?? []).includes(circuit.id));
    const max = Math.max(
      ...siens.map((ch) => occ.get(ch.id).parCircuit.find((l) => l.circuit === circuit.id).nombre),
    );
    assert.equal(max, circuit.conducteurs, `le maximum dérivé de « ${circuit.libelle} » doit valoir le déclaré`);
  }
});

test('les groupes de connexions sous capot ne déclarent aucun volume, et V21 ne les compte pas', () => {
  // Avant la constitution v1.15.0, l'organe de connexion était une ENVELOPPE, et son
  // volume déclaré appelait un décompte d'entrées. Les connexions sont désormais
  // admises dans la goulotte : l'organe n'est plus que l'emplacement repéré d'un
  // groupe de bornes, et n'a pas de trous à compter.
  const m = modeleDe();
  const organes = m.composants.filter((c) => c.type === 'organe-connexion');
  assert.deepEqual(organes.map((c) => c.reference).sort(), ['OC-01', 'OC-02']);
  for (const o of organes) {
    assert.equal(o.dimensions, undefined, `${o.reference} n’a pas de volume`);
    assert.equal(o.entrees, undefined, `${o.reference} n’a pas d’entrées`);
  }
  const defauts = validerTout(m, composerSequence(m), apports());
  assert.equal(defauts.filter((d) => d.regle === 'V21').length, 0);
});
test('aucune valeur non établie n’est rendue autrement que par null', () => {
  const a = AUTOMATISATION();
  for (const c of a.composants) {
    assert.ok('indiceProtection' in c, `${c.reference} doit déclarer indiceProtection, même à null`);
  }
  assert.equal(a.provenance.schemaUnifilaire, null);
  assert.equal(a.provenance.noteDeCalcul, null);
});

test('le tronc porte ce que la dérivation dit, et le conduit trop chargé est en IRL 25', () => {
  // Le décompte manuel de la conception annonçait huit sur CH-02, CH-04, CH-05 et
  // CH-07. La dérivation en trouve onze sur CH-02 et neuf sur CH-05 : la table
  // oubliait la sortie de MC-01 et la paire d'ordre de CM-01. Le maître d'ouvrage
  // a passé ces deux conduits en IRL 25 le 2026-09-23. CH-02 et CH-04 ont disparu
  // dans la goulotte GL-02, qui porte le tronc et la ligne de la borne ; CH-05 reste
  // le conduit le plus chargé.
  const m = modeleDe();
  const occ = occupationParCheminement(m);
  const de = (ref) => m.cheminements.find((c) => c.reference === ref);
  const total = (ref) => occ.get(de(ref).id).total;

  for (const [ref, n, diametre] of [
    // Depuis le 2026-09-23, l'entrée de MC-02 commute la phase : le bouton de porte
    // ne renvoie qu'un fil au module, et le tronc en porte un de moins.
    ['CH-05', 9, 0.025],
    ['CH-07', 7, 0.02],
    ['CH-08', 4, 0.02],
    ['CH-A1', 6, 0.02],
  ]) {
    assert.equal(total(ref), n, `${ref} porte ${n} conducteurs`);
    assert.equal(occ.get(de(ref).id).majore, false, `${ref} est dérivé`);
    assert.equal(de(ref).section.diametre, diametre, `${ref} est en IRL ${diametre * 1000}`);
  }
  // Le PE, la phase et le fil d'ordre du circuit des prises montent au bouton de
  // porte ; la phase y remplace le fil d'aller, et le décompte ne change pas.
  // Depuis la goulotte GL-03, qui a remplacé CH-L1 et BD-06 : huit conducteurs
  // sous le même capot — sans calibre IRL à vérifier, c'est un profilé.
  assert.equal(total('GL-03'), 8, 'GL-03 porte 8 conducteurs');
  assert.equal(occ.get(de('GL-03').id).majore, false, 'GL-03 est dérivée');

  // Ce qui décide du calibre restant en IRL 20 : aucun conduit de ce calibre ne
  // porte plus de huit conducteurs. Les CORDAGES n'entrent pas dans ce décompte :
  // ils n'ont pas de section, ils ont un gabarit — le filtre les écarte donc sur le
  // `c.section` absent, pas sur leur nature, pour rester exact si un cordage
  //eletre se mettait un jour à déclarer une section.
  const irl20 = m.cheminements.filter((c) => c.section?.forme === 'circulaire' && c.section.diametre === 0.02);
  assert.ok(Math.max(...irl20.map((c) => occ.get(c.id).total)) <= 8);
});

test('le bouton de porte n’agit sur le moteur que par MC-02, et par tout le tronc', () => {
  // L'entrée de MC-02 commute la PHASE : le bouton prend la phase du circuit des
  // prises, qui l'alimente, et UN fil d'ordre en revient au module. La route
  // directe par le plafond est fermée par le majorant du tablier ouvert.
  const m = modeleDe();
  const g = construireGraphe(m);
  const cm05 = m.composants.find((c) => c.reference === 'CM-05');
  assert.equal(cm05.circuit, 'c-prises');
  assert.equal(cm05.commutation, 'entree-module');
  assert.equal(m.composants.find((c) => c.id === cm05.module).reference, 'MC-02');

  const parRef = new Map(m.cheminements.map((c) => [c.id, c.reference]));
  const ordres = conducteursDuCircuit(g, m, 'c-prises').filter((c) => c.libelle.includes('CM-05'));
  assert.equal(m.composants.find((c) => c.id === cm05.module).entree, 'phase');
  assert.deepEqual(ordres.map((c) => c.role), ['ordre']);
  for (const o of ordres) {
    assert.deepEqual(o.cheminements.map((id) => parRef.get(id)).sort(), [
      'CH-07', 'CH-08', 'CH-A1', 'GL-02', 'GL-03',
    ]);
  }
  // La phase monte au bouton par le plus court — GL-02, GL-03, CH-A1 —, et
  // aucun neutre ne l'accompagne : le bouton n'en a pas l'usage.
  const idA1 = m.cheminements.find((c) => c.reference === 'CH-A1').id;
  const role = (r) => conducteursDuCircuit(g, m, 'c-prises').find((c) => c.role === r);
  assert.equal(role('phase').cheminements.includes(idA1), true, 'la phase va au bouton');
  assert.equal(role('neutre').cheminements.includes(idA1), false, 'le neutre n’y va pas');
});

test('le boîtier double porte deux circuits, et les deux boutons y sont déclarés comme tels', () => {
  const m = modeleDe();
  const double = m.composants.filter((c) => c.boitier === 'bt-double');
  assert.deepEqual(double.map((c) => c.reference).sort(), ['CM-04', 'CM-05']);
  assert.deepEqual(new Set(double.map((c) => c.circuit)), new Set(['c-eclairage', 'c-prises']));
  // C'est la première fois qu'un boîtier d'appareillage est dans ce cas : l'étape
  // qui le pose doit le dire, et la levée de consignation aussi.
  const etape = m.etapes.find((e) => e.composants.includes('au-cm-04'));
  assert.match(etape.instruction, /DEUX CIRCUITS/);
  assert.match(etape.instruction, /CONSIGNER L'ÉCLAIRAGE N'Y COUPE PAS L'AUTRE BOUTON/);
  assert.match(m.etapes.find((e) => e.id === 'au-levee').instruction, /BOÎTIER DOUBLE PORTE DEUX CIRCUITS/);
});

test('la commande à distance de la porte est essayée, et la levée en porte la réserve', () => {
  // Décision du maître d'ouvrage du 2026-09-23 : la porte se commande depuis
  // Internet. L'essai réseau cesse de vérifier qu'aucun moyen réseau ne la
  // commande ; il vérifie qu'elle se commande, que son état remonte, et que les
  // commandes manuelles survivent au réseau comme à Internet.
  const etapes = AUTOMATISATION().etapes;
  const reseau = etapes.find((e) => e.id === 'au-essai-reseau').instruction;
  assert.match(reseau, /PORTE ET ABORDS EN VUE/);
  assert.match(reseau, /L'ÉTAT DE LA PORTE REMONTE JUSTE/);
  assert.match(reseau, /COUPER INTERNET/);
  assert.doesNotMatch(reseau, /AUCUN MOYEN RÉSEAU NE COMMANDE LA PORTE/);
  const levee = etapes.find((e) => e.id === 'au-levee').instruction;
  assert.match(levee, /LA PORTE PEUT SE METTRE EN MOUVEMENT SANS PERSONNE SUR PLACE/);
  assert.match(levee, /déposer PC-05/);
});

test('la machine à états est écrite, avec la transition qui porte tout le sens', () => {
  // Aucune règle du socle ne vérifie une minuterie. Ce qui se vérifie ici, c'est
  // que le comportement est ÉCRIT là où l'installateur le lira — une logique qui
  // ne vit que dans la configuration d'un module est perdue au premier
  // remplacement.
  const reglages = AUTOMATISATION().etapes.find((e) => e.id === 'au-reglages');
  assert.ok(reglages, 'une étape de réglage porte la machine à états');
  for (const etat of ['ÉTEINT', 'ALLUMÉ PAR MINUTERIE', 'ALLUMÉ À LA MAIN', 'INDISPONIBLE']) {
    assert.ok(reglages.instruction.includes(etat), `l'état « ${etat} » est décrit`);
  }
  assert.match(reglages.instruction, /UNE OUVERTURE DE PORTE N'ARME AUCUN DÉCOMPTE/);
  assert.match(reglages.instruction, /jamais un allumage inopiné/);
  assert.match(reglages.instruction, /VALEUR CONSIGNÉE/, 'le délai renvoie à la note, il ne s’y invente pas');
});

test('une commande sur module nomme un module qui existe, du même circuit', () => {
  // Contrôlé sur le modèle FUSIONNÉ : CM-01 est déclarée par l'éclairage, son
  // module par l'automatisation.
  const verifier = (modifier) => {
    const a = apports();
    modifier(a);
    const m = fusionner(SOCLE(), a);
    return validerTout(m, composerSequence(m), a).map((d) => d.message);
  };
  const cm01 = (a) => a[1].composants.find((c) => c.id === 'ec-cm-01');

  assert.ok(verifier((a) => (cm01(a).module = 'au-mc-99')).some((x) => /qui n'existe pas/.test(x)));
  assert.ok(
    verifier((a) => (cm01(a).module = 'ec-bd-08')).some((x) => /n'est pas un module de commande/.test(x)),
  );
  assert.ok(verifier((a) => (cm01(a).module = 'au-mc-02')).some((x) => /pas du même circuit/.test(x)));
  // Et l'apport lu sans celui qui déclare le module retombe sur le majorant.
  const sans = fusionner(SOCLE(), [PRISES(), ECLAIRAGE(), BORNE()]);
  assert.equal(conducteursDuCircuit(construireGraphe(sans), sans, 'c-eclairage'), null);
});

test('sans commande sur module, la dérivation rend les décomptes d’avant', () => {
  // Contrat de non-régression de l'extension du socle : CM-01 ramenée à son
  // retour commandé, GL-03 à son seul circuit, et l'automatisation retirée, les
  // décomptes sont ceux que `003` avait arrêtés — huit sur CH-05, six ailleurs.
  const eclairage = ECLAIRAGE();
  const cm01 = eclairage.composants.find((c) => c.id === 'ec-cm-01');
  cm01.commutation = 'retour-commande';
  delete cm01.module;
  const auto = AUTOMATISATION();
  auto.cheminements.find((c) => c.reference === 'GL-03').circuits = ['c-eclairage'];
  const prises = PRISES();
  prises.circuits[0].conducteurs = 3;
  const m = fusionner(SOCLE(), [prises, eclairage, BORNE(), auto]);
  const occ = occupationParCheminement(m);
  const total = (ref) => occ.get(m.cheminements.find((c) => c.reference === ref).id).total;
  assert.equal(total('CH-05'), 8);
  assert.equal(total('CH-07'), 6, 'CH-07');
  assert.equal(total('GL-03'), 5);
});
