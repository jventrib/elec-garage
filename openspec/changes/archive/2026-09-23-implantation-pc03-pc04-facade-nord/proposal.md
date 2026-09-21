# Proposal

## Why

Décision du maître d'ouvrage du 2026-09-23 : **PC-04 doit être en façade nord**, à l'extérieur,
dans l'angle — et non sur la face extérieure du mur droit où il est aujourd'hui.

**Le déplacement emporte PC-03, et ce n'est pas un choix.** La traversée qui dessert un socle
extérieur est percée *derrière le boîtier du socle intérieur qui lui fait dos*, et débouche dans
son fond ; le conducteur y est repiqué. C'est ce montage qui permet à SC-018 de tenir — *« aucun
conduit ne chemine à l'extérieur du local »*. Une traversée par la paroi **nord** ne peut pas
sortir du fond d'un boîtier posé sur la paroi **est** : les deux sont perpendiculaires.

Déplacer PC-04 seul imposerait donc soit un conduit extérieur, que SC-018 interdit, soit un
conduit intérieur le long de la paroi nord avec sa boîte et sa traversée — un conduit, une boîte
et une jonction de plus pour un seul socle. Les deux points passent ensemble, ou le montage
change de nature.

*Décision confirmée par le maître d'ouvrage le 2026-09-23 : PC-03 passe en façade nord, en face
de PC-04.*

## What Changes

PC-03 passe à **0,15 m de la paroi est** sur la face intérieure nord — exactement le miroir de sa
cote actuelle, qui était à 0,15 m de la paroi nord sur la face est. Il reste « dans l'angle formé
par le mur du fond et le mur droit » : son exigence ne nomme aucune paroi, seulement l'angle.

| | avant | après |
|---|---|---|
| PC-03 | est, intérieur, (5,60 ; 5,45 ; 0,30) | **nord**, intérieur, (5,45 ; 5,60 ; 0,30) |
| PC-04 | est, extérieur, (5,80 ; 5,45 ; 0,30) | **nord**, extérieur, (5,45 ; 5,80 ; 0,30) |
| TV-02 | paroi est | **paroi nord** |
| CH-03 | antenne est, puis descente | antenne est **jusqu'à l'angle**, virage sur la paroi nord, descente |

- **Le repiquage est préservé** : PC-04 reste au droit de PC-03, dos à dos à travers la paroi
  nord, et la traversée sort toujours du fond du boîtier intérieur.
- **Aucun conduit extérieur** n'apparaît : SC-018 tient sans changement.
- Le virage de l'antenne à l'angle est un **changement de direction sans dérivation** : il se
  traite par un accessoire de conduit, non par une boîte.

**Conséquence sur le dimensionnement, mesurée et non estimée** : PC-03 est le point dimensionnant
du circuit des prises, et le détour par l'angle l'allonge de **0,30 m**.

| | avant | après |
|---|---|---|
| PC-03 depuis le tableau | 8,15 m | **8,45 m** |
| métré 2,5 mm² | 42,66 m | **43,56 m** |
| chute terminale de PC-03 | 1,28 % | **~1,33 %** |
| chute cumulée | 2,96 % | **~3,01 %** — limite 5 % |

La marge passe de 2,04 à environ 1,99 point. Ce n'est pas une révision du dimensionnement, mais
la note de calcul porte les deux chiffres et DOIT être reprise : un métré qui ne suit pas le
tracé est un métré faux, même quand l'écart est petit.

## Capabilities

### New Capabilities

Aucune.

### Modified Capabilities

- `installation/points-utilisation` : les exigences « Position de PC-03 » et « Position de
  PC-04 » nomment le mur droit et « au droit de PC-03 ». La première change de paroi, la seconde
  doit dire de quelle paroi elle est au droit.
- `installation/cheminements` : la traversée derrière le boîtier du socle intérieur est écrite
  pour deux boîtiers dos à dos sur la paroi est ; elle vaut désormais pour deux parois.

## Impact

**La géométrie a été vérifiée à vide avant d'être proposée** : les vingt-trois règles ne rendent
aucun défaut sur les quatre apports fusionnés. Le repiquage tient, la traversée reste unique, et
rien ne chemine dehors.

- `data/apports/002-prises-de-courant.json` — PC-03, PC-04, TV-02, segments de CH-03
- `dossier/002-prises-de-courant/note-de-calcul.md` — chemin le plus long, chute de tension, métré
- `dossier/002-prises-de-courant/implantation.md` — section 4, tableau des traversées, et la page
  qui explique pourquoi la traversée se perce derrière le boîtier
- Instructions de montage des étapes de perçage et de pose, qui nomment « les deux traversées »
  et leur paroi
- `tests/apport-002.test.js` et les tests de longueur, qui portent 8,15 m et 42,66 m

**Hors périmètre** : la hauteur d'axe de 0,30 m, l'indice de protection des points extérieurs,
et le fait que le terrain clos dispense d'un coffret verrouillable. Rien de tout cela ne dépend
de la paroi.
