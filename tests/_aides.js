import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

export const RACINE = join(dirname(fileURLToPath(import.meta.url)), '..');

export function lireJson(chemin) {
  return JSON.parse(readFileSync(join(RACINE, chemin), 'utf8'));
}

export const LOCAL = () => lireJson('data/local.json');
export const DEMO = () => lireJson('data/apports/000-demonstration.json');
export const PRISES = () => lireJson('data/apports/002-prises-de-courant.json');
// L'éclairage ne déclare pas le tableau : il s'y raccorde. Il n'est donc pas
// validable seul, et se lit toujours avec l'apport des prises (R10).
export const ECLAIRAGE = () => lireJson('data/apports/003-eclairage.json');
// La borne non plus ne déclare pas le tableau : elle s'y raccorde par la
// position. Elle traverse en outre deux boîtes déclarées par les prises, dont
// elle a besoin des `dimensions` pour être seulement exprimable — elle se lit
// donc toujours avec les deux autres apports.
export const BORNE = () => lireJson('data/apports/004-borne-recharge.json');
// L'automatisation modifie ce que les trois autres ont posé : CM-01 y adresse son
// ordre à MC-01, qu'elle seule déclare. Sans elle, l'éclairage ne se dérive plus,
// et la dérivation retombe sur le majorant — comme elle le doit.
export const AUTOMATISATION = () => lireJson('data/apports/005-automatisation-locale.json');

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

/**
 * La chute de tension de l'**arrivée**, commune aux deux circuits terminaux.
 *
 * Elle n'était nulle part dans les données ni dans les tests : seuls les documents
 * la citaient, sous la forme du résultat « 1,65 % ». Les tests ne contrôlaient donc
 * du cumul déclaré qu'un encadrement — supérieur à la terminale, inférieur à la
 * limite — et une valeur périmée de 3,02 % a traversé deux révisions sans être vue.
 * Un encadrement n'est pas une vérification de la valeur.
 *
 * Les trois paramètres viennent du relevé du branchement (note de calcul, § 1).
 */
export const AMONT = { longueur: 30, courant: 45, section: 16 };

export const RHO = 0.0225;
export const U_NOMINALE = 230;

/** ΔU = 2ρLI/S, rendue en pourcentage de la tension nominale. */
export const chutePourCent = ({ longueur, courant, section }) =>
  (100 * 2 * RHO * longueur * courant) / (section * U_NOMINALE);

/** La chute de l'arrivée seule : 1,65 %. Calculée, jamais recopiée. */
export const chuteAmont = () => chutePourCent(AMONT);

/**
 * Le socle, augmenté de deux obstacles SANS volume ni majorant : l'un rattaché à
 * une baie, l'autre zone libre du local.
 *
 * Les tests qui exercent le cas « inconnu » le construisent, au lieu de le
 * chercher dans le relevé : le relevé avance, et un test qui dépend de ce qui
 * reste à mesurer casse à chaque mesure. Le 2026-09-23, le vantail et le tablier
 * fermé ont ainsi reçu un majorant ; il n'y aura pas toujours un obstacle inconnu
 * rattaché à une baie.
 */
export function socleAvecInconnus(socle = SOCLE()) {
  const s = copie(socle);
  s.local.obstacles.push(
    { id: 'inconnu-baie', libelle: 'Ouvrant non relevé', baie: 'porte-service', etat: 'ouvert', volume: null, incertain: true },
    { id: 'inconnu-zone', libelle: 'Zone libre non relevée', etat: 'ferme', volume: null, incertain: true },
  );
  return s;
}

/**
 * La paroi est D'AVANT LA GOULOTTE GL-02 — le tronc en conduits sous le linteau.
 *
 * Jusqu'au 2026-09-24, le tronc courait de GL-01 à BD-01 dans CH-02, à 2,60 m,
 * montait au plafond par CH-04 et BD-03, et la ligne de la borne le longeait à
 * 2,64 m dans CH-B2 puis CH-B3, en traversant BD-01. Plusieurs mécanismes du socle
 * ont été éprouvés sur ce tracé : le franchissement dans une boîte à volume, le
 * heurt de deux conduits parallèles, la cote d'un conduit horizontal. Ils valent
 * toujours, et leurs tests gardent leur montage plutôt que de dépendre d'un tracé
 * qui ne les exerce plus.
 *
 * Reconstruit à partir des apports actuels, et non recopié : seul change ce que la
 * goulotte a remplacé.
 */
const pt = (x, y, z) => ({ x, y, z });
const sg = (face, de, a) => ({ face, de: pt(...de), a: pt(...a) });

