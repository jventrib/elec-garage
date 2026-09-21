# Spec Delta

## MODIFIED Requirements

### Requirement: Goulotte à capot démontable, six conditions

*Origine : `005-automatisation-locale` FR-027 et FR-034. Constitution v1.13.0, amendement
adopté le 2026-09-22. Étendu le 2026-09-24 au profilé horizontal de la paroi est
(changement `goulotte-paroi-est`), et condition 2 assouplie par la constitution v1.15.0.*

Le parcours des conducteurs ajoutés DOIT respecter le **mode de pose imposé**, dont
la constitution admet depuis sa **v1.13.0** qu'il soit satisfait par un profilé de goulotte à
capot démontable, sous six conditions cumulatives.

La goulotte retenue DOIT satisfaire les **six conditions** de la constitution, dans leur
rédaction v1.15.0, chacune étant vérifiable à la pose : capot démontable sans destruction ;
connexion par un dispositif de connexion, sans épissure, **IP2X ou IPXXB conducteurs en place si le
capot se dépose sans outil** ; repère lisible sans déposer le capot ; pas de rétention d'eau, ni
de déversement dans le tableau situé dessous ; parcours intérieur hors zones de choc ;
remplissage justifié sur la fiche produit.

Un profilé posé **à l'horizontale** sur une paroi froide retient l'eau en partie basse, là où un
profilé vertical la conduit vers le bas. La condition 4 DOIT y être satisfaite par un **percement
du fond** aux points bas, ou par une **pente** de pose, et l'eau NE DOIT PAS en être conduite vers
un autre profilé qui déverserait dans le tableau.

#### Scenario: Vérification de la goulotte à la pose
- **WHEN** la goulotte est posée
- **THEN** les six conditions de la constitution y sont vérifiées, chacune séparément

#### Scenario: Profilé horizontal sur paroi froide
- **WHEN** un profilé est posé à l'horizontale sur une paroi où la condensation est tenue pour probable
- **THEN** son fond est percé aux points bas ou sa pose est pentée, et rien ne s'en écoule vers le tableau

### Requirement: Goulotte support partagé

*Origine : `005-automatisation-locale` FR-035. La goulotte étant désormais déclarée comme un
cheminement, les règles du support partagé s'énoncent sur le cheminement et non sur un
composant. Étendue le 2026-09-24 à la goulotte GL-02 de la paroi est — décision du maître
d'ouvrage, changement `goulotte-paroi-est`.*

Les goulottes sont des cheminements **partagés**. GL-01 monte du tableau au plafond, et GL-02 court
au plafond de la paroi est puis de la paroi nord. Elles portent le tronc des prises et de
l'éclairage, et la ligne de la borne **en transit**. Les règles de repérage d'un support à
plusieurs circuits s'y appliquent à l'identique. Chacune DOIT déclarer les circuits qu'elle porte,
au même titre que tout cheminement.

La ligne de la borne **transite** les goulottes et n'y reçoit **aucune connexion**. Aucun organe de
connexion d'une goulotte NE DOIT porter de conducteur du circuit de la borne.

*Corrigé en cours d'implémentation : l'exigence d'origine affirmait que la ligne de la borne
« conserve son conduit » dans la goulotte. C'était faux dans le tracé arrêté : la ligne y
franchissait 0,04 m sans aucun conduit. Depuis le 2026-09-24, elle court **7,12 m** sous capot :
1,12 m de GL-01 et 6,00 m de GL-02.*

La ligne de la borne DOIT y être **un câble à enveloppe propre**, et non des conducteurs isolés
nus. Décision du maître d'ouvrage. Cette exigence dépend de l'amendement du Principe IV, dont la
dédicace du conduit est aujourd'hui énoncée sans référence de clause. *Décision du maître
d'ouvrage du 2026-09-24* : la ligne est un **câble 3G10** sur tout son parcours, goulottes et
descente CH-B3 comprises. Dans la descente, maintenue en IRL 25, le câble ne tient pas la règle du
tiers : c'est une **dérogation au Principe III**, écrite et datée, qui DOIT être résorbée avant la
clôture, et dont le tirage DOIT être éprouvé avant l'achat.

#### Scenario: Ligne de la borne dans la goulotte
- **WHEN** la ligne de la borne transite par une goulotte
- **THEN** elle y est un câble à enveloppe propre et n'y reçoit aucune connexion

