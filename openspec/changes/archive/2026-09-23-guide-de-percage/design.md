# Design

## Context

Voir `proposal.md` — Why. Ce qui suit ne retient que l'état du code qui contraint l'approche.

**La machinerie existe et elle est vide.** Une étape déclare `composants`, `cheminements`,
`traversees`, `materiel`, `dependances`. `src/ui/panneau-etape.js:91` appelle déjà les
traversées des « **percements** » — le vocabulaire est en place. Les trois étapes de la phase
`percage` déclarent leurs traversées et rien d'autre : ni composant, ni cheminement.

**La pente est un booléen.** Une traversée porte `penteVersExterieur: true`, et `V18` teste
`t.penteVersExterieur !== true`. Le dénivelé — « 5 à 6 cm de jeu sur les 0,20 m de paroi » —
vit dans la prose d'une instruction de montage, pas dans les données.

**Les `vues` sont des caméras**, pas des filtres : `data/presentation.json` déclare des
préréglages d'angle. Il n'existe aucun mécanisme de vue filtrée, et il n'en faut pas — le
lecteur d'étapes isole déjà.

**Aucun point de fixation n'existe**, ni comme donnée ni comme concept. Le modèle sait où va
un objet, pas où vont ses vis.

## Goals / Non-Goals

**Goals:**

- Que l'opération irréversible du chantier soit illustrée comme les autres.
- Que la faute contre laquelle la prose met en garde — le percement horizontal — se **voie**
  au lieu de se lire.
- Que ce qui relève du produit reste du produit, et que ce qui en dépend se taise tant qu'il
  n'est pas renseigné.

**Non-Goals:**

- **Coter les vis d'un objet.** Sur le chantier on présente la boîte et on marque au travers.
  Coter ses trous donnerait une précision que personne ne reporte, et qui dépend d'un produit
  non choisi.
- **Marquer l'exécution.** Décidé : le guide ne coche rien. L'exigence de `maquette/visualisation`
  qui l'interdit n'est pas amendée.
- **Arrêter l'entraxe ou la cheville.** Ce sont des données produit, et ce changement les
  déclare sans les trancher.
- **Dire ce qu'il y a dans le béton.** Voir Risks.

## Decisions

### D1 — Le guide est sélectif, pas exhaustif

**Retenu :** trois registres, une seule exigence de cote.

```
  TRAVERSEE        5     cote juste OBLIGATOIRE
                         aucun gabarit : beton nu, en biais, rien ne guide

  FIXATION D'OBJET 22    position de l'OBJET seulement
                         gabarit = l'objet lui-meme, marque au travers

  FIXATION COLLIER 40-64 une repartition, un entraxe
                         gabarit = le cordeau
```

*Pourquoi.* La valeur d'une cote est inverse de la disponibilité d'un gabarit. Là où un gabarit
existe, coter est du bruit ; là où il n'en existe aucun, coter est tout. Les cinq traversées
sont le seul cas sans gabarit.

*Alternative écartée — un guide exhaustif des ~100 trous.* Plus long à produire, plus long à
lire, et il noierait les cinq cotes qui comptent dans quatre-vingt-quinze qui ne comptent pas.

### D2 — La pente devient une géométrie, pas un sens

**Retenu :** une traversée porte entrée, sortie et dénivelé.

```
                interieur                exterieur
                   |                        |
   entree  o-------|                        |
            \      |  0,20 m de beton       |
             \     |                        |
              \    |                        |
               ----|----------------> o  sortie
                   |                        |
                   |<-- denivele : 5 a 6 cm de jeu qu'offre
                                      la hauteur d'un boitier
```

*Pourquoi.* `V18` contrôle aujourd'hui un booléen. Un booléen se vérifie **après** le perçage,
à l'eau ; une cote se perce. Et deux personnes lisant « pente vers l'extérieur » tireront deux
angles, dont l'un peut être nul.

*Le dénivelé n'est pas libre* : il est borné en haut par la réserve d'altitude du boîtier qui
reçoit la traversée, et en bas par le niveau fini du sol extérieur. Ces deux bornes existent
déjà dans les exigences ; elles n'étaient reliées à aucune cote.

*Alternative écartée — un angle.* Un angle se mesure mal au perforateur. Un dénivelé se trace :
on marque l'entrée, on marque la sortie, on vise.

