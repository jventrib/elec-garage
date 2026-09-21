# Tasks

Ordre repris de `design.md` — D6 : la donnée et la validation d'abord, le rendu ensuite. Un
rendu posé sur un modèle inchangé donnerait une image juste au-dessus d'un booléen.

`npm test` DOIT être vert à la fin de chaque tâche.

## 1. La géométrie de perçage d'une traversée

- [x] 1.1 Ajouter au schéma de traversée, dans `src/donnees/chargement.js` et `src/donnees/validation.js`, la **géométrie de perçage** : point d'entrée sur le nu intérieur, point de sortie sur le nu extérieur, et `denivele` — un nombre ou `null`. Vérifié par un test neuf qui rejette une traversée dont l'entrée et la sortie ne sont pas sur les deux nus de la paroi déclarée
- [x] 1.2 Faire porter à `V18` la **cote** et non le booléen : une traversée `interieur-vers-exterieur` dont la sortie n'est pas plus basse que l'entrée est en défaut. Conserver le défaut existant pour le cas où rien n'est déclaré. Vérifié par `tests/validation.test.js` étendu : sortie plus haute → défaut, sortie plus basse → aucun défaut
- [x] 1.3 ⚠️ Écrire le `denivele` des **cinq traversées** dans `data/apports/002-prises-de-courant.json` et `003-eclairage.json`, **valeur laissée à `null`** — la réserve de 5 à 6 cm annoncée en prose dépend de la hauteur du boîtier, qui est une fiche produit. *Ne pas la figer par commodité : un dénivelé présumé est exactement ce que le Principe I proscrit.* Vérifié par l'absence de défaut V18 sur les quatre apports fusionnés, le `null` devant rester admis
- [x] 1.4 Borner le dénivelé par la **réserve d'altitude du boîtier** qui reçoit la traversée et par le **niveau fini du sol extérieur**, et refuser une géométrie qui sort de ces bornes. Vérifié par un test où un dénivelé supérieur à la réserve déclarée est rejeté
- [x] 1.5 Reporter la géométrie retenue dans `dossier/002-prises-de-courant/implantation.md` et `dossier/003-eclairage/implantation.md`, avec la mention « à établir » tant que la fiche produit manque. Vérifié par lecture

## 2. Les deux paramètres produit

- [x] 2.1 Déclarer `entraxe` et `cheville` comme **données produit**, avec un défaut projet et la possibilité d'une surcharge par section. *Le choix de l'emplacement est laissé à l'implémentation — les exigences sont écrites pour ne pas en dépendre (question ouverte 2 du design).* Vérifié par un test qui lit les deux, absents, et obtient `null` sans erreur
- [x] 2.2 Faire en sorte que **ce qui dépend d'un paramètre absent reste inconnu** : entraxe absent → nombre et positions des colliers inconnus ; cheville absente → diamètre et profondeur inconnus. Vérifié par un test qui contrôle qu'aucune valeur courante n'est substituée
- [x] 2.3 Ajouter les deux paramètres à la liste des valeurs à renseigner du changement `reserves-maitre-ouvrage`, au même titre que celles déjà en attente. Vérifié par la présence des deux lignes dans son `tasks.md`

## 3. La dérivation des colliers

- [x] 3.1 Écrire la dérivation de la répartition depuis l'entraxe, dans un module de géométrie : un collier près de **chaque extrémité de segment**, les intermédiaires répartis régulièrement sans dépasser l'entraxe. Vérifié par un test sur un segment de longueur connue et un entraxe connu
- [x] 3.2 Écrire les **exclusions** : aucun collier sur un changement de direction, au droit d'une enveloppe — boîte, organe de connexion, accessoire — ni d'une traversée. Vérifié par un test où la répartition tombe sur chacun des trois cas et se reprend de part et d'autre
- [x] 3.3 Traiter le **plancher de longueur** en deçà duquel un segment ne porte qu'un collier. *CH-04 mesurait 0,15 m : deux colliers d'extrémité y seraient absurdes.* La valeur se dérive de l'entraxe (question ouverte 3 du design) ; ne pas l'inventer si l'entraxe est absent. Vérifié par un test sur un segment court
- [x] 3.4 Vérifier que la dérivation ne déclare **aucune position en dur** : les colliers se recalculent si le tracé change. Vérifié par un test qui déplace un segment et constate que la répartition suit

## 4. Les étapes de perçage déclarent ce qu'elles font percer

