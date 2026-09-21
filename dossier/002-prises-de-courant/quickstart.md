# Phase 1 — Guide de vérification de la conception

**Fonctionnalité**: `002-prises-de-courant` | **Date**: 2026-09-21

Cette fonctionnalité ne se « lance » pas : elle produit une conception. Ce guide dit comment la
vérifier — d'abord par machine, ce qui est possible pour une bonne part, puis à l'œil, puis au
chantier.

## Prérequis

- Node.js, pour la suite de tests du socle.
- Un navigateur, pour les scénarios visuels.
- Le texte de la **NF C 15-100**, pour les valeurs normatives du scénario 6. Sans lui, ce
  scénario ne peut pas conclure, et c'est volontaire.

## Ce qui se vérifie par machine

### 1. L'apport satisfait les vingt-deux règles du socle

```bash
npm test
```

**Attendu** : zéro défaut sur `data/apports/002-prises-de-courant.json`. Les règles qui portent
le plus ici :

| Règle | Ce qu'elle établit |
|-------|--------------------|
| V16 | Chacun des cinq points est atteignable depuis TD-01 par le tracé réel |
| V17 | Lu seul, cet apport n'a **qu'une** jonction de trois conduits ou plus, couverte par BD-01. Lu avec `003`, il en a **quatre** : BD-01, BD-02, BD-05 et la fourche de plafond de l'éclairage. BD-02 à BD-05 n'existent que pour les départs de l'éclairage, et BD-04 est retombée au degré 2 le 2026-09-21 — elle subsiste comme enveloppe du boîtier des commandes |
| V19 | Aucun conduit ne franchit la porte de service, la sectionnelle ni la fenêtre nord |
| V20 | Aucun conduit n'en recouvre un autre. **Règle ajoutée le 2026-09-22**, en préparant la borne : le socle n'opposait les conduits qu'aux obstacles relevés, jamais entre eux |
| V21 | Une boîte qui déclare un volume ne reçoit pas plus d'entrées qu'elle n'en déclare. **Ajoutée le 2026-09-22** : c'est la contrepartie de l'enveloppe, sans quoi déclarer une grosse boîte ferait taire V20. Aucune boîte de cet apport ne déclare encore de volume — BD-01 et BD-02 le feront avec la borne |
| V13, V14 | Les **dix** segments sont orthogonaux et reposent sur un nu déclaré |
| V18 | Les deux traversées déclarent leur pente vers l'extérieur |
| V3 | Chaque socle, boîte, conduit et traversée est posé par une étape |
| V10 | Les six vérifications du Principe V figurent dans la séquence |
| V8 | Aucune étape sous tension ne précède la levée de consignation |

**Cette vérification a déjà été conduite pendant la planification, sur l'implantation de
[data-model.md](./data-model.md) : zéro défaut.** Le refaire sur l'apport réel confirme que la
transcription est fidèle au plan.

### 2. Les longueurs et la chute de tension

```bash
npm test
```

**Attendu** : le point le plus éloigné est **PC-04, à 8,65 m** de conduit depuis le tableau.
Chute de tension terminale à 20 A en 2,5 mm² : **1,31 %**. Cumulée avec l'arrivée à 45 A sur
30 m de 16 mm² : **3,00 %**, sur une limite de 5 %.

C'est la longueur du chemin le plus long qui compte, non le métré total de 13,97 m. Le socle la
calcule sur le tracé ; elle n'est ni relevée au mètre ruban ni estimée.

### 3. Aucun conduit ne heurte le rail

```bash
npm test
```

**Attendu** : les contrôles contre `rail-sectionnelle` concluent **conformes**, son volume
étant entièrement relevé.

Le **tablier en position ouverte** conclut lui aussi **conforme**, et ce n'est pas un
relâchement. Son encombrement n'est toujours pas relevé, mais la hauteur de passage de la porte,
2,10 m, et la course du rail, 2,50 m, le **bornent** : tout le tracé de cet apport est au nord
de cette borne, donc prouvé dégagé. Ce qui ne doit **jamais** apparaître sur cet obstacle, c'est
« en collision » — le tablier réel étant plus petit que son majorant, un tel verdict ne serait
pas démontré.

Le **vantail** de la porte de service, le **tablier fermé**, le **gabarit véhicule** et le
**débattement des portières** restent **non concluants** : ni volume relevé, ni borne
déductible. Un contrôle qui n'a pas pu tester ne doit jamais se présenter comme un succès.

### 4. Aucune valeur inventée

```bash
npm test
```

