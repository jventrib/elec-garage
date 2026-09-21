# Design

## Context

Voir `proposal.md` — Why. Ce qui suit ne retient que l'état du code qui contraint l'approche.

**Le rendu est le seul consommateur à ignorer `composant.dimensions`.** `src/scene/composants.js:38`
résout le gabarit par `catalogue.types.find((t) => t.id === composant.type)`, et son commentaire
assume le choix. `src/ui/fiche-composant.js`, `src/donnees/validation.js`,
`src/donnees/fournitures.js` et `src/geometrie/enveloppe.js` lisent tous `dimensions`. Le
comportement est verrouillé par `tests/scene.test.js:148`, intitulé « gabarit prend ses dimensions
dans le catalogue ».

**La continuité du graphe est inférée, pas déclarée.** `src/geometrie/graphe.js:159` rattache à une
enveloppe tout nœud dont le point tombe dans son volume :
`noeuds.filter((x) => boiteDe(x.point) === boite)`. C'est ainsi que `CH-02` et `CH-L1`, qui
partent tous deux de (5,60 ; 0,70 ; 2,60), sont rattachés à GL-01. Le garde-fou est le décompte
`entrees`, et `validation.js:657` nomme la faiblesse en commentaire.

**Le modèle de cheminement ne connaît qu'un diamètre.** `src/scene/cheminements.js:74` lit
`ch.diametre ?? presentation.diametreConduitConventionnel`, et `boiteEnSaillie()` construit un
cube de côté `diametre`. Une section rectangulaire n'a aucun moyen de s'y exprimer.

**Le projet est pré-chantier.** Rien n'est posé, aucun percement n'est fait. Le coût d'une reprise
de modèle est celui d'une édition de données, pas d'une dépose. Il y a **vingt-six cheminements**
déclarés au total — onze dans `000-demonstration`, sept dans `002`, cinq dans `003`, trois dans
`004` : une migration complète est à portée, une cohabitation de deux conventions ne se
justifierait pas.

**`000-demonstration` est dans le périmètre.** C'est un jeu d'essai, écarté du livrable par
`build/bundle.mjs`, mais chargé et validé par les tests — dont « le jeu de démonstration ne
traverse aucune baie ». Il porte onze cheminements, soit la plus grosse part du lot à migrer, et
le laisser en arrière ferait échouer la validation dès que `diametre` disparaît.

## Goals / Non-Goals

**Goals:**

- Que le rôle déclaré d'un objet détermine son encombrement, son repérage et ses obligations de
  dossier — un seul endroit où le dire, un seul endroit où le lire.
- Que la continuité d'un circuit repose sur une jonction déclarée, vérifiable par lecture, et non
  sur un test de contenance que personne ne voit dans la vue.
- Que le contrôle « suivi sans rupture » passe pour la bonne raison, et non parce qu'un volume
  invisible recouvrait le défaut.

**Non-Goals:**

- **Amender la constitution.** Tout ce que ce changement enregistre y est écrit depuis la v1.13.0.
  Si une contradiction apparaît à l'implémentation, elle se règle par un amendement distinct, pas
  ici.
- **Rouvrir un tracé.** Aucune position, aucune longueur, aucun calibre n'est révisé. GL-01 garde
  son parcours, BD-03 garde sa place, les cotes sont inchangées.
- **Confirmer une valeur normative.** La lettre de sélection du mode goulotte et le seuil de
  portion négligeable restent au changement `reserves-maitre-ouvrage`, tâche 1.6.
- **Trancher le tirage de CH-04 + CH-07.** Voir Open Questions.
- **Amender le Principe IV.** La dédicace du conduit y est énoncée sans référence de clause, et la
  ligne de la borne franchit déjà 0,04 m de goulotte sans conduit — l'état du tracé contredit la
  règle. Le maître d'ouvrage a tranché que le **câble** de la borne peut emprunter la goulotte.
  L'amendement relève d'un changement distinct ; **celui-ci en dépend** (voir Risks).

## Decisions

