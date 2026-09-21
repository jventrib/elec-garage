/**
 * La liste totale des fournitures.
 *
 * Demandée le 2026-09-22. Elle est **dérivée**, et le document est **généré** :
 * trois nomenclatures tenues à la main ne s'additionnent pas, et celles qui se
 * recomptent le plus mal sont justement les mètres de conduit par calibre et de
 * conducteur par section — ces derniers dépendant du nombre de fils par tube.
 *
 * Le dernier test de ce fichier est le plus important : il vérifie que le
 * fichier commité est bien celui que le générateur produit. Sans lui, un
 * document généré se périme exactement comme un document rédigé, à ceci près
 * que personne ne s'en méfie.
 */

import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { join } from 'node:path';
import { RACINE, SOCLE, PRISES, ECLAIRAGE, BORNE, AUTOMATISATION, copie } from './_aides.js';
import { fusionner } from '../src/donnees/chargement.js';
import { appareillage, boites, conducteursParSection, conduitsParCalibre, coudes, fournitures } from '../src/donnees/fournitures.js';
import { rendre, modeleComplet } from '../build/fournitures.mjs';

const modele = fusionner(SOCLE(), [PRISES(), ECLAIRAGE(), BORNE(), AUTOMATISATION()]);
const parCalibre = (n) => conduitsParCalibre(modele).find((c) => c.calibre === n);

test('les longueurs de conduit par calibre concordent avec les nomenclatures', () => {
  // Deux calibres, et deux seulement, depuis la décision du 2026-09-22 d'abandonner
  // l'IRL 16. L'IRL 25 n'est plus propre à la borne depuis le 2026-09-23 : CH-02
  // et CH-05, trop chargés par l'automatisation, y sont passés — 3,40 m de tronc.
  // La descente CH-A1, 1,50 m, entre en IRL 20.
  //
  // La goulotte GL-02 (2026-09-24) remplace CH-02, CH-B2 et les 4,11 m de CH-B3 qui
  // couraient sous le plafond : l'IRL 25 perd 7,88 m. L'IRL 20 perd CH-04 et 3,12 m
  // de CH-03, et CH-07 part 0,04 m plus à l'ouest, de la face avant : 3,28 m. GL-02
  // est un 90 × 40, dont le dessous est à 2,66 m.
  assert.equal(parCalibre(20).longueur, 15.02, 'le parcours de plafond, les branches et la descente du boîtier double');
  assert.equal(parCalibre(25).longueur, 4.92, 'la descente de la borne, plus CH-05');
  assert.equal(parCalibre(25).longueurDediee, 3.36, 'la descente de la borne reste dédiée');
  assert.equal(parCalibre(25).longueurPartagee, 1.56, 'et CH-05, 1,56 m depuis le dessous de la goulotte');
  assert.equal(parCalibre(16), undefined, 'plus aucun IRL 16 au projet');
  // Quatre articles : les deux calibres de conduit, plus deux profilés de goulotte,
  // cheminements de plein droit qui se commandent au mètre comme eux. GL-02 est un
  // 90 × 40, plus petit que GL-01 : le remplissage n'y impose rien, et depuis la
  // constitution v1.15.0 aucun boîtier n'a à s'y loger.
  assert.equal(conduitsParCalibre(modele).length, 4, 'deux calibres de conduit, plus deux profilés');
  assert.equal(parCalibre(120).longueur, 1.12, 'GL-01, 1,12 m de 120 × 60');
  assert.equal(parCalibre(90).longueur, 6, 'GL-02, 6,00 m de 90 × 40');
  assert.equal(parCalibre(90).profondeur, 40);
});

test('un calibre mixte compte à part ce qui est partagé et ce qui est dédié', () => {
  // Le cas est né le 2026-09-22 et a changé de calibre le même jour. Il a d'abord
  // visé l'IRL 25, quand la borne y a été arrêtée à côté du tronc partagé ; il vise
  // l'IRL 20 depuis que le maître d'ouvrage y a ramené le tronc. C'est le même
  // constat dans les deux cas, et c'est pourquoi il est testé sur la PROPRIÉTÉ et
  // non sur un calibre : un article d'achat peut servir deux natures de parcours,
  // et les mètres s'additionnent sans que les natures se confondent.
  const c = parCalibre(20);
  assert.equal(c.partage, true);
  assert.equal(c.dedie, true, 'le même calibre porte aussi des branches dédiées');
  // Le partagé perd CH-02 et CH-05, passés en IRL 25, et gagne CH-L1 et CH-A1, où
  // le bouton de porte rejoint l'éclairage. Puis CH-04, disparu avec la goulotte.
  assert.equal(c.longueurPartagee, 7.96, 'CH-07, CH-L1 et la descente CH-A1');
  assert.equal(c.longueurDediee, 7.06, 'les branches propres aux prises et à l’éclairage');
  assert.equal(Math.round((c.longueurPartagee + c.longueurDediee) * 100) / 100, c.longueur);

  // L'IRL 25 est devenu mixte à son tour, le 2026-09-23 : la ligne dédiée de la
  // borne et deux conduits du tronc partagé.
  assert.equal(parCalibre(25).partage, true, 'CH-05 est partagé');
  assert.equal(parCalibre(25).dedie, true, 'la borne reste dédiée');
});

