# Phase 1 — Implantation cotée et modèle de données

**Fonctionnalité**: `002-prises-de-courant` | **Date**: 2026-09-21

Toutes les cotes ci-dessous sont dans le repère de la constitution : origine à l'angle
sud-ouest de l'œuvre intérieure au sol fini, x vers l'est, y vers le nord, z vers le haut,
unité le mètre.

**Cette implantation a été vérifiée contre les vingt-deux règles du socle de
`001-visualisation-3d` avant d'être consignée : zéro défaut.** C'est ce qui distingue ce
document d'un plan d'intention — l'orthogonalité, la continuité du circuit, l'absence de
jonction hors boîte et l'absence de franchissement de baie y sont établies, non supposées.

## Circuit

| Champ | Valeur |
|-------|--------|
| Identifiant | `c-prises` |
| Libellé | Prises garage |
| Points d'utilisation | 5 |
| **Prises desservies** | **8** — un socle double compte pour **deux** prises : PC-01 (2), PC-02 (2), PC-03 (1), PC-04 (2), PC-05 (1). Voir FR-013 et R7 |
| Conducteurs | 2,5 mm² (FR-041) |
| Conduit | IRL 20 mm (FR-035), dédié à ce circuit (FR-037) |
| Section, calibre, type de différentiel | **à établir par la note de calcul** — voir R6 |

## Points de prise et boîtes

| Repère | Type | Paroi | Face | x | y | z | Hauteur d'axe |
|--------|------|-------|------|---|---|---|----------------|
| TD-01 | tableau | est | intérieur | 5,60 | 0,70 | 1,50 | 1,50 |
| BD-01 | boîte de dérivation | est | intérieur | 5,60 | **2,60** | 2,60 | 2,60 |
| BD-02 | boîte de dérivation | est | intérieur | 5,60 | 0,70 | 2,60 | 2,60 |
| BD-03 | boîte de dérivation | plafond | intérieur | 5,60 | **2,60** | 2,75 | *(plafond)* |
| BD-04 | boîte de dérivation | est | intérieur | 5,60 | **2,60** | **1,10** | 1,10 |
| BD-05 | boîte de dérivation | plafond | intérieur | **2,70** | 3,00 | 2,75 | *(plafond)* |

**Les cinq boîtes sont PARTAGÉES** avec le circuit d'éclairage depuis le 2026-09-21. Elles
DOIVENT être repérées comme boîtes à plusieurs circuits (FR-066, constitution v1.10.0) :
consigner un circuit n'y met pas l'autre hors tension. BD-04 porte en outre le boîtier
`bt-commandes`, qui rattache les deux interrupteurs de l'éclairage.
| PC-01 | socle double | est | intérieur | 5,60 | **2,60** | 0,30 | 0,30 |
| PC-02 | socle double | est | **extérieur** | 5,80 | **2,60** | 0,30 | 0,30 |
| PC-03 | socle simple | est | intérieur | 5,60 | 5,45 | 0,30 | 0,30 |
| PC-04 | socle double | est | **extérieur** | 5,80 | 5,45 | 0,30 | 0,30 |
| PC-05 | socle simple | plafond | intérieur | 2,70 | 2,70 | 2,75 | *(plafond)* |

Vérifications d'implantation :

- **PC-01 est au nord de la porte de service**, qui occupe y de 1,30 à 2,40 : il est à **2,60**,
  donc **0,20 m** au-delà, conforme à FR-002 — mais **au plus juste** depuis le rapprochement de
  l'axe le 2026-09-21. Cette garde de 0,20 m est prise sur la **baie relevée** ; l'encadrement de
  la porte n'est pas relevé et son débord la réduira. Voir le point de vigilance sur le
  débattement du vantail, plus bas : il était théorique à 0,60 m, il ne l'est plus.
- **PC-03 est dans l'angle du fond et de la droite** : à 0,15 m de l'angle nord-est, conforme
  à FR-004.
- **PC-02 et PC-04 sont exactement au droit de PC-01 et PC-03** : même y, même z, autre nu de
  la même paroi. Les boîtiers se font donc **dos à dos**, et la traversée les relie par le
  fond (FR-029). Conforme à FR-003 et FR-005.
