# Phase 1 — Modèle de données

**Fonctionnalité**: `001-visualisation-3d` | **Date**: 2026-09-21 (révisé)

Tout ce que le projet décrit est écrit à la main dans des fichiers JSON ; tout ce qui peut
s'en déduire est calculé. Ce choix sert FR-020 et FR-021 : aucune donnée ne vit dans le code,
et une valeur n'existe qu'à un seul endroit.

**Quatre fichiers de socle**, propriété de cette fonctionnalité :

| Fichier | Contenu |
|---------|---------|
| `data/local.json` | Le relevé géométrique du garage |
| `data/chantier.json` | Phases de chantier ordonnées, natures d'étape, vérifications |
| `data/types-composants.json` | Gabarits d'encombrement et libellés des types de composants |
| `data/presentation.json` | Couleurs, opacités, éclairage, caméra, vues, libellés, tolérance de raccordement |

**Un fichier par fonctionnalité électrique**, `data/apports/<NNN-nom>.json`, qui y verse ses
circuits, ses composants, ses **cheminements**, ses **traversées** et ses étapes.

Le code ne contient ni cote, ni gabarit, ni couleur, ni libellé, ni liste de phases. Un test
le vérifie mécaniquement en relisant les sources de `src/`.

---

## Entités déclarées

### Local

Le garage. Un seul exemplaire, dans `data/local.json`. Transcription unique du relevé de la
constitution.

| Champ | Type | Règle |
|-------|------|-------|
| `oeuvre.x` | mètres | 5,60 — largeur intérieure est-ouest |
| `oeuvre.y` | mètres | 5,60 — profondeur intérieure sud-nord |
| `hauteurSousPlafond` | mètres | 2,75 |
| `epaisseurParois` | mètres | 0,20 |
| `repere` | objet | Origine à l'angle sud-ouest intérieur au sol fini ; x vers l'est, y vers le nord, z vers le haut. Déclaré pour être vérifiable, jamais recalculé. |

L'emprise extérieure n'est **pas** un champ : elle vaut `oeuvre + 2 × epaisseurParois` et se
calcule. La saisir serait offrir à 6,00 m l'occasion de diverger de 5,60 + 0,40.

### Baie

Une ouverture dans une paroi. Deux exemplaires.

| Champ | Type | Règle |
|-------|------|-------|
| `id` | texte | Unique. `porte-sectionnelle`, `porte-service` |
| `paroi` | énuméré | `sud`, `nord`, `est`, `ouest` |
| `debut` | mètres | Abscisse du bord de la baie le long de la paroi, depuis l'origine du repère |
| `allege` | mètres | Altitude du bord bas. 0 pour une porte, qui part du sol. Sans ce champ, une fenêtre serait indiscernable d'une porte |
| `largeur` | mètres | > 0, et `debut + largeur` ≤ dimension de la paroi |
| `hauteur` | mètres ou `null` | Hauteur de l'ouverture, mesurée **depuis l'allège**. La baie occupe donc `allege` à `allege + hauteur`, qui ne doit pas dépasser la hauteur sous plafond. `null` quand la cote n'est pas relevée |
| `incertain` | booléen | `true` si une cote de la baie ou de son ouvrant manque |

Valeurs du relevé : porte sectionnelle, paroi sud, `debut` 0,20, `allege` 0, `largeur` 5,00,
`hauteur` **2,10** — relevée, ce qui lève `TODO(RAIL_PORTE_SECTIONNELLE)`. Porte de service,
paroi est, `debut` 1,30, `allege` 0, `largeur` 1,10, `hauteur` 2,50. Fenêtre, paroi nord,
`debut` 1,30, `allege` **1,50**, `largeur` 3,00, `hauteur` 0,53.

Les deux portes conservent `incertain: true` alors que toutes leurs cotes de baie sont
désormais connues : le drapeau couvre « une cote de la baie **ou de son ouvrant** », et ni le
débattement du vantail ni l'épaisseur du tablier ne sont relevés.

### Obstacle

Volume occupé par un élément mobile, qui contraint l'implantation (FR-003).

