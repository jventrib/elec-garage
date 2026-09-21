# Note de calcul — circuit d'éclairage du garage

**Fonctionnalité**: `003-eclairage` | **Circuit**: `c-eclairage` | **Date**: 2026-09-21

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
| Conduit | **IRL 20**, branches propres comme tronc partagé, **sauf CH-02 et CH-05 en IRL 25** | **Décidée le 2026-09-22** par le maître d'ouvrage. Sur le tronc, contre l'avis motivé de la note — voir 3.2. Sur les branches, l'IRL 20 remplace l'IRL 16 et **desserre** la condition de remplissage. **CH-02 et CH-05 repassés en IRL 25 le 2026-09-23**, décision du maître d'ouvrage, à onze et neuf conducteurs — voir 2.4 |
| Nombre de conducteurs sur le tronc | **6 au plus** dans un conduit, sur CH-02 et CH-05 ; **8** dans la goulotte — voir 3.1 | **Dérivé** du pilotage déclaré |
| Points lumineux / sorties | 3 points, **4 sorties** | FR-001, FR-002 |
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
| Mode de pose | Apparent sous conduit IRL **dédié**, conducteurs isolés — **catégorie B1**. **Sauf dans les goulottes** — GL-01 au-dessus du tableau, et depuis le 2026-09-24 GL-02 au plafond de la paroi est, soit 3,04 m des 8,18 m du trajet de EL-01b —, où les conducteurs cheminent sans tube | Donnée figée ; la portion en goulotte relève d'une autre lettre de sélection | *(clause : ..............)* | B1 acquis ; **goulotte à confirmer** — voir 2.4 |
| Courant admissible `Iz` de 1,5 mm² | *(à renseigner)* | **Normative** — table, mode de pose et lettre de sélection | *(clause : ..............)* | **à confirmer** |
| Facteur de correction de température | *(à renseigner)* | **Normative** — température ambiante | *(clause : ..............)* | **à confirmer** |
| Facteur de correction de **groupement** | *(à renseigner)* | **Normative** — **EXIGIBLE** : le tronc est partagé avec le circuit des prises depuis le 2026-09-21 | *(clause : ..............)* | **à confirmer** |
| Calibre de protection `In` | *(à renseigner)* | **Normative** — appariement avec la section | *(clause : ..............)* | **à confirmer** |
| Longueur du chemin le plus long | **8,18 m** jusqu'à EL-01b, que la phase parcourt aussi depuis le 2026-09-23 — 8,20 m avant la goulotte GL-02, **9,00 m** avant le recul de l'axe au sud, **12,00 m** avant MC-01 | **Calculée** par le socle sur le tracé réel | — | acquis |
| Chute de tension terminale / cumulée | **0,111 % / 1,76 %** au pire cas — 0,112 % avant la goulotte GL-02, 0,122 % / 1,77 % avant le recul de l'axe au sud, **0,142 % / 1,79 %** avant l'automatisation | **Calculée** — ΔU = ρ·I·(L_phase + L_neutre)/S | — | acquis |

### 2.1 Longueur du chemin le plus long — calculée sur le tracé réel

Ce n'est pas le métré — 8,13 m en propre, plus 7,95 m de tronc partagé, inchangés l'un et
l'autre par le déplacement de l'axe — qui décide de la chute
de tension, mais le **chemin le plus long** depuis le tableau.

Deux longueurs, et non plus une seule. La longueur de **conduit** est celle que parcourent le
neutre et le PE, qui vont tout droit ; celle de **phase** compte le détour par la commande, et
c'est le socle qui la dérive depuis le 2026-09-22 — voir 2.3.

