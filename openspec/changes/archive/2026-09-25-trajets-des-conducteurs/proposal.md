# Proposal

## Why

Désigner un cheminement ou un appareil met aujourd'hui en évidence **tout le circuit** qui le
porte : chaque conduit et chaque appareil du circuit se colorent, qu'ils aient ou non un rapport
avec l'objet désigné. Sur un conduit partagé, seul le premier circuit est souligné. On ne voit donc
pas **d'où viennent et où vont** les conducteurs qui passent là, ni où ils s'arrêtent.

Or la maquette le sait : elle dérive le trajet de chaque conducteur, conduit par conduit et nœud
par nœud, pour le décompte des tubes, les métrés et les connecteurs.

**Demande du maître d'ouvrage du 2026-09-25**, arbitrée le même jour :
- **une couleur par circuit** ;
- le trajet est montré **en entier**, du départ de chaque conducteur à chacune de ses arrivées ;
- les appareils d'extrémité portent des **pastilles** de la couleur des circuits qui y aboutissent.

## What Changes

- Au clic sur un **cheminement**, un **appareil** ou une **traversée**, la maquette trace, pour chaque
  circuit concerné, le trajet réel des conducteurs qui passent par l'objet désigné. Le trajet va
  d'une extrémité à l'autre, en suivant le graphe : conduits, goulottes sous capot, boîtes et
  traversées.
- Chaque circuit a sa couleur, celle qu'il déclare. Sur un parcours commun à plusieurs circuits,
  les tracés courent **côte à côte** et restent tous visibles, y compris à l'intérieur d'un conduit
  ou d'une goulotte.
- Les **appareils d'extrémité** de ces conducteurs — tableau, module, commande, socle, point
  lumineux, borne — portent une **pastille par circuit** qui y aboutit. Un appareil qui n'est
  l'extrémité que d'un circuit prend aussi sa couleur.
- Les tronçons où passe un **fil d'ordre** d'un circuit sont tracés dans une **teinte plus foncée**
  de sa couleur. *Demande du maître d'ouvrage du 2026-09-25.*
- La fiche de l'objet désigné porte une ligne « **Trajets** » : pour chaque circuit, les appareils
  qu'il joint, et la teinte des fils d'ordre.
- Un circuit dont le trajet ne se dérive pas n'est **pas tracé**, et la fiche le dit : aucun trajet
  n'est deviné.
- Cela remplace la mise en évidence du circuit entier au clic.

## Capabilities

### New Capabilities

Aucune.

### Modified Capabilities

- `maquette/visualisation` : exigence nouvelle « Trajet des conducteurs d'un objet désigné ».

## Impact

- `src/geometrie/trajets.js` — nouveau : les trajets d'un objet désigné, circuit par circuit
- `src/geometrie/conducteurs.js` — chaque conducteur rend ses appareils d'extrémité
- `src/scene/trajets.js` — nouveau : tracés et pastilles
- `src/scene/composants.js` — teinte des appareils d'extrémité
- `src/ui/fiche-composant.js` — ligne « Trajets »
- `src/main.js` — branchement au clic
- `data/presentation.json` — cotes de dessin des tracés et des pastilles
- `tests/trajets.test.js` — nouveau
- `src/version.js`, `dist/garage.html`
