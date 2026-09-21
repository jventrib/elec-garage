# Implementation Plan: Visualisation 3D du Garage et Guide de Montage

**Branch**: `001-visualisation-3d` | **Date**: 2026-09-21 (révisé) | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/001-visualisation-3d/spec.md`

> **Révision du 2026-09-21.** Ce plan remplace celui établi contre la spécification FR-001 à
> FR-031. La constitution est passée en v1.3.0 — parois en béton non isolé, pose apparente —
> et la spécification a été amendée en FR-032 à FR-043. Le socle déjà construit reste valide ;
> ce qui change est délimité en fin de document.

## Summary

Construire le socle commun du projet : une application web statique qui représente le garage
en volume à l'échelle du relevé, y implante les composants électriques et **le tracé réel des
conduits posés en apparent**, et déroule le montage sous forme d'une séquence unique d'étapes
que l'installateur parcourt en avant et en arrière.

L'approche tient en quatre décisions. Les **données sont séparées du code** : relevé,
catalogues et apports des fonctionnalités sont des fichiers JSON, la logique ne les connaît
que par leur forme. L'**état affiché est une fonction pure du rang d'étape**, ce qui rend la
navigation arrière exacte par construction. La **livraison chantier est un fichier HTML
autonome** ouvrable depuis le système de fichiers d'une tablette. Et désormais, un **cheminement
est une géométrie, pas une liaison** : une suite de segments orthogonaux rattachés à une face
de paroi, ce qui rend l'orthogonalité, la continuité d'un circuit et la collision avec un
obstacle mécaniquement vérifiables.

## Technical Context

**Language/Version**: JavaScript ES2022, modules natifs. Pas de TypeScript ni de transpilation.

**Primary Dependencies**: three.js 0.186.0, vendorée dans `vendor/three/`. Aucune autre
dépendance d'exécution, aucun CDN, aucun appel réseau.

**Storage**: fichiers JSON — quatre fichiers de socle (`local`, `chantier`,
`types-composants`, `presentation`) et un fichier par fonctionnalité contributrice.
`localStorage` pour la seule position du lecteur (FR-031). Aucune base de données.

**Testing**: `node:test` et `node:assert` de la bibliothèque standard, sur la logique pure —
chargement, catalogues, ordonnancement, contrôles de cohérence, machine de navigation,
dérivation d'état, et désormais **géométrie de cheminement** : orthogonalité, appui sur une
face, continuité de circuit, intersection avec obstacle. Le rendu se valide par les scénarios
manuels de [quickstart.md](./quickstart.md).

**Target Platform**: navigateurs récents à moteur WebGL. Deux usages servis par la même
interface : poste fixe en préparation, tablette ou téléphone en main sur le chantier (FR-029).

**Project Type**: application web statique monopage. Aucun backend, aucune API, aucun compte.

**Performance Goals**: utilisable en moins de 5 s après ouverture, sur les deux appareils
(SC-008). Rotation de la vue et changement d'étape sans attente perceptible (SC-009).

**Constraints**: aucun serveur applicatif, aucun compte, aucune dépendance à un service tiers
en ligne (FR-028). Fonctionnement complet hors réseau (FR-030). Ouvrable depuis `file://`, ce
qui interdit les modules ES et tout chargement de fichier annexe à l'exécution, et impose la
livraison en fichier unique. Aucun fichier d'illustration externe. Commandes actionnables avec
des gants (FR-030). **Pose apparente exclusivement** : aucun encastrement n'est représentable,
et la maquette n'a pas à prévoir ce cas.

**Scale/Scope**: un local unique. Ordre de grandeur attendu, les trois fonctionnalités
électriques réunies : quelques dizaines de composants, une à deux centaines de segments de
cheminement, moins d'une centaine d'étapes. Aucune contrainte de volumétrie.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

Constitution v1.3.0. Évaluation principe par principe.

