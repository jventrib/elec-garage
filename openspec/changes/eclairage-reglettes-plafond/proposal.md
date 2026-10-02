# Proposal

## Why

**Décision du maître d'ouvrage du 2026-09-26** : le plafond du garage ne reçoit plus un plafonnier
à deux sorties, mais **six réglettes LED HOFTRONIC 120 cm** en deux colonnes de trois. Le dossier
`003-eclairage` a été construit autour d'un point lumineux unique à deux sorties, et cette
hypothèse traverse aujourd'hui les données, les tests, la maquette et les spécifications
d'installation.

**Complément du 2026-10-01** : la distribution de ces six réglettes **est pontée**, et non tirée
en étoile. Sept conduits et quatre boîtes sont remplacés par **quatre conduits, une boîte et
quatre cordages**. La réserve de dégagement du tablier, qui portait sur trois segments de conduit
en plus des deux réglettes du rang sud, ne porte plus que sur les deux réglettes.

Deux raisons rendent la règle des points lumineux impropre telle qu'elle est écrite. Elle dit
qu'« un numéro EL désigne un point lumineux, c'est-à-dire ce qui s'allume d'un seul geste » — or
les six réglettes s'allument bien d'un seul geste, mais ce sont **six points lumineux distincts**,
et la règle obligerait à les déclarer comme un seul. Le repérage EL-01a…EL-01f tient toujours ;
c'est la notion de « point » qu'il faut reprendre.

## What Changes

- **Le type `reglette-led`** est ajouté à `data/types-composants.json`, avec son gabarit
  120 × 65 × 58 mm, `orientation: "x"`, et une fiche produit qui **conserve** les contradictions
  de la source (flux 4230/4320 lm, matière inox ou ABS et polycarbonate, dénomination) sans en
  trancher aucune.
- **Six composants** `ec-el-01a` à `ec-el-01f` remplacent les deux sorties d'EL-01, en deux
  colonnes à x = 1,45 et 4,15 m, sur trois rangs à y = 1,55 / 2,90 / 4,55 m.
- **La distribution passe de une boîte à quatre, puis de quatre à une** : le 2026-09-26 elle
  avait été portée à quatre boîtes — BL-01, BD-07, BD-08, BD-09 — pour sept conduits CH-L9 à
  CH-L15. Le 2026-10-01, elle tient dans **une seule boîte, BL-01**, et **quatre conduits** : CH-L2,
  CH-L3 vers la colonne est, CH-L4 vers la colonne ouest, CH-L6 vers le point extérieur. BL-01 passe
  du degré 4 au degré **3**, celui de toute fourche à trois débouchés.
- **Les six réglettes sont pontées deux par deux, par quatre cordages** : CP-1 (EL-01e → EL-01c) et
  CP-2 (EL-01c → EL-01a) à l'ouest, CP-3 (EL-01f → EL-01d) et CP-4 (EL-01d → EL-01b) à l'est. Chaque cordage est une **liaison franche entre deux points déclarés**, et
  non une dérivation prise sur un presse-étoupe. Le composant ponté déclare ses `raccords`, le graphe
  y relie une **arête interne de 1,20 m** — le câble fourni dans le corps — réelle pour la chute de
  tension et **absente du métré d'achat**.
- **La chaîne série est examinée et écartée** : le presse-étoupe PG11 de la réglette est
  intermédiaire et n'économise aucun conduit. *Ce motif ne vaut que contre le chaînage ; il ne dit
  rien contre le pontage, où aucun presse-étoupe n'est traversé.*
- **Un cordage n'a pas de section** : il n'est pas choisi dans un catalogue de conduits. Le dossier
  dit donc que **sa condition de remplissage n'est pas vérifiable** et que le type du câblier est
  une **condition d'achat**, non une grandeur déduite. Chaque cordage porte **trois conducteurs**,
  phase, neutre et PE.
- **Le champ `zoneTablier`** est ajouté aux composants du plafond, avec trois états : `degage-prouve`,
  `non-concluant`, et l'absence d'état pour ce qui n'est pas concerné.
- **Les deux réglettes du rang sud ne sont pas prouvées dégagées** du tablier remonté, dont
  l'épaisseur n'a jamais été relevée. *Aucun segment de conduit ne porte plus `non-concluant`* : les
  trois qui le faisaient appartenaient aux colonnes supprimées, et la réserve s'est déplacée des
  conduits vers les points.
- **Le point dimensionnant change deux fois** : EL-01a l'est devenu le 2026-09-26, à 11,73 m
  contre 11,53 m pour EL-01b ; le pontage l'a **redéplacé sur EL-01b**, à 18,37 m de conduit et
  17,17 m de phase. *La colonne ouest étant la plus longue de 20 cm, le point le plus lointain n'est
  plus le plus à l'ouest mais celui du parcours le plus long.*

## Capabilities

### Modified Capabilities

- `installation/points-utilisation` : l'inventaire des points lumineux passe de trois points et
  quatre sorties à **huit points et huit sorties** ; EL-01 devient un ensemble de six réglettes ;
  l'exigence d'axe au nord du tablier est **remplacée** par une exigence de dégagement par
  présentation, l'axe à y = 3,25 m ne protégeant plus le rang sud.
- `installation/cheminements` : **retire** la distribution individuelle et l'organisation en quatre
  boîtes ; **ajoute** le pontage par cordage, la déclaration `raccords` avec arête interne, et la
  distribution à une seule boîte de degré 3. L'interdiction du chaînage série est maintenue dans
  `installation/points-utilisation`, où elle a été écrite.

### Added Capabilities

- Aucune. La règle de dégagement du tablier existe déjà, dans `maquette/visualisation` et
  `socle-et-apports` ; cette change l'applique à un cas où elle ne conclut pas.

## Impact

- `data/types-composants.json` — type `reglette-led`
- `data/apports/003-eclairage.json` — six composants, **une boîte, quatre conduits, quatre
  cordages**, `raccords`, circuits et consignes de pose
- `data/types-composants.json` — `reglette-led` et sa fiche produit, avec `liaisonInterne`
- `data/presentation.json` — rendu des cordages : tube 6 mm, flèche 20 mm, sans contour
- `dossier/001-visualisation-3d/contracts/apport.schema.json` — `raccords`, `nature`, `liaisonInterne`
- `src/geometrie/cheminement.js`, `src/geometrie/graphe.js` — natures de cheminement, `raccords`,
  arête interne, `noeudsDeComposant`, `cheminEntre`
- `src/donnees/validation.js` — V13, V14 et V24
- `src/donnees/fournitures.js` — séparation conduits et cordages, exclusion du lien interne fourni
- `src/scene/cheminements.js`, `src/scene/composants.js` — rendu des cordages, gabarit plafond
  corrigé en `[g.l, g.h, g.p]`
- `src/ui/fiche-composant.js` — affichage de `zoneTablier`
- `tests/apport-003.test.js`, `tests/apport-005.test.js`, `tests/conducteurs-trajet.test.js`,
  `tests/contiguite.test.js`, `tests/fournitures.test.js`, `tests/scene.test.js`,
  `tests/fiche.test.js`, `tests/cordages.test.js`, `tests/contrat-apport.test.js`
- `dossier/003-eclairage/` — les six documents, révisés au 2026-09-26 puis au **2026-10-01**
- `dossier/fournitures.md` — régénéré
- `openspec/specs/installation/points-utilisation/spec.md` — **à modifier par cette change**
