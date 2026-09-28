# Design

## Context

Voir `proposal.md` pour la motivation. Ce qui contraint techniquement l'approche :

- La scène est une **liste plate de groupes** ajoutés en une ligne, `src/main.js:58`. Chaque
  module de `src/scene/` expose déjà `{ groupe, appliquerEtat, … }`, et `src/scene/cotes.js:135`
  expose déjà `basculer(visible) { groupe.visible = visible }` — l'idiome de bascule existe donc,
  et il ne reste plus qu'à le généraliser.
- Le filtrage de désignabilité sur la visibilité **est déjà une convention** du dépôt :
  `src/scene/obstacles.js:184` filtre `meshes()` sur `e.noeud.visible`, avec le motif en commentaire.
- Trois bascules d'affichage coexistent déjà et sont indépendantes : ouvrants, plafond
  escamotable selon la caméra (`src/main.js:68`), cotes de tracé. Le modèle « booléen + bouton
  + `aria-pressed` » est établi.
- `src/donnees/chargement.js:153-157` fusionne cinq genres d'apport à la main. Ajouter un sixième
  genre est une modification de liste, pas une refonte.
- Le rangement est le premier contenu **non électrique**, donc le premier dont les cotes ne
  viennent pas du relevé. Voir `specs/maquette/rangement/spec.md` pour ce que cela implique.

## Goals / Non-Goals

**Goals:**

- Étendre l'idiome `basculer` existant à des groupes qui en sont dépourvus, sans introduire de
  vocabulaire parallèle.
- Rendre l'appartenance d'un groupe à une couche **visible en un seul endroit**.
- Ajouter `rangements` au socle sans le faire entrer par accident dans le circuit électrique.
- Porter l'état de cote contradictoire dans la donnée, de façon qu'il survive au chargement et
  parvienne jusqu'à la fiche et au bilan.

**Non-Goals:**

- Ne pas faire du rangement un obstacle. Voir la spec : c'est un choix, et le remettre en cause
  demanderait un changement de spécification, pas une extension.
- Ne pas réécrire `chargement.js` en un fusionneur générique. Six genres en liste suffisent ; la
  généralisation serait justifiée à dix ou plus.
- Ne pas créer de catalogue de types de rangement (voir décision 6).
- Ne pas persister l'état des bascules d'affichage.

## Decisions

### 1. Réutiliser `basculer`, ne pas créer un cadre de « couches »

Chaque module de scène expose `basculer(visible)` sur le modèle de `src/scene/cotes.js:135`, et
c'est tout. Un objet `couches` qui encapsulerait groupes, boutons et sélection a été envisagé
puis écarté : il dupliquerait un idiome déjà présent, et il faudrait faire adapter à cette
abstraction tous les modules qui n'ont rien demandé.

**Alternative écartée — `THREE.Layers`.** Plus « natif », mais `Layers` Raisonne sur un
masque de bits et ne couvre ni les bascules existantes — ouvrants, plafond, cotes — ni le
filtrage de désignabilité, qui demande de toute façon un test explicite. Elle introduirait un
second mécanisme de visibilité à côté du premier, pour un bénéfice nul ici.

### 2. L'appartenance à une couche se déclare, elle ne se déduit pas

Un objet déclaratif, dans `main.js`, associe chaque couche à ses groupes. On ne déduit rien du
nom du module.

**Pourquoi pas de convention de nommage.** Trois groupes sont **volontairement** hors de toute
couche toggleable : `obstacles`, qui appartient à la représentation du local et non à
l'installation ; `cotes`, qui est un calque d'annotation ; le plafond, qui se pilote sur la
caméra. Une inférence par convention les capturerait silencieusement. La déclaration explicite
rend ces exclusions visibles, ce qui est exactement leur raison d'être.

`cotes` suit la couche électricité : il annote les conduits, et un calque de cotation de conduits
dont les conduits sont masqués n'a pas de sens. Sa propre bascule `tracage` reste donc
subordonnée — masquer l'électricité emporte les cotes. `obstacles` reste hors des deux.

### 3. Le filtrage de désignabilité reste dans chaque module

Chaque module continue d'exposer `meshes()` **déjà filtré** sur la visibilité, comme
`obstacles.js:184` le fait aujourd'hui. `main.js:233-237` n'ajoute pas de filtre global.

**Alternative écartée — filtrage centralisé dans la liste de désignation.** Moins de code, mais
il faudrait remonter l'ascendance de chaque mesh pour savoir s'il est dans une couche masquée,
et l'omission serait silencieuse. Le contrat par module est plus explicite, et il est
vérifiable par test.

### 4. `rangements` est un genre d'apport à part entière, pas un sous-genre de `composants`

Sixième clé dans `chargement.js`, avec sa propre validation dans `validation.js`.

**Alternative écartée — ranger les éléments dans `composants`.** Moins de code, mais un
rangement se retrouverait alors, dans V11 (unicité) et surtout V16 (atteignable depuis le
tableau), qui n'a de sens que pour un circuit. Il faudrait le neutraliser, donc maintenir une
exception permanente dans des contrôles qui ne le concernent pas. Un genre distinct les laisse
hors du chemin, sans exception à écrire.

