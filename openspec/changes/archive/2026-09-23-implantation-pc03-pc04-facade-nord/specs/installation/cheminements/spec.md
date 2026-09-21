# Spec Delta

## MODIFIED Requirements

### Requirement: Traversée derrière le boîtier du socle intérieur

*Origine : `002-prises-de-courant` FR-029, FR-057, FR-058, FR-059, FR-060.
Critère mesurable : SC-018. Révisé le 2026-09-23 : la règle était écrite pour deux boîtiers dos
à dos sur la paroi est ; PC-03 et PC-04 sont passés en façade nord, et elle vaut pour les deux
parois.*

La traversée desservant un socle extérieur DOIT être percée **derrière le
boîtier du socle intérieur** qui lui fait dos, et déboucher dans le fond de ce boîtier. Le
conducteur est alors repiqué sur les bornes du socle intérieur, et aucun conduit ne chemine
à l'extérieur.

Elle DOIT franchir **la paroi sur laquelle le boîtier intérieur est posé**. Un boîtier posé sur
une paroi ne peut pas laisser sortir par son fond une traversée d'une paroi perpendiculaire :
déplacer un socle extérieur d'une façade à l'autre emporte donc le socle intérieur qui le
dessert, ou impose un conduit extérieur que SC-018 interdit.

Les boîtiers saillie de PC-01 et PC-03 DOIVENT comporter une **entrée en fond**
utilisable. C'est la condition de cette exigence, et elle est **confirmée** par le maître
d'ouvrage au 2026-09-21 sur les boîtiers retenus.

Le percement DOIT être exécuté **en biais vers le bas** : entrée haute dans le
boîtier intérieur, sortie basse dans le boîtier extérieur. Deux boîtiers dos à dos étant à la
même hauteur d'axe, un percement **horizontal** est le geste le plus naturel et c'est
précisément la faute à éviter — il annulerait la pente vers l'extérieur. La hauteur d'un
boîtier offre 5 à 6 cm de jeu sur les 0,20 m de paroi, ce qui suffit largement.

Le percement DOIT être exécuté **avant** la pose du boîtier intérieur. Une fois le
boîtier fixé, son fond n'est plus accessible à la scie cloche.

PC-01 et PC-03 étant des points de **repiquage**, chacune de leurs bornes DOIT
accepter sans contrainte le conducteur entrant et le conducteur sortant en 2,5 mm². La
vérification est à faire à la pose. Conséquence assumée : déposer PC-01 ou PC-03 interrompt
l'alimentation du socle extérieur qui lui fait dos.

#### Scenario: Aucun conduit extérieur
- **WHEN** les cheminements extérieurs sont recensés
- **THEN** aucun conduit ne chemine à l'extérieur du local, les deux socles extérieurs étant alimentés par une traversée débouchant dans le fond du boîtier intérieur

#### Scenario: Ordre des gestes
- **WHEN** la traversée d'un socle extérieur est percée
- **THEN** le percement précède la pose du boîtier intérieur, et il est exécuté en biais vers le bas

#### Scenario: Socles sur deux parois différentes
- **WHEN** un socle intérieur et le socle extérieur qu'il dessert sont posés sur des parois perpendiculaires
- **THEN** le montage est refusé : la traversée ne peut pas sortir du fond d'un boîtier d'une autre paroi