- **BD-01 est au droit de PC-01** (FR-062), ce qui permet la descente droite et l'entrée par le haut sans té sur l'antenne. Cet aplomb, x = 5,60 et **y = 2,60** depuis le 2026-09-21, porte à lui seul **huit** objets sur quatre altitudes : PC-01 au sol et PC-02 derrière lui à travers la paroi ; BD-04, CM-01 et — dehors, au dos de la même boîte — CM-03 à 1,10 m ; BD-01 à 2,60 m et EL-03 dehors à la même hauteur, par le fond de BD-01 ; BD-03 au plafond. **C'est la colonne vertébrale de l'installation**, et aucun de ces huit objets n'a demandé un percement de plus que les trois traversées qui s'y trouvent (FR-046, FR-045, R11 de `003`). **La ligne de la borne s'y ajoutera** : elle passe au-dessus du tronc, entre 2,635 et 2,727 m en IRL 25, et **transite BD-01**, qui doit donc être achetée d'emblée en modèle à **six entrées** et porte alors **trois circuits** (FR-036, FR-037 de `004`, Principe IV amendé en v1.11.0). Cette traversée n'est pas un choix de commodité : CH-04, la montée de BD-01 vers BD-03, occupe toute la bande au-dessus de la boîte, et aucun parcours horizontal ne la franchit.
- **Il n'y a plus de boîte de dérivation en pied.** Les deux qui y figuraient, BD-03 et BD-04,
  n'existaient que pour couvrir une jonction de trois conduits créée par le décalage latéral de
  la traversée. Le décalage étant abandonné le 2026-09-21, la jonction retombe à deux conduits
  et les boîtes disparaissent (FR-029, révision).
- **TD-01 est dans la bande relevée**, entre 0 et 1,30 m de l'angle sud-est.
- **PC-05 est centré sur la baie** — là où se trouve la tête de motorisation — et à 0,20 m au
  nord de l'extrémité du rail. Position **définitive** : le tablier ouvert n'est toujours pas
  relevé, mais la course du rail le borne à y ≤ 2,50 m, et le socle comme son conduit sont au
  nord de cette borne, avec **0,055 m** de marge démontrée pour le socle depuis le 2026-09-23 —
  PC-05 est descendu à y = 2,60, entraîné par BD-05 sur l'axe ouest de BD-01 (FR-053, R5).

## Traversées de paroi

| Repère | Paroi | x | y | z | Sens | Pente vers l'extérieur | Percée derrière |
|--------|-------|---|---|---|------|------------------------|-----------------|
| TV-01 | est | 5,60 | **2,60** | 0,30 | intérieur → extérieur | oui | PC-01 |
| TV-02 | est | 5,60 | 5,45 | 0,30 | intérieur → extérieur | oui | PC-03 |

Chaque traversée est percée **derrière le boîtier du socle intérieur** et débouche dans son
fond : sa position est donc celle du socle lui-même, et le socle extérieur qui lui fait dos est
atteint sans un centimètre de conduit dehors. Le point de sortie sur le nu extérieur est
**dérivé** de la position et de l'épaisseur de paroi, jamais saisi — il coïncide avec la
position du socle extérieur.

Trois contraintes d'exécution en découlent, toutes dans la spécification :

- le boîtier intérieur doit comporter une **entrée en fond** (FR-057, confirmé) ;
- le percement est **en biais vers le bas**, entrée haute à l'intérieur et sortie basse à
  l'extérieur (FR-058). Deux boîtiers dos à dos étant à la même hauteur, le percement
  horizontal est le geste naturel et c'est la faute à éviter : il annulerait la pente ;
- le percement précède la **pose du boîtier** (FR-059), dont le fond deviendrait inaccessible.

## Cheminements

| Repère | De | Vers | Segments | Longueur | Circuits |
|--------|----|------|----------|----------|----------|
| CH-01 | TD-01 | BD-02 | montée | 1,10 | **partagé, IRL 20** |
| CH-02 | BD-02 | BD-01 | antenne paroi est | **1,90** | **partagé, IRL 20** |
| CH-03 | BD-01 | PC-03 | antenne **2,85** puis **descente droite, entrée par le haut** | **5,15** | prises, IRL 20 |
| CH-04 | BD-01 | BD-03 | montée au plafond | 0,15 | **partagé, IRL 20** |
| CH-05 | BD-01 | BD-04 | descente, **entrée par le haut** du boîtier | 1,50 | **partagé, IRL 20** |
| CH-06 | BD-04 | PC-01 | **descente droite, entrée par le haut** | 0,80 | prises, IRL 20 |
| CH-07 | BD-03 | BD-05 | plafond **droit vers l'ouest**, **commun avec l'éclairage** | **2,90** | **partagé, IRL 20** |
| CH-08 | BD-05 | PC-05 | plafond | 0,30 | prises, IRL 20 |

