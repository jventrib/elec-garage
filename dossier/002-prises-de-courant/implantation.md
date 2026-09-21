# Implantation cotée — prises de courant du garage

**Fonctionnalité**: `002-prises-de-courant` | **Date**: 2026-09-21

Repère de la constitution : origine à l'angle sud-ouest de l'œuvre intérieure au sol fini,
x vers l'est, y vers le nord, z vers le haut, unité le mètre.

Les cotes font foi dans [data-model.md](./data-model.md) et dans
`data/apports/002-prises-de-courant.json`. Ce document porte les **motifs** d'implantation :
pourquoi un point est là et pas ailleurs.

## 1. Le tronc — antenne et descentes

Le tronc est la partie du tracé commune aux trois usages : il porte le tableau, l'antenne
haute, les deux descentes et l'unique boîte de dérivation. Les trois histoires ne déclarent ensuite que
leurs **feuilles**, ce qui les rend réellement indépendantes entre elles.

| Repère | De | Vers | Tracé | Longueur | Circuits |
|--------|----|------|-------|----------|----------|
| CH-01 | TD-01 (5,60 / 0,70 / 1,50) | BD-02 (5,60 / 0,70 / 2,60) | montée | 1,10 m | **deux** |
| CH-02 | BD-02 | BD-01 (5,60 / **2,60** / 2,60) | antenne paroi est | **1,90 m** | **deux** |
| CH-04 | BD-01 | BD-03 (5,60 / **2,60** / 2,75) | montée au plafond | 0,15 m | **deux** |
| CH-05 | BD-01 | BD-04 (5,60 / **2,60** / 1,10) | descente, **entrée par le haut** | 1,50 m | **deux** |
| CH-03 | BD-01 | **PC-03** (5,45 / **5,60** / 0,30) | antenne **3,00 m** jusqu'à l'angle, **virage** sur la paroi nord, **descente droite** | **5,45 m** | prises |
| CH-06 | BD-04 | **PC-01** (5,60 / **2,60** / 0,30) | **descente droite, entrée par le haut** | 0,80 m | prises |
| CH-07 | BD-03 | BD-05 (2,70 / **2,60** / 2,75) | plafond, **droit vers l'ouest** | **2,90 m** | **deux** |
| CH-08 | BD-05 | **PC-05** (**2,55** / **2,60** / 2,75) | plafond, **vers l'ouest** | **0,15 m** | prises |

**7,95 m sont partagés** avec le circuit d'éclairage, décision du maître d'ouvrage du
2026-09-21, et posés en **IRL 20** depuis la décision du 2026-09-22 ; les 6,25 m propres aux prises sont au même calibre. Métré total
**13,97 m**. La mutualisation n'a rien coûté en longueur — c'est le même tracé, scindé aux
boîtes où les deux circuits se séparent.

*Le métré est passé de 14,20 à 13,97 m le 2026-09-23. Deux mouvements de sens contraire s'y
composent : PC-03 en façade nord allonge l'antenne de 0,30 m, et BD-05 dans l'axe ouest de BD-01
supprime le décrochement de 0,40 m de CH-07 — ce dernier l'emporte de 0,13 m. Le décrochement
était né du rapprochement de l'axe à 0,20 m de la porte (R11 de `003`) ; il n'a plus d'objet
depuis que le socle du moteur est lui aussi sur y = 2,60.*

### Pourquoi l'antenne est à 2,60 m, et pas plus bas

C'est la cote la plus contrainte du tracé, et la seule qui ne souffre aucune approximation.

La **porte de service est sur la paroi est**, celle que longe tout le circuit, et elle occupe
y de 1,30 m à 2,40 m **depuis le sol**, sur 2,50 m de hauteur. Un conduit qui relierait le
tableau aux socles en suivant cette paroi à mi-hauteur buterait donc dans la baie. Comme la
porte part du sol, il n'existe aucun passage par le dessous : le seul franchissement possible
est **au-dessus du linteau**, à plus de 2,50 m.

L'antenne est donc posée à **2,60 m**, soit 0,10 m au-dessus du linteau — assez pour le
collier de fixation et le rayon de cintrage du conduit, sans monter inutilement vers le
plafond. Le tableau étant à 1,50 m d'axe, CH-01 monte de 1,10 m avant de partir en antenne.

