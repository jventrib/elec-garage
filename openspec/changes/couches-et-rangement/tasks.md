# Tasks

Chaque tâche porte sa vérification. L'ordre suit les dépendances : la donnée avant la
validation, la validation avant le rendu, le rendu avant l'interface.

## 1. Dossier du rangement

- [x] 1.1 Créer `dossier/006-rangement/research.md` : la fiche produit du rack (VEVOR `TC0513`,
      ASIN `B0DPM1TXK6`, 39,99 €, page Amazon.fr du 2026-09-27) et les **quatre contradictions
      relevées** — 144 cm contre 81,3–121,9 cm, hauteur non qualifiée, charge par tablette ou
      totale, nombre de niveaux contre 4 pneus — avec, pour chacune, les deux déclarations en
      conflit citées mot pour mot. Vérification : `rg` sur les quatre points trouve chacun les
      deux déclarations, et aucune n'y est arbitrée.
- [x] 1.2 Créer `dossier/006-rangement/data-model.md` : la forme d'un élément de rangement, la
      structure `{ valeur, origine, etat, reserves }` de chaque cote, les trois valeurs de
      `etat` et les trois valeurs de `origine`. Vérification : le document décrit une seule
      structure, cohérente avec `specs/maquette/rangement/spec.md`.
- [x] 1.3 Créer `dossier/006-rangement/implantation.md` : la paroi ouest, son caractère
      entièrement libre — vérifié par les décomptes de la tâche 2.1 —, et les quatre faces
      écartées avec leur motif. Y consigner que **la hauteur de montage est indéterminée**, et
      que cette indécision découle de la hauteur déployée non établie et non d'un oubli.
      Vérification : le document ne propose aucune hauteur chiffrée pour le rangement.
- [x] 1.4 Créer `dossier/006-rangement/restriction-usage.md` : la fixation du rack n'est pas
      résolue — aucune tige d'ancrage béton fournie, aucun mode de fixation documenté, aucune
      cote de perçage connue. Vérification : le document ne présente aucune fixation comme
      acquise, et ne donne aucun diamètre de tige.

## 2. Données

- [x] 2.1 Établir le décompte d'occupation des faces et le consigner dans
      `dossier/006-rangement/implantation.md`, à partir des apports indexés : composants par
      `paroi` (est 10, sud 5, nord 3, plafond 7, **ouest 0**) et faces utilisées par les segments de
      conduits (est, nord, plafond, sud — **ouest jamais utilisée**). Vérification : un script
      ad hoc reproduit ces chiffres depuis `data/apports/index.json`, et `dossier/006-rangement/implantation.md`
      les contient. *Cette tâche existe parce que la proposition s'appuie sur ce décompte :
      il doit être reproductible, pas affirmé.*
      *Un premier décompte, par glob sur `data/apports/*.json`, concluait à 19 composants à l'est et
      à un plafond vide : il comptait `000-demonstration.json`. Le gabarit du rangement a d'abord
      été écrit à 2,00 m de haut sur une base à 1,00 m, ce qui dépassait le plafond de 2,75 m.
      Les deux erreurs sont consignées dans `design.md`.*
- [x] 2.2 Écrire `data/apports/006-rangement.json` : les étagères en gabarit conventionnel
      (`origine: gabarit-catalogue`), et le rack avec son volume déclaré et ses quatre
      `reserves`. Chaque cote porte son `origine` et son `etat` ; le rack porte en outre
      `hauteurMontage` **inconnue**. Vérification : le fichier est valide JSON, et
      `data/apports/index.json` déclare `006-rangement`.
- [x] 2.3 Ajouter les libellés dans `data/presentation.json` — désignations, libellés de boutons,
      libellés d'état, libellés d'origine et d'état de cote. Aucun libellé dans le code.
      Vérification : `rg` sur `src/` ne trouve aucune chaîne de libellé d'interface en dur.
- [x] 2.4 Ajouter `RANGEMENT` à `tests/_aides.js`, sur le modèle de `AUTOMATISATION` (ligne 25),
      pour que l'apport soit lisible isolément dans les tests. Vérification :
      `RANGEMENT()` retourne l'objet parsé, avec ses `rangements`.

## 3. Socle et validation

- [x] 3.1 Ajouter `rangements` aux six genres fusionnés dans `src/donnees/chargement.js:153-157`,
      et le renvoyer dans le modèle. Vérification : `tests/apport-006.test.js` asserte que les
      éléments survivent à `fusionner()` — sans quoi l'apport serait chargé puis ignoré.
- [x] 3.2 Valider les `rangements` dans `src/donnees/validation.js` sur le modèle des
      composants : identifiant unique, **paroi déclarée**, `origine` et `etat` connus, `volume`
      porteur d'une origine. Vérification : un test rejects un rangement sans paroi, un
      rangement à `origine` inconnue et un `etat` hors des trois valeurs.
- [x] 3.3 Poser la règle qui empêche un rangement d'entrer dans les contrôles électriques : ne
      rien ajouter à `GENRES_POSABLES` (`src/sequence/etat.js:11`), et ne pas le faire entrer
      dans V11 ni V16, qui n'ont de sens que pour un circuit. Vérification : un test asserte que
      `V16` ne signale pas de composant non atteignable à cause des rangements, et que le
      nombre d'étapes est inchangé.
- [x] 3.4 Remplacer la liste en dur de `src/scene/cotes.js:126` par l'import de
      `GENRES_POSABLES`. C'est la seule duplication que le sujet rend naturel ; la laisser
      ferait diverger deux listes au prochain ajout. Vérification : `rg GENRES_POSABLES src/scene/cotes.js`
      trouve l'import, et la liste en dur a disparu.
