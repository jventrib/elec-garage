# Électricité

## Purpose

Le découpage des circuits du garage, leurs protections contre les surintensités et les
contacts indirects, la mise à la terre, le dimensionnement calculé des conducteurs et la
maîtrise de la puissance appelée sur un branchement de 9 kVA.

Cette capacité porte les Principes I à IV de la [constitution](../../../constitution.md). Aucune
valeur normative n'y est recevable de mémoire : chaque exigence retenue DOIT être rattachée à
la clause qui la justifie, et confirmée sur le texte de la NF C 15-100.

## Requirements

### Requirement: Circuit unique pour les cinq points de prise

*Origine : `002-prises-de-courant` FR-020 et FR-021. Critère mesurable : SC-004.*

Les cinq points PC-01 à PC-05 DOIVENT être alimentés par un circuit unique,
protégé par un seul dispositif contre les surintensités et un seul différentiel 30 mA.

La conséquence de FR-020 est assumée : un défaut sur un socle extérieur coupe
également les socles intérieurs et le moteur de la porte sectionnelle. De ce fait, FR-015
devient une exigence critique, et le mode d'emploi du déverrouillage manuel DOIT être porté
à la connaissance de l'utilisateur et consigné au dossier final.

#### Scenario: Essai du différentiel du circuit des prises
- **WHEN** le bouton test du dispositif différentiel du circuit des prises est actionné
- **THEN** les cinq points coupent effectivement, dans 100 % des essais

### Requirement: Circuit d'éclairage distinct de celui des prises

*Origine : `003-eclairage` FR-016 et FR-017. Critère mesurable : SC-006.*

Les quatre points DOIVENT être alimentés par un **circuit d'éclairage distinct**
de celui des prises, protégé par son propre dispositif contre les surintensités et son propre
différentiel.

La conséquence de FR-016 est assumée et recherchée : un défaut sur le circuit des
prises ne plonge pas le local dans le noir, et un défaut sur l'éclairage ne coupe pas les
prises.

#### Scenario: Défaut sur le circuit des prises
- **WHEN** un défaut survient sur le circuit des prises
- **THEN** le local n'est pas plongé dans le noir, l'éclairage restant alimenté

#### Scenario: Essai du différentiel d'éclairage
- **WHEN** le bouton test du dispositif différentiel du circuit d'éclairage est actionné
- **THEN** les quatre points coupent

### Requirement: Circuit de la borne entièrement dédié

*Origine : `004-borne-recharge` FR-008 et FR-009. Principe IV de la constitution.
Amendé : la dédicace du conduit y était énoncée sans référence de clause, et le tracé arrêté la
contredisait sur 0,04 m.*

BR-01 DOIT être alimentée par un **circuit entièrement dédié**, sans aucun autre
point d'utilisation raccordé, conformément au Principe IV de la constitution. Ce circuit DOIT
posséder sa propre protection contre les surintensités et son propre dispositif différentiel.
**Cette dédicace est entière et n'est pas amendée.**

La dédicace NE S'ÉTEND PAS au **contenant**. La ligne de la borne PEUT cohabiter avec d'autres
circuits dans un profilé de goulotte, à deux conditions :

1. elle y est un **câble à enveloppe propre**, et non des conducteurs isolés nus ;
2. elle y **transite sans être coupée** — aucune connexion du circuit de la borne n'est faite
   dans un organe de connexion partagé.

Là où elle emprunte un **conduit**, celui-ci lui reste dédié : un conduit n'a pas d'enveloppe
propre par conducteur, et y mêler deux circuits reviendrait à la situation que la condition 1
écarte.

Le **facteur de correction de groupement** DOIT être appliqué à son courant admissible sur les
portions où elle cohabite, et écrit. L'exemption que le principe en tirait ne vaut plus que sur
les portions restées en conduit dédié.

*Valeurs normatives à confirmer sur le texte, et non de mémoire : la clause qui fonderait —
ou non — une exigence de contenant dédié pour un point de charge, et la catégorie de pose d'un
câble en goulotte, qui décide de son courant admissible.*

#### Scenario: Recensement des points du circuit de la borne
- **WHEN** le circuit de BR-01 est parcouru
- **THEN** aucun autre point d'utilisation n'y est raccordé, et il porte ses propres protections

#### Scenario: Cohabitation en goulotte
- **WHEN** la ligne de la borne emprunte un profilé partagé avec d'autres circuits
- **THEN** elle y est un câble à enveloppe propre, elle y transite sans être coupée, et le facteur de groupement est appliqué à son courant admissible sur cette portion

