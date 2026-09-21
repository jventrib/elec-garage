/**
 * Composition de la séquence unique (FR-023 à FR-025).
 *
 * Tri topologique stable : parmi les étapes dont toutes les dépendances sont
 * satisfaites, on prend celle de plus petite phase, puis celle déclarée en
 * premier. L'ordre d'arrivée des apports n'intervient pas (FR-024).
 */

import { rangPhase } from './phases.js';

/** FNV-1a. Suffisant pour détecter qu'une séquence a changé, pas un usage de sécurité. */
export function empreinteDe(texte) {
  let h = 0x811c9dc5;
  for (let i = 0; i < texte.length; i++) {
    h ^= texte.charCodeAt(i);
    h = Math.imul(h, 0x01000193) >>> 0;
  }
  return h.toString(16).padStart(8, '0');
}

/**
 * Déduplique consignation et levée de consignation : une seule de chacune dans la
 * séquence, quel que soit le nombre de contributeurs (FR-025). Les dépendances qui
 * visaient une étape écartée sont redirigées vers celle retenue.
 */
export function dedupliquerEtapesCommunes(etapes) {
  const retenue = new Map();
  const redirection = new Map();
  const gardees = [];
  for (const e of etapes) {
    if (e.nature === 'consignation' || e.nature === 'levee-consignation') {
      const deja = retenue.get(e.nature);
      if (deja) {
        redirection.set(e.id, deja);
        continue;
      }
      retenue.set(e.nature, e.id);
    }
    gardees.push(e);
  }
  const resolues = gardees.map((e) => ({
    ...e,
    dependances: [...new Set((e.dependances ?? []).map((d) => redirection.get(d) ?? d))].filter(
      (d) => d !== e.id,
    ),
  }));
  return { etapes: resolues, redirection };
}

/**
 * Compose la séquence. Ne lève jamais : un cycle ou une dépendance pendante
 * ressort comme défaut, pas comme erreur silencieuse (FR-026).
 */
export function composerSequence(modele) {
  const defauts = [];
  const { etapes: brutes } = dedupliquerEtapesCommunes(modele.etapes ?? []);

  const parId = new Map();
  for (const e of brutes) parId.set(e.id, e);

  const declaration = new Map(brutes.map((e, i) => [e.id, i]));
  const restantes = new Map();
  for (const e of brutes) {
    const deps = (e.dependances ?? []).filter((d) => {
      if (!parId.has(d)) {
        defauts.push({
          regle: 'V4',
          cible: e.id,
          message: `L'étape « ${e.id} » dépend de « ${d} », qui n'existe pas.`,
        });
        return false;
      }
      return true;
    });
    restantes.set(e.id, new Set(deps));
  }

  const ordonnees = [];
  const faites = new Set();
  while (faites.size < brutes.length) {
    const dispo = brutes.filter(
      (e) => !faites.has(e.id) && [...restantes.get(e.id)].every((d) => faites.has(d)),
    );
    if (dispo.length === 0) {
      const bloquees = brutes.filter((e) => !faites.has(e.id)).map((e) => e.id);
      defauts.push({
        regle: 'V5',
        cible: bloquees.join(', '),
        message: `Boucle de dépendances : ${bloquees.join(', ')} ne peuvent pas être ordonnées.`,
      });
      break;
    }
    dispo.sort((a, b) => {
      const pa = rangPhase(modele.chantier, a.phase);
      const pb = rangPhase(modele.chantier, b.phase);
      if (pa !== pb) return pa - pb;
      return declaration.get(a.id) - declaration.get(b.id);
    });
    const choisie = dispo[0];
    faites.add(choisie.id);
    ordonnees.push({ ...choisie, rang: ordonnees.length + 1 });
  }

  const empreinte = empreinteDe(ordonnees.map((e) => `${e.id}|${e.instruction}`).join('\n'));
  return { etapes: ordonnees, total: ordonnees.length, empreinte, defauts };
}
