# Proposal

## Why

Le trajet des conducteurs d'un objet désigné posait, sur chaque appareil d'extrémité, une
pastille par circuit qui y aboutit. **Décision du maître d'ouvrage du 2026-09-25** : ces pastilles
ne sont pas nécessaires. Le tracé coloré et la teinte des appareils suffisent à lire le trajet.

## What Changes

- Les **pastilles** posées sur la maquette aux appareils d'extrémité sont retirées.
- Un appareil extrémité d'un seul circuit **garde la couleur** de ce circuit. Celui où en aboutissent
  plusieurs, le tableau typiquement, garde la teinte neutre, **souligné de son contour** ; la fiche
  nomme ses circuits.
- La ligne « Trajets » de la fiche garde ses repères de couleur : c'est la légende des tracés, non
  une pastille sur la maquette.

## Capabilities

### Modified Capabilities

- `maquette/visualisation` : « Trajet des conducteurs d'un objet désigné » est modifiée.

## Impact

- `src/scene/trajets.js`, `src/scene/composants.js` — plus de pastilles
- `data/presentation.json` — `trajets.rayonPastille` retiré
- `tests/trajets.test.js`
- `src/version.js`, `dist/garage.html`
