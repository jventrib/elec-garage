# Cheminements

## Purpose

Le mode de pose imposé par le site — parois en béton non isolé, sans vide technique, donc
rien d'encastré — et tout ce qui en découle : conduits IRL en saillie, goulotte à capot
démontable admise par exception, boîtes de dérivation, traversées de paroi, parcours
parallèles et réservation de place.

Le mode de pose n'est pas un choix de réalisation mais une **donnée d'entrée du calcul**
(Principe III de la [constitution](../../../constitution.md)). Il conditionne le courant
admissible, les facteurs de correction et le taux de remplissage, que la capacité
[électricité](../electricite/spec.md) exploite.

## Requirements

### Requirement: Pose en apparent, aucun encastrement

*Origine : `002-prises-de-courant` FR-025 et FR-026 ; `003-eclairage` FR-021 ;
`004-borne-recharge` FR-018. Constitution v1.3.0.*

Les cinq socles DOIVENT être posés **en saillie**, sur boîtier apparent. Aucune
saignée, aucun encastrement et aucune pose sous enduit NE DOIT être pratiqué dans le béton.

Les conducteurs DOIVENT cheminer en **conduits IRL** fixés en saillie sur les
parois et au plafond, selon des parcours orthogonaux arrêtés sur plan avant tout percement.

Les sorties, les boîtes et les conduits DOIVENT être posés **en apparent**,
conformément au mode de pose imposé par la constitution : conduits IRL en saillie, boîte de
dérivation à chaque jonction, aucun encastrement dans le béton.

#### Scenario: Contrôle du mode de pose
- **WHEN** l'installation posée est contrôlée
- **THEN** aucune saignée, aucun encastrement ni pose sous enduit n'a été pratiqué dans le béton

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

### Requirement: Repérage de tout support à plusieurs circuits

*Origine : `002-prises-de-courant` FR-066 ; `005-automatisation-locale` FR-021 ;
`003-eclairage` FR-045 et FR-046. Constitution v1.10.0.*

Toute boîte portant **plusieurs circuits** DOIT être repérée comme telle. La
consignation d'un seul de ces circuits NE DOIT PAS être présentée comme suffisante pour y
intervenir : les conducteurs de l'autre y restent sous tension.

Tout boîtier recevant des conducteurs de **plusieurs circuits** DOIT être repéré
comme tel, de façon lisible sans l'ouvrir, et le dossier DOIT l'énumérer. Le boîtier du double
interrupteur est dans ce cas : un bouton relève de l'éclairage, l'autre de la porte, donc du
circuit des prises.

Le boîtier de **CM-01** **transite le circuit des prises**, la descente partagée
s'y raccordant avant de continuer vers le socle du bas, et porte un **départ dans son fond**
vers CM-03, à l'extérieur. Il DOIT donc être dimensionné en volume pour ce transit et ce
départ, et **repéré comme boîte à plusieurs circuits**.

#### Scenario: Consignation d'un seul circuit
- **WHEN** un seul circuit d'une boîte à plusieurs circuits est consigné
- **THEN** le repérage de la boîte, lisible sans l'ouvrir, avertit que les conducteurs des autres circuits y restent sous tension

#### Scenario: Énumération au dossier
- **WHEN** le dossier final est établi
- **THEN** il énumère tous les boîtiers recevant des conducteurs de plusieurs circuits

### Requirement: Traversée de paroi étanche et en pente

*Origine : `002-prises-de-courant` FR-028 et FR-055 ; `003-eclairage` FR-024.
Critère mesurable : SC-014. Étendu : la pente devient une cote, la géométrie de perçage étant
désormais exigée.*

PC-02 et PC-04 DOIVENT être alimentés par une **traversée** des 0,20 m de béton,
étanche et présentant une pente vers l'extérieur.

Les deux traversées se trouvant désormais à 0,30 m, soit près du niveau du sol
extérieur, la **pente vers l'extérieur** devient déterminante et non plus
seulement souhaitable. L'implantation DOIT en outre vérifier que le point de percement reste
au-dessus du niveau fini du sol extérieur au droit de chaque traversée.

