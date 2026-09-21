# Note de calcul — borne de recharge

**Fonctionnalité**: `004-borne-recharge` | **Date**: 2026-09-22

Cette note suit le contrat de [contracts/note-de-calcul.md](./contracts/note-de-calcul.md). Les
cases `(à renseigner)` et `(clause : ......)` sont **vides à dessein** : ce sont des valeurs
normatives, et un chiffre plausible sur une grandeur de sécurité a l'apparence d'une vérification
sans en être une.

## 1. Les données de départ

| Grandeur | Valeur | Origine |
|----------|--------|---------|
| Courant d'emploi `IB` | **32 A** | Donnée du besoin, non une hypothèse |
| Tension | 230 V monophasé | Donnée du branchement |
| Puissance nominale | ≈ **7,4 kW** | Découle de `IB` |
| Durée d'appel | **plusieurs heures d'affilée** | Nature de la charge (FR-014) |
| Mode de pose | **deux portions** depuis le 2026-09-24 : **7,12 m en goulotte**, câble à enveloppe propre, avec les deux autres circuits ; **3,36 m sous conduit** IRL dédié, la descente CH-B3 — catégorie **B1** pour des conducteurs isolés | Constitution ; décision du maître d'ouvrage du 2026-09-24 — voir 2.3 |
| Section retenue | **10 mm²** cuivre | **Décidée** par le maître d'ouvrage le 2026-09-22 |
| Forme | **câble 3G10**, sur tout le parcours | **Décidée** par le maître d'ouvrage le 2026-09-24 — voir 2.3 |
| Calibre du conduit | **IRL 25** | **Décidé** le 2026-09-22 — voir 3.1. **Remis en cause** par le câble en goulotte, voir 2.3 |
| Arrivée du garage | 30 m de 3G16 depuis la maison | Relevé |
| Puissance souscrite | **9 kVA**, soit 39 A | Relevé |

## 2. Les sept lignes du Principe III

| Grandeur | Valeur | Origine | Référence | État |
|----------|--------|---------|-----------|------|
| Courant d'emploi `IB` | **32 A** | Besoin | — | acquis |
| Mode de pose | câble en goulotte sur 7,12 m, conduit sur 3,36 m | Figée par le tracé | *(lettre de sélection du câble en goulotte : ..............)* | **à confirmer** |
| Courant admissible `Iz` | *(à renseigner)* | **Normative** — table, pour ce mode de pose et la lettre de sélection | *(clause : ..............)* | **à confirmer** |
| Facteur de température | *(à renseigner)* | **Normative** — ambiance retenue | *(clause : ..............)* | **à confirmer** |
| Facteur de **groupement** | *(à renseigner)* | **Normative** — **EXIGIBLE** sur les 7,12 m de goulotte, où la ligne cohabite avec les prises et l'éclairage : trois circuits | *(clause : ..............)* | **à confirmer — bloquant pour l'achat** |
| Calibre `In` | *(à renseigner)* | **Normative** — appariement avec la section, et `IB ≤ In ≤ Iz` | *(clause : ..............)* | **à confirmer** |
| Longueur du chemin le plus long | **10,61 m** | **Calculée** par le socle sur le tracé réel | — | acquis |
| Chute de tension | **0,66 % / 2,32 %** cumulée | **Calculée** — `ΔU = 2ρLI/S` | — | acquis |

**Correction du 2026-09-24 — le facteur de groupement n'est pas « sans objet ».** Cette ligne le
déclarait, « démontré par le tracé » : la ligne était seule dans son conduit. **C'était faux depuis
l'amendement v1.14.0**, qui a fait entrer la ligne dans la goulotte GL-01 sur 1,12 m, avec les deux
autres circuits ; la spec « Circuit de la borne entièrement dédié » exige depuis lors le facteur de
groupement sur toute portion partagée, et la note ne l'a pas suivie. L'erreur est consignée ici
telle qu'elle a été faite. La goulotte de la paroi est la porte à **7,12 m** — 1,12 m de GL-01 et
6,00 m de GL-02 —, sur 10,61 m : la portion partagée n'est plus marginale, et le facteur est
**exigible et bloquant pour l'achat** (voir 2.3).

