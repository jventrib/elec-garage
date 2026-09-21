<!--
SYNC IMPACT REPORT
==================
Version change: 1.14.0 → 1.15.0
Rationale: MINEUR — « extension matérielle d'une règle existante ». La deuxième des six
conditions de l'exception de goulotte exigeait que toute connexion abritée par un profilé soit
faite dans un **organe de connexion à enveloppe propre** : la goulotte « abrite » la connexion,
elle ne l'« enveloppe » pas. Cette exigence est **retirée**. Les connexions sont **admises dans la
goulotte**, comme dans une boîte.

Origine : décision du maître d'ouvrage du 2026-09-24, prise à l'étude de la goulotte GL-02
(changement `goulotte-paroi-est`), dont l'organe OC-02 aurait seul fixé la section.

**Ce qui motive le retrait.** La condition 2 **n'était rattachée à aucune clause** — le défaut que
les amendements v1.12.0 et v1.14.0 ont déjà corrigé ailleurs. Et les sources consultées le
2026-09-24 attribuent à la NF C 15-100 une exigence moindre : les dispositifs de connexion peuvent
se placer dans les goulottes « lorsque leurs dimensions intérieures le permettent », les épissures
étant interdites ; ils doivent rester accessibles (§ 526.3) ; et lorsque le couvercle se démonte
sans outil, ils ne sont admis que s'ils présentent au moins le degré **IP2X ou IPXXB, conducteurs en
place** (§ 529.3). *Ces références sont relevées sur des sources secondaires, non sur le texte :
elles DOIVENT y être confirmées (Principe I).*

**Ce qui remplace la condition.** Chaque connexion abritée est faite dans la goulotte par un
**dispositif de connexion**, sans épissure, dans un volume intérieur qui le permet ; si le capot se
dépose sans outil, le dispositif présente au moins IP2X ou IPXXB, conducteurs en place. Les
conditions 1 et 3 à 6 sont inchangées : capot déposable, **repère lisible sans déposer le capot**
et emplacements énumérés au dossier, pas de rétention d'eau, pose hors chocs, remplissage justifié
sur la fiche produit. Le terme d'**organe de connexion** désigne désormais le **groupe de
connexions** repéré dans la goulotte, et non une enveloppe.

**Portée.** L'amendement **autorise** une forme, il n'en impose aucune : un organe à enveloppe
propre, une boîte, un conduit restent conformes. Rien de ce qui a été validé ne devient non
conforme — d'où MINEUR. Aucun **plan de reprise** n'est requis : la réalisation n'a pas commencé.

**Conséquences sur les documents.** La spec `installation/cheminements` (« Toute connexion dans
une boîte », « Typologie des enveloppes de cheminement », « Organe de connexion à enveloppe
propre », les six conditions) ; les apports `002` et `005`, dont OC-01 et OC-02 perdent un volume
qui n'était la cote d'aucun produit ; les instructions de connexion ; les réserves du maître
d'ouvrage.

Version change (antérieur): 1.13.0 → 1.14.0
Rationale: MINEUR — « extension matérielle d'une règle existante ». Le Principe IV étendait la
dédicace du circuit de recharge à son **conduit** : la ligne de la borne devait emprunter son
propre conduit sur tout son parcours, sans cohabiter avec un autre circuit. Cette extension est
**retirée**. La dédicace du circuit reste entière et n'est pas touchée.

Origine : décision du maître d'ouvrage du 2026-09-22. Le câble de la borne peut cohabiter avec
d'autres circuits dans une goulotte.

**Deux constats motivent le retrait, et le second est le plus gênant.**

D'abord, la règle **n'était rattachée à aucune clause**. Les « trois conséquences » qu'elle
énonçait en découlaient, elles ne la fondaient pas. Le Principe I dit qu'une règle citée sans
référence n'est pas opposable et DOIT être vérifiée avant d'être appliquée : la dédicace du
conduit ne l'avait jamais été. C'est le même défaut de forme que l'amendement v1.12.0 a corrigé
sur l'énumération des montages 6 mA — une exigence juste sur le fond, présentée dans une forme
qui la rendait inopposable.

Ensuite, **le tracé arrêté la contredisait déjà**. Entre la fin de CH-B1 à z = 2,60 et le départ
de CH-B2 à z = 2,64, la ligne de la borne franchit 0,04 m sans aucun conduit : le volume de la
goulotte GL-01 assurait tacitement le passage. La règle décrivait une intention, pas les cotes,
et personne ne l'avait confrontée au relevé.

**Ce qui est retiré, et ce qui le remplace.** La dédicace ne s'étend plus au contenant. Le câble
de la borne PEUT cohabiter dans un profilé de goulotte, à deux conditions : qu'il y soit un
**câble à enveloppe propre** et non des conducteurs isolés nus, et qu'il y **transite sans être
coupé**. Là où la ligne emprunte un **conduit**, celui-ci lui reste dédié — un conduit n'offre
pas d'enveloppe propre par conducteur, et y mêler deux circuits reviendrait à la situation que
la première condition écarte.

**Les trois conséquences, reprises une à une.** Le facteur de correction de groupement redevient
exigible sur les portions de cohabitation, et DOIT y être appliqué et écrit ; l'exemption ne
vaut plus que sur les portions restées en conduit dédié. Le calibre propre et les parcours
parallèles ne valent, de même, que là où la ligne reste en conduit dédié.

**Deux valeurs normatives s'ajoutent à celles qui restent à confirmer** : la clause qui
fonderait — ou non — une exigence de contenant dédié pour un point de charge, et la catégorie de
pose d'un câble en goulotte, qui décide de son courant admissible. Aucune des deux NE DOIT être
renseignée de mémoire.

**Portée.** L'amendement **autorise** une cohabitation, il ne l'impose pas. Un conduit dédié sur
tout le parcours reste conforme, et rien de ce qui a été validé ne devient non conforme — c'est
ce qui range le changement en MINEUR et non en MAJEUR. Aucun **plan de reprise** n'est requis :
la réalisation n'a pas commencé.

