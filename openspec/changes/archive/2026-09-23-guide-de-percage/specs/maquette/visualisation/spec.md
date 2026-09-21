# Spec Delta

## ADDED Requirements

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

## MODIFIED Requirements

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
