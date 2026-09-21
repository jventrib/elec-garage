# Spec Delta

## MODIFIED Requirements

### Requirement: Un objet sans étendue ne se cadre pas

*Deux des sept obstacles du projet ne portent aucun volume : le gabarit de manœuvre du véhicule
et le débattement des portières. Le vantail de la porte de service et le tablier fermé n'en
portaient pas davantage jusqu'aux relevés du 2026-09-23 ; ils sont désormais bornés par un
majorant.*

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