Version change (antérieur): 1.12.1 → 1.13.0
Rationale: MINEUR — « extension matérielle d'une règle existante ». Le **Mode de pose imposé**
exigeait des conduits IRL et que toute connexion se fasse dans une boîte. Il admet désormais, par
exception et à six conditions cumulatives, qu'un **profilé de goulotte à capot démontable** tienne
lieu de conduit sur un parcours donné et y abrite des connexions. Aucun des six principes n'est
modifié.

C'est la même correction de visée que l'amendement v1.8.0, qui avait admis le repiquage : la règle
d'origine visait juste et nommait une **forme** — un tube, une boîte — là où l'objectif est que les
conducteurs soient protégés, que les connexions restent atteignables, identifiables et vérifiables,
et qu'aucune ne soit noyée. Une goulotte à capot démontable satisfait ces objectifs, et satisfait
même mieux que le conduit le second d'entre eux : on y accède sans rien déposer d'autre.

Origine : décision du maître d'ouvrage du 2026-09-22, question Q2 de `005-automatisation-locale`.
La proposition écrite, ses six conditions et l'analyse de l'objet réel sont conservées dans
`dossier/005-automatisation-locale/amendement-mode-de-pose.md`.

**Portée** : l'amendement **autorise** une forme, il n'en **impose** aucune. Il vaut donc pour
l'ensemble du projet et **ne rouvre aucun tracé arrêté** — les circuits des prises, de l'éclairage
et de la borne restent conformes en conduit IRL, et rien ne leur a été refusé qui serait accordé
ici. Aucun **plan de reprise** n'est requis : la réalisation n'a pas commencé, aucun percement ni
aucun conduit n'est posé. L'amendement est gratuit aujourd'hui ; il ne l'aurait plus été après le
premier mètre de tube.

**Deux conséquences que l'amendement ne masque pas.** D'abord, le mode de pose fixe le courant
admissible : la catégorie B1 est celle des conducteurs isolés **en conduit**, et un tronçon en
goulotte relève d'une autre lettre de sélection. Deux valeurs normatives s'ajoutent donc à celles
qui restent à confirmer — la lettre applicable, et le seuil en deçà duquel une portion courte peut
être négligée. Ensuite, la règle du tiers `D ≥ d·√(3n)` est écrite pour une section circulaire et
ne se transpose pas telle quelle : la condition 6 renvoie aux caractéristiques déclarées du produit.

Version change (antérieur): 1.12.0 → 1.12.1
Rationale: CORRECTIF. Report d'une cote relevée, sur le modèle de l'amendement v1.6.1 qui avait
reporté celles du rail. La **sous-face du tablier de la porte sectionnelle en position ouverte**
a été mesurée le 2026-09-22 : **2,31 m**. Elle était jusqu'ici la seule des trois bornes du
majorant à être déduite d'autre chose qu'elle-même — de la hauteur de passage de 2,10 m, qui ne
dit que « au-dessus de », non « à ».

Aucun principe n'est modifié, aucune règle ajoutée. Le majorant se resserre de 0,21 m en
altitude, et c'est un resserrement au sens strict : tout ce qui était prouvé dégagé le reste. Le
seul contrôle de collision encore sans conclusion sur un obstacle de volume connu — le conduit
qui longe la façade sud à 2,22 m pour rejoindre le point extérieur d'éclairage — passe à
**conforme**, le conduit courant désormais 0,09 m sous le majorant.

TODO(TABLIER_OUVERT) cesse d'être opposable en position **ouverte** et se réduit à la position
**fermée**, où rien dans le relevé ne borne encore la saillie du panneau vers l'intérieur.

Ce que ce correctif illustre, et qui valait d'être écrit : la cote pressentie dans
`dossier/003-eclairage/data-model.md` était **exactement** 2,31 m. Elle y avait été délibérément
laissée non écrite, parce qu'une valeur plausible qui se vérifie après coup reste une valeur
inventée au moment où on l'écrit — et le contrôle serait passé au vert sans rien démontrer.

Version change (antérieur): 1.11.0 → 1.12.0
Rationale: MINEUR, et correctif. Le Principe IV énonçait la détection du courant continu de
défaut sous la forme d'une **énumération fermée** — « soit un type B, soit un type A associé à
une détection 6 mA intégrée à la borne » — sans référence de clause. Présentée comme exhaustive,
elle excluait des solutions qui ne le sont pas, et elle plaçait le dispositif 6 mA
obligatoirement **dans la borne**, ce qui n'est qu'une des implantations possibles.

Le défaut n'est pas dans l'exigence, qui reste entière : c'est la détection du courant continu
qui est non négociable. Il est dans la **forme** — une liste fermée, sans source, appliquée comme
si elle était le texte. C'est précisément ce que le Principe I reproche ailleurs à un chiffre
renseigné de mémoire.

L'amendement énonce donc l'**exigence** et marque l'énumération comme **non exhaustive et à
confirmer sur le texte**. Il n'ajoute aucun type nouveau au titre d'une source secondaire : la
recherche du 2026-09-22 est consignée dans `dossier/004-borne-recharge/research.md` avec ses
sources, et reste à confirmer.

Version change (antérieur): 1.10.0 → 1.11.0
Rationale: MINEUR. Le Principe IV étendait la dédicace de la ligne de la borne au **conduit**,
et ne disait rien de la **boîte de dérivation**. La question s'est posée le 2026-09-22 : le
maître d'ouvrage a décidé de faire transiter la ligne de la borne par BD-01, boîte déjà partagée
entre les prises et l'éclairage, en la portant à six entrées.

Le silence n'est pas une permission, et il ne l'est jamais moins que sur un principe de sécurité.
L'amendement tranche donc explicitement : la dédicace **ne s'étend pas** à la boîte, mais la
traversée d'une boîte partagée est admise sous **quatre conditions cumulatives**, dont la plus
importante est qu'aucune connexion du circuit de la borne n'y soit faite — une boîte partagée
peut être *traversée*, jamais servir de *jonction* à la borne.

