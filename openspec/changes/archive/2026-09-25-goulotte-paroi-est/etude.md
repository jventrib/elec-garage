# Étude — une goulotte à la place de CH-02 / CH-03 et CH-B2 / CH-B3

**Changement** : `goulotte-paroi-est` | **Circuits** : `c-prises`, `c-eclairage`, `c-borne` |
**Date** : 2026-09-24

Cette note porte le **raisonnement** de l'étude. Les valeurs conclues vivent une seule fois, dans
les apports. Les décisions de conception sont dans [design.md](design.md), les exigences dans les
deltas de spec. Chaque grandeur porte son **origine** : `relevée`, `calculée`, `dérivée`, `décidée`
ou `normative`. **Aucune valeur normative n'est renseignée de mémoire.**

Les chiffres « avant » et « après » sont **mesurés sur la maquette** : le socle a calculé l'état du
commit `ba5193a`, puis celui du changement appliqué. Ils ne sont pas estimés. Là où ils s'écartent
de l'estimation faite en préparant l'étude, l'écart est dit.

## 1. La question

Sur la paroi est, deux conduits courent en parallèle de GL-01 jusqu'à l'angle nord-est. Ils sont
superposés dans la bande de 0,25 m qui sépare le linteau de la porte de service (2,50 m) du
plafond (2,75 m) : le tronc CH-02 à 2,60 m, la ligne de la borne CH-B2 à 2,64 m. Au-delà de BD-01,
CH-03 et CH-B3 font de même jusqu'à l'angle. La bande porte **exactement deux conduits**, et la
montée CH-04 de BD-01 à BD-03 interdit tout autre passage. La ligne de la borne **traverse BD-01**,
dont le volume n'est pas établi sur cote produit (réserve 3.3).

Le maître d'ouvrage demande s'il vaut mieux poser une goulotte.

## 2. La géométrie retenue

*Décisions du maître d'ouvrage du 2026-09-24 : le tracé, puis la section — § 5.*

| Grandeur | Valeur | Origine |
|---|---|---|
| Profilé | **90 × 40 mm**, capot démontable, même gamme que GL-01 (120 × 60) | décidée — § 5 |
| Pose | **collé au plafond**, à plat sur la paroi, z 2,66 → 2,75 m, axe à 2,705 m | décidée |
| Garde au linteau | 0,16 m sous le profilé | dérivée |
| Parcours | paroi est y 0,70 → 5,60, **un angle intérieur**, paroi nord x 5,60 → 4,50 | décidée |
| Longueur | **6,00 m** | calculée |
| Raccord à GL-01 | **en T réduit** 120 × 60 / 90 × 40 à y = 0,70 m, sous le plafond ; GL-01 y monte déjà | relevée |

Ce qui en sort, et par où :

| Départ | Face | Point | Conduit |
|---|---|---|---|
| Vers BD-05, au plafond | **face avant**, par un coude à 90° vers le plafond | y 2,60 | CH-07, 2,86 m |
| Vers BD-04 | **dessous** | y 2,60 | CH-05, 1,56 m au lieu de 1,50 |
| Vers PC-03 | dessous, paroi nord | x 5,45 | CH-03, réduit à sa descente, 2,36 m |
| Vers BR-01 | dessous, extrémité ouest | x 4,50 | CH-B3, réduit à sa descente, 3,36 m |
| Vers EL-03 | **fond** | y 2,60 | TV-L2, en pente |

**Le coude du départ de plafond, AC-01, est un accessoire de conduit.** Aucune connexion ne s'y
fait, et il est repéré comme tel. Il reprend le rôle de BD-03, qui disparaît avec la montée CH-04,
laquelle n'a plus d'objet.

**TV-L2 vers EL-03.** La traversée partait du fond de BD-01, à z 2,60 m, soit **sous** la goulotte.
Voie retenue : la percer **depuis le fond de la goulotte**, entrée intérieure à **2,705 m**, au
milieu du profilé, et utiliser la pente vers l'extérieur déjà exigée pour ressortir à **2,60 m**.
EL-03 garde sa hauteur, sous le débord extérieur, à 0,15 m sous le niveau du plafond.

| Grandeur | Valeur | Origine |
|---|---|---|
| Axe du perçage | 2,6525 m, au ras du dessous du profilé | dérivée |
| Dénivelé | **0,105 m** sur 0,20 m de paroi | dérivée — de la goulotte et de EL-03 |
| Entrée | 2,705 m, dans le profilé (2,66 → 2,75) | calculée |
| Sortie | 2,60 m, au droit de EL-03 | calculée |

