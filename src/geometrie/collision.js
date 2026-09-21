import { calibreDe } from './section.js';
/**
 * Intersection d'un cheminement avec un obstacle.
 *
 * Trois verdicts, jamais deux. Un contrôle binaire répondrait « pas de collision »
 * sur un volume qu'il n'a pas pu tester, et cette réponse serait un mensonge de
 * l'espèce précise que le Principe VI proscrit : une valeur rassurante à la place
 * d'une inconnue.
 *
 * Un obstacle se présente sous trois formes, et non deux :
 *
 * - `volume` relevé — les deux verdicts sont démontrables.
 * - `volumeMajorant` seul — l'encombrement réel n'est pas relevé, mais il est
 *   encadré par des cotes qui le sont. Alors **un seul** verdict se démontre :
 *   être disjoint du majorant prouve le dégagement, tandis que le recouper ne
 *   prouve rien, l'obstacle réel étant plus petit que son majorant. C'est le cas
 *   du tablier de la sectionnelle en position ouverte, borné par la course du
 *   rail et par la hauteur de passage de la baie.
 * - ni l'un ni l'autre — aucun verdict.
 *
 * L'asymétrie du cas médian n'est pas une commodité : elle place l'imprécision du
 * côté du surcoût d'un détour, jamais du côté d'un conduit posé dans le tablier.
 */

export const VERDICTS = {
  CONFORME: 'conforme',
  COLLISION: 'en-collision',
  NON_CONCLUANT: 'non-concluant',
};

/** Boîte englobante d'un segment, élargie du rayon du conduit. */
function boiteDeSegment(segment, diametre) {
  const r = (diametre ?? 0) / 2;
  const min = {};
  const max = {};
  for (const axe of ['x', 'y', 'z']) {
    min[axe] = Math.min(segment.de[axe], segment.a[axe]) - r;
    max[axe] = Math.max(segment.de[axe], segment.a[axe]) + r;
  }
  return { min, max };
}

function seChevauchent(a, b) {
  return ['x', 'y', 'z'].every((axe) => a.min[axe] <= b.max[axe] && b.min[axe] <= a.max[axe]);
}

/** Verdict pour un segment face à un obstacle. */
export function verdictSegment(segment, obstacle, diametre = null) {
  const boite = boiteDeSegment(segment, diametre);

  if (obstacle.volume && !obstacle.incertain) {
    return seChevauchent(boite, obstacle.volume) ? VERDICTS.COLLISION : VERDICTS.CONFORME;
  }

  // Majorant : seul le dégagement se démontre. Le recoupement ne conclut pas.
  if (obstacle.volumeMajorant && !seChevauchent(boite, obstacle.volumeMajorant)) {
    return VERDICTS.CONFORME;
  }

  return VERDICTS.NON_CONCLUANT;
}

/** Pourquoi un obstacle empêche de conclure, en clair. */
function raisonNonConcluant(obstacle) {
  if (obstacle.volumeMajorant) return 'recoupe le majorant déduit ; encombrement réel non relevé';
  // Un obstacle sans baie de rattachement décrit une zone libre du local, non
  // l'ouvrant d'une baie. Le vocabulaire suit celui du panneau d'incertitudes :
  // le même objet ne doit pas y être nommé de deux façons.
  if (!obstacle.volume && obstacle.baie === undefined) return 'zone libre du local, non relevée';
  if (!obstacle.volume && obstacle.incertain) return 'encombrement non relevé';
  if (!obstacle.volume) return 'volume absent des données';
  return 'obstacle déclaré incertain';
}

/** Contrôle l'ensemble des cheminements contre l'ensemble des obstacles. */
export function controlerCollisions(modele) {
  const obstacles = modele.local.obstacles ?? [];
  const resultats = [];

  for (const ch of modele.cheminements ?? []) {
    for (const [i, segment] of (ch.segments ?? []).entries()) {
      for (const obstacle of obstacles) {
        resultats.push({
          cheminement: ch.id,
          segment: i + 1,
          obstacle: obstacle.id,
          verdict: verdictSegment(segment, obstacle, calibreDe(ch.section)),
        });
      }
    }
  }

  const compte = (v) => resultats.filter((r) => r.verdict === v).length;
  const idsNonConcluants = new Set(
    resultats.filter((r) => r.verdict === VERDICTS.NON_CONCLUANT).map((r) => r.obstacle),
  );

  return {
    resultats,
    conformes: compte(VERDICTS.CONFORME),
    collisions: compte(VERDICTS.COLLISION),
    nonConcluants: compte(VERDICTS.NON_CONCLUANT),
    obstaclesNonConcluants: obstacles
      .filter((o) => idsNonConcluants.has(o.id))
      .map((o) => ({ id: o.id, raison: raisonNonConcluant(o) })),
  };
}
