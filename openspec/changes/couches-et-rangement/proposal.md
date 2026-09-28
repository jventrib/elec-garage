# Proposal

## Why

La maquette ne sait représenter qu'une chose : l'installation électrique. Or le garage qui
la reçoit est aussi un local de rangement, et l'installateur qui la consulte sur place a besoin
de voir ce qui va occuper le volume — étagères, rack à pneus — à côté de ce qui sera posé au
mur.

Servir les deux dans la même image oblige à choisir ce qu'on sacrifie : la maquette devient
illisible dès qu'on y ajoute du mobilier. D'où deux choses distinctes, traitées comme telles :
**une nouvelle famille d'objets représentés**, et **la possibilité de masquer ce que l'on ne
regarde pas**.

Le besoin est double, et c'est la seconde moitié qui est facile à rater : l'électricité doit
devenir une couche au même titre que le rangement, pour qu'on puisse isoler l'une ou l'autre
sans reconstruire la scène.

## What Changes

- **Une famille d'objets « rangement » entre dans le modèle de données** : étagères et rack à
  pneus, déclarés dans un apport dédié `006-rangement`, avec leur paroi, leur position, leur
  encombrement et **l'origine de leurs cotes** — relevé, déclaration fabricant, ou gabarit de
  catalogue.
- **Une couche « rangement » dans la scène**, dont les éléments sont désignables et portent une
  fiche.
- **Une couche « électricité »**, réunissant composants, cheminements, percages et trajets de
  conducteurs, désormais masquable comme le rangement.
- **Un bouton de bascule par couche**, dans l'en-tête, sur le modèle du bouton « Cotes de
  tracé » existant : libellé d'état, `aria-pressed`, et aucune couche masquée au chargement.
- **Un objet masqué cesse d'être désignable.** C'est une extension de FR-047, qui ne couvre
  aujourd'hui que le cas des ouvrants : le rayon de sélection de three.js ne teste pas la
  visibilité, et un objet invisible qui s'ouvre au clic est un objet que l'installateur désigne
  sans le voir.
- **Aucun changement sur le dossier électrique.** Le rangement reste **hors séquence de pose**,
  **hors obstacles de collision**, et ne relance aucun contrôle de V13 à V23.

### Ce qui est hors périmètre, et pourquoi

- **Le rangement n'est pas un obstacle.** Les tracés électriques sont arrêtés et le dossier
  est cohérent. Faire du mobilier une contrainte d'implantation relancerait tous les contrôles
  de collision pour produire des verdicts sur un dossier déjà validé. Le jour où le rangement
  existe réellement, la question se reposera — elle est écrite ici, pas enfouie.
- **Le rangement n'a pas d'étape de pose.** C'est du mobilier, pas un travail électrique. La
  séquence reste intégralement électrique.

### Ce que la constitution impose, et qui contraint la forme du changement

Le Principe VI interdit de substituer une valeur plausible à une cote non relevée, et le
principe de source unique interdit qu'une cote figure à deux endroits. Chaque élément de
rangement porte donc **l'origine de ses cotes**, visible dans la maquette comme dans la fiche.

#### Les étagères — gabarit de catalogue

Aucun produit n'a été retenu à ce jour. Elles sont donc représentées à un **gabarit
conventionnel**, portant cette mention dans la maquette et dans la fiche. Ce n'est pas un relevé,
et la maquette ne doit pas le laisser croire.

#### Le rack à pneus — déclaration fabricant contradictoire

Produit : VEVOR, modèle `TC0513`, ASIN `B0DPM1TXK6`, rack mural pliable, fiche Amazon.fr
consultée le 2026-09-27, 39,99 €. Caractéristiques déclarées, reprises telles quelles :

| Caractéristique | Valeur déclarée |
|---|---|
| Matière | Acier carbone Q235, finition émaillée powder-coated, noir |
| Type de tablette | `Step Shelf` |
| Nombre de tablettes | 4 |
| Encombrement | `55D x 144W x 55H centimetres` |
| Longueur réglable des barres | 32 à 48 pouces, soit 81,3 à 121,9 cm |
| Pneus compatibles | R14 à R20 pouces, R355,6 à R508 mm |
| Quantité | 4 pneus standard |
| Poids net (`Item Weight`) | 8,3 kg |
| Charge | Titre : `Max Load 300 lbs` — tableau : `Shelf Weight Capacity 136 Kilograms` |
| Montage | Mural, visses fournies, assemblage requis |

