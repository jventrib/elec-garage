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
  MeshStandardMaterial,
  EdgesGeometry,
  LineSegments,
  LineBasicMaterial,
} from '../../vendor/three/three.module.js';
import { nusDeParoi } from '../donnees/chargement.js';
import { AXE_NORMAL, longueurSegment } from '../geometrie/cheminement.js';
import { VERDICTS, controlerCollisions } from '../geometrie/collision.js';

/** Sens dans lequel le conduit sort du nu : vers l'intérieur du local, ou dehors. */
function sensDeSaillie(face, surNuInterieur) {
  const versLePlus = { est: false, nord: false, plafond: false, ouest: true, sud: true }[face];
  const signe = versLePlus ? 1 : -1;
  return surNuInterieur ? signe : -signe;
}

/** Boîte de rendu d'un segment, décalée pour reposer en saillie du nu. */
function boiteEnSaillie(local, segment, diametre) {
  const normal = AXE_NORMAL[segment.face];
  const nus = nusDeParoi(local, segment.face);
  if (!normal || !nus) return null;

  const surNuInterieur = Math.abs(segment.de[normal] - nus.interieur) <= 1e-6;
  const decalage = (sensDeSaillie(segment.face, surNuInterieur) * diametre) / 2;

  const taille = { x: diametre, y: diametre, z: diametre };
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

export function construireCheminements(modele) {
  const groupe = new Group();
  groupe.name = 'cheminements';
  const presentation = modele.presentation;
  const couleurs = presentation.couleurs;
  const diametreParDefaut = presentation.diametreConduitConventionnel;

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
    const diametre = ch.diametre ?? diametreParDefaut;
    const meshes = [];

    for (const segment of ch.segments ?? []) {
      const b = boiteEnSaillie(modele.local, segment, diametre);
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
      diametreConnu: ch.diametre !== null && ch.diametre !== undefined,
      verdict: verdictParCheminement.get(ch.id) ?? VERDICTS.CONFORME,
    });
  }

  // Traversées : un fourreau qui perce les 0,20 m de béton.
  const traverseesParId = new Map();
  for (const t of modele.traversees ?? []) {
    const nus = nusDeParoi(modele.local, t.paroi);
    if (!nus) continue;
    const d = diametreParDefaut * 1.6;
    const taille = { x: d, y: d, z: d };
    taille[nus.axe] = Math.abs(nus.exterieur - nus.interieur);
    const centre = { ...t.position };
    centre[nus.axe] = (nus.interieur + nus.exterieur) / 2;

    const geo = new BoxGeometry(taille.x, taille.y, taille.z);
    const materiau = new MeshStandardMaterial({ color: couleurs.traversee, roughness: 0.8 });
    const mesh = new Mesh(geo, materiau);
    mesh.position.set(centre.x, centre.y, centre.z);
    mesh.userData = { traversee: t };
    const noeud = new Group();
    noeud.add(mesh);
    noeud.visible = false;
    groupe.add(noeud);
    traverseesParId.set(t.id, { noeud, materiau, traversee: t });
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
        m.contour.visible = contour;
      }
    };

    for (const ch of partition.cheminements.enPlace) {
      const e = parId.get(ch.id);
      if (e) peindre(e, couleurs.composantEnPlace, false);
    }
    for (const ch of partition.cheminements.ajoutes) {
      const e = parId.get(ch.id);
      if (!e) continue;
      const couleur = e.verdict === VERDICTS.COLLISION ? couleurs.collision : couleurs.cheminement;
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

  /** Met en évidence un circuit sur son tracé réel (FR-035). */
  function souligner(idCircuit) {
    if (idCircuit === null) return;
    for (const e of parId.values()) {
      if (!e.noeud.visible) continue;
      const porte = (e.cheminement.circuits ?? []).includes(idCircuit);
      for (const m of e.meshes) {
        m.materiau.color.set(porte ? couleurs.cheminement : couleurs.composantEnPlace);
        m.contour.visible = porte;
      }
    }
  }

  const meshes = () => [
    ...[...parId.values()].flatMap((e) => e.meshes.map((m) => m.mesh)),
    ...[...traverseesParId.values()].map((e) => e.noeud.children[0]),
  ];
  const cheminementDe = (objet) => objet?.userData?.cheminement ?? null;
  const traverseeDe = (objet) => objet?.userData?.traversee ?? null;

  return { groupe, appliquerEtat, souligner, meshes, cheminementDe, traverseeDe, collisions };
}