V18 bornait le dénivelé par la **réserve d'altitude** du boîtier qui reçoit la traversée : la mèche
entre au-dessus de l'axe et sort au-dessous, et les deux doivent rester dans l'enveloppe. Ici, rien
ne reçoit l'axe : l'entrée débouche dans un profilé, la sortie à l'extérieur. La règle est étendue
à ce cas (design D5). **L'entrée doit tomber dans le profilé**, ce qu'elle fait, 4,5 cm au-dessus de
son dessous et 4,5 cm sous le plafond. Dans le 90 × 40, l'axe du perçage est au ras du dessous du
profilé : la traversée s'y raccorde par son entrée (design D5). *Repli*, si le perçage en biais de
10,5 cm se révélait
impraticable : une boîte sous la goulotte pour le seul départ en fond.

## 3. Ce qu'on gagne

### 3.1 Les tubes

| Article | Avant | Après | Écart | Ce qui change |
|---|---|---|---|---|
| IRL 25 | 12,74 m | **4,92 m** | **−7,82 m** | CH-02 (1,90), CH-B2 (1,90) et 4,08 m de CH-B3 disparaissent ; CH-05 prend 0,06 m |
| IRL 20 | 18,30 m | **15,02 m** | **−3,28 m** | 3,09 m de CH-03, CH-04 (0,15) ; CH-07 perd 0,04 m, parti de la face avant |
| Goulotte 120 × 60 | 1,12 m | **1,12 m** | — | GL-01, inchangée |
| Goulotte 90 × 40 | — | **6,00 m** | **+6,00 m** | GL-02, un angle intérieur et un T réduit |
| Changements de direction | 8 | **5** | −3 | CH-03 et CH-B3 ne tournent plus : la goulotte tourne pour eux |

*Origine : **calculée** par `npm run fournitures`.* L'estimation de préparation donnait −7,90 et
−3,15 m. Elle avait omis CH-04 et le départ de CH-07 par la face avant, et elle supposait les
descentes parties de 2,60 m : elles partent du dessous du profilé, à 2,66 m.

### 3.2 Ce qui disparaît du tracé

- Les **parcours parallèles**, et la contrainte d'une bande à exactement deux conduits. La bande
  porte désormais **un seul profilé**, jointif au plafond.
- **BD-01**. Ses connexions passent sous le capot de GL-02, dans le **groupe de connexions** OC-02. Ce qui lève
  la **réserve 3.3**, le volume de BD-01 sur cote produit. Elle est remplacée par le **remplissage
  de la goulotte**, condition 6 de la constitution, à justifier sur la fiche produit : GL-02 porte
  quatorze conducteurs, dont les trois de la borne en un câble.
- La décision « CH-02 en IRL 25 » n'a plus d'objet. CH-05 reste en IRL 25, à neuf conducteurs.

### 3.3 Les connecteurs

OC-02 reçoit exactement ce que BD-01 recevait, **conducteur par conducteur** : 5 × 221-415. Pour
les prises, phase, neutre et PE font chacun quatre brins : l'arrivée, CH-05, CH-07 et CH-03. Pour
l'éclairage, neutre et PE font aussi quatre brins, vers CH-05, CH-07 et EL-03. OC-01 est inchangé :
2 × 221-413 et 3 × 221-415. La ligne de la borne n'en reçoit aucun, ni dans l'un ni dans l'autre.
*Origine : **dérivée** — `tests/connecteurs.test.js`.*

## 4. Ce que cela coûte — le point décisif

### 4.1 La ligne de la borne cohabite sur 7,12 m

La ligne de la borne cohabiterait sur **7,12 m** avec les deux autres circuits : 1,12 m de GL-01 et
6,00 m de GL-02. Elle cohabite aujourd'hui sur 1,12 m. Son parcours total passe de 10,48 à
**10,61 m**, car les conducteurs montent à l'axe du profilé avant de redescendre. La chute cumulée
passe de 2,31 à 2,32 %.

La constitution admet cette cohabitation : câble à enveloppe propre, transit sans coupure. Mais le
**facteur de correction de groupement devient exigible sur toute la portion**. La note de calcul
de la borne le déclarait « sans objet, démontré par le tracé » : **c'était déjà faux** sur les
1,12 m de GL-01, depuis l'amendement v1.14.0. L'erreur est corrigée et consignée au § 2 de
`dossier/004-borne-recharge/note-de-calcul.md`.

| Question | Valeur | Origine | Référence | État |
|---|---|---|---|---|
| Lettre de sélection d'un câble en goulotte | *(à renseigner)* | **Normative** | *(clause : ..............)* | à confirmer — réserve 1.8 |
| Facteur de groupement, trois circuits dans un profilé | *(à renseigner)* | **Normative** | *(clause : ..............)* | à confirmer |
| `Iz` du 10 mm² à 32 A, avec les deux | *(à renseigner)* | **Normative** | *(clause : ..............)* | **bloquant pour l'achat** |

