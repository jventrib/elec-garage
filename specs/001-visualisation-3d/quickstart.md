# Phase 1 — Guide de lancement et de validation

**Fonctionnalité**: `001-visualisation-3d` | **Date**: 2026-09-21 (révisé)

Ce guide dit comment lancer la visualisation et comment prouver qu'elle satisfait ses critères
de succès. Il ne contient pas de code d'implémentation : celui-ci relève de `tasks.md` et de la
phase de réalisation.

---

## Prérequis

- Node.js récent, pour les tests et pour la construction du fichier chantier. Node sert
  d'outil de développement, il n'est **pas** une dépendance d'exécution.
- Un navigateur à moteur WebGL.
- Pour la validation chantier : une tablette ou un téléphone, et de quoi y transférer un
  fichier.

Rien d'autre. Pas de gestionnaire de paquets à peupler, pas de service à démarrer : three.js
est vendorée dans `vendor/three/`, conformément à R1 de [research.md](./research.md).

## Lancer en développement

Depuis la racine du dépôt :

```bash
npm run serve
```

Le serveur sert en `no-store`, pour qu'aucun module ES périmé ne survive à un
rechargement. Un serveur statique quelconque fait l'affaire, mais il faudra alors
vider le cache à la main après chaque modification.

Aucun commentaire n'est placé en fin de ligne de commande : npm transmet au script
tout ce qui suit le nom de la tâche, `#` compris, et le script le reçoit comme
argument.

Puis ouvrir `http://localhost:8080/index.html`.

> Le serveur statique n'est nécessaire qu'en développement, parce que `index.html` charge des
> modules ES et lit les fichiers de `data/`. Ouvrir `index.html` directement depuis le disque
> **échouera** : un navigateur refuse les modules et les lectures de fichiers depuis `file://`.
> C'est la raison d'être du fichier unique ci-dessous, et non un contournement.

## Produire le livrable chantier

```bash
node build/bundle.mjs
```

Produit `dist/garage.html` : script, styles et données en ligne dans un fichier unique,
ouvrable par double-clic, sans serveur et sans réseau.

## Lancer les tests

```bash
node --test tests/
```

Couvre l'ordonnancement, les contrôles de cohérence, la dérivation de l'état et la navigation
— tout ce qui peut être faux sans que cela se voie à l'écran (R8).

---

## Scénarios de validation

Chaque scénario est exécutable tel quel et rattaché aux critères qu'il démontre. Les scénarios
1 à 4 et 12 à 14 s'automatisent ; les autres se vérifient à l'œil ou sur l'appareil.

### 1. Cohérence des données — automatique

```bash
node --test tests/validation.test.js
```

**Attendu** : les douze règles V1 à V12 de [data-model.md](./data-model.md) passent sur les
données du dépôt. Chaque règle est en outre démontrée par un cas négatif : une étape sans
instruction, un composant orphelin, une dépendance pendante, un cycle, deux consignations,
une étape sous tension placée avant la levée. Chacun de ces jeux fautifs **doit** être rejeté.

**Couvre** : FR-026, FR-027, et par V8 la garantie de FR-013.

### 2. Ordonnancement de la séquence unique — automatique

```bash
node --test tests/ordonnancement.test.js
```

**Attendu** : à partir de deux fichiers d'apport distincts, une seule séquence sort, ordonnée
par phase puis par dépendances. Le même jeu de données produit deux fois le même ordre. Les
apports présentés dans l'ordre inverse produisent la même séquence — c'est ce qui prouve que
l'ordre ne dépend pas de l'ordre d'arrivée, comme FR-024 l'exige. La consignation et la levée
n'apparaissent qu'une fois malgré deux contributeurs.

**Couvre** : FR-023, FR-024, FR-025, SC-012, SC-013.

### 3. Navigation exacte en arrière — automatique

```bash
node --test tests/etat.test.js tests/lecteur.test.js
```

**Attendu** : pour tout rang N, l'état dérivé est identique après un aller-retour de
profondeur quelconque. La propriété est vérifiée sur l'ensemble des rangs de la séquence, et
non sur un échantillon. Aux deux extrémités, la demande d'une étape au-delà est refusée sans
erreur et sans sortie de séquence.

**Couvre** : FR-015, FR-016, FR-017, SC-002.

### 4. Reprise du curseur — automatique

```bash
node --test tests/lecteur.test.js
```

