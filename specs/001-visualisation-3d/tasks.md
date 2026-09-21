# Tasks: Visualisation 3D du Garage et Guide de Montage

**Input**: Design documents from `/specs/001-visualisation-3d/`

**Prerequisites**: [plan.md](./plan.md), [spec.md](./spec.md), [research.md](./research.md), [data-model.md](./data-model.md), [contracts/](./contracts/)

> **Révision du 2026-09-21.** Les phases 1 à 6 portent le socle, construit contre la
> spécification FR-001 à FR-031 ; leur état d'avancement est conservé tel quel. Les phases 7
> à 11 portent l'extension « pose en apparent » de la constitution v1.3.0 et de la
> spécification FR-032 à FR-043. **Aucune tâche antérieure n'est invalidée** — plusieurs sont
> étendues, ce qui est signalé au fil du texte.

**Tests**: incluses. Le plan retient `node:test` sur la logique pure (R8), et
[quickstart.md](./quickstart.md) définit quatre scénarios automatisés. Le partage est
délibéré : ce qui peut être faux sans se voir à l'écran est testé, le rendu est validé à l'œil.

**Organization**: tâches groupées par histoire utilisateur, chacune livrable et vérifiable
seule.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: parallélisable — fichier distinct, aucune dépendance sur une tâche inachevée
- **[Story]**: US1, US2, US3
- Chemins de fichiers explicites, relatifs à la racine du dépôt

## Path Conventions

Projet unique, application web statique : `src/`, `data/`, `tests/`, `vendor/`, `build/` et
`dist/` à la racine, conformément à la Structure Decision du [plan](./plan.md).

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: squelette du projet et outillage, sans aucune dépendance d'exécution

- [X] T001 Créer l'arborescence du plan à la racine : `index.html`, `src/donnees/`, `src/sequence/`, `src/scene/`, `src/ui/`, `data/apports/`, `vendor/`, `build/`, `tests/`, `dist/`
- [X] T002 Vendorer three.js dans `vendor/three/` et le versionner, sans CDN ni installation réseau (R1)
- [X] T003 [P] Créer `package.json` : `"type": "module"`, script `test` valant `node --test tests/`, aucune dépendance d'exécution ni de test (R8)
- [X] T004 [P] Créer `.editorconfig` et `.gitignore`, ce dernier excluant `dist/`
- [X] T005 [P] Créer `README.md` à la racine avec les trois commandes de [quickstart.md](./quickstart.md) : servir en développement, construire le livrable, lancer les tests

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: données, chargement et chemin de livraison, sans quoi aucune histoire n'est démontrable

**⚠️ CRITICAL**: aucune histoire utilisateur ne peut commencer avant la fin de cette phase

> **T012 et T013 sont placées ici délibérément.** L'impossibilité de charger des modules ES et
> de lire des fichiers depuis `file://` est la contrainte la plus structurante du projet et la
> plus facile à découvrir trop tard (R2). Le chemin de livraison se prouve sur une scène
> minimale, avant que quoi que ce soit ne repose dessus.

- [X] T006 Créer `data/local.json` à partir du seul relevé de la constitution : œuvre 5,60 × 5,60, hauteur 2,75, parois 0,20, repère à l'angle sud-ouest intérieur ; porte sectionnelle paroi sud `debut` 0,20 `largeur` 5,00 `hauteur` null ; porte de service paroi est `debut` 1,30 `largeur` 1,10 `hauteur` 2,50 ; deux obstacles avec `volume: null` et `incertain: true` ; bloc `provenance` à null
- [X] T007 [P] Implémenter la lecture et la fusion des apports dans `src/donnees/chargement.js` : `data/local.json` puis chaque `data/apports/*.json`, en renseignant le champ `apport` de chaque composant et de chaque étape
- [X] T008 [P] Implémenter les contrôles structurels miroir des schémas dans `src/donnees/validation.js`, champ par champ selon `specs/001-visualisation-3d/contracts/` — écrits à la main pour ne pas introduire de dépendance
- [X] T009 Calculer l'emprise extérieure comme valeur dérivée (`oeuvre + 2 × epaisseurParois`) dans `src/donnees/chargement.js`, sans jamais la lire d'un champ saisi (FR-021)
- [X] T010 [P] Créer `data/apports/demo.json` conforme à `contracts/apport.schema.json`, identifié comme jeu de démonstration, pour faire vivre les histoires avant l'arrivée de `002-prises-de-courant`
- [X] T011 Amorcer le rendu dans `src/scene/vue.js` : renderer WebGL, scène, caméra, éclairage, boucle d'affichage et redimensionnement
- [X] T012 Écrire `build/bundle.mjs` produisant `dist/garage.html` en fichier unique : script, styles et données en ligne, sans import ni lecture de fichier à l'exécution (R2)
- [X] T013 Vérifier le chemin `file://` en ouvrant `dist/garage.html` par double-clic avec une scène minimale, sans serveur et réseau coupé
- [X] T014 [P] Écrire `tests/validation.test.js` : cas positifs sur `data/local.json`, et un cas négatif par champ obligatoire manquant ou mal typé

