/**
 * Les cotes manquantes : ce qui est dit, et où.
 *
 * Deux exigences en tension. Le Principe VI interdit qu'une cote inconnue passe
 * pour établie : l'avertissement doit donc exister. Mais un bandeau permanent
 * au-dessus de la maquette masque ce qu'on est venu regarder, et finit par être
 * ignoré — ce qui le rend pire qu'absent.
 *
 * La cause n'était pas la longueur du texte : c'est que les obstacles n'étaient
 * pas sélectionnables, et que leurs réserves n'avaient donc aucun objet où se
 * poser. Elles vivent maintenant sur l'obstacle lui-même, plus un compte dans
 * l'en-tête. Ces tests tiennent les deux bouts.
 */

import test from 'node:test';
import assert from 'node:assert/strict';
import { SOCLE, PRISES, socleAvecInconnus } from './_aides.js';
import { fusionner } from '../src/donnees/chargement.js';
import { construireObstacles } from '../src/scene/obstacles.js';
import { resumeIncertitudes } from '../src/ui/panneau-etape.js';
import { caracteristiquesObstacle, INCONNU } from '../src/ui/fiche-composant.js';
import { controlerCollisions } from '../src/geometrie/collision.js';

// Les cas « inconnu » se construisent, sans dépendre du relevé (voir _aides.js).
const socle = socleAvecInconnus(SOCLE());
const modele = fusionner(socle, [PRISES()]);
const obstacles = () => construireObstacles(modele.local, modele.presentation);
const bilan = () =>
  resumeIncertitudes({
    obstacles: obstacles().incertains,
    collisions: controlerCollisions(modele),
    libelles: modele.presentation.libelles,
  });

/* ---------------- Le compte dans l'en-tête ---------------- */

test('le résumé tient sur une ligne et ne contient aucun balisage', () => {
  const r = bilan();
  assert.equal(r.rien, false);
  assert.equal(r.resume.includes('<'), false, 'le résumé est du texte, il va dans un bouton');
  assert.ok(r.resume.length < 80, `résumé de ${r.resume.length} caractères : trop long pour un bouton`);
  assert.equal(r.resume.includes('(s)'), false, 'le pluriel est accordé, pas parenthésé');
});

test('le résumé distingue les cotes manquantes des encombrements bornés', () => {
  const r = bilan();
  assert.match(r.resume, /\d+ cotes? manquantes?/);
  assert.match(r.resume, /\d+ borné/);
});

test('une collision établie ouvre le résumé et se retrouve dans le détail', () => {
  const r = resumeIncertitudes({
    obstacles: [],
    collisions: { nonConcluants: 0, conformes: 0, resultats: [{}, {}], collisions: 2, obstaclesNonConcluants: [] },
  });
  assert.equal(r.rien, false, 'une collision seule suffit à parler');
  assert.match(r.resume, /^2 COLLISIONS ÉTABLIES/, 'elle passe en tête, et en capitales');
  assert.equal(r.collisions, 2);
  assert.match(r.detail, /avant toute pose/);
});

test('sans rien à signaler, le bilan se taît au lieu de rassurer', () => {
  const r = resumeIncertitudes({
    obstacles: [],
    collisions: { nonConcluants: 0, conformes: 4, resultats: [{}, {}], collisions: 0, obstaclesNonConcluants: [] },
  });
  assert.equal(r.rien, true);
  assert.equal(r.resume, '');
  assert.equal(r.detail, '');
});

test('le détail nomme chaque obstacle une fois, et en clair', () => {
  const r = bilan();
  const incertains = obstacles().incertains;
  const lignes = [...r.detail.matchAll(/<tr><td>(.*?)<\/td>/g)].map((m) => m[1]);
  assert.equal(lignes.length, incertains.length, 'une ligne par incertitude, sans doublon');
  for (const inc of incertains) {
    assert.ok(inc.libelle, `${inc.id} doit porter un libellé, déclaré dans data/local.json`);
    assert.equal(lignes.filter((l) => l === inc.libelle).length, 1, `${inc.libelle} une seule fois`);
  }
  assert.equal(
    lignes.some((l) => /^[a-z0-9-]+$/.test(l)),
    false,
    'aucun identifiant machine ne doit s’afficher à la place d’un libellé',
  );
});

/* ---------------- La fiche de l'obstacle ---------------- */

