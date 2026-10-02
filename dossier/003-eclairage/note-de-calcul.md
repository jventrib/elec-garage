# Note de calcul — circuit d'éclairage du garage

**Fonctionnalité**: `003-eclairage` | **Circuit**: `c-eclairage` | **Date**: 2026-09-21
| Dernière révision | **2026-10-01** — six réglettes **pontées**

> ### Révision du 2026-10-01 — les six réglettes se pontent
>
> **Décision** : les six réglettes ne sont plus alimentées chacune par son propre trio remontant
> du tableau, mais **deux par deux, par cordage**. CH-L3 et CH-L4 n'alimentent plus que
> l'extrémité nord de leur colonne ; le courant descend ensuite de réglette en réglette par
> **CP-1 à CP-4**.
>
> **Ce qui change dans les chiffres**
>
> | Grandeur | Avant (6 réglettes en étoile) | Après (pontage) |
> |---|---|---|
> | Chemin le plus long | 11,73 m, EL-01a | **17,17 m**, point d'utilisation d'EL-01b |
> | Chute terminale | 0,144 % | **0,210 %** |
> | Chute cumulée | 1,79 % | **1,86 %** |
> | Métré 1,5 mm² | 104,89 m | **108,92 m** |
> | Boîtes de l'éclairage | 4 — BL-01, BD-07, BD-08, BD-09 | **1** — BL-01, au degré 3 |
> | Conduits de l'éclairage | 7 | **4** — CH-L2, CH-L3, CH-L4, CH-L6 |
> | **Cordages** | aucun | **4** — CP-1 à CP-4, 7,69 m |
> | **Boîtes portant deux circuits** | 6 | **5** — OC-01, OC-02, BD-04, BD-05, BD-06 |
>
> **Le point dimensionnant change de nom, et cette fois pour de bonnes raisons.** Le pontage est
> un éclairage de **fin de ligne** : il ne touche pas au tracé entre le tableau et le plafond, et
> ne peut donc pas allonger ce chemin. C'est la géométrie des colonnes qui décide — et la
> colonne est, légèrement plus longue, devient le pire point : **EL-01b**.
>
> **Le pire point, et la convention de lecture.** Pour une réglette pontée, le socle compte la
> distance jusqu'au **connecteur d'accès** — celui par lequel arrive le cordage de la voisine, ou la
> colonne pour les deux têtes : **17,17 m** pour EL-01b. C'est le **point d'utilisation** au sens de
> la norme : la chute se mesure à l'endroit où l'installation se raccorde à l'appareil, non dans
> l'appareil. Les 1,20 m du câble interne de la réglette ne sont donc pas comptés. *Si on les
> comptait, EL-01b ferait 18,37 m, 0,225 % et 1,88 % de cumul : c'est le majorant, connu et écarté.*
>
> **Le cumul ne bouge presque pas.** Il passe de 1,79 % à **1,86 %**, soit 0,07 point, pour une
> longueur de phase presque doublée. La raison est que la chute amont, qui domine, dépend du
> tronc partagé et non des branches : **1,65 % sur 0,210 %**. La marge sur 3 % reste de **1,14
> point**.
>
> **Ce qui s'améliore** : sept cheminements et trois boîtes disparaissent. Les **9,25 m** de
> conduit propres à l'éclairage remplacent les 18,91 m de la version en étoile, et quatre
> cordages ajoutent 7,69 m de câble — c'est le prix du pontage, et il est bon.
>
> **Ce qui ne change pas** : la charge. 6 × 36 W = 216 W, `IB` = 0,939 A.
>
> **Ce qui devient une obligation du modèle** : une réglette alimentée par sa voisine n'a qu'un
> point d'arrivée, et **V24 en exige deux**. D'où le champ `raccords`, et d'où le câblage
> interne de 1,20 m que le graphe traite comme une arête — mais que le métré **n'achète pas**,
> parce qu'il est fourni avec l'appareil.

Ce document porte le **raisonnement**. Les valeurs conclues vivent une seule fois, dans l'entité
circuit de `data/apports/003-eclairage.json` — voir
[contracts/note-de-calcul.md](./contracts/note-de-calcul.md).

Chaque grandeur porte son **origine** (`calculée`, `décidée`, `normative`), et toute valeur
normative porte sa **référence de clause** et son **état de confirmation**. Une valeur normative
sans référence vérifiée est marquée **à confirmer** et n'est pas opposable (Principe I). Aucune
n'est renseignée de mémoire : une case vide vaut mieux qu'un chiffre plausible sur une grandeur
de sécurité (R5).

## 1. Données d'entrée

