# Spec Delta

## RENAMED Requirements

- FROM: `### Requirement: Aucune commande de porte hors de sa vue`
- TO: `### Requirement: Commande de la porte : par une personne, jamais par un automatisme`

## MODIFIED Requirements

### Requirement: Commande de la porte : par une personne, jamais par un automatisme

*Origine : `005-automatisation-locale` FR-013 et FR-014. Critère mesurable : SC-009.
**Révisée par décision du maître d'ouvrage du 2026-09-23**, contre l'avis du dossier — voir
le changement `commande-porte-a-distance`.*

La commande de la porte à distance **est admise**, par l'application du fabricant du module
de porte, sur place ou depuis Internet. Les moyens de commande sont le bouton mural, la
télécommande existante, les organes du moteur et cette application. *Décision du maître
d'ouvrage du 2026-09-23. Motif : l'accessibilité à distance est précieuse, et le risque
d'écrasement est jugé exagéré. Le dossier tenait une porte motorisée mise en mouvement hors
de la vue de l'opérateur pour un risque d'écrasement ; l'avis est consigné, la décision
prévaut.*

Toute mise en mouvement de la porte DOIT résulter de l'**action délibérée d'une personne**.
L'ouverture de la porte NE DOIT JAMAIS être déclenchée par un automatisme. Le sens de la
commande automatique est **unique** : la porte agit sur l'éclairage, l'éclairage n'agit
jamais sur la porte.

L'utilisateur qui commande la porte à distance DOIT connaître son **état réel** — ouverte ou
fermée — dans la même application, tiré de l'état réel de la porte et non des ordres émis.
*Qui commande une porte sans la voir doit savoir dans quel état il la laisse.*

*Réserve ouverte, non bloquante : la commande hors vue d'une porte motorisée peut relever
d'exigences propres aux portes motorisées, à identifier sur le texte et non de mémoire ; le
niveau de protection du moteur en cas de mise en mouvement sans opérateur est à constater au
relevé du moteur.*

#### Scenario: Mise en mouvement de la porte
- **WHEN** l'installation est en service
- **THEN** la porte ne se met en mouvement à aucun moment sans action délibérée d'une personne, et aucun automatisme ne déclenche son ouverture

#### Scenario: Commande à distance
- **WHEN** l'utilisateur commande la porte depuis l'application du fabricant, sur place ou depuis Internet
- **THEN** la porte se met en mouvement comme sous l'action du bouton mural

#### Scenario: État remonté à l'utilisateur à distance
- **WHEN** la porte est ouverte ou fermée, par quelque moyen que ce soit
- **THEN** l'application du fabricant en affiche l'état réel, ouverte ou fermée

### Requirement: Fonctionnement sans réseau local

*Origine : `005-automatisation-locale` FR-015 et FR-017. Critères mesurables : SC-005, SC-006.
**Assouplie par décision du maître d'ouvrage du 2026-09-23** — voir le changement
`commande-porte-a-distance`.*

La commande **manuelle** de l'éclairage et celle de la porte — les deux interrupteurs
d'éclairage et le bouton mural de porte — DOIVENT rester entièrement fonctionnelles **sans
réseau local ni Internet** : point d'accès éteint, liaison sans fil perdue, modules non
appairés ou service du fabricant injoignable. Seuls l'allumage automatique et la commande à
distance de la porte peuvent cesser.

Un service distant est admis **pour la seule commande à distance de la porte** et la
remontée de son état. L'éclairage, son automatisme et toute commande manuelle NE DOIVENT
dépendre d'**aucun service distant**, d'aucun compte en ligne et d'aucune connexion
Internet, ni pour fonctionner, ni pour être configurés après la pose.

#### Scenario: Point d'accès éteint
- **WHEN** le point d'accès réseau est éteint
- **THEN** les deux interrupteurs et le bouton de porte restent entièrement fonctionnels

#### Scenario: Internet coupé, réseau local présent
- **WHEN** la connexion Internet est coupée, le réseau local restant en service
- **THEN** les commandes manuelles et l'allumage automatique fonctionnent, seule la commande à distance de la porte cesse

#### Scenario: Requêtes sortantes
- **WHEN** le trafic de l'installation est observé
- **THEN** les seules requêtes sortantes vers Internet sont celles du module de porte vers le service du fabricant, et le module d'éclairage n'en émet aucune