**Métré total : 13,97 m**, dont **7,57 m partagés** avec le circuit
d'éclairage. Le métré n'a pas changé : le tracé est le même, scindé aux boîtes où les deux
circuits se séparent. Aucune longueur n'est déclarée : elles se
déduisent des segments. PC-02 et PC-04 ne sont desservis par aucun conduit — la traversée les
atteint directement.

*Onze cheminements à l'origine, quatre après les deux premières révisions du 2026-09-21, huit
après la mutualisation. Le métré total n'avait pas bougé d'un centimètre sur les trois : 13,80 m
à chaque fois. Ce qui avait disparu, ce sont trois boîtes de dérivation, six conduits terminaux et
tout le conduit extérieur. Seul le rapprochement de l'axe a fini par coûter de la longueur —
0,40 m, le décrochement de CH-07 — portant alors le métré à 14,20 m. Ce décrochement a disparu le 2026-09-23, BD-05 ayant rejoint l'axe ouest de BD-01 : métré **13,97 m**.*

### Les descentes entrent par le haut, et BD-01 est au droit de PC-01

FR-061 exige que les conducteurs entrent dans les socles intérieurs **par le dessus** du
boîtier : sur une paroi froide où la condensation est probable, une gaine abordant un boîtier
par le bas ou le côté y conduit l'eau, alors qu'abordé par le haut le même conduit la laisse
s'écouler dehors.

Satisfaire cette exigence a imposé de **placer BD-01 au droit de PC-01** — alors à y = 3,00 m au lieu
de 2,70 m. Une première tentative gardait BD-01 à 2,70 m et prenait un décrochement de 0,30 m au
niveau de l'antenne pour venir se placer au-dessus du socle. **La règle V17 l'a refusée** : ce
décrochement se posait sur le tracé de l'antenne qui continue vers le fond, l'y coupait d'un té,
et la jonction comptait alors **quatre** conduits — donc exigeait une boîte de plus. En posant
BD-01 directement au droit du socle, la descente part de la boîte et le té disparaît.

D'où FR-062 : la boîte dont part une descente doit être au droit du socle qu'elle alimente.

### BD-02 a disparu, son motif ayant disparu

BD-02 n'était pas exigée par V17 — elle était de degré 2. Elle était conservée pour le
**tirage** : le parcours vers PC-03 faisait alors 2,55 + 2,30 m avec **deux** coudes à 90°, ce
qui est à la limite du tirable. Le nouveau parcours CH-03 fait 4,75 m d'un seul tenant avec
**un** seul coude, qui se traite par un accessoire de conduit. Le motif tombe, la boîte avec.

Il ne reste donc **qu'une** boîte de dérivation sur tout le circuit : BD-01, où se réunissent
les quatre conduits.

L'**antenne est à 2,60 m** et non plus bas parce que la porte de service descend jusqu'au sol
sur y de 1,30 à 2,40 : tout conduit reliant le tableau aux socles en longeant cette paroi doit
passer au-dessus de son linteau, haut de 2,50 m (R1, R2).

## Longueurs depuis le tableau, et chute de tension

Le socle les calcule sur le tracé réel. C'est la longueur du **chemin le plus long**, et non le
métré total, qui décide de la chute de tension.

| Point | Longueur de conduit | ΔU à 20 A |
|-------|---------------------|-----------|
| PC-01 | 5,70 m | 0,89 % |
| PC-02 | 5,90 m | 0,92 % |
| PC-05 | 6,20 m | 0,97 % |
| PC-03 | 8,45 m | 1,32 % |
| **PC-04** | **8,65 m** ← point le plus éloigné | **1,35 %** |

Les points **intérieurs** sont inchangés par la révision. Les deux points **extérieurs**
raccourcissent de 0,40 m chacun, la traversée remplaçant un conduit de 0,50 et de 0,40 m.

