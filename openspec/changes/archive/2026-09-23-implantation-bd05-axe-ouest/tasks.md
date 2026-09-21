# Tasks

La géométrie a été vérifiée à vide **avant** d'être proposée : les vingt-trois règles ne rendent
aucun défaut.

`npm test` DOIT être vert à la fin de chaque tâche.

## 1. Les données

- [x] 1.1 Passer **BD-05** en (2,70 ; **2,60** ; 2,75) dans `data/apports/002-prises-de-courant.json` — sur l'axe ouest de BD-01. Vérifié par `validerTout` sans défaut sur les quatre apports fusionnés
- [x] 1.2 Passer **PC-05** en (**2,55** ; **2,60** ; 2,75), soit 0,15 m à l'ouest de BD-05. Vérifié de même
- [x] 1.3 Ramener **CH-07** à **un seul segment** : du plafond au droit de BD-03 (5,60 ; 2,60) droit vers l'ouest jusqu'à BD-05. *Le décrochement de 0,40 m disparaît, et avec lui un coude.* Vérifié par `longueurCheminement` à 2,90 m et par le décompte des coudes
- [x] 1.4 Reprendre **CH-08** : de BD-05 vers l'**ouest** jusqu'à PC-05, 0,15 m. Vérifié par V20 sans superposition
- [x] 1.5 Reprendre **CH-L2** dans `data/apports/003-eclairage.json` : elle part désormais de (2,70 ; 2,60) et non de (2,70 ; 3,00), soit 1,45 m au lieu de 1,05. Vérifié par la continuité du circuit d'éclairage sans orphelin
- [x] 1.6 Vérifier que les **trois branches de BD-05 divergent** — est, nord, ouest. *C'est la condition qui a décidé de la position de PC-05, et elle n'est tenue par aucune règle : V20 ne la voit que si deux conduits se superposent effectivement.* Vérifié par un test dédié

## 2. Le dégagement, qui se resserre

- [x] 2.1 ⚠️ Reprendre la marge de PC-05 au rail dans `dossier/002-prises-de-courant/implantation.md` : **0,155 m → 0,055 m**, le socle passant de 2,655–2,745 à 2,555–2,645 pour un rail qui s'arrête à y = 2,50. Écrire que la marge a été **divisée par trois** et contre quel obstacle — le rail porte un **volume relevé**, non un majorant
- [x] 2.2 ⚠️ Ajouter un test qui verrouille ce dégagement **à la main** : le boîtier de PC-05 ne recoupe ni le volume du rail ni le majorant du tablier. *Rien ne le contrôle aujourd'hui — `collision.js:80` n'oppose que les cheminements aux obstacles. Sans ce test, la marge peut devenir négative sans qu'aucune vérification ne bronche.*
- [x] 2.3 Écrire dans l'implantation **pourquoi PC-05 est à l'ouest** : les trois branches de BD-05 doivent diverger ; au nord la desserte se superpose à la montée de l'éclairage, au sud le boîtier mord dans le rail

## 3. Les documents de calcul

- [x] 3.1 Reprendre la longueur de **PC-05** : 6,75 m → **6,20 m**, dans `dossier/002-prises-de-courant/note-de-calcul.md` et `data-model.md`. *Le chemin le plus long ne bouge pas — c'est PC-04 à 8,65 m — donc la chute de tension est inchangée*
- [x] 3.2 Reprendre le **métré 2,5 mm²** : 43,56 m → **41,91 m**
- [x] 3.3 Reprendre les tableaux de cheminements : CH-07 à 2,90 m en un segment, CH-08 à 0,15 m, CH-L2 à 1,45 m, dans les implantations de `002` et de `003`
- [x] 3.4 Reprendre `dossier/003-eclairage/implantation.md`, qui décrit le **parcours commun** de BD-03 à BD-05 « avec un décrochement de 0,40 m ». Ce décrochement n'existe plus

## 4. Les instructions de montage

- [x] 4.1 Reprendre les instructions qui nomment le **décrochement de 0,40 m** ou la position de BD-05. Vérifié par `grep -n 'décrochement' data/apports/*.json` relu à la main
- [x] 4.2 Écrire dans l'instruction de pose que **PC-05 est desservi vers l'ouest** et non vers le sud, et pourquoi : au sud le boîtier mordrait dans le rail

## 5. Les tests

- [x] 5.1 Reprendre la longueur de PC-05 et le métré 2,5 mm² dans `tests/contiguite.test.js`, `tests/conducteurs-trajet.test.js` et `tests/fournitures.test.js`
- [x] 5.2 Reprendre le décompte des coudes : **9 → 8**, CH-07 n'en portant plus aucun
- [x] 5.3 Ajouter le test de divergence des trois branches de BD-05 (voir 1.6)

## 6. Recette

- [x] 6.1 Régénérer `dossier/fournitures.md` par `npm run fournitures` et contrôler le diff
- [x] 6.2 `npm run build` puis contrôle visuel de `dist/garage.html` : CH-07 file droit de BD-03 à BD-05 sans décrochement, et PC-05 est à l'ouest de la boîte *Constaté au navigateur par le maître d'ouvrage le 2026-09-23 : conforme.*
- [x] 6.3 Incrémenter `src/version.js`
