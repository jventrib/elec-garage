# Tasks

## 1. Rendre le glissé lisible depuis la vue

- [x] 1.1 Ajouter `estUnClic()` à l'API de `creerVue` (`src/scene/vue.js`), qui renvoie
      l'inverse de `aBouge` — le fait observé entre `pointerdown` et `pointerup`.
- [x] 1.2 Faire lire cette même fonction à la garde interne de `objetSous()`, pour qu'un
      seul seuil existe.
- [x] 1.3 Mesurer le glissé depuis l'**origine** du geste et non d'un `pointermove` au
      suivant : retenir `x0`/`y0` au `pointerdown`, nommer le seuil. *Seconde cause,
      trouvée à l'implémentation : une rotation lente n'émet que des pas de un ou deux
      pixels et ne franchissait jamais le seuil.*

## 2. Ne rien conclure d'un glissé

- [x] 2.1 Dans `src/main.js`, sortir du gestionnaire de `pointerup` **avant `rafraichir()`**
      quand le geste a glissé.
- [x] 2.2 Commenter la raison à l'endroit de la garde : un `pointerup` termine aussi bien une
      rotation qu'un clic, et seul le glissé les sépare.

## 3. Couvrir la distinction

- [x] 3.1 Test : une séquence `pointerdown` → `pointermove` au-delà du seuil → `pointerup`
      laisse `estUnClic()` faux, et une séquence sans mouvement le laisse vrai.
- [x] 3.2 Test : une rotation lente, en pas de deux pixels, est reconnue comme un glissé —
      c'est la régression que la mesure d'un pas au suivant laissait passer.
- [x] 3.3 Test : la cible de l'orbite et l'état de la fiche sont inchangés après un glissé qui
      se relâche sur le vide, alors qu'un objet est focalisé.
- [x] 3.4 Test : un clic franc sur le vide referme la fiche et ramène la cible au centre —
      la régression inverse est aussi facile à écrire que celle qu'on corrige.

## 4. Vérification

- [x] 4.1 `npm test` au vert.
- [x] 4.2 Incrémenter `src/version.js`.
- [x] 4.3 Contrôle visuel du maître d'ouvrage : orbiter autour d'un composant focalisé sans
      le perdre, puis le quitter d'un clic franc sur le vide.
