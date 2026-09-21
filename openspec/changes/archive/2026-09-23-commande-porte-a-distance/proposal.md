# Proposal

## Why

La capacité [`installation/automatisation`](../../specs/installation/automatisation/spec.md)
interdit toute commande de la porte **hors de sa vue** et toute dépendance à un **service
distant**. Or le câblage arrêté — le contact sec de MC-02 sur les bornes 21 / 20 du moteur —
rend techniquement possible la commande de la porte par le réseau.

**Décision du maître d'ouvrage du 2026-09-23** : la commande de la porte à distance est
**permise et voulue**, y compris depuis Internet, par le **cloud du fabricant** du module.
*Motif* : l'accessibilité à distance est précieuse, et il juge le risque d'écrasement
exagéré. *La décision va contre l'avis du dossier*, qui tenait une porte motorisée mise en
mouvement hors de la vue de l'opérateur pour un risque d'écrasement ; elle est consignée
comme telle.

L'alternative étudiée — bouton CM-05 câblé en direct sur le moteur, en TBTS, sans module —
est **abandonnée**. Le câblage ne change pas.

Deux exigences approuvées changent de texte : ce changement porte donc des **deltas**. Le
changement en cours [`automatisation-locale-mise-en-oeuvre`](../automatisation-locale-mise-en-oeuvre/proposal.md)
déclare `skip_specs` et ne peut pas les porter.

## What Changes

- **BREAKING** — L'exigence « Aucune commande de porte hors de sa vue » devient « Commande de
  la porte : par une personne, jamais par un automatisme ». La commande à distance de la porte
  **est admise**, par l'application du fabricant de MC-02, sur place ou depuis Internet.
- **Inchangé** : l'ouverture de la porte n'est **jamais** déclenchée par un automatisme, et
  l'éclairage n'agit jamais sur la porte.
- **Ajouté** : l'utilisateur à distance DOIT connaître l'**état réel** de la porte — ouverte
  ou fermée — dans la même application. *Qui commande une porte sans la voir doit savoir dans
  quel état il la laisse.* C'est le contact « Ouvert » de la platine UAP 1-HCP, déjà prévu.
- **BREAKING** — L'exigence « Fonctionnement sans réseau local » est assouplie : un service
  distant est admis **pour la seule commande à distance de la porte** et la remontée de son
  état. La commande **manuelle** de l'éclairage et de la porte reste entièrement
  fonctionnelle sans réseau ni Internet ; l'éclairage et son automatisme ne dépendent
  d'aucun service distant.
- Le **Purpose** de la capacité cesse d'énoncer « aucun service distant, aucune commande hors
  de la vue de la porte ».
- **Réserve ouverte, non bloquante** : la commande hors vue d'une porte motorisée peut relever
  d'exigences propres aux portes motorisées, à identifier **sur le texte et non de mémoire** ;
  le niveau de protection offert par le moteur ProCom en cas de mise en mouvement sans
  opérateur est à constater au relevé du moteur.

Les autres exigences de la capacité — consignation, sécurités du moteur, mode dégradé, état au
retour du courant — sont **inchangées**.

## Capabilities

### New Capabilities

Aucune.

### Modified Capabilities

- `installation/automatisation` : « Aucune commande de porte hors de sa vue » est renommée et
  réécrite — commande à distance admise, jamais d'automatisme, état réel remonté à
  l'utilisateur à distance. « Fonctionnement sans réseau local » admet un service distant pour
  la seule commande à distance de la porte.

## Impact

- `openspec/specs/installation/automatisation/spec.md` — deux exigences et le Purpose
- `data/apports/005-automatisation-locale.json` — instructions des étapes `au-essai-reseau`
  (inversé), `au-essai-porte` et `au-levee` (réserve nouvelle : la porte peut se mettre en
  mouvement sans personne sur place). **Aucune donnée de géométrie, de conducteur ni de
  décompte ne change**
- `tests/apport-005.test.js` — assertions sur les instructions, s'il y a lieu
- `dossier/005-automatisation-locale/notice.md`, `quickstart.md` (scénarios 8 et 9),
  `research.md` (R8, note datée sans réécriture de l'historique)
- Changement `automatisation-locale-mise-en-oeuvre` — tâche 3.7, `design.md` et
  `nomenclature.md` renvoient à ce changement ; MC-02 doit offrir la commande par le cloud du
  fabricant **et** la remontée d'état
- Changement `reserves-maitre-ouvrage` — la réserve ouverte sur la commande hors vue y est
  portée
- `src/version.js`, `dist/garage.html` — reconstruction, les instructions étant dans le livrable
