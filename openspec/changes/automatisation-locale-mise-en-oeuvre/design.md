# Design

## Context

Voir [proposal.md](proposal.md) — *Why*. L'implantation candidate est celle de
[`dossier/005-automatisation-locale/data-model.md`](../../../dossier/005-automatisation-locale/data-model.md),
et ce que le socle doit apprendre est dans
[`contracts/socle.md`](../../../dossier/005-automatisation-locale/contracts/socle.md).

Deux constats, faits le 2026-09-23 en montant la topologie en mémoire avant d'écrire la moindre
donnée, conditionnent tout le reste.

**1. Le décompte manuel du `data-model.md` oublie CM-01.** Il n'ajoute au tronc que les deux
conducteurs du bouton de porte. Or CM-01, dès qu'elle passe en `entree-module`, n'est plus
reliée aux sorties du plafonnier : c'est MC-01, **dans la goulotte**, qui les commute. Il en
naît deux trajets que la table ne compte pas — la **sortie du module** vers le plafonnier, qui
monte par CH-02, et la **paire d'ordre** de CM-01, qui descend par CH-02 puis CH-05.

| Conduit | Décompte manuel | Dérivé |
|---|---|---|
| CH-04, CH-07 | 8 | 8 |
| CH-08 | 5 | 5 |
| **CH-02** | 8 | **11** |
| **CH-05** | 8 | **9** |
| CH-L1 | 7 | 8 — le PE du circuit des prises monte au bouton de porte |
| CH-A1 | 5 | 6 |

Aucune implantation alternative étudiée ne ramène CH-02 à huit : MC-01 déplacé dans BD-04
donne 10 et 10, un seul fil d'ordre par bouton donne 10 et 8. *Révisé le 2026-09-23 : l'entrée
de MC-02 commute la phase, et le bouton de porte n'a plus qu'un fil d'ordre (D6) — CH-02 porte
dix conducteurs, et en exige au moins 16,42 mm intérieurs.* À onze conducteurs, CH-02
exigeait au moins 17,23 mm intérieurs — borne qui ne dépend d'aucune cote de conducteur, voir
[note-de-calcul.md](note-de-calcul.md) § 2 —, au-delà des IRL 20 relevés pour la note `003`.

**2. Le socle ne sait pas dériver une commande sur module.** La branche `entree-module` de
`src/geometrie/conducteurs.js` n'a jamais porté de données : elle fait partir **un** fil
d'ordre **du tableau**, ne connaît pas la sortie du module, et la validation refuse deux
commandes sur les mêmes points. `validation.js` ignore d'ailleurs la troisième commutation,
que seul le schéma déclare.

## Goals / Non-Goals

**Goals :**
- Que les décomptes du tronc sortent de la **dérivation** et non d'une table faite à la main,
  et que la condition de remplissage s'applique aux conduits qui la portent réellement.
- Une déclaration de la commande sur module qui dise **quel module** reçoit l'ordre, sans
  inventer de lien entre le bouton de porte et un point qui n'existe pas dans la maquette.

**Non-Goals :**
- Vérifier le comportement temporel. Aucune règle du socle ne vérifie une minuterie ; la
  machine à états s'écrit en prose et se vérifie au chantier (`contracts/socle.md`, § 4).
- Modéliser le moteur, son contact sec ou la platine UAP 1-HCP : ils sont hors de
  l'installation déclarée, et le relevé T1 n'est pas fait.
- La commande de la porte à distance. *Admise le 2026-09-23 par décision du maître
  d'ouvrage, elle ne change ni conducteur ni conduit, et fait l'objet du changement
  [`commande-porte-a-distance`](../archive/2026-09-23-commande-porte-a-distance/design.md), qui porte les deltas
  de la capacité `installation/automatisation`.*
- Le remplissage de la goulotte, que la condition 6 renvoie à la fiche produit.

## Decisions

### D1 — Une commande sur module nomme son module

