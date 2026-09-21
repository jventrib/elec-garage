# Tasks

Découpage repris de `design.md` — D6. L'ordre n'est pas négociable : les étapes 3 et 4 vont
ensemble, et l'étape 6 avant elles casserait la continuité du graphe.

`npm test` DOIT être vert à la fin de chaque tâche.

## 1. Typologie au catalogue

- [x] 1.1 Ajouter les types `organe-connexion` et `accessoire-conduit` à `data/types-composants.json`, chacun avec son `libelle` et son `gabarit` de repli. *La goulotte n'y figure pas : elle devient un cheminement, pas un composant.* Vérifié par `tests/catalogues.test.js`
- [x] 1.2 Déclarer le **rôle** de chaque type **dans `data/types-composants.json`** — `appareillage`, `jonction`, `accessoire` — et le faire lire par `src/donnees/validation.js` via `roleDeType()`. *Corrigé en cours de route : le projet interdit au code de porter une liste de types (`catalogues.test.js:90`), la sémantique doit donc vivre dans la donnée.* Vérifié par un test neuf qui rejette `dimensions`/`entrees` sur un `accessoire-conduit` et les admet sur un `organe-connexion`

## 2. La section remplace le diamètre

- [x] 2.1 Introduire `section` discriminée par `forme` dans le schéma de cheminement de `src/donnees/chargement.js` et `src/donnees/validation.js` : `{forme:"circulaire", diametre}` et `{forme:"rectangulaire", largeur, profondeur}`, chacune pouvant porter un `majorant` de même forme et exclusif de ses cotes (décision de séance). Vérifié par un test qui rejette une `section` sans `forme` et une `forme` inconnue
- [x] 2.2 Migrer les **vingt-six** cheminements vers `section` : onze dans `data/apports/000-demonstration.json`, sept dans `002-prises-de-courant.json`, cinq dans `003-eclairage.json`, trois dans `004-borne-recharge.json`. Vérifié : aucun cheminement ne porte plus `diametre` au premier niveau — la cote vit sous `section`
- [x] 2.3 Remplacer `presentation.diametreConduitConventionnel` par une section conventionnelle de repli par forme dans `data/presentation.json`, et aligner la liste des clés attendues dans `src/donnees/chargement.js:156`. Vérifié par `npm test`
- [x] 2.4 Retirer toute lecture de `ch.diametre` du code — `src/scene/cheminements.js:74` et `:100`, `src/geometrie/conducteurs.js`, `src/donnees/fournitures.js`. Vérifié par `grep -rn 'diametre' src/` qui ne doit plus rendre que des occurrences internes à `section.diametre`

## 3. GL-01 devient un cheminement, OC-01 apparaît

- [x] 3.1 Sortir GL-01 de `composants` et la déclarer dans `cheminements` de `data/apports/002-prises-de-courant.json`, section rectangulaire 0,120 × 0,060, du dessus du tableau (z 1,630) au plafond (z 2,750), en portant les deux circuits. Vérifié par `openspec`-indépendant : `tests/apport-002.test.js` doit la trouver parmi les cheminements
- [x] 3.2 Porter sur ce cheminement son **mode de pose** distinct du conduit, avec la lettre de sélection laissée à `null`. Vérifié par un test qui interdit qu'un cheminement en goulotte hérite de la catégorie B1 du conduit
- [x] 3.3 Déclarer `OC-01`, organe de connexion à enveloppe propre, en (5,60 ; 0,70 ; 2,60), avec son repère lisible sans déposer le capot. Vérifié par un test qui l'exige partout où deux circuits se séparent dans une goulotte
- [x] 3.4 Joindre explicitement `CH-02` et `CH-L1` à `OC-01` — `CH-L1` est dans `data/apports/003-eclairage.json` — et joindre l'extrémité basse de GL-01 à `TD-01`. Vérifié par `atteignablesDepuisTableau` qui ne doit rendre **aucun orphelin** sur les trois apports
- [x] 3.5 Retirer le champ `contigu` de GL-01 et le décompte `entrees` devenu sans objet. Vérifié par `tests/contiguite.test.js`, à réécrire sur la jonction déclarée

## 4. La jonction déclarée remplace la contenance

- [x] 4.1 Remplacer dans `src/geometrie/graphe.js:159` le rattachement par contenance (`noeuds.filter((x) => boiteDe(x.point) === boite)`) par la lecture des jonctions déclarées. Vérifié par un test où deux extrémités tombent dans un volume sans s'y déclarer jointes, et où la continuité **n'est pas** établie
- [x] 4.2 Mettre à jour les règles V17 et V22 dans `src/donnees/validation.js` : V17 cesse d'exiger une boîte sur un changement de direction traité par accessoire, V22 porte sur la jonction déclarée et non sur le chevauchement d'enveloppes. Vérifié par `npm test`
- [x] 4.3 Vérification d'intégration : `atteignablesDepuisTableau` sans orphelin sur `002`, `003`, `005` et le jeu de démonstration, **avant** toute modification du rendu. C'est l'assertion qui démontre que la jonction déclarée a repris le travail de la contenance

