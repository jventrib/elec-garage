# Implantation — pourquoi la paroi ouest

**Fonctionnalité** : `006-rangement` | **Date** : 2026-09-27

Ce document répond à une seule question : **sur quelle paroi poser le rangement, et sur quelle
base.** La réponse doit être rejouable par quiconque la conteste ; les nombres qu'il contient sont
donc produits par un script, et non recopiés à la main.

## Le décompte

`dossier/006-rangement/occupation-parois.mjs` lit les apports **déclarés dans `index.json`** et
sépare, pour chaque face, les composants d'une part et les faces empruntées par les cheminements
d'autre part. Un cheminement ne porte pas de `paroi` : il porte un `face` par segment. Les deux
comptes sont nécessaires, car une face peut porter des composants et aucun conduit, ou l'inverse.

```
Apports déclarés dans index.json : 4 — 002-prises-de-courant, 003-eclairage,
004-borne-recharge, 005-automatisation-locale

| Face      | Composants                                        | Nb | Cheminement |
|-----------|----------------------------------------------------|----|-------------|
| nord      | PC-03, PC-04, BR-01                                |  3 | oui         |
| est       | TD-01, PC-01, PC-02, BD-04, OC-01, OC-02,          | 10 | oui         |
|           | CM-01, CM-03, EL-03, MC-01                        |    |             |
| sud       | EL-02, CM-02, BD-06, CM-04, CM-05                  |  5 | oui         |
| plafond   | PC-05, BD-05, AC-01, EL-01a, EL-01b, BL-01, MC-02 |  7 | oui         |
| **ouest** | —                                                  |  0 | **aucun**  |
```

`000-demonstration.json` en est exclu, et c'est un point qui a déjà coûté une erreur. Un premier
décompte, fait par glob sur tout le répertoire, concluait à **19** composants à l'est et à un
**plafond vide** : deux chiffres faux. Le jeu de démonstration y ajoute onze composants d'est et
trois au plafond, qui n'existent pas au chantier. Et le plafond vide était précisément ce qui
justifiait d'écarter cette face — la conclusion était donc appuyée sur une erreur, même si elle
restait juste par chance. Une justification fausse est plus dangereuse qu'une justification
absente, parce qu'elle donne une assurance que rien ne vérifie.

**L'ouest est la seule face sans composant et sans cheminement.** C'est le seul constat que ce
document retire, et il est stable.

## Pourquoi les autres faces sont écartées

Ce ne sont pas des faces « pleines » : ce sont des faces dont l'usage est déjà déterminé.

- **Est** — la plus chargée : tableau électrique, prises, bornes, interrupteurs, commandes,
  éclairage et motorisation. Elle porte en outre la porte de service et le bardage bas.
- **Nord** — trois points de puissance, dont la borne de recharge.
- **Sud** — la porte sectionnelle occupe 5,00 m sur 5,60 m. Il ne reste que deux trumeaux de
  0,20 m et 0,40 m, trop étroits pour un gabarit de 1,44 m, et l'éclairage de la porte s'y trouve.
- **Plafond** — sept points : éclairage, bloc de secours, alarme, points de puissance et
  détecteur. Et un rangement mural s'y loge, pas en applique contre lui. En outre, la vue est
  pilotée par la caméra qui surplombe le garage, et un volume plaqué au plafond resterait mal
  lisible.

## Où, sur la paroi ouest

Le gabarit retenu occupe, en mètres :

| Élément | Valeur | Nature |
|---|---|---|
| Largeur | 1,44 | gabarit |
| Profondeur | 0,55 | gabarit |
| Hauteur | 1,50 | gabarit |
| Base à | 0,80 | gabarit |
| Sommet | 2,30 | gabarit |
| Origine y | 2,08 à 3,52 | gabarit |

La paroi ouest mesure 5,60 m de long sous 2,75 m de plafond. Le gabarit laisse donc **0,45 m
entre sa cime et le plafond**, et **0,80 m de sol libre** en dessous.

Une première version de ce gabarit était plus haute — 2,00 m sur une base à 1,00 m — et
dépassait le plafond de 25 cm. Elle est abandonnée : un gabarit qui ne tient pas dans la pièce
est une contradiction fabriquée de toutes pièces, exactement ce que la constitution interdit, et
elle n'aurait été visible qu'en ouvrant la maquette.

**Ce gabarit ne décrit pas le produit.** C'est une enveloppe de représentation, déclarée comme
telle et affichée comme telle partout — la mention « conventionnel — non relevé » est portée par
la maquette, la fiche et le bilan des cotes. L'encombrement du fabricant reste contradictoire et
consigné à part, avec ses quatre points. Voir `research.md` et `data-model.md`.

Le centre de l'implantation est une convention de même nature : rien dans la pièce ne désigne un
emplacement préféré, et une étagère posée de travers se verrait immédiatement. La position est
donc **centrée** — le milieu de la paroi ouest est à 2,80 m de l'angle sud-ouest, et le gabarit
s'y étend de 2,08 à 3,52 m — et déclarée comme telle.

## Ce qui n'est pas résolu

**La hauteur de montage est inconnue.** Aucune source ne dit à quelle hauteur le rack sera fixé, et
aucune n'est inventée ici. Le gabarit la fixe à 0,80 m **pour représenter la figure seulement**. Le jour
où la hauteur réelle est connue, c'est le gabarit qui change — `cotes.hauteurMontage` passe alors
de `inconnu` à `releve`, et le volume suit.

**Ce qui changerait la conclusion.** Une face n'est libre que tant qu'elle le reste. Si un composant
ou un cheminement vient s'y poser, l'ouest cesse d'être la seule option et ce document doit être
rejoué — c'est-à-dire que le script doit être relancé. C'est la raison de son existence.

## Ce que ce document ne conclut pas

Il ne conclut pas que l'ouest est la **meilleure** paroi, seulement qu'elle est **libre**. Le
rangement n'a pas été confronté aux obstacles ni aux tracés : le gabarit du véhicule (FR-039) est
aujourd'hui un obstacle, et la question de savoir si le rangement le rejoint ou reste hors
contrôle reste ouverte.
