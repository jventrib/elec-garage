# Contrat — contenu obligatoire de la note de calcul

Ce document ne contient pas la note de calcul : il énonce ce que la note **doit** contenir pour
satisfaire le Principe III de la constitution, et comment y distinguer ce qui est calculé de ce
qui est lu dans la norme.

## Par circuit, sept lignes obligatoires

Le Principe III exige que chaque circuit soit documenté avec le courant d'emploi, le mode de
pose, le courant admissible, le calibre de protection, la longueur et la chute de tension
calculée. À quoi l'amendement v1.3.0 ajoute le taux de remplissage et les facteurs de
correction.

| Grandeur | Origine attendue |
|----------|------------------|
| Courant d'emploi | Décision d'usage, à partir des charges de FR-022 |
| Mode de pose | Donnée figée : apparent sous conduit IRL |
| Courant admissible du conducteur | **Norme** — table, pour ce mode de pose et la lettre de sélection |
| Facteurs de correction appliqués | **Norme** — température ambiante ; **et groupement, devenu exigible** par la mutualisation du tronc de 7,95 m avec l'éclairage |
| Calibre de protection | **Norme** — appariement avec la section |
| Longueur du chemin le plus long | Calculée par le socle sur le tracé réel |
| Chute de tension, terminale et cumulée | Calculée : ΔU = 2ρLI/S, cumulée avec l'arrivée |

## Trois vérifications obligatoires en plus

| Vérification | Origine attendue |
|--------------|------------------|
| Taux de remplissage du conduit | Occupation géométrique **calculée** ; la règle du tiers est une **règle de l'art**, pas une clause : à citer comme telle |
| Décompte des prises | Huit **calculé** — un socle double compte pour **deux** prises ; limite **normative** |
| Résistance maximale de la prise de terre | `R ≤ 50 / IΔn` — calcul simple, seuil de tension normatif |

## Chaque valeur porte son origine et son état

C'est l'exigence qui rend la note opposable. Toute grandeur doit être accompagnée de :

- son **origine** : `calculée`, `décidée`, ou `normative` ;
- pour une valeur normative, sa **référence de clause** ;
- son **état de confirmation** : une valeur normative sans référence vérifiée est marquée
  **à confirmer** et n'est pas opposable, conformément au Principe I.

Une valeur trouvée dans un guide de fabricant, un mémento d'installateur ou une recherche en
ligne est une **source secondaire**. Elle a sa valeur — c'est ce que la plupart des
installateurs emploient — mais elle n'est pas le texte, elle peut être périmée d'un amendement,
et elle ne constitue pas la référence de clause qu'exige le Principe I. Une telle valeur se
consigne avec sa source et reste marquée **à confirmer**.

Une valeur normative renseignée « de mémoire » est proscrite. Un chiffre plausible sur une
grandeur de sécurité est plus dangereux qu'une case vide : il a l'apparence d'une vérification
sans en être une.

## Ce que la note doit conclure explicitement

- Le circuit unique de FR-020 **admet-il** le compresseur de FR-044 sans que FR-024 s'applique ?
- Le décompte de **huit prises** **tient-il** dans la limite pour 2,5 mm² et le calibre retenu ?
- La condition `IB ≤ In ≤ Iz` **est-elle** satisfaite avec le courant admissible du mode de pose
  **réel** — conducteurs en conduit, catégorie B1 — et non celui d'un câble en saillie ?
- Si le calibre est de 20 A, **quelle marge** reste-t-il face à un courant admissible du même
  ordre ? La note doit le dire, pas l'éluder.
- Le taux de remplissage de l'IRL 20 **est-il** respecté avec les conducteurs retenus (FR-036) ?
- La chute de tension cumulée **reste-t-elle** sous 5 % au point le plus éloigné ?
- Le type de différentiel retenu **satisfait-il** le Principe II, compte tenu de la décision
  FR-050 sur l'interrupteur de type AC existant ?

## Où les conclusions vivent

Les valeurs conclues sont portées par l'**entité circuit** de
`data/apports/002-prises-de-courant.json`, conforme au contrat d'apport de
`001-visualisation-3d`. La note porte le raisonnement, pas une seconde copie des valeurs : une
conclusion n'existe qu'à un seul endroit.
