# Design

## Context

Voir `proposal.md` — Why. Ce qui suit ne retient que l'état du code qui contraint l'approche.

**Une seule caméra, un seul modèle.** `src/scene/vue.js:48` tient un objet `orbite` — `theta`,
`phi`, `rayon`, `cible` — et `appliquer()` en dérive la position par trigonométrie sphérique
avant un `lookAt(cible)`. La cible est posée une fois au centre du local et ne bouge jamais.

**Le glisser est capté par `pointerdown`/`pointermove`** sur le canvas, avec un seul jeu de
gestes pour souris, doigt et stylet, et un pincement à deux doigts pour le zoom. Un booléen
`aBouge` distingue un glisser d'un clic, parce que le clic sert la sélection.

**Les vues prédéfinies viennent des données** — `presentation.vues` porte `theta`, `phi`,
`rayon` pour chacune, et `allerAVue()` les applique. Aucun angle n'est écrit dans le code.

**Le clavier est déjà occupé.** `src/ui/controles.js:43` écoute `keydown` au niveau global :
`←` `→` `PageUp` `PageDown` `Home` `End` naviguent dans la séquence, et un garde ignore les
frappes venant d'un champ de saisie.

**`camera.up` est fixé à `(0,0,1)`** à chaque application, le repère de la constitution ayant z
vers le haut. Un mode FPS doit le tenir aussi, sans quoi le roulis dérive.

## Goals / Non-Goals

**Goals:**

- Pouvoir se tenir quelque part et regarder ailleurs — ce que l'orbite ne permet pas.
- Que le mode orbite soit **inchangé**, pas généralisé : c'est lui qui va au chantier.
- Que les touches marchent sur un clavier français sans réglage.

**Non-Goals:**

- **Un équivalent tactile du déplacement libre.** Décidé : clavier seul, exception déclarée.
- **La collision.** Le vol traverse les parois, et c'est l'objet du mode.
- **Mémoriser le point de vue d'une session à l'autre.** Le lecteur mémorise un rang d'étape ;
  rien ici ne l'étend.
- **Un mode marche au sol**, avec gravité et hauteur d'œil. Ce serait un troisième mode.

## Decisions

### D1 — Deux modes côte à côte, et non un modèle généralisé

**Retenu :** `vue.js` tient deux états de caméra et bascule de l'un à l'autre. Le code de
l'orbite n'est pas touché.

*Pourquoi.* Un modèle unique — position plus cible, l'orbite n'étant qu'une cible contrainte —
serait plus élégant et plus risqué : il réécrirait le seul mode qui va sur le chantier, pour
servir un mode de préparation. Le rapport bénéfice/risque n'y est pas.

*Alternative écartée — remplacer l'orbite par un FPS et simuler l'orbite par-dessus.* C'est
l'inverse du besoin : l'orbite est le mode par défaut et le plus utilisé.

### D2 — `event.code`, jamais `event.key`

**Retenu :** les touches se lisent sur leur position physique.

```
   event.key           event.code        clavier FR     clavier US
   ---------           ----------        ----------     ----------
   'z'                 'KeyW'            Z (avancer)    W (avancer)
   'q'                 'KeyA'            Q (gauche)     A (gauche)
```

*Pourquoi.* `event.key` rend le caractère produit : sur AZERTY, presser la touche en haut à
gauche du bloc rend `'a'`, et WASD y serait injouable. `event.code` rend la position, qui est la
même sur les deux dispositions. **Aucune détection de disposition, aucun réglage**, et c'est ce
qui fait qu'on n'a pas à demander à l'utilisateur quel clavier il a.

### D3 — Vol libre, sans collision ni gravité

**Retenu :** la caméra traverse tout.

*Pourquoi.* « Se déplacer autour de la maquette » suppose d'en sortir. Un mode qui buterait sur
les parois n'atteindrait ni les façades extérieures, ni le plafond par au-dessus, et
retomberait dans la limitation qu'il vient lever.

