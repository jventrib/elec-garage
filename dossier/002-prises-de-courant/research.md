# Phase 0 — Recherche et décisions de conception

**Fonctionnalité**: `002-prises-de-courant` | **Date**: 2026-09-21

Aucune inconnue de donnée d'entrée ne subsiste. Les décisions ci-dessous portent sur la
conception : le tracé, les boîtes, la répartition des livrables, et la frontière entre ce qui
se calcule et ce qui se lit dans la norme.

---

## R1 — Le tracé doit franchir la porte de service par le haut

**Decision**: une **antenne horizontale sur la paroi est**, avec des descentes vers les zones
d'utilisation. Pas de parcours bas au niveau des socles.

**Rationale**: ce n'est pas un choix d'esthétique, c'est une contrainte géométrique dont la
démonstration est courte. Le tableau est au sud de la porte de service, entre 0 et 1,30 m de
l'angle sud-est. Les socles sont au nord de cette porte, PC-01 devant se trouver « au-delà de
la porte de service en venant de la façade » (FR-002). Or la porte de service occupe la paroi
est de 1,30 m à 2,40 m, **et elle descend jusqu'au sol**.

Tout conduit reliant le tableau aux socles en longeant la paroi est doit donc traverser cette
bande. À 0,30 m — la hauteur des socles — il passerait **en travers de la baie**, ce que FR-030
interdit et que la règle V19 du socle rejetterait. La seule voie sur cette paroi est au-dessus
du linteau.

**Alternatives considered**:
- *Parcours bas de 0,30 m le long de la paroi est* : le tracé le plus court et le plus direct,
  et il est **impossible** — il franchit la porte de service. C'est l'alternative qu'on retient
  spontanément, et elle tombe dès qu'on regarde la baie.
- *Passage par le plafond* : réalisable, mais plus long, et il place du conduit dans la zone du
  rail et du tablier, dont l'encombrement n'est pas entièrement relevé.
- *Contournement par les parois nord et ouest* : allonge le parcours de plusieurs mètres pour
  desservir des points tous situés sur la paroi est.

---

## R2 — Antenne à 2,60 m

**Decision**: l'antenne court à **2,60 m** du sol fini sur la face intérieure de la paroi est.

**Rationale**: la porte de service est haute de 2,50 m. À 2,50 m exactement, le conduit
affleurerait son linteau : la règle V19 l'admettrait, le contact franc n'étant pas un
franchissement, mais physiquement on ne fixe pas un conduit sur l'arête d'un linteau. Dix
centimètres de garde suffisent et restent 15 cm sous le plafond, ce qui laisse la place des
colliers.

**Alternatives considered**:
- *2,50 m* : rejeté pour la raison ci-dessus. C'est le cas où une règle de contrôle dit oui
  alors que la pose dit non — le contrôle géométrique ne dispense pas du bon sens.
- *2,70 m* : fonctionne aussi, mais rapproche inutilement le conduit du plafond et du rail.

---

## R3 — Une boîte de pied au bas de chaque descente — **RENVERSÉE le 2026-09-21**

> **Cette décision est abandonnée.** Le circuit ne comporte plus aucune boîte de pied, et une
> seule boîte de dérivation au total. La décision est conservée ici avec son raisonnement
> d'origine, parce que c'est l'endroit où l'erreur se lit le mieux.
>
> Ce qui l'a renversée : la prémisse de **R4** était fausse. Un boîtier saillie n'occupe pas
> l'axe du percement, **c'est la boîte**, et il comporte une entrée en fond. La traversée se
> perce donc derrière le socle intérieur et débouche dans son fond. Le pied de descente n'est
> alors plus une jonction de trois conduits mais de deux, et la boîte n'a plus d'objet.
>
> Noter que l'alternative « chaînage des socles entre eux » était écartée ci-dessous au motif
> qu'« un socle n'est pas une boîte de dérivation ». C'est précisément ce point qui était
> l'erreur : les bornes d'un socle en saillie sont logées dans un boîtier accessible, et la
> constitution l'admet depuis son amendement **v1.8.0**, sous quatre conditions cumulatives.
> La règle proscrivait une connexion *derrière* un appareil, non *dans* son boîtier.

