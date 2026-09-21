# Proposal

## Why

La phase `percage` — « Implantation et perçage » — existe et porte trois étapes, une par
circuit. Leur prose est bonne : elle nomme les pièges, dont le plus vicieux, « deux boîtiers
dos à dos invitent à percer horizontalement, et un percement horizontal annule la pente
exigée ».

Mais ces trois étapes déclarent `composants: []` et `cheminements: []`. **Elles n'illustrent
rien.** Le lecteur d'étapes montre, pour la seule opération irréversible du chantier, une vue
vide accompagnée d'un paragraphe. Le Principe VI veut que chaque étape porte « son instruction
écrite **et son illustration dans la vue 3D** » : sur le perçage, la seconde moitié manque.

**Et le contenu qui compte n'est pas modélisé.** Une traversée de paroi déclare
`penteVersExterieur: true` — un booléen. V18 le contrôle comme tel. Or on ne perce pas un
booléen : il faut un point d'entrée, un point de sortie et un dénivelé. Le dénivelé existe
dans la prose — « la hauteur d'un boîtier offre 5 à 6 cm de jeu sur les 0,20 m de paroi » —
et nulle part dans les données. La maquette ne peut donc **pas montrer l'erreur qu'elle met en
garde de commettre**.

C'est le seul endroit du projet où une faute se paie comptant : un trou mal placé dans du
béton ne se rebouche pas, il se contourne.

## What Changes

**Le guide est sélectif, et c'est sa thèse.** Les trous ne sont pas de même nature, et deux
des trois n'ont pas à être cotés :

| Registre | Nombre | Ce qu'il faut | Pourquoi |
|---|---|---|---|
| **Traversées** | 5 | cote exacte, dénivelé, diamètre | **aucun gabarit n'existe** — on perce du béton nu, en biais, rien ne guide la mèche |
| **Objets** | 22 | la position de l'objet | on présente la boîte au mur et on marque **au travers de ses propres trous** : le gabarit, c'est l'objet |
| **Colliers** | 40 à 64 | une répartition | on tire le cordeau et on répartit ; personne ne mesure le 37e collier |

Un guide exhaustif de ~100 trous serait donc à la fois plus long et moins utile qu'un guide de
**cinq cotes** et d'un plan de traçage.

- Les étapes de la phase `percage` DÉCLARENT ce qu'elles font percer, et le lecteur l'illustre.
- Une **traversée porte sa géométrie de perçage** — entrée, sortie, dénivelé — et non plus un
  booléen. La vue rend la pente visible, de sorte que le percement horizontal se voie comme
  une faute plutôt que se lise comme un avertissement.
- Les **colliers sont dérivés** d'un entraxe, avec leurs règles de répartition : jamais sur un
  coude, jamais sur une boîte, un près de chaque extrémité de segment.
- **Aucun marquage d'exécution.** Pas de case à cocher, pas d'état d'avancement : le guide est
  une référence, pas un registre. L'exigence de `maquette/visualisation` qui l'interdit reste
  entière et n'est pas amendée. *Décision du maître d'ouvrage.*

## Capabilities

### New Capabilities

Aucune. Le guide enrichit une phase qui existe et des capacités qui la portent déjà.

### Modified Capabilities

- `maquette/visualisation` : l'étape de perçage doit illustrer ce qu'elle fait percer ; une
  traversée doit se lire à son dénivelé et non comme un point ; les gardes serrées doivent être
  visibles.
- `installation/cheminements` : une traversée déclare sa géométrie de perçage et non une
  intention ; l'entraxe des colliers et la cheville sont des données produit, paramètres du
  guide et non cotes de projet ; les règles de répartition des colliers sont écrites.

## Impact

**Deux paramètres produit, et le guide est incomplet sans eux** — tous deux du même genre que
ceux déjà en attente à `reserves-maitre-ouvrage` :

- l'**entraxe des colliers**, qui commande leur nombre et leur répartition ;
- la **cheville retenue**, qui commande diamètre et profondeur de perçage.

Aucun des deux n'est une cote de projet, et aucun NE DOIT être présumé. Tant qu'ils ne sont
pas renseignés, le guide donne les positions et tait les diamètres.

- `data/apports/*.json` — géométrie de perçage des cinq traversées ; étapes `percage` enrichies
- `src/donnees/validation.js` — V18 cesse de contrôler un booléen
- `src/scene/` — rendu de la pente et des points de perçage
- `dossier/00N-*/implantation.md` — les cotes de perçage y ont leur place

**Hors périmètre.** Ce qui se trouve **derrière** un point de perçage. Un trou pénètre la paroi
de 5 à 8 cm, et rien dans le modèle ne dit s'il y rencontre une gaine, une canalisation ou un
fer. Le contrôle de collision oppose les cheminements aux obstacles visibles ; il ne sait rien
de l'intérieur du béton. Le guide ne lèvera pas ce risque — au mieux il le nommera.
