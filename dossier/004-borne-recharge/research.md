# Phase 0 — Décisions de conception

**Fonctionnalité**: `004-borne-recharge` | **Date**: 2026-09-22

Sept décisions. Deux ont été prises par le maître d'ouvrage et vérifiées ici ; une a corrigé un
avis erroné de l'assistant ; une impose une extension du socle ; les trois dernières bornent ce
qui reste inconnu.

---

## R1 — La ligne passe au-dessus du tronc, dans la bande de la porte de service

**Decision**: sur la paroi est, la ligne de la borne court **au-dessus** du tronc partagé, à un
axe de **z = 2,64 m**.

**Rationale**: décision du maître d'ouvrage du 2026-09-22, vérifiée. La bande utile au-dessus du
linteau de la porte de service fait **0,25 m**, entre 2,50 et 2,75 m. Le tronc en IRL 25 y occupe
2,5875 à 2,6125. La condition de FR-036 s'écrit :

```
2,6125 + 0,010 + d/2  ≤  axe  ≤  2,750 − 0,010 − d/2
```

soit 2,635 à 2,727 m en IRL 25, et 2,639 à 2,724 m en IRL 32. **La bande tient la ligne jusqu'à
l'IRL 32 inclus** : le choix du diamètre, qui n'est pas arrêté, ne peut pas rendre le parcours
infaisable. C'est ce que la réservation de FR-047 et FR-063 de `002` promettait, et elle est ici
honorée puis refermée — il n'y reste pas la place d'un troisième conduit.

**Pourquoi 2,64 et non le milieu de l'intervalle** : parce que la ligne doit aussi **entrer dans
le flanc de deux boîtes** centrées à 2,60 (R3). Plus elle monte, plus ces boîtes doivent être
grandes. 2,64 laisse 0,0275 m au tronc et exige des boîtes d'au moins 0,112 m de côté, calculées
sur le majorant de calibre.

**Alternatives considered**:
- *En dessous du tronc* : la bande n'y fait que 0,0875 m et le conduit passerait à moins de
  0,03 m du linteau, là où les fixations sont les plus difficiles à reprendre.
- *Au plafond plutôt que dans la bande* : il faut de toute façon franchir z = 2,60 sur la paroi
  est pour y monter, et c'est là qu'est le problème (R3).

---

## R2 — Les boîtes doivent devenir des volumes, et c'est bloquant

**Decision**: étendre le socle pour qu'une boîte de dérivation déclare ses **dimensions**, et que
les règles **V17** et **V20** raisonnent sur son **enveloppe** et non sur son point.

> **Faite le 2026-09-22.** `src/geometrie/enveloppe.js`, la fusion des nœuds dans `graphe.js`,
> l'exemption de V20 et la nouvelle règle **V21**. Six tests dans `tests/boite-volume.test.js`,
> sept dans `tests/enveloppe.test.js`. Le socle comptait alors **vingt et une** règles — V22 s'y est ajoutée le 2026-09-22 avec la contiguïté déclarée. Il reste
> à déclarer les cotes dans l'apport de `002`, ce qui appartient à l'implémentation de `004`.

**Rationale** — *c'est la découverte de cette phase, et elle n'était pas prévue.*

Le tracé candidat, soumis aux vingt-deux règles, rend **quatre défauts** :

```
V17 | Jonction de 4 conduits en (5.6 ; 2.6 ; 2.64) sans boîte de dérivation.
V20 | « CH-02 » segment 1 et « CH-B1 » segment 2 se recouvrent en (5.6 ; 0.75 ; 2.6).
V20 | « CH-04 » segment 1 et « CH-B1 » segment 3 se recouvrent en (5.6 ; 2.6 ; 2.64).
V20 | « CH-04 » segment 1 et « CH-B2 » segment 1 se recouvrent en (5.6 ; 2.6 ; 2.64).
```

**Les quatre tombent à l'intérieur d'une boîte** : le premier et les deux derniers dans BD-01, le
second dans BD-02. Aucun ne dénonce une faute de tracé. Ils disent que le socle ne sait pas
représenter ce qui se passe **dans** une boîte, parce qu'une boîte y est un point sans épaisseur.

Or la ligne de la borne **doit** traverser ces deux boîtes, et cela n'est pas un choix :