**Cette déclaration est contradictoire sur quatre points, et la page ne les réconcilie pas.**

1. **L'encombrement contredit le réglage déclaré.** Le tableau donne une largeur de **144 cm**,
   alors que les barres de support sont annoncées réglables de **81,3 à 121,9 cm**. Ces deux
   chiffres ne peuvent désigner la même longueur. La page n'explique pas si les 144 cm sont un
   majorant, une cote d'emballage, ou un autre axe : **la page ne rattache jamais la « length »
   en prose à l'un des axes D, W ou H du tableau.**
2. **La hauteur n'est pas qualifiée.** Le tableau donne `55H`, et **nulle part** la page ne dit
   si ces 55 cm correspondent à l'état **déployé** ou **replié**. Le produit est pliable, et rien
   ne permet de conclure.
3. **La charge n'est pas établie.** L'intitulé du champ est `Shelf Weight Capacity`, ce qui
   désigne une charge **par tablette** ; toutes les mentions en prose — le titre, la puce
   commerciale, le module fabricant — attribuent les mêmes 136 kg à **le rack entier**. La page
   ne tranche pas, et l'écart n'est pas une simple divergence de formulation : 136 kg par
   tablette et 136 kg au total n'aboutissent pas au même dimensionnement.
4. **Le nombre de tablettes n'est pas réconcilié avec la quantité.** Le tableau porte
   `Number of Shelves 4` et `Shelf Type Step Shelf`, la prose porte « 4 pneus ». Sur un rack à
   gradins, 4 pneus ne remplissent pas quatre gradins. La lecture du nombre de niveaux n'est
   pas établie.

S'y ajoute une **cinquième réserve, hors maquette mais à consigner** : la page indique
explicitement que le produit **ne fournit pas de tiges d'ancrage pour mur en béton** —
« *Our product does not come with expansion bolts for installation on concrete wall* » — alors
que les parois du garage en sont. Le rack est donc à poser sur scellement chimique ou tiges
adaptées, et **la maquette ne doit pas laisser croire que la fixation est résolue**.

Enfin, la fiche ne déclare **aucune** donnée de fixation — ni diamètre de tige, ni référence
d'ancrage, ni couple de serrage. Le mode de fixation n'est donc pas documenté, et toute cote de
perçage du support est **inconnue**.

#### Comment le rack est malgré tout dessiné

L'encombrement déclaré ne peut pas être rendu tel quel : il faudrait y ajouter une **hauteur de
montage**, qui est inconnue. Le rack est donc dessiné à un **gabarit de représentation**, déclaré
comme tel et portant partout la mention **« conventionnel — non relevé »** — le même traitement que
les étagères. Sa déclaration contradictoire n'est pas écartée pour autant : elle reste dans la
fiche, avec ses quatre points, et le bilan des cotes la présente comme une demande de précision.

Cette figure est une **convention de dessin**, pas une description du produit. Elle dit « voici à
quel emplacement et à quelle place un rack de ce type se pose », et non « voici les dimensions de
ce rack ».

#### Ce que ces contradictions impliquent pour la maquette

Une cote contradictoire n'est ni une cote relevée, ni une cote inconnue : c'est un **troisième
état**, et le traiter comme l'un des deux induirait en erreur dans les deux sens. Le traiter
comme relevée, ce serait afficher un volume de rangement faux comme s'il était établi — le
défaut exact que la constitution interdit. Le traiter comme inconnu, ce serait effacer une
déclaration fabricant existante et lire « néant » là où le maître d'ouvrage a, lui, une fiche
en main.

Le rangement porte donc **trois états de cote distincts** — relevée, inconnue, **contradictoire** —
et le cas contradictoire est celui qui appelle le plus d'attention, puisqu'il signale un
document à faire préciser plutôt qu'une donnée à mesurer.

### Implantation

**Paroi ouest.** La paroi ouest ne porte **ni composant, ni segment de conduit**. C'est la seule
face entièrement libre.

