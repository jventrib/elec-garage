<!--
SYNC IMPACT REPORT
==================
Version change: 1.2.0 → 1.3.0
Rationale: MINEUR. Ajout d'une sous-section de contraintes fixant le mode de pose, et
extension matérielle de deux principes existants pour en tirer les conséquences. Les parois
étant en béton non isolé, la pose est apparente : le mode de pose cesse d'être un choix de
conception pour devenir une donnée d'entrée. Aucun principe supprimé ni redéfini de façon
incompatible.

Principes modifiés :
  - III. Dimensionnement calculé et justifié → le mode de pose devient une donnée figée et
    non un choix ; obligation d'appliquer les facteurs de correction du groupement en
    conduit et de la température ambiante, et de respecter le taux de remplissage des tubes.
  - VI. Visualisation 3D navigateur, livrable de conception et guide de montage → la pose
    étant apparente, conduits et boîtes deviennent des objets à représenter à leur tracé
    réel, et non des liaisons abstraites entre deux points.

Sections ajoutées :
  - Contraintes du Site et de l'Installation → « Mode de pose imposé »

Sections modifiées :
  - Contraintes du Site et de l'Installation → « Géométrie du local » : nature des parois
    (béton non isolé) consignée comme donnée d'entrée.
  - Contraintes du Site et de l'Installation → « Livrable numérique » : conduits et boîtes
    représentés avec leur encombrement.

Sections supprimées : aucune

Deferred TODOs (doivent être résolus avant la note de calcul) :
  - TODO(PROTECTION_AMONT) : calibre et type du dispositif de protection en amont du 3G16
  - TODO(LONGUEUR_ALIMENTATION) : longueur réelle du câble 3G16 (requise pour la chute de tension)
  - TODO(REGIME_NEUTRE) : régime de neutre et statut du garage (accolé ou bâtiment séparé)
  - TODO(PUISSANCE_BORNE) : puissance cible de la borne de recharge
  - TODO(PUISSANCE_SOUSCRITE) : puissance souscrite du branchement et besoin de délestage
  - TODO(RAIL_PORTE_SECTIONNELLE) : hauteur de passage de la porte sectionnelle et hauteur
    libre sous le rail du tablier ouvert
  - TODO(CONDUIT_EXTERIEUR) : référence de conduit et de boîtes retenue pour les parcours
    extérieurs, l'IRL d'intérieur n'étant pas présumé qualifié pour l'exposition directe

Interprétations du relevé, à infirmer si elles sont fausses :
  - Les 0,40 m de la porte sectionnelle et les 1,30 m de la porte de service sont lus en
    œuvre intérieure, non depuis les angles extérieurs.
  - Les 1,30 m visent le bord sud de la porte de service, non son axe.
--> Électricité Garage 5,60 m Constitution

## Core Principles

### I. Conformité NF C 15-100 (NON-NÉGOCIABLE)

