/**
 * Rendu des cheminements, des boîtes et des traversées.
 *
 * Un conduit posé en apparent n'est pas un trait entre deux composants : c'est un
 * volume fixé sur une face, qui occupe de la place et qui peut heurter quelque
 * chose. Il est donc dessiné comme tel, en saillie du nu sur lequel il repose.
 */

import {
  Group,
  Mesh,
  BoxGeometry,
  TubeGeometry,
  CatmullRomCurve3,
  MeshStandardMaterial,
  EdgesGeometry,
  LineSegments,
  LineBasicMaterial,
  Vector3,
} from '../../vendor/three/three.module.js';
import { nusDeParoi, entreeDeTraversee, sortieDeTraversee } from '../donnees/chargement.js';
import { AXE_NORMAL, longueurSegment, estCordage } from '../geometrie/cheminement.js';
import { VERDICTS, controlerCollisions } from '../geometrie/collision.js';
import { encombrementDe, sectionArretee } from '../geometrie/section.js';

/** Sens dans lequel le conduit sort du nu : vers l'intérieur du local, ou dehors. */
function sensDeSaillie(face, surNuInterieur) {
  const versLePlus = { est: false, nord: false, plafond: false, ouest: true, sud: true }[face];
  const signe = versLePlus ? 1 : -1;
  return surNuInterieur ? signe : -signe;
}

/**
 * Boîte de rendu d'un segment, décalée pour reposer en saillie du nu.
 *
 * L'encombrement n'est plus une valeur unique : une section rectangulaire n'a pas
 * la même cote de face et de profil. `saillie` sort de la paroi, `transversal`
 * court le long d'elle, et l'axe du segment porte sa longueur.
 */
function boiteEnSaillie(local, segment, encombrement) {
  const normal = AXE_NORMAL[segment.face];
  const nus = nusDeParoi(local, segment.face);
  if (!normal || !nus) return null;

  const surNuInterieur = Math.abs(segment.de[normal] - nus.interieur) <= 1e-6;
  const decalage = (sensDeSaillie(segment.face, surNuInterieur) * encombrement.saillie) / 2;

  const taille = { x: encombrement.transversal, y: encombrement.transversal, z: encombrement.transversal };
  taille[normal] = encombrement.saillie;
  const centre = {
    x: (segment.de.x + segment.a.x) / 2,
    y: (segment.de.y + segment.a.y) / 2,
    z: (segment.de.z + segment.a.z) / 2,
  };
  for (const axe of ['x', 'y', 'z']) {
    const delta = Math.abs(segment.a[axe] - segment.de[axe]);
    if (delta > 1e-9) taille[axe] = delta;
  }
  centre[normal] += decalage;
  return { taille, centre };
}

/**
 * Le tracé d'un cordage, et sa flèche.
 *
 * Un cordage n'est pas un conduit plus court : c'est un câble QUI TEND, et sa seule
 * différence visible est de tomber. Le dessiner droit, à 12 mm comme le tube de
 * repli, revenait à mentir deux fois — sur un diamètre qui n'est pas arrêté, et sur
 * une souplesse qui est la seule raison d'avoir choisi un câble.
 *
 * La flèche est la parabole `4·f·t·(1−t)` : nulle aux deux aboutisseurs, maximale au
 * milieu. Elle s'annule donc exactement là où le disent les `raccords` de la
 * réglette, et le câble reste accroché aux points que la donnée déclare — c'est ce
 * qui permet de lire la liaison comme une liaison, et pas comme une courbe libre.
 */
function courbeDeCordage(segment, fleche, echantillons = 16) {
  const points = [];
  for (let i = 0; i <= echantillons; i += 1) {
    const t = i / echantillons;
    const chute = 4 * fleche * t * (1 - t);
    points.push(
      new Vector3(
        segment.de.x + (segment.a.x - segment.de.x) * t,
        segment.de.y + (segment.a.y - segment.de.y) * t,
        segment.de.z + (segment.a.z - segment.de.z) * t - chute,
      ),
    );
  }
  return new CatmullRomCurve3(points);
}