| Donnée | Valeur | Origine |
|--------|--------|---------|
| Mode de pose | Apparent, conducteurs isolés en conduit IRL | Donnée figée (constitution) |
| Section retenue | 1,5 mm² cuivre | Décidée (R2) |
| Conduit | **IRL 20**, branches propres comme tronc partagé, **sauf CH-05 en IRL 25** | **Décidée le 2026-09-22** par le maître d'ouvrage. Sur le tronc, contre l'avis motivé de la note — voir 3.2. Sur les branches, l'IRL 20 remplace l'IRL 16 et **desserre** la condition de remplissage. **CH-05 en IRL 25 le 2026-09-23**, décision du maître d'ouvrage, à neuf conducteurs — voir 2.4. **CH-02, également en IRL 25, n'est plus emprunté par l'éclairage depuis le 2026-09-26** : la sortie de MC-01 ne passe plus par lui |
| Nombre de conducteurs sur le tronc | **6 au plus** dans un conduit de l'éclairage, sur CH-05 ; **8** dans la goulotte GL-01 — voir 3.1 | **Dérivé** du pilotage déclaré |
| Points lumineux / sorties | **6 réglettes, 6 points distincts** — EL-01a à EL-01f | **Décidée le 2026-09-26**, décision du maître d'ouvrage ; voir la révision en tête de note |
| Commandes | 4 — CM-01, CM-02 (détecteur), CM-03, et CM-04 au boîtier double depuis `005` | FR-029 |
| Module de commande | MC-01, dans la goulotte : il commute le plafonnier, CM-01 et CM-04 lui adressent un ordre | `005`, 2026-09-23 |
| Arrivée depuis l'habitation | 3G16, 30 m, protégée à 63 A au départ | Relevée |
| Disjoncteur d'abonné | 45 A pour 9 kVA monophasé | Relevée |
| Régime de neutre | TT, garage accolé, terre par le PE du 3G16 | Relevée |
| Tension de référence | 230 V | Donnée |
| Résistivité du cuivre | ρ = 0,0225 Ω·mm²/m | Donnée physique |
| Technologie des luminaires | LED, puissance unitaire modeste | Hypothèse (spec) |

**Deux retours commandés et non trois** : EL-02 est alimenté en permanence et commuté sur place
par son détecteur (FR-042), il n'appelle donc aucun retour depuis l'intérieur. Seuls EL-01 et
EL-03 en ont un. Ce sont ces deux retours, et la phase qui descend aux commandes, qui font les
cinq conducteurs de CH-05 ; partout ailleurs le circuit n'en met que trois.

## 2. Les sept lignes obligatoires du Principe III

| Grandeur | Valeur | Origine | Référence | État |
|----------|--------|---------|-----------|------|
| Courant d'emploi `IB` | *(à établir)* — dépend de l'hypothèse de simultanéité | Décidée, FR-019 | — | **à statuer** |
| Mode de pose | Apparent sous conduit IRL — **partagé sur le tronc, dédié sur les branches éclairage** —, conducteurs isolés — **catégorie B1**. **Sauf dans les goulottes** — GL-01 au-dessus du tableau, et depuis le 2026-09-24 GL-02 au plafond de la paroi est, soit 3,04 m des 8,18 m du trajet de EL-01b —, où les conducteurs cheminent sans tube | Donnée figée ; la portion en goulotte relève d'une autre lettre de sélection | *(clause : ..............)* | B1 acquis ; **goulotte à confirmer** — voir 2.4 |
| Courant admissible `Iz` de 1,5 mm² | *(à renseigner)* | **Normative** — table, mode de pose et lettre de sélection | *(clause : ..............)* | **à confirmer** |
| Facteur de correction de température | *(à renseigner)* | **Normative** — température ambiante | *(clause : ..............)* | **à confirmer** |
| Facteur de correction de **groupement** | *(à renseigner)* | **Normative** — **EXIGIBLE** : le tronc est partagé avec le circuit des prises depuis le 2026-09-21 | *(clause : ..............)* | **à confirmer** |
| Calibre de protection `In` | *(à renseigner)* | **Normative** — appariement avec la section | *(clause : ..............)* | **à confirmer** |
| Longueur du chemin le plus long | **17,17 m** au point d'utilisation d'**EL-01b** ; 11,73 m jusqu'à EL-01a avant le pontage | **Calculée** par le socle sur le tracé réel | — | acquis |
| Chute de tension terminale / cumulée | **0,210 % / 1,86 %** au point d'utilisation (valeur déclarée par le socle) — 0,144 % / 1,79 % avant le pontage, 0,111 % / 1,76 % avant les six réglettes | **Calculée** — ΔU = ρ·I·(L_phase + L_neutre)/S | — | acquis |

### 2.1 Longueur du chemin le plus long — calculée sur le tracé réel

Ce n'est pas le métré — 9,25 m en propre, plus 7,96 m de tronc partagé — qui décide de la chute de
tension, mais le **chemin le plus long** depuis le tableau.

Deux longueurs, et non plus une seule. La longueur de **conduit** est celle que parcourent le
neutre et le PE, qui vont tout droit ; celle de **phase** compte le détour par la commande, et
c'est le socle qui la dérive depuis le 2026-09-22 — voir 2.3.