La règle V19 du socle contrôle mécaniquement ce franchissement : elle rejetterait tout conduit
traversant une baie, et c'est elle qui garantit que la cote de 2,60 m n'a pas été perdue au fil
des modifications.

### Les conducteurs entrent par le haut, et les boîtes sont au droit des socles

FR-061 exige que les conducteurs entrent dans les socles intérieurs **par le dessus** du
boîtier. Le motif n'est pas cosmétique : les parois sont froides et la condensation est tenue
pour probable. Une gaine qui aborde un boîtier par le bas ou par le côté peut conduire l'eau
jusque dans l'appareil, où elle stagne. Abordé par le haut, le même conduit la laisse s'écouler
hors de l'appareil.

Les deux descentes sont donc **droites**, sans aucun tronçon horizontal en pied, et tombent
verticalement dans le dessus du boîtier de PC-01 et de PC-03.

Depuis la mutualisation du 2026-09-21, la descente vers PC-01 se fait en deux tronçons — CH-05
puis CH-06 — séparés par la boîte partagée **BD-04**, à hauteur des commandes de l éclairage.
Cela ne change rien à la propriété : les deux tronçons sont sur le même aplomb, y = **2,60 m**, et
PC-01 est toujours abordé verticalement par le dessus. C est ce que le test vérifie, et il le
vérifie désormais sur l aplomb plutôt que sur un comptage de boîtes.

Cela a imposé de placer **BD-01 au droit de PC-01** — alors à y = 3,00 m au lieu de 2,70 m. Une
première tentative gardait BD-01 à 2,70 m et prenait un décrochement de 0,30 m au niveau de
l'antenne pour venir au-dessus du socle : **la règle V17 l'a refusée**, le décrochement se
posant sur le tracé de l'antenne qui continue vers le fond. Il l'y coupait d'un té, la jonction
comptait quatre conduits, et il aurait fallu une boîte de plus. En plaçant BD-01 directement au
droit du socle, la descente part de la boîte et le té n'existe pas. D'où FR-062.

### Pourquoi le tableau est à 0,70 m de l'angle

La position du tableau divisionnaire est **relevée**, pas choisie : il se trouve sur la paroi
est, entre l'angle sud-est et la porte de service, dans une bande de 0 à 1,30 m. La cote de
0,70 m place son axe au milieu de cette bande, ce qui laisse de part et d'autre la place du
coffret et de sa réserve d'extension.

### Pourquoi quatre boîtes, et toutes partagées

| Boîte | Position | Conduits qui s'y rejoignent | Degré | Ce qu'elle sépare |
|-------|----------|---------------------------|-------|-------------------|
| BD-02 | 5,60 / 0,70 / 2,60 | CH-01, CH-02, CH-L1 | 3 | la branche de l'éclairage vers la façade sud |
| BD-01 | 5,60 / **2,60** / 2,60 | CH-02, CH-03, CH-04, CH-05, **+ TV-L2 en fond** | 4 | les quatre directions du tronc, et le départ vers EL-03 |
| BD-03 | 5,60 / **2,60** / 2,75 | CH-04, CH-07 | 2 | relais du tronc au plafond — CH-07 y part **droit vers l'ouest** depuis le 2026-09-23 |
| BD-04 | 5,60 / **2,60** / 1,10 | CH-05, CH-06, **+ TV-L3 en fond** | 2 | enveloppe de CM-01, et le départ vers CM-03 à l'extérieur |

Toutes sont imposées par V17, et chacune est le point où les deux circuits se séparent — c'est
précisément ce que la mutualisation produit : le tronc est commun, les boîtes sont les
embranchements.

**Les quatre portent deux circuits.** Consigner l'un n'y met pas l'autre hors tension. Elles
DOIVENT être repérées comme telles, de façon lisible sans les ouvrir (FR-066, constitution
v1.10.0), et la réserve figure à la notice de montage.

**BD-04 demande une attention particulière** : elle transite le circuit des prises vers PC-01
**et** loge les deux commandes de l'éclairage. Son volume doit l'admettre, ce qui n'est pas
anodin pour un appareillage en saillie à deux postes (FR-045).

#### Ce que la mutualisation a remplacé

Une version antérieure de cette implantation ne comportait qu'une boîte, BD-01, et le circuit
d'éclairage posait les siennes. Le maître d'ouvrage a demandé le 2026-09-21 pourquoi ne pas
mutualiser autant que possible, et a retenu la mutualisation maximale.

