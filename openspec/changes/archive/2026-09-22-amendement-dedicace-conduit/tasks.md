# Tasks

## 1. Amender la constitution

- [x] 1.1 ⚠️ **Acte du maître d'ouvrage.** Amender le Principe IV de `openspec/constitution.md` : la dédicace reste entière sur le circuit, cesse de s'étendre au contenant, et admet le câble à enveloppe propre en goulotte. Reprendre les trois conséquences que le principe tirait de la dédicace du conduit. Vérifié par la relecture du principe amendé
- [x] 1.2 Écrire le **rapport d'impact** en tête du fichier, au format des amendements précédents, avec la montée de version. *Corrigé après lecture de la politique de versionnement : le changement est **MINEUR**, non MAJEUR. MAJEUR exige la suppression d'un principe ou une redéfinition rendant non conforme un choix antérieurement validé — le principe reste, et un conduit dédié reste conforme.* Vérifié par la lecture de l'en-tête
- [x] 1.3 Consigner dans le rapport que la règle retirée **n'était rattachée à aucune clause**, et que le tracé arrêté la contredisait déjà sur 0,04 m. Vérifié par la présence du constat dans l'en-tête

## 2. Reporter les valeurs normatives

- [x] 2.1 Ajouter à la tâche 1 de `reserves-maitre-ouvrage` la **clause** qui fonderait — ou non — une exigence de contenant dédié pour un point de charge. Vérifié par la présence de la ligne dans `openspec/changes/reserves-maitre-ouvrage/tasks.md`
- [x] 2.2 Y ajouter la **catégorie de pose d'un câble en goulotte**, qui décide de son courant admissible. Vérifié de même

## 3. Le tracé

- [x] 3.1 Supprimer `CH-B1` de `data/apports/004-borne-recharge.json` — 1,10 m d'IRL 25 parallèle à la goulotte — et faire porter `c-borne` à `GL-01` du bas du profilé jusqu'à z = 2,64, où `CH-B2` reprend. Vérifié par l'absence de défaut V20 sur les quatre apports fusionnés
- [x] 3.2 Retirer `CH-B1` des étapes de montage qui le posent, et reprendre leur instruction : le câble de la borne entre désormais dans la goulotte et n'a plus de conduit propre sur cette hauteur. Vérifié par la relecture des instructions
- [x] 3.3 Reprendre les assertions qui énoncent que la borne est seule dans son conduit — `tests/apport-004.test.js`, `apport-002.test.js`, `apport-003.test.js` —, en distinguant les portions en conduit, où l'exigence tient, des portions en goulotte, où elle ne tient plus. Vérifié par `npm test`
- [x] 3.4 Écrire le **facteur de groupement** applicable à la portion de cohabitation dans `specs/004-borne-recharge/contracts/note-de-calcul.md`, valeur laissée à confirmer. Vérifié par la présence de la ligne, marquée « à confirmer »
