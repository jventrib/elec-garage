# Visualisation

## Purpose

La visualisation 3D interactive du garage, consultable dans un navigateur, qui sert à la fois
de livrable de conception et de guide de montage à l'installateur. Cette capacité couvre la
représentation fidèle du local et de ses composants, la lecture du montage par étapes, et les
conditions dans lesquelles la maquette reste consultable sur le chantier.

Elle porte le Principe VI de la [constitution](../../../constitution.md). La maquette est une
représentation, non la source normative : en cas de divergence avec la note de calcul ou le
schéma unifilaire, ces derniers l'emportent.

## Requirements

### Requirement: Représentation du local à l'échelle

*Origine : `001-visualisation-3d` FR-001.*

La maquette DOIT représenter le garage à l'échelle dans les trois dimensions,
conformément au relevé consigné dans la constitution : œuvre intérieure 5,60 m × 5,60 m,
hauteur sous plafond 2,75 m, parois de 0,20 m, emprise extérieure 6,00 m × 6,00 m.

#### Scenario: Lecture d'une cote dans la maquette
- **WHEN** une cote du local est relevée dans la maquette
- **THEN** elle correspond au relevé de la constitution, sans écart d'échelle

### Requirement: Représentation des trois baies

*Origine : `001-visualisation-3d` FR-002.*

La maquette DOIT représenter les trois baies à leurs positions relevées : porte
sectionnelle de 5,00 m de largeur et **2,10 m de hauteur de passage** sur la paroi sud,
laissant 0,40 m de trumeau à l'est et 0,20 m à l'ouest ; porte de service de
1,10 m × 2,50 m sur la paroi est, bord sud à 1,30 m de l'angle sud-est ; fenêtre de 3,00 m
centrée sur la paroi nord, allège à **1,50 m** et ouverture de 0,53 m de hauteur. Chaque baie DOIT porter sa hauteur d'allège : une ouverture
à mi-hauteur ne DOIT pas être représentée comme partant du sol.

#### Scenario: Baie en allège
- **WHEN** la fenêtre nord est affichée
- **THEN** elle part de son allège à 1,50 m et non du sol

### Requirement: Modélisation des obstacles contraignants

*Origine : `001-visualisation-3d` FR-003.*

La maquette DOIT modéliser les obstacles qui contraignent l'implantation : le
débattement du vantail de la porte de service, ainsi que le tablier et le rail de la porte
sectionnelle, en position ouverte comme en position fermée.

#### Scenario: Bascule des ouvrants
- **WHEN** l'utilisateur bascule la porte sectionnelle en position ouverte
- **THEN** le tablier et le rail occupent leur volume de position ouverte

### Requirement: Observation sous tout angle

*Origine : `001-visualisation-3d` FR-004. Étendu le 2026-09-23 : l'exigence était satisfaite à
la lettre par le mode orbite et manquée dans son objet.*

L'utilisateur DOIT pouvoir observer le local sous n'importe quel angle, y
compris depuis l'intérieur, et atteindre le plafond, le sol et les angles sans zone aveugle.

**Depuis l'intérieur, l'exigence porte sur la direction du regard autant que sur la position.**
Un mode qui entre dans le local en gardant sa cible au centre ne donne qu'une seule direction de
regard, et laisse aveugle tout ce qui n'est pas au centre. Se tenir dans un angle et regarder
l'angle opposé DOIT être possible.

#### Scenario: Atteinte d'un angle
- **WHEN** l'utilisateur oriente la vue vers un angle du local
- **THEN** l'angle est observable, sans zone aveugle

#### Scenario: Regard depuis l'intérieur
- **WHEN** l'utilisateur se place à l'intérieur du local
- **THEN** il peut orienter son regard dans n'importe quelle direction, et non vers un seul point

### Requirement: Distinction des faces de paroi

*Origine : `001-visualisation-3d` FR-005.*

La maquette DOIT distinguer la face intérieure de la face extérieure des
parois, afin qu'un composant posé en façade extérieure soit identifiable comme tel.

#### Scenario: Composant en façade extérieure
- **WHEN** un socle extérieur est affiché
- **THEN** il se lit comme posé sur la face extérieure de sa paroi

### Requirement: Identité consultable de chaque composant

*Origine : `001-visualisation-3d` FR-006. Critère mesurable : SC-003. Étendu le 2026-09-23 :
désigner un objet le met aussi en vue, et non plus seulement en fiche.*

Chaque composant implanté DOIT être positionné à sa cote réelle et DOIT porter,
consultables depuis la vue : sa référence, son type, sa paroi de rattachement, sa hauteur
d'axe, son indice de protection et son circuit de rattachement.

**Consulter un objet DOIT aussi le mettre en vue.** Lire sa fiche sans pouvoir le regarder de
près oblige à le retrouver à la main, et c'est précisément quand on s'apprête à percer qu'on
veut le voir.

#### Scenario: Consultation d'un composant
- **WHEN** l'utilisateur désigne un composant dans la vue
- **THEN** sa référence, son type, sa paroi, sa hauteur d'axe, son indice de protection et son circuit sont consultables

#### Scenario: Couverture complète
- **WHEN** l'ensemble des composants est parcouru
- **THEN** 100 % d'entre eux affichent leur circuit de rattachement, leur hauteur d'axe et leur indice de protection, ou la mention explicite que la valeur est inconnue

#### Scenario: Mise en vue
- **WHEN** l'utilisateur désigne un composant en mode orbite
- **THEN** la vue se recentre sur lui, sans qu'il ait à le retrouver à la main

### Requirement: Aucune valeur inventée

*Origine : `001-visualisation-3d` FR-007. Critère mesurable : SC-004.*

