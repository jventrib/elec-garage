# Restriction d'usage — la fixation du rack

**Fonctionnalité** : `006-rangement` | **Date** : 2026-09-27

Ce document consigne une restriction qui **n'a pas de traduction dans la maquette**, et qui doit
pourtant être respected à l'installation. C'est précisément ce qui la rend facile à perdre.

## Le fait

La fiche du rack indique explicitement que le produit **ne fournit pas de tiges d'ancrage pour
mur en béton** :

> *« Our product does not come with expansion bolts for installation on concrete wall »*

Les parois du garage en sont. Il manque donc une pièce pour poser le rack, et cette pièce n'est
pas fournie. Par ailleurs, **aucune donnée de fixation n'est déclarée** : ni diamètre de tige, ni
référence d'ancrage, ni entraxe, ni couple de serrage.

## Ce qui n'est pas tranché

Trois voies existent, et aucune n'est choisie ici :

| Voie | Ce qu'elle exige | Ce qui manque |
|---|---|---|
| Scellement chimique | une cartouche de résine et un dosage | le choix de la résine pour 0,20 m de béton |
| Tiges adaptées | des tiges pour paroi creuse **ou** pour béton | le **nature de la paroi**, jamais relevée |
| Fixation sur ossature | un support bois derrière la paroi | l'existence d'une ossature, inconnue |

Le choix dépend d'une donnée que personne n'a relevée : **la paroi est-elle creuse ou pleine ?**
Tant que cela n'est pas connu, recommander l'une des trois voies serait faire une hypothèse
technique déguisée en conclusion.

## La restriction elle-même

Tant que le mode de fixation n'est pas décidé :

- **aucune cote de perçage n'est produite**, ni dans les données, ni dans la maquette, ni au
  dossier. Une cote de perçage inventée serait pire qu'une cote absente : l'installateur lui
  donnerait une consigne.
- **la maquette ne doit pas laisser croire que la fixation est résolue.** L'icône de mur-mounted
  et la mention « mural » de la fiche ne valent pas justification. La réserve est affichée.
- **le gabarit de représentation ne vaut pas plan de pose.** Ses dimensions sont une convention
  de dessin, comme le disent `implantation.md` et `data-model.md` ; elles ne sont pas cotées pour
  être reportées sur un chantier.

## La charge, qui n'est pas établie non plus

La charge est un second motif de réserve, et il est plus grave que le premier parce qu'il engage
la sécurité.

La fiche porte `Shelf Weight Capacity 136 Kilograms` — une charge **par tablette** — tandis que
le titre, la puce commerciale et le module fabricant attribuent les mêmes 136 kg au **rack
entier**. Ces deux lectures ne mènent pas au même dimensionnement : 136 kg par tablette n'a pas la
même conséquence que 136 kg au total.

La fiche **n'est donc pas un document de dimensionnement** et ne doit pas être utilisée comme telle.
La page ne dit pas non plus si les 136 kg concernent une charge **statique** ou **dynamique**, ce
qui change entièrement la vérification d'une charge dynamique. Aucun de ces points n'est
tranché, et aucun ne le sera par déduction.

## Ce qui lèverait la restriction

Une réponse du maître d'ouvrage, ou un document fabricant complémentaire, sur :

1. la **nature de la paroi** — creuse ou pleine — qui choisit entre tiges et scellement ;
2. la **charge** — par tablette ou totale, statique ou dynamique ;
3. le **mode de fixation** retenu, et alors seulement ses cotes.

Aucune de ces trois réponses ne change la maquette. Elles changent ce que l'installateur peut
faire, ce qui est la seule chose qui compte ici.
