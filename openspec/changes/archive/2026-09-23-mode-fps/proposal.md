# Proposal

## Why

La caméra est un **orbite pur**. `src/scene/vue.js:48` fixe sa cible au centre du local et
n'en bouge jamais : seuls `theta`, `phi` et `rayon` varient. On tourne **autour** de la
maquette, on ne s'y **déplace** pas.

La conséquence n'est pas théorique. `rayonMin` vaut 0,80 m, donc la caméra peut entrer dans le
local — mais elle continue de regarder le centre. **On ne peut pas se tenir dans un angle et
regarder l'angle opposé.** L'exigence d'observation « sous n'importe quel angle, y compris
depuis l'intérieur, et atteindre le plafond, le sol et les angles sans zone aveugle » est
satisfaite à la lettre et manquée dans son objet : depuis l'intérieur, une seule direction de
regard est accessible.

C'est gênant précisément là où le projet en a le plus besoin — inspecter un tracé avant de
percer, se placer devant une boîte pour voir ce qui l'aborde, suivre un conduit de l'œil depuis
l'endroit où l'installateur se tiendra.

*Décision du maître d'ouvrage du 2026-09-23 : ajouter un mode FPS alternatif, au clavier.*

## What Changes

- Un **second mode de caméra**, alternatif et non substitutif. L'orbite actuel reste le mode
  par défaut et **le mode du chantier** : il est tactile, il marche avec des gants, et rien n'y
  est touché.
- En mode FPS, la position de la caméra est **libre** et le regard s'oriente indépendamment.
  Le glisser fait tourner la tête au lieu d'orbiter.
- **Déplacement au clavier**, lu sur `event.code` et non `event.key` :

  | Touche physique | Effet | Étiquette AZERTY |
  |---|---|---|
  | `KeyW` / `KeyS` | avancer / reculer | Z / S |
  | `KeyA` / `KeyD` | pas à gauche / à droite | Q / D |
  | `Space` | monter | Espace |
  | `ShiftLeft` | descendre | Maj |

  *Lire les positions physiques et non les caractères est ce qui rend ZQSD automatique sur un
  clavier français, sans réglage ni détection de disposition.*

- **Vol libre, sans collision.** Se déplacer *autour* de la maquette suppose d'en sortir et d'y
  rentrer ; un mode qui buterait sur les parois interdirait ce qui est demandé.
- **BREAKING** pour l'exigence *Deux usages, une interface*, qui affirme aujourd'hui sans
  exception que les interactions fonctionnent « aussi bien au toucher qu'à la souris et au
  clavier ». Le mode FPS est **au clavier seul**, et ce sera écrit : sur un chantier, avec des
  gants, on ne pilote pas un vol libre — on tourne autour d'un objet et on avance d'étape.
  *Décision du maître d'ouvrage.*

## Capabilities

### New Capabilities

Aucune.

### Modified Capabilities

- `maquette/visualisation` : l'observation sous tout angle gagne le déplacement libre, qui est
  ce qui la rend vraie depuis l'intérieur ; et *Deux usages, une interface* reçoit son exception
  déclarée pour le mode FPS.

## Impact

- `src/scene/vue.js` — la caméra n'a qu'un modèle ; il en faut deux, et un moyen d'en changer
- `src/ui/controles.js` — **`PageUp` et `PageDown` sont déjà prises** par la navigation d'étapes,
  comme `←` `→` `Home` `End`. Les touches du mode FPS les évitent toutes
- `data/presentation.json` — vitesses de déplacement et de rotation, bornes du vol ; aucune
  n'a sa place dans le code
- `index.html` et la feuille de style — l'affordance de bascule entre les deux modes
- `tests/scene.test.js` et un fichier neuf pour le mode

**Hors périmètre.** Un équivalent tactile du mode FPS : *décidé au clavier seul*. Et la
mémorisation de la position de caméra d'une session à l'autre — le lecteur mémorise un rang
d'étape, pas un point de vue, et rien ici ne le change.
