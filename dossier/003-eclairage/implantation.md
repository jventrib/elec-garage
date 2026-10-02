# Implantation cotée — éclairage du garage

**Fonctionnalité**: `003-eclairage` | **Date**: 2026-09-21
| Dernière révision | **2026-10-01** — six réglettes **pontées**

> **En une ligne** : le plafond porte **six réglettes HOFTRONIC** en deux colonnes de trois, et
> elles sont **pontées deux à deux** par quatre cordages. Une seule boîte les distribue,
> **BL-01** au degré 3, là où la distribution en étoile en exigeait quatre. Le point
> dimensionnant est **EL-01b**, à 17,17 m au point d'utilisation. **EL-01a et EL-01b
> sont sous le tablier remonté et leur dégagement n'est pas établi** : à mesurer avant fixation —
> et ce sont les deux seules réglettes **alimentées par cordage**.

Repère de la constitution : origine à l'angle sud-ouest de l'œuvre intérieure au sol fini,
x vers l'est, y vers le nord, z vers le haut, unité le mètre.

Les cotes font foi dans [data-model.md](./data-model.md) et dans
`data/apports/003-eclairage.json`. Ce document porte les **motifs** d'implantation.

## 1. Le tronc — partagé avec le circuit des prises

Depuis la décision du maître d'ouvrage du 2026-09-21, l'éclairage **ne pose pas son propre
tronc** : il emprunte celui des prises, en calibre supérieur, et n'a aucune boîte en propre.

| Repère | De | Vers | Tracé | Longueur | Circuits |
|--------|----|------|-------|----------|----------|
| CH-01 | TD-01 (5,60 / 0,70 / 1,50) | BD-02 (5,60 / 0,70 / 2,60) | montée | 1,10 m | **deux** |
| CH-02 | BD-02 | BD-01 (5,60 / **2,60** / 2,60) | antenne paroi est | **1,90 m** | **deux** |
| CH-04 | BD-01 | BD-03 (5,60 / **2,60** / 2,75) | montée au plafond | 0,15 m | **deux** |
| CH-05 | BD-01 | BD-04 (5,60 / **2,60** / 1,10) | descente à la commande | 1,50 m | **deux** |
| CH-07 | BD-03 | BD-05 (2,70 / **2,60** / 2,75) | plafond **droit vers l'ouest**, **commun avec le socle du moteur** | **2,90 m** | **deux** |

**7,96 m de conduit commun, en IRL 20**, déclarés et posés par `002-prises-de-courant`. Les
quatre boîtes sont partagées. L'éclairage part ensuite de trois d'entre elles :

| Boîte | Ce que l'éclairage y prend |
|-------|---------------------------|
| BD-02 | la branche vers la façade sud — EL-02 et son détecteur |
| BD-05 | le virage vers le nord, puis la **fourche BL-01** qui alimente les six réglettes — et la desserte du socle du moteur vers l'**ouest** |
| BD-04 | ses deux commandes, et la remontée vers le point de l'accès piéton |

### Le calibre du tronc, et la condition qu'il laisse ouverte

**CH-05 seul** porte **six** conducteurs de l'éclairage : phase, neutre, protection et la paire
d'ordre de CM-01, plus le retour de CM-03. **CH-L2, CH-L3, CH-L4, CH-L6 et les quatre cordages
CP-1 à CP-4 en portent trois chacun** — phase, neutre, protection, rien d'autre, puisque la
commande est centralisée sur MC-01 en amont. *Ce décompte a été révisé le 2026-09-26 avec les six
réglettes : il ne décrit plus un plafonnier, il décrit une distribution individuelle. Avant lui,
le dossier appliquait un maximum partout, ce qui était un majorant présenté comme un décompte.*

**Un cordage porte trois conducteurs, et non deux.** Chaque paire pontée a besoin de sa phase, de
son neutre et de son **PE** entre les deux réglettes ; sans le PE, le pontage serait un défaut de
terre en série. C'est la raison pour laquelle CP-1 à CP-4 ne sont pas des câbles d'alimentation
à deux fils.

La règle du tiers s'écrit `D ≥ d·√24` pour huit, soit un diamètre intérieur d'au moins
**14,69 mm** ; pour six, environ **13 mm**.

**Le calibre retenu est l'IRL 20 sur toute la ligne**, décision du maître d'ouvrage du
2026-09-22. La note de calcul recommandait l'IRL 25, dont les 21,5 % d'occupation retirent la
question quel que soit le produit ; la décision a été prise en connaissance de cet avis.

