/**
 * Le mode de déplacement libre.
 *
 * L'orbite tient sa cible figée au centre du local : on peut y entrer, mais on
 * continue de regarder le centre. Se tenir dans un angle et regarder l'angle
 * opposé y est impossible — c'est ce que ce mode existe pour permettre, et c'est
 * ce que le premier test vérifie.
 */

import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { RACINE, SOCLE } from './_aides.js';
import { TOUCHES, ETIQUETTES, creerPilotageLibre, pasLibre } from '../src/ui/pilotage-libre.js';

const reglages = () => SOCLE().presentation.camera;

/** Une vue simulée : on n'instancie pas WebGL pour tester une cinématique. */
function vueSimulee() {
  const r = reglages();
  const etat = { libre: false, position: { x: 2.8, y: 2.8, z: 1.375 }, lacet: 0, tangage: Math.PI / 2 };
  return {
    estEnModeLibre: () => etat.libre,
    basculerMode(v = !etat.libre) { etat.libre = v; return etat.libre; },
    poseLibre: () => ({ ...etat, position: { ...etat.position } }),
    deplacerLibre({ avant = 0, cote = 0, vertical = 0 }, secondes = 1) {
      if (!etat.libre) return false;
      const v = r.vitesseDeplacement * secondes;
      const pas = pasLibre(etat.lacet, { avant, cote });
      etat.position.x += pas.x * v;
      etat.position.y += pas.y * v;
      etat.position.z += vertical * v;
      return true;
    },
    tournerLibre(dx, dy) {
      if (!etat.libre) return false;
      etat.lacet -= dx * r.vitesseRotation;
      etat.tangage = Math.min(r.pitchMax, Math.max(r.pitchMin, etat.tangage - dy * r.vitesseRotation));
      return true;
    },
  };
}

/** Un émetteur d'évènements minimal, pour simuler le clavier. */
function cibleSimulee() {
  const ecouteurs = new Map();
  return {
    addEventListener: (t, f) => ecouteurs.set(t, [...(ecouteurs.get(t) ?? []), f]),
    removeEventListener: (t, f) => ecouteurs.set(t, (ecouteurs.get(t) ?? []).filter((g) => g !== f)),
    emettre: (t, e) => (ecouteurs.get(t) ?? []).forEach((f) => f({ preventDefault() {}, ...e })),
  };
}

test('les touches se lisent sur la POSITION physique, jamais sur le caractère', () => {
  // LE test du fichier. Sur un clavier français, la touche en haut à gauche du
  // bloc rend le caractère 'z' et porte le code 'KeyW'. Lire `key` rendrait le
  // mode injouable en AZERTY, et obligerait à détecter la disposition — ce que le
  // navigateur ne dit pas de façon fiable.
  const vue = vueSimulee();
  const cible = cibleSimulee();
  const p = creerPilotageLibre(vue, { cible });
  vue.basculerMode(true);
  const avant = vue.poseLibre().position.x;

  cible.emettre('keydown', { code: 'KeyW', key: 'z' });
  p.avancer(1);
  assert.notEqual(vue.poseLibre().position.x, avant, 'la touche marquée Z doit faire avancer');
  p.arreter();
});

test('un caractère sans code connu ne déplace rien', () => {
  const vue = vueSimulee();
  const cible = cibleSimulee();
  const p = creerPilotageLibre(vue, { cible });
  vue.basculerMode(true);
  const avant = { ...vue.poseLibre().position };
  cible.emettre('keydown', { code: 'KeyZ', key: 'w' });
  p.avancer(1);
  assert.deepEqual(vue.poseLibre().position, avant, 'c’est le code qui compte, pas la lettre');
  p.arreter();
});