- à **z = 2,60**, la paroi est est occupée **sans interruption de y = 0 à y = 5,45** — CH-L1 de
  l'éclairage vers le sud, CH-02 puis CH-03 des prises vers le nord. Toute montée depuis le
  tableau doit franchir cette altitude, et le seul endroit où on la franchit légitimement est
  **l'intérieur d'une boîte**. C'est BD-02, à l'aplomb du tableau ;
- en **y = 2,60**, CH-04 monte de BD-01 au plafond et occupe **toute** la bande au-dessus de la
  boîte. Tout parcours horizontal la franchit. Le seul endroit légitime est **l'intérieur de
  BD-01**.

**L'extension, telle qu'elle a été écrite.** Une boîte déclare `dimensions: { largeur, hauteur,
profondeur }` et `entrees`, les deux étant **inséparables**. Quatre effets :

1. **le graphe fusionne** dans le nœud de la boîte tout bout de conduit qui tombe dans son
   enveloppe. C'est ce qui rend la continuité *vraie* et non tolérée : sans cela, la ligne coupée
   en deux dans BD-02 laissait deux bouts pendants (V15) et **BR-01 n'était pas atteignable**
   (V16) ;
2. **V20** n'oppose pas deux conduits qui se croisent dans une boîte ;
3. **V17** est réglée par la fusion : le point de franchissement devient le nœud de la boîte, qui
   porte donc une boîte ;
4. **V21**, nouvelle, compte les entrées.

Les **deux garde-fous**, tous deux tenus par des tests :

1. les apports existants **ne bougent pas**. Une boîte sans `dimensions` reste un point, avec le
   comportement d'origine. Aucun des trois apports écrits ne déclare de volume, et le test *« les
   trois apports déjà écrits ne bougent pas »* le garde ;
2. l'extension **n'est pas une porte de sortie**. Déclarer un volume exempte de V17 et de V20 ;
   **V21** oblige en retour à déclarer le nombre d'entrées et refuse la boîte qui en reçoit
   davantage — un conduit qui la traverse en occupe deux. Deux tests le vérifient dans les deux
   sens : une boîte déclarant cinq entrées et en recevant six est refusée, et une enveloppe trop
   petite ne sauve pas le franchissement. *L'exemption suit la géométrie, pas la déclaration.*

**Une précision qui a son importance** : la cote à déclarer est le **minimum** que le tracé exige,
non une cote de catalogue. C'est le raisonnement du majorant, pris à l'envers : une enveloppe plus
petite que la boîte réelle rend l'exemption *a fortiori* vraie. Déclarer 0,112 m quand le produit
en fera 0,130 est donc conservateur, et cela n'invente aucune cote produit.

**Alternatives considered**:
- *Déclarer le tracé tel quel, avec quatre défauts permanents* : un dossier qui porte des défauts
  connus et tolérés est un dossier dont on cesse de lire les défauts. C'est exactement ce que le
  Principe VI cherche à éviter.
- *Rapprocher la ligne à z = 2,60 pour entrer au centre des boîtes* : impossible, c'est l'altitude
  du tronc sur toute la longueur.
- *Déplacer BD-01 ou BD-02* : elles servent les deux autres circuits et leur position est fixée
  par FR-062 de `002` et par l'aplomb du tableau.

---

## R3 — La ligne traverse BD-02 et BD-01, et BD-02 est une découverte

**Decision**: la ligne de la borne traverse **deux** boîtes, non une seule. BD-01 passe à **six
entrées** et **BD-02 à cinq**.

**Rationale**: le maître d'ouvrage avait désigné BD-01, et c'était juste. La vérification en a
trouvé une seconde : la **montée** depuis le tableau franchit l'altitude du tronc, ce qui ne peut
se faire que dans BD-02.

| Boîte | Entrées avant | Entrées après | Ce que la borne y fait |
|-------|---------------|---------------|------------------------|
| BD-02 (5,60 ; 0,70 ; 2,60) | 3 — CH-01, CH-02, CH-L1 | **5** | entre par le fond de la boîte depuis la montée, ressort par le flanc nord à 2,64 |
| BD-01 (5,60 ; 2,60 ; 2,60) | 4 conduits + 1 traversée en fond | **6** + la traversée | entre par le flanc sud à 2,64, ressort par le flanc nord à 2,64 |

