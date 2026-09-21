# Proposal

## Why

Quatre fonctionnalités sur cinq sont conçues et planifiées, mais aucune n'est close. Ce qui
leur reste tient en un même genre de travail : des **valeurs normatives à lire sur le texte de
la NF C 15-100**, des **décisions que seul le maître d'ouvrage peut arrêter**, des **cotes à
relever sur place**, des **fiches produit à obtenir**, et des **essais à conduire au chantier**.

Aucune de ces réserves n'est du code ni du document à rédiger : elles sont suspendues au monde
réel, et l'assistant ne peut ni les deviner ni les renseigner de mémoire — le Principe I le
proscrit explicitement, et une règle citée sans référence n'est pas opposable.

Les rassembler en un seul changement les rend dénombrables. Dispersées dans cinq `tasks.md`,
elles se lisaient comme des lignes isolées ; réunies, elles se lisent pour ce qu'elles sont :
**la liste de ce qui empêche le chantier de commencer**.

Trois d'entre elles sont des **verrous** au sens strict — rien ne peut être posé tant qu'elles
tiennent :

1. la voie de détection du courant continu 6 mA (aucun type de différentiel n'en dispense) ;
2. le sort de l'interrupteur différentiel de type AC en amont des prises et de l'éclairage ;
3. le diamètre intérieur réel de l'IRL 20 du tronc, à relever **avant de commander le conduit**.

## What Changes

Rien n'est construit ni modifié par ce changement : il **constate, décide et consigne**. Ses
sorties alimenteront ensuite les spécifications et les données.

- Confirmation sur le texte de la NF C 15-100 des valeurs normatives aujourd'hui portées de
  mémoire ou par des sources secondaires, dont la clause 7-722 et la liste des montages admis
  pour un point de charge.
- Arrêt des décisions ouvertes : type du différentiel de la borne, voie du dispositif 6 mA,
  sort de l'interrupteur de type AC, liaison équipotentielle du tablier.
- Relevés sur site : diamètre intérieur du conduit retenu, capacité du bornier et modules
  libres au tableau, volume de BD-01 sur cote produit, indice de protection de BR-01.
- Liste nominative des usages tenus pour incompatibles avec une charge en cours, portée à la
  connaissance des occupants.
- Essais de recette des quatre fonctionnalités, dont l'essai de dépassement — **qui coupe le
  logement** et DOIT être annoncé aux occupants avant d'être conduit.

## Capabilities

### New Capabilities

Aucune.

### Modified Capabilities

Aucune à ce stade. Les exigences concernées existent déjà et portent leur réserve en toutes
lettres — *« décision du maître d'ouvrage, non tranchée »*, *« valeur à établir »*. Ce
changement **lève** ces réserves ; il ne réécrit pas les exigences.

Lorsqu'une décision sera arrêtée, elle pourra appeler un changement distinct porteur d'un
delta — par exemple si le type AC est conservé, ou si aucun conduit disponible n'atteint
14,69 mm intérieurs et que CH-05 repasse en IRL 25.

## Impact

- **Bloque tout le chantier.** Le Principe V interdit tout percement, tirage et raccordement
  avant que la note de calcul soit établie et validée, et elle ne peut l'être sans ces valeurs.
- Notes de calcul du dossier : `dossier/002-prises-de-courant/note-de-calcul.md`,
  `dossier/003-eclairage/note-de-calcul.md`, `dossier/004-borne-recharge/contracts/note-de-calcul.md`
- `data/apports/004-borne-recharge.json` — `indiceProtection` de BR-01, une fois le produit choisi
- Dossier final — restriction d'usage, qualification IRVE, mentions de consignation