Le bilan est de **5,05 m de tube en moins** sur l'ensemble des deux circuits, et d'**une boîte
de plus** — le compte de boîtes s'inverse par rapport à une première estimation trop rapide.
Deux bénéfices moins visibles comptent davantage : la bande de 0,25 m au-dessus du linteau de la
porte de service ne porte plus qu'un conduit, ce qui préserve la place de la ligne de la borne ;
et le croisement de conduits qui y était inévitable a disparu.

#### Les deux boîtes de pied ont disparu, et pourquoi elles existaient

Une version antérieure de cette implantation comportait **BD-03 et BD-04**, en pied de chaque
descente à 0,30 m. Elles n'avaient pas de cause propre. La traversée vers le socle extérieur y
était décalée de 0,20 m, au motif — faux — que le boîtier saillie du socle intérieur occupait
l'axe du percement. Ce décalage faisait se rejoindre trois conduits en pied de descente : la
descente, le socle, la traversée. La règle V17 exigeait donc une boîte.

Les boîtes de pied ne résolvaient ainsi qu'un problème créé par le décalage, et le décalage ne
venait que d'une prémisse erronée : un boîtier saillie n'obstrue pas le point de percement,
**c'est la boîte**, et il a une entrée en fond. En perçant au fond, la jonction retombe à deux
conduits et les deux boîtes tombent avec elle. Voir la révision de FR-029.

## 2. Les socles intérieurs

| Repère | Type | Position | Hauteur d'axe | Dégagement |
|--------|------|----------|---------------|------------|
| PC-01 | socle double | 5,60 / **2,60** / 0,30 | 0,30 m | **0,20 m** au nord du bord de la porte de service |
| PC-03 | socle simple | **5,45 / 5,60** / 0,30 — paroi nord | 0,30 m | 0,15 m de l'angle nord-est |

Les deux sont sur la **face intérieure de la paroi est**, en saillie, alimentés **directement**
par une descente droite qui entre **par le dessus** de leur boîtier : CH-02 pour PC-01, CH-03
pour PC-03 (FR-061). Il n'y a plus de boîte de dérivation intermédiaire.

Chacun est en outre un point de **repiquage** : ses bornes reçoivent le conducteur entrant et le
conducteur sortant vers le socle extérieur qui lui fait dos, à travers la paroi (FR-029,
FR-060). Deux conséquences à tenir à la pose :

- chaque borne doit accepter **deux conducteurs de 2,5 mm²** sans contrainte, à vérifier sur
  l'appareil retenu ;
- déposer PC-01 ou PC-03 **interrompt l'alimentation** du socle extérieur correspondant. C'est
  le fonctionnement normal d'un repiquage, et il est ici assumé.

### PC-01 — dégagement de la porte de service

La porte de service occupe la paroi est de y = 1,30 m à y = 2,40 m. PC-01 est à y = **2,60 m**
depuis le 2026-09-21, soit **0,20 m au nord du bord de la baie**. Le socle est hors de
l'ouverture, ce qu'exige FR-002, mais il n'en est plus « franchement » hors.

Ce dégagement vise la **baie**, qui est relevée. Il ne statue pas sur le **débattement du
vantail**, qui ne l'est pas : le sens d'ouverture et l'angle de battement sont absents du relevé.

**Ce point de vigilance a changé de nature avec le rapprochement de l'axe.** À 0,60 m de la baie,
un vantail ouvrant vers l'intérieur et vers le nord *pourrait* venir devant PC-01 ; à **0,20 m**,
il y viendra presque certainement, et il viendra aussi devant CM-01 à 1,10 m. Le relevé du sens
d'ouverture (T023) n'était qu'une vérification de complétude du dossier ; il **conditionne
maintenant la position de tout l'axe**. Si le vantail ouvre vers le nord, c'est FR-030 qui
tranche — le boîtier va du côté que le débattement laisse libre — et l'axe devra être repris.

> **Levé le 2026-09-23** par relevé du maître d'ouvrage : le vantail est ferré au jambage
> **sud** et ouvre **vers l'extérieur**. Il ne balaie rien à l'intérieur du local, et ne peut
> venir ni devant PC-01 ni devant CM-01 : l'axe tient tel quel. À l'extérieur, son bord libre
> part de y = 2,40 et s'en éloigne en s'ouvrant ; PC-02, CM-03 et EL-03, à y = 2,60, sont hors
> du débattement.