| Principe | Applicabilité | Verdict |
|----------|---------------|---------|
| I. Conformité NF C 15-100 | Indirecte. Le socle n'énonce aucune règle électrique. | **PASS** — FR-007 lui interdit de substituer une valeur à une inconnue. |
| II. Sécurité et protection différentielle | Indirecte, mais réelle. | **PASS** — FR-013 interdit d'illustrer un travail sous tension ; V8 le vérifie mécaniquement. |
| III. Dimensionnement calculé et justifié | Indirecte, et **renforcée** par l'amendement. | **PASS** — le socle ne calcule rien, mais FR-036 rend visible quels circuits partagent un conduit, c'est-à-dire l'entrée même du facteur de groupement que le Principe III exige désormais d'appliquer. La maquette sert le principe au lieu de l'ignorer. |
| IV. Circuit de recharge dédié | Non applicable à ce socle. | **PASS** — FR-008 et FR-035 rendront la dédicace du circuit visible sur son tracé. |
| V. Documentation et vérification | Directe. | **PASS** — FR-014 inscrit les six vérifications comme étapes ; V10 contrôle leur présence. |
| VI. Visualisation et guide de montage | Cœur de la fonctionnalité. | **PASS** — détail ci-dessous. |

**Vérification détaillée du Principe VI**

| Règle | Couverture |
|-------|-----------|
| Échelle et dimensions relevées | FR-001, FR-002 |
| Cote inconnue affichée comme inconnue | FR-007, champs `null` de [data-model.md](./data-model.md) |
| Composants portant circuit, hauteur d'axe, indice de protection | FR-006, et FR-033 pour les boîtes |
| Obstacles modélisés (vantail, tablier, rail) | FR-003, FR-039 pour le gabarit véhicule — voir réserve 2 |
| **Cheminement représenté à son tracé réel, avec encombrement** | **FR-032, FR-034** |
| **Boîte de dérivation, composant de plein droit** | **FR-033** |
| Maquette non normative, schéma et note l'emportent | FR-009 |
| Consultable sans service tiers ni installation | FR-028, FR-030 |
| Lecture par étapes, instruction + illustration | FR-010, FR-011 |
| Ordre de pose réel | FR-023, FR-024 |
| Navigation réversible sans perte d'état | FR-015, FR-016 — garanti par construction (R5) |
| État à l'issue, ajout distingué de l'existant | FR-012, et FR-040 qui l'étend aux cheminements |
| Essais dans la séquence | FR-014 |
| Consignation et levée explicites | FR-013, FR-025 |

**Vérification de la section « Mode de pose imposé »** — nouvelle au gate

| Règle de la constitution | Couverture dans le socle |
|--------------------------|--------------------------|
| Conduits IRL en saillie, aucun encastrement | FR-032, FR-034. Le modèle ne sait représenter qu'un parcours posé sur une face : l'encastrement est inexprimable, ce qui est le comportement voulu. |
| Boîte à chaque intersection, dérivation, changement de direction | FR-042 règle V17 : tout nœud de degré ≥ 3 porte une boîte, sinon défaut bloquant. |
| Toute connexion dans une boîte, jamais dans un conduit | FR-042 règle V17, même mécanisme. C'est la règle de sécurité que le socle peut réellement contrôler. |
| Appareillage en saillie | FR-006 et le catalogue de types : le gabarit d'un socle est un volume en saillie du nu de la paroi, avec son décalage de face. |
| Parcours orthogonaux | FR-034, FR-042 règle V13. |
| Tracés évitant les zones de choc | FR-038, FR-039. |
| Traversées étanches, en pente vers l'extérieur | FR-037 pour la représentation. Le socle montre la position et le sens ; l'étanchéité est une exigence de pose, pas de maquette. |
| Fixations adaptées au béton | Hors socle : relève de la nomenclature (étape 5 du processus). |
| Condensation, conduit extérieur qualifié | Hors socle : relève du choix de matériel. Le socle affiche `indiceProtection` ou « inconnu ». |