**Checkpoint**: données chargeables, scène affichable, livrable autonome prouvé — les histoires peuvent démarrer

---

## Phase 3: User Story 1 - Vérifier l'implantation en volume avant les travaux (Priority: P1) 🎯 MVP

**Goal**: représenter le garage à l'échelle du relevé avec ses baies, ses obstacles et les composants implantés, observable sous tous les angles, de sorte qu'une collision se constate à l'œil.

**Independent Test**: charger la géométrie et un jeu de composants, sans aucun lecteur d'étapes ni instruction rédigée, puis chercher les collisions connues portes ouvertes.

### Tests for User Story 1

- [X] T015 [P] [US1] Écrire `tests/geometrie.test.js` : emprise extérieure dérivée valant 6,00 × 6,00, positions des deux baies, et rejet d'une baie dont `debut + largeur` dépasse la paroi

### Implementation for User Story 1

- [X] T016 [P] [US1] Construire sol, plafond et quatre parois à l'épaisseur relevée dans `src/scene/local.js`
- [X] T017 [US1] Percer les deux baies aux cotes de `data/local.json` dans `src/scene/local.js` (FR-002)
- [X] T018 [US1] Distinguer visuellement face intérieure et face extérieure des parois dans `src/scene/local.js` (FR-005)
- [X] T019 [P] [US1] Rendre les obstacles dans `src/scene/obstacles.js`, avec un rendu explicitement distinct et une mention lorsque `incertain` vaut `true` (FR-003)
- [X] T020 [P] [US1] Placer les marqueurs de composants dans `src/scene/composants.js`, orientés selon `paroi` et `face`, à la position déclarée
- [X] T021 [US1] Implémenter la caméra orbitale dans `src/scene/vue.js` : plafond, sol et quatre angles atteignables, y compris depuis l'intérieur, sans zone aveugle (FR-004)
- [X] T022 [US1] Ajouter dans `src/scene/vue.js` la bascule des ouvrants entre position ouverte et fermée, pour rendre les collisions observables
- [X] T023 [US1] Assembler l'amorce dans `src/main.js` : charger les données, monter la scène, afficher, et exposer la `provenance` du relevé (FR-009)

**Checkpoint**: la maquette est utilisable seule et démontre déjà sa valeur — c'est le MVP

---

## Phase 4: User Story 2 - Suivre le montage étape par étape (Priority: P2)

**Goal**: composer une séquence unique ordonnée par la chronologie du chantier, et la parcourir en avant comme en arrière, chaque étape portant son instruction et son illustration.

**Independent Test**: parcourir en avant puis en arrière une séquence réduite d'étapes cohérentes, sans jamais consulter d'autre document.

### Tests for User Story 2

