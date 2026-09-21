# Design

## Context

Voir [proposal.md](proposal.md) — *Why*. L'exigence est dans le
[delta de spec](specs/maquette/visualisation/spec.md).

Ce que le socle sait déjà :

- `conducteursDuCircuit` (`src/geometrie/conducteurs.js`) rend chaque conducteur d'un circuit —
  PE, neutre, phase, sortie de module, ordres, retours — avec son **départ** et ses
  **destinations**, et la liste des conduits qu'il emprunte. Il obtient cette liste en unissant,
  destination par destination, les chemins de `cheminEntre` (`src/geometrie/graphe.js`).
- `cheminEntre` remonte le parcours nœud par nœud, mais **ne rend que les identifiants de
  conduits** : la topologie — où le conducteur se sépare — est perdue.
- Six enveloppes de rôle `jonction` : BD-01 et OC-01 portent un volume ; BD-04 partage le boîtier
  `bt-commandes` avec CM-01 ; BD-05, BL-01 et BD-06 sont des points. La goulotte GL-01 est un
  **cheminement** à raccordement latéral, qui abrite OC-01 et le module MC-01.

## Goals / Non-Goals

**Goals :**
- Un décompte de connecteurs **dérivé**, enveloppe par enveloppe, qui ne demande aucune donnée
  nouvelle aux apports.
- Une référence tirée d'un catalogue **déclaré avec sa source**, et « inconnu » dès qu'elle ne s'en
  tire pas.

**Non-Goals :**
- Le report dans `dossier/fournitures.md`.
- Les bornes des appareils : repiquage aux socles, bornes des commandes, des modules et du
  tableau. Ce ne sont pas des connexions en enveloppe de jonction.
- La vérification du volume d'une boîte au regard des connecteurs qu'elle reçoit (réserve 3.3 de
  `reserves-maitre-ouvrage`, qui reste sur cote produit).

## Decisions

### D1 — `cheminEntre` rend aussi les arêtes parcourues

On ajoute au résultat la suite des **pas** `{ de, vers, arete }` que le parcours remonte déjà, sans
rien changer à `cheminements` ni à `longueur`. *Écarté* : un second parcours propre aux
connecteurs, qui dupliquerait Dijkstra et pourrait choisir un autre chemin que celui dont on a
compté les conduits.

`conducteursDuCircuit` garde, pour chaque conducteur, l'**union des arêtes** de ses chemins — son
arbre — et les **nœuds de ses extrémités**.

### D2 — Un connecteur est une frontière franchie trois fois

Chaque enveloppe de jonction est un **ensemble de nœuds** S :

- boîte à volume : `noeudsDansBoite` ;
- boîte ponctuelle : son nœud, plus ceux des composants du même `boitier` ;
- organe de connexion abrité par une goulotte : **tous les nœuds de la goulotte** — ses bouts et
  ce qu'elle raccorde latéralement, modules compris.

Pour un conducteur d'arbre T, le nombre de **brins** dans S est

`k = (arêtes de T qui ont un bout dans S et l'autre dehors) + (extrémités du conducteur situées dans S)`.

`k ≥ 3` : un connecteur de k entrées. `k ≤ 2` : le conducteur traverse, ou s'arrête aux bornes
d'un appareil de l'enveloppe — aucun connecteur. Compter la **frontière** plutôt que le degré d'un
nœud rend le décompte indifférent au découpage interne : la goulotte relie son bas, son haut et
MC-01 par des arêtes internes, et la séparation de la phase vers MC-01 se fait au bas du profilé
dans le graphe, mais dans OC-01 sur le chantier.

*Écarté* : le degré du seul nœud de l'enveloppe. Il compte deux fois une boîte à volume, que le
graphe voit comme plusieurs nœuds, et rate la séparation faite en bas de goulotte.

### D3 — La référence se choisit dans le catalogue, et se combine au-delà de la plus grande

Le catalogue vit dans `data/chantier.json`, à côté des `fixations`, car c'est une donnée produit
et non une cote de projet :

```json
"connecteurs": {
  "gamme": "WAGO 221, borne à levier",
  "source": "https://www.wago.com/global/products/electrical-interconnections/discover-installation-terminal-blocks-and-connectors/221",
  "references": [
    { "reference": "221-412", "entrees": 2, "sectionMin": 0.2, "sectionMax": 4 },
    { "reference": "221-413", "entrees": 3, "sectionMin": 0.2, "sectionMax": 4 },
    { "reference": "221-415", "entrees": 5, "sectionMin": 0.2, "sectionMax": 4 }
  ]
}
```

*Valeurs de la fiche WAGO* : 0,2 à 4 mm² en rigide, qui est le cas de ce chantier. Pour k entrées,
on retient la plus petite référence qui en a au moins k — quatre brins font un 221-415, une entrée
libre. Au-delà de la plus grande, on **combine** : chaque liaison entre deux connecteurs occupe une
entrée de chacun, soit six brins pour un 221-415 et un 221-413. La combinaison est la plus courte
qui convienne, et à nombre égal la moins d'entrées perdues.

La section est celle du **circuit** : les fils d'ordre du bouton de porte sont en 2,5 mm², celle
des prises. Aucun connecteur ne mêle deux circuits — chacun a le sien, circuit par circuit.

### D4 — Ce que la fiche dit

Pour une enveloppe de jonction, trois lignes nouvelles :

- **Connecteurs** : le total par référence, « 3 × 221-413, 1 × 221-415 », ou « aucun » ;
- **dont** : circuit par circuit, conducteur par conducteur, « Prises : phase 221-413, neutre
  221-413, PE 221-413 » ;
- **Sans connexion** : les circuits dont tous les conducteurs traversent — la borne, dans BD-01.

Un connecteur sans référence s'affiche « inconnu », avec la classe déjà utilisée pour les valeurs
non établies. La dérivation se fait **une fois** au chargement, comme l'occupation des conduits,
et la fiche la lit.

### D5 — Un circuit non dérivable ne compte rien

Lorsque `conducteursDuCircuit` rend `null` — pilotage incomplet —, ses connecteurs sont
**inconnus** dans toutes les enveloppes qu'il traverse, et la fiche le dit. Rendre un décompte
partiel serait rendre un décompte faux ; c'est la règle déjà tenue pour l'occupation.

## Risks / Trade-offs

- **[Union de chemins qui ne forme pas un arbre]** — deux plus courts chemins peuvent emprunter
  deux routes distinctes, et une boucle ferait compter un brin de trop. → Un test vérifie que
  l'union des arêtes de chaque conducteur est un arbre sur les quatre apports fusionnés.
- **[Séparation hors enveloppe]** — un conducteur qui se sépare à un nœud qui n'est aucune
  enveloppe de jonction serait un piquage hors boîte. V17 l'interdit déjà pour les conduits ; → un
  test vérifie qu'aucun brin ne se sépare hors d'une enveloppe de jonction.
- **[Une goulotte à plusieurs organes de connexion]** — l'attribution deviendrait ambiguë. → La
  dérivation rend alors « inconnu » pour la goulotte et le dit ; le cas n'existe pas aujourd'hui.

## Open Questions

- Aucune qui change la dérivation. Le nombre de connecteurs achetés — réserve, conditionnement —
  relève de la liste d'achat, hors périmètre.