S'y ajoute le **débord de l'encadrement**, qui n'est pas relevé : les 0,20 m sont pris sur la
baie, et la garde réelle à l'huisserie sera moindre.

C'est pourquoi le contrôle de collision rend **non concluant** sur cet obstacle, et non
« conforme ». La vérification du scénario d'acceptation 2 de l'histoire 1 — brancher une fiche
porte grande ouverte — reste donc à faire **sur place**, et elle est la seule à pouvoir
trancher. Voir T023.

### PC-03 — l'angle du fond

FR-004 demande le socle « dans l'angle du mur du fond et du mur droit », soit l'angle
nord-est. L'exigence ne nommait aucune des deux parois — seulement l'angle — et restait donc
vraie sur l'une comme sur l'autre.

*Révisé le 2026-09-23 : PC-03 est passé sur la **paroi nord**, à 0,15 m de l'angle — le miroir
exact de sa cote antérieure, qui était à 0,15 m de l'angle sur la paroi est.* Le retrait n'est
pas nul parce qu'un boîtier en saillie a une largeur : le coller à l'angle empêcherait la pose
du couvercle et l'accès au bornier.

L'exigence nomme désormais la paroi, parce que c'est elle qui décide de celle que la traversée
franchit — voir « Pourquoi PC-03 a suivi PC-04 en façade nord » à la section 4.

### Pourquoi 0,30 m d'axe, et non 0,05 m

La hauteur de 0,30 m est une décision du maître d'ouvrage du 2026-09-21, appliquée à tous les
socles de ce circuit. Elle tient à la nature du sol : une dalle béton de garage se lave à
grande eau et reçoit les projections. Descendre à l'axe minimal admis aurait rapproché
l'appareillage de la zone mouillée sans bénéfice d'usage, puisque ces socles servent de
l'outillage posé au sol ou sur établi, non un appareil encastré.

## 3. Le socle de plafond

| Repère | Type | Position | Alimenté par |
|--------|------|----------|--------------|
| PC-05 | socle simple, plafond | 2,70 / 2,70 / 2,75 | CH-07 depuis BD-03, 3,20 m |

PC-05 alimente la **motorisation de la porte sectionnelle**. Il est donc placé là où se trouve
la tête de motorisation : centrée sur la baie, c'est-à-dire sur l'axe du rail à x = 2,70 m.
`hauteurAxe` vaut `null` — la notion n'a pas de sens pour un appareil de plafond.

### Position définitive, et pourquoi elle l'est devenue

Cette position a longtemps été **provisoire**. Deux obstacles occupent le plafond dans le tiers
sud du local, et un seul était relevé :

- le **rail** de motorisation, entièrement relevé — 8 cm de largeur centrés sur la baie,
  2,50 m de profondeur depuis la paroi sud, sous-face à 2,35 m ;
- le **tablier en position ouverte**, qui occupe toute la largeur de la baie sous le plafond et
  non les 8 cm du rail, et dont l'encombrement n'est **toujours pas relevé**.

Vérifier le dégagement du rail ne suffisait donc pas, et FR-053 l'interdisait explicitement.

Ce qui a changé n'est pas un relevé du tablier, mais celui de la **hauteur de passage de la
porte : 2,10 m**. Cette cote **borne** le tablier sans le mesurer :

- il ne dépasse pas la largeur de la baie, soit x de 0,20 m à 5,20 m ;
- il est **guidé par le rail**, donc ne va pas au-delà de sa course de 2,50 m ;
- il dégage le passage de 2,10 m, donc sa sous-face est au-dessus de cette hauteur.

PC-05 est à y = 2,70 m, soit **au nord de la borne de 2,50 m**. Le dégagement est donc
**démontré**, et non simplement non contredit :

| Objet | Extension en y | Marge au nord du majorant |
|-------|----------------|---------------------------|
| PC-05, boîtier de 9 cm compris | **2,555 à 2,645** | **0,055 m** |
| CH-07, segment de plafond au droit de PC-05 | 2,690 à 2,710 | **0,190 m** |

L'implantation de PC-05 est en conséquence **définitive**. FR-053 est satisfaite.

### Ce que cette conclusion ne dit pas

Un majorant n'autorise qu'un seul verdict. Être à l'écart du majorant prouve le dégagement,
parce que l'obstacle réel y est contenu. Le recouper ne prouverait **rien**, le tablier réel
étant plus petit. Aucune conclusion défavorable n'est donc tirée ici, et aucune ne serait
recevable sur cette base.