Chute de tension au point le plus éloigné, à 20 A en 2,5 mm² : **1,31 %**. Cumulée avec
l'arrivée à pleine charge du disjoncteur d'abonné, 45 A sur 30 m de 16 mm² : **3,00 %**, sur
une limite de 5 %. Le calcul est physique et ne dépend d'aucune table ; le **courant d'emploi
et le calibre** retenus restent à établir par la note de calcul (R6).

## Séquence de montage

Treize étapes, versées dans neuf phases du catalogue du socle. La consignation et sa levée sont
des étapes **partagées** : le socle n'en gardera qu'une lorsque l'éclairage les déclarera aussi.

| Phase | Étape | Nature |
|-------|-------|--------|
| consignation | Couper, condamner, vérifier l'absence de tension | consignation |
| **perçage** | **Tracer et percer TOUT** — boîtes, boîtiers, colliers, traversées | pose |
| boîtes | Poser les boîtes de dérivation et les boîtiers d'appareillage | pose |
| colliers et tubes | Clipser les colliers, emboîter les tubes IRL entre les boîtes | pose |
| tirage | Tirer les conducteurs, réserve de 10 à 15 cm par boîte | pose |
| **connexions** | **Raccorder dans les boîtes**, à la borne automatique, et refermer | pose |
| appareillage | Poser et raccorder les mécanismes | pose |
| **tableau** | **Câbler les départs sur les disjoncteurs** — en dernier | pose |
| essais hors tension | Continuité du PE, terre, isolement, serrage, repérage | vérification |
| levée | Lever la consignation | levée |
| essais sous tension | Déclenchement du différentiel, et les essais propres au circuit | vérification |

*Ordre arrêté par le maître d'ouvrage le 2026-09-22, et il corrige trois choses : il n'y avait
aucune phase de **perçage**, les **tubes** étaient posés avant les **boîtes** entre lesquelles ils
s'emboîtent, et le **tableau** venait en deuxième position — on y raccordait les départs d'un
circuit qui n'existait pas encore. Le motif est unique : ne jamais avoir à percer ou fixer un
élément déjà câblé.*

Les **six vérifications du Principe V** y figurent toutes : cinq hors tension, le déclenchement
du différentiel après la levée. La règle V10 le contrôle, et V8 vérifie qu'aucune étape sous
tension ne précède la levée.

## Règles de validation applicables

Les vingt-deux règles du socle s'appliquent sans exception à cet apport. Les plus structurantes
ici :

| Règle | Ce qu'elle établit sur cette implantation |
|-------|-------------------------------------------|
| V16 | Chacun des cinq points est atteignable depuis TD-01 par le tracé réel |
| V17 | Les jonctions de trois conduits ou plus portent une boîte — BD-01 (degré 4, plus un départ de traversée dans son fond, qui ne compte pas dans le degré), BD-02 et BD-05, toutes partagées avec l'éclairage. BD-03 n'est qu'un relais du tronc partagé, et **BD-04 est retombée au degré 2** le 2026-09-21 : elle subsiste comme enveloppe du boîtier des commandes, non parce qu'une règle l'exige |
| V19 | Aucun conduit ne franchit la porte de service, la porte sectionnelle ni la fenêtre nord |
| V13, V14 | Les **dix** segments sont orthogonaux et reposent sur un nu déclaré |
| V18 | Les deux traversées déclarent leur pente vers l'extérieur |
| V3 | Chaque socle, boîte, conduit et traversée est posé par une étape identifiée |

**Résultat de la vérification préalable : zéro défaut.**

## Ce qui reste `null`, et pourquoi

| Champ | Raison |
|-------|--------|
| `indiceProtection` des dix composants | Relève du choix de matériel ; pour PC-02, PC-04 et leurs boîtiers, dépend de `TODO(CONDUIT_EXTERIEUR)` |
| Section, calibre, type de différentiel du circuit | Relèvent de la note de calcul et de la décision FR-050 |
| `provenance.schemaUnifilaire` et `noteDeCalcul` | Ces documents n'existent pas encore |

Ces valeurs s'afficheront **« inconnu »** dans la maquette, conformément à FR-007 de 001, et
non comme des valeurs plausibles. Elles se rempliront d'elles-mêmes lorsque la note de calcul
sera versée en données (R10).