### D1 — La goulotte devient un cheminement, pas un composant à volume

**Retenu :** GL-01 quitte `composants` pour `cheminements`.

*Pourquoi.* Elle achemine des conducteurs sur un parcours, ce qui est la définition d'un
cheminement, et la constitution l'admet « pour tenir lieu de **conduit** sur un parcours donné ».
Le bénéfice décisif est que le suivi de circuit parcourt déjà les cheminements : la continuité
visuelle s'obtient sans code de cas particulier.

*Alternative écartée — garder GL-01 en composant et faire lire `dimensions` au rendu.* Corrige
l'image et rien d'autre. L'objet resterait un nœud ponctuel portant un volume d'un mètre, et la
continuité continuerait de reposer sur la contenance. On aurait réparé le symptôme le plus visible
en laissant la cause.

**Raccordement latéral, et ce que V15 vise réellement.** Un conduit se raccorde par ses bouts :
ses conducteurs n'en sortent pas ailleurs. C'est la prémisse de V15 — une extrémité pendante, ce
sont des conducteurs qui débouchent dans le vide, donc une connexion invérifiable ou un tronçon
inutile.

Une goulotte à capot démontable se raccorde par ses **côtés**, sur toute sa longueur. Son extrémité
n'est pas un point de sortie de conducteurs : c'est l'endroit où le profilé s'arrête. Le profilé de
GL-01 monte jusqu'au plafond alors que les conducteurs le quittent 0,15 m plus bas, et ce n'est ni
une anomalie ni un tronçon inutile — c'est la longueur du produit posé.

V15 n'est donc pas à assouplir par exception : elle est **mal bornée**. Elle énonce une règle vraie
des conduits comme si elle valait de tout cheminement. Le correctif est de la rattacher à ce qui la
fonde — le mode de raccordement — et non au type d'objet.

*Décision du maître d'ouvrage.* Le profilé est modélisé en entier, de 1,63 m à 2,75 m, et le
raccordement latéral est déclaré comme tel.

### D2 — `section` remplace `diametre`, sans cohabitation

**Retenu :** tout cheminement porte une `section` discriminée par sa forme.

```
  circulaire      { forme: "circulaire",   diametre: 0.020 }
  rectangulaire   { forme: "rectangulaire", largeur: 0.120, profondeur: 0.060 }
```

*Pourquoi une migration complète.* Vingt-six cheminements, rien de posé. Conserver `diametre` à côté
de `section` donnerait deux façons d'écrire la même caractéristique, ce que FR-021 proscrit — « une
cote NE DOIT figurer qu'à un seul endroit des données ». Le champ inconnu reste `null` comme
aujourd'hui, et la section conventionnelle de repli se décline par forme.

*Alternative écartée — `section` optionnelle en plus de `diametre`.* Diff plus petit, dette
immédiate, et le premier lecteur devra se demander laquelle fait foi.

**Le majorant se porte au niveau de la section**, et non par cote :

```
  { forme: "circulaire",    diametre: 0.020, majorant: null }
  { forme: "circulaire",    diametre: null,  majorant: { diametre: 0.032 } }
  { forme: "rectangulaire", largeur: 0.120, profondeur: 0.060, majorant: null }
```

*Pourquoi.* `diametreMajorant` est aujourd'hui **vivant dans le code et les tests, mort dans les
données** — aucun cheminement n'en porte depuis que l'IRL 32 de la borne est arrêté en IRL 25 le
2026-09-22. Rien n'est donc à migrer, et la forme est libre. Une notion unique au niveau de la
section évite qu'une forme rectangulaire ait un majorant exprimable de deux façons, ce que FR-021
proscrit, et laisse `calibre()` dériver l'encombrement de garde de la seule `forme`.

*Ce que le majorant n'est pas.* Le Principe VI l'exige « déclaré comme majorant, dans une forme
distincte de celle d'un relevé ». La section et son majorant restent donc **exclusifs** cote à
cote, comme `diametre` et `diametreMajorant` l'étaient : une cote arrêtée n'a pas de majorant.
`validation.js` garde ce contrôle, et le garde des parcours parallèles continue de retenir le
majorant quand la cote manque — il élargit la garde, donc il ne peut que resserrer le contrôle.