Le relevé de l'encombrement réel reste utile pour deux cas : un futur cheminement qui
recouperait le majorant, et la position **fermée** du tablier, où rien dans le relevé ne borne
sa saillie vers l'intérieur du local.

## 4. Les traversées et les points extérieurs

| Repère | Percement | Percé derrière | Débouche dans | Socle desservi |
|--------|-----------|----------------|---------------|----------------|
| TV-01 | 5,60 / **2,60** / 0,30 | boîtier de **PC-01** | fond du boîtier de PC-02 | PC-02 (5,80 / **2,60** / 0,30) |
| TV-02 | 5,45 / **5,60** / 0,30 — **paroi nord** | boîtier de **PC-03** | fond du boîtier de PC-04 | PC-04 (5,45 / **5,80** / 0,30) |

**Aucun conduit ne chemine à l'extérieur.** Les deux boîtiers se font dos à travers les 0,20 m
de béton, et la traversée les relie directement par le fond.

### Pourquoi PC-03 a suivi PC-04 en façade nord

*Révision du 2026-09-23.* Le maître d'ouvrage a demandé **PC-04 en façade nord**, dans l'angle.
PC-03 a dû suivre, et ce n'était pas un choix.

La traversée sort du **fond** du boîtier intérieur. Elle franchit donc nécessairement **la paroi
sur laquelle ce boîtier est posé** : un boîtier vissé sur le mur droit ne peut pas laisser
sortir par son fond une traversée du mur du fond, les deux parois étant perpendiculaires.

Déplacer PC-04 seul laissait deux issues, et aucune n'était bonne :

| | Ce qu'il aurait fallu | Ce qui l'interdit |
|---|---|---|
| un conduit extérieur | longer la façade est puis tourner | SC-018 — aucun conduit ne chemine dehors |
| un conduit intérieur propre | une antenne sur la paroi nord, sa boîte, sa traversée | un conduit, une boîte et une jonction de plus pour **un seul socle** |

Les deux points se déplacent donc **ensemble**, et le montage est conservé à l'identique : dos à
dos, traversée unique par le fond, repiquage sur les bornes de PC-03.

**Ce que ça coûte.** L'antenne continue jusqu'à l'angle, tourne sur la paroi nord et descend :
**+0,30 m** sur le chemin le plus long. Le point dimensionnant passe de 8,35 à **8,65 m**, la
chute cumulée de 2,96 à **3,00 %** — marge de 2,00 points sur 5. Le virage à l'angle est un
changement de direction **sans dérivation** : il se traite par un accessoire de conduit, non par
une boîte, et c'est pourquoi le décompte des coudes passe de huit à neuf sans qu'aucune boîte
s'ajoute.

### Le percement au droit, révisé le 2026-09-21

L'intention d'origine était de percer la paroi **au droit** du socle intérieur : le chemin le
plus court, et aucun câble par une ouverture. Une version antérieure de ce document avait conclu
que ce n'était pas réalisable en pose apparente, le boîtier saillie occupant l'axe du percement,
et avait décalé la traversée de 0,20 m avec une boîte de dérivation en pied pour couvrir la
jonction à trois conduits qui en résultait.

**La prémisse était fausse.** Un boîtier saillie n'est pas un obstacle au point de percement :
c'est la boîte elle-même, et il comporte une **entrée en fond**. Le percement se fait donc
derrière lui et débouche dedans. L'intention d'origine est tenue au sens le plus strict, et le
décalage comme les boîtes de pied disparaissent.

Ce que la révision supprime : deux boîtes de dérivation, quatre conduits terminaux, et
**0,90 m de conduit exposé en façade** — CH-07 et CH-10, qui longeaient le mur extérieur à
0,30 m du sol, sous la pluie et les projections. Il ne reste dehors que les deux boîtiers.

### Trois contraintes d'exécution, à lire avant de percer

**1. Le boîtier doit avoir une entrée en fond** (FR-057). Condition de tout le schéma, confirmée
par le maître d'ouvrage sur les boîtiers retenus. Un boîtier à entrées latérales seules
rendrait le décalage nécessaire.

