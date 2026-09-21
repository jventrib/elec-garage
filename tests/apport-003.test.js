/**
 * L'apport réel de l'éclairage, lu **avec celui des prises**.
 *
 * Cet apport ne déclare pas le tableau : il s'y raccorde par la position (R10).
 * Il n'est donc pas validable seul — chargé sans les prises, aucun composant de
 * type `tableau` n'existe et la continuité des circuits devient invérifiable. Ce
 * n'est pas un défaut de conception mais une dépendance, et tous les contrôles ci-
 * dessous fusionnent les deux apports.
 *
 * Les assertions portent sur des **propriétés**, pas sur des coordonnées. Recopier
 * le jeu de données dans les attentes fabrique une suite qui échoue à chaque
 * décision de conception sans rien avoir détecté — ce qui s'est produit trois fois
 * sur ce projet.
 */

import test from 'node:test';
import assert from 'node:assert/strict';
import { SOCLE, PRISES, ECLAIRAGE, AUTOMATISATION, chuteAmont } from './_aides.js';
import { fusionner, sortieDeTraversee, entreeDeTraversee } from '../src/donnees/chargement.js';
import { composerSequence } from '../src/sequence/ordonnancement.js';
import { validerTout } from '../src/donnees/validation.js';
import { construireGraphe, atteignablesDepuisTableau, longueursDepuisTableau } from '../src/geometrie/graphe.js';
import { cheminDePhase, occupationParCheminement } from '../src/geometrie/conducteurs.js';
import { controlerCollisions, VERDICTS } from '../src/geometrie/collision.js';
import { memePoint, pointSurProfile } from '../src/geometrie/cheminement.js';

const CIRCUIT = 'c-eclairage';
const apports = () => [PRISES(), ECLAIRAGE(), AUTOMATISATION()];
const modeleDe = () => fusionner(SOCLE(), apports());

test("l'éclairage et les prises, ensemble, ne présentent aucun défaut", () => {
  const a = apports();
  const m = fusionner(SOCLE(), a);
  const defauts = validerTout(m, composerSequence(m), a);
  assert.deepEqual(defauts, [], defauts.map((d) => `${d.regle} ${d.cible} : ${d.message}`).join('\n'));
});

test('les deux circuits ne se disputent aucune jonction', () => {
  // La faute la plus probable d'une installation apparente à plusieurs circuits
  // sur la même paroi. Deux tracés candidats ont été refusés par cette règle avant
  // de trouver leur forme : la montée de l'éclairage traversait le nœud haut du
  // tronc des prises, et un décrochement de descente se posait sur une antenne.
  const m = modeleDe();
  const graphe = construireGraphe(m);
  // Un nœud posé sur un profilé à raccordement latéral n'appelle aucune boîte :
  // sous un capot démontable, rien n'est inaccessible. C'est la même correction
  // que celle apportée à V17.
  const profiles = (m.cheminements ?? []).filter((c) => c.raccordement === 'lateral');
  const surUnProfile = (p) =>
    profiles.some((ch) =>
      (ch.segments ?? []).some((seg) =>
        ['x', 'y', 'z'].every(
          (a) => p[a] >= Math.min(seg.de[a], seg.a[a]) - 1e-6 && p[a] <= Math.max(seg.de[a], seg.a[a]) + 1e-6,
        ),
      ),
    );
  const fautives = graphe
    .noeudsDeDegreAuMoins(3)
    .filter((n) => n.boites.length === 0 && n.composants.length === 0 && !surUnProfile(n.point));
  assert.deepEqual(
    fautives.map((n) => n.cle),
    [],
    'une jonction de trois conduits ou plus ne porte pas de boîte',
  );
});

test('tous les points de l’éclairage sont atteignables depuis le tableau', () => {
  const m = modeleDe();
  const acces = atteignablesDepuisTableau(construireGraphe(m), m, CIRCUIT);
  assert.equal(acces.sansTableau, false, 'le tableau des prises doit être présent');
  assert.deepEqual(acces.orphelins, [], 'aucun point ne doit être coupé du tableau');
  const duCircuit = m.composants.filter((c) => c.circuit === CIRCUIT);
  assert.ok(duCircuit.length > 0);
  for (const c of duCircuit) {
    assert.ok(acces.atteignables.has(c.id), `${c.reference} n'est pas atteignable`);
  }
});

