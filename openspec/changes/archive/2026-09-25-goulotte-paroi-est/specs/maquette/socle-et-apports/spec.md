# Spec Delta

## ADDED Requirements

### Requirement: Longueur de conducteur sous un capot

*Changement `goulotte-paroi-est`, 2026-09-24. Une goulotte de 6,00 m que la plupart des
conducteurs quittent à 1,90 m.*

La longueur d'un conducteur DOIT compter chaque **conduit** qu'il emprunte pour sa longueur
entière, car on ne sort pas d'un tube en chemin. Elle DOIT compter chaque **profilé à raccordement
latéral** pour la **seule longueur que son trajet y parcourt**, car on sort d'un profilé par une
face, là où le trajet le quitte.

Le décompte majorant, faute de trajet dérivé, DOIT continuer de compter les profilés entiers : un
majorant ne se réduit pas.

#### Scenario: Conducteur qui quitte la goulotte en chemin
- **WHEN** un conducteur parcourt 1,90 m d'une goulotte de 6,00 m puis en sort par le dessous
- **THEN** son métré compte 1,90 m de goulotte, plus l'écart de l'axe à la face, et non 6,00 m

#### Scenario: Circuit non dérivable
- **WHEN** le trajet des conducteurs d'un circuit ne se dérive pas
- **THEN** le métré retombe sur le majorant, profilés comptés entiers, et il est annoncé comme majoré
