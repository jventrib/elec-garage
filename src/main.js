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
import { construirePercages } from './scene/percages.js';
import { construireTrajets, assombrir } from './scene/trajets.js';
import { construireGraphe } from './geometrie/graphe.js';
import { trajetsDe, deriverConducteurs } from './geometrie/trajets.js';
import { noeudsDesEnveloppes } from './geometrie/connecteurs.js';
import { couleurDeCircuit } from './scene/composants.js';
import { creerPilotageLibre, ETIQUETTES } from './ui/pilotage-libre.js';
import { cadrageDe, distanceDeCadrage, anglesDepuisDirection } from './geometrie/cadrage.js';
import { construireCotes } from './scene/cotes.js';
import { construireRangements, descripteurDe } from './scene/rangement.js';
import { COUCHES, GROUPES } from './scene/couches.js';
import { creerPanneauEtape, resumeIncertitudes } from './ui/panneau-etape.js';
import { creerFiche, lignesTrajets } from './ui/fiche-composant.js';
import { creerControles } from './ui/controles.js';
import { occupationParCheminement } from './geometrie/conducteurs.js';
import { connecteursParEnveloppe } from './geometrie/connecteurs.js';

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
  const cotes = construireCotes(modele);
  // Les points de perçage de l'étape courante. Le modèle fusionné porte
  // `chantier.fixations` : il tient lieu de socle pour l'entraxe et la cheville.
  const percages = construirePercages(modele, modele);
  // Ce que chaque tube porte RÉELLEMENT, dérivé du pilotage déclaré. Calculé une
  // fois : la dérivation parcourt le graphe, et la fiche s'ouvre à chaque clic.
  const occupation = occupationParCheminement(modele);
  // Les connecteurs de chaque enveloppe de jonction : dérivés une fois, comme
  // l'occupation des conduits, et lus par la fiche.
  const connecteurs = connecteursParEnveloppe(modele);
  // Le trajet des conducteurs d'un objet désigné : le graphe, les conducteurs et les
  // enveloppes se dérivent une fois, et chaque clic ne fait que choisir.
  const graphe = construireGraphe(modele);
  const pourTrajets = { graphe, derives: deriverConducteurs(modele, graphe), enveloppes: noeudsDesEnveloppes(modele, graphe) };
  const trajets = construireTrajets(modele);
  const rangements = construireRangements(modele);
  vue.scene.add(groupeLocal, obstacles.groupe, composants.groupe, cheminements.groupe, cotes.groupe, percages.groupe, trajets.groupe, rangements.groupe);

  // Les bascules s'appuient sur la DÉCLARATION de `couches.js`, pas sur une liste
  // écrite ici. `main.js` ne décide donc pas à quelle couche appartient un groupe :
  // il ne fait que fournir le module correspondant à chaque nom déclaré. Un groupe
  // déclaré sans module se signale à l'exécution ; un module construit sans être
  // déclaré, c'est le test de `couches.js` qui le voit.
  const modules = { composants, cheminements, percages, trajets, cotes, rangements, obstacles, local: groupeLocal };
  for (const { nom } of GROUPES) {
    if (!modules[nom]) console.warn(`[garage] couche déclarée « ${nom} » sans module : la bascule ne peut pas la piloter`);
  }
  // La bascule d'une couche agit sur les groupes qui la portent — et sur les
  // `cotes` avec l'électricité, dont le calque d'annotation lui est subordonné.
  const basculer = (couche, visible) => {
    for (const g of GROUPES) {
      if (g.couches.includes(couche) || (g.nom === 'cotes' && couche === 'electricite')) {
        modules[g.nom]?.basculer?.(visible);
      }
    }
  };

  // Le pilotage au clavier du mode libre. Il ne s'active qu'en mode libre, et ses
  // touches sont disjointes de celles de la séquence — voir `pilotage-libre.js`.
  const pilotage = creerPilotageLibre(vue);
  vue.aChaqueImage = (secondes) => pilotage.avancer(secondes);

  // Le plafond s'escamote dès que la caméra passe au-dessus : sans cela, la vue
  // de dessus serait la zone aveugle que FR-004 interdit.
  vue.avantRendu = () => {
    plafond.visible = vue.camera.position.z < modele.local.hauteurSousPlafond;
  };

  const panneau = creerPanneauEtape(el('etape'), el('bandeau'), modele.chantier);
  // Refermer la fiche ramène l'orbite au centre : qui referme n'a plus d'objet en
  // tête, et le laisser tourner autour de celui qu'il vient de quitter le perdrait.
  const fiche = creerFiche(el('fiche'), {
    surFermeture: () => {
      if (!vue.estEnModeLibre()) vue.viser({ cible: vue.centre() });
    },
  });
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
    cotes.appliquerEtat(partition);
    percages.afficher(lecteur.etape());
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

  // La bascule de mode de caméra.
  //
  // Le mode courant DOIT rester visible : le glisser oriente le regard en mode
  // libre et orbite sinon, et sans indication l'utilisateur ne sait pas ce que son
  // geste va produire. Le libellé porte aussi les touches, étiquetées pour la
  // disposition détectée — une aide qui montrerait W sur un clavier français
  // mentirait.
  const azerty = (globalThis.navigator?.language ?? '').toLowerCase().startsWith('fr');
  const etiquettes = azerty ? ETIQUETTES.azerty : ETIQUETTES.qwerty;
  const aide = `${etiquettes.KeyW}${etiquettes.KeyA}${etiquettes.KeyS}${etiquettes.KeyD}`
    + ` · ${etiquettes.Space}/${etiquettes.ShiftLeft} monter et descendre`;
  const boutonMode = el('mode-camera');
  const majMode = () => {
    const libre = vue.estEnModeLibre();
    boutonMode.textContent = libre ? `Déplacement libre — ${aide}` : 'Caméra : orbite';
    boutonMode.setAttribute('aria-pressed', String(libre));
    boutonMode.title = libre
      ? 'Le glisser oriente le regard. Revenir à l’orbite pour tourner autour de la maquette.'
      : 'Le glisser tourne autour de la maquette. Passer en déplacement libre pour s’y déplacer.';
  };
  boutonMode.addEventListener('click', () => {
    vue.basculerMode();
    majMode();
  });
  // Une vue prédéfinie ramène à l'orbite : l'indicateur doit suivre.
  el('vues').addEventListener('click', majMode);
  majMode();

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

  // Les cotes de tracé. Elles ne montrent que celles des objets que l'étape
  // courante POSE — c'est ce qui les rend lisibles — et se coupent d'un geste.
  // À ne pas confondre avec le bouton « Cotes manquantes », qui est le bilan de
  // ce que le RELEVÉ ne dit pas : l'un aide à percer, l'autre dit ce qu'on ignore.
  let tracage = true;
  const boutonTracage = el('tracage');
  const majTracage = () => {
    boutonTracage.textContent = tracage ? 'Cotes de tracé : visibles' : 'Cotes de tracé : masquées';
    boutonTracage.setAttribute('aria-pressed', String(tracage));
    cotes.basculer(tracage);
  };
  boutonTracage.addEventListener('click', () => {
    tracage = !tracage;
    majTracage();
  });
  majTracage();

  // Les deux bascules de couche.
  //
  // Elles sont RÉALLEMENT indépendantes : chacune ne regarde que son état, et le
  // geste sur l'une n'écrit pas l'état de l'autre. Les faire s'exclure — un bouton
  // radio, deux états qui se nient — donnerait l'illusion d'un choix alors qu'il
  // reste des questions sans réponse par l'installation.
  //
  // Elles ne sont pas persistées : au rechargement tout revient visible. Une maquette
  // qui se souviendrait d'un cache incomplet afficherait un écran muet, sans que rien
  // n'explique pourquoi.
  const etatsCouches = new Map(COUCHES.map((c) => [c, true]));
  const boutonsCouches = new Map();
  const majCouche = (couche) => {
    const visible = etatsCouches.get(couche);
    const libelles = modele.presentation.libelles.boutonsCouches;
    const bouton = boutonsCouches.get(couche);
    bouton.textContent = libelles[visible ? `${couche}Masquer` : `${couche}Afficher`];
    bouton.setAttribute('aria-pressed', String(visible));
    basculer(couche, visible);
  };

  const conteneurCouches = el('couches');
  for (const couche of COUCHES) {
    const bouton = document.createElement('button');
    bouton.type = 'button';
    bouton.dataset.couche = couche;
    bouton.addEventListener('click', () => {
      etatsCouches.set(couche, !etatsCouches.get(couche));
      majCouche(couche);
    });
    boutonsCouches.set(couche, bouton);
    conteneurCouches.append(bouton);
  }
  for (const couche of COUCHES) majCouche(couche);

  // Bilan des cotes manquantes : un bouton discret dans l'en-tête, et le détail
  // dans la fiche. Il occupait auparavant un bandeau posé sur la maquette, ce qui
  // masquait en permanence ce qu'on venait regarder.
  const incertitudes = resumeIncertitudes({
    obstacles: obstacles.incertains,
    collisions: cheminements.collisions,
    rangements: modele.rangements ?? [],
    libelles: modele.presentation.libelles,
  });
  const boutonCotes = el('cotes');
  boutonCotes.hidden = incertitudes.rien;
  if (!incertitudes.rien) {
    boutonCotes.textContent = incertitudes.resume;
    boutonCotes.className = incertitudes.collisions > 0 ? 'alerte' : 'reserve';
    boutonCotes.addEventListener('click', () => fiche.afficherIncertitudes(incertitudes.detail));
  }

  /**
   * Ce que les contrôles de collision concluent au sujet d'UN obstacle. C'est la
   * question utile devant un volume dont la cote manque : non pas « combien de
   * contrôles en tout », mais « que sait-on de celui-ci ».
   */
  function bilanCollisions(idObstacle) {
    const tous = cheminements.collisions?.resultats ?? [];
    const siens = tous.filter((r) => r.obstacle === idObstacle);
    if (siens.length === 0) return null;
    const compte = (v) => siens.filter((r) => r.verdict === v).length;
    return {
      conforme: compte('conforme'),
      collision: compte('en-collision'),
      nonConcluant: compte('non-concluant'),
    };
  }

  // Désignation d'un objet. Les conducteurs qui y passent se suivent sur leur TRACÉ
  // RÉEL, d'une extrémité à l'autre, un circuit par couleur (FR-035) ; les conduits
  // qui les portent restent soulignés, et les appareils d'extrémité prennent la
  // couleur de leur circuit. Rend la ligne « Trajets » de la fiche.
  function montrerTrajets(cible) {
    const liste = trajetsDe(modele, cible, pourTrajets);
    const appareils = trajets.afficher(liste);
    cheminements.souligner(liste.filter((t) => !t.inconnu).map((t) => t.circuit));
    composants.teinterExtremites(appareils);
    const couleur = (id) => couleurDeCircuit(modele.circuits, id, modele.presentation);
    const foncee = (id) => assombrir(couleur(id), modele.presentation.trajets.assombrissementOrdre);
    return lignesTrajets(liste, modele.composants, couleur, foncee);
  }

  vue.renderer.domElement.addEventListener('pointerup', (e) => {
    // Un GLISSÉ n'a rien désigné : il a cadré. Sans cette garde, la rotation
    // d'orbite se terminait comme un clic dans le vide — fiche refermée, focus
    // perdu — et faire le tour d'un composant le faisait sortir du composant.
    //
    // Elle se pose AVANT `rafraichir()`, qui réapplique l'état de l'étape et
    // efface au passage la mise en évidence du circuit. Plus bas, on aurait gardé
    // la fiche mais éteint le circuit surligné à chaque geste : le défaut déplacé
    // plutôt que corrigé.
    if (!vue.estUnClic()) return;

    // Les obstacles sont désignables au même titre que le reste : c'est sur eux
    // que se lisent leurs propres réserves de cote.
    // Chaque module ne retourne que ses meshes VISIBLES : un objet d'une couche
    // masquée n'est pas dans cette liste, et le clic passe au travers. C'est le
    // contrat que `couches.js` documente, et il est ici appliqué par construction.
    const objet = vue.objetSous(e, [
      ...composants.meshes(),
      ...cheminements.meshes(),
      ...rangements.meshes(),
      ...obstacles.meshes(),
    ]);
    const composant = composants.composantDe(objet);
    const cheminement = cheminements.cheminementDe(objet);
    const traversee = cheminements.traverseeDe(objet);
    const rangement = rangements.rangementDe(objet);
    const obstacle = obstacles.obstacleDe(objet);

    rafraichir();
    trajets.effacer();

    /**
     * Recentre l'orbite sur l'objet désigné.
     *
     * En mode déplacement libre, on ne déplace RIEN : les deux modes sont
     * distincts, et téléporter quelqu'un pendant qu'il vole le désorienterait.
     *
     * Un objet sans étendue déclarée ne se cadre pas non plus — quatre des sept
     * obstacles sont dans ce cas, et leur inventer une étendue ferait passer une
     * absence de cote pour une cote.
     */
    const focaliser = (objet, nature) => {
      if (vue.estEnModeLibre()) return false;
      const c = cadrageDe(objet, nature, modele.types, modele.local);
      if (!c) return false;
      const rayon = distanceDeCadrage(c.etendue, modele.presentation.camera);
      const angles = anglesDepuisDirection(c.direction);
      vue.viser({ cible: c.cible, rayon, ...(angles ?? {}) });
      return true;
    };

    if (composant) {
      const lignes = montrerTrajets({ genre: 'composant', id: composant.id });
      fiche.afficher(composant, modele.circuits, modele.provenance, vocabulaire, connecteurs.get(composant.id) ?? null, lignes);
      focaliser(composant, 'composant');
    } else if (cheminement) {
      const lignes = montrerTrajets({ genre: 'cheminement', id: cheminement.id });
      fiche.afficherCheminement(cheminement, modele.circuits, modele.provenance, occupation, lignes);
      focaliser(cheminement, 'cheminement');
    } else if (traversee) {
      const lignes = montrerTrajets({ genre: 'traversee', id: traversee.id });
      fiche.afficherTraversee(traversee, modele.provenance, vocabulaire, lignes);
      focaliser(traversee, 'traversee');
    } else if (rangement) {
      fiche.afficherRangement(rangement, modele.presentation.libelles);
      // Le cadrage reçoit un descripteur, pas le rangement : la forme attendue est
      // celle d'un composant, et c'est `rangement.js` qui fait la conversion.
      focaliser(descripteurDe(rangement), 'rangement');
    } else if (obstacle) {
      fiche.afficherObstacle(
        obstacle,
        obstacles.incertitudeDe(obstacle.id),
        vocabulaire,
        bilanCollisions(obstacle.id),
      );
      focaliser(obstacle, 'obstacle');
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
