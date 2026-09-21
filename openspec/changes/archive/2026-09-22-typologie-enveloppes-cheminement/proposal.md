# Proposal

## Why

Le modèle de données connaît **un seul type d'enveloppe**, `boite-derivation`, là où la
constitution en distingue **cinq rôles**. Trois objets portent aujourd'hui ce type sans être
des boîtes de dérivation, et chacun des trois en souffre différemment.

**1. La goulotte GL-01 est dessinée onze fois trop courte.** Elle déclare
`dimensions: 0,12 × 1,12 × 0,06`, mais `src/scene/composants.js` prend le gabarit dans
`data/types-composants.json` d'après le `type` et ne lit jamais `composant.dimensions`. GL-01
hérite donc du gabarit des boîtes — un cube de 0,10 m — là où elle mesure 1,12 m. Le rendu
est le **seul** consommateur à ignorer `dimensions` : la fiche, la validation, la contiguïté,
les fournitures et quatre fichiers de test l'honorent tous. La fiche du composant affiche
« 120 × 1120 × 60 mm » à côté d'un objet qui en fait 100.

**2. Il en résulte une rupture de suivi de circuit au premier mètre.** BD-02 n'existe plus,
GL-01 l'a remplacée, et `CH-02` comme `CH-L1` partent de (5,60 ; 0,70 ; 2,60) — un point
rattaché par **contenance géométrique** dans le volume de 1,12 m (`graphe.js:159`). Dessinée
de 2,140 à 2,240, la goulotte ne contient pas ce point : dans la vue, les deux cheminements
partent dans le vide, 0,36 m au-dessus d'un cube qui flotte lui-même 0,51 m au-dessus du
tableau. Le scénario *« Suivi sans rupture »* de `maquette/visualisation` est en défaut, et
il l'est sur le départ de tous les circuits.

**3. Une obligation constitutionnelle n'est pas déclarée.** GL-01 est le point où les deux
circuits se séparent : des connexions y sont faites. La condition 2 de l'amendement v1.13.0
exige que chaque connexion abritée le soit dans un **organe de connexion à enveloppe propre**
— « la goulotte abrite la connexion, elle ne l'enveloppe pas » — et la condition 3 exige que
le dossier **énumère ces emplacements au même titre que les boîtes de dérivation**. Aucun tel
organe n'existe : ni dans les données, ni aux fournitures, ni au dossier. Le typage abusif
masquait l'omission, GL-01 tenant les deux rôles à la fois.

**4. BD-03 se fait passer pour une boîte de dérivation sans en être une.** Elle est de
degré 2, ne sépare rien — CH-04 arrive avec les deux circuits, CH-07 repart avec les deux —,
ne loge aucun appareillage et ne porte aucune traversée. La règle V17 l'exempte
explicitement (« BD-03 n'est qu'un relais du tronc partagé »), mais
`specs/002-prises-de-courant/implantation.md:92` affirme l'inverse (« Toutes sont imposées par
V17 »). La constitution, elle, a déjà tranché : une boîte est requise « à chaque changement de
direction **qui ne se traite pas par un accessoire de conduit** ». BD-03 est un pur changement
de direction paroi → plafond, et elle est posée à 0,15 m d'axe de BD-01, dont le côté minimal
est de 112 mm : il reste 94 mm de paroi libre, et CH-04 se réduit à un manchon d'environ 5 cm
entre deux enveloppes, chacune chevillée dans le béton.

Ces quatre symptômes ont une cause unique. Les traiter séparément reviendrait à corriger trois
fois le même typage.

## What Changes

- **Typologie des enveloppes.** Introduction de trois rôles distincts au catalogue :
  `goulotte`, `organe-connexion`, `accessoire-conduit`. `boite-derivation` cesse d'être le
  type par défaut de tout ce qui n'est ni socle ni luminaire.
- **GL-01 devient un cheminement** à section rectangulaire, et non plus un composant. Elle
  *achemine* : c'est le métier d'un cheminement, et la constitution l'admet « pour tenir lieu
  de conduit sur un parcours donné ».
