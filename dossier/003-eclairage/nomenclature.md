# Nomenclature — éclairage du garage

**Fonctionnalité**: `003-eclairage` | **Date**: 2026-09-21
| Dernière révision | **2026-10-01** — six réglettes pontées

> **Ce qui a changé le 2026-09-26** : le plafond passe de deux sorties à **six réglettes**
> HOFTRONIC. La nomenclature suit : **4 boîtes** au lieu de 1 (BL-01, BD-07, BD-08, BD-09),
> **6 points lumineux** au lieu d'un seul, **104,89 m** de 1,5 mm² au lieu de 69,34 m,
> **18,91 m** de conduit propre au lieu de 8,13 m, **11 coudes** au lieu de 2.
> Le tableau des fournitures généré fait foi sur les longueurs.
>
> **Ce qui a changé le 2026-10-01** : les six réglettes sont **pontées deux à deux** par quatre
> cordages. La nomenclature suit : **1 boîte** propre à l'éclairage au lieu de 4 — BL-01 seule,
> les trois autres ayant disparu avec les colonnes qu'elles desservaient —, **108,92 m** de
> 1,5 mm² au lieu de 104,89 m, **12,56 m** de conduit propre au lieu de 18,91 m, et **7,69 m**
> de **cordage**, qui n'est pas du conduit. Les **coudes propres** restent **8**, mais le total
> du projet passe de 11 à **13** — voir le détail ci-dessous. Le tableau généré fait foi.

Quantités déduites du tracé de [data-model.md](./data-model.md) et de
`data/apports/003-eclairage.json`. Les longueurs de conduit sont des **métrés de tracé** : elles
ne comprennent ni chute, ni cintrage, ni réserve de raccordement.

## Conduit et fixation

| Article | Quantité | Précision |
|---------|----------|-----------|
| Conduit **propre à l'éclairage**, IRL 20 | **12,56 m** de tracé | Les deux colonnes **CH-L3** (4,25 m) et **CH-L4** (4,05 m) plus les deux branches courtes **CH-L2** (0,65 m) et **CH-L6** (0,30 m). Porté de l'IRL 16 à l'**IRL 20** le 2026-09-22, décision du maître d'ouvrage : **une seule référence de tube** pour tout le projet hors borne. **Revu le 2026-10-01** : 18,91 m avant le pontage, 12,56 m après — le pontage, et non une réduction du besoin |
| **Cordages**, entre réglettes | **4** — CP-1 à CP-4, **7,69 m** au total | Voir la section ci-dessous. **N'est pas du conduit** : ni section, ni taux de remplissage, ni pièce d'assemblage |
| Conduit **partagé** avec les prises, IRL 20 | **7,96 m** — compté à la nomenclature de `002` | Tronc commun aux deux circuits depuis le 2026-09-21, ramené de l'IRL 25 à l'**IRL 20** le 2026-09-22 sur décision du maître d'ouvrage. ⚠️ **CH-L1 exige un intérieur ≥ 14,69 mm** : condition d'achat, voir note de calcul § 3.2 |
| dont parcours **extérieur** | **0,30 m** — CH-L6, entre le point de façade et son détecteur | Voir la réserve ci-dessous : l'IRL d'intérieur n'est pas présumé qualifié pour l'exposition directe |
| Diamètre intérieur des conduits | Condition `D ≥ 3·d` sur les branches propres (trois conducteurs, dérivés). Le **tronc** relève de `D ≥ d·√24` sur CH-05 seul, soit **≥ 14,69 mm**, et d'environ 13 mm sur les quatre autres | Condition exacte, à lire sur les fiches produit **avant commande**. Voir § 3.1 et § 3.2 de la note de calcul |
| Colliers de fixation | à raison de l'entraxe préconisé par le fabricant | Donnée produit, non cote de projet |
| **Chevilles adaptées au béton** | une par collier, plus les fixations d'appareillage | Voir ci-dessous |
| Coudes et accessoires | **8** propres à l'éclairage — CH-L3 (4) et CH-L4 (4) | Un changement de direction se traite par accessoire, jamais par pincement du tube. Le projet total en compte **13**, dont 5 sur des tronçons partagés ou appartenant à d'autres circuits (CH-L1, GL-02, CH-B3). Décompte complet dans [fournitures.md](../fournitures.md). **Aucun cordage n'est compté** : un câble se pose à la main, il ne se cintre pas par accessoire |

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

## Cordages — ce que le pontage achète, et ce qu'il ne'achète pas

Quatre liaisons souples relient les six réglettes deux à deux : **CP-1** et **CP-2** dans la
colonne ouest (2,04 m et 1,81 m), **CP-3** et **CP-4** dans la colonne est (2,04 m et 1,81 m),
soit **7,69 m** au total. Ce sont des **câbles**, et les écrire à la ligne du conduit serait
trois erreurs en une : un câble n'a pas de diamètre intérieur, donc pas de taux de
remplissage ; il ne se pose ni en saillie du plafond ni dans une goulotte ; et il ne se
commande pas chez le même fournisseur que l'IRL 20.