test('tout appareil hors conduit est rattaché par le boîtier qu’il déclare', () => {
  // Réécrit le 2026-09-21, pour la seconde fois. La formulation d'origine
  // exigeait que « les deux commandes » partagent un boîtier ; elle est devenue
  // fausse quand CM-03 est passée à l'extérieur, et il n'en reste qu'une à
  // l'intérieur. Compter les commandes était la mauvaise idée : ce n'est pas leur
  // nombre qui est un invariant, c'est le mécanisme.
  //
  // L'invariant est celui-ci : un appareil qui n'est l'extrémité d'AUCUN conduit
  // doit être rattaché par un membre du boîtier qu'il déclare, et ce membre doit
  // lui-même être desservi. Aucun appareil ne doit rester orphelin par une autre
  // voie — la proximité, par exemple, qui ne prouve rien.
  const m = modeleDe();
  const graphe = construireGraphe(m);
  const surConduit = (c) => (graphe.noeudAu(c.position)?.aretes ?? []).length > 0;

  const horsConduit = m.composants.filter((c) => c.circuit === CIRCUIT && !surConduit(c));
  assert.ok(horsConduit.length > 0, 'le cas doit exister dans les données, sinon ce test ne prouve rien');

  for (const c of horsConduit) {
    assert.ok(c.boitier, `${c.reference} n'est sur aucun conduit : il DOIT déclarer son boîtier`);
    const ancre = m.composants.find((x) => x.boitier === c.boitier && surConduit(x));
    assert.ok(ancre, `le boîtier « ${c.boitier} » doit avoir un membre desservi par un conduit`);
    assert.equal(
      ancre.type,
      'boite-derivation',
      `et ce membre est une boîte de dérivation, non un appareil — ${ancre.reference}`,
    );
  }

  const acces = atteignablesDepuisTableau(graphe, m, CIRCUIT);
  for (const c of horsConduit) assert.ok(acces.atteignables.has(c.id), `${c.reference} doit être atteignable`);
  assert.deepEqual(acces.orphelins, []);
});

test('la commande extérieure est desservie par une traversée, sans conduit propre', () => {
  // Décision du 2026-09-21 : CM-03 passe à l'extérieur. Elle sort du fond de la
  // boîte qui porte déjà le boîtier intérieur, donc aucun conduit n'est posé pour
  // elle. Ce que ce test empêche est d'y revenir en tirant discrètement un tube.
  //
  // Le détecteur CM-02 est lui aussi dehors, mais il EST l'extrémité d'un conduit —
  // la liaison de 0,30 m qui le relie au point de façade. Le cas visé ici est celui
  // d'une commande extérieure que rien ne dessert sinon la paroi elle-même.
  const m = modeleDe();
  const graphe = construireGraphe(m);
  const surConduit = (c) => (graphe.noeudAu(c.position)?.aretes ?? []).some((a) => !a.traversee);
  const dehors = m.composants.filter(
    (c) => c.circuit === CIRCUIT && c.type === 'commande' && c.face === 'exterieur' && !surConduit(c),
  );
  assert.ok(dehors.length > 0, 'au moins une commande extérieure doit être desservie sans conduit');

  for (const c of dehors) {
    const t = m.traversees.find(
      (t) =>
        Math.abs(t.position.y - c.position.y) < 1e-6 &&
        Math.abs(t.position.z - c.position.z) < 1e-6 &&
        t.paroi === c.paroi,
    );
    assert.ok(t, `${c.reference} doit être desservie par une traversée à sa propre cote`);
    assert.equal(t.penteVersExterieur, true, `« ${t.reference} » doit pencher vers l'extérieur`);
    const boite = m.composants.find(
      (b) => b.type === 'boite-derivation' && memePoint(b.position, t.position, 1e-6),
    );
    assert.ok(boite, `« ${t.reference} » doit sortir du fond d'une boîte, et non d'un point de paroi nu`);
  }
});
test('les deux sorties du plafonnier sont symétriques et à même profondeur', () => {
  // SC-016 et FR-002. Formulé sur la symétrie, non sur les abscisses : déplacer la
  // paire ne doit pas faire échouer ce test, la désaligner doit le faire échouer.
  const m = modeleDe();
  const plafond = m.composants.filter(
    (c) => c.circuit === CIRCUIT && c.type === 'luminaire' && c.paroi === 'plafond',
  );
  assert.equal(plafond.length, 2, 'le plafonnier a exactement deux sorties');
  const [a, b] = plafond;
  assert.ok(Math.abs(a.position.y - b.position.y) < 1e-9, 'même profondeur : un axe est-ouest');
  const median = m.local.oeuvre.x / 2;
  assert.ok(
    Math.abs(Math.abs(a.position.x - median) - Math.abs(b.position.x - median)) < 1e-9,
    'symétriques par rapport à l’axe médian nord-sud',
  );
  assert.ok(Math.abs(a.position.x - b.position.x) > 1e-6, 'et distinctes, non superposées');
});

