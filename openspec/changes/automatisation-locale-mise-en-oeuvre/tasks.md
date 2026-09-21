# Tasks

## 0. Socle — la commande sur module (design D1, D2, D3)

- [x] 0.1 Accepter `entree-module` dans `src/donnees/validation.js`, avec le champ **`module`** obligatoire sur cette commutation, `pilote` facultatif, et deux commandes d'un même module autorisées sur les mêmes points. Contrôler `module` sur le modèle fusionné : il existe, c'est un `module-commande`, du même circuit. Reporter le champ au schéma d'apport
- [x] 0.2 Dériver dans `src/geometrie/conducteurs.js` **deux conducteurs d'ordre** du module à chaque commande sur module, une **sortie de module** vers les points qu'il commute, la phase au module et non plus à la commande, le PE à la commande et **pas le neutre**. Étendre `cheminDePhase` au point commuté par un module
- [x] 0.3 Tests de la dérivation sur module, et non-régression : sans commande sur module, décomptes et longueurs rigoureusement inchangés

## 1. Relevé du moteur — dépendance bloquante de US1

- [ ] 1.1 ⚠️ **Relever le moteur sur place** et consigner le constat. Trois constats restent, qu'aucune documentation ne remplace : le modèle et la génération exacts du moteur, la présence effective du connecteur de la platine, et le domaine de tension de l'entrée de commande (FR-022 de la capacité automatisation)
- [ ] 1.2 ⚠️ Commander la platine **UAP 1-HCP** une fois 1.1 constaté, et l'ajouter à la nomenclature de ce changement. *Le relais d'option HOR 1-HCP est écarté : il suit la lampe de motorisation, donc la temporisation propre du moteur, et superposerait deux temporisations sur le même point*

## 2. Éclairage piloté par module (US2)

- [x] 2.1 Faire passer **CM-01** en `commutation: "entree-module"` dans `data/apports/003-eclairage.json` : elle cesse de couper la phase pour adresser un ordre à MC-01. Son `pilote` reste EL-01a et EL-01b
- [x] 2.2 [P] Déclarer dans `data/apports/005-automatisation-locale.json` **BD-06** en (5,60 ; 0,30 ; 2,60) et la descente **CH-A1** de 1,50 m jusqu'à (5,60 ; 0,30 ; 1,10) — boîte **au droit** des appareils, descente droite, entrée par le haut, comme le corollaire de tracé l'exige
- [x] 2.3 Ajouter à **CH-L1** une rupture de segment à y = 0,30 dans `data/apports/003-eclairage.json`, pour que BD-06 soit un nœud du graphe. Même tracé, même longueur, un segment de plus : ce n'est pas une révision d'implantation
- [x] 2.3b Déplacer le boîtier double de CM-04 et CM-05 sur la **paroi sud**, face intérieure, en (5,40 ; 0 ; 1,10), à 0,20 m de la porte sectionnelle — décision du maître d'ouvrage du 2026-09-23. BD-06 suit en (5,40 ; 0 ; 2,22) sur le tronçon sud de CH-L1, la descente CH-A1 passe à **1,12 m**, et la rupture de CH-L1 à y = 0,30 disparaît au profit d'une rupture à x = 5,40. Décomptes inchangés ; vérifié par `npm test`
- [x] 2.4 Déclarer dans `data/apports/005-automatisation-locale.json` **CM-04**, bouton d'éclairage du boîtier double, en (5,60 ; 0,30 ; 1,10), circuit `c-eclairage`, `commutation: "entree-module"`
- [x] 2.5 Vérifier par la dérivation, dans `tests/apport-005.test.js`, que **CH-L1** porte **huit** conducteurs — sept au décompte manuel, plus le PE du bouton de porte (design D3). Elle reste en **IRL 20**, sous la condition d'achat de 14,69 mm, sa composition étant celle du tronc
- [x] 2.6 Écrire la **machine à états** dans `data/apports/005-automatisation-locale.json`, en prose d'instruction, avec la transition qui porte tout le sens : une ouverture de porte survenant sur un allumage manuel **n'arme aucun décompte**
- [ ] 2.7 ⚠️ **Arrêter la valeur du délai** d'extinction et la consigner dans la note de calcul de ce changement. *Un réglage non consigné est réputé non fait — c'est déjà l'exigence retenue pour la temporisation du détecteur de façade.* **Décision du maître d'ouvrage**

## 3. Commande murale de la porte (US3)

