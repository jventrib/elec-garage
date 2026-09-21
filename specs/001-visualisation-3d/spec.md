# Feature Specification: Visualisation 3D du Garage et Guide de Montage

**Feature Branch**: `001-visualisation-3d` (répertoire de spécification ; le dépôt n'est pas sous git, aucune branche créée)

**Created**: 2026-09-21

**Status**: Draft — amendée le 2026-09-21 pour la pose en apparent (constitution v1.3.0). `plan.md` et `tasks.md` doivent être régénérés.

**Input**: User description: "Sur la visualisation 3D, on met en place un système de lecture d'étape pour illustrer le montage des composants d'électricité étape par étape. Le but est que l'installateur n'ait qu'à suivre les instructions indiquées et illustrées sur la visualisation 3D. Il peut avancer ou reculer d'une étape à l'autre."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Vérifier l'implantation en volume avant les travaux (Priority: P1)

Le concepteur ouvre la maquette et observe le garage sous tous les angles, portes fermées
puis grandes ouvertes. Il constate de visu si un composant est masqué par un vantail, si une
fiche se trouve dans la trajectoire du tablier, si une hauteur d'axe est inatteignable. Il
corrige l'implantation avant le premier percement.

**Why this priority**: c'est la raison d'être de la maquette et le socle de tout le reste.
Sans le volume juste, le lecteur d'étapes illustrerait un montage faux. Cette histoire livre
à elle seule la valeur principale : détecter les collisions quand la correction est encore
gratuite.

**Independent Test**: se vérifie seule, sans lecteur d'étapes et sans instruction rédigée, en
chargeant la géométrie relevée, un jeu de composants et un jeu de cheminements, puis en
cherchant les collisions connues portes ouvertes.

**Acceptance Scenarios**:

1. **Given** la maquette est ouverte, **When** l'utilisateur fait tourner la vue autour du
   local, **Then** il atteint le plafond, le sol et les quatre angles sans zone inaccessible.
2. **Given** la porte de service est représentée en position grande ouverte, **When** un
   composant se trouve derrière le vantail, **Then** l'occultation est visible sans mesure ni
   calcul de la part de l'utilisateur.
3. **Given** un composant est posé sur la face extérieure d'une paroi, **When** l'utilisateur
   l'observe, **Then** il distingue sans ambiguïté qu'il est à l'extérieur et non à l'intérieur.
4. **Given** la maquette est chargée, **When** l'utilisateur compare une cote à l'écran au
   relevé de la constitution, **Then** les deux concordent.
5. **Given** un cheminement de conduit passe dans la trajectoire du tablier de la porte
   sectionnelle, **When** l'utilisateur affiche les ouvrants en position ouverte, **Then**
   l'intersection est visible et signalée, sans mesure de sa part.
6. **Given** un cheminement est posé sur une paroi, **When** l'utilisateur l'observe, **Then**
   il en lit le tracé segment par segment et voit sur quelle face il repose, et non un trait
   joignant deux composants.

---

### User Story 2 - Suivre le montage étape par étape (Priority: P2)

L'installateur arrive sur le chantier, ouvre la séquence à la première étape et l'exécute. Il
lit l'instruction, voit dans la vue 3D ce qu'il doit poser et où, réalise le geste, puis passe
à l'étape suivante. S'il a un doute sur ce qui a été fait avant, il recule d'une ou plusieurs
étapes, puis ré-avance jusqu'où il en était.

**Why this priority**: c'est la demande d'origine et ce qui transforme un dossier de
conception en une notice de pose. Elle dépend de la maquette (P1) pour illustrer quoi que ce
soit, d'où sa position après elle.

**Independent Test**: se vérifie seule, sur une séquence réduite de quelques étapes
fictives mais cohérentes, en parcourant la séquence en avant puis en arrière sans jamais
consulter d'autre document.

**Acceptance Scenarios**:

1. **Given** l'installateur est à une étape donnée, **When** il lit l'écran, **Then** il
   dispose de l'instruction écrite, de l'illustration correspondante dans la vue 3D, et de la
   liste de ce qu'il doit poser, sans avoir à ouvrir un autre document.
2. **Given** l'installateur est à l'étape N, **When** il demande l'étape suivante, **Then**
   la vue montre l'état de l'installation à l'issue de l'étape N+1, en distinguant
   visuellement ce que cette étape ajoute de ce qui était déjà en place.
3. **Given** l'installateur est à l'étape N, **When** il recule jusqu'à l'étape N-3 puis
   ré-avance jusqu'à N, **Then** l'état affiché à l'étape N est identique au précédent, sans
   reprise depuis le début.
4. **Given** l'installateur est à la première étape, **When** il tente de reculer, **Then**
   le système le lui signale sans erreur ni sortie de la séquence.
5. **Given** la séquence comporte une étape de consignation, **When** l'installateur la
   parcourt, **Then** aucune étape ultérieure de pose n'illustre un travail sous tension
   avant l'étape de levée de consignation.
6. **Given** la séquence est ouverte, **When** l'installateur regarde l'écran, **Then** il
   connaît son numéro d'étape courant et le nombre total d'étapes.

---

### User Story 3 - Identifier un composant et son circuit (Priority: P3)

L'utilisateur désigne un composant dans la vue et obtient ses caractéristiques : sa référence,
sa hauteur d'axe, son indice de protection et le circuit qui l'alimente. Il peut aussi suivre
un circuit du tableau jusqu'à son dernier point.

**Why this priority**: apporte la traçabilité exigée par le dossier final et le repérage, mais
la maquette et la séquence restent exploitables sans elle.

**Independent Test**: se vérifie seule, en désignant chaque composant et chaque boîte d'un jeu
de données et en comparant les caractéristiques affichées à celles du jeu de données, puis en
suivant un circuit sur son tracé.

**Acceptance Scenarios**:

1. **Given** un composant est désigné, **When** ses caractéristiques s'affichent, **Then**
   elles comportent sa référence, son type, sa paroi de rattachement, sa hauteur d'axe, son
   indice de protection et son circuit.
2. **Given** une caractéristique n'est pas encore déterminée, **When** elle s'affiche,
   **Then** elle est présentée explicitement comme inconnue, et aucune valeur n'est proposée
   à sa place.
3. **Given** un circuit est désigné, **When** l'utilisateur l'observe, **Then** il le
   distingue des autres circuits et le suit du tableau jusqu'à son dernier point.
4. **Given** un circuit est désigné, **When** l'utilisateur le suit, **Then** il en parcourt le
   tracé réel des conduits, en passant par chaque boîte de dérivation traversée, sans rupture.
5. **Given** une boîte de dérivation est désignée, **When** sa fiche s'affiche, **Then** elle
   porte les mêmes caractéristiques qu'un socle, les valeurs non déterminées étant marquées
   comme inconnues.

---

### Edge Cases

- Que se passe-t-il si une étape n'a pas d'illustration, ou si son illustration ne correspond
  pas à son instruction ? La séquence NE DOIT PAS être présentée comme utilisable au chantier,
  et le défaut DOIT être signalé au concepteur.
- Que se passe-t-il si un composant n'est rattaché à aucune étape ? Il ne serait jamais posé
  en suivant la séquence : le cas DOIT être détecté et signalé.
- Que se passe-t-il si une étape pose un composant absent de la maquette ? L'illustration
  serait vide : le cas DOIT être détecté et signalé.
- Que se passe-t-il si la séquence est encore incomplète, une fonctionnalité électrique
  n'ayant pas encore livré ses étapes ? L'état partiel DOIT être visible, et la séquence NE
  DOIT PAS se présenter comme close.
- Que se passe-t-il si une cote du relevé est corrigée après coup ? La maquette DOIT refléter
  la correction sans réécriture des étapes qui ne portent pas sur cette cote.
- Que se passe-t-il si une caractéristique dépend d'une note de calcul non encore établie ?
  Elle reste inconnue et s'affiche comme telle, sans bloquer la consultation du reste.
- Que se passe-t-il si l'installateur interrompt le chantier et revient le lendemain ? Le
  lecteur rouvre à la dernière étape atteinte. Il ne prétend pas savoir ce qui a été
  réellement exécuté, cette distinction relevant du procès-verbal d'essais et non du lecteur.
- Que se passe-t-il si la position mémorisée désigne une étape qui n'existe plus, la séquence
  ayant été modifiée entre-temps ? Le lecteur DOIT rouvrir sur une étape valide sans erreur,
  et signaler que la position antérieure a été perdue.
- Que se passe-t-il si deux fonctionnalités électriques apportent des étapes qui se
  chevauchent dans le temps du chantier ? Leurs déclarations de phase et de dépendance les
  ordonnent dans la séquence unique ; un chevauchement non arbitrable est un défaut de
  cohérence au sens de FR-026.
- Que se passe-t-il si deux fonctionnalités apportent chacune une étape de consignation ?
  Une seule figure dans la séquence, conformément à FR-025.
- Que se passe-t-il si l'écran est consulté en plein soleil, ou manipulé avec des gants ?
  FR-030 l'exige explicitement dans l'usage chantier.
- Que se passe-t-il si le réseau est absent sur le chantier ? La visualisation reste
  entièrement fonctionnelle une fois ouverte, aucune donnée n'étant servie à distance.
- Que se passe-t-il si un cheminement traverse un obstacle modélisé ? L'intersection DOIT être
  visible et signalée. C'est le cas que la pose apparente rend possible et que la maquette
  existe pour attraper.
- Que se passe-t-il si un circuit est déclaré sur un point que son tracé ne rejoint pas ?
  Le circuit est interrompu : défaut de cohérence bloquant au sens de FR-042.
- Que se passe-t-il si trois segments se rejoignent sans boîte de dérivation ? C'est une
  connexion hors boîte, interdite par la constitution : défaut bloquant.
- Que se passe-t-il si le gabarit de manœuvre du véhicule n'est pas relevé ? Il se déclare
  comme obstacle incertain, à l'image du rail de la porte sectionnelle, et FR-038 ne conclut
  alors que partiellement.
- Que se passe-t-il si un segment est déclaré en diagonale ? Défaut de cohérence : la
  constitution impose des parcours orthogonaux, arrêtés sur plan avant tout percement.

## Requirements *(mandatory)*

### Functional Requirements

**Géométrie du local**

- **FR-001**: La maquette DOIT représenter le garage à l'échelle dans les trois dimensions,
  conformément au relevé consigné dans la constitution : œuvre intérieure 5,60 m × 5,60 m,
  hauteur sous plafond 2,75 m, parois de 0,20 m, emprise extérieure 6,00 m × 6,00 m.
- **FR-002**: La maquette DOIT représenter les deux baies à leurs positions relevées : porte
  sectionnelle de 5,00 m de largeur sur la paroi sud, laissant 0,40 m de trumeau à l'est et
  0,20 m à l'ouest ; porte de service de 1,10 m × 2,50 m sur la paroi est, bord sud à 1,30 m
  de l'angle sud-est.
- **FR-003**: La maquette DOIT modéliser les obstacles qui contraignent l'implantation : le
  débattement du vantail de la porte de service, ainsi que le tablier et le rail de la porte
  sectionnelle, en position ouverte comme en position fermée.
- **FR-004**: L'utilisateur DOIT pouvoir observer le local sous n'importe quel angle, y
  compris depuis l'intérieur, et atteindre le plafond, le sol et les angles sans zone aveugle.
- **FR-005**: La maquette DOIT distinguer la face intérieure de la face extérieure des
  parois, afin qu'un composant posé en façade extérieure soit identifiable comme tel.

**Composants et circuits**

- **FR-006**: Chaque composant implanté DOIT être positionné à sa cote réelle et DOIT porter,
  consultables depuis la vue : sa référence, son type, sa paroi de rattachement, sa hauteur
  d'axe, son indice de protection et son circuit de rattachement.
- **FR-007**: Toute caractéristique non encore déterminée DOIT être affichée explicitement
  comme inconnue. Le système NE DOIT JAMAIS substituer une valeur plausible à une valeur
  inconnue, ni masquer l'absence de valeur.
- **FR-008**: Les circuits DOIVENT être visuellement distinguables les uns des autres, et un
  circuit DOIT pouvoir être suivi du tableau divisionnaire jusqu'à son dernier point.
- **FR-009**: La maquette DOIT indiquer de quelle version du schéma et de la note de calcul
  elle dérive, afin qu'une divergence puisse être constatée et tranchée en faveur de ces
  documents.

**Lecteur d'étapes**

- **FR-010**: Le montage DOIT être présenté comme une séquence ordonnée d'étapes, suivant
  l'ordre de pose réel du chantier et non l'ordre de la nomenclature ni celui de la
  numérotation des composants.
- **FR-011**: Chaque étape DOIT porter son instruction écrite et son illustration dans la vue
  3D, ainsi que la liste des composants qu'elle met en place et du matériel nécessaire.
  L'installateur NE DOIT PAS avoir à ouvrir un autre document pour savoir quoi poser, où et
  avec quoi.
- **FR-012**: Chaque étape DOIT montrer l'état de l'installation à son issue, et DOIT
  distinguer visuellement ce qu'elle ajoute de ce qui était déjà en place.
- **FR-013**: La consignation et sa levée DOIVENT être des étapes explicites de la séquence.
  Aucune étape NE DOIT illustrer, même implicitement, un travail effectué sous tension qui ne
  le serait pas en réalité.
- **FR-014**: Les vérifications exigées par le Principe V de la constitution (continuité des
  conducteurs de protection, résistance de terre, isolement, déclenchement des différentiels,
  serrage, concordance du repérage) DOIVENT figurer dans la séquence comme des étapes à part
  entière, et non comme une annexe.

**Navigation**

- **FR-015**: L'utilisateur DOIT pouvoir avancer à l'étape suivante et revenir à l'étape
  précédente, à tout moment et autant de fois que voulu.
- **FR-016**: La navigation DOIT être sans perte d'état : reculer puis ré-avancer DOIT
  restituer exactement l'état précédemment affiché, sans reprise de la séquence depuis le
  début.
- **FR-017**: Aux deux extrémités de la séquence, le système DOIT signaler qu'il n'y a pas
  d'étape au-delà, sans erreur ni sortie de la séquence.
- **FR-018**: L'utilisateur DOIT connaître à tout instant sa position dans la séquence :
  numéro de l'étape courante et nombre total d'étapes.
- **FR-019**: L'utilisateur DOIT pouvoir atteindre directement une étape désignée sans
  parcourir une à une toutes celles qui la précèdent.

**Données et extensibilité**

- **FR-020**: La géométrie du local, la liste des composants et la séquence d'étapes DOIVENT
  être des données. Ajouter, retirer ou réordonner une étape, ou déplacer un composant, NE
  DOIT PAS exiger de modifier la logique de rendu ou de navigation.
- **FR-021**: Une cote ou une caractéristique NE DOIT figurer qu'à un seul endroit des
  données. Aucune valeur NE DOIT être répétée à deux endroits susceptibles de diverger.
- **FR-022**: Le socle DOIT accepter les apports de plusieurs fonctionnalités électriques
  (prises de courant, éclairage, borne de recharge) sans modification de sa propre logique,
  chacune y apportant ses composants et ses étapes.

**Composition de la séquence**

- **FR-023**: Les apports des différentes fonctionnalités électriques DOIVENT être composés en
  une séquence unique couvrant l'ensemble du garage, ordonnée par la chronologie réelle du
  chantier. L'installateur NE DOIT PAS avoir à choisir entre plusieurs séquences, ni à
  exécuter une fonctionnalité de bout en bout avant d'entamer la suivante.
- **FR-024**: Chaque étape apportée DOIT déclarer la phase de chantier à laquelle elle
  appartient et les étapes dont elle dépend. L'ordre de la séquence unique DOIT découler de
  ces déclarations, et non de l'ordre d'arrivée des fonctionnalités contributrices ni de leur
  numérotation.
- **FR-025**: Les étapes communes à plusieurs fonctionnalités, au premier rang desquelles la
  consignation et sa levée, NE DOIVENT apparaître qu'une seule fois dans la séquence, quel que
  soit le nombre de fonctionnalités contributrices.

**Cohérence de la séquence**

- **FR-026**: Le système DOIT détecter et signaler au concepteur : une étape sans instruction
  écrite, une étape dont l'illustration ne montre aucun des composants qu'elle annonce, un
  composant rattaché à aucune étape, une étape référençant un composant absent de la maquette,
  une dépendance déclarée vers une étape inexistante, et toute boucle de dépendances rendant
  l'ordonnancement impossible.
- **FR-027**: Tant qu'un défaut de cohérence de FR-026 subsiste, la séquence NE DOIT PAS être
  présentée comme utilisable au chantier.

**Conditions de consultation**

- **FR-028**: La visualisation DOIT s'ouvrir dans un navigateur récent sans installation
  préalable, sans serveur applicatif, sans compte utilisateur et sans dépendance à un service
  tiers en ligne.
- **FR-029**: La visualisation DOIT servir deux usages avec la même interface : la préparation
  sur poste fixe hors chantier, et la lecture sur tablette ou téléphone tenu en main sur le
  chantier. La mise en page DOIT s'adapter à la taille de l'écran, et les interactions DOIVENT
  fonctionner aussi bien au toucher qu'à la souris et au clavier.
- **FR-030**: Dans l'usage chantier, la visualisation DOIT rester entièrement fonctionnelle
  sans connexion réseau une fois ouverte, DOIT rester lisible en extérieur en pleine lumière,
  et ses commandes de navigation DOIVENT être actionnables avec des gants de travail.
- **FR-031**: À la réouverture, le lecteur DOIT reprendre à la dernière étape atteinte lors de
  la session précédente. Aucun marquage des étapes exécutées n'est géré : le lecteur mémorise
  une position, pas un état d'avancement des travaux.

**Cheminements apparents et boîtes de dérivation**

Ce groupe découle de la constitution v1.3.0 : les parois étant en béton non isolé, la pose est
apparente. Un cheminement cesse d'être une liaison logique entre deux points pour devenir un
objet posé sur la paroi, visible, encombrant et opposable.

- **FR-032**: La maquette DOIT représenter chaque cheminement de conduit à son tracé réel, sur
  la face de paroi ou de plafond où il est posé, avec son encombrement. Un cheminement NE DOIT
  PAS être figuré par un trait joignant deux composants.
- **FR-033**: Les boîtes de dérivation DOIVENT être des composants de plein droit, portant
  référence, position, hauteur d'axe, indice de protection et circuit de rattachement, au même
  titre qu'un socle. Les règles FR-006 et FR-007 s'y appliquent sans exception.
- **FR-034**: Le tracé d'un cheminement DOIT être décrit comme une suite de segments
  orthogonaux, horizontaux ou verticaux, chacun rattaché à une paroi ou au plafond.
- **FR-035**: Le suivi d'un circuit du tableau jusqu'à son dernier point, exigé par FR-008,
  DOIT s'effectuer sur le tracé réel des conduits et non sur une liaison schématique.
- **FR-036**: Un cheminement DOIT déclarer le ou les circuits qu'il porte. Un conduit portant
  plusieurs circuits DOIT être identifiable comme tel, le groupement conditionnant le courant
  admissible retenu par la note de calcul.
- **FR-037**: La maquette DOIT représenter les traversées de paroi : leur position, la paroi
  traversée et leur sens, de sorte qu'un point extérieur alimenté au droit d'un point intérieur
  se lise comme tel.
- **FR-038**: La maquette DOIT rendre visible et signaler toute intersection d'un cheminement
  avec un obstacle modélisé — débattement d'ouvrant, tablier et rail de la porte sectionnelle,
  gabarit de manœuvre du véhicule.
- **FR-039**: Le gabarit de manœuvre du véhicule et sa zone de débattement de portières
  DOIVENT pouvoir être déclarés comme obstacles, afin que FR-038 s'y applique.
- **FR-040**: Un cheminement, une boîte et une traversée DOIVENT apparaître dans la séquence de
  montage comme tout composant : posés par une étape identifiée, et soumis aux trois registres
  visuels de FR-012.
- **FR-041**: Les cheminements, les boîtes et les traversées DOIVENT être des données apportées
  par les fonctionnalités électriques, au même titre que les composants et les étapes. Aucun
  tracé NE DOIT vivre dans le code, dans le prolongement de FR-020 et FR-022.
- **FR-042**: Le système DOIT détecter et signaler, au titre de FR-026 : un segment non
  orthogonal ; un segment qui ne repose sur aucune face de paroi ni de plafond ; un cheminement
  dont une extrémité ne rejoint ni composant ni boîte ; un circuit dont le tracé est interrompu
  entre le tableau et l'un de ses points ; et une jonction de trois segments ou plus qui ne se
  fait pas dans une boîte de dérivation.
- **FR-043**: Tant qu'un défaut de FR-042 subsiste, la séquence NE DOIT PAS être présentée
  comme utilisable au chantier, conformément à FR-027.

### Key Entities

- **Local** : le garage lui-même. Attributs : dimensions en œuvre, épaisseur des parois,
  hauteur sous plafond, emprise extérieure, convention de repère.
- **Baie** : ouverture pratiquée dans une paroi (porte sectionnelle, porte de service).
  Attributs : paroi de rattachement, position, largeur, hauteur, mode d'ouverture.
- **Obstacle** : volume occupé par un élément mobile ou fixe qui contraint l'implantation.
  Attributs : élément de rattachement, volume occupé en position ouverte et en position
  fermée.
- **Composant électrique implanté** : point d'utilisation ou équipement posé dans le local.
  Attributs : référence, type, paroi de rattachement, position et hauteur d'axe, indice de
  protection, circuit de rattachement, fonctionnalité d'origine. Chaque attribut peut être
  déterminé ou explicitement inconnu.
- **Circuit** : ensemble de composants partageant une protection. Attributs : identifiant,
  composants desservis, signe distinctif visuel. Son dimensionnement n'appartient pas à cette
  fonctionnalité.
- **Étape de montage** : unité de la séquence. Attributs : rang, instruction écrite,
  composants mis en place, matériel et outillage nécessaires, nature (consignation, pose,
  vérification, levée de consignation), état de l'installation à son issue.
- **Séquence de montage** : suite ordonnée d'étapes. Attributs : étapes la composant, règle
  d'ordonnancement, état de complétude, fonctionnalités contributrices.
- **Cheminement** : parcours d'un conduit posé en apparent. Attributs : référence, suite de
  segments orthogonaux rattachés chacun à une paroi ou au plafond, encombrement, circuits
  portés, fonctionnalité d'origine. Un cheminement porte plusieurs circuits ou un seul.
- **Segment de cheminement** : portion rectiligne d'un cheminement. Attributs : paroi ou
  plafond de rattachement, point de départ, point d'arrivée, orientation horizontale ou
  verticale.
- **Boîte de dérivation** : point où les conducteurs se raccordent ou changent de direction.
  C'est un composant, avec les mêmes attributs que tout composant, et non un accessoire
  implicite du tracé. Toute connexion s'y fait ; aucune connexion ne se fait ailleurs.
- **Traversée de paroi** : passage d'un conduit à travers les 0,20 m de béton. Attributs :
  paroi traversée, position, sens intérieur vers extérieur, pente.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Un installateur qui découvre le projet réalise la pose en suivant la seule
  séquence, sans ouvrir aucun autre document, sur 100 % des étapes.
- **SC-002**: Depuis n'importe quelle étape, l'installateur atteint l'étape précédente ou
  suivante en une seule action, et l'état restitué après un aller-retour est identique à
  l'état initial dans 100 % des cas.
- **SC-003**: 100 % des composants affichent leur circuit de rattachement, leur hauteur d'axe
  et leur indice de protection, ou la mention explicite que la valeur est inconnue.
- **SC-004**: Aucune caractéristique indéterminée n'est présentée comme déterminée : zéro
  valeur inventée sur l'ensemble de la maquette.
- **SC-005**: Un tiers non familier du projet retrouve en moins de 30 secondes l'étape à
  laquelle un composant désigné est posé.
- **SC-006**: 100 % des collisions entre un composant et un ouvrant en position ouverte se
  constatent dans la maquette, sans se rendre sur place et sans mesure manuelle.
- **SC-007**: L'ajout d'un point d'utilisation ou d'une étape de montage se fait en modifiant
  les seules données, sans aucune modification de la logique de rendu ni de navigation.
- **SC-008**: La visualisation devient utilisable en moins de 5 secondes après son ouverture,
  aussi bien sur poste fixe que sur tablette ou téléphone.
- **SC-009**: L'utilisateur fait tourner la vue et change d'étape sans attente perceptible.
- **SC-010**: 100 % des vérifications exigées par le Principe V apparaissent comme des étapes
  de la séquence.
- **SC-011**: Aucune étape de pose n'est illustrée entre la levée de consignation et la fin de
  la séquence sans que cela soit conforme à la réalité du chantier.
- **SC-012**: La séquence présentée à l'installateur est unique : il exécute l'intégralité du
  chantier sans jamais avoir à sélectionner un lot ni à changer de document.
- **SC-013**: La consignation et sa levée apparaissent exactement une fois chacune dans la
  séquence, quel que soit le nombre de fonctionnalités contributrices.
- **SC-014**: Sur le chantier, l'installateur change d'étape avec des gants de travail, du
  premier coup, dans 100 % des tentatives.
- **SC-015**: La visualisation ouverte sur le chantier reste pleinement fonctionnelle après
  coupure complète du réseau.
- **SC-016**: À la réouverture, le lecteur affiche la dernière étape atteinte dans 100 % des
  cas où la séquence n'a pas changé entre-temps.
- **SC-017**: 100 % des cheminements affichés reposent sur une face de paroi ou de plafond, à
  leur tracé coté, et aucun n'est figuré par un trait entre deux composants.
- **SC-018**: Un circuit désigné se suit visuellement, sans rupture, du tableau jusqu'à son
  dernier point, en empruntant le tracé réel des conduits.
- **SC-019**: 100 % des boîtes de dérivation affichent leur référence, leur hauteur d'axe et
  leur indice de protection, ou la mention explicite que la valeur est inconnue.
- **SC-020**: 100 % des intersections entre un cheminement et un obstacle modélisé se
  constatent dans la maquette, sans mesure manuelle et sans se rendre sur place.
- **SC-021**: Aucune jonction de trois segments ou plus n'existe hors d'une boîte de
  dérivation.
- **SC-022**: L'ajout d'un cheminement, d'une boîte ou d'une traversée se fait en modifiant les
  seules données, sans aucune modification de la logique de rendu ni de navigation.

## Assumptions

**Reprises de la constitution**

- Le repère de la maquette est celui fixé par la constitution : origine à l'angle sud-ouest de
  l'œuvre intérieure au niveau du sol fini, x croissant vers l'est, y vers le nord, z vers le
  haut, unité le mètre.
- La convention d'orientation est celle de la constitution : vue en plan, nord en haut, est à
  droite ; la paroi dite « de droite » est la paroi est, la façade portant la porte
  sectionnelle est la paroi sud.
- La maquette est une représentation et non la source normative. En cas de divergence avec la
  note de calcul ou le schéma unifilaire, ces derniers l'emportent.
- Le mode de pose est **apparent** et figé par la constitution v1.3.0 : parois en béton non
  isolé, conduits IRL en saillie, boîte de dérivation à chaque intersection, dérivation et
  changement de direction, appareillage en saillie, parcours orthogonaux. Aucun encastrement
  n'est représentable, et la maquette n'a pas à prévoir ce cas.
- Toute connexion se fait dans une boîte, jamais dans un conduit ni derrière un appareil, et
  aucune boîte n'est rendue inaccessible. La maquette doit donc pouvoir montrer qu'une boîte
  reste atteignable.

**Clarifications résolues** (2026-09-21)

- *Composition des séquences* : séquence unique fusionnée, couvrant tout le garage et ordonnée
  par la chronologie réelle du chantier. Traduit en FR-023, FR-024 et FR-025. Le compromis est
  assumé : l'ordonnancement devient un problème à part entière, en échange d'un chantier qui
  ne consigne, ne perce et ne tire qu'une fois.
- *Appareil cible* : les deux usages, préparation sur poste fixe et lecture en main sur le
  chantier, servis par la même interface adaptative. Traduit en FR-029 et FR-030.
- *Mémorisation de la progression* : le lecteur mémorise la dernière étape atteinte, sans
  marquer les étapes exécutées. Traduit en FR-031.

**Amendement du 2026-09-21 — pose en apparent**

La constitution est passée en v1.3.0 : les parois étant en béton non isolé et sans vide
technique, la pose est apparente. Le Principe VI exige désormais que conduits et boîtes soient
représentés à leur tracé réel, avec leur encombrement, et non figurés par un trait entre deux
composants. Traduit en FR-032 à FR-043, SC-017 à SC-022, et quatre entités nouvelles.

Ce n'est pas un ajout cosmétique. La maquette gagne ce qu'elle n'avait pas : une géométrie de
parcours, donc la capacité de révéler qu'un conduit passe dans la trajectoire du tablier ou
dans le gabarit de manœuvre du véhicule. En pose encastrée, cette question ne se posait pas.

**Point de vigilance issu du croisement des réponses**

La séquence unique de FR-023 et la mémorisation sans marquage de FR-031 se tendent l'une
l'autre. Une séquence qui couvre tout le garage sera longue ; un curseur qui ne retient qu'une
position ne dira jamais ce qui a réellement été fait. Tant que l'installateur est seul et
continu sur le chantier, le curseur suffit. Si les travaux devaient s'étaler ou se partager
entre plusieurs intervenants, FR-031 serait le premier point à rouvrir.

**Hypothèses retenues faute de précision**

- Le projet porte sur un seul garage et une seule installation. Aucune gestion de plusieurs
  projets, variantes ou versions concurrentes n'est attendue.
- L'interface est en français.
- Un seul utilisateur consulte la maquette à la fois. Aucune collaboration, aucun compte,
  aucun partage en temps réel.
- Les instructions écrites des étapes sont rédigées par le concepteur et stockées comme
  données. Elles ne sont pas générées automatiquement.
- Le rendu vise la lisibilité et non le photo-réalisme : un composant doit être reconnaissable
  et situable, pas fidèle à son apparence commerciale.
- Le contenu électrique (composants et étapes) est fourni par les fonctionnalités électriques.
  La présente fonctionnalité fournit le socle, le format de données et le lecteur.
- Les composants d'une fonctionnalité dont la note de calcul n'est pas établie sont
  représentables avec leurs caractéristiques électriques marquées inconnues.

**Hors périmètre de cette fonctionnalité**

- Le dimensionnement électrique lui-même : sections, calibres, chutes de tension, sélectivité.
- La spécification des points d'utilisation des prises, de l'éclairage et de la borne, qui
  relèvent de leurs fonctionnalités respectives.
- L'export papier ou PDF de la séquence, ainsi que toute impression.
- La réalité augmentée, la réalité virtuelle et la visite immersive au casque.
- Le suivi de chantier multi-utilisateur, la signature ou la validation formelle des étapes
  par un tiers.
- La commande de matériel et la gestion de stock à partir de la nomenclature.

**Dépendances**

- Le relevé géométrique consigné dans la constitution, dont dépend FR-001 et FR-002.
- `TODO(RAIL_PORTE_SECTIONNELLE)` de la constitution : tant que la hauteur de passage de la
  porte sectionnelle et l'encombrement de son rail ne sont pas relevés, l'obstacle exigé par
  FR-003 ne peut être modélisé qu'approximativement, et tout composant de plafond reste
  non positionnable.
- Le sens d'ouverture et le débattement du vantail de la porte de service, non relevés à ce
  jour, dont dépend la part de FR-003 relative à cette porte.
- Le gabarit de manœuvre du véhicule et le débattement de ses portières, non relevés, dont
  dépend la part de FR-038 et FR-039 qui les concerne. Traités comme obstacles incertains tant
  qu'ils ne le sont pas.
- La référence de conduit et de boîtes retenue pour les parcours extérieurs —
  `TODO(CONDUIT_EXTERIEUR)` de la constitution. Sans incidence sur la représentation, mais les
  caractéristiques affichées resteront inconnues jusque-là.
- Les fonctionnalités électriques contributrices, pour le contenu. `002-prises-de-courant`
  est la première d'entre elles ; ses points et ses étapes dépendent de sa propre note de
  calcul, elle-même bloquée par les points ouverts de la constitution.