### 2.1 Longueur — calculée, et unique

Le circuit dessert **un seul** point d'utilisation : il n'a aucune dérivation, donc un seul chemin
et un seul chiffre.

| Point | Longueur de conduit | Chemin électrique |
|-------|---------------------|-------------------|
| **BR-01** | 3,36 m de conduit, 7,12 m de goulotte | **10,61 m** ← dimensionnant |

Depuis le 2026-09-24, la ligne monte dans GL-01 jusqu'à l'axe de GL-02, un 90 × 40, à 2,705 m, y court jusqu'à
x = 4,50 m, puis descend par le dessous du profilé : 10,61 m de chemin électrique, contre 10,48 m
dans CH-B2 et CH-B3. C'est le chemin électrique qui compte. *Avant* : 10,44 m de tracé, dont les
0,04 m d'écart étaient parcourus **dans** BD-02 et BD-01.

*Valeur révisée de 10,49 à 10,48 m le 2026-09-22, sans changement de conclusion. Le socle ramenait
jusque-là au centre d'une boîte tout bout de conduit tombant dedans ; il relie désormais ces points
à leur distance réelle. Le report était sans conséquence sur une boîte de 13 cm — 1,1 cm ici — mais
il raccourcissait de 0,37 m toute longueur traversant une enceinte de 1,12 m, ce que la goulotte de
`005` allait introduire.*

*Ce circuit échappe à la correction que le § 2.2 de la note de l'éclairage a dû subir — « longueurs
de conduit ≠ longueurs de conducteur » — pour une raison simple : il n'est pas commuté. Aucun
interrupteur ne détourne sa phase, donc phase et neutre ont bien la même longueur, et la forme
`2ρLI/S` s'applique sans correction. Le socle le vérifie plutôt que de le supposer : il dérive le
trajet de chaque conducteur, et n'en trouve ici aucun qui détourne.*

### 2.2 Chute de tension — calculée

`ΔU = 2ρLI/S` avec ρ = 0,0225 Ω·mm²/m, L = 10,61 m, I = 32 A. Le calcul est purement physique et
ne dépend d'aucune table ; il est donc conduit intégralement ici.

| Section | ΔU terminale | Cumulée avec l'arrivée (1,65 %) | Limite 5 % |
|---------|--------------|----------------------------------|------------|
| 4 mm² | 1,66 % | 3,31 % | tenue |
| 6 mm² | 1,11 % | 2,76 % | tenue |
| **10 mm² ← retenue** | **0,66 %** | **2,32 %** | tenue, marge de **2,68 points** |

**Conclusion, et c'est le résultat utile : la chute de tension n'est pas ce qui a décidé de la
section.** Les trois candidates tenaient, et largement. **La section retenue le 2026-09-22 est
10 mm²**, décision du maître d'ouvrage ; ce qui reste à confirmer est qu'elle satisfait le
**courant admissible** `Iz` en catégorie B1 à 32 A — valeur normative, ligne encore ouverte du § 2.
La marge y est a priori confortable, mais « a priori confortable » n'est pas une vérification.

*Le tableau conserve les trois lignes : elles montrent que le choix ne se joue pas sur ΔU, et
qu'un repli sur 6 mm² resterait admissible de ce point de vue seul.*

**Ce qui avait été écarté le 2026-09-22, et qui est retenu le 2026-09-24.** La proposition initiale
était un **câble 3G10**, non trois conducteurs isolés. Elle avait été écartée pour deux raisons, dont
la seconde était dirimante. *Le maître d'ouvrage l'a retenue le 2026-09-24 malgré elles* — voir 2.3 ;
les deux raisons restent vraies, et sont conservées telles qu'elles ont été écrites :