Une commande `commutation: "entree-module"` déclare **`module`**, l'identifiant du
`module-commande` qui reçoit son ordre, du même circuit. `pilote` y devient **facultatif** :
il dit ce que la commande fait allumer, et l'union des `pilote` des commandes d'un module est
ce que ce module commute.

- CM-01 : `module` MC-01, `pilote` EL-01a et EL-01b.
- CM-04 : `module` MC-01, **sans `pilote`**. Un apport ne désigne pas les points d'un autre —
  c'est la règle de la validation par apport, et `005` ne déclare pas le plafonnier. CM-04
  fait allumer ce que son module commute, c'est-à-dire ce que CM-01 pilote.
- CM-05 : `module` MC-02, **sans `pilote`** — ce qu'elle commande, la porte, n'est pas un
  point de l'installation.

Deux commandes **d'un même module** peuvent piloter les mêmes points : ce n'est pas le
va-et-vient que la règle « piloté deux fois » écarte, puisque chacune a sa propre paire vers le
module et qu'aucun retour n'est partagé. C'est la traduction de FR-009 — deux points de
commande équivalents.

Le contrôle de `module` se fait **sur le modèle fusionné** et non par apport, comme V22 pour la
contiguïté : CM-01 est déclarée par `003`, MC-01 par `005`.

*Écarté* : `pilote: [MC-02]` pour le bouton de porte — un module n'est pas ce que l'occupant
commande, et CM-01 perdrait son lien au plafonnier. *Écarté aussi* : déclarer les points
commutés sur le module, `pilote` étant réservé aux commandes.

### D2 — Ce que la dérivation fait passer

Pour chaque commande sur module, **deux conducteurs d'ordre** vont du module à la commande —
celui qui l'alimente et celui qui en revient. Deux commandes, deux paires, chacune sur son
trajet. Un conducteur de **sortie de module** — rôle nouveau — va du module aux points qu'il
commute. La phase va au module, qui est un point non piloté ; elle ne descend plus aux
commandes sur module.

`cheminDePhase` suit : pour un point commuté par un module, la phase fait
`L(tableau → module) + L(module → point)`.

### D3 — PE aux boutons sur module, pas de neutre