#### Scenario: Portion en conduit
- **WHEN** la ligne de la borne emprunte un conduit
- **THEN** ce conduit ne porte aucun autre circuit

### Requirement: Protection différentielle de type A au minimum

*Origine : `002-prises-de-courant` FR-008 et FR-009 ; `003-eclairage` FR-011 et FR-043.
Principe II de la constitution.*

Tous les socles DOIVENT être du type 2P+T, avec le conducteur de protection
raccordé et sa continuité vérifiée jusqu'à chaque point.

Tous les points PC-01 à PC-05 DOIVENT être protégés par un dispositif
différentiel résiduel de sensibilité 30 mA au maximum, **de type A au minimum**. Le type AC
de l'interrupteur différentiel existant ne détecte pas les composantes continues pulsées que
produisent les chargeurs d'outils sans fil et l'électronique de la motorisation de porte,
lesquels comptent précisément parmi les charges de ce circuit.

Le circuit d'éclairage DOIT être protégé par un dispositif différentiel résiduel
de sensibilité 30 mA au maximum, **de type A au minimum**. Les drivers des luminaires à LED
produisent des composantes continues pulsées qu'un type AC ne détecte pas.

Le détecteur étant un appareil **électronique en extérieur**, il renforce
l'exigence : son alimentation à découpage produit des composantes continues pulsées
qu'un différentiel de type AC ne détecte pas. Le type A devient d'autant moins contournable.

#### Scenario: Charge à découpage sur le circuit
- **WHEN** un chargeur d'outil sans fil, un driver de LED ou l'électronique de motorisation est alimenté
- **THEN** le différentiel qui le protège est de type A au minimum, et de sensibilité 30 mA au maximum

### Requirement: Statuer sur le remplacement de l'interrupteur de type AC

*Origine : `002-prises-de-courant` FR-050. **Décision du maître d'ouvrage, non tranchée.***

Le remplacement de l'interrupteur différentiel de type AC existant par un type A
DOIT être statué explicitement avant la réalisation, et la décision consignée avec son motif.

*Devenue bloquante le 2026-09-22, et pour une raison qui ne vient pas de cette fonctionnalité.*
La borne de recharge aura son **propre** différentiel, de type A ou F. Cela ne
suffit pas : tant que l'interrupteur de type AC subsiste, le circuit de la borne se trouve
**derrière lui**, et le Principe II proscrit un type AC en amont d'un type A, F ou B — une
composante continue le désensibilise au moment même où il servirait. Un différentiel dédié en
aval d'un type AC ne protège donc pas mieux qu'un type AC.
Le conserver est recevable si c'est écrit et justifié ; le conserver par défaut ne l'est pas.

*Précision du 2026-09-22 : la borne s'est retirée de cette dépendance en partant du bornier, en
amont du type AC. L'éclairage et les prises, eux, restent en aval : la décision les concerne
seuls désormais, et plus rien ne la reporte.*

#### Scenario: Décision consignée
- **WHEN** la réalisation est engagée
- **THEN** la décision de conserver ou de remplacer l'interrupteur de type AC est consignée avec son motif écrit

### Requirement: Différentiel de la borne monté sur le bornier, en amont du type AC

*Origine : `004-borne-recharge` FR-010. Décision du maître d'ouvrage du 2026-09-22.*

Le circuit DOIT posséder sa **propre protection contre les surintensités** et son
**propre dispositif différentiel**, distincts de ceux des circuits des prises et de
l'éclairage.

Ce différentiel DOIT être monté sur le **bornier du tableau divisionnaire**, **en amont** de
l'interrupteur différentiel de type AC existant, et non derrière lui. Le Principe II proscrit
un type AC en amont d'un type A, F ou B : partir du bornier lève la contradiction sans attendre
le remplacement de l'interrupteur.

#### Scenario: Position du différentiel de la borne
- **WHEN** le différentiel de la borne est monté
- **THEN** il est sur le bornier du tableau divisionnaire, en amont de l'interrupteur différentiel de type AC

### Requirement: Consignation — le tableau ne coupe pas la borne

*Origine : `004-borne-recharge` FR-040. Critère mesurable : SC-009.*

La conséquence de FR-010 sur la **consignation** DOIT être écrite au dossier et
portée sur le matériel : **ouvrir l'interrupteur différentiel du tableau ne met pas la borne
hors tension.** C'est pourtant le geste par lequel on consigne habituellement ce local, et il
laisse vivant le circuit le plus énergétique qu'il porte.

Trois obligations en découlent :

1. le repérage de **BD-01 et BD-02** DOIT, outre nommer le circuit de la borne, préciser qu'il
   **n'est pas coupé par l'interrupteur du tableau** ;
