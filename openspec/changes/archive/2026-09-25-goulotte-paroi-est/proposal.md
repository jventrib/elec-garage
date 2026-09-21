# Proposal

## Why

Sur la paroi est, deux conduits courent en parallèle de la goulotte GL-01 jusqu'à l'angle
nord-est. Ils sont superposés dans la bande de 0,25 m qui sépare le linteau de la porte de service
(2,50 m) du plafond :

| Conduit | Tracé | Calibre | Porte |
|---|---|---|---|
| CH-02 | (5,60 ; 0,70 → 2,60) à 2,60 m | IRL 25 | 10 conducteurs, prises et éclairage |
| CH-B2 | même tracé, à 2,64 m | IRL 25 | la ligne de la borne |
| CH-03 | est 2,60 → 5,60, nord 0,15 m, descente à PC-03 (x 5,45) | IRL 20 | 3, prises |
| CH-B3 | est 2,60 → 5,60, nord jusqu'à x 4,50, descente à 1,40, sous l'allège, BR-01 | IRL 25 | la ligne de la borne |

La bande porte exactement deux conduits. La ligne de la borne traverse BD-01, dont le volume reste
à établir sur cote produit, et la montée CH-04 interdit tout autre passage. Le maître d'ouvrage a
demandé d'étudier leur remplacement par une goulotte.

**Décision du maître d'ouvrage du 2026-09-24** : une goulotte **collée au plafond**, sur
la paroi est **puis la paroi nord jusqu'à x = 4,50 m**, où la borne descend. Le livrable est une
**note d'étude** ([etude.md](etude.md)), puis le présent changement, appliqué à la maquette. Sa
section, **90 × 40 mm**, a été arrêtée le 2026-09-25 après l'évaluation de l'étude.

## What Changes

- **GL-02**, nouveau cheminement à raccordement latéral : 6,00 m de profilé, un angle intérieur,
  profilé 90 × 40, z 2,66 → 2,75. Il rejoint GL-01 par un T réduit et porte les trois circuits.
- **Retirés** : CH-02, CH-04, CH-B2, BD-01 et l'accessoire BD-03. CH-03 et CH-B3 sont **réduits à
  leur descente**, qui sort par le dessous du profilé. CH-05 part du dessous, CH-07 de la face
  avant, par un **coude déclaré en accessoire de conduit**, AC-01.
- **OC-02**, groupe de connexions sous le capot de GL-02, reçoit les connexions de l'ex-BD-01.
- **Constitution v1.15.0** (décision du 2026-09-24) : les connexions sont admises en goulotte, sans
  enveloppe propre — dispositif de connexion, sans épissure, IP2X si le capot se dépose sans outil.
  OC-01 et OC-02 perdent leur volume.
- **TV-L2** part du **fond** de la goulotte, en pente : entrée à 2,705 m, sortie à 2,60 m sous EL-03,
  qui garde sa hauteur. Dénivelé coté : 0,105 m. Elle se raccorde à la goulotte par son entrée.
- **Socle** :
  - un profilé à raccordement latéral **s'aborde par ses faces**, dans le volume de sa section, et
    ses nœuds s'enchaînent le long de son axe ;
  - un organe de connexion ne reçoit que les nœuds du **profilé qui le porte**, hors des bouts
    partagés avec un autre profilé ;
  - un conducteur ne compte d'un profilé que la longueur qu'il y **parcourt** ;
  - V15 admet un conduit qui débouche dans un profilé, et V18 borne l'entrée d'une traversée qui
    part du fond d'un profilé.
- La fiche d'un **accessoire de conduit** dit qu'aucune connexion ne s'y fait.
- **Réserves** :
  - 3.3 (volume de BD-01) est levée, remplacée par le remplissage de GL-02 sur fiche produit ;
  - 1.6 (b) (portion en goulotte négligeable) est close par la négative ;
  - **deux réserves bloquantes d'achat** sont ouvertes : `Iz` de la borne en goulotte avec
    groupement, et la forme de sa ligne, câble ou conducteurs isolés, face au calibre de sa
    descente.
- **La borne en câble 3G10** (décision du 2026-09-24), descente maintenue en IRL 25 : **dérogation
  au Principe III**, écrite et à résorber. Un circuit peut déclarer `cable` ; le tube le reçoit
  comme un objet, le métré le compte au mètre de câble : 10,48 m.
- **Note de calcul de la borne** : sa ligne « facteur de groupement : sans objet » est corrigée.
  Elle était déjà fausse depuis l'amendement v1.14.0.

## Capabilities

### New Capabilities

Aucune.

### Modified Capabilities

- `installation/cheminements` :
  - « Goulotte support partagé », « Goulotte à capot démontable, six conditions », « Réservation de
    place pour les parcours parallèles », « Raccordement latéral et portée de la règle d'extrémité
    pendante » et « Géométrie de perçage d'une traversée » sont modifiées ;
  - « Traversée de BD-01 par la ligne de la borne », « Volume de BD-01 à établir sur cote produit »,
    « EL-03 desservi par la boîte existante » et « Organe de connexion à enveloppe propre » sont
    retirées ; « Toute connexion dans une boîte » et « Typologie des enveloppes de cheminement »
    sont modifiées ;
  - « EL-03 desservi par le fond de la goulotte », « Remplissage de la goulotte de la paroi est » et
    « Connexions sous le capot d'une goulotte » sont ajoutées.
- `installation/electricite` : « Dimensionnement de la ligne de la borne » est modifiée — portion
  par portion, groupement exigible, réserve bloquante d'achat.
- `maquette/socle-et-apports` : « Longueur de conducteur sous un capot » est ajoutée.

## Impact

- `data/apports/002-prises-de-courant.json`, `003-eclairage.json`, `004-borne-recharge.json`,
  `005-automatisation-locale.json` : le tracé, les objets et les instructions
- `src/geometrie/cheminement.js` (`pointDansProfile`, `pointSurProfile`), `graphe.js` (chaîne le
  long de l'axe), `connecteurs.js` (`noeudsDe`), `conducteurs.js` (longueur sous capot)
- `src/donnees/validation.js` (V15, V17, V18), `src/ui/fiche-composant.js` (accessoire)
- `build/fournitures.mjs`, `dossier/fournitures.md`
- `dossier/002-prises-de-courant/note-de-calcul.md`, `003-eclairage/note-de-calcul.md`,
  `004-borne-recharge/note-de-calcul.md`
- `openspec/constitution.md` (v1.15.0), `openspec/config.yaml`
- `openspec/changes/reserves-maitre-ouvrage/tasks.md`
- Tests : `tests/goulotte-paroi-est.test.js` (nouveau), `_aides.js` (tracé d'avant), et les
  décomptes, métrés, longueurs et connecteurs de quinze fichiers
- `src/version.js`, `dist/garage.html`

**Hors périmètre** : la réécriture des documents Spec Kit de `dossier/00x/` antérieurs au
2026-09-22 (`research.md`, `data-model.md`, `implantation.md`), qui restent des archives datées.
