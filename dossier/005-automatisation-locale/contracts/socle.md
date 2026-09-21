# Contrat — ce que le socle doit apprendre

**Fonctionnalité** : `005-automatisation-locale` | **Date** : 2026-09-22

Le socle expose trois interfaces : le **schéma d'apport**, que les données doivent satisfaire ; les
**règles de validation**, qui disent ce qui est refusé ; et les **fonctions dérivées**, que la
maquette et les fournitures consomment. Cette fonctionnalité touche les trois. Ce document dit
**quoi**, pas **comment**.

## 1. Schéma d'apport — `dossier/001-visualisation-3d/contracts/apport.schema.json`

### `$defs/composant.contigu` — nouveau, facultatif

```jsonc
"contigu": {
  "type": "array",
  "minItems": 1,
  "items": { "type": "string", "minLength": 1 },
  "description": "Identifiants des composants dont l'enveloppe TOUCHE celle de celui-ci, sans la recouvrir, et avec lesquels les conducteurs passent directement. Crée une continuité électrique là où aucun conduit n'existe — le cas d'une goulotte posée sur le dessus d'un tableau. Les deux objets DOIVENT porter un volume déclaré, et leurs enveloppes DOIVENT se toucher à la tolérance de raccordement près."
}
```

**Ce que le champ ne fait pas**, et qui doit être écrit à côté de ce qu'il fait : il ne crée pas de
longueur, ne dispense d'aucune règle géométrique, et **ne rattache rien par la proximité**. Deux
enveloppes qui se touchent sans le déclarer restent étrangères l'une à l'autre. C'est la même
discipline que `boitier` : le rattachement est **déclaré**, jamais déduit.

### `$defs/composant.commutation` — valeur nouvelle

L'énumération passe de deux à trois : `retour-commande`, `sur-place`, **`entree-module`**.

> `entree-module` : l'interrupteur ne coupe pas la puissance. Il adresse un **ordre** à un module
> qui détient la phase et la sortie. Les conducteurs qui le desservent portent une commande, non
> une alimentation, et la fiche d'un conduit doit le dire.

### Catalogue des types — `data/types-composants.json`

Un type `module-commande`, avec son gabarit. Un module n'est ni un appareil d'utilisation ni une
boîte : il ne consomme pas la puissance qu'il commute, et il occupe un volume dans une enceinte
qui n'est pas la sienne.

## 2. Règles de validation — `src/donnees/validation.js`

| Règle | Énoncé | Nature |
|-------|--------|--------|
| **STRUCT** | `contigu` est une liste non vide d'identifiants existants | structurelle |
| **STRUCT** | `commutation` accepte la troisième valeur | structurelle |
| **V22** *(nouvelle)* | Une contiguïté déclarée ne vaut que si **les deux objets portent un volume** et que leurs **enveloppes se touchent** à la tolérance de raccordement près. Une contiguïté entre deux points, ou entre deux volumes distants, est un défaut | géométrique |
| **V22** | La contiguïté est **symétrique** : la déclarer d'un côté suffit, la déclarer des deux n'est pas une erreur, mais l'affirmer d'un côté et la contredire de l'autre en est une | cohérence |

**Pourquoi une règle et pas seulement une structure.** Sans V22, il suffirait de déclarer une
contiguïté entre deux objets quelconques pour fabriquer de la continuité et faire taire V16 — la
même faiblesse que le volume d'une boîte présentait avant que V21 ne compte ses entrées. La
contrepartie doit naître avec la permission, pas après.

*Fait le 2026-09-22 : le socle compte **vingt-deux** règles, et les documents qui énonçaient
« les vingt et une règles » ont été repris.*

## 3. Fonctions dérivées — `src/geometrie/`

### `graphe.js` — la contiguïté devient une arête

Une arête de **longueur nulle**, posée à la construction du graphe, entre les nœuds des deux
objets contigus. Elle est franchissable par tous les circuits, comme l'est une traversée de paroi :
ce n'est pas un conducteur, c'est un passage.

**Elle répare une dette existante.** Le rattachement par `boitier` est aujourd'hui traité **deux
fois séparément** — dans `atteignablesDepuisTableau`, où il complète l'ensemble des atteignables
après le parcours, et dans `cheminEntre`, où `noeudRaccorde` reporte le nœud de départ. Aucune des
deux ne crée d'arête, si bien que `longueursDepuisTableau` ne sait toujours pas dire à quelle
distance se trouve CM-01. Une arête posée une fois sert les trois parcours, et les deux rustines
disparaissent.

**Contrat de non-régression** : les trois apports existants ne déclarent aucune contiguïté. Leur
graphe, leurs longueurs et leurs 297 tests doivent être **rigoureusement inchangés**.

### `conducteurs.js` — le rôle « ordre »

La dérivation reconnaît la troisième commutation et lui donne son rôle propre, distinct du retour
commandé. Le **décompte** par conduit ne change pas — deux conducteurs entre un module et son
interrupteur, avant comme après — mais la **répartition par rôle** affichée sur la fiche doit dire
« ordre » là où passe un ordre.

Le garde-fou reste : le maximum dérivé par circuit doit valoir le `conducteurs` déclaré. Il devra
être relevé pour `c-eclairage` et `c-prises`, les deux boutons ajoutant des conducteurs au tronc.

### `fournitures.js` — sans changement de forme

Le métré suit les données. Deux effets s'y répercuteront sans qu'une ligne change : **CH-01 sort du
relevé des conduits**, et la goulotte y entre comme un article nouveau, qui n'est ni un conduit ni
une boîte ordinaire.

## 4. Ce que le socle ne saura toujours pas

Le Principe VI impose de le dire plutôt que de le laisser croire.

- **Le remplissage d'une goulotte.** La règle du tiers `D ≥ d·√(3n)` est écrite pour une section
  circulaire. Le socle continuera de l'appliquer aux conduits et **ne dira rien** de la goulotte,
  dont la condition 6 de la constitution v1.13.0 renvoie aux caractéristiques du produit.
- **Le comportement temporel.** Aucune des vingt-deux règles ne vérifie une minuterie, une priorité
  ou un mode dégradé. La machine à états de `data-model.md` est vérifiée **au chantier**, par les
  scénarios de `quickstart.md`, et par rien d'autre.
- **La portée du réseau local.** Elle ne se déduit d'aucune géométrie.
