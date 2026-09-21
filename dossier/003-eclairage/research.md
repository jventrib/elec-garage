# Phase 0 — Recherche et décisions

**Fonctionnalité**: `003-eclairage` | **Date**: 2026-09-21

Chaque décision est vérifiée sur les données : l'implantation candidate a été fusionnée avec le
tracé réel des prises et soumise aux vingt-deux règles avant d'être écrite ici.

---

## R1 — L'axe du plafonnier est décalé au nord, au centre du plafond utilisable

> **Révisé le 2026-09-23 par décision du maître d'ouvrage** : l'axe recule à **y = 3,25 m**, CH-L2
> étant jugé trop long. Voir `implantation.md`. La décision de 4,05 m ci-dessous est conservée.

**Decision (révisée le 2026-09-21)**: les deux sorties sont sur un axe est-ouest à
**y = 4,05 m**, aux abscisses **x = 1,40 m** et **x = 4,20 m**. Le conduit est **commun avec
celui du socle du moteur** jusqu'à BD-05, prend ensuite un **virage vers le nord** de 1,05 m
jusqu'à BL-01, et se **fourche** enfin vers les deux sorties.

**Rationale**: trois contraintes, et une décision du maître d'ouvrage.

- FR-003 exige l'axe **au nord de l'emprise du tablier ouvert**, bornée à y ≤ 2,50 m par la
  course du rail.
- FR-035 exige les deux sorties **symétriques par rapport à l'axe médian nord-sud**, soit
  x = 2,80 m. Les quarts de la largeur, 1,40 et 4,20, répartissent l'éclairement sans coller aux
  parois. Inchangé.
- Le tablier interdit la moitié sud du plafond. **La bande utilisable va de 2,50 à 5,60 m**, et
  son centre est à **4,05 m**.

Le maître d'ouvrage a demandé le 2026-09-21 de décaler l'axe vers le nord et de faire matérialiser
ce décalage par le tracé : conduit commun jusqu'au droit du socle du moteur, virage, puis fourche.
La cote de 4,05 m a été retenue parce qu'elle centre les sorties sur ce que le tablier laisse
disponible.

**Ce que la version antérieure disait, et pourquoi elle a changé.** L'axe était à y = 2,80 m,
c'est-à-dire au **centre géométrique du local**, et cette décision faisait valoir que la
contrainte du tablier n'avait rien coûté puisque l'optimum non contraint la satisfaisait déjà.
Le raisonnement était juste mais il centrait sur le **local**, non sur le **plafond disponible** —
et un point lumineux éclaire depuis le plafond. La moitié sud étant interdite, centrer sur le
local revenait à placer les sorties au bord de la zone où elles peuvent être posées.

**Ce que le décalage coûte** : la baie de stationnement ne reçoit plus qu'un éclairement oblique.
C'est accepté, et ce n'est pas grave — un véhicule garé masquerait de toute façon ce qui vient
d'au-dessus de lui, l'aire de manœuvre a son propre point en façade, et la circulation autour du
véhicule comme le fond du local sont ce qu'on éclaire vraiment.

**Ce que le tracé y gagne, et qui n'était pas recherché** : le dernier **croisement de conduits
disparaît**. L'axe à 2,80 m franchissait la descente des prises vers le socle du moteur, en
(2,70 ; 2,80 ; 2,75) — un croisement pur, qu'aucune règle du socle ne détecte. L'éclairage part
désormais **de** ce point au lieu de le traverser. Voir R4.

**Vérifié** : les deux sorties sont à 1,55 m au nord de la borne du tablier, symétriques à 1,40 m
de l'axe médian, et aucun segment du circuit ne croise un conduit des prises.

**Alternatives considered**:
- *y = 2,80, le centre du local* : c'était la décision antérieure. Elle laissait les sorties au
  bord du plafond utilisable et imposait un croisement de conduits.
- *y = 3,50, décalage modéré* : 0,55 m de tube en moins et une répartition plus équilibrée vers
  le sud, mais l'axe reste au tiers de la bande disponible.
- *y = 4,60, décalage franc* : éclaire au mieux le fond, mais l'abord de la porte sectionnelle
  n'est plus éclairé qu'en rasant.

