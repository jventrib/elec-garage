import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

export const RACINE = join(dirname(fileURLToPath(import.meta.url)), '..');

export function lireJson(chemin) {
  return JSON.parse(readFileSync(join(RACINE, chemin), 'utf8'));
}

export const LOCAL = () => lireJson('data/local.json');
export const DEMO = () => lireJson('data/apports/000-demonstration.json');

/** Le socle : les quatre fichiers de données du projet, aucun facultatif. */
export const SOCLE = () => ({
  local: lireJson('data/local.json'),
  chantier: lireJson('data/chantier.json'),
  types: lireJson('data/types-composants.json'),
  presentation: lireJson('data/presentation.json'),
});

/** Copie profonde, pour qu'un cas fautif n'abîme pas le suivant. */
export const copie = (v) => JSON.parse(JSON.stringify(v));

export const regles = (defauts) => [...new Set(defauts.map((d) => d.regle))].sort();