Toute caractéristique non encore déterminée DOIT être affichée explicitement
comme inconnue. Le système NE DOIT JAMAIS substituer une valeur plausible à une valeur
inconnue, ni masquer l'absence de valeur.

#### Scenario: Caractéristique non déterminée
- **WHEN** une caractéristique d'un composant n'est pas encore établie par la note de calcul
- **THEN** elle est affichée explicitement comme inconnue, et aucune valeur plausible ne lui est substituée

#### Scenario: Recensement des valeurs inventées
- **WHEN** l'ensemble de la maquette est contrôlé
- **THEN** zéro caractéristique indéterminée est présentée comme déterminée

### Requirement: Distinction et suivi des circuits

*Origine : `001-visualisation-3d` FR-008.*

Les circuits DOIVENT être visuellement distinguables les uns des autres, et un
circuit DOIT pouvoir être suivi du tableau divisionnaire jusqu'à son dernier point.

#### Scenario: Suivi d'un circuit
- **WHEN** l'utilisateur désigne un circuit
- **THEN** il se suit visuellement du tableau divisionnaire jusqu'à son dernier point

### Requirement: Version dont la maquette dérive

*Origine : `001-visualisation-3d` FR-009.*

La maquette DOIT indiquer de quelle version du schéma et de la note de calcul
elle dérive, afin qu'une divergence puisse être constatée et tranchée en faveur de ces
documents.

#### Scenario: Constat d'une divergence
- **WHEN** la maquette diverge de la note de calcul
- **THEN** la version dont la maquette dérive est lisible, et la note de calcul l'emporte

### Requirement: Séquence ordonnée par l'ordre de pose réel

*Origine : `001-visualisation-3d` FR-010.*

Le montage DOIT être présenté comme une séquence ordonnée d'étapes, suivant
l'ordre de pose réel du chantier et non l'ordre de la nomenclature ni celui de la
numérotation des composants.

#### Scenario: Ordre de la séquence
- **WHEN** la séquence de montage est parcourue
- **THEN** son ordre est celui de la pose réelle du chantier, et non celui de la nomenclature ni de la numérotation

### Requirement: Étape autoportante

*Origine : `001-visualisation-3d` FR-011. Critère mesurable : SC-001. Étendu au perçage :
l'exigence était tenue pour la pose et manquée pour le perçage, où les étapes ne déclaraient
aucun objet.*

Chaque étape DOIT porter son instruction écrite et son illustration dans la vue
3D, ainsi que la liste des composants qu'elle met en place et du matériel nécessaire.
L'installateur NE DOIT PAS avoir à ouvrir un autre document pour savoir quoi poser, où et
avec quoi.

Une étape qui fait **percer** DOIT en outre porter la liste des perçages qu'elle exige et leur
illustration, au même titre qu'une étape de pose porte ses composants. Une instruction de
perçage sans illustration NE DOIT PAS être tenue pour autoportante.

#### Scenario: Lecture d'une étape
- **WHEN** l'installateur atteint une étape
- **THEN** il y trouve l'instruction écrite, l'illustration, les composants mis en place et le matériel nécessaire

#### Scenario: Pose sans document annexe
- **WHEN** un installateur qui découvre le projet réalise la pose
- **THEN** il suit la seule séquence, sans ouvrir aucun autre document, sur 100 % des étapes

#### Scenario: Étape de perçage
- **WHEN** l'installateur atteint une étape qui fait percer
- **THEN** elle porte ses perçages et leur illustration, et non la seule instruction écrite

### Requirement: État à l'issue de l'étape

*Origine : `001-visualisation-3d` FR-012.*

Chaque étape DOIT montrer l'état de l'installation à son issue, et DOIT
distinguer visuellement ce qu'elle ajoute de ce qui était déjà en place.

#### Scenario: Distinction de l'apport
- **WHEN** une étape est affichée
- **THEN** ce qu'elle ajoute se distingue visuellement de ce qui était déjà en place

### Requirement: Consignation et levée comme étapes explicites

*Origine : `001-visualisation-3d` FR-013. Critères mesurables : SC-011, SC-013.*

La consignation et sa levée DOIVENT être des étapes explicites de la séquence.
Aucune étape NE DOIT illustrer, même implicitement, un travail effectué sous tension qui ne
le serait pas en réalité.

#### Scenario: Travail sous tension
- **WHEN** la séquence est parcourue entre la levée de consignation et sa fin
- **THEN** aucune étape de pose n'y est illustrée sans que cela soit conforme à la réalité du chantier

#### Scenario: Unicité de la consignation
- **WHEN** la séquence composée est parcourue
- **THEN** la consignation et sa levée y apparaissent exactement une fois chacune, quel que soit le nombre de fonctionnalités contributrices

### Requirement: Vérifications du Principe V comme étapes

*Origine : `001-visualisation-3d` FR-014. Critère mesurable : SC-010.*

Les vérifications exigées par le Principe V de la constitution (continuité des
conducteurs de protection, résistance de terre, isolement, déclenchement des différentiels,
serrage, concordance du repérage) DOIVENT figurer dans la séquence comme des étapes à part
entière, et non comme une annexe.

#### Scenario: Place des essais dans la séquence
- **WHEN** la séquence est parcourue
- **THEN** 100 % des vérifications exigées par le Principe V y apparaissent comme des étapes, et non comme une annexe

### Requirement: Navigation d'une étape à l'autre

*Origine : `001-visualisation-3d` FR-015.*

L'utilisateur DOIT pouvoir avancer à l'étape suivante et revenir à l'étape
précédente, à tout moment et autant de fois que voulu.

