# Spec Delta

## ADDED Requirements

### Requirement: Géométrie de perçage d'une traversée

*On ne perce pas une intention. La pente était déclarée par un booléen, et un booléen ne dit
ni où entrer, ni où sortir, ni de combien descendre.*

Une traversée de paroi DOIT déclarer sa **géométrie de perçage** : le point d'entrée sur le nu
intérieur, le point de sortie sur le nu extérieur, et le **dénivelé** entre les deux.

Le dénivelé DOIT être une cote, et non un sens. Une traversée qui déclare descendre vers
l'extérieur sans dire de combien n'est pas perçable : deux personnes en tireraient deux angles
différents, et l'une des deux annulerait la pente.

La géométrie DOIT être **contrainte par l'épaisseur de la paroi et par la hauteur du boîtier**
qui reçoit la traversée. Sur 0,20 m de béton, un boîtier d'appareillage offre 5 à 6 cm de jeu
en altitude : c'est cette réserve qui borne le dénivelé praticable, et elle DOIT être écrite
plutôt que laissée au geste.

Tant que le dénivelé n'est pas arrêté, il DOIT rester inconnu, et NE DOIT PAS être présumé nul
— un dénivelé nul est précisément la faute que la pente existe pour écarter.

#### Scenario: Traversée perçable
- **WHEN** une traversée est déclarée
- **THEN** elle porte son point d'entrée, son point de sortie et son dénivelé, et non le seul sens de sa pente

#### Scenario: Dénivelé non arrêté
- **WHEN** le dénivelé d'une traversée n'est pas arrêté
- **THEN** il reste inconnu dans les données, et n'est pas présumé nul

#### Scenario: Réserve du boîtier
- **WHEN** une traversée débouche dans le fond d'un boîtier
- **THEN** son dénivelé tient dans la réserve d'altitude que ce boîtier offre, et cette réserve est écrite

### Requirement: L'entraxe des colliers est une donnée produit

*Le projet a toujours refusé de l'arrêter — « l'entraxe est une donnée du fabricant, pas une
cote de projet ». Ce changement ne revient pas là-dessus : il en fait un paramètre déclaré au
lieu d'un vide.*

L'**entraxe des colliers** NE DOIT PAS être une cote de projet. Il DOIT être déclaré comme une
donnée produit, renseignée une fois le collier choisi, et le nombre comme la répartition des
fixations en DÉCOULENT.

Il en va de même de la **cheville retenue**, qui commande le diamètre et la profondeur de
perçage.

Tant que l'un ou l'autre n'est pas renseigné, ce qui en dépend DOIT rester inconnu. Un guide
de perçage DOIT alors donner les positions qu'il connaît et **taire les diamètres**, plutôt que
de proposer une valeur courante.

#### Scenario: Entraxe non renseigné
- **WHEN** l'entraxe des colliers n'est pas renseigné
- **THEN** le nombre et la position des fixations restent inconnus, et aucune valeur courante ne leur est substituée

#### Scenario: Cheville non choisie
- **WHEN** la cheville n'est pas choisie
- **THEN** le diamètre et la profondeur de perçage restent inconnus, et le guide donne les positions sans les diamètres

### Requirement: Répartition des colliers

*Un collier ne se pose pas n'importe où, et ces règles ne vivaient nulle part.*

La répartition des colliers le long d'un cheminement DOIT respecter les règles suivantes :

- un collier près de **chaque extrémité** de segment, la portée libre en bout étant la plus
  sollicitée ;
- **aucun collier sur un changement de direction** : un coude se traite par un accessoire, et
  serrer un collier dessus le déforme ;
- **aucun collier au droit d'une enveloppe** — boîte, organe de connexion, accessoire — ni
  d'une traversée : il n'y a rien à y brider et la place est prise ;
- les colliers intermédiaires **répartis régulièrement**, sans dépasser l'entraxe déclaré.

La répartition est **dérivée**, non déclarée point par point. Coter le trente-septième collier
donnerait une précision que personne ne reporte au chantier, et que la moindre révision de
tracé rendrait fausse.

#### Scenario: Extrémités de segment
- **WHEN** un segment de cheminement est équipé
- **THEN** il porte un collier près de chacune de ses extrémités

#### Scenario: Collier sur un obstacle
- **WHEN** la répartition tombe sur un coude, une enveloppe ou une traversée
- **THEN** aucun collier n'y est posé, et la répartition se reprend de part et d'autre

## MODIFIED Requirements

### Requirement: Traversée de paroi étanche et en pente

*Origine : `002-prises-de-courant` FR-028 et FR-055 ; `003-eclairage` FR-024.
Critère mesurable : SC-014. Étendu : la pente devient une cote, la géométrie de perçage étant
désormais exigée.*

PC-02 et PC-04 DOIVENT être alimentés par une **traversée** des 0,20 m de béton,
étanche et présentant une pente vers l'extérieur.

Les deux traversées se trouvant désormais à 0,30 m, soit près du niveau du sol
extérieur, la **pente vers l'extérieur** devient déterminante et non plus
seulement souhaitable. L'implantation DOIT en outre vérifier que le point de percement reste
au-dessus du niveau fini du sol extérieur au droit de chaque traversée.

EL-02 et EL-03 étant extérieurs, leur alimentation DOIT emprunter une **traversée
de paroi** étanche et présentant une pente vers l'extérieur. Une traversée NE DOIT PAS être
percée au droit d'un boîtier en saillie **qu'elle ne dessert pas**. Elle PEUT en revanche
sortir par le **fond** d'un boîtier qu'elle dessert — socle, boîte de dérivation ou boîtier de
commande — auquel cas le percement DOIT précéder la pose de ce boîtier, et la connexion se
faire à l'intérieur de son enveloppe.

La pente DOIT être portée par une **géométrie de perçage** et non par le seul sens : un sens
se contrôle après coup, une cote se perce.

#### Scenario: Contrôle de la pente à l'eau
- **WHEN** la pente d'une traversée est contrôlée à l'eau
- **THEN** elle est dirigée vers l'extérieur

#### Scenario: Niveau du sol extérieur
- **WHEN** le point de percement d'une traversée est implanté
- **THEN** il reste au-dessus du niveau fini du sol extérieur au droit de cette traversée

#### Scenario: Percement horizontal
- **WHEN** deux boîtiers dos à dos à la même hauteur d'axe invitent à percer horizontalement
- **THEN** la géométrie déclarée impose l'entrée haute et la sortie basse, et le percement horizontal se constate comme un écart à cette cote