**Contraintes du Site** — `data/local.json` reste l'unique transcription du relevé, y compris
la nature des parois. Le repère est celui fixé par la constitution.

**Livrable numérique** — données et non code (FR-020, FR-041), socle commun n'appartenant à
aucune fonctionnalité (FR-022), circuits distinguables et suivis **sur le tracé réel** (FR-008,
FR-035). Conforme.

### Trois réserves, tenues pour justifiées

**1. Ordre du processus.** Le processus place la note de calcul (étape 3) avant le schéma et la
maquette (étape 4). Aucune note de calcul n'existe, et les points ouverts de la constitution en
bloquent l'établissement. Cette fonctionnalité reste planifiable parce qu'elle ne porte **aucun
contenu électrique** : elle construit le contenant, le format d'apport et le lecteur. FR-007
rend impossible qu'elle devance les calculs en inventant des valeurs.

**2. Trois cotes manquantes, et une conséquence nouvelle.** `TODO(RAIL_PORTE_SECTIONNELLE)`,
le débattement du vantail de la porte de service, et désormais le gabarit de manœuvre du
véhicule. Elles sont traitées comme des obstacles déclarés `incertain`, avec `volume: null`.

L'amendement rend cette réserve plus mordante qu'avant. FR-038 demande de signaler
l'intersection d'un cheminement avec un obstacle ; or on ne peut pas intersecter un volume
inconnu. Le contrôle DOIT donc rendre trois verdicts et non deux — **conforme**, **en
collision**, ou **non concluant** — et jamais confondre le troisième avec le premier. Un
obstacle incertain qui ressortirait « conforme » serait exactement le mensonge que le
Principe VI interdit.

**3. Le code déjà écrit précède l'amendement.** 52 tâches sur 56 ont été exécutées contre la
spécification FR-001 à FR-031. Le socle est conforme à ce qui était demandé alors, et le reste
pour tout ce qui ne touche pas au cheminement. Ce plan ne le réécrit pas : il ajoute.

**Verdict du gate : PASS.** Aucune violation à justifier, donc pas de section Complexity
Tracking.

**Re-évaluation après Phase 1 : PASS.** Les décisions R11 à R18 ne créent aucune dérogation.
Deux d'entre elles renforcent le respect de la constitution plutôt qu'elles ne s'en
accommodent : R11 fait de la boîte de dérivation un composant ordinaire, donc soumis sans
exception à FR-006 et FR-007 ; et R16 rend la règle « toute connexion dans une boîte » aussi
mécanique que la règle V8 sur le travail sous tension.

## Project Structure

### Documentation (this feature)

```text
specs/001-visualisation-3d/
├── plan.md              # Ce fichier
├── research.md          # Phase 0 — R1 à R10 (socle) puis R11 à R18 (cheminements)
├── data-model.md        # Phase 1 — entités, champs, règles de validation V1 à V18
├── quickstart.md        # Phase 1 — comment lancer et comment valider
├── contracts/
│   ├── local.schema.json            # Relevé géométrique, obstacles compris
│   ├── chantier.schema.json         # Phases, natures d'étape, vérifications
│   ├── types-composants.schema.json # Gabarits et libellés
│   ├── presentation.schema.json     # Couleurs, éclairage, vues, libellés
│   └── apport.schema.json           # Contrat d'apport des fonctionnalités électriques
├── checklists/
│   └── requirements.md
└── tasks.md             # Phase 2 — produit par /speckit-tasks, pas ici
```

### Source Code (repository root)

