# Design

## Context

Voir [proposal.md](proposal.md) — *Why* — et l'[étude](etude.md), qui porte le raisonnement et les
chiffres. Les exigences sont dans les deltas de spec.

Ce que le socle savait avant le changement :

- Un cheminement à `raccordement: "lateral"` relie **tout nœud posé sur son axe** aux deux bouts du
  segment qui le porte, en étoile (`src/geometrie/graphe.js`). GL-01 montait à la verticale et
  s'abordait sur son axe : CH-L1 et CH-B2 en partaient au centre du profilé.
- `noeudsDe` (`src/geometrie/connecteurs.js`) attribue à un organe de connexion **tous** les nœuds
  du profilé qui l'abrite, et rend `null` s'il y en a deux.
- La longueur d'un conducteur compte **chaque cheminement emprunté pour sa longueur entière**
  (`src/geometrie/conducteurs.js`).
- V15 exige qu'une extrémité de conduit rejoigne un composant, une boîte, une traversée ou un autre
  conduit. V18 borne le dénivelé d'une traversée par la réserve du boîtier **posé à son axe**.

## Goals / Non-Goals

**Goals :**
- Représenter GL-02 telle qu'elle se pose : collée au plafond, abordée par son dessous, sa face
  avant et son fond.
- Que les connecteurs, les longueurs et les métrés restent **dérivés** et justes, sans rien
  déclarer de plus dans les apports.

**Non-Goals :**
- Trancher les deux réserves bloquantes d'achat : `Iz` de la borne en goulotte, et la forme de sa
  ligne face au calibre de sa descente. Ce sont une valeur normative et une décision du maître
  d'ouvrage.
- Modéliser la pente d'évacuation du profilé. Elle se décide à la pose, sur la condition 4.

## Decisions

### D1 — Un profilé s'aborde par ses faces, et ses nœuds s'enchaînent le long de l'axe

`pointDansProfile` (`src/geometrie/cheminement.js`) teste qu'un point tombe **dans le volume de la
section retenue** : le long du segment, à une demi-largeur de l'axe dans le plan de la face, et à
une saillie du nu. Sans cote connue, il retombe sur l'axe.

Le graphe relie chaque nœud ainsi posé à **sa projection sur l'axe**, puis relie les projections
**en chaîne**, dans l'ordre du parcours. La chaîne remplace l'arête directe du segment. C'est ce que
font les conducteurs sous le capot : ils courent le long du profilé, puis en sortent par une face.

*Écarté* :
- **Garder l'étoile** en élargissant seulement le test d'appartenance. Chaque départ était relié
  directement au bout du segment, et un conducteur entrait donc dans OC-02 **par autant d'arêtes
  qu'il en sortait de départs** : six brins au lieu de quatre, trois connecteurs de trop. Les
  longueurs étaient aussi un peu courtes, la diagonale remplaçant le parcours réel.
- **Poser les conduits sur l'axe**, comme CH-L1 sur GL-01. Cela évite l'extension, mais fait courir
  six centimètres de tube dans le profilé, et fausse le métré de chaque descente.

Sur GL-01, dont les nœuds sont tous sur l'axe, la chaîne rend exactement les longueurs de l'étoile.

### D2 — Deux profilés, deux organes ; le T n'appartient à aucun

GL-02 est un **cheminement distinct** de GL-01, qui commence au T (5,60 ; 0,70 ; 2,705). Un organe de
connexion reçoit les nœuds du profilé qui le porte, **à l'exclusion de ceux qui sont aussi sur un
autre profilé latéral** — le T, et le haut de GL-01 que le volume de GL-02 contient. Un conducteur
qui passe de GL-01 à GL-02 franchit la frontière de OC-01, puis celle de OC-02 : il ne s'y sépare
pas. Deux organes sur un même profilé restent ambigus, et rendent `null`.

*Écarté* :
- **Attribuer chaque nœud à l'organe le plus proche** le long du profilé : la frontière dépendrait
  de la position de l'organe, qui n'est qu'un emplacement de pose.
- **Un seul profilé GL-01 prolongé** : il porterait deux organes, et retomberait dans l'ambiguïté.

### D3 — Un conducteur ne compte d'un profilé que ce qu'il y parcourt

Pour un cheminement latéral, la longueur d'un conducteur est la **somme des pas de son trajet**
sur ce cheminement, et non la longueur du profilé. Les conduits restent comptés entiers : on ne
sort pas d'un tube en chemin.

*Écarté* : **compter le profilé entier**. GL-02 fait 6,00 m, et la plupart des conducteurs le
quittent à 1,90 m. Le métré du 1,5 mm² dépassait 100 m, contre 73 avant la goulotte : trente
mètres de fil qui ne se posent pas. GL-01 est désormais comptée elle aussi au parcours : 69,34 m
pour le 1,5 mm² au lieu de 73,02.

### D4 — Le coude du départ de plafond est un accessoire, et sa fiche le dit

AC-01, `accessoire-conduit`, au point où la face avant de GL-02 rencontre le plafond. CH-07 en part.
La spec « Enveloppes consultables selon leur rôle » exigeait déjà que la fiche d'un accessoire
porte qu'aucune connexion ne s'y fait. Elle n'était pas tenue : une ligne « Connexions : aucune »
est ajoutée pour le rôle `accessoire`.