| Champ | Type | Règle |
|-------|------|-------|
| `id` | texte | Unique |
| `libelle` | texte | **Obligatoire.** Désignation lisible, affichée à l'installateur. L'identifiant est un nom de machine ; le libellé vit dans les données, jamais dans le code |
| `baie` | référence | Baie à laquelle il se rattache |
| `etat` | énuméré | `ouvert`, `ferme` |
| `volume` | boîte ou `null` | `null` tant que la cote manque |
| `volumeMajorant` | boîte, facultatif | **Majorant** de l'encombrement, lorsqu'il n'est pas relevé mais se trouve borné par des cotes qui le sont. Exclusif de `volume`, et impose `incertain: true` |
| `incertain` | booléen | `true` impose l'affichage explicite du doute |

Un obstacle prend donc **trois** formes, et non deux :

| Forme | Déclaration | Verdicts possibles |
|-------|-------------|--------------------|
| Relevé | `volume` renseigné, `incertain: false` | `conforme` et `en-collision` |
| Borné | `volumeMajorant` seul, `incertain: true` | `conforme` **seulement** |
| Inconnu | ni l'un ni l'autre | `non-concluant` seulement |

La forme médiane est celle du **tablier de la sectionnelle en position ouverte**. Son
encombrement n'est pas relevé, mais il est borné par trois cotes qui le sont : la largeur de la
baie, la course du rail — il y est guidé — et la hauteur de passage de la porte, qu'il dégage.
Chacune des bornes dérive d'un relevé, ce qui en fait un majorant prouvé et non une valeur
plausible. Être disjoint du majorant démontre le dégagement ; le recouper ne démontre rien,
l'obstacle réel y étant contenu, et ne DOIT donc jamais produire `en-collision`.

Restent déclarés sans volume ni majorant : le débattement du vantail de la porte de service,
le tablier en position **fermée** — rien ne borne sa saillie vers l'intérieur du local —, le
gabarit de manœuvre du véhicule et le débattement des portières.

### Type de composant

Déclaré dans `data/types-composants.json`. Porte le libellé lisible et le gabarit
d'encombrement — largeur, hauteur, profondeur en mètres — qui sert au rendu. Ce n'est pas une
référence commerciale : la maquette vise la lisibilité, pas le photo-réalisme. Un gabarit par
défaut couvre les types non déclarés, mais un composant d'un type inconnu est un défaut.

### Composant

Un point d'utilisation ou un équipement. Apporté par une fonctionnalité électrique, jamais
par le socle. Son `type` renvoie au catalogue ci-dessus : il ne porte aucune dimension.

| Champ | Type | Règle |
|-------|------|-------|
| `id` | texte | Unique sur l'ensemble des apports |
| `reference` | texte | Repère du dossier, par exemple `PC-01` |
| `type` | texte | `socle-simple`, `socle-double`, `luminaire`, `commande`, `borne`, `tableau`… |
| `paroi` | énuméré | `sud`, `nord`, `est`, `ouest`, `plafond` |
| `face` | énuméré | `interieur`, `exterieur` — sert FR-005 |
| `position` | point | Coordonnées dans le repère du local |
| `hauteurAxe` | mètres ou `null` | `null` = inconnu, affiché comme tel |
| `indiceProtection` | texte ou `null` | `null` = inconnu |
| `circuit` | référence ou `null` | `null` = pas encore rattaché |
| `apport` | texte | Fonctionnalité d'origine. Renseigné au chargement, pas à la main |

Tout champ à `null` s'affiche comme inconnu (FR-007). Le socle n'a aucun moyen de deviner une
valeur absente, et c'est délibéré.

### Circuit

| Champ | Type | Règle |
|-------|------|-------|
| `id` | texte | Unique |
| `libelle` | texte | Repérage du tableau |
| `couleur` | texte | Signe distinctif visuel (FR-008). Attribuée par l'apport ou, à défaut, par le socle de façon déterministe |

Le dimensionnement du circuit n'appartient pas à cette fonctionnalité et n'a pas de champ ici.

### Étape

Unité de la séquence. Apportée par une fonctionnalité électrique.

