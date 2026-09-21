# Note de calcul — automatisation locale

**Changement** : `automatisation-locale-mise-en-oeuvre` | **Circuits** : `c-eclairage`, `c-prises` |
**Date** : 2026-09-23

Ce document porte le **raisonnement** propre à l'automatisation. Il ne répète pas les notes des
circuits qu'elle modifie : [`003-eclairage`](../../../dossier/003-eclairage/note-de-calcul.md), dont
le § 2.4 dit ce qui a changé, et [`002-prises-de-courant`](../../../dossier/002-prises-de-courant/note-de-calcul.md).
Les valeurs conclues vivent une seule fois, dans les apports ; les décisions de conception sont
dans [design.md](design.md).

Comme dans les autres notes, chaque grandeur porte son **origine** — `calculée`, `dérivée`,
`décidée`, `normative`. **Aucune valeur normative n'est renseignée de mémoire** : une case vide vaut
mieux qu'un chiffre plausible sur une grandeur de sécurité.

## 1. Ce que l'automatisation ajoute aux conduits

Le décompte est **dérivé** par le socle (`src/geometrie/conducteurs.js`) depuis le pilotage déclaré,
et vérifié par `tests/apport-005.test.js`. Il n'est pas recopié ici d'une table faite à la main :
celle de `dossier/005-automatisation-locale/data-model.md` en donnait une, et elle était fausse sur
deux conduits.

| Cheminement | Calibre | Avant | Après | Ce qui s'ajoute |
|-------------|---------|-------|-------|-----------------|
| GL-01 | goulotte | 9 | **14** | sortie de MC-01, paires d'ordre de CM-01 et CM-04 |
| **CH-02** | **IRL 25** | 6 | **10** | sortie de MC-01, paire de CM-01, fil d'ordre du bouton de porte |
| **CH-05** | **IRL 25** | 8 | **9** | paire de CM-01, à la place du retour de CM-01 |
| CH-04, CH-07 | IRL 20 | 6 | **7** | fil d'ordre du bouton de porte ; la sortie de MC-01 remplace le retour de CM-01 |
| CH-08 | IRL 20 | 3 | **4** | fil d'ordre du bouton de porte |
| CH-L1 | IRL 20 | 3 | **8** | paire de CM-04 ; phase, fil d'ordre et PE du bouton de porte |
| CH-A1 | IRL 20 | — | **6** | paire d'ordre et PE de CM-04 ; phase, fil d'ordre et PE de CM-05 |

*Origine : **dérivée**.* Les conducteurs du bouton de porte sont en **2,5 mm²**, section du circuit
des prises qui les protège ; les autres conducteurs ajoutés sont en 1,5 mm². *Révisé le
2026-09-23* : l'entrée de MC-02 commute la phase (design D6). Le bouton reçoit la phase des prises
et ne renvoie qu'un fil au module ; le tronc perd le fil d'aller — CH-02 de 11 à 10, CH-04 et CH-07
de 8 à 7, CH-08 de 5 à 4.

**Limite connue** : le décompte se fait par cheminement. CH-L1 affiche celui de son tronçon amont,
entre la goulotte et BD-06 ; son tronçon aval, de BD-06 à la façade, n'en porte que trois. L'erreur est du
côté sûr pour le remplissage, et du côté de l'achat pour le métré des conducteurs.

## 2. Remplissage — la condition `D ≥ d·√(3n)`, conduit par conduit

Même forme exacte que dans la note `003`, § 3.1. Elle se tranche sur deux cotes produit que le
relevé ne comporte pas — le diamètre intérieur du conduit et le diamètre extérieur isolé du
conducteur —, et **ne se vérifie donc qu'à l'achat**.

| Conduit | n | Composition | Seuil | État |
|---------|---|-------------|-------|------|
| **CH-02** | 10 | 4 × 2,5 mm² + 6 × 1,5 mm² | **≥ 16,42 mm** au moins — borne inférieure, voir ci-dessous ; seuil exact *(à calculer sur cotes produit, en IRL 25)* | **ouverte** |
| **CH-05** | 9 | 3 × 2,5 mm² + 6 × 1,5 mm² | **> 14,69 mm** ; seuil exact *(à calculer sur cotes produit, en IRL 25)* | **ouverte** |
| CH-L1 | 8 | 3 × 2,5 mm² + 5 × 1,5 mm² | **≥ 14,69 mm** — même composition que l'ancien CH-05, note `003` § 3.2 | **condition d'achat** |
| CH-04, CH-07 | 7 | 4 × 2,5 mm² + 3 × 1,5 mm² | *(à calculer sur cotes produit)* — ne se compare pas à 14,69 mm sans elles | **ouverte — condition d'achat** |
| CH-08 | 4 | 4 × 2,5 mm² | *(à calculer)* | ouverte, sans enjeu apparent |
| CH-A1 | 6 | 3 × 2,5 mm² + 3 × 1,5 mm² | *(à calculer)* | ouverte, sans enjeu apparent |