**Attendu** : toute caractéristique non établie — indices de protection, section, calibre, type
de différentiel — est `null` dans l'apport et s'affiche « inconnu » dans la maquette. Zéro
valeur plausible en remplacement d'une inconnue.

## Ce qui se vérifie à l'œil

### 5. La maquette montre le tracé réel

```bash
npm run serve
```

Puis <http://localhost:8080>, et parcourir les treize étapes.

**Attendu** : les conduits apparaissent à l'étape qui les pose, en saillie du nu de la paroi
est, au diamètre réel de 20 mm. L'antenne passe **au-dessus** du linteau de la porte de
service. Les **cinq** boîtes sont visibles : BD-01 à 2,60 m au droit de PC-01, où les deux descentes entrent par le dessus du boîtier des socles et d'où part, **par le fond**, la traversée vers le point d'éclairage extérieur EL-03 ; et BD-02 à BD-05 aux départs de l'éclairage, chacune repérée comme portant **deux circuits**. Les deux traversées se lisent avec leur
sens. PC-05 dégage le rail. Un socle extérieur se distingue d'un socle intérieur.

**Les cotes de tracé s'affichent à l'étape qui pose l'objet**, et à elle seule : un trait
pointillé va de l'élément au repère le plus proche, avec sa mesure. À l'étape de perçage,
TV-01 se lit *0,20 m au nord du bord nord de la porte de service* et *0,30 m au-dessus du sol
fini* — de quoi tracer avant de percer. Un bouton d'en-tête les coupe.

**Cliquer un conduit ouvre sa fiche**, qui porte le **nombre de conducteurs** qu'il contient et la
condition de remplissage `D ≥ d·√(3n)` qui en découle : *8 — 3 pour les prises + 5 pour
l'éclairage* sur le tronc partagé, *3* sur les branches propres. Le chiffre n'est pas recopié de
la note de calcul, il en est **dérivé** — chaque circuit déclare ce qu'il met de fils dans un tube.

C'est la vérification que la pose apparente rend possible et que la pose encastrée ne
permettait pas : le tracé est un objet, donc il est opposable.

## Ce qui ne se vérifie que sur le texte de la norme

### 6. Les valeurs normatives de la note de calcul

**Aucune commande.** Ce scénario demande le texte de la NF C 15-100 et quelqu'un qui l'ait
sous les yeux.

**À confirmer, valeur par valeur** :

- courant admissible de 2,5 mm² pour une pose apparente sous conduit, et lettre de sélection ;
- facteur de correction de température pour l'ambiance retenue ;
- taux de remplissage admissible d'un conduit **IRL 20**, désormais seul calibre du projet hors ligne de la borne — le tronc y a été ramené et les branches d'éclairage y sont montées le 2026-09-22 ;
- **facteur de correction de groupement pour huit conducteurs dans un même conduit** — entrée
  nouvelle, devenue exigible par la mutualisation du tronc de 7,95 m avec l'éclairage, et qui
  porte donc désormais sur les deux circuits ;
- nombre maximal de socles par circuit pour 2,5 mm² et le calibre retenu ;
- appariement section / calibre de protection.

**Attendu** : chaque valeur porte sa référence de clause, et son état passe de « à confirmer » à
« confirmée ». Tant qu'une seule reste à confirmer, la note n'est pas opposable au sens du
Principe I.

Ces valeurs **n'ont pas été renseignées de mémoire** lors de la planification. C'est délibéré :
un chiffre plausible sur une grandeur de sécurité a l'apparence d'une vérification sans en
être une.

## Ce qui ne se vérifie qu'au chantier

### 7. Les essais du Principe V

Les six vérifications, dans l'ordre de la séquence : continuité du PE **point par point** — et
non un simple constat, l'absence de prise de terre locale en faisant la seule parade (FR-048) —,
résistance de la prise de terre sous 100 Ω, isolement, serrage, concordance du repérage, puis
déclenchement du différentiel après remise sous tension.

**Attendu** : chaque valeur mesurée est consignée. Un essai non consigné est réputé non fait.

### 8. L'étanchéité des traversées

**Attendu** : les deux traversées présentent une pente vers l'extérieur, constatée à l'eau avant
rebouchage, et leur point de percement reste au-dessus du niveau fini du sol extérieur
(FR-055).

## Réserves connues

