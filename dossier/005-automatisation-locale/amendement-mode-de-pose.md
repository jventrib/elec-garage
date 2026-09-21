# Proposition d'amendement — la goulotte à capot démontable

**Version** : 1.12.1 → **1.13.0** | **Nature** : MINEUR | **Date** : 2026-09-22
**Origine** : décision du maître d'ouvrage du 2026-09-22, question Q2 de `005-automatisation-locale`
**État** : ✅ **ADOPTÉE le 2026-09-22** et portée dans `.specify/memory/constitution.md`, section
« Mode de pose imposé », avec son rapport de synchronisation. La **rétroactivité** est tranchée
comme le proposait la section 6 : l'amendement vaut pour tout le projet et ne rouvre aucun tracé.

*Ce document reste au dossier comme **proposition écrite** exigée par la procédure d'amendement.
Il porte l'analyse que le texte de la constitution ne peut pas contenir : l'objet réel, son
emprise, et ce que la décision a coûté.*

> Rédigée conformément à la procédure d'amendement : elle énonce la section touchée, justifie le
> changement, et précise ses conséquences sur les documents déjà produits.

## 1. Section touchée

`Contraintes du Site et de l'Installation` → **Mode de pose imposé**, et elle seule. Aucun des six
principes n'est modifié. La nature **MINEUR** suit la politique de versionnement : « extension
matérielle d'une règle existante ».

## 2. Ce que disent les deux règles visées

> « Les conducteurs DOIVENT cheminer en **conduits IRL** fixés en saillie sur les parois et au
> plafond. »

> « **Toute connexion DOIT se faire dans une boîte**, jamais dans un conduit ni derrière un
> appareil. Le boîtier propre d'un appareil posé en saillie est une boîte à ce titre. Aucune boîte
> NE DOIT être rendue inaccessible ou indémontable par les travaux : une connexion que l'on ne peut
> plus atteindre est une connexion que l'on ne peut plus vérifier. »

La proposition de `005` — cheminer en goulotte et regrouper les dérivations par bornes sous capot —
n'y satisfait ni sur la forme du support, ni sur l'enveloppe des connexions.

## 3. Texte proposé

À insérer dans le **Mode de pose imposé**, après la règle du conduit IRL et sur le modèle de
l'exception de repiquage adoptée en v1.8.0 :

> - Par exception, un **profilé de goulotte à capot démontable** PEUT tenir lieu de conduit sur un
>   parcours donné, et y **abriter des connexions**, à **six conditions cumulatives** :
>   1. le **capot se dépose sans destruction**, à la main ou à l'outil courant, et reste déposable
>      après achèvement des travaux ;
>   2. chaque connexion abritée est réalisée dans un **organe de connexion à enveloppe propre**.
>      La goulotte **abrite** la connexion, elle ne l'**enveloppe** pas : une connexion nue sous
>      capot reste interdite ;
>   3. chaque groupe de connexions porte un **repère lisible sans déposer le capot**, et le dossier
>      énumère ces emplacements **au même titre que les boîtes de dérivation** ;
>   4. la goulotte **ne retient pas l'eau**. Sur paroi froide, elle DOIT être posée de façon à ne
>      pas former cuvette, ou percée en partie basse pour s'évacuer ;
>   5. elle est posée **à l'intérieur** du local, et **hors des zones exposées aux chocs** déjà
>      énumérées — gabarit de manœuvre du véhicule, débattement des ouvrants, trajectoire du
>      tablier et du rail ;
>   6. son **taux de remplissage admissible** est justifié sur les caractéristiques déclarées du
>      produit. La règle du tiers `D ≥ d·√(3n)` est écrite pour une section circulaire et **ne s'y
>      transpose pas telle quelle**.
>
>   Rationale : la règle du conduit et celle de la boîte visent juste et nomment une forme. Ce qui
>   rend un cheminement acceptable n'est pas le profil du produit, c'est que les conducteurs soient
>   protégés, que les connexions restent **atteignables, identifiables et vérifiables**, et qu'aucune
>   ne soit noyée. Une goulotte à capot démontable satisfait ces objectifs, et satisfait même mieux
>   que le conduit le second d'entre eux — on y accède sans rien déposer d'autre. Les six conditions
>   retiennent l'exigence réelle et écartent l'exigence de forme, comme l'avait fait l'exception de
>   repiquage en v1.8.0.