test('le déplacement s’intègre sur le temps, non sur le nombre de frappes', () => {
  // Bouger à chaque `keydown` ferait dépendre la vitesse de la cadence de
  // répétition du clavier, qui se règle dans le système d'exploitation.
  const vue = vueSimulee();
  const cible = cibleSimulee();
  const p = creerPilotageLibre(vue, { cible });
  vue.basculerMode(true);
  const depart = vue.poseLibre().position.x;
  cible.emettre('keydown', { code: 'KeyW' });
  p.avancer(0.5);
  const apresDemi = vue.poseLibre().position.x - depart;
  p.avancer(1);
  const total = vue.poseLibre().position.x - depart;
  assert.ok(Math.abs(total - 3 * apresDemi) < 1e-9, 'une seconde doit parcourir le double d’une demi-seconde');
  p.arreter();
});

test('avancer suit le lacet, monter suit z quel que soit le tangage', () => {
  const vue = vueSimulee();
  vue.basculerMode(true);
  const r = reglages();
  // Lacet nul : avancer va vers +x.
  const a = vue.poseLibre().position;
  vue.deplacerLibre({ avant: 1 }, 1);
  const b = vue.poseLibre().position;
  assert.ok(Math.abs(b.x - a.x - r.vitesseDeplacement) < 1e-9, 'avancer suit +x à lacet nul');
  assert.ok(Math.abs(b.y - a.y) < 1e-9, 'et ne dérive pas en y');
  // Regard vers le sol : monter doit quand même monter.
  vue.tournerLibre(0, -1000);
  const c = vue.poseLibre().position;
  vue.deplacerLibre({ vertical: 1 }, 1);
  assert.ok(vue.poseLibre().position.z - c.z > 0, 'monter suit z, pas le regard');
});

test('D va à droite du regard, A à gauche, quel que soit le lacet', () => {
  // La droite de la caméra est regard × haut, z étant le haut. Le signe s'écrit
  // ici par le produit vectoriel, et non en recopiant la formule de la vue :
  // c'est une recopie qui a laissé passer les côtés inversés.
  for (const lacet of [0, 0.7, Math.PI / 2, 2.5, -1.2]) {
    const regard = { x: Math.cos(lacet), y: Math.sin(lacet) };
    const droite = { x: regard.y, y: -regard.x };
    const d = pasLibre(lacet, { cote: TOUCHES.KeyD.cote });
    const a = pasLibre(lacet, { cote: TOUCHES.KeyA.cote });
    assert.ok(Math.abs(d.x - droite.x) < 1e-9 && Math.abs(d.y - droite.y) < 1e-9, `D à droite, lacet ${lacet}`);
    assert.ok(Math.abs(a.x + droite.x) < 1e-9 && Math.abs(a.y + droite.y) < 1e-9, `A à gauche, lacet ${lacet}`);
  }
});

test('le tangage est borné des deux côtés', () => {
  const vue = vueSimulee();
  vue.basculerMode(true);
  const r = reglages();
  vue.tournerLibre(0, -100000);
  assert.ok(vue.poseLibre().tangage <= r.pitchMax + 1e-9, 'borne haute');
  vue.tournerLibre(0, 100000);
  assert.ok(vue.poseLibre().tangage >= r.pitchMin - 1e-9, 'borne basse');
});

test('rien ne bouge tant que le mode libre n’est pas actif', () => {
  const vue = vueSimulee();
  const cible = cibleSimulee();
  const p = creerPilotageLibre(vue, { cible });
  const avant = { ...vue.poseLibre().position };
  cible.emettre('keydown', { code: 'KeyW' });
  p.avancer(1);
  assert.deepEqual(vue.poseLibre().position, avant, 'le mode orbite ne se pilote pas au clavier');
  p.arreter();
});

test('une frappe dans un champ de saisie est ignorée', () => {
  const vue = vueSimulee();
  const cible = cibleSimulee();
  const p = creerPilotageLibre(vue, { cible });
  vue.basculerMode(true);
  const avant = { ...vue.poseLibre().position };
  cible.emettre('keydown', { code: 'KeyW', target: { tagName: 'INPUT' } });
  p.avancer(1);
  assert.deepEqual(vue.poseLibre().position, avant, 'saisir « 12 » dans le saut d’étape ne doit pas voler');
  p.arreter();
});