test('un obstacle est sélectionnable, et seulement s’il est visible', () => {
  const o = obstacles();
  const meshes = o.meshes();
  assert.ok(meshes.length > 0, 'des obstacles doivent être désignables');
  // Le rayon de three.js ne teste pas la visibilité : le filtre est à notre charge.
  for (const m of meshes) assert.equal(m.parent.visible, true, 'un obstacle masqué ne doit pas être désignable');

  o.montrerEtat('ouvert');
  const ouverts = o.meshes();
  o.montrerEtat('ferme');
  const fermes = o.meshes();
  assert.notDeepEqual(
    ouverts.map((m) => m.name).sort(),
    fermes.map((m) => m.name).sort(),
    'la bascule des ouvrants doit changer ce qui est désignable',
  );
});

test('le mesh désigné rend bien son obstacle', () => {
  const o = obstacles();
  for (const m of o.meshes()) {
    const obstacle = o.obstacleDe(m);
    assert.ok(obstacle, `${m.name} doit rendre son obstacle`);
    assert.ok(obstacle.libelle, 'et cet obstacle porte un libellé');
  }
  assert.equal(o.obstacleDe(null), null);
  assert.equal(o.obstacleDe({}), null);
});

test('la fiche d’un obstacle relevé annonce une cote complète', () => {
  const o = obstacles();
  const rail = modele.local.obstacles.find((x) => x.volume && !x.incertain);
  const l = caracteristiquesObstacle(rail, o.incertitudeDe(rail.id), modele.presentation.libelles, null);
  const par = new Map(l.map((x) => [x.libelle, x]));
  assert.equal(par.get('État de la cote').texte, 'relevé');
  assert.equal(par.get('Ce qui manque').texte, 'rien');
  assert.equal(par.get('Étendue relevée').inconnu, false, 'un volume relevé se chiffre');
  assert.equal(par.get('Majorant déduit').texte, INCONNU, 'et n’a pas de majorant');
});

test('la fiche d’un obstacle borné distingue le majorant d’une mesure', () => {
  const o = obstacles();
  const t = modele.local.obstacles.find((x) => x.volumeMajorant);
  const l = caracteristiquesObstacle(t, o.incertitudeDe(t.id), modele.presentation.libelles, null);
  const par = new Map(l.map((x) => [x.libelle, x]));
  assert.equal(par.get('État de la cote').texte, 'borné, non mesuré');
  assert.equal(par.get('Étendue relevée').texte, INCONNU, 'rien n’est mesuré');
  assert.equal(par.get('Majorant déduit').inconnu, false, 'mais la borne se chiffre');
  assert.equal(par.get('Dessiné').texte, 'majorant déduit');
  assert.ok(par.get('Borné par'), 'un obstacle borné dit ce qui le borne, non ce qui manque');
  assert.equal(par.has('Ce qui manque'), false, 'et n’affiche pas l’étiquette « Ce qui manque »');
});

test('la fiche d’un obstacle inconnu ne comble aucune valeur', () => {
  const o = obstacles();
  const v = modele.local.obstacles.find((x) => !x.volume && !x.volumeMajorant);
  const l = caracteristiquesObstacle(v, o.incertitudeDe(v.id), modele.presentation.libelles, null);
  const par = new Map(l.map((x) => [x.libelle, x]));
  assert.equal(par.get('État de la cote').texte, 'non relevé');
  assert.equal(par.get('Étendue relevée').texte, INCONNU);
  assert.equal(par.get('Majorant déduit').texte, INCONNU);
  assert.ok(par.get('Ce qui manque').texte !== INCONNU, 'ce qui manque doit être nommé, pas laissé vide');
});

test('la fiche porte le bilan des contrôles propres à cet obstacle', () => {
  const o = obstacles();
  const r = controlerCollisions(modele);
  const t = modele.local.obstacles.find((x) => x.volumeMajorant);
  const siens = r.resultats.filter((x) => x.obstacle === t.id);
  const controles = {
    conforme: siens.filter((x) => x.verdict === 'conforme').length,
    collision: siens.filter((x) => x.verdict === 'en-collision').length,
    nonConcluant: siens.filter((x) => x.verdict === 'non-concluant').length,
  };
  const l = caracteristiquesObstacle(t, o.incertitudeDe(t.id), modele.presentation.libelles, controles);
  const par = new Map(l.map((x) => [x.libelle, x]));
  assert.equal(par.get('Contrôles conformes').texte, String(controles.conforme));
  assert.equal(par.get('En collision').texte, '0', 'un majorant ne peut jamais affirmer de collision');
  assert.ok(controles.conforme > 0, 'le tracé est prouvé dégagé du tablier borné');
});

