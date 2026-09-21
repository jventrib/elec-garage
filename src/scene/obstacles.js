/**
 * Obstacles qui contraignent l'implantation (FR-003) : débattement du vantail de
 * la porte de service, tablier et rail de la porte sectionnelle.
 *
 * Deux cotes manquent au relevé — TODO(RAIL_PORTE_SECTIONNELLE) et le débattement
 * du vantail. Un obstacle dont le volume est inconnu N'EST PAS dessiné avec un
 * volume plausible : on montre seulement à quelle baie il se rattache, et on le
 * déclare incertain. Inventer l'encombrement serait précisément ce que le
 * Principe VI interdit.
 */

import {
  Group,
  Mesh,
  BoxGeometry,
  MeshStandardMaterial,
  EdgesGeometry,
  LineSegments,
  LineBasicMaterial,
} from '../../vendor/three/three.module.js';
import { segmentBaie } from '../donnees/chargement.js';

function contourBaie(local, baie) {
  const seg = segmentBaie(local, baie);
  const e = local.epaisseurParois;
  const h = baie.hauteur ?? local.hauteurSousPlafond;
  const min = {};
  const max = {};
  if (seg.axe === 'x') {
    min.x = seg.min;
    max.x = seg.max;
    const y = baie.paroi === 'sud' ? -e : local.oeuvre.y;
    min.y = y;
    max.y = y + e;
  } else {
    min.y = seg.min;
    max.y = seg.max;
    const x = baie.paroi === 'ouest' ? -e : local.oeuvre.x;
    min.x = x;
    max.x = x + e;
  }
  min.z = 0;
  max.z = h;
  return { min, max, hauteurConnue: baie.hauteur !== null };
}

function boiteFilaire(min, max, couleur, opacite) {
  const dx = max.x - min.x;
  const dy = max.y - min.y;
  const dz = max.z - min.z;
  const geo = new BoxGeometry(Math.max(dx, 1e-3), Math.max(dy, 1e-3), Math.max(dz, 1e-3));
  const groupe = new Group();
  const corps = new Mesh(
    geo,
    new MeshStandardMaterial({ color: couleur, transparent: true, opacity: opacite, roughness: 1 }),
  );
  const bord = new LineSegments(new EdgesGeometry(geo), new LineBasicMaterial({ color: couleur }));
  groupe.add(corps, bord);
  groupe.position.set(min.x + dx / 2, min.y + dy / 2, min.z + dz / 2);
  return groupe;
}

export function construireObstacles(local, presentation) {
  const couleurs = presentation.couleurs;
  const opacites = presentation.opacites;
  const groupe = new Group();
  groupe.name = 'obstacles';
  const incertains = [];
  const parEtat = { ouvert: [], ferme: [] };
  const baiesParId = new Map((local.baies ?? []).map((b) => [b.id, b]));

  for (const obstacle of local.obstacles ?? []) {
    // Le rattachement à une baie est facultatif : le gabarit de manœuvre du
    // véhicule et le débattement des portières ne touchent aucune ouverture, et
    // ce sont pourtant les zones de choc les plus probables pour un conduit
    // apparent posé bas.
    const baie = obstacle.baie === undefined ? null : baiesParId.get(obstacle.baie);
    if (obstacle.baie !== undefined && !baie) continue;

    if (!baie && !obstacle.volume) {
      incertains.push({
        id: obstacle.id,
        baie: null,
        etat: obstacle.etat,
        raison: 'volume libre du local, non relevé',
      });
      continue;
    }

    if (obstacle.volume) {
      const o = boiteFilaire(obstacle.volume.min, obstacle.volume.max, couleurs.obstacle, opacites.obstacle);
      o.name = obstacle.id;
      o.userData = { obstacle };
      groupe.add(o);
      parEtat[obstacle.etat].push(o);
      continue;
    }

    // Volume inconnu : on matérialise l'emprise de la baie, rien de plus, et on
    // le signale. Le contour ne prétend pas représenter l'encombrement réel.
    const { min, max, hauteurConnue } = contourBaie(local, baie);
    const marque = boiteFilaire(min, max, couleurs.obstacleIncertain, opacites.obstacleIncertain);
    marque.name = obstacle.id;
    marque.userData = { obstacle, incertain: true };
    groupe.add(marque);
    parEtat[obstacle.etat].push(marque);
    incertains.push({
      id: obstacle.id,
      baie: baie.id,
      etat: obstacle.etat,
      raison: hauteurConnue
        ? "encombrement non relevé"
        : "hauteur de baie et encombrement non relevés",
    });
  }

  function montrerEtat(etat) {
    for (const [nom, liste] of Object.entries(parEtat)) {
      for (const o of liste) o.visible = nom === etat;
    }
  }
  montrerEtat('ferme');

  return { groupe, montrerEtat, incertains };
}
