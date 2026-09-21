# Implantation de la borne de recharge

**Fonctionnalité**: `004-borne-recharge` | **Date**: 2026-09-22

## 1. Le point de charge

| Repère | Type | Paroi | Face | Position | Hauteur d'axe |
|--------|------|-------|------|----------|---------------|
| BR-01 | borne de recharge | nord | intérieur | 2,80 / 5,60 / **1,00** | 1,00 m |

x = 2,80 m est l'axe médian du local, et la fenêtre nord étant centrée, BR-01 est centrée sous
elle (FR-003).

**Pourquoi 1,00 m et non 1,20.** FR-004 exige que **tout** tienne sous l'allège, à 1,50 m. Un axe
à 1,00 m laisse 0,50 m au-dessus, donc admet un coffret jusqu'à **1,00 m de haut** : la question
est retirée pour tout produit réaliste, au lieu d'être suspendue à sa cote. À 1,20 m il ne
resterait que 0,30 m, et le parcours sous l'allège ne passerait plus (R6, R7).

La **plage normative** de hauteur d'axe reste à confirmer sur le texte (FR-005). 1,00 m est une
décision d'implantation, pas une valeur lue.

## 2. Le tracé, en trois conduits

| Conduit | De | À | Parcours | Longueur |
|---------|----|----|----------|----------|
| CH-B1 | TD-01 | **dans BD-02** | 0,05 m d'écart au nord, puis montée de 1,10 m | 1,15 m |
| CH-B2 | **dans BD-02** | **dans BD-01** | antenne paroi est à z = 2,64 | 1,85 m |
| CH-B3 | **dans BD-01** | BR-01 | 3,00 m jusqu'à l'angle, 1,10 m sur la paroi nord, descente de 1,24 m en x = 4,50, 1,70 m sous l'allège, descente de 0,40 m | 7,44 m |

**Métré de conduit : 10,44 m**, en **huit** segments. **Chemin électrique : 10,48 m**, la
différence étant parcourue *dans* les deux boîtes, où il n'y a pas de conduit mais des
conducteurs.

**Aucun mètre n'est partagé**, et **aucune traversée de paroi** : c'est la seule ligne du projet
entièrement intérieure et entièrement en propre. Le Principe IV l'exige, et c'est aussi ce qui
dispense ce circuit de tout facteur de groupement.

**Aucune boîte propre non plus.** Un circuit dédié à un seul point d'utilisation est un chemin
unique du tableau à la borne, sans jonction.

## 3. Les deux franchissements, et pourquoi ils passent par une boîte

À **z = 2,60 m**, la paroi est est occupée **sans interruption de y = 0 à y = 5,45** : CH-L1 de
l'éclairage vers le sud, CH-02 puis CH-03 des prises vers le nord. Et en **y = 2,60**, CH-04 monte
de BD-01 au plafond et occupe toute la bande au-dessus de la boîte.

Toute montée depuis le tableau doit franchir la première ; tout parcours horizontal doit franchir
la seconde. **Le seul endroit où l'on franchit légitimement un conduit est l'intérieur d'une
boîte**, et c'est là que le tracé passe.

| Point | Boîte | Écart au centre | Ce qui s'y franchit |
|-------|-------|-----------------|---------------------|
| (5,60 ; **0,75** ; 2,60) | BD-02 | 0,05 m en y | l'antenne du tronc partagé |
| (5,60 ; 2,60 ; **2,64**) | BD-01 | 0,04 m en z | CH-04, la montée vers le plafond |

Ce ne sont **pas des jonctions** : les conducteurs y transitent sans être coupés, première des
quatre conditions du Principe IV amendé (constitution v1.11.0). Aucune connexion de la borne n'est
faite dans une boîte partagée.

### Les deux boîtes changent de modèle

| Boîte | Entrées avant | Après | Côté minimal | Circuits |
|-------|---------------|-------|--------------|----------|
| BD-02 | 3 | **5** | **0,132 m** | 3 |
| BD-01 | 4 + 1 traversée en fond | **6** + la traversée | **0,112 m** | 3 |

Les deux cotes sont **dérivées, non choisies au catalogue** :

```
|axe − 2,60| + d/2 ≤ h/2      →  BD-01 : h ≥ 0,112 m
|0,75 − 0,70| + d/2 ≤ h/2     →  BD-02 : h ≥ 0,132 m      avec d = 0,032 m
```