**Le pontage s'arrête au point d'utilisation ; le câble interne de l'appareil n'y entre pas.** Pour
une réglette alimentée par sa voisine, le tracé s'arrête au **connecteur d'accès**, celui par lequel
arrive le cordage (ou la colonne, pour les deux têtes). C'est là que l'installation se raccorde à
l'appareil, et donc là que se lit la chute. Le **lien interne** de 1,20 m — que le métré n'achète pas
et qui est dans l'appareil — n'est pas compté.

| Point | Longueur au point d'utilisation | ΔU à 0,939 A |
|-------|---------------------------------|--------------|
| **EL-01b** | **17,17 m** ← pire point | **0,210 %** |
| EL-01a | 16,97 m | 0,208 % |
| EL-01d | 14,17 m | 0,174 % |
| EL-01c | 13,97 m | 0,171 % |
| EL-01f | 10,93 m | 0,134 % |
| EL-01e | 10,73 m | 0,131 % |
| EL-02 | 5,88 m — commuté **sur place** par le détecteur | 0,068 % |
| EL-03 | 6,94 m — par CM-03 | 0,063 % |

*Si l'on ajoutait le lien interne de la cible, EL-01b ferait 18,37 m et 0,225 % : c'est le majorant,
écarté au nom du point d'utilisation.*

**EL-01b est le point dimensionnant, et il ne l'est pas pour la raison que l'on attendait.** Le
pontage est un éclairage de fin de ligne : il ne touche pas au tracé entre le tableau et le
plafond, et ne peut donc pas allonger ce chemin. C'est la colonne est, légèrement plus longue que
la colonne ouest, qui décide — quand la version en étoile, elle, plaçait EL-01a devant.

CM-01 est à **4,71 m** de conduit du tableau, CM-03 à **4,91 m** — elle est dehors, au dos de
BD-04 depuis le 2026-09-21, d'où les 0,20 m de paroi en plus. Ces deux valeurs sont dérivées, non
relevées : le socle sait désormais calculer une distance depuis un nœud quelconque, et non plus
seulement depuis le tableau.

*Révisé cinq fois le 2026-09-21, puis le 2026-10-01. La mutualisation du tronc avait raccourci le
chemin le plus long de 0,20 m ; le décalage de l'axe vers le nord l'a ensuite allongé de 1,05 m ; la
réutilisation du tube vertical par EL-03 a raccourci **ce point-là** de 2,90 m ; le rapprochement
de l'axe à 0,20 m de la porte n'a **rien changé du tout**. Le pontage, enfin, a laissé le chemin
du tableau au plafond intact et déplacé le point dimensionnant de a à b. Sans conséquence de
conclusion : 1,14 point de marge.*

### 2.2 Chute de tension — calculée sur la forme exacte

```
ΔU = ρ·I·(L_phase + L_neutre) / S
```

avec ρ = 0,0225 Ω·mm²/m. Le calcul est purement physique et ne dépend d'aucune table ; il est
donc conduit intégralement ici.

**C'est la forme exacte, et non `2ρLI/S`.** Cette dernière suppose les deux conducteurs de même
longueur, ce qui est faux dès qu'un point est commuté : la phase descend à l'interrupteur et
c'est le retour commandé qui remonte. L'écart était relevé et chiffré au 2.3 depuis le
2026-09-21, sans pouvoir être rebasé faute de savoir quelle commande pilotait quel point. Cette
donnée est déclarée depuis le 2026-09-22, et c'est elle qui alimente ce tableau.

Sur **EL-01b**, dimensionnant depuis le 2026-10-01, `L_phase + L_neutre` = 17,17 + 17,17 =
**34,34 m** au point d'utilisation, contre 23,45 m pour EL-01a avant cette révision, et 16,35 m
depuis la goulotte GL-02. Le 2026-09-26, l'hypothèse de charge **cesse d'être une hypothèse** : la puissance
unitaire n'est plus 20, 40 ou 60 W supposés, c'est **36 W déclarés** par le fabricant, et les
six sont sur le même circuit.

**On compte la phase, et jusqu'au point d'utilisation.** Le tracé s'arrête au connecteur d'accès, à
**17,17 m** : la chute se lit là, où l'installation rejoint la réglette. Le câble interne de 1,20 m
appartient à l'appareil, et le compter porterait à 18,37 m et 0,225 % — un majorant, écarté au nom
du point d'utilisation et néanmoins chiffré ici pour être opposable.

| Hypothèse | Courant | ΔU terminale | Cumulée avec l'arrivée (1,65 %) |
|-----------|---------|-------------|----------------------------------|
| *Avant le 2026-09-26 — deux sorties, trois puissances supposées* | | *sur 16,35 m* | |
| 4 × 20 W LED | 0,35 A | 0,037 % | 1,69 % |
| 4 × 40 W LED | 0,70 A | 0,074 % | 1,73 % |
| 4 × 60 W LED | 1,04 A | 0,111 % | 1,76 % |
| *2026-09-26 — six réglettes en étoile, sur 23,45 m* | **0,939 A** | **0,144 %** | **1,79 %** |
| **2026-10-01 — six réglettes pontées, sur 34,34 m** | **0,939 A** | **0,210 %** | **1,86 %** |