## 4. Ce que l'amendement ne change pas

- **Aucune saignée, aucun encastrement.** La pose reste apparente.
- **Les parcours restent orthogonaux** et arrêtés sur plan avant tout percement.
- **Le repérage des supports portant plusieurs circuits** reste obligatoire (v1.10.0). Il vaut pour
  une goulotte exactement comme pour une boîte, et il est ici d'autant plus nécessaire qu'un capot
  s'ouvre plus facilement qu'une boîte.
- **Les parcours extérieurs** restent hors du champ : `TODO(CONDUIT_EXTERIEUR)` n'est pas touché.
- **L'entrée par le haut** des appareils en saillie, et le corollaire de tracé, restent entiers.

## 4 bis. L'objet réel, localisé le 2026-09-22

La proposition ne portait d'abord que sur une forme de support. Le maître d'ouvrage a précisé
l'objet : **une goulotte de 0,12 m de large sur 0,06 m de profondeur, plaquée sur la paroi est,
centrée sur le tableau divisionnaire, montant de son dessus jusqu'au plafond** — soit environ
**1,12 m** de parcours, de z ≈ 1,63 m à 2,75 m, sur la bande y = 0,64 à 0,76 m.

Cette précision est plus qu'un détail : elle **répond à trois des six conditions** et en fait
apparaître deux conséquences qu'un énoncé abstrait cachait.

**Ce que son emprise contient déjà.** Le socle a été interrogé plutôt que la mémoire :

| Objet | Position | Dans l'emprise ? |
|-------|----------|------------------|
| **CH-01**, montée du tronc partagé, 1,10 m, **6 conducteurs** | (5,60 ; 0,70) de z 1,50 à 2,60 | **entièrement** |
| **CH-B1**, montée de la ligne de la borne, 1,15 m, **3 × 10 mm²** | (5,60 ; 0,70→0,75) de z 1,50 à 2,60 | **entièrement** |
| **BD-02**, boîte de dérivation, 0,132 m de côté, 5 entrées, 2 circuits | (5,60 ; 0,70 ; 2,60) | **en conflit — voir ci-dessous** |
| **TD-01**, tableau divisionnaire, 0,36 × 0,26, saillie 0,11 m | (5,60 ; 0,70 ; 1,50) | dessous, la goulotte part de son sommet |

**Conséquence 1 — la goulotte ne s'ajoute pas au tracé, elle en remplace une partie.** Les deux
montées y tiennent entièrement. Mieux : le décrochement de 0,05 m par lequel CH-B1 esquive CH-01 au
départ du tableau n'a plus de raison d'être, les deux parcours cessant d'avoir à s'éviter dès lors
qu'un support commun les abrite. C'est une **simplification du tracé**, non une addition.

**Conséquence 2 — BD-02 ne tient pas dedans, et le maître d'ouvrage a décidé qu'elle disparaît.**
La boîte mesure 0,132 m de côté, la goulotte 0,12 m de large ; elle est 12 mm trop large, et elle
se trouve à z = 2,60, dans la hauteur que la goulotte parcourt. **Décision du 2026-09-22 : la
goulotte reprend ses fonctions**, ses connexions passant sous capot. Une boîte de moins, cinq
entrées supprimées.

**Conséquence 3 — cette décision force la main sur le traitement du socle, et c'est heureux.** Le
nœud de BD-02 est de **degré 5** : y arrivent la montée du tableau, l'antenne vers BD-01, la
branche d'éclairage vers la façade sud, et la ligne de la borne qui y entre et en ressort. Or
**V17 exige une boîte dès le degré 3**. Retirer BD-02 sans rien déclarer à sa place fait donc
**échouer une règle du socle** — ce qui tranche, par le fait, la question laissée ouverte en
section 9 : la goulotte ne peut pas être simplement déclarée hors contrôle, elle doit être
**exprimée dans le modèle**.

