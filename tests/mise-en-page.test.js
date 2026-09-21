/**
 * La stabilité du cadre 3D, vérifiée sur le texte des sources.
 *
 * Ces assertions ne remplacent pas un œil dans un navigateur : elles empêchent la
 * régression précise qui a été corrigée. Le pied de page avait une hauteur
 * `auto` ; comme l'instruction d'une étape va de cinq à vingt-trois lignes, sa
 * hauteur changeait à chaque pas et le viewport 3D absorbait la différence. La vue
 * paraissait sauter alors que la caméra n'avait pas bougé.
 *
 * Deux conditions doivent tenir ensemble, et c'est pourquoi les deux sont testées :
 * la mise en page ne doit pas dépendre du contenu, et le rendu doit observer son
 * conteneur — sinon un reflux qui échappe à l'évènement « resize » de la fenêtre
 * laisse le canvas étiré par la feuille de style, avec un rapport d'aspect périmé.
 */

import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { RACINE } from './_aides.js';

const lire = (chemin) => readFileSync(join(RACINE, chemin), 'utf8');

test('la hauteur du pied de page est fixée par la grille, non par son contenu', () => {
  const html = lire('index.html');
  assert.match(
    html,
    /grid-template-rows:\s*auto\s+1fr\s+var\(--pied\)/,
    'la piste du pied doit être une longueur déterminée, pas « auto »',
  );
  assert.match(html, /--pied:\s*clamp\(/, '--pied doit être borné : un plancher et un plafond');
});

test('aucune règle ne laisse la hauteur du pied suivre la longueur de l’étape', () => {
  const html = lire('index.html');
  // C'est la forme exacte qui a causé la panne : une hauteur maximale sur les
  // enfants du pied, sans hauteur déterminée sur le pied lui-même.
  assert.equal(
    /footer\s*>\s*div\s*\{[^}]*max-height/.test(html),
    false,
    'une max-height sur les enfants du pied le rend à nouveau élastique',
  );
  assert.equal(
    /footer\s*\{[^}]*height:\s*auto/.test(html),
    false,
    'le pied ne doit pas revenir à une hauteur automatique',
  );
});

test('le panneau d’étape défile au lieu de pousser la mise en page', () => {
  const html = lire('index.html');
  const regle = html.match(/#etape\s*\{[^}]*\}/);
  assert.ok(regle, 'la règle #etape doit exister');
  assert.match(regle[0], /overflow-y:\s*auto/, "l'étape doit défiler");
  // Sans min-height: 0, un enfant de grille refuse d'être plus petit que son
  // contenu : le débordement ne se déclenche jamais et la grille s'étire.
  assert.match(regle[0], /min-height:\s*0/, 'min-height: 0 est ce qui autorise le débordement');
});

test('la vue observe son conteneur, et pas seulement la fenêtre', () => {
  const vue = lire('src/scene/vue.js');
  assert.match(vue, /new ResizeObserver\(/, 'le conteneur doit être observé');
  assert.match(vue, /observateur\.observe\(conteneur\)/, "c'est le conteneur de la scène qui est observé");
  assert.match(vue, /observateur\.disconnect\(\)/, "l'observateur doit être relâché à l'arrêt");
});

test('la vue reste fonctionnelle là où ResizeObserver n’existe pas', () => {
  // Le livrable est réévalué hors navigateur par le bundler : une dépendance dure
  // à ResizeObserver y jetterait une exception au chargement.
  const vue = lire('src/scene/vue.js');
  assert.match(
    vue,
    /typeof ResizeObserver === 'function'/,
    'la présence de ResizeObserver doit être testée avant usage',
  );
  assert.match(vue, /addEventListener\('resize', redimensionner\)/, 'un repli sur la fenêtre doit subsister');
});

test('le pied replié garde une hauteur fixe, assez haute pour les commandes gantées', () => {
  const html = lire('index.html');
  // Replier est un geste de l'utilisateur : le cadre peut changer, mais par une
  // longueur déclarée, jamais par le contenu de l'étape.
  assert.match(html, /body\.etape-repliee\s*\{\s*--pied:\s*var\(--pied-replie\)/);
  const cible = Number(html.match(/--cible:\s*(\d+)px/)[1]);
  const replies = [...html.matchAll(/--pied-replie:\s*(\d+)px/g)].map((m) => Number(m[1]));
  assert.ok(replies.length >= 2, 'une hauteur repliée par mise en page, large et étroite');
  // Pied : bordure de 2 px et 8 px de marge haute et basse, autour des boutons.
  for (const h of replies) assert.ok(h >= cible + 18, `${h} px ne loge pas une cible de ${cible} px`);
  assert.match(html, /#controles \.nav\s*\{[^}]*min-height:\s*var\(--cible\)/, 'les boutons de navigation gardent leur cible');
});

test('replié, seuls l’instruction et les listes disparaissent', () => {
  const html = lire('index.html');
  const regles = [...html.matchAll(/([^{}]*body\.etape-repliee[^{}]*)\{[^}]*display:\s*none/g)].map((m) => m[1]);
  const masques = regles.join(',');
  assert.match(masques, /\.instruction/);
  assert.match(masques, /\.bloc/);
  // L'en-tête porte le rang (FR-018) et le badge SOUS TENSION : il reste visible.
  assert.doesNotMatch(masques, /\.entete|\.rang|\.tension|#controles/);
});

test('chaque bouton de l’en-tête est câblé au chargement, et non dans le gestionnaire d’un autre', () => {
  // Défaut trouvé le 2026-09-24 : le câblage des « Cotes de tracé » avait glissé
  // DANS le gestionnaire de clic de « Ouvrants ». Le bouton ne faisait rien avant
  // un premier clic sur l'autre, et chaque clic sur l'autre lui ajoutait un
  // écouteur de plus — deux bascules qui s'annulent. Les boutons de l'en-tête
  // doivent tous être câblés au même niveau d'imbrication.
  const main = lire('src/main.js');
  const profondeur = (motif) => {
    const i = main.indexOf(motif);
    assert.ok(i >= 0, `${motif} introuvable`);
    let p = 0;
    for (const c of main.slice(0, i)) p += c === '{' ? 1 : c === '}' ? -1 : 0;
    return p;
  };
  const reference = profondeur("el('ouvrants')");
  for (const id of ['tracage', 'mode-camera', 'cotes']) {
    assert.equal(profondeur(`el('${id}')`), reference, `le bouton « ${id} » est câblé à une autre profondeur`);
  }
});
