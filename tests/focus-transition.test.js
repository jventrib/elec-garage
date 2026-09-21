/**
 * Le focus, et ce qu'il ne doit pas casser.
 *
 * La demande était simple : sélectionner un objet recentre l'orbite dessus. Ce
 * fichier tient surtout les contreparties — qu'aucune interaction n'attende la fin
 * d'une animation, que le zoom manuel reprenne la main, et que le mode libre reste
 * indifférent à la sélection.
 */

import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { RACINE, SOCLE } from './_aides.js';
import { creerFiche } from '../src/ui/fiche-composant.js';

const reglages = () => SOCLE().presentation.camera;

/** L'interpolation de vue.js, rejouée hors WebGL. */
function transitionSimulee(depart, but, r = reglages()) {
  const ecart = (de, vers) => {
    let d = (vers - de) % (2 * Math.PI);
    if (d > Math.PI) d -= 2 * Math.PI;
    if (d < -Math.PI) d += 2 * Math.PI;
    return d;
  };
  const lisser = (t) => (t < 0.5 ? Math.pow(2 * t, r.lissageTransition) / 2 : 1 - Math.pow(2 * (1 - t), r.lissageTransition) / 2);
  const dTheta = ecart(depart.theta, but.theta);
  let t = 0;
  return {
    avancer(secondes) {
      t = Math.min(1, t + secondes / r.dureeTransition);
      const k = lisser(t);
      return {
        t,
        theta: depart.theta + dTheta * k,
        rayon: depart.rayon + (but.rayon - depart.rayon) * k,
        fini: t >= 1,
      };
    },
    ecartTheta: dTheta,
  };
}

test('le lacet se rattrape par le plus court chemin', () => {
  // Sans ça, passer de +170° à -170° ferait un tour complet pour 20° d'écart.
  const d = (170 * Math.PI) / 180;
  const a = (-170 * Math.PI) / 180;
  const tr = transitionSimulee({ theta: d, rayon: 5 }, { theta: a, rayon: 5 });
  assert.ok(Math.abs(tr.ecartTheta) < Math.PI, `écart de ${(tr.ecartTheta * 180 / Math.PI).toFixed(0)}° au lieu de 340°`);
  assert.ok(Math.abs(Math.abs(tr.ecartTheta) - (20 * Math.PI) / 180) < 1e-9, 'et il vaut 20°');
});

test('la transition est monotone et s’achève', () => {
  const tr = transitionSimulee({ theta: 0, rayon: 10 }, { theta: 0, rayon: 2 });
  const r = reglages();
  let precedent = 10;
  for (let i = 0; i < 20; i += 1) {
    const e = tr.avancer(r.dureeTransition / 10);
    assert.ok(e.rayon <= precedent + 1e-9, 'le rayon ne remonte pas');
    precedent = e.rayon;
  }
  assert.equal(tr.avancer(0).fini, true, 'et elle finit par s’achever');
  assert.ok(Math.abs(precedent - 2) < 1e-9, 'sur la valeur visée');
});

test('le lissage part et arrive sans à-coup', () => {
  const r = reglages();
  const tr = transitionSimulee({ theta: 0, rayon: 0 }, { theta: 0, rayon: 1 });
  const pas = r.dureeTransition / 100;
  const premier = tr.avancer(pas).rayon;
  let dernier = 0;
  let avant = premier;
  for (let i = 0; i < 99; i += 1) {
    const e = tr.avancer(pas);
    dernier = e.rayon - avant;
    avant = e.rayon;
  }
  assert.ok(premier < 0.02, `démarrage doux : ${premier.toFixed(4)} sur le premier centième`);
  assert.ok(dernier < 0.02, `arrivée douce : ${dernier.toFixed(4)} sur le dernier centième`);
});

test('la fiche prévient quand on la referme', () => {
  // C'est le SEUL endroit où « l'utilisateur a refermé » est connu. Le deviner en
  // observant `hidden` marcherait et serait fragile.
  let ferme = 0;
  const element = { hidden: true, innerHTML: '', querySelector: () => ({ addEventListener() {} }) };
  const fiche = creerFiche(element, { surFermeture: () => { ferme += 1; } });
  element.hidden = false;
  fiche.vider();
  assert.equal(ferme, 1, 'la fermeture doit être annoncée');
  fiche.vider();
  assert.equal(ferme, 1, 'et une fiche déjà fermée ne l’annonce pas deux fois');
});

test('le focus ne s’applique pas en mode déplacement libre', () => {
  // Les deux modes sont distincts, et téléporter quelqu'un pendant qu'il vole le
  // désorienterait. Le garde est lisible dans la source.
  const src = readFileSync(join(RACINE, 'src/main.js'), 'utf8');
  assert.match(src, /estEnModeLibre\(\)\)\s*return false;/, 'focaliser doit sortir en mode libre');
  assert.match(src, /surFermeture[\s\S]{0,140}estEnModeLibre/, 'la fermeture aussi');
});

test('le zoom manuel et le glisser reprennent la main sur une transition', () => {
  // Cadrer n'est pas enfermer, et la main de l'utilisateur prime sur une animation.
  const src = readFileSync(join(RACINE, 'src/scene/vue.js'), 'utf8');
  const zoom = src.slice(src.indexOf('function zoomer'), src.indexOf('function zoomer') + 260);
  assert.match(zoom, /interrompreTransition\(\)/, 'le zoom doit interrompre');
  const glisse = src.slice(src.indexOf("if (pointeurs.size === 1)"), src.indexOf("if (pointeurs.size === 1)") + 300);
  assert.match(glisse, /interrompreTransition\(\)/, 'le glisser doit interrompre');
});

test('une nouvelle cible remplace la transition en cours, sans file d’attente', () => {
  const src = readFileSync(join(RACINE, 'src/scene/vue.js'), 'utf8');
  const viser = src.slice(src.indexOf('function viser'), src.indexOf('function avancerTransition'));
  // `viser` réaffecte `transition` depuis l'état COURANT de l'orbite, jamais depuis
  // le but de la transition précédente : c'est ce qui évite la file d'attente.
  assert.match(viser, /transition = \{/, 'viser réaffecte la transition');
  assert.match(viser, /depart:[\s\S]{0,200}orbite\.cible\.x/, 'et repart de l’état atteint');
});

test('aucun objet focalisé n’est mémorisé d’une session à l’autre', () => {
  for (const f of ['src/scene/vue.js', 'src/main.js', 'src/geometrie/cadrage.js']) {
    const src = readFileSync(join(RACINE, f), 'utf8');
    for (const motif of [/localStorage/, /sessionStorage/, /indexedDB/]) {
      assert.equal(motif.test(src), false, `${f} persiste un cadrage : ${motif}`);
    }
  }
});

test('la cible d’un focus est un objet sélectionnable, donc visible', () => {
  // La sélection ne porte que sur les meshes rendus, et un mesh non rendu n'est
  // pas dans la liste passée à `objetSous`. Si la sélection s'élargit un jour, la
  // caméra irait regarder un objet absent de l'étape courante.
  const src = readFileSync(join(RACINE, 'src/main.js'), 'utf8');
  const bloc = src.slice(src.indexOf('vue.objetSous('), src.indexOf('vue.objetSous(') + 220);
  assert.match(bloc, /composants\.meshes\(\)/, 'la sélection part des meshes');
  assert.match(bloc, /cheminements\.meshes\(\)/);
  assert.match(bloc, /obstacles\.meshes\(\)/);
});