**Ce qu'il faut en retenir à l'implantation** : les quatre conduits à six conducteurs passent
sans condition. **CH-05 impose de choisir un IRL 20 d'au moins 14,69 mm intérieurs** — deux des
quatre valeurs produit relevées au § 3.2 de la note n'y satisfont pas. Si le produit disponible
échoue, CH-05 repasse en IRL 25 : 1,50 m de tube, et un changement de calibre à BD-01 et BD-04.

*Un point sur lequel une décision antérieure s'était trompée reste vrai : ce basculement de
remplissage n'est pas une raison de **ne pas partager** le tronc. C'est une question de
dimensionnement, pas de mutualisation. Voir R2.*

### Ce que le partage a résolu, et ce qu'il coûte

**Résolu.** La bande utile au-dessus du linteau de la porte de service ne fait que **0,25 m**,
entre 2,50 et 2,75 m. Elle ne porte plus qu'**un** conduit au lieu de deux, ce qui laisse sa
place à la ligne de la borne — la contrainte la plus dure du parcours se desserre (R3). Et le
croisement de conduits qui était inévitable sur cette paroi **disparaît** : l'éclairage partage
la descente au lieu de la franchir (R4).

**À payer.** Trois choses, et elles sont écrites plutôt que subies :

1. Le **facteur de correction de groupement** devient exigible sur les **deux** circuits, ce que
   le Principe III impose dès qu'un conduit en porte plusieurs. La note de calcul des prises
   portait « Groupement sans objet : conduit dédié » ; cette ligne était devenue fausse et a été
   remplacée par une case à confirmer. **T006 bloque désormais les deux circuits.**
2. Les **quatre boîtes du tronc portent deux circuits**. Consigner l'éclairage n'y met pas les
   prises hors tension, ni l'inverse. Voir la section 5.
3. Les **commandes remontent** au droit de la descente partagée : voir la section 2.

## 2. Les six réglettes et leur commande

> **Révision du 2026-10-01 — les six réglettes se pontent.** Cette section décrit aujourd'hui
> **EL-01a à EL-01f** en deux colonnes de trois, **pontées deux à deux** par quatre cordages, et
> distribuées par **une seule boîte**, BL-01. Elle remplaçait un plafonnier à **deux sorties** sur
> un seul point lumineux, fedéré par CH-L2, CH-L3 et CH-L4 avec sa fourche unique BL-01 ; puis,
> le 2026-09-26, six réglettes **en étoile**, chacune avec son propre trio remontant de la
> fourche. Le raisonnement du décalage d'axe, en contrebas, est conservé tel qu'il a fondé la
> cote de 4,05 m.

| Repère | Type | Position | Alimenté par |
|--------|------|----------|--------------|
| BL-01 | boîte de dérivation, **la fourche** | 2,70 / 3,25 / 2,75 | CH-L2, depuis BD-05, **0,65 m** |
| **EL-01e** | réglette LED 120 cm, plafond | 1,45 / **4,55** / 2,75 | **CH-L4**, depuis BL-01 — *extrémité nord de la colonne ouest* |
| **EL-01f** | réglette LED 120 cm, plafond | 4,15 / **4,55** / 2,75 | **CH-L3**, depuis BL-01 — *extrémité nord de la colonne est* |
| **EL-01c** | réglette LED 120 cm, plafond | 1,45 / **2,90** / 2,75 | **CP-1**, depuis EL-01e |
| **EL-01d** | réglette LED 120 cm, plafond | 4,15 / **2,90** / 2,75 | **CP-3**, depuis EL-01f |
| **EL-01a** | réglette LED 120 cm, plafond | 1,45 / **1,55** / 2,75 | **CP-2**, depuis EL-01c — ⚠️ **sous le tablier** |
| **EL-01b** | réglette LED 120 cm, plafond | 4,15 / **1,55** / 2,75 | **CP-4**, depuis EL-01d — ⚠️ **sous le tablier** |
| CM-01 | commande | 5,60 / 3,08 / 1,10 | boîtier partagé `bt-commandes`, porté par BD-04 |

**Deux conduites seulement, et quatre cordages.** Le courant descend de réglette en réglette, du
nord vers le sud : à l'ouest **EL-01e →CP-1→ EL-01c →CP-2→ EL-01a**, à l'est **EL-01f →CP-3→
EL-01d →CP-4→ EL-01b**. Les deux réglettes les plus au sud ne reçoivent **aucun conduit** : leur
voisine les alimente. C'est ce qui leur vaut deux points d'alimentation, et c'est ce qu'exige V24.

**Le graphe les traite comme des liaisons réelles.** Chaque réglette déclare ses `raccords`, et les
deux points d'une réglette pontée sont reliés par une **arête interne de 1,20 m** — la longueur
du câble fourni dans le corps. Elle est réelle pour la chute de tension, et **absente du métré** :
elle n'est pas achetée, elle est dans l'appareil. Un point d'arrivée unique, en revanche, n'existe
pas : **V24 le refuse**, et `raccords` existe précisément pour cela.