#### Scenario: Circuits déclarés par la goulotte
- **WHEN** une goulotte est déclarée
- **THEN** elle porte la liste des circuits qu'elle achemine, comme tout cheminement

#### Scenario: Câble de la borne dans sa descente
- **WHEN** le câble 3G10 est tiré dans la descente CH-B3 en IRL 25
- **THEN** la dérogation au Principe III est écrite, le tirage a été éprouvé sur un tronçon avant l'achat, et la fiche du conduit porte la condition du câble, n = 1

### Requirement: Réservation de place pour les parcours parallèles

*Origine : `002-prises-de-courant` FR-047 et FR-063 ; `004-borne-recharge` FR-021 et FR-036.
Principe IV de la constitution. Décision du maître d'ouvrage du 2026-09-22. **Réécrite le
2026-09-24** : la bande porte la goulotte GL-02, et non plus deux conduits superposés (changement
`goulotte-paroi-est`).*

L'implantation des cheminements DOIT réserver la place des **autres parcours qui longeront le même
tracé**. Deux conduits en saillie côte à côte demandent leur propre largeur et leurs propres
fixations, ce que la pose encastrée n'aurait pas exigé.

Sur la paroi est, la **bande utile au-dessus de la porte de service ne fait que 0,25 m**, entre le
linteau à 2,50 m et le plafond à 2,75 m. Elle portait deux conduits superposés, le tronc à 2,60 m
et la ligne de la borne à 2,64 m, et il n'y restait pas la place d'un troisième. Elle DOIT désormais
porter **un seul profilé**, la goulotte GL-02, **jointive au plafond**, où les trois circuits
cheminent ensemble. Son dessous DOIT garder un jeu d'au moins 0,010 m au linteau. Aucun conduit
NE DOIT plus courir à l'horizontale dans la bande.

#### Scenario: Franchissement de la porte de service
- **WHEN** le tronc et la ligne de la borne franchissent la porte de service
- **THEN** ils le font dans la goulotte collée au plafond, dont le dessous garde son jeu au linteau

#### Scenario: Troisième conduit
- **WHEN** un conduit est envisagé à l'horizontale dans la bande au-dessus de la porte de service
- **THEN** il est refusé : il longerait le profilé, et ce qui doit cheminer là entre dans la goulotte

### Requirement: Raccordement latéral et portée de la règle d'extrémité pendante

*Décision du maître d'ouvrage. La règle d'extrémité pendante énonce une vérité des **conduits** et
l'appliquait à tout cheminement. Étendue le 2026-09-24 au raccordement par les faces d'un
profilé.*

Un cheminement DOIT déclarer son **mode de raccordement** : par les **extrémités**, comme un
conduit, ou **latéralement**, comme une goulotte à capot démontable.

Un cheminement à raccordement **latéral** DOIT admettre qu'un autre cheminement s'y raccorde en
tout point de son parcours, et non à ses seuls bouts. Il DOIT l'admettre **par l'une de ses
faces** — dessous, face avant, fond — et non sur son seul axe : le raccordement vaut pour tout
point posé dans le volume de sa section. Les conducteurs sous le capot courent le long du profilé,
et en sortent par la face.

La règle interdisant une **extrémité pendante** NE DOIT s'appliquer qu'aux cheminements à
raccordement **par les extrémités**. Sur un cheminement à raccordement latéral, une extrémité qui
ne rejoint rien n'est **pas** un défaut : elle marque l'endroit où le profilé s'arrête, et non un
point d'où des conducteurs sortiraient dans le vide. Un conduit dont l'extrémité débouche dans le
volume d'un profilé latéral est raccordé.

Rationale : la règle vise des conducteurs qui déboucheraient sans enveloppe ni destination. Sur un
profilé dont les conducteurs entrent et sortent par les côtés, la longueur du produit posé n'a pas
à coïncider avec celle du parcours des conducteurs. Maintenir la règle en l'état obligerait soit à
tronquer le profilé dans le modèle — la maquette cesserait de montrer ce qui est posé —, soit à
inventer un objet à son extrémité haute.

#### Scenario: Raccordement en cours de parcours
- **WHEN** un cheminement se raccorde à une goulotte ailleurs qu'à l'une de ses extrémités
- **THEN** le raccordement est admis, et aucun défaut n'est signalé

#### Scenario: Raccordement par une face
- **WHEN** un conduit part du dessous d'une goulotte horizontale, à une demi-largeur de son axe
- **THEN** il y est raccordé, et ses conducteurs parcourent le profilé jusqu'à l'aplomb du départ

