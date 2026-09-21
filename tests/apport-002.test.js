import { calibreDe } from '../src/geometrie/section.js';
/**
 * L'apport réel des prises de courant, et non le jeu de démonstration.
 *
 * Ces assertions portent sur des **propriétés**, pas sur des coordonnées. Onze
 * tests de la suite ont déjà cassé le jour où les socles sont passés à 0,30 m, et
 * cinq de plus à la correction des cotes du garage : recopier le jeu de données
 * dans les attentes fabrique une suite qui échoue à chaque décision de conception,
 * sans rien avoir détecté. Ce qui doit rester vrai ici est la continuité du
 * circuit, l'accessibilité des connexions, l'honnêteté des valeurs non établies —
 * pas le fait qu'un socle soit à y = 3,00.
 */

import test from 'node:test';
import assert from 'node:assert/strict';
import {
  SOCLE, PRISES, DEMO, chuteAmont, BORNE, ECLAIRAGE,
  PRISES_AVANT_GOULOTTE, ECLAIRAGE_AVANT_GOULOTTE, BORNE_AVANT_GOULOTTE,
} from './_aides.js';
import { fusionner } from '../src/donnees/chargement.js';
import { composerSequence } from '../src/sequence/ordonnancement.js';
import { validerTout } from '../src/donnees/validation.js';
import { construireGraphe, atteignablesDepuisTableau, longueursDepuisTableau } from '../src/geometrie/graphe.js';
import { controlerCollisions, VERDICTS } from '../src/geometrie/collision.js';

const CIRCUIT = 'c-prises';
const modeleDe = () => fusionner(SOCLE(), [PRISES()]);

test("l'apport des prises ne présente aucun défaut sur les dix-neuf règles", () => {
  const apport = PRISES();
  const m = fusionner(SOCLE(), [apport]);
  const defauts = validerTout(m, composerSequence(m), [apport]);
  assert.deepEqual(defauts, [], defauts.map((d) => `${d.regle} ${d.cible} : ${d.message}`).join('\n'));
});

test("les identifiants de l'apport ne heurtent pas ceux d'un autre apport", () => {
  // Les identifiants vivent dans un espace PLAT, partagé par tous les apports : la
  // règle V11 rejette tout doublon, et c'est elle qui a refusé « pc-01 », déjà pris
  // par le jeu de démonstration. D'où le préfixe « pr- ». Le champ reference porte
  // le repère lisible, PC-01, et peut donc être commun.
  //
  // Ce test ne prétend PAS que les deux apports soient chargeables ensemble : ils
  // décrivent le même circuit à des cotes voisines, et leurs conduits se
  // croiseraient. Il garantit seulement que la nomenclature ne fait pas obstacle à
  // la composition, ce qui est la part qui relève de cet apport.
  const m = fusionner(SOCLE(), [PRISES(), DEMO()]);
  const ids = m.composants.map((c) => c.id);
  assert.equal(new Set(ids).size, ids.length, 'un identifiant de composant est en double');
  const idc = m.cheminements.map((c) => c.id);
  assert.equal(new Set(idc).size, idc.length, 'un identifiant de cheminement est en double');
});

test('tous les points du circuit sont atteignables depuis le tableau par le tracé réel', () => {
  const m = modeleDe();
  const acces = atteignablesDepuisTableau(construireGraphe(m), m, CIRCUIT);
  assert.equal(acces.sansTableau, false, 'le circuit doit partir d’un tableau déclaré');
  assert.deepEqual(acces.orphelins, [], 'aucun point ne doit être coupé du tableau');

  // La propriété, et non le compte : tout composant du circuit est desservi.
  const duCircuit = m.composants.filter((c) => c.circuit === CIRCUIT);
  assert.ok(duCircuit.length > 0, 'le circuit doit porter des composants');
  for (const c of duCircuit) {
    assert.ok(acces.atteignables.has(c.id), `${c.reference} n'est pas atteignable depuis le tableau`);
  }
});