### D3 — Le dénivelé inconnu ne se dessine pas horizontal

**Retenu :** une traversée non cotée est signalée comme telle et figurée autrement.

*Pourquoi.* Le repli naturel — dessiner à plat faute de mieux — figurerait **exactement la
faute** que l'exigence écarte. C'est la même discipline que celle des cotes inconnues : ne pas
substituer une valeur plausible, et ici la valeur plausible est la pire de toutes.

### D4 — Les colliers sont dérivés, jamais déclarés

**Retenu :** une répartition calculée depuis l'entraxe, avec ses règles d'exclusion.

*Pourquoi.* Déclarer 40 à 64 points de fixation les rendrait faux à la première révision de
tracé, et personne ne reporte le trente-septième au cordeau. La dérivation suit le tracé
automatiquement.

*Règles d'exclusion*, qui ne vivaient nulle part : un collier près de chaque extrémité de
segment ; aucun sur un coude — un accessoire y prend la place et serrer dessus déforme ;
aucun au droit d'une enveloppe ou d'une traversée.

### D5 — Deux paramètres produit, et le silence quand ils manquent

**Retenu :** `entraxe` et `cheville` sont déclarés, non arrêtés.

| Paramètre | Commande | Absent, alors |
|---|---|---|
| entraxe des colliers | leur nombre et leur position | la répartition reste inconnue |
| cheville retenue | diamètre et profondeur de perçage | le guide donne les positions, tait les diamètres |

*Pourquoi.* C'est la discipline déjà tenue par `fournitures` — « l'entraxe est une donnée du
fabricant, pas une cote de projet ». Ce changement ne la renverse pas : il lui donne un
emplacement au lieu d'un vide.

*Où ils vivent, à trancher à l'implémentation* : un entraxe unique au projet est plus simple,
mais un IRL 20 et une goulotte de 120 × 60 n'appellent pas le même espacement. Un défaut
projet avec surcharge par section est le compromis probable.

### D6 — Rien de neuf dans la vue

**Retenu :** le lecteur d'étapes porte le guide ; aucune vue ni mode n'est ajouté.

*Pourquoi.* Les `vues` sont des caméras, et le lecteur isole déjà par étape. Un « mode
perçage » dupliquerait la navigation et créerait un second chemin vers les mêmes objets.

## Risks / Trade-offs

**Ce qu'il y a derrière le point de perçage** → un trou pénètre la paroi de 5 à 8 cm, et le
modèle ne sait rien de l'intérieur du béton : ni gaine, ni canalisation, ni fer. Le contrôle de
collision n'oppose les cheminements qu'aux obstacles **visibles**. Aucune atténuation possible
dans ce changement : le guide doit **nommer** ce risque plutôt que laisser croire qu'il le
couvre. Un guide silencieux sur ce point serait pire qu'aucun guide.

**Le dénivelé est une cote à établir, pas à calculer** → les 5 à 6 cm viennent de la hauteur
d'un boîtier, donc d'un produit. Le risque est de le figer par commodité. Il suit la discipline
de D5 : déclaré, borné, inconnu tant qu'il ne l'est pas.

**La dérivation des colliers peut produire des positions absurdes** → un segment de 0,15 m —
CH-04 en portait un — n'appelle pas deux colliers d'extrémité. Les règles de D4 doivent
admettre un plancher, sans quoi la dérivation sur-équipe les segments courts.

**V18 change de nature** → elle contrôle un booléen et contrôlera une cote. Une traversée qui
passait la règle peut cesser de la passer, non parce que le tracé a changé mais parce que
l'exigence s'est précisée. C'est attendu, et c'est le but.

## Open Questions

- **Le dénivelé praticable des cinq traversées** — 5 à 6 cm est la réserve annoncée en prose,
  sur des boîtiers dont le modèle n'est pas arrêté. À établir sur fiche produit, avec l'entraxe
  et la cheville. Ne change ni les specs ni le découpage : le modèle porte la cote et la laisse
  inconnue.
- **Où vivent `entraxe` et `cheville`** — projet, section, ou les deux. Question
  d'implémentation ; les exigences sont écrites pour ne pas en dépendre.
- **Le plancher de longueur en deçà duquel un segment ne porte qu'un collier.** Dérivable une
  fois l'entraxe connu ; n'appelle pas de décision maintenant.
