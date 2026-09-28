# Modèle de données — `006-rangement`

**Fonctionnalité** : `006-rangement` | **Date** : 2026-09-27

Ce document fixe la forme des données de rangement **avant** leur écriture. Il ne décrit pas le
rendu : il décrit ce que l'on peut affirmer, et la distinction entre ce qui est **déclaré** et ce
qui est **dessiné** est le point central de ce document.

## La difficulté que la donnée doit porter

Un élément de rangement porte deux informations qui ne coïncident pas :

- ce que **la source dit** de lui — et cette parole peut se contredire, sur un axe ou sur un
  point qui ne touche pas l'encombrement ;
- ce que **la maquette dessine** — et une figure doit avoir des dimensions.

Pour le rack, les deux divergent : sa déclaration constructeur est contradictoire sur quatre
points, et sa hauteur de montage est inconnue, ce qui rend tout dessin à partir d'elle
impossible. Fusionner les deux en une seule valeur — en dessinant « quand même » 55 × 144 × 55 —
reviendrait à inventer une hauteur et à arbitrer une largeur que `research.md` R1 interdit
d'arbitrer.

La donnée distingue donc deux blocs, et **aucun des deux n'est facultatif par commodité** :
`cotes` dit ce que la source affirme, `gabarit` dit ce qui est dessiné et sur quelle base.

## `cotes` — ce que la source affirme

Chaque axe ou caractéristique est un objet de la forme :

```json
{
  "valeur": 1.44,
  "unite": "m",
  "origine": "declaration-fabricant",
  "etat": "contradictoire",
  "reserves": [
    "« Item Dimensions D x W x H  55D x 144W x 55H centimetres » contre des barres réglables de 81,3 à 121,9 cm ; la page ne rattache jamais la « length » en prose à un axe."
  ]
}
```

### `origine` — d'où vient la valeur

| Valeur | Signification |
|---|---|
| `releve` | Relevé sur place par le maître d'ouvrage. |
| `declaration-fabricant` | Figure dans un document constructeur ou commercial, cité. |
| `gabarit-catalogue` | Convention de représentation, sans document produit derrière. |

`origine` répond à « qui l'a dit », `etat` répond à « peut-on s'y fier ». Les deux sont
indépendants : une valeur peut être bien attribuée et litigieuse — c'est le cas du rack.

### `etat` — dans quel état elle se trouve

| Valeur | Signification |
|---|---|
| `releve` | Établie et exploitable pour le dessin. |
| `inconnu` | Jamais déterminée. `valeur` vaut `null`. |
| `contradictoire` | Déclarée, mais la source se contredit. `valeur` porte le terme retenu **pour être dessiné**, jamais comme vérité. |

**`inconnu` et `contradictoire` ne se confondent pas.** Une cote inconnue n'a pas de valeur à
afficher ; une cote contradictoire en a une, et cette valeur affiche en même temps qu'elle est
en conflit. Traiter l'une comme l'autre induirait en erreur dans les deux sens : on afficherait un
volume contesté comme s'il était acquis, ou on effacerait un conflit réel sous un « non mesuré ».

### `reserves`

Les réserves ne sont pas des notes libres : elles portent **les deux termes du conflit**, et la
référence de la source. C'est ce qui permet d'afficher la contradiction au lieu de la résoudre.

## `gabarit` — ce qui est dessiné

```json
{
  "origine": "gabarit-catalogue",
  "mention": "conventionnel — non relevé",
  "volume": { "min": { "x": 0, "y": 2.08, "z": 0.8 }, "max": { "x": 0.55, "y": 3.52, "z": 2.3 } }
}
```

**Règle unique : le volume dessiné vient toujours de `gabarit`, jamais de `cotes`.** Ce n'est une
redondance que lorsque `cotes` porte lui-même l'origine `gabarit-catalogue` — c'est-à-dire
exactement le cas où il n'y a rien à arbitrer. Quand les deux divergent, le `gabarit` est un
**choix de représentation déclaré**, et sa `mention` l'affiche partout.

Le gabarit ne remplace pas la contradiction : `cotes` reste déclaré, ses `reserves` restent
présentes, et la fiche présente les deux.

## L'élément de rangement

```json
{
  "id": "rg-01",
  "reference": "RG-01",
  "libelle": "Rack mural pliable à roues",
  "paroi": "ouest",
  "cotes": { "largeur": {}, "profondeur": {}, "hauteur": {},
             "hauteurMontage": {}, "charge": {}, "nombreNiveaux": {} },
  "gabarit": {},
  "fabricant": "VEVOR",
  "referenceProduit": "TC0513",
  "asin": "B0DPM1TXK6",
  "source": "Fiche Amazon.fr, consultée le 2026-09-27"
}
```

La forme reste proche de celle d'un composant — `id`, `paroi`, `libelle`, `volume` — pour que
`cadrage.js` et `fiche-composant.js` n'aient pas une deuxième forme à traiter. Ce que le rangement
ajoute est `cotes`, `gabarit` et l'identification produit ; il n'ajoute ni `genre`, ni étape.

## Les six axes et caractéristiques du rack

| Cote | Valeur déclarée | Origine | État |
|---|---|---|---|
| `largeur` | 1,44 m | `declaration-fabricant` | `contradictoire` |
| `profondeur` | 0,55 m | `declaration-fabricant` | `contradictoire` |
| `hauteur` | 0,55 m | `declaration-fabricant` | `contradictoire` |
| `hauteurMontage` | `null` | — | `inconnu` |
| `charge` | 136 kg | `declaration-fabricant` | `contradictoire` |
| `nombreNiveaux` | 4 | `declaration-fabricant` | `contradictoire` |

**Aucun axe du rack n'est établi, et `largeur` et `profondeur` le sont doublement** : elles ne
sont pas seulement en conflit avec la plage de réglage, elles ne sont pas rattachables à un axe
puisque la page ne dit jamais lequel. La profondeur `55D` est donc déclarée contradictoire, et non
« au moins correcte ».

## Ce que ce modèle ne contient pas

- **Aucun catalogue `types-rangement.json`.** Un catalogue dont le seul consommateur serait deux
  éléments serait une couche sans usage. La règle « le volume déclaré prime sur le gabarit de type »
  couvre déjà la précédence ; si le catalogue grandit, c'est ce changement qu'il faudra revoir.
- **Aucune entrée de séquence.** Le rangement n'a ni `rangsApparition`, ni étape, et n'entre pas
  dans `GENRES_POSABLES`.
- **Aucun contrôle de collision.** Le rangement ne heurte ni les composants, ni les obstacles, ni
  les cheminements.