- [X] T024 [P] [US2] Écrire `tests/ordonnancement.test.js` : ordre stable d'une exécution à l'autre, séquence identique quand les apports sont présentés dans l'ordre inverse, consignation et levée présentes une seule fois malgré deux contributeurs
- [X] T025 [P] [US2] Écrire `tests/etat.test.js` : pour **tous** les rangs de la séquence et non un échantillon, l'état après un aller-retour de profondeur quelconque est identique à l'état initial
- [X] T026 [P] [US2] Écrire `tests/lecteur.test.js` : refus sans erreur aux deux bornes, accès direct à un rang, restitution du curseur, retour au rang 1 sur empreinte périmée ou rang hors limites, et dégradation en mémoire volatile quand le stockage lève une exception

### Implementation for User Story 2

- [X] T027 [P] [US2] Déclarer la liste ordonnée et fermée des neuf phases de chantier dans `src/sequence/phases.js`, de `consignation` à `essais-sous-tension`
- [X] T028 [US2] Implémenter le tri topologique stable sur phase puis dépendances dans `src/sequence/ordonnancement.js`, l'ordre de déclaration départageant les ex æquo (R6, FR-024)
- [X] T029 [US2] Détecter cycles et dépendances pendantes dans `src/sequence/ordonnancement.js`, en les remontant comme défauts et non comme erreurs silencieuses
- [X] T030 [US2] Dédupliquer les étapes de nature `consignation` et `levee-consignation` dans `src/sequence/ordonnancement.js`, quel que soit le nombre de contributeurs (FR-025)
- [X] T031 [US2] Calculer l'empreinte de séquence dans `src/sequence/ordonnancement.js`, destinée à invalider un curseur périmé
- [X] T032 [P] [US2] Implémenter la partition `enPlace` / `ajoutes` / `absents` au rang N comme fonction pure sans mémoire dans `src/sequence/etat.js` (R5, FR-016)
- [X] T033 [US2] Déduire le rang d'apparition d'un composant de la première étape de nature `pose` qui le référence, dans `src/sequence/etat.js`, sans jamais le déclarer
- [X] T034 [US2] Implémenter les règles V1 à V7 et V9 à V12 de [data-model.md](./data-model.md) dans `src/donnees/validation.js`
- [X] T035 [US2] Implémenter la règle V8 dans `src/donnees/validation.js` : toute étape `sousTension: true` ordonnée après la levée de consignation, avec un test dédié du cas fautif (FR-013)
- [X] T036 [US2] Implémenter la navigation avant, arrière et directe, et la gestion des bornes, dans `src/sequence/lecteur.js` (FR-015, FR-017, FR-019)
- [X] T037 [US2] Implémenter la persistance du curseur dans `src/sequence/lecteur.js` : stockage local sous clé portant l'empreinte, rattrapage de toute exception vers la mémoire volatile (R7, FR-031)
- [X] T038 [P] [US2] Afficher instruction, composants posés, matériel, rang et total dans `src/ui/panneau-etape.js` (FR-011, FR-018)
- [X] T039 [US2] Implémenter les commandes dans `src/ui/controles.js` : cibles d'au moins 64 px, Pointer Events unifiant souris, doigt et stylet, et raccourcis clavier sur poste fixe (R9, FR-030)
- [X] T040 [US2] Appliquer les trois registres visuels dans `src/scene/composants.js` : existant en teinte atténuée, ajout de l'étape en pleine couleur de circuit avec contour, non encore posé absent de la vue (R10, FR-012)
- [X] T041 [US2] Afficher dans `src/ui/panneau-etape.js` un bandeau bloquant tant qu'un défaut V1 à V12 subsiste, la séquence n'étant alors pas présentée comme utilisable au chantier (FR-027)

**Checkpoint**: US1 et US2 fonctionnent chacune indépendamment

---

## Phase 5: User Story 3 - Identifier un composant et son circuit (Priority: P3)

**Goal**: consulter les caractéristiques d'un composant, les inconnues étant affichées comme telles, et suivre un circuit du tableau à son dernier point.

**Independent Test**: désigner chaque composant d'un jeu de données et comparer les caractéristiques affichées à celles du jeu de données.

### Tests for User Story 3

- [X] T042 [P] [US3] Écrire `tests/fiche.test.js` : la mise en forme rend « inconnu » pour tout champ `null`, et ne produit jamais de valeur de remplacement (FR-007)

### Implementation for User Story 3