test('toute jonction de trois conduits ou plus porte une boîte de dérivation', () => {
  // C'est la règle V17. Elle est déjà vérifiée par validerTout, mais l'assertion
  // est reprise ici parce qu'elle protège contre une faute invisible à l'écran :
  // une connexion hors boîte est inaccessible, donc invérifiable à vie.
  const m = modeleDe();
  const graphe = construireGraphe(m);
  // Toute JONCTION y répond — boîte de dérivation comme organe de connexion —,
  // et un nœud posé sur un profilé à raccordement latéral n'en demande aucune :
  // sous un capot démontable, rien n'est inaccessible.
  const roles = new Map((SOCLE().types.types ?? []).map((t) => [t.id, t.role]));
  const boites = m.composants.filter((c) => roles.get(c.type) === 'jonction');
  const profiles = (m.cheminements ?? []).filter((c) => c.raccordement === 'lateral');
  const surUnProfile = (point) =>
    profiles.some((ch) =>
      (ch.segments ?? []).some((seg) =>
        ['x', 'y', 'z'].every(
          (a) => point[a] >= Math.min(seg.de[a], seg.a[a]) - 1e-6 && point[a] <= Math.max(seg.de[a], seg.a[a]) + 1e-6,
        ),
      ),
    );
  const estUneBoite = (point) =>
    boites.some(
      (b) =>
        Math.abs(b.position.x - point.x) < 1e-6 &&
        Math.abs(b.position.y - point.y) < 1e-6 &&
        Math.abs(b.position.z - point.z) < 1e-6,
    );

  let jonctions = 0;
  for (const n of graphe.noeuds) {
    if (n.aretes.length < 3) continue;
    jonctions += 1;
    assert.ok(
      estUneBoite(n.point) || surUnProfile(n.point),
      `jonction de ${n.aretes.length} conduits sans jonction ni profilé en ${JSON.stringify(n.point)}`,
    );
  }
  assert.ok(jonctions > 0, 'le tracé doit comporter au moins une vraie jonction, sinon la règle n’est pas exercée');
});

test('la chute de tension au point le plus éloigné reste sous la limite de 5 %', () => {
  // Le socle fournit une longueur ; la chute s'en déduit par ΔU = 2ρLI/S. On
  // recalcule ici au lieu de relire la valeur déclarée : c'est la cohérence entre
  // le tracé et la note de calcul qui est testée, pas la valeur elle-même.
  const m = modeleDe();
  const longueurs = longueursDepuisTableau(construireGraphe(m), m, CIRCUIT);
  assert.ok(longueurs.plusLong, 'un point le plus éloigné doit être identifié');

  const circuit = m.circuits.find((c) => c.id === CIRCUIT);
  const RHO = 0.0225;
  const U = 230;
  const I = circuit.courantEmploi ?? 20; // hypothèse majorante tant que IB n'est pas arrêté
  const terminale = (100 * 2 * RHO * longueurs.plusLong.longueur * I) / (circuit.section * U);

  assert.ok(terminale < 5, `chute terminale de ${terminale.toFixed(2)} %`);

  // La valeur déclarée est le CUMUL avec l'amont. Ce test ne se contentait
  // d'abord que de l'ENCADRER — supérieur à la terminale, inférieur à la limite —
  // et c'est ainsi qu'un cumul de 3,02 %, calculé avant la révision de FR-029, est
  // resté dans les données pendant que tous les documents portaient 2,96 %.
  // L'encadrement restait vrai : il n'y avait rien à détecter pour lui.
  //
  // La valeur est donc recalculée et comparée au centième, qui est la précision à
  // laquelle elle est écrite. Tout redécoupage du tracé fait maintenant échouer ce
  // test si la déclaration ne suit pas.
  const cumul = chuteAmont() + terminale;
  assert.equal(
    Math.round(cumul * 100) / 100,
    circuit.chuteTensionCumulee,
    `le cumul déclaré (${circuit.chuteTensionCumulee} %) doit valoir amont + terminale = ${cumul.toFixed(4)} %`,
  );
  assert.ok(circuit.chuteTensionCumulee < 5, 'le cumul déclaré doit rester sous 5 %');
});

