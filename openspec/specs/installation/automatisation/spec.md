# Automatisation locale

## Purpose

Le comportement automatique de l'éclairage intérieur commandé par l'état de la porte
sectionnelle, la commande murale et à distance de la porte, et les garanties qui les
encadrent : la porte ne se met en mouvement que par l'action d'une personne, jamais par un
automatisme ; la commande manuelle ne dépend d'aucun réseau ni service distant, et survit à
la défaillance de tout module.

Le sens de la commande automatique est **unique** : la porte agit sur l'éclairage,
l'éclairage n'agit jamais sur la porte.

## Requirements

### Requirement: Allumage automatique à l'ouverture de la porte

*Origine : `005-automatisation-locale` FR-001. Décision Q1. Critères mesurables : SC-001,
SC-013.*

L'installation DOIT allumer l'éclairage intérieur automatiquement à l'ouverture de
la porte sectionnelle, sans action de l'utilisateur, **quel que soit le moyen par lequel cette
ouverture a été commandée** — bouton mural, télécommande, ou organe du moteur.

#### Scenario: Entrée de nuit
- **WHEN** l'utilisateur entre son véhicule de nuit et atteint l'établi
- **THEN** l'éclairage s'est allumé sans qu'il touche aucun interrupteur

#### Scenario: Ouverture par la télécommande
- **WHEN** la porte est ouverte par la télécommande, véhicule à l'extérieur
- **THEN** l'éclairage intérieur s'allume

### Requirement: Extinction automatique après un délai réglable

*Origine : `005-automatisation-locale` FR-002 et FR-004. Critère mesurable : SC-002.*

L'installation DOIT éteindre automatiquement l'éclairage ainsi allumé après un
**délai réglable**, décompté depuis le dernier événement d'ouverture.

Un nouvel événement d'ouverture survenant pendant le décompte DOIT **relancer** le
délai, sans extinction intermédiaire.

#### Scenario: Extinction après le délai
- **WHEN** le délai s'écoule depuis le dernier événement d'ouverture
- **THEN** l'éclairage allumé automatiquement s'éteint seul, dans 100 % des essais

#### Scenario: Ouverture pendant le décompte
- **WHEN** une nouvelle ouverture survient pendant le décompte
- **THEN** le délai est relancé, sans extinction intermédiaire

### Requirement: Valeur du délai consignée au dossier

*Origine : `005-automatisation-locale` FR-003. Principe V de la constitution.
**Valeur à arrêter — décision du maître d'ouvrage.***

La valeur du délai retenue DOIT être **consignée au dossier**, et le réglage
effectif DOIT être vérifié comme y correspondant. *Un réglage non consigné est réputé non fait
(Principe V), et c'est déjà l'exigence retenue pour la temporisation du détecteur de façade.*

#### Scenario: Vérification du réglage
- **WHEN** le réglage effectif du délai est vérifié
- **THEN** il correspond à la valeur consignée au dossier

### Requirement: Points lumineux extérieurs hors de l'automatisme

*Origine : `005-automatisation-locale` FR-005. Décision Q3. Critère mesurable : SC-014.*

L'allumage automatique NE DOIT PAS s'appliquer aux points lumineux **extérieurs**.
Leur logique de commande est déjà arrêtée et différente : le point de façade est
alimenté en permanence et commuté sur place par son détecteur, le point de l'accès piéton est
commandé depuis l'extérieur, là où l'on se trouve quand on en a besoin. *Superposer une seconde
temporisation sur un point qui en a déjà une produirait un comportement que personne ne saurait
diagnostiquer.*

#### Scenario: Ouverture de la porte, points extérieurs
- **WHEN** la porte sectionnelle est ouverte
- **THEN** les points lumineux extérieurs conservent exactement le comportement établi par leur propre commande

### Requirement: Connaissance de l'état réel de la porte

*Origine : `005-automatisation-locale` FR-031 et FR-032. Née de la décision Q1.
**Relevé du moteur non fait — dépendance bloquante.***

L'installation DOIT connaître l'**état réel d'ouverture** de la porte sectionnelle,
indépendamment du moyen qui l'a commandée. Observer les seuls ordres émis par le point de
commande mural ne satisfait pas cette exigence.

Le moyen retenu pour connaître cet état NE DOIT PAS altérer le fonctionnement du
moteur, ni s'interposer dans ses circuits de sécurité. S'il s'appuie sur une sortie du moteur,
les caractéristiques de cette sortie DOIVENT être **constatées au relevé** et non présumées.

