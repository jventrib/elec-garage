/**
 * Panneau de l'étape courante (FR-011, FR-018) et bandeau de cohérence (FR-027).
 */

import { libelleDe } from '../sequence/phases.js';

export function creerPanneauEtape(element, bandeau, chantier, zoneIncertitudes) {
  function liste(titre, items) {
    if (!items || items.length === 0) return '';
    return `<div class="bloc"><h3>${titre}</h3><ul>${items
      .map((i) => `<li>${i}</li>`)
      .join('')}</ul></div>`;
  }

  return {
    afficher(etape, rang, total, composantsParId, reperes = new Map()) {
      if (!etape) {
        element.innerHTML = '<p class="vide">Aucune étape à afficher.</p>';
        return;
      }
      const poses = (etape.composants ?? [])
        .map((id) => composantsParId.get(id))
        .filter(Boolean)
        .map((c) => `${c.reference}`);
      const conduits = (etape.cheminements ?? []).map((id) => reperes.get(id) ?? id);
      const percements = (etape.traversees ?? []).map((id) => reperes.get(id) ?? id);
      element.innerHTML =
        `<div class="entete">` +
        `<span class="rang">Étape ${rang} sur ${total}</span>` +
        `<span class="phase">${libelleDe(chantier.phases, etape.phase)}</span>` +
        `<span class="nature">${libelleDe(chantier.naturesEtape, etape.nature)}</span>` +
        (etape.sousTension ? `<span class="tension">SOUS TENSION</span>` : '') +
        `</div>` +
        `<p class="instruction">${etape.instruction}</p>` +
        liste('Composants posés', poses) +
        liste('Cheminements posés', conduits) +
        liste('Traversées réalisées', percements) +
        liste('Matériel', etape.materiel);
    },

    /** Tant qu'un défaut subsiste, la séquence n'est pas utilisable au chantier. */
    signalerDefauts(defauts) {
      if (!defauts || defauts.length === 0) {
        bandeau.hidden = true;
        bandeau.innerHTML = '';
        return;
      }
      bandeau.hidden = false;
      bandeau.className = 'bandeau bloquant';
      bandeau.innerHTML =
        `<strong>Séquence non utilisable au chantier — ${defauts.length} défaut(s) de cohérence.</strong>` +
        `<ul>${defauts
          .slice(0, 8)
          .map((d) => `<li><code>${d.regle}</code> ${d.message}</li>`)
          .join('')}</ul>` +
        (defauts.length > 8 ? `<p>… et ${defauts.length - 8} autre(s).</p>` : '');
    },

    /**
     * Ce que le dossier n'a PAS pu vérifier. Un contrôle non concluant n'est pas
     * un succès : il est présenté comme une question ouverte, avec la cote qui
     * manque pour y répondre.
     */
    signalerIncertitudes({ obstacles = [], collisions = null }) {
      if (!zoneIncertitudes) return;
      const blocs = [];
      if (obstacles.length > 0) {
        blocs.push(
          `<strong>Obstacles non relevés (${obstacles.length})</strong> — ` +
            obstacles.map((o) => `${o.id} : ${o.raison}`).join(' ; ') +
            `. Le contour montre la baie de rattachement, pas l'encombrement réel.`,
        );
      }
      if (collisions && collisions.nonConcluants > 0) {
        blocs.push(
          `<strong>Contrôles de collision non concluants : ${collisions.nonConcluants}</strong> ` +
            `sur ${collisions.resultats.length}. Aucune conclusion favorable n'est possible tant que ` +
            `ces cotes manquent — ` +
            collisions.obstaclesNonConcluants.map((o) => `${o.id} (${o.raison})`).join(' ; ') +
            `. Collisions établies : ${collisions.collisions}.`,
        );
      }
      if (blocs.length === 0) {
        zoneIncertitudes.hidden = true;
        zoneIncertitudes.innerHTML = '';
        return;
      }
      zoneIncertitudes.hidden = false;
      zoneIncertitudes.innerHTML = blocs.map((b) => `<p>${b}</p>`).join('');
    },

    signalerPositionPerdue() {
      bandeau.hidden = false;
      bandeau.className = 'bandeau avertissement';
      bandeau.innerHTML =
        `<strong>Position antérieure perdue.</strong> La séquence a changé depuis la dernière ` +
        `consultation : la lecture reprend à la première étape.`;
    },
  };
}