test('aucune valeur non établie n’est rendue autrement que par null', () => {
  const apport = PRISES();
  const circuit = apport.circuits.find((c) => c.id === CIRCUIT);

  // Ce qui dépend d'une valeur normative ou d'une décision non prise DOIT être
  // null, et non une valeur plausible. C'est l'assertion qui protège contre un
  // chiffre rassurant sur une grandeur de sécurité.
  for (const champ of ['typeDifferentiel', 'calibreProtection', 'courantEmploi']) {
    assert.equal(circuit[champ], null, `${champ} doit rester null tant qu'il n'est pas établi`);
  }
  // Ce qui est établi ne doit PAS être null : une case vide de trop est aussi un défaut.
  assert.equal(circuit.section, 2.5);
  assert.equal(circuit.sensibiliteDifferentielle, 30);
  assert.ok(typeof circuit.chuteTensionCumulee === 'number');

  for (const c of apport.composants) {
    assert.ok('indiceProtection' in c, `${c.reference} doit déclarer indiceProtection, même à null`);
  }
  assert.equal(apport.provenance.schemaUnifilaire, null);
  assert.equal(apport.provenance.noteDeCalcul, null);
});

test('aucun obstacle non borné ne conclut favorablement sur ce tracé', () => {
  // L'invariant d'honnêteté, formulé sur la règle et non sur l'état du relevé.
  const m = modeleDe();
  const r = controlerCollisions(m);
  const parId = new Map(m.local.obstacles.map((o) => [o.id, o]));
  assert.ok(r.resultats.length > 0);

  for (const x of r.resultats) {
    const o = parId.get(x.obstacle);
    if (!o.volume && !o.volumeMajorant) {
      assert.equal(x.verdict, VERDICTS.NON_CONCLUANT, `${o.id} n'est pas relevé : il ne peut pas conclure`);
    }
    if (o.volumeMajorant) {
      assert.notEqual(x.verdict, VERDICTS.COLLISION, `${o.id} n'est que borné : il ne peut pas affirmer de collision`);
    }
  }
});

test('le tracé ne heurte aucun obstacle dont le volume est relevé', () => {
  const m = modeleDe();
  const r = controlerCollisions(m);
  assert.equal(r.collisions, 0, 'une collision réelle a été trouvée sur le tracé des prises');
});

test('les six vérifications du Principe V figurent, et aucune étape sous tension ne précède la levée', () => {
  const m = modeleDe();
  const s = composerSequence(m);
  const rang = s.etapes.findIndex((e) => e.nature === 'levee-consignation');
  assert.ok(rang >= 0, 'la séquence doit comporter une levée de consignation');
  for (const e of s.etapes.slice(0, rang)) {
    assert.equal(e.sousTension, false, `${e.id} est sous tension avant la levée`);
  }
  const exigees = m.chantier.verifications.filter((v) => v.exigee !== false && v.id !== 'autre').map((v) => v.id);
  const presentes = new Set(s.etapes.map((e) => e.verification).filter(Boolean));
  for (const v of exigees) assert.ok(presentes.has(v), `la vérification « ${v} » manque à la séquence`);
});

test('le livrable chantier inclut cet apport, contrairement à la démonstration', () => {
  // La règle du bundler : tout apport qui ne commence pas par 000- part au chantier.
  const apport = PRISES();
  assert.equal(apport.fonctionnalite.startsWith('000-'), false);
  assert.ok(/^\d{3}-/.test(apport.fonctionnalite), 'le nom doit être numéroté pour que l’ordre de fusion soit stable');
});