#### Scenario: Ouverture par un moyen non observé
- **WHEN** la porte est ouverte par la télécommande ou par un organe du moteur
- **THEN** l'installation en connaît l'état réel, sans s'être appuyée sur les seuls ordres du point de commande mural

#### Scenario: Caractéristiques de la sortie du moteur
- **WHEN** le moyen retenu s'appuie sur une sortie du moteur
- **THEN** les caractéristiques de cette sortie ont été constatées au relevé, et non présumées

### Requirement: Perte de l'information d'état

*Origine : `005-automatisation-locale` FR-033.*

La perte de cette information — capteur en défaut, sortie indisponible — NE DOIT PAS
empêcher la commande manuelle de l'éclairage. Elle fait retomber l'installation dans le mode
dégradé.

#### Scenario: Capteur en défaut
- **WHEN** le capteur d'état est en défaut ou la sortie du moteur indisponible
- **THEN** la commande manuelle de l'éclairage reste possible, l'installation retombant dans son mode dégradé

### Requirement: Bascule franche des interrupteurs muraux

*Origine : `005-automatisation-locale` FR-006 et FR-009. Critères mesurables : SC-003, SC-004.*

Les interrupteurs muraux DOIVENT commander l'éclairage en **bascule franche**, sans
aucune temporisation : allumé reste allumé jusqu'à une nouvelle action.

Les deux points de commande de l'éclairage DOIVENT être **équivalents** : chacun
bascule l'état courant, aucun n'est prioritaire, et aucun n'impose de connaître la position de
l'autre.

#### Scenario: Allumage manuel prolongé
- **WHEN** l'éclairage est allumé à la main
- **THEN** il reste actif au-delà d'une heure, sans extinction spontanée

#### Scenario: Équivalence des deux points de commande
- **WHEN** l'un ou l'autre des deux points de commande est actionné
- **THEN** il bascule l'état courant, sans priorité et sans qu'il faille connaître la position de l'autre

### Requirement: L'action manuelle l'emporte sur le décompte

*Origine : `005-automatisation-locale` FR-007, FR-008, FR-010.*

Une action manuelle survenant pendant le décompte DOIT **abandonner** le décompte
et imposer l'état demandé, dans les deux sens.

Un allumage manuel DÉJÀ en cours NE DOIT PAS être interrompu par une extinction
automatique, quelle que soit l'ouverture de porte qui a pu survenir entre-temps.

L'utilisateur DOIT pouvoir éteindre à la main un éclairage allumé automatiquement,
sans attendre la fin du délai.

#### Scenario: Action manuelle pendant le décompte
- **WHEN** une action manuelle survient pendant le décompte
- **THEN** le décompte est abandonné et l'état demandé est imposé, dans les deux sens

#### Scenario: Ouverture de porte sur un allumage manuel
- **WHEN** une ouverture de porte survient alors qu'un allumage manuel est déjà en cours
- **THEN** aucun décompte n'est armé, et l'allumage manuel n'est pas interrompu par une extinction automatique

### Requirement: Commande murale de la porte sectionnelle

*Origine : `005-automatisation-locale` FR-011.*

L'installation DOIT offrir un point de commande **mural** de la porte sectionnelle,
placé à l'entrée de cette porte, agissant comme une commande filaire du moteur existant.

#### Scenario: Commande murale
- **WHEN** le bouton mural de porte est actionné
- **THEN** il agit sur le moteur existant comme une commande filaire

### Requirement: Dispositifs de sécurité du moteur inchangés

*Origine : `005-automatisation-locale` FR-012. Critère mesurable : SC-008.*

La commande murale NE DOIT en aucun cas neutraliser, contourner ou retarder les
dispositifs de sécurité propres au moteur — détection d'obstacle et arrêt. Leur comportement
DOIT rester identique à celui constaté avant la modification, et ce point DOIT être vérifié.

#### Scenario: Essai de détection d'obstacle
- **WHEN** les dispositifs de sécurité du moteur sont essayés après la modification
- **THEN** ils agissent à l'identique de ce qui a été constaté avant

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

### Requirement: Mode dégradé décrit au dossier

*Origine : `005-automatisation-locale` FR-016.*

La défaillance d'un module NE DOIT PAS priver le local d'éclairage commandable. Le
dossier DOIT décrire le **mode dégradé** obtenu et le geste qui le rétablit.