**Conclusion** : 1,86 % au point d'utilisation contre une limite de **3 %**, soit une marge de
**1,14 point**. La longueur de phase a gagné 47 % pour un courant inchangé — **c'est la longueur, et
elle seule, qui dimensionne ici**. *L'historique se lit dans la révision en tête de note : 1,76 % et 1,24 point
avant les six réglettes ; 1,79 % et 1,21 point avant l'automatisation ; 1,77 % et 1,23 point
avant que l'axe recule de 0,80 m au sud le 2026-09-23 ; puis 1,79 % et 1,21 point après la
goulotte GL-02 et les six réglettes en étoile ; enfin 1,86 % et 1,14 point avec le pontage.*

**La limite de 3 % paraissait sévère ; elle ne l'est pas.** L'arrivée en consomme 1,65 % à elle
seule, et il ne reste que 1,35 % pour le circuit terminal. Le calcul montre que celui-ci n'en
consomme que **0,210 %** — près de huit fois moins que l'amont. Doubler encore le circuit d'éclairage ne
le mettrait pas en difficulté.

**Ce qui en découle, et qui est le vrai enseignement** : la question n'est pas la section mais
l'**hypothèse de simultanéité** (FR-019, SC-007). Elle est ici sans enjeu, puisque les six
réglettes allumées en même temps tiennent avec 1,14 point de marge.

### 2.3 Le détour par la commande — réserve levée le 2026-09-22

**Cette section portait une réserve ouverte le 2026-09-21. Elle est fermée.**

Elle disait ceci : les longueurs de 2.1 sont des **longueurs de conduit**, et pour un point
commuté ce n'est pas la longueur du conducteur de **phase** — celle-ci descend d'abord à
l'interrupteur, puis remonte vers la sortie. Le neutre, lui, va directement. La forme `2ρLI/S`
suppose les deux de même longueur ; ici elles diffèrent.

L'écart était chiffré à la main, et il aboutissait à 0,142 % / 1,76 %. **Ces deux valeurs ont
été celles de 2.2** jusqu'au 2026-09-23, où le plafonnier est passé sous module et le détour a
disparu — voir 2.4. Elles ne sont plus calculées ici, elles sortent du socle.

**Ce qui manquait, et qui a été déclaré.** Rebaser le calcul exigeait deux choses : que les
données disent **quelle commande pilote quel point** — le lien CM-01 → EL-01 et CM-03 → EL-03 ne
vivait que dans la prose de FR-038 —, et que le socle sache calculer une distance depuis un nœud
quelconque, alors qu'il ne la calculait que depuis le tableau. Les deux ont été faites :

- chaque commande déclare `pilote` et `commutation` dans `data/apports/003-eclairage.json`.
  `commutation` était indispensable : CM-02 est alimentée en permanence et commute **sur place**
  (FR-042), sa topologie est l'inverse des deux autres, et aucune géométrie ne permet de le
  deviner ;
- le socle dérive le **trajet réel** de chaque conducteur (`src/geometrie/conducteurs.js`), d'où
  sortent les longueurs de phase de 2.1, le décompte par conduit de 3.1, et le métré des
  conducteurs de [`dossier/fournitures.md`](../fournitures.md).

**Ce qui reste majorant, et qui l'est délibérément** : le calcul applique 1,04 A à toute la
longueur, alors que les branches de la fourche n'en portent qu'un quart. C'est une marge
volontaire, pas une approximation subie.

**Ce que la levée de cette réserve a corrigé ailleurs.** La même donnée manquante entretenait deux
autres fautes, qu'elle ferme du même coup : la fiche d'un conduit annonçait **huit** conducteurs
sur tout le tronc alors que six y passent (voir 3.1), et la liste des fournitures surestimait le
1,5 mm² de 57 % — 80,40 m pour **51,24 m** réels. Une borne présentée comme un décompte est
exactement ce que le Principe VI interdit ; elle l'était ici en trois endroits pour une seule
cause.

### 2.4 Depuis l'automatisation locale — 2026-09-23

`005-automatisation-locale` change la topologie de ce circuit sans en changer le tracé. **CM-01
ne coupe plus la phase** : elle adresse un ordre au module **MC-01**, posé dans la goulotte, qui
détient la phase et commute le plafonnier. Un second bouton, **CM-04**, au boîtier double de
l'entrée de la sectionnelle, adresse le même ordre au même module.

**Ce qui en découle pour cette note** :

