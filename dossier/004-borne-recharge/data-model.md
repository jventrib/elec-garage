# Phase 1 — Implantation de la borne

**Fonctionnalité**: `004-borne-recharge` | **Date**: 2026-09-22

Ce document donne l'implantation cotée. **Elle n'est pas encore exprimable par le socle** : deux
de ses points tombent à l'intérieur d'une boîte, et une boîte y est un point sans épaisseur. Voir
R2 ; l'extension est bloquante et bornée.

## Le seul composant

| Repère | Type | Paroi | Face | x | y | z | Hauteur d'axe |
|--------|------|-------|------|---|---|---|---------------|
| BR-01 | borne de recharge | nord | intérieur | **2,80** | 5,60 | **1,00** | 1,00 |

x = 2,80 m est l'axe médian du local, et la fenêtre étant centrée, BR-01 est centrée sous elle
(FR-003). L'axe à 1,00 m laisse **0,50 m** sous l'allège : la condition de FR-004 s'écrit
`1,00 + hauteurCoffret/2 ≤ 1,50`, et elle est tenue par tout coffret de moins de 1,00 m de haut.

**Aucune boîte propre à ce circuit.** La ligne n'a aucune dérivation : c'est un circuit dédié à un
seul point d'utilisation, donc un chemin unique du tableau à la borne, sans jonction.

## Le tracé

| Conduit | De | À | Parcours | Longueur |
|---------|----|----|----------|----------|
| CH-B1 | TD-01 | **dans BD-02** | 0,05 m d'écart au nord, puis montée de 1,10 m | 1,15 m |
| CH-B2 | **dans BD-02** | **dans BD-01** | antenne paroi est à z = 2,64 | 1,85 m |
| CH-B3 | **dans BD-01** | BR-01 | 3,00 m jusqu'à l'angle, 1,10 m sur la paroi nord, descente de 1,24 m, 1,70 m sous l'allège, descente de 0,40 m | 7,44 m |

**Métré de conduit : 10,44 m**, en **huit** segments, au calibre que la note de calcul arrêtera —
le diamètre a été déclaré comme **majorant**, IRL 32, jusqu'à ce que le maître d'ouvrage arrête l'**IRL 25** le 2026-09-22 ; `diametre` porte désormais 0,025 et `diametreMajorant` a disparu. Le chemin
électrique fait **10,48 m**, les 0,04 m de différence étant parcourus **dans** les deux boîtes, où
il n'y a pas de conduit mais des conducteurs.

**Aucun mètre n'est partagé.** C'est la seule ligne du projet dont le conduit est entièrement
propre, ce qu'impose le Principe IV — et la seule à laquelle aucun facteur de groupement ne
s'applique.

### Les deux points qui tombent dans une boîte

| Point | Boîte | Écart au centre | Ce qui s'y passe |
|-------|-------|-----------------|------------------|
| (5,60 ; **0,75** ; 2,60) | BD-02 (0,70 ; 2,60) | 0,05 m en y | la montée franchit l'altitude du tronc, à l'abri de la boîte |
| (5,60 ; 2,60 ; **2,64**) | BD-01 (2,60 ; 2,60) | 0,04 m en z | la ligne franchit CH-04, qui monte au plafond |

Ce ne sont pas des jonctions : **les conducteurs y transitent sans être coupés**, ce qu'exige la
première des quatre conditions du Principe IV amendé. Aucune connexion de la borne n'est faite
dans une boîte partagée.

### Les conditions de dimension, à lire au catalogue

```
BD-01 :  |2,64 − 2,60| + d/2 ≤ h/2    →   h ≥ 0,112 m
BD-02 :  |0,75 − 0,70| + d/2 ≤ h/2   →   h ≥ 0,132 m      avec d = 0,032 m
```

| Boîte | Entrées avant | Entrées après | Côté minimal |
|-------|---------------|---------------|--------------|
| BD-02 | 3 | **5** | **132 mm** |
| BD-01 | 4 + 1 traversée en fond | **6** + la traversée | **112 mm** |

*Cotes révisées à l'implémentation : elles sont dérivées du **majorant** de calibre alors en vigueur, l'IRL 32 — le calibre arrêté depuis est l'IRL 25, qui leur laisse de la marge —, et
non d'un IRL 25 supposé. Elles valent donc quel que soit le calibre retenu, ce qui est nécessaire
puisque les boîtes sont posées par `002` avant que la section soit arrêtée.*

**Un nombre d'entrées n'est pas un volume** (FR-038). Ces deux conditions portent sur la cote
d'encombrement ; le **volume intérieur**, lui, doit être établi séparément pour la totalité des
conducteurs — huit de 1,5 et 2,5 mm² dans BD-01, plus les trois de la borne.

## Ce que les vingt-deux règles disent aujourd'hui