/** Le maillage d'un cordage : un tube rond, suivant la flèche, et non une boîte en saillie. */
function meshDeCordage(segment, convention, couleur) {
  const courbe = courbeDeCordage(segment, convention.fleche);
  const geo = new TubeGeometry(courbe, 24, convention.diametre / 2, 8, false);
  const materiau = new MeshStandardMaterial({ color: couleur, roughness: 0.6 });
  const mesh = new Mesh(geo, materiau);
  return { mesh, materiau };
}

export function construireCheminements(modele) {
  const groupe = new Group();
  groupe.name = 'cheminements';
  const presentation = modele.presentation;
  const couleurs = presentation.couleurs;
  const sectionParDefaut = presentation.sectionConventionnelle;

  const collisions = controlerCollisions(modele);
  /** Pire verdict rencontré par chaque cheminement. */
  const verdictParCheminement = new Map();
  for (const r of collisions.resultats) {
    const courant = verdictParCheminement.get(r.cheminement);
    if (r.verdict === VERDICTS.COLLISION) verdictParCheminement.set(r.cheminement, r.verdict);
    else if (!courant) verdictParCheminement.set(r.cheminement, r.verdict);
  }

  const parId = new Map();

  for (const ch of modele.cheminements ?? []) {
    const noeud = new Group();
    noeud.name = ch.id;
    noeud.visible = false;
    const cordage = estCordage(ch);
    // Un cordage garde sa couleur dans les trois registres, quand un conduit prend
    // celle du cheminement dès qu'il est ajouté. Lui rendre la sienne serait un
    // mensonge : on ne verrait plus qu'il est un câble.
    const couleurBase = cordage ? couleurs.cordage : couleurs.cheminement;
    const encombrement = encombrementDe(ch.section, sectionParDefaut[ch.section?.forme ?? 'circulaire']);
    const meshes = [];

    for (const segment of ch.segments ?? []) {
      // Le cordage ne se pose pas en saillie du nu : il PEND entre deux connecteurs.
      if (cordage) {
        const { mesh, materiau } = meshDeCordage(segment, presentation.cordage, couleurBase);
        mesh.userData = { cheminement: ch };
        noeud.add(mesh);
        meshes.push({ mesh, contour: null, materiau });
        continue;
      }
      const b = boiteEnSaillie(modele.local, segment, encombrement);
      if (!b) continue;
      const geo = new BoxGeometry(b.taille.x, b.taille.y, b.taille.z);
      const materiau = new MeshStandardMaterial({ color: couleurs.cheminement, roughness: 0.8 });
      const mesh = new Mesh(geo, materiau);
      mesh.position.set(b.centre.x, b.centre.y, b.centre.z);
      mesh.userData = { cheminement: ch };
      const contour = new LineSegments(
        new EdgesGeometry(geo),
        new LineBasicMaterial({ color: couleurs.contourAjout }),
      );
      contour.position.copy(mesh.position);
      contour.visible = false;
      noeud.add(mesh, contour);
      meshes.push({ mesh, contour, materiau });
    }

    groupe.add(noeud);
    parId.set(ch.id, {
      noeud,
      meshes,
      cheminement: ch,
      couleurBase,
      sectionConnue: sectionArretee(ch.section),
      verdict: verdictParCheminement.get(ch.id) ?? VERDICTS.CONFORME,
    });
  }

  // Traversées : un fourreau qui perce les 0,20 m de béton, EN BIAIS.
  //
  // Il était dessiné droit, à altitude constante. C'était figurer exactement la
  // faute que la prose de l'étape met en garde de commettre — « deux boîtiers dos
  // à dos invitent à percer horizontalement, et un percement horizontal annule la
  // pente ». Un avertissement écrit ne corrige pas un geste naturel ; une image
  // qui le contredit, si.
  //
  // Quand le dénivelé n'est pas arrêté, on dessine à une pente CONVENTIONNELLE et
  // la fiche dit « inconnu » — jamais à plat. Le repli naturel serait ici le pire
  // de tous, puisqu'il coïnciderait avec l'erreur.
  const traverseesParId = new Map();
  for (const t of modele.traversees ?? []) {
    const nus = nusDeParoi(modele.local, t.paroi);
    if (!nus) continue;
    const entree = entreeDeTraversee(modele.local, t);
    const sortie = sortieDeTraversee(modele.local, t);
    if (!entree || !sortie) continue;

    const deniveleConnu = typeof t.denivele === 'number' && t.denivele > 0;
    const chute = deniveleConnu ? t.denivele : presentation.deniveleConventionnel;
    const a = new Vector3(entree.x, entree.y, entree.z + (deniveleConnu ? 0 : chute / 2));
    const b = new Vector3(sortie.x, sortie.y, sortie.z - (deniveleConnu ? 0 : chute / 2));

    const d = sectionParDefaut.circulaire.diametre * 1.6;
    const axe = new Vector3().subVectors(b, a);
    const geo = new BoxGeometry(d, d, axe.length());
    const materiau = new MeshStandardMaterial({ color: couleurs.traversee, roughness: 0.8 });
    const mesh = new Mesh(geo, materiau);
    mesh.position.copy(new Vector3().addVectors(a, b).multiplyScalar(0.5));
    mesh.quaternion.setFromUnitVectors(new Vector3(0, 0, 1), axe.clone().normalize());
    mesh.userData = { traversee: t };
    const noeud = new Group();
    noeud.add(mesh);
    noeud.visible = false;
    groupe.add(noeud);
    traverseesParId.set(t.id, { noeud, materiau, traversee: t, deniveleConnu, entree: a, sortie: b });
  }

  /**
   * Les trois registres, appliqués aux conduits et aux traversées comme aux
   * composants. Un conduit non encore posé est absent de la vue, pas estompé.
   *
   * Les collisions sont peintes en rouge ; les contrôles non concluants ne le sont
   * PAS. Avec quatre obstacles non relevés, tout serait orange et l'information
   * serait noyée : elle est portée par le panneau, pas par la couleur.
   */
  function appliquerEtat(partition) {
    for (const e of parId.values()) e.noeud.visible = false;
    for (const e of traverseesParId.values()) e.noeud.visible = false;

    const peindre = (entree, couleur, contour) => {
      entree.noeud.visible = true;
      for (const m of entree.meshes) {
        m.materiau.color.set(couleur);
        // Un cordage n'a pas de contour : c'est un câble, et un liseré le ferait
        // ressembler à un tube ajouté. Il se distingue par son diamètre et sa flèche.
        if (m.contour) m.contour.visible = contour;
      }
    };

    for (const ch of partition.cheminements.enPlace) {
      const e = parId.get(ch.id);
      if (e) peindre(e, couleurs.composantEnPlace, false);
    }
    for (const ch of partition.cheminements.ajoutes) {
      const e = parId.get(ch.id);
      if (!e) continue;
      const couleur = e.verdict === VERDICTS.COLLISION ? couleurs.collision : e.couleurBase;
      peindre(e, couleur, true);
    }
    for (const liste of [partition.traversees.enPlace, partition.traversees.ajoutes]) {
      const ajout = liste === partition.traversees.ajoutes;
      for (const t of liste) {
        const e = traverseesParId.get(t.id);
        if (!e) continue;
        e.noeud.visible = true;
        e.materiau.color.set(ajout ? couleurs.traversee : couleurs.composantEnPlace);
      }
    }
  }

  /**
   * Met en évidence un ou plusieurs circuits sur leur tracé réel (FR-035). Plusieurs
   * d'un coup : les trajets d'un conduit partagé les concernent tous, et les
   * souligner l'un après l'autre éteindrait le précédent.
   */
  function souligner(idCircuits) {
    if (idCircuits === null) return;
    const ids = Array.isArray(idCircuits) ? idCircuits : [idCircuits];
    for (const e of parId.values()) {
      if (!e.noeud.visible) continue;
      const porte = (e.cheminement.circuits ?? []).some((id) => ids.includes(id));
      for (const m of e.meshes) {
        m.materiau.color.set(porte ? e.couleurBase : couleurs.composantEnPlace);
        if (m.contour) m.contour.visible = porte;
      }
    }
  }

  const meshes = () => [
    ...[...parId.values()].flatMap((e) => e.meshes.map((m) => m.mesh)),
    ...[...traverseesParId.values()].map((e) => e.noeud.children[0]),
  ];
  const cheminementDe = (objet) => objet?.userData?.cheminement ?? null;
  const traverseeDe = (objet) => objet?.userData?.traversee ?? null;

  return { groupe, appliquerEtat, souligner, meshes, cheminementDe, traverseeDe, collisions, traverseesParId };
}