---

## R2 — Le circuit d'éclairage partage le tronc des prises — **RENVERSÉE le 2026-09-21**

> **Cette décision est abandonnée, et son argument principal était fautif.**
>
> Elle écartait le partage au motif que 8 conducteurs dans un IRL 20 donnent de 28,8 % à 36,7 %
> de remplissage selon la cote produit, donc « la conclusion dépend d'une cote non relevée ».
> C'est exact et **hors sujet** : il suffit d'un conduit plus gros sur la partie commune. Un
> IRL 25 donne 21,5 %. J'ai fait passer une question de **dimensionnement** pour une
> impossibilité — un raisonnement qui a l'air rigoureux et qui ferme une option sans motif.
>
> Le maître d'ouvrage a demandé le 2026-09-21 pourquoi ne pas mutualiser autant que possible, et
> a retenu la **mutualisation maximale** après correction des chiffres.

**Decision (2026-09-21)**: le tronc est **partagé** entre les deux circuits — montée du tableau,
antenne de la paroi est, montée au plafond, descente vers les commandes. **5,05 m** de conduit
commun, en calibre supérieur, et **quatre boîtes de dérivation partagées**. L'éclairage ne
possède plus aucune boîte en propre.

**Ce que le partage donne réellement** :

| | Avant | Après |
|---|---|---|
| Conduit posé, deux circuits | 28,93 m | **23,88 m** (−5,05 m) |
| dont propre à l'éclairage | 15,13 m | **10,08 m** (−33 %) |
| Boîtes de dérivation | 4 | **4**, toutes partagées |
| Calibre du tronc | IRL 20 + IRL 16 | **IRL 25** sur la partie commune |

**Rationale**: le gain de matériel est réel — 5 m de tube, et autant de colliers, de chevilles et
de trous dans le béton. Le maître d'ouvrage l'a retenu en connaissance des trois contreparties
ci-dessous, qui ne sont pas des détails.

**Trois contreparties, assumées** :

1. **Le facteur de groupement devient exigible sur les deux circuits.** Le Principe III l'impose
   dès que plusieurs circuits partagent un conduit, et son rationale nomme ce cas. La note de
   calcul de `002` portait « Groupement sans objet : conduit dédié » ; cette ligne est **devenue
   fausse** et a été remplacée par une case à confirmer. Le facteur s'applique donc au circuit
   des prises, dont la marge face à son courant admissible est déjà la question ouverte de sa
   note. **T006 devient bloquante pour les deux circuits**, non plus pour l'éclairage seul.
2. **Quatre boîtes portent deux circuits.** Consigner l'un n'y met pas l'autre hors tension.
   C'est une condition de maintenance permanente, à écrire sur la notice — elle a motivé un
   amendement de la constitution et l'exigence FR-066 de `002`.
3. **Le boîtier des commandes transite le circuit des prises**, et les commandes remontent à
   y = 3,08 et 3,16 m, soit 0,68 et 0,76 m de l'encadrement de la porte au lieu de 0,20 m. FR-030
   disait « immédiatement à côté » : il a été amendé.

**Ce qui n'a pas pu être partagé, et pourquoi** : le **parcours de plafond**. Il aurait fallu
placer l'axe du plafonnier à y = 3,00 pour suivre celui des prises, et ses sorties seraient alors
à x = 1,40 et 4,20 — or x = 4,20 tombe **sur** le parcours des prises vers PC-05. Les
conducteurs des prises transiteraient dans le boîtier d'un luminaire. C'est ce que le chiffrage
initial de 6,45 m supposait sans le dire, et c'est écarté. L'axe reste donc au centre du local
(R1 est conservée).

**Alternatives considered**:
- *Mutualisation partielle, les tubes sans les boîtes* : garde l'essentiel du gain de tube et
  aucune des trois contreparties. Écartée par le maître d'ouvrage.
- *Aucun partage* : c'était la décision antérieure, fondée sur un argument de remplissage qui ne
  tenait pas.

---

## R3 — La congestion de la paroi est, résolue par le partage

