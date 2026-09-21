# Points d'utilisation

## Purpose

L'inventaire des points d'utilisation du garage — socles de prise, sorties d'éclairage,
points de commande et borne de recharge —, leur position cotée, leur type, leur hauteur
d'axe, leur indice de protection et la commande qui les pilote. Cette capacité dit **ce qui
est posé et où**, pas comment c'est alimenté ni comment c'est cheminé.

Les points y sont désignés par leur repère de projet : PC-01 à PC-05 pour les prises, EL-01
à EL-03 pour les points lumineux, CM-01 à CM-05 pour les commandes, BR-01 pour la borne.

## Requirements

### Requirement: Inventaire des cinq points de prise

*Origine : `002-prises-de-courant` FR-001.*

L'installation DOIT comporter exactement cinq points de prise, référencés
PC-01 à PC-05, et aucun autre point de prise dans le cadre de cette fonctionnalité.

#### Scenario: Recensement des socles
- **WHEN** les points de prise de l'installation sont recensés
- **THEN** il y en a exactement cinq, référencés PC-01 à PC-05

### Requirement: Position de PC-01

*Origine : `002-prises-de-courant` FR-002.*

PC-01 DOIT être un socle double, posé à l'intérieur, sur le mur droit, au-delà
de la porte de service en venant de la façade, et DOIT rester accessible lorsque le
vantail de la porte de service est en position grande ouverte.

#### Scenario: Vantail en position grande ouverte
- **WHEN** le vantail de la porte de service est en position grande ouverte
- **THEN** PC-01 reste accessible, ni masqué ni obstrué

### Requirement: Position de PC-02

*Origine : `002-prises-de-courant` FR-003.*

PC-02 DOIT être un socle double, posé à l'extérieur, sur la face extérieure du
mur droit, au droit de PC-01.

#### Scenario: Implantation de PC-02
- **WHEN** PC-02 est implanté
- **THEN** il est un socle double, à l'extérieur, sur la face extérieure du mur droit, au droit de PC-01

### Requirement: Position de PC-03

*Origine : `002-prises-de-courant` FR-004. Révisé le 2026-09-23 : le point passe en façade
nord, sur décision du maître d'ouvrage, pour que PC-04 puisse y passer sans perdre son
repiquage.*

PC-03 DOIT être un socle simple, posé à l'intérieur, dans l'angle formé par le
mur du fond et le mur droit, **sur la face intérieure du mur du fond**.

*L'exigence d'origine ne nommait aucune paroi — seulement l'angle — et restait donc vraie
lorsque le point était sur le mur droit. Elle nomme désormais la paroi, parce que c'est elle
qui décide de celle que la traversée franchit : un boîtier posé sur le mur droit ne peut pas
laisser sortir par son fond une traversée du mur du fond.*

#### Scenario: Implantation de PC-03
- **WHEN** PC-03 est implanté
- **THEN** il est un socle simple, à l'intérieur, dans l'angle du mur du fond et du mur droit, sur la face intérieure du mur du fond

#### Scenario: Paroi de la traversée
- **WHEN** la traversée desservant le socle extérieur qui lui fait dos est percée
- **THEN** elle franchit la paroi sur laquelle PC-03 est posé, et non une paroi perpendiculaire

### Requirement: Position de PC-04

*Origine : `002-prises-de-courant` FR-005. Révisé le 2026-09-23 : décision du maître d'ouvrage
de porter le point en façade nord.*

PC-04 DOIT être un socle double, posé à l'extérieur **en façade nord**, au droit de PC-03 —
donc dos à dos avec lui à travers le mur du fond.

*« Au droit de PC-03 » ne suffisait plus : la formule était vraie tant que les deux points
étaient sur la même paroi, et elle ne disait pas laquelle. Nommer la façade lève l'ambiguïté
et rend l'exigence opposable au relevé.*

#### Scenario: Implantation de PC-04
- **WHEN** PC-04 est implanté
- **THEN** il est un socle double, à l'extérieur en façade nord, au droit de PC-03 et dos à dos avec lui

#### Scenario: Aucun conduit extérieur pour l'atteindre
- **WHEN** l'alimentation de PC-04 est contrôlée
- **THEN** elle passe par la seule traversée du mur du fond, repiquée sur les bornes de PC-03, sans qu'aucun conduit chemine dehors