#### Scenario: Extrémité juste hors du profilé
- **WHEN** l'extrémité d'un conduit s'arrête sous le profilé sans y entrer
- **THEN** elle est pendante, et le défaut est signalé

#### Scenario: Extrémité haute d'un profilé
- **WHEN** une goulotte monte au-delà du point où ses conducteurs la quittent
- **THEN** son extrémité libre n'est pas un défaut, le profilé étant représenté à sa longueur posée

#### Scenario: Extrémité pendante d'un conduit
- **WHEN** un conduit a une extrémité qui ne rejoint ni composant, ni enveloppe, ni traversée, ni autre cheminement
- **THEN** le défaut est signalé, la règle gardant toute sa portée sur les cheminements à raccordement par les extrémités

### Requirement: Toute connexion dans une boîte

*Origine : `002-prises-de-courant` FR-027. Critère mesurable : SC-011. Étendu par la
constitution v1.13.0, qui admet les connexions sous capot de goulotte, puis par la v1.15.0, qui
n'y exige plus d'enveloppe propre — décision du maître d'ouvrage du 2026-09-24.*

Une **boîte de dérivation** DOIT être posée à chaque jonction de parcours, à chaque
dérivation, et à chaque changement de direction **qui ne se traite pas par un accessoire de
conduit** ni par une goulotte. Toute connexion DOIT se faire dans une boîte de dérivation, dans
une enveloppe d'appareillage, ou **sous le capot d'une goulotte** aux conditions de la
constitution — jamais dans un conduit, jamais par épissure, et jamais derrière un socle. Aucune
connexion NE DOIT être rendue inaccessible par les travaux.

#### Scenario: Recensement des connexions
- **WHEN** les connexions de l'installation sont recensées
- **THEN** 100 % d'entre elles se trouvent dans une boîte de dérivation, une enveloppe d'appareillage ou sous le capot d'une goulotte, et aucune n'a été rendue inaccessible par les travaux

#### Scenario: Changement de direction sans connexion
- **WHEN** un changement de direction ne porte aucune dérivation et aucune connexion
- **THEN** il n'appelle pas de boîte de dérivation

### Requirement: Typologie des enveloppes de cheminement

*Découle de la constitution v1.13.0 et de l'exigence de boîte « à chaque changement de
direction qui ne se traite pas par un accessoire de conduit ». Révisée par la v1.15.0 : une
goulotte admet les connexions, et l'organe de connexion n'est plus une enveloppe.*

Le projet DOIT distinguer les rôles que la constitution distingue, et NE DOIT PAS les réunir
sous une même déclaration. Cinq rôles sont tenus :

| Rôle | Achemine | Admet une connexion | Enveloppe une connexion |
|---|---|---|---|
| conduit IRL | oui | non | non |
| goulotte à capot démontable | oui | oui | oui, sous ses conditions |
| boîte de dérivation | non | oui | oui |
| organe de connexion — le groupe de connexions repéré sous un capot | non | oui | non requis |
| accessoire de conduit | non | non | non |

Un objet DOIT porter le rôle qu'il tient. Déclarer une goulotte, un organe de connexion ou un
accessoire de conduit comme une boîte de dérivation NE DOIT PAS être admis : les trois
n'appellent ni le même encombrement, ni le même repérage, ni les mêmes obligations de dossier.

#### Scenario: Déclaration d'une enveloppe
- **WHEN** une enveloppe de cheminement est déclarée
- **THEN** elle porte le rôle qu'elle tient, et non un rôle voisin retenu faute de mieux

#### Scenario: Goulotte déclarée comme boîte
- **WHEN** une goulotte est déclarée comme boîte de dérivation
- **THEN** la déclaration est rejetée, une goulotte étant un cheminement et non un composant

### Requirement: Géométrie de perçage d'une traversée

*On ne perce pas une intention. La pente était déclarée par un booléen, et un booléen ne dit
ni où entrer, ni où sortir, ni de combien descendre. Étendue le 2026-09-24 à la traversée qui
part du fond d'un profilé.*

Une traversée de paroi DOIT déclarer sa **géométrie de perçage** : le point d'entrée sur le nu
intérieur, le point de sortie sur le nu extérieur, et le **dénivelé** entre les deux.

