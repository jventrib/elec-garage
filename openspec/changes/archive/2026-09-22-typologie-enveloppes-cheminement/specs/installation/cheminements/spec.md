# Spec Delta

## ADDED Requirements

### Requirement: Typologie des enveloppes de cheminement

*Découle de la constitution v1.13.0 et de l'exigence de boîte « à chaque changement de
direction qui ne se traite pas par un accessoire de conduit ».*

Le projet DOIT distinguer les rôles que la constitution distingue, et NE DOIT PAS les réunir
sous une même déclaration. Cinq rôles sont tenus :

| Rôle | Achemine | Abrite une connexion | Enveloppe une connexion |
|---|---|---|---|
| conduit IRL | oui | non | non |
| goulotte à capot démontable | oui | oui | **non** |
| boîte de dérivation | non | oui | oui |
| organe de connexion sous capot | non | — | oui |
| accessoire de conduit | non | non | non |

Un objet DOIT porter le rôle qu'il tient. Déclarer une goulotte, un organe de connexion ou un
accessoire de conduit comme une boîte de dérivation NE DOIT PAS être admis : les trois
n'appellent ni le même encombrement, ni le même repérage, ni les mêmes obligations de dossier.

#### Scenario: Déclaration d'une enveloppe
- **WHEN** une enveloppe de cheminement est déclarée
- **THEN** elle porte le rôle qu'elle tient, et non un rôle voisin retenu faute de mieux

#### Scenario: Goulotte déclarée comme boîte
- **WHEN** une goulotte est déclarée comme boîte de dérivation
- **THEN** la déclaration est rejetée, une goulotte n'enveloppant pas les connexions qu'elle abrite

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
l'appliquait à tout cheminement.*

Un cheminement DOIT déclarer son **mode de raccordement** : par les **extrémités**, comme un
conduit, ou **latéralement**, comme une goulotte à capot démontable.

Un cheminement à raccordement **latéral** DOIT admettre qu'un autre cheminement s'y raccorde en
tout point de son parcours, et non à ses seuls bouts.

La règle interdisant une **extrémité pendante** NE DOIT s'appliquer qu'aux cheminements à
raccordement **par les extrémités**. Sur un cheminement à raccordement latéral, une extrémité qui
ne rejoint rien n'est **pas** un défaut : elle marque l'endroit où le profilé s'arrête, et non un
point d'où des conducteurs sortiraient dans le vide.

Rationale : la règle vise des conducteurs qui déboucheraient sans enveloppe ni destination. Sur un
profilé dont les conducteurs entrent et sortent par les côtés, la longueur du produit posé n'a pas
à coïncider avec celle du parcours des conducteurs. Maintenir la règle en l'état obligerait soit à
tronquer le profilé dans le modèle — la maquette cesserait de montrer ce qui est posé —, soit à
inventer un objet à son extrémité haute.

#### Scenario: Raccordement en cours de parcours
- **WHEN** un cheminement se raccorde à une goulotte ailleurs qu'à l'une de ses extrémités
- **THEN** le raccordement est admis, et aucun défaut n'est signalé

#### Scenario: Extrémité haute d'un profilé
- **WHEN** une goulotte monte au-delà du point où ses conducteurs la quittent
- **THEN** son extrémité libre n'est pas un défaut, le profilé étant représenté à sa longueur posée

#### Scenario: Extrémité pendante d'un conduit
- **WHEN** un conduit a une extrémité qui ne rejoint ni composant, ni enveloppe, ni traversée, ni autre cheminement
- **THEN** le défaut est signalé, la règle gardant toute sa portée sur les cheminements à raccordement par les extrémités

### Requirement: Organe de connexion à enveloppe propre

*Origine : constitution v1.13.0, conditions 2 et 3 de l'exception de goulotte.*

Toute connexion abritée par une goulotte DOIT être réalisée dans un **organe de connexion à
enveloppe propre**, déclaré comme tel. La goulotte **abrite** la connexion, elle ne
l'**enveloppe** pas : une connexion nue sous capot reste interdite.

