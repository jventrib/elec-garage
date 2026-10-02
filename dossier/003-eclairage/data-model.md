# Phase 1 — Implantation cotée et modèle de données

**Fonctionnalité**: `003-eclairage` | **Date**: 2026-09-21
| Dernière révision | **2026-10-01** — six réglettes **pontées**

> **Ce qui change dans le modèle** : les six réglettes sont désormais **pontées deux à deux** par
> quatre **cordages**, au lieu d'être alimentées chacune par son propre trio remontant du tableau.
> Une réglette alimentée par sa voisine n'a plus qu'**un seul point d'arrivée** au lieu de deux ;
> V24 exige alors qu'elle déclare ses `raccords`, faute de quoi elle serait un cul-de-sac. C'est le
> pontage qui rend ce champ obligatoire. Conséquence immédiate : **trois
> boîtes disparaissent** (BD-07, BD-08, BD-09), **sept cheminements disparaissent** (CH-L9 à
> CH-L15), quatre **cordages** apparaissent (CP-1 à CP-4), et l'agencement des colonnes s'allonge :
> **CH-L3** passe à 4,25 m et **CH-L4** à 4,05 m. Le point dimensionnant **change de côté** : ce
> n'est plus **EL-01a** mais **EL-01b**, et la longueur croît de près de moitié — les 11,73 m de
> l'ancien tracé deviennent 17,17 m au point d'utilisation d'EL-01b.

Toutes les cotes sont dans le repère de la constitution : origine à l'angle sud-ouest de l'œuvre
intérieure au sol fini, x vers l'est, y vers le nord, z vers le haut, unité le mètre.

**Cette implantation a été soumise aux vingt-deux règles du socle avant d'être consignée, fusionnée
avec le tracé réel des prises. Résultat : un seul défaut, et il vient d'une limite du socle et
non du tracé** — voir « Le défaut subsistant » en fin de document. Zéro collision établie.

## Circuit

| Champ | Valeur | Origine |
|-------|--------|---------|
| Identifiant | `c-eclairage` | — |
| Libellé | Éclairage garage | — |
| Points lumineux | 3 — EL-01, EL-02, EL-03 | FR-001 |
| Sorties | 4 — EL-01a, EL-01b, EL-02, EL-03 | FR-002 |
| Commandes | 3 — CM-01, CM-02, CM-03 | FR-029 |
| Conducteurs | 1,5 mm² | Décidée, R2 |
| Conduit | **IRL 20 partout** — branches propres comme tronc partagé | Deux décisions du 2026-09-22 : le tronc ramené de l'IRL 25 à l'IRL 20 contre l'avis de la note (§ 3.2), puis les branches portées de l'IRL 16 à l'IRL 20 |
| Sensibilité différentielle | 30 mA | Principe II |
| Type de différentiel | **à établir** — dépend de FR-050 de `002` | `null` |
| Calibre de protection | **à établir** — valeur normative | `null` |
| Courant d'emploi | **à établir** | `null` |

## Sorties, commandes et boîtes

| Repère | Type | Paroi | Face | x | y | z | Hauteur d'axe | `zoneTablier` |
|--------|------|-------|------|---|---|---|---------------|----------------|
| EL-01a | **réglette LED 120 cm** | plafond | intérieur | **1,45** | **1,55** | 2,75 | *(plafond)* | `non-concluant` |
| EL-01b | **réglette LED 120 cm** | plafond | intérieur | **4,15** | **1,55** | 2,75 | *(plafond)* | `non-concluant` |
| EL-01c | **réglette LED 120 cm** | plafond | intérieur | **1,45** | **2,90** | 2,75 | *(plafond)* | `degage-prouve` |
| EL-01d | **réglette LED 120 cm** | plafond | intérieur | **4,15** | **2,90** | 2,75 | *(plafond)* | `degage-prouve` |
| EL-01e | **réglette LED 120 cm** | plafond | intérieur | **1,45** | **4,55** | 2,75 | *(plafond)* | `degage-prouve` |
| EL-01f | **réglette LED 120 cm** | plafond | intérieur | **4,15** | **4,55** | 2,75 | *(plafond)* | `degage-prouve` |
| BL-01 | boîte de dérivation, **fourche** | plafond | intérieur | 2,70 | **3,25** | 2,75 | *(plafond)* | `degage-prouve` |
| EL-02 | sortie d'éclairage | sud | **extérieur** | 2,70 | −0,20 | **2,22** | 2,22 | — |
| EL-03 | sortie d'éclairage | est | **extérieur** | 5,80 | **2,60** | **2,60** | 2,60 |
| CM-01 | commande | est | intérieur | 5,60 | **2,68** | **1,10** | 1,10 | — |
| CM-03 | commande | est | **extérieur** | **5,80** | **2,60** | **1,10** | 1,10 | — |
| CM-02 | commande *(détecteur)* | sud | **extérieur** | 2,40 | −0,20 | 2,22 | 2,22 | — |