**Decision (historique)**: chaque descente se termine sur une **boîte de dérivation à 0,30 m**,
d'où partent le socle intérieur d'un côté et la traversée vers l'extérieur de l'autre. Deux
boîtes de pied, plus deux boîtes de jonction sur l'antenne.

**Rationale**: au pied de chaque descente il faut repartir dans deux directions — le socle
intérieur et la traversée. C'est une jonction de trois conduits, et la constitution interdit
toute connexion hors boîte. La règle V17 du socle la détecterait de toute façon : un nœud de
degré trois sans boîte est un défaut bloquant.

L'alternative consisterait à faire deux descentes séparées depuis l'antenne, mais elles
partiraient du même point et suivraient la même verticale — ou obligeraient à se brancher en
milieu d'antenne, ce qui exige une boîte là aussi. Une descente et une boîte de pied coûtent
donc **moins** de boîtes que deux descentes.

**Alternatives considered**:
- *Deux descentes indépendantes par zone* : plus de conduit, plus de boîtes, et un piquage en
  milieu d'antenne.
- *Chaînage des socles entre eux* : un socle n'est pas une boîte de dérivation ; raccorder en
  entrée-sortie derrière un socle est précisément ce que la constitution proscrit.

---

## R4 — La traversée est décalée de part et d'autre de la boîte de pied — **RENVERSÉE le 2026-09-21**

> **Cette décision est abandonnée, et c'est celle qui contenait l'erreur.** Sa prémisse — « le
> boîtier en saillie occupe l'axe du percement » — traitait le boîtier comme un obstacle. Un
> boîtier saillie n'est pas un obstacle au point de percement : **c'est la boîte**, et il a une
> entrée en fond. La traversée se perce donc derrière le socle intérieur et débouche dedans.
>
> L'alternative « percer derrière la boîte de pied » était écartée ci-dessous au motif qu'« une
> traversée sous une boîte serait indémontable ». Cet argument valait pour une boîte de pied
> *distincte* du socle ; il ne vaut pas pour le boîtier du socle lui-même, qu'on dépose en
> retirant l'appareil.
>
> Conséquences en cascade : plus de décalage, plus de boîte de pied, plus de conduit extérieur —
> les 0,90 m de CH-07 et CH-10 en façade disparaissent —, et la marge de TV-01 à la porte de
> service passe de 0,10 m à 0,60 m. Voir FR-029 révisé, FR-057 à FR-060.

**Decision (historique)**: à chaque zone, le socle intérieur et la traversée se placent **de part
et d'autre** de la boîte de pied, à environ 0,20 m de celle-ci. Le conduit extérieur relie
ensuite la sortie de traversée au socle extérieur, sur environ 0,40 m.

**Rationale (historique, erroné)**: FR-029 interdit de percer au droit exact du socle intérieur,
dont le boîtier en saillie occupe l'axe du percement. Il faut donc décaler. Placer la traversée du côté opposé au
socle par rapport à la boîte évite aussi de la percer derrière la boîte elle-même. Le décalage
résiduel de 0,40 m entre traversée et socle extérieur est la conséquence arithmétique de ces
deux évitements, et il est coté au plan comme FR-029 l'exige.

**Alternatives considered**:
- *Percer derrière la boîte de pied* : la boîte occupe le point, et une traversée sous une
  boîte serait indémontable.
- *Décaler de 0,05 m seulement* : ne dégage pas le boîtier, dont la largeur est de l'ordre de
  0,10 m pour un socle double.

---

## R5 — PC-05 provisoire, au nord du rail

