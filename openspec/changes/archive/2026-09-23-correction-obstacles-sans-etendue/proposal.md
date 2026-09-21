# Proposal

## Why

L'exigence « Un objet sans étendue ne se cadre pas » de la capacité
[`maquette/visualisation`](../../specs/maquette/visualisation/spec.md) énonce dans sa ligne de
contexte : « Quatre des sept obstacles du projet ne portent aucun volume : débattement du
vantail, tablier fermé, gabarit de manœuvre, débattement des portières. »

**C'est faux depuis les relevés du maître d'ouvrage du 2026-09-23.** Le vantail de la porte de
service ouvre vers l'extérieur, et son débattement porte un majorant hors du local ; la saillie
du tablier fermé est relevée, et son volume est borné. Seuls le gabarit de manœuvre du véhicule
et le débattement des portières restent sans volume ni majorant.

Une spécification qui décrit un état périmé du relevé induit en erreur celui qui la lit pour
savoir ce qui reste à mesurer.

## What Changes

- La ligne de contexte de l'exigence est réécrite : **deux** des sept obstacles ne portent
  aucun volume, le gabarit de manœuvre du véhicule et le débattement des portières.
- Le texte normatif et les scénarios sont **inchangés** : un objet sans étendue ne se cadre
  pas, un obstacle borné se cadre sur son majorant.

## Capabilities

### New Capabilities

Aucune.

### Modified Capabilities

- `maquette/visualisation` : ligne de contexte de « Un objet sans étendue ne se cadre pas ».

## Impact

- `openspec/specs/maquette/visualisation/spec.md` — une ligne de contexte.
- Aucun code, aucune donnée : le comportement ne change pas. Les deux obstacles véhicule,
  retirés un temps des données, y sont rétablis sans volume, deux exigences d'installation
  imposant le contrôle qu'ils portent — `installation/points-utilisation` pour les socles,
  `installation/cheminements` pour les tracés.
