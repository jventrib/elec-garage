# Spec Delta

## ADDED Requirements

### Requirement: La sélection recentre l'orbite sur l'objet

*Décision du maître d'ouvrage du 2026-09-23. La cible de l'orbite était figée au centre du
local : pour regarder une enveloppe de près, il fallait zoomer, tourner et deviner de quel côté
elle s'ouvre.*

En mode orbite, désigner un objet DOIT recentrer l'orbite **sur cet objet** : il devient la
cible, et la vue s'en approche.

Cela DOIT valoir pour **tout ce qui est sélectionnable** — composant, cheminement, traversée,
obstacle — et non pour les seuls composants.

**Fermer la fiche DOIT ramener l'orbite au centre du local.** L'utilisateur qui referme n'a plus
d'objet en tête ; le laisser tourner autour de celui qu'il vient de quitter le perdrait.

Le zoom manuel DOIT rester possible pendant le focus : cadrer n'est pas enfermer.

En mode **déplacement libre**, la sélection NE DOIT PAS déplacer la caméra. La fiche s'ouvre et
la vue reste où elle est. *Les deux modes sont distincts, et téléporter quelqu'un pendant qu'il
vole le désorienterait.*

#### Scenario: Désignation d'un objet en mode orbite
- **WHEN** l'utilisateur désigne un objet dans la vue en mode orbite
- **THEN** l'orbite se recentre sur cet objet et la vue s'en approche

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

*Quatre des sept obstacles du projet ne portent aucun volume : débattement du vantail, tablier
fermé, gabarit de manœuvre, débattement des portières.*

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

## MODIFIED Requirements

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