**BL-01 est la seule boîte du plafond, au degré 3** : CH-L2 y arrive du sud, CH-L3 repart vers
l'est, CH-L4 vers l'ouest. Le 2026-09-26 elle était au degré 4, et trois boîtes l'encadraient.

**Six points lumineux distincts, un seul circuit.** CM-01 les allume et les éteint **ensemble**,
d'un seul geste (FR-008, FR-034, SC-014). Mais à la pose et à la réception, **les six se comptent
une par une** : c'est le même bouton, pas le même point.

### Deux colonnes, trois rangs, et pourquoi ce n'est pas symétrique en longueur

L'implantation est **symétrique en position** — deux colonnes à 1,45 m et 4,15 m, trois rangs à
1,55 / 2,90 / 4,55 m — et **asymétrique en longueur de conducteur**. La goulotte descend au sud,
et l'itinéraire par la colonne ouest est **20 cm plus long** qu'à l'est. *Avec la distribution en
étoile, cela faisait d'EL-01a le point dimensionnant, à 11,73 m devant EL-01b à 11,53 m.*
Depuis le pontage, **le point dimensionnant est EL-01b**, à 17,17 m au point d'utilisation
— et l'écart vient de la **géométrie des colonnes**, non du pontage, qui est un éclairage de
fin de ligne et ne touche pas au trajet du tableau. *C'est le même test qu'appliquait l'ancien
document à l'hypothèse d'une symétrie de parcours : il porte ici sur le tracé, non sur la
géométrie.*

### La chaîne série a été abandonnée — puis le pontage l'a relevée sous une autre forme

Six réglettes HOFTRONIC sont **connectables entre elles** jusqu'à 10 selon la fiche. La solution
évidente — les six en série, une seule descente, un seul retour — a été **examinée puis écartée**
le 2026-09-26 : le presse-étoupe PG11 de la réglette est intermédiaire, il ne se trouve **pas** sur
le chemin du courant. Chaque traversée de corps de luminaire ajoute une dérivation et un contact
mâle sans économiser un seul conduit. **Six points distincts valent mieux qu'un point unique à six
dénominations.**

**Le pontage du 2026-10-01 ne la réintroduit pas : il en prend l'autre moitié.** Ce n'est pas la
chaîne série — un appareil qui relaie celui du voisin dans son corps — mais le **liaisonnement
par cordage**, où le câble passe **d'une réglette à l'autre, d'un point à l'autre**. La distinction
n'est pas cosmétique : dans la chaîne série, le presse-étoupe ne conduit pas le courant, et il faut
un dérivateur par appareil ; dans le pontage, chaque paire a **son propre câble**, qui est une
liaison franche entre deux points déclarés. C'est ce que la fiche Allows, et c'est ce que le modèle
sait décrire. Le métré est passé de 104,89 m à **108,92 m** : plus court qu'en étoile de 3,97 m,
et plus long que les 69,34 m des deux sorties — **six points restent six points**.

### Les deux réglettes du rang sud ne sont pas prouvées dégagées

EL-01a et EL-01b, à y = 1,55 m, tombent **sous le tablier remonté**, dont le majorant occupe
y de 0 à 2,15 m jusqu'à 2,75 m de haut. **L'épaisseur du panneau n'a jamais été relevée** : le
dessus du volume est pris au plafond, ce qui est un majorant, non une mesure.

**Aucun segment de conduit n'est plus en cause.** Trois l'étaient : **CH-L10** segment 3, qui
descendait vers EL-01b, et **CH-L13** segments 2 et 3, qui longeaient le bord ouest avant de
rejoindre EL-01a. Ces trois cheminements appartenaient aux colonnes de la distribution en étoile,
et le pontage les a supprimés.

La réserve **porte donc sur les deux points eux-mêmes**, non plus sur un tracé : EL-01a et
EL-01b sont les deux seules réglettes **alimentées par cordage**, et leur dégagement ne peut pas
être démontré par un conduit. Elles portent `zoneTablier: "non-concluant"` dans le modèle — le
statut est là, il ne se déduit pas d'un segment. Les quatre autres sont **prouvées dégagées**.

**Décision du maître d'ouvrage, 2026-09-26** : les deux réglettes sont **posées à y = 1,55 m**
malgré cette réserve, et **l'épaisseur du panneau est déclarée comme cote à relever**. Elles
seront **mesurées en place avant fixation**, et décalées si elles frotent. C'est un arbitrage
explicite, pas un oubli.

### Le tracé raconte le décalage : commun, virage, fourche