**Decision**: le partage du tronc **résout** le problème que cette décision avait identifié. La
paroi est ne porte plus qu'**un** conduit dans la bande contrainte, au lieu de deux, et la
réservation étendue de `002` garde sa place à la ligne de la borne.

**Le problème, tel qu'il avait été trouvé** : la porte de service monte à 2,50 m et part du sol,
donc tout parcours reliant le tableau au nord du local doit passer entre **2,50 et 2,75 m** —
**0,25 m de hauteur utile** pour l'ensemble des circuits. FR-047 de `002` ne réservait la place
que d'**un** conduit à venir, celui de la borne, alors que la paroi en portera trois. Le compte
était faux dès la rédaction.

**Ce que le partage change** : les prises et l'éclairage n'occupent plus qu'un seul conduit dans
cette bande, en calibre supérieur. Il reste donc la place de la borne sans empilement. C'est un
bénéfice que le chiffrage en mètres ne fait pas voir, et il est plus solide que l'économie de
tube : une bande de 0,25 m au-dessus d'une porte est une contrainte qu'on ne desserre pas après
la pose.

FR-047 reste révisé et FR-063 reste utile : la réservation porte désormais sur **deux** conduits
**superposés** — le tronc partagé et celui de la borne — et non trois. Sur une paroi, « côte à
côte » veut dire l'un au-dessus de l'autre : deux parcours horizontaux parallèles ne peuvent pas
être à la même altitude.

*La place a été attribuée le 2026-09-22 : la ligne de la borne prend le dessus, axe entre 2,635 et
2,727 m en IRL 25, et traverse BD-01 portée à six entrées (FR-036 et FR-037 de `004-borne-recharge`). Ce que
R3 avait mis de côté est donc consommé, et la bande est pleine.*

---

## R4 — Le croisement de conduits a disparu

**Decision**: il n'y a **plus aucun croisement** entre les deux circuits. **T007 est résolue.**

*Mise à jour du 2026-09-22 — la lacune du socle annoncée ici est refermée.* La règle **V20** a
été écrite : deux conduits ne peuvent plus se recouvrir sans qu'un défaut soit signalé. Ce qui
l'a déclenchée n'est pas la prudence mais une **erreur** : en arbitrant le passage de la ligne
de la borne au-dessus de BD-01, l'assistant a recommandé un tracé qui heurtait CH-04, et aucune
des dix-neuf règles ne l'a vu. Le premier test de V20 rejoue ce tracé.

**Rationale**: le problème avait deux vies avant de s'éteindre, et le suivre en dit plus long que
la conclusion.

*Première forme.* Le circuit des prises occupait la paroi est à 2,60 m sur toute sa longueur.
L'éclairage devait passer d'au-dessus à en dessous pour rejoindre ses commandes, dans la bande
congestionnée de 0,25 m au-dessus du linteau. Le franchissement était structurel.

*Ce qui l'a supprimée.* La mutualisation du tronc : l'éclairage **partage** cette descente au
lieu de la franchir.

*Deuxième forme.* Le croisement s'est alors déplacé au plafond, en (2,70 ; 2,80 ; 2,75), où l'axe
du plafonnier franchissait la descente des prises vers le socle du moteur.

*Ce qui l'a supprimée.* Le décalage de l'axe vers le nord (R1). L'éclairage part **du** point où
les prises descendent, au lieu de le traverser. Le virage vers le nord n'est donc pas seulement
une intention d'éclairage : c'est aussi ce qui fait disparaître le dernier croisement.

**Vérifié mécaniquement**, et il fallait le vérifier : un détecteur écrit pour l'occasion compare
tous les segments des deux circuits et cherche les points partagés qui ne sont l'extrémité
d'aucun des deux. Il trouve **deux** rencontres, toutes deux à une extrémité commune — donc à
l'intérieur d'une boîte, ce qui est légitime — et **aucun croisement pur**.

**La lacune du socle demeure**, et il faut le dire même si le projet n'en souffre plus : un
croisement pur n'est détecté par aucune règle. V17 ne crée un nœud qu'aux extrémités de segment ;
le contrôle de collision n'oppose les conduits qu'aux obstacles relevés, jamais entre eux. La
ligne de la borne viendra sur les mêmes parois, et rien ne la préviendra.

