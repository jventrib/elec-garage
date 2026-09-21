# Spec Delta

## MODIFIED Requirements

### Requirement: Position de PC-05 et dégagement du tablier

*Origine : `002-prises-de-courant` FR-006 et FR-053. Critère mesurable : SC-013.
Révisé le 2026-09-23 : BD-05 est passée dans l'axe ouest de BD-01, et PC-05 l'a suivie.*

PC-05 DOIT être un socle simple, posé au plafond, destiné au moteur de la
porte sectionnelle, et DOIT se situer hors de la trajectoire du tablier et de son rail en
position ouverte comme en position fermée.

PC-05 DOIT être posé **à l'ouest de BD-05**, et non au sud ni au nord. BD-05 étant sur l'axe
y = 2,60, ses trois branches — l'arrivée depuis l'est, la montée de l'éclairage vers le nord et
la desserte de PC-05 — DOIVENT partir dans trois directions distinctes. Au nord la desserte se
superposerait à la montée de l'éclairage ; au sud le boîtier mordrait dans le rail.

Le dégagement de PC-05 DOIT également être statué au regard du **tablier en
position ouverte**, qui occupe toute la largeur de la baie sous le plafond et non les 8 cm du
rail. **Cette exigence est satisfaite** depuis le relevé de la hauteur de passage de la
porte, 2,10 m : le tablier est borné au nord par la course du rail, soit y ≤ 2,50 m, et
PC-05 est à y = 2,60 m. Socle et conduit d'alimentation sont donc **prouvés dégagés**, avec
**0,055 m de marge pour le socle**. Le majorant ne servant qu'à démontrer un dégagement, aucune
conclusion défavorable n'en est tirée ici, et aucune ne serait recevable.

*La marge était de 0,155 m quand PC-05 se tenait à y = 2,70. Elle a été divisée par trois par
le passage de BD-05 dans l'axe. Elle reste positive et démontrée — mais contre un obstacle
**relevé**, non borné : le rail porte un volume mesuré et monte jusqu'au plafond. Ce chiffre
DOIT être revérifié à toute révision de l'implantation du plafond.*

#### Scenario: Dégagement du rail
- **WHEN** l'emprise du rail — 2,50 m de profondeur, sous-face à 2,35 m — est contrôlée
- **THEN** PC-05 et son alimentation la dégagent

#### Scenario: Dégagement du tablier ouvert
- **WHEN** le majorant du tablier en position ouverte, borné à y ≤ 2,50 m, est contrôlé
- **THEN** PC-05 à y = 2,60 m est à l'écart, avec 0,055 m de marge pour le socle

#### Scenario: Direction de la desserte
- **WHEN** les trois branches de BD-05 sont tracées
- **THEN** elles partent dans trois directions distinctes, PC-05 étant desservi vers l'ouest
