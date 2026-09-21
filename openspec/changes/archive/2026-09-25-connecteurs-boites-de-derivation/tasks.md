# Tasks

## 1. Topologie des conducteurs (design D1)

- [x] 1.1 Faire rendre à `cheminEntre` (`src/geometrie/graphe.js`) la suite des pas `{ de, vers, arete }` en plus de `cheminements` et `longueur`, inchangés. Vérifier par `npm test` que toutes les longueurs et tous les décomptes sont identiques
- [x] 1.2 Faire porter à chaque conducteur de `conducteursDuCircuit` son **arbre** — l'union des arêtes de ses chemins — et les nœuds de ses extrémités. Test : sur les quatre apports fusionnés, l'union de chaque conducteur est un arbre

## 2. Catalogue des connecteurs (design D3)

- [x] 2.1 Déclarer `connecteurs` dans `data/chantier.json` — gamme, source, références 221-412, 221-413, 221-415 avec entrées et plage de section, valeurs de la fiche WAGO
- [x] 2.2 Valider le catalogue dans `src/donnees/validation.js` : source présente, entrées entières ≥ 2, plage ordonnée, références uniques. Test : chaque défaut est levé sur un catalogue altéré

## 3. Dérivation (design D2, D3, D5)

- [x] 3.1 Écrire `src/geometrie/connecteurs.js` : ensembles de nœuds des enveloppes de jonction — boîte à volume, boîte ponctuelle et son `boitier`, organe de connexion et sa goulotte —, puis le nombre de brins k par conducteur et par enveloppe
- [x] 3.2 Choisir la référence, ou la combinaison au-delà de la plus grande, et rendre « inconnu » hors catalogue ou pour un circuit non dérivable
- [x] 3.3 Tests dans `tests/connecteurs.test.js` : un conducteur qui traverse ne compte rien ; la ligne de la borne ne reçoit aucun connecteur ; la séparation de la phase vers MC-01 est comptée dans OC-01 ; aucune séparation hors enveloppe de jonction ; quatre brins font un 221-415, six une combinaison 221-415 + 221-413 ; une section hors plage rend « inconnu »

## 4. Fiche (design D4)

- [x] 4.1 Ajouter à `caracteristiques` (`src/ui/fiche-composant.js`) les lignes « Connecteurs », « dont » et « Sans connexion » pour une enveloppe de jonction, et dériver les connecteurs une fois au chargement dans `src/main.js`. Test : la fiche de BD-01 nomme la borne sans connexion, et une valeur inconnue porte la classe `inconnu`

## 5. Instructions et livrable

- [x] 5.1 Nommer la gamme dans les instructions de connexion de `002`, `003` et `005` — « bornes à levier WAGO 221, référence et nombre sur la fiche de chaque boîte » — à la place de « la borne automatique ». Vérifier par `grep` qu'il ne reste aucune « borne automatique »
- [x] 5.2 `npm run build` : `src/version.js` incrémenté, et le catalogue présent dans `dist/garage.html`. Contrôler dans un navigateur la fiche de BD-01, de BD-04 et de OC-01 — *confirmé par le maître d'ouvrage le 2026-09-25*
