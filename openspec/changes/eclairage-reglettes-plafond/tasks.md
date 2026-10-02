# Tasks

## 1. Données

- [x] 1.1 Type `reglette-led` dans `data/types-composants.json` : gabarit `[1,20; 0,065; 0,058]`, `orientation: "x"`, 36 W, 4000 K, IP65, IK07, classe II, 25 000 h
- [x] 1.2 Fiche produit : conserver les contradictions de la source (4230/4320 lm, inox ou ABS et polycarbonate, dénomination strip/fluorescent/Close to Ceiling), avec la source et sa date
- [x] 1.3 Six composants `ec-el-01a` à `ec-el-01f` en deux colonnes de trois
- [x] 1.4 Champ `zoneTablier` sur les composants du plafond, avec les trois états `degage-prouve`, `non-concluant` et absent
- [x] 1.5 Quatre boîtes de distribution : BL-01 (fourche), BD-09 (branchement sur le tronc ouest, degré 4 — CH-L4 la traverse, EL-01b seule en part), BD-08 (colonne ouest), BD-07 (colonne est) — **abandonnée le 2026-10-01 au profit de 1.9**
- [x] 1.6 Sept cheminements CH-L9 à CH-L15, raccordés au tableau et non à l'ancienne sortie — **abandonnés le 2026-10-01 au profit de 1.9**
- [x] 1.7 Circuits : recalcul de `c-eclairage` — chemin le plus long, longueur de chute de tension, conductors dérivés
- [x] 1.8 Instructions `ec-connexions` et `ec-appareillage` : six réglettes, aucune chaîne série, réserve du tablier

### 1bis. Pontage — 2026-10-01

- [x] 1.9 **Une seule boîte de distribution, BL-01**, au degré **3** ; quatre conduits seulement : CH-L2 (arrivée), CH-L3 vers EL-01f, CH-L4 vers EL-01e, CH-L6 vers le point extérieur
- [x] 1.10 **Quatre cordages** CP-1 à CP-4, `nature: "cordage"`, **sans section** ; deux chaînes de deux — **EL-01e →CP-1→ EL-01c →CP-2→ EL-01a** à l'ouest, **EL-01f →CP-3→ EL-01d →CP-4→ EL-01b** à l'est
- [x] 1.11 Champ `raccords` sur les composants pontés : deux points par appareil, exigés par **V24**
- [x] 1.12 Arête interne de **1,20 m**, bidirectionnelle, dans le graphe — réelle pour la chute, absente du métré
- [x] 1.13 `liaisonInterne: "fourni"` dans la fiche produit de `reglette-led`

## 2. Maquette

- [x] 2.1 Gabarit plafond de `src/scene/composants.js` corrigé en `[g.l, g.h, g.p]` — la hauteur était échangée avec l'épaisseur, ce qui décalait chaque luminaire de 5,3 cm
- [x] 2.2 Les six réglettes et les quatre boîtes sont rendues, avec leur statut de dégagement lisible — **puis ramenée à une seule boîte le 2026-10-01**
- [x] 2.3 Les cordages sont rendus comme des cordages : tube 6 mm, flèche 20 mm, couleur brique, **sans contour**

## 3. Contrôles

- [x] 3.1 `tests/apport-003.test.js` : inventaire, positions, symétrie des colonnes, quatre boîtes, sept cheminements
- [x] 3.2 `tests/apport-005.test.js` : point dimensionnant EL-01a, 11,725207972893961 m, amont 1,646372 %, cumul 1,79 %
- [x] 3.3 `tests/conducteurs-trajet.test.js` : sortie-module unique, chemins CH-L9 à CH-L15, repli sans pilote à 257,92 m, 104,89 m et dix conducteurs
- [x] 3.4 `tests/contiguite.test.js` : longueurs dérivées de la nouvelle distribution
- [x] 3.5 `tests/fournitures.test.js` : 26,87 m d'IRL 20, 11 changements de direction, quatre boîtes — **recalibré le 2026-10-01 à 20,52 m et une boîte**
- [x] 3.6 `tests/scene.test.js` : régression du gabarit plafond
- [x] 3.7 Un contrôle sans conclusion reste un contrôle : les deux réglettes du rang sud ne sont pas converties en dégagées
- [x] 3.8 `tests/cordages.test.js` : cordages sans section, trois conducteurs, `raccords` exigé, arête interne, V13/V14/V24, exclusion du lien interne du métré
- [x] 3.9 `tests/scene.test.js` : régression du rendu des cordages — pas de contour, tube de 6 mm
- [x] 3.10 `tests/fiche.test.js` : `zoneTablier` affiché sur la fiche
- [x] 3.11 `tests/contrat-apport.test.js` : garde partielle du schéma — `raccords`, `nature`, `liaisonInterne`. *Limite assumée : `apport.schema.json` n'est appliqué par aucun validateur.*