Chaque organe de connexion DOIT porter un **repère lisible sans déposer le capot**, et le
dossier DOIT énumérer ces emplacements **au même titre que les boîtes de dérivation**.

Un organe de connexion DOIT être déclaré partout où des conducteurs se séparent à l'intérieur
d'une goulotte. Le point où le tronc et la branche d'éclairage divergent en est un : il NE DOIT
PAS être tenu pour une simple coïncidence géométrique entre deux tracés et le volume qui les
contient.

#### Scenario: Séparation de deux circuits sous capot
- **WHEN** deux circuits se séparent à l'intérieur d'une goulotte
- **THEN** un organe de connexion à enveloppe propre y est déclaré, repéré et énuméré au dossier

#### Scenario: Connexion nue sous capot
- **WHEN** une connexion est faite sous le capot sans enveloppe propre
- **THEN** elle est refusée, la goulotte n'enveloppant pas ce qu'elle abrite

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

## MODIFIED Requirements

### Requirement: Toute connexion dans une boîte

*Origine : `002-prises-de-courant` FR-027. Critère mesurable : SC-011. Étendu par la
constitution v1.13.0, qui admet l'organe de connexion sous capot — l'exigence d'origine est
antérieure à cet amendement et n'en tenait pas compte.*

Une **boîte de dérivation** DOIT être posée à chaque jonction de parcours, à chaque
dérivation, et à chaque changement de direction **qui ne se traite pas par un accessoire de
conduit**. Toute connexion DOIT se faire dans une enveloppe propre — boîte de dérivation,
enveloppe d'appareillage, ou organe de connexion abrité par une goulotte — jamais dans un
conduit, jamais nue sous un capot, et jamais derrière un socle. Aucune enveloppe NE DOIT être
rendue inaccessible par les travaux.

#### Scenario: Recensement des connexions
- **WHEN** les connexions de l'installation sont recensées
- **THEN** 100 % d'entre elles se trouvent dans une enveloppe propre — boîte de dérivation, enveloppe d'appareillage ou organe de connexion — et aucune n'a été rendue inaccessible par les travaux

#### Scenario: Changement de direction sans connexion
- **WHEN** un changement de direction ne porte aucune dérivation et aucune connexion
- **THEN** il n'appelle pas de boîte de dérivation

### Requirement: Goulotte support partagé

*Origine : `005-automatisation-locale` FR-035. La goulotte étant désormais déclarée comme un
cheminement, les règles du support partagé s'énoncent sur le cheminement et non sur un
composant.*

La goulotte étant un cheminement **partagé** — elle portera le tronc des prises et de
l'éclairage, et la ligne de la borne en transit —, les règles de repérage d'un support à
plusieurs circuits s'y appliquent à l'identique. Elle DOIT déclarer les circuits qu'elle porte,
au même titre que tout cheminement.

La ligne de la borne **transite** la goulotte et n'y reçoit **aucune connexion**. Aucun organe de
connexion de la goulotte NE DOIT porter de conducteur du circuit de la borne.

*Corrigé en cours d'implémentation : l'exigence d'origine affirmait que la ligne de la borne
« conserve son conduit » dans la goulotte. **C'est faux dans le tracé arrêté** — entre la fin de
CH-B1 à z = 2,60 et le départ de CH-B2 à z = 2,64, elle franchit 0,04 m sans aucun conduit, le
volume de la goulotte assurant tacitement le passage. L'exigence décrivait une intention, pas les
cotes.*

La ligne de la borne DOIT y être **un câble à enveloppe propre**, et non des conducteurs isolés
nus. Décision du maître d'ouvrage. Cette exigence dépend de l'amendement du Principe IV, dont la
dédicace du conduit est aujourd'hui énoncée sans référence de clause.

#### Scenario: Ligne de la borne dans la goulotte
- **WHEN** la ligne de la borne transite par la goulotte
- **THEN** elle y est un câble à enveloppe propre et n'y reçoit aucune connexion

#### Scenario: Circuits déclarés par la goulotte
- **WHEN** la goulotte est déclarée
- **THEN** elle porte la liste des circuits qu'elle achemine, comme tout cheminement