## 5. BD-03 devient un accessoire de conduit

- [x] 5.1 Passer BD-03 en `accessoire-conduit` dans `data/apports/002-prises-de-courant.json`, sans enveloppe connectable et sans repérage multi-circuits. Vérifié par un test qui interdit qu'un `accessoire-conduit` figure dans l'énumération des boîtes du dossier
- [x] 5.2 Retirer BD-03 des instructions de montage qui la citent comme boîte partagée — `data/apports/002-prises-de-courant.json` (pose des boîtes, levée de consignation) et `data/apports/003-eclairage.json` (serrage, levée de consignation). Vérifié par `grep -n 'BD-03' data/apports/*.json` relu à la main : aucune occurrence ne doit plus la présenter comme portant deux circuits
- [x] 5.3 Consigner dans les données que la nécessité du point de tirage de BD-03 reste **à établir** sur la longueur, les coudes et le nombre de conducteurs, et laisser la nature de l'accessoire — de tirage ou simple coude — inconnue. Vérifié par la fiche de BD-03, qui doit afficher la valeur comme inconnue et non comme arrêtée

## 6. Le rendu lit le volume déclaré

- [x] 6.1 Dans `src/scene/composants.js`, faire primer `composant.dimensions` sur le gabarit du type, celui-ci devenant le repli. Vérifié par un test neuf : BD-01, qui déclare 0,112 × 0,112 × 0,032, doit être dessinée à cette cote et non à 0,10 × 0,10 × 0,05
- [x] 6.2 Remplacer `tests/scene.test.js:148` « gabarit prend ses dimensions dans le catalogue » par un test au contrat inverse, en écrivant dans le test **pourquoi** le contrat s'inverse. Vérifié par `npm test`
- [x] 6.3 Faire dessiner à `src/scene/cheminements.js` une section rectangulaire à largeur et profondeur distinctes ; `boiteEnSaillie()` construit aujourd'hui un cube de côté `diametre`. Vérifié par un test qui exige 0,120 de largeur et 0,060 de profondeur sur GL-01, et non une section carrée
- [x] 6.4 **Verrouiller GL-01 à 1,12 m dans la vue** par un test dédié — c'est l'absence de ce test qui a laissé passer un facteur onze. Vérifié par le test lui-même, qui doit échouer si on rétablit le gabarit de type
- [x] 6.5 Vérifier qu'aucun intervalle ne subsiste entre une extrémité de cheminement et l'objet qu'elle rejoint. Vérifié par un test sur la jonction GL-01 / TD-01 au dessus du tableau

## 7. Fiche, fournitures et dossier

- [x] 7.1 Faire porter au rendu de fiche de `src/ui/fiche-composant.js` le **rôle** de l'enveloppe, et pour un `accessoire-conduit` la mention qu'aucune connexion ne s'y fait. Vérifié par `tests/fiche.test.js`
- [x] 7.2 Vérifier que la fiche et la vue portent la **même** cote pour GL-01. Vérifié par un test qui compare les deux et échoue sur tout écart
- [x] 7.3 Régénérer `specs/fournitures.md` par `npm run fournitures` et contrôler le relevé : une boîte de dérivation en moins, un accessoire de conduit et un organe de connexion en plus. Vérifié par lecture du diff, pas par la seule réussite de la commande
- [x] 7.4 Écrire l'énumération des emplacements de connexion sous capot exigée par la condition 3 de la constitution, dans les instructions de montage de `data/apports/002-prises-de-courant.json`. Vérifié par un test qui exige que tout `organe-connexion` soit énuméré

## 8. Recette

- [x] 8.1 `npm run build` puis contrôle visuel de `dist/garage.html` : la goulotte joint le dessus du tableau au plafond **sans intervalle**, se lit comme une goulotte et non comme une boîte démesurée, et BD-02 reste absente
- [x] 8.2 Suivre le circuit des prises du tableau jusqu'à PC-05 dans la vue et constater qu'il est **sans rupture** — c'est le scénario de `maquette/visualisation` que le défaut mettait en échec. *Constaté au navigateur par le maître d'ouvrage le 2026-09-22 : conforme.*
- [x] 8.3 Incrémenter `src/version.js` et aligner les compteurs de tests dans les quickstart de l'archive