EL-02 et EL-03 étant extérieurs, leur alimentation DOIT emprunter une **traversée
de paroi** étanche et présentant une pente vers l'extérieur. Une traversée NE DOIT PAS être
percée au droit d'un boîtier en saillie **qu'elle ne dessert pas**. Elle PEUT en revanche
sortir par le **fond** d'un boîtier qu'elle dessert — socle, boîte de dérivation ou boîtier de
commande — auquel cas le percement DOIT précéder la pose de ce boîtier, et la connexion se
faire à l'intérieur de son enveloppe.

La pente DOIT être portée par une **géométrie de perçage** et non par le seul sens : un sens
se contrôle après coup, une cote se perce.

#### Scenario: Contrôle de la pente à l'eau
- **WHEN** la pente d'une traversée est contrôlée à l'eau
- **THEN** elle est dirigée vers l'extérieur

#### Scenario: Niveau du sol extérieur
- **WHEN** le point de percement d'une traversée est implanté
- **THEN** il reste au-dessus du niveau fini du sol extérieur au droit de cette traversée

#### Scenario: Percement horizontal
- **WHEN** deux boîtiers dos à dos à la même hauteur d'axe invitent à percer horizontalement
- **THEN** la géométrie déclarée impose l'entrée haute et la sortie basse, et le percement horizontal se constate comme un écart à cette cote

### Requirement: Traversée derrière le boîtier du socle intérieur

*Origine : `002-prises-de-courant` FR-029, FR-057, FR-058, FR-059, FR-060.
Critère mesurable : SC-018. Révisé le 2026-09-23 : la règle était écrite pour deux boîtiers dos
à dos sur la paroi est ; PC-03 et PC-04 sont passés en façade nord, et elle vaut pour les deux
parois.*

La traversée desservant un socle extérieur DOIT être percée **derrière le
boîtier du socle intérieur** qui lui fait dos, et déboucher dans le fond de ce boîtier. Le
conducteur est alors repiqué sur les bornes du socle intérieur, et aucun conduit ne chemine
à l'extérieur.

Elle DOIT franchir **la paroi sur laquelle le boîtier intérieur est posé**. Un boîtier posé sur
une paroi ne peut pas laisser sortir par son fond une traversée d'une paroi perpendiculaire :
déplacer un socle extérieur d'une façade à l'autre emporte donc le socle intérieur qui le
dessert, ou impose un conduit extérieur que SC-018 interdit.

Les boîtiers saillie de PC-01 et PC-03 DOIVENT comporter une **entrée en fond**
utilisable. C'est la condition de cette exigence, et elle est **confirmée** par le maître
d'ouvrage au 2026-09-21 sur les boîtiers retenus.

Le percement DOIT être exécuté **en biais vers le bas** : entrée haute dans le
boîtier intérieur, sortie basse dans le boîtier extérieur. Deux boîtiers dos à dos étant à la
même hauteur d'axe, un percement **horizontal** est le geste le plus naturel et c'est
précisément la faute à éviter — il annulerait la pente vers l'extérieur. La hauteur d'un
boîtier offre 5 à 6 cm de jeu sur les 0,20 m de paroi, ce qui suffit largement.

Le percement DOIT être exécuté **avant** la pose du boîtier intérieur. Une fois le
boîtier fixé, son fond n'est plus accessible à la scie cloche.

PC-01 et PC-03 étant des points de **repiquage**, chacune de leurs bornes DOIT
accepter sans contrainte le conducteur entrant et le conducteur sortant en 2,5 mm². La
vérification est à faire à la pose. Conséquence assumée : déposer PC-01 ou PC-03 interrompt
l'alimentation du socle extérieur qui lui fait dos.

#### Scenario: Aucun conduit extérieur
- **WHEN** les cheminements extérieurs sont recensés
- **THEN** aucun conduit ne chemine à l'extérieur du local, les deux socles extérieurs étant alimentés par une traversée débouchant dans le fond du boîtier intérieur

#### Scenario: Ordre des gestes
- **WHEN** la traversée d'un socle extérieur est percée
- **THEN** le percement précède la pose du boîtier intérieur, et il est exécuté en biais vers le bas

#### Scenario: Socles sur deux parois différentes
- **WHEN** un socle intérieur et le socle extérieur qu'il dessert sont posés sur des parois perpendiculaires
- **THEN** le montage est refusé : la traversée ne peut pas sortir du fond d'un boîtier d'une autre paroi

### Requirement: Entrée des conducteurs par le haut

*Origine : `002-prises-de-courant` FR-061 et FR-062. Décision du maître d'ouvrage du
2026-09-21. Critère mesurable : SC-020.*

