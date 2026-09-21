/**
 * Fiche d'un composant (FR-006, FR-007) et provenance de la maquette (FR-009).
 *
 * `caracteristiques` est une fonction pure : c'est elle qui garantit qu'une valeur
 * absente ressort comme inconnue et jamais comblée. Elle est testée à part, sans
 * navigateur.
 */

import { longueurCheminement } from '../geometrie/cheminement.js';

export const INCONNU = 'inconnu';

const arrondi2 = (v) => Math.round(v * 100) / 100;

/** Rend une valeur, ou la déclare inconnue. Ne fabrique jamais de valeur de repli. */
function valeur(v, suffixe = '') {
  if (v === null || v === undefined || v === '') return { texte: INCONNU, inconnu: true };
  return { texte: `${v}${suffixe}`, inconnu: false };
}

/**
 * Libellés et types viennent des données (data/presentation.json et
 * data/types-composants.json) : aucun vocabulaire n'est figé dans le code.
 */
export function caracteristiques(composant, circuits = [], vocabulaire = {}) {
  const circuit = circuits.find((c) => c.id === composant.circuit);
  const libellesParois = vocabulaire.parois ?? {};
  const libellesFaces = vocabulaire.faces ?? {};
  const types = vocabulaire.types ?? [];
  const typeLisible = types.find((t) => t.id === composant.type)?.libelle ?? composant.type;
  return [
    { libelle: 'Référence', ...valeur(composant.reference) },
    { libelle: 'Type', ...valeur(typeLisible) },
    { libelle: 'Paroi', ...valeur(libellesParois[composant.paroi] ?? composant.paroi) },
    { libelle: 'Face', ...valeur(libellesFaces[composant.face] ?? composant.face) },
    { libelle: "Hauteur d'axe", ...valeur(composant.hauteurAxe, ' m') },
    { libelle: 'Indice de protection', ...valeur(composant.indiceProtection) },
    { libelle: 'Circuit', ...valeur(circuit ? circuit.libelle : composant.circuit) },
    { libelle: 'Apporté par', ...valeur(composant.apport) },
  ];
}

/**
 * Caractéristiques d'un cheminement. Le diamètre vaut « inconnu » tant que la note
 * de calcul ne l'a pas arrêté — et jamais le diamètre conventionnel employé pour
 * le dessiner. Le dessin est une convention, la donnée reste déclarée absente.
 */
export function caracteristiquesCheminement(cheminement, circuits = []) {
  const portes = (cheminement.circuits ?? [])
    .map((id) => circuits.find((c) => c.id === id)?.libelle ?? id)
    .join(', ');
  const groupement = (cheminement.circuits ?? []).length > 1;
  return [
    { libelle: 'Référence', ...valeur(cheminement.reference) },
    { libelle: 'Circuits portés', ...valeur(portes) },
    { libelle: 'Groupement', ...valeur(groupement ? 'oui — facteur de correction à appliquer' : 'non') },
    { libelle: 'Diamètre', ...valeur(cheminement.diametre, ' m') },
    { libelle: 'Longueur', ...valeur(arrondi2(longueurCheminement(cheminement)), ' m') },
    { libelle: 'Segments', ...valeur((cheminement.segments ?? []).length) },
    { libelle: 'Apporté par', ...valeur(cheminement.apport) },
  ];
}

export function caracteristiquesTraversee(traversee, vocabulaire = {}) {
  const parois = vocabulaire.parois ?? {};
  return [
    { libelle: 'Référence', ...valeur(traversee.reference) },
    { libelle: 'Paroi traversée', ...valeur(parois[traversee.paroi] ?? traversee.paroi) },
    { libelle: 'Sens', ...valeur(traversee.sens === 'interieur-vers-exterieur' ? "de l'intérieur vers l'extérieur" : "de l'extérieur vers l'intérieur") },
    { libelle: 'Pente vers l’extérieur', ...valeur(traversee.penteVersExterieur ? 'oui' : 'non') },
    { libelle: 'Apporté par', ...valeur(traversee.apport) },
  ];
}

export function provenanceLisible(provenance = {}) {
  return [
    { libelle: 'Schéma unifilaire', ...valeur(provenance.schemaUnifilaire) },
    { libelle: 'Note de calcul', ...valeur(provenance.noteDeCalcul) },
    { libelle: 'Relevé géométrique', ...valeur(provenance.releve) },
  ];
}

export function creerFiche(element) {
  function lignes(liste) {
    return liste
      .map(
        (l) =>
          `<div class="ligne"><span class="libelle">${l.libelle}</span>` +
          `<span class="valeur${l.inconnu ? ' inconnu' : ''}">${l.texte}</span></div>`,
      )
      .join('');
  }

  return {
    afficher(composant, circuits, provenance, vocabulaire) {
      element.hidden = false;
      element.innerHTML =
        `<h2>${composant.reference}</h2>${lignes(caracteristiques(composant, circuits, vocabulaire))}` +
        `<h3>Provenance</h3>${lignes(provenanceLisible(provenance))}` +
        `<p class="avertissement">La maquette n'est pas la source normative. En cas de divergence, ` +
        `le schéma unifilaire et la note de calcul l'emportent.</p>` +
        `<button type="button" class="fermer" data-fermer>Fermer</button>`;
      element.querySelector('[data-fermer]').addEventListener('click', () => this.vider());
    },
    /** Un cheminement se consulte comme un composant. */
    afficherCheminement(cheminement, circuits, provenance) {
      element.hidden = false;
      element.innerHTML =
        `<h2>${cheminement.reference}</h2>` +
        `<p class="avertissement">Conduit posé en apparent.</p>` +
        lignes(caracteristiquesCheminement(cheminement, circuits)) +
        `<h3>Provenance</h3>${lignes(provenanceLisible(provenance))}` +
        `<button type="button" class="fermer" data-fermer>Fermer</button>`;
      element.querySelector('[data-fermer]').addEventListener('click', () => this.vider());
    },

    afficherTraversee(traversee, provenance, vocabulaire) {
      element.hidden = false;
      element.innerHTML =
        `<h2>${traversee.reference}</h2>` +
        `<p class="avertissement">Traversée de paroi, 0,20 m de béton.</p>` +
        lignes(caracteristiquesTraversee(traversee, vocabulaire)) +
        `<h3>Provenance</h3>${lignes(provenanceLisible(provenance))}` +
        `<button type="button" class="fermer" data-fermer>Fermer</button>`;
      element.querySelector('[data-fermer]').addEventListener('click', () => this.vider());
    },

    vider() {
      element.hidden = true;
      element.innerHTML = '';
    },
  };
}