- **La phase ne fait plus de détour.** MC-01 est sur le chemin des points qu'il commande : leur
  longueur de phase retombe à celle de leur conduit, et la chute cumulée de 1,79 % à **1,77 %**.
  Le détour ne subsiste que pour EL-03, par CM-03. *Depuis le pontage, cette égalité joue aussi
  pour les six réglettes : leur phase comme leur neutre s'arrêtent au connecteur d'accès — le point
  d'utilisation —, où arrive le cordage. Le câble interne de 1,20 m appartient à l'appareil ; le
  compter porterait à 1,88 %, un majorant écarté — voir 2.1.*
- **Le tronc porte davantage.** La sortie de MC-01 monte par CH-02 ; la paire d'ordre de CM-01
  descend par CH-02 et CH-05 ; le fil d'ordre du bouton de porte, du circuit des prises, traverse
  tout le tronc. CH-02 passe à **dix** conducteurs et CH-05 à **neuf**, et le maître d'ouvrage les a
  repassés en **IRL 25** le 2026-09-23 — voir 3.1.
- **Le mode de pose change sur 1,12 m.** Les conducteurs du tronc vont du tableau à la goulotte
  sans tube : cette portion ne relève pas de la catégorie B1. Deux valeurs **normatives** en
  découlent — la lettre de sélection d'un conducteur isolé en goulotte, et la possibilité de
  négliger une portion aussi courte dans la détermination d'`Iz`. **Aucune ne se renseigne de
  mémoire** : elles sont portées à la note de calcul de l'automatisation, et à la tâche 1.6 de
  `reserves-maitre-ouvrage`.

## 3. Les trois vérifications complémentaires

| Vérification | Valeur | Origine | Référence | État |
|--------------|--------|---------|-----------|------|
| Taux de remplissage du **tronc partagé** | Condition exacte `D ≥ d·√(3n)`, avec **n = 9 sur CH-05** — en IRL 25 — **8 sur CH-L1**, **7 sur CH-07**, et **3 sur chacun des conduits du plafond** — CH-L2, CH-L3, CH-L4, CH-L6 — en IRL 20, et **3 sur
chacun des quatre cordages**, dont la section n'est pas déclarée — voir 3.1 | **Calculée** (géométrie) ; la règle du tiers est une **règle de l'art** | règle de l'art, à citer comme telle | acquis pour les conduits ; **les cordages ne sont pas calculables** — voir 3.1 |
| Décompte des points d'éclairage | **6 points, 6 sorties** — EL-01a à EL-01f | **Calculé** | — | acquis |
| Limite de points par circuit d'éclairage | *(à renseigner)* | **Normative** | *(clause : ..............)* | **à confirmer** |
| Résistance maximale de la prise de terre | `R ≤ 50/IΔn` — voir 3.3 | **Calculée** ; le seuil de 50 V est normatif | *(clause du seuil : ..............)* | seuil **à confirmer** |

### 3.1 Occupation du conduit — une condition exacte, sans cote produit

Même forme que pour les prises. Avec **n** conducteurs de diamètre extérieur isolé **d** dans un
conduit de diamètre intérieur **D**, le taux d'occupation géométrique vaut `n·(d/D)²`, et la
règle du tiers s'écrit :

```
n (d/D)² ≤ 1/3   ⟺   D ≥ d·√(3n)
```

Le tronc **partagé** porte **au plus huit** conducteurs, et ce maximum n'est atteint que sur
**CH-05**. C'est une correction du 2026-09-22 : cette note écrivait « le tronc porte huit
conducteurs », et la fiche de la maquette le répétait sur chacun de ses cinq conduits. Six y
passent, sauf sur un.

| Conduit du tronc | Conducteurs | dont éclairage |
|------------------|-------------|----------------|
| *Avant l'automatisation — état du 2026-09-22* | | |
| CH-01, CH-02 | 6 | phase, neutre, PE |
| CH-04, CH-07 | 6 | neutre, PE, retour commandé |
| **CH-05** | **8** | phase, neutre, PE, **deux retours commandés** |

**Révisé le 2026-09-23, par l'automatisation locale** — voir 2.4. CH-01 n'est plus un conduit
depuis la goulotte ; le décompte dérivé est désormais :

| Cheminement | Calibre | Conducteurs | dont éclairage |
|-------------|---------|-------------|----------------|
| GL-01, goulotte du tableau | profilé | 15, borne comprise | 8 : phase, neutre, PE, **sortie de MC-01**, paires d'ordre de CM-01 et CM-04 |
| GL-02, goulotte de la paroi est | profilé | 14 | 7 : phase, neutre, PE, **sortie de MC-01**, paire d'ordre de CM-01, retour du point piéton |
| **CH-05** | **IRL 25** | **9** | 6 : phase, neutre, PE, retour de CM-03, paire d'ordre de CM-01 |
| CH-L1 | IRL 20 | 8 | 5 : phase, neutre, PE, paire d'ordre de CM-04 |
| CH-07 | IRL 20 | 7 | 3 : neutre, PE, sortie de MC-01 |
| CH-A1 | IRL 20 | 6 | 3 : PE, paire d'ordre de CM-04 |
| **CH-L2, CH-L3, CH-L4, CH-L6** — colonnes et branche du plafonnier | **IRL 20** | **3 chacun** | **3 chacun : phase, neutre, PE** |
| **CP-1 à CP-4** — cordages de pontage | **sans section déclarée** | **3 chacun** | **3 chacun : phase, neutre, PE** |