**Condition de dimension**, qui découle de R1 et se lit sur une fiche produit :

```
|axe − 2,60| + d/2  ≤  h/2        soit  h ≥ 0,112 m  pour axe = 2,64 et d = 0,032 (majorant)
```

BD-01 doit donc faire **au moins 112 mm de côté**, et BD-02 au moins **132 mm** pour loger en
outre les deux montées distantes de 0,05 m — cotes dérivées du **majorant** de calibre, l'IRL 32,
et non d'un IRL 25 supposé, de sorte qu'elles valent quel que soit le calibre retenu. Ce sont des conditions, pas des cotes
choisies : elles se vérifient au catalogue.

**Ce que le Principe IV en dit**. Il était **muet** sur la boîte, et le silence n'est pas une
permission sur un principe de sécurité. Amendé en **v1.11.0** le 2026-09-22 : la dédicace vaut
pour le circuit, les protections et le conduit, **pas** pour la boîte — mais la traversée n'est
admise que sous quatre conditions cumulatives, dont la première est qu'**aucune connexion** de la
borne n'y soit faite. Une boîte partagée peut être *traversée*, jamais servir de *jonction*.

**Alternatives considered**: voir R2. Aucune n'a survécu à la géométrie.

---

## R4 — Un avis de l'assistant corrigé, et la règle qui en est née

**Decision**: consigner que la recommandation initiale était fausse, et que c'est ce qui a produit
**V20**.

**Rationale**: invité à arbitrer le passage au droit de BD-01, l'assistant a d'abord recommandé de
passer **au-dessus** de la boîte sans la traverser, sur un raisonnement de volume et de
consignation. Le raisonnement était juste et l'option **impossible** : CH-04 occupe la verticale
y = 2,60 de 2,60 à 2,75, et les quatre axes envisagés — 2,66, 2,68, 2,70, 2,72 — la heurtent tous.

**Aucune des dix-neuf règles ne l'a signalé.** Le contrôle de collision n'opposait les conduits
qu'aux obstacles relevés, jamais entre eux. La lacune était connue et écrite depuis R4 de
`003-eclairage` ; elle n'avait jamais mordu, et une lacune qui ne mord pas ne se referme pas.

**V20** a donc été écrite : deux conduits ne peuvent plus se recouvrir. Son premier test rejoue le
tracé fautif. Une seconde version a été nécessaire le même jour : la première exemptait toute
paire partageant une extrémité, ce qui aurait laissé passer **deux montées superposées partant du
tableau** — précisément le cas de cette fonctionnalité.

*Ce que cet épisode dit : sur ce projet, les deux erreurs de géométrie trouvées l'ont été par une
question du maître d'ouvrage ou par un calcul fait exprès, jamais par une règle. Les règles ne
rattrapent que ce qu'on a déjà pensé à leur confier.*

---

## R5 — La section n'est pas décidée, et la chute de tension ne la décidera pas

**Decision**: laisser `section`, `calibreProtection` et `typeDifferentiel` à `null`, et donner la
chute de tension **en fonction de la section** plutôt que d'en retenir une.

**Rationale**: le chemin le plus long est **calculé** sur le tracé — 10,49 m, un seul chemin, la
ligne n'ayant aucune dérivation. `ΔU = 2ρLI/S` avec I = 32 A donne :

| Section | ΔU terminale | Cumulée avec l'arrivée (1,65 %) | Limite 5 % |
|---------|--------------|----------------------------------|------------|
| 4 mm² | 1,64 % | **3,29 %** | tenue |
| 6 mm² | 1,09 % | **2,75 %** | tenue |
| 10 mm² | 0,66 % | **2,31 %** | tenue |

**La chute de tension n'est donc pas la contrainte**, et c'est le résultat utile : la section sera
fixée par le **courant admissible** en pose apparente sous conduit à 32 A, valeur normative, et
non par ΔU. Retenir une section ici reviendrait à présenter un chiffre de sécurité comme acquis.

**Alternatives considered**: *retenir 6 mm² « parce que c'est l'usage »* — un chiffre plausible
sur une grandeur de sécurité a l'apparence d'une vérification sans en être une. C'est la décision
R6/R5 des fonctionnalités antérieures, et elle tient ici.