| Champ | Type | Règle |
|-------|------|-------|
| `id` | texte | Unique sur l'ensemble des apports |
| `phase` | énuméré | Valeur de la liste des phases ci-dessous |
| `instruction` | texte | Non vide. Une étape muette est un défaut FR-026 |
| `nature` | énuméré | `consignation`, `pose`, `verification`, `levee-consignation` |
| `composants` | liste de références | Composants mis en place par cette étape. Peut être vide pour une consignation ou une vérification |
| `materiel` | liste de textes | Matériel et outillage nécessaires (FR-011) |
| `dependances` | liste de références | Étapes devant précéder celle-ci |
| `sousTension` | booléen | `true` si l'étape s'exécute sur une installation sous tension |
| `apport` | texte | Renseigné au chargement |

### Phase de chantier

Liste **ordonnée et fermée**, déclarée dans `data/chantier.json`. Une fonctionnalité choisit
une phase, elle n'en invente pas. Le rang d'une phase **est** sa position dans le tableau :
l'ordre du fichier porte l'information, aucun numéro n'est saisi à côté.

| Rang | Phase | Contenu |
|------|-------|---------|
| 1 | `consignation` | Mise hors tension et condamnation |
| 2 | `tableau` | Tableau divisionnaire, protections, repérage |
| 3 | `cheminement` | Chemins de câbles et gaines |
| 4 | `boites` | Boîtes, socles de fixation, traversées de mur |
| 5 | `tirage` | Tirage des conducteurs |
| 6 | `appareillage` | Pose et raccordement de l'appareillage |
| 7 | `essais-hors-tension` | Continuité des conducteurs de protection, résistance de terre, isolement, serrage, concordance du repérage |
| 8 | `levee-consignation` | Remise sous tension |
| 9 | `essais-sous-tension` | Déclenchement des différentiels, essais fonctionnels |

Chaque phase porte aussi son libellé lisible. Ajouter, retirer ou déplacer une phase se fait
dans le seul fichier : la logique d'ordonnancement ne connaît que la position dans le tableau.

Les essais du Principe V sont **scindés en deux phases**, de part et d'autre de la levée de
consignation. Ce n'est pas un raffinement gratuit : la mesure d'isolement et la mesure de
terre se font hors tension, tandis que l'essai de déclenchement d'un différentiel exige la
tension. Les réunir en une seule phase obligerait soit à illustrer une mesure d'isolement sur
une installation sous tension, soit à placer l'essai du différentiel avant la remise sous
tension. Les deux contrediraient FR-013.

### Apport

Un fichier `data/apports/<nom>.json`, contribution d'une fonctionnalité électrique.

| Champ | Type | Règle |
|-------|------|-------|
| `fonctionnalite` | texte | Doit correspondre au nom du fichier |
| `circuits` | liste de Circuits | |
| `composants` | liste de Composants | |
| `etapes` | liste d'Étapes | |

### Cheminement

Parcours d'un conduit posé en apparent. Apporté par une fonctionnalité électrique.

| Champ | Type | Règle |
|-------|------|-------|
| `id` | texte | Unique sur l'ensemble des apports |
| `reference` | texte | Repère du dossier, par exemple `CH-01` |
| `circuits` | liste de références | Au moins un. Plusieurs circuits dans un même conduit forment un **groupement**, dont le facteur de correction conditionne le courant admissible retenu par la note de calcul (Principe III). C'est pour cela que l'information vit sur le cheminement et non sur le circuit |
| `segments` | liste de Segments | Au moins un |
| `diametre` | mètres ou `null` | `null` tant que la note de calcul ne l'a pas arrêté : il dépend du taux de remplissage, donc du nombre de conducteurs |
| `apport` | texte | Renseigné au chargement |

Quand `diametre` vaut `null`, le conduit est **dessiné** à un diamètre conventionnel déclaré
dans `data/presentation.json`, et sa fiche affiche le diamètre comme **inconnu**. Le dessin
est une convention, la donnée reste déclarée absente — c'est la seule façon de représenter un
conduit sans prétendre en connaître la section.

### Segment de cheminement

| Champ | Type | Règle |
|-------|------|-------|
| `face` | énuméré | `sud`, `nord`, `est`, `ouest`, `plafond` |
| `de` | point | Extrémité, dans le repère du local |
| `a` | point | Extrémité |