#### Scenario: Module défaillant
- **WHEN** un module est défaillant
- **THEN** le local reste pourvu d'un éclairage commandable, et le dossier décrit le mode dégradé et le geste qui le rétablit

### Requirement: État défini et sûr au retour du courant

*Origine : `005-automatisation-locale` FR-018. Critère mesurable : SC-010.*

Au retour du courant après une coupure, l'installation DOIT revenir dans un état
**défini et sûr**, et cet état DOIT être écrit au dossier. Un rallumage inopiné, garage vide et
porte fermée, n'est pas un état acceptable.

#### Scenario: Retour du courant, garage vide
- **WHEN** le courant revient après une coupure, garage vide et porte fermée
- **THEN** l'installation revient dans l'état défini écrit au dossier, sans rallumage inopiné

### Requirement: Consignation non contournable par un automatisme

*Origine : `005-automatisation-locale` FR-019. Critère mesurable : SC-007.*

Un circuit consigné NE DOIT PAS pouvoir être remis sous tension par un automatisme,
un ordre réseau ou une minuterie. La consignation DOIT couper **en amont** des modules.

#### Scenario: Ordre sur un circuit consigné
- **WHEN** le circuit d'éclairage est consigné et qu'un ordre survient — interrupteur, ouverture de porte, minuterie
- **THEN** aucun ordre ne remet le circuit sous tension, la consignation coupant en amont des modules

### Requirement: L'absence de lumière ne vaut pas absence de tension

*Origine : `005-automatisation-locale` FR-020.*

Le dossier DOIT énoncer que l'éclairage peut désormais s'allumer **sans que
personne n'ait rien touché**, et que l'absence de lumière ne vaut donc pas absence de tension.
*C'est un changement de nature : avant cette fonctionnalité, l'état éteint résultait toujours
d'un geste humain.*

#### Scenario: Mention au dossier
- **WHEN** le dossier final est établi
- **THEN** il énonce que l'éclairage peut s'allumer sans intervention humaine, et que l'absence de lumière ne vaut pas absence de tension

### Requirement: Séparation des domaines de tension d'un module

*Origine : `005-automatisation-locale` FR-022. **Domaine de tension du moteur à constater.***

Tout module dont l'alimentation et la sortie n'appartiennent pas au même domaine de
tension DOIT assurer la **séparation** exigée entre eux, et cette caractéristique DOIT être
justifiée sur la fiche du produit retenu. *Le module de porte est alimenté en 230 V et sa sortie
agit sur l'entrée de commande du moteur, dont le domaine de tension est à constater.*

#### Scenario: Module de porte
- **WHEN** le module de porte est retenu
- **THEN** la séparation entre son alimentation 230 V et sa sortie vers le moteur est justifiée sur la fiche du produit

### Requirement: Modules, charges à découpage permanentes

*Origine : `005-automatisation-locale` FR-023.*

Les modules sont des **charges électroniques à découpage alimentées en permanence**.
Leur ajout DOIT être porté à la décision ouverte sur le **type** du dispositif différentiel,
qu'il rend plus contraignante encore : un type AC ne voit
pas les composantes continues, et il y en aurait désormais en permanence sur **les deux**
circuits d'usage courant.

#### Scenario: Ajout d'un module
- **WHEN** un module est ajouté
- **THEN** son effet est porté à la décision ouverte sur le type du dispositif différentiel

### Requirement: Comportement complet décrit pour un occupant

*Origine : `005-automatisation-locale` FR-029 et FR-030. Critères mesurables : SC-011, SC-012.*

Le dossier DOIT décrire le comportement complet de l'installation — allumage,
extinction, priorités, mode dégradé — dans une forme lisible par un occupant, et non seulement
par l'installateur. *Une logique qui ne vit que dans la configuration d'un module est perdue au
premier remplacement.*

Les réglages de chaque module DOIVENT pouvoir être **restitués** après remplacement
du matériel, sans reconstitution par essais successifs.

#### Scenario: Lecture par un occupant
- **WHEN** un occupant qui n'a pas participé aux travaux lit la notice
- **THEN** il sait dire dans quels cas l'éclairage s'allume et s'éteint seul

#### Scenario: Remplacement d'un module
- **WHEN** un module est remplacé
- **THEN** l'installation retrouve son comportement à partir des réglages consignés, sans reconstitution par essais successifs
