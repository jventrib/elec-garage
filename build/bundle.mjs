/**
 * Produit dist/garage.html : un fichier unique, ouvrable depuis le système de
 * fichiers, sans serveur et sans réseau.
 *
 * Pourquoi ce détour plutôt que de servir le site : un navigateur refuse de
 * charger un module ES depuis file:// — l'origine y est opaque et le contrôle
 * d'origine échoue — et refuse de même un fetch() vers un fichier voisin. Une
 * tablette sur un chantier ne fait pas tourner de serveur. Le fichier unique
 * lève les deux blocages : plus aucun import, plus rien à charger.
 *
 * Pourquoi un registre de modules plutôt qu'une simple concaténation : trois.core
 * et three.module déclarent chacun des privés de même nom (_m1, _v0, _id...).
 * En modules ES ce sont des portées distinctes ; concaténés dans une seule
 * portée, ils s'écrasent silencieusement. Chaque fichier garde donc sa fonction,
 * et les liens passent par un require minimal.
 *
 * Usage : node build/bundle.mjs [--demo]
 */

import { readFileSync, writeFileSync, mkdirSync, readdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import vm from 'node:vm';

const RACINE = join(dirname(fileURLToPath(import.meta.url)), '..');
const lire = (p) => readFileSync(join(RACINE, p), 'utf8');

const ENTREE = 'src/main.js';

/** Doit rester aligné sur FICHIERS_SOCLE de src/donnees/chargement.js. */
const FICHIERS_SOCLE = {
  local: 'data/local.json',
  chantier: 'data/chantier.json',
  types: 'data/types-composants.json',
  presentation: 'data/presentation.json',
};

/** Normalise un chemin relatif en identifiant canonique depuis la racine. */
function resoudre(depuis, spec) {
  if (!spec.startsWith('.')) throw new Error(`Spécificateur non relatif interdit : ${spec}`);
  const base = dirname(depuis).split('/').filter(Boolean);
  for (const part of spec.split('/')) {
    if (part === '.' || part === '') continue;
    if (part === '..') base.pop();
    else base.push(part);
  }
  return base.join('/');
}

/** Découpe la source en instructions de module et corps restant. */
function analyser(source, chemin) {
  const lignes = source.split('\n');
  const corps = [];
  const imports = [];
  const reexports = [];
  const exports = [];
  let tampon = null;

  const bindings = (bloc) =>
    bloc
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean)
      .map((s) => {
        const m = /^([A-Za-z_$][\w$]*)(?:\s+as\s+([A-Za-z_$][\w$]*))?$/.exec(s);
        if (!m) throw new Error(`Liaison non reconnue dans ${chemin} : « ${s} »`);
        return { local: m[1], expose: m[2] ?? m[1] };
      });

  const traiter = (instruction) => {
    let m;
    if ((m = /^import\s*\{([\s\S]*?)\}\s*from\s*['"]([^'"]+)['"]\s*;?$/.exec(instruction))) {
      imports.push({ spec: m[2], bindings: bindings(m[1]) });
    } else if ((m = /^export\s*\{([\s\S]*?)\}\s*from\s*['"]([^'"]+)['"]\s*;?$/.exec(instruction))) {
      reexports.push({ spec: m[2], bindings: bindings(m[1]) });
    } else if ((m = /^export\s*\{([\s\S]*?)\}\s*;?$/.exec(instruction))) {
      exports.push(...bindings(m[1]));
    } else {
      throw new Error(`Forme de module non prise en charge dans ${chemin} :\n${instruction.slice(0, 120)}`);
    }
  };

  for (const ligne of lignes) {
    if (tampon !== null) {
      tampon += '\n' + ligne;
      if (/;\s*$/.test(ligne) || /\}\s*$/.test(ligne)) {
        if (/^\s*import|^\s*export/.test(tampon) && !/from\s*['"][^'"]+['"]\s*;?\s*$/.test(tampon) && !/\}\s*;?\s*$/.test(tampon)) continue;
        traiter(tampon.trim());
        tampon = null;
      }
      continue;
    }
    if (/^(import|export)\s*[{*]/.test(ligne) || /^import\s+['"]/.test(ligne)) {
      if (/;\s*$/.test(ligne)) traiter(ligne.trim());
      else tampon = ligne;
      continue;
    }
    const decl = /^export\s+(?=(const|let|var|function|async\s+function|class)\b)/.exec(ligne);
    if (decl) {
      const nom = /^export\s+(?:const|let|var|class|function|async\s+function)\s+([A-Za-z_$][\w$]*)/.exec(ligne);
      if (!nom) throw new Error(`Déclaration exportée illisible dans ${chemin} : ${ligne.slice(0, 80)}`);
      exports.push({ local: nom[1], expose: nom[1] });
      corps.push(ligne.replace(/^export\s+/, ''));
      continue;
    }
    if (/^export\b/.test(ligne)) throw new Error(`Export non pris en charge dans ${chemin} : ${ligne.slice(0, 80)}`);
    corps.push(ligne);
  }
  if (tampon !== null) throw new Error(`Instruction de module non terminée dans ${chemin}.`);
  return { corps: corps.join('\n'), imports, reexports, exports };
}