1. un câble en conduit n'est plus la catégorie **B1** mais **B2**, dont l'`Iz` est plus faible à
   section égale. Or `Iz` est précisément la ligne qui décide de la section : changer de lettre
   de sélection aurait rouvert la seule question encore ouverte ;
2. la règle du tiers s'applique alors à la section du **câble entier**, `D ≥ d·√3`, et non
   conducteur par conducteur. Un 3G10 n'entre ni dans un IRL 25 ni dans un IRL 32 — voir 3.1 —,
   et l'IRL 32 est le plafond que la bande contrainte de la porte de service impose (3.2). Le
   câble aurait donc mis en défaut le **tracé**, pas seulement le calibre.

### 2.3 La goulotte de la paroi est — ce qu'elle rend exigible

*Changement `goulotte-paroi-est`, décision du maître d'ouvrage du 2026-09-24. Raisonnement
complet dans l'[étude](../../openspec/changes/archive/2026-09-25-goulotte-paroi-est/etude.md).*

| Question | Valeur | Origine | Référence | État |
|----------|--------|---------|-----------|------|
| Lettre de sélection d'un **câble en goulotte** | *(à renseigner)* | **Normative** | *(clause : ..............)* | **à confirmer** — réserve 1.8 |
| Facteur de **groupement**, trois circuits dans le profilé | *(à renseigner)* | **Normative** | *(clause : ..............)* | **à confirmer** |
| `Iz` du 10 mm² à 32 A, avec les deux | *(à renseigner)* | **Normative** | *(clause : ..............)* | **bloquant pour l'achat** |

**La section pourrait en dépendre.** Tant que ces trois lignes manquent, rien ne démontre que le
10 mm² tient 32 A sur la portion en goulotte : la décision est appliquée à la maquette, sous
**réserve bloquante d'achat**.

**Contradiction relevée, tranchée le 2026-09-24 — la forme de la ligne.** Dans une goulotte partagée, la
ligne DOIT être un **câble à enveloppe propre** (spec « Goulotte support partagé »). Le § 2 de
cette note a écarté le câble le 2026-09-22 parce qu'un 3G10 n'entre pas dans un IRL 25 : il y
exige de 28,6 à 32,0 mm intérieurs (3.1). La descente CH-B3 est en IRL 25. Tirée d'un seul tenant,
la ligne ne peut pas être câble dans la goulotte et conducteurs isolés dans le conduit ; et la
couper pour changer de forme serait une connexion, que la ligne ne reçoit pas. La contradiction
existait déjà sur 1,12 m depuis l'amendement v1.14.0 ; la goulotte la porte sur 7,12 m.

**Décision du maître d'ouvrage du 2026-09-24 : câble 3G10 sur tout le parcours, descente CH-B3
maintenue en IRL 25**, contre l'avis de cette note, qui proposait un tube de plus fort calibre —
la bande contrainte de la porte de service, qui plafonnait le calibre à l'IRL 32, ne s'applique plus
à CH-B3, qui court tout entière sur la paroi nord. *Motif, consigné le 2026-09-25* :
**l'IRL 32 est très difficile à trouver, et demande des équipements et un outillage spécifiques**.
*À noter pour la résorption* : l'IRL 32, de l'ordre de 25 à 27 mm intérieurs (3.1), ne tiendrait
pas non plus la règle ; le calibre qui la tient est de l'ordre de l'IRL 40.

**C'est une dérogation au Principe III**, sur le taux de remplissage (3.1) : écrite ici, datée, et
**à résorber avant la clôture du dossier** (constitution, contrôle de conformité). Deux constats, que
la décision ne change pas :
- la règle du tiers exige de 28,6 à 32,0 mm intérieurs, et un IRL 25 en offre de l'ordre de 19 à
  21 : **aucun IRL 25 ne la tient** ;
- le jeu restant, 1 à 4 mm sur 3,36 m, avec deux coudes, rend le **tirage lui-même douteux**. Il
  DOIT être éprouvé sur un tronçon avant l'achat.

