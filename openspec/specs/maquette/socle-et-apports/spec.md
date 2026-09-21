# Socle et apports

## Purpose

Le socle de données de la maquette et le contrat par lequel chaque fonctionnalité électrique
y verse ses circuits, ses composants, ses cheminements, ses traversées et ses étapes de
montage. Cette capacité couvre la composition des apports en une séquence unique, la règle
de source unique de la donnée, et les contrôles de cohérence qui interdisent de présenter
au chantier une séquence défaillante.

Elle existe pour que l'ajout d'un point d'utilisation, d'un cheminement ou d'une étape se
fasse en modifiant les seules données, sans jamais toucher à la logique de rendu ni de
navigation.

## Requirements

### Requirement: Géométrie, composants et étapes sont des données

*Origine : `001-visualisation-3d` FR-020. Critère mesurable : SC-007.*

La géométrie du local, la liste des composants et la séquence d'étapes DOIVENT
être des données. Ajouter, retirer ou réordonner une étape, ou déplacer un composant, NE
DOIT PAS exiger de modifier la logique de rendu ou de navigation.

#### Scenario: Ajout d'un point d'utilisation
- **WHEN** un point d'utilisation ou une étape de montage est ajouté
- **THEN** seules les données sont modifiées, sans aucune modification de la logique de rendu ni de navigation

### Requirement: Source unique de chaque cote

*Origine : `001-visualisation-3d` FR-021.*

Une cote ou une caractéristique NE DOIT figurer qu'à un seul endroit des
données. Aucune valeur NE DOIT être répétée à deux endroits susceptibles de diverger.

#### Scenario: Recherche d'une cote dans les données
- **WHEN** une cote ou une caractéristique est cherchée dans les données
- **THEN** elle ne figure qu'à un seul endroit, et n'est répétée à aucun autre endroit susceptible de diverger

### Requirement: Socle ouvert aux apports

*Origine : `001-visualisation-3d` FR-022.*

Le socle DOIT accepter les apports de plusieurs fonctionnalités électriques
(prises de courant, éclairage, borne de recharge) sans modification de sa propre logique,
chacune y apportant ses composants et ses étapes.

#### Scenario: Arrivée d'une fonctionnalité
- **WHEN** une fonctionnalité électrique verse ses composants et ses étapes au socle
- **THEN** le socle les accepte sans modification de sa propre logique

### Requirement: Séquence unique couvrant tout le garage

*Origine : `001-visualisation-3d` FR-023. Critère mesurable : SC-012.*

Les apports des différentes fonctionnalités électriques DOIVENT être composés en
une séquence unique couvrant l'ensemble du garage, ordonnée par la chronologie réelle du
chantier. L'installateur NE DOIT PAS avoir à choisir entre plusieurs séquences, ni à
exécuter une fonctionnalité de bout en bout avant d'entamer la suivante.

#### Scenario: Exécution du chantier
- **WHEN** l'installateur exécute l'intégralité du chantier
- **THEN** la séquence présentée est unique, sans avoir à sélectionner un lot ni à changer de document

### Requirement: Ordonnancement par phase et dépendances déclarées

*Origine : `001-visualisation-3d` FR-024.*

Chaque étape apportée DOIT déclarer la phase de chantier à laquelle elle
appartient et les étapes dont elle dépend. L'ordre de la séquence unique DOIT découler de
ces déclarations, et non de l'ordre d'arrivée des fonctionnalités contributrices ni de leur
numérotation.

#### Scenario: Composition de l'ordre
- **WHEN** la séquence unique est composée
- **THEN** son ordre découle des phases et des dépendances déclarées, et non de l'ordre d'arrivée des fonctionnalités ni de leur numérotation

### Requirement: Étapes communes déclarées par chaque apport, conservées une fois

*Origine : `001-visualisation-3d` FR-025 ; `002-prises-de-courant` FR-027 (par renvoi) ;
`003-eclairage` FR-027 ; `004-borne-recharge` FR-029.*

Les étapes communes à plusieurs fonctionnalités, au premier rang desquelles la
consignation et sa levée, NE DOIVENT apparaître qu'une seule fois dans la séquence, quel que
soit le nombre de fonctionnalités contributrices.

Les étapes de consignation et de levée de consignation DOIVENT être déclarées même
si une autre fonctionnalité les déclare aussi : le socle n'en conserve qu'une, et c'est à lui
de le faire, non à la fonctionnalité contributrice de les omettre.

#### Scenario: Deux fonctionnalités déclarent la consignation
- **WHEN** plusieurs fonctionnalités déclarent chacune la consignation et sa levée
- **THEN** chacune la déclare, et le socle n'en conserve qu'une seule occurrence dans la séquence composée

### Requirement: Détection des défauts de cohérence de séquence

*Origine : `001-visualisation-3d` FR-026.*

Le système DOIT détecter et signaler au concepteur : une étape sans instruction
écrite, une étape dont l'illustration ne montre aucun des composants qu'elle annonce, un
composant rattaché à aucune étape, une étape référençant un composant absent de la maquette,
une dépendance déclarée vers une étape inexistante, et toute boucle de dépendances rendant
l'ordonnancement impossible.

#### Scenario: Étape sans instruction
- **WHEN** une étape est déclarée sans instruction écrite
- **THEN** le système le détecte et le signale au concepteur

#### Scenario: Boucle de dépendances
- **WHEN** les dépendances déclarées forment une boucle rendant l'ordonnancement impossible
- **THEN** le système le détecte et le signale au concepteur

