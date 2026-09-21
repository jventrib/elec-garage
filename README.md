# Électricité Garage — visualisation 3D et guide de montage

Maquette 3D du garage, dans le navigateur, qui sert aussi de notice de montage à
l'installateur : le montage se parcourt étape par étape, en avant comme en arrière.

## Commandes

Développement — sert le dépôt sur <http://localhost:8080> :

```bash
npm run serve
```

Le serveur annonce au démarrage la version du code qu'il sert depuis le disque, et
la page l'affiche en cas d'échec. Si les deux diffèrent, le navigateur exécute un
module en cache : **relancez sur un autre port**, ce qui change d'origine et vide
le cache de modules.

```bash
node build/serveur.mjs 8099
```

Le serveur de développement (`build/serveur.mjs`, sans dépendance) sert tout en
`Cache-Control: no-store`. C'est délibéré : un seul module ES périmé dans le cache
du navigateur suffit à produire une panne incompréhensible — par exemple un
`chargement.js` d'avant un changement de signature chargé avec un `main.js`
d'après. Un rechargement simple prend donc toujours l'état réel du dépôt.

Livrable chantier — produit `dist/garage.html` :

```bash
npm run build
```

Livrable de **démonstration**, à la place des apports réels — pour exercer le socle sans
dépendre d'une conception en cours :

```bash
node build/bundle.mjs --demo
```

> Le drapeau **remplace** les apports réels, il ne s'y ajoute pas. Le jeu de démonstration
> décrit le même circuit que `002-prises-de-courant` à des cotes voisines : empilés, leurs
> conduits se croiseraient et la règle V17 signalerait des jonctions inexistantes.

Tests de la logique pure :

```bash
npm test
```

> Les commentaires sont volontairement hors des blocs de commande : un `#` collé en
> fin de ligne est transmis par npm au script appelé, qui le prend pour un
> argument.


## Pourquoi un fichier unique, et pas un site

C'est la contrainte la plus structurante du projet, et celle qu'on redécouvre le
plus volontiers à ses dépens.

Un navigateur **refuse de charger un module ES depuis `file://`** — l'origine y est
opaque et le contrôle d'origine échoue — et refuse de même un `fetch()` vers un
fichier voisin. Or une tablette sur un chantier ne fait pas tourner de serveur, et
le réseau peut être absent. `npm run build` produit donc `dist/garage.html` :
script, styles et données en ligne dans un seul fichier, ouvrable par double-clic.

Trois conséquences à connaître avant de modifier quoi que ce soit :

- **Ouvrir `index.html` directement depuis le disque échoue**, et c'est normal. En
  développement, passer par `npm run serve`.
- **Aucun fichier annexe ne peut être chargé à l'exécution** : pas de texture, pas
  de police téléchargée, pas de modèle 3D importé. La géométrie est procédurale et
  les matériaux sont à plat. Cela tombe bien : la maquette vise la lisibilité, pas
  le photo-réalisme.
- **three.js est vendorée** dans `vendor/three/` et ne doit pas être remplacée par
  un CDN : ce serait une dépendance à un service tiers en ligne, que la
  spécification interdit, et la fin du fonctionnement hors réseau.

Le bundler garde chaque fichier dans sa propre fonction plutôt que de tout
concaténer : `three.core.js` et `three.module.js` déclarent chacun des privés de
même nom (`_m1`, `_v0`, `_id`…) qui s'écraseraient dans une portée commune. Il
vérifie ensuite le fichier réellement écrit, en le ré-analysant et en l'évaluant
hors ligne.

## Organisation

**Rien de ce que le projet décrit ne vit dans le code.** Quatre fichiers de socle,
plus un fichier par fonctionnalité électrique :

| Fichier | Contenu |
|---------|---------|
| `data/local.json` | Le relevé géométrique. L'emprise extérieure est calculée, jamais saisie. |
| `data/chantier.json` | Phases de chantier ordonnées, natures d'étape, vérifications du Principe V |
| `data/types-composants.json` | Gabarits d'encombrement et libellés des types de composants |
| `data/presentation.json` | Couleurs, opacités, éclairage, caméra, vues prédéfinies, libellés |
| `data/apports/<NNN-nom>.json` | Les circuits, composants, **cheminements**, **traversées** et étapes d'une fonctionnalité |