**Les six réglettes sont pontées par paires, et deux d'entre elles seulement reçoivent un
conduit.** CH-L3 et CH-L4 alimentent chacune l'extrémité nord de leur colonne — **EL-01f** à
l'est, **EL-01e** à l'ouest. Le courant descend ensuite de réglette en réglette par les quatre
cordages : **EL-01f →CP-3→ EL-01d →CP-4→ EL-01b** à l'est, **EL-01e →CP-1→ EL-01c →CP-2→ EL-01a**
à l'ouest. Les deux réglettes les plus au sud, **EL-01a** et **EL-01b**, ne sont donc pas
alimentées par un tube mais **par leur voisine** — et ce sont elles qui portent
`zoneTablier: "non-concluant"`, sous le tablier. *Elles n'ont qu'un point d'arrivée, où la
réglette voisine vient les alimenter : V24 exige alors deux points ou plus, d'où `raccords`.*

**Cet apport ne déclare plus qu'une boîte propre : BL-01, la fourche des deux colonnes.**
*Il en déclarait quatre depuis le 2026-09-26 ; le pontage du 2026-10-01 a supprimé les trois
autres, et avec elles le besoin même qui les faisait naître.* Les cinq autres boîtes du circuit
sont **partagées** avec celui des prises et déclarées par `002-prises-de-courant` :

| Boîte partagée | Position | Ce qu'elle sert à l'éclairage |
|----------------|----------|-------------------------------|
| BD-02 | 5,60 / 0,70 / 2,60 | sommet de la montée — départ de la branche vers la façade sud |
| BD-01 | 5,60 / **2,60** / 2,60 | jonction principale du tronc — **et départ en fond de TV-L2** vers EL-03 |
| BD-03 | 5,60 / **2,60** / 2,75 | plafond — départ du parcours commun **droit vers l'ouest** |
| BD-04 | 5,60 / **2,60** / 1,10 | hauteur des commandes — porte le boîtier `bt-commandes` de CM-01, **et le départ en fond de TV-L3** vers CM-03 |
| BD-05 | 2,70 / 3,00 / 2,75 | au droit du socle du moteur — **le virage vers le nord y prend son départ**. Ne suit pas l'axe : PC-05 est calé sur l'extrémité du rail (R5, R11) |

**CM-01** déclare `boitier: "bt-commandes"`, que BD-04 déclare aussi : c'est ce qui la rattache
au tableau, puisqu'elle n'est l'extrémité d'aucun conduit. **CM-03 ne le déclare plus** — elle est
dehors depuis le 2026-09-21 (R11) et rattachée par la traversée TV-L3, qui sort du fond de cette
même boîte.

**Les cinq boîtes partagées portent deux circuits.** Consigner l'éclairage n'y met pas les prises hors
tension, et réciproquement. La constitution l'exige depuis sa v1.10.0 : elles sont repérées comme
telles et la réserve figure à la notice. Voir aussi FR-045 et FR-066 de `002`.

TD-01 n'est pas redéclaré non plus : il appartient à `002` (R10).

Vérifications d'implantation :

- **Les six réglettes sont en deux colonnes, x = 1,45 et 4,15**, symétriques par rapport à l'axe
  médian nord-sud à x = 2,80 (FR-035, SC-016), sur trois rangs en profondeur, y = 1,55 / 2,90 /
  4,55. *La colonne ouest était à x = 1,40 avant le 2026-09-26 ; elle est à 1,45 m depuis.*
- ⚠️ **EL-01a et EL-01b ne sont PAS dégagées du tablier.** Elles sont à y = 1,55 m, dans le
  majorant du tablier remonté qui occupe y de 0 à **2,15 m** — et non 2,50 m, cote qui valait
  avant que la profondeur relevée le 2026-09-23 ne resserre le majorant de 0,35 m. Leur
  dégagement n'est pas établi : **seule l'épaisseur du panneau manque**, le dessus du volume étant
  pris au plafond. Elles portent `zoneTablier: "non-concluant"`.
- **Les quatre autres réglettes sont `degage-prouve`.** C'est un statut **prouvé**, pas supposé :
  elles sont au nord de y = 2,15 m, donc hors de tout volume du tablier.