test('les conducteurs entrent dans les socles intérieurs par le haut', () => {
  // FR-061. Sur une paroi froide où la condensation est probable, une gaine qui
  // aborde un boîtier par le bas ou par le côté y conduit l'eau, où elle stagne.
  // Abordé par le haut, le même conduit la laisse s'écouler hors de l'appareil.
  //
  // La propriété est géométrique et se vérifie sans navigateur : tout conduit
  // aboutissant à un socle mural intérieur doit venir d'un point strictement plus
  // haut. Une entrée latérale — l'ancien tronçon de 0,30 m à hauteur de socle —
  // ferait échouer ce test, ce qui est exactement son objet.
  const m = modeleDe();
  const meme = (a, b) => ['x', 'y', 'z'].every((k) => Math.abs(a[k] - b[k]) < 1e-6);
  const cibles = m.composants.filter(
    (c) => c.type.startsWith('socle') && c.paroi !== 'plafond' && c.face === 'interieur',
  );
  assert.ok(cibles.length > 0, 'le jeu doit comporter des socles muraux intérieurs');

  for (const socle of cibles) {
    let arrivees = 0;
    for (const ch of m.cheminements) {
      for (const s of ch.segments) {
        for (const [bout, autre] of [[s.de, s.a], [s.a, s.de]]) {
          if (!meme(bout, socle.position)) continue;
          arrivees += 1;
          assert.ok(
            autre.z > bout.z + 1e-6,
            `${socle.reference} est abordé par ${ch.reference} depuis ${
              Math.abs(autre.z - bout.z) < 1e-6 ? 'le côté' : 'le bas'
            } : FR-061 exige une entrée par le haut`,
          );
        }
      }
    }
    assert.equal(arrivees, 1, `${socle.reference} doit être alimenté par exactement un conduit`);
  }
});

test('chaque socle mural est abordé depuis son propre aplomb', () => {
  // FR-062, qui est la condition pour tenir FR-061 sans créer de té sur une
  // antenne. Une descente droite vers un socle implique que le conduit qui
  // l'aborde vienne exactement de son aplomb.
  //
  // La formulation antérieure comptait les boîtes — « le circuit n'en comporte
  // qu'une » — ce que la mutualisation avec l'éclairage a rendu faux : il y en a
  // quatre, toutes partagées. Compter des objets ne dit rien de la propriété ;
  // c'est l'aplomb qui la porte.
  const m = modeleDe();
  const socles = m.composants.filter(
    (c) => c.type.startsWith('socle') && c.paroi !== 'plafond' && c.face === 'interieur',
  );
  assert.ok(socles.length > 0);
  const meme = (a, b) => Math.abs(a - b) < 1e-6;

  for (const socle of socles) {
    let abordages = 0;
    for (const ch of m.cheminements) {
      for (const s of ch.segments) {
        for (const [bout, autre] of [[s.de, s.a], [s.a, s.de]]) {
          if (!['x', 'y', 'z'].every((k) => meme(bout[k], socle.position[k]))) continue;
          abordages += 1;
          assert.ok(autre.z > bout.z + 1e-6, `${socle.reference} n'est pas abordé par le haut`);
          assert.ok(
            meme(autre.y, bout.y) && meme(autre.x, bout.x),
            `${socle.reference} est abordé de biais : le conduit ne vient pas de son aplomb`,
          );
        }
      }
    }
    assert.equal(abordages, 1, `${socle.reference} doit être alimenté par exactement un conduit`);
  }
});

