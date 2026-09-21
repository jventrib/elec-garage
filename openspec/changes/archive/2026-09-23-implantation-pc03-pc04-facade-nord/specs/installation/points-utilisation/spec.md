# Spec Delta

## MODIFIED Requirements

### Requirement: Position de PC-03

*Origine : `002-prises-de-courant` FR-004. Révisé le 2026-09-23 : le point passe en façade
nord, sur décision du maître d'ouvrage, pour que PC-04 puisse y passer sans perdre son
repiquage.*

PC-03 DOIT être un socle simple, posé à l'intérieur, dans l'angle formé par le
mur du fond et le mur droit, **sur la face intérieure du mur du fond**.

*L'exigence d'origine ne nommait aucune paroi — seulement l'angle — et restait donc vraie
lorsque le point était sur le mur droit. Elle nomme désormais la paroi, parce que c'est elle
qui décide de celle que la traversée franchit : un boîtier posé sur le mur droit ne peut pas
laisser sortir par son fond une traversée du mur du fond.*

#### Scenario: Implantation de PC-03
- **WHEN** PC-03 est implanté
- **THEN** il est un socle simple, à l'intérieur, dans l'angle du mur du fond et du mur droit, sur la face intérieure du mur du fond

#### Scenario: Paroi de la traversée
- **WHEN** la traversée desservant le socle extérieur qui lui fait dos est percée
- **THEN** elle franchit la paroi sur laquelle PC-03 est posé, et non une paroi perpendiculaire

### Requirement: Position de PC-04

*Origine : `002-prises-de-courant` FR-005. Révisé le 2026-09-23 : décision du maître d'ouvrage
de porter le point en façade nord.*

PC-04 DOIT être un socle double, posé à l'extérieur **en façade nord**, au droit de PC-03 —
donc dos à dos avec lui à travers le mur du fond.

*« Au droit de PC-03 » ne suffisait plus : la formule était vraie tant que les deux points
étaient sur la même paroi, et elle ne disait pas laquelle. Nommer la façade lève l'ambiguïté
et rend l'exigence opposable au relevé.*

#### Scenario: Implantation de PC-04
- **WHEN** PC-04 est implanté
- **THEN** il est un socle double, à l'extérieur en façade nord, au droit de PC-03 et dos à dos avec lui

#### Scenario: Aucun conduit extérieur pour l'atteindre
- **WHEN** l'alimentation de PC-04 est contrôlée
- **THEN** elle passe par la seule traversée du mur du fond, repiquée sur les bornes de PC-03, sans qu'aucun conduit chemine dehors