- [x] 4.1 Enrichir `pr-percage` dans `data/apports/002-prises-de-courant.json` : ses `composants` et ses `cheminements` sont vides alors que l'étape fait percer les chevilles de quatre boîtiers de socles, de trois boîtes, de l'organe de connexion et de l'accessoire, plus les colliers de sept cheminements. *Corrigé en cours de route : le champ est `fixations`, DISTINCT de `composants` — les y mettre faisait apparaître socles et conduits posés dès le perçage.* Vérifié par V23 et par un test qui refuse une étape de phase `percage` ne déclarant aucun objet
- [x] 4.2 Même travail pour `ec-percage` dans `003-eclairage.json`. Vérifié de même
- [x] 4.3 Même travail pour `br-percage` dans `004-borne-recharge.json`. *Cette étape n'a aucune traversée — le parcours de la borne est entièrement intérieur, seul cas des trois circuits — mais elle fait percer les colliers de CH-B2 et CH-B3 et les chevilles de BR-01.* Vérifié de même
- [x] 4.4 Reprendre les instructions des trois étapes pour qu'elles **renvoient à ce que la vue montre** au lieu de le décrire seules. Ne rien retirer des pièges déjà nommés — le percement horizontal, la bande de 0,25 m, les fonds de boîte à percer avant pose. Vérifié par relecture
- [x] 4.5 ⚠️ Écrire dans l'instruction de chaque étape de perçage que **le modèle ne sait rien de ce qu'il y a dans le béton** — ni gaine, ni canalisation, ni fer — et que le contrôle de collision n'oppose les cheminements qu'aux obstacles relevés. *Un guide silencieux sur ce point serait pire qu'aucun guide.* Vérifié par la présence de la mention dans les trois étapes

## 5. Le rendu

- [x] 5.1 Dessiner une traversée à sa **géométrie réelle** dans `src/scene/cheminements.js` — entrée haute, sortie basse, sur l'épaisseur de la paroi — au lieu du volume traversant actuel, qui est droit. Vérifié par un test qui contrôle que l'altitude de sortie est inférieure à celle d'entrée quand le dénivelé est déclaré
- [x] 5.2 **Ne pas dessiner horizontale une traversée dont le dénivelé est inconnu**, et la signaler comme non cotée. *Le repli naturel figurerait exactement la faute que l'exigence écarte (D3).* Vérifié par un test dédié : dénivelé `null` → la traversée n'est pas plate et porte son signalement
- [x] 5.3 Distinguer visuellement les **trois natures de perçage** — traversée, fixation d'objet, fixation de collier — chacune portant l'outil qu'elle demande. Vérifié par un test qui contrôle que les trois natures sont rendues distinctement
- [x] 5.4 Afficher les **points de perçage** de l'étape courante, au lieu d'une vue vide. *Branché dans `src/main.js` : le module n'était pas embarqué tant que rien ne l'importait — 26 modules au bundle, 28 depuis.* Vérifié par un test sur `pr-percage` : la vue rend au moins un perçage
- [x] 5.5 Rendre consultables les **gardes** d'un point de perçage — bords de baie, obstacles relevés, autres perçages — et signaler celles qui sont serrées. *Les deux cas du projet sont la bande de 0,25 m au-dessus de la porte de service et celle de la façade sud, 0,12 m en haut et 0,13 m en bas.* Vérifié par un test sur ces deux cas

## 6. La fiche

- [x] 6.1 Remplacer dans `src/ui/fiche-composant.js:195` la ligne « Pente vers l'extérieur : oui/non » par le **dénivelé**, avec la mention explicite « inconnu » tant qu'il n'est pas établi. Vérifié par `tests/fiche.test.js`
- [x] 6.2 Porter sur la fiche d'un point de perçage sa **nature**, son outil, et le diamètre s'il est connu. Vérifié de même

## 7. Ce que le guide n'est pas

- [x] 7.1 Verrouiller par un test qu'**aucun marquage d'exécution** n'existe : ni case à cocher, ni décompte de trous percés, ni état persistant d'avancement. *C'est une exigence négative, et une exigence négative sans test se perd au premier ajout de confort.* Vérifié par le test lui-même

## 8. Recette

- [x] 8.1 `npm run build` puis contrôle visuel de `dist/garage.html` : sur l'étape de perçage, la vue montre les perçages, et les traversées se lisent en biais et non à plat *Constaté au navigateur par le maître d'ouvrage le 2026-09-23 : conforme.*
- [x] 8.2 Régénérer `dossier/fournitures.md` par `npm run fournitures` et contrôler le diff : le décompte des chevilles suit désormais la dérivation des colliers quand l'entraxe est renseigné, et reste inconnu sinon
- [x] 8.3 Incrémenter `src/version.js`
