# Phase 0 — Recherche et décisions techniques

**Fonctionnalité**: `001-visualisation-3d` | **Date**: 2026-09-21 (révisé)

> R1 à R10 portent le socle. R11 à R18 ont été ajoutées après l'amendement « pose en
> apparent » de la constitution v1.3.0. Aucune décision antérieure n'est renversée.

Les inconnues du Technical Context sont traitées ci-dessous. Chaque décision énonce ce qui a
été retenu, pourquoi, et ce qui a été écarté.

---

## R1 — Moteur de rendu 3D

**Decision**: three.js, vendorée dans `vendor/three/` et versionnée avec le projet.

**Rationale**: le besoin est modeste — une boîte, deux baies, quelques dizaines de marqueurs,
une caméra orbitale — mais il faut du WebGL, une caméra, un éclairage et de la sélection
d'objet au pointeur. three.js couvre tout cela sans rien imposer d'autre. Le vendoring n'est
pas une préférence : FR-028 interdit toute dépendance à un service tiers en ligne, ce qui
exclut un CDN, et FR-030 exige un fonctionnement hors réseau.

**Alternatives considered**:
- *WebGL nu* : supprimerait la dépendance, au prix d'écrire caméra, matrices et sélection à
  la main. Le coût tomberait sur la partie du projet qui n'a aucune valeur propre.
- *Babylon.js* : capable, mais nettement plus volumineux pour un besoin qui n'en exploiterait
  qu'une fraction, ce qui pèse sur le fichier unique de R2.
- *Rendu 2D isométrique* : moins cher, mais ruinerait la raison d'être de la maquette. Le
  Principe VI existe parce que les collisions se voient en volume et pas en projection.
- *CDN* : écarté sans discussion, FR-028 l'interdit.

---

## R2 — Livraison pour le chantier

**Decision**: deux modes. En développement, `index.html` avec modules ES, servi par n'importe
quel serveur de fichiers statiques. Pour le chantier, `build/bundle.mjs` produit
`dist/garage.html`, fichier unique contenant le script, les styles et les données en ligne,
ouvrable par double-clic depuis le système de fichiers.

**Rationale**: c'est la contrainte la plus structurante du projet et elle est facile à
découvrir trop tard. Un navigateur refuse de charger un module ES depuis `file://` — l'origine
y est opaque et le contrôle d'origine échoue — et refuse de même un `fetch()` vers un fichier
voisin. Une tablette sur un chantier ne fait pas tourner de serveur. Sans fichier unique,
FR-030 est irréalisable. Le bundle contourne les deux blocages d'un coup : un script classique
sans import, des données déjà en ligne, donc plus rien à charger.

**Alternatives considered**:
- *Servir le site et compter sur le cache hors ligne* : demanderait un hébergement, une
  origine sécurisée et une installation préalable sur l'appareil. FR-028 et FR-030 s'y opposent.
- *Demander à l'installateur de lancer un serveur local* : irréaliste sur tablette, et
  contraire à « sans installation préalable ».
- *Tout écrire dans un seul fichier dès le départ, sans build* : rendrait FR-020 et FR-021
  intenables, les données finissant mêlées au code.

---

## R3 — Aucun fichier annexe à l'exécution

**Decision**: géométrie entièrement procédurale, matériaux à plat, polices du système, icônes
en tracé vectoriel dans le document. Aucune texture, aucun modèle importé, aucune police
téléchargée.

**Rationale**: conséquence directe de R2. Depuis `file://`, le chargement d'une texture est
soumis au même contrôle d'origine que le reste et échoue. Cette contrainte tombe bien :
l'hypothèse de la spécification est que le rendu vise la lisibilité et non le photo-réalisme.
Un socle de prise doit être reconnaissable et situable, pas ressemblant. Les formes simples
rendent aussi FR-012 plus facile à tenir, l'ajout d'une étape se distinguant par la couleur et
l'opacité plutôt que par un détail de matière.