### D5 — V15 et V18 connaissent le profilé

- **V15** : une extrémité de conduit posée dans le volume d'un profilé latéral est raccordée. Le
  profilé reçoit ses conducteurs par sa face.
- **V17** : même test d'appartenance que le graphe.
- **V18** : une traversée dont l'axe n'est dans aucun boîtier, mais dont l'axe ou l'entrée est dans
  un profilé latéral, doit avoir son **entrée** dans ce profilé. Seule l'entrée est bornée : la sortie débouche à
  l'extérieur, sous l'appareil qu'elle dessert, et la réserve symétrique d'une boîte n'a pas
  d'objet.
- **Graphe** : une traversée se raccorde par son axe, là où un boîtier la reçoit. Quand son axe
  débouche dans un profilé, elle s'y raccorde **par son entrée**, même si son axe frôle le profilé
  à la tolérance près : il fusionnerait sinon avec le bout d'un conduit voisin. C'est le cas de
  TV-L2 dans le 90 × 40, dont l'axe, à 2,6525 m, est à 7,5 mm de l'extrémité de CH-05. Sans
  dénivelé, axe et entrée se confondent, et rien ne change pour les autres traversées.

### D6 — La traversée de EL-03 est cotée par la géométrie

TV-L2 : axe à 2,6525 m, dénivelé **0,105 m**. C'est le premier dénivelé coté du projet. Il ne vient
pas d'un boîtier : l'entrée est fixée au milieu du profilé, et la sortie à la hauteur de EL-03.
Les tests qui gardaient « aucun dénivelé n'est arrêté » l'exceptent nommément.

### D7 — Les tests du tracé d'avant gardent leur montage

Le franchissement dans une boîte à volume, le heurt de CH-04 par V20 et le piquage enfermé ont été
éprouvés sur l'antenne de la paroi est. Ce sont des **mécanismes**, qui valent toujours.
`tests/_aides.js` reconstruit le tracé d'avant (`PRISES_AVANT_GOULOTTE` et ses deux voisins) à
partir des apports actuels. Les tests de ces mécanismes s'y appuient plutôt que sur un tracé qui ne
les exerce plus.

### D8 — Les connexions sont admises en goulotte ; l'organe n'est plus une enveloppe

*Décision du maître d'ouvrage du 2026-09-24, constitution v1.15.0.* Le type `organe-connexion` est
gardé : il désigne le **groupe de connexions** repéré sous un capot, qui délimite le décompte des
connecteurs (D2) et porte le repère exigé par la condition 3. OC-01 et OC-02 perdent `dimensions`
et `entrees`, qui décrivaient une enveloppe et n'étaient la cote d'aucun produit. V21 ne les compte
donc plus. Les tests qui éprouvaient le flanc d'une boîte à volume le font sur le tracé d'avant
(D7), où OC-01 garde son volume d'alors.

*Écarté* : **retirer le type** et faire porter le décompte par la goulotte elle-même. Deux groupes
sur un parcours se distinguent par leur profilé et leur repère ; sans objet déclaré, le dossier
n'aurait plus rien à énumérer.

### D9 — GL-02 en 90 × 40

*Conseil de l'étude le 2026-09-24 : 80 × 40. Retenu par le maître d'ouvrage le 2026-09-25 : 90 × 40.*
GL-02 passe de 120 × 60 à 90 × 40 : axe à 2,705 m, dessous à 2,66 m, face avant à x 5,56. Les
descentes partent de 2,66 m, CH-07 et AC-01 de la face avant, et TV-L2 prend 0,105 m de dénivelé
pour garder EL-03 à 2,60 m. Le métré sépare désormais deux articles de goulotte. La jonction en T réduite est portée au
matériel de pose.

### D10 — Un circuit peut déclarer un câble

*Décision du maître d'ouvrage du 2026-09-24 : la borne en câble 3G10.* Un circuit PEUT déclarer
`cable`, la désignation du câble. Ses conducteurs restent décomptés — le décompte par rôle et les
connecteurs en ont besoin —, mais un tube le reçoit comme **un seul objet** : la fiche d'un conduit
porte alors `D ≥ d × √3, n = 1`, d étant le diamètre du câble. Le métré le compte au **mètre de
câble**, et non au mètre de conducteur. *Écarté* : ramener le circuit à un conducteur, ce qui
perdait les rôles et faussait les connecteurs.

## Risks / Trade-offs

- **[Réserves bloquantes d'achat]** → la maquette montre un tracé dont deux conditions d'achat
  restent ouvertes. *Mitigation* : elles sont écrites à la note de calcul de la borne, aux réserves
  du maître d'ouvrage, et dans le matériel de l'étape de la borne.
- **[Longueurs à la demi-largeur près]** → une descente qui part du dessous compte les 6 cm entre
  l'axe et la face comme du fil sous capot. C'est ce que le conducteur parcourt ; l'erreur, s'il y
  en a une, est du côté de l'achat.
- **[Le test de volume ignore le sens de la saillie]** → un point à moins d'une saillie du nu,
  **derrière** lui, serait tenu pour dans le profilé. Il serait dans l'épaisseur de la paroi, où
  aucun nœud ne se pose. Ce n'est pas vérifié, c'est constaté.