- [X] T043 [P] [US3] Implémenter la mise en forme des caractéristiques comme fonction pure dans `src/ui/fiche-composant.js` : référence, type, paroi, hauteur d'axe, indice de protection, circuit
- [X] T044 [US3] Implémenter la sélection au pointeur des composants dans `src/scene/composants.js`, avec Pointer Events
- [X] T045 [US3] Afficher le panneau de fiche dans `src/ui/fiche-composant.js`, alimenté par la sélection
- [X] T046 [P] [US3] Attribuer et appliquer la couleur de circuit dans `src/scene/composants.js`, en repli déterministe lorsque l'apport n'en déclare pas (FR-008)
- [X] T047 [US3] Mettre en évidence un circuit entier, du tableau divisionnaire à son dernier point, dans `src/scene/composants.js` (FR-008)
- [X] T048 [US3] Afficher la `provenance` — schéma unifilaire et note de calcul dont dérive la maquette — dans `src/ui/fiche-composant.js`, avec la mention explicite que ces documents l'emportent en cas de divergence (FR-009)

**Checkpoint**: les trois histoires sont indépendamment fonctionnelles

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: livrable chantier, conditions réelles d'usage, et validation d'ensemble

- [X] T049 [P] Exclure `data/apports/demo.json` du livrable chantier dans `build/bundle.mjs`
- [X] T050 Appliquer un thème à fort contraste et un corps de texte généreux dans `src/ui/`, pour la lecture en plein soleil (R9, FR-030)
- [ ] T051 Vérifier `dist/garage.html` sur tablette réelle : changement d'étape avec des gants de travail, du premier coup, et corriger le dimensionnement des cibles dans `src/ui/controles.js` si nécessaire (SC-014)
- [ ] T052 [P] Mesurer le délai d'ouverture de `dist/garage.html` sur poste fixe et sur tablette, et le tenir sous 5 secondes, en allégeant `build/bundle.mjs` si besoin (SC-008)
- [ ] T053 Valider `dist/garage.html` sur tablette, réseau coupé, sans aucune requête sortante (SC-015, FR-028, FR-030)
- [X] T054 [P] Compléter `README.md` avec la contrainte `file://` et la raison du fichier unique, pour que personne ne la redécouvre
- [ ] T055 Exécuter les onze scénarios de [quickstart.md](./quickstart.md) et consigner le résultat, y compris la réserve du scénario 9
- [X] T056 Vérifier FR-020 et FR-022 : après ajout d'un composant et d'une étape dans `data/apports/`, `git status` ne montre de changement que sous `data/` (SC-007)

---

---

# Extension — pose en apparent (constitution v1.3.0)

Les parois étant en béton non isolé, la pose est apparente. Un cheminement cesse d'être une
liaison logique pour devenir une géométrie, ce qui rend l'orthogonalité, la continuité d'un
circuit et la collision avec un obstacle mécaniquement vérifiables.

**Tâches antérieures étendues, et non refaites** : T010 (jeu de démonstration), T014, T034 et
T035 (validation), T032 et T033 (dérivation d'état), T020 (marqueurs), T055 (scénarios de
quickstart, qui passent de onze à seize).

---

## Phase 7: Foundational de l'extension (Blocking Prerequisites)

**Purpose**: données, contrats et géométrie pure, sans quoi aucune des trois histoires ne peut être étendue

**⚠️ CRITICAL**: aucune tâche des phases 8 à 10 ne peut commencer avant la fin de cette phase

> T065 à T067 sont écrites **avant** T068 à T070 et doivent échouer d'abord. C'est ici que la
> discipline compte le plus : l'orthogonalité d'un segment, la continuité d'un circuit et un
> verdict de collision sont exactement ce qui peut être faux sans que cela se voie à l'écran.