La mise en forme 3G10 règle en revanche ce que la contradiction laissait ouvert : la ligne est un
câble à enveloppe propre dans les goulottes, et reste d'un seul tenant. Le métré devient **10,48 m
de câble 3G10**, et non 31,44 m de conducteur.

## 3. Les vérifications complémentaires

### 3.1 Occupation du conduit — la condition qui a décidé du calibre

Trois conducteurs **isolés**. Avec `d` le diamètre extérieur isolé et `D` le diamètre intérieur du
conduit, la règle du tiers s'écrit :

```
n (d/D)² ≤ 1/3   ⟺   D ≥ d·√(3n)   ⟺   D ≥ 3d   pour n = 3
```

C'est le cas le **plus facile** des trois circuits du garage en nombre de fils — trois contre huit
sur le tronc partagé, où la condition est `D ≥ d·√24`. Mais c'est le plus **gros** en section, et
c'est ce qui rend l'IRL 25 serré plutôt que confortable :

| Diamètre intérieur `D` | `d` maximal admissible, 3 conducteurs |
|------------------------|----------------------------------------|
| 19 mm | 6,33 mm |
| 20 mm | 6,67 mm |
| 21 mm | 7,00 mm |

Un conducteur isolé de 10 mm² est de l'ordre de 6,6 à 7,2 mm selon le produit. **La conclusion
dépend donc de deux cotes produit que le relevé ne comporte pas** — exactement la situation qui
avait fait écarter l'IRL 20 pour le tronc partagé de `003`. La différence est qu'ici le calibre
supérieur n'est pas librement disponible : la bande contrainte s'arrête à l'IRL 32 (3.2).

**À vérifier à l'achat, et avant de commander le conduit** : *(cotes relevées : D = .......... mm,
d = .......... mm → `D ≥ 3d` ..........)*

**Pourquoi un câble ne convenait pas.** Pour un câble, la règle porte sur son diamètre extérieur
d'ensemble, `n = 1`, donc `D ≥ d·√3 ≈ 1,732·d` :

| Forme | Diamètre extérieur | `D` exigé |
|-------|--------------------|-----------|
| 3 conducteurs isolés de 10 mm² | 6,6 à 7,2 mm | **19,8 à 21,6 mm** |
| câble 3G10 | 16,5 à 18,5 mm | **28,6 à 32,0 mm** |

Un IRL 25 offre de l'ordre de 19 à 21 mm intérieurs, un IRL 32 de l'ordre de 25 à 27. Le câble ne
passe donc dans aucun des deux, et l'IRL 32 est le plafond imposé par la bande contrainte : le
conducteur isolé n'était pas une préférence, c'était la seule forme compatible avec le tracé.

**Dérogation du 2026-09-24.** Le câble 3G10 est retenu, et CH-B3 reste en IRL 25 (2.3) : la
condition `D ≥ d·√3` n'y est pas tenue. *Cotes à relever avant l'achat : D = .......... mm,
d(3G10) = .......... mm ; essai de tirage sur un tronçon : ..........* La fiche de CH-B3 dans la
maquette porte la condition du câble — `D ≥ d × 1,73, n = 1` — et non plus celle de trois
conducteurs.

*Depuis le 2026-09-22, ce décompte n'est plus seulement écrit ici : chaque circuit déclare le
nombre de conducteurs qu'il met dans un tube, et **la fiche d'un conduit dans la maquette en
montre le total, la répartition et la condition de remplissage**. Le chiffre n'y est pas recopié,
il est dérivé — la maquette et cette note ne peuvent donc pas diverger en silence, et un test le
vérifie.*

### 3.2 L'axe dans la bande contrainte

La bande utile au-dessus du linteau de la porte de service fait **0,25 m**. Le tronc partagé en
occupe 2,5875 à 2,6125. La condition de FR-036 :

```
2,6125 + 0,010 + d/2  ≤  axe  ≤  2,750 − 0,010 − d/2
```