- **Aucun segment de cet apport n'est `non-concluant`** contre le tablier. Les trois qui l'étaient
  — CH-L10 segment 3, CH-L13 segments 2 et 3, ce dernier longeant le bord ouest à x = 0,40 m —
  appartenaient aux colonnes du plafond, que le pontage a supprimées.
- **Aucun point de la distribution n'est dans l'emprise du rail**, qui occupe x 2,66–2,74 : les
  colonnes sont à 1,45 et 4,15, et BL-01 à 2,70.
- **Les quatre cordages ne touchent aucun obstacle** : ils courent au plafond, en diagonale entre
  deux connecteurs, et leur enveloppe n'a pas d'épaisseur de gaine à éviter.
- **L'axe est à 1,05 m du parcours de plafond des prises**, qui court à y = 3,00 m. Cet écart est
  franc : c'est le décalage vers le nord qui a supprimé le dernier croisement de conduits.
- **EL-02 est centré sur la porte sectionnelle** et sa traversée passe dans la seule bande libre
  sous le rail : **0,12 m de garde au linteau, 0,13 m au rail** (R7). Ce sont les deux cotes
  les plus serrées de la fonctionnalité.
- **EL-03 est à 0,20 m au nord de la baie de la porte de service** et à **2,60 m**, soit la
  hauteur même de l'antenne des prises — mais au **nœud** où celle-ci se termine, dans BD-01, et
  non en travers d'elle (R9). Il est 0,10 m au-dessus du linteau de cette porte, qui s'arrête à
  2,50 m.
- **L'axe de l'appareillage de la paroi est se tient à 0,20 m du bord de la baie** (FR-030,
  R11) : PC-01, PC-02, BD-01, BD-03, BD-04, CM-01, CM-03 et EL-03 sont tous sur y = 2,60, à
  l'exception de CM-01 dont le poste est à 2,68 — la cote réelle d'un montage côte à côte avec la
  boîte. **La cote de 0,20 m est prise sur la baie relevée** ; l'encadrement de la porte n'est pas
  relevé et son débord réduira cette garde d'autant.
- **CM-03 est dehors, dos à dos avec BD-04** à travers 0,20 m de béton. Deux boîtiers dos à dos
  invitent au percement horizontal, qui annulerait la pente exigée par V18 : même point de
  vigilance que FR-058 de `002` pour PC-01 / PC-02.

## Traversées de paroi

| Repère | Paroi | x | y | z | Sens | Pente | Percée derrière |
|--------|-------|---|---|---|------|-------|-----------------|
| TV-L1 | sud | 2,70 | 0 | **2,22** | intérieur → extérieur | oui | boîtier de EL-02 |
| TV-L2 | est | 5,60 | **2,60** | **2,60** | intérieur → extérieur | oui | **fond de BD-01** |
| TV-L3 | est | 5,60 | **2,60** | **1,10** | intérieur → extérieur | oui | **fond de BD-04** |

TV-L1 est percée **derrière le boîtier** de la sortie qu'elle dessert et débouche dans son fond,
selon le schéma retenu par la révision de FR-029 de `002`. TV-L2 fait de même **des deux côtés** :
elle part du fond de BD-01, à l'intérieur, et débouche au fond du boîtier de EL-03, à l'extérieur
— deux enveloppes, aucun point de paroi nu (FR-024 révisé, FR-046). Le point de sortie sur
le nu extérieur est **dérivé** de la position et de l'épaisseur de paroi, jamais saisi.

Les trois contraintes d'exécution de `002` s'appliquent sans changement : entrée en fond du
boîtier, percement **en biais vers le bas**, et percement **avant** la pose du boîtier.

## Cheminements

