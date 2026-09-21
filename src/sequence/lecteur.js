/**
 * Navigation dans la séquence (FR-015 à FR-019) et mémorisation de la position
 * (FR-031).
 *
 * Le lecteur ne retient qu'un entier. Il mémorise une position, pas un
 * avancement de travaux : savoir ce qui a réellement été exécuté relève du
 * procès-verbal d'essais, pas d'une notice.
 */

export const CLE_POSITION = 'elec-garage.lecteur.position';

export function stockageMemoire() {
  const m = new Map();
  return { lire: (k) => (m.has(k) ? m.get(k) : null), ecrire: (k, v) => m.set(k, v) };
}

/**
 * Stockage persistant, avec repli silencieux.
 * L'accès à localStorage depuis une page ouverte en file:// n'est pas garanti
 * d'un navigateur à l'autre et peut lever. FR-031 étant un confort et non une
 * exigence de sécurité, perdre la reprise vaut mieux qu'une page qui n'ouvre pas.
 */
export function stockageLocal() {
  try {
    const sonde = '__elec_garage_sonde__';
    globalThis.localStorage.setItem(sonde, '1');
    globalThis.localStorage.removeItem(sonde);
    return {
      lire: (k) => {
        try {
          return globalThis.localStorage.getItem(k);
        } catch {
          return null;
        }
      },
      ecrire: (k, v) => {
        try {
          globalThis.localStorage.setItem(k, v);
        } catch {
          /* dégradation volontaire */
        }
      },
    };
  } catch {
    return stockageMemoire();
  }
}

export function creerLecteur({ sequence, stockage = stockageLocal() }) {
  const total = sequence.total;
  let positionPerdue = false;
  let rang = total > 0 ? 1 : 0;

  // Reprise : une position dont l'empreinte a changé, ou qui dépasse la séquence,
  // ne désigne plus rien. On rouvre au début en le disant.
  //
  // La lecture est protégée ici et pas seulement dans l'adaptateur : le lecteur ne
  // doit dépendre d'aucune promesse de robustesse extérieure. Perdre la reprise
  // est un désagrément, ne pas ouvrir la notice sur un chantier n'en est pas un.
  let brut = null;
  try {
    brut = stockage.lire(CLE_POSITION);
  } catch {
    positionPerdue = true;
  }
  if (brut && total > 0) {
    try {
      const enregistre = JSON.parse(brut);
      if (enregistre.empreinte !== sequence.empreinte) positionPerdue = true;
      else if (!Number.isInteger(enregistre.rang) || enregistre.rang < 1 || enregistre.rang > total)
        positionPerdue = true;
      else rang = enregistre.rang;
    } catch {
      positionPerdue = true;
    }
  }

  function enregistrer() {
    if (total === 0) return;
    try {
      stockage.ecrire(CLE_POSITION, JSON.stringify({ rang, empreinte: sequence.empreinte }));
    } catch {
      /* La navigation continue sans mémorisation. */
    }
  }
  enregistrer();

  return {
    get rang() {
      return rang;
    },
    get total() {
      return total;
    },
    get positionPerdue() {
      return positionPerdue;
    },
    etape() {
      return total === 0 ? null : sequence.etapes[rang - 1];
    },
    peutAvancer() {
      return total > 0 && rang < total;
    },
    peutReculer() {
      return total > 0 && rang > 1;
    },
    /** Renvoie false aux bornes. Ne lève pas et ne sort pas de la séquence (FR-017). */
    avancer() {
      if (!this.peutAvancer()) return false;
      rang += 1;
      positionPerdue = false;
      enregistrer();
      return true;
    },
    reculer() {
      if (!this.peutReculer()) return false;
      rang -= 1;
      positionPerdue = false;
      enregistrer();
      return true;
    },
    /** Accès direct, pour ne pas imposer de parcourir une longue séquence (FR-019). */
    allerA(cible) {
      if (!Number.isInteger(cible) || cible < 1 || cible > total) return false;
      rang = cible;
      positionPerdue = false;
      enregistrer();
      return true;
    },
  };
}