### Requirement: Position de PC-05 et dégagement du tablier

*Origine : `002-prises-de-courant` FR-006 et FR-053. Critère mesurable : SC-013.
Révisé le 2026-09-23 : BD-05 est passée dans l'axe ouest de BD-01, et PC-05 l'a suivie.*

PC-05 DOIT être un socle simple, posé au plafond, destiné au moteur de la
porte sectionnelle, et DOIT se situer hors de la trajectoire du tablier et de son rail en
position ouverte comme en position fermée.

PC-05 DOIT être posé **à l'ouest de BD-05**, et non au sud ni au nord. BD-05 étant sur l'axe
y = 2,60, ses trois branches — l'arrivée depuis l'est, la montée de l'éclairage vers le nord et
la desserte de PC-05 — DOIVENT partir dans trois directions distinctes. Au nord la desserte se
superposerait à la montée de l'éclairage ; au sud le boîtier mordrait dans le rail.

Le dégagement de PC-05 DOIT également être statué au regard du **tablier en
position ouverte**, qui occupe toute la largeur de la baie sous le plafond et non les 8 cm du
rail. **Cette exigence est satisfaite** depuis le relevé de la hauteur de passage de la
porte, 2,10 m : le tablier est borné au nord par la course du rail, soit y ≤ 2,50 m, et
PC-05 est à y = 2,60 m. Socle et conduit d'alimentation sont donc **prouvés dégagés**, avec
**0,055 m de marge pour le socle**. Le majorant ne servant qu'à démontrer un dégagement, aucune
conclusion défavorable n'en est tirée ici, et aucune ne serait recevable.

*La marge était de 0,155 m quand PC-05 se tenait à y = 2,70. Elle a été divisée par trois par
le passage de BD-05 dans l'axe. Elle reste positive et démontrée — mais contre un obstacle
**relevé**, non borné : le rail porte un volume mesuré et monte jusqu'au plafond. Ce chiffre
DOIT être revérifié à toute révision de l'implantation du plafond.*

#### Scenario: Dégagement du rail
- **WHEN** l'emprise du rail — 2,50 m de profondeur, sous-face à 2,35 m — est contrôlée
- **THEN** PC-05 et son alimentation la dégagent

#### Scenario: Dégagement du tablier ouvert
- **WHEN** le majorant du tablier en position ouverte, borné à y ≤ 2,50 m, est contrôlé
- **THEN** PC-05 à y = 2,60 m est à l'écart, avec 0,055 m de marge pour le socle

#### Scenario: Direction de la desserte
- **WHEN** les trois branches de BD-05 sont tracées
- **THEN** elles partent dans trois directions distinctes, PC-05 étant desservi vers l'ouest

### Requirement: Atteinte par le cordon d'origine

*Origine : `002-prises-de-courant` FR-007. Critères mesurables : SC-001, SC-002, SC-005.*

Chaque point DOIT être atteignable par le cordon d'origine de l'appareil qu'il
dessert, sans rallonge permanente. Pour PC-05, cela se vérifie avec le cordon du moteur
effectivement retenu.

#### Scenario: Cordon du moteur
- **WHEN** le moteur est branché sur PC-05 avec son cordon d'origine
- **THEN** la longueur suffit, sans rallonge

#### Scenario: Atteinte depuis la porte de service
- **WHEN** l'utilisateur se tient à l'encadrement de la porte de service
- **THEN** il atteint un socle intérieur sans s'écarter de plus de 1,5 m de l'encadrement

### Requirement: Hauteur d'axe des socles à 0,30 m

*Origine : `002-prises-de-courant` FR-012. Décision du maître d'ouvrage du 2026-09-21.*

Les socles PC-01 à PC-04 DOIVENT être posés à une **hauteur d'axe de 0,30 m**,
décidée le 2026-09-21. PC-05 reste au plafond, pour le moteur de la porte sectionnelle. Cette
hauteur respecte les plages admises par la NF C 15-100 — laquelle autorise 5 cm d'axe pour du
16 A — tout en mettant les socles hors d'atteinte d'une lame d'eau ruisselant au sol, ce que
le minimum normatif n'aurait pas permis.