2. la consignation du local DOIT viser l'**organe propre de la borne**, et non l'interrupteur
   général ;
3. le **tableau** DOIT porter cette mention, à l'endroit même où le geste se fait.

#### Scenario: Consignation du local
- **WHEN** l'interrupteur différentiel du tableau est ouvert pour consigner le local
- **THEN** la borne reste sous tension, et cette mention figure au tableau, sur BD-01 et BD-02, et au dossier

### Requirement: Détection du courant continu de défaut à 6 mA

*Origine : `004-borne-recharge` FR-011, FR-039, FR-042. Principe IV de la constitution.
**Voie non arrêtée — décision du maître d'ouvrage.***

La **détection du courant continu de défaut** DOIT être assurée, soit par un
différentiel de **type B**, soit par un différentiel de **type A associé à un dispositif de
détection de courant continu résiduel de 6 mA** documenté comme tel.
La voie retenue DOIT être écrite au dossier.

**Le choix entre A et F ne décide pas de la détection du courant continu, et ne
doit pas être présenté comme s'il le faisait.** La question se reformule ainsi : **la borne
intègre-t-elle, oui ou non, le dispositif de détection de courant continu résiduel de 6 mA ?**

- **Si oui**, le type A satisfait la constitution telle qu'elle est écrite. Le type F devient
  alors un choix qui DOIT être justifié par autre chose que le courant continu lisse — sa
  tolérance aux courants résiduels à fréquences composées —, faute de quoi il n'apporte rien
  ici et coûte davantage.
- **Si non**, **ni A ni F** ne sont admissibles au titre du Principe IV, qui ne connaît que
  deux voies : le type B, ou le type A associé à la détection 6 mA.

Le dispositif de détection 6 mA PEUT être **intégré à la borne** ou constituer un
**module distinct au tableau**. La voie retenue DOIT être écrite.

Tant que la voie n'est pas arrêtée et documentée, le type du différentiel DOIT rester `null`
dans les données (Principe I).

#### Scenario: Voie non arrêtée
- **WHEN** la voie de détection 6 mA n'est pas encore arrêtée et documentée
- **THEN** le type du différentiel de la borne reste `null` dans les données, et aucune valeur plausible ne lui est substituée

#### Scenario: Aucun type ne dispense
- **WHEN** un type de différentiel est retenu pour la borne
- **THEN** il ne dispense pas du dispositif de détection 6 mA, dont la voie reste à écrire

### Requirement: Conditions de faisabilité au tableau

*Origine : `004-borne-recharge` FR-041. **Constat du maître d'ouvrage, non fait.***

Deux **conditions de faisabilité** DOIVENT être constatées au relevé avant la pose :
le **bornier** accepte un départ supplémentaire de 32 A, et le tableau dispose des **modules
libres** nécessaires au différentiel et à la protection contre les surintensités de la borne.

#### Scenario: Relevé avant pose
- **WHEN** le relevé du tableau est conduit avant la pose de la borne
- **THEN** il constate que le bornier accepte un départ de 32 A et que les modules libres nécessaires sont disponibles

### Requirement: Continuité du conducteur de protection, point unique de défaillance

*Origine : `002-prises-de-courant` FR-048 ; `003-eclairage` FR-012.*

Le garage n'ayant **pas de prise de terre locale**, la continuité du conducteur
PE depuis le tableau principal est le point unique de défaillance de toute la mise à la terre
du local. L'essai de continuité DOIT être conduit jusqu'à chacun des cinq points, et sa
valeur mesurée consignée point par point — non un simple constat de bon fonctionnement.

Le conducteur de protection DOIT être amené à chaque point d'éclairage, y compris
lorsque le luminaire qui y sera raccordé est de classe II. Sa continuité DOIT être vérifiée
jusqu'à chaque point.

#### Scenario: Essai de continuité
- **WHEN** l'essai de continuité du conducteur de protection est conduit
- **THEN** il atteint chacun des points, et sa valeur mesurée est consignée point par point

#### Scenario: Luminaire de classe II
- **WHEN** un point d'éclairage recevra un luminaire de classe II
- **THEN** le conducteur de protection y est tout de même amené

### Requirement: Statuer sur la liaison équipotentielle du tablier

*Origine : `002-prises-de-courant` FR-049. **Décision du maître d'ouvrage, non tranchée.***

La liaison équipotentielle DOIT statuer explicitement sur le **tablier métallique
de la porte sectionnelle et son rail**, éléments conducteurs accessibles de grande surface,
d'autant que la motorisation alimentée par PC-05 y est mécaniquement liée. Statuer signifie
décider et écrire, y compris s'il est décidé qu'aucune liaison n'est requise, avec le motif.