Toute décision de conception, de matériel et de pose DOIT être conforme à la norme
NF C 15-100 en vigueur, amendements inclus (notamment la partie 7-722 relative à
l'alimentation des véhicules électriques). Chaque exigence retenue DOIT être rattachée à
la clause normative qui la justifie ; une règle citée sans référence n'est pas opposable et
DOIT être vérifiée avant d'être appliquée. En cas de conflit entre une pratique courante et
la norme, la norme l'emporte.

Rationale : l'installation est destinée à être utilisée, assurée et potentiellement
contrôlée (Consuel, revente, sinistre). La conformité n'est pas une préférence de
conception, c'est la condition d'existence du projet.

### II. Sécurité des personnes et protection différentielle (NON-NÉGOCIABLE)

Aucun circuit ne DOIT être laissé sans protection contre les contacts indirects. Les règles
suivantes sont non négociables :

- Tous les circuits DOIVENT être protégés par un dispositif différentiel résiduel de
  sensibilité 30 mA au maximum.
- La mise à la terre DOIT être continue et vérifiée, du conducteur PE du 3G16 jusqu'à
  chaque point d'utilisation.
- Les liaisons équipotentielles DOIVENT être établies sur tous les éléments conducteurs
  accessibles concernés.
- Tout matériel DOIT présenter un indice de protection adapté à l'ambiance du local
  (poussière, humidité, projections, chocs) et à sa hauteur d'installation.

Rationale : un garage cumule sol conducteur, humidité, poussière et outillage portatif.
C'est un environnement plus sévère qu'une pièce d'habitation sèche.

### III. Dimensionnement calculé et justifié

Aucune section de conducteur, aucun calibre de protection et aucun nombre de points par
circuit ne DOIT être retenu sans calcul ou sans référence explicite au tableau normatif
correspondant. Chaque circuit DOIT être documenté avec : le courant d'emploi retenu, le
mode de pose, le courant admissible du conducteur, le calibre de protection, la longueur et
la chute de tension calculée. Les limites de chute de tension DOIVENT être respectées
(3 % pour l'éclairage, 5 % pour les autres usages) en cumulant l'alimentation et le circuit
terminal. La valeur « habituelle » ou « ce qui se fait » n'est pas une justification
recevable.

Le mode de pose étant figé par les contraintes du site — conduits IRL en apparent — il est
une **donnée d'entrée du calcul et non une variable d'ajustement**. Il en découle trois
obligations :

- Le courant admissible DOIT être déterminé pour ce mode de pose précisément, et non pour un
  mode plus favorable.
- Les facteurs de correction applicables DOIVENT être appliqués et écrits, en particulier
  celui du groupement de plusieurs circuits dans un même conduit et celui de la température
  ambiante retenue pour le local.
- Le nombre de conducteurs par conduit DOIT respecter le taux de remplissage admissible.
  Saturer un conduit est une faute de dimensionnement autant qu'une faute de pose.

Rationale : les erreurs de dimensionnement ne se voient pas à la mise en service. Elles se
révèlent en échauffement, en déclenchements intempestifs ou en incendie. Un conduit apparent
et chargé de plusieurs circuits dissipe moins bien qu'on ne le suppose : c'est précisément le
cas où la valeur « habituelle » trompe.

### IV. Circuit de recharge dédié et indépendant

La borne de recharge DOIT disposer d'un circuit entièrement dédié, sans aucun autre point
d'utilisation raccordé. Ce circuit DOIT posséder sa propre protection contre les
surintensités et sa propre protection différentielle, distinctes de celles des autres
circuits du garage. La détection du courant continu de défaut DOIT être assurée, soit par
un différentiel de type B, soit par un différentiel de type A associé à un dispositif de
détection de courant continu résiduel de 6 mA intégré à la borne et documenté comme tel.
La borne DOIT être posée par un intervenant disposant de la qualification IRVE requise pour
la puissance retenue, et les travaux DOIVENT être tracés à ce titre.

Rationale : la recharge est une charge longue durée, à courant élevé et quasi permanent.
Elle ne se comporte pas comme une prise ordinaire et ne DOIT jamais partager son circuit.

### V. Documentation avant travaux, vérification avant mise sous tension

Aucun percement, aucun tirage de câble et aucun raccordement ne DOIT commencer avant que le
schéma unifilaire, le plan d'implantation, la note de calcul et la maquette 3D soient
établis et validés. Avant toute mise sous tension, les vérifications suivantes DOIVENT être
exécutées et leurs résultats consignés par écrit : continuité des conducteurs de protection,
mesure de la résistance de terre, mesure d'isolement, test de déclenchement de chaque
différentiel, contrôle du serrage des connexions et vérification de la concordance entre le
repérage du tableau et la réalité des circuits. Un essai non consigné est réputé non fait.

Rationale : une installation non documentée est une installation non maintenable et non
contrôlable. Le dossier est un livrable du projet, au même titre que le câblage.

### VI. Visualisation 3D navigateur, livrable de conception et guide de montage

Le livrable de conception du projet prend la forme d'une visualisation 3D interactive du
garage, consultable dans un navigateur web, qui sert également de guide de montage à
l'installateur. Les règles suivantes s'appliquent :

- La maquette DOIT représenter le garage à l'échelle et respecter les dimensions réelles
  relevées. Aucune liberté n'est admise sur les positions, les hauteurs et les
  encombrements : une cote inconnue DOIT apparaître comme inconnue, jamais comme une valeur
  plausible inventée.
- Tout point d'utilisation retenu par la spécification (socle, luminaire, commande, borne,
  tableau, cheminement) DOIT être présent dans la maquette et DOIT y porter son identité :
  circuit de rattachement, hauteur d'axe et indice de protection consultables depuis la
  visualisation.
- Les obstacles qui contraignent l'implantation DOIVENT être modélisés, en particulier le
  débattement du vantail de la porte de service et la position du tablier et du rail de la
  porte sectionnelle en position ouverte.
- La pose étant apparente, un cheminement n'est pas une liaison abstraite entre deux points :
  c'est un objet posé sur la paroi. Les conduits et les boîtes de dérivation DOIVENT être
  représentés à leur tracé et à leur position réels, avec leur encombrement, et non figurés
  par un trait joignant deux composants. Une boîte de dérivation est un composant de plein
  droit, avec sa référence, sa position et son indice de protection.
- La maquette est une représentation, non la source normative. En cas de divergence avec la
  note de calcul ou le schéma unifilaire, ces derniers l'emportent et la maquette DOIT être
  corrigée avant la clôture de l'étape en cours.
- La visualisation DOIT rester consultable sans dépendance à un service tiers en ligne et
  sans autre installation qu'un navigateur récent.

La maquette DOIT en outre se parcourir comme une notice de montage :

- La visualisation DOIT proposer une lecture par étapes. À chaque étape, l'installateur DOIT
  disposer de l'instruction écrite et de son illustration dans la vue 3D, sans avoir à
  ouvrir un autre document pour savoir quoi poser, où et avec quoi.
- La séquence DOIT suivre l'ordre de pose réel du chantier, et non l'ordre de la
  nomenclature ni l'ordre de numérotation des points.
- La navigation DOIT être réversible : avancer et reculer d'une étape à l'autre, à tout
  moment, sans perte d'état et sans reprise depuis le début.
- Une étape DOIT montrer l'état de l'installation à son issue et distinguer visuellement ce
  qu'elle ajoute de ce qui était déjà en place.
- Les vérifications exigées par le Principe V DOIVENT figurer dans la séquence au même titre
  que les étapes de pose. Un essai n'est pas un appendice de la notice, c'est une étape.
- La consignation et sa levée DOIVENT être des étapes explicites. Aucune étape ne DOIT
  illustrer, même implicitement, un travail effectué sous tension qui ne le serait pas en
  réalité.

Rationale : l'implantation d'un garage est un problème spatial avant d'être un problème
électrique. Les collisions qui comptent — un vantail devant un socle, une fiche dans la
trajectoire du tablier, une hauteur d'axe inatteignable — sont invisibles sur un plan en
deux dimensions et évidentes en volume. La maquette permet de vérifier les scénarios
d'acceptation avant le premier percement, quand la correction est encore gratuite. La
lecture par étapes prolonge ce bénéfice jusqu'au chantier : elle transforme un dossier que
l'installateur devrait interpréter en une séquence qu'il n'a qu'à suivre, et elle rend
visible l'ordre des opérations, qui est précisément ce qu'un schéma ne dit pas.

## Contraintes du Site et de l'Installation

**Géométrie du local**

Convention d'orientation : le local est décrit en vue en plan, nord en haut et est à droite.
La façade portant la porte sectionnelle est la paroi sud ; la paroi dite « de droite » est la
paroi est. Toute cote ci-dessous est donnée en œuvre intérieure, sauf mention contraire.

- Œuvre intérieure : carré de 5,60 m × 5,60 m, soit environ 31,4 m² au sol.
- Parois en parpaings de 0,20 m d'épaisseur, d'où une emprise au sol extérieure de
  6,00 m × 6,00 m.
- Parois en béton, **non isolées** et laissées brutes. Aucun doublage, aucun vide technique,
  aucune cloison susceptible de recevoir un encastrement. C'est cette donnée qui impose le
  mode de pose ci-dessous.
- Hauteur sous plafond intérieure : 2,75 m.
- Accès véhicule : porte sectionnelle sur la paroi sud, 5,00 m de largeur de baie,
  excentrée. Elle laisse 0,40 m de trumeau du côté est et 0,20 m du côté ouest.
  L'implantation DOIT tenir compte du débattement et du rail du tablier en position ouverte,
  qui occupe le plafond.
- Le trumeau ouest de 0,20 m correspond à la largeur d'un parpaing. Aucun appareillage ne
  DOIT y être implanté sans vérification préalable de la faisabilité de la pose et du
  passage de gaine.
- Accès piéton : porte de service sur la paroi est, 1,10 m de largeur et 2,50 m de hauteur,
  son bord sud situé à 1,30 m de l'angle sud-est. Les commandes d'éclairage DOIVENT être
  atteignables depuis cet accès.

**Mode de pose imposé**

Les parois étant en béton non isolé et sans vide technique, l'installation est posée **en
apparent**. Ce mode de pose est une donnée d'entrée du projet, non un choix de conception.

- Les conducteurs DOIVENT cheminer en **conduits IRL** fixés en saillie sur les parois et au
  plafond. Aucune saignée, aucun encastrement et aucune pose sous enduit ne DOIT être
  pratiqué dans le béton. Tout scénario l'exigeant DOIT être signalé comme un changement de
  périmètre explicite.
- Une **boîte de dérivation** DOIT être posée à chaque intersection de parcours, à chaque
  dérivation et à chaque changement de direction qui ne se traite pas par un accessoire de
  conduit.
- **Toute connexion DOIT se faire dans une boîte**, jamais dans un conduit ni derrière un
  appareil. Aucune boîte NE DOIT être rendue inaccessible ou indémontable par les travaux :
  une connexion que l'on ne peut plus atteindre est une connexion que l'on ne peut plus
  vérifier.
- Les socles de prise, les commandes et les appareils DOIVENT être posés **en saillie**, sur
  boîtier apparent.
- Les parcours DOIVENT être orthogonaux, horizontaux ou verticaux, et leur tracé DOIT être
  arrêté sur plan avant tout percement. Un parcours en diagonale ou improvisé est refusé.
- Les tracés DOIVENT éviter les zones exposées aux chocs : gabarit de manœuvre du véhicule,
  débattement des ouvrants, trajectoire du tablier et du rail de la porte sectionnelle. Un
  conduit posé en apparent est vulnérable là où un conduit encastré ne l'était pas.
- La fixation DOIT être adaptée au support béton, et la nature des chevilles retenues DOIT
  figurer à la nomenclature.
- Les traversées de paroi, qui font 0,20 m de béton, DOIVENT être étanches et présenter une
  pente vers l'extérieur, afin qu'aucune eau ne puisse cheminer vers l'intérieur.
- Une paroi en béton non isolée est une paroi froide : la **condensation en surface DOIT être
  tenue pour probable**. Le matériel retenu DOIT l'admettre, et les boîtiers DOIVENT être
  orientés et percés de façon à ne pas retenir l'eau.
- Les parcours et boîtiers **extérieurs** DOIVENT employer un conduit et des boîtes tenant
  l'exposition directe aux ultraviolets et aux intempéries. L'IRL retenu à l'intérieur
  N'EST PAS présumé qualifié pour cet emploi ; le choix DOIT être justifié par les
  caractéristiques déclarées du produit — voir TODO(CONDUIT_EXTERIEUR).

Rationale : le mode de pose n'est pas une préférence esthétique. Il fixe le courant
admissible des conducteurs, donc le dimensionnement ; il détermine l'exposition mécanique du
matériel ; et il rend le cheminement visible, donc opposable. Une installation apparente se
contrôle à l'œil, ce qui est un avantage — à condition que son tracé ait été décidé et non
subi.

**Alimentation existante**

- Arrivée en câble 3G16 : phase, neutre et conducteur de protection, section 16 mm².
  Réseau monophasé 230 V.
- Cette arrivée est une donnée d'entrée figée. Le projet DOIT s'y adapter ; tout scénario
  exigeant son remplacement DOIT être signalé comme un changement de périmètre explicite et
  non absorbé silencieusement.
- Le garage DOIT être équipé d'un tableau divisionnaire propre, comportant un dispositif de
  coupure d'urgence accessible, une réserve d'au moins 20 % de modules libres et un
  repérage durable de chaque circuit.

**Usages à couvrir**

- Prises de courant.
- Éclairage.
- Borne de recharge pour véhicule électrique.

La répartition détaillée des circuits, le nombre de points et leur implantation relèvent de
la spécification et non de la présente constitution.

**Livrable numérique**

- La visualisation 3D DOIT s'exécuter côté navigateur. Aucun serveur applicatif ni compte
  utilisateur ne DOIT être nécessaire pour la consulter.
- L'unité de la maquette est le mètre. L'origine du repère est l'angle sud-ouest de l'œuvre
  intérieure, au niveau du sol fini : x croissant vers l'est de 0 à 5,60 ; y croissant vers
  le nord de 0 à 5,60 ; z croissant vers le haut de 0 à 2,75. Cette convention DOIT être
  respectée partout, dans le relevé comme dans le code.
- Dans ce repère, les baies se situent en : porte sectionnelle, paroi sud (y = 0),
  x de 0,20 à 5,20 ; porte de service, paroi est (x = 5,60), y de 1,30 à 2,40 et z de 0 à
  2,50. Ces valeurs sont dérivées du relevé ci-dessus et n'en constituent pas une seconde
  source : en cas d'écart, le relevé en œuvre l'emporte.
- La géométrie du local et la liste des points d'utilisation DOIVENT provenir d'une source
  de données unique, lisible et modifiable sans recompilation mentale du reste du projet.
  Une cote ne DOIT pas être répétée à plusieurs endroits du code.
- Le choix de la bibliothèque de rendu relève de la phase de planification et non de la
  constitution. Aucune technologie n'est imposée ici ; les contraintes ci-dessus le sont.
- La maquette DOIT distinguer visuellement les circuits les uns des autres, afin qu'un
  circuit puisse être suivi du tableau jusqu'à son dernier point. La pose étant apparente,
  ce suivi DOIT se lire sur le tracé réel des conduits et non sur une liaison schématique.
- La séquence d'étapes DOIT être une donnée et non du code. Ajouter, retirer ou réordonner
  une étape NE DOIT PAS exiger de modifier la logique de rendu ou de navigation.
- La maquette et son lecteur d'étapes constituent un socle commun à toutes les
  fonctionnalités électriques du projet (prises, éclairage, borne de recharge). Ils NE
  DOIVENT être la propriété d'aucune d'entre elles, et chaque fonctionnalité électrique y
  apporte ses points d'utilisation et ses étapes de montage.

**Points ouverts bloquants**

Les éléments suivants DOIVENT être renseignés avant la phase de planification ; aucun calcul
définitif n'est possible tant qu'ils restent inconnus :

- TODO(PROTECTION_AMONT) : calibre et type du dispositif de protection situé en amont du
  câble 3G16.
- TODO(LONGUEUR_ALIMENTATION) : longueur réelle de l'arrivée 3G16, nécessaire au calcul de
  la chute de tension cumulée.
- TODO(REGIME_NEUTRE) : régime de neutre applicable et statut du garage (accolé au bâtiment
  principal ou bâtiment séparé), qui conditionne le traitement de la terre.
- TODO(PUISSANCE_BORNE) : puissance cible de la borne de recharge. En monophasé, le palier
  supérieur usuel est 7,4 kW ; au-delà, un passage en triphasé serait nécessaire et sortirait
  du périmètre de l'arrivée existante.
- TODO(PUISSANCE_SOUSCRITE) : puissance souscrite du branchement, afin de déterminer si un
  dispositif de délestage ou de modulation de la charge est requis.
- TODO(RAIL_PORTE_SECTIONNELLE) : hauteur de passage de la porte sectionnelle, et hauteur
  libre résiduelle sous le rail du tablier en position ouverte. La hauteur sous plafond
  (2,75 m) est désormais connue, mais le socle de plafond destiné au moteur ne peut pas être
  positionné tant que l'encombrement du rail ne l'est pas.

## Processus de Conception et de Réalisation

Le projet progresse par étapes verrouillées. Une étape ne DOIT pas démarrer tant que la
précédente n'est pas close.

1. **Relevé et hypothèses** — Constater l'existant et lever les points ouverts ci-dessus.
   Toute hypothèse retenue faute de mesure DOIT être écrite et marquée comme hypothèse.
2. **Spécification des besoins** — Recenser les usages, les points d'utilisation et les
   contraintes d'implantation, sans choisir de matériel.
3. **Note de calcul** — Bilan de puissance, choix des sections, calibres de protection,
   sélectivité et chutes de tension. Cette note est le justificatif du Principe III.
4. **Schéma unifilaire, plan d'implantation et maquette 3D** — Le schéma DOIT refléter la
   note de calcul, et la maquette DOIT refléter le schéma. Toute divergence entre ces
   documents bloque l'étape suivante.
5. **Nomenclature de matériel** — Chaque référence DOIT être rattachée au circuit qu'elle
   sert et à la caractéristique normative qui la rend acceptable.
6. **Réalisation** — Pose conforme au schéma validé et à la maquette validée, conduite en
   suivant la séquence d'étapes. Tout écart constaté sur le terrain DOIT être reporté dans le
   schéma et dans la maquette avant la mise sous tension, jamais après.
7. **Vérification et mise en service** — Exécution et consignation des essais du Principe V.
8. **Dossier final** — Schéma tel que construit, note de calcul, nomenclature, maquette 3D
   à jour et procès-verbal d'essais réunis et conservés.

**Portes de qualité**

- Un circuit sans calcul associé ne passe pas l'étape 4.
- Un point d'utilisation absent de la maquette 3D, ou présent sans circuit de rattachement,
  ne passe pas l'étape 4.
- Une étape de montage dépourvue d'instruction écrite, ou dont l'illustration ne correspond
  pas à l'instruction, ne passe pas l'étape 4.
- Un matériel sans indice de protection justifié ne passe pas l'étape 5.
- Un essai non consigné ne passe pas l'étape 7.
- Une maquette divergeant du réalisé ne passe pas l'étape 8.

## Governance

Cette constitution prévaut sur toute habitude de chantier, toute préférence personnelle et
toute suggestion d'outil ou d'assistant. Lorsqu'une proposition entre en conflit avec un
principe, c'est la proposition qui est modifiée.

**Procédure d'amendement**

Tout amendement DOIT être proposé par écrit, énoncer le principe ou la section touchée,
justifier le changement et préciser ses conséquences sur les documents déjà produits (note
de calcul, schéma, nomenclature, maquette 3D). Un amendement adopté après le début de la
réalisation DOIT s'accompagner d'un plan de reprise des travaux déjà exécutés.

**Politique de versionnement**

Le versionnement suit la sémantique MAJEUR.MINEUR.CORRECTIF :

- MAJEUR : suppression d'un principe, ou redéfinition rendant non conforme un choix
  antérieurement validé.
- MINEUR : ajout d'un principe ou d'une section, ou extension matérielle d'une règle
  existante.
- CORRECTIF : clarification de rédaction, correction de formulation, précision sans effet
  sur le fond.

**Contrôle de conformité**

Chaque porte de qualité du processus de réalisation DOIT vérifier explicitement le respect
des six principes. Les principes I, II et IV ne souffrent aucune dérogation. Une dérogation
aux principes III, V ou VI DOIT être écrite, motivée, datée et résorbée avant la clôture du
dossier final ; une dérogation non résorbée interdit la clôture du projet.

**Version**: 1.3.0 | **Ratified**: 2026-09-21 | **Last Amended**: 2026-09-21