#### Scenario: Avance et retour
- **WHEN** l'utilisateur est sur une étape quelconque
- **THEN** il atteint l'étape précédente ou suivante en une seule action, autant de fois que voulu

### Requirement: Navigation sans perte d'état

*Origine : `001-visualisation-3d` FR-016. Critère mesurable : SC-002.*

La navigation DOIT être sans perte d'état : reculer puis ré-avancer DOIT
restituer exactement l'état précédemment affiché, sans reprise de la séquence depuis le
début.

#### Scenario: Aller-retour
- **WHEN** l'utilisateur recule d'une étape puis ré-avance
- **THEN** l'état restitué est identique à l'état initial, sans reprise depuis le début

### Requirement: Signalement des extrémités de séquence

*Origine : `001-visualisation-3d` FR-017.*

Aux deux extrémités de la séquence, le système DOIT signaler qu'il n'y a pas
d'étape au-delà, sans erreur ni sortie de la séquence.

#### Scenario: Première et dernière étape
- **WHEN** l'utilisateur tente d'aller au-delà de la première ou de la dernière étape
- **THEN** le système signale qu'il n'y a pas d'étape au-delà, sans erreur ni sortie de la séquence

### Requirement: Position dans la séquence

*Origine : `001-visualisation-3d` FR-018.*

L'utilisateur DOIT connaître à tout instant sa position dans la séquence :
numéro de l'étape courante et nombre total d'étapes.

#### Scenario: Repérage de la position
- **WHEN** une étape quelconque est affichée
- **THEN** le numéro de l'étape courante et le nombre total d'étapes sont lisibles

### Requirement: Accès direct à une étape

*Origine : `001-visualisation-3d` FR-019. Critère mesurable : SC-005.*

L'utilisateur DOIT pouvoir atteindre directement une étape désignée sans
parcourir une à une toutes celles qui la précèdent.

#### Scenario: Recherche de l'étape d'un composant
- **WHEN** un tiers non familier du projet cherche l'étape à laquelle un composant désigné est posé
- **THEN** il l'atteint en moins de 30 secondes, sans parcourir une à une les étapes qui la précèdent

### Requirement: Reprise à la dernière étape atteinte

*Origine : `001-visualisation-3d` FR-031. Critère mesurable : SC-016.*

À la réouverture, le lecteur DOIT reprendre à la dernière étape atteinte lors de
la session précédente. Aucun marquage des étapes exécutées n'est géré : le lecteur mémorise
une position, pas un état d'avancement des travaux.

#### Scenario: Réouverture
- **WHEN** la visualisation est rouverte et que la séquence n'a pas changé entre-temps
- **THEN** le lecteur affiche la dernière étape atteinte lors de la session précédente

### Requirement: Ouverture sans installation ni service tiers

*Origine : `001-visualisation-3d` FR-028.*

La visualisation DOIT s'ouvrir dans un navigateur récent sans installation
préalable, sans serveur applicatif, sans compte utilisateur et sans dépendance à un service
tiers en ligne.

#### Scenario: Ouverture dans un navigateur
- **WHEN** la visualisation est ouverte dans un navigateur récent
- **THEN** elle fonctionne sans installation préalable, sans serveur applicatif, sans compte utilisateur et sans service tiers

### Requirement: Deux usages, une interface

*Origine : `001-visualisation-3d` FR-029. Critères mesurables : SC-008, SC-009. Amendé le
2026-09-23 : le mode de déplacement libre est au clavier seul, sur décision du maître
d'ouvrage.*

La visualisation DOIT servir deux usages avec la même interface : la préparation
sur poste fixe hors chantier, et la lecture sur tablette ou téléphone tenu en main sur le
chantier. La mise en page DOIT s'adapter à la taille de l'écran, et les interactions DOIVENT
fonctionner aussi bien au toucher qu'à la souris et au clavier.

**Une exception, et une seule : le mode de déplacement libre est au clavier.** Elle est
déclarée plutôt que subie. Sur un chantier, avec des gants, on ne pilote pas un vol libre — on
tourne autour d'un objet et on avance d'étape, et le mode orbite le fait au toucher. Le
déplacement libre sert la **préparation**, pas la pose.

Cette exception NE DOIT PAS s'étendre : toute autre interaction reste tenue de fonctionner au
toucher comme au clavier, et le mode orbite DOIT rester intégralement accessible sans clavier.

#### Scenario: Délai d'ouverture
- **WHEN** la visualisation est ouverte, sur poste fixe comme sur tablette ou téléphone
- **THEN** elle devient utilisable en moins de 5 secondes

#### Scenario: Fluidité
- **WHEN** l'utilisateur fait tourner la vue et change d'étape
- **THEN** aucune attente n'est perceptible

#### Scenario: Tablette sans clavier
- **WHEN** la visualisation est ouverte sur une tablette sans clavier
- **THEN** le mode orbite et la navigation dans la séquence restent intégralement utilisables

### Requirement: Fonctionnement au chantier

*Origine : `001-visualisation-3d` FR-030. Critères mesurables : SC-014, SC-015.*

Dans l'usage chantier, la visualisation DOIT rester entièrement fonctionnelle
sans connexion réseau une fois ouverte, DOIT rester lisible en extérieur en pleine lumière,
et ses commandes de navigation DOIVENT être actionnables avec des gants de travail.

#### Scenario: Réseau coupé
- **WHEN** le réseau est complètement coupé après ouverture de la visualisation sur le chantier
- **THEN** elle reste pleinement fonctionnelle

#### Scenario: Manœuvre avec gants
- **WHEN** l'installateur change d'étape avec des gants de travail
- **THEN** il y parvient du premier coup, dans 100 % des tentatives

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

