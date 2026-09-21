# Proposal

## Why

Le focus sur un objet, livré le 2026-09-23, se perd au premier geste d'orbite. C'est
l'inverse de ce à quoi il sert : on recentre la vue sur une enveloppe précisément pour
en faire le tour, et le tour de l'objet le fait sortir de l'objet.

La cause est une confusion dans la désignation. `objetSous()` renvoie `null` dans deux
situations que rien ne distingue ensuite : **le clic qui n'a rien touché** et **le geste
qui était une rotation**. Le gestionnaire de `pointerup` lit ce `null` comme « l'utilisateur
a désigné le vide », referme la fiche, et le crochet de fermeture ramène l'orbite au centre.

La règle en vigueur ne tranche pas ce cas : elle nomme la fermeture de la fiche comme ce
qui ramène au centre, et garantit le zoom pendant le focus — mais elle est muette sur la
rotation. Le silence a été comblé par un défaut d'implémentation plutôt que par une décision.

## What Changes

- Un `pointerup` qui termine un **glissé** ne vaut plus désignation : ni sélection, ni
  désélection, ni remise à zéro de la mise en évidence de circuit. La vue a tourné,
  rien d'autre.
- Un `pointerup` sans glissé et sans objet sous le pointeur reste une désignation du
  vide : il referme la fiche et ramène l'orbite au centre. C'est inchangé.
- La règle de focus énonce désormais les **deux seules sorties** : le clic franc hors
  objet, et la fermeture de la fiche.

## Capabilities

### New Capabilities

Aucune.

### Modified Capabilities

- `maquette/visualisation`: la règle « La sélection recentre l'orbite sur l'objet » énumère
  ce qui libère le focus, et pose qu'un geste de rotation ne le libère pas.

## Impact

- `src/scene/vue.js` : le fait qu'un geste ait glissé devient lisible de l'extérieur.
  Aujourd'hui `aBouge` n'est consommé qu'en interne par `objetSous()`, qui le fond dans
  son `null`.
- `src/main.js` : le gestionnaire de `pointerup` sur le canevas.
- Tests : la distinction glissé / clic franc n'est couverte par aucun test ; c'est ce qui
  a laissé passer le défaut.
- Aucune donnée, aucune cote, aucun calcul touché.