**Decision**: PC-05 au plafond, **centré sur la baie** — là où se trouve la tête de motorisation
— et à 0,20 m au nord de l'extrémité du rail, soit à 2,70 m de la paroi sud. Position marquée
**provisoire**.

**Rationale**: le rail est relevé et ce dégagement est concluant. Mais le tablier en position
ouverte occupe toute la largeur de la baie, et son encombrement est inconnu. Si sa profondeur
dépasse les 2,50 m du rail, PC-05 devrait reculer. Le contrôle de collision rendra donc « non
concluant » sur cet obstacle, et FR-053 interdit d'arrêter l'implantation sur la seule
vérification du rail.

**Alternatives considered**:
- *Attendre le relevé du tablier* : bloquerait toute la conception pour un point sur cinq.
- *Reculer PC-05 à 3,50 m par prudence* : inventerait une marge, et éloignerait le socle de la
  tête de motorisation au risque de ne plus être atteignable par son cordon d'origine (FR-007).

---

## R6 — Ce que je calcule, et ce que je ne calcule pas

**Decision**: la note de calcul distingue explicitement deux catégories de valeurs, et marque
la seconde comme **à confirmer sur le texte de la norme**.

| Calculé ici | Pris dans la norme, à confirmer |
|-------------|---------------------------------|
| Longueur du chemin le plus long (géométrie du tracé) | Courant admissible de 2,5 mm² pour ce mode de pose, et lettre de sélection |
| Chute de tension, ΔU = 2ρLI/S | Facteurs de correction de température |
| Bilan de puissance et cumul avec la borne | Taux de remplissage admissible d'un conduit |
| Section géométrique occupée dans le conduit | Nombre maximal de socles par circuit pour cette section |
| | Appariement section / calibre de protection |

**Rationale**: le Principe I exige qu'une exigence soit rattachée à sa clause et qu'« une règle
citée sans référence ne soit pas opposable ». Je peux conduire les calculs physiques, qui ne
dépendent d'aucune table. Je ne peux pas restituer de mémoire, avec la fiabilité qu'exige une
valeur de sécurité, les tables de courant admissible ni les limites de décompte. **Un chiffre
plausible sur une valeur de sécurité est plus dangereux qu'une case vide** : il a l'apparence
d'une vérification et n'en est pas une.

**Alternatives considered**:
- *Renseigner de mémoire les valeurs usuelles* : rapide, et c'est exactement ce que la
  constitution qualifie de non opposable. Le Principe III rejette d'ailleurs la valeur
  « habituelle » comme justification.
- *Ne rien produire avant d'avoir la norme* : priverait le dossier de tout le travail
  calculable, qui est la majeure partie.

---

## R7 — Décompte des prises : huit, et non cinq

**Decision**: **huit prises**, un socle double comptant pour **deux**. FR-013 a été corrigé le
2026-09-21 en ce sens.

**Rationale**: le décompte de la NF C 15-100 porte sur les **prises** et non sur les boîtiers.
La version initiale de FR-013 énonçait « un socle double comptant pour un », ce qui sous-estimait
le décompte de trois prises. Deux sources secondaires concordantes l'ont contredit, et la
distinction terminologique entre « prise » et « socle contenant plusieurs prises » est
explicitement relevée par la documentation Legrand.

L'erreur était sans conséquence sur la conception — huit prises restent sous la limite usuelle
de douze pour 2,5 mm² protégés à 20 A — mais elle aurait faussé la vérification, et c'est
précisément la vérification qui sert à quelque chose. La limite elle-même reste une valeur
normative à confirmer, au titre de R6.

---

## R8 — Contribution aux phases de chantier

**Decision**: 002 verse des étapes dans sept des neuf phases du catalogue : `consignation`
(étape partagée, dédupliquée par le socle), `tableau`, `cheminement`, `boites`, `tirage`,
`appareillage`, `essais-hors-tension`, `levee-consignation` (partagée) et
`essais-sous-tension`.

