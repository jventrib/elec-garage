# Spec Delta

## ADDED Requirements

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

## MODIFIED Requirements

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