- [X] T057 Ajouter le type `boite-derivation` et son gabarit dans `data/types-composants.json` — une boîte est un composant de plein droit, pas une entité nouvelle (R11, FR-033)
- [X] T058 [P] Ajouter `toleranceRaccordement` et `diametreConduitConventionnel` dans `data/presentation.json`, conformément à `specs/001-visualisation-3d/contracts/presentation.schema.json` (R14)
- [X] T059 Déclarer le gabarit de manœuvre du véhicule et le débattement des portières comme obstacles sans baie dans `data/local.json`, avec `volume: null` et `incertain: true` (R18, FR-039)
- [X] T060 Étendre `src/donnees/chargement.js` : fusionner les collections `cheminements` et `traversees` des apports et y renseigner le champ `apport`, comme pour les composants
- [X] T061 Étendre `src/donnees/validation.js` : contrôles structurels des cheminements, segments et traversées, en miroir de `contracts/apport.schema.json`
- [X] T062 Étendre `src/donnees/validation.js` : accepter un obstacle dépourvu de champ `baie`, et le refuser aujourd'hui serait rejeter le gabarit véhicule (R18)
- [X] T063 Étendre `data/apports/000-demonstration.json` : cheminements avec segments, boîtes de dérivation, au moins une traversée vers l'extérieur, et les étapes de phase `cheminement` et `boites` qui les posent
- [X] T064 [P] Étendre `tests/validation.test.js` : cas positifs et négatifs des contrôles structurels des nouvelles collections
- [X] T065 [P] Écrire `tests/cheminement.test.js` : segment en diagonale rejeté, segment hors des limites de sa face rejeté, extrémité pendante rejetée, et les deux cas d'écart juste en dessous puis juste au-dessus de la tolérance (V13 à V15)
- [X] T066 [P] Écrire `tests/graphe.test.js` : composant d'un circuit non atteignable depuis le tableau — le défaut doit le **nommer** —, tronçon entier détaché, et jonction de trois segments sans boîte (V16, V17)
- [X] T067 [P] Écrire `tests/collision.test.js` : les trois verdicts distincts, et une assertion qui **échoue si un obstacle incertain ressort « conforme »** (R17)
- [X] T068 Implémenter `src/geometrie/cheminement.js` : orthogonalité déduite et non déclarée, appui dans les limites de la face, raccordement des extrémités à la tolérance
- [X] T069 Implémenter `src/geometrie/graphe.js` : agglomération des nœuds à la tolérance, degré d'un nœud, atteignabilité d'un composant depuis le tableau par circuit
- [X] T070 Implémenter `src/geometrie/collision.js` : intersection segment/obstacle rendant **conforme**, **en collision** ou **non concluant**, ce dernier dès que l'obstacle porte `incertain` ou `volume: null`
- [X] T071 Étendre `src/donnees/validation.js` : règles V13 à V18, et extension de V3 aux cheminements, boîtes et traversées
- [X] T072 Généraliser `src/sequence/etat.js` à la notion d'objet posable — composant, cheminement ou traversée — par un seul mécanisme et non trois codes parallèles (FR-040)

**Checkpoint**: la géométrie décide juste et se teste sans navigateur — les histoires peuvent être étendues

---

## Phase 8: User Story 1 — étendue aux cheminements apparents (Priority: P1)

**Goal**: voir le tracé réel des conduits sur les parois, et constater à l'œil qu'un conduit passe ou non dans un obstacle.

**Independent Test**: charger la géométrie, un jeu de composants et un jeu de cheminements, sans lecteur d'étapes, puis chercher les collisions connues ouvrants ouverts — en vérifiant qu'un obstacle non relevé rend « non concluant ».

### Implementation for User Story 1

- [X] T073 [US1] Créer `src/scene/cheminements.js` : dessiner chaque segment en saillie de la face qu'il déclare, au diamètre réel, ou au diamètre conventionnel quand il est inconnu
- [X] T074 [US1] Dessiner les traversées de paroi dans `src/scene/cheminements.js` : position, paroi traversée et sens, pour qu'un point extérieur alimenté au droit d'un point intérieur se lise comme tel (FR-037)
- [X] T075 [P] [US1] Étendre `src/scene/obstacles.js` : rendre les obstacles dépourvus de baie, dont le gabarit véhicule, avec le même marquage d'incertitude que le rail (FR-039)
- [X] T076 [US1] Signaler visuellement les collisions dans `src/scene/cheminements.js`, en **distinguant les trois verdicts** — un obstacle non concluant ne doit jamais se présenter comme conforme (FR-038)
- [X] T077 [US1] Afficher dans `src/ui/panneau-etape.js` la liste des contrôles de collision non concluants et la cote manquante qui l'explique, à l'image du bandeau d'obstacles incertains existant
- [X] T078 [US1] Monter le groupe des cheminements et brancher les contrôles de collision dans `src/main.js`