Le dénivelé DOIT être une cote, et non un sens. Une traversée qui déclare descendre vers
l'extérieur sans dire de combien n'est pas perçable : deux personnes en tireraient deux angles
différents, et l'une des deux annulerait la pente.

La géométrie DOIT être **contrainte par l'épaisseur de la paroi et par la hauteur du boîtier**
qui reçoit la traversée. Sur 0,20 m de béton, un boîtier d'appareillage offre 5 à 6 cm de jeu
en altitude : c'est cette réserve qui borne le dénivelé praticable, et elle DOIT être écrite
plutôt que laissée au geste.

Une traversée qui part du **fond d'un profilé** à capot n'a pas de boîtier à son axe. Son
**entrée** DOIT tomber dans le volume du profilé. Sa sortie débouche à l'extérieur, au droit de
l'appareil qu'elle dessert.

Tant que le dénivelé n'est pas arrêté, il DOIT rester inconnu, et NE DOIT PAS être présumé nul
— un dénivelé nul est précisément la faute que la pente existe pour écarter.

#### Scenario: Traversée perçable
- **WHEN** une traversée est déclarée
- **THEN** elle porte son point d'entrée, son point de sortie et son dénivelé, et non le seul sens de sa pente

#### Scenario: Dénivelé non arrêté
- **WHEN** le dénivelé d'une traversée n'est pas arrêté
- **THEN** il reste inconnu dans les données, et n'est pas présumé nul

#### Scenario: Réserve du boîtier
- **WHEN** une traversée débouche dans le fond d'un boîtier
- **THEN** son dénivelé tient dans la réserve d'altitude que ce boîtier offre, et cette réserve est écrite

#### Scenario: Traversée depuis le fond d'un profilé
- **WHEN** une traversée part du fond d'une goulotte et que son dénivelé ferait entrer la mèche au-dessus ou au-dessous du profilé
- **THEN** elle est refusée, le perçage débouchant hors du profilé

## ADDED Requirements

### Requirement: EL-03 desservi par le fond de la goulotte

*Origine : `003-eclairage` FR-046. Remplace « EL-03 desservi par la boîte existante » :
BD-01 a disparu dans la goulotte GL-02 le 2026-09-24, décision du maître d'ouvrage.*

EL-03 DOIT être posé à l'**aplomb du socle intérieur voisin de la porte de service**, sous le
débord extérieur, à 0,15 m sous le niveau du plafond. Son alimentation DOIT sortir par le **fond
de la goulotte** qui court au-dessus de cet aplomb. Aucun conduit propre à l'éclairage NE DOIT
être posé pour desservir EL-03.

La traversée DOIT **entrer dans le profilé**, à mi-hauteur, et **ressortir au droit de EL-03**, en
tirant de la pente vers l'extérieur le dénivelé qui les sépare : 0,105 m sur 0,20 m de paroi,
entrée à 2,705 m, au milieu du profilé 90 × 40, et sortie à 2,60 m. La traversée s'y raccorde par
son entrée, son axe étant au ras du dessous du profilé. EL-03 garde sa hauteur. *Repli*, si ce perçage se révèle
impraticable : une boîte sous la goulotte, pour ce seul départ en fond.

#### Scenario: Alimentation de EL-03
- **WHEN** EL-03 est alimenté
- **THEN** son alimentation sort par le fond de la goulotte, sans qu'aucun conduit propre à l'éclairage ait été posé

#### Scenario: Perçage de la traversée
- **WHEN** la traversée de EL-03 est percée
- **THEN** elle entre dans le profilé et ressort au droit de EL-03, plus bas, du dénivelé déclaré

### Requirement: Remplissage de la goulotte de la paroi est

*Origine : constitution, condition 6. Remplace la condition de volume de BD-01, dont les
connexions sont passées sous le capot de GL-02, en OC-02, le 2026-09-24.*

Le remplissage de la goulotte GL-02 DOIT être justifié sur la **fiche produit** du profilé, pour la
totalité de ce qu'elle porte : les onze conducteurs de 1,5 et 2,5 mm² des deux circuits d'usage
courant, le câble de la borne, et les bornes de connexion de OC-02 avec leur réserve de conducteur. Le nombre de conducteurs ne démontre
pas le remplissage. Tant que la fiche n'est pas obtenue, le remplissage NE DOIT PAS être présenté
comme vérifié.