### Requirement: Tracé en segments orthogonaux

*Origine : `001-visualisation-3d` FR-034.*

Le tracé d'un cheminement DOIT être décrit comme une suite de segments
orthogonaux, horizontaux ou verticaux, chacun rattaché à une paroi ou au plafond.

#### Scenario: Description d'un tracé
- **WHEN** un cheminement est décrit
- **THEN** son tracé est une suite de segments orthogonaux, horizontaux ou verticaux, chacun rattaché à une paroi ou au plafond

### Requirement: Suivi de circuit sur le tracé réel

*Origine : `001-visualisation-3d` FR-035. Critère mesurable : SC-018.*

Le suivi d'un circuit du tableau jusqu'à son dernier point, exigé par FR-008,
DOIT s'effectuer sur le tracé réel des conduits et non sur une liaison schématique.

#### Scenario: Suivi sans rupture
- **WHEN** un circuit désigné est suivi du tableau jusqu'à son dernier point
- **THEN** le suivi est visuel et sans rupture, et emprunte le tracé réel des conduits

### Requirement: Circuits portés par un cheminement

*Origine : `001-visualisation-3d` FR-036.*

Un cheminement DOIT déclarer le ou les circuits qu'il porte. Un conduit portant
plusieurs circuits DOIT être identifiable comme tel, le groupement conditionnant le courant
admissible retenu par la note de calcul.

#### Scenario: Conduit partagé
- **WHEN** un conduit porte plusieurs circuits
- **THEN** il est identifiable comme tel dans la maquette

### Requirement: Représentation des traversées de paroi

*Origine : `001-visualisation-3d` FR-037.*

La maquette DOIT représenter les traversées de paroi : leur position, la paroi
traversée et leur sens, de sorte qu'un point extérieur alimenté au droit d'un point intérieur
se lise comme tel.

#### Scenario: Point extérieur au droit d'un point intérieur
- **WHEN** un socle extérieur est alimenté au droit d'un socle intérieur
- **THEN** la traversée, sa position, sa paroi et son sens se lisent dans la maquette

### Requirement: Signalement des intersections avec un obstacle

*Origine : `001-visualisation-3d` FR-038. Critères mesurables : SC-006, SC-020.*

La maquette DOIT rendre visible et signaler toute intersection d'un cheminement
avec un obstacle modélisé — débattement d'ouvrant, tablier et rail de la porte sectionnelle,
gabarit de manœuvre du véhicule.

#### Scenario: Collision composant / ouvrant
- **WHEN** un composant et un ouvrant en position ouverte se recoupent
- **THEN** la collision se constate dans la maquette, sans se rendre sur place et sans mesure manuelle, dans 100 % des cas

#### Scenario: Collision cheminement / obstacle
- **WHEN** un cheminement recoupe un obstacle modélisé
- **THEN** l'intersection se constate dans la maquette, sans mesure manuelle et sans se rendre sur place, dans 100 % des cas

### Requirement: Gabarit du véhicule déclarable comme obstacle

*Origine : `001-visualisation-3d` FR-039.*

Le gabarit de manœuvre du véhicule et sa zone de débattement de portières
DOIVENT pouvoir être déclarés comme obstacles, afin que FR-038 s'y applique.

#### Scenario: Déclaration du gabarit
- **WHEN** le gabarit de manœuvre du véhicule est déclaré
- **THEN** il est traité comme un obstacle, et le signalement des intersections s'y applique

### Requirement: Obstacle sélectionnable et sa fiche

*Origine : `001-visualisation-3d` FR-046.*

Un **obstacle DOIT être sélectionnable** dans la vue, au même titre qu'un
composant, un cheminement ou une traversée. Sa fiche DOIT porter l'état de sa cote — relevée,
bornée ou non relevée —, ce qui lui manque, ce qui est effectivement dessiné pour lui, son
étendue ou son majorant, et le bilan des contrôles de collision **le concernant**.

Rationale : les réserves de cote portent sur des objets. Faute d'être consultables sur
l'objet, elles s'étaient accumulées dans un bandeau permanent posé au-dessus de la maquette,
qui masquait ce que l'installateur venait regarder — un avertissement qu'on ne peut pas
écarter finit par être ignoré, ce qui le rend pire qu'absent. Ce n'est donc pas la longueur du
texte qui était en cause mais l'absence d'un endroit où le mettre.

#### Scenario: Sélection d'un obstacle
- **WHEN** l'utilisateur désigne un obstacle dans la vue
- **THEN** sa fiche porte l'état de sa cote, ce qui lui manque, ce qui est dessiné pour lui, son étendue ou son majorant, et le bilan des collisions le concernant

### Requirement: Obstacle masqué non sélectionnable

*Origine : `001-visualisation-3d` FR-047.*

Un obstacle NE DOIT PAS être sélectionnable lorsqu'il est masqué par la bascule
des ouvrants. Désigner le tablier porte fermée alors qu'il n'est pas à l'écran désignerait un
objet que l'installateur ne voit pas.

#### Scenario: Tablier masqué
- **WHEN** le tablier est masqué par la bascule des ouvrants
- **THEN** il n'est pas sélectionnable

### Requirement: Bilan des cotes manquantes sans masquer la vue

*Origine : `001-visualisation-3d` FR-048.*

Le bilan des cotes manquantes DOIT être accessible sans masquer la vue 3D : un
indicateur compact hors de la vue, et le détail à la demande. Il DOIT distinguer les
encombrements **non relevés**, sur lesquels aucune conclusion n'est possible, des
encombrements **bornés**, sur lesquels seul le verdict favorable est démontrable. Une
collision **établie** DOIT y figurer en premier et ne jamais pouvoir être masquée, même en
l'absence de toute autre réserve.