Le motif de la dédicace du conduit est thermique et spatial — facteur de groupement, diamètre,
parcours parallèles — et aucun de ces trois motifs ne porte sur une boîte, où les conducteurs ne
sont pas réunis sur une longueur.

Il s'est avéré, en vérifiant, que la traversée de la boîte n'était pas seulement admissible mais
**forcée** : la montée qui relie cette boîte à celle du plafond occupe toute la bande au-dessus
d'elle, et aucun parcours horizontal ne la franchit sur le nu de la paroi. L'amendement ne
desserre donc pas le Principe IV pour une commodité — il dit ce qu'il advient quand la géométrie
ne laisse pas le choix, ce qui est le moment où une règle muette devient dangereuse. Ce qui change dans une boîte est autre chose : c'est l'endroit
où l'on met les mains, et y trouver du 6 mm² sous 32 A quand on a consigné l'éclairage n'est pas
le même risque que d'y trouver du 1,5 mm².

Version change (antérieur): 1.9.0 → 1.10.0
Rationale: MINEUR. Nouvelle règle : une boîte portant **plusieurs circuits** doit être repérée
comme telle, et la consignation d'un seul de ces circuits ne doit pas être présentée comme
suffisante pour y intervenir. Le mode de pose imposé traitait déjà du groupement de plusieurs
circuits dans un même **conduit**, au titre du dimensionnement thermique ; il ne disait rien de
la **boîte**, qui est l'endroit où l'on met les mains.

L'occasion en est la décision du maître d'ouvrage du 2026-09-21 de **mutualiser au maximum** les
conduits et les boîtes entre le circuit des prises et celui de l'éclairage. Quatre boîtes
portent désormais deux circuits. Consigner l'un n'y met pas l'autre hors tension, ce qui est
l'inverse de ce qu'un installateur attend d'une consignation — et rien, dans l'appareillage, ne
le lui signale.

Amendement v1.9.0 : MINEUR. Entrée des conducteurs par le haut, et son corollaire de tracé.

Version change (antérieur): 1.8.0 → 1.9.0
Rationale: MINEUR. Nouvelle règle de mode de pose : les conducteurs entrent dans un appareil
posé en saillie **par le haut**. Décision du maître d'ouvrage du 2026-09-21. Sur une paroi
froide où la condensation est tenue pour probable — ce que la constitution énonçait déjà —, une
gaine qui aborde un boîtier par le bas ou par le côté peut y conduire l'eau, où elle stagne ;
abordée par le haut, la même gaine la laisse s'écouler hors de l'appareil. La règle tire donc
une conséquence de pose d'un fait déjà consigné, et elle vaut pour les trois fonctionnalités
électriques, non pour la seule qui l'a motivée.

Un corollaire de tracé l'accompagne, découvert en appliquant la règle : la boîte dont part une
descente doit être **au droit** de l'appareil alimenté. Sans cela, le décrochement nécessaire
pour venir au-dessus de lui se pose sur le tracé d'un autre conduit et y crée une jonction
supplémentaire — ce qu'a établi la règle V17 du socle, en refusant le premier tracé essayé.

Amendement v1.8.0 : MINEUR. Le repiquage sur les bornes d'un appareil est admis comme
dérivation, sous quatre conditions cumulatives.

Version change (antérieur): 1.7.0 → 1.8.0
Rationale: MINEUR. Le mode de pose imposé exigeait « une boîte de dérivation à chaque
dérivation ». La lettre de cette règle interdisait le **repiquage** — la dérivation faite sur
les bornes d'un appareil, dans son propre boîtier saillie — qui est la pratique courante et
qui satisfait pourtant l'objectif poursuivi, à savoir qu'aucune connexion ne devienne
invérifiable. La règle est donc étendue pour admettre cette forme, sous quatre conditions
explicites, et resserrée sur ce qui compte réellement : l'accessibilité de la connexion, non
la catégorie commerciale du boîtier qui l'abrite.

L'occasion en est une question du maître d'ouvrage du 2026-09-21 : pourquoi une boîte de
dérivation en pied de descente, alors que le boîtier du socle intérieur peut recevoir
l'arrivée et redistribuer vers l'extérieur par son fond ? La réponse est qu'il n'y en avait
aucune raison valable — deux boîtes de `002-prises-de-courant` ne compensaient qu'une
prémisse fausse sur l'encombrement d'un boîtier saillie. Voir la révision de FR-029 de cette
fonctionnalité.

Amendement v1.7.0 : MINEUR. Corrections de cotes du relevé et notion de majorant déduit.

Version change (antérieur): 1.6.1 → 1.7.0
Rationale: MINEUR. Trois corrections de cotes du relevé — allège de la fenêtre nord portée à
1,50 m, largeur du rail à 8 cm, et **hauteur de passage de la porte sectionnelle relevée à
2,10 m**. Ces reports seraient un correctif. Ce qui justifie un mineur est la conséquence de
la troisième : la hauteur de passage et la course du rail **bornent** le tablier en position
ouverte, jusqu'ici entièrement inconnu. Le Principe VI est donc étendu pour distinguer un
**majorant déduit** d'une valeur inventée, et pour fixer l'asymétrie de verdict qui en
découle — un majorant démontre un dégagement, jamais une collision. TODO(TABLIER_OUVERT)
cesse d'être bloquant et se réduit à l'encombrement exact.

Amendement v1.6.1 : CORRECTIF. Report des cotes du rail de la porte sectionnelle, qui le rendent
entièrement défini. TODO(RAIL_PORTE_SECTIONNELLE) est remplacé par TODO(TABLIER_OUVERT), plus
étroit : le rail est relevé, l'encombrement du tablier en position ouverte ne l'est pas.

Amendement v1.6.0 : MINEUR. Deux ajouts. D'une part le relevé du tableau divisionnaire — position et
équipement. D'autre part, et c'est ce qui justifie un mineur, l'extension du Principe II au
**type** des dispositifs différentiels : il n'exigeait jusqu'ici qu'une sensibilité, ce qui
laissait passer un type inadapté aux charges réellement desservies. La lacune a été mise au
jour par le relevé du différentiel existant, de type AC.