Décision du maître d'ouvrage du 2026-09-21. Le conduit se lit en trois temps, et c'est voulu :

1. **Commun** avec celui du socle du moteur, de BD-03 jusqu'à BD-05 — **droit vers l'ouest sur
   2,90 m à y = 2,60**, en IRL 20, posés par le circuit des prises.

   *Il comportait jusqu'au 2026-09-23 un décrochement de 0,40 m vers le nord avant de filer vers
   l'ouest à y = 3,00. Ce décrochement était né du rapprochement de l'axe à 0,20 m de la porte de
   service (R11) : l'appareillage de la paroi est descendait à y = 2,60, le socle du moteur
   restait calé sur l'extrémité du rail à y = 2,70, et le parcours de plafond faisait la liaison.
   Le maître d'ouvrage a demandé BD-05 dans l'axe ouest de BD-01, ce qui supprime le décrochement
   et son coude — et entraîne le socle du moteur à y = 2,60, desservi vers l'**ouest**.*
2. **Virage vers le nord** à BD-05 : **0,65 m** jusqu'à BL-01. C'est ce
   segment qui matérialise le décalage de l'axe lumineux. Ce n'est pas un détour.
3. **Fourche** à BL-01, puis **deux colonnes** : CH-L4 vers l'ouest et CH-L3 vers l'est. Chacune
   remonte d'abord au nord à y = 4,75, puis traverse vers la paroi — x = 0,60 à l'ouest, x = 5,00 à
   l'est — avant de redescendre sur le flanc extérieur de la réglette qu'elle alimente ; le
   reste descend par cordage. *Cette fourche n'est plus dichotomique depuis le 2026-09-26, et elle
   n'a plus que deux sorties au lieu de six depuis le 2026-10-01.*

### L'axe est au centre du plafond utilisable, non du local

> **Révisé le 2026-09-23, décision du maître d'ouvrage** : l'axe du plafonnier recule de 0,80 m
> vers le sud, à **y = 3,25 m** — 0,50 m puis 0,30 m de plus. *Motif* : CH-L2 était trop long.
> Les sorties restent aux quarts de la largeur, et l'axe reste au nord de y = 2,50 m, seule cote
> qu'exige la spécification (et à 1,10 m du tablier remonté, dont la profondeur relevée est
> 2,15 m). CH-L2 passe de 1,45 à **0,65 m**, et le chemin le plus long, jusqu'à EL-01b, de 9,00 à
> **8,20 m**. Le raisonnement qui
> suit, celui du centre de la bande utilisable, est conservé tel qu'il a fondé la cote de 4,05 m.

*État du 2026-09-23, conservé pour le raisonnement.* L'axe est à **y = 4,05 m**. Les sorties
restent aux **quarts de la largeur**, 1,40 m et 4,20 m,
donc symétriques à 1,40 m de part et d'autre de l'axe médian nord-sud — une cote unique répétée,
ce qu'exige SC-016. **Depuis le 2026-09-26**, les deux colonnes sont à **1,45 m et 4,15 m**, et
elles desservent trois rangs chacune au lieu d'une sortie unique.

**Pourquoi 4,05 et non le centre du local.** Le tablier ouvert interdit la moitié sud du plafond
jusqu'à y = 2,50 m. La bande où une sortie peut être posée va donc de **2,50 à 5,60 m**, et son
centre est à **4,05 m**. Une version antérieure plaçait l'axe à 2,80 m, le centre géométrique du
local — juste si l'on centre sur le **local**, mais un point lumineux éclaire depuis le
**plafond**, et centrer sur le local revenait à poser les sorties au bord de la zone disponible.

**Ce que le décalage coûte** : la baie de stationnement ne reçoit plus qu'un éclairement oblique.
Accepté — un véhicule garé masquerait de toute façon ce qui vient d'au-dessus de lui, l'aire de
manœuvre a son propre point en façade, et c'est la circulation autour du véhicule et le fond du
local qu'on éclaire vraiment.

**Ce que le décalage a rapporté, et qui n'était pas cherché** : le **dernier croisement de
conduits a disparu**. L'axe à 2,80 m franchissait la descente des prises vers le socle du moteur,
en (2,70 ; 2,80 ; 2,75). L'éclairage part désormais **de** ce point au lieu de le traverser.
T007 est résolue (R4).

*État du 2026-09-23, conservé pour le raisonnement.* **Ce que le décalage a coûté en longueur** :
le chemin le plus long passe de 7,95 à **9,00 m**, le
conduit allant chercher le droit du socle du moteur avant de remonter. La chute terminale passe
de 0,108 % à 0,122 %, et la marge reste de 1,23 point sur 3 %. Sans conséquence.

