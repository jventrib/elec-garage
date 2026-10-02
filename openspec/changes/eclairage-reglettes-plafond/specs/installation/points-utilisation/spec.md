# Spec Delta

## MODIFIED Requirements

### Requirement: Inventaire des trois points lumineux et règle de repérage

*Origine : `003-eclairage` FR-001. Révisé le 2026-09-26 : le plafond passe de deux sorties à six
réglettes.*

L'installation DOIT comporter exactement **huit points lumineux** — EL-01a à EL-01f, EL-02 et
EL-03 — totalisant **huit sorties d'éclairage**, et aucun autre dans le cadre de cette
fonctionnalité.

**Règle de repérage, tenue partout dans le projet** : un numéro EL désigne un *point lumineux*,
c'est-à-dire **une sortie d'éclairage de son propre point**, et il correspond à une et une seule
sortie physique. *Cette définition a changé le 2026-09-26.* Elle disait auparavant qu'un numéro EL
désignait « ce qui s'allume d'un seul geste », ce qui ne se laisse pas concilier avec six réglettes
distinctes pilotées par un même bouton : la règle aurait alors imposé de les déclarer comme un
point unique. Le groupement par commande est désormais porté par le **circuit**, non par le
repère.

Le groupement des points pilotés ensemble DOIT rester **lisible depuis le repérage** : les six
réglettes partagent le préfixe EL-01 et se distinguent par leur suffixe, a, b, c, d, e, f. Un
lecteur doit pouvoir dire d'un seul regard qu'elles vont ensemble, sans les confondre.

#### Scenario: Recensement des points lumineux
- **WHEN** les points lumineux sont recensés
- **THEN** il y en a exactement huit — EL-01a, EL-01b, EL-01c, EL-01d, EL-01e, EL-01f, EL-02,
  EL-03 — totalisant huit sorties, chacune son point

#### Scenario: Groupement lisible
- **WHEN** les points lumineux sont lus sur le plan de pose
- **THEN** les six réglettes du plafond se reconnaissent à leur préfixe commun EL-01, et aucune
  n'est confondue avec une autre

### Requirement: EL-01, plafonnier à deux sorties

*Origine : `003-eclairage` FR-002, FR-034, FR-035, FR-036. Révisé le 2026-09-26 — l'intitulé devient
« EL-01, six réglettes LED au plafond ». Révisé le **2026-10-01** — distribution pontée et point
dimensionnant recalculé. Critères mesurables : SC-014, SC-016.*

**EL-01 désigne l'ensemble des six réglettes LED 120 cm fixées au plafond** — EL-01a à EL-01f,
réparties en **deux colonnes de trois** : les colonnes aux abscisses **x = 1,45 m et x = 4,15 m**,
les rangs aux profondeurs **y = 1,55 m, 2,90 m et 4,55 m**. Les six sont alimentées et commandées
**ensemble**, par un seul circuit et une seule commande.

Les deux colonnes DOIVENT être **symétriques par rapport à l'axe médian nord-sud** du local, à
x = 2,80 m, de façon à répartir l'éclairement sur toute la largeur.

**Les six sont des points lumineux distincts.** Le fait qu'elles s'allument ensemble est une
question de **commande**, non d'identité du point : chacune est un point, chacune se compte à la
pose et à la réception. Un contrôle de continuité qui les parcourrait comme un seul point
manquerait à les dénombrer.

**Le câblage ne doit pas chaîner les réglettes entre elles, et ne doit pas non plus leur tirer
six conduits.** Les réglettes sont « connectables entre elles, jusqu'à 10 selon la fiche » : le
chaînage série est donc une solution apparemment économique. Elle DOIT être écartée, parce que le
**presse-étoupe PG11 de la réglette est intermédiaire et n'est pas sur le chemin du courant** : le
traverser n'économise aucun conduit et ajoute une dérivation et un contact par corps de luminaire.
*Ce motif ne vaut que contre le chaînage — il ne dit rien contre le pontage, où un câble va d'une
réglette à sa voisine sans traverser aucun presse-étoupe.*

**Les six réglettes sont pontées deux par deux.** Chacune reçoit son alimentation soit d'un conduit
de colonne, soit d'un **cordage** depuis sa voisine. *Révisé le 2026-10-01 : la version du
2026-09-26 exigeait une dérivation propre pour chacune, ce qui imposait sept conduits et quatre
boîtes. Deux colonnes et quatre cordages suffisent, et c'est moins de cuivre, moins de boîte et
moins de main-d'œuvre au plafond.*

**La symétrie de position n'implique pas la symétrie de longueur — et le pontage brise cette
symétrie de parcours.** Les deux colonnes sont à égalité de distance de l'axe médian, mais la
goulotte qui dessert le tableau descend au sud, et **la colonne ouest est la plus longue des deux**,
de 20 cm sur CH-L4.

*Révisé le 2026-10-01* : le point le plus éloigné **n'est plus le point le plus à l'ouest**, mais le
point dont le parcours cumule le plus de mètres. La colonne ouest étant la plus longue, le point le
plus lointain est **EL-01b, à x = 4,15 m**, sur la colonne est. C'est le trajet, non la géométrie,
qui désigne le point dimensionnant, et la conception DOUT le dire plutôt que de supposer une
symétrie de parcours.

#### Scenario: Symétrie des deux sorties
- **WHEN** la position des six réglettes est relevée
- **THEN** les deux colonnes sont à égale distance de l'axe médian nord-sud, et chaque colonne porte
  trois réglettes sur un même axe est-ouest

