# Nomenclature — éclairage du garage

**Fonctionnalité**: `003-eclairage` | **Date**: 2026-09-21

Quantités déduites du tracé de [data-model.md](./data-model.md) et de
`data/apports/003-eclairage.json`. Les longueurs de conduit sont des **métrés de tracé** : elles
ne comprennent ni chute, ni cintrage, ni réserve de raccordement.

## Conduit et fixation

| Article | Quantité | Précision |
|---------|----------|-----------|
| Conduit **propre à l'éclairage**, IRL 20 | **8,13 m** de tracé | Métré exact des branches qui n'appartiennent qu'à ce circuit. Porté de l'IRL 16 à l'**IRL 20** le 2026-09-22, décision du maître d'ouvrage : **une seule référence de tube** pour tout le projet hors borne. CH-L5 a disparu le 2026-09-21 : EL-03 emprunte le tube vertical déjà posé sur l'aplomb de PC-01 (FR-046) |
| Conduit **partagé** avec les prises, IRL 20 | **7,95 m** — compté à la nomenclature de `002` | Tronc commun aux deux circuits depuis le 2026-09-21, ramené de l'IRL 25 à l'**IRL 20** le 2026-09-22 sur décision du maître d'ouvrage. ⚠️ **CH-05 exige un intérieur ≥ 14,69 mm** : condition d'achat, voir note de calcul § 3.2 |
| dont parcours **extérieur** | **0,30 m** — CH-L6, entre le point de façade et son détecteur | Voir la réserve ci-dessous : l'IRL d'intérieur n'est pas présumé qualifié pour l'exposition directe |
| Diamètre intérieur des conduits | Condition `D ≥ 3·d` sur les branches propres (trois conducteurs, dérivés). Le **tronc** relève de `D ≥ d·√24` sur CH-05 seul, soit **≥ 14,69 mm**, et d'environ 13 mm sur les quatre autres | Condition exacte, à lire sur les fiches produit **avant commande**. Voir § 3.1 et § 3.2 de la note de calcul |
| Colliers de fixation | à raison de l'entraxe préconisé par le fabricant | Donnée produit, non cote de projet |
| **Chevilles adaptées au béton** | une par collier, plus les fixations d'appareillage | Voir ci-dessous |
| Coudes et accessoires | **2 changements de direction, tous sur CH-L1** — l'angle sud-est de la paroi, puis la descente à 2,22 m. Les autres branches sont rectilignes, les changements de direction se faisant **dans les boîtes** : BD-05 pour le virage vers le nord, BL-01 pour la fourche | Un changement de direction se traite par accessoire, jamais par pincement du tube. Recompté le 2026-09-21 : la liste antérieure citait CH-L5 et CH-L7, qui n'existent plus |

### La place à réserver, et pourquoi elle est comptée ici

Ce conduit est le **troisième** à longer la paroi est, après celui des prises et avant celui de la
borne. La réservation de `002` n'en prévoyait qu'un — elle a été étendue (FR-047 révisé, FR-063).

Le tracé de l'éclairage **échappe** à la contrainte la plus dure en passant par le plafond : la
bande utile au-dessus du linteau de la porte de service ne fait que **0,25 m**, entre 2,50 et
2,75 m, et les prises y occupent 2,60 m. Cette bande reste donc disponible pour la ligne de la
borne, qui n'a pas cette échappatoire.

### Les chevilles ne sont pas un détail de quincaillerie

Les parois sont en **béton plein non isolé**. Une cheville pour matériau creux, ou une cheville
universelle posée dans un trou surdimensionné, ne tient pas une charge d'arrachement dans ce
support — et c'est tout le circuit apparent qui pend de ces points.

Pour l'éclairage, deux fixations méritent une attention particulière : les **sorties de plafond**,
qui portent le poids d'un luminaire en porte-à-faux, et le **boîtier de commande**, qu'on
actionne plusieurs fois par jour.

Perçage au perforateur, mèche béton, sans percussion à proximité immédiate d'un conduit posé.

## Boîtes, traversées, appareillage

