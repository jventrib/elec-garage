/**
 * Le local : sol, plafond, parois et baies, construits à partir du seul relevé.
 * Aucune cote n'est écrite ici (FR-001, FR-002, FR-021).
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

/** Index des faces d'une boîte : +x, -x, +y, -y, +z, -z. */
const FACE_INTERIEURE_PAR_PAROI = { sud: 2, nord: 3, ouest: 0, est: 1 };

function materiauxParoi(paroi, couleurs) {
  const mats = Array.from({ length: 6 }, () => new MeshStandardMaterial({ color: couleurs.paroi, roughness: 1 }));
  const interieure = FACE_INTERIEURE_PAR_PAROI[paroi];
  // FR-005 : la face intérieure se distingue de l'extérieure, sinon un composant
  // posé en façade extérieure serait indiscernable d'un composant intérieur.
  if (interieure !== undefined) {
    mats[interieure] = new MeshStandardMaterial({ color: couleurs.faceInterieure, roughness: 1 });
  }
  return mats;
}

function boite(min, max, materiau) {
  const dx = max.x - min.x;
  const dy = max.y - min.y;
  const dz = max.z - min.z;
  if (dx <= 1e-9 || dy <= 1e-9 || dz <= 1e-9) return null;
  const mesh = new Mesh(new BoxGeometry(dx, dy, dz), materiau);
  mesh.position.set(min.x + dx / 2, min.y + dy / 2, min.z + dz / 2);
  return mesh;
}

/** Arêtes d'une boîte, alignées sur elle. Elles donnent l'échelle et les angles. */
function aretes(mesh, presentation) {
  const lignes = new LineSegments(
    new EdgesGeometry(mesh.geometry),
    new LineBasicMaterial({
      color: presentation.couleurs.arete,
      transparent: true,
      opacity: presentation.opacites.arete,
    }),
  );
  lignes.position.copy(mesh.position);
  return lignes;
}

/** Étendue d'une paroi le long de son axe, et son épaisseur dans l'autre direction. */
function gabaritParoi(local, paroi) {
  const { x, y } = local.oeuvre;
  const e = local.epaisseurParois;
  const h = local.hauteurSousPlafond;
  switch (paroi) {
    case 'sud':
      return { axe: 'x', de: -e, a: x + e, fixe: { min: -e, max: 0 }, h };
    case 'nord':
      return { axe: 'x', de: -e, a: x + e, fixe: { min: y, max: y + e }, h };
    case 'ouest':
      return { axe: 'y', de: 0, a: y, fixe: { min: -e, max: 0 }, h };
    case 'est':
      return { axe: 'y', de: 0, a: y, fixe: { min: x, max: x + e }, h };
    default:
      return null;
  }
}

function morceau(gabarit, deAxe, aAxe, z0, z1) {
  const f = gabarit.fixe;
  return gabarit.axe === 'x'
    ? [{ x: deAxe, y: f.min, z: z0 }, { x: aAxe, y: f.max, z: z1 }]
    : [{ x: f.min, y: deAxe, z: z0 }, { x: f.max, y: aAxe, z: z1 }];
}

export function construireLocal(local, presentation) {
  const couleurs = presentation.couleurs;
  const dalle = presentation.epaisseurDalle;
  const groupe = new Group();
  groupe.name = 'local';
  const e = local.epaisseurParois;
  const h = local.hauteurSousPlafond;
  const { x: X, y: Y } = local.oeuvre;

  // Sol, sur l'emprise extérieure.
  const sol = boite(
    { x: -e, y: -e, z: -dalle },
    { x: X + e, y: Y + e, z: 0 },
    new MeshStandardMaterial({ color: couleurs.sol, roughness: 1 }),
  );
  sol.name = 'sol';
  groupe.add(sol);

  // Plafond, sur l'œuvre intérieure. Escamotable : un plafond opaque créerait la
  // zone aveugle que FR-004 interdit.
  const plafond = boite(
    { x: 0, y: 0, z: h },
    { x: X, y: Y, z: h + dalle },
    new MeshStandardMaterial({ color: couleurs.plafond, roughness: 1 }),
  );
  plafond.name = 'plafond';
  groupe.add(plafond);

  for (const paroi of ['sud', 'nord', 'ouest', 'est']) {
    const gabarit = gabaritParoi(local, paroi);
    const materiaux = materiauxParoi(paroi, couleurs);
    const baies = (local.baies ?? [])
      .filter((b) => b.paroi === paroi)
      .map((b) => ({ baie: b, seg: segmentBaie(local, b) }))
      .sort((a, b) => a.seg.min - b.seg.min);

    let curseur = gabarit.de;
    for (const { baie, seg } of baies) {
      const pleinAvant = morceau(gabarit, curseur, seg.min, 0, gabarit.h);
      const m1 = boite(pleinAvant[0], pleinAvant[1], materiaux);
      if (m1) {
        m1.name = `paroi-${paroi}`;
        groupe.add(m1, aretes(m1, presentation));
      }
      // Linteau : seulement si la hauteur de la baie est relevée. Une hauteur
      // inconnue laisse l'ouverture pleine hauteur plutôt que d'inventer un
      // linteau plausible (FR-007).
      if (baie.hauteur !== null && baie.hauteur < gabarit.h) {
        const l = morceau(gabarit, seg.min, seg.max, baie.hauteur, gabarit.h);
        const ml = boite(l[0], l[1], materiaux);
        if (ml) {
          ml.name = `linteau-${baie.id}`;
          groupe.add(ml, aretes(ml, presentation));
        }
      }
      curseur = seg.max;
    }
    const reste = morceau(gabarit, curseur, gabarit.a, 0, gabarit.h);
    const m2 = boite(reste[0], reste[1], materiaux);
    if (m2) {
      m2.name = `paroi-${paroi}`;
      groupe.add(m2, aretes(m2, presentation));
    }
  }

  return { groupe, plafond, sol };
}

