# Nomenclature de la borne de recharge

**Fonctionnalité**: `004-borne-recharge` | **Date**: 2026-09-22

Les quantités marquées « à arrêter » dépendent d'une valeur normative ou d'une fiche produit.
Aucune n'a été comblée par un chiffre plausible.

## Conduit et fixation

| Article | Quantité | Précision |
|---------|----------|-----------|
| Conduit **IRL 25** | **10,44 m** de tracé, entièrement en propre | Calibre **arrêté le 2026-09-22** (décision du maître d'ouvrage). La bande contrainte de la porte de service admettait jusqu'à l'IRL 32 inclus (R1) ; l'IRL 25 y est. ⚠️ **Vérifier `D ≥ 3d` sur les fiches produit avant de commander** : avec trois conducteurs de 10 mm², la marge est de quelques dixièmes de millimètre (note § 3.1) |
| Section du conduit | condition exacte `D ≥ 3d` pour trois conducteurs | À lire sur deux cotes de fiche produit. Voir la note de calcul |
| dont parcours **extérieur** | **aucun** | Seule ligne du projet entièrement intérieure. `TODO(CONDUIT_EXTERIEUR)` est sans objet ici |
| dont parcours **partagé** | **aucun** | Le Principe IV l'exige, et c'est ce qui dispense ce circuit de tout facteur de groupement |
| Colliers de fixation | à raison de l'entraxe préconisé par le fabricant | Donnée produit, non cote de projet |
| **Chevilles adaptées au béton** | une par collier, plus les fixations de BR-01 | Voir ci-dessous |
| Coudes et accessoires | **5 changements de direction** : 1 sur CH-B1 à la sortie du tableau, 4 sur CH-B3 — l'angle nord-est, le haut et le bas de la descente, et le pied du parcours sous allège | Un changement de direction se traite par accessoire, jamais par pincement du tube |

## Conducteurs

| Article | Quantité | Précision |
|---------|----------|-----------|
| Conducteur isolé **10 mm²** | `3 × 10,48 m`, soit **31,44 m** minimum | Phase, neutre, protection. Section **arrêtée le 2026-09-22**. **Conducteurs isolés, non un câble 3G10** : un câble ne passe dans aucun calibre que la bande contrainte admet (note § 3.1). Longueur du chemin électrique, boîtes comprises. Majorer des longueurs de raccordement au tableau et à la borne |
| Repères de conducteur | 3, pour les identifier à l'ouverture des deux boîtes traversées | Exigé par la troisième condition du Principe IV amendé |

**Les conducteurs se tirent d'un seul tenant**, du tableau à la borne. Ce n'est pas une facilité
de pose : c'est ce qui garantit qu'aucune connexion de la borne n'est faite dans une boîte
partagée.

## Appareillage et protections

| Article | Quantité | Précision |
|---------|----------|-----------|
| **BR-01**, borne 32 A monophasée ≈ 7,4 kW | 1 | Indice de protection **à arrêter** : parois froides, condensation probable (FR-022). Le coffret DOIT tenir sous 1,00 m de haut pour passer sous l'allège |
| Protection contre les surintensités | 1, calibre **à arrêter** | Normative, appariement avec la section |
| **Dispositif différentiel dédié** | 1, 30 mA, type **A ou F à arrêter** | Monté **sur le bornier**, en amont de l'interrupteur de type AC existant (R9). Le type est un choix économique, non normatif (R10) |
| **Dispositif de détection 6 mA** | 1 — **intégré à la borne, ou module distinct au tableau** | La voie est à arrêter (FR-042, T009). **Aucun type de différentiel n'en dispense.** C'est la seule pièce dont dépend une exigence non négociable |
| Étiquettes de repérage | tableau, BR-01, **et les deux boîtes traversées** | Doivent nommer le circuit de la borne et porter qu'il n'est pas coupé par l'interrupteur du tableau (FR-040) |
| Support de rangement du câble | 1 | Hors du passage du véhicule et hors zone de ruissellement (FR-007) |

## Ce que cette fonctionnalité impose à `002-prises-de-courant`

Deux boîtes déjà posées par le circuit des prises changent de modèle. **Elles doivent être
achetées aux bons modèles dès leur pose** : les remplacer ensuite voudrait dire tout redéposer.

| Boîte | Modèle exigé | Pourquoi |
|-------|--------------|----------|
| BD-02 | **5 entrées**, ≥ **0,132 m** de côté | La montée de la borne y franchit l'altitude du tronc |
| BD-01 | **6 entrées**, ≥ **0,112 m** de côté, plus la traversée en fond | La ligne y franchit CH-04 |

Les deux cotes ont été **dérivées du majorant de diamètre**, l'IRL 32, et non d'un calibre supposé. *Le calibre étant arrêté à l'IRL 25 depuis le 2026-09-22, elles gardent de la marge et ne sont pas à reprendre :*
elles valent donc quel que soit le calibre que la note de calcul retiendra, et les boîtes peuvent
être achetées avant que la section soit arrêtée.

**Un nombre d'entrées n'est pas un volume.** Le volume intérieur de BD-01 doit être établi à part,
pour les huit conducteurs de 1,5 et 2,5 mm² des deux autres circuits **plus** les trois de la
borne (FR-038).

## Les chevilles

Le support est du **béton non isolé**, et c'est ce qui a imposé la pose apparente dès la
constitution. La nature des chevilles retenues DOIT figurer au dossier final (FR-023) : elle
conditionne la tenue de la borne, dont le coffret est le plus lourd de l'installation et porte en
outre le poids du câble de charge en usage.

## Ce qui n'est pas au métré

La **restriction d'usage** (FR-012, FR-031 à FR-035) n'est ni un article ni une pièce. C'est la
seule « entité » de cette fonctionnalité qui ne se pose pas au mur, et la seule dont le respect ne
se vérifie par aucun essai. Elle figure à la note de calcul et au dossier final.

---

**La liste totale des fournitures**, tous circuits confondus, est dans
[`dossier/fournitures.md`](../fournitures.md). Elle est **générée** — `npm run fournitures` —
et c'est elle qui donne les quantités à commander : trois nomenclatures tenues séparément
ne s'additionnent pas, la longueur de conducteur d'un tronc partagé dépendant du nombre de
fils que chaque circuit y met. Le présent document reste la référence de **détail**.
