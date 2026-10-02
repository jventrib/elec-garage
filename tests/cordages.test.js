/**
 * Les cordages, la NATURE qui les distingue des conduits.
 *
 * Un cordage n'est pas un conduit plus court. C'est un câble qui relie deux
 * appareils bout à bout, il n'a pas de section parce que le diamètre d'un câble
 * multiconducteur n'est pas un diamètre intérieur, il part de fait en biais, et il
 * s'achète au câble. Chacune de ces différences a sa règle, et chacune est testée
 * ici pour elle-même : c'est ce lot qui tient la distinction debout.
 *
 * Comme partout dans cette suite, les assertions portent sur des PROPRIÉTÉS. Les
 * chiffres témoins — 1,20 m de câblage interne, 7,69 m de cordage — sont
 * recalculés à partir des données plutôt que recopiés, pour qu'une décision de
 * conception ultérieure les mette à jour sans avoir à réécrire le test.
 */

import test from 'node:test';
import assert from 'node:assert/strict';
import { SOCLE, PRISES, ECLAIRAGE, AUTOMATISATION, copie } from './_aides.js';
import { fusionner } from '../src/donnees/chargement.js';
import { validerApport, validerTout } from '../src/donnees/validation.js';
import { composerSequence } from '../src/sequence/ordonnancement.js';
import { construireGraphe, cheminEntre } from '../src/geometrie/graphe.js';
import { NATURES, estCordage, longueurCheminement } from '../src/geometrie/cheminement.js';
import { conduitsParCalibre, cordages } from '../src/donnees/fournitures.js';

const CIRCUIT = 'c-eclairage';
const modeleDe = () => fusionner(SOCLE(), [PRISES(), ECLAIRAGE(), AUTOMATISATION()]);

/** L'éclairage, modifié, et les défauts qu'il produit une fois validé avec les prises. */
function defautsDe(mutation) {
  const socle = fusionner(SOCLE(), [PRISES(), ECLAIRAGE(), AUTOMATISATION()]);
  const apport = copie(ECLAIRAGE());
  mutation(apport);
  return validerApport(apport, socle);
}

/** Un message de défaut, pour une cible donnée. */
function messagePour(defauts, cible) {
  return defauts.find((d) => d.cible === cible)?.message ?? '';
}

test('une nature inconnue est refusée, et il n’y a que deux natures', () => {
  // C'est la porte d'entrée : l'absence de section exigée, l'exemption de V13, la
  // ligne de fournitures séparée en dépendent toutes. Une faute de frappe sur
  // « cordage » ne doit pas produire un cheminement muet, qui passerait tous les
  // contrôles en se faisant passer pour un tube — sans même avoir de section.
  assert.deepEqual(NATURES, ['conduit', 'cordage'], 'deux natures, et deux seulement');

  const defauts = defautsDe((a) => { a.cheminements.find((c) => c.reference === 'CP-1').nature = 'cordgae'; });
  assert.match(messagePour(defauts, 'ec-cp-01'), /nature inconnue/, 'la faute de frappe est refusée');
});

test('un cordage ne déclare pas de section, et un conduit la déclare toujours', () => {
  // Le diamètre d'un câble n'est pas un diamètre intérieur. Lui en donner un
  // produirait deux mensonges d'un coup : un taux de remplissage calculé sur une
  // gaine qu'il n'a pas, et une ligne de fournitures qui le compterait au mètre de
  // tube. La règle est donc symétrique — interdire d'un côté, exiger de l'autre.
  const avecSection = defautsDe((a) => {
    a.cheminements.find((c) => c.reference === 'CP-1').section = { forme: 'circulaire', diametre: 0.012 };
  });
  assert.match(
    messagePour(avecSection, 'ec-cp-01'),
    /ne déclare pas de section/,
    'un cordage ne peut pas se déclarer un contenant',
  );

  const sansNature = defautsDe((a) => { delete a.cheminements.find((c) => c.reference === 'CP-1').nature; });
  assert.match(
    messagePour(sansNature, 'ec-cp-01'),
    /section absente/,
    'un cordage qui perd sa nature redevient un conduit, et un conduit sans section ne se valide pas',
  );

  const conduitSansNature = defautsDe((a) => { delete a.cheminements.find((c) => c.reference === 'CH-L3').nature; });
  assert.deepEqual(conduitSansNature, [], 'l’absence de nature vaut conduit : c’est le cas ordinaire');

  const sansSection = defautsDe((a) => { delete a.cheminements.find((c) => c.reference === 'CH-L3').section; });
  assert.match(messagePour(sansSection, 'ec-ch-03'), /section absente/, 'un conduit sans section ne se valide pas');
});