Amendement v1.5.1 : CORRECTIF. Report du régime de neutre et du statut du garage, qui lèvent
TODO(REGIME_NEUTRE) — le dernier point ouvert bloquant la note de calcul. Les conséquences
énoncées découlent de la donnée et n'ajoutent aucune règle.

Amendement v1.5.0 : MINEUR. La dédicace du circuit de recharge est étendue au **conduit** : la ligne
de la borne est entièrement dédiée, décision du maître d'ouvrage du 2026-09-21. En pose
apparente, un conduit peut être partagé alors qu'un circuit ne l'est pas ; l'écrire retire
cette possibilité et en tire les conséquences d'implantation.

Amendement v1.4.1 : CORRECTIF. Recalibrage de la règle ajoutée en v1.4.0. L'obligation de ne pas
ignorer le bilan de puissance est maintenue ; ce qui change est le **moyen**, qui n'est plus
imposé, et la **justification**, qui était mal posée. La v1.4.0 fondait la modulation sur le
cumul avec un gros consommateur ; or ce cumul est écarté par une hypothèse d'exploitation du
maître d'ouvrage. Le fait qui subsiste est plus large et ne dépend pas du compresseur : une
borne de 32 A laisse 1,6 kW à l'ensemble de la maison. Aucun choix antérieurement validé n'est
rendu non conforme, d'où un correctif et non un mineur.

Amendement v1.4.0 : MINEUR. Report de la puissance souscrite et de la puissance de la borne,
qui lèvent TODO(PUISSANCE_SOUSCRITE) et TODO(PUISSANCE_BORNE).

Amendement précédent (1.3.1 → 1.3.3) : CORRECTIF. Report de la longueur relevée de
l'alimentation et du calibre de sa protection amont, qui lèvent TODO(LONGUEUR_ALIMENTATION)
et TODO(PROTECTION_AMONT).

Amendement précédent (1.3.0 → 1.3.1) : CORRECTIF. Report de deux compléments de relevé —
fenêtre en paroi nord, et profondeur du rail de la porte sectionnelle. Aucun principe touché, aucune règle étendue :
la constitution exigeait déjà les dimensions relevées, ce complément les fournit.

Amendement précédent (1.2.0 → 1.3.0), conservé pour mémoire : MINEUR. Ajout d'une
sous-section de contraintes fixant le mode de pose, et extension matérielle de deux
principes existants pour en tirer les conséquences. Les parois
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
  - TODO(TABLIER_OUVERT) : encombrement exact du tablier. **Ne concerne plus que la position
    fermée** depuis le 2026-09-22. En position ouverte, les trois bornes du majorant sont
    acquises — largeur de la baie, course du rail de 2,50 m, et sous-face **mesurée à 2,31 m** —
    et aucun cheminement du dossier ne recoupe plus ce volume. En position **fermée**, rien dans
    le relevé ne borne la saillie du panneau et de ses coulisses vers l'intérieur du local :
    aucun majorant n'y est déductible, et tout contrôle le concernant reste sans conclusion
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
- Le **type** de chaque dispositif différentiel DOIT être choisi et justifié au regard des
  charges qu'il protège, et non seulement sa sensibilité. Un type AC ne détecte que les
  courants résiduels alternatifs sinusoïdaux : il **ne voit pas** les composantes continues
  pulsées que produisent les alimentations à découpage — chargeurs d'outils sans fil, drivers
  de luminaires, variateurs, électronique de motorisation. Une sensibilité de 30 mA sur un
  type inadapté est une protection qui ne déclenche pas.
- Un différentiel de type AC NE DOIT PAS être placé en amont d'un dispositif de type A ou B :
  une composante continue le désensibilise, et la protection amont cesse d'être effective au
  moment même où elle serait nécessaire.
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
circuits du garage.

**La dédicace ne s'étend PAS au contenant.** Amendé en v1.14.0 : elle s'étendait au conduit,
sans qu'aucune clause ne la fonde, et le tracé arrêté la contredisait déjà sur 0,04 m.

La ligne de la borne PEUT cohabiter avec d'autres circuits dans un **profilé de goulotte**, à
**deux conditions cumulatives** :

1. elle y est un **câble à enveloppe propre**, et non des conducteurs isolés nus ;
2. elle y **transite sans être coupée** — aucune connexion du circuit de la borne n'est faite
   dans un organe de connexion partagé.

Là où elle emprunte un **conduit**, celui-ci lui reste dédié : un conduit n'offre pas
d'enveloppe propre par conducteur, et y mêler deux circuits reviendrait à la situation que la
condition 1 écarte.

Trois conséquences, dont la portée est désormais bornée :

- Le **facteur de correction de groupement** DOIT être appliqué à son courant admissible, et
  écrit, sur toute portion où elle cohabite. Il ne cesse de s'appliquer que sur les portions
  restées en **conduit dédié**.
- Son conduit sera **plus gros** que celui des circuits d'usage courant, la section de ses
  conducteurs étant supérieure. Le diamètre relève de sa note de calcul.
- L'implantation DOIT prévoir des **parcours parallèles** là où la ligne de la borne longe un
  autre circuit **en conduit** : deux conduits côte à côte demandent leur propre place et leurs
  propres fixations. La contrainte tombe là où la ligne partage un profilé.

*La clause qui fonderait — ou non — une exigence de contenant dédié pour un point de charge, et
la catégorie de pose d'un câble en goulotte, sont des valeurs normatives : elles DOIVENT être
confirmées sur le texte, et NE DOIVENT PAS être reprises de mémoire ni d'une source secondaire.*

**La dédicace ne s'étend PAS à la boîte de dérivation.** Le motif de la dédicace du conduit est
thermique et spatial, et aucun de ses trois effets ci-dessus ne porte sur une boîte, où les
conducteurs ne sont pas réunis sur une longueur. La ligne de la borne PEUT donc **traverser** une
boîte partagée avec un autre circuit, sous **quatre conditions cumulatives** :

