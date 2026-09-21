# Design

## Context

Voir `proposal.md` — Why. Ce qui suit ne retient que l'état du code qui contraint l'approche.

**La cible d'orbite est posée une fois.** `vue.js:48` construit `orbite = { theta, phi, rayon,
cible: centre.clone() }`, et `appliquer()` en dérive la position par trigonométrie sphérique
avant `lookAt(cible)`. `cible` n'est réaffectée nulle part.

**La sélection passe par `pointerup`** sur le canvas — `main.js:194` — et trie l'objet touché
en quatre familles : composant, cheminement, traversée, obstacle. Un booléen `aBouge` distingue
déjà un glisser d'un clic, pour ne pas ouvrir une fiche en tournant la vue.

**La fiche se ferme sans prévenir.** `fiche-composant.js:288` branche le bouton « Fermer » sur
`this.vider()`, qui vide l'élément. Personne n'est notifié : il n'y a aucun crochet où accrocher
le retour au centre.

**La boucle porte le temps écoulé.** `aChaqueImage(secondes)` a été ajouté par `mode-fps` pour
intégrer le déplacement au clavier. Une interpolation de caméra y tient sans rien inventer.

**Les bornes d'orbite existent** : `presentation.camera.rayonMin` vaut 0,80 et `rayonMax` 40.

## Goals / Non-Goals

**Goals:**

- Qu'un objet désigné se regarde sans avoir à le retrouver à la main.
- Que le point de vue soit **dérivé** des données de l'objet, jamais écrit dans le code.
- Qu'une absence de cote reste une absence : un objet sans étendue ne se cadre pas.

**Non-Goals:**

- **Le mode déplacement libre**, qui ignore la sélection. *Décidé.*
- **Mémoriser l'objet focalisé** d'une session à l'autre.
- **Cadrer un cheminement dans sa totalité à l'écran.** On l'orbite depuis le milieu de son
  étendue ; garantir qu'il tienne entier dans le cadre demanderait de tenir compte du champ et
  du rapport d'aspect, et c'est un autre problème.

## Decisions

### D1 — La cible devient mobile, l'orbite reste l'orbite

**Retenu :** `orbite.cible` est réaffectable, et rien d'autre ne change dans le modèle.

*Pourquoi.* Tout le reste — `theta`, `phi`, `rayon`, le glisser, le pincement, le zoom — continue
de fonctionner autour de la nouvelle cible sans une ligne de plus. C'est la plus petite
modification qui produise l'effet demandé.

### D2 — Le point de vue se dérive de la paroi et de la face

**Retenu :** la caméra se place sur la **normale sortante de la face** de l'objet.

```
   paroi     normale sortante du local
   -------   -------------------------
   est       +x        ouest  -x
   nord      +y        sud    -y
   plafond   +z

   face interieur  ->  camera du cote INTERIEUR  (oppose a la normale)
   face exterieur  ->  camera du cote EXTERIEUR  (le long de la normale)
