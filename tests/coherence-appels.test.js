import test from 'node:test';
import assert from 'node:assert/strict';
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { RACINE } from './_aides.js';

/*
 * Un appel privé d'un argument obligatoire est du JavaScript parfaitement valide :
 * `node --check` ne le voit pas, et le paramètre vaut simplement `undefined`
 * jusqu'à ce qu'on le déréférence, souvent dans une autre fonction. C'est
 * exactement ainsi qu'un `gabarit(composant)` amputé de son catalogue a produit un
 * « Cannot read properties of undefined » à trente lignes de là.
 *
 * Ce test compare l'arité déclarée de chaque fonction du projet à celle de ses
 * appels.
 */

function fichiersJs(repertoire) {
  const sortie = [];
  for (const entree of readdirSync(repertoire)) {
    const chemin = join(repertoire, entree);
    if (statSync(chemin).isDirectory()) sortie.push(...fichiersJs(chemin));
    else if (entree.endsWith('.js')) sortie.push(chemin);
  }
  return sortie;
}

/** Paramètres obligatoires : ni valeur par défaut, ni reste. */
function ariteObligatoire(parametres) {
  if (parametres.trim() === '') return 0;
  const morceaux = decouperArguments(parametres);
  let n = 0;
  for (const m of morceaux) {
    if (m.includes('=') || m.trim().startsWith('...')) break;
    n += 1;
  }
  return n;
}

/** Découpe une liste d'arguments en respectant les parenthèses et accolades. */
function decouperArguments(texte) {
  const morceaux = [];
  let profondeur = 0;
  let courant = '';
  let chaine = null;
  for (const c of texte) {
    if (chaine) {
      courant += c;
      if (c === chaine) chaine = null;
      continue;
    }
    if (c === "'" || c === '"' || c === '`') {
      chaine = c;
      courant += c;
      continue;
    }
    if ('([{'.includes(c)) profondeur += 1;
    if (')]}'.includes(c)) profondeur -= 1;
    if (c === ',' && profondeur === 0) {
      morceaux.push(courant);
      courant = '';
      continue;
    }
    courant += c;
  }
  if (courant.trim() !== '') morceaux.push(courant);
  return morceaux;
}

/** Extrait la liste d'arguments d'un appel, à partir de la parenthèse ouvrante. */
function argumentsDeLAppel(source, indexParenthese) {
  let profondeur = 0;
  let chaine = null;
  for (let i = indexParenthese; i < source.length; i++) {
    const c = source[i];
    if (chaine) {
      if (c === chaine) chaine = null;
      continue;
    }
    if (c === "'" || c === '"' || c === '`') {
      chaine = c;
      continue;
    }
    if (c === '(') profondeur += 1;
    else if (c === ')') {
      profondeur -= 1;
      if (profondeur === 0) return source.slice(indexParenthese + 1, i);
    }
  }
  return null;
}

test('aucun appel de fonction du projet n’est privé d’un argument obligatoire', () => {
  const fichiers = fichiersJs(join(RACINE, 'src'));
  const sources = new Map(fichiers.map((f) => [f, readFileSync(f, 'utf8')]));

  // Index par fichier : deux modules peuvent déclarer le même nom avec des
  // signatures différentes, et les confondre produirait de faux positifs.
  const parFichier = new Map();
  let total = 0;
  for (const [fichier, source] of sources) {
    const locales = new Map();
    const motif = /^(?:export\s+)?(?:async\s+)?function\s+([A-Za-z_$][\w$]*)\s*\(([^)]*)\)/gm;
    for (const m of source.matchAll(motif)) {
      locales.set(m[1], ariteObligatoire(m[2]));
      total += 1;
    }
    parFichier.set(fichier, locales);
  }
  assert.ok(total > 20, `trop peu de fonctions trouvées (${total})`);

  /** Résout les noms importés vers le fichier qui les déclare. */
  function portee(fichier, source) {
    const visibles = new Map(parFichier.get(fichier));
    for (const m of source.matchAll(/^import\s*\{([\s\S]*?)\}\s*from\s*['"](\.[^'"]+)['"]/gm)) {
      const cible = join(fichier, '..', m[2]);
      const declarees = parFichier.get(cible);
      if (!declarees) continue;
      for (const liaison of m[1].split(',')) {
        const nom = liaison.trim().split(/\s+as\s+/)[0].trim();
        if (declarees.has(nom) && !visibles.has(nom)) visibles.set(nom, declarees.get(nom));
      }
    }
    return visibles;
  }

  const fautes = [];
  for (const [fichier, source] of sources) {
    for (const [nom, arite] of portee(fichier, source)) {
      if (arite === 0) continue;
      const motif = new RegExp(`(?<![\\w$.])${nom}\\s*\\(`, 'g');
      for (const m of source.matchAll(motif)) {
        const avant = source.slice(Math.max(0, m.index - 30), m.index);
        if (/\bfunction\s+$/.test(avant) || /\bexport\s+function\s+$/.test(avant)) continue;
        const args = argumentsDeLAppel(source, m.index + m[0].length - 1);
        if (args === null) continue;
        const fournis = decouperArguments(args).length;
        if (fournis < arite) {
          const ligne = source.slice(0, m.index).split('\n').length;
          fautes.push(
            `${fichier.replace(RACINE + '/', '')}:${ligne} — ${nom}() reçoit ${fournis} argument(s), ${arite} obligatoire(s)`,
          );
        }
      }
    }
  }
  assert.deepEqual(fautes, [], `Appels incomplets :\n  - ${fautes.join('\n  - ')}`);
});
