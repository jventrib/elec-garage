# Tasks

Les deux questions ouvertes du design ne bloquent rien : l'affordance de bascule est une forme
d'interface, et les vitesses sont des données réglables à l'usage.

`npm test` DOIT être vert à la fin de chaque tâche.

## 1. Les réglages, d'abord

- [x] 1.1 Ajouter à `presentation.camera` dans `data/presentation.json` la **vitesse de déplacement** (m/s), la **vitesse de rotation** et les **bornes du vol** — un volume au-delà duquel la caméra ne s'éloigne plus. Vérifié par `validerCatalogues`, qui doit exiger ces clés comme il exige déjà `rayonMin` et `rayonMax`
- [x] 1.2 Étendre la liste des clés de présentation attendues dans `src/donnees/chargement.js`. Vérifié par un test qui rejette une présentation sans les nouveaux réglages
- [x] 1.3 Vérifier qu'**aucune vitesse ni borne ne vit dans le code**. Vérifié par le test existant `aucune dimension ni libellé de composant ne subsiste dans src/`, étendu aux réglages de caméra

## 2. Le second modèle de caméra

- [x] 2.1 Ajouter dans `src/scene/vue.js` un état de caméra **libre** — position, yaw, pitch — à côté de l'état `orbite`, **sans toucher à ce dernier**. *C'est lui qui va au chantier ; le généraliser pour servir un mode de préparation serait le mauvais rapport bénéfice/risque (D1).* Vérifié par un test qui contrôle que le comportement de l'orbite est inchangé
- [x] 2.2 Écrire l'application de la pose libre : position, direction dérivée de yaw/pitch, et `camera.up` tenu à (0,0,1) comme le fait déjà l'orbite. Vérifié par un test sur trois couples yaw/pitch connus
- [x] 2.3 **Borner le pitch** de part et d'autre de l'horizontale, comme `phi` l'est déjà entre 0,05 et π − 0,05. Vérifié par un test : à la borne, l'inclinaison s'arrête et la vue ne bascule pas
- [x] 2.4 Écrire la bascule entre les deux modes. **En passant à libre, la caméra conserve sa pose du moment ; en revenant à l'orbite, elle reprend l'orbite là où elle l'avait laissé** (D5). Vérifié par un test d'aller-retour
- [x] 2.5 Faire qu'une **vue prédéfinie ramène au mode orbite** (D6). Vérifié par un test : en mode libre, `allerAVue` repasse en orbite et applique la vue

## 3. Les commandes

- [x] 3.1 Écouter `keydown` et `keyup` sur **`event.code`** — `KeyW`, `KeyS`, `KeyA`, `KeyD`, `Space`, `ShiftLeft`. *Jamais `event.key` : sur un clavier français il rendrait `z`, `q`, et le mode serait injouable (D2).* Vérifié par un test qui simule un événement portant `code: 'KeyW'` et `key: 'z'`, et constate que la caméra avance
- [x] 3.2 Tenir un **état de touches enfoncées** et intégrer le déplacement dans la boucle de rendu, plutôt que de bouger à chaque frappe. *Sans cela le déplacement dépend de la cadence de répétition du clavier, qui varie d'un poste à l'autre.* Vérifié par un test qui avance de deux pas de temps et contrôle une distance proportionnelle
- [x] 3.3 Orienter le déplacement **sur le regard** : avancer suit le yaw, le pas latéral lui est perpendiculaire, monter et descendre suivent z quel que soit le pitch. Vérifié par un test à yaw connu
- [x] 3.4 Faire que le **glisser oriente le regard** en mode libre, au lieu d'orbiter, en réutilisant les mêmes écouteurs `pointermove`. Vérifié par un test
- [x] 3.5 ⚠️ Vérifier la **disjonction des deux jeux de touches** : aucune touche du déplacement ne doit figurer parmi celles de `src/ui/controles.js` — `←` `→` `PageUp` `PageDown` `Home` `End`. *Deux écouteurs globaux interprètent les frappes ; rien n'empêchera un ajout distrait, sinon un test.* Vérifié par un test qui lit les deux jeux et contrôle qu'ils ne se recoupent pas
- [x] 3.6 Ne pas capter les frappes venant d'un **champ de saisie**. *Le garde de `controles.js` teste `instanceof globalThis.HTMLInputElement`, qui LÈVE hors navigateur au lieu de rendre faux ; le nôtre teste `tagName` et fonctionne en test. Le motif fautif dort toujours dans `controles.js`, où rien ne l'exerce.* Vérifié par un test

## 4. L'interface

- [x] 4.1 Ajouter l'affordance de bascule dans `index.html` et la feuille de style. *La forme est libre (question ouverte 1) ; ce qui est exigé est de pouvoir basculer à tout moment*
- [x] 4.2 Rendre le **mode courant visible en permanence**. *Le glisser produit deux effets différents selon le mode : sans indication, l'utilisateur ne sait pas ce que son geste va faire.* Vérifié par un test sur le rendu de l'indicateur
- [x] 4.3 Afficher les touches du mode libre à l'utilisateur, **par leur étiquette de clavier français** si la disposition est détectable, sinon par leur position. Vérifié par relecture
- [x] 4.4 Vérifier que l'affordance ne casse pas la **cible de 64 px** exigée pour le chantier, ni la mise en page sur tablette

## 5. Ce que le mode ne doit pas emporter

- [x] 5.1 ⚠️ Vérifier que le **mode orbite reste intégralement utilisable sans clavier** — c'est la contrepartie de l'exception au contrat tactile, et l'exigence modifiée l'énonce. Vérifié par un test qui exerce orbite, zoom et sélection par les seuls événements de pointeur
- [x] 5.2 Vérifier que le mode libre **n'est pas le mode par défaut** : à l'ouverture, la maquette est en orbite. Vérifié par un test
- [x] 5.3 Vérifier qu'**aucune position de caméra n'est mémorisée** d'une session à l'autre. *Le lecteur mémorise un rang d'étape, pas un point de vue, et ce changement ne l'étend pas.* Vérifié par un test

## 6. Recette

- [x] 6.1 `npm run build` puis essai au navigateur : se placer dans l'angle nord-est et regarder l'angle sud-ouest — ce que le mode orbite ne permet pas —, sortir du local par une paroi, y revenir, puis repasser en orbite et constater qu'il est inchangé *Constaté au navigateur par le maître d'ouvrage le 2026-09-23 : conforme.*
- [x] 6.2 Essai sur **clavier français** : la touche marquée Z avance, la touche marquée Q fait un pas à gauche *Constaté au navigateur par le maître d'ouvrage le 2026-09-23 : conforme.*
- [ ] 6.3 Essai sur tablette **sans clavier** : le mode orbite et la navigation dans la séquence restent intégralement utilisables
- [x] 6.4 Incrémenter `src/version.js`
