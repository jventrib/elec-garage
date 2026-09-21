/**
 * Intersection d'un cheminement avec un obstacle.
 *
 * Trois verdicts, jamais deux. Trois obstacles sur quatre du relevé ont un volume
 * inconnu — rail de la sectionnelle, vantail de la porte de service, gabarit de
 * manœuvre du véhicule. Un contrôle binaire répondrait « pas de collision » sur un
 * volume qu'il n'a pas pu tester, et cette réponse serait un mensonge de l'espèce
 * précise que le Principe VI proscrit : une valeur rassurante à la place d'une
 * inconnue.
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

/**
 * Verdict pour un segment face à un obstacle. Un obstacle dont le volume n'est pas
 * relevé, ou marqué incertain, ne permet aucune conclusion.
 */
export function verdictSegment(segment, obstacle, diametre = null) {
  if (!obstacle.volume || obstacle.incertain) return VERDICTS.NON_CONCLUANT;
  return seChevauchent(boiteDeSegment(segment, diametre), obstacle.volume)
    ? VERDICTS.COLLISION
    : VERDICTS.CONFORME;
}

/** Pourquoi un obstacle empêche de conclure, en clair. */
function raisonNonConcluant(obstacle) {
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
          verdict: verdictSegment(segment, obstacle, ch.diametre),
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