**Alternatives considered**:
- *Textures encodées en ligne dans le bundle* : techniquement possible, mais gonfle le
  fichier pour un gain nul au regard de l'usage.
- *Modèles 3D d'appareillage du commerce* : fidélité inutile, poids réel, et risque de laisser
  croire à un choix de matériel qui n'est pas arrêté.

---

## R4 — Format et découpage des données

**Decision**: JSON. `data/local.json` porte le relevé et appartient au socle.
`data/apports/<nom-fonctionnalité>.json` porte les composants et les étapes d'une
fonctionnalité électrique, un fichier par fonctionnalité. Les deux formes sont contractualisées
dans [contracts/](./contracts/).

**Rationale**: FR-022 demande que le socle accepte des apports sans modifier sa logique, et
FR-020 que les données ne soient pas du code. Un fichier par fonctionnalité rend
l'appartenance évidente et permet de livrer `002-prises-de-courant` sans toucher au reste.
JSON parce qu'il se lit sans outil, se valide par schéma, et s'incorpore tel quel au bundle.

**Alternatives considered**:
- *Un seul fichier de données* : ferait diverger la propriété des contenus et rendrait les
  contributions conflictuelles.
- *YAML* : plus agréable à écrire, mais impose un analyseur supplémentaire dans le bundle
  pour un bénéfice d'écriture marginal sur des fichiers courts.
- *Données en modules JavaScript* : effacerait la frontière que FR-020 demande de tenir.

---

## R5 — Dérivation de l'état plutôt que mutation

**Decision**: l'état de l'installation au rang N est une **fonction pure** du rang : l'ensemble
des composants dont l'étape d'apparition est ≤ N, et l'ensemble des étapes de rang ≤ N. Le
lecteur ne conserve qu'un entier, le rang courant. Aucune opération n'est « défaite » en
arrière.

**Rationale**: c'est la décision qui fait tenir FR-016 sans effort. Une navigation arrière
implémentée en annulant des opérations accumule les occasions de divergence, et le scénario 3
de l'histoire 2 — reculer de trois étapes puis ré-avancer et retrouver le même état — devient
une propriété à espérer. Avec un état dérivé, ce scénario est vrai par construction : le même
rang donne le même ensemble, il n'existe pas de chemin qui produirait autre chose. Le coût est
nul à cette échelle, quelques dizaines de composants se filtrant instantanément.

**Alternatives considered**:
- *Journal d'opérations avec annulation* : la solution réflexe, et la plus coûteuse à rendre
  exacte. Justifiée quand l'état est lourd à recalculer, ce qui n'est pas le cas ici.
- *Instantané mémorisé par étape* : correct mais redondant, et il faudrait l'invalider à
  chaque modification des données.

---

## R6 — Ordonnancement de la séquence unique

**Decision**: tri topologique stable sur deux clés. La **phase de chantier** d'abord, prise
dans une liste ordonnée fermée et déclarée par le socle ; les **dépendances** explicites entre
étapes ensuite, à l'intérieur d'une phase comme entre phases. À rang égal, l'ordre de
déclaration départage, ce qui rend le résultat reproductible. Un cycle ou une dépendance
pendante est un défaut de cohérence au sens de FR-026, pas une erreur silencieuse.

**Rationale**: FR-024 exige que l'ordre découle des déclarations et non de l'ordre d'arrivée
des fonctionnalités. La phase seule ne suffit pas — deux étapes de la même phase peuvent
s'ordonner entre elles — et les dépendances seules obligeraient chaque fonctionnalité à
connaître les étapes des autres, ce que FR-022 refuse. Les deux clés ensemble permettent à une
fonctionnalité de dire « mes gaines se posent en phase cheminement » sans rien savoir des
autres, tout en laissant exprimer une contrainte fine quand elle existe. La stabilité du tri
compte : une séquence qui se réordonne d'une exécution à l'autre serait indéfendable dans une
notice de montage.