**Décision du maître d'ouvrage, 2026-09-23.** Le conducteur de protection va à chaque boîtier
de commande, sans exception (FR-012 de l'éclairage, inchangé). Le neutre ne va pas aux
commandes sur module : un bouton poussoir sur l'entrée d'un module n'en a pas l'usage.

### D4 — CH-02 et CH-05 en IRL 25

**Décision du maître d'ouvrage, 2026-09-23.** *Motif* : à onze et neuf conducteurs dérivés,
CH-02 est hors de tout IRL 20 et CH-05 à sa limite. Seuls ces deux conduits changent de
calibre ; CH-04, CH-07 et CH-L1 restent en IRL 20 à huit conducteurs.

*Conséquence, qui corrige la tâche 3.4 telle qu'écrite* : les conduits soumis à la condition
d'achat en IRL 20 ne sont plus CH-02, CH-04, CH-05 et CH-07, mais **CH-04, CH-07 et CH-L1**.
Et le seuil de 14,69 mm n'y vaut pas tel quel : il a été établi pour trois conducteurs de
2,5 mm² et cinq de 1,5 mm². CH-L1 a la même composition ; **CH-04 et CH-07 portent l'inverse**
— cinq de 2,5 mm², les deux fils d'ordre du bouton de porte étant de la section du circuit
des prises, et trois de 1,5 mm². Leur seuil est plus élevé, et se recalcule dans la note de
calcul à partir des cotes produit, **sans valeur de mémoire**. *Révisé le 2026-09-23 (D6) :
sept conducteurs, dont quatre de 2,5 mm². Leur seuil ne se compare plus à 14,69 mm sans cotes
produit — il est à calculer.*

*Écarté* : tout le tronc en IRL 25, qui lèverait la condition d'achat mais reviendrait sur la
référence unique de tube au-delà de ce que le dépassement impose.

### D6 — L'entrée de MC-02 commute la phase : un seul fil d'ordre au bouton de porte

**Constat du maître d'ouvrage, 2026-09-23** : le module de porte retenu a une entrée qui
**commute la phase**. Le bouton CM-05 n'a donc plus à recevoir un aller du module : il prend
la **phase des prises**, et **un** fil d'ordre, le retour, va de lui à MC-02. C'est une
propriété du produit, déclarée sur le module — `entree: "phase"` — et non sur le bouton.

La phase monte au bouton par le plus court depuis le tableau — goulotte, CH-L1 jusqu'à BD-06,
CH-A1 —, là où passait le fil d'aller : GL-01, CH-L1 et CH-A1 ne changent pas. Le tronc, où le
fil d'aller doublait le retour sans utilité, perd un conducteur : **CH-02 de 11 à 10, CH-04 et
CH-07 de 8 à 7, CH-08 de 5 à 4**. Le circuit des prises descend à quatre conducteurs au plus, et
son métré de 2,5 mm² de 68,55 à 63,45 m.

**Conséquence de sécurité** : CM-05 est **sous 230 V** dès que les prises sont sous tension. Le
boîtier double le savait déjà — consigner l'éclairage n'y coupe pas le bouton de porte —, mais
le bouton porte désormais la phase elle-même.

*Écarté pour MC-01* : CM-01 et CM-04 y gagneraient **rien**. La phase de l'éclairage, prise à
la goulotte où est le module, ferait le trajet du fil d'aller ; et CM-01 perdrait son mode
dégradé, qui rebranche sa paire en interrupteur ordinaire du plafonnier. MC-01 reste en entrée
alimentée par le module, deux fils par bouton.

D4 tient : à dix conducteurs, CH-02 exige au moins 16,42 mm, au-delà des IRL 20 relevés.

### D5 — CH-L1 porte le circuit des prises

Le bouton de porte y passe. Le décompte se fait par cheminement : CH-L1 affiche celui de son
tronçon amont, entre la goulotte et BD-06, le plus chargé. Le tronçon aval, de BD-06 à la
façade, en porte moins ;
l'erreur est **du côté sûr**, et la fiche le dit.

## Risks / Trade-offs

- **[Les tests qui lisent `002` + `003` sans `005` perdent la dérivation de l'éclairage]** —
  CM-01 nomme un module qu'ils ne chargent pas, et la dérivation retombe sur le majorant,
  comme elle le doit. → Ceux qui vérifient un décompte de l'éclairage lisent désormais les
  quatre apports, précédent déjà posé par la goulotte.
- **[Garde-fou des circuits]** — le maximum dérivé doit valoir le `conducteurs` déclaré :
  `c-eclairage` passe de 5 à 8 — son maximum est atteint dans la goulotte, où passent les deux paires d’ordre —, `c-prises` de 3 à 5, et leurs `detailConducteurs` suivent.
- **[Chute de tension de l'éclairage]** — la phase du plafonnier ne fait plus le détour par
  CM-01 : MC-01 est sur le chemin, et la longueur de phase de EL-01b tombe à celle du conduit,
  9,00 m. La chute cumulée recalculée passe de **1,79 % à 1,77 %** ; la valeur déclarée et la
  note de calcul `003` suivent.
- **[Section des fils d'ordre du bouton de porte]** — prise égale à celle du circuit qui les
  protège, faute de quoi la protection ne les couvre pas. C'est ce qui alourdit CH-04 et CH-07.

## Open Questions

- La valeur du délai d'extinction (tâche 2.7) — décision du maître d'ouvrage, sans effet sur
  la topologie.
- Les cotes intérieures des IRL 20 retenus pour CH-04, CH-07 et CH-L1 — condition d'achat,
  sans effet sur le tracé.