**Attendu** : une position enregistrée est restituée à l'ouverture. Une position dont
l'empreinte ne correspond plus, ou dont le rang dépasse le total, ramène au rang 1 avec
signalement. Un stockage qui lève une exception dégrade en mémoire volatile sans empêcher
l'ouverture.

**Couvre** : FR-031, SC-016.

### 5. Fidélité au relevé — visuel

Ouvrir la visualisation, afficher les cotes du local, et les comparer une à une au relevé de
la constitution : 5,60 × 5,60 en œuvre, 2,75 sous plafond, parois de 0,20, emprise 6,00 × 6,00.
Vérifier les deux baies : sectionnelle de 5,00 sur la paroi sud avec 0,40 de trumeau à l'est et
0,20 à l'ouest ; porte de service de 1,10 sur la paroi est, bord sud à 1,30 de l'angle sud-est.

**Attendu** : concordance exacte. L'emprise extérieure affichée vaut 6,00 sans avoir été
saisie nulle part.

**Couvre** : FR-001, FR-002, FR-021.

### 6. Caractéristiques et inconnues — visuel

Désigner chaque composant et lire sa fiche.

**Attendu** : référence, type, paroi, hauteur d'axe, indice de protection et circuit sont
présents. Toute valeur non déterminée s'affiche explicitement comme inconnue. Aucune valeur
plausible ne comble un vide, y compris pour les composants d'une fonctionnalité dont la note
de calcul n'existe pas encore.

**Couvre** : FR-006, FR-007, SC-003, SC-004.

### 7. Lecture d'une étape — visuel

Parcourir la séquence du début à la fin.

**Attendu** : chaque étape affiche son instruction, la liste de ce qu'elle pose, le matériel
nécessaire, son rang et le total. La vue montre l'état à l'issue de l'étape, l'ajout en pleine
couleur de circuit et l'existant en teinte atténuée, ce qui n'est pas encore posé restant
absent. À aucun moment une étape ne pose l'ouverture d'un autre document.

**Couvre** : FR-011, FR-012, FR-018, SC-001, SC-005.

### 8. Ordre de sécurité — visuel

Parcourir la séquence en surveillant la consignation.

**Attendu** : la consignation apparaît une fois, avant toute pose. Les mesures d'isolement, de
terre et de continuité se situent avant la levée de consignation ; l'essai de déclenchement
des différentiels se situe après. Aucune étape n'illustre un travail sous tension avant la
levée.

**Couvre** : FR-013, FR-014, SC-010, SC-011.

### 9. Collisions avec les ouvrants — visuel

Afficher les ouvrants en position ouverte et observer les composants.

**Attendu** : toute occultation d'un composant par le vantail de la porte de service, et toute
intrusion dans la trajectoire du tablier, se constatent à l'œil sans mesure.

**Réserve connue** : tant que `TODO(RAIL_PORTE_SECTIONNELLE)`, le débattement du vantail et le
gabarit de manœuvre du véhicule ne sont pas relevés, les obstacles concernés s'affichent comme
incertains. Le verdict attendu est alors **« non concluant »**, affiché comme tel, et **jamais
« conforme »**. Un obstacle incertain qui ressortirait vert serait une régression grave, pas un
détail d'affichage. SC-006 et SC-020 ne sont pleinement vérifiables qu'après le relevé.

**Couvre** : FR-003, FR-005, FR-038, SC-006, SC-020.

### 10. Usage chantier — sur l'appareil

Transférer `dist/garage.html` sur la tablette, **couper le réseau**, ouvrir le fichier.

**Attendu** : la visualisation s'ouvre et devient utilisable en moins de 5 secondes, sans
aucune requête réseau. Le changement d'étape se fait du premier coup avec des gants de travail.
L'écran reste lisible en extérieur. La rotation de la vue et le changement d'étape ne
produisent aucune attente perceptible.

**Couvre** : FR-028, FR-029, FR-030, SC-008, SC-009, SC-014, SC-015.

### 11. Extensibilité — manipulation

Ajouter un composant et une étape dans un fichier de `data/apports/`, puis recharger.

**Attendu** : le composant et l'étape apparaissent, la séquence se réordonne selon la phase et
les dépendances déclarées, et **aucun fichier de `src/` n'a été modifié**. Le contrôle est
direct : `git status` ne doit montrer de changement que sous `data/`.