*Motif du choix, conservé parce qu'il conditionne la validité de FR-012 :* un garage reçoit
l'eau qui s'égoutte du véhicule, la fonte de neige, le lavage au jet et la condensation d'une
dalle béton froide. Descendre à 5 cm aurait exigé de réviser l'exigence d'eau et de compenser
par un indice de protection nettement supérieur, y compris à l'intérieur.

#### Scenario: Relevé de la hauteur d'axe
- **WHEN** la hauteur d'axe de PC-01 à PC-04 est relevée
- **THEN** elle est de 0,30 m

### Requirement: Exposition mécanique des boîtiers à 0,30 m

*Origine : `002-prises-de-courant` FR-054.*

À 0,30 m, les boîtiers en saillie restent dans une zone d'exposition mécanique.
L'implantation DOIT vérifier qu'aucun socle ne se trouve dans le gabarit de manœuvre du
véhicule ni dans le débattement de ses portières, et la nomenclature DOIT retenir des
boîtiers admettant les chocs de cette zone — aspirateur, tondeuse, outillage au sol.

#### Scenario: Contrôle du gabarit
- **WHEN** l'implantation des socles est contrôlée
- **THEN** aucun ne se trouve dans le gabarit de manœuvre du véhicule ni dans le débattement de ses portières

### Requirement: Indice de protection des points extérieurs

*Origine : `002-prises-de-courant` FR-010 et FR-017. Critère mesurable : SC-010.*

Les points extérieurs PC-02 et PC-04 DOIVENT présenter un indice de protection
adapté à leur exposition réelle, et DOIVENT conserver cet indice en usage, couvercle
rabattu sur un cordon branché.

PC-02 et PC-04 sont exposés en plein vent et à la pluie, sur un terrain clos.

#### Scenario: Arrosage d'un socle extérieur en usage
- **WHEN** un socle extérieur, cordon branché et couvercle rabattu, est soumis à un arrosage
- **THEN** il conserve son indice de protection

### Requirement: Indice de protection des points intérieurs

*Origine : `002-prises-de-courant` FR-011 ; `003-eclairage` FR-015.*

Les points intérieurs PC-01, PC-03 et PC-05 DOIVENT présenter un indice de
protection adapté à l'ambiance du garage (poussière, humidité, projections).

EL-01a et EL-01b, au plafond d'un local à parois froides, DOIVENT présenter un
indice de protection adapté à l'ambiance du garage, la condensation étant tenue pour probable.

#### Scenario: Ambiance du local
- **WHEN** l'indice de protection d'un point intérieur est contrôlé
- **THEN** il est adapté à la poussière, à l'humidité, aux projections et à la condensation d'un local à parois froides

### Requirement: Étanchéité des boîtiers extérieurs

*Origine : `002-prises-de-courant` FR-018 et FR-033 ; `003-eclairage` FR-013 et FR-014.*

Les entrées de câble et la jonction au mur de PC-02 et PC-04 DOIVENT être
étanches, et le boîtier DOIT être orienté et percé de façon à ne pas retenir l'eau.

Les **boîtiers extérieurs** de PC-02 et PC-04 DOIVENT tenir l'exposition directe
aux ultraviolets et aux intempéries, et le choix DOIT être justifié par les caractéristiques
déclarées du produit.

EL-02, EL-03 **et CM-03**, exposés en plein vent et à la pluie, DOIVENT présenter
un indice de protection tenant l'exposition directe aux intempéries, et le conserver en usage.
Pour CM-03, « en usage » signifie **manœuvre comprise** : un interrupteur extérieur est touché
les mains mouillées, et son étanchéité ne doit pas dépendre de la position de son organe.

Les entrées de câble et la jonction au mur de EL-02 et EL-03 DOIVENT être
étanches, et les boîtiers orientés et percés de façon à ne pas retenir l'eau.

#### Scenario: Manœuvre de CM-03 sous la pluie
- **WHEN** CM-03 est manœuvré les mains mouillées
- **THEN** son étanchéité est conservée, quelle que soit la position de son organe

#### Scenario: Orientation d'un boîtier extérieur
- **WHEN** un boîtier extérieur est posé
- **THEN** il est orienté et percé de façon à ne pas retenir l'eau, et sa jonction au mur est étanche

### Requirement: Condensation tenue pour probable à l'intérieur