**Ce qui reste donc à décider, hors de cette fonctionnalité** : faut-il doter le socle d'un objet
« croisement », que V17 ne compterait pas comme jonction et qu'une règle nouvelle exigerait à
tout point partagé par deux conduits ? La question n'est plus bloquante pour l'éclairage, mais
elle le redeviendra.

---

## R5 — Ce qui est calculé, et ce qui reste à confirmer

**Decision**: même partage qu'en `002`. Les grandeurs physiques sont calculées intégralement ;
les valeurs normatives sont marquées **à confirmer** avec leur emplacement de référence de
clause.

**Chute de tension, calculée sur le tracé réel** — chemin le plus long : **9,00 m** jusqu'à
EL-01b, après la mutualisation puis le décalage de l'axe vers le nord (R1, R4). Le tableau
ci-dessous a été recalculé sur cette longueur ; la conclusion qui en est tirée n'a pas bougé.

| Hypothèse de charge | Courant | ΔU terminale | Cumulée avec l'arrivée |
|---------------------|---------|--------------|------------------------|
| 4 × 20 W LED | 0,35 A | 0,041 % | 1,69 % |
| 4 × 40 W LED | 0,70 A | 0,082 % | 1,73 % |
| 4 × 60 W LED | 1,04 A | 0,122 % | **1,77 %** |

La limite de 3 % paraissait sévère ; elle ne l'est pas. Même au pire cas, il reste **1,23 point**
de marge, et le circuit terminal ne consomme que 0,12 % — l'arrivée en consomme quinze fois
plus. **La section n'est pas le sujet** ; l'hypothèse de simultanéité l'est (FR-019), et elle
est ici sans enjeu puisque les quatre points allumés ensemble tiennent déjà.

**Restent normatives, à confirmer sur le texte** :

| Grandeur | Exigence |
|----------|----------|
| Plage de hauteur d'axe des dispositifs de commande | FR-031 |
| Nombre maximal de points par circuit d'éclairage | FR-018 |
| Courant admissible de 1,5 mm² en conduit, et lettre de sélection | Principe III |
| Facteur de correction de température | Principe III |
| Appariement section / calibre de protection | Principe III |

**Rationale**: le Principe I exige qu'une exigence soit rattachée à sa clause. Un chiffre
plausible sur une grandeur de sécurité a l'apparence d'une vérification sans en être une.

---

## R6 — Hauteur d'axe des commandes : 1,10 m, décidée

**Decision**: **1,10 m**, décision du maître d'ouvrage du 2026-09-21. La plage normative de
FR-031 reste à confirmer, et la valeur retenue devra s'y inscrire.

**Rationale**: atteignable sans se baisser ni lever le bras, y compris les mains chargées — ce
qui est le cas d'usage réel de l'accès piéton d'un garage. Assez haut pour rester à l'écart des
projections au lavage de la dalle et des chocs d'outillage, ce qui est le raisonnement qui avait
déjà écarté les socles à 5 cm en `002`.

**Alternatives considered**: 1,20 m, plus à l'écart de l'eau mais moins confortable ; 0,90 m,
plus accessible assis mais plus exposé.

---

## R7 — EL-02 reste centré, et sa traversée passe sous le rail

**Decision**: EL-02 **centré** sur la porte sectionnelle, à x = 2,70 m, sur le nu extérieur de la
paroi sud, à **z = 2,22 m**. Traversée au même point, percée **derrière son boîtier**.

**Rationale**: le rail occupe x 2,66–2,74 et **touche la paroi sud** — son volume part de y = 0.
Au droit de EL-02, il n'existe donc aucun passage entre 2,35 m et le plafond. La seule bande
libre est entre le haut de l'ouverture, **2,10 m**, et la sous-face du rail, **2,35 m** : 0,25 m.

La traversée est placée à **2,22 m**, cote ronde voisine du milieu de cette bande — dont le
milieu exact serait 2,225 m, qui ne se trace pas. Les gardes sont de **0,12 m au linteau** et
**0,13 m à la sous-face du rail**. Ce sont les deux cotes les plus serrées de la fonctionnalité,
et les répartir de part et d'autre est le meilleur emploi d'une bande contrainte.

