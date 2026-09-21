/**
 * Les cotes d'implantation — de quoi tracer au mur avant de percer.
 *
 * Demandées le 2026-09-22. Rien n'en est déclaré : tout se dérive du relevé, et
 * la règle tient en une phrase — **le repère le plus proche gagne**, parce que
 * c'est la mesure la plus courte, donc la plus juste à reporter.
 *
 * Ce fichier vérifie surtout que la règle est la bonne, et il le fait d'une
 * manière un peu particulière : en confrontant ce qu'elle produit aux cotes que
 * les documents du dossier citent **à la main**, écrites bien avant elle. Si la
 * dérivation les retrouve, c'est qu'elle a la même idée du « repère pertinent »
 * que celui qui a rédigé.
 */

import test from 'node:test';
import assert from 'node:assert/strict';
import { LOCAL, SOCLE, PRISES, ECLAIRAGE, BORNE, copie } from './_aides.js';
import { coterCheminement, coterComposant, coterSegment, libelleDeCote, reperesSurAxe } from '../src/geometrie/cotes.js';

const local = LOCAL();
const pres = SOCLE().presentation;
const opt = {
  libelles: pres.libelles.baies,
  libellesObstacles: pres.libelles.obstacles,
  portee: pres.porteeDeCote,
};
const tous = [PRISES(), ECLAIRAGE(), BORNE()];
const conduit = (ref) => tous.flatMap((a) => a.cheminements).find((c) => c.reference === ref);
const composant = (ref) => tous.flatMap((a) => a.composants).find((c) => c.reference === ref);
const dire = (cotes) => cotes.map(libelleDeCote);

test('la dérivation retrouve les cotes que le dossier cite à la main', () => {
  // Quatre cotes écrites dans quatre documents différents, aucune calculée par
  // une machine au moment où elle a été écrite.
  assert.deepEqual(
    dire(coterCheminement(local, conduit('CH-05'), opt)),
    ['0,20 m au nord du bord nord de la porte de service'],
    'FR-030 : l’axe de la paroi est se tient à 0,20 m du bord de la baie',
  );
  assert.deepEqual(
    dire(coterComposant(local, composant('PC-05'), opt))[1],
    '0,10 m au nord du rail de la porte sectionnelle',
    'PC-05 est passé de 0,20 à 0,10 m au nord du rail le 2026-09-23, entraîné par BD-05 sur l’axe ouest',
  );
  // L'antenne CH-02, cotée « 0,10 m au-dessus du linteau », a disparu dans la
  // goulotte GL-02, collée au plafond : c'est le plafond qui la fixe.
  assert.deepEqual(
    dire(coterCheminement(local, conduit('GL-02'), opt)),
    ['0,04 m en dessous du plafond', '0,04 m en dessous du plafond'],
    'la goulotte se trace depuis le plafond, qu’elle touche : son axe à une demi-largeur',
  );
  assert.ok(
    dire(coterComposant(local, composant('BR-01'), opt)).some((t) => /^0,50 m en dessous de l.allège de la fenêtre nord$/.test(t)),
    'FR-004 : un axe à 1,00 m laisse 0,50 m sous l’allège',
  );
});

test('un segment reçoit UNE cote, celle qui fixe sa ligne', () => {
  // Un traceur n'a pas besoin de deux mesures pour un tracé droit : une
  // horizontale se fixe par son altitude, une verticale par sa position le long
  // de la paroi.
  const vertical = conduit('CH-05').segments[0];
  const [cv] = coterSegment(local, vertical, opt);
  assert.equal(cv.axe, 'y', 'une verticale se cote le long de la paroi');

  const horizontal = conduit('GL-02').segments[0];
  const [ch] = coterSegment(local, horizontal, opt);
  assert.equal(ch.axe, 'z', 'une horizontale se cote en altitude');
});

test('un composant reçoit DEUX cotes, car un point demande deux mesures', () => {
  const cotes = coterComposant(local, composant('PC-01'), opt);
  assert.equal(cotes.length, 2);
  assert.deepEqual(cotes.map((c) => c.axe).sort(), ['y', 'z']);
});

test('un obstacle NON RELEVÉ n’est jamais un repère', () => {
  // On ne mesure pas depuis une chose qu'on n'a pas mesurée. Le tablier ouvert
  // n'a qu'un majorant : il borne un dégagement, il ne cote rien.
  for (const axe of ['x', 'y', 'z']) {
    for (const r of reperesSurAxe(local, axe, null, { ...opt, point: { x: 2.7, y: 1, z: 2.5 } })) {
      assert.ok(!/tablier|vantail|gabarit|portière/i.test(r.libelle), `« ${r.libelle} » n’est pas relevé`);
    }
  }
});

test('un repère hors de portée ne cote pas, même s’il est le plus proche', () => {
  // Sans la portée, le rail servait de repère à PC-01, distant de 2,86 m et sur
  // une AUTRE paroi : la cote était juste et intraçable au mètre ruban.
  const avec = dire(coterComposant(local, composant('PC-01'), opt));
  assert.ok(!avec.some((t) => /rail/.test(t)), 'le rail est hors de portée de PC-01');

  const sansPortee = dire(coterComposant(local, composant('PC-01'), { ...opt, portee: Infinity }));
  assert.ok(sansPortee.some((t) => /rail/.test(t)), 'sans portée, il revient — ce qui montre que le garde-fou sert');
});

test('un repère confondu avec l’objet ne produit pas une cote de zéro', () => {
  const l = copie(local);
  // Un socle posé pile sur le bord de la baie : la cote doit aller au repère
  // SUIVANT, pas annoncer « 0,00 m ».
  const c = { reference: 'X', paroi: 'est', position: { x: 5.6, y: 2.4, z: 0.3 } };
  const cotes = coterComposant(l, c, opt);
  for (const k of cotes) assert.ok(k.distance > 0, 'aucune cote nulle');
});

test('les cotes se lisent en français, sans « de le » ni « de de »', () => {
  for (const a of tous) {
    for (const ch of a.cheminements) {
      for (const t of dire(coterCheminement(local, ch, opt))) {
        assert.ok(!/ de (le|de|la paroi de)\b/.test(t), `« ${t} » se lit mal`);
        assert.match(t, /^\d+,\d{2} m (au nord|au sud|à l'est|à l'ouest|au-dessus|en dessous) /, t);
      }
    }
    for (const c of a.composants) {
      for (const t of dire(coterComposant(local, c, opt))) {
        assert.ok(!/ de (le|de)\b/.test(t), `« ${t} » se lit mal`);
      }
    }
  }
});
