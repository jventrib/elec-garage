# Spec Delta

## REMOVED Requirements

### Requirement: Distribution individuelle des réglettes de plafond

*Retirée le 2026-10-01, au profit de **Pontage des réglettes de plafond par cordage**. La décision
du 2026-09-26 reste juste sur un point, et fausse sur tous les autres.*

**Ce qui restait vrai** : le **chaînage série dans le corps des réglettes** doit être écarté, et la
raison doit être écrite. Les réglettes sont « connectables entre elles, jusqu'à 10 selon la
fiche » : la possibilité est réelle, et c'est ce qui la rend crédible à la lecture. Elle est
écartée parce que le **presse-étoupe PG11 est intermédiaire et n'est pas sur le chemin du
courant**. Un presse-étoupe intermédiaire ne transporte rien ; le traverser n'économise aucun
conduit, et il ajoute à chaque luminaire une dérivation et un contact sous tension.

**Ce qui était faux** : l'exigence que **chaque réglette reçoive sa propre dérivation depuis la
fourche**. Elle est remplacée par le pontage, qui réduit la distribution de sept conduits et
quatre boîtes à quatre conduits, une boîte et quatre cordages.

**Ce que l'exigence retirée coûtait** : le métré de conducteurs passait de 69,34 m à
**104,89 m** pour un nombre de conducteurs inchangé — dix. La longueur doublait, pas la quantité
de cuivre par point. C'est ce renoncement que le pontage vient reprendre par l'autre bout.

### Requirement: Partage des colonnes de réglettes par des boîtes

*Retirée le 2026-10-01 : quatre boîtes et sept conduits vers le plafond pour six réglettes. Il en
reste **une boîte et quatre conduits**, plus quatre cordages.*

**Motif du retrait.** L'organisation en quatre boîtes répondait à un besoin qui n'existe plus.
BD-08 et BD-07 étaient les boîtes de colonne ; BD-09, le branchement sur le tronc ouest, n'existait
que parce que **trois conduits se croisaient en plein à 2,20 m** et n'avaient nulle part où se
raccorder. En distribution pontée, il n'y a plus trois conduits à croiser : il y a deux colonnes et
un cordon par colonne.

**Le principe, lui, reste entier.** La règle de connexion en boîte continue de s'appliquer
intégralement — chaque extrémité de segment doit aboutir dans une boîte, et le nombre de boîtes est
la conséquence du nombre de points, non un choix de rendu. Ce qui change, c'est le **nombre** de
boîtes, et donc le degré de la fourche : BL-01 passe de 4 à **3**.

## ADDED Requirements

### Requirement: Pontage des réglettes de plafond par cordage

*Ajoutée le 2026-10-01, pour les six réglettes HOFTRONIC du plafond.*

Les six réglettes DOIVENT être pontées **deux par deux** : chacune reçoit son alimentation de la
réglette voisine par un **cordage**, et non d'un conduit remontant du tableau.

**Le pontage n'est pas le chaînage série, et la confusion doit être explicitement écartée.** Dans le
chaînage série, le courant traverse le **presse-étoupe** du luminaire, qui est intermédiaire et ne
conduit rien. Dans le pontage, un câble va **d'un point à l'autre**, d'une réglette à sa voisine :
c'est une liaison franche entre deux points déclarés, pas une dérivation prise sur un appareil.
« Les réglettes sont connectables entre elles » ne dit pas « elles se passent le courant ».

**Chaque cordage porte trois conducteurs.** Une paire pontée a besoin de sa **phase**, de son
**neutre** et de son **PE** entre les deux réglettes ; sans le PE, le pontage constituerait un
défaut de terre en série dans l'éclairage. Un câblier à deux conducteurs ne convient donc pas.

**Un cordage ne déclare pas de section.** Il n'est pas choisi dans un catalogue de conduits, et
c'est ce qui le distingue : la donnée porte `nature: "cordage"` et **aucune** section. La
conséquence DOIT être écrite plutôt que passée sous silence : **sa condition de remplissage n'est
pas vérifiable**. Le type et la section du câblier sont une **condition d'achat**, à arrêter par le
maître d'ouvrage, non une grandeur déduite des données.

**Le câblage interne d'une réglette n'est pas un conduit, et n'est pas acheté.** Chaque composant
ponté déclare ses `raccords`, et les deux points d'un même appareil sont reliés par une **arête
interne de 1,20 m** — la longueur du câble fourni dans le corps. Cette liaison est **réelle pour la
chute de tension** et **absente du métré**, parce qu'elle est fournie avec l'appareil. La fiche
produit peut déclarer `liaisonInterne` pour le dire ; le socle ne doit alors pas l'acheter.

#### Scenario: Chaque paire de réglettes est reliée par un cordage
- **WHEN** la distribution du plafond est examinée
- **THEN** les six réglettes sont groupées en trois paires, chacune rejointe par un cordage, et
  aucune n'est alimentée par le presse-étoupe d'une autre

#### Scenario: Un cordage porte phase, neutre et terre
- **WHEN** les conducteurs d'un cordage de pontage sont dénombrés
- **THEN** ils sont au nombre de trois — phase, neutre et PE — et non deux

