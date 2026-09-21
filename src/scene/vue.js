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

import { aGlisse } from '../ui/designation.js';
import { pasLibre } from '../ui/pilotage-libre.js';

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

  // Le mode de DÉPLACEMENT LIBRE, à côté de l'orbite et non à sa place.
  //
  // L'orbite tient une cible figée au centre du local : on peut y entrer, mais on
  // continue de regarder le centre. Se tenir dans un angle et regarder l'angle
  // opposé y est impossible, et c'est ce que ce second mode existe pour permettre.
  //
  // Le code de l'orbite n'est pas touché : c'est lui qui va au chantier, et le
  // généraliser pour servir un mode de préparation serait le mauvais rapport
  // bénéfice/risque.
  const libre = { position: centre.clone(), lacet: 0, tangage: Math.PI / 2 };
  let modeLibre = false;

  /** Direction du regard en mode libre, dérivée du lacet et du tangage. */
  function regard() {
    const { lacet, tangage } = libre;
    return new Vector3(
      Math.sin(tangage) * Math.cos(lacet),
      Math.sin(tangage) * Math.sin(lacet),
      Math.cos(tangage),
    );
  }

  function appliquerLibre() {
    const b = reglages.bornesVol;
    for (const axe of ['x', 'y', 'z']) {
      libre.position[axe] = Math.min(b.max[axe], Math.max(b.min[axe], libre.position[axe]));
    }
    camera.position.copy(libre.position);
    camera.up.set(0, 0, 1); // z vers le haut, comme le repère de la constitution
    camera.lookAt(new Vector3().addVectors(libre.position, regard()));
  }

  function appliquer() {
    if (modeLibre) return appliquerLibre();
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
    // Une vue prédéfinie est un point de vue SUR la maquette : c'est de l'orbite
    // par nature. La choisir y ramène plutôt que de lui inventer un équivalent
    // libre, ce qui reviendrait à doubler un catalogue que personne n'a demandé
    // à doubler.
    modeLibre = false;
    // Une vue est un point de vue sur la MAQUETTE : elle ramène la cible au centre,
    // et s'anime comme tout autre changement de cadrage.
    viser({ cible: centre, theta: v.theta, phi: v.phi, rayon: v.rayon });
    return true;
  }

  // --- Interaction : un seul jeu de gestes pour souris, doigt et stylet ---
  const pointeurs = new Map();
  let ecartPrecedent = 0;
  let aBouge = false;
  const cible = renderer.domElement;

  cible.addEventListener('pointerdown', (e) => {
    cible.setPointerCapture(e.pointerId);
    // Deux points sont retenus, et non un seul : l'ORIGINE du geste, qui ne bouge
    // plus, et la dernière position, qui sert les deltas de rotation.
    pointeurs.set(e.pointerId, {
      x: e.clientX,
      y: e.clientY,
      origine: { x: e.clientX, y: e.clientY },
    });
    aBouge = false;
  });

  cible.addEventListener('pointermove', (e) => {
    const p = pointeurs.get(e.pointerId);
    if (!p) return;
    const dx = e.clientX - p.x;
    const dy = e.clientY - p.y;
    // Le glissé se mesure depuis l'ORIGINE, non d'un évènement au suivant : voir
    // designation.js, où la règle vit et se vérifie sans navigateur.
    if (aGlisse(p.origine, { x: e.clientX, y: e.clientY })) aBouge = true;
    p.x = e.clientX;
    p.y = e.clientY;

    if (pointeurs.size === 1) {
      interrompreTransition();
      // Le même geste, deux effets selon le mode : il oriente le regard en libre,
      // il orbite sinon. C'est pourquoi le mode courant doit rester visible.
      if (modeLibre) {
        tournerLibre(dx, dy);
        return;
      }
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
    interrompreTransition(); // cadrer n'est pas enfermer : le zoom manuel reprend la main
    orbite.rayon = Math.min(reglages.rayonMax, Math.max(reglages.rayonMin, orbite.rayon + delta));
    appliquer();
  }

  // --- TRANSITIONS DE CAMERA ---
  //
  // Cible, angles et rayon sont interpolés ENSEMBLE : déplacer la cible d'abord
  // puis tourner donnerait deux mouvements successifs et une impression de
  // saccade. Menés ensemble, c'est un seul geste.
  //
  // Une nouvelle cible REMPLACE la transition en cours depuis l'état atteint,
  // plutôt que d'attendre qu'elle s'achève : deux clics rapprochés ne doivent pas
  // produire une file d'attente, et le critère de fluidité exige qu'aucune
  // interaction n'attende.
  let transition = null;

  /** Ramène un écart d'angle dans [-PI, PI] : on tourne par le plus court chemin. */
  function ecartAngulaire(de, vers) {
    let d = (vers - de) % (2 * Math.PI);
    if (d > Math.PI) d -= 2 * Math.PI;
    if (d < -Math.PI) d += 2 * Math.PI;
    return d;
  }

  /** Lissage aux extrémités : départ et arrivée sans à-coup. */
  function lisser(t) {
    const n = reglages.lissageTransition;
    return t < 0.5 ? Math.pow(2 * t, n) / 2 : 1 - Math.pow(2 * (1 - t), n) / 2;
  }

  /**
   * Vise un cadrage. `cible` est le point regardé ; `theta`, `phi` et `rayon` sont
   * facultatifs — omis, ils gardent leur valeur courante, ce qui permet de
   * recentrer sans changer de perspective.
   */
  function viser({ cible, theta, phi, rayon }, animee = true) {
    const but = {
      cible: cible ? { ...cible } : { x: orbite.cible.x, y: orbite.cible.y, z: orbite.cible.z },
      theta: theta ?? orbite.theta,
      phi: phi ?? orbite.phi,
      rayon: Math.min(reglages.rayonMax, Math.max(reglages.rayonMin, rayon ?? orbite.rayon)),
    };
    if (!animee || reglages.dureeTransition <= 0) {
      transition = null;
      orbite.cible.set(but.cible.x, but.cible.y, but.cible.z);
      orbite.theta = but.theta;
      orbite.phi = but.phi;
      orbite.rayon = but.rayon;
      appliquer();
      return;
    }
    transition = {
      t: 0,
      depart: {
        cible: { x: orbite.cible.x, y: orbite.cible.y, z: orbite.cible.z },
        theta: orbite.theta, phi: orbite.phi, rayon: orbite.rayon,
      },
      but,
      ecartTheta: ecartAngulaire(orbite.theta, but.theta),
    };
  }

  /** Avance la transition en cours. Rend `true` tant qu'elle court. */
  function avancerTransition(secondes) {
    if (!transition) return false;
    transition.t = Math.min(1, transition.t + secondes / reglages.dureeTransition);
    const k = lisser(transition.t);
    const d = transition.depart;
    const b = transition.but;
    orbite.cible.set(
      d.cible.x + (b.cible.x - d.cible.x) * k,
      d.cible.y + (b.cible.y - d.cible.y) * k,
      d.cible.z + (b.cible.z - d.cible.z) * k,
    );
    orbite.theta = d.theta + transition.ecartTheta * k;
    orbite.phi = d.phi + (b.phi - d.phi) * k;
    orbite.rayon = d.rayon + (b.rayon - d.rayon) * k;
    if (transition.t >= 1) transition = null;
    appliquer();
    return true;
  }

  /** La main de l'utilisateur prime sur une animation. */
  function interrompreTransition() {
    const courait = transition !== null;
    transition = null;
    return courait;
  }

  /**
   * Déplacement et rotation en mode libre.
   *
   * `avant` suit le LACET seul, jamais le tangage : avancer en regardant le sol
   * ferait plonger, et on veut se déplacer au plancher de la vue tout en pouvant
   * regarder ailleurs. Monter et descendre suivent z quoi qu'il arrive.
   */
  function deplacerLibre({ avant = 0, cote = 0, vertical = 0 }, secondes = 1) {
    if (!modeLibre) return false;
    const v = reglages.vitesseDeplacement * secondes;
    const pas = pasLibre(libre.lacet, { avant, cote });
    libre.position.x += pas.x * v;
    libre.position.y += pas.y * v;
    libre.position.z += vertical * v;
    appliquer();
    return true;
  }

  /**
   * Oriente le regard. Le TANGAGE est borné de part et d'autre de l'horizontale,
   * comme `phi` l'est déjà en orbite : sans borne on bascule par le zénith, et
   * `up` ne veut plus rien dire. Le lacet, lui, tourne sans fin.
   */
  function tournerLibre(dx, dy) {
    if (!modeLibre) return false;
    const r = reglages.vitesseRotation;
    libre.lacet -= dx * r;
    libre.tangage = Math.min(reglages.pitchMax, Math.max(reglages.pitchMin, libre.tangage - dy * r));
    appliquer();
    return true;
  }

  /**
   * Bascule entre les deux modes.
   *
   * En passant au libre, la caméra CONSERVE sa pose du moment : un basculement qui
   * téléporterait désorienterait à chaque aller-retour. En revenant à l'orbite,
   * elle reprend l'orbite là où elle l'avait laissé — inventer une cible depuis une
   * position quelconque serait un choix arbitraire, et il se verrait.
   *
   * Conséquence assumée : l'aller-retour orbite -> libre -> orbite ne restitue pas
   * la pose libre. L'orbite est le mode de référence.
   */
  function basculerMode(versLibre = !modeLibre) {
    if (versLibre === modeLibre) return modeLibre;
    if (versLibre) {
      libre.position.copy(camera.position);
      const d = new Vector3().subVectors(orbite.cible, camera.position).normalize();
      libre.lacet = Math.atan2(d.y, d.x);
      libre.tangage = Math.acos(Math.min(1, Math.max(-1, d.z)));
    }
    modeLibre = versLibre;
    appliquer();
    return modeLibre;
  }

  const rayon = new Raycaster();
  const ecran = new Vector2();

  /**
   * Un geste a-t-il désigné, ou seulement cadré ?
   *
   * `pointerup` termine aussi bien un clic qu'une rotation d'orbite : l'évènement
   * est le même, seul le trajet parcouru les sépare. La vue est le seul endroit qui
   * voie ce trajet — elle observe `pointerdown` et `pointermove` — et c'est donc ici
   * que le fait se constate. Ce qu'on en conclut est une politique d'interface, et
   * elle reste chez l'appelant.
   *
   * Un seuil unique, lu à deux endroits : deux seuils finiraient par diverger.
   */
  const estUnClic = () => !aBouge;

  /** Désignation d'un objet. Ignore un geste qui était en fait une rotation. */
  function objetSous(evenement, candidats) {
    if (!estUnClic()) return null;
    const r = cible.getBoundingClientRect();
    ecran.x = ((evenement.clientX - r.left) / r.width) * 2 - 1;
    ecran.y = -((evenement.clientY - r.top) / r.height) * 2 + 1;
    rayon.setFromCamera(ecran, camera);
    const touches = rayon.intersectObjects(candidats, true);
    return touches.length ? touches[0].object : null;
  }

  appliquer();
  redimensionner();

  // Le conteneur est observé, et pas seulement la fenêtre. Un évènement « resize »
  // ne se déclenche que si la FENÊTRE change : il manque tout reflux interne —
  // hauteur du pied de page, retour à la ligne des boutons d'en-tête, apparition
  // d'un bandeau. Dans ces cas le canvas était étiré par la feuille de style tandis
  // que le tampon de rendu et le rapport d'aspect restaient à l'ancienne taille,
  // et l'image se déformait jusqu'au redimensionnement suivant de la fenêtre.
  const observateur =
    typeof ResizeObserver === 'function' ? new ResizeObserver(() => redimensionner()) : null;
  if (observateur) observateur.observe(conteneur);
  else globalThis.addEventListener('resize', redimensionner);

  let boucleActive = true;
  const api = {
    scene,
    camera,
    renderer,
    allerAVue,
    vuesDisponibles: presentation.vues.map((v) => ({ id: v.id, libelle: v.libelle })),
    basculerMode,
    viser,
    centre: () => centre.clone(),
    transitionEnCours: () => transition !== null,
    interrompreTransition,
    estEnModeLibre: () => modeLibre,
    poseLibre: () => ({ position: libre.position.clone(), lacet: libre.lacet, tangage: libre.tangage }),
    deplacerLibre,
    tournerLibre,
    zoomer,
    objetSous,
    estUnClic,
    redimensionner,
    /** Crochet appelé avant chaque image. Sert notamment à escamoter le plafond. */
    avantRendu: null,
    /** Crochet appelé à chaque image avec le temps écoulé, en secondes. */
    aChaqueImage: null,
    arreter() {
      boucleActive = false;
      if (observateur) observateur.disconnect();
      else globalThis.removeEventListener('resize', redimensionner);
    },
  };

  let instantPrecedent = null;
  (function boucle(instant) {
    if (!boucleActive) return;
    // Le déplacement s'intègre sur le TEMPS ÉCOULÉ, pas sur le nombre d'images :
    // une vitesse en mètres par seconde ne doit pas dépendre de la cadence de
    // rafraîchissement de l'écran.
    if (api.aChaqueImage && typeof instant === 'number') {
      const secondes = instantPrecedent === null ? 0 : Math.min(0.1, (instant - instantPrecedent) / 1000);
      instantPrecedent = instant;
      if (secondes > 0) {
        avancerTransition(secondes);
        api.aChaqueImage(secondes);
      }
    }
    if (api.avantRendu) api.avantRendu();
    renderer.render(scene, camera);
    globalThis.requestAnimationFrame(boucle);
  })();

  return api;
}