**La section de la borne pourrait en dépendre.** Tant que ces lignes manquent, rien ne démontre que
le 10 mm² tient 32 A sur 7,12 m de goulotte partagée.

### 4.2 La forme de la ligne de la borne — contradiction relevée à l'implémentation

*Constat nouveau, tranché le 2026-09-24 — voir la fin de ce paragraphe.* Dans une goulotte partagée, la ligne DOIT être un **câble à
enveloppe propre**, par la spec « Goulotte support partagé » et la décision du maître d'ouvrage.
Mais la note de calcul de la borne a **écarté le câble** le 2026-09-22 : un 3G10 de 16,5 à 18,5 mm
exige, par la règle du tiers, de 28,6 à 32,0 mm intérieurs, et il n'entre donc pas dans l'IRL 25 de
la descente CH-B3. Or la ligne est tirée **d'un seul tenant**. Elle ne peut pas être un câble dans
la goulotte et des conducteurs isolés dans le conduit, et la couper pour changer de forme serait
une connexion, qu'elle ne reçoit pas.

La contradiction existait sur 1,12 m depuis l'amendement v1.14.0. La goulotte la porte sur 7,12 m,
et la rend impossible à ignorer. Deux voies se présentent, que la maquette ne tranche pas :

- une **descente de plus fort calibre**. La bande de la porte de service, qui plafonnait la ligne à
  l'IRL 32, ne s'applique plus : CH-B3 court tout entière sur la paroi nord. Il reste à vérifier la
  garde à la fenêtre, à 0,20 m, et le passage sous l'allège ;
- **prolonger la goulotte** jusqu'à la borne, sur la paroi nord.

**Décision du maître d'ouvrage du 2026-09-24 : câble 3G10 sur tout le parcours, descente en
IRL 25**, contre l'avis de cette étude, qui recommandait un tube de plus fort calibre. *Motif* : l'IRL
32 est très difficile à trouver, et demande des équipements et un outillage spécifiques. C'est une
**dérogation au Principe III** (réserve 2.7) : aucun IRL 25 ne tient la règle du tiers pour ce
câble, et le tirage lui-même est à éprouver sur un tronçon avant l'achat. Le métré devient 10,48 m
de câble 3G10.

### 4.3 Les prises et l'éclairage

La réserve **1.6 (b)** demandait si la portion en goulotte, « 1,12 m sur 14 m », pouvait être
négligée dans la détermination de `Iz`. **Elle tombe** : le tronc court désormais sous capot sur
près de trois mètres par conducteur, jusqu'à 6 m. Il faut la **lettre de sélection** des conducteurs
isolés en goulotte, réserve 1.6 (a), et le **groupement de trois circuits** dans le profilé.

| Point | Avant | Après | Origine |
|---|---|---|---|
| PC-04, point dimensionnant des prises | 8,65 m, 3,00 % cumulée | **8,86 m, 3,04 %** | calculée |
| EL-01b, point dimensionnant de l'éclairage | 8,20 m, 1,76 % | **8,18 m, 1,76 %** | calculée |
| BR-01 | 10,48 m, 2,31 % | **10,61 m, 2,32 %** | calculée |

Les trois limites tiennent, avec 1,96 point de marge au plus serré. Les conducteurs montent
d'abord à l'axe du profilé, à 2,705 m, et les descentes partent de son dessous : PC-01 à PC-04
prennent 0,21 m. Le parcours de plafond part de la face avant, et le plafonnier perd 0,025 m.

### 4.4 La condition 4, l'eau

Un profilé **horizontal** sur une paroi froide retient l'eau en partie basse. GL-01, verticale,
la conduisait vers le tableau ; GL-02 la garde. Il faut **percer son fond** pour évacuation aux
points bas, ou la poser avec une **légère pente** vers l'angle nord-est. Et rien ne doit couler
vers GL-01 et le tableau. L'exigence est portée par la spec des six conditions et par
l'instruction de pose.

### 4.5 La condition 5, les chocs

Le profilé est hors d'atteinte, son dessous à 2,66 m, et le vantail de la porte de service ouvre
vers l'extérieur (relevé du 2026-09-23). **Tenue.**

### 4.6 Le socle

Une goulotte à **deux** organes de connexion rendait **ambiguë** la dérivation des connecteurs :
`noeudsDe` (`src/geometrie/connecteurs.js`) attribuait à un organe tous les nœuds de son profilé,
et refusait de choisir entre deux. **Décision de design : GL-02 est un cheminement distinct**,
qui commence au T sur GL-01. Chaque organe reçoit les nœuds du profilé qui le porte, **hors des
bouts partagés** avec un autre profilé (design D2). La goulotte a demandé trois autres
extensions : le raccordement par les faces, la chaîne le long de l'axe et la longueur parcourue
sous capot (D1, D3). Sans la chaîne, OC-02 comptait six brins par conducteur au lieu de quatre, et
le métré du 1,5 mm² gagnait 30 m de fil qui ne se posent pas.