#### Scenario: Encombrement borné et non relevé
- **WHEN** le bilan des cotes manquantes est consulté
- **THEN** il distingue les encombrements non relevés des encombrements bornés, sans masquer la vue 3D

#### Scenario: Collision établie
- **WHEN** une collision est établie
- **THEN** elle figure en premier au bilan et ne peut pas être masquée, même en l'absence de toute autre réserve

### Requirement: Désignation lisible de tout obstacle

*Origine : `001-visualisation-3d` FR-049.*

Tout obstacle DOIT porter une désignation lisible, déclarée dans les données. Un
identifiant machine NE DOIT PAS être présenté à l'installateur à la place d'un libellé.

#### Scenario: Libellé d'un obstacle
- **WHEN** un obstacle est présenté à l'installateur
- **THEN** il porte une désignation lisible, et non un identifiant machine

### Requirement: Cheminements, boîtes et traversées posés par une étape

*Origine : `001-visualisation-3d` FR-040.*

Un cheminement, une boîte et une traversée DOIVENT apparaître dans la séquence de
montage comme tout composant : posés par une étape identifiée, et soumis aux trois registres
visuels de FR-012.

#### Scenario: Pose d'un cheminement dans la séquence
- **WHEN** la séquence de montage est parcourue
- **THEN** chaque cheminement, boîte et traversée y est posé par une étape identifiée, et soumis aux registres visuels de l'état à l'issue de l'étape

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

### Requirement: L'étape de perçage montre ce qu'elle fait percer

*Les trois étapes de la phase `percage` déclarent aujourd'hui `composants: []` et
`cheminements: []` : pour la seule opération irréversible du chantier, la vue est vide.*

Une étape de perçage DOIT déclarer les objets dont elle fait percer les fixations, et la
maquette DOIT les montrer. Un point de perçage NE DOIT PAS être un accessoire implicite de
l'objet qu'il reçoit : il se voit, ou il se rate.

La vue DOIT distinguer les **trois natures** de perçage, qui n'appellent ni le même outil ni
la même exigence de cote :

- une **traversée**, percée de part en part à la scie cloche, seule à exiger une cote juste ;
- une **fixation d'objet**, dont l'objet lui-même sert de gabarit ;
- une **fixation de collier**, répartie et non cotée.

#### Scenario: Atteinte de l'étape de perçage
- **WHEN** l'installateur atteint une étape de la phase de perçage
- **THEN** la vue montre les perçages que cette étape exige, et non une vue vide accompagnée d'un texte

#### Scenario: Distinction des natures
- **WHEN** les perçages d'une étape sont affichés
- **THEN** traversées, fixations d'objet et fixations de collier se distinguent, chacune portant l'outil qu'elle demande

### Requirement: La pente d'une traversée se voit

*C'est le piège que la prose nomme déjà : « deux boîtiers dos à dos étant à la même hauteur
d'axe, un percement horizontal est le geste le plus naturel et c'est précisément la faute à
éviter ».*

La maquette DOIT représenter une traversée à sa **géométrie réelle** — entrée haute, sortie
basse, sur l'épaisseur de la paroi — et non comme un point sur une face.

Le **dénivelé DOIT être lisible**. Un avertissement écrit ne suffit pas : la faute que
l'exigence écarte est un geste naturel, et un geste naturel ne se corrige pas par un
paragraphe qu'on lit une fois avant de percer.

Une traversée dont le dénivelé n'est pas arrêté DOIT être affichée comme telle, et NE DOIT PAS
être dessinée horizontale par défaut — ce serait figurer exactement la faute.

#### Scenario: Lecture d'une traversée
- **WHEN** une traversée est affichée
- **THEN** son entrée, sa sortie et son dénivelé se lisent dans la vue, sur l'épaisseur de la paroi

#### Scenario: Dénivelé inconnu
- **WHEN** le dénivelé d'une traversée n'est pas arrêté
- **THEN** la traversée est signalée comme non cotée, et n'est pas figurée horizontale

### Requirement: Les gardes serrées d'un perçage sont consultables

*Deux cotes du projet tiennent à moins de 0,13 m, et elles sont énoncées dans un paragraphe.*

Un point de perçage DOIT porter, consultables depuis la vue, les **gardes** qui le
contraignent — distance aux bords de baie, aux obstacles relevés et aux autres perçages.

Lorsqu'une garde est **serrée**, la vue DOIT la signaler plutôt que la laisser déduire. La
bande de 0,25 m au-dessus de la porte de service et celle de la façade sud, avec 0,12 m en
haut et 0,13 m en bas, sont les deux cas du projet.

#### Scenario: Consultation d'un perçage contraint
- **WHEN** l'installateur désigne un point de perçage
- **THEN** sa fiche porte les gardes qui le contraignent et signale celles qui sont serrées

### Requirement: Le guide de perçage n'enregistre rien

*Décision du maître d'ouvrage. L'exigence de reprise à la dernière étape atteinte reste
entière et n'est pas amendée.*

Le guide de perçage NE DOIT porter **aucun marquage d'exécution** : ni case à cocher, ni
décompte de trous percés, ni état d'avancement. Il est une **référence**, pas un registre.

Rationale : la consignation écrite qu'exige le Principe V couvre six vérifications
électriques, et le perçage n'en fait pas partie — le dossier ne réclame donc aucun registre
des trous. Y ajouter des coches créerait un second registre qui ne répond à rien, et qui
mentirait dès qu'un tracé serait révisé.

#### Scenario: Réouverture après un perçage
- **WHEN** la visualisation est rouverte après une passe de perçage
- **THEN** aucun perçage n'est marqué comme exécuté, le lecteur ne mémorisant qu'une position

