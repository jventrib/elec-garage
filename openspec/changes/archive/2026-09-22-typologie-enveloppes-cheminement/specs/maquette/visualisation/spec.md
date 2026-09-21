# Spec Delta

## ADDED Requirements

### Requirement: Le volume déclaré prime sur le gabarit de type

*Corrige le défaut qui a rendu GL-01 onze fois trop courte dans la vue : le rendu prenait ses
dimensions dans le catalogue des types et ignorait celles portées par l'objet lui-même.*

Lorsqu'un objet déclare son propre **volume**, la maquette DOIT le représenter à ce volume. Le
gabarit du type NE DOIT servir que de **repli**, pour les objets qui n'en déclarent pas.

Un gabarit de type NE DOIT PAS écraser une dimension déclarée. Une dimension déclarée est une
cote au même titre qu'un relevé, et la représenter par la valeur conventionnelle d'un type
revient à substituer une valeur plausible à une valeur connue.

La fiche d'un objet et sa représentation dans la vue DOIVENT porter la **même** cote. Une fiche
qui annonce une dimension que l'objet dessiné ne tient pas est une divergence au sens du
Principe VI, et la maquette DOIT être corrigée.

#### Scenario: Objet portant son propre volume
- **WHEN** un objet déclare ses dimensions
- **THEN** il est dessiné à ces dimensions, et non au gabarit de son type

#### Scenario: Objet sans volume déclaré
- **WHEN** un objet ne déclare aucune dimension
- **THEN** le gabarit de son type est utilisé comme repli

#### Scenario: Accord de la fiche et de la vue
- **WHEN** la fiche d'un objet est comparée à sa représentation dans la vue
- **THEN** les deux portent la même cote, sans écart

### Requirement: Représentation d'une section non circulaire

*Découle de l'admission de la goulotte comme cheminement : le modèle de cheminement ne
connaissait qu'un diamètre, et une section rectangulaire ne s'y ramène pas.*

La maquette DOIT représenter un cheminement à section **non circulaire** à son encombrement
réel, largeur et profondeur distinctes. Un cheminement à section rectangulaire NE DOIT PAS être
figuré par une section carrée déduite d'un diamètre.

Un cheminement dont la section n'est pas encore arrêtée DOIT être dessiné à une section
conventionnelle et sa fiche DOIT porter la mention explicite que la valeur est inconnue, au même
titre qu'un conduit dont le diamètre n'est pas arrêté.

#### Scenario: Goulotte à section rectangulaire
- **WHEN** une goulotte de 120 × 60 mm est affichée
- **THEN** elle est dessinée à 120 mm de largeur et 60 mm de profondeur, et non à une section carrée

### Requirement: Enveloppes consultables selon leur rôle

*Étend à la nouvelle typologie la règle d'identité déjà tenue pour les boîtes de dérivation.*

Une goulotte, un organe de connexion et un accessoire de conduit DOIVENT être sélectionnables et
consultables dans la vue, et leur fiche DOIT porter le **rôle** qu'ils tiennent.

La fiche d'un organe de connexion DOIT porter son repère et la mention qu'il est énuméré au
dossier au titre des emplacements de connexion. La fiche d'un accessoire de conduit DOIT porter
qu'**aucune connexion** ne s'y fait, afin que l'installateur ne l'ouvre pas en attendant d'y
trouver des bornes.

#### Scenario: Consultation d'un accessoire de conduit
- **WHEN** l'installateur désigne un accessoire de conduit dans la vue
- **THEN** sa fiche porte son rôle et la mention qu'aucune connexion ne s'y fait

#### Scenario: Consultation d'un organe de connexion
- **WHEN** l'installateur désigne un organe de connexion dans la vue
- **THEN** sa fiche porte son repère et sa qualité d'emplacement de connexion énuméré au dossier

## MODIFIED Requirements

### Requirement: Cheminement représenté à son tracé réel

*Origine : `001-visualisation-3d` FR-032. Critère mesurable : SC-017. Découle de la
constitution v1.3.0 : les parois étant en béton non isolé, la pose est apparente, et un
cheminement cesse d'être une liaison logique entre deux points pour devenir un objet posé
sur la paroi, visible, encombrant et opposable. Étendu aux cheminements à section non
circulaire, la goulotte étant admise à tenir lieu de conduit depuis la constitution v1.13.0.*

La maquette DOIT représenter chaque cheminement à son tracé réel, sur
la face de paroi ou de plafond où il est posé, avec son encombrement — **quelle que soit sa
section, circulaire ou non**. Un cheminement NE DOIT PAS être figuré par un trait joignant deux
composants, ni par un volume qui ne serait pas le sien.

Un cheminement DOIT couvrir la **totalité** de son parcours déclaré. Aucun intervalle NE DOIT
subsister entre une extrémité de cheminement et l'objet qu'elle rejoint : un intervalle visible
là où le tracé est continu se lit comme une rupture du circuit, et contredit le suivi exigé du
tableau jusqu'au dernier point.

#### Scenario: Appui des cheminements
- **WHEN** les cheminements affichés sont contrôlés
- **THEN** 100 % d'entre eux reposent sur une face de paroi ou de plafond, à leur tracé coté, et aucun n'est figuré par un trait entre deux composants

#### Scenario: Continuité visible d'un parcours
- **WHEN** un cheminement rejoint l'objet déclaré à son extrémité
- **THEN** aucun intervalle ne subsiste entre les deux dans la vue

### Requirement: Boîte de dérivation, composant de plein droit

*Origine : `001-visualisation-3d` FR-033. Critère mesurable : SC-019. Étendu à la typologie des
enveloppes : la règle visait la boîte parce qu'elle était la seule enveloppe du projet.*

Les boîtes de dérivation DOIVENT être des composants de plein droit, portant
référence, position, hauteur d'axe, indice de protection et circuit de rattachement, au même
titre qu'un socle. Les règles FR-006 et FR-007 s'y appliquent sans exception.

Il en va **de même pour toute enveloppe** — organe de connexion et accessoire de conduit
compris. Aucune enveloppe NE DOIT être un accessoire implicite du tracé, et aucune NE DOIT
emprunter l'apparence d'une autre.

#### Scenario: Consultation d'une boîte
- **WHEN** l'ensemble des boîtes de dérivation est parcouru
- **THEN** 100 % d'entre elles affichent leur référence, leur hauteur d'axe et leur indice de protection, ou la mention explicite que la valeur est inconnue

#### Scenario: Consultation de toute enveloppe
- **WHEN** l'ensemble des enveloppes est parcouru
- **THEN** chacune porte son identité et son rôle propre, et aucune n'emprunte l'apparence d'une autre