### D3 — L'organe de connexion est un nœud, la goulotte ne l'est pas

**Retenu :** un objet `organe-connexion` est déclaré à (5,60 ; 0,70 ; 2,60). `CH-02` et `CH-L1`
s'y joignent explicitement. GL-01 le traverse.

```
   AVANT                              APRES

   GL-01  (composant, volume 1,12 m)  GL-01  (cheminement, 120 x 60)
     ^                                  |
     | contenance geometrique           | traverse
     |                                  v
   CH-02 ---+                         [OC-01] organe-connexion
   CH-L1 ---+                           |  +-- CH-02   jonction declaree
                                        |  +-- CH-L1   jonction declaree
```

*Pourquoi.* La condition 2 de l'amendement l'exige en toutes lettres — « la goulotte abrite la
connexion, elle ne l'enveloppe pas » — et la condition 3 veut ces emplacements énumérés au dossier
au même titre que les boîtes. L'objet n'existait pas ; il doit exister.

*Effet de bord bienvenu.* La contiguïté `GL-01 → TD-01`, aujourd'hui déclarée sur le composant,
devient une extrémité de cheminement rejoignant un composant — le cas le plus ordinaire du modèle,
déjà couvert par les règles existantes.

### D4 — BD-03 devient un accessoire de conduit, et ne disparaît pas

**Retenu :** `accessoire-conduit`, sans enveloppe connectable, sans repérage multi-circuits, hors
de l'énumération des boîtes au dossier.

*Pourquoi pas une suppression pure.* Le point de tirage garde sa valeur : le parcours fusionné
ferait 3,45 m avec deux coudes à 90°, dont une transition paroi → plafond, et portera huit
conducteurs après l'automatisation. Le précédent du projet — l'ancienne BD-02, supprimée quand son
parcours est tombé à **un** coude — ne couvre pas ce cas.

*Pourquoi pas le statu quo.* Elle est de degré 2, ne sépare rien, ne loge rien, et V17 l'exempte
explicitement. La maintenir en boîte de dérivation impose un repérage multi-circuits et une
vérification de consignation là où rien ne se connecte — on fait chercher des bornes à
l'installateur là où il n'y en a pas.

### D5 — Le volume déclaré prime, le gabarit de type est le repli

**Retenu :** `gabarit()` lit `composant.dimensions` d'abord, le catalogue ensuite.

*Conséquence assumée.* `tests/scene.test.js:148` change de contrat et de nom. Le test qui le
remplace doit verrouiller GL-01 **dans la vue**, ce qu'aucun test ne fait aujourd'hui — c'est
précisément ce qui a laissé passer un facteur onze.

*Bénéfice collatéral.* BD-01 déclare `0,112 × 0,112 × 0,032` et se dessine à `0,10 × 0,10 × 0,05`.
Le même correctif la remet à sa cote.

### D6 — L'ordre de migration part de la validation, pas du rendu

Le rendu est le symptôme le plus visible et la dépendance la plus faible. Commencer par lui
donnerait une image juste au-dessus d'un modèle inchangé, et ferait croire le sujet clos.

```
  1. typologie au catalogue        (aucun effet, prepare le terrain)
  2. section + migration des 13 cheminements
  3. GL-01 en cheminement + OC-01 + jonctions declarees
  4. V17 / V22 : jonction declaree remplace la contenance
  5. BD-03 en accessoire-conduit
  6. rendu : volume declare prioritaire, section rectangulaire
  7. fiche, fournitures, dossier
```

Les étapes 3 et 4 sont le cœur : tant qu'elles ne sont pas faites, le graphe tient par la
contenance et l'étape 6 casserait la continuité en réduisant le volume dessiné.

## Risks / Trade-offs

**La continuité du graphe casse en cours de route** → les étapes 3 et 4 vont ensemble et ne se
livrent pas séparément. `tests/apport-002`, `apport-003`, `apport-005` et `contiguite` exercent
tous la continuité ; ils doivent passer au vert à la fin de 4, pas après 6.