**Révisé le 2026-09-26, par les six réglettes ; révisé le 2026-10-01, par le pontage.** Sept
cheminements étaient apparus le premier jour — **CH-L9** à **CH-L15** — portant chacun trois
conducteurs, la signature d'une distribution individuelle. Le pontage les a ramenés à **quatre**
conduits, et **quatre cordages** leur ont succédé.

**Un cordage n'est pas un câble d'alimentation ordinaire : il porte trois conducteurs.** Chaque
paire pontée a besoin de sa phase, de son neutre et de son PE entre les deux réglettes — sans le
PE, le pontage serait un défaut de terre en série. C'est la raison pour laquelle CP-1 à CP-4
portent chacun trois conducteurs, et non deux.

**Ce qui ne peut pas être calculé, et qui reste ouvert** : un cordage ne déclare **pas de section**
— c'est même la condition de sa déclaration, puisqu'il n'est pas choisi dans le catalogue des
conduits. Sa condition de remplissage ne peut donc pas être vérifiée, et le conduit qui le reçoit
non plus. *Un câblier à trois conducteurs de la section du câble d'éclairage, gainé et gainé
intérieur, est l'attente ; elle doit être arrêtée à l'achat, pas déduite ici* (R5). **Le maximum
du tronc ne bouge pas** : il reste à 9 sur CH-05, et les deux goulottes restent les plus chargées
du réseau à 15 et 14 conducteurs.

Les conducteurs des prises complètent chaque ligne, dont le **fil d'ordre du bouton de porte**,
en 2,5 mm², sur CH-02, CH-04, CH-07, CH-08, CH-L1 et CH-A1, et la phase qui monte au bouton par
CH-L1 et CH-A1 — l'entrée de MC-02 commute la phase (révisé le 2026-09-23). **Ce qui suit dans ce paragraphe
décrit l'état d'avant.** Le seuil de 14,69 mm vaut désormais pour **CH-L1**, dont la composition
est celle de l'ancien CH-05 ; CH-04 et CH-07, quatre conducteurs de 2,5 mm² sur sept, ont un seuil
**à calculer** sur les cotes produit ; CH-02 et CH-05 se vérifient en IRL 25.

**Pourquoi CH-05 et lui seul** : c'est le tube qui descend de BD-01 vers BD-04, donc celui qui
porte à la fois la phase qui va aux commandes et les deux retours qui en reviennent. Ailleurs sur
le tronc, la phase non commutée s'arrête à CM-01 dans BD-04, et le retour de CM-03 ne monte
jamais au plafond : deux conducteurs de moins.

La condition à vérifier reste celle du cas le plus chargé, **`D ≥ d·√24 ≈ 4,899·d`**. Le tableau
d'occupation du § 3.2 la chiffre sans passer par un diamètre de conducteur : 36,7 % dans 14,0 mm
fixe la section totale des huit conducteurs à **71,93 mm²**, d'où un diamètre intérieur exigé
d'au moins **14,69 mm**. *Les quatre lignes de ce tableau se recoupent à 0,1 point près sur cette
valeur, ce qui la rend vérifiable sans cote de catalogue.*

**Le calibre du tronc est l'IRL 20 depuis le 2026-09-22**, sur décision du maître d'ouvrage. La
condition n'est donc plus acquise par construction : elle devient une **condition d'achat**, et
c'est ce que 3.2 expose. *Un conduit se pose d'un seul tenant et se dimensionne sur son tronçon le
plus chargé : CH-05 décide pour les cinq.*

Sur les quatre autres conduits du tronc, six conducteurs, la condition retombe à **environ 13 mm**
et aucun IRL 20 du marché n'y manque. **C'est CH-05, et lui seul, qui porte le risque.**

Sur les branches **propres** à l'éclairage, trois conducteurs, la condition retombe à
`D ≥ d·√9 = 3·d` — soit environ 9 mm de diamètre intérieur. Elles sont en **IRL 20** depuis le
2026-09-22, l'IRL 16 ayant été abandonné : la condition y est satisfaite avec une marge telle
qu'elle cesse d'être une question. *Ce desserrement n'est pas gratuit : il a été décidé pour que le
chantier ne compte qu'une seule référence de tube hors ligne de la borne, et il laisse de la place
aux conducteurs que la fonctionnalité `005` ajoutera sur CH-L1.*

Cette condition est exacte et **ne dépend d'aucune valeur de catalogue** : elle se vérifie en
lisant deux cotes sur les fiches produit.

**À vérifier à l'achat** : *(cotes produit relevées : D = .......... mm, d = .......... mm →
condition ..........)*