**2. Le percement est en biais vers le bas** (FR-058). C'est la contrainte la plus facile à
manquer, et la plus coûteuse. Les deux boîtiers étant dos à dos **à la même hauteur d'axe**, le
geste naturel est de percer horizontalement — et un percement horizontal annule la pente vers
l'extérieur qu'exigent FR-028 et FR-055. À 0,30 m du sol, près d'une dalle lavée à grande eau,
cette pente est ce qui empêche l'eau de cheminer vers l'intérieur.

Le percement entre donc **haut** dans le boîtier intérieur et sort **bas** à l'extérieur. La
hauteur d'un boîtier saillie offre 5 à 6 cm de jeu vertical sur 0,20 m de paroi, soit une pente
de l'ordre de 25 % : très largement suffisant.

### La cote de perçage, et pourquoi elle n'est pas encore écrite

*Ajouté le 2026-09-22 avec le guide de perçage.*

La pente était déclarée par un **booléen** — `penteVersExterieur: true` — et V18 le contrôlait
comme tel. Un booléen se vérifie **après** le perçage, à l'eau. Il ne se perce pas.

Depuis, une traversée porte sa **géométrie** : `position` est l'**axe** du perçage, et la mèche
entre un demi-dénivelé au-dessus, ressort un demi-dénivelé au-dessous. C'est ce qui permet à
deux boîtiers dos à dos, à la même hauteur d'axe, de recevoir un perçage en biais sans qu'aucun
des deux ne sorte de son enveloppe.

| | Cote |
|---|---|
| Axe du perçage | la position déclarée de la traversée |
| Entrée, boîtier intérieur | axe **+** dénivelé / 2 |
| Sortie, boîtier extérieur | axe **−** dénivelé / 2 |
| Dénivelé | **à établir** |

**Le dénivelé reste `null` dans les données**, et ce n'est pas un oubli. Les 5 à 6 cm annoncés
ci-dessus sont dérivés de la hauteur d'un boîtier saillie, qui dépend du produit retenu. Le
figer par commodité reviendrait à écrire une valeur plausible là où une valeur est inconnue —
ce que le Principe I proscrit, et ce que tout le reste de ce dossier s'applique à ne pas faire.

V18 borne désormais le dénivelé par la **réserve d'altitude** du boîtier qui reçoit la
traversée : un dénivelé plus grand que l'enveloppe ferait sortir le perçage de la boîte qu'il
dessert. La borne est calculée, pas écrite ici : elle suivra le boîtier choisi.

*Tant que la cote n'est pas établie, la maquette signale la traversée comme non cotée et NE LA
DESSINE PAS HORIZONTALE — le repli naturel figurerait exactement la faute que cette page met en
garde de commettre.*


**3. Percer avant de poser le boîtier** (FR-059). Une fois le boîtier fixé sur la paroi, son
fond n'est plus accessible à la scie cloche. L'ordre est donc : tracer, percer en biais,
présenter le conduit, puis fixer le boîtier.

### Le point de sortie extérieur n'est pas une cote saisie

La sortie sur le **nu extérieur** est à x = 5,80 m. Cette valeur n'est écrite nulle part dans
les données : elle est **dérivée** de la position de la traversée et de l'épaisseur de paroi.
Saisir 5,80 à la main créerait une seconde source de vérité, qui se désaccorderait au premier
changement d'épaisseur relevé. Elle coïncide avec la position déclarée du socle extérieur, ce
qui est exactement ce que « dos à dos » signifie.

### Les traversées et la porte de service

TV-01 est à y = **2,60 m** depuis le 2026-09-21, soit **0,20 m au nord du bord de la porte de
service**, qui s'arrête à 2,40 m.

*Cette cote a fait l'aller-retour. La traversée était d'abord à 2,50 m, soit 0,10 m de la baie —
la cote la plus serrée de tout le tracé. L'entrée par le haut l'a portée à 3,00 m, ce qui a
sextuplé la marge. Le rapprochement de l'axe la ramène à 0,20 m : c'est le **double** de la cote
d'origine, et non son retour, mais la marge confortable de 0,60 m est perdue.*

Aucun conduit ne franchit de baie. La règle V19 le contrôle sur les **dix** segments du tracé
contre les trois baies du relevé : aucun franchissement. Ce qu'elle ne contrôle pas est le
débattement du vantail, qui n'est pas relevé — voir le point de vigilance de PC-01.

### FR-055 — le percement au-dessus du niveau fini extérieur

**Cette vérification ne peut pas être close sur le dossier. Elle est à faire sur place.**