Ajouter un point d'utilisation, un cheminement, une étape, une phase de chantier,
un type de composant ou une vue ne demande de toucher à aucun fichier de `src/`.
Un test le vérifie mécaniquement, en relisant les sources à la recherche de
gabarits, de couleurs, de libellés ou de listes de phases figés.

## La pose est apparente

Les parois sont en béton non isolé, sans vide technique : rien n'est encastré. Les
conducteurs cheminent en conduits IRL fixés en saillie, avec une boîte de
dérivation à chaque jonction. Trois conséquences dans le code :

- **`src/geometrie/` décide, `src/scene/` dessine.** L'orthogonalité d'un segment,
  la continuité d'un circuit et l'intersection avec un obstacle sont des questions
  à réponse vraie ou fausse, testées sans navigateur. Un conduit dessiné en
  diagonale se remarque ; un circuit dont la continuité est rompue de trois
  millimètres ne se remarque pas.
- **Une jonction de trois conduits ou plus doit porter une boîte.** La règle se
  réduit à un comptage d'arêtes dans le graphe, y compris pour un piquage au
  milieu d'un conduit. Sans boîte, la connexion serait inaccessible, donc
  invérifiable à vie.
- **Le contrôle de collision rend trois verdicts, jamais deux** : conforme, en
  collision, ou **non concluant**. Ce dernier dès que l'obstacle n'est pas relevé,
  et l'interface le dit au lieu de répondre « pas de collision ».

  Un obstacle peut aussi n'être ni relevé ni inconnu, mais **borné**. Le tablier de
  la porte sectionnelle en position ouverte n'est pas mesuré ; il est pourtant
  encadré par trois cotes qui le sont — la largeur de la baie, la course du rail
  qui le guide, et la hauteur de passage qu'il dégage. Un tel majorant n'autorise
  qu'un seul verdict : en être disjoint prouve le dégagement, le recouper ne prouve
  rien. L'asymétrie est le point entier de la chose, car elle fait payer
  l'imprécision d'un détour de conduit et jamais d'un conduit posé dans la porte.

- **Une réserve se lit sur l'objet qu'elle concerne.** Les obstacles sont
  sélectionnables : cliquer l'un d'eux ouvre sa fiche, qui dit l'état de sa cote,
  ce qui lui manque, ce qui est réellement dessiné pour lui, et ce que les
  contrôles concluent à son sujet. L'en-tête ne porte qu'un compte.

  C'est une correction de fond, pas de présentation. Ces réserves avaient d'abord
  été entassées dans un bandeau permanent au-dessus de la maquette, faute d'objet
  où les poser — et un avertissement qui masque ce qu'on est venu regarder finit
  par être ignoré, ce qui le rend pire qu'absent. Rétrécir le bandeau ne traitait
  que le symptôme : ce qui manquait était la possibilité de désigner un obstacle.

Le diamètre d'un conduit reste `null` tant que la note de calcul ne l'a pas arrêté.
Il est alors dessiné à un diamètre conventionnel, et sa fiche affiche « inconnu » :
le dessin est une convention, la donnée reste déclarée absente.
- `src/donnees/`, `src/sequence/` — logique pure, testée sans navigateur : c'est ce
  qui peut être faux sans que cela se voie à l'écran.
- `src/scene/`, `src/ui/` — rendu et interface, validés par les scénarios visuels
  de `dossier/001-visualisation-3d/quickstart.md`.

## Documents

- Constitution du projet : `openspec/constitution.md`
- Spécifications vivantes, par capacité : `openspec/specs/`
  - `maquette/visualisation`, `maquette/socle-et-apports`
  - `installation/points-utilisation`, `installation/electricite`,
    `installation/cheminements`, `installation/automatisation`
- Travaux en cours : `openspec/changes/`
  - `reserves-maitre-ouvrage` — relevés, valeurs normatives et décisions qui bloquent
    le chantier
  - `automatisation-locale-mise-en-oeuvre` — le seul reste-à-faire constructible
- Dossier du projet : `dossier/00N-*/` — notes de calcul, nomenclatures, implantations,
  recherches, modèles de données et scénarios de recette. Ce sont des documents **vivants**,
  cités par des tâches ouvertes, et la source des valeurs que les spécifications citent.
  `dossier/fournitures.md` y est **généré** par `npm run fournitures`.
- Les artefacts Spec Kit eux-mêmes — `spec.md`, `plan.md`, `tasks.md`, `checklists/` — ont été
  supprimés le 2026-09-22 : `openspec/specs/` les remplace.