test('tout conduit atteignant une boîte dimensionnée tient dans son flanc, tube compris', () => {
  // T007. Les cotes de BD-01 et BD-02 étaient les MINIMUMS que le tracé de la borne
  // exige, dérivés et non choisis au catalogue. Ce test les garde — mais il ne
  // recopie aucune des deux : il recalcule la condition à partir de la géométrie
  // réelle, de sorte que déplacer la ligne de la borne ou changer son calibre
  // fasse échouer ici, et non dans un document.
  //
  // V20 et la fusion des nœuds ne vérifient que l'AXE du conduit. Un axe dans le
  // flanc dont le tube dépasse serait admis par le socle et impossible à poser.
  //
  // Le tracé réel n'a plus aucune jonction à volume depuis le 2026-09-24 : BD-01 a
  // disparu dans la goulotte GL-02, et OC-01 n'est plus une enveloppe (constitution
  // v1.15.0). Le contrôle garde son objet pour toute boîte à venir, et s'éprouve
  // sur le tracé d'avant, que `_aides.js` reconstruit.
  const m = fusionner(SOCLE(), [PRISES_AVANT_GOULOTTE(), ECLAIRAGE_AVANT_GOULOTTE(), BORNE_AVANT_GOULOTTE()]);
  // Toute JONCTION qui déclare un volume, boîte de dérivation comme organe de
  // connexion : la condition de flanc porte sur l'enveloppe, pas sur le produit.
  const rolesJ = new Map((SOCLE().types.types ?? []).map((t) => [t.id, t.role]));
  const boites = m.composants.filter((c) => rolesJ.get(c.type) === 'jonction' && c.dimensions);
  assert.ok(boites.length > 0, 'des jonctions doivent déclarer un volume, sinon ce test ne prouve rien');

  const normale = { est: 'x', ouest: 'x', nord: 'y', sud: 'y', plafond: 'z' };
  let controles = 0;
  for (const b of boites) {
    const n = normale[b.paroi];
    // Les deux axes du flanc, et la demi-cote qui leur correspond.
    const plan = b.paroi === 'plafond'
      ? [['x', b.dimensions.largeur / 2], ['y', b.dimensions.hauteur / 2]]
      : [[n === 'x' ? 'y' : 'x', b.dimensions.largeur / 2], ['z', b.dimensions.hauteur / 2]];

    for (const ch of m.cheminements) {
      // Un profilé à raccordement latéral n'ENTRE pas dans la jonction qu'il
      // abrite : l'organe de connexion est logé DANS le profilé, et c'est pour
      // cela qu'il est plus petit que lui. La condition de flanc suppose un tube
      // qui pénètre une enveloppe par un côté, ce qui n'est pas le cas ici.
      if (ch.raccordement === 'lateral') continue;
      const d = calibreDe(ch.section);
      for (const [i, s] of (ch.segments ?? []).entries()) {
        for (const bout of [s.de, s.a]) {
          // Le bout est-il rattaché à cette boîte ? Même critère que le graphe.
          const dedans = ['x', 'y', 'z'].every((axe) => {
            const demi = plan.find(([a]) => a === axe)?.[1];
            const marge = demi ?? b.dimensions.profondeur;
            return Math.abs(bout[axe] - b.position[axe]) <= marge + 1e-9;
          });
          if (!dedans) continue;
          controles += 1;
          for (const [axe, demi] of plan) {
            const ecart = Math.abs(bout[axe] - b.position[axe]) + d / 2;
            assert.ok(
              ecart <= demi + 1e-9,
              `« ${ch.reference} » segment ${i + 1} entre dans « ${b.reference} » à ${ecart.toFixed(4)} m de son axe sur ${axe}, ` +
                `pour un demi-flanc de ${demi.toFixed(4)} m : le tube dépasse. Il faut une boîte d'au moins ${(2 * ecart).toFixed(3)} m de côté`,
            );
          }
        }
      }
    }
  }
  // Le seuil était de dix tant que GL-01 était une boîte à volume et que CH-B1
  // longeait la goulotte. Les deux ont disparu — GL-01 est devenue un cheminement,
  // CH-B1 a été absorbé par l'amendement v1.14.0 —, et il en reste huit sur le
  // tracé d'avant la goulotte GL-02. Le seuil n'est pas une cote, c'est un
  // garde-fou : il existe pour que le test échoue si la boucle cesse
  // silencieusement de contrôler quoi que ce soit.
  assert.ok(controles >= 8, `attendu au moins huit entrées à contrôler, obtenu ${controles}`);
});