*Révisé le 2026-09-23* : à **dix** conducteurs depuis que l'entrée de MC-02 commute la phase,
CH-02 porte les huit de la composition de référence plus un de 2,5 mm² et un de 1,5 mm², dont la
section moyenne dépasse encore celle des huit. Le seuil croît donc au moins comme √(10/8) :
14,69 × 1,118 = **16,42 mm**, toujours au-delà des IRL 20 relevés. La décision qui suit tient.
Le raisonnement d'origine, à onze, est conservé tel quel.

**Décision du maître d'ouvrage du 2026-09-23 : CH-02 et CH-05 en IRL 25.** *Motif* : à onze
conducteurs, CH-02 exige **au moins 17,23 mm** intérieurs, au-delà des IRL 20 dont les cotes ont été
relevées pour la note `003` (14,0 à 15,8 mm). *Cette borne ne dépend d'aucune cote de conducteur* :
CH-02 porte les huit conducteurs de la composition de référence — celle du seuil de 14,69 mm — plus
deux de 2,5 mm² et un de 1,5 mm², dont la section moyenne est au moins celle des huit. La section
totale croît donc au moins comme 11/8, et le seuil au moins comme √(11/8) : 14,69 × 1,173 =
17,23 mm. CH-05 porte les huit plus un de 1,5 mm² : il exige **strictement plus** de 14,69 mm, sans
qu'une borne supérieure s'en déduise — à la limite des produits relevés. *Écarté* :
tout le tronc en IRL 25, qui reviendrait sur la référence unique de tube au-delà de ce que le
dépassement impose. **Le calibre ne dispense pas de la vérification** : la condition s'écrit aussi
en IRL 25.

*Le seuil de 14,69 mm ne se transpose pas à CH-04 et CH-07.* Il a été établi pour trois
conducteurs de 2,5 mm² et cinq de 1,5 mm² ; ces deux conduits en portent quatre et trois. Ils ont
un conducteur de 2,5 mm² de plus et deux de 1,5 mm² de moins : selon les cotes produit, leur seuil
est au-dessus ou au-dessous. Le transposer serait supposer la conclusion.

**À vérifier à l'achat** : *(cotes produit relevées : IRL 20 D = .......... mm, IRL 25 D = ..........
mm, d(1,5) = .......... mm, d(2,5) = .......... mm → conditions ..........)*

## 3. Chute de tension — sans enjeu, et en baisse

Portée par la note `003`, § 2.2 et 2.4. MC-01 étant sur le chemin du plafonnier, la phase de
EL-01b ne fait plus le détour par CM-01 : **1,77 %** cumulée contre 1,79 % auparavant. *Origine :
**calculée**.* Le circuit des prises n'est pas affecté : le fil d'ordre du bouton de porte ne porte
aucune puissance.

## 4. Les deux valeurs normatives nouvelles — à confirmer

Le tableau et la goulotte sont contigus : sur **1,12 m**, les conducteurs du tronc cheminent sans
tube, et cette portion ne relève pas de la catégorie **B1**, celle des conducteurs isolés en
conduit. `Iz` dépend du mode de pose.

| Question | Valeur | Origine | Référence | État |
|----------|--------|---------|-----------|------|
| **(a)** Lettre de sélection du mode de pose pour des conducteurs isolés **en goulotte** | *(à renseigner)* | **Normative** | *(clause : ..............)* | **à confirmer** |
| **(b)** Une portion de 1,12 m hors conduit, sur un parcours de l'ordre de 14 m, **peut-elle être négligée** dans la détermination d'`Iz` ? | *(à renseigner)* | **Normative** | *(clause : ..............)* | **à confirmer** |

Reportées à la tâche 1.6 de `reserves-maitre-ouvrage`. La question (a) est voisine de la tâche 1.8,
qui la pose pour le câble de la borne.

## 5. Ce qui se consigne, et qui n'est pas un calcul

**Délai d'extinction de MC-01** (tâche 2.7) — **décision du maître d'ouvrage**. Un réglage non
consigné est réputé non fait (Principe V) : c'est déjà l'exigence retenue pour la temporisation du
détecteur de façade.

*(délai retenu : .............. — décidé le .............. — réglage effectif vérifié le ..............)*

**État au retour du courant** : **éteint**, sortie ouverte. *Origine : **dérivée** de l'exigence*
— au retour du courant, garage vide et porte fermée, tout autre état est un allumage inopiné.

## 6. Ce que l'automatisation aggrave ou exige ailleurs

- **FR-050, type du différentiel** — deux charges à découpage **alimentées en permanence** de plus,
  une sur chacun des deux circuits d'usage courant. Un type AC ne voit pas leurs composantes
  continues. La décision reste ouverte, et elle est plus contraignante encore.
- **Séparation des domaines de tension de MC-02** — alimenté en 230 V, sa sortie referme les
  bornes 21 / 20 du moteur en TBTS 24 V. La séparation exigée entre les deux DOIT être justifiée
  sur la fiche du produit retenu : *(référence et mention de la fiche : ..............)*. Le domaine
  de tension de l'entrée du moteur reste **à constater** au relevé (tâche 1.1).
