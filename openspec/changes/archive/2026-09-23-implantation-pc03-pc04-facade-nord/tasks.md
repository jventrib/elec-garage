  # Tasks

La géométrie a été vérifiée à vide **avant** d'être proposée : les vingt-trois règles ne rendent
aucun défaut. Ces tâches la posent et reprennent ce qui la cite.

`npm test` DOIT être vert à la fin de chaque tâche.

## 1. Les données

- [x] 1.1 Passer **PC-03** en `paroi: "nord"`, face intérieure, position (5,45 ; 5,60 ; 0,30) dans `data/apports/002-prises-de-courant.json`. *0,15 m de la paroi est — le miroir exact de sa cote actuelle, qui était à 0,15 m de la paroi nord.* Vérifié par `validerTout` sans défaut sur les quatre apports fusionnés
- [x] 1.2 Passer **PC-04** en `paroi: "nord"`, face extérieure, position (5,45 ; 5,80 ; 0,30). Vérifié de même
- [x] 1.3 Passer **TV-02** en `paroi: "nord"`, position (5,45 ; 5,60 ; 0,30), sens et pente inchangés. *Son `denivele` reste `null` : le guide de perçage ne l'a pas établi et ce changement ne le tranche pas davantage.* Vérifié par l'absence de défaut V18
- [x] 1.4 Reprendre les segments de **CH-03** : antenne sur la paroi est de y = 2,60 à l'angle y = 5,60, virage sur la paroi nord jusqu'à x = 5,45, puis descente de z = 2,60 à 0,30. Vérifié par V20 et V15 sans défaut, et par le contrôle que la descente repose bien sur la face nord
- [x] 1.5 Vérifier que le virage à l'angle **n'appelle pas de boîte** : c'est un changement de direction sans dérivation, degré 2, qui se traite par un accessoire de conduit. Vérifié par V17 sans défaut à ce point

## 2. La note de calcul

- [x] 2.1 Reprendre le tableau du **chemin le plus long** dans `dossier/002-prises-de-courant/note-de-calcul.md` ligne 54 : PC-03 passe de **8,15 m à 8,45 m**, et sa chute terminale de 1,28 % à ~1,33 %. Vérifié par comparaison avec `longueursDepuisTableau`
- [x] 2.2 Reprendre la **chute cumulée** : 2,96 % → ~3,01 %, marge de 2,04 → ~1,99 point contre la limite de 5 %. *Ce n'est pas une révision du dimensionnement — c'est un métré qui doit suivre le tracé, même quand l'écart est petit.* Vérifié par lecture
- [x] 2.3 Reprendre la ligne 59, qui énumère les longueurs « 5,70 / 5,90 / 8,15 / 8,35 m ». Vérifié par lecture
- [x] 2.4 Reprendre le même tableau dans `dossier/002-prises-de-courant/data-model.md` ligne 156, qui le duplique. Vérifié par `grep 8,15` qui ne doit plus rien rendre dans le dossier

## 3. L'implantation

- [x] 3.1 Reprendre la **section 4** de `dossier/002-prises-de-courant/implantation.md` — tableau des traversées, paroi et points desservis
- [x] 3.2 Reprendre le passage de la ligne 176, qui explique que FR-004 place le socle « dans l'angle du mur du fond et du mur droit » : l'angle est le même, la paroi change
- [x] 3.3 Écrire **pourquoi PC-03 a suivi** : la traversée sort du fond du boîtier intérieur, donc elle franchit la paroi sur laquelle ce boîtier est posé. Un boîtier sur le mur droit ne peut pas laisser sortir une traversée du mur du fond. *C'est la raison pour laquelle les deux points ne se déplacent pas séparément, et elle mérite d'être écrite plutôt que redécouverte.*

## 4. Les instructions de montage

- [x] 4.1 Reprendre l'instruction de l'étape **`pr-percage`**, qui situe les deux traversées « aux emplacements de PC-01 et PC-03 » : celle de PC-03 change de paroi. Conserver l'avertissement sur le percement horizontal et celui sur le béton. Vérifié par relecture
- [x] 4.2 Reprendre les instructions des étapes de **pose et d'appareillage** qui nomment la paroi de PC-03 ou de PC-04. Vérifié par `grep -n 'PC-0[34]' data/apports/002-prises-de-courant.json` relu à la main
- [x] 4.3 Vérifier que l'étape de perçage déclare toujours ses fixations et ses traversées après le déplacement. Vérifié par V23

## 5. Les tests

- [x] 5.1 Reprendre `tests/contiguite.test.js:168` — PC-03 à **8,45 m** au lieu de 8,15
- [x] 5.2 Reprendre `tests/conducteurs-trajet.test.js:150` et `tests/fournitures.test.js:88` — métré 2,5 mm² à **43,56 m** au lieu de 42,66
- [x] 5.3 Ajouter un test qui verrouille le **dos à dos** : PC-03 et PC-04 partagent la même paroi et le même axe, et TV-02 franchit cette paroi. *Sans lui, un futur déplacement de l'un des deux passerait inaperçu jusqu'au chantier.*
- [x] 5.4 Ajouter un test qui refuse un socle intérieur et son socle extérieur sur des **parois perpendiculaires**. *C'est le scénario que le delta de `installation/cheminements` ajoute, et il n'a d'existence que si un test le porte.*

## 6. Recette

- [x] 6.1 Régénérer `dossier/fournitures.md` par `npm run fournitures` et contrôler le diff : le métré 2,5 mm² et la longueur de conduit suivent
- [x] 6.2 `npm run build` puis contrôle visuel de `dist/garage.html` : PC-03 et PC-04 sont dos à dos à travers la paroi nord, la traversée se lit en biais, et aucun conduit ne chemine dehors *Constaté au navigateur par le maître d'ouvrage le 2026-09-23 : conforme.*
- [x] 6.3 Incrémenter `src/version.js`