Les conducteurs DOIVENT entrer dans les socles intérieurs **par le haut**. Le
conduit arrive donc verticalement par le dessus du boîtier ; aucune entrée latérale ni par le
bas n'est admise.

Rationale : les parois sont froides et la condensation est tenue pour probable. Une gaine qui
aborde un boîtier par le bas ou par le côté peut conduire l'eau jusque dans l'appareil, où
elle stagne ; abordé par le haut, le même conduit la laisse s'écouler hors de l'appareil. Le
bénéfice n'est pas cosmétique.

Pour satisfaire cette exigence sans créer de jonction supplémentaire, la boîte de
dérivation dont part une descente DOIT être posée **au droit du socle** qu'elle alimente. Un
décrochement latéral pris sur le tracé d'une antenne existante y créerait un té — donc une
jonction de quatre conduits, donc une boîte de plus.

#### Scenario: Entrée dans PC-01 et PC-03
- **WHEN** les entrées de conduit dans PC-01 et PC-03 sont contrôlées
- **THEN** elles se font par le dessus du boîtier, sans entrée latérale ni par le bas

### Requirement: Aucun cheminement en travers d'une baie

*Origine : `002-prises-de-courant` FR-030 ; `003-eclairage` FR-022 ; `004-borne-recharge`
FR-019. Critères mesurables : SC-008, SC-012.*

Aucun cheminement NE DOIT traverser une baie, et en particulier la **fenêtre
nord** — 3,00 m de largeur centrée, ouverture de **1,50 m à 2,03 m** d'altitude.

Le conduit de la borne DOIT donc atteindre celle-ci par le dessus du linteau ou
par le dessous de l'allège, jamais en travers.

#### Scenario: Contrôle des baies dans la maquette
- **WHEN** les cheminements sont contrôlés dans la maquette
- **THEN** aucun ne traverse la fenêtre nord ni l'une des portes

### Requirement: Tracés à l'écart des zones de choc et des obstacles

*Origine : `002-prises-de-courant` FR-031 ; `003-eclairage` FR-023 ; `004-borne-recharge`
FR-020.*

Les tracés DOIVENT éviter les zones exposées aux chocs : gabarit de manœuvre du
véhicule, débattement des ouvrants, et **rail de la porte sectionnelle** — centré à 2,70 m de
l'angle sud-ouest, **8 cm** de largeur, 2,50 m de profondeur, sous-face à 2,35 m.

Ils DOIVENT en outre se tenir à l'écart du **majorant du tablier en
position ouverte**, borné au nord par la course du rail à 2,50 m et en altitude par la
hauteur de passage de 2,10 m ; s'en tenir à l'écart démontre le dégagement, tandis que le
recouper laisse le contrôle non concluant.

#### Scenario: Écart au majorant du tablier
- **WHEN** un tracé est contrôlé au regard du majorant du tablier en position ouverte
- **THEN** s'en tenir à l'écart démontre le dégagement, et le recouper laisse le contrôle non concluant sans permettre d'affirmer une collision

### Requirement: Fixations adaptées au support béton

*Origine : `002-prises-de-courant` FR-034 ; `004-borne-recharge` FR-023.*

Les fixations DOIVENT être adaptées au support béton, et la nature des chevilles
retenues DOIT figurer à la nomenclature.

#### Scenario: Nomenclature des chevilles
- **WHEN** la nomenclature est établie
- **THEN** la nature des chevilles retenues y figure

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

### Requirement: Dérivation de plafond dans une boîte

*Origine : `003-eclairage` FR-037.*

Les deux sorties étant sur un même axe est-ouest, un **cheminement de plafond
rectiligne** partant de la paroi est peut les desservir toutes deux. La sortie la plus à l'est
se trouve alors **sur le parcours** du conduit qui alimente celle de l'ouest, et non à son
extrémité : la dérivation qui s'y opère DOIT se faire dans une boîte, la constitution
interdisant toute connexion dans un conduit. La note de calcul DOIT statuer sur le point de
savoir si la boîte du point d'éclairage lui-même y suffit, ou s'il faut une boîte de
dérivation distincte.

#### Scenario: Dérivation en cours de parcours
- **WHEN** la sortie la plus à l'est se trouve sur le parcours du conduit alimentant celle de l'ouest
- **THEN** la dérivation s'y opère dans une boîte, et jamais dans le conduit

