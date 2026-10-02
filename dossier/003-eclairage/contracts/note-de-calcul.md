# Contrat — contenu obligatoire de la note de calcul de l'éclairage

Ce document ne contient pas la note de calcul : il énonce ce qu'elle **doit** contenir pour
satisfaire le Principe III, et comment y distinguer ce qui est calculé de ce qui est lu dans la
norme. Il reprend le contrat de `002-prises-de-courant` et n'en retient que les différences.

## Ce qui change par rapport au contrat des prises

| Point | Prises | Éclairage |
|-------|--------|-----------|
| Limite de chute de tension | 5 % | **3 %** — l'arrivée en consomme déjà 1,65 % |
| Alimentation des points | un socle, un point d'arrivée | une **réglette pontée** : un point d'arrivée et deux points d'alimentation ; la chute se lit au **point d'utilisation**, au connecteur par lequel l'installation rejoint l'appareil — le lien interne de 1,20 m est dans l'appareil et n'est pas compté |
| Section | 2,5 mm² | 1,5 mm² |
| Groupement | **exigible** sur le tronc partagé de 7,96 m | **exigible, au même titre** (R1) — la mutualisation a rendu cette ligne obligatoire des deux côtés ; elle était portée « sans objet » tant que chaque circuit avait son conduit |
| Décompte normatif | nombre de **prises** | nombre de **points d'éclairage** (FR-018) |
| Hauteur d'axe normative | socles | **dispositifs de commande** (FR-031) |

## Par circuit, les sept lignes obligatoires du Principe III

| Grandeur | Origine attendue |
|----------|------------------|
| Courant d'emploi | Décision d'usage, à partir de l'hypothèse de simultanéité de FR-019 |
| Mode de pose | Donnée figée : apparent sous conduit IRL, **partagé sur tronc commun** — `c-eclairage` partage CH-L1 avec `c-prises`, et CH-L3 / CH-L4 / CH-L6 / CH-L2 sont **dédiés** à l'éclairage |
| Courant admissible du conducteur | **Norme** — table, pour ce mode de pose et la lettre de sélection |
| Facteurs de correction appliqués | **Norme** — température ambiante ; **groupement exigible** sur le tronc partagé (R1). Le nombre de circuits à compter est un **donnée du tracé**, pas un choix de la note : il vaut 3 sur CH-L05, 8 sur CH-L1, 7 sur CH-L07, et **3 sur chaque branche du plafond** |
| Calibre de protection | **Norme** — appariement avec la section |
| Longueur du chemin le plus long | Calculée par le socle sur le tracé réel |
| Chute de tension, terminale et cumulée | Calculée sur la **forme exacte** : ΔU = ρ·I·(L_phase + L_neutre)/S, cumulée avec l'arrivée. `2ρLI/S` n'est qu'un majorant, recevable pour un point non commuté — et depuis le pontage des réglettes, plus aucun point du plafond ne l'est |

## Trois vérifications obligatoires en plus

| Vérification | Origine attendue |
|--------------|------------------|
| Taux de remplissage du conduit | Occupation géométrique **calculée**. La règle du tiers est une **règle de l'art**, non une clause : à citer comme telle. La condition exacte pour n conducteurs est `D ≥ d·√(3n)` |
| Décompte des points d'éclairage | **Calculé** ; la limite est **normative** |
| Résistance maximale de la prise de terre | `R ≤ 50 / IΔn` — calcul simple, seuil de tension normatif |

## Ce que la note doit conclure explicitement

- L'**hypothèse de simultanéité** retenue, écrite et justifiée (FR-019, SC-007). C'est la seule
  question réelle de cette note : la chute terminale étant négligeable, c'est l'hypothèse qui
  porte tout le raisonnement.
- Le décompte des points **tient-il** dans la limite normative pour un circuit d'éclairage ?
- La condition `IB ≤ In ≤ Iz` est-elle satisfaite avec l'`Iz` du mode de pose **réel** —
  conducteurs isolés en conduit, catégorie B1 — et non celui d'un câble en saillie ?
- Le taux de remplissage est-il respecté sur les **deux** portions : le tronc partagé, jusqu'à
  **neuf** conducteurs sur CH-05, et le calibre retenu sur les branches propres à trois
  conducteurs ? *Et que dit-on d'un cordage, qui ne déclare pas de section et ne peut donc pas
  être vérifié ? La note doit le dire plutôt que de le passer sous silence.*
- La chute de tension cumulée reste-t-elle sous **3 %** ?
- Le type de différentiel retenu satisfait-il le Principe II, compte tenu de la décision FR-050
  de `002` et du fait que ce circuit alimente **un détecteur de présence électronique** — donc
  une charge à découpage, que le Principe II désigne nommément ?

Cette dernière question est plus aiguë ici que pour les prises. Un interrupteur différentiel de
**type AC** ne détecte pas les composantes continues pulsées ; le détecteur de présence en
produit par construction, et il est **alimenté en permanence** (FR-042). La décision FR-050 n'est
donc pas seulement reportée : elle est plus contraignante que lorsqu'elle a été posée.

## Deux réglages à consigner, qui ne sont pas des calculs

Le Principe V exige que ce qui n'est pas consigné soit réputé non fait. Deux réglages de chantier
en relèvent, et la note doit leur réserver leur place :

- le **champ de détection** de CM-02, réglé pour ignorer la voie publique et la propriété
  voisine (FR-040, SC-017) ;
- la **temporisation d'extinction** retenue, et la vérification que le réglage effectif y
  correspond (FR-041, SC-018).

## Chaque valeur porte son origine et son état

Sans changement par rapport à `002` : origine `calculée`, `décidée` ou `normative` ; pour une
valeur normative, sa **référence de clause** ; et son **état de confirmation**. Une valeur
normative sans référence vérifiée est marquée **à confirmer** et n'est pas opposable.

Une valeur renseignée « de mémoire » est proscrite. Un chiffre plausible sur une grandeur de
sécurité est plus dangereux qu'une case vide : il a l'apparence d'une vérification sans en être
une.

## Où les conclusions vivent

Les valeurs conclues sont portées par l'**entité circuit** de
`data/apports/003-eclairage.json`. La note porte le raisonnement, pas une seconde copie des
valeurs : une conclusion n'existe qu'à un seul endroit.
