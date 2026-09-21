/**
 * Obstacles qui contraignent l'implantation (FR-003) : débattement du vantail de
 * la porte de service, tablier et rail de la porte sectionnelle, gabarit de
 * manœuvre du véhicule, débattement des portières.
 *
 * Un obstacle dont le volume est inconnu N'EST PAS dessiné avec un volume
 * plausible : on montre seulement à quelle baie il se rattache, et on le déclare
 * incertain. Inventer l'encombrement serait précisément ce que le Principe VI
 * interdit.
 *
 * Trois rendus, pour les trois formes d'obstacle. Un volume relevé est plein et
 * assumé. Un volume seulement MAJORÉ est dessiné à son majorant, dans la teinte
 * du doute : il borne l'obstacle sans le décrire, et la nuance doit rester
 * visible à l'écran comme elle l'est dans le verdict. Un volume absent ne montre
 * que l'emprise de sa baie — et rien du tout s'il ne se rattache à aucune.
 *
 * Les obstacles sont **sélectionnables**, au même titre que les composants et les
 * cheminements. Ils ne l'étaient pas, et c'est ce qui avait conduit à entasser
 * leurs réserves dans un bandeau permanent au-dessus de la maquette : l'information
 * n'avait aucun objet où se poser. Elle se consulte désormais en cliquant ce dont
 * elle parle.
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
  const allege = baie.allege ?? 0;
  const haut = baie.hauteur === null ? local.hauteurSousPlafond : allege + baie.hauteur;
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
  min.z = allege;
  max.z = haut;
  return { min, max, hauteurConnue: baie.hauteur !== null };
}

/**
 * Boîte filaire. Le corps est rendu séparément du groupe : c'est lui que le rayon
 * de sélection touche, et c'est donc lui qui doit porter la désignation.
 */
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
  return { groupe, corps };
}

export function construireObstacles(local, presentation) {
  const couleurs = presentation.couleurs;
  const opacites = presentation.opacites;
  const groupe = new Group();
  groupe.name = 'obstacles';
  const incertains = [];
  const parEtat = { ouvert: [], ferme: [] };
  const parId = new Map();
  const baiesParId = new Map((local.baies ?? []).map((b) => [b.id, b]));

  /** Enregistre un obstacle dessiné : visibilité par état, et corps sélectionnable. */
  function poser(obstacle, { groupe: noeud, corps }, etat) {
    noeud.name = obstacle.id;
    noeud.userData = { obstacle };
    corps.name = `${obstacle.id}:corps`;
    corps.userData = { obstacle, etat };
    groupe.add(noeud);
    parEtat[obstacle.etat].push(noeud);
    parId.set(obstacle.id, { noeud, corps, obstacle, etat });
  }

  for (const obstacle of local.obstacles ?? []) {
    // Le rattachement à une baie est facultatif : le gabarit de manœuvre du
    // véhicule et le débattement des portières ne touchent aucune ouverture, et
    // ce sont pourtant les zones de choc les plus probables pour un conduit
    // apparent posé bas.
    const baie = obstacle.baie === undefined ? null : baiesParId.get(obstacle.baie);
    if (obstacle.baie !== undefined && !baie) continue;

    if (!baie && !obstacle.volume && !obstacle.volumeMajorant) {
      // Rien n'est dessiné : aucune baie à quoi se rattacher, aucun volume.
      incertains.push({
        id: obstacle.id,
        libelle: obstacle.libelle,
        baie: null,
        etat: obstacle.etat,
        rendu: 'aucun',
        borne: false,
        raison: 'zone libre du local, non relevée',
      });
      continue;
    }

    if (obstacle.volume) {
      poser(obstacle, boiteFilaire(obstacle.volume.min, obstacle.volume.max, couleurs.obstacle, opacites.obstacle), 'releve');
      continue;
    }

    // Majorant déduit : on dessine le majorant lui-même — il est informatif, à la
    // différence d'un contour de baie — mais dans la teinte du doute, et on le
    // signale comme borne et non comme relevé.
    if (obstacle.volumeMajorant) {
      poser(
        obstacle,
        boiteFilaire(
          obstacle.volumeMajorant.min,
          obstacle.volumeMajorant.max,
          couleurs.obstacleIncertain,
          opacites.obstacleIncertain,
        ),
        'borne',
      );
      incertains.push({
        id: obstacle.id,
        libelle: obstacle.libelle,
        baie: baie ? baie.id : null,
        etat: obstacle.etat,
        rendu: 'majorant',
        borne: true,
        // Ce qui borne l'obstacle est propre à chacun, et se déclare dans les
        // données : une phrase écrite ici pour le tablier ouvert s'est longtemps
        // appliquée à tout majorant, quel qu'il soit.
        raison: obstacle.raisonMajorant ?? 'borné par des cotes relevées',
      });
      continue;
    }

    // Volume inconnu : on matérialise l'emprise de la baie, rien de plus, et on
    // le signale. Le contour ne prétend pas représenter l'encombrement réel.
    const { min, max, hauteurConnue } = contourBaie(local, baie);
    poser(obstacle, boiteFilaire(min, max, couleurs.obstacleIncertain, opacites.obstacleIncertain), 'inconnu');
    incertains.push({
      id: obstacle.id,
      libelle: obstacle.libelle,
      baie: baie.id,
      etat: obstacle.etat,
      rendu: 'baie',
      borne: false,
      raison: hauteurConnue
        ? 'encombrement non relevé'
        : 'hauteur de baie et encombrement non relevés',
    });
  }

  function montrerEtat(etat) {
    for (const [nom, liste] of Object.entries(parEtat)) {
      for (const o of liste) o.visible = nom === etat;
    }
  }
  montrerEtat('ferme');

  /**
   * Corps sélectionnables, restreints à ceux réellement visibles. Le rayon de
   * three.js ne teste PAS la visibilité : sans ce filtre, on pourrait désigner le
   * tablier porte fermée alors qu'il n'est pas à l'écran.
   */
  const meshes = () =>
    [...parId.values()].filter((e) => e.noeud.visible).map((e) => e.corps);

  const obstacleDe = (objet) => objet?.userData?.obstacle ?? null;

  /** Ce que le dossier sait de cet obstacle, tel que la scène l'a établi. */
  const incertitudeDe = (id) => incertains.find((i) => i.id === id) ?? null;

  return { groupe, montrerEtat, incertains, meshes, obstacleDe, incertitudeDe, parId };
}