Le tracé a été soumis au socle en l'état. Il rend **quatre défauts**, et les quatre tombent dans
une boîte :

```
V17 | Jonction de 4 conduits en (5.6 ; 2.6 ; 2.64) sans boîte de dérivation.
V20 | « CH-02 » segment 1 et « CH-B1 » se recouvrent en (5.6 ; 0.75 ; 2.6).
V20 | « CH-04 » segment 1 et « CH-B1 » se recouvrent en (5.6 ; 2.6 ; 2.64).
V20 | « CH-04 » segment 1 et « CH-B2 » se recouvrent en (5.6 ; 2.6 ; 2.64).
```

Ce qui passe déjà, en revanche :

| Règle | Constat |
|-------|---------|
| V13, V14 | Les huit segments sont orthogonaux et reposent sur un nu déclaré |
| V16 | BR-01 est atteignable depuis TD-01 par le tracé réel — **zéro orphelin** |
| V19 | Aucun segment ne franchit la fenêtre nord, la porte de service ni la sectionnelle |
| Collisions | **Zéro établie** : 24 contrôles conformes, 32 non concluants, aucun en collision |

Les 32 non concluants portent sur les quatre encombrements non relevés — vantail, tablier fermé,
gabarit véhicule, débattement des portières. Aucun ne ressort vert, et c'est voulu.

## Longueur et chute de tension

Un seul chemin, donc un seul chiffre : **10,48 m** du tableau à la borne. La chute de tension est
donnée **en fonction de la section**, qui n'est pas arrêtée (R5) :

| Section | ΔU terminale à 32 A | Cumulée avec l'arrivée (1,65 %) |
|---------|---------------------|----------------------------------|
| 4 mm² | 1,64 % | **3,29 %** |
| 6 mm² | 1,09 % | **2,75 %** |
| 10 mm² | 0,66 % | **2,31 %** |

*Recalculées à l'implémentation sur 10,48 m, le chemin que le socle mesure à travers les deux
boîtes. Les trois sections tiennent, comme au plan.*

Les trois tiennent sous 5 %. **La chute de tension n'est pas la contrainte de ce circuit** : c'est
le courant admissible en pose apparente sous conduit qui fixera la section, et c'est une valeur
normative à confirmer.

## Séquence de montage

| Phase | Étape | Nature |
|-------|-------|--------|
| consignation | Couper **au disjoncteur d'abonné**, condamner, vérifier l'absence de tension. **L'interrupteur du tableau ne suffit pas** : le circuit part du bornier, en amont de lui (R9, FR-040) | consignation |
| **perçage** | Les colliers du tracé et les chevilles de BR-01. **Aucune traversée** — le parcours est entièrement intérieur. **Aucun trou dans les deux boîtes traversées** : elles doivent arriver percées au bon nombre d'entrées | pose |
| boîtes | **Rien à poser.** Vérifier que les deux boîtes traversées sont aux bons modèles et portent le repérage nommant la borne — dernier moment où un mauvais modèle se remplace sans rien redéposer | pose |
| colliers et tubes | Clipser les colliers, emboîter les trois conduits, **en propre** | pose |
| tirage | Tirer les trois conducteurs, **d'un seul tenant** du tableau à la borne | pose |
| **connexions** | **Rien à raccorder** — les conducteurs traversent les deux boîtes sans y être coupés. Constater qu'ils sont continus avant de refermer | pose |
| appareillage | Poser et raccorder BR-01 | pose |
| **tableau** | **Câbler le départ en dernier.** Protection et différentiel **sur le bornier**, en amont du type AC, plus le **module 6 mA** si c'est la voie retenue (FR-042). **Repérer le tableau** : ce départ n'est pas coupé par l'interrupteur différentiel | pose |
| essais hors tension | Continuité du PE, terre, isolement, serrage, repérage | vérification |
| levée | Lever la consignation | levée |
| essais sous tension | Déclenchement du différentiel, **charge de quatre heures** | vérification |

*Ordre arrêté par le maître d'ouvrage le 2026-09-22. Pour ce circuit, deux phases n'ont rien à
faire — « boîtes » et « connexions » — et c'est un résultat, non un oubli : la ligne n'a aucune
dérivation, donc aucune boîte propre et aucune connexion intermédiaire. Les deux étapes existent
quand même, parce que « ne rien raccorder ici » est la consigne la plus facile à enfreindre.*

**Le tirage d'un seul tenant est une exigence, non une commodité** : c'est ce qui garantit
l'absence de connexion dans les deux boîtes traversées, et donc la première condition du
Principe IV amendé.

## Ce qui n'est pas dans ce document

La **restriction d'usage** (FR-012, FR-031 à FR-035) n'a pas d'implantation : elle ne se pose pas
au mur. C'est la seule entité de cette fonctionnalité dont le respect ne se vérifie par aucun
essai, et elle est traitée à la note de calcul et au dossier final.
