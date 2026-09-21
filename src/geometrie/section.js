/**
 * Section d'un cheminement, et ce qu'on en déduit.
 *
 * Un cheminement n'est plus forcément un tube. Depuis la constitution v1.13.0, un
 * profilé de goulotte à capot démontable peut tenir lieu de conduit sur un
 * parcours donné : sa section est rectangulaire, et la ramener à un diamètre
 * perdrait précisément ce qui la distingue — elle n'a pas le même encombrement
 * selon qu'on la regarde de face ou de profil.
 *
 * La `forme` discrimine les cotes attendues. Le `majorant` porte les mêmes cotes
 * que la section qu'il borne, et il lui est EXCLUSIF : le Principe VI veut qu'un
 * majorant se déclare dans une forme distincte d'un relevé, et une cote arrêtée
 * n'a pas de majorant.
 */

/** Les cotes qu'une forme attend, dans l'ordre où on les lit. */
export const COTES_DE_FORME = {
  circulaire: ['diametre'],
  rectangulaire: ['largeur', 'profondeur'],
};

export const FORMES = Object.keys(COTES_DE_FORME);

/** Vrai si la section porte toutes ses cotes arrêtées. */
export function sectionArretee(section) {
  const cotes = COTES_DE_FORME[section?.forme];
  if (!cotes) return false;
  return cotes.every((c) => typeof section[c] === 'number' && section[c] > 0);
}

/** Vrai si la section est bornée par un majorant faute de cote arrêtée. */
export function sectionMajoree(section) {
  const cotes = COTES_DE_FORME[section?.forme];
  if (!cotes || !section.majorant) return false;
  return cotes.every((c) => typeof section.majorant[c] === 'number' && section.majorant[c] > 0);
}

/**
 * Les cotes à retenir : celles de la section si elle est arrêtée, celles du
 * majorant sinon. Rend `null` quand rien n'est connu.
 */
export function cotesRetenues(section) {
  if (sectionArretee(section)) return section;
  if (sectionMajoree(section)) return section.majorant;
  return null;
}

/**
 * L'encombrement de garde d'une section : ce dont il faut s'écarter.
 *
 * Un majorant y vaut autant qu'une cote arrêtée, et même mieux — il élargit la
 * garde exigée, donc il ne peut que resserrer le contrôle. Sur une section
 * rectangulaire on retient la plus grande cote : l'orientation du profilé ne
 * décide pas de la sévérité du contrôle.
 */
export function calibreDe(section) {
  const cotes = cotesRetenues(section);
  if (!cotes) return null;
  const noms = COTES_DE_FORME[section.forme];
  return Math.max(...noms.map((c) => cotes[c]));
}

/** L'encombrement dessiné, par axe du profilé : { transversal, saillie }. */
export function encombrementDe(section, repli) {
  const cotes = cotesRetenues(section) ?? repli;
  if (section?.forme === 'rectangulaire')
    return { transversal: cotes.largeur, saillie: cotes.profondeur };
  return { transversal: cotes.diametre, saillie: cotes.diametre };
}