**Alternatives considered**:
- *Rang numérique absolu déclaré par chaque étape* : simple, mais deux fonctionnalités
  écrites séparément entreraient en collision, et toute insertion forcerait une renumérotation.
- *Phase seule* : insuffisant pour ordonner à l'intérieur d'une phase.
- *Ordre manuel du concepteur dans un fichier maître* : replacerait la composition dans du
  travail à la main, et contredirait FR-022.

---

## R7 — Persistance du curseur

**Decision**: `localStorage`, sous une clé portant une empreinte de la séquence. Si l'empreinte
diffère de celle enregistrée, ou si la position enregistrée dépasse la longueur courante, le
lecteur ouvre à la première étape et signale que la position antérieure a été perdue. Tout
échec d'accès au stockage est rattrapé et dégrade en mémoire volatile.

**Rationale**: FR-031 ne demande qu'une position, pas un avancement de travaux, ce qui rend
la persistance triviale. Le rattrapage n'est pas de la prudence gratuite : l'accès à
`localStorage` depuis une page ouverte en `file://` n'est pas garanti uniformément d'un
navigateur à l'autre et peut lever une exception. Comme FR-031 est un confort et non une
exigence de sécurité, une dégradation silencieuse vers la mémoire volatile est le bon
comportement — perdre la reprise vaut mieux qu'une page qui ne s'ouvre pas. L'empreinte
couvre le cas de bord de la spécification : la position mémorisée qui ne désigne plus rien.

**Alternatives considered**:
- *Aucune persistance* : rejeté par la réponse à la question 3.
- *Fichier de progression exporté* : hors périmètre, et FR-031 exclut explicitement le suivi
  d'avancement.

---

## R8 — Tests

**Decision**: `node:test` et `node:assert`, sans dépendance de test. Couvrent
`src/donnees/`, `src/sequence/` et la dérivation d'état. Le rendu et l'interface se valident
par les scénarios manuels de [quickstart.md](./quickstart.md).

**Rationale**: la frontière est choisie selon ce qui peut être faux sans se voir. Un tri
topologique erroné, une dépendance circulaire non détectée, un composant orphelin, un état
mal dérivé : rien de tout cela ne saute aux yeux à l'écran, et tout cela produirait une notice
fausse suivie par un installateur. À l'inverse, un matériau mal réglé se voit en une seconde.
La bibliothèque standard suffit et évite d'installer un outil pour un projet qui tient à ne
rien installer.

**Alternatives considered**:
- *Vitest ou Jest* : confort réel, dépendance réelle, valeur marginale à cette taille.
- *Tests de rendu par comparaison d'images* : fragiles, coûteux, et sans rapport avec les
  risques identifiés.

---

## R9 — Interactions et lisibilité sur le chantier

**Decision**: Pointer Events pour unifier souris, doigt et stylet. Cibles de navigation d'au
moins 64 px de côté, au-delà des minima d'accessibilité usuels. Thème clair à fort contraste,
texte d'instruction en corps généreux. Avance et recul accessibles au clavier sur poste fixe.

**Rationale**: FR-029 impose une seule interface pour deux usages, et FR-030 impose des gants
et le plein soleil. Les recommandations courantes de taille de cible visent le doigt nu :
24 px en minimum d'accessibilité, 44 px en recommandation renforcée. Un doigt ganté est plus
large et moins précis, et l'utilisateur est debout, en mouvement, parfois une main occupée.
Viser 64 px est un choix délibérément au-delà des référentiels, justifié par SC-014 qui exige
le changement d'étape du premier coup dans 100 % des tentatives. Le fort contraste répond à la
lecture en extérieur, où un thème sombre devient illisible.

**Alternatives considered**:
- *Deux interfaces distinctes, bureau et chantier* : doublerait la surface à maintenir et
  ferait diverger les deux, pour un contenu identique.
- *Gestes tactiles pour changer d'étape* : découvrabilité faible et déclenchements
  accidentels, là où deux grands boutons ne trompent personne.

---

## R10 — Distinction de l'ajout d'une étape