**Couvre** : FR-020, FR-022, SC-007.

---

### 12. Géométrie des cheminements — automatique

```bash
node --test tests/cheminement.test.js
```

**Attendu** : les règles V13 à V15 passent sur les données du dépôt, et chacune est démontrée
par un cas négatif qui **doit** être rejeté :

- un segment en diagonale sur une paroi verticale, faisant varier à la fois l'abscisse et
  l'altitude ;
- un segment dont une extrémité sort des limites de la face qu'il déclare ;
- un cheminement dont une extrémité ne rejoint ni composant, ni boîte, ni traversée, ni autre
  segment, à la tolérance déclarée ;
- deux extrémités séparées d'un écart juste inférieur à la tolérance, qui **doivent** être
  tenues pour raccordées, et juste supérieur, qui **ne doivent pas** l'être.

Ce dernier cas est le plus important : c'est lui qui prouve que la tolérance est réellement
appliquée et non contournée.

**Couvre** : FR-032, FR-034, FR-042, SC-017.

### 13. Continuité de circuit et jonctions — automatique

```bash
node --test tests/graphe.test.js
```

**Attendu** : les règles V16 et V17 passent, avec leurs cas négatifs :

- un circuit dont un composant n'est atteignable depuis le tableau par aucun cheminement
  portant ce circuit — le défaut **doit nommer** le composant orphelin, pas seulement signaler
  un problème ;
- un tronçon entier de conduit détaché du tableau, que le seul contrôle « chaque composant est
  touché par un segment » laisserait passer ;
- trois segments se rejoignant en un nœud sans boîte de dérivation.

**Couvre** : FR-035, FR-042, SC-018, SC-021.

### 14. Collision à trois verdicts — automatique

```bash
node --test tests/collision.test.js
```

**Attendu** : trois verdicts distincts et jamais confondus.

- Un cheminement traversant un obstacle de volume **connu** → **en collision**.
- Un cheminement à l'écart d'un obstacle de volume connu → **conforme**.
- Un cheminement quelconque face à un obstacle `incertain` ou de `volume: null` → **non
  concluant**.

Le test **doit** échouer si le troisième cas renvoie « conforme ». C'est la seule assertion de
toute la suite qui protège contre un mensonge rassurant plutôt que contre une erreur.

**Couvre** : FR-038, FR-039, R17 de [research.md](./research.md).

### 15. Cheminements dans la séquence — visuel

Parcourir la séquence en surveillant les conduits.

**Attendu** : un cheminement apparaît à l'étape qui le pose, pas avant. Il suit les trois
registres comme un composant : absent avant, en pleine couleur de circuit à son étape, en
teinte atténuée ensuite. Un conduit dont le diamètre n'est pas arrêté est dessiné au diamètre
conventionnel, et sa fiche affiche le diamètre comme **inconnu**.

**Couvre** : FR-040, FR-012, FR-007.

### 16. Boîte de dérivation et suivi de circuit — visuel

Désigner une boîte de dérivation, puis suivre son circuit.

**Attendu** : la fiche d'une boîte est en tout point celle d'un socle — référence, type, paroi,
face, hauteur d'axe, indice de protection, circuit — avec les valeurs non déterminées marquées
comme inconnues. Le suivi du circuit emprunte le **tracé réel** des conduits, du tableau au
dernier point, en passant par chaque boîte, sans rupture et sans liaison schématique.

**Couvre** : FR-033, FR-035, FR-008, SC-018, SC-019.

## Ce que ce guide ne couvre pas

- Le dimensionnement électrique, qui n'appartient pas à cette fonctionnalité.
- Le contenu réel des apports, qui viendra de `002-prises-de-courant` puis des fonctionnalités
  d'éclairage et de borne. Tant qu'ils n'existent pas, les scénarios 1 à 4, 7 et 11 à 16
  s'exécutent sur un jeu d'apport de démonstration, explicitement identifié comme tel et exclu
  du livrable chantier. Ce jeu doit désormais comporter des cheminements, des boîtes de
  dérivation et au moins une traversée, sans quoi les scénarios 12 à 16 n'auraient rien à
  valider.
- L'étanchéité réelle des traversées et la qualification des conduits extérieurs. Le socle
  montre la position, le sens et la pente déclarée ; la conformité du produit relève de la
  nomenclature et de `TODO(CONDUIT_EXTERIEUR)`.