### Requirement: Détection des défauts de cohérence de tracé

*Origine : `001-visualisation-3d` FR-042. Critère mesurable : SC-021.*

Le système DOIT détecter et signaler, au titre de FR-026 : un segment non
orthogonal ; un segment qui ne repose sur aucune face de paroi ni de plafond ; un cheminement
dont une extrémité ne rejoint ni composant ni boîte ; un circuit dont le tracé est interrompu
entre le tableau et l'un de ses points ; et une jonction de trois segments ou plus qui ne se
fait pas dans une boîte de dérivation.

#### Scenario: Jonction hors boîte
- **WHEN** trois segments ou plus se rejoignent hors d'une boîte de dérivation
- **THEN** le système le détecte et le signale, et aucune telle jonction ne subsiste dans les données validées

#### Scenario: Circuit interrompu
- **WHEN** le tracé d'un circuit est interrompu entre le tableau et l'un de ses points
- **THEN** le système le détecte et le signale au concepteur

### Requirement: Séquence défaillante non présentée au chantier

*Origine : `001-visualisation-3d` FR-027 et FR-043.*

Tant qu'un défaut de cohérence de séquence ou de tracé subsiste, la séquence NE DOIT PAS être
présentée comme utilisable au chantier.

#### Scenario: Défaut subsistant
- **WHEN** un défaut de cohérence de séquence ou de tracé subsiste
- **THEN** la séquence n'est pas présentée comme utilisable au chantier

### Requirement: Tracés apportés, jamais codés

*Origine : `001-visualisation-3d` FR-041. Critère mesurable : SC-022.*

Les cheminements, les boîtes et les traversées DOIVENT être des données apportées
par les fonctionnalités électriques, au même titre que les composants et les étapes. Aucun
tracé NE DOIT vivre dans le code, dans le prolongement de FR-020 et FR-022.

#### Scenario: Ajout d'un cheminement
- **WHEN** un cheminement, une boîte ou une traversée est ajouté
- **THEN** seules les données sont modifiées, sans aucune modification de la logique de rendu ni de navigation

### Requirement: Contrat d'apport de chaque fonctionnalité électrique

*Origine : `002-prises-de-courant` FR-038 ; `003-eclairage` FR-026 ; `004-borne-recharge`
FR-028.*

Chaque fonctionnalité électrique DOIT verser à la maquette, au format du contrat d'apport de
`001-visualisation-3d`, ses circuits, ses composants — socles, sorties, points de commande,
borne **et boîtes de dérivation** —, ses cheminements, ses traversées et ses étapes de
montage.

#### Scenario: Apport d'une fonctionnalité
- **WHEN** une fonctionnalité électrique verse son apport
- **THEN** il porte ses circuits, ses composants, ses boîtes de dérivation, ses cheminements, ses traversées et ses étapes de montage, au format du contrat d'apport

### Requirement: Diamètre déclaré par le cheminement apporté

*Origine : `002-prises-de-courant` FR-039.*

Chaque cheminement apporté DOIT déclarer le ou les circuits qu'il porte, et son
diamètre — 20 mm pour le circuit des prises, conformément à FR-035.

#### Scenario: Déclaration d'un cheminement
- **WHEN** un cheminement est apporté
- **THEN** il déclare le ou les circuits qu'il porte et son diamètre

### Requirement: Caractéristique non établie apportée comme inconnue

*Origine : `002-prises-de-courant` FR-040 ; `003-eclairage` FR-028 ; `004-borne-recharge`
FR-030.*

Toute caractéristique que la note de calcul n'a pas encore établie — section,
calibre, indice de protection — DOIT être apportée comme **inconnue** et non comme une valeur
plausible. L'implantation et les tracés sont donc livrables avant la note de calcul, sans
rien anticiper d'elle. Le diamètre du conduit échappe à cette règle : il est décidé, pas
déduit.

#### Scenario: Apport avant la note de calcul
- **WHEN** une fonctionnalité verse son apport avant que la note de calcul ait établi une section, un calibre ou un indice de protection
- **THEN** la caractéristique est apportée comme inconnue, et aucune valeur plausible ne lui est substituée

#### Scenario: Diamètre du conduit
- **WHEN** le diamètre d'un conduit est apporté
- **THEN** il est porté comme décidé, et non comme inconnu en attente de la note de calcul

### Requirement: Longueur de conducteur sous un capot

*Changement `goulotte-paroi-est`, 2026-09-24. Une goulotte de 6,00 m que la plupart des
conducteurs quittent à 1,90 m.*

La longueur d'un conducteur DOIT compter chaque **conduit** qu'il emprunte pour sa longueur
entière, car on ne sort pas d'un tube en chemin. Elle DOIT compter chaque **profilé à raccordement
latéral** pour la **seule longueur que son trajet y parcourt**, car on sort d'un profilé par une
face, là où le trajet le quitte.

Le décompte majorant, faute de trajet dérivé, DOIT continuer de compter les profilés entiers : un
majorant ne se réduit pas.

#### Scenario: Conducteur qui quitte la goulotte en chemin
- **WHEN** un conducteur parcourt 1,90 m d'une goulotte de 6,00 m puis en sort par le dessous
- **THEN** son métré compte 1,90 m de goulotte, plus l'écart de l'axe à la face, et non 6,00 m

#### Scenario: Circuit non dérivable
- **WHEN** le trajet des conducteurs d'un circuit ne se dérive pas
- **THEN** le métré retombe sur le majorant, profilés comptés entiers, et il est annoncé comme majoré
