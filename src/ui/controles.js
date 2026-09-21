/**
 * Commandes de navigation (FR-015, FR-017, FR-019, FR-030).
 *
 * Les cibles font au moins 64 px de côté, au-delà des minima d'accessibilité
 * usuels : elles sont actionnées debout, sur un chantier, avec des gants. Le
 * clavier double le tactile pour l'usage sur poste fixe.
 */

export const TAILLE_CIBLE_MINIMALE = 64;

export function creerControles(element, { lecteur, surChangement }) {
  element.innerHTML =
    `<button type="button" class="nav" data-reculer aria-label="Étape précédente">◀ Précédente</button>` +
    `<label class="saut"><span>Aller à</span>` +
    `<input type="number" min="1" max="${lecteur.total}" value="${lecteur.rang}" data-saut inputmode="numeric"></label>` +
    `<button type="button" class="nav" data-avancer aria-label="Étape suivante">Suivante ▶</button>`;

  const reculer = element.querySelector('[data-reculer]');
  const avancer = element.querySelector('[data-avancer]');
  const saut = element.querySelector('[data-saut]');

  function rafraichir() {
    reculer.disabled = !lecteur.peutReculer();
    avancer.disabled = !lecteur.peutAvancer();
    saut.value = String(lecteur.rang);
    surChangement();
  }

  reculer.addEventListener('click', () => {
    lecteur.reculer();
    rafraichir();
  });
  avancer.addEventListener('click', () => {
    lecteur.avancer();
    rafraichir();
  });
  saut.addEventListener('change', () => {
    const cible = Number.parseInt(saut.value, 10);
    if (!lecteur.allerA(cible)) saut.value = String(lecteur.rang);
    rafraichir();
  });

  globalThis.addEventListener('keydown', (e) => {
    if (e.target instanceof globalThis.HTMLInputElement) return;
    if (e.key === 'ArrowRight' || e.key === 'PageDown') {
      lecteur.avancer();
      rafraichir();
    } else if (e.key === 'ArrowLeft' || e.key === 'PageUp') {
      lecteur.reculer();
      rafraichir();
    } else if (e.key === 'Home') {
      lecteur.allerA(1);
      rafraichir();
    } else if (e.key === 'End') {
      lecteur.allerA(lecteur.total);
      rafraichir();
    }
  });

  rafraichir();
  return { rafraichir };
}