test('V13 est la règle d’un conduit, pas d’un câble', () => {
  // Le test est à double tranchant, et c'est voulu : il prouve que V13 n'est pas
  // simplement désactivée. Les quatre cordages du projet sont en diagonale et aucun
  // n'est refusé pour cela ; la même diagonale, déclarée conduit, l'est. C'est la
  // NATURE qui décide, et non le segment.
  const m = modeleDe();
  const apports = [PRISES(), ECLAIRAGE(), AUTOMATISATION()];
  assert.deepEqual(validerTout(m, composerSequence(m), apports), [], 'le projet réel ne viole aucune règle');

  const reelles = m.cheminements.filter(estCordage);
  assert.ok(reelles.length > 0, 'le projet déclare des cordages');
  for (const ch of reelles) {
    for (const [i, segment] of ch.segments.entries()) {
      const deplace = ['x', 'y', 'z'].filter((axe) => Math.abs(segment.a[axe] - segment.de[axe]) > 1e-9);
      assert.ok(deplace.length > 1, `${ch.reference}/${i + 1} est en diagonale, et V13 l’accepte`);
    }
  }

  const faux = copie(ECLAIRAGE());
  const cp = faux.cheminements.find((c) => c.reference === 'CP-1');
  cp.nature = 'conduit';
  cp.section = { forme: 'circulaire', diametre: 0.012 };
  const m2 = fusionner(SOCLE(), [PRISES(), faux, AUTOMATISATION()]);
  const d2 = validerTout(m2, composerSequence(m2), [PRISES(), faux, AUTOMATISATION()]);
  assert.ok(
    d2.some((d) => d.regle === 'V13'),
    'la même diagonale, déclarée conduit, tombe sous V13',
  );
});

test('V14 s’applique aussi aux cordages : un câble repose sur son nu', () => {
  // L'exemption de V13 ne doit pas s'étendre d'elle-même à la règle d'appui. Un
  // câble qui ne repose sur aucun nu est un câble qui pend dans le vide — et le
  // dire здесь ne coûte qu'une assertion.
  const m = modeleDe();
  for (const ch of m.cheminements.filter(estCordage)) {
    for (const [i, segment] of ch.segments.entries()) {
      assert.equal(segment.face, 'plafond', `${ch.reference}/${i + 1} repose sur le plafond`);
    }
  }
});

test('les raccords d’un appareil sont au moins deux, et tous trois ses axes', () => {
  // Un point unique ne ferait que redéclarer le centre ; un point incomplet ne
  // borne rien, et le graphe ne pourrait relier l'appareil à rien. C'est pour cela
  // que la règle refuse les deux plutôt que de les tolérer en silence.
  const un = defautsDe((a) => {
    a.composants.find((c) => c.reference === 'EL-01e').raccords = [{ x: 0.85, y: 4.55, z: 2.75 }];
  });
  assert.match(messagePour(un, 'ec-el-01e'), /au moins deux points/);

  const incomplet = defautsDe((a) => {
    a.composants.find((c) => c.reference === 'EL-01e').raccords = [
      { x: 0.85, y: 4.55 },
      { x: 2.05, y: 4.55, z: 2.75 },
    ];
  });
  assert.match(messagePour(incomplet, 'ec-el-01e'), /raccords\[0\] incomplet/);
});