### Requirement: Accessibilité, volume et indice de protection des modules

*Origine : `005-automatisation-locale` FR-024, FR-025, FR-026.*

Tout module posé DOIT rester **accessible et démontable** après achèvement des
travaux, sans destruction. Un module logé dans une boîte DOIT laisser cette boîte refermable et
ses connexions vérifiables.

Le **volume intérieur** de la boîte recevant un module DOIT être démontré suffisant
pour le module, les conducteurs et leur réserve. *Un nombre d'entrées ne démontre pas un
volume.*

L'indice de protection de chaque module DOIT être adapté à l'ambiance du local —
parois froides, condensation tenue pour probable — et à son emplacement réel.

#### Scenario: Remplacement d'un module
- **WHEN** un module doit être remplacé après achèvement des travaux
- **THEN** il est accessible et démontable sans destruction, sa boîte restant refermable et ses connexions vérifiables

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

### Requirement: La goulotte est un cheminement

*Découle de la constitution v1.13.0 : la goulotte « tient lieu de conduit sur un parcours
donné ». Remplace le traitement de GL-01 comme composant ponctuel.*

Un profilé de goulotte DOIT être déclaré comme un **cheminement**, au même titre qu'un conduit,
et non comme un composant. Il achemine des conducteurs sur un parcours : c'est la définition
d'un cheminement.

La goulotte DOIT déclarer sa **section**, qui n'est pas circulaire, et ses extrémités DOIVENT
rejoindre un composant ou une enveloppe comme celles de tout cheminement. Sa longueur est une
propriété de l'instance et NE DOIT PAS être héritée d'un gabarit de type.

Le **mode de pose** de la goulotte DOIT être porté par le cheminement lui-même, la catégorie de
pose conditionnant le courant admissible : la catégorie B1 est celle des conducteurs isolés en
conduit, et un tronçon en goulotte relève d'une autre lettre de sélection. Tant que cette lettre
n'est pas confirmée sur le texte, elle DOIT rester inconnue et NE DOIT PAS être présumée égale à
celle du conduit.

#### Scenario: Extrémité basse de la goulotte
- **WHEN** la goulotte joint le dessus du tableau
- **THEN** son extrémité y rejoint un composant déclaré, sans intervalle et sans reposer sur une contenance de volume

#### Scenario: Lettre de sélection non confirmée
- **WHEN** la lettre de sélection du mode goulotte n'est pas confirmée sur le texte de la norme
- **THEN** elle reste inconnue dans les données, et celle du conduit ne lui est pas substituée

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

### Requirement: Accessoire de conduit pour un changement de direction

*Origine : constitution — une boîte est requise « à chaque changement de direction **qui ne se
traite pas par un accessoire de conduit** ». Précédent du projet : l'ancienne BD-02, conservée
pour le seul tirage, a été supprimée lorsque son parcours est tombé à un seul coude, « qui se
traite par un accessoire de conduit ».*

Un changement de direction qui ne porte **aucune dérivation** et où **aucune connexion** n'est
faite NE DOIT PAS appeler une boîte de dérivation. Il DOIT être traité par un **accessoire de
conduit**, déclaré comme tel.

Un tel accessoire DOIT être déclaré lorsqu'il constitue un **point de tirage** nécessaire, et la
nécessité DOIT être établie sur la longueur du parcours, le nombre de coudes et le nombre de
conducteurs — et non présumée de la seule présence d'un changement de direction.

Un accessoire de conduit NE DOIT PAS être repéré comme boîte à plusieurs circuits ni énuméré
parmi les boîtes de dérivation du dossier : aucune consignation n'a à y être vérifiée, puisque
rien ne s'y connecte.

#### Scenario: Changement de direction sans dérivation
- **WHEN** un cheminement change de direction sans qu'aucun circuit s'y sépare et sans qu'aucune connexion s'y fasse
- **THEN** il est traité par un accessoire de conduit, et non par une boîte de dérivation

#### Scenario: Nécessité d'un point de tirage
- **WHEN** un accessoire de conduit est déclaré comme point de tirage
- **THEN** sa nécessité est établie sur la longueur, le nombre de coudes et le nombre de conducteurs du parcours

### Requirement: Remplissage d'une section non circulaire

*Origine : constitution v1.13.0, condition 6.*