## 5. Les connexions sous capot — décision du 2026-09-24

*Question posée après l'application : la section de GL-02 peut-elle être plus petite que celle de
GL-01 ?* Le remplissage ne la fixe pas. Les onze conducteurs occupent entre 95,9 et 98,9 mm², en
dérivant de la note de l'éclairage (§ 3.1) la section des huit de la composition de référence. Le
câble de la borne en occupe 214 à 269 mm², soit environ 5 % d'un 120 × 60 nominal. **Ce qui la
fixait, c'était l'organe OC-02**, un boîtier à enveloppe propre que la condition 2 de la
constitution exigeait autour de chaque connexion. Son volume déclaré, 60 × 60 × 35 mm, était
recopié de OC-01, et n'était la cote d'aucun produit.

Les sources consultées attribuent à la NF C 15-100 une exigence moindre :
- connexions admises dans les goulottes lorsque leurs dimensions intérieures le permettent, sans
  épissure ;
- accessibilité, § 526.3 ;
- IP2X ou IPXXB conducteurs en place si le couvercle se démonte sans outil, § 529.3.

*Sources secondaires, à confirmer sur le texte* — réserve 1.11.

**Décision du maître d'ouvrage du 2026-09-24 : la contrainte est abandonnée, les connexions sont
admises en goulotte.** Constitution v1.15.0. OC-01 et OC-02 restent déclarés, comme **groupes de
connexions repérés**, mais sans volume ni entrées. La section de GL-02 n'est plus bornée que par :
- l'entrée de l'IRL 25 par le dessous, soit une profondeur d'au moins 40 mm environ ;
- le câble de la borne, 18,5 mm au plus, et son rayon de courbure à l'angle ;
- la place des cinq bornes et de leur réserve de fil ;
- la pente de TV-L2, qui croît quand la hauteur diminue.

| Hauteur du profilé | Axe | Dénivelé de TV-L2 | Garde au linteau |
|---|---|---|---|
| 120 mm (GL-01) | 2,69 m | 0,09 m | 0,13 m |
| 80 mm — conseillé | 2,71 m | 0,11 m | 0,17 m |
| **90 mm — retenu** | **2,705 m** | **0,105 m** | **0,16 m** |
| 60 mm | 2,72 m | 0,12 m | 0,19 m |
| 40 mm | 2,73 m | 0,13 m | 0,21 m |

**Section conseillée par la présente étude le 2026-09-24 : 80 × 40 mm. Section retenue par le maître
d'ouvrage le 2026-09-25 : 90 × 40 mm**, la profondeur conseillée, et 10 mm de hauteur de plus. Ce que
l'étude disait du 80 × 40 vaut a fortiori pour lui :
- **40 mm de profondeur** suffisent à l'entrée de l'IRL 25 par le dessous et au câble de la borne,
  couché au fond.
- **80 mm de hauteur plutôt que 60** laissent de la place à la jonction principale : cinq bornes,
  leur réserve de fil, quatorze conducteurs et le câble de la borne, tenu à l'écart des bornes.
- **La pente de TV-L2** passe à 0,105 m, **la garde au linteau** à 0,16 m.
- **Le coût** : une seconde référence de profilé et une **jonction en T réduite** 120 × 60 / 90 × 40.
  Si la gamme retenue n'en propose pas, revenir au 120 × 60 plutôt que d'improviser la jonction.

*À vérifier au catalogue avant l'achat* : la section intérieure réelle du 90 × 40, son taux de
remplissage admissible (condition 6), le rayon de courbure du câble de la borne à l'angle intérieur,
et l'existence du T réduit.

## 6. Recommandation

**Faisable, et la pose en est simplifiée** : un seul profilé au lieu de deux conduits superposés,
plus de boîte à volume incertain au-dessus de la porte, onze mètres de tube en moins et trois
coudes de moins.

Mais **le choix n'est pas réversible sans coût** une fois le tube et le profilé achetés. Il DOIT
être **conditionné** à deux confirmations :

1. **`Iz` de la borne en goulotte, avec groupement**, confirmé sur le texte. La section pourrait
   en dépendre ;
2. **l'essai de tirage du 3G10 dans l'IRL 25** de la descente, et la résorption de la
   dérogation au Principe III que ce choix ouvre.

Tant qu'elles manquent, le changement s'applique **à la maquette** avec une **réserve bloquante
d'achat**, comme le seuil de l'IRL 20 aujourd'hui.