Les deux percements sont à z = 0,30 m, cote mesurée depuis le **sol fini intérieur**, qui est
l'origine du repère du projet. FR-055 demande que le point reste au-dessus du **niveau fini du
sol extérieur** au droit de chaque traversée.

Or le relevé ne comporte aucune cote du niveau extérieur, ni sa différence avec le niveau
intérieur. La conclusion dépend donc d'une donnée absente, et aucun calcul sur les données
disponibles ne peut la produire. L'écrire autrement — « conforme, le percement est à 0,30 m » —
serait confondre une cote intérieure avec une cote extérieure.

**Ce qui est acquis** : la pente vers l'extérieur est déclarée sur les deux traversées et
contrôlée par la règle V18. À 0,30 m, soit près du sol, cette pente cesse d'être un
raffinement : c'est elle qui empêche l'eau de cheminer vers l'intérieur (FR-028, FR-055).

**À vérifier au percement, et à consigner ici** :

| Traversée | Niveau extérieur au droit du percement | Garde sous le percement | Verdict |
|-----------|----------------------------------------|-------------------------|---------|
| TV-01 | .......... m | .......... m | .......... |
| TV-02 | .......... m | .......... m | .......... |

Si la garde s'avère nulle ou négative — sol extérieur remblayé au-dessus de 0,30 m — les deux
traversées et les deux socles extérieurs DOIVENT être remontés, et la présente implantation
reprise. C'est le seul point du tracé qui reste suspendu à une cote non relevée.

## 5. Réservation pour le conduit de la borne

La ligne de la borne de recharge (`004-borne-recharge`) est **entièrement dédiée**, conduit
compris : la constitution l'a arrêté en v1.5.0. Son conduit ne peut donc pas partager celui des
prises, et il devra longer les mêmes parois aux mêmes endroits — c'est la seule pénétration
possible depuis le tableau divisionnaire.

**Réservation exigée par FR-047 : 60 mm de largeur libre** le long de l'antenne et des deux
descentes, du côté indiqué ci-dessous.

> **Révision du 2026-09-21.** Cette réservation a été établie pour le seul conduit de la borne.
> La planification de `003-eclairage` a montré que la paroi est portera **trois** circuits. Le
> tracé de l'éclairage a été porté au **plafond** pour ne pas disputer cette place, de sorte que
> les 60 mm restent destinés à la borne — mais la contrainte réelle n'est pas une largeur :
> c'est la **hauteur de 0,25 m** disponible au-dessus du linteau de la porte de service, entre
> 2,50 et 2,75 m, dont les prises occupent 2,60 m. Voir FR-063.

| Tronçon | Emprise des prises | Bande réservée |
|---------|--------------------|----------------|
| CH-01, montée depuis TD-01 | paroi est, y 0,70, z 1,50 → 2,60 | 60 mm **au nord** de l'axe du conduit |
| CH-01, antenne | paroi est, z 2,60, y 0,70 → 3,00 | 60 mm **sous** l'axe du conduit |
| CH-02, descente vers PC-01 | paroi est, y 3,00, z 2,60 → 0,30 | 60 mm **au sud** de l'axe du conduit |
| CH-03, antenne | paroi est, z 2,60, y 3,00 → 5,45 | 60 mm **sous** l'axe du conduit |
| CH-03, descente vers PC-03 | paroi est, y 5,45, z 2,60 → 0,30 | 60 mm **au sud** de l'axe du conduit |

### Pourquoi 60 mm, et pourquoi maintenant

Le conduit de la borne sera **plus gros** que l'IRL 20 des prises : ses conducteurs sont
dimensionnés pour 32 A, contre le calibre bien moindre de ce circuit. La réservation retenue,
60 mm, couvre un conduit de diamètre nettement supérieur **plus** l'entraxe de ses colliers.

Le moment de la réserver est **maintenant**, à la pose des prises, et non plus tard. En pose
apparente, un conduit posé fixe définitivement la place disponible autour de lui : le reprendre
pour faire passer un voisin signifie dévisser les colliers, percer de nouveaux trous dans le
béton et reprendre la fixation sur des points affaiblis. Poser les colliers des prises à 60 mm
du bord utile coûte zéro à l'exécution ; le rattraper après coup coûte la reprise complète du
tronçon.

Cette réservation est une **contrainte d'exécution**, à relire sur ce document avant de percer
le premier trou. Elle ne figure pas dans les données du tracé : ce n'est pas un objet posé,
c'est un vide à préserver.