export function PRISES_AVANT_GOULOTTE() {
  const p = PRISES();
  p.composants = p.composants.filter((c) => !['pr-oc-02', 'pr-ac-01'].includes(c.id));
  // OC-01 était alors une enveloppe, avec son volume : la constitution v1.15.0 l'en a
  // dispensée depuis.
  Object.assign(p.composants.find((c) => c.id === 'pr-oc-01'), {
    dimensions: { largeur: 0.06, hauteur: 0.06, profondeur: 0.035 }, entrees: 4,
  });
  p.composants.push(
    { id: 'pr-bd-01', reference: 'BD-01', type: 'boite-derivation', paroi: 'est', face: 'interieur',
      position: pt(5.6, 2.6, 2.6), hauteurAxe: 2.6, indiceProtection: null, circuit: 'c-prises',
      dimensions: { largeur: 0.112, hauteur: 0.112, profondeur: 0.032 }, entrees: 6 },
    { id: 'pr-bd-03', reference: 'BD-03', type: 'accessoire-conduit', paroi: 'plafond', face: 'interieur',
      position: pt(5.6, 2.6, 2.75), hauteurAxe: null, indiceProtection: null, circuit: 'c-prises', tirage: null },
  );
  const ch = (id) => p.cheminements.find((c) => c.id === id);
  ch('pr-gl-01').segments = [
    sg('est', [5.6, 0.7, 1.63], [5.6, 0.7, 2.6]),
    sg('est', [5.6, 0.7, 2.6], [5.6, 0.7, 2.64]),
    sg('est', [5.6, 0.7, 2.64], [5.6, 0.7, 2.75]),
  ];
  ch('pr-ch-03').segments = [
    sg('est', [5.6, 2.6, 2.6], [5.6, 5.6, 2.6]),
    sg('nord', [5.6, 5.6, 2.6], [5.45, 5.6, 2.6]),
    sg('nord', [5.45, 5.6, 2.6], [5.45, 5.6, 0.3]),
  ];
  ch('pr-ch-05').segments = [sg('est', [5.6, 2.6, 2.6], [5.6, 2.6, 1.1])];
  ch('pr-ch-07').segments = [sg('plafond', [5.6, 2.6, 2.75], [2.7, 2.6, 2.75])];
  p.cheminements = p.cheminements.filter((c) => c.id !== 'pr-gl-02');
  p.cheminements.push(
    { id: 'pr-ch-02', reference: 'CH-02', circuits: ['c-prises', 'c-eclairage'],
      section: { forme: 'circulaire', diametre: 0.025 }, segments: [sg('est', [5.6, 0.7, 2.6], [5.6, 2.6, 2.6])] },
    { id: 'pr-ch-04', reference: 'CH-04', circuits: ['c-prises', 'c-eclairage'],
      section: { forme: 'circulaire', diametre: 0.02 }, segments: [sg('est', [5.6, 2.6, 2.6], [5.6, 2.6, 2.75])] },
  );
  p.etapes = [];
  return p;
}

export function ECLAIRAGE_AVANT_GOULOTTE() {
  const e = ECLAIRAGE();
  const tv = e.traversees.find((t) => t.id === 'ec-tv-02');
  tv.position = pt(5.6, 2.6, 2.6);
  tv.denivele = null;
  e.etapes = [];
  return e;
}

export function BORNE_AVANT_GOULOTTE() {
  const b = BORNE();
  b.cheminements = [
    { id: 'br-ch-02', reference: 'CH-B2', circuits: ['c-borne'], section: { forme: 'circulaire', diametre: 0.025 },
      apport: '004-borne-recharge', segments: [sg('est', [5.6, 0.7, 2.64], [5.6, 2.6, 2.64])] },
    { id: 'br-ch-03', reference: 'CH-B3', circuits: ['c-borne'], section: { forme: 'circulaire', diametre: 0.025 },
      apport: '004-borne-recharge', segments: [
        sg('est', [5.6, 2.6, 2.64], [5.6, 5.6, 2.64]),
        sg('nord', [5.6, 5.6, 2.64], [4.5, 5.6, 2.64]),
        sg('nord', [4.5, 5.6, 2.64], [4.5, 5.6, 1.4]),
        sg('nord', [4.5, 5.6, 1.4], [2.8, 5.6, 1.4]),
        sg('nord', [2.8, 5.6, 1.4], [2.8, 5.6, 1.0]),
      ] },
  ];
  b.etapes = [];
  return b;
}