### Requirement: Mode de déplacement libre

*Décision du maître d'ouvrage du 2026-09-23. La caméra était un orbite pur, de cible figée au
centre du local.*

La maquette DOIT offrir **deux modes de caméra**, et l'utilisateur DOIT pouvoir passer de l'un
à l'autre à tout moment :

- un mode **orbite**, qui tourne autour de la maquette autour d'une cible ;
- un mode **déplacement libre**, où la position de la caméra et la direction du regard sont
  indépendantes l'une de l'autre.

Le mode orbite DOIT rester le mode **par défaut**, et celui du chantier.

En déplacement libre, l'utilisateur DOIT pouvoir **avancer, reculer, se déplacer latéralement,
monter et descendre**, et orienter son regard indépendamment de son déplacement.

Le déplacement DOIT être **libre de toute collision** : la caméra traverse les parois. Se
déplacer autour de la maquette suppose d'en sortir et d'y rentrer, et une caméra qui buterait
sur une paroi interdirait l'usage même de ce mode.

L'inclinaison du regard DOIT être **bornée** de part et d'autre de l'horizontale, comme l'est
déjà celle du mode orbite : on ne doit pas pouvoir basculer par le haut et se retrouver la tête
en bas.

#### Scenario: Se tenir dans un angle et regarder l'opposé
- **WHEN** l'utilisateur se place dans un angle du local en mode déplacement libre
- **THEN** il peut orienter son regard vers l'angle opposé, ce que le mode orbite ne permet pas puisque sa cible reste au centre

#### Scenario: Sortir du local et y revenir
- **WHEN** l'utilisateur traverse une paroi en déplacement libre
- **THEN** il passe, aucune collision ne l'arrêtant

#### Scenario: Inclinaison extrême
- **WHEN** l'utilisateur incline son regard jusqu'à la borne
- **THEN** l'inclinaison s'arrête, et la vue ne bascule pas

#### Scenario: Retour au mode orbite
- **WHEN** l'utilisateur revient au mode orbite
- **THEN** la maquette se comporte comme avant, le mode orbite n'étant pas modifié par l'ajout

### Requirement: Commandes du déplacement libre

*Les touches se lisent sur leur position physique, et non sur le caractère qu'elles portent.*

Les commandes de déplacement DOIVENT être lues sur la **position physique** de la touche, et non
sur le caractère produit. Sur un clavier français, les positions `W A S D` portent les lettres
`Z Q S D` : lire le caractère rendrait le mode injouable, lire la position le rend correct sur
les deux dispositions **sans réglage ni détection**.

| Position physique | Effet |
|---|---|
| `KeyW` / `KeyS` | avancer / reculer |
| `KeyA` / `KeyD` | pas à gauche / pas à droite |
| `Space` | monter |
| `ShiftLeft` | descendre |

Les commandes de déplacement NE DOIVENT PAS réutiliser les touches déjà affectées à la
navigation dans la séquence — flèches, `PageUp`, `PageDown`, `Home`, `End`. Une touche qui ferait
deux choses selon le mode est une touche dont l'effet ne se prédit pas.

Les **vitesses** de déplacement et de rotation DOIVENT être des données, et non des constantes
du code.

#### Scenario: Clavier français
- **WHEN** l'utilisateur d'un clavier AZERTY presse la touche marquée Z
- **THEN** la caméra avance, la position physique étant celle de `KeyW`

#### Scenario: Aucune collision de touches
- **WHEN** une touche du déplacement libre est pressée
- **THEN** elle ne déclenche aucun changement d'étape, les deux jeux de touches étant disjoints

### Requirement: La sélection recentre l'orbite sur l'objet

*Décision du maître d'ouvrage du 2026-09-23. La cible de l'orbite était figée au centre du
local : pour regarder une enveloppe de près, il fallait zoomer, tourner et deviner de quel côté
elle s'ouvre.*

En mode orbite, désigner un objet DOIT recentrer l'orbite **sur cet objet** : il devient la
cible, et la vue s'en approche.

Cela DOIT valoir pour **tout ce qui est sélectionnable** — composant, cheminement, traversée,
obstacle — et non pour les seuls composants.

Le focus DOIT survivre à tout geste de cadrage. Deux évènements, et deux seulement, le
libèrent :

1. **un clic franc hors de tout objet** — pointeur enfoncé puis relâché sans glissé, sur le
   vide ;
2. **la fermeture de la fiche**.

*Contrôle visuel du maître d'ouvrage du 2026-09-23 : le focus se perdait au premier geste
d'orbite. Un `pointerup` qui termine une rotation ressemble à un clic, et un clic qui ne
touche rien ressemble à une rotation, si l'on ne retient que « aucun objet sous le pointeur ».
Les confondre rend le focus inutilisable pour ce à quoi il sert — faire le tour de l'objet.*

Un `pointerup` qui termine un **glissé** NE DOIT rien désigner ni rien libérer : ni sélection,
ni fermeture de fiche, ni remise à zéro de la mise en évidence de circuit. La vue a tourné ;
c'est tout ce qui s'est passé.

**Fermer la fiche DOIT ramener l'orbite au centre du local.** L'utilisateur qui referme n'a plus
d'objet en tête ; le laisser tourner autour de celui qu'il vient de quitter le perdrait.

Le zoom manuel DOIT rester possible pendant le focus : cadrer n'est pas enfermer.

En mode **déplacement libre**, la sélection NE DOIT PAS déplacer la caméra. La fiche s'ouvre et
la vue reste où elle est. *Les deux modes sont distincts, et téléporter quelqu'un pendant qu'il
vole le désorienterait.*