#### Scenario: Le cordage n'a pas de section, et le dossier le dit
- **WHEN** la déclaration d'un cordage est lue
- **THEN** elle porte `nature: "cordage"` et aucune section, et le dossier déclare que la condition
  de remplissage d'un cordage **n'est pas vérifiable** et reste une condition d'achat

#### Scenario: Le lien interne n'est pas acheté
- **WHEN** le métré des conduits est produit
- **THEN** aucune liaison interne de 1,20 m n'y figure, parce qu'elle est fournie avec l'appareil,
  et le graphe la traite pourtant comme une arête réelle pour la chute de tension

### Requirement: Une réglette pontée déclare ses points d'alimentation

*Ajoutée le 2026-10-01 : une réglette alimentée par sa voisine n'a qu'un point d'arrivée, et le
socle en exige deux.*

Un composant dont l'alimentation arrive par un cordage DOIT déclarer **au moins deux points
complets**, dans le champ `raccords`, et le socle DOIT refuser un composant qui n'en déclare pas.

**C'est le pontage qui rend ce champ obligatoire, et non l'inverse.** Une réglette reliée à une
boîte de dérivation a deux points : le départ du conduit et l'arrivée de la boîte. Une réglette
alimentée par sa voisine n'en a qu'un, où le cordon la rejoint. Sans déclaration, le composant est
un cul-de-sac, et la règle qui exige deux points — celle qui garantit qu'un appareil est
atteignable, interruptible et identifiable — ne peut plus s'appliquer.

**Un point de raccordement interne n'est pas un point d'alimentation.** Le graphe doit relier les
points déclarés d'un même composant par une arête interne **bidirectionnelle**, afin que le
courant puisse entrer par l'un et ressortir par l'autre. Une arête à sens unique produirait un
composant qui reçoit mais ne restitue rien — un cas que ni la géométrie ni le consommateur ne
sauraient rattraper.

**Un composant à plusieurs points reste sujet à toutes les règles qui s'appliquent aux autres.** Le
pontage ne crée pas d'exception : il ajoute une contrainte. Un composant ponté est toujours soumis
à V13, V14, V17 et à la chute de tension, et le statut `zoneTablier` reste porté par la donnée.

#### Scenario: Une réglette pontée déclare deux points
- **WHEN** la déclaration d'une réglette alimentée par cordage est lue
- **THEN** elle porte un champ `raccords` d'au moins deux points complets

#### Scenario: Une réglette pontée sans `raccords` est refusée
- **WHEN** une réglette n'a qu'un seul point d'arrivée et ne déclare pas `raccords`
- **THEN** la validation la refuse, en nommant le composant et le nombre de points trouvé

#### Scenario: Le lien interne va dans les deux sens
- **WHEN** le chemin du courant entre le point d'entrée et le point de sortie d'une réglette pontée
  est calculé
- **THEN** il existe, et il mesure 1,20 m, la longueur déclarée du câble interne

### Requirement: Une seule boîte distribue les six réglettes

*Ajoutée le 2026-10-01, en remplacement de l'organisation en quatre boîtes.*

La distribution du plafond DOIT reposer sur **une seule boîte de dérivation**, BL-01, posée à
l'intersection des deux colonnes, et les conduites DOIVENT se limiter à **quatre** : CH-L2, qui
arrive du sud, CH-L3 vers l'est, CH-L4 vers l'ouest, et CH-L6 vers le point extérieur.

**Le degré de BL-01 doit valoir 3.** CH-L2 y arrive, CH-L3 et CH-L4 en repartent. La règle des
jonctions de trois conduits s'applique donc, et elle s'applique à la fourche comme à toute autre
boîte. *Elle en valait 4 le 2026-09-26, et la boîte tenait alors quatre conduits : le nombre
d débouchés a suivi le nombre de colonnes.*

**Une seule colonne par direction, et une seule réglette par colonne.** CH-L3 alimente **EL-01f**,
l'extrémité nord de la colonne est ; CH-L4 alimente **EL-01e**, l'extrémité nord de la colonne
ouest. Les quatre autres réglettes ne reçoivent aucun conduit.

**Les identifiants doivent dire la direction.** Les conduites de colonne portent le repère de leur
colonne dans leur nom, et non un simple ordre de création : une relecture du tracé doit pouvoir dire
quelle colonne va où sans ouvrir les données.

#### Scenario: Une seule boîte au plafond
- **WHEN** les boîtes déclarées par cet apport sont dénombrées
- **THEN** il y en a une, BL-01, et son degré vaut 3

#### Scenario: Chaque colonne a une seule conduite
- **WHEN** les arrivées de conduit au plafond sont relevées
- **THEN** il y en a deux, une par colonne, et chacune aboutit à une réglette et à une seule

#### Scenario: Les quatre autres réglettes n'ont pas de conduit
- **WHEN** chaque arrivée de conducteur d'une réglette est relevée
- **THEN** quatre réglettes sur six sont alimentées par cordage, et deux par conduit