test('un calibre majorant est compté à part d’un calibre arrêté', () => {
  // Les confondre ferait commander un tube sur une hypothèse. Plus aucun conduit
  // du projet n'est dans ce cas depuis que la borne est arrêtée : la règle se
  // vérifie donc sur un conduit fabriqué pour elle, faute de quoi elle ne serait
  // plus vérifiée du tout.
  for (const n of [25, 20]) assert.equal(parCalibre(n).majore, false, `IRL ${n} est arrêté`);

  const m = copie(modele);
  m.cheminements = [
    ...m.cheminements,
    { id: 'x-ch', reference: 'CH-X1', circuits: ['c-borne'], section: { forme: 'circulaire', section: { forme: 'circulaire', diametre: null }, majorant: { diametre: 0.04 } },
      segments: [{ face: 'est', de: { x: 5.6, y: 0, z: 1 }, a: { x: 5.6, y: 2, z: 1 } }] },
  ];
  const borne = conduitsParCalibre(m).find((c) => c.calibre === 40);
  assert.equal(borne.majore, true, 'un calibre non arrêté ne se confond pas avec un calibre arrêté');
  assert.equal(borne.longueur, 2);
});

test('la longueur de conducteur n’est ni celle du tracé, ni un multiple uniforme', () => {
  // C'est le calcul que des nomenclatures séparées rendaient faux : un conduit
  // qui porte trois fils en consomme trois fois sa longueur.
  //
  // Ce n'est pas non plus `n × longueur de tracé`, et c'est la correction du
  // 2026-09-22 : `n` est le cas le plus chargé du circuit, pas ce que chaque tube
  // porte. Chaque conducteur est suivi sur son trajet réel — voir
  // `conducteurs-trajet.test.js` pour le détail du calcul.
  const par = (s) => conducteursParSection(modele).find((c) => c.section === s);
  assert.equal(par(2.5).longueur, 62.39, '3 conducteurs, plus le fil d’ordre du bouton de porte, sa phase et son PE');
  assert.equal(par(1.5).longueur, 69.34, 'et non 163,12 m : chaque fil de l’éclairage sur son trajet, goulottes comprises');
  assert.equal(par(10).longueur, 10.48, 'un câble 3G10 de borne : 3,36 m de conduit et 7,12 m de goulotte');
  assert.equal(par(10).cable, '3G10', 'et il s’achète au mètre de câble');
});

test('le décompte des circuits d’une boîte passe par le graphe, pas par une distance', () => {
  // Une première version comparait les coordonnées à 0,20 m près et attribuait
  // la ligne de la borne à BD-03, qu'elle frôle à 0,11 m sans y entrer.
  const par = (ref) => boites(modele).find((b) => b.reference === ref);
  // BD-01 a disparu avec l'antenne : ses connexions sont dans OC-02, sous le capot
  // de GL-02, où la ligne de la borne transite.
  assert.equal(par('BD-01'), undefined, 'BD-01 n’existe plus');
  assert.equal(par('OC-02').circuits, 3, 'les trois circuits transitent par la goulotte qui l’abrite');
  assert.equal(par('BD-04').circuits, 2, 'la borne ne passe pas par les commandes');
  // Le coude du départ de plafond est un ACCESSOIRE DE CONDUIT, comme l'était BD-03 :
  // il ne sépare rien, ne loge rien — la constitution n'exige une boîte qu'« à
  // chaque changement de direction qui ne se traite pas par un accessoire de
  // conduit ». Il est hors du relevé des boîtes et dans celui de l'appareillage.
  assert.equal(par('AC-01'), undefined, 'AC-01 est un accessoire, pas une boîte');
  assert.ok(
    appareillage(modele).some((a) => a.type === 'accessoire-conduit' && a.references.includes('AC-01')),
    'mais il reste un article à commander',
  );
  assert.equal(par('BL-01').circuits, 1, 'la fourche du plafonnier ne porte que l’éclairage');
  // GL-01 n'est plus une enveloppe mais un cheminement : elle sort du relevé des
  // boîtes et entre dans celui des conduits. C'est OC-01, l'organe de connexion
  // qu'elle abrite, qui y prend sa place — la condition 3 de la constitution veut
  // ces emplacements énumérés au même titre que les boîtes.
  assert.equal(par('GL-01'), undefined, 'la goulotte n’est plus une boîte');
  assert.ok(par('OC-01'), 'l’organe de connexion doit être relevé');
  // Depuis la constitution v1.15.0, les connexions sont admises dans la goulotte :
  // l'organe n'est plus une enveloppe, et n'a ni côté ni entrées à commander.
  assert.equal(par('OC-01').entrees, null, 'il n’a plus d’entrées à compter');
  assert.equal(par('OC-02').cote, null, 'ni de boîtier à dimensionner');
});