| Repère | De | Vers | Tracé | Longueur | Circuits |
|--------|----|------|-------|----------|----------|
| *(CH-01)* | TD-01 | BD-02 | montée 1,10 m | 1,10 | **partagé** |
| *(CH-02)* | BD-02 | BD-01 | antenne paroi est | 2,30 | **partagé** |
| *(CH-04)* | BD-01 | BD-03 | montée au plafond | 0,15 | **partagé** |
| *(CH-05)* | BD-01 | BD-04 | descente aux commandes | 1,50 | **partagé** |
| *(CH-07)* | BD-03 | BD-05 | plafond vers l'ouest, **commun avec le socle du moteur** | 2,90 | **partagé** |
| CH-L1 | BD-02 | TV-L1 *(EL-02)* | 0,70 sur la paroi est, 0,38 de descente sud, puis 2,90 | 3,98 | éclairage |
| CH-L2 | BD-05 | BL-01 | **virage vers le nord** | 0,65 | éclairage |
| CH-L3 | BL-01 | **EL-01f** | **colonne est** — nord à y = 4,75, puis traverse à x = 5,00 et redescend sur le flanc est de EL-01f | 4,25 | éclairage |
| CH-L4 | BL-01 | **EL-01e** | **colonne ouest** — nord à y = 4,75, puis traverse à x = 0,60 et redescend sur le flanc ouest de EL-01e | 4,05 | éclairage |
| CH-L6 | EL-02 | CM-02 | **extérieur**, nu sud | 0,30 | éclairage |
| **CP-1** | **EL-01e** | **EL-01c** | **cordage**, diagonale ouest | **2,04** | éclairage |
| **CP-2** | **EL-01c** | **EL-01a** | **cordage**, diagonale ouest | **1,81** | éclairage |
| **CP-3** | **EL-01f** | **EL-01d** | **cordage**, diagonale est | **2,04** | éclairage |
| **CP-4** | **EL-01d** | **EL-01b** | **cordage**, diagonale est | **1,81** | éclairage |

Les cinq premiers, entre parenthèses, sont déclarés par `002` et **portent les deux circuits**.
Ils sont en **IRL 20** depuis la décision du 2026-09-22, et les conduits propres à l'éclairage aussi : le projet ne compte plus qu'**un seul calibre** hors ligne de la borne.

**Métré de conduit propre à l'éclairage : 9,25 m**, en **quatre** cheminements — CH-L2 (0,65),
CH-L3 (4,25), CH-L4 (4,05) et CH-L6 (0,30).
**Métré de cordage : 7,69 m**, en quatre liaisons souples qui ne sont pas du tube.
**Part du tronc partagé : 7,96 m**, portée par CH-L1 et par les cheminements de `002`.

*Les 8,13 m de la révision précédente dataient d'avant les six réglettes ; les 18,91 m du
2026-09-26 portaient sur une distribution individuelle à sept cheminements. Les 9,25 m
d'aujourd'hui sont le prix du **pontage**, et non d'un besoin moindre : six réglettes restent
six réglettes, et le câble des cordages en achète 7,69 m à la place — c'est le deal.*

CH-L5 a disparu le 2026-09-21 : EL-03 emprunte le tube vertical déjà posé sur l'aplomb de PC-01
au lieu d'en poser un second à 0,30 m de celui-là (R9, FR-046).

### Le tronc est partagé avec le circuit des prises

Décision du maître d'ouvrage du 2026-09-21, après une question sur l'opportunité de mutualiser.
La décision antérieure — un conduit dédié — reposait sur un argument fautif, détaillé en R2 : le
taux de remplissage d'un IRL 20 partagé était présenté comme un obstacle alors que c'est une
question de **dimensionnement**.

*Le calibre lui-même a été tranché deux fois : IRL 25 le 2026-09-21, puis **IRL 20** le
2026-09-22, sur décision du maître d'ouvrage et contre l'avis de la note. Cela ne change rien à
l'opportunité du partage, qui est l'objet de cette section — mais laisse ouverte une **condition
d'achat** sur CH-05, seul conduit à porter huit conducteurs. Voir § 3.2 de la note de calcul.*

**Ce que le partage apporte** :

- 5,05 m de tube en moins, et l'éclairage ne pose plus **aucune boîte sur les parois** — la
  sienne est au plafond, BL-01, et elle tient au partage ;
- la bande contrainte de 0,25 m au-dessus du linteau de la porte de service ne porte plus qu'un
  conduit au lieu de deux, ce qui laisse sa place à la ligne de la borne (R3) ;
- le croisement de conduits qui était inévitable **sur la paroi est** disparaît : l'éclairage
  partage la descente au lieu de la franchir (R4).

**Ce qu'il coûte, et qui est assumé** :

- le **facteur de correction de groupement** devient exigible sur les **deux** circuits, ce que
  le Principe III impose dès qu'un conduit en porte plusieurs. La note de calcul de `002`
  portait « Groupement sans objet : conduit dédié » — cette ligne est devenue fausse et a été
  remplacée par une case à confirmer. **T006 devient bloquante pour les deux circuits** ;
- **cinq boîtes portent plus d'un circuit** — OC-01 et OC-02, BD-04, BD-05, BD-06 — avec la
  conséquence de consignation ci-dessus ; *elles étaient six le 2026-09-26, BD-07 en faisant la
  sixième à elle seule* ;