**⚠ Ce que le 2026-09-26 a changé** : le chemin le plus long n'est plus 8,18 m mais **11,73 m** —
EL-01a, la colonne ouest. La chute terminale passe de 0,111 % à **0,144 %** et la cumulée de
1,76 % à **1,79 %**. La marge passe de 1,24 à **1,21 point**.

**⚠ Ce que le pontage du 2026-10-01 a changé, à son tour** : le chemin le plus long n'est plus
11,73 m mais **17,17 m**, pour EL-01b, au point d'utilisation. La
chute terminale passe de 0,144 % à **0,210 %**, la cumulée de 1,79 % à **1,86 %**, et la marge de
1,21 à **1,14 point**. *Le point dimensionnant a changé de lettre : ce n'est pas le pontage qui l'a fait, mais
la colonne est, plus longue de 20 cm. Le pontage est un éclairage de fin de ligne et ne touche
pas au trajet du tableau au plafond.*

**Les deux sorties sont à 1,55 m de la borne du tablier — ce qui n'est plus la même chose qu'en
2026-09-23.** Elles sont désormais **sous** le tablier remonté, et non au nord de sa borne, parce
que le volume relevé est plus profond qu'on ne le croyait : y jusqu'à 2,15 m. **Leur dégagement
n'est pas établi** et le segment qui descend vers EL-01b est `non-concluant`. Voir la section 2.

### Les commandes ont remonté, puis sont redescendues — et il n'en reste qu'une

*La mutualisation les avait portées à y = 3,08 et 3,16 m, soit 0,68 et 0,76 m de l'encadrement de
la porte au lieu de 0,20 m, le boîtier devant être au droit de la descente partagée. FR-030 avait
été amendé pour l'admettre.*

**Les deux mouvements du 2026-09-21 ont annulé ce prix et changé la distribution :**

- **CM-03 est passée dehors** (FR-038 révisé, R11), au dos de BD-04, à 1,10 m. Le boîtier
  intérieur ne porte plus que **CM-01**, dont le poste est à y = 2,68 m — la cote réelle d'un
  montage côte à côte avec la boîte.
- **L'axe entier a été rapproché à 0,20 m de la baie**, au lieu de déplacer les seules commandes.
  Le boîtier est donc à la fois au droit de la descente partagée et immédiatement à côté de
  l'encadrement : FR-030 est rendu à sa lettre, et son amendement annulé.

**SC-001 reste tenu**, et largement : il borne l'écart à 1,5 m depuis l'encadrement, et 0,28 m y
satisfait. Ce qui est perdu est ailleurs, et nommé en FR-047 : on ne commande plus EL-03 de
l'intérieur.

### Le boîtier des commandes transite le circuit des prises

BD-04 n'est pas seulement la boîte des commandes : la descente partagée s'y raccorde avant de
continuer vers PC-01. Deux conséquences, exigées par FR-045 de `002` :

- il DOIT être **dimensionné en volume** pour ce transit ;
- il DOIT être **repéré comme boîte à plusieurs circuits** (constitution v1.10.0).

### Hauteur d'axe : 1,10 m, décidée

Décision du maître d'ouvrage du 2026-09-21, inchangée. **La plage normative de FR-031 reste à
confirmer sur le texte.**

## 3. L'aire de manœuvre et son détecteur

| Repère | Type | Position | Alimenté par |
|--------|------|----------|--------------|
| TV-L1 | traversée paroi sud | 2,70 / 0 / **2,22** | CH-L1, depuis **BD-02** |
| EL-02 | sortie d'éclairage | 2,70 / −0,20 / 2,22 | TV-L1, **au dos du boîtier** |
| CM-02 | détecteur de présence | 2,40 / −0,20 / 2,22 | CH-L8, depuis le boîtier de EL-02 |

EL-02 est **centré** sur la porte sectionnelle, conformément à FR-004 : x = 2,70 m est l'axe de
la baie, qui va de 0,20 à 5,20 m.

### La bande de 0,25 m, et pourquoi la traversée n'a pas le choix

C'est la contrainte la plus serrée de tout le dossier, et elle mérite d'être lue avant de percer.

Au droit de EL-02, le **rail** occupe x 2,66–2,74, et son volume **part de la paroi sud** —
y = 0. Il descend jusqu'à 2,35 m. Il n'existe donc, à cet abscisse, **aucun passage entre 2,35 m
et le plafond**.

En dessous, l'ouverture de la porte monte à **2,10 m**. La seule bande libre fait donc **0,25 m**,
entre 2,10 et 2,35.

| Cote | Valeur | Garde |
|------|--------|-------|
| Haut de l'ouverture de la porte | 2,10 m | — |
| **Traversée TV-L1** | **2,22 m** | **0,12 m** sous le linteau, **0,13 m** sous le rail |