## 4. Dossier

- [x] 4.1 `note-de-calcul.md` : nouvelle section datée, chute de tension sur le tracé réel, hypothèse de charge déclarée
- [x] 4.2 `nomenclature.md` : six réglettes, quatre boîtes, métré conductors
- [x] 4.3 `implantation.md` : deux colonnes de trois, réserve du tablier, thickness à relever
- [x] 4.4 `data-model.md` : axes, type `reglette-led`, graphe de distribution, V17 sur sept jonctions
- [x] 4.5 `quickstart.md` : contrôles fonctionnels sur six réglettes, contrôle du tablier explicitement non concluant
- [x] 4.6 `research.md` : R12 sur la décision, le rejet du chaînage, le point dimensionnant et la réserve normative FR-018
- [x] 4.7 Séparer dans chaque document les historiques datés des affirmations actuelles
- [x] 4.8 `npm run fournitures` : `dossier/fournitures.md` régénéré, 124 lignes
- [x] 4.9 Révision du 2026-10-01 des six documents : distribution pontée, point dimensionnant EL-01b, plus de segment `non-concluant`, réserve circonscrite aux deux réglettes
- [x] 4.10 `nomenclature.md` : cordages en tant que tels, **section laissée en condition d'achat**
- [x] 4.11 `quickstart.md` : ce qu'un lecteur doit voir — une boîte, quatre cordages, aucun segment non concluant
- [x] 4.12 `research.md` : **R13** sur la décision de pontage, avec ce que R12 avait payé

## 5. Vérification

- [x] 5.1 `npm test` : 451 tests, 451 réussis, 0 échec — puis **466 tests, 466 réussis, 0 échec** après le pontage
- [x] 5.2 `npm run build` : `dist/garage.html` écrit, apports 002 à 005, `000-demonstration` écarté
- [x] 5.3 `node /tmp/val-livrable.mjs` : 0 défaut
- [x] 5.4 `git diff --check` : code 0 — relecture du diff final faite ; convention de chute fixée au **point d'utilisation** (1,86 %), le majorant 1,88 % étant chiffré et écarté dans les documents
- [x] 5.5 `npm run build` (`dist/garage.html`, 2,43 Mo) et `npm run fournitures` (133 lignes) relancés après la révision documentaire
- [ ] 5.6 Commit, **sur demande explicite du maître d'ouvrage**

## 6. Réserves ouvertes

- [ ] 6.1 **Épaisseur du tablier à relever sur place** : seule action qui referme la réserve de dégagement des deux réglettes du rang sud
- [ ] 6.2 **FR-018 à confirmer** : nombre maximal de points lumineux par circuit d'éclairage, six points sur un circuit
- [ ] 6.3 Si les deux réglettes du rang sud frottent au relevé, revoir leur profondeur vers y = 2,15 m — l'implantation perd alors sa lecture en trois rangs
- [ ] 6.4 **Type et section du câblier de pontage à arrêter** : quatre cordages, trois conductors chacun, aucune section déclarée. Le dossier le dit ; le choix reste au maître d'ouvrage
- [ ] 6.5 **Le lien interne de 1,20 m est une hypothèse** : elle vient de la longueur du corps de la réglette, non d'un relevé. Si le câble fourni est plus court, les longueurs de phase et la chute de tension changent