test('les sorties de plafond dégagent le majorant du tablier ouvert', () => {
  // FR-003 et SC-002 portent sur les deux SORTIES, et la garde qu'elles doivent
  // prendre est en profondeur : au nord de la course du rail.
  //
  // Une version antérieure de ce test englobait aussi les boîtes de dérivation et
  // ne contrôlait que l'ordonnée. Elle échouait sur BL-02, qui est à y = 0,40 —
  // alors que cette boîte est à x = 5,60, donc à l'EST du majorant, qui s'arrête à
  // la largeur de la baie. Le dégagement d'un volume ne se juge pas sur un axe.
  const m = modeleDe();
  const tablier = m.local.obstacles.find((o) => o.id === 'tablier-sectionnelle-ouvert');
  const maj = tablier?.volumeMajorant;
  assert.ok(maj, 'le tablier ouvert doit porter un majorant');

  const sorties = m.composants.filter(
    (c) => c.circuit === CIRCUIT && c.type === 'luminaire' && c.paroi === 'plafond',
  );
  assert.equal(sorties.length, 2);
  for (const c of sorties) {
    assert.ok(c.position.y > maj.max.y, `${c.reference} doit être au nord de la borne du tablier`);
  }

  // Les boîtes, elles, sont dégagées sur un autre axe. La vérification générale
  // est celle du contrôle de collision : aucune collision établie, et le seul
  // non-concluant est celui du segment de façade.
  const dedans = (p) =>
    ['x', 'y', 'z'].every((k) => p[k] >= maj.min[k] - 1e-9 && p[k] <= maj.max[k] + 1e-9);
  for (const c of m.composants.filter((x) => x.circuit === CIRCUIT)) {
    assert.equal(dedans(c.position), false, `${c.reference} est dans le majorant du tablier`);
  }
});

test('la chute de tension cumulée reste sous la limite de 3 % de l’éclairage', () => {
  // Recalculée sur le tracé, non relue : c'est la cohérence entre la géométrie et
  // la note de calcul qui est testée.
  //
  // Sur la forme EXACTE depuis le 2026-09-22 : `ΔU = ρ·I·(L_phase + L_neutre)/S`.
  // La forme `2ρLI/S` suppose les deux conducteurs de même longueur, ce qui est
  // faux pour un point commuté — la phase descend d'abord à l'interrupteur, et
  // c'est le retour qui remonte. Le § 2.3 de la note avait relevé l'écart et l'
  // avait calculé à la main, faute d'une dérivation ; elle existe maintenant, et
  // c'est elle qui décide.
  const m = modeleDe();
  const graphe = construireGraphe(m);
  const circuit = m.circuits.find((c) => c.id === CIRCUIT);
  const RHO = 0.0225;
  const U = 230;
  // Hypothèse majorante : quatre sorties LED de 60 W allumées ensemble.
  const I = circuit.courantEmploi ?? (4 * 60) / U;

  // Le point dimensionnant se cherche sur la somme des deux longueurs, et non
  // plus sur la seule longueur de conduit : changer de forme peut changer de
  // point, et le supposer serait supposer la conclusion.
  const points = m.composants.filter((c) => c.circuit === CIRCUIT && c.type === 'luminaire');
  assert.ok(points.length > 0);
  const chutes = points.map((c) => {
    const phase = cheminDePhase(graphe, m, CIRCUIT, c.id);
    assert.ok(phase, `le chemin de phase de ${c.reference} doit être dérivable`);
    return {
      reference: c.reference,
      chute: (100 * RHO * I * (phase.longueur + phase.neutre)) / (circuit.section * U),
    };
  });
  const pire = chutes.reduce((a, b) => (a.chute >= b.chute ? a : b));
  assert.ok(pire.chute < 3, `chute terminale de ${pire.chute.toFixed(3)} % sur ${pire.reference}`);

  // La forme exacte n'est jamais moins sévère que `2ρLI/S` sur la seule longueur
  // de conduit. Elle l'est STRICTEMENT tant que la phase fait un détour par la
  // commande ; depuis que CM-01 adresse un ordre à MC-01, posé dans la goulotte
  // sur le chemin du plafonnier, il n'y a plus de détour et les deux formes se
  // rejoignent. Si l'exacte passait dessous, c'est qu'un bout de phase aurait été
  // perdu en chemin.
  const parConduit = longueursDepuisTableau(graphe, m, CIRCUIT).plusLong;
  assert.ok(parConduit);
  const ancienne = (100 * 2 * RHO * parConduit.longueur * I) / (circuit.section * U);
  assert.ok(pire.chute >= ancienne - 1e-9, 'la phase ne peut pas être plus courte que le conduit');

  // Comparaison à la VALEUR, non à un encadrement : voir le commentaire du test
  // homologue de `apport-002.test.js`. Une valeur périmée de 1,76 %, d'avant le
  // décalage de l'axe vers le nord, a survécu à l'encadrement.
  const cumul = chuteAmont() + pire.chute;
  assert.equal(
    Math.round(cumul * 100) / 100,
    circuit.chuteTensionCumulee,
    `le cumul déclaré (${circuit.chuteTensionCumulee} %) doit valoir amont + terminale = ${cumul.toFixed(4)} %`,
  );
  assert.ok(circuit.chuteTensionCumulee < 3, 'le cumul déclaré doit rester sous 3 %');
});