- [x] 3.5 Vérifier que le bilan des collisions est **inchangé** par la présence du rangement, et
      l'asserter. C'est l'exigence la plus facile à casser par mégarde. Vérification :
      `tests/apport-006.test.js` compare les verdicts de collision avec et sans `rangements`.

## 4. Rendu du rangement

- [x] 4.1 Créer `src/scene/rangement.js`, exposant `{ groupe, basculer, meshes, rangementDe }`
      sur le modèle de `src/scene/cotes.js` et de `obstacleDe()` (`src/scene/obstacles.js:189`).
      Aucun `appliquerEtat` : le rangement n'est pas dans la séquence. Vérification : le module
      s'instancie et rend ses éléments au volume déclaré.
- [x] 4.2 Porter chaque mesh en `userData.rangement`, de sorte que `rangementDe(objet)` résolve
      comme `composantDe` et `obstacleDe`. Vérification : un test retourne l'élément pour un
      mesh, et `null` pour un objet d'un autre module.
- [x] 4.3 Faire le cadrage d'un rangement dans `src/geometrie/cadrage.js`, en lui passant un
      objet de la même forme qu'un composant — `id`, `paroi`, `volume`, `libelle` — pour éviter
      une deuxième forme à traiter. Vérification : `tests/cadrage.test.js` couvre un rangement et
      le cadre sur son volume.
- [x] 4.4 Étendre `src/ui/fiche-composant.js` : désignation, implantation, encombrement retenu,
      **origine de chaque cote**, état de chaque cote, contradictions, et le document dont les
      caractéristiques sont tirées — nommé et distinguable d'un relevé. Vérification : `tests/fiche.test.js`
      asserte que la fiche du rack contient les deux déclarations en conflit et ne le présente
      pas comme dont l'encombrement est établi.
- [x] 4.5 Faire porter au bilan des cotes l'état **contradictoire**, distinct de l'inconnu, comme
      une demande de précision au maître d'ouvrage et non comme une demande de relevé.
      Vérification : `tests/incertitudes.test.js` asserte qu'un élément contradictoire et un
      élément inconnu ne sont pas comptés ni présentés de la même façon.

## 5. Couches d'affichage

- [x] 5.1 Ajouter `basculer(visible)` aux modules de scène qui en sont dépourvus
      (`composants`, `cheminements`, `percages`, `trajets`), sur le modèle exact de
      `src/scene/cotes.js:135`. Vérification : `rg "function basculer" src/scene/` trouve une
      implémentation par module concerné.
- [x] 5.2 Déclarer en **un seul endroit** l'appartenance de chaque groupe à sa couche, à côté de
      l'ajout à plat de `src/main.js:58`. Y faire figurer les exclusions, qui sont le motif même
      de la déclaration : `obstacles` (représentation du local), `cotes` (calque d'annotation,
      subordonné à l'électricité), `plafond` (piloté par la caméra). Vérification :
      `tests/couches.test.js` asserte que **tout** groupe de la scène est déclaré dans une
      couche ou explicitement exclu — c'est le test qui prévient l'oubli du prochain module.
- [x] 5.3 Faire respecter le contrat « `meshes()` déjà filtré sur la visibilité » pour chaque module
      de couche, comme `src/scene/obstacles.js:184` le fait déjà. C'est le défaut que ce fichier
      documente : le rayon de three.js ne teste pas la visibilité. Vérification :
      `tests/couches.test.js` masque une couche et asserte qu'aucun de ses meshes n'est retourné
      par `meshes()`.
- [x] 5.4 Faire les deux bascules dans `src/main.js`, sur le modèle du bouton `tracage`
      (lignes 161-172) : libellé d'état, `aria-pressed`, **sans appel à `appliquerEtat`**, pour
      que masquer ne fige pas l'état et réafficher ne le recalcule pas. Vérification : un test
      asserte qu'après masquage puis réaffichage, l'état de pose est identique à celui d'avant.
- [x] 5.5 Suspendre la mise en évidence de l'objet de l'étape courante quand la couche
      électricité est masquée, **sans la perdre**, pour qu'elle se rétablisse au réaffichage.
      Vérification : `tests/couches.test.js` couvre masquage puis réaffichage en cours d'étape.
- [x] 5.6 Ajouter les deux boutons dans l'en-tête de `index.html` et les câbler. Vérification :
      `npm run build` réussit, et le bundle `dist/garage.html` contient les deux boutons.
- [x] 5.7 Vérifier que masquer la couche électricité laisse l'en-tête annoncer l'étape courante
      et la consigne écrite, qui portent l'instruction. Compromis assumé au `design.md`.
      Vérification : `tests/mise-en-page.test.js` ou `tests/instructions.test.js` couvre la
      lecture des consignes avec la couche masquée.

## 6. Vérification d'ensemble

- [x] 6.1 Exécuter `npm test` et confirmer que la suite passe, y compris les tests préexistants
      des 50 autres fichiers : le dossier électrique ne doit avoir bougé sur aucun point.
      Vérification : `npm test` ne signale aucun échec, et `git diff` sur `src/donnees/validation.js`
      ne montre aucun V1 à V23 modifié.
- [ ] 6.2 Contrôler la maquette à l'écran : les deux couches visibles au chargement, chaque
      bascule indépendante, la séquence intacte, et un objet d'une couche masquée
      effectivement **indésignable** au clic. Vérification : le geste décrit est fait à la main
      dans `npm run serve`, et consigné dans `dossier/006-rangement/`.
- [ ] 6.3 Contrôler que le rack se lit comme contesté : la mention de contradiction est visible
      dans la maquette, dans la fiche et au bilan, et **n'est pas escamotable**. Vérification :
      les trois emplacements sont constats à la main, et `tests/fiche.test.js` couvre la fiche.