L'orientation n'est **pas** un champ : elle se déduit, et c'est ce qui permet de la vérifier.
Sur une face verticale, un segment conforme fait varier soit l'abscisse le long de la paroi,
soit l'altitude, jamais les deux ; sur le plafond, soit x, soit y. Le rattachement à une face
n'est pas décoratif : il rend l'orthogonalité contrôlable et permet de dessiner le conduit en
saillie du bon côté du nu.

### Boîte de dérivation

**Pas une entité distincte.** C'est un Composant dont le `type` vaut `boite-derivation`, avec
les mêmes champs, la même fiche, le même rang d'apparition et les mêmes registres visuels que
n'importe quel socle. FR-033 l'exige, et une entité séparée dupliquerait quatre mécanismes
pour zéro information supplémentaire.

Son rôle particulier ne vit pas sur le composant mais dans le graphe : c'est là qu'on vérifie
qu'une jonction de trois conduits ou plus en porte une.

### Traversée de paroi

| Champ | Type | Règle |
|-------|------|-------|
| `id` | texte | Unique |
| `reference` | texte | Repère du dossier |
| `paroi` | énuméré | `sud`, `nord`, `est`, `ouest` |
| `position` | point | Point de percement, au nu intérieur |
| `sens` | énuméré | `interieur-vers-exterieur`, `exterieur-vers-interieur` |
| `penteVersExterieur` | booléen | Déclaré pour être contrôlable. La constitution exige la pente, afin qu'aucune eau ne chemine vers l'intérieur |

---

## Entités dérivées

Rien de ce qui suit n'est saisi.

### Séquence

Produite par le tri de R6 : phase d'abord, dépendances ensuite, ordre de déclaration pour
départager. Résultat stable d'une exécution à l'autre.

- `etapes` — étapes ordonnées, chacune recevant un `rang` de 1 à N
- `total` — N, affiché par FR-018
- `utilisable` — `false` tant qu'un défaut de cohérence subsiste (FR-027)
- `empreinte` — condensé du contenu, qui sert à invalider un curseur périmé (R7)

### Objet posable

Ce que la séquence met en place : un **composant**, un **cheminement** ou une **traversée**.
Les trois se comportent de la même façon à l'égard de la dérivation d'état, et sont donc
traités par le même mécanisme plutôt que par trois codes parallèles.

### Rang d'apparition d'un objet posable

Rang de la première étape de nature `pose` qui le référence. Jamais déclaré : le déduire
interdit qu'il diverge de la séquence.

### État de l'installation au rang N

Fonction pure du rang (R5), sans mémoire :

- `enPlace` — objets posables dont le rang d'apparition est < N
- `ajoutes` — objets posables dont le rang d'apparition vaut exactement N
- `absents` — les autres, non rendus

Les trois registres visuels de R10 se lisent directement sur cette partition. Le même rang
produit toujours la même partition, ce qui rend FR-016 vrai par construction plutôt que par
vigilance.

### Graphe de cheminement

Construit à partir des segments, des composants et des traversées. Jamais saisi.

- `noeuds` — points obtenus en agglomérant les extrémités de segments, les positions de
  composants et de traversées, à la **tolérance de raccordement** déclarée dans
  `data/presentation.json`. Les tracés étant saisis à la main au centimètre, exiger l'égalité
  exacte des coordonnées ferait échouer la continuité sur des arrondis sans réalité physique
- `degre(noeud)` — nombre de segments incidents. C'est ce comptage, et rien d'autre, qui décide
  si une boîte de dérivation est obligatoire à cet endroit
- `atteignables(circuit)` — composants du circuit joignables depuis le tableau en n'empruntant
  que des cheminements portant ce circuit

### Position du lecteur

Seul état persistant (FR-031, R7).

| Champ | Type | Règle |
|-------|------|-------|
| `rang` | entier | Entre 1 et `total` |
| `empreinte` | texte | Celle de la séquence au moment de l'enregistrement |

À l'ouverture : si l'empreinte diffère ou si `rang` dépasse `total`, retour au rang 1 avec
signalement de la perte. Aucun marquage d'étapes exécutées n'est conservé — le lecteur
mémorise une position, pas un avancement de travaux.

---

## Règles de validation