- ~~les commandes remontent à 0,68 et 0,76 m de l'encadrement de la porte au lieu de 0,20 m~~ —
  **coût annulé le même jour** par R11, qui déplace l'axe entier à 0,20 m de la baie plutôt que
  les seules commandes. FR-030 est rendu à sa lettre ;
- le boîtier des commandes **transite le circuit des prises** et doit être dimensionné pour cela.

**Ce qui n'a pas pu être partagé** : le parcours de plafond. Il aurait fallu porter l'axe du
plafonnier à y = 3,00 pour suivre celui des prises, et ses sorties tomberaient alors à x = 4,20,
**sur** la branche des prises vers PC-05 — les conducteurs des prises transiteraient dans le
boîtier d'un luminaire. L'axe est donc resté distinct, puis a été porté à y = 4,05 le même jour,
ce qui a franchement écarté la question.

### Les jonctions, après le pontage

| Nœud | Conduits qui s'y rejoignent | Degré | Boîte |
|------|---------------------------|-------|-------|
| 5,60 ; 0,70 ; 2,60 | CH-01, GL-01 | 3 | **OC-01** |
| 5,60 ; 2,60 ; 1,10 | CH-05, CH-06, TV-L3 | 3 | **BD-04** |
| 2,70 ; 2,60 ; 2,75 | CH-07, CH-08, **CH-L2** | 3 | **BD-05** |
| 5,40 ; 0 ; 2,22 | **CH-L1**, CH-A1 | 3 | **BD-06** |
| **2,70 ; 3,25 ; 2,75** | **CH-L2, CH-L3, CH-L4** | **3** | **BL-01** — *éclairage seul* |

Cinq nœuds de degré 3 ou plus portent une boîte, et **un seul relève de l'éclairage** : BL-01.
Trois autres nœuds de degré 3 ou plus sont **nus** — (5,60 ; 0,70 ; 2,705) au degré 4, (5,60 ;
2,60 ; 2,705) au degré 5, (5,45 ; 5,60 ; 2,705) au degré 3 — et V17 les épargne parce qu'ils sont
couverts par un profilé démontable. Ce sont des angles de goulotte, pas des jonctions.

*Le 2026-09-26, avec les six réglettes distribuées individuellement, il y en avait **sept** :
BL-01 au degré 4, plus BD-07, BD-08 et BD-09 au plafond. Le pontage les a supprimées.*

**BL-01 est la seule boîte que le plafond réclame, et elle tient à trois conduits.** CH-L2 y
arrive du sud, CH-L3 repart vers l'est, CH-L4 vers l'ouest. Au degré 3, V17 l'exige — et c'est
tout ce qu'elle exige. Elle n'a plus de travail de redistribution à faire : chacune des deux
colonnes reçoit son trio unique, et les six réglettes se répartissent ensuite par cordage, sans
quatre boîtes de plus.

**BD-04 est dans le décompte** : son degré est de 3, non de 2. Une traversée ne compte pas dans
le degré — elle occupe du volume, c'est l'objet de FR-046 — et CH-06 y arrive du plafond.

**Le câblage interne ne crée aucune jonction et ne réclame aucune boîte.** Il relie deux nœuds
d'un même appareil, à l'intérieur de son gabarit : V17 ne le voit pas, et il ne le doit pas. Un
câble de 1,20 m n'a rien à voir avec un piquage de conduit.

EL-03 ne se nourrit plus des bornes de CM-03 mais du **fond de BD-01** ; son
retour commandé, lui, vient toujours de CM-03, en remontant CH-05.

## Longueurs depuis le tableau, et chute de tension

Deux longueurs par point depuis le 2026-09-22 : celle du **conduit**, que suivent le neutre et le
PE, et celle de la **phase**, qui passe par la commande. La chute se calcule sur leur somme.

Pour une réglette **pontée**, ces deux longueurs cessent d'être égales pour certains points —
mais **pas pour les six réglettes** : MC-01 commande les six, il est sur le chemin de chacune, et
leur phase comme leur neutre s'arrêtent au **point de raccordement** de la réglette, là où le
cordage de la voisine — ou la colonne, pour les deux têtes — rejoint l'appareil. C'est la valeur
que rend `cheminDePhase` : **17,17 m** pour EL-01b.

*C'est le **point d'utilisation** au sens de la norme : la chute de tension se mesure entre
l'origine et le point où l'installation se raccorde à l'appareil, non à l'intérieur de celui-ci.
Les 1,20 m du câble interne de la réglette sont dans l'appareil et ne sont donc pas comptés pour
la cible.*