#### Scenario: Commande d'un seul geste
- **WHEN** CM-01 est actionné
- **THEN** les six réglettes s'allument ou s'éteignent ensemble, d'un seul geste

#### Scenario: Comptage à la réception
- **WHEN** le plafond est contrôlé après pose
- **THEN** six points lumineux distincts sont dénombrés, et non un seul ensemble à six sorties

#### Scenario: Aucun chaînage, mais un pontage
- **WHEN** le câblage du plafond est contrôlé
- **THEN** aucune réglette n'est alimentée par le presse-étoupe d'une autre, et chacune l'est soit
  par un conduit de colonne, soit par un cordage depuis sa voisine

#### Scenario: Point dimensionnant
- **WHEN** la chute de tension du circuit d'éclairage est calculée
- **THEN** elle retient **EL-01b** comme point le plus éloigné, à **18,37 m** de conduit et
  **17,17 m** de phase, et non le point le plus écarté de l'axe médian

## REMOVED Requirements

### Requirement: Axe du plafonnier au nord du tablier ouvert

*Retirée le 2026-09-26 : l'axe à y = 3,25 m ne protège plus le rang sud des six réglettes.*

**Motif du retrait.** L'exigence portait sur l'axe est-ouest des sorties : il devait être au nord
de y = 2,50 m pour qu'aucune sortie ne soit masquée par le tablier remonté. Elle a fait son
office tant que les deux sorties partageaient la profondeur de l'axe. Avec trois rangs, le rang
sud est à **y = 1,55 m**, en retrait de 1,70 m de l'axe : l'exigence d'axe ne dit plus rien de
lui. La conserver serait une garantie vide — elle serait satisfaite par un tracé entièrement sous
le tablier.

Elle est remplacée par l'exigence **Dégagement de chaque réglette du tablier remonté**, qui porte
sur chaque point et non sur l'axe, et qui sait dire qu'elle ne conclut pas.

## ADDED Requirements

### Requirement: Dégagement de chaque réglette du tablier remonté

*Ajoutée le 2026-09-26, en remplacement de l'exigence d'axe au nord du tablier ouvert.*

Chaque réglette du plafond DOIT être **dégagée du volume du tablier de la porte sectionnelle en
position remontée**, et ce dégagement DOIT être **établi par présentation**, non supposé.

**L'épaisseur du tablier n'est pas relevée.** Le dessous du tablier remonté, sa largeur et sa
profondeur depuis la paroi sud sont relevés ; son **épaisseur** ne l'est pas, et le dessus de son
volume est pris au plafond. C'est ce qui fait du volume un **majorant** : un cheminement disjoint
en est est **prouvé dégagé**, un cheminement qui le recoupe reste **non concluant**.

Le statut DOIT être porté par la donnée, et il DOIT distinguer trois états :

- **`degage-prouve`** — la réglette est prouvée hors du volume du tablier. C'est le cas des
  quatre réglettes des rangs médian et nord, au nord de y = 2,15 m.
- **`non-concluant`** — la réglette est dans l'emprise du majorant, et le dégagement ne peut pas
  être établi. C'est le cas des **deux réglettes du rang sud**, EL-01a et EL-01b, à y = 1,55 m.
  *Révisé le 2026-10-01* : **aucun cheminement ne porte plus ce statut.** Les trois segments qui
  l'avaient — CH-L10 seg. 3, CH-L13 seg. 2 et 3 — appartenaient aux colonnes de la distribution en
  étoile, supprimées par le pontage. La réserve s'est déplacée des conduits vers les points.
- **Aucun statut** — pour un point qui n'est pas concerné par le tablier : il n'est pas déclaré
  dégagé, il n'est pas non plus en défaut.

**Un contrôle sans conclusion doit rester un contrôle.** La conception NE DOIT pas convertir un
`non-concluant` en `degage-prouve` par un ajustement de tracé rendu possible parce que le
résultat n'est pas opposable. Si le dégagement ne peut pas être établi, il ne l'est pas.

**L'épaisseur du tablier est une cote à relever.** Elle DOIT figurer comme telle dans le dossier
d'implantation, et non comme une absence. Son relevé est la **seule** action qui referme cette
réserve.

#### Scenario: Réglage du tablier et statut des réglettes
- **WHEN** la position de la porte sectionnelle passe en position remontée
- **THEN** les six réglettes sont examinées, et chacune porte son statut : les quatre réglettes
  des rangs médian et nord sont `degage-prouve`, les deux réglettes du rang sud sont
  `non-concluant`

#### Scenario: Aucun cheminement ne reste non concluant
- **WHEN** les cheminements du plafond sont examinés
- **THEN** aucun ne porte le statut `non-concluant`, le pontage ayant supprimé les colonnes qui
  longeaient le bord ouest sous le tablier

#### Scenario: Relevé de l'épaisseur
- **WHEN** l'épaisseur du tablier est relevée sur place
- **THEN** les deux réglettes du rang sud peuvent être déclarées dégagées ou non, et c'est la seule
  réserve qui reste ouverte sur ce dossier

#### Scenario: Un point non concerné ne porte pas de statut
- **WHEN** une réglette est posée hors de l'emprise du tablier, au nord de sa profondeur relevée
- **THEN** elle est `degage-prouve`, et non simplement dépourvue de statut
