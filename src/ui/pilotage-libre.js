/**
 * Pilotage au clavier du mode de déplacement libre.
 *
 * Les touches se lisent sur `event.code`, **jamais** sur `event.key`. `code`
 * désigne une POSITION physique : `KeyW` est la touche en haut à gauche du bloc
 * quelle que soit la disposition, et elle porte `Z` sur un clavier français.
 * Lire `key` rendrait `'z'` et le mode serait injouable en AZERTY — il faudrait
 * détecter la disposition, ce que le navigateur ne dit pas de façon fiable.
 *
 * Ce module vit à part de `controles.js`, qui pilote la séquence. Les deux jeux de
 * touches DOIVENT rester disjoints : une touche qui ferait deux choses selon le
 * mode est une touche dont l'effet ne se prédit pas. Un test tient cette
 * disjonction, parce que rien d'autre ne l'empêchera.
 */

/** Position physique -> axe de déplacement. Aucune n'est utilisée par la séquence. */
export const TOUCHES = {
  KeyW: { avant: 1 },
  KeyS: { avant: -1 },
  KeyA: { cote: -1 },
  KeyD: { cote: 1 },
  Space: { vertical: 1 },
  ShiftLeft: { vertical: -1 },
};

/** Étiquettes affichables, par disposition, pour que l'aide ne mente pas. */
export const ETIQUETTES = {
  azerty: { KeyW: 'Z', KeyS: 'S', KeyA: 'Q', KeyD: 'D', Space: 'Espace', ShiftLeft: 'Maj' },
  qwerty: { KeyW: 'W', KeyS: 'S', KeyA: 'A', KeyD: 'D', Space: 'Espace', ShiftLeft: 'Maj' },
};

/**
 * Pas horizontal dans le repère du local, pour un lacet et des axes donnés.
 *
 * Le regard suit (cos lacet, sin lacet) et z est le haut : la DROITE de la caméra
 * est regard × haut = (sin lacet, −cos lacet). `cote` positif va à droite.
 * Partagé par la vue et par ses tests, pour que les tests exercent ce calcul-ci et
 * non une copie — c'est une copie qui a laissé passer les côtés inversés.
 */
export function pasLibre(lacet, { avant = 0, cote = 0 }) {
  const cos = Math.cos(lacet);
  const sin = Math.sin(lacet);
  return { x: avant * cos + cote * sin, y: avant * sin - cote * cos };
}

export function creerPilotageLibre(vue, { cible = globalThis } = {}) {
  const enfoncees = new Set();

  /**
   * Une frappe venant d'un champ de saisie ne pilote pas la caméra : taper « 12 »
   * dans le saut d'étape ne doit pas voler à travers la maquette.
   *
   * Le test porte sur `tagName` et non sur `instanceof HTMLInputElement` : ce
   * constructeur n'existe pas hors navigateur, et l'`instanceof` y lève au lieu de
   * rendre faux. Le même motif dort dans `controles.js`, où aucun test ne l'exerce.
   */
  const dansUnChamp = (n) => {
    if (!n) return false;
    const T = globalThis.HTMLInputElement;
    if (typeof T === 'function' && n instanceof T) return true;
    return n.tagName === 'INPUT' || n.tagName === 'TEXTAREA' || n.isContentEditable === true;
  };

  const pertinent = (e) => !dansUnChamp(e.target) && Object.hasOwn(TOUCHES, e.code);

  function surEnfoncement(e) {
    if (!vue.estEnModeLibre() || !pertinent(e)) return;
    e.preventDefault();
    enfoncees.add(e.code);
  }

  function surRelachement(e) {
    if (!Object.hasOwn(TOUCHES, e.code)) return;
    enfoncees.delete(e.code);
  }

  /** Toutes les touches lâchées : sans ça, quitter l'onglet laisse la caméra en dérive. */
  const toutRelacher = () => enfoncees.clear();

  cible.addEventListener('keydown', surEnfoncement);
  cible.addEventListener('keyup', surRelachement);
  cible.addEventListener('blur', toutRelacher);

  /**
   * Intègre le déplacement sur le temps écoulé, et non par frappe.
   *
   * Bouger à chaque `keydown` ferait dépendre la vitesse de la cadence de
   * répétition du clavier, qui varie d'un poste à l'autre et se règle dans le
   * système d'exploitation. Une distance parcourue ne doit pas dépendre de ça.
   */
  function avancer(secondes) {
    if (!enfoncees.size || !vue.estEnModeLibre()) return false;
    const axes = { avant: 0, cote: 0, vertical: 0 };
    for (const code of enfoncees) {
      for (const [axe, signe] of Object.entries(TOUCHES[code])) axes[axe] += signe;
    }
    return vue.deplacerLibre(axes, secondes);
  }

  return {
    avancer,
    touchesEnfoncees: () => new Set(enfoncees),
    arreter() {
      cible.removeEventListener('keydown', surEnfoncement);
      cible.removeEventListener('keyup', surRelachement);
      cible.removeEventListener('blur', toutRelacher);
      toutRelacher();
    },
  };
}
