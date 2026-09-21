# Phase 1 — Guide de vérification de la conception

**Fonctionnalité**: `003-eclairage` | **Date**: 2026-09-21

Cette fonctionnalité ne se « lance » pas : elle produit une conception. Ce guide dit comment la
vérifier — d'abord par machine, ce qui est possible pour une bonne part, puis à l'œil, puis au
chantier. Deux vérifications ne se font **que de nuit**, et elles portent sur les seuls défauts
qu'aucune mesure ne révèle.

## Prérequis

- Node.js, pour la suite de tests du socle.
- Un navigateur, pour les scénarios visuels.
- Le texte de la **NF C 15-100**, pour les valeurs normatives du scénario 6.
- **`002-prises-de-courant` chargé en même temps.** Cet apport ne déclare pas le tableau : il
  s'y raccorde. Seul, il ne peut pas être validé (R10).

## Ce qui se vérifie par machine

### 1. L'apport satisfait les vingt-deux règles du socle

```bash
npm test
```

**Attendu** : zéro défaut sur `data/apports/003-eclairage.json`, **fusionné avec celui des
prises**. Les règles qui portent le plus ici :

| Règle | Ce qu'elle établit |
|-------|--------------------|
| V16 | Chaque sortie et chaque commande est atteignable depuis TD-01 par le tracé réel |
| V17 | BD-01, BD-02, BD-04 et BD-05, partagées avec les prises, plus BL-01 à la fourche, couvrent les cinq jonctions de trois conduits ou plus |
| V19 | Aucun conduit ne franchit la fenêtre nord, la porte de service ni la sectionnelle |
| V20 | Aucun conduit n'en recouvre un autre. **Règle ajoutée le 2026-09-22** : c'est la lacune que R4 avait inscrite au dossier et que le tracé de la borne a fini par faire mordre |
| V21 | Une boîte à volume déclaré ne reçoit pas plus d'entrées qu'elle n'en déclare. **Ajoutée le 2026-09-22**, en contrepartie de l'enveloppe |
| V13, V14 | Les **neuf** segments de cet apport sont orthogonaux et reposent sur un nu déclaré |
| V18 | Les **trois** traversées déclarent leur pente vers l'extérieur |
| V3 | Chaque objet posable est posé par une étape identifiée |
| V10 | Les six vérifications du Principe V figurent dans la séquence |
| V8 | Aucune étape sous tension ne précède la levée de consignation |

**Cette vérification a été conduite pendant la planification.** Elle avait rendu **un seul
défaut**, sur CM-03, venu d'une limite du socle et non du tracé : une commande dans le boîtier
d'une autre n'était pas représentable. **L'extension a été faite** (T036) et le défaut est levé.
Elle sert aujourd'hui CM-01, qui n'est l'extrémité d'aucun conduit ; CM-03 est passée à
l'extérieur et c'est une traversée qui la dessert.

### 2. Les longueurs et la chute de tension

```bash
npm test
```

**Attendu** : le point le plus éloigné est **EL-01b, à 8,20 m** de conduit depuis le tableau,
dont la **phase parcourt 12,00 m** en passant par CM-01. Chute terminale au pire cas de charge,
4 × 60 W LED, sur la forme exacte `ρ·I·(L_phase + L_neutre)/S` : **0,142 %**. Cumulée avec
l'arrivée : **1,79 %**, sur une limite de **3 %**.

Ce qui doit se lire dans le résultat, et qui est le vrai enseignement : le circuit terminal ne
pèse presque rien, l'arrivée pèse onze fois plus. **La section n'est pas le sujet.**

### 3. Le tracé ne heurte aucun obstacle relevé

```bash
npm test
```

**Attendu** : **zéro collision établie**. Les treize segments dégagent le rail, entièrement
relevé.

**Tous les segments dégagent aussi le tablier ouvert, depuis le 2026-09-22.** Le segment de CH-L1
qui longe la paroi sud à 2,22 m pour rejoindre EL-02 entrait dans le majorant du tablier, lequel
descendait jusqu'à la hauteur de passage de 2,10 m faute d'une mesure. **La sous-face du tablier
remonté a été relevée à 2,31 m** : le majorant s'arrête là, le conduit court 0,09 m dessous, et
le dégagement est **démontré** au lieu d'être indécidable.

**Il ne reste aucun contrôle sans conclusion imputable à un obstacle dont le volume est connu.**
Les non-concluants restants portent tous sur les quatre obstacles qui n'ont **aucun** volume,
même borné : vantail, tablier fermé, gabarit du véhicule, débattement des portières.

### 4. Aucune valeur inventée