/** Parcourt le graphe depuis l'entrée. L'ordre de définition n'a pas d'importance. */
function collecter(entree) {
  const modules = new Map();
  const aFaire = [entree];
  while (aFaire.length) {
    const chemin = aFaire.shift();
    if (modules.has(chemin)) continue;
    const analyse = analyser(lire(chemin), chemin);
    modules.set(chemin, analyse);
    for (const i of [...analyse.imports, ...analyse.reexports]) {
      aFaire.push(resoudre(chemin, i.spec));
    }
  }
  return modules;
}

function emettre(modules) {
  const blocs = [];
  for (const [chemin, a] of modules) {
    const prelude = a.imports
      .map((i) => {
        const dest = i.bindings.map((b) => (b.local === b.expose ? b.local : `${b.expose}: ${b.local}`));
        return `const { ${dest.join(', ')} } = __require(${JSON.stringify(resoudre(chemin, i.spec))});`;
      })
      .join('\n');

    const reexp = a.reexports
      .map((r, n) => `const __re${n} = __require(${JSON.stringify(resoudre(chemin, r.spec))});`)
      .join('\n');

    const champs = [
      ...a.exports.map((e) => `${JSON.stringify(e.expose)}: ${e.local}`),
      ...a.reexports.flatMap((r, n) => r.bindings.map((b) => `${JSON.stringify(b.expose)}: __re${n}.${b.local}`)),
    ];

    blocs.push(
      `__def(${JSON.stringify(chemin)}, function (__require) {\n'use strict';\n${reexp}\n${prelude}\n` +
        `${a.corps}\nreturn { ${champs.join(', ')} };\n});`,
    );
  }
  return blocs.join('\n\n');
}

function construire({ avecDemo }) {
  const modules = collecter(ENTREE);

  // Les quatre fichiers de données du socle, en ligne dans le livrable.
  const socle = {};
  for (const [cle, chemin] of Object.entries(FICHIERS_SOCLE)) socle[cle] = JSON.parse(lire(chemin));
  const noms = readdirSync(join(RACINE, 'data/apports'))
    .filter((f) => f.endsWith('.json') && f !== 'index.json')
    .map((f) => f.replace(/\.json$/, ''))
    .sort();
  const retenus = noms.filter((n) => avecDemo || !n.startsWith('000-'));
  const exclus = noms.filter((n) => !retenus.includes(n));
  const apports = retenus.map((n) => JSON.parse(lire(`data/apports/${n}.json`)));
  const donnees = JSON.stringify({ socle, apports }).replace(/</g, '\\u003c');

  const runtime = `
var __fabriques = {}, __cache = {};
function __def(id, f) { __fabriques[id] = f; }
function __require(id) {
  if (Object.prototype.hasOwnProperty.call(__cache, id)) return __cache[id];
  var f = __fabriques[id];
  if (!f) throw new Error('Module absent du bundle : ' + id);
  var exports = f(__require);
  __cache[id] = exports;
  return exports;
}`;

  const payload = `'use strict';
globalThis.__DONNEES__ = ${donnees};
${runtime}

${emettre(modules)}

__require(${JSON.stringify(ENTREE)});`;

  // Si le bundle ne parse pas, on échoue ici plutôt que de livrer un fichier mort.
  new vm.Script(payload, { filename: 'garage.bundle.js' });

  const echappe = payload.replace(/<\/script/gi, '<\\/script');
  // Remplacement par FONCTION, et non par chaîne. Une chaîne de remplacement
  // interprète $&, $` et $' : le code de three.js contient « + '$' », que
  // String.replace transformerait en « + ' » suivi de toute la fin du document.
  // Le fichier livré serait syntaxiquement mort, sans que rien ne le signale.
  const html = lire('index.html').replace(
    /<script type="module" src="\.\/src\/main\.js"><\/script>/,
    () => `<script>\n(function(){\n${echappe}\n})();\n</script>`,
  );
  if (html.includes('src="./src/main.js"')) {
    throw new Error("La balise de script du développement n'a pas été remplacée.");
  }

  mkdirSync(join(RACINE, 'dist'), { recursive: true });
  writeFileSync(join(RACINE, 'dist/garage.html'), html, 'utf8');

  verifierLivrable(join(RACINE, 'dist/garage.html'));
  return { octets: Buffer.byteLength(html), modules: modules.size, retenus, exclus };
}