| Diamètre | Axe admissible |
|----------|----------------|
| IRL 20 | 2,633 à 2,730 m |
| IRL 25 | 2,635 à 2,727 m |
| IRL 32 | 2,639 à 2,724 m |

**L'axe retenu est 2,64 m**, admissible pour les trois. La bande tient la ligne **jusqu'à l'IRL 32
inclus** : le choix du calibre ne pouvait pas rendre le parcours infaisable. *Le calibre arrêté le
2026-09-22 est l'IRL 25, dont l'intervalle est 2,635 à 2,727 m : l'axe de 2,64 m y est, et aucune
cote d'implantation n'est à reprendre.* Ce plafond de l'IRL 32 est en revanche ce qui a écarté le
câble 3G10 (2.2) : il n'y avait pas de calibre supérieur disponible pour le loger.

### 3.3 Les deux boîtes traversées

```
BD-01 :  |2,64 − 2,60| + d/2 ≤ h/2   →   h ≥ 0,112 m,  6 entrées
BD-02 :  |0,75 − 0,70| + d/2 ≤ h/2   →   h ≥ 0,132 m,  5 entrées
```

avec `d = 0,032 m`, qui était le **majorant** de calibre au moment où ces cotes ont été arrêtées.
Dimensionner sur le majorant rendait les deux cotes valables quel que soit le calibre retenu — ce
qui était nécessaire, les boîtes étant posées par `002` avant que le calibre le soit.

*Le calibre est arrêté depuis le 2026-09-22, à l'IRL 25. Les deux cotes **ne changent pas** : la
même condition avec `d = 0,025 m` donnerait h ≥ 0,105 m et h ≥ 0,125 m, que 0,112 et 0,132
satisfont. Les boîtes gagnent donc de la marge, et rien n'est à reprendre — c'est précisément ce
que dimensionner sur un majorant sert à obtenir.*

**Le volume intérieur est une question distincte** (FR-038), et la section retenue la durcit :
BD-01 portera huit conducteurs de 1,5 et 2,5 mm² — six seulement sur CH-02 et CH-04, voir le
§ 3.1 de la note d'éclairage —, **trois de 10 mm²**, et un départ en fond. *(volume relevé sur fiche :
.......... cm³ → condition ..........)* **Un modèle à six entrées ne démontre pas un volume.**

### 3.4 Résistance de la prise de terre — régime TT

`R ≤ U_L / IΔn` avec `U_L` = 50 V en local sec.

| IΔn | R maximale |
|-----|------------|
| 30 mA — différentiel de la borne | 1 667 Ω |
| 500 mA — hypothèse de la protection amont | **100 Ω** |

Le garage n'a pas de prise de terre propre : la terre arrive par le PE du 3G16. Le seuil est
commun aux trois circuits, mais **c'est ici qu'il porte le courant le plus élevé.**

## 4. Le bilan de puissance — le sujet de cette fonctionnalité

La borne appelle **32 A** sur **39 A** souscrits. Elle consomme donc **82 % de la capacité
souscrite** et ne laisse que **7 A**, environ **1,6 kW**, pour toute l'habitation pendant une
charge.

**Ce bilan ne peut pas être passé sous silence**, et la constitution admet deux voies pour le
traiter. La voie retenue est la seconde.

### 4.1 La voie retenue : une restriction d'usage écrite

**Aucun dispositif de modulation, aucun délestage, aucun bridage** : la borne reste à 32 A
(FR-012). La maîtrise de la puissance repose entièrement sur un **document** et sur ce que savent
les personnes présentes dans l'habitation.

### 4.2 Le mode d'usage qui rend la restriction tenable

Une charge conduite **lorsque l'habitation est au repos** (FR-033). Avec 1,6 kW disponibles, aucun
autre mode ne l'est durablement — et le dire est plus honnête que de lister des combinaisons
praticables qui ne le seraient qu'au prix d'une attention constante.

### 4.3 Les usages incompatibles