---

## R6 — La borne à 1,00 m, et ce qui reste à confirmer

**Decision**: axe de BR-01 à **z = 1,00 m**, x = 2,80 m — l'axe médian du local, la fenêtre étant
centrée —, sur le nu intérieur de la paroi nord.

**Rationale**: FR-004 exige que **tout** tienne sous l'allège, à 1,50 m. Un axe à 1,00 m laisse
**0,50 m** au-dessus, donc admet un coffret jusqu'à 1,00 m de haut — la question est retirée pour
tout produit réaliste, au lieu d'être suspendue à sa cote. La condition s'écrit :

```
1,00 + hauteurCoffret/2  ≤  1,50
```

La **plage normative** de hauteur d'axe pour un appareil de ce type reste **à confirmer** sur le
texte (FR-005) : 1,00 m est une décision d'implantation, pas une valeur lue.

**Alternatives considered**: *1,20 m*, plus confortable à la manœuvre, mais ne laisse que 0,30 m
et rend la condition dépendante de la cote du coffret ; et le parcours sous l'allège n'y passe
plus.

---

## R7 — Rejoindre la borne sans traverser la fenêtre, et par le dessus

**Decision**: descendre en **x = 4,50 m**, à 0,20 m à l'est de la baie, jusqu'à **z = 1,40 m**,
puis courir vers l'ouest **sous l'allège** jusqu'à x = 2,80, puis descendre de 0,40 m sur BR-01.

**Rationale**: deux contraintes se croisent.

- **FR-019** interdit de traverser la fenêtre, qui occupe x 1,30 à 4,30 et z 1,50 à 2,03. Toute
  descente entre ces abscisses la franchirait. D'où x = 4,50, avec 0,20 m de garde.
- La constitution (v1.9.0) impose que les conducteurs **entrent par le haut** d'un appareil mural,
  et que la descente soit **à son aplomb**. Une arrivée latérale à 1,00 m serait donc fautive.

Le seul tracé satisfaisant les deux passe **sous l'allège** : le parcours ouest à 1,40 m laisse
0,10 m sous la baie et 0,40 m au-dessus de l'axe de la borne, puis la dernière descente se fait
au droit de BR-01, par le dessus.

**Alternatives considered**:
- *Descendre au droit de la borne depuis le plafond* : traverse la fenêtre. Écarté par FR-019.
- *Passer au-dessus du linteau de la fenêtre, à 2,03 m, puis descendre en x = 4,50* : même
  longueur, mais le parcours haut longerait la baie sur 1,50 m sans raison. Le parcours sous
  l'allège est plus court à la descente et plus près de la borne.
- *Descendre à l'ouest de la baie, en x = 1,10* : symétrique et plus long de 2,80 m.

---

## R8 — Le différentiel est dédié et sera de type A ou F, et cela ne tranche pas la question

**Decision**: la borne a son **propre dispositif différentiel** (FR-010, confirmé), et le type
retenu sera **A ou F** — le type B est écarté. Le choix entre A et F n'est pas fait.

**Rationale**: décision du maître d'ouvrage du 2026-09-22. Le différentiel dédié était déjà exigé
par le Principe IV ; la confirmation lève une ambiguïté et ne change pas la conception.

**Ce que la décision NE règle PAS, et qu'il faut dire** — deux points, tous deux faciles à croire
réglés :

*Premier point : un différentiel dédié ne dit rien de l'amont.* Le tableau divisionnaire porte un
interrupteur différentiel de **type AC** relevé. Le circuit de la borne, s'il en part, se trouve
derrière lui — et le Principe II proscrit un type AC en amont d'un type A, F ou B, parce qu'une
composante continue le désensibilise **au moment même où il servirait**. **FR-050 de `002` reste
donc bloquante**, et la dédicace du différentiel n'y change rien.

*Second point : « A ou F » ne décide pas de la détection du courant continu.* Le Principe IV ne
connaît que deux voies — type B, ou type A **associé** à une détection de courant continu
résiduel de 6 mA intégrée à la borne. La vraie question n'est donc pas « A ou F ? » mais :

> **La borne intègre-t-elle, oui ou non, la détection 6 mA ?**