| Face | Composants | Nb | Cheminement |
|---|---|---|---|
| Nord | PC-03, PC-04, BR-01 | 3 | oui |
| Est | TD-01, PC-01, PC-02, BD-04, OC-01, OC-02, CM-01, CM-03, EL-03, MC-01 | 10 | oui |
| Sud | EL-02, CM-02, BD-06, CM-04, CM-05 | 5 | oui |
| Plafond | PC-05, BD-05, AC-01, EL-01a, EL-01b, BL-01, MC-02 | 7 | oui |
| **Ouest** | — | **0** | **aucun** |

Ces décomptes sont reproductibles par `dossier/006-rangement/occupation-parois.mjs`, qui lit les
apports **déclarés dans `index.json`**. Le fichier `000-demonstration.json` en est exclu : c'est un
jeu de démonstration qui n'entre dans aucun calcul, et le compter gonflerait la paroi est de neuf
objets qui n'existent pas au chantier.

Le rangement est **mural**, pour ne pas prendre la place au sol du stationnement. Le sud ne
dispose que de trumeaux de 0,20 m et 0,40 m sous le tablier de la porte sectionnelle ; le nord
porte la fenêtre et sa tablette ; l'est est saturée.

La **hauteur de montage reste indéterminée**, et c'est cohérent : la hauteur déployée du rack
n'est pas établie, et un accrochage à `1,80 m` supposerait de savoir ce qu'on accroche. Elle
sera portée comme inconnue, et non choisie pour l'apparence.

### Autres hypothèses retenues faute de décision

- **Les deux couches sont visibles au chargement**, et leur état n'est pas mémorisé — comme
  « Cotes de tracé » et « Ouvrants », qui se réinitialisent à chaque ouverture. La position dans
  la séquence, seule, est mémorisée.
- **L'état d'une couche est binaire et indépendant** : deux boutons, pas un sélecteur à trois
  états. « Aucune couche visible » n'est pas un besoin exprimé, et une maquette vide n'aide
  personne.

## Capabilities

### New Capabilities
- `maquette/rangement`: la représentation des éléments de rangement — étagères, rack à pneus —
  dans la maquette 3D : leur apport en données, l'origine de leurs cotes et ses trois états,
  leur désignation et leur fiche, et leur statut vis-à-vis de la séquence de pose et des
  contrôles de collision.

### Modified Capabilities
- `maquette/visualisation`: ajout de l'exigence de bascule d'affichage par couche, et extension
  de FR-047 — l'objet masqué non sélectionnable — des seuls ouvrants à toute couche masquable.

## Impact

- **Données** : nouvel apport `data/apports/006-rangement.json`, déclaré dans la liste
  `data/apports/index.json`. Le volume d'un élément de rangement est porté par l'élément, avec
  son origine — **pas** de catalogue de types, ses cotes n'ayant pas les sémantiques électriques
  du catalogue existant. Des libellés rejoignent `data/presentation.json` — aucun libellé dans le
  code.
- **Fusion** : `src/donnees/chargement.js:153-157` ne connaît aujourd'hui que `circuits`,
  `composants`, `cheminements`, `traversees` et `etapes`. `rangements` doit y être ajouté, sans
  quoi l'apport serait chargé puis ignoré.
- **Validation** : `src/donnees/validation.js` contrôle chaque genre d'apport. `rangements` doit
  y être contrôlé sur le modèle des composants, sans quoi un rangement mal déclaré
  s'afficherait sans que rien ne le signale.
- **Scène** : nouveau `src/scene/rangement.js`, exposant `basculer` comme
  `src/scene/cotes.js:135` le fait déjà, et `basculer` ajouté aux modules qui en sont dépourvus.
  L'appartenance des groupes aux couches se déclare en un seul endroit, à côté de l'ajout
  aujourd'hui à plat de `src/main.js:58`.
- **Sélection** : la liste de désignation de `src/main.js:233-237` est filtrée sur la visibilité
  — le même défaut que celui que `src/scene/obstacles.js:184` documente et corrige déjà.
- **UI** : deux boutons dans l'en-tête de `index.html`, câblés sur le modèle du bouton
  `tracage` de `src/main.js:161-172`.
- **Cadrage et fiche** : `src/geometrie/cadrage.js` et `src/ui/fiche-composant.js` doivent savoir
  cadrer et décrire un rangement.
- **Dossier** : `dossier/006-rangement/` — fiche produit, contradictions relevées, décisions du
  maître d'ouvrage.
- **Aucun** : règle de validation V1 à V23, étape de la séquence, tracé, section, protection. Le
  dossier électrique et ses contrôles ne bougent pas.
