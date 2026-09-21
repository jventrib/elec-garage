# Phase 1 — Implantation candidate

**Fonctionnalité** : `005-automatisation-locale` | **Date** : 2026-09-22

⚠️ **Cette implantation n'a pas encore été soumise aux vingt-deux règles du socle**, et elle ne
peut pas l'être : elle exige l'extension décrite en R3, sans laquelle V16 tombe sur les trois
circuits. C'est une différence avec `002`, `003` et `004`, dont les implantations avaient été
validées avant d'être consignées. **Cette validation est la première tâche de la phase suivante**,
et le présent document est une proposition, non un relevé.

## Les objets déclarés

> **Révisé le 2026-09-23, décision du maître d'ouvrage** : le boîtier double de CM-04 et CM-05
> passe sur la **paroi sud**, face intérieure, en (5,40 ; 0 ; 1,10), à 0,20 m de la porte
> sectionnelle. BD-06 suit en (5,40 ; 0 ; 2,22) sur CH-L1, et la descente CH-A1 fait 1,12 m. La
> table ci-dessous est l'implantation d'origine ; les données d'apport font foi.

| Repère | Type | Position | Ce qui le caractérise |
|--------|------|----------|------------------------|
| **GL-01** | `boite-derivation` à volume | (5,60 ; 0,70 ; 2,19), paroi est | La goulotte. `dimensions` 0,12 × 1,12 × 0,06. **Remplace BD-02** et reprend ses entrées. Enveloppe vérifiée : `x 5,54→5,60 | y 0,64→0,76 | z 1,63→2,75` |
| **MC-01** | `module-commande` *(type nouveau)* | dans GL-01 | Tient l'état de l'éclairage intérieur, applique la minuterie, reçoit les ordres des deux interrupteurs et l'événement d'ouverture |
| **MC-02** | `module-commande` | au droit du moteur, voisin de PC-05 (2,70 ; 2,70 ; 2,75) | Relaie l'ordre vers le moteur et **observe** l'état réel de la porte. Alimenté par repiquage sur PC-05, sous les quatre conditions de la v1.8.0 |
| **CM-04** | `commande` | (5,60 ; 0,30 ; 1,10), paroi est | Bouton d'**éclairage** de l'interrupteur double, à l'entrée de la sectionnelle. Circuit `c-eclairage` |
| **CM-05** | `commande` | (5,60 ; 0,30 ; 1,10), paroi est | Bouton de **porte**, même boîtier. Circuit `c-prises` |
| **BD-06** | `boite-derivation` | (5,60 ; 0,30 ; 2,60) | Départ de la descente, posée **au droit** des deux boutons comme le corollaire de tracé l'exige |
| **CH-A1** | `cheminement` | (5,60 ; 0,30 ; 2,60) → (5,60 ; 0,30 ; 1,10) | Descente de **1,50 m**, entrée par le haut du boîtier double |

**Le boîtier double porte deux circuits**, et c'est la première fois dans ce dossier qu'un boîtier
d'appareillage est dans ce cas. CM-04 relève de l'éclairage, CM-05 des prises. Il DOIT être repéré
comme tel (FR-021, constitution v1.10.0) : **consigner l'éclairage n'y coupe pas l'autre bouton.**

## Ce que les apports existants perdent ou gagnent

| Apport | Modification | Motif |
|--------|--------------|-------|
| `002` | **BD-02 supprimée** | Remplacée par GL-01, décision du 2026-09-22 |
| `002` | **CH-01 cesse d'être un conduit** | Les conducteurs du tronc vont du tableau à la goulotte sans tube. Son métré de 1,10 m sort du relevé des conduits et entre dans celui de la goulotte |
| `003` | **CH-L1 gagne une rupture de segment à y = 0,30** | Pour que BD-06 soit un nœud du graphe. Même tracé, même longueur, un segment de plus — ce n'est pas une révision d'implantation |
| `data/types-composants.json` | **type `module-commande`** | Avec son gabarit, pour le rendu et la fiche |

*CH-01 qui cesse d'être un conduit sans que son parcours change est le genre de modification qui se
perd. Le métré total ne bouge pas ; c'est sa **répartition par article** qui bouge, et c'est
`dossier/fournitures.md` qui doit le refléter.*

## Le décompte des conducteurs, et les deux conditions qu'il rouvre

Le socle dérive ce décompte conduit par conduit depuis le 2026-09-22. Les chiffres ci-dessous sont
**calculés à la main sur la topologie proposée** et devront être confirmés par la dérivation une
fois les données écrites — c'est précisément ce que cette fonctionnalité ne doit pas se permettre
d'affirmer sans le socle.

| Conduit | Calibre | Aujourd'hui | Proposé | Cause |
|---------|---------|-------------|---------|-------|
| CH-05 | IRL 20 | 8 | 8 | inchangé |
| CH-02, CH-04, CH-07 | IRL 20 | 6 | **8** | les deux conducteurs du bouton de porte, qui va au moteur (R5) |
| CH-08 | IRL 20 | 3 | **5** | idem |
| **CH-L1 nord** (y 0,30→0,70) | **IRL 20** | 3 | **7** | les deux boutons y passent tous les deux |
| CH-L1 sud, CH-A1 | IRL 20 | — | 5 et 5 | à confirmer par la dérivation |