#### Scenario: Désignation d'un objet en mode orbite
- **WHEN** l'utilisateur désigne un objet dans la vue en mode orbite
- **THEN** l'orbite se recentre sur cet objet et la vue s'en approche

#### Scenario: Rotation autour de l'objet focalisé
- **WHEN** l'utilisateur fait tourner l'orbite par un glissé pendant qu'un objet est focalisé
- **THEN** l'objet reste la cible de l'orbite et la fiche reste ouverte

#### Scenario: Glissé se terminant sur le vide
- **WHEN** un glissé d'orbite se relâche à un endroit où ne se trouve aucun objet
- **THEN** rien n'est désigné, rien n'est refermé, et la mise en évidence du circuit est conservée

#### Scenario: Clic franc hors de tout objet
- **WHEN** l'utilisateur enfonce et relâche le pointeur sans glissé, à un endroit où ne se trouve aucun objet
- **THEN** la fiche se referme et l'orbite revient au centre du local

#### Scenario: Fermeture de la fiche
- **WHEN** l'utilisateur ferme la fiche
- **THEN** l'orbite revient au centre du local

#### Scenario: Désignation en mode déplacement libre
- **WHEN** l'utilisateur désigne un objet en mode déplacement libre
- **THEN** la fiche s'ouvre et la caméra ne bouge pas

### Requirement: Le point de vue de focus se dérive, il ne se choisit pas

*Un objet déclare déjà ce qu'il faut pour savoir d'où on le regarde.*

Le point de vue retenu au focus DOIT être **dérivé des données de l'objet**, et non écrit dans
le code ni choisi au jugé.

Pour un objet porté par une paroi, la caméra DOIT se placer sur la **normale sortante de sa
face** : un objet de face intérieure se regarde depuis l'intérieur du local, un objet de face
extérieure depuis l'extérieur, un objet de plafond depuis le dessous. *Regarder une façade
extérieure depuis l'intérieur n'en montrerait que la paroi.*

La **distance** DOIT être dérivée de l'encombrement de l'objet — le gabarit pour un composant,
l'étendue du volume pour un obstacle, la longueur du parcours pour un cheminement — et bornée
par les bornes d'orbite déjà déclarées.

La marge de cadrage et la durée de transition DOIVENT être des **données**, non des constantes
du code.

#### Scenario: Objet de face extérieure
- **WHEN** un objet posé en face extérieure est focalisé
- **THEN** la caméra se place dehors, du côté où l'objet est visible

#### Scenario: Objet de plafond
- **WHEN** un objet de plafond est focalisé
- **THEN** la caméra se place au-dessous de lui

#### Scenario: Objets d'encombrements différents
- **WHEN** un socle et le tableau divisionnaire sont focalisés successivement
- **THEN** la distance retenue diffère, celle du tableau étant la plus grande

### Requirement: Un objet sans étendue ne se cadre pas

*Deux des sept obstacles du projet ne portent aucun volume : le gabarit de manœuvre du véhicule
et le débattement des portières. Le vantail de la porte de service et le tablier fermé n'en
portaient pas davantage jusqu'aux relevés du 2026-09-23 ; ils sont désormais bornés par un
majorant.*

Lorsqu'un objet sélectionné **ne porte aucune étendue déclarée**, la caméra NE DOIT PAS bouger.
Sa fiche s'ouvre, et c'est tout.

Un cadrage inventé lui donnerait une étendue qu'il n'a pas, et ferait passer une absence de cote
pour une cote — ce que le Principe VI proscrit au même titre qu'une valeur plausible substituée
à une valeur inconnue.

Lorsqu'un obstacle ne porte qu'un **majorant**, le cadrage PEUT s'y appuyer, le majorant étant
une conséquence de cotes relevées. La fiche continue de le déclarer comme majorant : le cadrage
ne change pas la nature de ce qui est affiché.

#### Scenario: Obstacle sans volume
- **WHEN** un obstacle sans volume ni majorant est désigné
- **THEN** sa fiche s'ouvre et la caméra ne bouge pas

#### Scenario: Obstacle borné par un majorant
- **WHEN** un obstacle ne portant qu'un majorant est désigné
- **THEN** le cadrage s'appuie sur ce majorant, et la fiche continue de le déclarer comme tel

### Requirement: Les transitions de caméra sont animées et n'attendent rien

*La boucle de rendu porte déjà le temps écoulé à chaque image.*

Le passage d'un cadrage à un autre — focus, retour au centre, vue prédéfinie — DOIT être
**animé**, cible et pose ensemble, et non appliqué d'un coup.

L'animation NE DOIT bloquer aucune interaction. Changer d'étape, tourner la vue, désigner un
autre objet ou basculer de mode DOIT rester possible pendant qu'elle court, et **la reprendre ou
l'interrompre** plutôt que l'attendre.

*Le critère de fluidité exige qu'on tourne la vue et change d'étape sans attente perceptible :
une transition qui verrouillerait l'interface le violerait.*

#### Scenario: Désignation pendant une transition
- **WHEN** l'utilisateur désigne un autre objet alors qu'une transition court
- **THEN** la transition en cours cède la place à la nouvelle, sans attente

#### Scenario: Interaction pendant une transition
- **WHEN** l'utilisateur change d'étape ou tourne la vue pendant une transition
- **THEN** l'interaction est prise en compte immédiatement

### Requirement: Connecteurs d'une enveloppe de jonction

*Décision du maître d'ouvrage du 2026-09-24 : connexions en bornes à levier de la gamme retenue,
conducteur traversant d'un seul tenant.*