| Réserve | Effet |
|---------|-------|
| `TODO(TABLIER_OUVERT)` | **Ne bloque plus PC-05**, dont la position est devenue définitive : le tablier ouvert est borné et le tracé prouvé dégagé. *Depuis le relevé de la sous-face à 2,31 m le 2026-09-22, le majorant est resserré de 0,21 m et **aucun cheminement du projet ne le recoupe plus**.* Subsiste pour la seule position **fermée**, où rien ne borne la saillie du panneau |
| **FR-055** | Le niveau fini du sol extérieur n'est pas relevé : la garde sous les deux percements ne peut être établie sur le dossier. Vérification de chantier, tableau prévu dans [implantation.md](./implantation.md) |
| `TODO(CONDUIT_EXTERIEUR)` | **Réduit aux deux boîtiers extérieurs** depuis la révision de FR-029 : il n'y a plus de conduit extérieur. Reste l'indice de protection des boîtiers de PC-02 et PC-04 |
| Décision **FR-050** | Tant que l'interrupteur de type AC subsiste, le Principe II n'est pas satisfait |
| **Remplissage de CH-05** | **Créée le 2026-09-22** par le retour du tronc à l'IRL 20. CH-05 porte huit conducteurs et exige un intérieur **≥ 14,69 mm** ; deux des quatre valeurs produit connues échouent. Condition d'**achat**, à trancher avant de commander — T047. Les quatre autres conduits du tronc passent sans condition |
| Valeurs normatives | Scénario 6 ; la note n'est pas opposable avant leur confirmation |

## Résultat d'exécution

**Date** : 2026-09-21 | **Apport** : `data/apports/002-prises-de-courant.json`
**Version du code** : `42-goulotte`
**Révisions du jour** : traversée par le fond du socle (FR-029 révisé), entrée des
conducteurs par le haut (FR-061, FR-062), puis **mutualisation maximale** des conduits et des
boîtes avec `003-eclairage`, correction du `chuteTensionCumulee` déclaré dans les
données — il portait encore 3,02 %, valeur d'avant la révision de FR-029, alors que tous les
documents portaient 2,96 % — et enfin **rapprochement de tout l'axe de la paroi est à 0,20 m de
la porte de service** (R11 de `003`), qui déplace PC-01, PC-02, BD-01, BD-03, BD-04 et TV-01 de
y = 3,00 à y = 2,60

| Scénario | Résultat |
|----------|----------|
| 1 — les vingt-deux règles | ✅ **zéro défaut**, seul comme fusionné avec `003`. Suite complète : **427 tests**, 427 passés au 2026-09-23, les quatre apports fusionnés |
| 2 — longueurs et chute de tension | ✅ point le plus éloigné **PC-04 à 8,65 m** ; ΔU terminale **1,35 %**, amont **1,65 %**, cumulée **3,00 %** sur 5 %. Métré total 14,20 m, non dimensionnant. Les cinq longueurs concordent avec [data-model.md](./data-model.md) au centième |
| 2 bis — entrée par le haut | ✅ PC-01 et PC-03 sont chacun abordés par **exactement un** conduit, venant d'un point strictement plus haut (FR-061). Vérifié mécaniquement : réintroduire un tronçon latéral fait échouer le test avec le message « PC-01 est abordé par CH-02 depuis le côté » |
| 3 — obstacles | ✅ **zéro collision affirmée** sur **70** contrôles. Rail fermé et rail ouvert : **10 conformes** chacun. Tablier ouvert : **10 conformes**, par majorant. Vantail, tablier fermé, gabarit véhicule, débattement portières : **10 non concluants** chacun — aucun ne ressort vert. ⚠️ Le non-concluant sur le **vantail** a changé de portée : PC-01 n'est plus qu'à 0,20 m de la baie |
| 4 — aucune valeur inventée | ✅ `typeDifferentiel`, `calibreProtection`, `courantEmploi` à `null` ; `indiceProtection` à `null` sur les **11** composants ; `provenance` à `null`. Établis : section 2,5, IΔn 30 mA, ΔU cumulée 2,96 % |
| 5 — la maquette montre le tracé réel | ⏳ **non exécuté** — demande un navigateur. `dist/garage.html` est construit et porte les **11** composants, **8** cheminements, 2 traversées et **15** étapes de cet apport. Tout l'appareillage de la paroi est se lit sur un seul aplomb, à 0,20 m du bord de la porte de service |
| 6 — valeurs normatives | ⏳ **non exécuté** — demande le texte de la NF C 15-100. Tâche du maître d'ouvrage |
| 7 — essais du Principe V | ⏳ chantier. Les six vérifications figurent dans la séquence, aux rangs 7 à 11 et 13 |
| 8 — étanchéité des traversées | ⏳ chantier. Pente déclarée et contrôlée par V18 ; la garde sur le niveau extérieur reste à relever. **La pente est désormais le point de vigilance principal** : deux boîtiers dos à dos invitent au percement horizontal, qui l'annulerait (FR-058) |

