# Tasks

## 1. Spécification

- [x] 1.1 Réécrire la ligne de contexte de « Un objet sans étendue ne se cadre pas » : deux obstacles sans volume, le gabarit de manœuvre et le débattement des portières. Vérifié par `openspec validate correction-obstacles-sans-etendue`
- [x] 1.2 Rétablir dans `data/local.json` les deux obstacles véhicule, sans volume, retirés un temps : `installation/points-utilisation` et `installation/cheminements` imposent le contrôle qu'ils portent. Vérifié par `npm test` et par le bilan des contrôles — 55 non concluants sur 189, dont 54 pour ces deux obstacles
- [x] 1.3 Archiver le changement et vérifier que la ligne de contexte est appliquée à `openspec/specs/maquette/visualisation/spec.md`