EL-02 se pose **au dos de la traversée**, selon le schéma retenu par la révision de FR-029 de
`002` : le boîtier reçoit le percement dans son fond, et il n'y a pas de conduit dehors — sauf
la liaison courte vers le détecteur (R8).

**Alternatives considered**:
- *Décaler EL-02 à l'ouest pour remonter la traversée à 2,60 m* : plus de garde et un éclairage
  plus haut, mais FR-004 exige le centrage. Écarté par le maître d'ouvrage.
- *Traverser à 2,22 m puis remonter en façade à 2,60 m* : réintroduit un conduit exposé en
  façade, que la révision de `002` avait justement supprimé. Écarté.
- *Descendre du plafond au droit de EL-02* : le percement traverserait le rail. **Collision
  établie** contre un obstacle relevé, donc refusé par le contrôle.

---

## R8 — Le détecteur est alimenté depuis le boîtier de EL-02

**Decision**: CM-02 est posé **à 0,30 m à l'ouest de EL-02**, sur le nu extérieur sud, à la même
altitude. Il est alimenté par une liaison extérieure de **0,30 m** partant du boîtier de EL-02.

**Rationale**: le détecteur doit être **au voisinage immédiat** de EL-02 pour que ce point soit
alimenté en permanence et commuté sur place, sans retour commandé depuis l'intérieur (FR-042).
Deux appareils extérieurs distincts doivent être reliés, et la liaison est nécessairement
dehors.

L'alimentation permanente arrive par la traversée dans le boîtier de EL-02, y est **repiquée**
vers le détecteur — ce que la constitution admet depuis son amendement v1.8.0 —, et le retour
commuté revient dans le même boîtier. La liaison porte donc quatre conducteurs sur 0,30 m.

**Ce que cela coûte, et qu'il faut dire** : c'est le **seul conduit extérieur** du projet, et il
rouvre `TODO(CONDUIT_EXTERIEUR)` pour une longueur de 0,30 m. La révision de `002` avait
supprimé les 0,90 m de conduit de façade ; ces 0,30 m les remplacent en partie.

**Alternatives considered**:
- *Deux traversées séparées, une par appareil* : supprime tout conduit extérieur, mais le
  conducteur commuté sortirait, rentrerait et ressortirait. Plus de percements, plus de
  conducteurs, pour éviter 0,30 m de tube.
- *Un détecteur intégré au luminaire* : supprimerait CM-02 comme objet distinct. SC-011 exige
  au contraire sa position propre, et la spécification traite les deux comme distincts.

---

## R9 — EL-03 remonte à 2,60 m, sur l'aplomb du socle et au fond de sa boîte

**Decision**: EL-03 sur le nu extérieur de la paroi est, à **y = 2,60 m** et **z = 2,60 m** —
l'aplomb de PC-01 et la hauteur de BD-01 — alimenté par une traversée sortant du **fond de
BD-01**. Aucun conduit propre à l'éclairage ne le dessert. *L'ordonnée suit l'axe, déplacé à
0,20 m de la baie le 2026-09-21 (R11) ; la décision porte sur l'aplomb et la hauteur, non sur une
cote figée.*

**Rationale** : *deux fois révisé, et la seconde révision annule la première.*

*Première forme, refusée.* Le premier tracé plaçait EL-03 « en hauteur » à 2,60 m. La
vérification l'a refusé : **l'antenne des prises occupe z = 2,60 m** sur cette paroi, de
y = 0,70 à 5,45, et une traversée à cette altitude « tomberait dessus ». EL-03 est donc descendu
à 2,20 m, alimenté depuis le boîtier de commande par une remontée dédiée de 1,40 m.

*Ce que cette objection supposait, et qui est faux.* Elle traitait le conduit de 2,60 m comme
**occupant toute la bande** y = 0,70 à 5,45 à cette altitude. C'est vrai partout **sauf en un
point** : y = 3,00, où le conduit ne passe pas — il s'y **termine**, dans BD-01. CH-02 y arrive,
CH-03 en repart, CH-04 monte et CH-05 descend. Aucun ne franchit ce point : c'est un nœud, et le
nœud est une boîte en saillie dont le fond est appliqué contre la paroi.