| Réponse | Conséquence |
|---------|-------------|
| **Oui** | Le type A satisfait la constitution. Le type F devient un choix à justifier par autre chose — sa tolérance aux courants résiduels à fréquences composées —, faute de quoi il coûte plus sans rien apporter ici |
| **Non** | **Ni A ni F ne sont admissibles.** Le type B redevient obligatoire, contre l'orientation retenue |

Cette question se lit sur une **fiche produit de borne**, non sur la norme, et elle doit être
posée avant l'achat — pas après.

**Sur le type F, qui n'est nommé nulle part dans la constitution.** L'adopter suppose au préalable
l'une de deux choses : soit **confirmer sur le texte de la NF C 15-100** qu'un type F répond à
l'exigence de détection du courant continu pour un point de charge — valeur normative, qui rejoint
la liste du scénario 6 et **n'a pas été renseignée de mémoire** —, soit le traiter comme un type A
« ou mieux », auquel cas la détection 6 mA intégrée reste exigée à l'identique.

Si la première voie aboutit, le Principe IV devra être **amendé** pour nommer le type F : il
énumère aujourd'hui deux voies et deux seulement, et une pratique admise qui ne figure pas dans le
texte est une règle qu'on applique de mémoire.

**Alternatives considered**:
- *Retenir le type B* : écarté par le maître d'ouvrage. C'était la seule voie qui n'aurait rien
  reporté sur une fiche produit.
- *Trancher A ou F maintenant* : prématuré. Les deux dépendent de la même réponse, et la trancher
  avant de l'avoir donnerait une décision sans fondement — exactement ce que le Principe I
  interdit sur une grandeur de sécurité.

**Ce qui reste `null` dans les données** : `typeDifferentiel`, tant que la détection 6 mA n'est pas
établie sur une fiche produit.

---

## R9 — Le circuit part du bornier, en amont du type AC

**Decision**: le différentiel de la borne est monté sur le **bornier du tableau divisionnaire**,
**en amont** de l'interrupteur différentiel de type AC existant. Décision du maître d'ouvrage du
2026-09-22.

**Rationale**: le Principe II proscrit un type AC en amont d'un type A, F ou B — une composante
continue le désensibilise au moment même où il servirait. Partir du bornier place le circuit de la
borne **à côté** du type AC et non derrière lui, ce qui lève la contradiction sans attendre le
remplacement de l'interrupteur.

**Ce que cela règle** : **FR-050 de `002` cesse de bloquer `004`.** Elle reste entière pour les
circuits des prises et de l'éclairage, qui sont bien en aval du type AC et dont le Principe II
exige un type A au minimum. Le remplacement reste donc à statuer — il n'est simplement plus sur le
chemin critique de la borne.

**Ce que cela crée, et qui est plus sérieux qu'il n'en a l'air** :

> **Ouvrir l'interrupteur différentiel du tableau ne met plus la borne hors tension.**

C'est le geste par lequel on consigne habituellement ce local. Après cette décision, il laisse
vivant le circuit le plus énergétique du garage — 32 A sous 6 mm² — et, avec lui, **les
conducteurs qui transitent BD-01 et BD-02**. Quelqu'un qui ouvre l'interrupteur, constate
l'absence de tension sur une prise, puis ouvre BD-01 pour intervenir, y trouvera du 32 A vivant.

Trois conséquences s'enchaînent, et aucune n'est facultative :

1. le repérage de BD-01 et BD-02 exigé par le Principe IV amendé DOIT **nommer la borne** — ce
   qui était déjà écrit — **et préciser qu'elle n'est pas coupée par l'interrupteur du tableau** ;
2. la consignation du local DOIT viser **l'organe propre de la borne**, et non l'interrupteur
   général ;
3. le tableau lui-même DOIT porter cette mention, à l'endroit où le geste se fait.

**Deux conditions de faisabilité**, à vérifier avant la pose : le **bornier** doit accepter un
départ supplémentaire de 32 A, et le tableau doit disposer des modules libres. Ce sont des
constats de relevé, pas des décisions.

**Alternatives considered**:
- *Remplacer d'abord l'interrupteur de type AC* : règle le problème à la racine et pour les trois
  circuits, mais met `004` en attente d'une décision qui ne lui appartient pas. C'est ce que la
  décision du bornier évite.
- *Laisser la borne en aval du type AC* : proscrit par le Principe II. Jamais envisagé.