| Article | Quantité | Précision |
|---------|----------|-----------|
| Boîtes de dérivation | **1** — BL-01, la fourche du plafonnier | Les cinq autres boîtes du circuit — BD-01 à BD-05 — sont **partagées** avec les prises et comptées à la nomenclature de `002`. Elles DOIVENT être **repérées comme boîtes à plusieurs circuits** (constitution v1.10.0) |
| Sorties d'éclairage, **intérieures** | **2** — EL-01a, EL-01b | Au plafond. Elles forment **un seul point lumineux** à deux sorties |
| Sorties d'éclairage, **extérieures** | **2** — EL-02, EL-03 | Façade sud et paroi est. Indice de protection à arrêter |
| **Boîtier à deux postes** | **1** — pour CM-01 et CM-03 | Les deux mécanismes DOIVENT être **distinguables au toucher** (FR-032) : c'est ce qui évite d'allumer l'extérieur par méprise, dans le noir |
| Interrupteurs en saillie | **2** — CM-01, CM-03 | Dans le boîtier ci-dessus |
| **Détecteur de présence**, extérieur | **1** — CM-02 | Champ **réglable** et **temporisation réglable** exigés (FR-040, FR-041) |
| Percements de traversée | **2** — TV-L1, TV-L2 | À la scie cloche béton, **derrière le boîtier** de la sortie desservie, **en biais vers le bas**, et **avant** la pose du boîtier |
| Mastic ou manchon d'étanchéité | **3** traversées | L'étanchéité accompagne la pente, elle ne la remplace pas |

### Le détecteur : deux réglages sont des exigences, non des options

Un détecteur à champ fixe ou à temporisation fixe **ne convient pas**. SC-017 exige qu'il ignore
la voie publique et la propriété voisine, ce qui demande de régler le champ ; SC-018 exige que la
temporisation retenue soit consignée, ce qui suppose de pouvoir la choisir.

Un détecteur offrant en outre un **allumage forcé** reste acceptable, mais la spécification ne
l'exige pas. À noter que son absence a une conséquence réelle : qui décharge son véhicule en
restant immobile verra la lumière s'éteindre.

## Conducteurs

| Article | Quantité | Précision |
|---------|----------|-----------|
| Conducteur **1,5 mm²** | **5 × 15,13 m** au maximum — 10,08 m en propre plus 5,05 m de tronc partagé — soit **75,65 m**, à réduire sur les branches terminales | Phase, neutre, protection, et **deux retours commandés** |
| dont retours commandés | 2 — un pour le plafonnier, un pour l'accès piéton | Le point de façade n'en appelle **aucun** : alimenté en permanence, commuté sur place |
| Repérage de circuit | 1 jeu | Contrôlé à l'étape de concordance du repérage |

**Le quantitatif ci-dessus est un majorant.** Cinq conducteurs ne courent que sur le tronc ;
au-delà des boîtes, chaque branche n'en porte que ce qui lui est utile. Le métré exact par
tronçon se déduit du tracé et ne mérite pas d'être recopié ici — il changerait au premier
ajustement.

## Protection au tableau

| Article | Quantité | État |
|---------|----------|------|
| Protection contre les surintensités | 1, **distincte de celle des prises** | **Calibre à établir** — valeur normative |
| Dispositif différentiel 30 mA | 1 | Sensibilité acquise. **Type à statuer** — décision FR-050, plus contraignante ici |

La protection **distincte** n'est pas une commodité : c'est FR-016, et FR-017 en assume la
conséquence recherchée — un défaut sur les prises ne plonge pas le garage dans le noir. SC-006 en
fait un essai.

**Sur le type de différentiel** : ce circuit alimente un **détecteur électronique en permanence**.
Un type AC ne voit pas les composantes continues pulsées qu'il produit, et il en produit sans
interruption. La décision FR-050 pèse donc plus lourd ici que sur les prises, où la charge à
découpage est intermittente.

## Ce que cette nomenclature ne peut pas encore arrêter

| Article | Réserve |
|---------|---------|
| Conduit et boîtiers **extérieurs** | `TODO(CONDUIT_EXTERIEUR)`, que la liaison de 0,30 m **rouvre**. La révision de `002` l'avait refermé en supprimant tout conduit de façade ; ces 0,30 m en ramènent une partie. Reste à choisir la référence extérieure, et avec elle les indices de protection de EL-02, EL-03, CM-02 et de leurs boîtiers |
| Section du conduit | Dépend des diamètres produit, via la condition `D ≥ d·√15` |
| Calibre de la protection | Valeur normative à confirmer |
| Type du différentiel | Décision FR-050 |
| Temporisation du détecteur | Réglage de chantier, à consigner |
| Luminaires proprement dits | **Hors périmètre** : cette fonctionnalité spécifie des sorties, pas des appareils |

---

**La liste totale des fournitures**, tous circuits confondus, est dans
[`dossier/fournitures.md`](../fournitures.md). Elle est **générée** — `npm run fournitures` —
et c'est elle qui donne les quantités à commander : trois nomenclatures tenues séparément
ne s'additionnent pas, la longueur de conducteur d'un tronc partagé dépendant du nombre de
fils que chaque circuit y met. Le présent document reste la référence de **détail**.