### 5. L'état de cote est porté par la donnée, pas déduit de la valeur

Chaque cote est un objet `{ valeur, origine, etat, reserves }`, où `etat` vaut `releve`,
`inconnu` ou `contradictoire`, et `origine` vaut `releve`, `declaration-fabricant` ou
`gabarit-catalogue`.

**Pourquoi `etat` est explicite et non calculé.** Une contradiction se définit par la
**coexistence de deux déclarations** incompatibles : elle n'est pas lisible dans une valeur
unique. Un booléen `incertain` — l'idiome actuel des obstacles — ne peut pas la distinguer de
l'inconnue, et c'est précisément la distinction que la spec pose. On ne peut donc pas la dériver
à la lecture : il faut la porter, avec les deux termes du conflit, dans `reserves`.

### 6. Pas de catalogue de types de rangement : le gabarit est porté par l'élément

Le `volume` est déclaré sur l'élément, avec son `origine`. Pas de `types-rangement.json`.

**Pourquoi.** Le catalogue `types-composants.json` porte des sémantiques électriques — circuit,
indice de protection, section — qui ne s'appliquent pas, et dont V12 interdit par ailleurs de
faire hériter un apport. Un catalogue dont le seul consommateur serait deux éléments serait une
couche sans usage. La règle « le volume déclaré prime sur le gabarit de type » couvre déjà la
précédence. Si le catalogue grandit, c'est ce changement-ci qui devra être revu.

### 7. Le rack est dessiné à un gabarit conventionnel, jamais à sa déclaration contradictoire

*Arbitré par le maître d'ouvrage le 2026-09-27, après que l'implémentation eut constaté que
la version initiale de cette décision était inapplicable. Voir « Ce que l'implémentation a
corrigé » plus bas.*

Le rack est rendu à un **gabarit de représentation**, déclaré comme tel, et porte partout la
mention **« conventionnel — non relevé »**. Sa déclaration constructeur contradictoire est
consignée à part, dans `reserves`, avec ses quatre points et le document dont elle provient.

**Pourquoi le gabarit et non la déclaration.** L'encombrement déclaré est inutilisable en l'état,
et pas seulement parce qu'il se contredit : le dessiner exigerait en outre une **hauteur de
montage**, qui est inconnue. Rendre le rack à `55 × 144 × 55` revenait donc à inventer deux
valeurs — la hauteur, et un arbitrage de la largeur que `research.md` R1 interdit. Aucun des
trois axes n'est d'ailleurs hors d'atteinte : la page emploie « length » en prose sans jamais
la rattacher à D, W ou H, si bien que la contradiction peut porter sur n'importe lequel d'eux.

Le gabarit corrige cela en déclarant ce qui est une **convention de représentation**, ce qu'il
est effectivement : une enveloppe et une bande de fixation choisies pour figurer un rack de
ce type, sans prétendre décrire le produit. C'est le même mécanisme que celui des étagères, et
la constitution le permet précisément parce qu'il est **déclaré** et non présenté comme un relevé.

**Ce qui reste affiché.** Le gabarit ne fait pas disparaître la contradiction : la fiche
porte les deux — l'enveloppe de convention qui est dessinée, et la déclaration du fabricant
qui est en conflit. Le bilan des cotes présente la seconde comme une demande de précision au
maître d'ouvrage, jamais comme une donnée acquise.

**Alternatives écartées.**
- *Dessiner à `55 × 144 × 55` avec une hauteur de montage choisie* : invente deux valeurs.
- *Retenir 121,9 cm, la plus grande largeur permise par le réglage* : trancherait un conflit de
  document par un calcul, ce qui n'est pas le rôle de la maquette.
- *Ne pas dessiner le rack, jusqu'à levée des quatre points* : respecte la lettre du principe
  mais vide la couche rangement de son objet, et l'installateur ne peut plus juger la place —
  c'est-à-dire ce qu'il vient chercher.
- *Un marqueur sans emprise* : exacte, mais la couche rangement ne montre plus de rack.

**Portée du choix.** Il ne porte que sur la **figure**. Les caractéristiques constructeur — charge,
matière, plage de pneus, réglage, mode de fixation — restent dans la fiche et le dossier, et les
quatre contradictions restent ouvertes.

### 8. Le rangement est désigné comme les obstacles

Chaque mesh porte `userData.rangement`, et le module expose `rangementDe(objet)`, sur le modèle
de `obstacleDe()` (`obstacles.js:189`). `cadrage.js` et `fiche-composant.js` reçoivent un objet
de la même forme qu'un composant — `id`, `paroi`, `volume`, `libelle` — pour ne pas recevoir une
deuxième forme à traiter.

### 9. La séquence ne connaît pas le rangement

`GENRES_POSABLES` (`src/sequence/etat.js:11`) reste inchangé : aucune valeur ajoutée. Le
rangement n'a ni `rangsApparition`, ni étape, et `appliquerEtat` ne le touche jamais.

