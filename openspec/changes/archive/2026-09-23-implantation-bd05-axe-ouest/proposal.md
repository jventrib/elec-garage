# Proposal

## Why

Décision du maître d'ouvrage du 2026-09-23 : **BD-05 doit se trouver dans l'axe ouest de
BD-01**, c'est-à-dire sur la ligne y = 2,60 que suit déjà le tronc depuis le tableau.

Elle est aujourd'hui à y = 3,00, et c'est ce décalage qui oblige `CH-07` à un **décrochement de
0,40 m** avant de filer vers l'ouest. Le mettre dans l'axe supprime le décrochement, un coude et
0,40 m de conduit.

**Mais BD-05 est un nœud à trois branches, et trois conduits doivent partir dans trois
directions.** `CH-07` arrive de l'est, `CH-L2` monte vers le nord, `CH-08` dessert PC-05. Le
décrochement était précisément ce qui les faisait diverger : une fois BD-05 sur l'axe, PC-05 ne
peut plus être au nord — `CH-08` se superposerait à `CH-L2` — ni au sud, où le boîtier mordrait
dans le rail. Il ne reste que l'**ouest**.

*PC-05 passe donc à 0,15 m à l'ouest de BD-05, sur décision du maître d'ouvrage du 2026-09-23.*

## What Changes

```
   BD-05 (2,70 ; 2,60)  sur l'axe ouest de BD-01
     |
     +-- CH-07  est    2,90 m, UN SEUL SEGMENT   (etait 3,30 m en deux)
     +-- CH-L2  nord   1,45 m                    (etait 1,05 m)
     +-- CH-08  ouest  0,15 m -> PC-05 (2,55 ; 2,60)
```

| | avant | après |
|---|---|---|
| BD-05 | (2,70 ; 3,00 ; 2,75) | **(2,70 ; 2,60 ; 2,75)** |
| PC-05 | (2,70 ; 2,70 ; 2,75) | **(2,55 ; 2,60 ; 2,75)** |
| CH-07 | 2 segments, 3,30 m | **1 segment, 2,90 m** |
| CH-08 | 0,30 m vers le sud | **0,15 m vers l'ouest** |
| CH-L2 | 1,05 m | **1,45 m** |
| PC-05 depuis le tableau | 6,75 m | **6,20 m** |
| métré 2,5 mm² | 43,56 m | **41,91 m** |
| coudes du projet | 9 | **8** |

Le chemin le plus long reste **PC-04 à 8,65 m** : la chute de tension ne bouge pas.

**BREAKING pour le dégagement de PC-05.** Le socle descend de y = 2,70 à 2,60, entraîné par
l'axe. Son boîtier passe de 2,655–2,745 à **2,555–2,645**, et le rail s'arrête à y = 2,50 :

```
   marge du socle au rail :  0,155 m  ->  0,055 m
```

**Trois fois moins**, et contre un obstacle **relevé** — le rail porte un `volume` et non un
majorant, et il monte jusqu'au plafond. La marge reste positive et démontrée, mais elle passe
sous les six centimètres, et l'exigence qui l'énonce porte le chiffre.

## Capabilities

### New Capabilities

Aucune.

### Modified Capabilities

- `installation/points-utilisation` : l'exigence « Position de PC-05 et dégagement du tablier »
  écrit noir sur blanc que « PC-05 est à y = 2,70 m » et que la marge vaut « 0,155 m pour le
  socle et 0,190 m pour le conduit ». Les trois chiffres changent.

## Impact

**La géométrie a été vérifiée à vide avant d'être proposée** : les vingt-trois règles ne rendent
aucun défaut.

- `data/apports/002-prises-de-courant.json` — BD-05, PC-05, CH-07, CH-08
- `data/apports/003-eclairage.json` — CH-L2, qui part de BD-05
- `dossier/002-prises-de-courant/` — implantation, note de calcul, data-model, quickstart
- `dossier/003-eclairage/implantation.md` — le parcours commun et son décrochement
- Instructions de montage qui nomment le décrochement de 0,40 m
- `tests/` — longueurs, métrés et décompte des coudes

**Une limite que ce changement ne lève pas, et qu'il rend plus gênante.** La marge de 0,055 m
est calculée **à la main** : `collision.js` n'oppose que les cheminements aux obstacles, jamais
les composants. Aucun test n'échouera si ce chiffre devient négatif. Le contrôle des composants
contre les obstacles relève d'un changement distinct, et il concerne les onze socles du projet,
pas seulement PC-05.
