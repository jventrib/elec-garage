/**
 * Un clic et une rotation se terminent tous deux par un `pointerup`.
 *
 * Les confondre a coûté le focus : faire le tour d'un composant focalisé le faisait
 * sortir du composant. Ce fichier tient la frontière entre les deux gestes, et la
 * place de la garde qui en dépend.
 */

import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { RACINE } from './_aides.js';
import { aGlisse, SEUIL_GLISSE } from '../src/ui/designation.js';

/** Rejoue un geste : une origine, puis des positions successives. */
function geste(origine, points) {
  let bouge = false;
  for (const p of points) if (aGlisse(origine, p)) bouge = true;
  return bouge;
}

test('un pointeur qui ne bouge pas est un clic', () => {
  assert.equal(geste({ x: 120, y: 80 }, []), false, 'aucun mouvement');
  assert.equal(geste({ x: 120, y: 80 }, [{ x: 120, y: 80 }]), false, 'un move immobile non plus');
});

test('un tremblement de main reste un clic', () => {
  // Le seuil est strict : trois pixels cumulés passent encore, quatre non.
  assert.equal(aGlisse({ x: 0, y: 0 }, { x: 2, y: 1 }), false, `${SEUIL_GLISSE} px cumulés`);
  assert.equal(aGlisse({ x: 0, y: 0 }, { x: 3, y: 1 }), true, 'au-delà, c’est un glissé');
});

test('une rotation lente est un glissé, et non un clic', () => {
  // LA régression. `aBouge` se mesurait d'un `pointermove` au suivant : un geste
  // lent émet des pas de deux pixels, dont aucun ne franchit le seuil pris seul.
  // Mesurée ainsi, une rotation de deux cents pixels restait un « clic » — celui-là
  // même qui refermait la fiche et ramenait l'orbite au centre.
  const origine = { x: 400, y: 300 };
  const pas = [];
  for (let i = 1; i <= 100; i += 1) pas.push({ x: origine.x + 2 * i, y: origine.y });
  assert.equal(geste(origine, pas), true, '200 px parcourus par pas de 2 px');

  // Et la mesure fautive, rejouée, montre bien ce qu'elle laissait passer.
  let bougeSelonLAncienneMesure = false;
  let precedent = origine;
  for (const p of pas) {
    if (aGlisse(precedent, p)) bougeSelonLAncienneMesure = true;
    precedent = p;
  }
  assert.equal(bougeSelonLAncienneMesure, false, 'pas à pas, aucun pas ne déclenchait');
});

test('un aller-retour qui revient au point de départ n’est pas un clic', () => {
  // Il l'était avec la mesure pas à pas seulement par accident. Ici il est franchement
  // un glissé pendant le trajet, et le reste : `aBouge` ne redescend qu'au pointerdown
  // suivant. Désigner au retour d'un geste de cadrage n'aurait pas de sens.
  const origine = { x: 0, y: 0 };
  assert.equal(geste(origine, [{ x: 50, y: 0 }, { x: 0, y: 0 }]), true);
});

test('la vue publie le fait, et n’en garde pas deux lectures', () => {
  const src = readFileSync(join(RACINE, 'src/scene/vue.js'), 'utf8');
  assert.match(src, /estUnClic,/, 'estUnClic doit sortir de l’API de la vue');
  assert.match(src, /const estUnClic = \(\) => !aBouge;/, 'défini une seule fois');
  const objetSous = src.slice(src.indexOf('function objetSous'), src.indexOf('function objetSous') + 200);
  assert.match(objetSous, /if \(!estUnClic\(\)\) return null;/, 'objetSous lit le même fait');
  assert.equal(/> 3\)/.test(src), false, 'le seuil ne doit plus être écrit en dur dans la vue');
});

test('le geste retient son origine, distincte de sa dernière position', () => {
  // Les deux servent à des choses différentes : l'origine détecte le glissé, la
  // dernière position donne les deltas de rotation. Un seul champ pour les deux,
  // et la détection repart de zéro à chaque évènement.
  const src = readFileSync(join(RACINE, 'src/scene/vue.js'), 'utf8');
  const bas = src.slice(src.indexOf("addEventListener('pointerdown'"), src.indexOf("addEventListener('pointermove'"));
  assert.match(bas, /origine:\s*\{\s*x:\s*e\.clientX/, 'l’origine est figée au pointerdown');
  const deplacement = src.slice(src.indexOf("addEventListener('pointermove'"), src.indexOf('if (pointeurs.size === 1)'));
  assert.match(deplacement, /aGlisse\(p\.origine/, 'et c’est depuis elle que le glissé se mesure');
  assert.match(deplacement, /const dx = e\.clientX - p\.x;/, 'la rotation garde ses deltas pas à pas');
});

test('la garde précède tout ce qu’un glissé ne doit pas déclencher', () => {
  // Elle ne suffit pas à être présente : placée après `rafraichir()`, elle garderait
  // la fiche ouverte mais éteindrait la mise en évidence du circuit à chaque geste
  // d'orbite — le défaut déplacé plutôt que corrigé. Depuis le 2026-09-25, cette mise
  // en évidence est celle des trajets de conducteurs, `montrerTrajets`.
  const src = readFileSync(join(RACINE, 'src/main.js'), 'utf8');
  const debut = src.indexOf("addEventListener('pointerup'");
  // Les commentaires sont retirés avant de comparer les positions : celui qui
  // accompagne la garde cite `rafraichir()` pour expliquer pourquoi elle le précède,
  // et une première version du test lisait cette citation comme du code.
  const handler = src
    .slice(debut, src.indexOf('rafraichir();\n  return {', debut))
    .split('\n')
    .filter((l) => !/^\s*(\/\/|\*|\/\*)/.test(l))
    .join('\n');
  const garde = handler.indexOf('if (!vue.estUnClic()) return;');
  assert.ok(garde >= 0, 'la garde doit exister dans le gestionnaire de pointerup');
  for (const apres of ['rafraichir()', 'vue.objetSous(', 'fiche.vider()', 'montrerTrajets(', 'trajets.effacer()']) {
    assert.ok(handler.indexOf(apres) > garde, `la garde doit précéder ${apres}`);
  }
});

test('un clic franc hors de tout objet referme et ramène au centre', () => {
  // La contrepartie : à force de garder le focus, on pourrait ne plus jamais en sortir.
  const src = readFileSync(join(RACINE, 'src/main.js'), 'utf8');
  const handler = src.slice(src.indexOf("addEventListener('pointerup'"));
  assert.match(handler, /\}\s*else\s*\{\s*\n\s*fiche\.vider\(\);/, 'rien sous le pointeur -> la fiche se vide');
  const fermeture = src.slice(src.indexOf('surFermeture:'), src.indexOf('surFermeture:') + 160);
  assert.match(fermeture, /vue\.viser\(\{ cible: vue\.centre\(\) \}\)/, 'et la fermeture ramène au centre');
});