```text
index.html                  # Entrée de développement, modules ES, servie en statique
src/
├── main.js                 # Amorce : charge, monte la scène, branche le lecteur
├── donnees/
│   ├── chargement.js       # Lecture des JSON, fusion des apports, valeurs dérivées
│   └── validation.js       # Catalogues + cohérence V1 à V18
├── sequence/
│   ├── phases.js           # Accès au catalogue de chantier
│   ├── ordonnancement.js   # Tri topologique phase + dépendances
│   ├── etat.js             # État au rang N — généralisé aux objets posables
│   └── lecteur.js          # Navigation et curseur
├── geometrie/
│   ├── cheminement.js      # NOUVEAU — segments, orthogonalité, appui sur face
│   ├── graphe.js           # NOUVEAU — nœuds, degrés, continuité de circuit
│   └── collision.js        # NOUVEAU — intersection segment / obstacle, à trois verdicts
├── scene/
│   ├── local.js            # Sol, parois, plafond, baies
│   ├── obstacles.js        # Ouvrants, rail, gabarit véhicule, volumes incertains
│   ├── composants.js       # Marqueurs, code couleur de circuit, registres visuels
│   ├── cheminements.js     # NOUVEAU — conduits, boîtes, traversées, surbrillance
│   └── vue.js              # Caméra orbitale, vues prédéfinies
└── ui/
    ├── panneau-etape.js    # Instruction, matériel, rang et total
    ├── fiche-composant.js  # Caractéristiques et mention « inconnu »
    └── controles.js        # Avant, arrière, accès direct, cibles gantées

data/
├── local.json              # Relevé — transcription unique
├── chantier.json           # Catalogue des phases, natures, vérifications
├── types-composants.json   # Gabarits et libellés, dont `boite-derivation`
├── presentation.json       # Couleurs, opacités, éclairage, caméra, vues, libellés
└── apports/
    └── <NNN-nom>.json      # Circuits, composants, cheminements, traversées, étapes

vendor/three/               # three.js vendorée, aucune dépendance en ligne
build/bundle.mjs            # Produit dist/garage.html, fichier unique autonome, auto-vérifié
tests/                      # node:test sur la logique pure
dist/garage.html            # Livrable chantier, ouvrable depuis file://
```

**Structure Decision**: application web statique en projet unique, sans backend. Le découpage
sépare ce qui est testable sans navigateur de ce qui ne l'est que visuellement.

L'amendement ajoute un répertoire `src/geometrie/`, délibérément distinct de `src/scene/`.
La raison est la même qui a présidé au découpage initial : `scene/` dessine, `geometrie/`
décide. L'orthogonalité d'un segment, la continuité d'un circuit et l'intersection avec un
obstacle sont des questions à réponse vraie ou fausse, testables sans pixel — et ce sont
précisément celles qui peuvent être fausses sans que cela se voie à l'écran. Un conduit
dessiné en diagonale se remarque ; un circuit dont la continuité est rompue de 3 mm ne se
remarque pas, et c'est lui qui enverra l'installateur percer au mauvais endroit.

### Délimitation de ce que l'amendement change

| Existant, inchangé | Existant, à étendre | Nouveau |
|--------------------|---------------------|---------|
| `chargement.js`, `phases.js`, `ordonnancement.js`, `lecteur.js` | `etat.js` — généraliser la dérivation aux cheminements et traversées (FR-040) | `geometrie/cheminement.js` |
| `scene/local.js`, `scene/vue.js` | `validation.js` — règles V13 à V18 | `geometrie/graphe.js` |
| `ui/controles.js`, `ui/panneau-etape.js` | `scene/obstacles.js` — obstacles hors baie (gabarit véhicule) | `geometrie/collision.js` |
| `build/bundle.mjs` (le graphe se découvre seul) | `scene/composants.js` — surbrillance de circuit sur tracé | `scene/cheminements.js` |
| `data/local.json` (le relevé ne change pas) | `ui/fiche-composant.js` — fiche d'une boîte, d'un cheminement | — |
| `data/chantier.json`, `data/presentation.json` | `data/types-composants.json` — type `boite-derivation` | — |
| | `contracts/apport.schema.json`, `contracts/local.schema.json` | — |

Les 57 tests existants doivent continuer de passer sans modification, à l'exception de ceux
qui touchent `etat.js` et `validation.js` dont la surface s'élargit. C'est la première
vérification à faire, et le signe le plus sûr que l'extension n'a rien cassé.