Les tronçons terminaux portent moins de conducteurs et la condition y est donc plus facile : la
vérification porte sur le tronc, qui est le cas le plus chargé.

*Depuis le 2026-09-22, ce décompte n'est plus écrit ici : il est **dérivé du pilotage déclaré**,
conduit par conduit, et **la fiche d'un conduit dans la maquette en montre le total, la
répartition par rôle et la condition de remplissage**. Le nombre déclaré par le circuit n'en est
plus la source mais le **garde-fou** : le maximum dérivé doit lui rester égal, et un test le
vérifie. Si la dérivation n'est pas possible — pilotage non déclaré —, la fiche retombe sur ce
nombre et annonce « au plus », car un majorant qui se donne pour un décompte est ce que le
Principe VI interdit.*

### 3.2 Pourquoi le tronc est partagé — et l'argument qui s'y opposait

FR-037 de `002-prises-de-courant` laissait l'éclairage comme **seul partageur possible**, à deux
conditions vérifiables. Les deux se retournent contre le partage, et c'est la conclusion la plus
utile de cette note.

**Le remplissage basculerait sur une cote non relevée.** Trois conducteurs de 2,5 mm² et cinq de
1,5 mm² dans un IRL 20 donnent, selon le diamètre intérieur réel du produit :

| Diamètre intérieur | Taux d'occupation | Règle du tiers |
|--------------------|-------------------|----------------|
| 14,0 mm | 36,7 % | **dépassée** |
| 14,5 mm | 34,2 % | **dépassée** |
| **14,69 mm** | **33,3 %** | **seuil exact** |
| 15,0 mm | 31,9 % | admise |
| 15,8 mm | 28,8 % | admise |

La conclusion dépend donc d'une cote produit que le relevé ne comporte pas.

**Cette note recommandait l'IRL 25 sur le tronc**, au motif que le calibre supérieur *retire* la
question au lieu de la suspendre — un IRL 25 donne 21,5 % quel que soit le produit. **Le maître
d'ouvrage a décidé le 2026-09-22 de retenir l'IRL 20 sur toute la ligne**, l'avis ci-dessus lui
ayant été présenté. La décision lui appartient ; ce qui suit en est la conséquence, et elle doit
être tenue.

**Ce que la décision déplace, et qui ne disparaît pas.** La question n'est pas tranchée, elle est
**reportée à l'achat**, avec trois conséquences :

1. **Une condition d'achat ferme** : le conduit retenu pour CH-05 doit présenter un diamètre
   intérieur **≥ 14,69 mm**. Deux des quatre valeurs du tableau ci-dessus n'y satisfont pas. Ce
   n'est donc pas une formalité de vérification, c'est un **critère de choix du produit**.
2. **Un mode de défaillance à connaître d'avance** : si le produit disponible fait moins de
   14,69 mm, CH-05 doit repasser en IRL 25 — 1,50 m de tube et deux changements de calibre, à
   BD-01 et BD-04. Le reste du tronc n'est pas concerné.
3. **Un tirage plus difficile**, sur le seul tube où l'ordre de montage impose de tirer les deux
   circuits **en même temps** : à 32 % d'occupation contre 21,5 %, huit conducteurs passent moins
   facilement. Ce n'est pas une question de conformité, c'est une question de chantier, et elle se
   paie le jour de la pose.

*La version antérieure de cette note avait présenté ce basculement de remplissage comme une raison
de ne pas partager le tronc du tout. C'était faux, et ça le reste : le partage n'est pas en cause,
seul le calibre l'est.*

**Le facteur de groupement pénaliserait le circuit des prises.** Grouper deux circuits impose un
facteur de correction sur les **deux**. Or la note de calcul de `002` porte déjà une question
ouverte et explicitement non éludée : « si le calibre est de 20 A, quelle marge reste-t-il face à
un `Iz` du même ordre ? ». Appliquer un facteur de réduction à un circuit dont la marge est
inconnue serait ajouter une inconnue à une inconnue.

**Ce que le partage a résolu** : la paroi est ne porte plus qu'un conduit dans la bande
contrainte de 0,25 m au-dessus du linteau, au lieu de deux. La place de la ligne de la borne y
est préservée sans empilement — voir R3.

### 3.3 Résistance de la prise de terre — régime TT

Sans changement par rapport à `002` : `R ≤ U_L / IΔn` avec `U_L` = 50 V en local sec.

| IΔn | R maximale |
|-----|------------|
| 30 mA (différentiel du circuit) | 1 667 Ω |
| 500 mA (hypothèse de la protection amont) | **100 Ω** |

Le garage n'a pas de prise de terre propre — la terre arrive par le PE du 3G16. **FR-012 étend
l'exigence à chaque point d'éclairage, y compris les deux points extérieurs et le détecteur.**

## 4. Bilan de puissance

Sans enjeu pour ce circuit. Les six réglettes LED appellent 0,939 A, soit **2,4 %** de la
puissance souscrite de 9 kVA. Le circuit d'éclairage ne participe pas à la contrainte de
bilan que la borne de recharge fait peser sur le branchement.

