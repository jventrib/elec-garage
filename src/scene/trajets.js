/**
 * Le trajet des conducteurs d'un objet désigné, dessiné sur la maquette.
 *
 * Un fin cylindre par arête du trajet, dans la couleur de son circuit. Les appareils
 * d'extrémité sont mis en évidence par la scène des composants ; ils portaient des
 * pastilles, retirées le 2026-09-25 à la demande du maître d'ouvrage. Deux règles de
 * lisibilité :
 *
 *  - les tracés se dessinent PAR-DESSUS le reste : ils courent dans les tubes et
 *    sous le capot des goulottes, qui les cacheraient ;
 *  - deux circuits qui partagent un parcours courent CÔTE À CÔTE, décalés selon leur
 *    rang, et non superposés : un conduit partagé ne peut porter qu'une couleur, un
 *    faisceau de tracés en porte autant qu'il y a de circuits.
 *
 * La logique est dans `src/geometrie/trajets.js` ; ce module ne fait que placer.
 */

import {
  Group,
  Mesh,
  CylinderGeometry,
  SphereGeometry,
  MeshBasicMaterial,
  Vector3,
  Quaternion,
} from '../../vendor/three/three.module.js';
import { couleurDeCircuit } from './composants.js';

const HAUT = new Vector3(0, 1, 0);
// La direction fixe dont chaque circuit tire son décalage. Fixe, et non choisie
// segment par segment : un tracé garde ainsi le même côté d'un coude à l'autre.
const BIAIS = { x: 1 / Math.sqrt(3), y: 1 / Math.sqrt(3), z: 1 / Math.sqrt(3) };

/**
 * La teinte d'un tronçon où passe un fil d'ordre : celle du circuit, assombrie vers
 * le noir de `facteur`. Elle rappelle le circuit à qui le fil appartient.
 */
export function assombrir(couleur, facteur) {
  const m = /^#([0-9a-f]{6})$/i.exec(couleur ?? '');
  if (!m) return couleur;
  const v = parseInt(m[1], 16);
  const canal = (dec) => Math.round(((v >> dec) & 0xff) * (1 - facteur));
  return `#${[16, 8, 0].map((d) => canal(d).toString(16).padStart(2, '0')).join('')}`;
}

/** Le décalage d'un tracé de rang `k` sur `n`, perpendiculaire à `d`. */
export function decalageDe(d, k, n, ecart) {
  const pas = (k - (n - 1) / 2) * ecart;
  if (pas === 0) return { x: 0, y: 0, z: 0 };
  const l = Math.hypot(d.x, d.y, d.z) || 1;
  const u = { x: d.x / l, y: d.y / l, z: d.z / l };
  const p = BIAIS.x * u.x + BIAIS.y * u.y + BIAIS.z * u.z;
  const v = { x: BIAIS.x - p * u.x, y: BIAIS.y - p * u.y, z: BIAIS.z - p * u.z };
  const lv = Math.hypot(v.x, v.y, v.z) || 1;
  return { x: (v.x / lv) * pas, y: (v.y / lv) * pas, z: (v.z / lv) * pas };
}

/**
 * Ce qu'il faut dessiner, sans rien dessiner : des tubes avec leur couleur, et les
 * appareils d'extrémité avec les circuits qui y aboutissent. Testable sans navigateur.
 */
export function formesDesTrajets(modele, trajets) {
  const conv = modele.presentation.trajets;
  const traces = trajets.filter((t) => !t.inconnu);
  const n = traces.length;
  const tubes = [];
  traces.forEach((t, k) => {
    const couleur = couleurDeCircuit(modele.circuits, t.circuit, modele.presentation);
    for (const s of t.segments) {
      const d = { x: s.a.x - s.de.x, y: s.a.y - s.de.y, z: s.a.z - s.de.z };
      if (Math.hypot(d.x, d.y, d.z) < 1e-9) continue;
      const o = decalageDe(d, k, n, conv.ecart);
      tubes.push({
        couleur: s.ordre ? assombrir(couleur, conv.assombrissementOrdre) : couleur,
        ordre: !!s.ordre,
        circuit: t.circuit,
        de: { x: s.de.x + o.x, y: s.de.y + o.y, z: s.de.z + o.z },
        a: { x: s.a.x + o.x, y: s.a.y + o.y, z: s.a.z + o.z },
      });
    }
  });

  // Les appareils d'extrémité, et les circuits qui y aboutissent : la scène des
  // composants les met en évidence.
  const parAppareil = new Map();
  for (const t of traces) {
    for (const id of t.appareils) {
      if (!parAppareil.has(id)) parAppareil.set(id, []);
      parAppareil.get(id).push(t.circuit);
    }
  }
  return { tubes, appareils: parAppareil };
}

export function construireTrajets(modele) {
  const groupe = new Group();
  groupe.name = 'trajets';
  const conv = modele.presentation.trajets;
  const materiaux = new Map();
  const materiau = (couleur) => {
    if (!materiaux.has(couleur)) {
      materiaux.set(couleur, new MeshBasicMaterial({ color: couleur, depthTest: false, transparent: true, opacity: 0.95 }));
    }
    return materiaux.get(couleur);
  };
  const sphere = new SphereGeometry(1, 16, 12);

  function effacer() {
    for (const enfant of [...groupe.children]) {
      groupe.remove(enfant);
      if (enfant.geometry !== sphere) enfant.geometry.dispose();
    }
  }

  /** Dessine les trajets ; rend, par appareil d'extrémité, les circuits qui y aboutissent. */
  function afficher(trajets) {
    effacer();
    const { tubes, appareils } = formesDesTrajets(modele, trajets);
    const rayon = conv.diametre / 2;
    for (const t of tubes) {
      const de = new Vector3(t.de.x, t.de.y, t.de.z);
      const a = new Vector3(t.a.x, t.a.y, t.a.z);
      const d = a.clone().sub(de);
      const tube = new Mesh(new CylinderGeometry(rayon, rayon, d.length(), 8), materiau(t.couleur));
      tube.position.copy(de.clone().add(a).multiplyScalar(0.5));
      tube.quaternion.copy(new Quaternion().setFromUnitVectors(HAUT, d.normalize()));
      tube.renderOrder = 10;
      groupe.add(tube);
      // Une rotule à chaque bout : sans elle, les tracés décalés s'ouvrent aux coudes.
      for (const p of [t.de, t.a]) {
        const rotule = new Mesh(sphere, materiau(t.couleur));
        rotule.scale.setScalar(rayon);
        rotule.position.set(p.x, p.y, p.z);
        rotule.renderOrder = 10;
        groupe.add(rotule);
      }
    }
    return appareils;
  }

/**
   * Couper une couche. Comme partout ailleurs, la bascule porte sur le groupe et
   * jamais sur chaque objet : c'est le seul endroit où three.js cesse de désigner
   * ce qui est visible.
   */
  function basculer(visible) {
    groupe.visible = visible;
  }

  return { groupe, afficher, basculer, effacer };
}