/**
 * Contrôle du fichier réellement écrit, et non de ce qu'on croit avoir écrit.
 * On ressort le script du HTML livré, on le parse, puis on l'évalue sans
 * `document` : main.js ne démarre pas, mais tout le graphe de modules s'exécute.
 * C'est ce qui aurait attrapé la corruption par $' du premier jet.
 */
function verifierLivrable(chemin) {
  const html = readFileSync(chemin, 'utf8');

  const externes = [...html.matchAll(/(?:src|href)\s*=\s*["']([^"']+)["']/gi)]
    .map((m) => m[1])
    .filter((u) => /^(https?:)?\/\//i.test(u));
  if (externes.length > 0) {
    throw new Error(`Le livrable référence des ressources externes : ${externes.join(', ')}`);
  }
  if (/<script[^>]*\ssrc=/i.test(html)) {
    throw new Error('Le livrable charge encore un script externe.');
  }

  const m = /<script>\n\(function\(\)\{\n([\s\S]*)\n\}\)\(\);\n<\/script>/.exec(html);
  if (!m) throw new Error('Charge utile introuvable dans le livrable.');
  const code = m[1].replace(/<\\\/script/g, '</script');

  const bac = {
    console: { log() {}, warn() {}, error() {} },
    Math, JSON, Date, Object, Array, Error, Number, String, Boolean, Promise,
    Map, Set, WeakMap, WeakSet, Symbol, Reflect, Proxy, RegExp, isNaN, parseInt, parseFloat,
    Uint8Array, Uint16Array, Uint32Array, Int8Array, Int16Array, Int32Array,
    Float32Array, Float64Array, Uint8ClampedArray, ArrayBuffer, DataView,
    fetch() {
      throw new Error('Le livrable ne doit rien charger à l’exécution.');
    },
  };
  bac.globalThis = bac;
  bac.self = bac;
  vm.createContext(bac);
  new vm.Script(code, { filename: 'garage.livre.js' }).runInContext(bac, { timeout: 30000 });

  if (!bac.__DONNEES__) throw new Error('Les données ne sont pas en ligne dans le livrable.');
  for (const cle of Object.keys(FICHIERS_SOCLE)) {
    if (!bac.__DONNEES__.socle?.[cle]) {
      throw new Error(`Le fichier de socle « ${cle} » n'est pas en ligne dans le livrable.`);
    }
  }
  console.log(
    `  vérifié : graphe évalué hors ligne, ${Object.keys(FICHIERS_SOCLE).length} fichiers de socle et ` +
      `${bac.__DONNEES__.apports.length} apport(s) en ligne, aucune ressource externe`,
  );
}

const r = construire({ avecDemo: process.argv.includes('--demo') });
console.log(`dist/garage.html écrit — ${(r.octets / 1024 / 1024).toFixed(2)} Mo`);
console.log(`  modules empaquetés : ${r.modules}`);
console.log(`  apports inclus : ${r.retenus.join(', ') || '(aucun)'}`);
if (r.exclus.length) console.log(`  apports exclus du livrable chantier : ${r.exclus.join(', ')}`);