```

*Pourquoi.* L'objet porte déjà `paroi` et `face` — c'est ce qui rend un composant extérieur
lisible comme extérieur dans le rendu. La même donnée dit d'où on le regarde. Rien à ajouter aux
apports, rien à choisir.

*Le cas qui le justifie :* regarder une façade extérieure depuis l'intérieur ne montrerait que
la paroi. L'erreur serait invisible dans le code et évidente à l'écran.

*Alternative écartée — garder l'orientation courante et se contenter de rapprocher.* Plus simple,
et manque la moitié de la demande : « un changement de perspective pour le visualiser de manière
optimale ».

### D3 — La distance se dérive de l'encombrement

**Retenu :** `distance = etendue x marge`, bornée par `rayonMin` et `rayonMax`.

| Objet | Étendue retenue |
|---|---|
| composant | la plus grande cote de son gabarit, ou de son volume s'il en déclare un |
| obstacle | la plus grande cote de son volume — ou de son majorant |
| traversée | l'épaisseur de paroi qu'elle franchit |
| cheminement | la plus grande cote de la boîte englobant son parcours |

*Pourquoi.* Un socle de 0,09 m et le tableau de 0,36 m ne se regardent pas de la même distance,
et une constante unique serait fausse pour l'un des deux. La marge est une donnée, parce que
c'est un réglage de confort qui se juge à l'œil.

### D4 — Un objet sans étendue ne bouge pas la caméra

**Retenu :** pas d'étendue déclarée, pas de cadrage. La fiche s'ouvre, la vue reste.

*Pourquoi.* Quatre obstacles sur sept sont dans ce cas. Leur inventer une étendue pour les cadrer
ferait passer une absence de cote pour une cote — exactement ce que le Principe VI proscrit
quand il interdit de substituer une valeur plausible à une valeur inconnue.

*Le majorant, lui, cadre.* Il est une conséquence de cotes relevées, et non une invention. La
fiche continue de le déclarer comme majorant : le cadrage ne change pas la nature de ce qui est
affiché, il ne fait que regarder au bon endroit.

### D5 — L'interpolation porte sur cible, angles et rayon ensemble

**Retenu :** un seul état de transition, interpolé à chaque image, avec un lissage aux extrémités.

*Pourquoi.* Déplacer la cible d'abord puis tourner donnerait deux mouvements successifs et une
impression de saccade. Les mener ensemble donne un seul geste.

*Le lacet se rattrape par le plus court chemin.* Sans cela, passer de +170° à −170° ferait un tour
complet pour 20° de différence.

### D6 — Une transition en cours cède, elle ne se termine pas

**Retenu :** toute nouvelle cible remplace la transition en cours, depuis l'état atteint.

*Pourquoi.* Le critère de fluidité exige qu'on tourne la vue et change d'étape sans attente
perceptible. Une transition qui s'achèverait avant d'accepter la suivante rendrait l'interface
molle, et deux clics rapprochés produiraient une file d'attente que personne n'a demandée.

*Conséquence :* un glisser pendant une transition l'interrompt et rend la main. C'est voulu — la
main de l'utilisateur prime sur une animation.

### D7 — La fiche doit prévenir qu'elle se ferme

**Retenu :** `creerFiche` accepte un crochet appelé par `vider()`.

*Pourquoi.* C'est le seul endroit où « l'utilisateur a refermé » est connu. Détecter la fermeture
depuis `main.js` en observant l'attribut `hidden` marcherait et serait fragile : un futur appel
à `vider()` ailleurs deviendrait un retour au centre silencieux et inexpliqué.

## Risks / Trade-offs

**Deux changements ouverts sur la même caméra** → `mode-fps` est à 24/25 et touche `vue.js`.
Celui-ci s'appuie sur `aChaqueImage`, qu'il a introduit. **Il faut archiver `mode-fps` d'abord**,
sans quoi deux jeux de deltas se disputent le même fichier et la même capacité.

**Le focus peut cadrer un objet absent de l'étape courante** → la sélection ne porte que sur les
meshes visibles, donc le cas ne se produit pas aujourd'hui. Mais rien ne l'empêche si la
sélection s'élargit un jour, et la caméra irait alors regarder un objet non rendu. Un test doit
tenir que la cible de focus est un objet visible.

**Le retour au centre efface un cadrage que l'utilisateur voulait garder** → refermer la fiche
pour libérer l'écran ramène la vue, même si on voulait rester là. L'atténuation est que le zoom
et la rotation manuels restent disponibles pendant le focus ; le risque est accepté, la demande
étant explicite sur ce point.

**Le cheminement est orbité, pas cadré** → on tourne autour du milieu de son parcours à une
distance dérivée de son étendue, sans garantir qu'il tienne entier dans le cadre. Un conduit de
5 m vu de près en débordera. C'est assumé : garantir le cadrage demanderait de tenir compte du
champ de vision et du rapport d'aspect, qui varie avec la fenêtre.

## Open Questions

- **La durée et la forme du lissage.** Elles se règlent à l'œil, et le modèle les porte comme
  données dès le départ. Aucune décision n'est requise avant de construire.
- **La marge de cadrage.** Même traitement.