*Ajouté le 2026-09-22 avec le guide de perçage.* Les trois traversées de l'éclairage portent
désormais leur **géométrie de perçage** : `position` est l'axe, l'entrée se situe un
demi-dénivelé au-dessus et la sortie autant au-dessous. Le **dénivelé reste à établir** — il
dépend de la hauteur du boîtier retenu — et il est borné par la réserve d'altitude de
l'enveloppe qui reçoit la traversée. TV-L1 est le cas le plus serré du projet : 0,12 m de garde
en haut, 0,13 m en bas, et un dénivelé mal choisi y mangerait la marge des deux côtés à la
fois.
| Sous-face du rail | 2,35 m | — |

La cote de 2,22 m est une **cote traçable** : le milieu exact de la bande serait 2,225 m, qui ne
se relève pas au mètre. Les 25 cm sont répartis de part et d'autre, ce qui est le meilleur emploi
d'une bande contrainte.

**Les deux voies écartées**, et il faut savoir pourquoi :

- *Descendre du plafond au droit de EL-02* : le percement traverserait le rail. **Collision
  établie** contre un obstacle entièrement relevé — le contrôle la refuse, et à raison.
- *Traverser à 2,22 m puis remonter en façade jusqu'à 2,60 m* : éclairerait de plus haut, mais
  réintroduirait un conduit exposé en façade, que la révision de `002` avait justement supprimé.

### Trois contraintes d'exécution, à lire avant de percer

**1. Le boîtier doit avoir une entrée en fond.** La traversée débouche dans le fond du boîtier de
EL-02, selon le schéma retenu par la révision de FR-029 de `002`. Sans entrée en fond, le schéma
ne tient pas.

**2. Le percement est en biais vers le bas.** Entrée haute à l'intérieur, sortie basse à
l'extérieur. C'est la pente vers l'extérieur qu'exigent FR-028 et FR-055, et c'est ce qui empêche
l'eau de cheminer vers l'intérieur. **Avec 0,25 m de bande et 0,12 m de garde en haut, la marge
pour incliner est faible** : le tracé doit être fait au trait, pas à l'estime.

**3. Percer avant de poser le boîtier.** Une fois le boîtier fixé, son fond n'est plus accessible
à la scie cloche.

### Le détecteur, et les 0,30 m de conduit qui reviennent

CM-02 est posé **0,30 m à l'ouest** de EL-02, à la même altitude. Le détecteur doit être au
voisinage immédiat du point qu'il commute, pour que celui-ci soit alimenté en permanence et
commuté sur place, sans retour commandé depuis l'intérieur (FR-042).

L'alimentation permanente arrive par la traversée dans le boîtier de EL-02, y est **repiquée**
vers le détecteur — admis par la constitution depuis sa v1.8.0 —, et le retour commuté revient
dans le même boîtier. CH-L8 porte donc **quatre conducteurs sur 0,30 m**.

**Ce que cela coûte, et qu'il faut dire** : c'est le **seul conduit extérieur du projet**, et il
**rouvre** `TODO(CONDUIT_EXTERIEUR)`. La révision de `002` avait supprimé 0,90 m de conduit de
façade ; ces 0,30 m en remplacent une partie. Le conduit et les boîtiers extérieurs doivent tenir
l'exposition directe aux ultraviolets et aux intempéries, et l'IRL d'intérieur n'est pas présumé
qualifié pour cet emploi.

L'alternative — deux traversées séparées, une par appareil — supprimerait tout conduit extérieur,
mais le conducteur commuté sortirait, rentrerait et ressortirait : plus de percements et plus de
conducteurs pour éviter 0,30 m de tube.

### Ce que le détecteur ne fera pas

Il n'y a **aucun allumage forcé** sur EL-02. Qui décharge son véhicule en restant immobile verra
la lumière s'éteindre, sans moyen de la maintenir. C'est une conséquence assumée du choix de la
détection, et la **temporisation** est le seul levier — d'où l'obligation de la consigner
(FR-041, SC-018).

Le champ de détection doit en outre être réglé pour **ignorer la voie publique et la propriété
voisine** (FR-040, SC-017). Un détecteur qui s'allume au passage de chaque voiture de la rue
finit débranché.

## 4. L'accès piéton

| Repère | Type | Position | Alimenté par |
|--------|------|----------|--------------|
| CM-03 | commande | 5,60 / **3,16** / 1,10 | **boîtier partagé** `bt-commandes`, porté par BD-04 |
| TV-L2 | traversée paroi est | 5,60 / **3,00** / **2,60** | **fond de BD-01** |
| EL-03 | sortie d'éclairage | 5,80 / **3,00** / **2,60** | TV-L2, **au dos du boîtier** |

