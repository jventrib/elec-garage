/**
 * Amorce : charge les données, monte la scène, branche le lecteur d'étapes.
 */

import { VERSION } from './version.js';
import { obtenirDonnees } from './donnees/chargement.js';
import { validerTout } from './donnees/validation.js';
import { composerSequence } from './sequence/ordonnancement.js';
import { creerLecteur } from './sequence/lecteur.js';
import { etatParGenre } from './sequence/etat.js';
import { creerVue } from './scene/vue.js';
import { construireLocal } from './scene/local.js';
import { construireObstacles } from './scene/obstacles.js';
import { construireComposants } from './scene/composants.js';
import { construireCheminements } from './scene/cheminements.js';
import { creerPanneauEtape } from './ui/panneau-etape.js';
import { creerFiche } from './ui/fiche-composant.js';
import { creerControles } from './ui/controles.js';

export async function demarrer() {
  const el = (id) => document.getElementById(id);
  console.log(`[garage] version du code : ${VERSION}`);
  const { modele, apports } = await obtenirDonnees();
  const sequence = composerSequence(modele);
  const defauts = validerTout(modele, sequence, apports);

  const vue = creerVue(el('scene'), modele.local, modele.presentation);
  const { groupe: groupeLocal, plafond } = construireLocal(modele.local, modele.presentation);
  const obstacles = construireObstacles(modele.local, modele.presentation);
  const composants = construireComposants(modele);
  const cheminements = construireCheminements(modele);
  vue.scene.add(groupeLocal, obstacles.groupe, composants.groupe, cheminements.groupe);

  // Le plafond s'escamote dès que la caméra passe au-dessus : sans cela, la vue
  // de dessus serait la zone aveugle que FR-004 interdit.
  vue.avantRendu = () => {
    plafond.visible = vue.camera.position.z < modele.local.hauteurSousPlafond;
  };

  const panneau = creerPanneauEtape(el('etape'), el('bandeau'), modele.chantier, el('incertains'));
  const fiche = creerFiche(el('fiche'));
  const lecteur = creerLecteur({ sequence });
  const composantsParId = new Map(modele.composants.map((c) => [c.id, c]));
  // Repères lisibles de tout objet posable, pour le panneau d'étape.
  const reperes = new Map([
    ...modele.composants.map((c) => [c.id, c.reference]),
    ...(modele.cheminements ?? []).map((c) => [c.id, c.reference]),
    ...(modele.traversees ?? []).map((t) => [t.id, t.reference]),
  ]);
  // Vocabulaire d'affichage, assemblé depuis les données du socle.
  const vocabulaire = {
    ...modele.presentation.libelles,
    types: modele.types.types,
  };

  function rafraichir() {
    const partition = etatParGenre(sequence, modele, lecteur.rang);
    composants.appliquerEtat(partition.composants);
    cheminements.appliquerEtat(partition);
    panneau.afficher(lecteur.etape(), lecteur.rang, lecteur.total, composantsParId, reperes);
  }

  creerControles(el('controles'), { lecteur, surChangement: rafraichir });

  if (defauts.length > 0) panneau.signalerDefauts(defauts);
  else if (lecteur.positionPerdue) panneau.signalerPositionPerdue();
  else el('bandeau').hidden = true;

  // Vues prédéfinies et bascule des ouvrants.
  el('vues').innerHTML = vue.vuesDisponibles
    .map((v) => `<button type="button" data-vue="${v.id}">${v.libelle}</button>`)
    .join('');
  el('vues').addEventListener('click', (e) => {
    const nom = e.target.getAttribute?.('data-vue');
    if (nom) vue.allerAVue(nom);
  });

  let ouvrants = 'ferme';
  const bouton = el('ouvrants');
  const majOuvrants = () => {
    bouton.textContent = ouvrants === 'ferme' ? 'Ouvrants : fermés' : 'Ouvrants : ouverts';
    obstacles.montrerEtat(ouvrants);
  };
  bouton.addEventListener('click', () => {
    ouvrants = ouvrants === 'ferme' ? 'ouvert' : 'ferme';
    majOuvrants();
  });
  majOuvrants();

  // Ce que le dossier n'a pas pu vérifier, dit comme tel.
  panneau.signalerIncertitudes({
    obstacles: obstacles.incertains,
    collisions: cheminements.collisions,
  });

  // Désignation d'un objet. Un circuit se suit ensuite sur son TRACÉ RÉEL, du
  // tableau jusqu'à son dernier point, en passant par chaque boîte (FR-035).
  function soulignerCircuit(idCircuit) {
    if (!idCircuit) return;
    composants.souligner(idCircuit);
    cheminements.souligner(idCircuit);
  }

  vue.renderer.domElement.addEventListener('pointerup', (e) => {
    const objet = vue.objetSous(e, [...composants.meshes(), ...cheminements.meshes()]);
    const composant = composants.composantDe(objet);
    const cheminement = cheminements.cheminementDe(objet);
    const traversee = cheminements.traverseeDe(objet);

    rafraichir();
    if (composant) {
      fiche.afficher(composant, modele.circuits, modele.provenance, vocabulaire);
      soulignerCircuit(composant.circuit);
    } else if (cheminement) {
      fiche.afficherCheminement(cheminement, modele.circuits, modele.provenance);
      soulignerCircuit((cheminement.circuits ?? [])[0]);
    } else if (traversee) {
      fiche.afficherTraversee(traversee, modele.provenance, vocabulaire);
    } else {
      fiche.vider();
    }
  });

  rafraichir();
  return { modele, sequence, lecteur, vue, defauts };
}

if (typeof document !== 'undefined') {
  demarrer().catch((e) => {
    const b = document.getElementById('bandeau');
    if (b) {
      b.hidden = false;
      b.className = 'bandeau bloquant';
      // Un symptôme ne suffit pas : on affiche de quoi trancher entre un vrai
      // défaut et un module périmé servi depuis le cache du navigateur.
      b.innerHTML =
        `<strong>Impossible de démarrer :</strong> ${e.message}` +
        `<ul>` +
        `<li>Version du code exécutée : <code>${VERSION}</code></li>` +
        `<li>Origine des données : <code>${globalThis.__DONNEES__ ? 'en ligne dans la page (livrable)' : 'chargées par le réseau (développement)'}</code></li>` +
        `<li>Page : <code>${globalThis.location?.href ?? 'inconnue'}</code></li>` +
        `</ul>` +
        `<p>Si la version affichée n'est pas celle attendue, le navigateur exécute ` +
        `un module en cache : servez sur un autre port, ce qui change d'origine et ` +
        `vide le cache de modules — <code>node build/serveur.mjs 8099</code>.</p>`;
    }
    console.error('[garage] version du code :', VERSION, '| échec au démarrage :', e);
    throw e;
  });
}
