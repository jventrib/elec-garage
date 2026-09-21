# Design

## Context

Voir [proposal.md](proposal.md). `conducteursDuCircuit` (`src/geometrie/conducteurs.js`) rend
chaque conducteur d'un circuit avec son **arbre** — les arêtes du graphe qu'il parcourt, par clés
de nœud —, ses **extrémités** et les **cheminements** qu'il emprunte. Le départ et les destinations
y sont connus comme appareils, mais ne sont pas rendus.

## Decisions

### D1 — Les conducteurs concernés

Un conducteur est **concerné** par l'objet désigné quand :
- **cheminement** : il l'emprunte ;
- **appareil** : l'appareil est l'une de ses extrémités, ou son arbre passe par le nœud de
  l'appareil — par l'ensemble de nœuds d'une enveloppe de jonction pour une boîte ou un organe de
  connexion ;
- **traversée** : son arbre passe par le nœud extérieur de la traversée.

Le trajet d'un circuit est l'**union des arbres** de ses conducteurs concernés : tout leur
parcours, jusqu'à chacune de leurs arrivées, et non le seul morceau voisin de l'objet.

### D2 — Une couleur par circuit, des tracés côte à côte

La couleur est celle que le circuit déclare, avec le repli déterministe déjà employé pour les
composants. Chaque arête se dessine en fin cylindre, décalé perpendiculairement à sa direction selon
le rang du circuit : deux circuits qui partagent une arête ne se recouvrent pas. Les tracés se
dessinent **par-dessus** les conduits (`depthTest` coupé) : ils courent à l'intérieur des tubes et
des goulottes, qui les cacheraient.

*Écarté* : colorer les conduits eux-mêmes. Un conduit partagé ne peut porter qu'une couleur.

### D3 — Pastilles aux extrémités

Chaque appareil d'extrémité reçoit une pastille par circuit, empilée hors du marqueur, du côté
opposé à la paroi. Un appareil extrémité d'un seul circuit prend aussi sa couleur ; les autres
appareils visibles passent à la teinte neutre, comme à la mise en évidence d'un circuit.

### D6 — Les fils d'ordre en teinte foncée

Un tronçon est marqué `ordre` quand l'arbre d'un fil d'ordre du circuit — rôle `ordre` de la
dérivation — y passe, **que ce fil passe ou non par l'objet désigné** : la teinte dit ce que le
tronçon contient. *Précisé le 2026-09-25 par le maître d'ouvrage*, après une première version qui
ne marquait que les fils d'ordre concernés : désigner CH-05 laissait tout le circuit des prises en
vert clair. Il se trace dans la couleur du circuit assombrie vers le noir d'un
facteur déclaré, `trajets.assombrissementOrdre`. Le fil d'ordre ne porte aucune puissance, et le
distinguer dans un tube est ce qui évite de le prendre pour une phase. *Écarté* : une couleur
propre aux ordres, commune à tous les circuits — on ne saurait plus à quel circuit le fil
appartient, alors que c'est ce qui décide de la consignation.

### D4 — Rien n'est deviné

Un circuit non dérivable — pilotage incomplet, destination injoignable — ne donne aucun tracé, et
la fiche le porte « trajet inconnu ». Les cotes de dessin sont des conventions de présentation,
déclarées dans `data/presentation.json`.

### D5 — La logique est pure

`trajetsDe` ne touche pas à la scène : il rend des segments et des identifiants, et se teste sans
navigateur. La scène ne fait que dessiner.