*Origine : `002-prises-de-courant` FR-032 ; `004-borne-recharge` FR-022.*

Les parois étant froides, la **condensation en surface DOIT être tenue pour
probable**, y compris à l'intérieur. Les boîtiers DOIVENT être orientés et percés de façon à
ne pas retenir l'eau, et le matériel retenu DOIT admettre ce support.

#### Scenario: Choix du matériel intérieur
- **WHEN** un boîtier intérieur est retenu
- **THEN** il admet un support à condensation probable, et est orienté et percé de façon à ne pas retenir l'eau

### Requirement: Alimentation permanente des socles extérieurs

*Origine : `002-prises-de-courant` FR-016. Critère mesurable : SC-003.*

Les socles extérieurs DOIVENT être alimentés en permanence, sans commande ni
interrupteur intermédiaire, sauf décision contraire explicite.

#### Scenario: Usage extérieur toutes portes fermées
- **WHEN** un usage extérieur est conduit
- **THEN** il se fait toutes portes fermées, sans qu'aucune commande intérieure soit nécessaire, dans 100 % des cas

### Requirement: Pas de coffret verrouillable, terrain clos

*Origine : `002-prises-de-courant` FR-019.*

Le terrain étant clos, PC-02 et PC-04 NE NÉCESSITENT PAS de coffret
verrouillable ni de dispositif de sectionnement commandé depuis l'intérieur. Toute
évolution de la clôture du terrain remettrait cette exigence en cause.

#### Scenario: Évolution de la clôture
- **WHEN** la clôture du terrain évolue
- **THEN** l'absence de coffret verrouillable sur PC-02 et PC-04 est remise en cause

### Requirement: Inventaire des trois points lumineux et règle de repérage

*Origine : `003-eclairage` FR-001.*

L'installation DOIT comporter exactement **trois points lumineux** — EL-01, EL-02
et EL-03 — totalisant **quatre sorties d'éclairage**, et aucun autre dans le cadre de cette
fonctionnalité.

**Règle de repérage, tenue partout dans le projet** : un numéro EL désigne un *point lumineux*,
c'est-à-dire ce qui s'allume d'un seul geste, et il correspond à **une et une seule commande**.
Un suffixe désigne une *sortie physique* de ce point. EL-01 en compte deux, EL-02 et EL-03 une
chacun.

#### Scenario: Recensement des points lumineux
- **WHEN** les points lumineux sont recensés
- **THEN** il y en a exactement trois — EL-01, EL-02, EL-03 — totalisant quatre sorties

### Requirement: EL-01, plafonnier à deux sorties

*Origine : `003-eclairage` FR-002, FR-034, FR-035, FR-036. Critères mesurables : SC-014,
SC-016.*

**EL-01 est le plafonnier**, point lumineux unique doté de **deux sorties**
destinées à recevoir deux éléments d'éclairage. Ses deux sorties EL-01a et EL-01b DOIVENT être
au plafond, **alignées sur un même axe est-ouest** : elles partagent donc la même distance à
la paroi sud et ne diffèrent que par leur position est-ouest.

Les deux sorties DOIVENT être **symétriques par rapport à l'axe médian
nord-sud** du local, de façon à répartir l'éclairement sur toute la largeur. C'est le sens
retenu pour « centrées » : centrées en tant que paire, et non posées sur l'axe médian.

**EL-01a est la sortie ouest** et **EL-01b la sortie est**. Deux sorties
identiques en tout sauf leur position est-ouest ne se distinguent que par leur repère : la
convention DOIT être tenue partout.

Les deux sorties de EL-01 DOIVENT être alimentées et commandées **ensemble**,
comme une seule lumière. Elles ne sont pas deux points lumineux : les distinguer sert à les
implanter et à les câbler, non à les piloter séparément.

#### Scenario: Symétrie des deux sorties
- **WHEN** la position des deux sorties est relevée
- **THEN** elles sont à égale distance de l'axe médian nord-sud, et sur un même axe est-ouest

#### Scenario: Commande d'un seul geste
- **WHEN** CM-01 est actionné
- **THEN** les deux sorties du plafonnier s'allument ou s'éteignent ensemble, d'un seul geste

### Requirement: Axe du plafonnier au nord du tablier ouvert

