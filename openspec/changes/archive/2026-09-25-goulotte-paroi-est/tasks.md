# Tasks

## 0. Préalable

- [x] 0.1 Commiter à part, et en premier, le changement `connecteurs-boites-de-derivation` (8/9), dont `noeudsDe` est repris ici

## 1. Étude

- [x] 1.1 Rédiger [etude.md](etude.md) : géométrie, ce qu'on gagne, ce que cela coûte, recommandation. Chiffres mesurés sur la maquette avant et après, et non estimés

## 2. Socle (design D1, D2, D3, D5)

- [x] 2.1 `pointDansProfile` et `pointSurProfile` (`src/geometrie/cheminement.js`) : un point dans le volume de la section retenue, et retombée sur l'axe sans cote connue
- [x] 2.2 Raccordement latéral par les faces, en chaîne le long de l'axe (`src/geometrie/graphe.js`). Vérifier que les longueurs de GL-01 sont inchangées
- [x] 2.3 `noeudsDe` limite un organe au profilé qui le porte, hors des bouts partagés (`src/geometrie/connecteurs.js`). Test : OC-02 porte conducteur par conducteur ce que BD-01 portait, OC-01 les siens seuls, le T n'est à aucun des deux, deux organes sur un profilé sont ambigus
- [x] 2.4 La longueur d'un conducteur ne compte d'un profilé latéral que ce qu'il y parcourt (`src/geometrie/conducteurs.js`)
- [x] 2.5 V15 et V17 par le volume du profilé ; V18 borne l'entrée d'une traversée partie du fond d'un profilé (`src/donnees/validation.js`). Tests : une descente arrêtée 2 cm sous le profilé pend ; un dénivelé de 0,25 m sur TV-L2 est refusé

## 3. Données

- [x] 3.1 `002` : GL-02, OC-02, AC-01 ; CH-02, CH-04, BD-01 et BD-03 retirés ; CH-03 réduit à sa descente ; CH-05 depuis le dessous ; CH-07 depuis la face avant ; GL-01 d'un seul segment au-dessus de 2,60 m ; cumul déclaré 3,03 %
- [x] 3.2 `004` : CH-B2 retiré, CH-B3 réduit à sa descente depuis x 4,50
- [x] 3.3 `003` : TV-L2 à l'axe 2,6525 m, dénivelé 0,105 m (90 × 40, tâche 9) ; EL-03 inchangée. CH-L1 reste au nœud de OC-01, sur GL-01 : c'est là que l'éclairage se sépare vers la paroi sud
- [x] 3.4 Instructions de `002`, `003`, `004` et `005` : GL-02 et OC-02 posés par les prises, condition 4 sur le profilé horizontal, AC-01 en accessoire, la borne tirée en câble dans les deux goulottes, aucune connexion. Vérifier par le test des instructions qu'aucun repère retiré n'est cité

## 4. Fiche (design D4)

- [x] 4.1 La fiche d'un accessoire de conduit porte « Connexions : aucune ». Test sur AC-01, et son absence sur BD-04

## 5. Tests

- [x] 5.1 `tests/goulotte-paroi-est.test.js` : zéro défaut sur les vingt-deux règles, géométrie de GL-02, raccordement par la face, ligne de la borne continue et sans connecteur, métré sous capot, pente de TV-L2, AC-01, aucune collision, aucun conduit parallèle à la goulotte
- [x] 5.2 Reprendre les décomptes, métrés, longueurs et connecteurs des tests existants. Rejouer sur le tracé d'avant, reconstruit dans `tests/_aides.js`, les tests des mécanismes éprouvés sur l'antenne : volume de boîte, heurt V20, piquage enfermé, cote d'horizontale

## 6. Dossier et réserves

- [x] 6.1 Corriger la note de calcul de la borne : groupement exigible, et non « sans objet » — erreur consignée ; longueur 10,61 m ; § 2.3 sur la goulotte
- [x] 6.2 Reporter les longueurs et chutes aux notes de `002` (8,86 m, 3,04 %) et `003` (8,18 m, 1,76 %)
- [x] 6.3 `reserves-maitre-ouvrage` : 3.3 levée ; 1.6 (b) close ; 4.3 étendue à GL-02 ; deux réserves bloquantes d'achat — `Iz` de la borne en goulotte avec groupement, et la forme de sa ligne face au calibre de sa descente
- [x] 6.4 `npm run fournitures` : IRL 25 −7,82 m, IRL 20 −3,28 m, goulotte 90 × 40 +6,00 m

