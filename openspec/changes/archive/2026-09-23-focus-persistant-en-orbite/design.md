# Design

## Ce qui est en cause

Le canevas porte deux gestionnaires de `pointerup`, enregistrés dans cet ordre :

```
  vue.js      relacher(e)       -> oublie le pointeur, remet l'écart du pincement
  main.js     (anonyme)         -> désigne l'objet sous le pointeur, ou referme
```

`vue.js` sait déjà distinguer un glissé d'un clic : `aBouge` passe à vrai dès que le
pointeur a parcouru plus de trois pixels depuis l'enfoncement, et retombe à faux au
`pointerdown` suivant. Cette connaissance existe, mais elle ne sort pas :

```js
function objetSous(evenement, candidats) {
  if (aBouge) return null;   // <- le glissé devient indiscernable du vide
  ...
}
```

`main.js` reçoit donc `null` dans les deux cas et applique la même conclusion :

```js
} else {
  fiche.vider();             // -> surFermeture -> retour au centre
}
```

Le défaut n'est pas dans le calcul du focus, ni dans la transition, ni dans le cadrage.
Il est dans **une information perdue en chemin**.

## Où placer la distinction

| Option | Conséquence |
|---|---|
| A. `objetSous` renvoie un sentinelle (`'glisse'` vs `null`) | Change le contrat d'une fonction dont le nom promet un objet ou rien. Chaque appelant devra reconnaître une troisième valeur. |
| B. Exposer le fait brut depuis `vue` et laisser `main` décider | `vue` publie ce qu'elle observe ; `main` garde la politique. Aucune signature existante ne change. |
| C. Déplacer la sélection entière dans `vue.js` | Fait remonter dans la vue la connaissance des fiches, des circuits et du vocabulaire. Élargit la change bien au-delà du défaut. |

**Retenu : B.** `vue` est le seul endroit qui voie les `pointerdown`/`pointermove` ; elle
est donc le seul endroit qui puisse dire si un geste a glissé. Ce qu'on en fait — désigner,
refermer, ne rien faire — est une politique d'interface, et elle est déjà dans `main.js`.

```
  pointerdown --+
                |  vue.js observe
  pointermove --+  (seuil 3 px)
                |
  pointerup ----+--> aBouge ----> estUnClic()  ---> main.js décide
```

## La garde, et sa place dans le gestionnaire

Elle se pose **avant `rafraichir()`**, et non avant le seul `fiche.vider()`.

`rafraichir()` réapplique l'état de l'étape courante, ce qui **efface la mise en évidence
du circuit** posée par `souligner()`. Garder la garde plus bas conserverait la fiche mais
éteindrait le circuit surligné à chaque geste d'orbite — on aurait déplacé le défaut au
lieu de le corriger. La règle le dit explicitement : *ni sélection, ni fermeture de fiche,
ni remise à zéro de la mise en évidence*.

```js
vue.renderer.domElement.addEventListener('pointerup', (e) => {
  if (!vue.estUnClic()) return;   // un glissé n'a rien désigné
  ...
```

## Le seuil, et depuis quel point on le mesure

Trois pixels cumulés en `|dx| + |dy|`. La valeur ne change pas : un tremblement de main
reste un clic. Le **point de référence**, lui, était faux.

`aBouge` se calculait d'un `pointermove` au **suivant** :

```js
const dx = e.clientX - p.x;   // p.x a été réécrit au move précédent
if (Math.abs(dx) + Math.abs(dy) > 3) aBouge = true;
p.x = e.clientX;
```

Un geste rapide émet des `pointermove` largement au-dessus de trois pixels et déclenche.
Un geste **lent** en émet beaucoup, de un ou deux pixels chacun : aucun ne franchit le
seuil, et la somme n'est jamais faite. Un tour complet de la maquette mené doucement
restait donc un « clic ».

```
    origine                                     relâchement
       o---->o--->o---->o--->o---->o--->o---->o---->o
       |  2px 2px  2px  2px  2px  2px  2px  2px       |
       |                                              |
       +---------------- 16 px ----------------------+

    mesuré d'un pas au suivant : 2 px  -> "clic"     (faux)
    mesuré depuis l'origine    : 16 px -> glissé     (juste)
```

Le pointeur retient désormais deux points : son **origine**, figée au `pointerdown`, qui
sert la détection, et sa dernière position, qui sert les deltas de rotation. Les deux
usages sont distincts et n'ont aucune raison de partager un même champ.

`estUnClic()` conserve la même définition que la garde interne de `objetSous()` — un seul
fait, lu à deux endroits, jamais deux seuils qui pourraient diverger.

## Ce qui n'est pas touché

- Le **pincement** à deux doigts : chaque `pointerup` du geste a glissé, la garde les écarte.
- La **molette** : elle ne passe pas par `pointerup`, et `zoomer()` interrompt la transition
  sans changer la cible. Le focus y survivait déjà.
- Le **mode libre** : `focaliser()` y renonce en première ligne, et rien de cette change ne
  l'atteint.