#### Scenario: Décision sur la liaison
- **WHEN** la note de calcul est close
- **THEN** elle porte la décision sur la liaison équipotentielle du tablier et du rail, avec son motif, y compris s'il est décidé qu'aucune liaison n'est requise

### Requirement: Décompte des prises du circuit

*Origine : `002-prises-de-courant` FR-013 et FR-043. Critère mesurable : SC-016.*

Le circuit unique dessert **huit prises** au sens du décompte de la
NF C 15-100. **Un socle double compte pour deux prises**, et non pour une : le décompte porte
sur les prises et non sur les boîtiers. Les cinq points se comptent donc PC-01 (2), PC-02 (2),
PC-03 (1), PC-04 (2), PC-05 (1).

*Correction du 2026-09-21 : la version initiale de cette exigence énonçait « un socle double
comptant pour un », ce qui est faux et sous-estimait le décompte de trois prises.*

Ce décompte DOIT rester dans la limite fixée par la norme pour la section et le calibre
retenus — usuellement douze prises pour 2,5 mm² protégés à 20 A, ce qui laisse une marge de
quatre. Toute extension ultérieure DOIT être vérifiée au regard de cette même limite.

Le décompte DOIT être confronté à la limite que la norme
fixe pour 2,5 mm² et le calibre retenu. Huit prises se situent en deçà de la limite usuelle de
douze, avec une marge de quatre, mais c'est la note de calcul qui l'établit sur le texte.

#### Scenario: Confrontation à la limite normative
- **WHEN** le décompte de huit prises est confronté à la limite normative pour la section et le calibre retenus
- **THEN** il lui reste inférieur ou égal

### Requirement: Décompte des points d'éclairage

*Origine : `003-eclairage` FR-018.*

Le décompte des points DOIT rester dans la limite fixée par la norme pour un
circuit d'éclairage, avec la section et le calibre retenus, et toute extension ultérieure DOIT
être vérifiée au regard de cette même limite.

#### Scenario: Extension du circuit d'éclairage
- **WHEN** un point est ajouté au circuit d'éclairage
- **THEN** le décompte est revérifié au regard de la limite normative pour la section et le calibre retenus

### Requirement: Charges desservies par le circuit des prises

*Origine : `002-prises-de-courant` FR-022, FR-023, FR-024. Critère mesurable : SC-009.*

Le circuit unique DOIT être dimensionné pour l'outillage portatif courant et,
en usage occasionnel et non simultané, pour un gros consommateur unique de type compresseur
ou poste à souder.

La note de calcul DOIT établir le courant d'emploi du gros consommateur
effectivement retenu, et vérifier que le circuit unique l'admet sans échauffement
ni déclenchement en usage normal.

Si le gros consommateur retenu dépasse la capacité admissible du circuit unique,
un circuit spécialisé dédié DOIT être créé pour lui. Ce cas constitue une évolution du
périmètre de cette fonctionnalité et DOIT être signalé explicitement avant toute
réalisation, conformément à la constitution du projet.

#### Scenario: Gros consommateur à pleine charge
- **WHEN** le gros consommateur occasionnel retenu fonctionne à pleine charge
- **THEN** le circuit l'admet sans échauffement ni déclenchement en usage normal

### Requirement: Compresseur retenu, jamais simultané avec une charge

*Origine : `002-prises-de-courant` FR-044, FR-045, FR-046. Décision du maître d'ouvrage du
2026-09-21.*

Le gros consommateur est un **compresseur**, décidé le 2026-09-21.
C'est le cas favorable : quelques kilowatts entrent sans difficulté dans un circuit de
2,5 mm². La création d'un circuit spécialisé n'a donc pas lieu de s'appliquer, sous
réserve que la note de calcul établisse le courant d'emploi du modèle réellement retenu.

Le compresseur n'est jamais utilisé pendant une charge du véhicule. C'est une
**hypothèse d'exploitation arrêtée par le maître d'ouvrage** le 2026-09-21, et non une
contrainte à faire respecter par un dispositif. Le dimensionnement du circuit des prises est
donc établi sans cumul avec la borne.

Cette hypothèse DOIT figurer au dossier final, parce qu'elle est une condition de
validité du dimensionnement et non une préférence d'usage. Quiconque reprendrait
l'installation sans la connaître pourrait conclure à tort que les deux usages sont cumulables.

