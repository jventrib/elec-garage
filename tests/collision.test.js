import test from 'node:test';
import assert from 'node:assert/strict';
import { SOCLE, DEMO, copie, socleAvecInconnus } from './_aides.js';
import { fusionner } from '../src/donnees/chargement.js';
import { VERDICTS, verdictSegment, controlerCollisions } from '../src/geometrie/collision.js';

const socle = SOCLE();
const pt = (x, y, z) => ({ x, y, z });
const seg = (face, de, a) => ({ face, de, a });

const obstacleConnu = (min, max) => ({
  id: 'obs-connu',
  etat: 'ferme',
  incertain: false,
  volume: { min, max },
});
const obstacleIncertain = { id: 'obs-incertain', etat: 'ouvert', incertain: true, volume: null };
// Encombrement non relevé, mais encadré par des cotes qui le sont.
const obstacleMajore = (min, max) => ({
  id: 'obs-majore',
  etat: 'ouvert',
  incertain: true,
  volume: null,
  volumeMajorant: { min, max },
});

test('un segment qui traverse un obstacle de volume connu est en collision', () => {
  const o = obstacleConnu(pt(5.5, 2.0, 1.0), pt(5.9, 3.5, 2.6));
  assert.equal(verdictSegment(seg('est', pt(5.6, 2.9, 2.5), pt(5.6, 2.9, 1.5)), o), VERDICTS.COLLISION);
});

test('un segment à l’écart d’un obstacle de volume connu est conforme', () => {
  const o = obstacleConnu(pt(0.0, 0.0, 0.0), pt(1.0, 1.0, 1.0));
  assert.equal(verdictSegment(seg('est', pt(5.6, 2.9, 2.5), pt(5.6, 2.9, 1.5)), o), VERDICTS.CONFORME);
});

test('un obstacle de volume inconnu rend NON CONCLUANT, jamais conforme', () => {
  // L'assertion qui protège contre une réponse rassurante plutôt que contre une
  // erreur. Trois obstacles sur quatre sont dans ce cas aujourd'hui.
  const v = verdictSegment(seg('est', pt(5.6, 2.9, 2.5), pt(5.6, 2.9, 1.5)), obstacleIncertain);
  assert.equal(v, VERDICTS.NON_CONCLUANT);
  assert.notEqual(v, VERDICTS.CONFORME);
});

test('un obstacle marqué incertain avec un volume renseigné reste non concluant', () => {
  const o = { ...obstacleConnu(pt(0, 0, 0), pt(1, 1, 1)), incertain: true };
  assert.equal(verdictSegment(seg('est', pt(5.6, 2.9, 2.5), pt(5.6, 2.9, 1.5)), o), VERDICTS.NON_CONCLUANT);
});

test('les trois verdicts sont trois valeurs distinctes', () => {
  const v = new Set(Object.values(VERDICTS));
  assert.equal(v.size, 3);
});

test('un segment disjoint d’un majorant est conforme : le dégagement est démontré', () => {
  // C'est tout l'intérêt d'un majorant. Être à l'écart du majorant place à l'écart
  // de l'obstacle réel, qui y est contenu — la conclusion est acquise sans que
  // l'encombrement exact soit connu.
  const o = obstacleMajore(pt(0.2, 0.0, 2.1), pt(5.2, 2.5, 2.75));
  assert.equal(verdictSegment(seg('nord', pt(1.0, 5.6, 2.6), pt(4.5, 5.6, 2.6)), o), VERDICTS.CONFORME);
});

test('un segment qui recoupe un majorant reste non concluant, et jamais en collision', () => {
  // L'autre moitié de l'asymétrie, et la seule qui protège : l'obstacle réel est
  // plus petit que son majorant, donc le recoupement ne prouve pas le choc.
  const o = obstacleMajore(pt(0.2, 0.0, 2.1), pt(5.2, 2.5, 2.75));
  const v = verdictSegment(seg('sud', pt(1.0, 1.0, 2.5), pt(4.0, 1.0, 2.5)), o);
  assert.equal(v, VERDICTS.NON_CONCLUANT);
  assert.notEqual(v, VERDICTS.COLLISION);
});