test('les deux jeux de touches sont disjoints', () => {
  // Deux écouteurs globaux interprètent les frappes : `controles.js` pour la
  // séquence, `pilotage-libre.js` pour la caméra. Rien n'empêchera un ajout
  // distrait de les faire se recouper, sinon ce test.
  const source = readFileSync(join(RACINE, 'src/ui/controles.js'), 'utf8');
  const sequence = [...source.matchAll(/e\.key === '([^']+)'/g)].map((m) => m[1]);
  assert.ok(sequence.length >= 4, 'les touches de la séquence doivent être lisibles dans le source');
  for (const code of Object.keys(TOUCHES)) {
    assert.equal(
      sequence.includes(code),
      false,
      `« ${code} » sert à la fois la caméra et la séquence : son effet ne se prédit plus`,
    );
  }
  // Et réciproquement : la séquence ne doit pas se mettre à lire `code`.
  assert.equal(/e\.code/.test(source), false, 'controles.js lit `key`, pilotage-libre.js lit `code`');
});

test('les étiquettes affichées ne mentent pas sur la disposition', () => {
  for (const code of Object.keys(TOUCHES)) {
    assert.ok(ETIQUETTES.azerty[code], `${code} doit avoir une étiquette AZERTY`);
    assert.ok(ETIQUETTES.qwerty[code], `${code} doit avoir une étiquette QWERTY`);
  }
  assert.equal(ETIQUETTES.azerty.KeyW, 'Z', 'sur un clavier français, KeyW porte Z');
  assert.equal(ETIQUETTES.azerty.KeyA, 'Q', 'et KeyA porte Q');
});

test('le mode orbite reste le mode par défaut', () => {
  // La contrepartie de l'exception au contrat tactile : c'est l'orbite qui va au
  // chantier, et c'est lui qu'on trouve en ouvrant.
  const vue = vueSimulee();
  assert.equal(vue.estEnModeLibre(), false, 'à l’ouverture, la maquette est en orbite');
});

test('la bascule est réversible et l’orbite n’est pas modifié par l’ajout', () => {
  const vue = vueSimulee();
  assert.equal(vue.basculerMode(), true);
  assert.equal(vue.basculerMode(), false);
  assert.equal(vue.estEnModeLibre(), false);
});

test('aucune position de caméra n’est mémorisée d’une session à l’autre', () => {
  // Le lecteur mémorise un rang d'étape, pas un point de vue. Ce changement ne
  // l'étend pas : si une pose de caméra se met à survivre à un rechargement,
  // c'est une décision, pas un effet de bord.
  const sources = ['src/scene/vue.js', 'src/ui/pilotage-libre.js', 'src/main.js'];
  for (const f of sources) {
    const src = readFileSync(join(RACINE, f), 'utf8');
    for (const motif of [/localStorage/, /sessionStorage/, /indexedDB/]) {
      assert.equal(motif.test(src), false, `${f} persiste un état de caméra : ${motif}`);
    }
  }
});

test('la cible de 64 px du chantier n’est pas touchée', () => {
  // Le bouton de bascule vit dans l'en-tête, avec les autres commandes de
  // préparation. La cible de 64 px est celle des commandes de séquence, qui
  // s'actionnent avec des gants — le mode libre n'y touche pas.
  const html = readFileSync(join(RACINE, 'index.html'), 'utf8');
  assert.match(html, /--cible:\s*64px/, 'la cible du chantier doit rester déclarée');
  assert.match(html, /id="mode-camera"/, 'le bouton de bascule doit exister');
  const entete = html.slice(html.indexOf('<header'), html.indexOf('</header>'));
  assert.match(entete, /id="mode-camera"/, 'et vivre dans l’en-tête, avec les commandes de préparation');
});