```bash
npm test
```

**Attendu** : indices de protection, type de différentiel, calibre, courant d'emploi et
temporisation du détecteur sont `null` dans l'apport et s'affichent « inconnu » dans la maquette.
Zéro valeur plausible en remplacement d'une inconnue.

### 5. Les trois circuits ne se disputent pas la même place

```bash
npm test
```

**Attendu** : aucune jonction fautive entre l'éclairage et les prises. La règle V17 le contrôle,
et elle a refusé deux tracés candidats au cours de la planification.

**Ce que ce scénario ne vérifie pas, et qu'il faut savoir** : un **croisement** de conduits,
dont le point n'est l'extrémité d'aucun des deux, reste invisible au socle. Il y en a un, à
(5,60 ; 2,60 ; 2,60), là où la descente vers les commandes franchit l'antenne des prises. Il est
structurellement inévitable et il est consigné (R4). Aucune commande ne le détectera : c'est un
point de relecture humaine, jusqu'à décision sur l'extension du socle.

## Ce qui se vérifie à l'œil

### 6. La maquette montre le tracé réel

```bash
npm run serve
```

Puis <http://localhost:8080>, et parcourir les étapes.

**Attendu** : l'axe du plafonnier apparaît **décalé au nord**, à y = 3,25 m, ses deux sorties
symétriques par rapport à l'axe médian. Le parcours de plafond des prises court 1,05 m plus au
sud, à y = 2,60 m depuis le 2026-09-23 — BD-05 ayant rejoint l'axe ouest de BD-01, le parcours commun file **droit**, sans décrochement. La
descente vers le boîtier de commande entre **par le dessus**. Les **trois** traversées se lisent
avec leur sens, et deux d'entre elles sortent du **fond d'une boîte** — celle de EL-03 au dos de
BD-01, celle de CM-03 au dos de BD-04. Tout l'appareillage de la paroi est se lit sur un **seul
aplomb**, à 0,20 m du bord de la porte de service. EL-02 apparaît centré sur la porte
sectionnelle, sous le rail.

## Ce qui ne se vérifie que sur le texte de la norme

### 7. Les valeurs normatives

**Aucune commande.** Ce scénario demande le texte de la NF C 15-100.

**À confirmer, valeur par valeur** : plage de hauteur d'axe des dispositifs de commande ; nombre
maximal de points par circuit d'éclairage ; courant admissible de 1,5 mm² en conduit et lettre
de sélection ; facteur de correction de température ; appariement section / calibre ; et
**facteur de correction de groupement pour huit conducteurs dans un même conduit** (le cas de
  CH-05, le plus chargé du tronc) — entrée
nouvelle, que la mutualisation du tronc a rendue exigible, et qui vaut identiquement pour `002`.

**Attendu** : chaque valeur porte sa référence de clause, et son état passe de « à confirmer » à
« confirmée ».

## Ce qui ne se vérifie qu'au chantier, et de nuit

### 8. La concordance des commandes — **de nuit, depuis l'extérieur**

**Attendu** : CM-01 allume et éteint les **deux** sorties du plafonnier d'un seul geste
(SC-014). CM-03 agit sur EL-03 **seul**, sans effet sur EL-02 ni sur le plafonnier (SC-015).

C'est la vérification la plus importante de cette fonctionnalité, et la seule qu'aucune mesure
ne peut remplacer : **une inversion de câblage entre deux commandes est invisible au contrôle de
continuité**. Elle se constate en regardant, de nuit, depuis l'extérieur.

### 9. Le réglage du détecteur

**Attendu** : EL-02 s'allume à l'approche d'une personne sur l'aire de manœuvre, et **reste
éteint** au passage d'un véhicule sur la voie publique ou d'une présence chez le voisin
(SC-017). La temporisation retenue est **consignée**, et le réglage effectif y correspond
(SC-018).

### 10. Les essais du Principe V

Les six vérifications, dans l'ordre de la séquence : continuité du PE **point par point**,
résistance de la prise de terre, isolement, serrage, concordance du repérage, puis déclenchement
du différentiel après remise sous tension.

**Attendu** : chaque valeur mesurée est consignée. Un essai non consigné est réputé non fait.

**Et un contrôle propre à ce circuit** : SC-006 exige que les quatre points coupent à l'essai du
différentiel **et que les prises restent alimentées** — c'est la preuve que les deux circuits
sont bien distincts, ce qui est l'objet de FR-016.

### 11. L'étanchéité des traversées