test('un raccord hors du gabarit est refusé, et un gabarit inconnu ne borne rien', () => {
  // V24 teste la PROMESSE faite par `raccords` : « les conducteurs entrent et
  // sortent ICI ». Si le point sort de l'enveloppe déclarée, la promesse est fausse
  // et l'appareil n'est plus raccordable comme annoncé. Le cas inverse — un gabarit
  // qu'on ne connaît pas — est le même défaut sous une autre forme : rien ne borne
  // les positions, donc la règle ne peut être ni satisfaite ni réfutée, et le socle
  // doit le dire plutôt que de valider un raccord qu'il ne sait pas situer.
  const avec = (apport, socle = SOCLE()) => {
    const m = fusionner(socle, [PRISES(), apport, AUTOMATISATION()]);
    return validerTout(m, composerSequence(m), [PRISES(), apport, AUTOMATISATION()]);
  };
  const el = 'EL-01e';

  const dehors = avec(copie(ECLAIRAGE()));
  assert.deepEqual(dehors, [], 'les raccords du projet sont dans leur gabarit');

  const horsGabarit = copie(ECLAIRAGE());
  horsGabarit.composants.find((c) => c.reference === el).raccords = [
    { x: 0.2, y: 4.55, z: 2.75 },
    { x: 2.05, y: 4.55, z: 2.75 },
  ];
  assert.ok(
    avec(horsGabarit).some((d) => d.regle === 'V24' && d.cible === 'ec-el-01e'),
    'un raccord hors gabarit tombe sous V24',
  );

  // Ici le gabarit par défaut sauve la mise : un type inconnu retombe sur
  // l'enveloppe générique, et les points — trop larges pour elle — tombent dehors.
  const typeInconnu = copie(ECLAIRAGE());
  typeInconnu.composants.find((c) => c.reference === el).type = 'reglette-inconnue';
  assert.ok(
    avec(typeInconnu).some((x) => x.regle === 'V24' && /tombe hors de son enveloppe/.test(x.message)),
    'un type inconnu retombe sur le gabarit par défaut, qui ne borde pas ce raccord',
  );

  // Et sans gabarit du tout, V24 ne peut rien vérifier : elle le dit, plutôt que de
  // laisser passer une déclaration qu'elle n'a pas les moyens de lire.
  const sansDefaut = SOCLE();
  delete sansDefaut.types.gabaritParDefaut;
  delete sansDefaut.types.types.find((t) => t.id === 'reglette-led').gabarit;
  const d = avec(copie(ECLAIRAGE()), sansDefaut);
  assert.ok(
    d.some((x) => x.regle === 'V24' && /gabarit est inconnu/.test(x.message)),
    'un socle sans gabarit refuse la déclaration au lieu de l’accepter',
  );
});

test('le graphe relie les deux raccords, et ne les facture pas', () => {
  // C'est le cœur du pontage. Sans ce lien, un appareil qui a deux connecteurs
  // n'en tirerait qu'un, et le réseau serait deux réseaux au lieu d'un. Le lien se
  // mesure à la distance réelle des deux points — 1,20 m pour une réglette de 1,20 —
  // et il n'apparaît dans AUCUN `cheminements`, qui est le relevé de ce qu'on
  // achète. Le trajet existe, la ligne de fournitures non : les deux ensemble.
  const m = modeleDe();
  const g = construireGraphe(m);
  const e = m.composants.find((c) => c.reference === 'EL-01e');
  const noeuds = g.noeudsDeComposant(e.id);
  assert.equal(noeuds.length, 2, 'les deux points de raccord sont des nœuds du graphe');

  const [p, q] = e.raccords;
  const attendu = Math.hypot(q.x - p.x, q.y - p.y, q.z - p.z);
  const chemin = cheminEntre(g, m, CIRCUIT, noeuds[0].point, noeuds[1].point);
  assert.ok(Math.abs(chemin.longueur - attendu) < 1e-9, `le lien vaut ${attendu} m, pas une valeur de convention`);
  assert.deepEqual(chemin.cheminements, [], 'et il ne figure dans aucun relevé d’achat');
});