1. **Traversée et non jonction.** Les conducteurs de la borne y **transitent sans être coupés**.
   Aucune connexion du circuit de la borne NE DOIT être faite dans une boîte partagée : une
   connexion que d'autres ouvriront est une connexion que d'autres dérangeront, et sur un circuit
   de charge à fort courant continu la connexion desserrée est le mode de défaillance à écarter
   en premier.
2. **Volume établi.** La boîte DOIT être dimensionnée pour la **totalité** des conducteurs qui
   l'occupent, ceux de la borne compris, et ce dimensionnement DOIT être établi sur la cote
   produit et non présumé. Le nombre d'entrées nécessaire DOIT être énoncé.
3. **Repérage nommant la borne.** Le repérage exigé par le mode de pose pour toute boîte à
   plusieurs circuits DOIT **nommer le circuit de la borne**, et non seulement signaler une
   pluralité. Les conducteurs de la borne DOIVENT en outre rester identifiables à l'ouverture.
4. **Consignation écrite.** Il DOIT être écrit que la consignation d'un circuit d'usage courant
   **ne met pas la borne hors tension**, et que toute intervention dans cette boîte exige la
   consignation des trois circuits. Cette mention DOIT figurer au dossier final et sur la boîte.

Si l'une des quatre n'est pas tenue, la ligne de la borne NE DOIT PAS traverser la boîte : elle
la contourne, et l'implantation en assume l'encombrement.

**La détection du courant continu de défaut DOIT être assurée**, par un dispositif coupant
l'alimentation lorsque la composante continue du courant de défaut dépasse **6 mA**. Cette
exigence est non négociable et ne souffre aucune dispense.

Les montages qui y répondent DOIVENT être lus sur le texte de la norme et non sur cette liste,
qui est **indicative et non exhaustive** :

- un différentiel de **type B** ;
- un différentiel de **type A** associé à un dispositif de détection 6 mA ;
- un différentiel de **type F** associé au même dispositif — le type F n'apporte pas la détection
  du courant continu, il apporte une immunité aux courants résiduels à fréquences composées.

Le dispositif 6 mA PEUT être **intégré à la borne** ou constituer un **module distinct** au
tableau. Dans les deux cas il DOIT être documenté comme tel, et le montage retenu écrit au
dossier.

**Le choix du type de différentiel NE DOIT PAS être présenté comme réglant la détection du
courant continu.** C'est une confusion courante, et elle produit une installation qui paraît
protégée et ne l'est pas. Aucun type de différentiel ne dispense du dispositif 6 mA : l'écrire
ici est le seul moyen d'empêcher que la question soit tenue pour close par le choix d'un type.

*La clause applicable et la liste exacte des montages admis sont des valeurs normatives : elles
DOIVENT être confirmées sur le texte, et NE DOIVENT PAS être reprises de mémoire ni d'une source
secondaire.*
La borne DOIT être posée par un intervenant disposant de la qualification IRVE requise pour
la puissance retenue, et les travaux DOIVENT être tracés à ce titre.

La borne retenue est de **32 A, soit environ 7,4 kW**, et la puissance souscrite du branchement est
de **9 kVA**, soit 39 A pour l'ensemble de l'habitation. La borne consomme donc à elle seule
**82 % de la capacité souscrite**, et ne laisse que 7 A — environ 1,6 kW — pour tout le reste
de la maison pendant une charge.

Ce bilan NE DOIT PAS être passé sous silence. Le moyen de le traiter relève en revanche du
maître d'ouvrage, et deux voies sont admises :

- un **dispositif de modulation** de la charge piloté par la mesure du courant consommé au
  branchement, ou un **délestage** qui interrompe la charge lorsque les autres usages montent ;
- ou une **restriction d'usage assumée et écrite**, énonçant les usages tenus pour
  incompatibles avec une charge en cours.

Dans les deux cas, la note de calcul DOIT énoncer la voie retenue et la liste des usages
incompatibles, et cette liste DOIT figurer au dossier final. Une restriction d'usage est une
condition de validité du dimensionnement : non écrite, elle est perdue au premier changement
d'occupant ou d'intervenant.

Le dimensionnement DOIT par ailleurs prendre en compte la **surintensité de démarrage** des
moteurs, et non le seul courant nominal : c'est l'appel à l'amorçage, et non la consommation
moyenne, qui fait déclencher.

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
- Une cote inconnue peut néanmoins se trouver **bornée** par des cotes relevées. Un tel
  **majorant** DOIT être déclaré comme majorant, dans une forme distincte de celle d'un
  relevé, et il n'autorise qu'**un seul** verdict : être à l'écart du majorant démontre le
  dégagement, tandis que le recouper ne démontre rien, l'obstacle réel y étant contenu. Un
  majorant NE DOIT jamais être présenté comme une mesure, ni servir à affirmer une collision,
  ni dispenser de relever l'encombrement réel.

  Rationale : un majorant déduit n'est pas une valeur rassurante substituée à une inconnue,
  c'est une conséquence de cotes relevées, et son imprécision pousse à la prudence et non à
  l'imprudence. L'alinéa précédent proscrit l'invention ; il ne proscrit pas la déduction
  prouvée, et les confondre conduirait à jeter une information exacte au motif qu'elle est
  indirecte.
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
  excentrée. Elle laisse 0,40 m de trumeau du côté est et 0,20 m du côté ouest. Sa **hauteur
  d'ouverture est de 2,10 m**, ce qui laisse 0,65 m de linteau sous le plafond et 0,25 m
  entre le haut du passage et la sous-face du rail. L'implantation DOIT tenir compte du
  débattement et du rail du tablier en position ouverte, qui occupe le plafond.
- Le trumeau ouest de 0,20 m correspond à la largeur d'un parpaing. Aucun appareillage ne
  DOIT y être implanté sans vérification préalable de la faisabilité de la pose et du
  passage de gaine.
