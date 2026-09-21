# Spec Delta

## ADDED Requirements

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
