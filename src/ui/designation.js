/**
 * Ce qui sépare un CLIC d'un GLISSÉ.
 *
 * `pointerup` termine aussi bien la désignation d'un objet que la rotation de
 * l'orbite : l'évènement est le même, seul le trajet parcouru les distingue. Tant
 * que les deux se confondaient, faire le tour d'un composant focalisé revenait à
 * cliquer dans le vide — la fiche se refermait et le focus était perdu.
 *
 * La règle vit ici et non dans vue.js parce qu'elle se vérifie sans navigateur :
 * ni canevas, ni WebGL, ni évènement réel. C'est la même raison qui a sorti la
 * table des touches dans pilotage-libre.js.
 */

/**
 * En pixels, cumulés en |dx| + |dy|, mesurés depuis l'ORIGINE du geste.
 *
 * Trois pixels : en deçà, un tremblement de main reste un clic. C'est la valeur en
 * service depuis l'origine de la désignation, et le contrôle visuel l'a validée.
 */
export const SEUIL_GLISSE = 3;

/**
 * Le geste a-t-il glissé ?
 *
 * Le trajet se mesure depuis l'ORIGINE, jamais d'un `pointermove` au suivant. La
 * nuance n'est pas théorique : un geste lent émet des évènements de un ou deux
 * pixels, dont aucun ne franchit le seuil pris isolément. Mesurée pas à pas, une
 * rotation menée doucement restait donc un « clic » sur toute sa durée, quel que
 * soit le chemin parcouru au total.
 *
 * La distance est celle du taxi — |dx| + |dy| — et non l'euclidienne. Elle majore
 * cette dernière, ne coûte pas de racine, et un seuil de trois pixels ne demande
 * pas cette précision-là.
 */
export function aGlisse(origine, point, seuil = SEUIL_GLISSE) {
  return Math.abs(point.x - origine.x) + Math.abs(point.y - origine.y) > seuil;
}