**Decision**: trois registres visuels simultanés. Ce qui préexiste à l'étape est rendu en
teinte neutre atténuée ; ce que l'étape ajoute est rendu en pleine couleur de son circuit,
avec un contour de mise en évidence ; ce qui n'est pas encore posé est absent de la vue, et
non transparent.

**Rationale**: FR-012 demande de montrer l'état à l'issue de l'étape *et* de distinguer
l'ajout de l'existant, ce qui fait deux informations à porter en même temps. Trois registres
suffisent et restent lisibles au soleil. Faire disparaître le futur plutôt que l'estomper est
un choix de sécurité autant que de lisibilité : un composant fantôme visible à l'écran mais
non encore posé est exactement le genre d'ambiguïté qui conduit à raccorder trop tôt.

**Alternatives considered**:
- *Le futur en transparence* : donne le contexte, mais brouille ce qui est réellement en
  place à cet instant du chantier.
- *Mise en évidence par clignotement* : fatigant, et illisible en plein soleil.
- *Distinction par la seule couleur* : entre en conflit avec le code couleur des circuits de
  FR-008, qui occupe déjà cette dimension.

---

## R11 — La boîte de dérivation est un type de composant, pas une entité

**Decision**: ajouter `boite-derivation` au catalogue `data/types-composants.json`. Une boîte
est un composant ordinaire, avec la même structure, la même fiche, le même rang d'apparition
et les mêmes registres visuels que n'importe quel socle.

**Rationale**: FR-033 exige explicitement qu'une boîte porte « les mêmes attributs que tout
composant ». Créer une entité distincte obligerait à dupliquer la fiche, la dérivation d'état,
la sélection au pointeur et le code couleur de circuit — quatre occasions de divergence pour
zéro information supplémentaire. Le seul écart réel entre une boîte et un socle est son rôle
dans le graphe de cheminement, et ce rôle se lit sur le graphe, pas sur le composant.

**Alternatives considered**:
- *Entité `BoiteDerivation` distincte* : la lecture réflexe du texte de la spécification, et
  la plus coûteuse. Elle ferait aussi de FR-007 une règle à réappliquer au lieu d'une règle
  héritée.
- *Boîte implicite, déduite des jonctions du tracé* : séduisant, et faux. Une boîte a une
  référence, une hauteur d'axe et un indice de protection que rien ne permet de déduire d'une
  intersection de segments. Déduire la boîte reviendrait à inventer ses caractéristiques.

---

## R12 — Un segment est une paroi et deux points, pas une polyligne libre

**Decision**: un cheminement est une suite de segments ; chaque segment déclare la **face** sur
laquelle il repose (`sud`, `nord`, `est`, `ouest`, `plafond`) et ses deux extrémités dans le
repère du local. L'orthogonalité n'est pas une propriété déclarée mais une propriété
**vérifiée** : sur une face verticale, un segment orthogonal fait varier soit l'abscisse le
long de la paroi, soit l'altitude, jamais les deux ; sur le plafond, soit x, soit y.

**Rationale**: c'est ce qui transforme FR-034 d'une intention en un contrôle. Une polyligne de
points libres serait plus souple et invérifiable : rien n'y distinguerait un tracé conforme
d'un tracé en diagonale à un degré près. En rattachant le segment à une face, on obtient en
prime le contrôle « repose sur une paroi déclarée » de la règle V14, et le décalage
d'affichage du conduit hors du nu de la paroi, sans lequel il serait noyé dans le mur.

**Alternatives considered**:
- *Polyligne de points 3D libres* : souple, invérifiable, et incapable de dire sur quelle face
  un conduit est fixé — donc incapable de le dessiner en saillie du bon côté.
- *Tracé déduit automatiquement entre deux composants* : un routeur automatique produirait un
  parcours plausible, ce qui est exactement ce que le Principe VI interdit. Le tracé est une
  décision de conception, arrêtée sur plan avant percement, pas un calcul.

---

## R13 — Cheminements et traversées sont apportés, jamais déduits

