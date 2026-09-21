/**
 * Panneau de l'étape courante (FR-011, FR-018) et bandeau de cohérence (FR-027).
 */

import { libelleDe } from '../sequence/phases.js';
import { stockageLocal } from '../sequence/lecteur.js';

export const CLE_REPLIE = 'elec-garage.etape.repliee';
export const CLASSE_REPLIE = 'etape-repliee';

/**
 * Bilan des cotes manquantes : une ligne de résumé, et le détail à la demande.
 *
 * Fonction **pure**, hors de `creerPanneauEtape` et sans DOM. Elle a longtemps
 * écrit directement dans un bandeau posé au-dessus de la maquette, qui masquait
 * ce qu'on venait regarder. Le bandeau a disparu : le résumé va dans l'en-tête, et
 * le détail s'ouvre dans la fiche latérale, comme tout le reste.
 *
 * Deux groupes, parce qu'ils ne se valent pas. Un encombrement **non relevé**
 * interdit toute conclusion. Un encombrement **borné** — encadré par des cotes
 * relevées sans être mesuré — autorise le seul verdict favorable. Les confondre
 * ferait passer pour indécidable un dégagement démontré.
 */
export function resumeIncertitudes({ obstacles = [], collisions = null, libelles = {} } = {}) {
  const bornes = obstacles.filter((o) => o.borne);
  const inconnus = obstacles.filter((o) => !o.borne);
  const sansConclusion = collisions ? collisions.nonConcluants : 0;
  const etablies = collisions ? collisions.collisions : 0;

  // Une collision établie compte, même sans aucune incertitude par ailleurs :
  // c'est le constat le plus grave que ce contrôle sait produire.
  if (obstacles.length === 0 && sansConclusion === 0 && etablies === 0) {
    return { rien: true, resume: '', detail: '', collisions: 0 };
  }

  // Accord au pluriel plutôt que « (s) » : un avertissement qu'on lit avec des
  // gants sur un chantier n'a pas à être déchiffré.
  const pl = (n, mot) => (n > 1 ? `${mot}s` : mot);
  const parties = [];
  // Le mot est mis en capitales APRÈS accord : « COLLISIONs » n'est pas un mot.
  if (etablies > 0) {
    parties.push(`${etablies} ${pl(etablies, 'collision')} ${pl(etablies, 'établie')}`.toUpperCase());
  }
  if (inconnus.length > 0) {
    parties.push(`${inconnus.length} ${pl(inconnus.length, 'cote')} ${pl(inconnus.length, 'manquante')}`);
  }
  if (bornes.length > 0) parties.push(`${bornes.length} ${pl(bornes.length, 'borné')}`);

  const rendus = libelles.rendus ?? {};
  const ligne = (o) =>
    `<tr><td>${o.libelle ?? o.id}</td><td>${o.raison}</td><td>${rendus[o.rendu] ?? o.rendu ?? ''}</td></tr>`;

  const corps = [];
  if (etablies > 0) {
    corps.push(
      `<p><strong>${etablies} ${pl(etablies, 'collision')} ${pl(etablies, 'établie')}</strong> ` +
        `contre un obstacle dont le volume est relevé. À corriger avant toute pose.</p>`,
    );
  }
  if (collisions && collisions.resultats.length > 0) {
    corps.push(
      `<p>${sansConclusion} ${pl(sansConclusion, 'contrôle')} sur ${collisions.resultats.length} ` +
        `sans conclusion, ${collisions.conformes} ${pl(collisions.conformes, 'conforme')}. ` +
        `Chaque conduit est contrôlé contre chaque obstacle, d'où le nombre.</p>`,
    );
  }

  const detail =
    `<table><thead><tr><th>Obstacle</th><th>Ce qui manque</th><th>Dessiné</th></tr></thead>` +
    `<tbody>${[...inconnus, ...bornes].map(ligne).join('')}</tbody></table>` +
    corps.join('');

  return { rien: false, resume: parties.join(', '), detail, collisions: etablies };
}

/**
 * Le panneau se replie pour rendre la hauteur à la maquette.
 *
 * Replié, il garde l'en-tête de l'étape — son rang, sa phase et le badge SOUS
 * TENSION — et les commandes de navigation : on sait toujours où l'on est dans la
 * séquence (FR-018), et une étape sous tension ne passe pas inaperçue. Seuls
 * l'instruction et les listes disparaissent. L'état survit au changement d'étape
 * et à la réouverture : qui a replié pour regarder la maquette veut continuer.
 *
 * La classe se pose sur `racine` — le `body` — parce que c'est la grille de la
 * page qui porte la hauteur du pied, et non le panneau.
 */
export function creerPanneauEtape(element, bandeau, chantier, {
  stockage = stockageLocal(),
  racine = globalThis.document?.body,
} = {}) {
  let replie = stockage.lire(CLE_REPLIE) === '1';

  function appliquerRepli() {
    racine?.classList.toggle(CLASSE_REPLIE, replie);
    const bouton = element.querySelector?.('[data-replier]');
    if (bouton) {
      const libelle = replie ? 'Déplier l’instruction' : 'Replier l’instruction';
      bouton.setAttribute('aria-label', libelle);
      bouton.setAttribute('title', libelle);
      bouton.setAttribute('aria-expanded', String(!replie));
    }
  }

  function basculerRepli(v = !replie) {
    replie = v;
    stockage.ecrire(CLE_REPLIE, replie ? '1' : '0');
    appliquerRepli();
    return replie;
  }

  // Délégation : le bouton est réécrit à chaque étape, l'écouteur ne l'est pas.
  element.addEventListener?.('click', (e) => {
    if (e.target?.closest?.('[data-replier]')) basculerRepli();
  });

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
      // Premier enfant, flottant et collant : il tient le coin haut droit du panneau
      // même quand l'instruction défile. L'icône pivote avec l'état, par la feuille
      // de style — le libellé, lui, est porté par aria-label et title.
      element.innerHTML =
        `<button type="button" class="replier" data-replier aria-controls="etape">` +
        `<svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" focusable="false">` +
        `<path d="M6 9l6 6 6-6" fill="none" stroke="currentColor" stroke-width="2.5" ` +
        `stroke-linecap="round" stroke-linejoin="round"/></svg></button>` +
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
      appliquerRepli();
    },

    basculerRepli,
    estReplie: () => replie,

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
    signalerPositionPerdue() {
      bandeau.hidden = false;
      bandeau.className = 'bandeau avertissement';
      bandeau.innerHTML =
        `<strong>Position antérieure perdue.</strong> La séquence a changé depuis la dernière ` +
        `consultation : la lecture reprend à la première étape.`;
    },
  };
}
