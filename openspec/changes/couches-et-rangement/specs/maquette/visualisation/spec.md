# Spec Delta — maquette/visualisation

## RENAMED Requirements

- FROM: `### Requirement: Obstacle masqué non sélectionnable`
- TO: `### Requirement: Objet masqué non sélectionnable`

## MODIFIED Requirements

### Requirement: Objet masqué non sélectionnable

*Origine : `001-visualisation-3d` FR-047. Étendu le 2026-09-27 : la règle ne vaut pas
seulement pour les ouvrants.*

Un objet NE DOIT PAS être sélectionnable lorsqu'il n'est pas visible à l'écran, quelle que
soit la raison de son invisibilité : fermeture d'un ouvrant, ou masquage d'une couche de
la maquette. Désigner un objet invisible revient à faire agir l'installateur sur une
représentation qu'il n'a pas sous les yeux.

Le fait déterminant n'est pas le masquage, mais la **visibilité à l'écran** : c'est elle,
et elle seule, qui fait la désignabilité.

#### Scenario: Tablier masqué

- **WHEN** le tablier est masqué par la bascule des ouvrants
- **THEN** il n'est pas sélectionnable

#### Scenario: Objet d'une couche masquée

- **WHEN** une couche de la maquette est masquée
- **THEN** aucun objet de cette couche n'est sélectionnable

#### Scenario: Couche réaffichée

- **WHEN** une couche masquée est réaffichée
- **THEN** ses objets redeviennent sélectionnables, sans avoir à recharger la maquette

## ADDED Requirements

### Requirement: Bascule d'affichage par couche

*Origine : `couches-et-rangement`, 2026-09-27. Principe VI.*

La maquette DOIT présenter son contenu sous forme de **couches masquables**, chacune
pouvant être affichée ou masquée indépendamment des autres, et l'installateur DOIT
pouvoir opérer ces bascules depuis l'interface.

Une couche DOIT regrouper des objets de même nature fonctionnelle, et non des objets
choisis au cas par cas : c'est ce qui rend la bascule utile.

#### Scenario: Masquage d'une couche

- **WHEN** l'installateur masque une couche
- **THEN** ses objets disparaissent de la vue, et ceux des autres couches ne changent pas

#### Scenario: Indépendance des bascules

- **WHEN** deux couches sont masquées successivement
- **THEN** chaque bascule n'affecte que sa propre couche, et l'état de l'autre est inchangé

#### Scenario: État porté par le bouton

- **WHEN** l'état d'une couche change
- **THEN** le bouton qui la commande porte cet état dans son libellé et dans son attribut
  d'état pressé, afin qu'il se lise sans la scène

#### Scenario: Couches visibles au chargement

- **WHEN** la maquette s'ouvre
- **THEN** toutes les couches sont visibles, et leur état n'est pas mémorisé d'une
  ouverture à l'autre

### Requirement: Le masquage d'une couche ne touche pas à la séquence

*Origine : `couches-et-rangement`, 2026-09-27. Étend FR-010 et FR-012.*

Le masquage d'une couche est un **réglage d'affichage**, et NE DOIT PAS affecter ni l'étape
courante, ni l'état de pose des objets, ni l'avancement dans la séquence.

Une couche masquée puis réaffichée DOIT retrouver exactement l'état qu'elle avait avant
le masquage. Le masquage NE DOIT PAS faire avancer, reculer, ni réinitialiser la séquence.

#### Scenario: Couche masquée en cours de séquence

- **WHEN** l'installateur masque une couche au milieu d'une étape de montage
- **THEN** l'étape courante et l'état de pose des objets restent inchangés

#### Scenario: Réaffichage après masquage

- **WHEN** une couche masquée est réaffichée
- **THEN** elle retrouve l'état de pose qu'elle avait avant le masquage

#### Scenario: Séquence parcourue couche masquée

- **WHEN** la séquence est parcourue avec une couche masquée
- **THEN** l'avancement et les consignes écrites restent corrects, et se lisent sans que
  la couche soit visible
