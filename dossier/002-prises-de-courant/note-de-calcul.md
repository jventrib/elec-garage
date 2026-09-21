# Note de calcul — circuit des prises de courant du garage

**Fonctionnalité**: `002-prises-de-courant` | **Circuit**: `c-prises` | **Date**: 2026-09-21

Ce document porte le **raisonnement**. Les valeurs conclues vivent une seule fois, dans
l'entité circuit de `data/apports/002-prises-de-courant.json` — voir
[contracts/note-de-calcul.md](./contracts/note-de-calcul.md).

Chaque grandeur porte son **origine** (`calculée`, `décidée`, `normative`), et toute valeur
normative porte sa **référence de clause** et son **état de confirmation**. Une valeur
normative sans référence vérifiée est marquée **à confirmer** et n'est pas opposable
(Principe I). Aucune valeur normative n'est renseignée de mémoire : une case vide vaut mieux
qu'un chiffre plausible sur une grandeur de sécurité (R6).

## 1. Données d'entrée

| Donnée | Valeur | Origine |
|--------|--------|---------|
| Mode de pose | Apparent, conducteurs isolés en conduit IRL | Donnée figée (constitution) |
| Section retenue | 2,5 mm² cuivre | Décidée (maître d'ouvrage, FR-041) |
| Conduit | **IRL 20 partout**, branches propres comme tronc partagé | Décidée (FR-035, FR-037 révisé) ; le tronc est passé par l'IRL 25 du 2026-09-21 au 2026-09-22, puis ramené à l'IRL 20 sur décision du maître d'ouvrage. ⚠️ Condition d'achat sur CH-05 : voir § 3.2 de la note de `003` |
| Nombre de conducteurs | 3 — phase, neutre, PE | Décidée |
| Arrivée depuis l'habitation | 3G16, 30 m, protégée à 63 A au départ | Relevée |
| Disjoncteur d'abonné | 45 A pour 9 kVA monophasé | Relevée |
| Régime de neutre | TT, garage accolé, terre par le PE du 3G16 | Relevée |
| Points desservis | 5 points, **8 prises** (un socle double compte pour deux) | Calculé (FR-013, R7) |
| Tension de référence | 230 V | Donnée |
| Résistivité du cuivre | ρ = 0,0225 Ω·mm²/m | Donnée physique |

## 2. Les sept lignes obligatoires du Principe III

| Grandeur | Valeur | Origine | Référence | État |
|----------|--------|---------|-----------|------|
| Courant d'emploi `IB` | *(à établir)* | Décidée, à partir des charges de FR-022 | — | **à statuer** |
| Mode de pose | Apparent sous conduit IRL, conducteurs isolés — **catégorie B1** | Donnée figée | — | acquis |
| Courant admissible `Iz` de 2,5 mm² | *(à renseigner)* | **Normative** — table, mode de pose et lettre de sélection | *(clause : ..............)* | **à confirmer** |
| Facteur de correction de température | *(à renseigner)* | **Normative** — température ambiante | *(clause : ..............)* | **à confirmer** |
| Facteur de correction de **groupement** | *(à renseigner)* | **Normative** — **désormais EXIGIBLE** : le tronc est partagé avec le circuit d'éclairage depuis le 2026-09-21 (FR-065) | *(clause : ..............)* | **à confirmer** |
| Calibre de protection `In` | *(à renseigner)* | **Normative** — appariement avec la section | *(clause : ..............)* | **à confirmer** |
| Longueur du chemin le plus long | **8,86 m** jusqu'à PC-04 | **Calculée** par le socle sur le tracé réel | — | acquis |
| Chute de tension terminale / cumulée | **1,39 % / 3,04 %** | **Calculée** — ΔU = 2ρLI/S | — | acquis |

### 2.1 Longueur du chemin le plus long — calculée sur le tracé réel

Ce n'est pas le métré total (13,97 m) qui décide de la chute de tension, mais le **chemin le
plus long** depuis le tableau. Le socle le calcule sur le graphe des conduits, en comptant
chaque traversée de paroi pour l'épaisseur qu'elle franchit.

| Point | Longueur de conduit | ΔU à 20 A |
|-------|---------------------|-----------|
| PC-01 | 5,51 m | 0,86 % |
| PC-02 | 5,71 m | 0,89 % |
| PC-05 | 6,18 m | 0,97 % |
| PC-03 | 8,66 m | 1,36 % |
| **PC-04** | **8,86 m** | **1,39 %** ← dimensionnant |

*Révisé deux fois le 2026-09-21 : traversée par le fond du socle (FR-029), puis entrée des
conducteurs par le haut (FR-061). Les quatre socles muraux gardaient alors exactement leur
longueur — 5,70 / 5,90 / 8,15 / 8,35 m. Seul PC-05 s'allongeait de 0,60 m, BD-01 ayant été
remontée au droit de PC-01.*

*Révisé de nouveau le **2026-09-23** : PC-03 et PC-04 passent en **façade nord**, sur décision du
maître d'ouvrage. Les deux points se déplacent ENSEMBLE parce que la traversée sort du fond du
boîtier intérieur et franchit donc la paroi sur laquelle il est posé — un boîtier sur le mur
droit ne peut pas laisser sortir une traversée du mur du fond. L'antenne continue jusqu'à
l'angle, tourne sur la paroi nord et descend : **+0,30 m** sur les deux points, qui passent de
8,15 / 8,35 à **8,45 / 8,65 m**. PC-01, PC-02 et PC-05 ne bougent pas. Le point dimensionnant
reste PC-04.*

*Révisé le **2026-09-24** : la goulotte GL-02 remplace l'antenne CH-02, la montée CH-04 et BD-01
(changement `goulotte-paroi-est`, [étude](../../openspec/changes/archive/2026-09-25-goulotte-paroi-est/etude.md)).
Les conducteurs montent à l'axe du profilé, un 90 × 40 dont l'axe est à 2,705 m, et en sortent par
une face : **+0,21 m** sur PC-01, PC-02, PC-03 et PC-04, dont les descentes partent du dessous du
profilé, à 2,66 m ; **−0,025 m** sur PC-05, par la face avant. Les valeurs antérieures de PC-01 et PC-02 — 5,70 et 5,90 m — étaient déjà
périmées : le tracé les donnait à 5,30 et 5,50 m depuis la contiguïté de la goulotte GL-01.*

### 2.2 Chute de tension — calculée

`ΔU = 2ρLI/S`, avec ρ = 0,0225 Ω·mm²/m. Le calcul est purement physique et ne dépend d'aucune
table ; il est donc conduit intégralement ici.

| Tronçon | L | I | S | ΔU | % de 230 V |
|---------|---|---|---|----|------------|
| Arrivée 3G16 depuis le tableau principal | 30 m | 45 A | 16 mm² | 3,797 V | **1,65 %** |
| Circuit des prises, jusqu'à PC-04 | 8,86 m | 20 A | 2,5 mm² | 3,190 V | **1,39 %** |
| **Cumul** | | | | **6,99 V** | **3,04 %** |

**Conclusion** : 3,04 % contre une limite de 5 % pour un circuit autre qu'éclairage, soit une
marge de **1,96 point**. Le passage en façade nord du 2026-09-23 a coûté 0,04 point, la goulotte de
la paroi est du 2026-09-24 0,04 point. Le courant d'emploi de 20 A retenu pour ce calcul est l'hypothèse
majorante du calibre envisagé ; si `IB` est arrêté plus bas, la chute ne peut que diminuer.

**Ce qui domine est l'amont, non le terminal** : 1,65 % contre 1,35 %. Raccourcir le circuit du
garage n'apporterait presque rien ; c'est la longueur des 30 m depuis l'habitation qui pèse.

## 3. Les trois vérifications complémentaires

| Vérification | Valeur | Origine | Référence | État |
|--------------|--------|---------|-----------|------|
| Taux de remplissage du conduit | Condition exacte `D > 3d` — voir 3.1 | **Calculée** (géométrie) ; la règle du tiers est une **règle de l'art**, non une clause | règle de l'art, à citer comme telle | acquis, sous réserve des cotes produit |
| Décompte des prises | **8** | **Calculé** (FR-013, R7) | — | acquis |
| Limite de prises pour 2,5 mm² et le calibre retenu | *(à renseigner)* | **Normative** | *(clause : ..............)* | **à confirmer** |
| Résistance maximale de la prise de terre | `R ≤ 50/IΔn` — voir 3.3 | **Calculée** ; le seuil de 50 V est normatif | *(clause du seuil : ..............)* | seuil **à confirmer** |

### 3.1 Occupation du conduit — une condition exacte, sans cote produit

Avec **n** conducteurs de diamètre extérieur isolé **d** dans un conduit de diamètre intérieur
**D**, le taux d'occupation géométrique vaut :

```
taux = n · (d/2)² / (D/2)² = n · (d/D)²
```

Pour n = 3, la règle du tiers — `taux ≤ 1/3` — s'écrit donc :

```
3 (d/D)² ≤ 1/3   ⟺   9 d² ≤ D²   ⟺   D ≥ 3 d
```

**Le diamètre intérieur du conduit doit valoir au moins trois fois le diamètre extérieur d'un
conducteur.** Cette condition est exacte et **ne dépend d'aucune valeur de catalogue** : elle se
vérifie en lisant deux cotes sur les fiches produit, sans table normative ni estimation.

C'est délibérément la forme retenue. Poser un chiffre — « environ 15 % » — aurait exigé
d'inventer un diamètre intérieur d'IRL 20 et un diamètre extérieur de conducteur que le relevé
ne comporte pas, et aurait donné l'apparence d'une vérification faite. La condition, elle, est
vérifiable par le poseur avec les produits réellement achetés.

**À vérifier à l'achat** : `D ≥ 3d` pour l'IRL 20 et le conducteur 2,5 mm² retenus. *(cotes
produit relevées : D = .......... mm, d = .......... mm → condition ..........)*

### 3.2 Décompte des prises — huit

PC-01 (2) + PC-02 (2) + PC-03 (1) + PC-04 (2) + PC-05 (1) = **8 prises** pour 5 points.

Le décompte porte sur les **prises**, non sur les boîtiers : un socle double compte pour deux
(R7). La limite applicable pour 2,5 mm² au calibre retenu est **normative** et reste à
confirmer ; elle ne peut pas être posée ici.

### 3.3 Résistance de la prise de terre — régime TT

En TT, la protection contre les contacts indirects repose sur le différentiel, et la condition
est `R ≤ U_L / IΔn` avec `U_L` = 50 V en local sec.

| IΔn | R maximale |
|-----|------------|
| 30 mA (différentiel du circuit) | 1 667 Ω |
| 500 mA (hypothèse de la protection amont) | **100 Ω** |

C'est la branche la plus contraignante qui commande : **100 Ω** si un différentiel de 500 mA
existe en amont. Le garage n'a pas de prise de terre propre — la terre arrive par le PE du
3G16 — d'où l'exigence de FR-048 : la continuité du PE se mesure **point par point** et chaque
valeur est consignée. C'est la seule parade à l'absence de prise de terre locale.

Le seuil de 50 V est normatif et reste à confirmer sur le texte.

## 4. Bilan de puissance et cumul avec la borne

| Grandeur | Valeur | Part du souscrit |
|----------|--------|------------------|
| Puissance souscrite | 9 kVA monophasé, soit **39,1 A** | 100 % |
| Borne de recharge (`004`) | 32 A, soit 7,36 kW | **82 %** |
| Reste pendant une charge | 7,1 A, soit **1,64 kW** | 18 % |
| Circuit des prises, à 20 A seul | 20 A | 51 % |

**Le cumul simultané ne passe pas** : 20 A + 32 A = 52 A contre 39,1 A souscrits, soit un
dépassement de 12,9 A. Le disjoncteur d'abonné déclencherait, et il coupe **toute
l'habitation**, non le seul garage.

Ce n'est pas un défaut de conception de ce circuit, et cela n'impose rien ici : le maître
d'ouvrage a retenu (constitution v1.4.1, puis `004` FR-012 option B) une **restriction écrite
d'exploitation** plutôt qu'un dispositif de modulation, et déclaré ne jamais envisager
l'usage d'un gros consommateur en parallèle de la borne. Le circuit des prises reste donc
dimensionné pour son propre usage, sans bridage.

**Ce que la note doit dire sans l'éluder** : sous cette voie, rien ne module. Un dépassement de
la restriction ne provoque pas une coupure locale mais le déclenchement du branchement entier.
C'est la contrepartie assumée de l'absence de délestage, et elle appartient à `004` (FR-034).

## 5. Conclusions explicites exigées par le contrat

| Question du contrat | Réponse | État |
|---------------------|---------|------|
| Le circuit unique admet-il le compresseur sans que FR-024 s'applique ? | *(à statuer — dépend de la plaque du compresseur, non relevée)* | **ouverte** |
| Les 8 prises tiennent-elles dans la limite pour 2,5 mm² au calibre retenu ? | 8 prises, limite **normative à confirmer** | **ouverte** |
| `IB ≤ In ≤ Iz` est-elle satisfaite avec l'`Iz` du mode de pose **réel** (B1, en conduit) ? | Structure du contrôle posée ; `Iz` et `In` **normatifs à confirmer** | **ouverte** |
| Si le calibre est de 20 A, quelle marge reste-t-il face à un `Iz` du même ordre ? | À chiffrer dès que `Iz` est confirmé. **La question ne doit pas être éludée** : un `In` de 20 A face à un `Iz` voisin de 20 A laisse une marge nulle, et c'est le facteur de température qui tranchera | **ouverte** |
| Le taux de remplissage de l'IRL 20 est-il respecté ? | **Oui si `D ≥ 3d`** — condition exacte, à lire sur les fiches produit | acquis, sous réserve des cotes |
| La chute de tension cumulée reste-t-elle sous 5 % ? | **Oui — 3,04 %**, marge de 1,96 point | **acquis** |
| Le type de différentiel satisfait-il le Principe II ? | Dépend de la décision FR-050, section 6 | **ouverte** |

## 6. FR-050 — sort de l'interrupteur différentiel de type AC

**Décision du maître d'ouvrage. Non tranchée à ce jour.**

Le tableau divisionnaire relevé est équipé d'un interrupteur différentiel de **type AC**. Le
Principe II énonce qu'un type AC ne détecte que les courants résiduels alternatifs sinusoïdaux
et **ne voit pas** les composantes continues pulsées produites par les alimentations à
découpage. Or les charges de ce circuit en comportent : chargeurs d'outils sans fil,
électronique de la motorisation de la porte sectionnelle alimentée par PC-05.

Une sensibilité de 30 mA sur un type inadapté est une protection qui ne déclenche pas.

| Option | Conséquence |
|--------|-------------|
| Conserver le type AC | Protection non effective pour une part des charges réelles du circuit |
| Remplacer par un type A | Détecte les composantes continues pulsées ; couvre les charges recensées |

Le Principe II exige en outre qu'un type AC **ne soit pas placé en amont** d'un type A ou B :
une composante continue le désensibilise. La décision doit donc porter sur la chaîne complète,
pas seulement sur l'appareil du garage.

**Décision retenue** : .......................................................................

**Motif écrit** : ............................................................................

## 7. FR-049 — liaison équipotentielle du tablier et du rail

**Décision du maître d'ouvrage. Non tranchée à ce jour.**

Le tablier et le rail de la porte sectionnelle sont des éléments conducteurs accessibles,
auxquels la motorisation alimentée par PC-05 est mécaniquement liée. Le Principe II exige que
les liaisons équipotentielles soient établies sur tous les éléments conducteurs concernés.

La décision doit être écrite **y compris s'il est conclu qu'aucune liaison n'est requise**,
avec son motif : c'est l'absence de trace, et non l'absence de liaison, qui rendrait le dossier
incomplet.

**Décision retenue** : .......................................................................

**Motif écrit** : ............................................................................