- Accès piéton : porte de service sur la paroi est, 1,10 m de largeur et 2,50 m de hauteur,
  son bord sud situé à 1,30 m de l'angle sud-est. Les commandes d'éclairage DOIVENT être
  atteignables depuis cet accès.
- Éclairage naturel : fenêtre en paroi nord, 3,00 m de largeur, centrée — donc 1,30 m de
  trumeau de chaque côté. Allège à **1,50 m** et hauteur d'ouverture de 0,53 m : la baie
  occupe les altitudes de **1,50 m à 2,03 m**, et laisse 0,72 m de linteau sous le plafond.
  Aucun cheminement ne DOIT traverser cette ouverture. La maçonnerie pleine sous l'allège
  atteint donc 1,50 m de hauteur libre.
- Rail de la porte sectionnelle, **entièrement relevé** : centré sur la baie, soit à 2,70 m de
  l'angle sud-ouest ; **8 cm** de largeur ; **2,50 m** de profondeur depuis la paroi sud ;
  sous-face à **2,35 m** du sol, soit 0,40 m sous le plafond. Son volume est donc connu et les
  contrôles de collision le concernant sont concluants.
- Le **tablier en position ouverte** est un obstacle distinct et bien plus vaste : il occupe
  toute la largeur de la baie sous le plafond, non les 8 cm du rail. Son encombrement exact
  n'est pas relevé — voir TODO(TABLIER_OUVERT) — mais il est **borné par trois cotes**, et ce
  majorant est opposable au sens du Principe VI :
  - en largeur, il ne dépasse pas la baie, soit de 0,20 m à 5,20 m — **borne déduite** ;
  - en profondeur, il est guidé par le rail et ne va donc pas au-delà de sa course de
    2,50 m depuis la paroi sud — **borne déduite** ;
  - en altitude, sa **sous-face est à 2,31 m**, soit 0,04 m sous celle du rail — **cote
    mesurée** le 2026-09-22, porte grande ouverte, à l'aplomb de la façade sud. Elle remplace
    la borne de 2,10 m qui se déduisait de la seule hauteur de passage, laquelle ne disait que
    « au-dessus de » et non « à ».

  La distinction entre les deux premières bornes et la troisième est celle du Principe VI :
  une borne déduite ne se resserre que par un raisonnement, une cote mesurée ne se discute pas.
  Le volume reste néanmoins un **majorant** et non un relevé, deux de ses trois dimensions
  demeurant des bornes.

  Un cheminement disjoint de ce volume est par conséquent **prouvé dégagé** du tablier ; un
  cheminement qui le recoupe reste non concluant, le tablier réel étant contenu dans son
  majorant. En position **fermée**, aucun majorant n'est déductible : rien dans le relevé ne
  borne la saillie du panneau et de ses coulisses vers l'intérieur du local.

**Mode de pose imposé**

Les parois étant en béton non isolé et sans vide technique, l'installation est posée **en
apparent**. Ce mode de pose est une donnée d'entrée du projet, non un choix de conception.

- Les conducteurs DOIVENT cheminer en **conduits IRL** fixés en saillie sur les parois et au
  plafond. Aucune saignée, aucun encastrement et aucune pose sous enduit ne DOIT être
  pratiqué dans le béton. Tout scénario l'exigeant DOIT être signalé comme un changement de
  périmètre explicite.
- Par exception, un **profilé de goulotte à capot démontable** PEUT tenir lieu de conduit sur un
  parcours donné, et y **abriter des connexions**, à **six conditions cumulatives** :
  1. le **capot se dépose sans destruction**, à la main ou à l'outil courant, et reste déposable
     après achèvement des travaux ;
  2. chaque connexion abritée est réalisée par un **dispositif de connexion**, sans épissure, dans
     un volume intérieur qui le permet ; si le capot se dépose **sans outil**, le dispositif
     présente au moins le degré **IP2X ou IPXXB, conducteurs en place**. *Amendé en v1.15.0 : la
     condition exigeait un organe à enveloppe propre, sans clause qui la fonde. Références
     relevées — NF C 15-100 § 526.3 et § 529.3 — à confirmer sur le texte* ;
  3. chaque groupe de connexions porte un **repère lisible sans déposer le capot**, et le dossier
     énumère ces emplacements **au même titre que les boîtes de dérivation** ;
  4. la goulotte **ne retient pas l'eau**. Sur paroi froide, elle DOIT être posée de façon à ne pas
     former cuvette, ou percée en partie basse pour s'évacuer — et elle NE DOIT PAS se déverser
     dans un appareil situé en dessous ;
  5. elle est posée **à l'intérieur** du local, et **hors des zones exposées aux chocs** déjà
     énumérées — gabarit de manœuvre du véhicule, débattement des ouvrants, trajectoire du tablier
     et du rail ;
  6. son **taux de remplissage admissible** est justifié sur les caractéristiques déclarées du
     produit. La règle du tiers `D ≥ d·√(3n)` est écrite pour une section circulaire et **ne s'y
     transpose pas telle quelle**.

  Cette exception **autorise** une forme sans en **imposer** aucune : un parcours en conduit IRL
  reste conforme partout, et aucun tracé déjà arrêté n'est à reprendre de ce fait.

  Rationale : la règle du conduit et celle de la boîte visent juste et nomment une forme. Ce qui
  rend un cheminement acceptable n'est pas le profil du produit, c'est que les conducteurs soient
  protégés, que les connexions restent **atteignables, identifiables et vérifiables**, et qu'aucune
  ne soit noyée. Les six conditions retiennent l'exigence réelle et écartent l'exigence de forme,
  comme l'avait fait l'exception de repiquage en v1.8.0. La condition 4 n'est pas une précaution de
  rédaction : la constitution tient déjà la condensation pour probable sur ces parois, et une
  goulotte horizontale capot dessus est une gouttière.
- Une **boîte de dérivation** DOIT être posée à chaque intersection de parcours, à chaque
  dérivation et à chaque changement de direction qui ne se traite pas par un accessoire de
  conduit.