### Deux conditions de remplissage, dont une probablement dépassée

**CH-02, CH-04, CH-07 rejoignent CH-05 à huit conducteurs.** Le seuil ne change pas — 14,69 mm
intérieurs, condition d'achat déjà née de la décision du tronc en IRL 20 (T047 de `002`). Ce qui
change est le nombre de conduits qui y sont soumis, et la difficulté de tirage.

**CH-L1 a été le vrai point dur pendant quelques heures, et il est résolu.** Sept conducteurs de
1,5 mm² exigent, selon l'hypothèse retenue sur la section d'un conducteur isolé :

| Hypothèse | `D` exigé | IRL 16 (≈ 10,7 à 12,5 mm) | IRL 20 (14,0 à 15,8 mm) |
|---|---|---|---|
| basse | 12,1 mm | limite | ✅ |
| médiane | 13,0 mm | **dépassé** | ✅ |
| haute | 13,7 mm | **dépassé** | ✅ |

En **IRL 16**, la condition était vraisemblablement hors d'atteinte, et trois issues s'offraient —
monter le calibre, déplacer le bouton de porte, ou renoncer au bouton mural. **Le maître d'ouvrage
a tranché le 2026-09-22 en abandonnant l'IRL 16 sur l'ensemble du projet** : les branches propres à
l'éclairage passent en IRL 20, et la condition est satisfaite **à toutes les valeurs de la plage
produit**, la plus défavorable donnant 32,1 % d'occupation contre un tiers admissible.

*Le bouton de porte est donc conservé à l'entrée de la sectionnelle, comme la demande le voulait.
La décision a en outre un effet que la conception n'avait pas demandé : le chantier ne compte plus
qu'**une seule référence de tube** hors ligne de la borne — 22,33 m d'IRL 20, 10,44 m d'IRL 25.*

*Cette découverte reste la raison d'être de la phase de conception. Elle n'était pas visible au
spec, et elle ne l'aurait pas été davantage à la pose : elle se serait constatée l'aiguille à la
main, le tube posé.*

## Ce que la contiguïté déclare

```
GL-01  contigu  TD-01
```

Deux enveloppes qui se touchent, une arête de longueur nulle dans le graphe. Les deux conditions de
la contrepartie (R3) sont vérifiées sur ce cas : les deux objets portent un volume déclaré — le
tableau par son gabarit de catalogue, la goulotte par ses `dimensions` — et leurs faces se touchent
exactement, le sommet du tableau étant à z = 1,63 et le plancher de la goulotte au même z.

## Comportement de l'éclairage — la machine à états

Quatre états, et les transitions qui les relient. C'est ce que FR-029 exige d'écrire pour un
occupant, et ce qu'aucune configuration de module ne doit être seule à porter.

| État | Ce que voit l'utilisateur | Sortie |
|------|---------------------------|--------|
| **Éteint** | rien | ouverte |
| **Allumé par minuterie** | lumière, décompte en cours | fermée |
| **Allumé à la main** | lumière, aucun décompte | fermée |
| **Indisponible** | commande manuelle seule, pas d'automatisme | selon la commande |

| Depuis | Événement | Vers | Règle |
|--------|-----------|------|-------|
| Éteint | ouverture de porte | Allumé par minuterie | FR-001 |
| Allumé par minuterie | ouverture de porte | Allumé par minuterie, **décompte relancé** | FR-004 |
| Allumé par minuterie | fin du décompte | Éteint | FR-002 |
| Allumé par minuterie | action manuelle | **Allumé à la main** ou Éteint, selon le sens | FR-007, FR-010 |
| **Allumé à la main** | ouverture de porte | **Allumé à la main** — aucun décompte n'est armé | **FR-008** |
| Allumé à la main | action manuelle | Éteint | FR-006 |
| tout état | perte du réseau | Indisponible, **sans changer l'état de la sortie** | FR-015 |
| tout état | retour du courant | état écrit au dossier, **jamais un allumage inopiné** | FR-018 |

**La transition qui porte tout le sens de la fonctionnalité est celle en gras** : une ouverture de
porte survenant sur un allumage manuel **n'arme pas** de décompte. Sans elle, travailler à l'établi
porte ouverte ferait éteindre la lumière au bout du délai — exactement ce que l'histoire 2 interdit,
et exactement le reproche déjà fait au détecteur de façade, qui n'a pas d'allumage forcé.

## Ce qui n'est pas dans ce document

- **Les références de matériel.** Elles relèvent de la nomenclature, et dépendent de U1 et U4.
- **La valeur du délai.** Elle se consigne (FR-003), elle ne se choisit pas ici.
- **La façon dont l'état de la porte est connu.** Trois voies en R1, une dépendance bloquante.
- **La séquence de montage.** Elle appartient à `tasks.md` et à l'apport.
