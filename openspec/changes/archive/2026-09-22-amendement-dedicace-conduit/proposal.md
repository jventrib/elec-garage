# Proposal

## Why

Le Principe IV énonce que la dédicace du circuit de recharge **s'étend au conduit** :

> La dédicace s'étend au **conduit**. En pose apparente, un conduit peut être partagé alors
> même que les circuits ne le sont pas : la ligne de la borne DOIT emprunter son propre
> conduit, sur tout son parcours, sans cohabiter avec un autre circuit.

**Cette règle n'est rattachée à aucune clause.** Les « trois conséquences » qui la suivent en
découlent, elles ne la fondent pas. Or le Principe I dit qu'« une règle citée sans référence
n'est pas opposable et DOIT être vérifiée avant d'être appliquée ».

C'est le même défaut de forme que la **v1.12.0** a corrigé sur l'énumération des montages
6 mA : « Le défaut n'est pas dans l'exigence, qui reste entière […] Il est dans la **forme** —
une liste fermée, sans source, appliquée comme si elle était le texte. »

**Et le tracé arrêté la contredit déjà.** Entre la fin de `CH-B1` à z = 2,60 et le départ de
`CH-B2` à z = 2,64, la ligne de la borne franchit **0,04 m sans aucun conduit** : le volume de
la goulotte GL-01 assure tacitement le passage. La règle décrivait une intention, pas les cotes.

La dédicace du **circuit** — protections propres, aucun autre point raccordé — n'est pas en
cause et reste entière. C'est son extension au **contenant** qui n'a pas de fondement écrit.

## What Changes

- **BREAKING** — La dédicace cesse de s'étendre au conduit. Le **câble** de la borne, sous
  enveloppe propre, PEUT cohabiter avec d'autres circuits dans une goulotte. *Décision du
  maître d'ouvrage.*
- La dédicace du **circuit** est réaffirmée sans changement : protection contre les
  surintensités propre, dispositif différentiel propre, aucun autre point d'utilisation.
- L'exigence porte désormais sur la **forme du conducteur** — un câble à enveloppe propre, et
  non des conducteurs isolés nus — là où elle portait sur l'exclusivité du contenant.
- Les **trois conséquences** que le principe tirait de la dédicace du conduit sont reprises une
  à une : le facteur de groupement redevient exigible là où la ligne cohabite ; le calibre
  propre et les parcours parallèles ne valent plus que là où elle reste en conduit dédié.
- **Deux valeurs normatives à confirmer** rejoignent la tâche 1.6 de `reserves-maitre-ouvrage` :
  la clause qui fonde (ou non) une exigence de contenant dédié pour un point de charge, et la
  catégorie de pose d'un câble en goulotte, qui décide de son courant admissible.

## Capabilities

### New Capabilities

Aucune.

### Modified Capabilities

- `installation/electricite` : l'exigence « Circuit de la borne entièrement dédié » porte
  aujourd'hui la dédicace du conduit et en tire l'absence de facteur de groupement. Les deux
  changent.

## Impact

- `openspec/constitution.md` — Principe IV, avec son rapport d'impact et sa montée de version.
  **C'est un acte du maître d'ouvrage** : la tâche le prépare, elle ne le rend pas à sa place.
- `data/apports/004-borne-recharge.json` — `CH-B1`, 1,10 m d'IRL 25 parallèle à la goulotte,
  disparaît au profit du câble dans le profilé
- Débloque `typologie-enveloppes-cheminement`, dont le dernier défaut de validation est
  précisément la superposition de `CH-B1` et de `GL-01` sur 0,97 m
- `tests/apport-004.test.js`, `apport-002.test.js`, `apport-003.test.js` — les assertions qui
  énoncent que la borne est seule dans son conduit

**Hors périmètre** : le reste du parcours de la borne. `CH-B2` et `CH-B3` longent la paroi est
puis la paroi nord, **là où il n'y a pas de goulotte**, et restent en conduit dédié. La
réservation de place de la bande de 0,25 m au-dessus de la porte de service, la condition d'axe
de FR-036 et la traversée de BD-01 sont inchangées.