*Origine : `003-eclairage` FR-003. Critère mesurable : SC-002.*

L'axe est-ouest portant les deux sorties DOIT se situer **au nord de l'emprise du
tablier de la porte sectionnelle en position ouverte**, de sorte qu'aucune sortie ne soit
masquée porte remontée. Cette emprise est désormais **bornée** : le tablier est guidé par le
rail, donc ne dépasse pas sa course de 2,50 m depuis la paroi sud. L'exigence se réduit
ainsi à une cote opposable — l'axe DOIT être au nord de y = 2,50 m — et non plus à une garde
estimée. Les deux sorties partageant la même profondeur, cette vérification porte sur une
seule cote et vaut pour les deux.

#### Scenario: Porte sectionnelle remontée
- **WHEN** la porte sectionnelle est en position remontée
- **THEN** les deux sorties du plafonnier restent dégagées, l'axe étant au nord de y = 2,50 m

### Requirement: EL-02, éclairage de l'aire de manœuvre

*Origine : `003-eclairage` FR-004. Critère mesurable : SC-004.*

**EL-02** DOIT être un point lumineux à sortie unique, **extérieur en façade
sud**, au-dessus de la baie de la porte sectionnelle et centré sur elle. Il éclaire l'aire de
manœuvre.

#### Scenario: Éclairement de l'aire de manœuvre
- **WHEN** EL-02 est allumé
- **THEN** l'aire de manœuvre devant la porte sectionnelle est éclairée

### Requirement: EL-03, éclairage de l'accès piéton

*Origine : `003-eclairage` FR-005. Critère mesurable : SC-005.*

**EL-03** DOIT être un point lumineux à sortie unique, **extérieur sur la paroi
est**, en hauteur et légèrement au nord de la porte de service, de façon à éclairer son seuil
et sa serrure.

#### Scenario: Éclairement du seuil
- **WHEN** EL-03 est allumé
- **THEN** le seuil et la serrure de la porte de service sont éclairés

### Requirement: Sorties d'éclairage et non luminaires

*Origine : `003-eclairage` FR-006.*

Chaque point DOIT être une **sortie d'éclairage** et non un luminaire :
la présente fonctionnalité spécifie les points d'alimentation, pas les appareils qui y
seront raccordés.

#### Scenario: Périmètre de la spécification
- **WHEN** un point d'éclairage est spécifié
- **THEN** c'est son point d'alimentation qui est spécifié, et non l'appareil qui y sera raccordé

### Requirement: Une commande par point lumineux

*Origine : `003-eclairage` FR-029, FR-007, FR-008. Critères mesurables : SC-001, SC-015.*

**Une commande par point lumineux**, conformément à la règle de repérage de
FR-001 — trois points, trois commandes, de deux natures différentes :
- **CM-01** — interrupteur manuel, pilote **EL-01**, le plafonnier et ses deux sorties ;
- **CM-02** — **détecteur de présence**, pilote **EL-02** en façade sud ;
- **CM-03** — interrupteur manuel, pilote **EL-03** sur le mur est.

L'éclairage intérieur DOIT être commandable depuis l'accès piéton sans que
l'utilisateur ait à s'écarter de l'encadrement de la porte de service ni à traverser le local
dans l'obscurité, conformément à la contrainte posée par la constitution.

L'éclairage intérieur DOIT être commandé par un **interrupteur unique**, le
plafonnier EL-01 s'allumant et s'éteignant d'un seul geste malgré ses deux sorties. Il n'y a
pas de va-et-vient depuis la porte sectionnelle.

#### Scenario: Allumage depuis l'encadrement
- **WHEN** l'utilisateur se tient à l'encadrement de la porte de service
- **THEN** il allume l'éclairage intérieur sans s'écarter de l'encadrement ni traverser le local dans l'obscurité

#### Scenario: Indépendance de CM-03
- **WHEN** CM-03 est actionné
- **THEN** il agit sur EL-03 seul, sans effet sur EL-02 ni sur le plafonnier

### Requirement: CM-03 à l'extérieur et ce que ce choix abandonne

*Origine : `003-eclairage` FR-038 et FR-047. Révisé le 2026-09-21 sur décision du maître
d'ouvrage.*

