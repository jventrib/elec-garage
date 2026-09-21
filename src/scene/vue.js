/**
 * Rendu et caméra.
 *
 * La caméra orbitale est écrite à la main plutôt qu'empruntée aux modules
 * additionnels de three : elle doit unifier souris, doigt et stylet via Pointer
 * Events (FR-029) et rester atteignable avec des gants, ce qu'un contrôleur
 * générique ne garantit pas. Cela évite aussi une dépendance de plus à vendorer.
 */

import {
  Scene,
  Color,
  PerspectiveCamera,
  WebGLRenderer,
  HemisphereLight,
  DirectionalLight,
  Vector3,
  Raycaster,
  Vector2,
} from '../../vendor/three/three.module.js';

export function creerVue(conteneur, local, presentation) {
  const reglages = presentation.camera;
  const scene = new Scene();
  scene.background = new Color(presentation.couleurs.fond);

  const camera = new PerspectiveCamera(reglages.champ, 1, reglages.proche, reglages.lointain);
  const renderer = new WebGLRenderer({ antialias: true });
  renderer.setPixelRatio(Math.min(globalThis.devicePixelRatio || 1, 2));
  conteneur.appendChild(renderer.domElement);
  renderer.domElement.style.touchAction = 'none';
  renderer.domElement.style.display = 'block';

  // Éclairage à plat et fortement contrasté : la maquette vise la lisibilité, pas
  // le photo-réalisme, et doit rester lisible en plein soleil (R3, R9).
  // Les réglages viennent de data/presentation.json.
  const ecl = presentation.eclairage;
  scene.add(new HemisphereLight(ecl.hemispherique.ciel, ecl.hemispherique.sol, ecl.hemispherique.intensite));
  const soleil = new DirectionalLight(ecl.directionnel.couleur, ecl.directionnel.intensite);
  soleil.position.set(ecl.directionnel.position.x, ecl.directionnel.position.y, ecl.directionnel.position.z);
  scene.add(soleil);

  const centre = new Vector3(local.oeuvre.x / 2, local.oeuvre.y / 2, local.hauteurSousPlafond / 2);
  // Vues prédéfinies issues de data/presentation.json : atteindre plafond, sol et
  // angles sans zone aveugle (FR-004) sans figer d'angle dans le code.
  const VUES = new Map(presentation.vues.map((v) => [v.id, v]));
  const initiale = VUES.get(presentation.vueInitiale) ?? presentation.vues[0];
  const orbite = { theta: initiale.theta, phi: initiale.phi, rayon: initiale.rayon, cible: centre.clone() };

  function appliquer() {
    const { theta, phi, rayon, cible } = orbite;
    camera.position.set(
      cible.x + rayon * Math.sin(phi) * Math.cos(theta),
      cible.y + rayon * Math.sin(phi) * Math.sin(theta),
      cible.z + rayon * Math.cos(phi),
    );
    camera.up.set(0, 0, 1); // z vers le haut, comme le repère de la constitution
    camera.lookAt(cible);
  }

  function redimensionner() {
    const l = conteneur.clientWidth || 1;
    const h = conteneur.clientHeight || 1;
    camera.aspect = l / h;
    camera.updateProjectionMatrix();
    renderer.setSize(l, h, false);
  }

  function allerAVue(nom) {
    const v = VUES.get(nom);
    if (!v) return false;
    orbite.theta = v.theta;
    orbite.phi = v.phi;
    orbite.rayon = v.rayon;
    appliquer();
    return true;
  }

  // --- Interaction : un seul jeu de gestes pour souris, doigt et stylet ---
  const pointeurs = new Map();
  let ecartPrecedent = 0;
  let aBouge = false;
  const cible = renderer.domElement;

  cible.addEventListener('pointerdown', (e) => {
    cible.setPointerCapture(e.pointerId);
    pointeurs.set(e.pointerId, { x: e.clientX, y: e.clientY });
    aBouge = false;
  });

  cible.addEventListener('pointermove', (e) => {
    const p = pointeurs.get(e.pointerId);
    if (!p) return;
    const dx = e.clientX - p.x;
    const dy = e.clientY - p.y;
    if (Math.abs(dx) + Math.abs(dy) > 3) aBouge = true;
    p.x = e.clientX;
    p.y = e.clientY;

    if (pointeurs.size === 1) {
      orbite.theta -= dx * 0.006;
      orbite.phi = Math.min(Math.PI - 0.05, Math.max(0.05, orbite.phi - dy * 0.006));
      appliquer();
    } else if (pointeurs.size === 2) {
      const [a, b] = [...pointeurs.values()];
      const ecart = Math.hypot(a.x - b.x, a.y - b.y);
      if (ecartPrecedent) zoomer((ecartPrecedent - ecart) * 0.03);
      ecartPrecedent = ecart;
    }
  });

  const relacher = (e) => {
    pointeurs.delete(e.pointerId);
    if (pointeurs.size < 2) ecartPrecedent = 0;
  };
  cible.addEventListener('pointerup', relacher);
  cible.addEventListener('pointercancel', relacher);

  cible.addEventListener('wheel', (e) => {
    e.preventDefault();
    zoomer(e.deltaY * 0.004);
  }, { passive: false });

  function zoomer(delta) {
    orbite.rayon = Math.min(reglages.rayonMax, Math.max(reglages.rayonMin, orbite.rayon + delta));
    appliquer();
  }

  const rayon = new Raycaster();
  const ecran = new Vector2();

  /** Désignation d'un objet. Ignore un geste qui était en fait une rotation. */
  function objetSous(evenement, candidats) {
    if (aBouge) return null;
    const r = cible.getBoundingClientRect();
    ecran.x = ((evenement.clientX - r.left) / r.width) * 2 - 1;
    ecran.y = -((evenement.clientY - r.top) / r.height) * 2 + 1;
    rayon.setFromCamera(ecran, camera);
    const touches = rayon.intersectObjects(candidats, true);
    return touches.length ? touches[0].object : null;
  }

  appliquer();
  redimensionner();
  globalThis.addEventListener('resize', redimensionner);

  let boucleActive = true;
  const api = {
    scene,
    camera,
    renderer,
    allerAVue,
    vuesDisponibles: presentation.vues.map((v) => ({ id: v.id, libelle: v.libelle })),
    zoomer,
    objetSous,
    redimensionner,
    /** Crochet appelé avant chaque image. Sert notamment à escamoter le plafond. */
    avantRendu: null,
    arreter() {
      boucleActive = false;
    },
  };

  (function boucle() {
    if (!boucleActive) return;
    if (api.avantRendu) api.avantRendu();
    renderer.render(scene, camera);
    globalThis.requestAnimationFrame(boucle);
  })();

  return api;
}