Le `d` retenu est le **majorant** de diamètre, l'IRL 32 — le calibre a depuis été arrêté à l'IRL 25, qui satisfait ces cotes avec de la marge : c'est le plus gros calibre que la bande
contrainte admette, et dimensionner les boîtes dessus les rend valables **quel que soit** le
calibre que la note de calcul retiendra. Les boîtes peuvent donc être achetées avant que la
section soit arrêtée — ce qui est nécessaire, puisqu'elles sont posées par `002`.

**Un nombre d'entrées n'est pas un volume** (FR-038). Ces cotes sont des encombrements ; le
**volume intérieur** doit être établi séparément pour la totalité de ce que BD-01 porte.

## 4. La bande contrainte de la porte de service

La bande utile fait **0,25 m**, entre le linteau à 2,50 m et le plafond à 2,75 m. Le tronc partagé
en IRL 25 en occupe **2,5875 à 2,6125**. La condition de FR-036 s'écrit :

```
2,6125 + 0,010 + d/2  ≤  axe  ≤  2,750 − 0,010 − d/2
```

soit **2,635 à 2,727 m** en IRL 25 et **2,639 à 2,724 m** en IRL 32. **L'axe retenu est 2,64 m** :
le plus bas de l'intervalle, parce que plus la ligne monte, plus les deux boîtes qu'elle traverse
doivent être grandes.

**La bande porte désormais exactement deux conduits, et il n'y reste pas la place d'un
troisième.** La réservation de FR-047 et FR-063 de `002` est honorée et refermée.

## 5. Rejoindre la borne sans traverser la fenêtre

La fenêtre nord occupe x 1,30 à 4,30 et z **1,50 à 2,03**. Deux contraintes se croisent :

- **FR-019** interdit de la traverser. Toute descente entre ces abscisses la franchirait, d'où la
  descente en **x = 4,50 m**, à 0,20 m à l'est de la baie ;
- la constitution **v1.9.0** impose que les conducteurs entrent **par le haut** d'un appareil
  mural, et que la descente soit **à son aplomb**. Une arrivée latérale à 1,00 m serait fautive.

Le seul tracé satisfaisant les deux passe **sous l'allège** : parcours ouest à **1,40 m**, qui
laisse 0,10 m sous la baie et 0,40 m au-dessus de l'axe de la borne, puis dernière descente au
droit de BR-01.

## 6. Les trois points de vigilance de pose

**Premier — la consignation n'est pas celle du local.** Le circuit part du **bornier**, en amont
de l'interrupteur différentiel de type AC (R9). Ouvrir cet interrupteur — le geste habituel — **ne
met pas la borne hors tension**. La consignation se fait au **disjoncteur d'abonné**, et
l'absence de tension se vérifie au départ de la borne, non sur une prise voisine.

**Deuxième — les deux boîtes traversées restent vivantes.** Elles portent trois circuits, dont
celui de la borne, qui n'est coupé ni par la consignation des prises, ni par celle de l'éclairage,
ni par l'ouverture de l'interrupteur du tableau. Quelqu'un qui ouvre l'interrupteur, constate
l'absence de tension sur une prise, puis ouvre BD-01, y trouvera du **32 A vivant** — et il aura
fait tous les gestes justes. Le repérage doit le dire, sur les boîtes et sur le tableau (FR-040).

**Troisième — le tirage se fait d'un seul tenant.** Aucune connexion de la borne dans une boîte
partagée : c'est ce qui rend la traversée admissible, et cela ne se vérifie qu'**avant de
refermer** les boîtes. Plus tard, il faudrait rouvrir sous tension.

## 7. Ce que la maquette montre, et ce qu'elle ne dit pas

Elle montre les **trois** parcours de la paroi est, le tronc à 2,60 m et la ligne de la borne
0,04 m au-dessus, dans une bande de 0,25 m — une contrainte d'encombrement qui devient un objet,
donc opposable.

Elle ne dit pas le **volume intérieur** des boîtes, qui est une cote produit (FR-038), ni la
**section** des conducteurs, qui est normative (R5). Le diamètre du conduit y est porté comme
**majorant** et non comme cote arrêtée : la fiche le lisait sur sa propre ligne, « 32 mm au plus ». *Arrêté à l'IRL 25 le 2026-09-22, il se lit désormais sur la ligne « Diamètre », en 25 mm.*
