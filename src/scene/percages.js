/**
 * Les points de perçage de l'étape courante.
 *
 * Trois natures, qui n'appellent ni le même outil ni la même exigence de cote :
 *
 *   TRAVERSEE  scie cloche, de part en part — SEULE a exiger une cote juste,
 *              parce qu'aucun gabarit ne guide la meche dans du beton nu ;
 *   OBJET      perforateur — le gabarit est l'objet lui-meme, qu'on presente au
 *              mur et au travers duquel on marque ;
 *   COLLIER    perforateur — le gabarit est le cordeau, et la repartition se
 *              derive d'un entraxe produit.
 *
 * La valeur d'une cote est inverse de la disponibilite d'un gabarit : la ou un
 * gabarit existe, coter est du bruit. C'est pourquoi ce module rend des points
 * pour montrer, et non des cotes pour reporter.
 */

import { Group, Mesh, BoxGeometry, MeshStandardMaterial } from '../../vendor/three/three.module.js';
import { entraxeDe } from '../donnees/validation.js';
import { colliersDeCheminement } from '../geometrie/fixations.js';

export const NATURES = {
  traversee: { libelle: 'traversée de paroi', outil: 'scie cloche béton' },
  objet: { libelle: 'fixation d’objet', outil: 'perforateur' },
  collier: { libelle: 'fixation de collier', outil: 'perforateur' },
};

/**
 * Les perçages qu'une étape exige, par nature.
 *
 * Un objet donne UN point — sa position. Ses vis n'ont pas à être cotées : sur le
 * chantier on présente la boîte et on marque au travers de ses propres trous. Les
 * coter donnerait une précision que personne ne reporte, et qui dépend d'un
 * produit non choisi.
 */
export function percagesDeLEtape(modele, socle, etape) {
  if (!etape || etape.phase !== 'percage') return [];
  const parId = new Map([
    ...(modele.composants ?? []).map((c) => [c.id, c]),
    ...(modele.cheminements ?? []).map((c) => [c.id, c]),
  ]);
  const points = [];

  for (const id of etape.traversees ?? []) {
    const t = (modele.traversees ?? []).find((x) => x.id === id);
    if (t) points.push({ nature: 'traversee', reference: t.reference, position: t.position, objet: t });
  }

  for (const id of etape.fixations ?? []) {
    const o = parId.get(id);
    if (!o) continue;
    if (o.segments) {
      const entraxe = entraxeDe(socle, o);
      const colliers = colliersDeCheminement(modele, o, entraxe);
      if (colliers === null) {
        // Entraxe inconnu : on ne repartit rien et on le DIT. Substituer un
        // espacement courant ferait passer une hypothese pour une cote.
        points.push({ nature: 'collier', reference: o.reference, position: null, objet: o, inconnu: true });
      } else {
        for (const p of colliers) points.push({ nature: 'collier', reference: o.reference, position: p, objet: o });
      }
    } else {
      points.push({ nature: 'objet', reference: o.reference, position: o.position, objet: o });
    }
  }
  return points;
}

/**
 * Les GARDES qui contraignent un perçage : ce dont il faut s'écarter.
 *
 * Deux cotes du projet tiennent à moins de 0,13 m, et elles vivaient dans un
 * paragraphe. Une garde serrée qui se lit une fois avant de percer n'est pas une
 * garde ; elle doit se consulter sur le point lui-même.
 */
export function gardesDuPercage(modele, percage, seuilSerre = 0.15) {
  if (!percage?.position) return [];
  const p = percage.position;
  const gardes = [];

  for (const b of modele.local?.baies ?? []) {
    const seg = segmentDeBaie(modele.local, b);
    if (!seg) continue;
    const d = distanceAuVolume(p, seg);
    if (d !== null) gardes.push({ quoi: b.libelle ?? b.id, distance: d, serre: d < seuilSerre });
  }
  for (const o of modele.local?.obstacles ?? []) {
    const v = o.volume ?? o.volumeMajorant;
    if (!v) continue;
    const d = distanceAuVolume(p, v);
    if (d !== null) gardes.push({ quoi: o.libelle ?? o.id, distance: d, serre: d < seuilSerre, majore: !o.volume });
  }
  return gardes.sort((a, b) => a.distance - b.distance);
}

/** Distance d'un point à un volume aligné sur les axes ; 0 s'il est dedans. */
function distanceAuVolume(p, v) {
  if (!v?.min || !v?.max) return null;
  const d = ['x', 'y', 'z'].map((a) => Math.max(v.min[a] - p[a], p[a] - v.max[a], 0));
  return Math.hypot(d[0], d[1], d[2]);
}

/** Enveloppe d'une baie, dérivée de sa paroi, de son début, largeur, allège et hauteur. */
function segmentDeBaie(local, baie) {
  if (!local || !baie) return null;
  const h = baie.hauteur;
  if (typeof h !== 'number') return null;
  const bas = baie.allege ?? 0;
  const e = local.epaisseurParois ?? 0;
  const X = local.oeuvre?.x ?? 0;
  const Y = local.oeuvre?.y ?? 0;
  const d = baie.debut;
  const l = baie.largeur;
  switch (baie.paroi) {
    case 'nord': return { min: { x: d, y: Y - e, z: bas }, max: { x: d + l, y: Y, z: bas + h } };
    case 'sud': return { min: { x: d, y: 0, z: bas }, max: { x: d + l, y: e, z: bas + h } };
    case 'est': return { min: { x: X - e, y: d, z: bas }, max: { x: X, y: d + l, z: bas + h } };
    case 'ouest': return { min: { x: 0, y: d, z: bas }, max: { x: e, y: d + l, z: bas + h } };
    default: return null;
  }
}

/** Marqueurs de perçage, une couleur par nature, visibles à la seule étape de perçage. */
export function construirePercages(modele, socle) {
  const groupe = new Group();
  groupe.name = 'percages';
  const couleurs = modele.presentation.couleurs;
  const teinte = {
    traversee: couleurs.traversee,
    objet: couleurs.contourAjout,
    collier: couleurs.cheminement,
  };
  let courants = [];

  function afficher(etape) {
    for (const m of courants) groupe.remove(m);
    courants = [];
    for (const p of percagesDeLEtape(modele, socle, etape)) {
      if (!p.position) continue;
      const c = 0.03;
      const mesh = new Mesh(
        new BoxGeometry(c, c, c),
        new MeshStandardMaterial({ color: teinte[p.nature], roughness: 0.6 }),
      );
      mesh.position.set(p.position.x, p.position.y, p.position.z);
      mesh.userData = { percage: p };
      groupe.add(mesh);
      courants.push(mesh);
    }
    groupe.visible = courants.length > 0;
  }

/**
   * Couper une couche. Comme partout ailleurs, la bascule porte sur le groupe et
   * jamais sur chaque objet : c'est le seul endroit où three.js cesse de désigner
   * ce qui est visible.
   */
  function basculer(visible) {
    groupe.visible = visible;
  }

  return { groupe, afficher, basculer, percagesDeLEtape: (e) => percagesDeLEtape(modele, socle, e) };
}
