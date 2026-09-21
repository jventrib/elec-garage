/**
 * Composants électriques implantés : marqueurs, couleur de circuit, et les trois
 * registres visuels de l'état courant (R10, FR-008, FR-012).
 *
 * Ce qui n'est pas encore posé est ABSENT de la vue, et non estompé. Un composant
 * fantôme, visible mais non posé, est exactement le genre d'ambiguïté qui conduit
 * à raccorder trop tôt.
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

/** Repli déterministe : deux exécutions donnent la même couleur au même circuit. */
export function couleurDeCircuit(circuits, idCircuit, presentation) {
  if (!idCircuit) return presentation.couleurs.composantSansCircuit;
  const declare = circuits.find((c) => c.id === idCircuit);
  if (declare?.couleur) return declare.couleur;
  let h = 0;
  for (let i = 0; i < idCircuit.length; i++) h = (h * 31 + idCircuit.charCodeAt(i)) >>> 0;
  const palette = presentation.paletteCircuits;
  return palette[h % palette.length];
}

/**
 * Dimensions et décalage d'un marqueur selon sa paroi et sa face.
 *
 * Le VOLUME DÉCLARÉ par l'objet prime ; le gabarit du type n'est qu'un repli, pour
 * ceux qui n'en portent pas. Aucune dimension n'est écrite dans ce fichier : elles
 * viennent des données ou de data/types-composants.json.
 *
 * L'ordre a compté : il était inverse, et une enveloppe qui déclarait 0,112 m se
 * dessinait à 0,100 m — le gabarit écrasait la cote. Une dimension déclarée est une
 * cote au même titre qu'un relevé, et lui substituer la valeur conventionnelle d'un
 * type revient à présenter une valeur plausible à la place d'une valeur connue, ce
 * que le Principe VI proscrit.
 *
 * Le décalage sort le marqueur du nu de la paroi, du bon côté : c'est ce qui rend
 * un composant extérieur lisible comme extérieur (FR-005).
 */
export function gabarit(composant, catalogue) {
  const declare = catalogue.types.find((t) => t.id === composant.type);
  const d = composant.dimensions ?? declare?.gabarit ?? catalogue.gabaritParDefaut;
  const g = { l: d.largeur, h: d.hauteur, p: d.profondeur };
  const sens = composant.face === 'exterieur' ? 1 : -1;
  switch (composant.paroi) {
    case 'est':
      return { dims: [g.p, g.l, g.h], decalage: [(sens * g.p) / 2, 0, 0] };
    case 'ouest':
      return { dims: [g.p, g.l, g.h], decalage: [(-sens * g.p) / 2, 0, 0] };
    case 'nord':
      return { dims: [g.l, g.p, g.h], decalage: [0, (sens * g.p) / 2, 0] };
    case 'sud':
      return { dims: [g.l, g.p, g.h], decalage: [0, (-sens * g.p) / 2, 0] };
    case 'plafond':
      return { dims: [g.l, g.l, g.p], decalage: [0, 0, -g.p / 2] };
    default:
      return { dims: [g.l, g.l, g.p], decalage: [0, 0, 0] };
  }
}

export function construireComposants(modele) {
  const groupe = new Group();
  groupe.name = 'composants';
  const parId = new Map();
  const presentation = modele.presentation;
  const enPlace = presentation.couleurs.composantEnPlace;

  for (const composant of modele.composants) {
    const { dims, decalage } = gabarit(composant, modele.types);
    const geo = new BoxGeometry(...dims);
    const couleur = couleurDeCircuit(modele.circuits, composant.circuit, presentation);
    const materiau = new MeshStandardMaterial({ color: couleur, roughness: 0.7 });
    const mesh = new Mesh(geo, materiau);
    mesh.position.set(
      composant.position.x + decalage[0],
      composant.position.y + decalage[1],
      composant.position.z + decalage[2],
    );
    mesh.name = composant.id;
    mesh.userData = { composant };

    const contour = new LineSegments(
      new EdgesGeometry(geo),
      new LineBasicMaterial({ color: presentation.couleurs.contourAjout, linewidth: 2 }),
    );
    contour.position.copy(mesh.position);
    contour.visible = false;

    const noeud = new Group();
    noeud.add(mesh, contour);
    noeud.visible = false;
    groupe.add(noeud);
    parId.set(composant.id, { noeud, mesh, contour, materiau, couleur, composant });
  }

  /**
   * Applique les trois registres : absent (non rendu), en place (teinte neutre
   * atténuée), ajouté par l'étape courante (pleine couleur de circuit + contour).
   */
  function appliquerEtat(etat) {
    for (const { noeud } of parId.values()) noeud.visible = false;
    for (const c of etat.enPlace) {
      const e = parId.get(c.id);
      if (!e) continue;
      e.noeud.visible = true;
      e.materiau.color.set(enPlace);
      e.materiau.opacity = 1;
      e.contour.visible = false;
    }
    for (const c of etat.ajoutes) {
      const e = parId.get(c.id);
      if (!e) continue;
      e.noeud.visible = true;
      e.materiau.color.set(e.couleur);
      e.contour.visible = true;
    }
  }

  /** Met en évidence un circuit entier, du tableau à son dernier point (FR-008). */
  function souligner(idCircuit) {
    for (const e of parId.values()) {
      const concerne = idCircuit !== null && e.composant.circuit === idCircuit;
      if (!e.noeud.visible) continue;
      if (idCircuit === null) continue;
      e.materiau.color.set(concerne ? e.couleur : enPlace);
      e.contour.visible = concerne;
    }
  }

  /**
   * Les appareils d'extrémité d'un trajet prennent la couleur de leur circuit, et
   * les autres appareils visibles passent au neutre. Un appareil où aboutissent
   * plusieurs circuits — le tableau, typiquement — garde le neutre, souligné de son
   * contour : une seule couleur ne dirait pas lesquels, et la fiche les nomme.
   */
  function teinterExtremites(appareils) {
    for (const e of parId.values()) {
      if (!e.noeud.visible) continue;
      const circuits = appareils.get(e.composant.id) ?? [];
      const seul = circuits.length === 1 ? couleurDeCircuit(modele.circuits, circuits[0], presentation) : null;
      e.materiau.color.set(seul ?? enPlace);
      e.contour.visible = circuits.length > 0;
    }
  }

  const meshes = () => [...parId.values()].map((e) => e.mesh);
  const composantDe = (objet) => objet?.userData?.composant ?? null;

  return { groupe, appliquerEtat, souligner, teinterExtremites, meshes, composantDe, parId };
}
