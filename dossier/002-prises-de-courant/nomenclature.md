# Nomenclature — prises de courant du garage

**Fonctionnalité**: `002-prises-de-courant` | **Date**: 2026-09-21

Quantités déduites du tracé de [data-model.md](./data-model.md) et de
`data/apports/002-prises-de-courant.json`. Les longueurs de conduit sont des **métrés de
tracé** : elles ne comprennent ni chute, ni cintrage, ni réserve de raccordement.

## Conduit et fixation

| Article | Quantité | Précision |
|---------|----------|-----------|
| Conduit **IRL 20**, branches propres | **5,85 m** de tracé | Métré exact. Prévoir la réserve d'usage pour les coupes et les cintrages |
| Conduit **IRL 20**, tronc **partagé** | **7,95 m** de tracé | Même calibre que les branches propres depuis la décision du maître d'ouvrage du 2026-09-22, qui a ramené le tronc de l'IRL 25 à l'IRL 20. ⚠️ **CH-05 porte huit conducteurs** — la règle du tiers y exige `D ≥ 14,69 mm` intérieurs, et un IRL 20 de 14,0 ou 14,5 mm irait jusqu'à 36,7 % d'occupation. **Condition d'achat, à trancher avant commande** (T047) |
| dont parcours **extérieurs** | **aucun** | Les socles extérieurs sont atteints par une traversée débouchant dans le fond de leur boîtier : il n'y a pas un centimètre de conduit dehors (FR-029) |
| Colliers de fixation | à raison de l'entraxe préconisé par le fabricant du conduit | L'entraxe est une donnée produit, non une cote de projet |
| **Chevilles adaptées au béton** | une par collier, plus les fixations d'appareillage | Voir ci-dessous — exigence de FR-034 |
| Coudes et accessoires de conduit | 4 changements de direction : 1 sur CH-01, 1 sur CH-03 au droit de PC-03, 2 sur CH-04 au plafond | Un changement de direction se traite par accessoire, jamais par pincement du tube. Le coude de CH-03 remplace la boîte BD-02, supprimée |

### Les chevilles ne sont pas un détail de quincaillerie

FR-034 exige que la **nature** des chevilles soit spécifiée, et non laissée au poseur. Les
parois sont en **béton plein non isolé** : une cheville à expansion pour matériau creux, ou une
cheville nylon universelle posée dans un trou surdimensionné, ne tient pas une charge
d'arrachement dans ce support, et c'est tout le circuit apparent qui pend de ces points.

| Support | Fixation attendue |
|---------|-------------------|
| Béton plein, colliers de conduit | Cheville pour béton plein, diamètre et profondeur d'ancrage conformes à la fiche du fabricant |
| Béton plein, boîtiers et tableau | Idem, dimensionnée sur le poids de l'appareil garni et non à vide |

Le perçage se fait au **perforateur**, mèche béton, sans percussion à proximité immédiate d'un
conduit déjà posé.

## Boîtes, traversées, appareillage

| Article | Quantité | Précision |
|---------|----------|-----------|
| Boîtes de dérivation en saillie | **5** — BD-01 à BD-05, toutes **partagées** avec l'éclairage | Les descentes restent droites et entrent par le dessus (FR-061, FR-062). Chacune DOIT être **repérée comme boîte à plusieurs circuits** (FR-066). BD-04 et **BD-01** doivent en outre être **dimensionnées en volume** : BD-04 transite le circuit des prises, loge la commande intérieure de l'éclairage et porte une traversée dans son fond (FR-045) ; **BD-01 est la plus chargée de l'installation** — quatre conduits, une traversée dans son fond vers EL-03 (FR-046 de `003`), et depuis le 2026-09-22 le **transit de la ligne de la borne**, ce qui la porte à **six entrées** et à **trois circuits**. Son volume est une valeur à établir sur cote produit, et un nombre d'entrées n'en vaut pas démonstration (FR-037, FR-038 de `004`) |
| Socles **2P+T en saillie**, doubles | **3** — PC-01, PC-02, PC-04 | PC-02 et PC-04 sont extérieurs. Les boîtiers de PC-01 et PC-03 DOIVENT comporter une **entrée en fond** : c'est la condition de la traversée par le fond, confirmée sur les boîtiers retenus (FR-057) |
| Socles **2P+T en saillie**, simples | **2** — PC-03, PC-05 | PC-05 est au plafond, pour la motorisation |
| Percements de traversée | **2** — TV-01, TV-02 | Ø selon le conduit, à la scie cloche béton, **derrière le boîtier de PC-01 et de PC-03**, percés **en biais vers le bas** et **avant la pose du boîtier** (FR-058, FR-059) |
| Mastic ou manchon d'étanchéité | 2 traversées | L'étanchéité accompagne la pente, elle ne la remplace pas |

## Conducteurs

| Article | Quantité | Précision |
|---------|----------|-----------|
| Conducteur **2,5 mm²** | **41,91 m** dérivés du trajet réel de chaque conducteur, plus 2 × 3 × 0,20 m pour les traversées | Phase, neutre, protection. Majorer des longueurs de raccordement en boîte et en appareil |
| Repérage de circuit | 1 jeu | Exigé à la pose, contrôlé à l'étape de concordance du repérage |

Le conduit est **dédié** à ce circuit (FR-037) : aucun autre conducteur n'y passe, ce qui
écarte le facteur de correction de groupement et laisse la condition de remplissage
`D ≥ 3d` de la [note de calcul](./note-de-calcul.md) très largement satisfaite.

## Protection au tableau

| Article | Quantité | État |
|---------|----------|------|
| Protection contre les surintensités | 1 | **Calibre à établir** — valeur normative, appariement avec la section 2,5 mm² |
| Dispositif différentiel 30 mA | 1 | Sensibilité acquise (Principe II). **Type à statuer** — décision FR-050 |

Ces deux lignes sont volontairement sans chiffre. Le calibre est une valeur normative non
encore confirmée sur le texte, et le type de différentiel dépend d'une décision du maître
d'ouvrage. Un chiffre plausible y serait plus dangereux qu'une case vide.

## Ce que cette nomenclature ne peut pas encore arrêter

| Article | Réserve |
|---------|---------|
| Boîtiers extérieurs de PC-02 et PC-04 | `TODO(CONDUIT_EXTERIEUR)` de la constitution, désormais **réduit aux seuls boîtiers** : il n'y a plus de conduit extérieur dont choisir la référence. Reste l'indice de protection des deux boîtiers, inconnu jusqu'au choix du produit |
| **Indices de protection** des dix composants | Relèvent du choix de matériel. Déclarés `null` dans les données, donc affichés « inconnu » dans la maquette, et non remplis d'une valeur vraisemblable |
| Calibre de la protection | Valeur normative à confirmer (T006) |
| Type du différentiel | Décision FR-050 (T007) |

---

**La liste totale des fournitures**, tous circuits confondus, est dans
[`dossier/fournitures.md`](../fournitures.md). Elle est **générée** — `npm run fournitures` —
et c'est elle qui donne les quantités à commander : trois nomenclatures tenues séparément
ne s'additionnent pas, la longueur de conducteur d'un tronc partagé dépendant du nombre de
fils que chaque circuit y met. Le présent document reste la référence de **détail**.