| Point | Longueur de conduit (neutre, PE) | Longueur de **phase** dérivée |
|-------|---------------------|-------------------------------|
| EL-02 | 5,28 m | 5,88 m — commuté **sur place** par le détecteur |
| EL-03 | 3,33 m | 6,94 m — par CM-03 |
| EL-01a | 7,98 m | 7,98 m — par MC-01 *(8,00 m avant la goulotte GL-02 ; 8,80 m avant le recul de l'axe au sud ; 11,80 m par CM-01 avant MC-01)* |
| **EL-01b** | **8,18 m** | **8,18 m** ← dimensionnant *(8,20 m avant la goulotte GL-02 ; 9,00 m avant le recul de l'axe au sud ; 12,00 m avant MC-01)* |

CM-01 est à **4,71 m** de conduit du tableau, CM-03 à **4,91 m** — elle est dehors, au dos de
BD-04 depuis le 2026-09-21, d'où les 0,20 m de paroi en plus. Ces deux valeurs sont dérivées, non
relevées : le socle sait désormais calculer une distance depuis un nœud quelconque, et non plus
seulement depuis le tableau.

*Révisé quatre fois le 2026-09-21. La mutualisation du tronc avait raccourci le chemin le plus
long de 0,20 m ; le décalage de l'axe vers le nord l'a ensuite allongé de 1,05 m, le conduit
allant chercher le droit du socle du moteur avant de remonter ; la réutilisation du tube vertical
par EL-03 a raccourci **ce point-là** de 2,90 m sans toucher au point dimensionnant ; le
rapprochement de l'axe à 0,20 m de la porte n'a enfin **rien changé du tout** — CH-02 perd 0,40 m
et CH-07 les reprend, et les deux sont sur le tronc. Sans conséquence sur la conclusion : 1,21
point de marge.*

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

Sur EL-01b, dimensionnant, `L_phase + L_neutre` = 9,00 + 9,00 = **18,00 m** depuis que le
plafonnier est commuté par MC-01 — 21,00 m auparavant, voir 2.4. Trois hypothèses de charge, les
quatre sorties allumées ensemble :

| Hypothèse | Courant | ΔU terminale sur 16,35 m | Cumulée avec l'arrivée (1,65 %) |
|-----------|---------|------------------------|----------------------------------|
| 4 × 20 W LED | 0,35 A | 0,037 % | 1,69 % |
| 4 × 40 W LED | 0,70 A | 0,074 % | 1,73 % |
| **4 × 60 W LED** | **1,04 A** | **0,111 %** | **1,76 %** |

**Conclusion** : 1,76 % au pire cas contre une limite de **3 %** applicable à l'éclairage, soit
une marge de **1,24 point**. *1,79 % et 1,21 point avant l'automatisation ; 1,77 % et 1,23 point avant que l'axe du plafonnier recule de 0,80 m au sud, le 2026-09-23 — la terminale est passée de 18,00 à 16,40 m, phase et neutre. Puis à 16,35 m le 2026-09-24 : la goulotte GL-02 remplace l'antenne CH-02 et la montée CH-04, et les conducteurs sortent par la face avant du profilé au lieu de monter au plafond (changement `goulotte-paroi-est`). La cumulée ne bouge pas au centième.*

**La limite de 3 % paraissait sévère ; elle ne l'est pas.** L'arrivée en consomme 1,65 % à elle
seule, et il ne semblait rester que 1,35 % pour le circuit terminal. Le calcul montre que celui-ci
n'en consomme que **0,14 %** — onze fois moins que l'amont. Allonger le circuit d'éclairage de
moitié ne le mettrait pas en difficulté.

**Ce qui en découle, et qui est le vrai enseignement** : la question n'est pas la section mais
l'**hypothèse de simultanéité** (FR-019, SC-007). Et elle est ici sans enjeu, puisque les quatre
sorties allumées en même temps tiennent déjà avec 1,23 point de marge.

### 2.3 Le détour par la commande — réserve levée le 2026-09-22

**Cette section portait une réserve ouverte le 2026-09-21. Elle est fermée.**

Elle disait ceci : les longueurs de 2.1 sont des **longueurs de conduit**, et pour un point
commuté ce n'est pas la longueur du conducteur de **phase** — celle-ci descend d'abord à
l'interrupteur, puis remonte vers la sortie. Le neutre, lui, va directement. La forme `2ρLI/S`
suppose les deux de même longueur ; ici elles diffèrent.

L'écart était chiffré à la main, et il aboutissait à 0,142 % / 1,79 %. **Ces deux valeurs ont
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

- **La phase ne fait plus de détour.** MC-01 est sur le chemin du plafonnier : la longueur de
  phase de EL-01b retombe à celle de son conduit, 9,00 m, et la chute cumulée de 1,79 % à
  **1,77 %**. Le détour ne subsiste que pour EL-03, par CM-03.
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
| Taux de remplissage du **tronc partagé** | Condition exacte `D ≥ d·√(3n)`, avec **n = 11 sur CH-02, 9 sur CH-05** — en IRL 25 — et **8 sur CH-04, CH-07 et CH-L1** en IRL 20 — voir 3.1 | **Calculée** (géométrie) ; la règle du tiers est une **règle de l'art** | règle de l'art, à citer comme telle | acquis, sous réserve des cotes produit |
| Décompte des points d'éclairage | **3 points, 4 sorties** | **Calculé** | — | acquis |
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
| CH-01, CH-02 | 6 | phase, neutre, PE |
| CH-04, CH-07 | 6 | neutre, PE, **retour du plafonnier** |
| **CH-05** | **8** | phase, neutre, PE, **deux retours commandés** |

**Révisé le 2026-09-23, par l'automatisation locale** — voir 2.4. CH-01 n'est plus un conduit
depuis la goulotte ; le décompte dérivé est désormais :

| Cheminement | Calibre | Conducteurs | dont éclairage |
|-------------|---------|-------------|----------------|
| GL-01, goulotte | profilé | 14, borne comprise | 8 : phase, neutre, PE, **sortie de MC-01**, paires d'ordre de CM-01 et CM-04 |
| **CH-02** | **IRL 25** | **10** | 6 : phase, neutre, PE, sortie de MC-01, paire d'ordre de CM-01 |
| **CH-05** | **IRL 25** | **9** | 6 : phase, neutre, PE, retour de CM-03, paire d'ordre de CM-01 |
| CH-04, CH-07 | IRL 20 | 7 | 3 : neutre, PE, sortie de MC-01 |
| CH-L1 | IRL 20 | 8 | 5 : phase, neutre, PE, paire d'ordre de CM-04 |
| CH-A1 | IRL 20 | 6 | 3 : PE, paire d'ordre de CM-04 |

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

Sans enjeu pour ce circuit. Quatre sorties LED appellent de 0,35 à 1,04 A, soit au pire **2,7 %**
de la puissance souscrite de 9 kVA. Le circuit d'éclairage ne participe pas à la contrainte de
bilan que la borne de recharge fait peser sur le branchement.

Ce qui compte ici est l'inverse : **FR-016 exige un circuit distinct de celui des prises**, et
FR-017 en assume la conséquence recherchée — un défaut sur les prises ne plonge pas le garage
dans le noir. SC-006 en fait un essai : les quatre points coupent à l'essai du différentiel **et
les prises restent alimentées**.

## 5. Conclusions explicites exigées par le contrat

| Question du contrat | Réponse | État |
|---------------------|---------|------|
| Quelle **hypothèse de simultanéité** ? | Les quatre sorties allumées ensemble, cas majorant, et il tient avec 1,23 point de marge. L'hypothèse n'a donc pas besoin d'être discutée pour conclure | **acquis** |
| Le décompte des points tient-il dans la limite normative ? | 3 points, 4 sorties ; limite **normative à confirmer** | **ouverte** |
| `IB ≤ In ≤ Iz` avec l'`Iz` du mode de pose **réel** (B1, en conduit) ? | Structure du contrôle posée ; `Iz` et `In` **normatifs à confirmer** | **ouverte** |
| Le taux de remplissage du **tronc partagé** est-il respecté ? | **Révisé le 2026-09-23.** CH-02 et CH-05, dix et neuf conducteurs, sont en **IRL 25** : condition à vérifier à ce calibre. En IRL 20, **CH-L1 exige ≥ 14,69 mm** intérieurs, et **CH-04, CH-07** un seuil à calculer. Deux valeurs produit sur quatre échouent déjà à 14,69 mm : c'est une **condition d'achat**, pas une vérification de forme (2.4, 3.1, 3.2) | **ouverte — conditionne l'achat du conduit** |
| La chute de tension cumulée reste-t-elle sous 3 % ? | **Oui — 1,76 %** sur la forme exacte, marge de 1,24 point — 1,77 % avant le recul de l'axe au sud, 1,79 % avant l'automatisation | **acquis** |
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