test('les conduits partagés portent les deux circuits, et eux seuls', () => {
  // La mutualisation décidée le 2026-09-21. La formulation antérieure exigeait
  // qu'aucun cheminement ne porte deux circuits — elle est devenue fausse par
  // construction, et c'était le but.
  //
  // Ce qui doit rester vrai est plus précis : un conduit porte soit un circuit,
  // soit exactement les deux du projet, et jamais autre chose. Et tout conduit
  // partagé rend le facteur de correction de groupement EXIGIBLE, ce que la
  // constitution impose au Principe III.
  const m = modeleDe();
  const partages = m.cheminements.filter((c) => (c.circuits ?? []).length > 1);
  assert.ok(partages.length > 0, 'la mutualisation doit exister dans les données');

  const attendus = new Set(['c-prises', 'c-eclairage']);
  for (const ch of m.cheminements) {
    const n = (ch.circuits ?? []).length;
    assert.ok(n >= 1, `${ch.reference} ne porte aucun circuit`);
    // Un CONDUIT ne porte que les deux circuits d'usage courant. Un PROFILÉ à
    // raccordement latéral peut en porter trois : depuis l'amendement v1.14.0, la
    // dédicace de la borne ne s'étend plus au contenant, et son câble y cohabite.
    const plafond = ch.raccordement === 'lateral' ? attendus.size + 1 : attendus.size;
    assert.ok(n <= plafond, `${ch.reference} porte ${n} circuits, plus que ce contenant n'en admet`);
    const admis = ch.raccordement === 'lateral' ? new Set([...attendus, 'c-borne']) : attendus;
    for (const c of ch.circuits) assert.ok(admis.has(c), `${ch.reference} porte un circuit inconnu : ${c}`);
  }

  // Réécrit le 2026-09-22. La formulation d'origine exigeait qu'un conduit partagé
  // soit PLUS GROS qu'un conduit dédié — « la contrepartie du partage ». Le maître
  // d'ouvrage a ramené le tronc à l'IRL 20, même calibre que les branches des
  // prises, et cette formulation est devenue fausse par décision. Elle l'était déjà
  // devenue à l'échelle du projet quand la ligne de la borne a été arrêtée à
  // l'IRL 25 : trois gros conducteurs dans un tube dédié atteignaient le calibre du
  // tronc sans rien partager. Un invariant que deux décisions successives démentent
  // n'était pas le bon invariant.
  //
  // Ce qui reste vrai, et qui est désormais la seule contrepartie du partage
  // lisible dans les données :
  //   a) un conduit partagé n'est jamais PLUS PETIT qu'un conduit dédié aux mêmes
  //      circuits — le partage ne fait pas descendre de calibre ;
  //   b) à calibre égal, il porte STRICTEMENT PLUS de conducteurs, donc la condition
  //      de remplissage y est strictement plus sévère. C'est là que le calibre se
  //      joue, et nulle part ailleurs.
  // La comparaison de calibres n'a de sens qu'entre CONDUITS : un profilé n'a pas
  // de diamètre, et sa condition de remplissage se lit sur la fiche produit.
  const conduit = (c) => c.raccordement !== 'lateral' && c.section.forme === 'circulaire';
  const dedies = m.cheminements.filter((c) => conduit(c) && c.circuits.length === 1 && c.section.diametre !== null);
  const plusPetitPartage = Math.min(...partages.filter(conduit).map((c) => c.section.diametre));
  const plusGrosDedie = Math.max(...dedies.map((c) => c.section.diametre));
  assert.ok(
    plusPetitPartage >= plusGrosDedie,
    `le plus petit conduit partagé (${plusPetitPartage}) ne doit pas être inférieur au plus gros conduit dédié (${plusGrosDedie})`,
  );

  const occupation = occupationParCheminement(m);
  const fils = (ch) => occupation.get(ch.id).total;
  for (const ch of partages) {
    const memeCalibre = dedies.filter((d) => Math.abs(d.section.diametre - ch.section.diametre) < 1e-9);
    for (const d of memeCalibre) {
      assert.ok(
        fils(ch) > fils(d),
        `« ${ch.reference} » (${fils(ch)} fils) partage le calibre de « ${d.reference} » (${fils(d)} fils) sans porter davantage : le partage ne se lit plus nulle part`,
      );
    }
  }

  // Et le cas le plus chargé du tronc est bien celui qui décide du calibre.
  // C'était CH-05 à huit ; depuis que CM-01 adresse un ordre à MC-01, dans la
  // goulotte, c'était CH-02 à onze, puis à dix. CH-02 a disparu dans la goulotte
  // GL-02 : c'est de nouveau CH-05, à neuf, avec la paire d'ordre de CM-01. D'où
  // son IRL 25, décidé le 2026-09-23. Les profilés sont hors de cette comparaison :
  // leur remplissage se lit sur la fiche produit.
  const pire = partages.filter(conduit).reduce((a, b) => (fils(a) >= fils(b) ? a : b));
  assert.equal(pire.reference, 'CH-05', 'CH-05 porte la descente du tronc et la paire de CM-01');
  assert.equal(fils(pire), 9);
  assert.equal(pire.section.diametre, 0.025, 'et il est en IRL 25');
});
test('aucune valeur non établie n’est rendue autrement que par null', () => {
  const apport = ECLAIRAGE();
  const circuit = apport.circuits.find((c) => c.id === CIRCUIT);
  for (const champ of ['typeDifferentiel', 'calibreProtection', 'courantEmploi']) {
    assert.equal(circuit[champ], null, `${champ} doit rester null tant qu'il n'est pas établi`);
  }
  assert.equal(circuit.section, 1.5);
  assert.equal(circuit.sensibiliteDifferentielle, 30);
  assert.ok(typeof circuit.chuteTensionCumulee === 'number');
  for (const c of apport.composants) {
    assert.ok('indiceProtection' in c, `${c.reference} doit déclarer indiceProtection, même à null`);
  }
  assert.equal(apport.provenance.schemaUnifilaire, null);
  assert.equal(apport.provenance.noteDeCalcul, null);
});