*Une voie s'impose d'elle-même et ne demande aucune extension du socle : une goulotte est, dans les
termes du modèle, une **boîte très allongée** — `dimensions` de 0,12 × 1,12 × 0,06 et un décompte
d'`entrees`. L'enveloppe déclarée y rattache déjà tout bout de conduit qui tombe dedans, V17 y
trouve sa boîte, V20 son exemption et V21 sa contrepartie. À confirmer à l'étude, mais c'est le
genre de coïncidence qui indique qu'un modèle a été bien posé.*

**Décision sur le contenu — mixte.** Les conducteurs du tronc partagé y cheminent **nus**, puisque
c'est là qu'ils se connectent. La ligne de la borne **conserve son conduit** et ne fait que
traverser : elle n'a rien à gagner à en sortir, le Principe IV lui interdisant déjà toute jonction
dans un support partagé, et tout à perdre, son `Iz` décidant de sa section de 10 mm². *Elle
satisfait ainsi les quatre conditions cumulatives du Principe IV amendé en v1.11.0 a fortiori :
ses conducteurs ne quittent jamais leur enveloppe propre.*

**Le remplissage cesse d'être une question.** Section brute de 72 cm², contre environ **1,97 cm²**
de section de conducteurs si les neuf y cheminent — les six du tronc et les trois de la borne.
Soit **2,7 %**, à comparer au tiers admissible. La condition 6 est satisfaite avec deux ordres de
grandeur de marge, et cela quelle que soit la convention retenue pour une section rectangulaire.

**La condensation cesse d'être l'objection principale.** Une goulotte **verticale** n'est pas une
gouttière : l'eau qui s'y condense descend au lieu de stagner, et la condition 4 est satisfaite par
la géométrie même. *Il reste un point, et un seul : ce qui descend dans la goulotte arrive à son
extrémité basse, qui est **juste au-dessus du tableau divisionnaire**. La goulotte ne doit pas s'y
déverser. C'est la transposition exacte de la règle d'entrée par le haut adoptée en v1.9.0, et le
motif en est identique.*

## 5. Le point que cet amendement ne peut pas faire disparaître

**La condensation, pour toute goulotte qui ne serait pas verticale.** La constitution tient déjà
pour acquis qu'« une paroi en béton non isolée est une paroi froide : la condensation en surface
DOIT être tenue pour probable », et elle en a déjà tiré une règle de pose — les conducteurs entrent
par le **haut** d'un appareil, précisément pour que l'eau s'écoule au lieu de s'accumuler aux
connexions.

Une goulotte posée à l'**horizontale**, capot dessus, est une **gouttière**. C'est le seul point sur
lequel elle est franchement moins bonne qu'un tube fermé, et c'est pourquoi la condition 4 existe.
Elle n'est pas une précaution de rédaction : c'est la conséquence directe d'un fait déjà consigné au
relevé.

*La goulotte de `005` étant **verticale** (section 4 bis), elle n'est pas concernée — mais la
condition doit rester dans le texte, qui vaut pour tout parcours à venir et non pour ce seul
parcours.*

**Second point, moindre mais réel** : une goulotte est plus vulnérable aux chocs qu'un IRL, et la
constitution demande déjà d'éviter les zones exposées. La condition 5 s'y raccroche sans inventer de
cote nouvelle.

## 6. Rétroactivité — la question que FR-035 impose de trancher

**Proposition : l'amendement vaut pour l'ensemble du projet, et ne rouvre aucun tracé arrêté.**

La question « pourquoi l'admettre ici et pas trois circuits plus loin ? » se dissout, parce que
l'amendement **autorise** une forme sans en **imposer** aucune. Rien n'a été refusé aux circuits des
prises, de l'éclairage et de la borne : leur tracé en IRL reste conforme, et il le restera. Aucune
reprise n'est donc appelée, et aucune incohérence ne subsiste — un dossier peut employer deux formes
de support dès lors que les deux sont admises et que chacune est justifiée là où elle est employée.

*Si le maître d'ouvrage préfère au contraire limiter l'exception à `005`, il faut alors écrire
pourquoi — et la seule raison défendable serait une raison de fond, non une raison de date.*

## 7. Conséquences sur les documents déjà produits

