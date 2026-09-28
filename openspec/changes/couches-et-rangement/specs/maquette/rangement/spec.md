# Spec Delta — maquette/rangement

## Purpose

La représentation, dans la maquette 3D, des éléments de rangement du garage — étagères,
rack à pneus — à côté de l'installation électrique : leur apport en données, l'origine
explicite de leurs cotes, leur désignation et leur fiche, et leur statut de mobilier
plutôt que d'objet d'installation. Cette capacité couvre ce que le rangement **n'est pas**
aussi sûrement que ce qu'il est : ni un obstacle qui contraindrait les tracés, ni un objet
de la séquence de montage.

Elle existe parce que le rangement est le premier contenu de la maquette dont les cotes ne
viennent pas d'un relevé du maître d'ouvrage, et parce qu'un mobilier présenté comme
établi ferait prendre une mesure au chantier sur une géométrie qui ne l'est pas.

## ADDED Requirements

### Requirement: Le rangement est une donnée apportée, jamais codée

*Origine : `couches-et-rangement`, 2026-09-27. Porte FR-020 et FR-041 au-delà du
périmètre électrique.*

Les éléments de rangement DOIVENT être des données, apportées dans un fichier d'apport
distinct, au même titre que les composants et les tracés. Aucun élément de rangement NE DOIT
vivre dans le code, et l'ajout, le déplacement ou le retrait d'un élément NE DOIT PAS exiger
de modifier la logique de rendu ni de navigation.

Le rangement DOIT être fusionné avec les autres apports plutôt que chargé à côté d'eux, et
un élément de rangement DOIT survivre au chargement de la maquette au même titre qu'un
composant.

#### Scenario: Ajout d'un élément de rangement

- **WHEN** un élément de rangement est ajouté
- **THEN** seules les données sont modifiées, sans aucune modification de la logique de rendu ni de navigation

#### Scenario: Apport de rangement pris en compte

- **WHEN** un apport déclare des éléments de rangement
- **THEN** ils sont chargés et visibles dans la maquette, au même titre que les composants

#### Scenario: Geste sur un rangement

- **WHEN** l'installateur désigne puis déplace un élément de rangement
- **THEN** la maquette réagit sans qu'aucune modification du code soit requise

### Requirement: Implantation murale déclarée

*Origine : `couches-et-rangement`, 2026-09-27.*

Un élément de rangement DOIT déclarer la paroi à laquelle il est fixé, et sa position sur
cette paroi. Le rangement étant **mural** et destiné à préserver l'espace de stationnement,
un élément qui ne serait rattaché à aucune paroi DOIT être rejeté à la validation comme
une implantation incomplète.

#### Scenario: Élément fixé à une paroi

- **WHEN** un élément de rangement déclare sa paroi et sa position
- **THEN** il est représenté sur cette paroi, à cette position

#### Scenario: Élément sans paroi

- **WHEN** un élément de rangement ne déclare aucune paroi
- **THEN** le système le signale au concepteur et ne le présente pas comme implanté

#### Scenario: Paroi occupée par l'installation

- **WHEN** un élément de rangement est implanté sur une paroi
- **THEN** son implantation est lisible en regard des composants et des conduits déjà présents
  sur cette paroi

### Requirement: Origine déclarée de chaque cote de rangement

*Origine : `couches-et-rangement`, 2026-09-27. Porte FR-021 et FR-007.*

Chaque cote portée par un élément de rangement DOIT déclarer son **origine**, et cette
origine DOIT être consultable dans la maquette comme dans la fiche. Les origines reconnues
sont, et ne sont que : un **relevé** du maître d'ouvrage, une **déclaration fabricant**, ou
un **gabarit de catalogue** conventionnel.

Une origine NE DOIT PAS être déduite de l'interface, du type d'objet ou d'un catalogue : elle
DOIT être déclarée dans les données. À défaut, la cote est **inconnue**.

Un élément représenté à un gabarit de catalogue DOIT porter la mention de cette convention
partout où il est présenté, sans qu'elle puisse être écartée.

#### Scenario: Élément à gabarit conventionnel

- **WHEN** un élément de rangement est représenté à un gabarit de catalogue
- **THEN** il porte la mention « conventionnel — non relevé », dans la maquette et dans sa fiche

#### Scenario: Origine consultée

- **WHEN** l'installateur consulte la fiche d'un élément de rangement
- **THEN** il y lit l'origine de chacune de ses cotes, et non seulement leur valeur

#### Scenario: Cote sans origine déclarée

- **WHEN** une cote de rangement ne déclare aucune origine
- **THEN** elle est traitée comme inconnue, et aucune origine ne lui est attribuée

### Requirement: Trois états de cote, dont la contradiction

*Origine : `couches-et-rangement`, 2026-09-27. Étend FR-007, qui ne connaît que l'inconnue.*

L'état d'une cote de rangement DOIT être l'un des trois suivants, et **seulement** de ceux-là :
**relevée**, **inconnue**, ou **contradictoire**. La maquette DOIT les distinguer.

Une cote **relevée** est établie par le maître d'ouvrage. Une cote **inconnue** n'est pas
déterminée, et s'affiche comme telle, sans jamais recevoir de valeur plausible. Une cote
**contradictoire** est **déclarée** — un document existe — mais deux déclarations de ce
document se contredisent, et la page ne les réconcilie pas.

La contradiction est un état **distinct** de l'inconnue, et ne DOIT être ramenée ni à l'une
ni à l'autre. La traiter comme relevée ferait passer pour établi un volume qui ne l'est pas ;
la traiter comme inconnue effacerait un document que le maître d'ouvrage a en main et lui
dirait « néant » là où il dispose d'une fiche à faire préciser.