Ce que le pontage **achète** : quatre câbles, et la poignée de fixations qui les tiennent.
Ce qu'il **n'achète pas** : le **câblage interne** des réglettes. HOFTRONIC les livre
pré-équipées, connectables entre elles jusqu'à dix selon la fiche — le lien qui relie deux
réglettes fait partie de l'appareil, au même titre que son diffuseur. Ces 1,20 m par
liaison n'apparaissent donc dans aucun métré.

Ce qu'il ne faut pas en déduire : que ces mètres n'existent pas. C'est du cuivre, parcouru par le
courant, et il compte dans le trajet : c'est lui qui allonge le chemin de la réglette voisine quand
le courant la traverse en transit. La convention de chute retenue s'arrête au **point d'utilisation**
de chaque réglette : **1,86 %** au total. *Compter en plus le lien interne de la cible porterait à
1,88 % — un majorant, écarté.* Un câble qu'on ne paie pas et qu'on oublie dans le calcul est le genre
d'économie qui se voit dans l'allumage saccadé.

| Article | Quantité | Précision |
|---------|----------|-----------|
| Câble de liaison entre réglettes | **4** — CP-1 à CP-4 | **7,69 m** au total. **Section et référence à arrêter** : elle dépend du courant de la colonne, et le pontage l'a fait passer de trois conducteurs par colonne à un seul trio |
| Fixations de cordage | à raison d'une par demi-mètre, plus une par aboutisseur | Le câble **pend** : il ne s'appuie pas sur le plafond, et sa flèche est une donnée de pose, pas un défaut de pose |
| **Câblage interne des réglettes** | **6 × 1,20 m**, montées d'usine | **Déjà dans les réglettes.** Ni à commander, ni à poser, ni à facturer |

## Boîtes, traversées, appareillage

| Article | Quantité | Précision |
|---------|----------|-----------|
| Boîtes de dérivation, **propres à l'éclairage** | **1** — BL-01, la fourche des deux colonnes | **Revu le 2026-10-01** : il y en avait 4 avant le pontage. Chaque colonne étant alimentée par un trio unique, il n'y a plus rien à redistribuer au plafond — la boîte qui faisait le travail de trois boîtes disparaît avec eux. Les boîtes **partagées** avec les prises — BD-04, BD-05 — sont comptées à la nomenclature de `002`. Elles DOIVENT être **repérées comme boîtes à plusieurs circuits** (constitution v1.10.0) |
| **Réglettes LED 120 cm, plafond** | **6** — EL-01a à EL-01f | En **deux colonnes de trois**, à 1,45 m et 4,15 m de l'axe médian. Six points lumineux **distincts**, un seul circuit. HOFTRONIC, pack de 6 : **120 × 65 × 58 mm**, **36 W**, **4000 K**, **IP65**, **IK07**, **classe II**, **25 000 h** |
| ⚠️ dont **sous le tablier remonté** | **2** — EL-01a, EL-01b | À y = 1,55 m. **Dégagement NON établi** : l'épaisseur du panneau n'a jamais été relevée. **Mesurer en place avant de fixer**, décaler si elles frotent |
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
| Conducteur **1,5 mm²** | **108,92 m**, métré **dérivé** sur le tracé réel | Le tableau de [fournitures.md](../fournitures.md) fait foi. **Revu le 2026-10-01** : 104,89 m avant le pontage — **+4,03 m**, et c'est le pontage qui les coûte |
| dont retours commandés | 2 — un pour le **plafond**, un pour l'accès piéton | Le point de façade n'en appelle **aucun** : alimenté en permanence, commuté sur place |
| Repérage de circuit | 1 jeu | Contrôlé à l'étape de concordance du repérage |

**Le métré ci-dessus n'est plus un majorant : c'est une mesure.** Il est calculé par le socle
sur le tracé réel, et non estimé. Le détail par tronçon est dans `fournitures.md`, généré par
`npm run fournitures` — ne pas le recopier ici, il changerait au premier ajustement du tracé.

**Ce qui a changé le 2026-09-26**, puis **le 2026-10-01**. Le 26 septembre, le métré passe
de 69,34 m à 104,89 m, soit +51 % : six réglettes destinées à des points distincts ne
peuvent pas partager un retour de commande unique, et chaque colonne porte son trio
phase/neutre/PE. Le 1er octobre, le **pontage** rend les colonnes économiques : le trio unique qui
descend remplace les deux, et le câble du cordage prend le relais. Le métré **remonte
pourtant** à 108,92 m — les cordages pèsent 7,69 m de câble, et 4,03 m de +
1,5 mm² les remplacent sur les colonnes. C'est le prix du pontage, et il est **inférieur**
à celui d'une distribution individuelle complète.

Trois conducteurs seulement montent par colonne — phase, neutre, PE. Les cordages, eux,
portent le **PE, le neutre et la sortie de module**, jamais la phase : une phase qui
traverse un câble de liaison n'alimenterait qu'une moitié de la chaîne et laisserait
l'autre morte. C'est pourquoi le décompte des conducteurs du circuit reste à huit, inchangé
depuis le 26 septembre.

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