test('le tracé ne heurte aucun obstacle dont le volume est relevé', () => {
  const m = modeleDe();
  const r = controlerCollisions(m);
  const siens = r.resultats.filter((x) => x.cheminement.startsWith('ec-'));
  assert.ok(siens.length > 0);
  assert.equal(
    siens.filter((x) => x.verdict === VERDICTS.COLLISION).length,
    0,
    'une collision réelle a été trouvée sur le tracé de l’éclairage',
  );
});

test('tout contrôle encore sans conclusion porte sur un obstacle sans aucun volume', () => {
  // Réécrit le 2026-09-22, après le relevé de la sous-face du tablier ouvert.
  //
  // Le segment qui longe la paroi sud pour rejoindre le point de façade entrait
  // dans le majorant du tablier, lequel descendait jusqu'à la hauteur de passage
  // de 2,10 m faute de mieux. Mesurée à 2,31 m, la sous-face resserre le majorant
  // de 0,21 m et le conduit, qui court à 2,22 m, en sort : il est **prouvé
  // dégagé**. C'était la cote la plus rentable du dossier, et elle a tenu sa
  // promesse.
  //
  // L'invariant testé n'est pas « zéro non concluant » — ce serait faux, quatre
  // obstacles n'ont toujours aucun volume. C'est plus fort et plus durable : il ne
  // reste AUCUN non concluant imputable à un obstacle dont le volume est connu, ne
  // serait-ce que borné. Autrement dit, tout ce que le relevé permet de conclure
  // est conclu.
  //
  // Une exception, et une seule, depuis le relevé du 2026-09-23 : la saillie du
  // tablier FERMÉ est relevée, pas son haut, borné par la sous-face du tablier
  // remonté à 2,31 m. Le segment de CH-L1 qui longe la paroi sud à 2,22 m, 12 cm
  // au-dessus de la baie, recoupe ce majorant. Si le tablier fermé déborde le
  // linteau, il touche le conduit : le doute est réel, et une seule cote le lève.
  const m = modeleDe();
  const r = controlerCollisions(m);
  const parId = new Map(m.local.obstacles.map((o) => [o.id, o]));
  const reperes = new Map(m.cheminements.map((c) => [c.id, c.reference]));
  const siens = r.resultats.filter((x) => x.cheminement.startsWith('ec-'));
  assert.ok(siens.length > 0);
  const exception = (x) =>
    x.obstacle === 'tablier-sectionnelle-ferme' && reperes.get(x.cheminement) === 'CH-L1' && x.segment === 4;
  assert.equal(siens.filter(exception).length, 1, 'le segment de façade de CH-L1 est contrôlé');

  for (const x of siens) {
    const o = parId.get(x.obstacle);
    if (exception(x)) {
      assert.equal(x.verdict, VERDICTS.NON_CONCLUANT, 'le haut du tablier fermé n’est pas relevé');
      continue;
    }
    // Un obstacle borné ne peut jamais affirmer de collision.
    if (o.volumeMajorant) assert.notEqual(x.verdict, VERDICTS.COLLISION, `${o.id}`);
    // Un obstacle sans volume ni borne ne conclut jamais.
    if (!o.volume && !o.volumeMajorant) assert.equal(x.verdict, VERDICTS.NON_CONCLUANT, `${o.id}`);
    // Et la réciproque, qui est ce que le relevé vient d'acheter : un obstacle
    // dont le volume est connu, relevé ou borné, conclut toujours.
    if (o.volume || o.volumeMajorant) {
      assert.equal(x.verdict, VERDICTS.CONFORME, `« ${o.id} » doit conclure : son volume est connu`);
    }
  }

  const sansConclusion = new Set(
    siens.filter((x) => x.verdict === VERDICTS.NON_CONCLUANT).map((x) => x.obstacle),
  );
  const sansVolume = m.local.obstacles.filter((o) => !o.volume && !o.volumeMajorant).map((o) => o.id);
  assert.deepEqual(
    [...sansConclusion].sort(),
    [...sansVolume, 'tablier-sectionnelle-ferme'].sort(),
    'les obstacles sans aucun volume, et le haut du tablier fermé',
  );
});

