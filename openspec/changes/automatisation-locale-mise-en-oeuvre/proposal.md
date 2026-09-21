# Proposal

## Why

L'automatisation locale — allumage de l'éclairage intérieur à l'ouverture de la porte
sectionnelle, et commande murale de la porte — est **spécifiée et approuvée**, mais non
réalisée. Ses exigences vivent désormais dans la capacité
[`installation/automatisation`](../../specs/installation/automatisation/spec.md) ; ce qui
manque est la mise en œuvre : les données d'apport, les dérivations de conducteurs, la
machine à états et la recette.

C'est le seul chantier du projet dont le reste-à-faire soit du travail **constructible**.
Les autres réserves sont suspendues à des relevés et à des décisions du maître d'ouvrage, et
font l'objet du changement [`reserves-maitre-ouvrage`](../reserves-maitre-ouvrage/proposal.md).

Une dépendance bloquante subsiste : le **relevé du moteur** (T1), sans lequel US1 ne peut pas
être réalisée. Elle est considérablement réduite depuis la recherche documentaire du
2026-09-22 — le bouton externe est en TBTS 24 V (bornes 21 / 20) et l'état de porte s'obtient
par la platine UAP 1-HCP — mais trois constats restent, qu'aucune documentation ne remplace.

## What Changes

- Déclaration des nouveaux composants dans `data/apports/005-automatisation-locale.json` :
  BD-06, la descente CH-A1, le boîtier double CM-04 / CM-05 et les deux modules MC-01 / MC-02.
- Bascule de **CM-01** en `commutation: "entree-module"` : elle cesse de couper la phase pour
  adresser un ordre à MC-01.
- Rupture de segment sur **CH-L1** à y = 0,30 pour que BD-06 devienne un nœud du graphe —
  même tracé, même longueur, un segment de plus.
- Écriture de la **machine à états** en prose d'instruction, avec la transition qui porte tout
  le sens : une ouverture de porte survenant sur un allumage manuel n'arme aucun décompte.
- **BREAKING** pour le dimensionnement : CH-04 et CH-07 passent de six à sept conducteurs,
  CH-08 de trois à quatre, **CH-02 de six à dix et CH-05 de huit à neuf** — décompte révisé le
  2026-09-23, l'entrée de MC-02 commutant la phase (design D6). CH-02 et CH-05 passent
  en **IRL 25** (décision du maître d'ouvrage du 2026-09-23) ; la condition d'achat en IRL 20
  porte dès lors sur CH-04, CH-07 et CH-L1. Voir [design.md](design.md).
- Extension du socle : une commande `entree-module` nomme son **module**, et la dérivation fait
  passer la paire d'ordre et la sortie du module.
- Recette : essais des scénarios 1 à 10, dont le scénario 10 — consignation — entièrement
  nouveau.

## Capabilities

### New Capabilities

Aucune. Les exigences correspondantes sont déjà portées par les capacités existantes, versées
lors de la migration depuis Spec Kit.

### Modified Capabilities

Aucune. Ce changement **réalise** des exigences déjà écrites et approuvées, sans en modifier
le texte. La capacité [`installation/automatisation`](../../specs/installation/automatisation/spec.md)
décrit le comportement attendu ; [`installation/cheminements`](../../specs/installation/cheminements/spec.md)
porte la goulotte et le repérage des supports partagés ; [`installation/electricite`](../../specs/installation/electricite/spec.md)
porte la condition de remplissage du tronc.

*Convention de ce dépôt : rien n'étant posé à ce jour, les spécifications principales portent
la **conception approuvée** et non l'ouvrage constaté. Un changement qui se borne à réaliser
une exigence déjà écrite ne porte donc pas de delta, et déclare `skip_specs: true`.*

## Impact

- `data/apports/005-automatisation-locale.json` — nouveau fichier d'apport
- `data/apports/003-eclairage.json` — CM-01 et rupture de segment sur CH-L1
- `tests/apport-005.test.js` — dérivation des conducteurs et condition de remplissage
- `src/version.js`, `dist/garage.html` — reconstruction de la maquette
- Note de calcul et nomenclature de ce changement, écrites dans son propre répertoire
- `dossier/003-eclairage/note-de-calcul.md` (dossier) — décompte du tronc à mettre à jour