#### Scenario: Hypothèse au dossier
- **WHEN** le dossier final est établi
- **THEN** l'hypothèse de non-simultanéité du compresseur et de la charge y figure comme condition de validité du dimensionnement

### Requirement: Section et diamètre décidés, puis vérifiés

*Origine : `002-prises-de-courant` FR-035, FR-036, FR-041, FR-042.*

Le circuit des prises DOIT cheminer en **conduit IRL de 20 mm**. Ce diamètre est
une décision de conception arrêtée, et non une valeur déduite de la note de calcul.

Le diamètre étant arrêté avant la section des conducteurs, la note de calcul
DOIT **vérifier** que l'IRL 20 admet les conducteurs retenus au regard du taux de
remplissage admissible, au lieu de déduire le conduit de la section. Si le taux n'est pas
tenu, c'est le diamètre qui DOIT être revu, et ce changement DOIT être signalé.

Les conducteurs du circuit des prises sont de section **2,5 mm²**. Comme le
diamètre du conduit, c'est une décision de conception arrêtée et non une valeur déduite de la
note de calcul.

La note de calcul DOIT **vérifier** que 2,5 mm² convient, et non le supposer.
Trois vérifications au moins en découlent : le courant admissible en pose apparente sous
conduit, la chute de tension cumulée avec les 30 m d'arrivée en 16 mm² protégée à 63 A, et le
calibre de protection associé à cette section pour un circuit de prises. Le cumul DOIT
s'appuyer sur la longueur du **chemin le plus long** du tracé, que la maquette fournit, et
non sur le métré total de conduit.

#### Scenario: Taux de remplissage non tenu
- **WHEN** la note de calcul établit que l'IRL 20 ne tient pas le taux de remplissage admissible
- **THEN** le diamètre est revu, et ce changement est signalé

#### Scenario: Chemin le plus long
- **WHEN** la chute de tension cumulée est calculée
- **THEN** elle s'appuie sur la longueur du chemin le plus long du tracé, et non sur le métré total de conduit

### Requirement: Courant admissible en mode de pose réel

*Origine : `002-prises-de-courant` FR-056 et FR-057. Principe III de la constitution.*

La note de calcul DOIT vérifier la condition `IB ≤ In ≤ Iz` en retenant le courant
admissible du **mode de pose réel** — conducteurs isolés en conduit, soit la catégorie B1 —
et non celui d'un câble posé en saillie, plus favorable. L'écart entre les deux n'est pas
négligeable et la valeur la plus favorable ne s'applique pas ici.

Si le calibre retenu est de 20 A, la note DOIT statuer explicitement sur la marge
résiduelle : le courant admissible de 2,5 mm² en catégorie B1 est de l'ordre de 20 A, de sorte
qu'un calibre de 20 A n'en laisse aucune. Un calibre de 16 A rétablirait une marge, au prix
d'une limite de décompte possiblement plus basse — qu'il faut alors revérifier.

#### Scenario: Vérification de IB ≤ In ≤ Iz
- **WHEN** la condition `IB ≤ In ≤ Iz` est vérifiée
- **THEN** le courant admissible retenu est celui de la catégorie B1, mode de pose réel

#### Scenario: Calibre de 20 A
- **WHEN** le calibre retenu est de 20 A
- **THEN** la note statue explicitement sur la marge résiduelle, nulle à ce calibre

### Requirement: Conduit partagé — remplissage et groupement

*Origine : `002-prises-de-courant` FR-037, FR-064, FR-065 ; `003-eclairage` FR-025 ;
`005-automatisation-locale` FR-028. Décision du maître d'ouvrage du 2026-09-21.
Critère mesurable : SC-017.*

Le conduit du circuit des prises est **partagé avec celui de l'éclairage** sur son
tronc. La borne reste exclue de tout partage : sa ligne est entièrement dédiée, conduit
compris, par le Principe IV.

Le conduit de la partie **partagée** DOIT être dimensionné pour l'ensemble des
conducteurs des deux circuits. Le taux d'occupation DOIT respecter la règle du tiers, ce qui
s'écrit `D ≥ d·√(3n)` pour n conducteurs de diamètre extérieur d. Un IRL 20 n'y suffit pas
dans le cas général : le calibre retenu est **plus gros que celui d'un conduit dédié**, et
l'écart DOIT se lire dans les données.

Le **facteur de correction de groupement** DOIT être appliqué au courant admissible
des **deux** circuits partagés, et écrit. Le Principe III l'impose, et son rationale nomme
précisément ce cas : « un conduit apparent et chargé de plusieurs circuits dissipe moins bien
qu'on ne le suppose ».