#### Scenario: Fiche produit non obtenue
- **WHEN** la fiche produit du profilé n'est pas obtenue
- **THEN** le remplissage de GL-02 reste à justifier, et n'est pas présenté comme vérifié

### Requirement: Connexions sous le capot d'une goulotte

*Constitution v1.15.0, condition 2 de l'exception de goulotte. Décision du maître d'ouvrage du
2026-09-24. Remplace « Organe de connexion à enveloppe propre ».*

Une connexion PEUT être faite sous le capot d'une goulotte, par un **dispositif de connexion**,
lorsque le volume intérieur du profilé le permet. Aucune épissure NE DOIT y être faite. Si le
capot se dépose **sans outil**, le dispositif DOIT présenter au moins le degré **IP2X ou IPXXB,
conducteurs en place**, justifié sur sa fiche produit. Une enveloppe propre autour des
connexions n'est pas exigée.

Chaque **groupe de connexions** DOIT être déclaré comme un **organe de connexion**, porter un
**repère lisible sans déposer le capot**, et être énuméré au dossier au même titre que les boîtes
de dérivation. Le point où le tronc et une branche divergent en est un : il NE DOIT PAS être tenu
pour une simple coïncidence entre deux tracés.

Un parcours de goulotte qui porte **plusieurs groupes** DOIT être déclaré en **autant de
profilés**, un par groupe. Chaque groupe reçoit les connexions du profilé qui le porte. La
jonction de deux profilés n'appartient à aucun des deux : un conducteur qui passe de l'un à
l'autre n'y est pas séparé. Deux groupes sur un même profilé NE DOIVENT PAS se partager ses
connexions par proximité : leur décompte est inconnu.

*Références relevées sur des sources secondaires le 2026-09-24 — NF C 15-100 § 526.3,
accessibilité, et § 529.3, degré de protection sous couvercle démontable sans outil. À confirmer
sur le texte.*

#### Scenario: Connexion sous capot
- **WHEN** deux circuits se séparent à l'intérieur d'une goulotte
- **THEN** la connexion y est faite par un dispositif de connexion, repérée comme groupe de connexions et énumérée au dossier

#### Scenario: Capot déposable sans outil
- **WHEN** le capot de la goulotte se dépose à la main
- **THEN** ses dispositifs de connexion présentent au moins IP2X ou IPXXB conducteurs en place, justifié sur leur fiche produit

#### Scenario: Deux profilés, deux groupes
- **WHEN** le tronc passe de GL-01 à GL-02 et se sépare dans chacune
- **THEN** OC-01 porte les connecteurs de GL-01, OC-02 ceux de GL-02, et le passage de l'une à l'autre n'en appelle aucun

## REMOVED Requirements

### Requirement: Organe de connexion à enveloppe propre

**Reason** : la constitution v1.15.0, sur décision du maître d'ouvrage du 2026-09-24, n'exige plus
d'enveloppe propre autour des connexions abritées par une goulotte. L'exigence n'était rattachée à
aucune clause.

**Migration** : remplacée par « Connexions sous le capot d'une goulotte », qui garde le repérage,
l'énumération au dossier et le découpage en un profilé par groupe de connexions.

### Requirement: Traversée de BD-01 par la ligne de la borne

**Reason** : BD-01 disparaît le 2026-09-24. Son antenne CH-02, la montée CH-04 qui rendait la
traversée inévitable et la ligne de la borne CH-B2 sont remplacées par la goulotte GL-02, décision
du maître d'ouvrage. La ligne de la borne ne traverse plus aucune boîte.

**Migration** : les conditions de transit — aucune connexion, repérage nommant la borne,
consignation des trois circuits — sont portées par « Goulotte support partagé » et « Repérage de
tout support à plusieurs circuits », sur GL-01 et GL-02.

### Requirement: Volume de BD-01 à établir sur cote produit

**Reason** : BD-01 disparaît le 2026-09-24. Ses connexions passent dans l'organe de connexion
OC-02, sous le capot de GL-02.

**Migration** : remplacée par « Remplissage de la goulotte de la paroi est », condition 6 de la
constitution, sur la fiche produit du profilé. La réserve 3.3 de `reserves-maitre-ouvrage` est
levée.

### Requirement: EL-03 desservi par la boîte existante

**Reason** : la boîte qui coiffait l'aplomb, BD-01, disparaît le 2026-09-24 dans la goulotte GL-02.

**Migration** : remplacée par « EL-03 desservi par le fond de la goulotte ».