**Decision**: le contrat d'apport gagne deux collections, `cheminements` et `traversees`, à
côté de `circuits`, `composants` et `etapes`. Le socle n'en produit aucune.

**Rationale**: FR-041 l'exige, et c'est cohérent avec ce qui existe. Le socle ne sait rien de
ce qui doit être posé ; il sait le représenter, l'ordonner et le contrôler. Une fonctionnalité
électrique décide de son tracé comme elle décide de ses points.

**Alternatives considered**:
- *Tracés dans un fichier de socle unique* : ferait diverger la propriété des contenus, comme
  pour les composants (R4).
- *Tracés dans `local.json`* : le relevé décrit le bâtiment, pas l'installation.

---

## R14 — Une tolérance de raccordement, déclarée en donnée

**Decision**: deux extrémités sont tenues pour raccordées si elles sont distantes de moins
d'une tolérance déclarée dans `data/presentation.json`, de l'ordre du centimètre. Les nœuds du
graphe sont obtenus en agglomérant les points à cette tolérance.

**Rationale**: les tracés sont saisis à la main, en mètres, avec des cotes au centimètre. Exiger
l'égalité exacte des coordonnées ferait échouer la continuité de circuit sur des écarts
d'arrondi sans aucune réalité physique, et pousserait à désactiver le contrôle — ce qui est le
pire résultat possible. À l'inverse, une tolérance trop large masquerait une vraie rupture.
La rendre explicite et modifiable est la seule position défendable : c'est un choix de
conception, pas une constante magique.

**Alternatives considered**:
- *Égalité exacte des coordonnées* : théoriquement pur, inutilisable en pratique.
- *Tolérance codée en dur* : contredirait FR-020 et la rendrait invisible.
- *Identifiants de nœuds déclarés à la main* : supprime la tolérance, mais reporte sur le
  concepteur un travail de nommage que la géométrie porte déjà.

---

## R15 — La continuité d'un circuit est un parcours de graphe

**Decision**: pour chaque circuit, construire le graphe des nœuds de segments et des
composants rattachés, puis vérifier que **chaque composant du circuit est atteignable depuis
le tableau** en n'empruntant que des cheminements portant ce circuit. Tout composant non
atteignable est un défaut bloquant (règle V16).

**Rationale**: c'est la question que FR-035 pose réellement. « Suivre un circuit du tableau à
son dernier point » n'a de sens que si le chemin existe ; sinon la maquette afficherait une
surbrillance trouée sans dire pourquoi. En posant le problème comme une accessibilité dans un
graphe, le défaut devient localisable : on sait nommer le composant orphelin.

**Alternatives considered**:
- *Vérifier seulement que chaque composant est touché par un segment* : attrape le composant
  isolé, laisse passer le tronçon entier détaché du tableau.
- *Ne rien vérifier et laisser voir* : une rupture de continuité de quelques millimètres est
  invisible à l'écran. C'est précisément le genre de faute que le découpage `geometrie/` contre
  `scene/` existe pour rattraper.

---

## R16 — Toute jonction de degré trois porte une boîte

**Decision**: un nœud du graphe dont le degré est supérieur ou égal à trois DOIT coïncider avec
un composant de type `boite-derivation`. Sinon, défaut bloquant (règle V17).

**Rationale**: c'est la traduction mécanique de la règle de la constitution la plus lourde de
conséquences — « toute connexion DOIT se faire dans une boîte, jamais dans un conduit ni
derrière un appareil ». Trois conduits qui se rejoignent hors d'une boîte représentent une
connexion inaccessible, donc invérifiable à vie. La règle se réduit à un comptage d'arêtes,
c'est-à-dire exactement le genre de vérification qu'un relecteur humain laisse passer et
qu'une machine ne rate jamais. C'est le pendant, pour la pose, de ce que la règle V8 est pour
la sécurité électrique.

**Alternatives considered**:
- *Contrôle visuel à la relecture* : c'est ce que fait le reste du métier, et c'est pourquoi
  des connexions finissent emmurées.
