/**
 * L'occupation des faces du garage, décompte reproductible.
 *
 * `implantation.md` affirme que la paroi ouest est la seule face entièrement libre, et
 * que le rangement s'y implantera. Cette affirmation doit pouvoir être rejouée : un
 * décompte recopié dans un document finit par diverger de l'apport qu'il décrit, et
 * c'est au moment d'un ajout de composant qu'on s'en aperçoit, trop tard.
 *
 * Le script lit les apports **déclarés dans `index.json`**, et non le répertoire :
 * `000-demonstration.json` est un jeu de démonstration qui n'entre dans aucun calcul,
 * et le compter gonflerait la paroi est de onze objets qui n'existent pas au chantier.
 *
 * Les cheminements ne déclarent pas de `paroi` : ils portent un `face` par segment,
 * et c'est cet ensemble de faces qui compte. Une face peut ainsi porter des composants
 * et aucun conduit, l'inverse aussi.
 *
 *   node dossier/006-rangement/occupation-parois.mjs
 */

import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const RACINE = join(dirname(fileURLToPath(import.meta.url)), '..', '..');
const lireJson = (chemin) => JSON.parse(readFileSync(join(RACINE, chemin), 'utf8'));

const index = lireJson('data/apports/index.json');
const composantsParParoi = new Map();
const facesCheminements = new Set();

for (const nom of index) {
  const apport = lireJson(`data/apports/${nom}.json`);
  for (const c of apport.composants ?? []) {
    if (!composantsParParoi.has(c.paroi)) composantsParParoi.set(c.paroi, []);
    composantsParParoi.get(c.paroi).push(c.reference ?? c.id);
  }
  for (const ch of apport.cheminements ?? []) {
    for (const s of ch.segments ?? []) facesCheminements.add(s.face);
  }
}

const faces = ['nord', 'est', 'sud', 'ouest', 'plafond'];

console.log('Apports déclarés dans index.json :', index.length, '—', index.join(', '));
console.log();
console.log('| Face | Composants | Nb | Cheminement |');
console.log('|---|---|---|---|');

for (const face of faces) {
  const ids = composantsParParoi.get(face) ?? [];
  const trace = facesCheminements.has(face);
  console.log(`| ${face} | ${ids.length ? ids.join(', ') : '—'} | ${ids.length} | ${trace ? 'oui' : '**aucune**'} |`);
}

const libres = faces.filter(
  (f) => !(composantsParParoi.get(f)?.length) && !facesCheminements.has(f),
);

console.log();
console.log('Faces sans composant et sans cheminement :', libres.length ? libres.join(', ') : 'aucune');