- **Un organe de connexion apparaît** à (5,60 ; 0,70 ; 2,60), où CH-02 et CH-L1 se séparent.
  Il est déclaré, repéré et énuméré au dossier au même titre qu'une boîte, ce que la
  condition 3 exige.
- **BD-03 devient un accessoire de conduit.** Elle ne disparaît pas — le point de tirage garde
  sa valeur — mais elle cesse d'être une boîte de dérivation et n'appelle plus d'enveloppe
  connectable.
- **BREAKING pour la continuité du graphe** : la contiguïté de GL-01, aujourd'hui **inférée**
  d'un chevauchement de volumes avec `entrees: 4` pour garde-fou, devient une **jonction
  déclarée** sur l'organe de connexion. C'est plus strict, et cela supprime la classe de
  faiblesse que `validation.js:657` décrit en commentaire.
- **Le rendu lit la section déclarée.** Un cheminement à section rectangulaire est dessiné à
  son encombrement réel. Le test `scene.test.js:148`, aujourd'hui intitulé « gabarit prend ses
  dimensions dans le catalogue », change de contrat : le volume déclaré prime sur le gabarit
  de type, lequel reste le repli.
- **Le taux de remplissage d'une section non circulaire** vient des caractéristiques déclarées
  du produit, la règle du tiers `D ≥ d·√(3n)` ne s'y transposant pas (condition 6).

## Capabilities

### New Capabilities

Aucune. Les trois rôles introduits sont des exigences nouvelles à l'intérieur de capacités
existantes, pas de nouvelles capacités.

### Modified Capabilities

- `installation/cheminements` : la goulotte cesse d'être décrite comme un support et devient un
  cheminement ; l'organe de connexion à enveloppe propre est exigé et énuméré ; l'accessoire de
  conduit est admis pour un changement de direction ; la règle « toute connexion dans une
  boîte » s'ouvre à l'organe de connexion, que l'amendement v1.13.0 admet déjà et que
  l'exigence actuelle ignore.
- `maquette/visualisation` : la représentation d'un cheminement couvre une section non
  circulaire ; le volume déclaré d'un objet prime sur le gabarit de son type ; les trois
  nouvelles enveloppes sont consultables au même titre qu'une boîte de dérivation.

## Impact

**Ce changement ne lève aucune réserve du maître d'ouvrage et n'en crée aucune.** Les deux
valeurs normatives du mode goulotte — lettre de sélection, seuil de portion négligeable —
restent à confirmer au titre de la tâche 1.6 de `reserves-maitre-ouvrage`. Ce changement est
conçu pour se construire sans elles : la section porte son mode de pose, et la valeur reste
`null` tant qu'elle n'est pas lue sur le texte (Principe I).

- `data/types-composants.json` — trois rôles nouveaux
- `data/apports/002-prises-de-courant.json` — GL-01 en cheminement, organe de connexion,
  BD-03 en accessoire
- `src/scene/composants.js` — priorité au volume déclaré
- `src/scene/cheminements.js` — section rectangulaire ; `boiteEnSaillie()` construit
  aujourd'hui un cube de côté `diametre`
- `src/donnees/validation.js` — jonction déclarée à la place de la contenance ; règles V17 et
  V22
- `src/donnees/fournitures.js`, `src/ui/fiche-composant.js` — libellés et relevé
- `tests/scene.test.js` — contrat du gabarit ; **aucun test ne verrouille aujourd'hui la
  hauteur de GL-01 dans la vue**, et c'est ce qui a laissé le défaut passer
- `tests/contiguite.test.js`, `tests/apport-002.test.js`, `tests/apport-005.test.js`
- Dossier final — énumération des emplacements de connexion sous capot (condition 3)

**Hors périmètre** : la constitution n'est pas amendée. Ce changement ne fait qu'enregistrer
dans le modèle ce qu'elle énonce déjà depuis la v1.13.0.