**Attendu** : pente vers l'extérieur constatée à l'eau avant rebouchage. Pour TV-L1, les gardes
sont de **0,12 m** au linteau et **0,13 m** au rail : les deux cotes les plus serrées de la
fonctionnalité, à vérifier au tracé avant de percer.

## Réserves connues

| Réserve | Effet |
|---------|-------|
| ~~**Extension du socle** — boîtier partagé~~ | **Levée** (T036) : la propagation par boîtier déclaré est écrite et testée ; CM-03 est atteignable |
| **Croisement de conduits** non détectable | **Sans objet dans cet apport** (T007 : zéro croisement), mais la limite du socle demeure. Relecture humaine tant que R4 n'est pas levée |
| ~~`TODO(TABLIER_OUVERT)` en position **ouverte**~~ | **LEVÉE le 2026-09-22** par le relevé de la sous-face du tablier remonté, **2,31 m**. Le majorant se resserre de 0,21 m, le conduit vers EL-02 en sort, et son dégagement est démontré. *Reste ouvert en position **fermée***, où rien ne borne la saillie du panneau vers l'intérieur |
| `TODO(CONDUIT_EXTERIEUR)` | **Rouvert** par la liaison de 0,30 m entre EL-02 et le détecteur. Les indices de protection extérieurs restent inconnus |
| Décision **FR-050** de `002` | Plus contraignante ici : ce circuit alimente un détecteur électronique en permanence |
| **Remplissage de CH-05** | **Créée le 2026-09-22** par le retour du tronc à l'IRL 20, décidé contre l'avis de la note de calcul. CH-05 est le seul conduit à porter huit conducteurs et exige un intérieur **≥ 14,69 mm**. Condition d'**achat** (T047 de `002`), et tirage plus difficile sur le tube où les deux circuits se tirent ensemble |
| Valeurs normatives | Scénario 7 ; la note n'est pas opposable avant leur confirmation |
| ~~**Longueurs de conduit ≠ longueurs de conducteur**~~ | **LEVÉE le 2026-09-22.** Chaque commande déclare `pilote` et `commutation`, le socle dérive le trajet réel de chaque conducteur, et le § 2.2 est rebasé sur `ρ·I·(L_phase + L_neutre)/S` : **0,142 % / 1,79 %**, marge **1,21 point**, conclusion inchangée. La même donnée a corrigé le décompte par conduit (§ 3.1) et le métré du 1,5 mm² |
| ~~Sens d'ouverture du **vantail**~~ | **LEVÉE le 2026-09-23** par relevé du maître d'ouvrage : ferré au jambage **sud**, ouvrant **vers l'extérieur**. Le débattement est hors du local ; le boîtier de CM-01, côté nord, est du côté de la serrure, et la distance de EL-03 à la serrure — 1,66 m — est confirmée |

## Résultat d'exécution

**Date** : 2026-09-21 | **Apport** : `data/apports/003-eclairage.json`, lu avec celui des prises
**Version du code** : `42-goulotte`
**Révisions du jour** : mutualisation maximale des conduits et des boîtes avec `002`, décalage
de l'axe de plafond vers le nord (y = 4,05 m), correction du `chuteTensionCumulee` déclaré dans
les données — 1,77 % au lieu de 1,76 % — que les tests n'encadraient que grossièrement, et
réutilisation du tube vertical et de la boîte du socle voisin de la porte de service par EL-03
(R9 réécrite, FR-024 révisé, FR-046), puis **passage de CM-03 à l'extérieur et rapprochement de
tout l'axe à 0,20 m de la porte de service** (R11, FR-038 et FR-030 révisés, FR-047 ajouté,
SC-013 abandonné)