Le taux de remplissage admissible d'une goulotte DOIT être justifié sur les **caractéristiques
déclarées du produit**. La règle du tiers `D ≥ d·√(3n)`, écrite pour une section circulaire,
**NE DOIT PAS** y être transposée telle quelle.

Tant que la fiche produit n'a pas été obtenue, le taux admissible DOIT rester inconnu, et le
remplissage de la goulotte NE DOIT PAS être présenté comme vérifié.

#### Scenario: Contrôle du remplissage d'une goulotte
- **WHEN** le remplissage d'une goulotte est contrôlé
- **THEN** il s'appuie sur les caractéristiques déclarées du produit, et non sur la règle du tiers

#### Scenario: Fiche produit non obtenue
- **WHEN** la fiche produit de la goulotte n'est pas encore obtenue
- **THEN** le taux admissible reste inconnu et le remplissage n'est pas présenté comme vérifié

### Requirement: Jonction déclarée plutôt que contenance inférée

*Corrige une faiblesse que le projet a lui-même identifiée : faire reposer la continuité d'un
circuit sur le chevauchement de volumes revient à fabriquer de la continuité en déclarant un
encombrement.*

La continuité d'un circuit à l'intérieur d'une enveloppe DOIT reposer sur une **jonction
déclarée** sur cette enveloppe, et NON sur la contenance géométrique des extrémités de
cheminement dans son volume.

Un volume déclaré NE DOIT PAS suffire à rattacher un cheminement qui ne s'y déclare pas joint.

#### Scenario: Deux cheminements dans un même volume
- **WHEN** deux extrémités de cheminement tombent à l'intérieur du volume d'une enveloppe sans s'y déclarer jointes
- **THEN** la continuité n'est pas établie, et le défaut est signalé au concepteur

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

### Requirement: L'entraxe des colliers est une donnée produit

*Le projet a toujours refusé de l'arrêter — « l'entraxe est une donnée du fabricant, pas une
cote de projet ». Ce changement ne revient pas là-dessus : il en fait un paramètre déclaré au
lieu d'un vide.*

L'**entraxe des colliers** NE DOIT PAS être une cote de projet. Il DOIT être déclaré comme une
donnée produit, renseignée une fois le collier choisi, et le nombre comme la répartition des
fixations en DÉCOULENT.

Il en va de même de la **cheville retenue**, qui commande le diamètre et la profondeur de
perçage.

Tant que l'un ou l'autre n'est pas renseigné, ce qui en dépend DOIT rester inconnu. Un guide
de perçage DOIT alors donner les positions qu'il connaît et **taire les diamètres**, plutôt que
de proposer une valeur courante.

#### Scenario: Entraxe non renseigné
- **WHEN** l'entraxe des colliers n'est pas renseigné
- **THEN** le nombre et la position des fixations restent inconnus, et aucune valeur courante ne leur est substituée

#### Scenario: Cheville non choisie
- **WHEN** la cheville n'est pas choisie
- **THEN** le diamètre et la profondeur de perçage restent inconnus, et le guide donne les positions sans les diamètres

### Requirement: Répartition des colliers

*Un collier ne se pose pas n'importe où, et ces règles ne vivaient nulle part.*

La répartition des colliers le long d'un cheminement DOIT respecter les règles suivantes :

- un collier près de **chaque extrémité** de segment, la portée libre en bout étant la plus
  sollicitée ;
- **aucun collier sur un changement de direction** : un coude se traite par un accessoire, et
  serrer un collier dessus le déforme ;
- **aucun collier au droit d'une enveloppe** — boîte, organe de connexion, accessoire — ni
  d'une traversée : il n'y a rien à y brider et la place est prise ;
- les colliers intermédiaires **répartis régulièrement**, sans dépasser l'entraxe déclaré.

La répartition est **dérivée**, non déclarée point par point. Coter le trente-septième collier
donnerait une précision que personne ne reporte au chantier, et que la moindre révision de
tracé rendrait fausse.

#### Scenario: Extrémités de segment
- **WHEN** un segment de cheminement est équipé
- **THEN** il porte un collier près de chacune de ses extrémités

#### Scenario: Collier sur un obstacle
- **WHEN** la répartition tombe sur un coude, une enveloppe ou une traversée
- **THEN** aucun collier n'y est posé, et la répartition se reprend de part et d'autre

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
