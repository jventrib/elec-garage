# Tasks

## 1. Dérivation (design D1, D4, D5)

- [x] 1.1 `conducteursDuCircuit` rend les appareils d'extrémité de chaque conducteur — départ et destinations
- [x] 1.2 `src/geometrie/trajets.js` : `trajetsDe(modele, graphe, cible)` — conducteurs concernés par un cheminement, un appareil ou une traversée, union de leurs arbres en segments, appareils d'extrémité, circuit non dérivable signalé
- [x] 1.3 Tests dans `tests/trajets.test.js` : un conduit partagé donne deux trajets ; le trajet va jusqu'aux extrémités ; une boîte donne les conducteurs qui y passent ; la ligne de la borne ne donne que BR-01 et le tableau ; un circuit non dérivable n'est pas tracé

## 2. Scène (design D2, D3)

- [x] 2.1 `data/presentation.json` : diamètre des tracés, écart entre tracés, rayon des pastilles
- [x] 2.2 `src/scene/trajets.js` : tracés côte à côte, dessinés par-dessus les conduits, et pastilles empilées hors des appareils
- [x] 2.3 `src/scene/composants.js` : teinte des appareils d'extrémité d'un seul circuit, les autres au neutre

## 3. Fiche et branchement

- [x] 3.1 Ligne « Trajets » dans la fiche : circuit par circuit, les appareils joints, ou « trajet inconnu »
- [x] 3.2 `src/main.js` : au clic, les trajets de l'objet désigné remplacent la mise en évidence du circuit entier ; un clic dans le vide les efface

## 4. Livrable

- [x] 4.1 `openspec validate trajets-des-conducteurs`, `npm test`, `npm run build`, `src/version.js`
- [x] 4.2 Contrôler dans un navigateur : GL-02, CH-05, BD-04, TV-L2 — *confirmé par le maître d'ouvrage le 2026-09-25*

## 5. Fils d'ordre en teinte foncée (design D6)

- [x] 5.1 `trajetsDe` marque `ordre` les segments où passe un fil d'ordre du circuit, concerné ou non par l'objet désigné
- [x] 5.2 `assombrir` et `trajets.assombrissementOrdre` ; la fiche dit « foncé : fil d'ordre » avec sa pastille
- [x] 5.3 Test : CH-A1 porte les ordres des deux circuits, chacun dans sa teinte foncée ; la borne n'en a aucun