test('le câblage interne est sur le trajet, et nulle part dans le métré', () => {
  // Deux questions, deux réponses, et les confondre coûte de l'argent dans les
  // deux sens. On n'achète pas 1,20 m de câble par appareil pour refaire ce que le
  // fabricant a câblé ; mais ces 1,20 m sont de cuivre, de la longueur, et de la
  // résistance. Le test vérifie les deux, parce qu'un seul des deux retour serait une
  // erreur, et qu'aucun des deux ne se déduit de l'autre.
  const m = modeleDe();
  const g = construireGraphe(m);
  const parId = new Map(m.cheminements.map((c) => [c.id, c]));
  const tableau = m.composants.find((c) => c.type === 'tableau');

  // Sur le trajet : le chemin vers le fond de la chaîne passe par le câblage interne
  // de chaque appareil qu'il traverse, et le graphe le COMPTE. Le relevé, lui,
  // n'en contient aucun — c'est la différence entre « ce que le courant parcourt »
  // et « ce que la commande achète », et elle tient en une comparaison.
  const cp = m.cheminements.find((c) => c.reference === 'CP-4');
  const milieu = {
    x: (cp.segments[0].de.x + cp.segments[0].a.x) / 2,
    y: cp.segments[0].de.y,
    z: cp.segments[0].de.z,
  };
  const chemin = cheminEntre(g, m, CIRCUIT, tableau.position, milieu);
  const pontes = chemin.pas.filter((p) => p.arete.appareil);
  assert.ok(pontes.length > 0, 'le trajet traverse au moins un câblage interne');
  assert.ok(
    pontes.every((p) => p.arete.appareil.startsWith('ec-el-')),
    'et ce sont bien des raccords d’appareil, pas des cheminements',
  );
  assert.deepEqual(
    chemin.cheminements,
    chemin.cheminements.filter((id) => parId.get(id)?.segments.length > 0),
    'le relevé ne contient que des cheminements réels',
  );
  assert.ok(
    pontes.every((p) => !chemin.cheminements.includes(p.arete.appareil)),
    'mais aucun de ces raccords n’y apparaît : il est traversé, pas acheté',
  );

  // Dans le métré : la somme des lignes de conduit est celle des conduits, au
  // centième près. Aucun câblage d'appareil n'y entre, par construction — c'est ce
  // qui distingue « ce que le courant parcourt » de « ce que la commande achète ».
  const achete = conduitsParCalibre(m).reduce((t, c) => t + c.longueur, 0);
  const trace = m.cheminements
    .filter((c) => !estCordage(c))
    .reduce((t, c) => t + longueurCheminement(c), 0);
  assert.equal(Math.round(achete * 100) / 100, Math.round(trace * 100) / 100);
});

test('les cordages sortent du métré de conduit et entrent au leur', () => {
  // La raison d'être de la nature, en une phrase : ils ne sont pas du tube. Les
  // relever ensemble donnerait une ligne d'achat qui mélange deux articles qu'on ne
  // commande pas au même prix, ni à la même unité, ni chez le même fournisseur.
  const m = modeleDe();
  const reels = m.cheminements.filter(estCordage);
  const releve = cordages(m);

  assert.equal(releve.nombre, reels.length);
  assert.deepEqual(releve.references, reels.map((c) => c.reference).sort(), 'les références, triées');
  assert.equal(
    releve.longueur,
    Math.round(reels.reduce((t, c) => t + longueurCheminement(c), 0) * 100) / 100,
    'et la longueur est celle des cordages, pas celle des conduits',
  );

  const lignes = conduitsParCalibre(m);
  for (const ch of reels) {
    assert.ok(
      !lignes.some((l) => l.references.includes(ch.reference)),
      `${ch.reference} n'est dans aucune ligne de conduit`,
    );
  }
});