## 7. Livrable

- [x] 7.1 `openspec validate goulotte-paroi-est`, `npm test`
- [x] 7.2 `npm run build` : `src/version.js` incrémenté
- [x] 7.3 Contrôler dans un navigateur : la goulotte jointive au plafond au-dessus de la porte de service, CH-07 sortant de sa face avant, l'angle nord-est lisible ; les fiches de OC-01, OC-02 et AC-01 — *contrôlé par le maître d'ouvrage le 2026-09-25*

## 8. Connexions admises en goulotte (design D8)

- [x] 8.1 Amender la constitution en v1.15.0 : condition 2 de l'exception de goulotte — dispositif de connexion, sans épissure, IP2X ou IPXXB conducteurs en place si le capot se dépose sans outil. Références § 526.3 et § 529.3 à confirmer sur le texte
- [x] 8.2 Deltas : « Organe de connexion à enveloppe propre » retirée, « Connexions sous le capot d'une goulotte » ajoutée, « Toute connexion dans une boîte », « Typologie » et les six conditions modifiées
- [x] 8.3 OC-01 et OC-02 sans volume ni entrées ; instructions de pose et de connexion de `002` et `005` ; tests des organes, du flanc et des fournitures
- [x] 8.4 Évaluer la section de GL-02 une fois l'organe libéré — étude, § 5. Conseil : 80 × 40 ; retenu : 90 × 40 (tâche 9)

## 9. GL-02 en 90 × 40 (design D9)

- [x] 9.1 Section de GL-02 à 0,09 × 0,04 (retenue le 2026-09-25, après un premier report en 80 × 40), axe à 2,705 m ; descentes CH-03, CH-05, CH-B3 depuis 2,66 m ; CH-07 et AC-01 depuis la face avant à x 5,56 ; OC-02 sur l'axe
- [x] 9.2 TV-L2 à l'axe 2,6525 m, dénivelé 0,105 m, EL-03 inchangée. Une traversée dont l'entrée débouche dans un profilé s'y raccorde par elle, même si son axe frôle le profilé (`src/geometrie/graphe.js`) ; V18 reconnaît le profilé par l'axe ou l'entrée
- [x] 9.3 Chutes cumulées déclarées : prises 3,04 %, borne 2,32 %. Instructions et matériel : 90 × 40, T réduit, garde de 16 cm, pente de 10,5 cm
- [x] 9.4 Tests, notes de calcul, étude, `npm run fournitures`
- [x] 9.5 Confirmer au catalogue de la gamme retenue : section intérieure du 90 × 40, remplissage admissible, angle intérieur compatible avec le rayon de courbure du câble de la borne, **existence du T réduit 120 × 60 / 90 × 40** — sinon revenir au 120 × 60 — *confirmé par le maître d'ouvrage le 2026-09-25*

## 10. La borne en câble 3G10 (design D10)

- [x] 10.1 Un circuit peut déclarer `cable` (`src/donnees/validation.js`) ; la fiche d'un conduit applique la règle du tiers au câble, n = 1 (`src/ui/fiche-composant.js`) ; le métré le compte au mètre de câble (`src/donnees/fournitures.js`, `build/fournitures.mjs`)
- [x] 10.2 `004` : `cable: "3G10"` ; instructions de pose et de tirage — essai de tirage avant l'achat, tube à grand rayon, ne pas forcer
- [x] 10.3 Dérogation au Principe III écrite à la note de calcul de la borne (§ 2.3, § 3.1), réserves 2.6 tranchée et 2.7 ouverte, deltas de spec
- [x] 10.4 Consigner le **motif** de la décision du 2026-09-24 — *consigné le 2026-09-25 : l'IRL 32 est très difficile à trouver et demande des équipements et un outillage spécifiques*