test('chaque forme d’obstacle rend exactement les verdicts qu’elle démontre', () => {
  // L'invariant qui compte, et qui ne dépend pas de l'état d'avancement du relevé :
  // un volume inconnu ne produit que « non concluant », un volume connu ne produit
  // jamais « non concluant ». La version précédente de ce test affirmait qu'aucun
  // contrôle ne concluait — vrai des données d'alors, faux dès qu'une cote arrive.
  const m = fusionner(socleAvecInconnus(socle), [DEMO()]);
  const r = controlerCollisions(m);
  assert.ok(r.resultats.length > 0, 'il doit y avoir des contrôles à faire');

  const parId = new Map(m.local.obstacles.map((o) => [o.id, o]));
  const vus = { relevé: 0, majoré: 0, inconnu: 0 };
  for (const x of r.resultats) {
    const o = parId.get(x.obstacle);
    if (o.volume && !o.incertain) {
      assert.notEqual(x.verdict, VERDICTS.NON_CONCLUANT, `${o.id} est relevé : il doit conclure`);
      vus.relevé += 1;
    } else if (o.volumeMajorant) {
      assert.notEqual(
        x.verdict,
        VERDICTS.COLLISION,
        `${o.id} n'est que borné : il ne peut pas affirmer une collision`,
      );
      vus.majoré += 1;
    } else {
      assert.equal(x.verdict, VERDICTS.NON_CONCLUANT, `${o.id} n'est pas relevé : il ne peut pas conclure`);
      vus.inconnu += 1;
    }
  }
  for (const [forme, n] of Object.entries(vus))
    assert.ok(n > 0, `le jeu doit exercer la forme « ${forme} »`);
  assert.equal(vus.relevé + vus.majoré + vus.inconnu, r.resultats.length);
});

test('le rail relevé est dégagé par tout le tracé de démonstration', () => {
  const m = fusionner(socle, [DEMO()]);
  const r = controlerCollisions(m);
  const rails = r.resultats.filter((x) => x.obstacle.startsWith('rail-'));
  assert.ok(rails.length > 0, 'le rail doit être déclaré et contrôlé');
  for (const x of rails) {
    assert.equal(x.verdict, VERDICTS.CONFORME, `${x.cheminement} segment ${x.segment} heurte le rail`);
  }
});

test('le tablier ouvert est borné, non relevé : il ne peut jamais affirmer de collision', () => {
  // Connaître le rail ne suffit pas : le tablier ouvert occupe toute la largeur de
  // la baie, non les 8 cm du rail. La hauteur de passage et la course du rail le
  // bornent, elles ne le mesurent pas.
  const m = fusionner(socle, [DEMO()]);
  const tablier = m.local.obstacles.find((o) => o.id === 'tablier-sectionnelle-ouvert');
  assert.ok(tablier.volumeMajorant, 'le tablier ouvert doit porter un majorant');
  assert.equal(tablier.volume, null, 'et ne pas prétendre être relevé');

  const r = controlerCollisions(m);
  const siens = r.resultats.filter((x) => x.obstacle === tablier.id);
  assert.ok(siens.length > 0, 'le tablier doit être contrôlé');
  for (const x of siens) {
    assert.notEqual(x.verdict, VERDICTS.COLLISION, `${x.cheminement} segment ${x.segment}`);
  }
  assert.equal(
    r.obstaclesNonConcluants.some((o) => o.id.startsWith('rail-')),
    false,
    'le rail est relevé : il ne doit plus figurer parmi les non concluants',
  );
});

test('le résumé nomme la cote manquante qui empêche de conclure', () => {
  const m = fusionner(socleAvecInconnus(socle), [DEMO()]);
  const r = controlerCollisions(m);
  assert.ok(r.obstaclesNonConcluants.length >= 1);
  for (const o of r.obstaclesNonConcluants) {
    assert.ok(typeof o.id === 'string' && o.id.length > 0);
    assert.ok(typeof o.raison === 'string' && o.raison.length > 0);
  }
});

test('un obstacle de volume connu produit un vrai verdict sur le jeu complet', () => {
  const socleModifie = copie(socle);
  const obs = socleModifie.local.obstacles.find((o) => o.id === 'tablier-sectionnelle-ouvert');
  obs.incertain = false;
  obs.volume = { min: { x: 0, y: 0, z: 2.2 }, max: { x: 5.6, y: 5.6, z: 2.75 } };
  delete obs.volumeMajorant; // les deux champs sont exclusifs (validerLocal)
  const m = fusionner(socleModifie, [DEMO()]);
  const r = controlerCollisions(m);
  // Le tablier occupe le haut du volume : l'antenne horizontale à 2,50 m le rencontre.
  assert.ok(r.collisions > 0, 'une collision réelle doit être trouvée');
  assert.ok(r.resultats.some((x) => x.verdict === VERDICTS.COLLISION && x.obstacle === obs.id));
});
