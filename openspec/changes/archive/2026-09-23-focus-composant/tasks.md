# Tasks

Les deux questions ouvertes du design — durée du lissage, marge de cadrage — se règlent à l'œil
et sont portées comme données dès la première tâche. Rien n'attend.

**Ce changement ne se livre pas avant l'archivage de `mode-fps`** : les deux touchent `vue.js` et
la même capacité, et celui-ci s'appuie sur `aChaqueImage`, que l'autre a introduit.

`npm test` DOIT être vert à la fin de chaque tâche.

## 1. Les réglages

- [x] 1.1 Ajouter à `presentation.camera` la **durée de transition**, la **forme du lissage** et la **marge de cadrage**. Vérifié par `validerCatalogues`, qui doit les exiger comme il exige déjà les réglages du vol
- [x] 1.2 Étendre les clés attendues dans `src/donnees/chargement.js` et vérifier qu'**aucune de ces valeurs ne vit dans le code**. Vérifié par le test existant sur les constantes de `src/`

## 2. La dérivation du cadrage

- [x] 2.1 Écrire, dans un module de géométrie, la **normale sortante** d'une paroi et le côté depuis lequel on regarde selon la face. Vérifié par un test sur les cinq parois et les deux faces : un objet de face extérieure sur la paroi est se regarde depuis l'est, un objet de plafond depuis le dessous
- [x] 2.2 Écrire l'**étendue** d'un objet selon sa nature — gabarit ou volume pour un composant, volume ou majorant pour un obstacle, épaisseur de paroi pour une traversée, boîte englobante du parcours pour un cheminement. Vérifié par un test sur les quatre natures
- [x] 2.3 Dériver la **distance** de cette étendue et de la marge, bornée par `rayonMin` et `rayonMax`. Vérifié par un test : un socle et le tableau divisionnaire donnent deux distances différentes, la seconde plus grande
- [x] 2.4 ⚠️ Rendre **aucun cadrage** pour un objet **sans étendue déclarée**. *Quatre obstacles sur sept sont dans ce cas. Leur inventer une étendue ferait passer une absence de cote pour une cote.* Vérifié par un test sur ces quatre obstacles nommément
- [x] 2.5 Admettre le **majorant** comme étendue de cadrage, en vérifiant que la fiche continue de le déclarer comme majorant. *Un majorant est une conséquence de cotes relevées, pas une invention ; mais le cadrer ne doit pas changer ce qu'on en dit.* Vérifié par un test sur le tablier remonté

## 3. La cible mobile et la transition

- [x] 3.1 Rendre `orbite.cible` **réaffectable** dans `src/scene/vue.js`, sans rien changer d'autre au modèle d'orbite. Vérifié par un test qui contrôle que le glisser, le pincement et le zoom continuent d'agir autour de la nouvelle cible
- [x] 3.2 Écrire l'**interpolation** de cible, angles et rayon **ensemble**, avec lissage aux extrémités, branchée sur `aChaqueImage`. Vérifié par un test qui avance la transition par pas de temps connus et contrôle la monotonie
- [x] 3.3 Rattraper le **lacet par le plus court chemin**. *Sans cela, passer de +170° à −170° fait un tour complet pour 20° d'écart.* Vérifié par un test sur ce cas précis
- [x] 3.4 Faire qu'une **nouvelle cible remplace la transition en cours**, depuis l'état atteint, sans l'achever. Vérifié par un test qui lance deux transitions et contrôle qu'il n'y a pas de file d'attente
- [x] 3.5 Faire qu'un **glisser interrompe** la transition et rende la main. *La main de l'utilisateur prime sur une animation.* Vérifié par un test
- [x] 3.6 Animer aussi les **vues prédéfinies**, qui s'appliquent aujourd'hui d'un coup et ramènent la cible au centre. Vérifié par un test

## 4. Le branchement

- [x] 4.1 Déclencher le focus depuis le gestionnaire de `pointerup` de `src/main.js`, pour les **quatre natures** sélectionnables. Vérifié par un test sur chacune
- [x] 4.2 Ajouter à `creerFiche` un **crochet de fermeture**, appelé par `vider()`. *C'est le seul endroit où « l'utilisateur a refermé » est connu ; le deviner en observant `hidden` marcherait et serait fragile.* Vérifié par un test
- [x] 4.3 Ramener l'orbite **au centre** à la fermeture de la fiche, de la même façon animée. Vérifié par un test
- [x] 4.4 ⚠️ Ne **rien déplacer en mode déplacement libre** : la fiche s'ouvre, la caméra reste. Vérifié par un test qui désigne un objet en mode libre et contrôle que la pose n'a pas bougé

## 5. Ce que le focus ne doit pas casser

- [x] 5.1 Vérifier que le **zoom manuel reste possible** pendant le focus. *Cadrer n'est pas enfermer.* Vérifié par un test
- [x] 5.2 ⚠️ Vérifier qu'**aucune interaction n'attend la fin d'une transition** — changement d'étape, rotation, nouvelle désignation, bascule de mode. *Le critère de fluidité exige qu'on tourne la vue et change d'étape sans attente perceptible.* Vérifié par un test sur les quatre
- [x] 5.3 Vérifier que la cible d'un focus est un objet **visible à l'étape courante**. *La sélection ne porte aujourd'hui que sur les meshes rendus, donc le cas ne se produit pas — mais rien ne l'empêchera si la sélection s'élargit, et la caméra irait regarder un objet absent.* Vérifié par un test
- [x] 5.4 Vérifier qu'**aucun objet focalisé n'est mémorisé** d'une session à l'autre

## 6. Recette

- [x] 6.1 `npm run build` puis essai au navigateur : désigner un socle extérieur et constater que la caméra passe **dehors** ; désigner PC-05 au plafond et constater qu'elle passe **dessous** ; refermer et revenir au centre *Constaté au navigateur par le maître d'ouvrage le 2026-09-23 : conforme.*
- [x] 6.2 Désigner deux objets coup sur coup et constater qu'il n'y a **ni attente ni file d'attente** *Constaté au navigateur par le maître d'ouvrage le 2026-09-23 : conforme.*
- [x] 6.3 Désigner l'un des quatre obstacles sans volume — débattement du vantail, tablier fermé, gabarit de manœuvre, débattement des portières — et constater que la **caméra ne bouge pas** *Constaté au navigateur par le maître d'ouvrage le 2026-09-23 : conforme.*
- [x] 6.4 Passer en mode déplacement libre, désigner un objet, constater que **rien ne bouge** *Constaté au navigateur par le maître d'ouvrage le 2026-09-23 : conforme.*
- [x] 6.5 Incrémenter `src/version.js`