---

## R10 — Le type F, vérifié en ligne : admis, et il ne dispense de rien

**Decision**: consigner ce que la recherche établit, **avec ses sources**, et le maintenir « à
confirmer » sur le texte de la norme. Le type du différentiel reste `null` dans les données.

**Rationale**: le maître d'ouvrage a demandé le 2026-09-22 de se renseigner en ligne sur le type F.
Ce qui suit vient de **sources secondaires**, non du texte de la NF C 15-100. Conformément à la
règle du projet, elles sont citées et leur état reste **à confirmer** — une source secondaire sur
une grandeur de sécurité a l'apparence d'une vérification sans en être une.

**Ce que les sources concordent à dire** :

| Point | Ce qui est rapporté | État |
|-------|---------------------|------|
| Clause applicable | **NF C 15-100, partie 7-722**, « Règles particulières pour l'alimentation des véhicules électriques » — cité par deux sources indépendantes | **à confirmer sur le texte** |
| Type admis en monophasé | DDR de **type A ou F** | **à confirmer** |
| Détection du courant continu | **exigée en plus**, à 6 mA, quel que soit le type retenu | **à confirmer** |
| Le type F dispense-t-il du 6 mA ? | **Non.** Une source l'écrit explicitement comme une idée reçue : « Le Type F ne dispense PAS du dispositif 6 mA DC ! C'est une idée reçue » | **à confirmer** |
| Où se trouve le dispositif 6 mA | **intégré à la borne** ou **module distinct au tableau** — les deux implantations sont rapportées comme admises | **à confirmer** |
| Ce que le type F apporte | Immunité aux courants résiduels à fréquences composées, donc moins de déclenchements intempestifs. **Pas** la détection du courant continu | **à confirmer** |
| Référentiel du dispositif 6 mA | RDC-DD, **IEC 62955** | **à confirmer** |

**Sources consultées le 2026-09-22** :

- [Bornetik IDF — Protection différentielle IRVE : types A, F, B](https://bornetik-idf.fr/guides/reglementation/protection-differentielle-irve-types-normes-regles)
- [Legrand — Norme NF C 15-100, suivez le guide](https://www.legrand.fr/pro/normes-et-reglementations/norme-nf-c-15-100/norme-nf-c-15-100-suivez-le-guide) *(confirme l'existence et l'intitulé de la partie 7-722, sans le détail)*
- [ENGIE — Quel type de différentiel pour une borne de recharge ?](https://particuliers.engie.fr/electricite/conseils-electricite/conseils-mobilite-electrique/type-differentiel-borne-recharge.html)
- [team work solution — Différentiel borne de recharge, type A ou F ?](https://teamworksolution.fr/guides-mobilite-electrique/diff-rentiel-borne-de-recharge-type-a-ou-f-que-choisir/)

**Ce que la recherche change, et ce qu'elle ne change pas** :

- Elle **confirme l'orientation** du maître d'ouvrage : le type F est admis, le type B n'est pas
  obligatoire.
- Elle **confirme la mise en garde de R8**, et sur ce point les sources sont explicites : *le
  choix entre A et F ne décide pas de la détection du courant continu.* La question reste
  entière.
- Elle **ouvre une troisième voie** que R8 n'avait pas : le dispositif 6 mA peut être un **module
  distinct au tableau** plutôt qu'intégré à la borne. Cela **découple la décision de la fiche
  produit de la borne**, ce qui est un gain réel — on cesse de dépendre d'un catalogue pour une
  exigence de sécurité.
- Elle **ne permet pas de trancher A ou F**, et ce n'est pas son rôle : entre deux montages tous
  deux conformes, le choix est économique et relève du maître d'ouvrage. Ce que l'on sait
  maintenant, c'est que le type F **achète du confort d'exploitation**, pas de la conformité.

**Effet sur la constitution** : le Principe IV énonçait une **énumération fermée** sans référence
de clause, qui excluait le type F et imposait le dispositif 6 mA dans la borne. Amendé en
**v1.12.0** : l'exigence — la détection du courant continu à 6 mA — est énoncée comme non
négociable, et l'énumération est marquée **indicative, non exhaustive, et à confirmer sur le
texte**. Aucun type n'y a été ajouté au titre d'une source secondaire.