*Ce que ça laisse de côté.* On ne simule pas ce que voit l'installateur debout. Ce serait un
mode marche, avec hauteur d'œil et gravité — utile peut-être, mais c'est un autre besoin.

### D4 — Le pitch est borné, le yaw ne l'est pas

**Retenu :** l'inclinaison s'arrête un peu avant la verticale, dans les deux sens ; la rotation
horizontale tourne sans fin.

*Pourquoi.* C'est déjà ce que fait l'orbite — `phi` est bridé entre 0,05 et `π − 0,05`. Sans
borne, on bascule par le zénith et la vue se retrouve tête en bas, avec un `up` qui ne veut plus
rien dire.

### D5 — Ce qui se transmet d'un mode à l'autre

**Retenu :** en passant à FPS, la caméra **conserve sa position et sa direction du moment** ; en
revenant à l'orbite, elle reprend l'orbite **là où elle l'avait laissé**.

*Pourquoi.* Un basculement qui téléporterait désorienterait à chaque aller-retour. Conserver la
pose au passage vers FPS rend la bascule continue ; reprendre l'orbite antérieure évite d'avoir
à inventer une cible depuis une position quelconque — un choix arbitraire qui se verrait.

*Conséquence assumée :* l'aller-retour orbite → FPS → orbite ne restitue pas la pose FPS. C'est
voulu ; l'orbite est le mode de référence.

### D6 — Les vues prédéfinies restent des vues d'orbite

**Retenu :** choisir une vue prédéfinie **ramène au mode orbite**.

*Pourquoi.* Les six vues sont définies par `theta`/`phi`/`rayon` dans les données. Leur donner
un équivalent FPS demanderait de leur ajouter une position et une direction, donc de doubler un
catalogue que personne n'a demandé à doubler. Une vue est un point de vue **sur** la maquette :
c'est de l'orbite par nature.

### D7 — Vitesses et bornes dans les données

**Retenu :** `presentation.camera` reçoit la vitesse de déplacement, la vitesse de rotation et
les bornes du vol.

*Pourquoi.* Le socle interdit déjà qu'une cote ou un réglage vive dans le code, et
`presentation.json` porte déjà `rayonMin`, `rayonMax`, `champ`, `proche`, `lointain`. Une
vitesse de déplacement est de la même famille : elle se règle à l'usage, et elle se règle mal
dans un fichier source.

## Risks / Trade-offs

**Le mode FPS sort du contrat tactile** → c'est l'exception que le delta déclare. Le risque
n'est pas qu'elle existe mais qu'elle **s'étende** : la prochaine fonction sera tentée de s'en
réclamer. L'exigence modifiée dit explicitement qu'elle ne s'étend pas, et que le mode orbite
reste intégralement utilisable sans clavier.

**Le vol libre désoriente** → sans collision ni gravité, on se perd, surtout hors du local. Les
bornes de vol de D7 l'atténuent sans le supprimer. Le retour au mode orbite, qui reprend une
pose connue, est la porte de sortie.

**Deux modes, deux chemins pour le même geste** → le glisser oriente le regard en FPS et orbite
en mode orbite. C'est le même geste avec deux effets, ce que la maquette évite partout ailleurs.
L'atténuation est que le mode courant DOIT être visible en permanence, sans quoi l'utilisateur
ne sait pas ce que son geste va produire.

**`keydown` global** → `controles.js` écoute déjà au niveau du document. Ajouter un second
écouteur global crée deux endroits où une frappe est interprétée. Les deux jeux de touches sont
disjoints par construction, et le delta l'exige — mais rien ne l'empêchera si quelqu'un ajoute
une touche sans regarder l'autre fichier. Un test doit tenir cette disjonction.

## Open Questions

- **L'affordance de bascule** — un bouton, une touche, ou les deux. Question d'interface, qui ne
  change ni les specs ni le découpage : le delta exige de pouvoir basculer à tout moment et que
  le mode courant soit visible, pas la forme du contrôle.
- **Les valeurs de vitesse et les bornes de vol.** Elles se règlent à l'usage, et le modèle les
  porte comme données dès le départ. Aucune décision n'est requise avant de construire.