*(liste nominative à établir par le maître d'ouvrage — T035, FR-031)*

| Usage | Puissance approximative | Compatible avec une charge ? |
|-------|-------------------------|------------------------------|
| *(à renseigner)* | *(à renseigner)* | *(à renseigner)* |

**Cette liste est une condition de validité du dimensionnement, non une recommandation.** Non
écrite, elle est perdue au premier changement d'occupant ou d'intervenant, et c'est ce que le
Principe IV interdit. Elle DOIT en outre être portée à la connaissance des occupants, et non
seulement consignée ici (FR-032) : son efficacité ne dépend d'aucun matériel.

**Elle est donc reportée hors de cette note**, dans
[restriction-usage.md](./restriction-usage.md) — un document écrit pour les occupants et non pour
l'installateur. Une exigence dont l'efficacité repose entièrement sur ce que des personnes savent
ne peut pas vivre au milieu d'une note de calcul qu'elles ne liront jamais.

### 4.4 Le mode de défaillance

Le dépassement fait déclencher le **disjoncteur d'abonné**, qui est en amont de tout. Cela coupe
**l'ensemble de l'habitation** et non la seule charge, et le rétablissement exige un **réarmement
manuel au tableau principal** (FR-034).

Aucune reprise automatique de la charge n'est attendue : après un déclenchement, la charge reprend
lorsque l'alimentation revient (FR-035).

*C'est le point que l'utilisateur ne doit pas découvrir par surprise. Un délestage aurait coupé la
charge ; ici, c'est la maison qui s'éteint.*

## 5. Le différentiel — ce qui est décidé et ce qui ne l'est pas

| Question | Réponse | État |
|----------|---------|------|
| Le circuit a-t-il son **propre** différentiel ? | **Oui** (FR-010), décidé le 2026-09-22 | acquis |
| Où est-il raccordé ? | **Sur le bornier**, en amont de l'interrupteur de type AC (R9) | acquis |
| Le Principe II est-il satisfait ? | **Oui** : le circuit n'est pas en aval du type AC. FR-050 de `002` cesse de bloquer cette fonctionnalité | acquis |
| Quel **type** ? | **A ou F**, type B écarté. Choix économique, non normatif | **ouverte** — T010 |
| Où est le dispositif **6 mA** ? | **Intégré à la borne, ou module distinct au tableau.** Aucun type de différentiel n'en dispense | **ouverte** — T009, la tâche pivot |
| Un **type F** répond-il à l'exigence ? | Rapporté comme admis par des sources secondaires citées en R10, clause 7-722 | **à confirmer sur le texte** |

**La conséquence de consignation est écrite, et elle est nouvelle** : ouvrir l'interrupteur
différentiel du tableau **ne met pas la borne hors tension**, puisqu'elle part du bornier en amont
de lui. La consignation se fait au **disjoncteur d'abonné**. Cette mention DOIT figurer au dossier,
sur le tableau, et sur les **deux boîtes traversées** (FR-040).

## 6. Ce qui reste à confirmer, et qui n'appartient pas à ce document

1. Les **valeurs normatives** du § 2 et la clause **7-722** — T008.
2. La **voie du dispositif 6 mA** — T009, et c'est la seule dont dépend une exigence non
   négociable.
3. Le **type** du différentiel, A ou F — T010.
4. Les **cotes produit** — T046, et cette ligne a changé de nature le 2026-09-22 : le remplissage
   du conduit n'est plus une vérification de confort mais une **condition d'achat**. `D ≥ 3d` avec
   trois conducteurs de 10 mm² dans un IRL 25 se joue à quelques dixièmes de millimètre (3.1), et
   le calibre supérieur est fermé par la bande contrainte. À trancher **avant** de commander le
   conduit, pas à la pose. S'y ajoute le volume intérieur de BD-01.
5. La **liste des usages incompatibles** — T035.
6. Les **conditions de faisabilité** au tableau : capacité du bornier, modules libres — T011.

Tant qu'une seule de ces six reste ouverte, **la note n'est pas opposable au sens du Principe I**.
