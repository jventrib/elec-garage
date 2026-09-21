# Spec Delta

## ADDED Requirements

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