| Document | Conséquence |
|----------|-------------|
| **Constitution** | Section « Mode de pose imposé » étendue ; version 1.13.0 ; rapport de synchronisation à porter en tête |
| **`005` — spec** | FR-027 devient satisfait ; FR-034 est **absorbé** par les six conditions ; FR-035 est tranché par la section 6 |
| **Note de calcul `004` (borne)** | **Aucune.** La décision du 2026-09-22 maintient son conduit dans la goulotte : la catégorie **B1** est préservée, et `Iz` — seule ligne dont dépend sa section de 10 mm² — n'est pas rouvert. C'est tout l'objet de ce choix |
| **Notes de calcul `002`, `003`** | **Le mode de pose conditionne `Iz`**, et la catégorie **B1** est celle des conducteurs isolés **en conduit**. Les six conducteurs du tronc cheminent nus sur **1,10 m** des 14,20 m du parcours : cette portion relève d'une autre lettre de sélection. Deux questions en découlent, toutes deux **normatives** et donc à confirmer sur le texte : quelle lettre s'applique à un conducteur isolé en goulotte, et **une portion aussi courte peut-elle être négligée** dans la détermination de `Iz` ? *Ni l'une ni l'autre ne se renseigne de mémoire ; elles rejoignent la liste de T006* |
| **Socle logiciel (`001`)** | **Conséquence forcée, mais moins coûteuse qu'annoncé.** Le retrait de BD-02 fait échouer **V17** (voir 4 bis), donc la goulotte **doit** être exprimée dans le modèle. La voie qui n'exige aucune extension : la déclarer comme une **boîte de dérivation à volume**, `dimensions` 0,12 × 1,12 × 0,06 et son décompte d'`entrees`. V17 y trouve sa boîte, V20 son exemption, V21 sa contrepartie, et l'enveloppe rattache déjà les bouts de conduit qui tombent dedans. Reste à vérifier que le rendu de la maquette admet un objet aussi allongé sans le faire passer pour une boîte ordinaire |
| **Tracé** | **Simplifié.** Le décrochement de 0,05 m par lequel CH-B1 esquive CH-01 au départ du tableau perd sa raison d'être. CH-01 cesse d'être un conduit |
| **Nomenclature** | Article nouveau : profilé, capot, accessoires d'angle, organes de connexion |
| **Maquette 3D** | Un objet de section rectangulaire à représenter, ou une convention de rendu à arrêter |

## 8. Plan de reprise des travaux

**Néant, et c'est le bon moment.** La procédure d'amendement exige un plan de reprise si
l'amendement est adopté **après le début de la réalisation**. Aucune tâche de pose n'est cochée dans
les quatre dossiers : aucun percement, aucun conduit, aucun conducteur. L'amendement ne coûte donc
rien en reprise aujourd'hui — il en coûterait après le premier mètre de tube posé.

## 9. Ce qu'il reste à trancher avant adoption

1. **La rétroactivité**, si la proposition de la section 6 ne convient pas. *C'est le seul point
   qui appelle encore une décision avant adoption.*
2. ~~Le traitement du socle~~ — **tranché par le fait** : le retrait de BD-02 fait échouer V17, la
   goulotte doit donc être modélisée. La voie proposée — une boîte à volume très allongée — est à
   confirmer à l'étude, mais elle n'exige aucune extension du socle.
3. **Deux valeurs normatives** rejoignent la liste de T006, et ne sont pas à renseigner de
   mémoire : la **lettre de sélection** d'un conducteur isolé en goulotte, et le seuil en deçà
   duquel une **portion courte** peut être négligée dans la détermination de `Iz`. Elles ne
   concernent que le tronc ; la borne y échappe en gardant son conduit.

---

**Adopté le 2026-09-22.** Le seul point encore ouvert à la rédaction — la rétroactivité — a été
tranché dans le sens proposé : l'amendement autorise sans imposer, il vaut pour tout le projet, et
aucun tracé arrêté n'est à reprendre.

**Ce qui reste, et qui n'appartient pas à cet amendement** : les deux valeurs **normatives** qu'il
fait apparaître — lettre de sélection d'un conducteur isolé en goulotte, et seuil en deçà duquel
une portion courte est négligeable pour `Iz`. Elles rejoignent T006 et ne sont pas à renseigner de
mémoire. Elles ne concernent que le tronc ; la borne y échappe en gardant son conduit.
