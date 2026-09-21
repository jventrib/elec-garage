# Nomenclature — automatisation locale

**Changement** : `automatisation-locale-mise-en-oeuvre` | **Date** : 2026-09-23

Ce que l'automatisation **ajoute ou change** au chantier. Les quantités sont déduites des apports
`002`, `003` et `005` ; les métrés sont des **métrés de tracé**, sans chute ni réserve de
raccordement. **La liste totale des fournitures est [`dossier/fournitures.md`](../../../dossier/fournitures.md)**,
générée par `npm run fournitures` : c'est elle qui fait foi pour commander, et ce document dit
seulement d'où viennent ses écarts.

Les **références de matériel** ne sont pas arrêtées : celles des modules dépendent du relevé du
moteur (tâche 1.1) et de la séparation des domaines de tension exigée de MC-02.

## Goulotte et organes de connexion

| Article | Quantité | Précision |
|---------|----------|-----------|
| Profilé de goulotte **120 × 60 mm**, GL-01 | **1,12 m** | Au-dessus du tableau, contigu à lui. Remplace BD-02, et CH-01 cesse d'être un conduit — déjà reflété par `dossier/fournitures.md` |
| **Capot démontable** | **1,12 m** | Se dépose sans destruction et reste déposable après travaux — condition 1 de l'amendement du mode de pose |
| Accessoires d'angle et embouts | selon le produit | Condition 4 : la goulotte ne retient pas l'eau et ne se déverse pas dans le tableau |
| **Organes de connexion à enveloppe propre** | OC-01, **4 entrées**, plus ceux de BD-06 | La goulotte **abrite** la connexion, elle ne l'**enveloppe** pas : une connexion nue sous capot reste interdite |
| Étiquettes « plusieurs circuits » | goulotte, BD-06, boîtier double | Lisibles **sans ouvrir** |

**Remplissage de la goulotte** : quatorze conducteurs, borne comprise. Il se justifie sur la
**fiche produit** et non par la règle du tiers — condition 6 de l'amendement.

## Modules et platine

| Article | Quantité | Précision |
|---------|----------|-----------|
| Module de commande pour l'**éclairage**, MC-01 | **1** | Dans la goulotte, accessible et démontable capot déposé. Deux entrées : une pour CM-01, **interrupteur**, une pour CM-04, **bouton poussoir** — voir la notice. Fonctionnement **sans réseau** exigé pour la commande manuelle, **aucun service distant** ni compte en ligne |
| Module de commande pour la **porte**, MC-02 | **1** | Au droit du moteur, dans le boîtier de PC-05, par repiquage. Sortie en **contact sec**. **Entrées qui commutent la phase** — le bouton de porte y renvoie la phase des prises par un seul fil (design D6). **Séparation** entre son alimentation 230 V et sa sortie TBTS à justifier sur la fiche. **Commande de la sortie par le cloud du fabricant ET remontée de l'état de son entrée** — porte ouverte / fermée — **dans la même application**, exigées depuis la décision du 2026-09-23 (changement [`commande-porte-a-distance`](../archive/2026-09-23-commande-porte-a-distance/proposal.md)). Commandes manuelles fonctionnelles sans réseau ni Internet |
| Platine **UAP 1-HCP** | **1** | Contact de fin de course « Ouvert ». **À commander après le relevé du moteur** (tâche 1.2). Le relais HOR 1-HCP est écarté |
| Conducteur de commande TBTS | *(selon la distance platine ↔ MC-02, à relever)* | Hors des conduits du 230 V |

## Boîte, boîtier et conduit

| Article | Quantité | Précision |
|---------|----------|-----------|
| Boîte de dérivation BD-06 | **1**, trois entrées | Sur CH-L1, paroi sud à x = 5,40, au droit du boîtier double. Porte **deux circuits** |
| **Boîtier double** en saillie | **1** | À 1,10 m d'axe. Porte **deux circuits** — c'est le premier boîtier d'appareillage du dossier dans ce cas |
| Boutons poussoirs | **2** — CM-04, éclairage ; CM-05, porte | Dans le boîtier double. Distinguables au toucher, pour la même raison que CM-01 et CM-03 |
| Conduit **IRL 20** — descente CH-A1 | **1,12 m** | Droite, entrée par le haut du boîtier |
| Conduit **IRL 25** au lieu d'IRL 20 — CH-02 et CH-05 | **3,40 m** transférés | Décision du maître d'ouvrage du 2026-09-23. **Pas de mètre en plus** : 3,40 m passent d'un article à l'autre. Changements de calibre au tronc à BD-01 et à BD-04 : **BD-01 reçoit deux entrées en IRL 25** — CH-02 et CH-05 —, **BD-04 une** — à vérifier sur les boîtes retenues |

## Conducteurs

| Section | Avant | Après | Écart | Ce qui s'ajoute |
|---------|-------|-------|-------|-----------------|
| 1,5 mm² | 51,30 m | **73,02 m** | +21,72 m | sortie de MC-01 vers le plafonnier, paires d'ordre de CM-01 et de CM-04 |
| 2,5 mm² | 41,91 m | **62,31 m** | +20,40 m | fil d'ordre du bouton de porte, et la phase et le PE qui l'accompagnent jusqu'au boîtier double |

*Valeurs **dérivées**, reprises de `dossier/fournitures.md`.* Elles sont **majorées** d'environ
5 m de 1,5 mm² et 8 m de 2,5 mm² : le métré se fait par cheminement, et les conducteurs qui ne
parcourent que le tronçon amont de CH-L1, de la goulotte à BD-06, y sont comptés sur toute sa
longueur — les 2,70 m du tronçon aval compris. L'erreur est du côté
de l'achat.