Ce qui compte ici est l'inverse : **FR-016 exige un circuit distinct de celui des prises**, et
FR-017 en assume la conséquence recherchée — un défaut sur les prises ne plonge pas le garage
dans le noir. SC-006 en fait un essai : les six points coupent à l'essai du différentiel **et
les prises restent alimentées**.

## 5. Conclusions explicites exigées par le contrat

| Question du contrat | Réponse | État |
|---------------------|---------|------|
| Quelle **hypothèse de simultanéité** ? | Les six réglettes allumées ensemble, cas majorant, et il tient avec 1,14 point de marge. La puissance unitaire étant DÉCLARÉE et non supposée, l'hypothèse n'a plus à être discutée pour conclure | **acquis** |
| Le décompte des points tient-il dans la limite normative ? | 6 points, 6 sorties ; limite **normative à confirmer** | **ouverte** |
| **Le dégagement sous le tablier est-il établi ?** | **Non.** EL-01a et EL-01b, à y = 1,55 m, sont sous le tablier remonté, dont **l'épaisseur n'a jamais été relevée**. **Aucun segment de conduit n'est plus en cause** : les trois qui l'étaient — CH-L10 seg. 3, CH-L13 seg. 2 et 3 — appartenaient aux colonnes supprimées par le pontage. *Elles sont aussi les deux seules réglettes **alimentées par cordage*** — à lever par un relevé avant pose | **ouverte** |
| `IB ≤ In ≤ Iz` avec l'`Iz` du mode de pose **réel** (B1, en conduit) ? | Structure du contrôle posée ; `Iz` et `In` **normatifs à confirmer** | **ouverte** |
| Le taux de remplissage du **tronc partagé** est-il respecté ? | **Révisé le 2026-09-23.** CH-02 et CH-05, dix et neuf conducteurs, sont en **IRL 25** : condition à vérifier à ce calibre. En IRL 20, **CH-L1 exige ≥ 14,69 mm** intérieurs, et **CH-04, CH-07** un seuil à calculer. Deux valeurs produit sur quatre échouent déjà à 14,69 mm : c'est une **condition d'achat**, pas une vérification de forme (2.4, 3.1, 3.2) | **ouverte — conditionne l'achat du conduit** |
| La chute de tension cumulée reste-t-elle sous 3 % ? | **Oui — 1,86 %** au point d'utilisation sur la forme exacte, marge de 1,14 point — 1,79 % avant le pontage, 1,77 % avant le recul de l'axe au sud, 1,76 % avant l'automatisation | **acquis** |
| Le type de différentiel satisfait-il le Principe II ? | Dépend de la décision FR-050, section 6. **Plus contraignant ici que pour les prises** | **ouverte** |

## 6. FR-050 — le type du différentiel, plus contraignant ici

**Décision du maître d'ouvrage. Non tranchée à ce jour.** C'est la même décision que pour les
prises, mais elle pèse davantage sur ce circuit, et il faut le dire.

Le tableau divisionnaire est équipé d'un interrupteur différentiel de **type AC**. Le Principe II
énonce qu'un type AC ne détecte que les courants résiduels alternatifs sinusoïdaux et **ne voit
pas** les composantes continues pulsées produites par les alimentations à découpage.

Ce circuit en comporte deux sources, et l'une est permanente :

- les **drivers des luminaires LED**, que le Principe II désigne nommément ;
- le **détecteur de présence**, appareil électronique **alimenté en permanence** par construction
  (FR-042). Il ne cesse jamais d'être une charge à découpage, même toutes lumières éteintes.

Pour les prises, la charge à découpage est intermittente — un chargeur d'outil branché. Ici elle
est **continue et inévitable**. Une sensibilité de 30 mA sur un type inadapté est une protection
qui ne déclenche pas, et elle ne déclencherait pas en permanence.

**Décision retenue** : .......................................................................

**Motif écrit** : ............................................................................

## 7. Les deux réglages à consigner, qui ne sont pas des calculs

Le Principe V exige que ce qui n'est pas consigné soit réputé non fait. Deux réglages de chantier
en relèvent.

**Champ de détection de CM-02** (FR-040, SC-017) — réglé pour couvrir l'aire de manœuvre et
**ignorer** la voie publique et la propriété voisine.

*(champ retenu : ..............)*

**Temporisation d'extinction** (FR-041, SC-018) — la valeur retenue est consignée, et le réglage
effectif doit y correspondre.

*(temporisation retenue : .............. — réglage vérifié le ..............)*

**Ce qu'aucun réglage ne rattrapera** : il n'y a **pas d'allumage forcé** sur EL-02. Qui décharge
son véhicule en restant immobile verra la lumière s'éteindre, sans moyen de la maintenir. C'est
une conséquence assumée du choix du détecteur, énoncée à la spécification, et la temporisation
est le seul levier disponible.