- *Insérer la boîte automatiquement* : inventerait sa référence et son indice de protection
  (voir R11).

---

## R17 — La collision rend trois verdicts, jamais deux

**Decision**: l'intersection d'un segment avec un obstacle renvoie **conforme**, **en
collision**, ou **non concluant**. Le troisième verdict est émis dès que l'obstacle porte
`incertain: true` ou `volume: null`, et il n'est jamais assimilé au premier. L'interface le
présente comme une question ouverte, pas comme un feu vert.

**Rationale**: c'est la décision la plus importante de cet amendement. FR-038 demande de
signaler les collisions, et trois obstacles sur quatre ont un volume inconnu — rail de la
sectionnelle, vantail de la porte de service, gabarit du véhicule. Un contrôle binaire
répondrait « pas de collision » sur un volume qu'il n'a pas pu tester, et cette réponse serait
un mensonge exactement de l'espèce que le Principe VI proscrit : une valeur plausible à la
place d'une inconnue. Le troisième verdict coûte une ligne et préserve l'honnêteté du dossier.

**Alternatives considered**:
- *Verdict binaire, obstacles incertains ignorés* : silencieusement faux, et faux dans le sens
  rassurant, ce qui est le pire.
- *Refuser de rendre la maquette utilisable tant qu'une cote manque* : bloquerait tout le
  socle sur un relevé, alors que le reste est vérifiable.
- *Substituer un volume enveloppe prudent* : inventerait une cote. Interdit.

---

## R18 — Un obstacle peut ne se rattacher à aucune baie

**Decision**: le champ `baie` d'un obstacle devient facultatif. Un obstacle sans baie décrit un
volume libre du local — gabarit de manœuvre du véhicule, débattement des portières, zone de
stationnement.

**Rationale**: FR-039 l'exige, et le contrat initial ne le permettait pas : tout obstacle
devait viser une baie, ce qui convenait au vantail et au tablier mais pas à un véhicule. Le
gabarit du véhicule est la zone de choc la plus probable pour un conduit apparent posé bas, et
c'est justement ce que la constitution demande d'éviter. L'omettre du modèle reviendrait à ne
pas pouvoir contrôler la règle.

**Alternatives considered**:
- *Rattacher le gabarit véhicule à la porte sectionnelle* : commode et faux. Le volume de
  manœuvre n'est pas une propriété de la baie, et la confusion se paierait au premier obstacle
  qui ne touche aucune ouverture.
- *Entité `ZoneInterdite` distincte* : dupliquerait la mécanique d'obstacle, y compris les
  trois verdicts de R17, pour une différence de nom.

---

## Inconnues restantes

Aucune inconnue technique ne subsiste. Trois inconnues **de relevé** demeurent, traitées comme
des données incertaines et non comme des blocages, conformément à la réserve 2 du gate
constitutionnel du [plan](./plan.md) :

- `TODO(RAIL_PORTE_SECTIONNELLE)` — hauteur de passage de la porte sectionnelle et
  encombrement du rail en position ouverte.
- Sens d'ouverture et débattement du vantail de la porte de service.
- Gabarit de manœuvre du véhicule et débattement de ses portières (nouveau, requis par
  FR-038 et FR-039).

Elles se déclarent dans `data/local.json` avec le drapeau `incertain` et `volume: null`,
s'affichent comme telles, et n'empêchent ni le rendu, ni l'ordonnancement, ni la navigation.
En revanche, et c'est la nouveauté de l'amendement, elles rendent le contrôle de collision
**non concluant** sur les volumes concernés (R17). Le dossier doit dire qu'il n'a pas pu
conclure, non qu'il a conclu favorablement.

Une inconnue de **matériel** est également reportée, sans incidence sur la représentation :
`TODO(CONDUIT_EXTERIEUR)` de la constitution. Les caractéristiques des conduits et boîtes
extérieurs resteront affichées comme inconnues jusqu'à son arbitrage.