| Scénario | Résultat |
|----------|----------|
| 1 — les vingt-deux règles | ✅ **zéro défaut** sur les deux apports fusionnés. Suite complète : **427 tests**, 427 passés au 2026-09-23, les quatre apports fusionnés. Le défaut annoncé au plan sur CM-03 a été levé par l'extension du socle (T036), dont le test a bien échoué avant d'être écrite |
| 2 — longueurs et chute de tension | ✅ point le plus éloigné **EL-01b à 9,00 m** de conduit, inchangé, dont la **phase parcourt 12,00 m** par CM-01. ΔU terminale **0,142 %** au pire cas de charge sur la forme exacte, cumulée **1,79 %** sur une limite de 3 %. Marge de **1,21 point**. EL-03 tombe de 6,50 m à **3,20 m** de conduit. Le rapprochement de l'axe n'a bougé **aucune** longueur dimensionnante : CH-02 perd 0,40 m, CH-07 les reprend, et les deux sont sur le tronc partagé. ✅ **Réserve « longueurs de conduit ≠ longueurs de conducteur » LEVÉE le 2026-09-22** : les quatre longueurs de phase sortent du socle et non plus d'un calcul à la main, et EL-01b reste dimensionnant sous la nouvelle forme |
| 3 — obstacles | ✅ **zéro collision établie** sur les **119** contrôles des deux circuits, dont **51 conformes** — un de plus depuis le relevé du tablier. Sur les 49 contrôles d'éclairage : rail fermé, rail ouvert et **tablier ouvert 7 conformes chacun**. *Le tablier ouvert donnait 6 conformes et 1 non concluant jusqu'au 2026-09-22 ; la sous-face relevée à 2,31 m a converti le dernier.* Vantail, tablier fermé, gabarit véhicule et débattement des portières : **7 non concluants chacun** — ce sont les quatre obstacles sans aucun volume, et il n'en reste aucun autre |
| 4 — aucune valeur inventée | ✅ `typeDifferentiel`, `calibreProtection`, `courantEmploi` à `null` ; `indiceProtection` à `null` sur les 8 composants ; `provenance` à `null`. Établis : section 1,5, IΔn 30 mA, ΔU cumulée 1,79 %. Le `conducteurs` déclaré du circuit n'est plus une source mais un **garde-fou** : le maximum dérivé, 5 sur CH-05, doit lui rester égal |
| 5 — les trois circuits | ✅ **aucune jonction fautive** entre l'éclairage et les prises. **Quatre** jonctions de degré ≥ 3 au total, toutes couvertes d'une boîte — dont BL-01, la fourche de plafond créée par le décalage. BD-04 est retombée au degré 2 avec la disparition de CH-L5 : elle subsiste comme enveloppe du boîtier des commandes, non parce qu'une règle l'exige. Séquence fusionnée : **30 étapes**, empreinte `6bebd49b`, levée de consignation au rang 26 |
| 6 — la maquette montre le tracé | ⏳ **non exécuté** — demande un navigateur. `dist/garage.html` est construit et porte désormais **trois** circuits, distincts par leur couleur : prises en `#2ca02c`, éclairage en `#ff7f0e`, borne en `#d62728`. La séquence livrée compte **44 étapes** depuis l'arrivée de la borne ; les 30 ci-dessus restent le compte des deux seuls circuits d'usage courant |
| 7 — valeurs normatives | ⏳ **non exécuté** — demande le texte de la NF C 15-100. Tâche du maître d'ouvrage (T006) |
| 8 — concordance des commandes, de nuit | ⏳ chantier, **de nuit**. Déclarée dans la séquence, étape `ec-commandes`, après la levée |
| 9 — réglage du détecteur | ⏳ chantier. Déclarée dans la séquence, étape `ec-detecteur`. La temporisation retenue reste à consigner |
| 10 — essais du Principe V | ⏳ chantier. Les six vérifications figurent, plus le contrôle que **les prises restent alimentées** quand l'éclairage est coupé (SC-006) |
| 11 — étanchéité des traversées | ⏳ chantier. Pente déclarée et contrôlée par V18. Pour TV-L1, les gardes sont de **0,12 m** au linteau et **0,13 m** au rail |

### Ce que le scénario 5 ne vérifie pas, et qui n'a plus d'objet ici

Un **croisement** de conduits dont le point n'est l'extrémité d'aucun des deux reste invisible au
socle : V17 ne crée un nœud qu'aux extrémités de segment, et le contrôle de collision n'oppose
les conduits qu'aux obstacles, jamais entre eux.

**Il n'y en a plus aucun.** Le croisement était d'abord sur la paroi est, où l'éclairage devait
franchir l'antenne des prises ; la mutualisation du tronc l'a supprimé. Il s'est alors déplacé au
plafond, où l'axe du plafonnier franchissait la descente vers le socle du moteur ; le décalage de
l'axe vers le nord l'a supprimé à son tour. Un détecteur écrit pour l'occasion le confirme :
**deux rencontres entre circuits, toutes deux à une extrémité commune donc dans une boîte, et
zéro croisement pur.**

La lacune du socle, elle, demeure. La ligne de la borne viendra sur les mêmes parois et rien ne
la préviendra.

### Le bug du socle corrigé pendant la planification, et son effet ici

`pointDansSegment` acceptait un écart perpendiculaire de 12 cm sur un segment de 2,80 m. L'écart
de **0,20 m** entre le parcours de plafond de l'éclairage et celui des prises aurait donc été
déclaré raccordé, et le scénario 5 aurait échoué sur une jonction inexistante. Deux tests de
régression bornent désormais ce comportement.
