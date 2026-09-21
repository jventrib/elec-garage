/**
 * Accès au catalogue de chantier, chargé depuis data/chantier.json.
 *
 * La liste des phases reste la propriété du socle — une fonctionnalité
 * électrique choisit une phase, elle n'en invente pas — mais elle est une
 * donnée et non du code : la relire ou la réordonner ne demande pas de toucher
 * à la logique.
 */

export function phases(chantier) {
  return chantier.phases.map((p) => p.id);
}

/** Rang d'une phase dans l'ordre du chantier. -1 si la phase est inconnue. */
export function rangPhase(chantier, phase) {
  return chantier.phases.findIndex((p) => p.id === phase);
}

export function naturesEtape(chantier) {
  return chantier.naturesEtape.map((n) => n.id);
}

export function verifications(chantier) {
  return chantier.verifications.map((v) => v.id);
}

/** Les vérifications que le Principe V de la constitution rend obligatoires. */
export function verificationsExigees(chantier) {
  return chantier.verifications.filter((v) => v.exigeeParPrincipeV).map((v) => v.id);
}

export function libelleDe(liste, id) {
  return liste.find((x) => x.id === id)?.libelle ?? id;
}