**Rationale**: le catalogue du socle est fermé et l'ordre en découle. La consignation et sa
levée sont des étapes communes que le socle déduplique (FR-025 de 001) : 002 les déclare, le
socle n'en garde qu'une même lorsque l'éclairage les déclarera aussi.

Les six vérifications du Principe V doivent toutes figurer, dont l'essai de déclenchement du
différentiel en phase `essais-sous-tension` et les cinq autres hors tension. La règle V10 le
contrôle.

---

## R9 — Place réservée au conduit de la borne

**Decision**: réserver **60 mm de largeur libre** le long de l'antenne et des descentes de la
paroi est, du côté opposé au nu, pour le futur conduit dédié de la borne.

**Rationale**: FR-047 l'exige, et le Principe IV impose que la ligne de la borne ait son propre
conduit. Celui-ci sera plus gros que l'IRL 20 des prises, ses conducteurs étant dimensionnés
pour 32 A. Réserver la place maintenant coûte un trait sur un plan ; ne pas le faire coûte un
déplacement de conduit posé.

**Alternatives considered**:
- *Ne rien réserver et aviser* : en pose apparente, deux conduits côte à côte ont besoin de
  leur largeur et de leurs fixations. C'est la contrainte que la pose encastrée n'avait pas.
- *Réserver un chemin distinct pour la borne* : plus propre encore, mais prématuré tant que le
  point de charge n'est pas spécifié.

---

## R10 — Les conclusions de la note de calcul sont des données

**Decision**: les conclusions de la note — section, calibre, sensibilité et type de
différentiel, courant d'emploi, chute de tension — sont portées par l'**entité circuit du
contrat d'apport de 001**, qui est étendue pour cela. Le document
[note-de-calcul.md](./note-de-calcul.md) porte le raisonnement, les références normatives et
l'état de confirmation de chaque valeur ; son contenu obligatoire est contractualisé dans
[contracts/note-de-calcul.md](./contracts/note-de-calcul.md).

Un fichier de données distinct pour la note a été envisagé puis écarté : il aurait recréé la
duplication que la règle V12 proscrit ailleurs, chaque valeur existant alors à deux endroits
susceptibles de diverger. Une conclusion vit au seul endroit où elle est consommée — l'apport —
et le document dit pourquoi elle vaut cela.

**Rationale**: aujourd'hui l'entité circuit du contrat d'apport ne contient que `id`, `libelle`
et `couleur`. La maquette ne peut donc **rien** afficher des caractéristiques électriques d'un
circuit, alors que le Principe III exige que chaque circuit soit documenté avec son courant
d'emploi, son calibre et sa chute de tension. C'est un trou dans le socle, révélé par la
première fonctionnalité électrique qui l'alimente.

Verser ces valeurs en données plutôt que seulement en prose donne deux choses : la maquette
cesse d'afficher « inconnu » dès que la note existe, et les valeurs restent soumises à la règle
du projet — une valeur non déterminée reste `null` et se voit comme telle.

**Alternatives considered**:
- *Note de calcul en prose uniquement* : le dossier serait complet et la maquette resterait
  aveugle. Elle continuerait d'afficher « inconnu » sur des valeurs pourtant établies.
- *Recopier les valeurs dans l'apport* : créerait la duplication que la règle V12 proscrit
  ailleurs. D'où un fichier de note distinct, référencé, et non recopié.

---

## Inconnues restantes

Aucune inconnue de conception. Trois réserves, toutes documentées au plan Spec Kit, supprimé le 2026-09-22 et remplacé par `openspec/specs/` :

- les **valeurs normatives** de R6, à confirmer sur le texte de la norme ;
- `TODO(TABLIER_OUVERT)`, qui laisse PC-05 provisoire ;
- `TODO(CONDUIT_EXTERIEUR)`, qui laisse deux indices de protection à `null` ;

et une décision en attente, **FR-050**, sur le remplacement de l'interrupteur différentiel de
type AC.
