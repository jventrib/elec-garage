# Proposal

## Why

La caméra orbite autour d'une **cible figée** au centre du local — `vue.js:48` la pose une fois
et ne la bouge jamais. Sélectionner un objet ouvre sa fiche et ne déplace rien : pour regarder
une boîte de près, il faut zoomer à la main, tourner à la main, et deviner de quel côté elle
s'ouvre.

C'est laborieux là où ça compte le plus — inspecter une enveloppe avant de percer, voir de quel
côté un conduit l'aborde, vérifier qu'un socle dégage bien ce qu'on croit.

*Décision du maître d'ouvrage du 2026-09-23 : la sélection recentre l'orbite sur l'objet, avec
un cadrage automatique et une transition animée.*

## What Changes

- **Sélectionner un objet recentre l'orbite dessus.** Cela vaut pour **tout ce qui est
  sélectionnable** — composant, cheminement, traversée, obstacle — et non les seuls composants.
  *Décision du maître d'ouvrage.*
- **Le point de vue se dérive, il ne se choisit pas.** Un composant déclare sa paroi et sa face ;
  la caméra se place sur la normale sortante de cette face :

  | paroi | face intérieure → caméra | face extérieure → caméra |
  |---|---|---|
  | est / ouest / nord / sud | dans le local | dehors |
  | plafond | en dessous | — |

- **La distance se dérive de l'encombrement** de l'objet — gabarit pour un composant, étendue du
  volume pour un obstacle, longueur du parcours pour un cheminement —, bornée par `rayonMin` et
  `rayonMax` qui existent déjà.
- **Fermer la fiche ramène l'orbite au centre**, de la même façon animée.
- **Les transitions sont animées**, cible et pose ensemble. La boucle de rendu porte déjà
  `aChaqueImage(secondes)`, ajouté pour le mode de déplacement libre.
- **En mode déplacement libre, la sélection ne déplace rien.** La fiche s'ouvre, la caméra reste
  où elle est. *Décision du maître d'ouvrage* : téléporter quelqu'un pendant qu'il vole serait
  désorientant, et les deux modes viennent d'être déclarés distincts.

**Un cas qui n'est pas une exception mais une donnée** : **quatre obstacles sur sept ne portent
aucun volume** — débattement du vantail, tablier fermé, gabarit de manœuvre, débattement des
portières. Il n'y a rien à cadrer. Leur fiche s'ouvre et la caméra ne bouge pas, ce qui est
exactement ce que leur absence de cote signifie. Un cadrage inventé leur donnerait une étendue
qu'ils n'ont pas.

## Capabilities

### New Capabilities

Aucune.

### Modified Capabilities

- `maquette/visualisation` : l'identité consultable d'un objet gagne le recentrage de la vue sur
  lui ; et l'observation sous tout angle, déjà étendue par le mode libre, se précise sur ce que
  la sélection fait de la caméra.

## Impact

- `src/scene/vue.js` — la cible d'orbite devient mobile, et une interpolation s'ajoute à la
  boucle
- `src/main.js` — le gestionnaire de `pointerup` déclenche le focus ; la fermeture de la fiche
  le défait
- `src/ui/fiche-composant.js` — `vider()` doit prévenir qu'on ferme, ce qu'il ne fait pas
- `data/presentation.json` — durée et forme de la transition, marge de cadrage ; aucune n'a sa
  place dans le code
- `tests/` — la dérivation du point de vue, le cadrage, et ce que le focus ne doit pas casser

**Hors périmètre.** Le mode déplacement libre, qui ignore la sélection. Et la mémorisation d'un
objet focalisé d'une session à l'autre : le lecteur mémorise un rang d'étape, pas un point de
vue.

**Dépendance.** Ce changement s'appuie sur `aChaqueImage`, introduit par `mode-fps`, et touche la
même caméra. `mode-fps` doit être archivé avant, sous peine de deux changements ouverts sur
`vue.js`.