C'est **exactement la prémisse relevée sur FR-029 de `002`** — un boîtier en saillie n'est pas un
obstacle à sa propre position, il est l'enveloppe dont les conducteurs sortent. Là-bas elle avait
fait inventer trois boîtes de dérivation inutiles ; ici elle avait fait descendre un point
lumineux de 0,40 m et poser 1,40 m de conduit dédié le long d'un tube déjà en place. L'objection
était juste pour 5,44 des 5,45 m de la bande, et fausse au seul point qui comptait.

*Seconde forme, retenue.* EL-03 remonte à l'aplomb de PC-01, à la hauteur de BD-01, et sa
traversée sort du fond de cette boîte. Ce que cela supprime : **CH-L5 en entier**, 1,40 m d'IRL 16
et deux changements de direction ; et la traversée en pleine paroi, remplacée par un percement au
fond d'une boîte qui sera déposée de toute façon pour le tirage.

*Ce que cela ne change pas* : le tube vertical de l'aplomb est CH-05, déjà posé, déjà partagé, et
déjà dimensionné sur un majorant de cinq conducteurs d'éclairage — dont le retour commandé de
EL-03, que la note de calcul comptait déjà (§ 3.1). Le remplissage ne bouge donc pas.

*Ce que cela coûte* : le retour commandé de EL-03 ne sort plus directement du boîtier de CM-03,
il remonte les 1,50 m de CH-05 jusqu'à BD-01. La **longueur de conduit** de EL-03 tombe de 6,50 m
à **3,20 m** (R11), mais la longueur de **conducteur** passe de 6,50 m à 6,60 m. Sans effet : EL-03 n'est
pas le point dimensionnant, et l'écart est de 0,10 m. Voir la réserve sur le détour par la
commande, § 2.3 de la note de calcul.

**Sur « en hauteur » (FR-005)** : 2,60 m satisfait la demande mieux que 2,20 m ne le faisait, et
« légèrement au nord de la porte de service » est tenu **au plus près** depuis R11 — 0,20 m au
nord du jambage, contre 0,30 m au tracé livré. Le seuil et la serrure sont mieux éclairés
qu'avant : la distance au jambage nord à hauteur de poignée est de **1,56 m**, contre 1,19 m au
tracé livré — en supposant la serrure de ce côté, le sens d'ouverture du vantail n'étant pas
relevé (FR-030). Le point est plus haut et plus près, ce qui élargit la nappe sur le seuil sans
l'éloigner.

**Alternatives considered**:
- *Rester à 2,20 m* : le tracé livré. Deux tubes parallèles à 0,30 m l'un de l'autre sur la même
  paroi, dont l'un déjà posé. C'est ce que la demande a écarté.
- *2,70 m, au-dessus de l'antenne des prises* : 0,09 m de garde à l'antenne et 0,05 m au
  plafond, plus un segment de conduit de 5 cm. Techniquement valide, inutilement acrobatique — et
  sans objet maintenant que 2,60 m est ouvert.
- *2,55 m, entre le linteau et l'antenne* : 0,05 m de chaque côté. Pire.
- *2,60 m ailleurs que sur l'aplomb de PC-01* : là, l'objection de la première forme tient
  toujours. La traversée tomberait sur l'antenne. C'est l'aplomb du nœud, et lui seul, qui ouvre
  cette altitude.

---

## R11 — CM-03 passe dehors, et tout l'axe revient à 0,20 m de la porte

**Decision**: **CM-03 à l'extérieur**, sur le nu est en (5,80 ; 2,60 ; 1,10), desservie par une
traversée sortant du **fond de BD-04** — aucun conduit propre. Et l'**axe entier** de
l'appareillage de la paroi est ramené de y = 3,00 m à **y = 2,60 m**, soit 0,20 m du bord de la
baie de la porte de service.

**Rationale** — *deux demandes, et elles se servent l'une l'autre.*

*La commande dehors.* FR-038 exigeait le pilotage de EL-03 « depuis l'intérieur du garage ».
L'usage réel est l'inverse : EL-03 éclaire le seuil et la serrure, donc il sert à **quelqu'un qui
arrive**, et cette personne est dehors. Une commande doit être du côté d'où l'on s'en sert.