### EL-03 remonte à 2,60 m — révision du 2026-09-21

**Aucun conduit ne dessert EL-03.** Le point est à l'**aplomb de PC-01** et à la **hauteur de
BD-01**, et son alimentation sort du **fond de cette boîte**. Le tube vertical de cet aplomb —
CH-05, de BD-01 à BD-04 — est déjà posé, déjà partagé et déjà dimensionné pour ce conducteur.

**Ce qui disparaît** : CH-L5 en entier, soit 1,40 m de conduit en deux tronçons — 0,30 m le long de
la paroi puis 1,10 m de remontée — et une traversée percée en pleine paroi. Il y avait là deux
tubes verticaux parallèles, distants de 0,30 m, dont l'un était déjà en place.

**Pourquoi 2,60 m était refusé, et pourquoi l'objection était fausse.** Le premier tracé plaçait
EL-03 à 2,60 m ; la vérification l'avait refusé au motif que **l'antenne des prises occupe
z = 2,60 m** de y = 0,70 à 5,45, et qu'une traversée à cette altitude « tomberait dessus ».

L'objection est juste sur 5,44 m de cette bande. Elle est fausse **au seul point qui compte** :
en y = 3,00, le conduit ne passe pas — il s'y **termine**, dans BD-01. C'est un nœud, et le nœud
est une boîte en saillie dont le fond est appliqué contre le béton. C'est la même prémisse que
celle relevée sur FR-029 de `002` : un boîtier en saillie n'est pas un obstacle à sa propre
position, il est l'enveloppe dont les conducteurs sortent.

| Ce qui reste vérifié à 2,60 m | Constat |
|-------------------------------|---------|
| L'antenne des prises | Le percement est **au nœud** où elle se termine, pas en travers |
| La porte de service, qui s'arrête à y = 2,40 m | **0,60 m** au nord, et 0,10 m au-dessus de son linteau à 2,50 m |
| La bande congestionnée de 0,25 m au-dessus du linteau de la sectionnelle | paroi sud, sans objet ici |
| Le nu extérieur à cette altitude | Aucun encombrement relevé ; 0,15 m sous le niveau du plafond intérieur |

**Sur « en hauteur » (FR-005)** : 2,60 m y répond mieux que 2,20 m. « Légèrement au nord de la
porte de service » reste tenu à 0,60 m du jambage. La distance au jambage nord à hauteur de
poignée passe de 1,19 m à 1,66 m — la serrure est bien de ce côté, le vantail étant ferré au
jambage sud (relevé du 2026-09-23). C'est une distance ordinaire pour un hublot de porte, et la
hauteur supplémentaire élargit la nappe sur le seuil. SC-005 reste satisfait.

### Où se fait la connexion, maintenant

Dans **BD-01**, et non plus aux bornes de CM-03. Le conducteur commuté de EL-03 naît toujours aux
bornes de CM-03 — c'est elle qui commute — mais il remonte les 1,50 m de CH-05 jusqu'à BD-01, où
il rejoint le neutre et le PE avant de sortir par le fond.

C'est une connexion de plus qu'avant, dans une boîte qui en porte déjà. En échange : 1,40 m de
conduit, deux accessoires de courbe et un percement en pleine paroi de moins. **BD-01 doit donc
être dimensionnée en volume** pour ce départ supplémentaire, et repérée comme boîte à deux
circuits — c'est FR-046, de même raison que FR-045 pour le boîtier des commandes.

Le coût électrique est de 0,10 m de conducteur : la longueur de **conduit** de EL-03 tombe de
6,50 m à **3,20 m**, mais la longueur de **phase**, qui passe par la commande, reste à 6,60 m —
la commande étant désormais dehors, au dos de BD-04, le retour rentre par la paroi et remonte le
tronc. EL-03 n'étant pas le point dimensionnant, c'est sans effet — voir § 2.3 de la note de
calcul, qui relève cette distinction pour tous les points commutés.

### Les deux commandes partagent un boîtier, et le socle a dû l'apprendre

CM-01 et CM-03 sont dans un **boîtier à deux postes**, distants de 0,08 m — la cote réelle d'un
deux postes, et non une commodité de dessin. FR-032 l'exige, et FR-006 de `001` exige la cote
réelle.

Le socle ne savait pas le dire. CM-03 n'étant l'extrémité d'aucun conduit, la règle V16 le
déclarait **non atteignable depuis le tableau** — ce qui était faux. Le socle a été étendu : un
composant déclare le boîtier qu'il partage, et V16 le tient pour atteignable si un membre de ce
boîtier l'est.