Deux conséquences à ne pas rater. D'abord, la bascule de couche ne doit **pas** appeler
`appliquerEtat` : le masquer ne doit pas figer l'état, et le réafficher ne doit pas le recalculer.
Ensuite, quand la couche électricité est masquée, la mise en évidence de l'objet de l'étape
courante doit être **suspendue** sans être perdue, pour se rétablir au réaffichage.

`src/scene/cotes.js:126` recopie `GENRES_POSABLES` en dur au lieu de l'importer. Ce changement
est l'occasion de le remplacer par l'import : c'est la seule duplication que le sujet du
rangement rend naturel, et la laisser en place ferait diverger deux listes d'un seul ajout
ultérieur.

## Risques / Trade-offs

- **`Group.visible` n'arrête pas le `Raycaster`.** Un module dont `meshes()` ne filtre pas
  laisserait désignable un objet masqué — le défaut que `obstacles.js:184` documente déjà.
  *Mitigation* : le contrat « `meshes()` filtré » est posé par module et vérifié par un test qui
  masque une couche et asserte qu'aucun de ses meshes n'est retourné.
- **Un nouveau groupe ajouté à la scène sans être déclaré dans une couche** resterait visible
  dans les deux cas, sans que rien ne le signale. *Mitigation* : la déclaration des couches est
  exhaustive et un test asserte que tout groupe de la scène y figure.
- **Masquer l'électricité laisse l'en-tête annoncer « étape 7 sur 12 » sans rien à l'écran.**
  C'est un état déroutant. *Mitigation* : le libellé du bouton dit ce qui est masqué, et la
  consigne écrite de l'étape reste affichée — c'est le texte, non la géométrie, qui porte
  l'instruction. Compromis assumé : l'installateur garde le fil de la séquence.
- **Le raccordement des boutons à `index.html` touche au partagé.** Deux boutons dans un en-tête
  déjà peuplé. *Mitigation* : le câblage suit le modèle de `tracage`, sur le même `en-tête`, et
  rien d'autre n'y bouge.
- **Le rack est une figure conventionnelle, et le risque est qu'on l'oublie.** Un volume dessiné
  est pris pour un volume établi : c'est exactement le défaut que la constitution interdit, et il
  se produit d'autant plus facilement que la figure est plausible. *Mitigation* : la mention
  « conventionnel — non relevé » est non escamotable, présente dans la maquette, dans la fiche et
  au bilan des cotes, et un test l'assert sur les trois emplacements.

## Ce que l'implémentation a corrigé

Deux constats sont sortis de l'implémentation elle-même, après validation des artefacts. Ils
portent sur des faits vérifiables, non sur des préférences, et sont consignés ici pour que le
document ne reste pas en deçà de ce qu'il a servi à décider.

**Le décompte d'occupation des faces était faux.** Le document affirmait 19 composants sur la
paroi est et aucun sur le plafond. Le décompte reproductible
(`dossier/006-rangement/occupation-parois.mjs`) donne **10 sur l'est et 7 sur le plafond**. L'erreur
venait d'un glob sur `data/apports/*.json` qui comptait `000-demonstration.json` — un jeu de
démonstration hors calcul, porteur de neuf composants d'est qui n'existent pas au chantier.

La conclusion, elle, ne bouge pas : l'ouest reste sans composant et sans cheminement, et reste la
seule face entièrement libre. Mais une justification fausse est pire qu'une justification absente,
parce qu'elle donne une assurance que rien ne vérifie. C'est la raison pour laquelle le décompte
est désormais un script, et non un nombre recopié.

**La décision 7 était inapplicable.** Elle prévoyait de rendre le rack à son encombrement déclaré,
ce qui suppose une hauteur de montage — inconnue — et donc inventée. Aucun des trois axes n'était
par ailleurs hors d'atteinte, la page ne rattachant jamais la « length » en prose à D, W ou H.
La décision a été réécrite après arbitrage, et la version initiale est conservée ci-dessus pour
que l'on voie ce qui l'a motivée.

## Open Questions

- **Les quatre contradictions du rack** (144 cm contre 81,3–121,9 cm ; hauteur non qualifiée ;
  charge par tablette ou totale ; nombre de niveaux) se lèvent par une précision du maître
  d'ouvrage ou un autre document. Cela ne change ni les specs, ni l'approche, ni les tâches :
  c'est une correction de données, qui se fera dans `006-rangement.json` et dans
  `dossier/006-rangement/`.
- **Le mode de fixation du rack** — scellement chimique ou tiges adaptées, aucune tige n'étant
  fournie — sera consigné quand il sera décidé. Il ne change pas la maquette tant qu'aucune cote
  de perçage n'est connue, et aucune n'est inventée d'ici là.
- **Le gabarit du véhicule** (FR-039) est aujourd'hui un obstacle. Le jour où le rangement sera
  confronté aux tracés, la question de savoir s'il rejoint les obstacles ou reste hors contrôle
  se reposera. Elle est ouverte ici pour n'être pas oubliée, et ne préjuge pas de la suite.
