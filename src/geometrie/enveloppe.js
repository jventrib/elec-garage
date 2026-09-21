/**
 * L'enveloppe d'une boîte de dérivation — et pourquoi elle a fini par être
 * nécessaire.
 *
 * Pendant trois fonctionnalités, une boîte a été un **point**. Cela suffisait :
 * les conduits se rejoignaient au centre de la boîte, et le point exprimait
 * exactement la topologie. La ligne de la borne a mis fin à cette commodité.
 *
 * Elle doit franchir deux conduits déjà posés — l'antenne du tronc, qui occupe
 * z = 2,60 sur toute la paroi est, et la montée de BD-01 vers le plafond, qui
 * occupe la verticale au-dessus de la boîte. Le seul endroit où l'on franchit
 * légitimement un conduit est **l'intérieur d'une boîte**, et c'est là que le
 * tracé passe. Mais un point n'a pas d'intérieur : le socle signalait donc
 * quatre défauts sur une implantation physiquement correcte.
 *
 * Une boîte qui déclare ses `dimensions` a désormais un volume, et trois
 * conséquences en découlent, toutes dans ce sens :
 *
 *  - le graphe **fusionne** dans le nœud de la boîte tout bout de conduit qui
 *    tombe dans son enveloppe, ce qui rend la continuité vraie sans tricher ;
 *  - V20 n'oppose pas deux conduits qui se croisent **dans** une boîte ;
 *  - V21, en contrepartie, compte les entrées : sans elle, il suffirait de
 *    déclarer une boîte énorme pour faire taire V20.
 *
 * Une boîte SANS `dimensions` conserve exactement l'ancien comportement. C'est
 * la condition pour que les trois apports déjà écrits ne bougent pas.
 */

import { AXE_NORMAL } from './cheminement.js';
import { nusDeParoi } from '../donnees/chargement.js';

/**
 * Volume occupé par une boîte, aligné sur les axes du repère.
 *
 * Les trois dimensions déclarées se rangent selon la paroi : sur un mur, la
 * hauteur suit z et la largeur l'axe horizontal du plan de la paroi ; au
 * plafond, où il n'y a pas de « hauteur », la largeur suit x et la hauteur y.
 * La profondeur suit toujours la normale, **vers l'espace** et non dans le mur.
 */
export function enveloppeDeBoite(local, boite) {
  const d = boite?.dimensions;
  if (!d) return null;
  const normal = AXE_NORMAL[boite.paroi];
  const nus = nusDeParoi(local, boite.paroi);
  if (!normal || !nus) return null;
  for (const c of ['largeur', 'hauteur', 'profondeur']) {
    if (typeof d[c] !== 'number' || !(d[c] > 0)) return null;
  }

  // Le sens vers lequel la boîte fait saillie : à l'opposé du nu qui ne la porte
  // pas. Au plafond, il n'y a pas de nu extérieur utile, et une boîte pend.
  const sens =
    boite.paroi === 'plafond'
      ? -1
      : Math.sign(
          (boite.face === 'exterieur' ? nus.exterieur : nus.interieur) -
            (boite.face === 'exterieur' ? nus.interieur : nus.exterieur),
        );

  const demi = { largeur: d.largeur / 2, hauteur: d.hauteur / 2 };
  const enPlan = boite.paroi === 'plafond' ? { x: demi.largeur, y: demi.hauteur } : { z: demi.hauteur };
  if (boite.paroi !== 'plafond') enPlan[normal === 'x' ? 'y' : 'x'] = demi.largeur;

  const min = {};
  const max = {};
  for (const axe of ['x', 'y', 'z']) {
    if (axe === normal) {
      const base = boite.position[axe];
      const bout = base + sens * d.profondeur;
      min[axe] = Math.min(base, bout);
      max[axe] = Math.max(base, bout);
    } else {
      min[axe] = boite.position[axe] - enPlan[axe];
      max[axe] = boite.position[axe] + enPlan[axe];
    }
  }
  return { min, max };
}

/** Un point tombe-t-il dans l'enveloppe d'une boîte ? Faux si elle n'en a pas. */
export function pointDansBoite(local, boite, point, tolerance = 0) {
  const e = enveloppeDeBoite(local, boite);
  if (!e) return false;
  for (const axe of ['x', 'y', 'z']) {
    if (point[axe] < e.min[axe] - tolerance || point[axe] > e.max[axe] + tolerance) return false;
  }
  return true;
}

/**
 * La boîte dont l'enveloppe couvre ce point, s'il en existe une.
 *
 * Ne considère que les boîtes DIMENSIONNÉES : une boîte-point ne couvre que sa
 * propre position, ce que les appelants traitent séparément par `memePoint`.
 */
export function boiteCouvrant(local, boites, point, tolerance = 0) {
  return boites.find((b) => pointDansBoite(local, b, point, tolerance)) ?? null;
}