- Par exception, une dérivation PEUT être faite sur les **bornes d'un appareil posé en
  saillie** — un repiquage — sans boîte de dérivation dédiée, à quatre conditions cumulatives :
  1. la connexion se trouve **dans le boîtier propre de l'appareil**, et non derrière lui ;
  2. ce boîtier reste **accessible et démontable** après achèvement des travaux ;
  3. chaque borne **accepte sans contrainte** le nombre de conducteurs et la section retenus,
     d'après les caractéristiques déclarées de l'appareil, ce qui DOIT être vérifié à la pose ;
  4. il est **écrit au dossier** que la dépose de cet appareil interrompt l'alimentation de ce
     qui est repiqué en aval.

  Rationale : la règle précédente visait juste mais nommait mal sa cible. Ce qui rend une
  connexion dangereuse n'est pas la catégorie commerciale du boîtier qui l'abrite, c'est de
  devenir **invérifiable** — noyée dans un conduit, ou coincée derrière un appareil qu'il
  faudrait détruire pour l'atteindre. Les bornes d'un socle en saillie ne sont ni l'un ni
  l'autre : on les atteint en déposant l'appareil. Exiger une boîte de dérivation en plus
  aurait ajouté un boîtier, donc deux connexions supplémentaires, pour protéger d'un risque
  que la configuration ne présentait pas. Les quatre conditions retiennent l'exigence réelle
  et écartent l'exigence de forme.
- Une boîte portant **plusieurs circuits** DOIT être repérée comme telle, de façon durable et
  lisible sans l'ouvrir. La consignation d'un seul de ces circuits NE DOIT PAS être présentée
  comme suffisante pour y intervenir : les conducteurs des autres y restent sous tension. Le
  dossier DOIT énumérer ces boîtes, et la notice de montage DOIT porter cette réserve.

  Rationale : une consignation protège un **circuit**, pas un **volume**. Tant qu'un conduit ou
  une boîte ne servent qu'un circuit, les deux se confondent, et l'installateur peut s'en
  remettre à son geste de consignation. Dès qu'une boîte en porte deux, la confusion devient
  fausse au moment précis où elle est dangereuse : couvercle ouvert, mains dedans. Aucun
  appareillage ne signale cette situation ; seul le repérage le fait. C'est pourquoi la règle
  porte sur l'écrit et sur l'étiquette, et non sur une interdiction — mutualiser est licite et
  parfois souhaitable, le taire ne l'est pas.
- **Toute connexion DOIT se faire dans une boîte**, jamais dans un conduit ni derrière un
  appareil. Le boîtier propre d'un appareil posé en saillie est une boîte à ce titre. Aucune
  boîte NE DOIT être rendue inaccessible ou indémontable par les travaux : une connexion que
  l'on ne peut plus atteindre est une connexion que l'on ne peut plus vérifier.
- Les socles de prise, les commandes et les appareils DOIVENT être posés **en saillie**, sur
  boîtier apparent.
- Les conducteurs DOIVENT entrer dans un appareil posé en saillie **sur une paroi** par le
  **haut** : le conduit aborde le boîtier par son dessus. Aucune entrée latérale ni par le bas
  ne DOIT être retenue. Un appareil de **plafond** est hors de portée de cette règle, l'entrée
  par le dessus n'y ayant pas de sens.
- Corollaire de tracé : la **boîte de dérivation dont part une descente DOIT être posée au
  droit de l'appareil** qu'elle alimente, de sorte que la descente soit droite. Un décrochement
  latéral pris au niveau d'une antenne existante pour venir au-dessus de l'appareil se
  poserait sur le tracé de cette antenne, l'y couperait d'un té, et créerait une jonction
  supplémentaire à couvrir d'une boîte.

  Rationale : la constitution tient déjà la **condensation en surface pour probable** sur ces
  parois froides. Une gaine qui aborde un boîtier par le bas ou par le côté peut y conduire
  l'eau, qui s'y accumule au contact des connexions ; abordée par le haut, la même gaine la
  laisse s'écouler hors de l'appareil. La règle ne fait qu'en tirer la conséquence de pose. Le
  corollaire, lui, n'a pas été déduit mais **constaté** : le premier tracé essayé prenait le
  décrochement en tête et la règle V17 l'a refusé.
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
- Longueur relevée de cette arrivée : **30 m** depuis le tableau principal de la maison. Cette
  longueur DOIT être cumulée à celle de chaque circuit terminal dans le calcul de chute de
  tension exigé par le Principe III.
- Protection en amont : **disjoncteur 63 A** au tableau principal de la maison. Ce calibre est
  une donnée d'entrée figée, au même titre que la section du câble.
- Puissance souscrite du branchement : **9 kVA** en monophasé, soit environ 39 A pour
  l'ensemble de l'habitation. Le disjoncteur d'abonné correspondant se règle usuellement à
  45 A.
- Le calibre de 63 A protège le câble, non l'alimentation : **il ne sera jamais atteint**,
  puisque le disjoncteur d'abonné limite en amont. La capacité effective au garage est celle
  du branchement, pas celle du départ.

**Tableau divisionnaire du garage**

- Situé sur la **paroi est**, entre l'angle sud-est et la porte de service — soit la bande
  comprise entre 0 et 1,30 m depuis cet angle. Il est donc atteignable dès l'entrée par la
  porte de service, ce qui sert directement l'exigence de coupure d'urgence accessible.
- Il reçoit l'alimentation de la maison en 3G16 et porte son propre **interrupteur
  différentiel de type AC**.

**Point à trancher : le type du différentiel**

Le type AC relevé est cohérent avec une installation d'époque, mais il ne l'est pas avec les
charges que ce garage va desservir. Un chargeur d'outil sans fil, un driver de luminaire à
LED ou l'électronique d'une motorisation de porte produisent des composantes continues
pulsées qu'un type AC ne détecte pas. Au titre du Principe II, le **type A** est le minimum à
retenir pour les circuits d'usage courant de ce local.