L'extension est volontairement étroite. Elle propage sur le **boîtier déclaré** et non sur la
proximité : deux appareils voisins sans boîtier commun restent distincts, et un boîtier dont
aucun membre n'est raccordé reste orphelin tout entier. Trois tests bornent ce comportement, dont
deux contrôles négatifs.

### Ce qui ne se vérifie que de nuit

**CM-03 agit sur EL-03 seul**, sans effet sur EL-02 ni sur les six réglettes du plafond (SC-015). C'est la
vérification la plus importante de cette histoire, et la seule qu'aucune mesure ne remplace :
**une inversion de câblage entre deux commandes est invisible au contrôle de continuité**. Elle
se constate en regardant, de nuit, depuis l'extérieur.

SC-013 ajoute que l'état de EL-03 doit être **constatable depuis l'intérieur**, sans sortir — ce
que la position du point, au nord de la porte et visible par l'ouvrant vitré ou en entrebâillant,
permet. À confirmer sur place.

## 5. Ce qui reste sous tension après la consignation

**À lire avant toute intervention ultérieure — deux situations, non une.**

### Cinq boîtes portent plus d'un circuit

Depuis la mutualisation du 2026-09-21, BD-01 à BD-04 portent le circuit des prises **et** celui
de l'éclairage. **Consigner l'un n'y met pas l'autre hors tension.** Deux s'y ajoutent depuis le
pontage, qui a supprimé trois des six de la version précédente.

| Boîte | Position | Ce qu'elle contient |
|-------|----------|---------------------|
| BD-02 | 5,60 / 0,70 / 2,60 | les deux circuits |
| BD-01 | 5,60 / **2,60** / 2,60 | les deux circuits, **plus la traversée vers EL-03 dans son fond** |
| BD-03 | 5,60 / **2,60** / 2,75 | les deux circuits |
| BD-04 | 5,60 / **2,60** / 1,10 | les deux circuits, **plus CM-01 et la traversée vers CM-03 dans son fond** |
| **BD-05** | 2,70 / **2,60** / 2,75 | les deux circuits — **et le départ de CH-L2 vers la fourche BL-01** |
| **BD-06** | 5,40 / 0 / 2,22 | les deux circuits — **l'organe de connexion du mur sud**, sur le passage vers EL-02 |

*Les deux dernières ont rejoint la liste le 2026-10-01 : en étoile, l'éclairage rejoignait le
tronc par ses sept colonnes et ne touchait donc pas BD-05 ni BD-06. Ponté, il n'a plus que deux
descentes au plafond, et la seconde passe par le sud.* **OC-01** et **OC-02**, les organes de
connexion du tableau, portent également plusieurs circuits.

Chacune DOIT être **repérée comme telle**, de façon lisible sans l'ouvrir — la constitution
l'exige depuis sa v1.10.0. Le motif de cette règle est exactement cette situation : une
consignation protège un **circuit**, pas un **volume**, et rien dans l'appareillage ne le
signale au moment où l'on a les mains dedans.

### Et EL-02 reste sous tension

**À lire avant toute intervention ultérieure sur la façade sud.**

FR-042 impose que **EL-02 soit alimenté en permanence**, son détecteur commutant sur place. C'est
la condition qui évite un retour commandé depuis l'intérieur, et c'est ce qui permet au point de
s'allumer sans aucun geste.

La conséquence est qu'il **n'est pas mis hors tension par la consignation du circuit
d'éclairage** telle qu'elle est décrite dans la séquence de montage. Une fois l'installation en
service :

| Intervention | Ce qu'il faut consigner |
|--------------|--------------------------|
| Sur EL-01a, EL-01b, CM-01, CM-03, EL-03 | le circuit d'éclairage suffit |
| **Sur EL-02, CM-02, ou la liaison CH-L8** | le circuit d'éclairage **ne suffit pas**. Vérifier l'absence de tension au VAT sur place, et consigner en amont du point d'alimentation permanente |

C'est la contrepartie du choix de la détection de présence, et elle appartient à la **notice**
plutôt qu'à la mémoire de celui qui a posé. Un intervenant qui reviendra dans dix ans lira ce
document, pas le compte rendu d'une décision de 2026.

### Pourquoi ce n'est pas un défaut

Le Principe VI de la constitution exige que la consignation et sa levée soient des étapes
explicites, et qu'aucune étape n'illustre un travail sous tension qui ne le serait pas en
réalité. La séquence de montage respecte cela : **pendant la pose**, tout est hors tension,
puisque le circuit n'est mis sous tension qu'à la levée.

Ce qui change est l'**après**. Et la règle V8 du socle, qui vérifie qu'aucune étape sous tension
ne précède la levée, ne dit rien de la maintenance — elle n'en a pas le domaine. D'où cette
section : ce que la règle ne peut pas contrôler doit être écrit.
