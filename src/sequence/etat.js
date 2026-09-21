/**
 * État de l'installation au rang N.
 *
 * Fonction pure du rang, sans mémoire : reculer puis ré-avancer ne peut pas
 * produire autre chose que l'état initial, puisqu'il n'existe aucun chemin qui
 * fabriquerait un état. C'est ce qui rend FR-016 vrai par construction plutôt
 * que par vigilance (R5).
 */

/** Ce que la séquence met en place : composants, cheminements et traversées. */
export const GENRES_POSABLES = ['composants', 'cheminements', 'traversees'];

/**
 * Rang d'apparition de chaque objet posable : rang de la première étape de nature
 * « pose » qui le référence. Déduit, jamais déclaré, pour qu'il ne puisse pas
 * diverger de la séquence.
 *
 * Un conduit et un socle se comportent de la même façon vis-à-vis de la séquence :
 * un seul mécanisme les traite, plutôt que trois codes parallèles qui divergeraient.
 */
export function rangsApparition(sequence) {
  const rangs = new Map();
  for (const etape of sequence.etapes) {
    if (etape.nature !== 'pose') continue;
    for (const genre of GENRES_POSABLES) {
      for (const id of etape[genre] ?? []) {
        if (!rangs.has(id)) rangs.set(id, etape.rang);
      }
    }
  }
  return rangs;
}

/** Tous les objets posables du modèle, étiquetés par leur genre. */
export function objetsPosables(modele) {
  return GENRES_POSABLES.flatMap((genre) =>
    (modele[genre] ?? []).map((o) => ({ ...o, genre })),
  );
}

/**
 * Partition des composants au rang demandé.
 * - enPlace : posés avant cette étape
 * - ajoutes : posés par cette étape
 * - absents : pas encore posés, et volontairement non rendus (R10)
 */
export function etatAuRang(sequence, objets, rang) {
  const rangs = rangsApparition(sequence);
  const enPlace = [];
  const ajoutes = [];
  const absents = [];
  for (const objet of objets) {
    const r = rangs.get(objet.id);
    if (r === undefined || r > rang) absents.push(objet);
    else if (r === rang) ajoutes.push(objet);
    else enPlace.push(objet);
  }
  return { rang, enPlace, ajoutes, absents };
}

/** La partition, genre par genre, pour que le rendu traite chacun à sa façon. */
export function etatParGenre(sequence, modele, rang) {
  const partition = {};
  for (const genre of GENRES_POSABLES) {
    partition[genre] = etatAuRang(sequence, modele[genre] ?? [], rang);
  }
  return partition;
}