Contrôles de FR-026, exécutés au chargement et hors navigateur par `npm test`. Chacun est
bloquant au sens de FR-027 : tant qu'un seul échoue, la séquence n'est pas présentée comme
utilisable au chantier.

| # | Règle | Origine |
|---|-------|---------|
| V1 | Toute étape a une instruction non vide | FR-011, FR-026 |
| V2 | Toute référence de composant dans une étape désigne un composant existant | FR-026 |
| V3 | Tout composant est mis en place par au moins une étape de nature `pose` | FR-026 |
| V4 | Toute dépendance désigne une étape existante | FR-026 |
| V5 | Le graphe des dépendances est sans cycle | FR-026 |
| V6 | Une dépendance ne remonte jamais vers une phase antérieure de façon contradictoire | FR-024 |
| V7 | Exactement une étape de nature `consignation` et une de nature `levee-consignation` | FR-025 |
| V8 | Toute étape `sousTension: true` est ordonnée après la levée de consignation | FR-013 |
| V9 | Toute étape `sousTension: false` de phase ≥ `levee-consignation` est justifiée explicitement | FR-013 |
| V10 | Les six vérifications du Principe V sont présentes comme étapes de nature `verification` | FR-014 |
| V11 | Les identifiants de composants et d'étapes sont uniques tous apports confondus | FR-021 |
| V12 | Aucune cote du relevé n'apparaît dans un fichier d'apport | FR-021 |
| V13 | Tout segment est orthogonal sur sa face | FR-034, FR-042 |
| V14 | Tout segment repose dans les limites de la face qu'il déclare | FR-032, FR-042 |
| V15 | Toute extrémité de cheminement coïncide, à la tolérance, avec un composant, une boîte, une traversée ou une autre extrémité | FR-042 |
| V16 | Tout composant d'un circuit est atteignable depuis le tableau par des cheminements portant ce circuit | FR-035, FR-042 |
| V17 | Tout nœud de degré ≥ 3 coïncide avec une boîte de dérivation | FR-042, et la règle de la constitution « toute connexion dans une boîte » |
| V18 | Toute traversée desservant l'extérieur déclare une pente vers l'extérieur | FR-037 |
| V19 | Aucun segment ne traverse une baie de sa propre paroi | FR-042, et la fenêtre nord qui rend le cas concret |

La règle **V3 est étendue** : tout composant, cheminement, boîte et traversée doit être mis en
place par au moins une étape de nature `pose`. Un objet que nulle étape ne pose ne serait
jamais monté, qu'il s'agisse d'un socle ou de quinze mètres de conduit.

Les catalogues de socle se valident eux aussi, avant tout le reste : phases non vides,
consignation présente et antérieure à sa levée, au moins une vérification exigée par le
Principe V, gabarits strictement positifs, épaisseur de dalle positive, éclairage et vues
présents. Un apport qui emploie une phase, une nature, une vérification ou un type absent de
son catalogue est rejeté — c'est ce qui empêche les catalogues de se vider de leur sens à
mesure que les fonctionnalités arrivent.

V8 est la règle qui porte le plus de sécurité électrique, et **V17 celle qui porte le plus de
sécurité de pose**. Toutes deux sont mécaniques : un rang comparé à un autre pour V8, un
comptage d'arêtes pour V17. Trois conduits qui se rejoignent hors d'une boîte représentent une
connexion inaccessible, donc invérifiable à vie — et c'est exactement le genre de faute qu'un
relecteur humain laisse passer et qu'une machine ne rate jamais.

Le contrôle de collision de FR-038 échappe en revanche à cette liste, parce qu'il ne rend pas
un verdict binaire. Il en rend **trois** : conforme, en collision, ou **non concluant**.
Assimiler « non concluant » à « conforme » substituerait une réponse rassurante à une
inconnue, ce que le Principe VI interdit.

Un obstacle seulement **borné** ne relâche pas cette règle, il la raffine : il n'autorise que
le verdict favorable, jamais le défavorable. L'asymétrie va dans le bon sens — l'imprécision
d'un majorant coûte au pire un détour de conduit, là où la confondre avec une mesure ferait
annoncer un choc qui n'existe pas, et l'ignorer ferait perdre un dégagement démontré.