#### Scenario: Cote inconnue

- **WHEN** une cote de rangement est inconnue
- **THEN** elle s'affiche explicitement comme inconnue, et ne reçoit aucune valeur de remplacement

#### Scenario: Cote contradictoire

- **WHEN** deux déclarations portées par un même document se contredisent
- **THEN** la cote affecte l'état contradictoire, distinct de l'inconnue et de la relevée

#### Scenario: Cote contradictoire et cote inconnue

- **WHEN** un élément porte une cote contradictoire et une cote inconnue
- **THEN** les deux états se lisent distinctement, et ne sont pas confondus

### Requirement: Une déclaration contradictoire est signalée avec ses deux termes

*Origine : `couches-et-rangement`, 2026-09-27.*

Lorsqu'une cote est contradictoire, la maquette DOIT exposer **les deux déclarations en
conflit**, et le document qui les porte. L'élément concerné NE DOIT PAS être présenté comme
dont l'encombrement est établi.

La contradiction DOIT figurer au bilan des cotes manquantes, et y être signalée comme telle :
elle appelle de la part du maître d'ouvrage une **précision à obtenir**, ce qui n'est pas la
même demande qu'une **mesure à faire**, et l'installateur ne peut pas y répondre de la même
manière.

#### Scenario: Conflit exposé

- **WHEN** un élément porte une cote contradictoire
- **THEN** les deux déclarations en conflit et le document qui les porte sont consultables

#### Scenario: Élément non présenté comme établi

- **WHEN** un élément porte une cote contradictoire
- **THEN** il n'est pas présenté comme dont l'encombrement est établi

#### Scenario: Demande de précision au bilan

- **WHEN** le bilan des cotes est consulté
- **THEN** les cotes contradictoires y figurent comme une demande de précision au
  maître d'ouvrage, distincte d'une demande de relevé

### Requirement: Le rangement n'est pas un obstacle de collision

*Origine : `couches-et-rangement`, 2026-09-27.*

Un élément de rangement NE DOIT PAS être traité comme un obstacle d'implantation : il ne
contraint pas les cheminements, et sa présence NE DOIT faire relancer aucun contrôle de
collision des tracés.

Les contrôles de collision portent sur le dossier électrique, qui est cohérent. Y intégrer
du mobilier ferait produire des verdicts nouveaux sur un dossier déjà arrêté, et
recommencerait à annoncer des réserves dont l'origine n'est pas un défaut de tracé.

Cette non-contrainte est un **choix explicite**, et non un oubli : le jour où le rangement
existe réellement et où son encombrement est établi, la question de sa confrontation aux
tracés DOIT être reposée.

#### Scenario: Tracé à côté d'un rangement

- **WHEN** un cheminement passe au voisinage d'un élément de rangement
- **THEN** aucune collision n'est signalée du fait du rangement

#### Scenario: Contrôles inchangés par l'ajout d'un rangement

- **WHEN** un élément de rangement est ajouté à la maquette
- **THEN** le bilan des collisions de l'installation électrique est inchangé

### Requirement: Le rangement n'appartient pas à la séquence de pose

*Origine : `couches-et-rangement`, 2026-09-27. Porte FR-010, qui ne vaut que pour les
travaux électriques.*

Un élément de rangement NE DOIT PAS figurer dans la séquence de montage, et NE DOIT PAS
être posé ni retiré par une étape. Le rangement est un **contexte fixe** : il est présent
dès l'ouverture de la maquette, et le reste quelle que soit l'étape courante.

Le rangement NE DOIT PAS être concerné par les registres visuels de l'état d'une étape, qui
portent sur ce qu'une étape ajoute et sur ce qui était déjà en place.

#### Scenario: Présence indépendante de l'étape

- **WHEN** la maquette est ouverte sur une étape quelconque
- **THEN** les éléments de rangement sont présents, sans être portés par une étape

#### Scenario: Aucun registre d'étape sur le rangement

- **WHEN** la séquence est parcourue
- **THEN** les éléments de rangement ne sont ni mis en évidence, ni grisés, ni signalés
  comme ajoutés ou déjà en place

### Requirement: Désignation et fiche d'un élément de rangement

*Origine : `couches-et-rangement`, 2026-09-27. Porte FR-006, FR-046 et FR-049.*

Un élément de rangement DOIT être sélectionnable dans la vue, au même titre qu'un
composant. Il DOIT porter une **désignation lisible**, déclarée dans les données, et ne
DOIT jamais être présenté à l'installateur sous un identifiant machine.

Sa fiche DOIT porter : sa désignation, sa paroi et sa position, l'encombrement retenu et
**l'origine de chaque cote**, l'état de chaque cote selon FR-007 étendu, les contradictions
relevées le concernant, et le document dont ses caractéristiques sont tirées.

#### Scenario: Sélection d'un élément de rangement

- **WHEN** l'installateur désigne un élément de rangement
- **THEN** sa fiche porte sa désignation, son implantation, l'origine de ses cotes, leurs
  états et les réserves qui les concernent

#### Scenario: Provenance consultable

- **WHEN** la fiche d'un élément de rangement est consultée
- **THEN** le document dont ses caractéristiques sont tirées est nommé, et distinguable
  d'un relevé du maître d'ouvrage

#### Scenario: Élément à gabarit de catalogue

- **WHEN** un élément représenté à un gabarit de catalogue est désigné
- **THEN** sa fiche porte la mention de cette convention, et ne la présente pas comme un relevé