**EL-03 DOIT être piloté par un interrupteur manuel placé à l'EXTÉRIEUR**, au
voisinage immédiat de la porte de service. L'accès piéton s'éclaire sur décision, non à
l'approche.

Le passage de CM-03 à l'extérieur **supprime toute commande de EL-03 depuis
l'intérieur**. Ce qui est abandonné DOIT être consigné au dossier plutôt que passé sous
silence :
- EL-03 ne peut plus être **éteint** depuis l'intérieur ; qui le laisse allumé en rentrant doit
  ressortir pour l'éteindre ;
- son état n'est plus **constatable** de l'intérieur — c'est l'ancien SC-013, abandonné ;
- la commande est **accessible à quiconque se tient devant la porte**, l'éclairage de l'accès
  pouvant donc être éteint depuis l'extérieur par un tiers.

Le remède, si l'un de ces points devient gênant à l'usage, est un **va-et-vient** ajoutant un
second point dans le boîtier de CM-01. Il DOIT alors être traité comme une modification du
dimensionnement et non comme un ajout d'appareillage : la navette supplémentaire porte le tronc
partagé de huit à **neuf** conducteurs, et la condition de remplissage de `D ≥ d·√24` à
`D ≥ d·√27`.

#### Scenario: Conséquences consignées
- **WHEN** le dossier final est établi
- **THEN** il consigne que EL-03 n'est plus commandable ni constatable depuis l'intérieur, et que sa commande est accessible depuis l'extérieur par un tiers

#### Scenario: Ajout ultérieur d'un va-et-vient
- **WHEN** un va-et-vient est ajouté pour rétablir la commande intérieure
- **THEN** il est traité comme une modification du dimensionnement, le tronc partagé passant de huit à neuf conducteurs

### Requirement: Position du boîtier de CM-01

*Origine : `003-eclairage` FR-030. Critère mesurable : SC-012.*

Le boîtier de **CM-01** DOIT être posé **immédiatement à côté de l'encadrement de
la porte de service**, du côté que le débattement du vantail laisse libre. L'axe de
l'appareillage de la paroi est se tient à **0,20 m du bord de la baie**, mesuré sur le relevé de
la baie, l'encadrement lui-même n'étant pas relevé.

Le côté définitif DOIT être arrêté une fois le sens d'ouverture relevé ; à défaut, l'implantation
retient provisoirement le côté nord, le côté sud étant occupé par le tableau divisionnaire.

#### Scenario: Entrée de nuit
- **WHEN** un utilisateur entre de nuit par la porte de service
- **THEN** il trouve le boîtier de CM-01 immédiatement à côté de l'encadrement, du côté que le vantail laisse libre

### Requirement: Hauteur et actionnement des points de commande

*Origine : `003-eclairage` FR-031, FR-010, FR-032.*

La hauteur d'axe des commandes DOIT respecter la plage admise par la NF C 15-100
pour les dispositifs de commande. La valeur retenue DOIT être confirmée sur le texte de la
norme et non reprise de mémoire, au même titre que les autres valeurs normatives du projet.

Tout point de commande DOIT être posé en saillie et à une hauteur permettant son
actionnement sans recherche, y compris de nuit et l'éclairage éteint.

Tout point de commande DOIT porter un **repérage lisible dans l'obscurité**, et
deux organes voisins DOIVENT être **distinguables au toucher**.

*Le risque que cette exigence visait a disparu le 2026-09-21 : il n'y a plus d'organes voisins,
le boîtier intérieur ne portant plus que CM-01. Le repérage reste exigé, la distinction au
toucher n'a plus d'objet ici et redeviendra exigible si un second organe rejoint un boîtier.*

#### Scenario: Actionnement de nuit
- **WHEN** l'utilisateur cherche un point de commande de nuit, l'éclairage éteint
- **THEN** il l'actionne sans recherche, son repérage étant lisible dans l'obscurité

### Requirement: Implantation et réglage du détecteur CM-02

*Origine : `003-eclairage` FR-039, FR-040, FR-041, FR-009, FR-044. Critères mesurables :
SC-017, SC-018.*

**EL-02 DOIT être piloté par un détecteur de présence**, de façon autonome.
L'aire de manœuvre s'éclaire donc à l'approche, sans geste, ce qui est précisément l'usage :
on arrive en véhicule ou les mains chargées.