**Checkpoint**: la maquette montre le tracé réel et révèle les collisions — la valeur centrale de l'amendement

---

## Phase 9: User Story 2 — cheminements dans la séquence de montage (Priority: P2)

**Goal**: un conduit apparaît à l'étape qui le pose, et suit les trois registres visuels comme n'importe quel composant.

**Independent Test**: parcourir une séquence réduite comportant des étapes de cheminement, en avant puis en arrière, et vérifier qu'un conduit absent avant son étape le reste, et que l'aller-retour restitue le même état.

### Implementation for User Story 2

- [X] T079 [US2] Appliquer les trois registres visuels aux cheminements et traversées dans `src/scene/cheminements.js` : absent avant l'étape, pleine couleur de circuit à l'étape, teinte atténuée ensuite (FR-040, FR-012)
- [X] T080 [US2] Rafraîchir les cheminements à chaque changement de rang dans `src/main.js`, en réutilisant la partition d'état généralisée en T072
- [X] T081 [US2] Lister les cheminements et traversées posés par l'étape courante dans `src/ui/panneau-etape.js`, au même titre que les composants (FR-011)
- [X] T082 [US2] Étendre le bandeau bloquant de `src/ui/panneau-etape.js` aux défauts V13 à V18 : tant qu'un seul subsiste, la séquence n'est pas utilisable au chantier (FR-043)

**Checkpoint**: la notice montre la pose des conduits dans l'ordre réel du chantier

---

## Phase 10: User Story 3 — fiche des cheminements et suivi de circuit (Priority: P3)

**Goal**: consulter les caractéristiques d'un cheminement et d'une boîte, et suivre un circuit sur son tracé réel du tableau au dernier point.

**Independent Test**: désigner chaque cheminement et chaque boîte d'un jeu de données, comparer la fiche affichée aux données, puis suivre un circuit et vérifier qu'aucune portion n'est manquante.

### Tests for User Story 3

- [X] T083 [P] [US3] Écrire `tests/fiche-cheminement.test.js` : un diamètre `null` ressort « inconnu » et jamais le diamètre conventionnel de dessin, et la longueur affichée est dérivée des segments et non saisie

### Implementation for User Story 3

- [X] T084 [US3] Ajouter la mise en forme des caractéristiques d'un cheminement dans `src/ui/fiche-composant.js` : référence, circuits portés, diamètre ou « inconnu », longueur dérivée
- [X] T085 [US3] Vérifier dans `src/ui/fiche-composant.js` que la fiche d'une boîte de dérivation est en tout point celle d'un socle — si du code spécifique s'avère nécessaire, R11 a été mal appliquée
- [X] T086 [US3] Ajouter la sélection au pointeur d'un cheminement dans `src/scene/cheminements.js`, avec Pointer Events comme pour les composants
- [X] T087 [US3] Mettre en évidence un circuit sur son **tracé réel** dans `src/scene/cheminements.js`, du tableau jusqu'à son dernier point, en passant par chaque boîte et sans liaison schématique (FR-035, FR-008)

**Checkpoint**: les trois histoires sont étendues et restent indépendamment vérifiables

---

## Phase 11: Polish de l'extension