test('les deux essais de nuit figurent dans la séquence, après la levée', () => {
  const m = modeleDe();
  const s = composerSequence(m);
  const rang = s.etapes.findIndex((e) => e.nature === 'levee-consignation');
  assert.ok(rang >= 0);
  for (const e of s.etapes.slice(0, rang)) {
    assert.equal(e.sousTension, false, `${e.id} est sous tension avant la levée`);
  }
  // Les deux essais propres à l'éclairage : concordance des commandes, et réglage
  // du détecteur. Ils ne se substituent à aucune vérification du Principe V.
  const propres = s.etapes.filter((e) => e.id.startsWith('ec-') && e.verification === 'autre');
  assert.equal(propres.length, 2, 'deux essais propres à l’éclairage');
  for (const e of propres) {
    assert.ok(s.etapes.indexOf(e) > rang, `${e.id} doit venir après la levée`);
    assert.equal(e.sousTension, true);
  }
});

test('EL-03 réutilise le tube vertical et la boîte du socle voisin de la porte de service', () => {
  // Décision du 2026-09-21. EL-03 avait sa propre remontée : 0,30 m le long de la
  // paroi est puis 1,10 m de montée, en IRL 16, pour aboutir à une traversée en
  // pleine paroi. Deux tubes parallèles à 0,30 m l'un de l'autre, dont l'un était
  // déjà posé et partagé.
  //
  // Les trois propriétés testées ici sont celles qui rendent cette réutilisation
  // vérifiable — et non la position de EL-03, qui est une décision et non un
  // invariant :
  //   a) la traversée sort du FOND d'une enveloppe existante et partagée — une
  //      boîte de dérivation, ou depuis le retrait de BD-01 la goulotte GL-02 ;
  //   b) EL-03 est à l'aplomb d'un socle intérieur, donc sur un axe déjà percé
  //      et déjà occupé par un tube ;
  //   c) l'éclairage ne possède plus aucun segment VERTICAL sur la paroi est.
  //
  // La propriété (c) est celle qui échouait avant la décision, et c'est la plus
  // utile : elle interdit de recréer une descente dédiée là où le tronc partagé
  // en porte déjà une, sans rien dire de la cote retenue.
  const m = modeleDe();
  const el3 = m.composants.find((c) => c.reference === 'EL-03');
  assert.ok(el3, 'EL-03 doit exister');
  assert.equal(el3.face, 'exterieur');

  // La traversée DÉBOUCHE sur EL-03 : c'est sa sortie, et non son axe, qui est à
  // la cote du point. Depuis qu'elle part du fond de la goulotte, en pente, son
  // axe est 5,5 cm plus haut.
  const boites = m.composants.filter((c) => c.type === 'boite-derivation');
  const traversee = m.traversees.find((t) => memePoint(sortieDeTraversee(m.local, t), el3.position, 1e-6));
  assert.ok(traversee, 'EL-03 doit être desservie par une traversée qui débouche à sa propre cote');
  const tol = m.presentation.toleranceRaccordement;
  const enveloppe =
    boites.find((b) => memePoint(b.position, traversee.position, 1e-6))
    // Une traversée qui part du fond d'un profilé y débouche par son ENTRÉE : son axe,
    // plus bas, est dans l'épaisseur du mur, sous la goulotte.
    ?? m.cheminements.find((ch) => ch.raccordement === 'lateral' && pointSurProfile(entreeDeTraversee(m.local, traversee), ch, tol));
  assert.ok(
    enveloppe,
    `« ${traversee.reference} » doit sortir du fond d'une enveloppe existante, et non d'un point de paroi nu`,
  );

  const socleAplomb = m.composants.find(
    (c) =>
      c.type?.startsWith('socle') &&
      c.face === 'interieur' &&
      Math.abs(c.position.y - el3.position.y) < 1e-6,
  );
  assert.ok(socleAplomb, "EL-03 doit être à l'aplomb d'un socle intérieur, dont il réutilise le tube");

  const verticauxEst = m.cheminements
    .filter((ch) => (ch.circuits ?? []).length === 1 && ch.circuits[0] === CIRCUIT)
    .flatMap((ch) => (ch.segments ?? []).map((s, i) => ({ ch, s, i })))
    .filter(({ s }) => s.face === 'est' && Math.abs(s.a.z - s.de.z) > 1e-6);
  assert.deepEqual(
    verticauxEst.map(({ ch, i }) => `${ch.reference}#${i + 1}`),
    [],
    "l'éclairage ne doit posséder aucune verticale propre sur la paroi est : elles sont celles du tronc partagé",
  );

  // Et le tube réutilisé porte bien les deux circuits : réutiliser un tube dédié
  // aux prises serait une faute, pas une mutualisation.
  const tubeReutilise = m.cheminements.find(
    (ch) =>
      (ch.segments ?? []).some(
        (s) =>
          s.face === 'est' &&
          Math.abs(s.de.y - el3.position.y) < 1e-6 &&
          Math.abs(s.a.y - el3.position.y) < 1e-6 &&
          Math.abs(s.a.z - s.de.z) > 1e-6,
      ),
  );
  assert.ok(tubeReutilise, "un tube vertical doit exister à l'aplomb de EL-03");
  assert.ok(
    (tubeReutilise.circuits ?? []).includes(CIRCUIT),
    `« ${tubeReutilise.reference} » doit porter l'éclairage pour que EL-03 puisse l'emprunter`,
  );
});