*Conséquence à ne pas éluder : ce facteur s'applique au circuit des prises, dont la marge face
à son courant admissible est déjà la question ouverte de sa note de calcul. Le partage
transforme donc une case « sans objet » en réduction obligatoire sur le seul circuit du projet
dont la marge thermique est une inconnue déclarée.*

#### Scenario: Règle du tiers
- **WHEN** le taux d'occupation du conduit partagé est contrôlé
- **THEN** la somme des sections des conducteurs ne dépasse pas le tiers de la section du conduit, soit `D ≥ d·√(3n)`

#### Scenario: Facteur de groupement écrit
- **WHEN** la note de calcul traite un conduit partagé
- **THEN** le facteur de correction de groupement est appliqué au courant admissible des deux circuits, et écrit

### Requirement: Chute de tension de l'éclairage limitée à 3 %

*Origine : `003-eclairage` FR-019 et FR-020. Critère mesurable : SC-007.*

La chute de tension cumulée DOIT respecter la limite de **3 %** applicable à
l'éclairage, et non les 5 % des autres usages. L'arrivée de 30 m en 16 mm² en consomme déjà
une part : la note de calcul DOIT énoncer l'hypothèse de simultanéité retenue et vérifier le
cumul, plutôt que d'écarter la question au motif qu'un luminaire consomme peu.

Le calcul DOIT s'appuyer sur la longueur du **chemin le plus long** du tracé, que
la maquette fournit, et non sur le métré total de conduit.

#### Scenario: Chute de tension au point le plus éloigné
- **WHEN** la chute de tension cumulée est calculée au point d'éclairage le plus éloigné
- **THEN** elle reste sous 3 %, l'arrivée de 30 m en 16 mm² comprise

### Requirement: Décompte des conducteurs induit par la commande

*Origine : `003-eclairage` FR-033.*

La répartition de la commande a un **effet direct sur le nombre de conducteurs**
du tracé. Deux retours commandés seulement sont nécessaires — celui de CM-01 vers le
plafonnier, celui de CM-03 vers EL-03 — le premier desservant les deux sorties de EL-01, qui
ne comptent que pour un. **EL-02 n'appelle aucun retour commandé** : il est alimenté en
permanence et sa commutation se fait sur place, par le détecteur. La note de calcul DOIT
établir ce décompte et le confronter au taux de remplissage du conduit retenu.

#### Scenario: Établissement du décompte
- **WHEN** la note de calcul établit le nombre de conducteurs du tracé
- **THEN** elle compte deux retours commandés, aucun pour EL-02, et confronte le total au taux de remplissage du conduit retenu

### Requirement: Alimentation permanente de EL-02

*Origine : `003-eclairage` FR-042.*

EL-02 étant commuté sur place, son circuit DOIT être **alimenté en permanence**
jusqu'au détecteur. La conséquence DOIT être signalée au dossier : ce point reste sous tension
lorsque tout le reste de l'éclairage est éteint, et l'intervention sur EL-02 exige la coupure
du circuit d'éclairage, non l'extinction d'un interrupteur.

#### Scenario: Intervention sur EL-02
- **WHEN** une intervention sur EL-02 est engagée
- **THEN** elle exige la coupure du circuit d'éclairage, l'extinction d'un interrupteur ne le mettant pas hors tension

### Requirement: Dimensionnement de la ligne de la borne

*Origine : `004-borne-recharge` FR-014, FR-015, FR-016, FR-017. Principe III de la
constitution. Étendue le 2026-09-24 : la ligne court 7,12 m en goulotte avec les deux autres
circuits (changement `goulotte-paroi-est`).*

Le dimensionnement DOIT prendre en compte la **durée** de la charge : une borne
appelle son courant nominal pendant plusieurs heures d'affilée, sans coefficient de
simultanéité à la baisse comme pour un usage domestique intermittent.

La section des conducteurs DOIT être établie par la note de calcul pour **32 A**, dans la
**catégorie de pose réelle de chaque portion**, et non pour un mode de pose plus favorable. La
ligne en compte deux : 7,12 m de câble en goulotte, avec les prises et l'éclairage, et 3,36 m en
conduit dédié. Sur la portion en goulotte, le courant admissible DOIT retenir la lettre de
sélection d'un câble en goulotte **et** le facteur de groupement des trois circuits.

**Réserve bloquante d'achat** : tant que ce courant admissible n'est pas confirmé sur le texte, la
section de 10 mm² n'est pas démontrée sur la portion en goulotte, et elle pourrait en dépendre. Le
tracé s'applique à la maquette ; le câble et le tube NE DOIVENT PAS être achetés avant.