- [X] T088 [P] Reconstruire `dist/garage.html` et vérifier que `build/bundle.mjs` découvre seul les trois modules de `src/geometrie/` et le nouveau `src/scene/cheminements.js`
- [X] T089 [P] Compléter le tableau des données du `README.md` avec les cheminements, les boîtes de dérivation et les traversées
- [X] T090 Vérifier que les 69 tests antérieurs passent sans modification, hors ceux de `tests/etat.test.js` et `tests/validation.test.js` dont la surface s'élargit — c'est le signe le plus sûr que l'extension n'a rien cassé
- [ ] T091 Exécuter les scénarios 12 à 16 de [quickstart.md](./quickstart.md) et consigner le résultat
- [X] T092 Vérifier FR-041 : après ajout d'un cheminement et d'une boîte dans `data/apports/`, aucune empreinte de fichier de `src/` ne change (SC-022)

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)** : aucune dépendance
- **Foundational (Phase 2)** : dépend de Setup, **bloque les phases 3 à 5**
- **US1, US2, US3 (Phases 3 à 5)** : dépendent de Foundational
- **Polish (Phase 6)** : dépend des histoires souhaitées
- **Foundational de l'extension (Phase 7)** : dépend de la Phase 2, **bloque les phases 8 à 10**
- **Extensions d'histoire (Phases 8 à 10)** : dépendent de la Phase 7. La Phase 8 dépend en outre de la Phase 3, la 9 de la 4, la 10 de la 5 — on n'étend que ce qui existe
- **Polish de l'extension (Phase 11)** : dépend des phases 8 à 10

### User Story Dependencies

- **US1 (P1)** : aucune dépendance sur une autre histoire. Livrable seule, socle comme extension
- **US2 (P2)** : logique testable sans navigateur. T079 et T080 s'appuient sur `src/scene/cheminements.js` créé en US1
- **US3 (P3)** : T086 et T087 s'appuient également sur `src/scene/cheminements.js`

> **Le point de contention a changé de fichier.** C'était `src/scene/composants.js` pour le
> socle ; c'est désormais `src/scene/cheminements.js`, créé en T073 puis étendu en T076, T079,
> T086 et T087. Si deux histoires sont menées en parallèle, le conflit se produira là. Les
> trois modules de `src/geometrie/`, eux, sont écrits une fois en Phase 7 et plus jamais
> touchés — c'est l'intérêt d'avoir séparé ce qui décide de ce qui dessine.

### Within Each User Story

- Les tests précèdent l'implémentation et doivent échouer avant elle
- En Phase 7 : données (T057 à T059) avant chargement (T060), chargement avant validation
  structurelle (T061), tests de géométrie (T065 à T067) avant géométrie (T068 à T070),
  géométrie avant les règles V13 à V18 (T071)
- T073 avant T074, T076, T079, T086 et T087 — même fichier
- T072 avant T079 et T080 — la partition d'état généralisée est leur entrée

### Parallel Opportunities

- T003, T004 et T005 en parallèle, une fois T001 faite
- T007, T008, T010 et T014 en parallèle, une fois T006 faite
- T024, T025, T026 et T027 en parallèle
- **T058 en parallèle de T057 et T059** — fichiers de données distincts
- **T064 à T067 en parallèle entre eux** — quatre fichiers de test distincts, et c'est le lot
  parallélisable le plus rentable de l'extension
- **T068, T069 et T070 en parallèle** — trois modules de géométrie indépendants
- **T075 en parallèle de T073 et T074**
- T088, T089 et T092 en parallèle

---

## Parallel Example: Phase 7

```bash
# Les quatre suites de tests, écrites avant toute implémentation :
Task: "Étendre tests/validation.test.js aux nouvelles collections"
Task: "Écrire tests/cheminement.test.js"
Task: "Écrire tests/graphe.test.js"
Task: "Écrire tests/collision.test.js"

# Puis les trois modules de géométrie, indépendants entre eux :
Task: "Implémenter src/geometrie/cheminement.js"
Task: "Implémenter src/geometrie/graphe.js"
Task: "Implémenter src/geometrie/collision.js"
```

---

## Implementation Strategy

### Reprise après l'amendement

Le socle est construit et validé. La suite se joue en deux temps.

1. **Phase 7 d'abord, en entier.** C'est la seule phase où une erreur ne se verrait pas. Elle
   se termine quand `npm test` passe, y compris les quatre nouvelles suites.