| Point | Longueur phase = neutre (point d'utilisation) | ΔU à 0,939 A |
|-------|-----------------------------------------------|--------------|
| **EL-01b** | **17,17 m** ← point le plus défavorisé | **0,210 %** |
| EL-01a | 16,97 m | 0,208 % |
| EL-01d | 14,17 m | 0,174 % |
| EL-01c | 13,97 m | 0,171 % |
| EL-01f | 10,93 m | 0,134 % |
| EL-01e | 10,73 m | 0,131 % |
| EL-02 | 5,88 m — commuté **sur place** par le détecteur | 0,068 % |
| EL-03 | 6,94 m — par CM-03 | 0,063 % |

**Un majorant connu, et écarté volontairement.** Si l'on comptait les 1,20 m internes de la
réglette cible — ce que le socle ne fait pas, et ne doit pas faire au sens du point d'utilisation —,
EL-01b donnerait 18,37 m et **0,225 %**, soit un cumul de **1,88 %** au lieu de **1,86 %**. C'est
une borne supérieure, pas la valeur de l'installation.

*Le graphe ne distingue pas l'entrée de la sortie d'un appareil — c'est délibéré, aucun sens de
câblage n'a à être tenu à la main. Aussi les 1,20 m internes d'une réglette de **transit** sont-ils
parcourus par `cheminDePhase` quand le trajet la traverse (EL-01e et EL-01c pour EL-01a) : c'est
le seul écart de traitement interne, il est signalé, et il reste couvert par le majorant ci-dessus.*

*Avant le pontage, phase et neutre avaient **la même longueur** pour les six réglettes : MC-01 était
sur le chemin de chacune, et la chute suivait donc exactement `2ρLI/S`. Le pontage brise cette
symétrie pour de bon, et c'est voulu.*

*Le tableau est **révisé le 2026-10-01**. EL-01b, qui n'était que le second point le plus éloigné,
devient le **premier** : 17,17 m au point d'utilisation, pour une terminale de **0,210 %**. Le point
dimensionnant a donc changé de lettre, ce qui n'était pas attendu — mais la cause n'est pas le
pontage, qui est un éclairage de fin de ligne sans effet sur le tracé du tableau, mais la géométrie
des colonnes elle-même.*

CM-01 ne figure pas comme point : elle n'est l'extrémité d'aucun conduit et se rattache par son
boîtier `bt-commandes` — le socle sait néanmoins la joindre, à **4,71 m**. CM-03 est à **4,91 m**
et CM-02 à **5,58 m**, mais **une commande n'est pas une charge** : sa longueur ne pèse sur aucun
calcul de chute de tension *pour elle-même*. Elle pèse en revanche sur celui de la **phase** des
points qu'elle commute, et c'est ce que porte la colonne ci-dessus — voir § 2.1 de la note de
calcul.

Chute de tension cumulée avec l'arrivée à pleine charge du disjoncteur d'abonné : **1,86 %** au
point d'utilisation, sur une limite de **3 %** applicable à l'éclairage. Marge de **1,14 point**.

La limite de 3 % paraissait sévère. Le calcul montre qu'elle ne l'est pas : le circuit terminal ne
consomme que 0,210 %, contre 1,65 % pour l'arrivée. **La section n'est pas le sujet**
(R5).

**L'histoire du chemin le plus long, en une ligne** : 8,15 m à l'origine, 7,95 m après la
mutualisation, 9,00 m après le décalage vers le nord, 8,18 m après la goulotte GL-02, 11,73 m le
2026-09-26 avec les six réglettes, puis **17,17 m le 2026-10-01 avec le pontage**. Le dernier bond
est le plus brutal de la série : il coûte 5,44 m de conduit, et la marge recule de 1,21 à **1,14
point**. *Il ne coûte pourtant que 0,07 point de chute, parce que le pontage a supprimé sept
cheminements et trois boîtes du trajet : la distance parcourue est plus grande, mais elle est
remplacée, pas allongée.*

## Séquence de montage

| Phase | Étape | Nature |
|-------|-------|--------|
| consignation | Couper, condamner, vérifier l'absence de tension | consignation |
| **perçage** | **Tracer et percer TOUT** — boîtes, boîtiers, colliers, traversées | pose |
| boîtes | Poser les boîtes de dérivation et les boîtiers d'appareillage | pose |
| colliers et tubes | Clipser les colliers, emboîter les tubes IRL entre les boîtes | pose |
| tirage | Tirer les conducteurs, réserve de 10 à 15 cm par boîte | pose |
| **connexions** | **Raccorder dans les boîtes**, à la borne automatique, et refermer | pose |
| appareillage | Poser et raccorder les mécanismes | pose |
| **tableau** | **Câbler les départs sur les disjoncteurs** — en dernier | pose |
| essais hors tension | Continuité du PE, terre, isolement, serrage, repérage | vérification |
| levée | Lever la consignation | levée |
| essais sous tension | Déclenchement du différentiel, et les essais propres au circuit | vérification |

*Ordre arrêté par le maître d'ouvrage le 2026-09-22, et il corrige trois choses : il n'y avait
aucune phase de **perçage**, les **tubes** étaient posés avant les **boîtes** entre lesquelles ils
s'emboîtent, et le **tableau** venait en deuxième position — on y raccordait les départs d'un
circuit qui n'existait pas encore. Le motif est unique : ne jamais avoir à percer ou fixer un
élément déjà câblé.*

Les **six vérifications du Principe V** y figurent toutes. Deux essais supplémentaires sont
propres à l'éclairage et ne se substituent à aucune :

- **SC-015** exige de vérifier CM-03 **de nuit, en observant depuis l'extérieur**. Une inversion
  de câblage entre deux commandes serait invisible au contrôle de continuité — c'est le seul
  défaut de cette installation qu'aucune mesure ne révèle.
- **SC-017 et SC-018** exigent de régler le champ du détecteur pour qu'il ignore la voie
  publique et la propriété voisine, et de **consigner** la temporisation retenue.

La **consignation et sa levée sont partagées** avec `002` : le socle n'en gardera qu'une.

## Attention — un point reste sous tension après la consignation du circuit

FR-042 impose que EL-02 soit **alimenté en permanence**, le détecteur commutant sur place. Toute
intervention sur EL-02 ou sur CM-02 exige donc sa propre consignation, et la levée de
consignation du circuit d'éclairage **ne suffit pas** à le mettre hors tension par la suite.

C'est la contrepartie du choix de la détection de présence, et elle doit figurer sur la notice
plutôt que dans la mémoire de celui qui a posé.

## Règles de validation applicables

| Règle | Ce qu'elle établit sur cette implantation |
|-------|-------------------------------------------|
| V16 | Chaque sortie et chaque commande est atteignable depuis TD-01 par le tracé réel — CM-01 par le boîtier qu'elle déclare, CM-03 par la traversée qui la dessert |
| V17 | Les jonctions de trois conduits ou plus portent une boîte. **Cinq nœuds de degré 3 en dépendent** : (5,60 ; 0,70 ; 2,60), porté par **OC-01** ; (5,60 ; 0,70 ; 2,705), **nu** et couvert par le profilé démontable de la goulotte ; (2,70 ; 2,60 ; 2,75), porté par **BD-05** ; (5,40 ; 0 ; 2,22), porté par **BD-06** ; et (2,70 ; 3,25 ; 2,75), la fourche **BL-01**. *Le pontage du 2026-10-01 a supprimé BD-07, BD-08 et BD-09 : **BL-01 reste la seule boîte propre à cet apport**, et les nœuds de (5,60 ; 2,60 ; 2,705) et (5,45 ; 5,60 ; 2,705) sont retombés au degré 2.* |
| V19 | Aucun conduit ne franchit la fenêtre nord, la porte de service ni la porte sectionnelle |
| V13, V14 | Les **seize** segments des cinq conduits de cet apport sont orthogonaux et reposent sur un nu déclaré. Les **quatre** cordages — un segment chacun — sont en diagonale et **V13 les épargne** : un lien souple entre deux connecteurs n'a pas à longer une grille de plafond, mais V14 leur impose de reposer sur leur nu |
| V18 | Les **trois** traversées déclarent leur pente vers l'extérieur |
| V3 | Chaque sortie, commande, boîte, conduit et traversée est posé par une étape identifiée |
| V8 | Aucune étape sous tension ne précède la levée de consignation |

**Collisions** : zéro établie. Le rail, entièrement relevé, est dégagé par tous les segments des
deux circuits.

## Le défaut qui subsistait au plan, et qui a été levé

```
V16 | CM-03 | « CM-03 » n'est atteignable depuis le tableau par aucun cheminement
              portant le circuit « Éclairage garage ».
```

**Levé le 2026-09-21 par l'extension du socle (T036).** Le texte ci-dessous décrit l'état au plan.

CM-01 et CM-03 partageaient alors un boîtier à deux postes. CM-03 n'était donc l'extrémité
d'aucun conduit, et le socle ne connaissait pas la relation « même boîtier ». Ce n'était pas un
défaut de l'implantation : c'était le socle qui ne savait pas encore dire ce que l'implantation
exprimait.

*Depuis, CM-03 est passée dehors et c'est une traversée qui la dessert. Le mécanisme du boîtier
partagé reste nécessaire, mais pour **CM-01** seule, qui n'est l'extrémité d'aucun conduit.*

L'extension est bornée : un composant peut déclarer le boîtier qu'il partage, et V16 le tient
pour atteignable si ce boîtier l'est. Trois fichiers, un champ de contrat. Voir le plan.

Les deux contournements ont été écartés. Déclarer les deux commandes **au même point**
superposerait deux marqueurs, alors que FR-006 exige la cote réelle. Tracer entre elles un
**conduit de 8 cm** fabriquerait un conduit qui n'existe pas — et c'est précisément le genre de
donnée fausse que le reste du dossier s'applique à éviter.

## Ce qui n'est pas concluant, et pourquoi

**Plus aucun segment de l'éclairage n'est non concluant contre le tablier ouvert**, depuis le
2026-09-22.

Le troisième segment de CH-L1, qui longe la paroi sud à 2,22 m pour rejoindre la traversée vers
EL-02, l'était : le majorant du tablier couvrait toute la largeur de la baie **de 2,10 m au
plafond**, et EL-02 se trouve derrière cette baie. Ce n'était pas évitable — par le dessus on
rencontre le rail, par le dessous on franchit l'ouverture.

**La cote qui manquait a été relevée : la sous-face du tablier remonté est à 2,31 m.** Le
majorant s'arrête donc à 2,31 m au lieu de 2,10 m, le conduit passe 0,09 m dessous, et son
dégagement est **démontré**. C'est exactement ce que la déclaration d'un majorant sert à obtenir :
la mesure n'a pas eu à refaire le tracé, elle a seulement rendu concluant ce qui ne l'était pas.

*La valeur de 2,31 m avait été pressentie ici même — le rail étant relevé à 2,35 m — et
délibérément non écrite : la deviner aurait substitué une valeur plausible à une inconnue, et le
contrôle serait passé au vert sans rien démontrer.*

`TODO(TABLIER_OUVERT)` **cesse de gêner `003` en position ouverte**. Il reste ouvert en position
**fermée**, où rien dans le relevé ne borne la saillie du panneau vers l'intérieur du local — mais
aucun cheminement de ce dossier n'en dépend.

## Le lien interne, et pourquoi il est hors de la chute de tension

**`cheminDePhase` s'arrête au connecteur d'arrivée, et c'est voulu.** La chute de tension se mesure
entre l'origine et le **point d'utilisation** — là où l'installation se raccorde à l'appareil —,
non à l'intérieur de celui-ci. Les 1,20 m du câble interne de la réglette sont dans l'appareil : ils
ne sont pas comptés pour la cible, et le circuit déclaré accuse donc 0,210 % sur EL-01b, pour un
cumul de **1,86 %**.

**Le majorant est connu, chiffré, et écarté.** Si on les comptait, EL-01b ferait 18,37 m, 0,225 % et
**1,88 %** de cumul. C'est une borne supérieure, pas une réserve ouverte : la convention retenue au
contrat est celle du **point d'utilisation**, et les deux valeurs restent sous la limite de 3 %.

*Une seule asymétrie subsiste, et elle penche du bon côté : les 1,20 m internes d'une réglette de
**transit** (EL-01e, EL-01c pour EL-01a) sont, eux, parcourus par `cheminDePhase` quand le trajet
traverse l'appareil — le lien interne est modélisé comme une arête. La valeur déclarée de 1,86 %
peut donc surestimer le point d'utilisation strict : elle ne le sous-estime jamais.*

## Ce qui reste `null`, et pourquoi

| Champ | Raison |
|-------|--------|
| `indiceProtection` des huit composants | Relève du choix de matériel. Pour EL-02, EL-03, CM-02 et leurs boîtiers, dépend de `TODO(CONDUIT_EXTERIEUR)`, que la liaison de 0,30 m rouvre |
| Type de différentiel du circuit | Dépend de la décision FR-050 de `002` |
| Calibre de protection, courant d'emploi | Relèvent de la note de calcul et de valeurs normatives non confirmées |
| Temporisation du détecteur | Réglage de chantier, à consigner (SC-018) |
| `provenance.schemaUnifilaire` et `noteDeCalcul` | Ces documents n'existent pas encore |

Ces valeurs s'afficheront **« inconnu »** dans la maquette, conformément à FR-007 de `001`, et
non comme des valeurs plausibles.