**Le contrat d'un test existant change** → `scene.test.js:148` est une décision de conception
antérieure à la goulotte, pas un accident. La remplacer demande d'écrire pourquoi le contrat
s'inverse, faute de quoi le prochain lecteur la rétablira.

**La typologie peut être sur-dimensionnée** → trois rôles nouveaux pour trois objets, dont deux
sont des instances uniques. Le risque est de bâtir un système de types pour un cas. Il est accepté
parce que les trois rôles viennent de la constitution et non d'une généralisation : ils existeront
tant qu'elle les distinguera.

**Le décompte des fournitures change** → une boîte de dérivation sort du relevé, un accessoire et
un organe de connexion y entrent. `specs/fournitures.md` est généré (`npm run fournitures`) ; la
régénération doit être vérifiée, pas supposée.

**Ce changement dépend d'un amendement du Principe IV** → faire de GL-01 un cheminement oblige
à lui déclarer les circuits qu'elle porte. Le câble de la borne franchit 0,04 m de goulotte sans
conduit — entre la fin de CH-B1 à z = 2,60 et le départ de CH-B2 à z = 2,64 —, franchissement que
le volume assurait tacitement et qu'un cheminement doit énoncer. GL-01 déclarera donc `c-borne`,
ce que le Principe IV interdit en l'état. **Ce changement ne peut pas être archivé avant
l'amendement**, faute de quoi la donnée contredirait la constitution en toutes lettres.

**L'archive Spec Kit se désaligne un peu plus** → `specs/002-prises-de-courant/implantation.md`
affirme déjà à tort que BD-03 est imposée par V17, et son tableau des boîtes cite encore BD-02, qui
n'existe plus. L'archive est gelée ; ce changement ne la corrige pas et l'écart se creuse. La
capacité `installation/cheminements` fait foi.

## Migration Plan

Rien n'est déployé : la migration est celle des données et du code, sans reprise d'ouvrage.

1. Étapes 1 à 7 de D6, dans l'ordre, chacune laissant `npm test` au vert.
2. Après l'étape 4, vérifier que `atteignablesDepuisTableau` ne rend **aucun orphelin** sur les
   trois apports — c'est l'assertion qui démontre que la jonction déclarée a bien repris le travail
   de la contenance.
3. Après l'étape 6, relever la hauteur dessinée de GL-01 et la comparer à 1,12 m, puis comparer la
   cote de sa fiche à celle de la vue.
4. `npm run build` et contrôle visuel : la goulotte joint le dessus du tableau au plafond sans
   intervalle, et BD-02 reste absente.

**Retour arrière.** Chaque étape est une édition de données ou de code sous git, sans effet sur le
terrain. L'étape 4 est la seule dont le retour arrière n'est pas mécanique : elle change la règle de
continuité, et revenir en arrière suppose de restaurer la contenance **et** les volumes qui la
rendaient vraie.

## Open Questions

- **3,45 m à deux coudes avec huit conducteurs se tirent-ils ?** La réponse décide si l'accessoire
  de BD-03 doit être un accessoire **de tirage**, à capot déposable, ou un simple coude. Elle ne
  change ni les specs — qui exigent déjà que la nécessité d'un point de tirage soit établie sur la
  longueur, les coudes et le nombre de conducteurs — ni le découpage. Elle relève du relevé, au
  même titre que la tâche 3.1 de `reserves-maitre-ouvrage`.
- **La lettre de sélection du mode goulotte, et le seuil en deçà duquel une portion courte se
  néglige.** Confirmées au titre de la tâche 1.6 de `reserves-maitre-ouvrage`. Le modèle porte le
  mode de pose et laisse la valeur inconnue ; aucune étape n'attend ces valeurs pour se faire.
- **Le taux de remplissage admissible de la goulotte**, à lire sur la fiche produit (condition 6).
  Même traitement : la donnée existe, la valeur reste `null`.
