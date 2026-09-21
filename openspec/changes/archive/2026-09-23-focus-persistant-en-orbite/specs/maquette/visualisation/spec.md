# Spec Delta

## MODIFIED Requirements

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
