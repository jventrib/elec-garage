# Proposal

## Why

Les instructions de connexion disent « faire les connexions à la borne automatique », sans dire
**combien** de bornes ni **lesquelles**. L'installateur ouvre chaque boîte sans savoir ce qu'il y
trouvera à faire, et la liste d'achat ne compte aucun connecteur. Or la maquette connaît le
trajet de chaque conducteur, conduit par conduit : elle sait donc, pour chaque boîte, combien de
brins d'un même conducteur s'y rejoignent.

**Décision du maître d'ouvrage du 2026-09-24** : les connexions en boîte se font en **WAGO 221**,
bornes à levier, et un conducteur qui **traverse** une boîte sans s'y dériver est tiré **d'un seul
tenant**, sans connecteur.

## What Changes

- La fiche d'une **enveloppe de jonction** — boîte de dérivation, organe de connexion — porte le
  **nombre et la référence** des connecteurs à y poser, circuit par circuit et conducteur par
  conducteur, et leur total.
- Le décompte est **dérivé** du trajet des conducteurs, non déclaré : un connecteur n'existe que là
  où un conducteur se sépare, et il a autant d'entrées que de brins qui s'y rejoignent.
- Un conducteur qui ne fait que **traverser** — la ligne de la borne, par exemple — ne reçoit
  aucun connecteur, et la fiche le dit.
- Les connexions d'une **goulotte** sont comptées dans l'**organe de connexion** qu'elle abrite,
  seul endroit où la constitution y admet une connexion.
- Le **catalogue des connecteurs** — références, nombre d'entrées, plage de section — est une
  **donnée produit** déclarée avec sa source, non une constante du code. Une section hors de toute
  référence du catalogue rend le connecteur **inconnu**, jamais une référence approchée.
- Les instructions de connexion nomment la gamme retenue.

## Capabilities

### New Capabilities

Aucune.

### Modified Capabilities

- `maquette/visualisation` : exigence nouvelle « Connecteurs d'une enveloppe de jonction » — la
  fiche d'une enveloppe de jonction porte les connecteurs dérivés, et aucune référence n'y est
  inventée.

## Impact

- `src/geometrie/graphe.js` — `cheminEntre` rend aussi les arêtes parcourues
- `src/geometrie/connecteurs.js` — nouveau : dérivation des connecteurs par enveloppe
- `src/ui/fiche-composant.js`, `src/main.js` — affichage dans la fiche
- `data/chantier.json` — catalogue `connecteurs`, avec sa source
- `src/donnees/validation.js` — contrôle du catalogue
- `data/apports/002-prises-de-courant.json`, `003-eclairage.json`, `005-automatisation-locale.json`
  — instructions de connexion
- `tests/connecteurs.test.js` — nouveau
- `src/version.js`, `dist/garage.html`

**Hors périmètre** : le report des connecteurs dans `dossier/fournitures.md` ; le serrage et le
repiquage aux bornes des appareils — socles, commandes, modules, tableau —, qui ne sont pas des
connexions en enveloppe de jonction.