Ce que cela coûte est réel et nommé en FR-047 : on ne peut plus éteindre EL-03 ni voir son état
depuis l'intérieur, et n'importe qui devant la porte peut l'éteindre. Le va-et-vient qui aurait
conservé les deux côtés a été examiné et **écarté** : sa navette porte le tronc partagé de huit à
neuf conducteurs, et la condition de remplissage de `D ≥ d·√24` à `D ≥ d·√27` — sur un calibre
choisi précisément pour retirer cette question du dossier.

*L'axe à 0,20 m.* FR-030 demandait le boîtier « immédiatement à côté de l'encadrement ». La
mutualisation l'avait trahi sans le dire : pour rattacher les commandes au tronc partagé, elles
avaient été remontées à 0,68 et 0,76 m de la baie, et l'exigence était devenue une formule. En
déplaçant **l'axe entier** plutôt que les seules commandes, les 0,20 m d'origine sont rendus sans
rien détacher du tronc.

**Ce que le déplacement ne coûte pas, et c'est le point remarquable** : CH-02 raccourcit de
0,40 m, CH-07 les reprend dans un décrochement — et les deux conduits sont tous deux sur le tronc
partagé. Le **tronc reste à 7,95 m**, le chemin le plus long des prises à **8,35 m** et celui de
l'éclairage à **9,00 m**. Aucune chute de tension ne bouge. Seul le métré propre aux prises monte
de 0,40 m, CH-03 s'allongeant d'autant.

**Ce que le déplacement coûte** : un décrochement de 0,40 m sur CH-07, donc deux accessoires de
courbe au plafond, à l'aplomb de la paroi est.

**Pourquoi PC-05 ne suit pas l'axe.** R5 de `002` cale PC-05 à 0,20 m au nord de l'extrémité du
rail, et prévoit qu'il devra **reculer** si le tablier ouvert est plus profond que le rail. Le
descendre à 2,60 m ramènerait cette garde à 0,10 m, dans le sens exactement contraire à celui que
la réserve annonce. BD-05 et PC-05 restent donc à y = 3,00 et 2,70, et c'est CH-07 qui va les
chercher.

**Alternatives considered**:
- *Va-et-vient dedans + dehors* : conserve FR-038 et SC-013. Écarté pour le neuvième conducteur,
  voir ci-dessus. Reste le remède si l'usage le réclame (FR-047).
- *Déplacer les seules commandes à 0,20 m, l'axe restant à 3,00* : c'est ce que la mutualisation
  avait refusé, et à juste titre — les commandes se détacheraient du tronc et demanderaient un
  conduit propre.
- *Descendre l'axe à 2,60 et y amener aussi PC-05* : un seul parcours de plafond rectiligne, pas
  de décrochement. Écarté par R5, ci-dessus.
- *Axe à 2,70 m* : 0,30 m de la baie, le décrochement de CH-07 tombe à 0,30 m. Ne répond pas à la
  demande, qui dit 0,20 m.

---

## R10 — Le tableau n'est pas redéclaré

**Decision**: `003` **ne déclare pas** TD-01. Son premier cheminement part de la position du
tableau, déclaré par `002`.

**Rationale**: la règle V11 rejette tout identifiant en double entre apports fusionnés, et le
tableau est un objet unique. Les deux apports s'y raccordent, ce que le graphe résout puisqu'il
rattache les cheminements à la position.

**Conséquence à connaître** : `003` n'est pas validable **seul**. Chargé sans `002`, aucun
composant de type `tableau` n'existe et V16 déclare la continuité invérifiable. Ce n'est pas un
défaut de conception mais une dépendance à écrire, et les tests de l'apport devront fusionner
les deux.

**Alternatives considered**:
- *Déplacer le tableau dans le socle* : plus juste à terme — le tableau n'appartient à aucun
  circuit — mais c'est une reprise de `002` sans bénéfice immédiat.
- *Le redéclarer avec un autre identifiant* : deux tableaux au même point. Absurde, et V11 le
  laisserait passer, ce qui est en soi une remarque.