La chute de tension cumulée DOIT respecter la limite de **5 %** applicable aux
usages autres que l'éclairage, l'arrivée de 30 m en 16 mm² en consommant déjà une part. Le
calcul DOIT s'appuyer sur la longueur du **chemin le plus long** du tracé, que la maquette
fournit.

Le diamètre du conduit DOIT être établi par la note de calcul à partir de la
section **et de la forme** retenues — câble ou conducteurs isolés —, et non décidé d'avance. Il
sera **supérieur à l'IRL 20 des prises**, la section des conducteurs d'un circuit à 32 A étant plus
grande.

*Dérogation du 2026-09-24, décision du maître d'ouvrage* : la forme retenue est un **câble 3G10**,
et la descente CH-B3 reste en **IRL 25**, que ce câble ne tient pas au taux de remplissage. La
dérogation au Principe III est écrite à la note de calcul ; elle DOIT être résorbée avant la
clôture du dossier.

#### Scenario: Charge de quatre heures
- **WHEN** une charge se poursuit pendant au moins quatre heures
- **THEN** elle se déroule sans déclenchement et sans échauffement anormal

#### Scenario: Diamètre déduit de la section
- **WHEN** le diamètre du conduit de la borne est établi
- **THEN** il est déduit de la section et de la forme retenues, et non décidé d'avance

#### Scenario: Portion en goulotte
- **WHEN** le courant admissible de la ligne de la borne est établi
- **THEN** il l'est portion par portion, et sur la goulotte avec la lettre de sélection du câble et le facteur de groupement de trois circuits

#### Scenario: Forme retenue contre le calibre
- **WHEN** la forme retenue ne tient pas le taux de remplissage du conduit arrêté
- **THEN** la dérogation est écrite, datée et motivée, et le dossier ne peut être clos qu'une fois résorbée

#### Scenario: Achat avant confirmation
- **WHEN** le courant admissible en goulotte n'est pas confirmé sur le texte
- **THEN** le câble et le tube de la borne ne sont pas achetés, la réserve étant bloquante

### Requirement: Surintensité de démarrage des moteurs

*Origine : Principe IV de la constitution.*

Le dimensionnement DOIT prendre en compte la **surintensité de démarrage** des
moteurs, et non le seul courant nominal : c'est l'appel à l'amorçage, et non la consommation
moyenne, qui fait déclencher.

#### Scenario: Dimensionnement d'un circuit desservant un moteur
- **WHEN** un circuit desservant un moteur est dimensionné
- **THEN** la surintensité de démarrage est prise en compte, et non le seul courant nominal

### Requirement: Maîtrise de la puissance par restriction d'usage écrite

*Origine : `004-borne-recharge` FR-012, FR-031, FR-032, FR-033, FR-013. Principe IV de la
constitution. Critères mesurables : SC-004, SC-012.*

La maîtrise de la puissance appelée DOIT reposer sur une **restriction d'usage
écrite et assumée**, sans dispositif de modulation ni de délestage, et sans bridage de la
borne, qui reste à 32 A. C'est la seconde des deux voies admises par le Principe IV de la
constitution.

La restriction DOIT être **écrite** et énoncer nommément les usages tenus pour
incompatibles avec une charge en cours. Une restriction non écrite est perdue au premier
changement d'occupant ou d'intervenant, et c'est ce que le Principe IV interdit.

La restriction DOIT être **portée à la connaissance des occupants**, et non
seulement consignée au dossier. Elle ne repose sur aucun dispositif : son efficacité dépend
entièrement de ce que savent les personnes présentes dans l'habitation, dont celles qui
n'auront pas participé à cette décision.

Le dossier DOIT énoncer explicitement **le mode d'usage qui rend la restriction
tenable**, à savoir une charge conduite lorsque l'habitation est au repos. Avec 1,6 kW
disponibles, aucun autre mode ne l'est durablement.

La note de calcul DOIT énoncer l'**hypothèse de simultanéité** sur laquelle elle repose, et
la liste des usages tenus pour incompatibles avec une charge en cours DOIT figurer au dossier
final.

*Bilan à ne pas passer sous silence : la borne retenue est de 32 A, soit environ 7,4 kW, et la
puissance souscrite du branchement est de 9 kVA, soit 39 A pour l'ensemble de l'habitation. La
borne consomme donc à elle seule 82 % de la capacité souscrite, et ne laisse que 7 A — environ
1,6 kW — pour tout le reste de la maison pendant une charge.*

#### Scenario: Liste nominative au dossier
- **WHEN** le dossier final est établi
- **THEN** la liste nominative des usages incompatibles avec une charge en cours y figure, et elle a été portée à la connaissance des occupants