Deux conséquences supplémentaires :

- La borne de recharge exige, au titre du Principe IV, un différentiel dont le type est à
  arrêter **et** un dispositif de détection de courant continu résiduel de 6 mA. Si son circuit
  partait de ce tableau **en aval du type AC**, ce dernier serait désensibilisé par toute
  composante continue — configuration proscrite par le Principe II.

  *Tranché le 2026-09-22 : le circuit de la borne est raccordé au **bornier** du tableau
  divisionnaire, en amont de l'interrupteur de type AC, ce qui lève la contradiction pour cette
  fonctionnalité. **Une conséquence de consignation en découle et DOIT être écrite** : ouvrir
  l'interrupteur différentiel du tableau ne met plus la borne hors tension. Le geste par lequel
  on consigne habituellement ce local laisse donc vivant le circuit le plus énergétique qu'il
  porte.*
- Le remplacement de cet interrupteur différentiel DOIT donc être statué explicitement avant
  la réalisation, et le choix consigné. Le conserver est une décision recevable si elle est
  écrite et motivée ; le conserver par défaut n'en est pas une.

**Régime de neutre et mise à la terre**

- Régime de neutre : **TT**, celui de tout branchement au réseau public de distribution. La
  protection contre les contacts indirects repose donc entièrement sur les dispositifs
  différentiels et sur la qualité de la prise de terre, et non sur les protections contre les
  surintensités.
- Le garage est **accolé** au bâtiment principal : masses et éléments conducteurs relèvent
  d'une seule et même zone équipotentielle, celle de la maison. Aucune différence de potentiel
  entre bâtiments n'est à craindre.
- La terre est **amenée par le conducteur PE du 3G16** depuis la maison. Le garage n'a **pas**
  de prise de terre propre, et n'en recevra pas : la prise de terre de l'installation est
  unique, ce qui est le montage le plus simple et le plus sûr.

Trois conséquences, qui découlent de ces données et n'ajoutent aucune règle :

- La prise de terre à considérer est celle, existante, de la maison. Le seuil applicable est
  `R ≤ 50 / IΔn`, soit **100 Ω** pour le différentiel 500 mA du disjoncteur de branchement.
  C'est cette valeur que la mesure exigée par le Principe V doit confirmer.
- Le PE du 3G16 fait 16 mm², égal à la section de phase, ce qui satisfait la règle applicable
  aux sections inférieures ou égales à 16 mm².
- **Faute de prise de terre locale, la continuité de ce PE est le point unique de
  défaillance** de toute la mise à la terre du garage. Rien ne compenserait localement sa
  rupture. L'essai de continuité du Principe V cesse d'être une formalité de réception : c'est
  la vérification dont dépend la protection des personnes dans ce local, et sa valeur mesurée
  doit être consignée comme telle.
- Le garage comporte des éléments conducteurs accessibles de grande surface — tablier
  métallique de la porte sectionnelle et son rail. La liaison équipotentielle exigée par le
  Principe II DOIT statuer explicitement sur leur cas, d'autant que la motorisation raccordée
  à PC-05 y est mécaniquement liée.

**Conséquence sur le budget de chute de tension**

L'arrivée consomme une part du budget avant que le premier circuit terminal ne commence. Le
courant à retenir est celui que le branchement peut réellement délivrer — 45 A au disjoncteur
d'abonné — et non le calibre de 63 A du départ, inatteignable. Sur 30 m de 16 mm², cela
représente environ 3,8 V, soit 1,65 % des 230 V. Il reste donc de l'ordre de 3,35 % pour un
circuit de prises sur la limite de 5 %, et **1,35 % pour un circuit d'éclairage sur la limite
de 3 %**.

C'est l'éclairage, et non les prises, que cette arrivée contraint. La note de calcul DOIT
énoncer l'hypothèse de simultanéité qu'elle retient : additionner la chute de l'arrivée à
pleine charge et celle d'un circuit d'éclairage est le cas le plus défavorable, et il DOIT
être examiné explicitement plutôt qu'écarté au motif qu'un luminaire consomme peu. Les valeurs
ci-dessus sont indicatives et ne tiennent pas lieu de note de calcul.
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

- TODO(TABLIER_OUVERT) : encombrement exact du tablier, en position ouverte et fermée. **Ce
  point n'est plus bloquant en position ouverte** : la hauteur de passage de 2,10 m et la
  course du rail de 2,50 m le bornent, et ce majorant suffit à prouver le dégagement d'un
  cheminement qui s'en tient à l'écart. Il reste à relever pour statuer sur un cheminement
  qui recouperait ce majorant, et **en position fermée**, où aucune borne n'est déductible.
- TODO(CONDUIT_EXTERIEUR) : référence de conduit et de boîtes retenue pour les parcours
  extérieurs, l'IRL d'intérieur n'étant pas présumé qualifié pour l'exposition directe.

**Points levés**

- Hauteur sous plafond : 2,75 m.
- Hauteur d'ouverture de la porte sectionnelle : 2,10 m — d'où le majorant du tablier ouvert.
- Rail de la porte sectionnelle : 8 cm de largeur, sous-face à 2,35 m, 2,50 m de profondeur.
- Allège de la fenêtre nord : 1,50 m, ouverture de 1,50 m à 2,03 m.
- Longueur de l'arrivée 3G16 : 30 m depuis le tableau principal.
- Protection amont : disjoncteur 63 A.
- Puissance souscrite : 9 kVA monophasé.
- Borne de recharge : 32 A, soit **environ 7,4 kW** (7,36 kW sous 230 V) — avec l'obligation
  de ne pas ignorer le bilan de puissance qui en découle. Les valeurs « 7,3 kW » et
  « 7,4 kW » employées au fil du relevé sont deux arrondis de cette même puissance ; la
  seconde est retenue pour l'ensemble des documents.

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

**Version**: 1.15.0 | **Ratified**: 2026-09-21 | **Last Amended**: 2026-09-24