- [x] 3.1 Déclarer dans `data/apports/005-automatisation-locale.json` **CM-05**, bouton de porte du même boîtier double, en (5,60 ; 0,30 ; 1,10), circuit **`c-prises`**
- [x] 3.2 Repérer le **boîtier double comme portant deux circuits** dans `data/apports/005-automatisation-locale.json`, instructions de montage comprises. *C'est le premier boîtier d'appareillage du dossier dans ce cas : consigner l'éclairage n'y coupe pas l'autre bouton*
- [x] 3.3 Déclarer le raccordement de CM-05 à MC-02, **dont la sortie vers le moteur DOIT être un contact sec** refermant les bornes 21 / 20 en TBTS 24 V — le module ne peut pas commander le moteur par une sortie sous tension. Le raccordement emprunte **CH-A1, CH-L1 jusqu'à BD-06, la goulotte puis tout le tronc**, la route directe par le plafond étant fermée par le majorant du tablier ouvert
- [x] 3.4 Vérifier par la dérivation, dans `tests/apport-005.test.js`, que **CH-04 et CH-07 passent de six à huit** conducteurs, CH-08 de trois à cinq, **CH-02 de six à onze et CH-05 de huit à neuf** (design, *Context*) *Révisé le 2026-09-23 (design D6) : l'entrée de MC-02 commute la phase — CH-04 et CH-07 à **sept**, CH-08 à **quatre**, CH-02 à **dix***
- [x] 3.4b Passer **CH-02 et CH-05 en IRL 25** — décision du maître d'ouvrage du 2026-09-23 (design D4). La condition d'achat en IRL 20 porte dès lors sur **CH-04, CH-07 et CH-L1**, et le seuil de CH-04 / CH-07 est à recalculer, leur composition n'étant pas celle du tronc
- [x] 3.5 Reporter ce changement de portée dans la tâche d'achat du conduit du changement `reserves-maitre-ouvrage` : CH-05 en sort, CH-04, CH-07 et CH-L1 y entrent, et le seuil de CH-04 / CH-07 est à recalculer
- [x] 3.6 Écrire l'instruction d'appareillage du boîtier double, et la vérification que les **dispositifs de sécurité du moteur agissent à l'identique** avant et après
- [x] 3.6b Déclarer sur MC-02 `entree: "phase"` et apprendre au socle la commande sur une entrée qui commute la phase : la phase du circuit au bouton, **un** fil d'ordre au module (design D6). Vérifié par `tests/apport-005.test.js` et `tests/conducteurs-trajet.test.js`
- [x] 3.7 Déclarer l'essai sous tension : la porte ne bouge **à aucun moment** sans action délibérée, et **aucun moyen réseau** ne la commande. ***Révisé le 2026-09-23*** *par décision du maître d'ouvrage : la commande à distance par le cloud du fabricant est admise, et l'essai `au-essai-reseau` est inversé — voir le changement [`commande-porte-a-distance`](../archive/2026-09-23-commande-porte-a-distance/proposal.md)*

## 4. Nomenclature, note de calcul et dossier

- [x] 4.1 [P] Régénérer `dossier/fournitures.md` par `npm run fournitures` et vérifier que **CH-01 sort du relevé des conduits** et que la goulotte y entre comme article nouveau
- [x] 4.2 [P] Rédiger la **nomenclature** de ce changement : goulotte et capot, organes de connexion, deux modules, boîtier double, conduit de la descente
- [x] 4.3 [P] Rédiger la **note de calcul** de ce changement, avec les **deux valeurs normatives nouvelles** laissées vides et marquées « à confirmer »
- [x] 4.4 [P] Reporter ces deux valeurs dans la tâche des valeurs normatives du changement `reserves-maitre-ouvrage`, qui porte déjà la liste à confirmer
- [x] 4.5 Mettre à jour `dossier/003-eclairage/note-de-calcul.md` (dossier) : le décompte des conducteurs du tronc change, et le mode de pose du tronc aussi sur 1,10 m
- [x] 4.6 [P] Écrire, à l'étape de levée de consignation, la réserve d'exploitation : l'éclairage peut désormais s'allumer sans que personne n'ait rien touché, et l'absence de lumière ne vaut pas absence de tension
- [x] 4.7 [P] Écrire le **mode dégradé** et la façon de restituer les réglages après remplacement d'un module

## 5. Construction et recette

- [ ] 5.1 Construire `dist/garage.html` par `npm run build` et vérifier que **GL-01 se lit comme une goulotte** et non comme une boîte démesurée, et que BD-02 a disparu. *Construit le 2026-09-23 ; géométrie de GL-01 et disparition de BD-02 vérifiées par les tests, **reste le contrôle à l'œil dans un navigateur***
- [x] 5.2 Incrémenter `src/version.js` et aligner les compteurs de tests dans les quickstart de l'archive
- [ ] 5.3 ⚠️ Exécuter les **scénarios 1 à 5** de `dossier/005-automatisation-locale/quickstart.md` et consigner le résultat. *1 à 4 passés et consignés le 2026-09-23 ; **5 partiel** — contrôle visuel à faire, et la fiche d'un composant n'affiche pas le boîtier partagé*
- [ ] 5.4 ⚠️ Exécuter les **scénarios 6 à 10** au garage — dont le **scénario 10**, consignation, qui est le seul entièrement nouveau