### Séquence composée

**15 étapes**, empreinte `fda9e770`. La levée de consignation est au **rang 14**, et aucune étape
sous tension ne la précède (V8). Les six vérifications du Principe V figurent toutes (V10).

### Effet des trois révisions du 2026-09-21

| | À la livraison | Traversée au fond | Entrée par le haut | Mutualisation | Axe à 0,20 m |
|---|---|---|---|---|---|
| Composants | 10 | 8 | 7 | 11 | **11** |
| Cheminements | 11 | 5 | 4 | 8 | **8** |
| Segments | 13 | 9 | 8 | 9 | **10** |
| Métré de conduit | 15,10 m | 13,80 m | 13,80 m | 13,80 m | **13,97 m** |
| Boîtes de dérivation | 4 | 2 | 1 | 5 | **5** |
| dont portant deux circuits | 0 | 0 | 0 | 5 | **5** |
| Conduit partagé avec l'éclairage | 0 | 0 | 0 | 7,95 m | **7,95 m en IRL 20** |
| Conduit extérieur | 0,90 m | aucun | aucun | aucun | **aucun** |
| Point le plus éloigné | 8,75 m | 8,35 m | 8,35 m | 8,35 m | **8,65 m** |
| ΔU cumulée | 3,02 % | 2,96 % | 2,96 % | 2,96 % | **3,00 %** |
| Entrée dans les socles muraux | latérale | latérale | par le haut | par le haut | **par le haut** |
| Marge de TV-01 à la porte de service | 0,10 m | 0,60 m | 0,60 m | 0,60 m | **0,20 m** |
| Facteur de groupement | sans objet | sans objet | sans objet | exigible | **exigible** |
| Traversées sortant du fond d'une boîte | 0 | 0 | 0 | 0 | **2, percées par `003`** |

Les deux premières révisions n'ont bougé ni le métré ni la chute de tension : ce qui a été gagné
est du **matériel** et des **connexions**, pas du câble. Trois boîtes de dérivation sur quatre
ont disparu, et sept cheminements sur onze. Seul PC-05 s'allonge de 0,60 m, BD-01 ayant été
remontée au droit de PC-01.

**La troisième les reprend en sens inverse, et c'est voulu** : la mutualisation rajoute quatre
boîtes et quatre cheminements à cet apport, sans un centimètre de conduit ni un millième de
chute de tension. Ce qui a changé de main, c'est le **porteur** : ces boîtes et ces 7,95 m de
tronc servent aussi l'éclairage, qui économise d'autant. Le prix en est un calibre supérieur —
un calibre à surveiller — un facteur de groupement devenu exigible, et cinq boîtes à repérer
comme portant deux circuits, la consignation de l'un ne suffisant pas à y intervenir.

**La quatrième est la seule à coûter du câble**, et c'est peu : 0,40 m. Rapprocher l'axe à 0,20 m
de la porte de service raccourcit CH-02 d'autant et allonge CH-03 d'autant — ces deux-là
s'annulent — mais impose un **décrochement de 0,40 m sur CH-07**, le socle du moteur restant calé
sur l'extrémité du rail (R5) et non sur l'axe. Remarquable : **aucune longueur dimensionnante ne
bouge**. Le tronc partagé reste à 7,95 m, le chemin le plus long à 8,35 m, la chute de tension à
2,96 %.

*Ce constat ne vaut plus depuis le **2026-09-23** : le passage de PC-03 et PC-04 en façade nord
est le premier déplacement qui touche le point dimensionnant. Chemin le plus long **8,65 m**,
chute cumulée **3,00 %**.*

**Ce qu'elle coûte vraiment est une marge, pas une longueur.** PC-01 passe de 0,60 m à **0,20 m**
du bord de la porte de service, et TV-01 avec lui. FR-002 reste satisfait — le socle est hors de
l'ouverture — mais le **débattement du vantail**, qui n'est pas relevé, cesse d'être une
vérification de forme : à 0,20 m, un vantail ouvrant vers l'intérieur et vers le nord viendrait
devant PC-01 et devant la commande. **T023 conditionne désormais la position de tout l'axe.**
*Levé le 2026-09-23 : le vantail ouvre vers l'extérieur, ferré au sud — l'axe tient.*