test('les changements de direction se comptent sur le tracé', () => {
  const c = coudes(modele);
  // Huit le 2026-09-22 — le décrochement par lequel la montée de la borne esquivait
  // celle du tronc avait disparu avec elle. NEUF depuis le 2026-09-23 : PC-03 est
  // passé en façade nord, et l'antenne tourne désormais à l'angle pour l'atteindre.
  // Ce virage est un changement de direction SANS dérivation : il se traite par un
  // accessoire de conduit, et c'est pour cela qu'il compte ici et pas dans V17.
  // HUIT de nouveau depuis le 2026-09-23 : BD-05 a rejoint l'axe ouest de BD-01, et
  // le décrochement de 0,40 m de CH-07 a disparu avec son coude. Neuf la veille,
  // huit aujourd'hui — et ce n'est pas un retour en arrière : l'antenne des prises
  // en a gagné un en façade nord, le plafond en a perdu un.
  //
  // CINQ depuis la goulotte GL-02 (2026-09-24). Les antennes de PC-03 et de la
  // borne ne tournent plus à l'angle : GL-02 le fait pour elles, par un seul angle
  // intérieur, et elles en descendent droit. Le coude du départ de plafond, AC-01,
  // est déclaré en accessoire et ne se compte pas sur un tracé.
  assert.equal(c.total, 5);
  assert.equal(c.detail.find((d) => d.reference === 'GL-02').nombre, 1, 'l’angle nord-est de la goulotte');
  assert.ok(!c.detail.some((d) => d.reference === 'CH-03'), 'la descente de PC-03 est droite');
  assert.ok(!c.detail.some((d) => d.reference === 'CH-07'), 'CH-07 file droit : plus de décrochement');
  assert.equal(c.detail.find((d) => d.reference === 'CH-B3').nombre, 2, 'la descente vers la borne, sous l’allège');
  assert.ok(!c.detail.some((d) => d.reference === 'CH-B1'), 'la montée de la borne est droite');
  assert.ok(!c.detail.some((d) => d.reference === 'CH-05'), 'un conduit rectiligne n’a aucun coude');
});

test('rien n’est estimé : ce qui n’est pas établi ressort « à arrêter »', () => {
  const f = fournitures(modele);
  // Les trois sections sont désormais arrêtées — la dernière, celle de la borne,
  // par la décision du 2026-09-22. Les valeurs NORMATIVES ne le sont toujours
  // pas, et ce sont elles que ce test garde : un calibre de protection plausible
  // qui se déguiserait en calibre confirmé est le risque que le Principe I vise.
  assert.equal(f.circuits.every((c) => c.calibre === null && c.typeDifferentiel === null), true);
  assert.equal(f.circuits.every((c) => c.section !== null), true, 'les trois sections sont décidées');
  assert.equal(f.appareillage.every((a) => a.indicesInconnus === a.nombre), true, 'aucun indice de protection établi');

  // Et une section arrêtée n'emporte pas le calibre du conduit : la condition de
  // remplissage reste à vérifier sur les cotes produit.
  assert.equal(f.conducteurs.every((c) => c.majore === false), true, 'les métrés sont dérivés, pas majorés');
});

test('le document commité est bien celui que le générateur produit', () => {
  // Un document généré se périme comme un document rédigé — à ceci près que
  // personne ne s'en méfie. C'est ce test qui l'empêche.
  const m = modeleComplet();
  const attendu = rendre(fournitures(m), m);
  const commite = fs.readFileSync(join(RACINE, 'dossier/fournitures.md'), 'utf8');
  assert.equal(commite, attendu, 'relancer `npm run fournitures`');
});

test('un circuit sans décompte de conducteurs ne fausse pas le total', () => {
  // Mieux vaut ne rien compter pour lui que de le compter pour un.
  const sans = copie(PRISES());
  delete sans.circuits[0].conducteurs;
  delete sans.circuits[0].detailConducteurs;
  const m = fusionner(SOCLE(), [sans, ECLAIRAGE(), BORNE(), AUTOMATISATION()]);
  const par = conducteursParSection(m);
  assert.ok(!par.some((c) => c.section === 2.5), 'le circuit non compté disparaît du relevé');
  assert.equal(par.find((c) => c.section === 1.5).longueur, 69.34, 'les autres sont intacts');
});