La fiche d'une **enveloppe de jonction** — boîte de dérivation, organe de connexion — DOIT porter
les **connecteurs** à y poser : pour chaque circuit et chaque conducteur qui s'y sépare, le nombre
d'entrées requis et la référence retenue, et le total par référence.

Le décompte DOIT être **dérivé du trajet des conducteurs**, et non déclaré. Un connecteur est requis
là où **trois brins ou plus** d'un même conducteur se rejoignent dans l'enveloppe — brins entrant ou
sortant par un conduit, une traversée ou une contiguïté, et brins raccordés à un appareil logé dans
l'enveloppe. Un conducteur qui ne fait que **traverser** l'enveloppe, deux brins, est d'un seul
tenant et NE DOIT recevoir aucun connecteur.

Les connexions abritées par une **goulotte** DOIVENT être comptées dans l'organe de connexion
qu'elle abrite.

La référence DOIT être tirée d'un **catalogue de connecteurs déclaré dans les données**, avec sa
source : nombre d'entrées et plage de section de chaque référence. Lorsque la section du conducteur
n'entre dans la plage d'aucune référence, ou que le catalogue manque, le connecteur DOIT être
affiché comme **inconnu**, sans qu'aucune référence approchée lui soit substituée.

#### Scenario: Boîte où un conducteur se sépare
- **WHEN** l'installateur désigne une boîte où le neutre d'un circuit se sépare vers deux conduits
- **THEN** la fiche porte, pour ce circuit et ce conducteur, un connecteur de trois entrées et sa référence

#### Scenario: Conducteur qui traverse
- **WHEN** un conducteur entre dans une boîte par un conduit et en ressort par un autre sans s'y dériver
- **THEN** aucun connecteur ne lui est compté, et la fiche le dit pour le circuit dont tous les conducteurs traversent

#### Scenario: Plus de brins que la plus grande référence
- **WHEN** un conducteur se sépare en plus de brins que la plus grande référence n'a d'entrées
- **THEN** la fiche porte la combinaison de connecteurs qui les réunit, chaque liaison entre deux connecteurs occupant une entrée de chacun

#### Scenario: Section hors catalogue
- **WHEN** un conducteur se sépare dans une boîte et que sa section n'entre dans la plage d'aucune référence du catalogue
- **THEN** son connecteur est affiché comme inconnu, et aucune référence ne lui est substituée

#### Scenario: Connexions sous goulotte
- **WHEN** l'installateur désigne l'organe de connexion d'une goulotte
- **THEN** sa fiche porte les connecteurs de toutes les séparations de conducteurs faites dans la goulotte

### Requirement: Trajet des conducteurs d'un objet désigné

*Demande du maître d'ouvrage du 2026-09-25 : une couleur par circuit, le trajet entier, des
pastilles aux extrémités.*

Lorsque l'utilisateur désigne un **cheminement**, un **appareil** ou une **traversée**, la maquette
DOIT tracer, pour chaque circuit concerné, le **trajet réel** des conducteurs qui passent par
l'objet désigné, **d'une extrémité à l'autre**. Le trajet DOIT suivre le graphe du tracé, conduits,
goulottes, boîtes et traversées compris, jusqu'à chacune des arrivées de ces conducteurs.

Chaque circuit DOIT être tracé dans **sa couleur**. Sur un parcours commun à plusieurs circuits, les
tracés DOIVENT rester distincts et visibles, y compris à l'intérieur d'un conduit ou d'une goulotte.

Les **appareils d'extrémité** DOIVENT porter la couleur de chaque circuit qui y aboutit, par une
pastille par circuit.

Un tronçon où passe un **fil d'ordre** d'un circuit DOIT se distinguer, dans le tracé de ce
circuit, par une **teinte plus foncée de sa couleur** : elle rappelle le circuit à qui le fil
appartient. La teinte dit ce que le tronçon **contient** : elle vaut pour tout fil d'ordre du
circuit, qu'il passe ou non par l'objet désigné. La fiche DOIT dire ce que la teinte foncée signifie. *Demande du maître d'ouvrage du
2026-09-25.*

Un circuit dont le trajet ne se dérive pas NE DOIT PAS être tracé, et la fiche DOIT le dire : aucun
trajet n'est deviné.

#### Scenario: Désignation d'un conduit partagé
- **WHEN** l'utilisateur désigne un conduit qui porte deux circuits
- **THEN** les deux trajets sont tracés côte à côte, chacun dans sa couleur, jusqu'à toutes les extrémités de leurs conducteurs

#### Scenario: Appareils d'extrémité
- **WHEN** un trajet est tracé
- **THEN** chaque appareil où l'un de ses conducteurs part ou arrive porte une pastille de la couleur de son circuit

#### Scenario: Désignation d'un appareil
- **WHEN** l'utilisateur désigne une boîte de dérivation
- **THEN** sont tracés les trajets de tous les conducteurs qui y passent ou s'y arrêtent

#### Scenario: Tronçon portant un fil d'ordre
- **WHEN** un tronçon du trajet d'un circuit porte le fil d'ordre d'une commande de ce circuit
- **THEN** il est tracé dans la couleur du circuit assombrie, et les autres tronçons dans sa couleur

#### Scenario: Objet désigné sans fil d'ordre
- **WHEN** l'objet désigné ne porte aucun fil d'ordre d'un circuit, mais que le trajet de ce circuit passe par des tronçons qui en portent
- **THEN** ces tronçons sont tracés dans la teinte foncée, et l'objet désigné dans la couleur du circuit

#### Scenario: Circuit non dérivable
- **WHEN** le trajet d'un circuit concerné ne se dérive pas
- **THEN** il n'est pas tracé, et la fiche le porte comme inconnu