#### Scenario: Charge pendant que l'habitation est au repos
- **WHEN** une charge est conduite alors que l'habitation est au repos
- **THEN** elle se déroule jusqu'à son terme sans déclenchement

### Requirement: Mode de défaillance du dépassement

*Origine : `004-borne-recharge` FR-034 et FR-035. Critère mesurable : SC-005.*

Le dossier DOIT énoncer explicitement **le mode de défaillance** : le dépassement
fait déclencher le **disjoncteur d'abonné**, situé en amont de tout, ce qui coupe
**l'ensemble de l'habitation** et non la seule charge. Le rétablissement exige un réarmement
manuel au tableau principal.

Aucune fonction de reprise automatique de la charge n'est attendue. Après un
déclenchement, le rétablissement est manuel, et la charge reprend lorsque l'alimentation
revient.

#### Scenario: Dépassement de la puissance souscrite
- **WHEN** la puissance souscrite est dépassée pendant une charge
- **THEN** le disjoncteur d'abonné déclenche et coupe l'ensemble de l'habitation, le rétablissement exigeant un réarmement manuel au tableau principal

### Requirement: Repérage du tableau et identification des circuits

*Origine : `002-prises-de-courant` FR-014 ; `004-borne-recharge` FR-025. Critères mesurables :
SC-006, SC-009.*

Chaque point DOIT être rattaché à un circuit identifié, et le repérage du
tableau divisionnaire DOIT permettre de retrouver le circuit desservant un point donné
sans essai par tâtonnement.

Le circuit de la borne DOIT être **repéré au tableau divisionnaire** de façon
distincte.

#### Scenario: Recherche d'un circuit par un tiers
- **WHEN** un tiers non familier de l'installation cherche le circuit desservant un point donné
- **THEN** il le retrouve en moins de 30 secondes au repérage du tableau, sans essai par tâtonnement

### Requirement: Déverrouillage manuel indépendant de l'alimentation

*Origine : `002-prises-de-courant` FR-015. Exigence critique par l'effet de FR-020.*

La coupure du circuit desservant les points, quelle qu'en soit la cause,
NE DOIT PAS empêcher le déverrouillage manuel de la porte sectionnelle.

#### Scenario: Circuit des prises coupé
- **WHEN** le circuit des prises est coupé, quelle qu'en soit la cause
- **THEN** le déverrouillage manuel de la porte sectionnelle reste possible

### Requirement: Implantation et encombrement du tableau divisionnaire

*Origine : `002-prises-de-courant` FR-051 et FR-052.*

L'implantation des cinq points et de leurs cheminements DOIT partir du tableau à
sa position relevée — paroi est, entre 0 et 1,30 m de l'angle sud-est. Le tableau n'est donc
pas un point libre du tracé, et la longueur du chemin le plus long s'en déduit.

La bande disponible faisant 1,30 m, l'encombrement du tableau et de sa réserve de
modules DOIT être vérifié comme compatible avec cette largeur, porte ouverte comprise, et
sans empiéter sur le débattement du vantail de la porte de service.

#### Scenario: Encombrement du tableau
- **WHEN** l'encombrement du tableau et de sa réserve de modules est contrôlé
- **THEN** il tient dans la bande de 1,30 m, porte ouverte comprise, sans empiéter sur le débattement du vantail

### Requirement: Essais avant mise sous tension

*Origine : `004-borne-recharge` FR-026 et FR-027 ; Principe V de la constitution.
Critère mesurable : SC-006.*

Les essais exigés par le Principe V DOIVENT inclure, pour le circuit de la borne, l'essai de
déclenchement de son propre différentiel.

La consignation nécessaire pour intervenir sur BR-01 DOIT être documentée : le
ou les organes à ouvrir, et la vérification d'absence de tension.

Avant toute mise sous tension, les vérifications suivantes DOIVENT être exécutées et leurs
résultats consignés par écrit : continuité des conducteurs de protection, mesure de la
résistance de terre, mesure d'isolement, test de déclenchement de chaque différentiel,
contrôle du serrage des connexions et vérification de la concordance entre le repérage du
tableau et la réalité des circuits. Un essai non consigné est réputé non fait.

#### Scenario: Essai du différentiel de la borne
- **WHEN** l'essai de déclenchement du différentiel de la borne est conduit
- **THEN** il interrompt la charge, et son résultat est consigné par écrit

#### Scenario: Essai non consigné
- **WHEN** un essai est exécuté sans être consigné par écrit
- **THEN** il est réputé non fait