2. **Phase 8 ensuite, et s'arrêter là pour valider.** Les scénarios 12 à 14 de
   [quickstart.md](./quickstart.md) s'automatisent ; le scénario 9 se rejoue à l'œil. À ce
   stade la maquette révèle déjà qu'un conduit passe dans la trajectoire du tablier — ce que
   la version encastrée ne pouvait pas faire, et la valeur centrale de l'amendement.
3. **Phases 9 et 10 ensuite**, dans l'ordre des priorités.
4. **Phase 11 pour finir**, avec les quatre tâches d'appareil restées en suspens du socle.

### Ordre recommandé en solo

Séquentiel, dans l'ordre des numéros. Les lots parallèles de la Phase 7 gardent leur intérêt
même seul : écrire les quatre suites de tests d'affilée, avant les trois modules, évite
d'implémenter en regardant sa propre implémentation.

---

## Notes

- Les trois cotes manquantes — `TODO(RAIL_PORTE_SECTIONNELLE)`, débattement du vantail,
  gabarit de manœuvre du véhicule — n'empêchent aucune tâche. T059 les déclare incertaines et
  T070 rend « non concluant » plutôt que « conforme ». C'est le comportement exigé par le
  Principe VI, et la seule assertion de toute la suite qui protège contre une réponse
  rassurante plutôt que contre une erreur
- Aucun apport électrique réel n'existe encore. `data/apports/000-demonstration.json`, étendu
  en T063, tient ce rôle, et T049 l'exclut du livrable chantier
- Toute tâche touchant `data/` sans toucher `src/` est un bon signe ; l'inverse mérite examen
- Commit après chaque tâche ou groupe cohérent

---

## État d'exécution

### Socle — phases 1 à 6, au 2026-09-21

**52 tâches sur 56 faites.** Les 4 restantes exigent un appareil réel ou un navigateur :
T051 (gants sur tablette), T052 (délai d'ouverture mesuré), T053 (tablette réseau coupé),
T055 (scénarios visuels, dont le périmètre passe de onze à seize scénarios).

69 tests, 0 échec.

### Extension — phases 7 à 11, au 2026-09-21

**35 tâches sur 36 faites.** Seule **T091** reste partielle : les scénarios 12 à 14 de
`quickstart.md` sont automatisés et passent, les scénarios 15 et 16 sont visuels et
demandent un navigateur.

123 tests, 0 échec — 54 de plus qu'avant l'extension. Le livrable chantier empaquette
20 modules et se vérifie hors ligne à chaque construction.

**Deux constats de l'exécution.**

La topologie de démonstration que j'avais d'abord écrite était géométriquement fausse :
l'antenne horizontale passait droit à travers le point de traversée, créant une jonction de
trois conduits sans boîte. La règle V17 l'a rattrapée. Corrigé par deux boîtes de pied
supplémentaires à 1,50 m, là où la descente se divise — ce qu'on ferait réellement.

La même règle a rattrapé, lors de la vérification T092, un conduit d'essai qui traversait
TV-01. C'est la deuxième fois que V17 attrape une erreur que je n'avais pas vue : un comptage
d'arêtes vaut mieux qu'une relecture attentive.

**Une suite antérieure a dû être touchée**, au-delà de ce que le plan prévoyait :
`catalogues.test.js`, d'une ligne. Son étape injectée ne déclarait pas les collections
`cheminements` et `traversees`, désormais obligatoires au contrat. `etat.test.js` n'a en
revanche demandé aucune modification, alors que le plan l'annonçait : la généralisation aux
objets posables s'est révélée rétrocompatible.

### Écarts assumés, repris du socle

- **TDD partiel** sur la logique de la Phase 2, écrite avant ses tests. La Phase 7 ne répète
  pas cet écart : T065 à T067 précèdent T068 à T070 et doivent échouer d'abord
- **Contrat étendu quatre fois** au total, faute de champ pour porter une exigence :
  `provenance` et `verification` lors du socle, puis `cheminements`, `traversees`, `baie`
  facultatif, `toleranceRaccordement` et `diametreConduitConventionnel` lors de l'amendement
- **T056 et T092** vérifiés par empreintes de `src/` plutôt que par `git status` : le dépôt
  n'a aucun commit de référence