CM-02 DOIT être implanté **à l'extérieur, en façade sud**, dans une position et
une orientation couvrant l'aire de manœuvre devant la porte sectionnelle.

Le champ de détection DOIT être réglable et réglé de façon à **ne pas être
déclenché par la voie publique, les véhicules de passage ni la propriété voisine**. Un
détecteur qui s'allume sans raison est éteint par son utilisateur, ce qui annule la fonction.

La **temporisation d'extinction** DOIT être réglable, et la valeur retenue
consignée au dossier final comme un réglage et non comme une caractéristique du produit.

L'indice de protection du détecteur DOIT tenir l'exposition directe aux
intempéries, au même titre que celui de EL-02, et le conserver réglages effectués — le
couvercle d'accès aux potentiomètres refermé.

#### Scenario: Approche sur l'aire de manœuvre
- **WHEN** une personne s'approche sur l'aire de manœuvre
- **THEN** EL-02 s'allume, et il reste éteint au passage d'un véhicule sur la voie publique ou d'une présence sur la propriété voisine

#### Scenario: Temporisation consignée
- **WHEN** le dossier final est établi
- **THEN** la temporisation d'extinction retenue y est consignée comme un réglage

### Requirement: Borne de recharge unique BR-01

*Origine : `004-borne-recharge` FR-001 et FR-002.*

L'installation DOIT comporter **une borne de recharge unique**, référencée
**BR-01**, et aucun autre point de charge dans le cadre de cette fonctionnalité.

BR-01 DOIT être dimensionnée pour **32 A en monophasé 230 V**, soit une puissance
nominale de l'ordre de **7,4 kW**.

#### Scenario: Recharge à la puissance attendue
- **WHEN** le véhicule est mis en charge sur BR-01
- **THEN** il se recharge à la puissance attendue, sans rallonge ni prise intermédiaire

### Requirement: Position de BR-01 sous l'allège

*Origine : `004-borne-recharge` FR-003 et FR-004. Critère mesurable : SC-007.*

BR-01 DOIT être posée sur la **paroi nord, face intérieure, sous la fenêtre**,
et centrée sur celle-ci — donc sur l'axe médian du local, la fenêtre étant elle-même centrée.

L'ensemble de la borne, coffret et organes de manœuvre compris, DOIT tenir
**sous l'allège de la fenêtre**, dont le bord bas est à **1,50 m**. Aucune partie NE DOIT
empiéter sur l'ouverture. La hauteur libre de maçonnerie pleine disponible est donc de
1,50 m, et non de 1,30 m comme indiqué avant correction du relevé.

#### Scenario: Empiètement sur la fenêtre
- **WHEN** l'implantation de BR-01 est contrôlée dans la maquette
- **THEN** aucune partie de la borne n'empiète sur l'ouverture de la fenêtre nord, dont l'allège est à 1,50 m

### Requirement: Hauteur d'axe et manœuvre du connecteur

*Origine : `004-borne-recharge` FR-005.*

La hauteur d'axe retenue DOIT permettre la manœuvre du connecteur sans se baisser
ni se hausser, et respecter les plages admises par la NF C 15-100 pour un appareil de ce type.
La valeur normative DOIT être confirmée sur le texte et non reprise de mémoire.

#### Scenario: Manœuvre du connecteur
- **WHEN** l'utilisateur manœuvre le connecteur de BR-01
- **THEN** il y parvient sans se baisser ni se hausser

### Requirement: Portée du câble et rangement

*Origine : `004-borne-recharge` FR-006 et FR-007. Critère mesurable : SC-002.*

Le câble de recharge DOIT atteindre la prise du véhicule dans les positions de
stationnement praticables, sans tension et sans reposer au sol. Cette vérification DOIT être
faite avec le véhicule réellement utilisé.

Un **emplacement de rangement du câble** DOIT être prévu, hors du passage du
véhicule et hors de la zone de ruissellement au sol.

#### Scenario: Branchement du véhicule
- **WHEN** le véhicule réellement utilisé est stationné dans une position praticable
- **THEN** le câble atteint sa prise sans tension et sans reposer au sol

#### Scenario: Rangement du câble
- **WHEN** le câble n'est pas en usage
- **THEN** il est rangé à son emplacement, hors du passage du véhicule et hors de la zone de ruissellement
