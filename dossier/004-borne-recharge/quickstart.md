# Phase 1 — Guide de vérification de la conception

**Fonctionnalité**: `004-borne-recharge` | **Date**: 2026-09-22

Cette fonctionnalité ne se « lance » pas : elle produit une conception. Ce guide dit comment la
vérifier — d'abord par machine, puis à l'œil, puis sur le texte de la norme, puis au chantier.

## Prérequis

- Node.js, pour la suite de tests du socle.
- Un navigateur, pour les scénarios visuels.
- Le texte de la **NF C 15-100**, pour le scénario 6.
- Les **fiches produit** de BD-01, BD-02 et du conduit retenu, pour le scénario 3. Sans elles, ce
  scénario ne conclut pas, et c'est volontaire.

## Ce qui se vérifie par machine

### 1. L'apport satisfait les vingt-deux règles du socle

```bash
npm test
```

**Attendu** : zéro défaut sur `data/apports/004-borne-recharge.json`, lu avec ceux des prises et
de l'éclairage.

**L'extension du socle qui bloquait ce scénario a été faite le 2026-09-22** (R2). Il reste une
condition, et elle est dans les **données** : BD-01 et BD-02 doivent déclarer leurs `dimensions`
et leur nombre d'`entrees`, faute de quoi le tracé ressort avec quatre défauts — et le tracé
n'est alors pas seulement mal vu, il est **inexprimable** : deux bouts de conduit pendent dans
BD-02 (V15) et BR-01 n'est pas atteignable (V16).

| Boîte | À déclarer | Pourquoi ce minimum |
|-------|-----------|---------------------|
| BD-01 | `dimensions` ≥ **0,112 m** de côté, `entrees: 6` | la ligne y entre à 0,04 m au-dessus de l'axe, et le tube doit tenir dans le flanc |
| BD-02 | `dimensions` ≥ **0,132 m** de côté, `entrees: 5` | les deux montées y sont distantes de 0,05 m |

*Cotes dérivées du **majorant** de calibre alors en vigueur, l'IRL 32 — le calibre arrêté depuis le 2026-09-22 est l'IRL 25, qui leur laisse de la marge : elles valent quel que soit le calibre que
la note de calcul retiendra.*

La cote à déclarer est le **minimum que le tracé exige**, non une cote de catalogue : une
enveloppe plus petite que la boîte réelle rend l'exemption *a fortiori* vraie.

| Règle | Ce qu'elle établira |
|-------|---------------------|
| V16 | BR-01 est atteignable depuis TD-01 par le tracé réel |
| V17 | Les deux traversées de boîte sont couvertes par l'enveloppe déclarée, non par un point |
| V19 | Aucun conduit ne franchit la fenêtre nord, la porte de service ni la sectionnelle |
| V20 | La ligne de la borne ne recouvre aucun conduit existant hors d'une boîte |
| V21 | BD-01 et BD-02 ne reçoivent pas plus d'entrées qu'elles n'en déclarent — un conduit qui traverse en occupe **deux** |
| V13, V14 | Les huit segments sont orthogonaux et reposent sur un nu déclaré |
| V8 | Aucune étape sous tension ne précède la levée — et la levée de ce circuit **n'est pas celle du tableau** (FR-040) |

### 2. La longueur et la chute de tension

**Attendu** : un seul chemin, **10,48 m** du tableau à la borne, la ligne n'ayant aucune
dérivation, pour **10,44 m** de conduit — la différence est parcourue *dans* les deux boîtes.
Chute de tension cumulée **3,29 %** en 4 mm², **2,75 %** en 6 mm², **2,31 %** en 10 mm², sur une
limite de 5 %.

**Les trois tiennent.** Ce scénario ne tranche donc pas la section : il démontre que **la chute de
tension n'est pas la contrainte** de ce circuit, et que la section sera fixée par le courant
admissible — valeur normative, scénario 6.

### 3. Les conditions de dimension, sur fiche produit

**Aucune commande.** Trois conditions, toutes exactes, toutes à lire sur deux cotes :

| Condition | Écriture | Porte sur |
|-----------|----------|-----------|
| Axe dans la bande contrainte | `2,6125 + 0,010 + d/2 ≤ axe ≤ 2,740 − d/2` | le conduit |
| Traversée de BD-01 | `h ≥ 0,112 m` | l'encombrement de la boîte |
| Traversée de BD-02 | `h ≥ 0,132 m` | l'encombrement de la boîte |
| Remplissage | `D ≥ 3d` pour trois conducteurs | le conduit |
| Volume intérieur de BD-01 | pour 8 conducteurs de 1,5 et 2,5 mm² **plus** 3 de la borne | le volume, **pas** le nombre d'entrées |

**Attendu** : chaque condition porte les deux cotes qui la vérifient. La dernière est celle qu'on
croira satisfaite sans l'avoir vérifiée — un modèle à six entrées ne démontre pas un volume
(FR-038).

### 4. Aucune valeur inventée

**Attendu** : `section`, `calibreProtection`, `typeDifferentiel` et `diametre` à `null` tant
qu'ils ne sont pas établis ; `courantEmploi` à **32**, qui est une donnée du besoin et non une
hypothèse. Zéro valeur plausible en remplacement d'une inconnue.

## Ce qui se vérifie à l'œil

### 5. La maquette montre les trois lignes parallèles

```bash
npm run serve
```

**Attendu** : sur la paroi est, **trois** parcours se lisent — le tronc partagé à 2,60 m, la ligne
de la borne à 2,64 m juste au-dessus, et rien d'autre dans la bande de 0,25 m. La ligne de la
borne se distingue par sa couleur et par le fait qu'elle **ne partage aucun mètre**. Elle entre
dans BD-02 et dans BD-01 sans s'y arrêter. BR-01 apparaît centrée sous la fenêtre, entièrement
sous l'allège, abordée **par le dessus**.

**Les cotes de tracé s'affichent à l'étape qui pose l'objet.** Pour la ligne de la borne, le
parcours sous l'allège se lit *0,10 m en dessous de l'allège de la fenêtre nord*, et BR-01
*0,50 m en dessous de l'allège* — la cote même dont FR-004 tire sa marge.

**Cliquer un conduit ouvre sa fiche**, qui porte désormais **le nombre de conducteurs qu'il
contient**, leur répartition entre circuits, et la condition de remplissage qui en découle. Sur le
tronc partagé : *8 conducteurs — 3 pour les prises + 5 pour l'éclairage — `D ≥ d × 4,90`*. Sur la
ligne de la borne : *3 conducteurs — phase, neutre, protection — `D ≥ d × 3`*.

C'est la vérification que la pose apparente rend possible : la contrainte d'encombrement de la
bande est un objet, donc elle est opposable.

## Ce qui ne se vérifie que sur le texte de la norme

### 6. Les valeurs normatives

**À confirmer, valeur par valeur** : courant admissible pour 32 A en pose apparente sous conduit
et lettre de sélection ; facteur de correction de température ; appariement section / calibre ;
plage de hauteur d'axe admise pour un appareil de ce type ; exigences propres à un point de
charge — dont la qualification IRVE ; et **si un différentiel de type F répond à l'exigence de
détection du courant continu** pour un point de charge, entrée ajoutée le 2026-09-22 avec
l'orientation « type A ou F » (FR-039).

**Attendu** : chaque valeur porte sa référence de clause. Tant qu'une seule reste à confirmer, la
note n'est pas opposable au sens du Principe I. Ces valeurs **n'ont pas été renseignées de
mémoire**, et ce n'est pas un oubli.

## Ce qui ne se vérifie qu'au chantier

### 7. Les essais du Principe V

**Attendu** : les six vérifications consignées, valeur par valeur.

### 8. La charge de quatre heures

**Attendu** : une charge se poursuit **au moins quatre heures** sans déclenchement et sans
échauffement anormal aux connexions (SC-003). C'est le seul essai qui éprouve ce qui distingue ce
circuit des autres : la **durée**. Un défaut de serrage sur 32 A continus ne se révèle pas en
trente secondes.

### 9. L'absence de connexion dans les boîtes traversées, et le repérage de consignation

**Attendu** : à l'ouverture de BD-01 et de BD-02, les conducteurs de la borne sont **continus et
non coupés**, identifiables, et chaque boîte porte un repérage **nommant le circuit de la borne**
et la mention que consigner un seul circuit n'y suffit pas (SC-013).

**Et une mention de plus, qui vient du raccordement au bornier** : le repérage DOIT préciser que
le circuit de la borne **n'est pas coupé par l'interrupteur différentiel du tableau** (FR-040).
Sans elle, quelqu'un qui ouvre l'interrupteur, vérifie l'absence de tension sur une prise, puis
ouvre BD-01, y trouvera du 32 A vivant — et il aura fait tous les gestes justes.

**Cette vérification se fait avant fermeture définitive, et une seule fois.** Les quatre
conditions du Principe IV amendé se constatent là et nulle part ailleurs : plus tard, il faudrait
rouvrir une boîte sous tension pour les contrôler.

### 10. Le dépassement, et ce qu'il fait

**Attendu** : le comportement observé est conforme à ce qui est écrit — déclenchement du
**disjoncteur d'abonné** et coupure de **toute l'habitation**, non de la seule charge (SC-005).
L'essai a une conséquence : il coupe le logement. Il DOIT donc être annoncé.

## Réserves connues

| Réserve | Effet |
|---------|-------|
| ~~**Extension du socle** — boîtes-volumes (R2)~~ | **Faite le 2026-09-22.** Reste à déclarer les cotes de BD-01 et BD-02 dans l'apport de `002` : c'est une donnée, plus un obstacle |
| ~~**FR-050 de `002`**~~ | **Levée pour `004`** par le raccordement au bornier, en amont du type AC (R9). Reste entière pour les prises et l'éclairage, qui sont bien en aval |
| **Consignation de la borne** | **Créée par ce même raccordement** : ouvrir l'interrupteur du tableau ne met plus la borne hors tension. C'est le geste habituel de consignation du local, et il laisse vivant du 32 A — y compris dans BD-01 et BD-02 (FR-040) |
| **Dispositif 6 mA** | **La question dont dépend le type du différentiel** (FR-039, FR-042). Intégré à la borne, ou module distinct au tableau — la seconde voie découple l'exigence de la fiche produit |
| Capacité du **bornier** et modules libres | Constats de relevé, à faire avant la pose (FR-041) |
| **Remplissage du conduit** | **Créée le 2026-09-22** par l'arrêt du calibre à l'IRL 25 avec trois conducteurs de 10 mm². `D ≥ 3d` se joue à quelques dixièmes de millimètre, et la bande contrainte ferme le calibre supérieur : **à trancher sur les fiches produit avant de commander le conduit**, pas à la pose (note § 3.1) |
| Cotes produit des boîtes | Le scénario 3 ne conclut pas sans elles. BD-01 et BD-02 doivent être **achetées au bon modèle dès leur pose**, pas remplacées ensuite |
| Valeurs normatives | Scénario 6 ; la note n'est pas opposable avant leur confirmation |
| **Véhicule réellement utilisé** | SC-002 ne se vérifie qu'avec lui : position de la prise de charge et longueur du câble |
| Encombrements non relevés | 32 contrôles sur 56 restent **non concluants** — vantail, tablier fermé, gabarit véhicule, débattement des portières |

## Résultat d'exécution

**Date** : 2026-09-22 | **Apport** : `data/apports/004-borne-recharge.json`, lu avec ceux des
prises et de l'éclairage
**Version du code** : `42-goulotte`

| Scénario | Résultat |
|----------|----------|
| 1 — les vingt-deux règles | ✅ **zéro défaut** sur les trois apports fusionnés. Suite complète : **427 tests**, 427 passés au 2026-09-23, les quatre apports fusionnés. Le gate annoncé au plan a été franchi par l'extension R2, puis par la déclaration des deux enveloppes (T006) |
| 2 — longueur et chute de tension | ✅ un seul chemin, **10,48 m** du tableau à la borne, pour **10,44 m** de conduit — la différence est parcourue *dans* les deux boîtes. ΔU cumulée **3,29 %** en 4 mm², **2,75 %** en 6, **2,31 %** en 10, sur 5 %. Les trois tiennent : **la chute de tension n'est pas la contrainte de ce circuit** |
| 3 — conditions de dimension | ⏳ **non exécuté** — demande les fiches produit. Les cinq conditions sont écrites et calculées, dont le **volume intérieur de BD-01**, qu'un modèle à six entrées ne démontre pas (T046) |
| 4 — aucune valeur inventée | ✅ `calibreProtection` et `typeDifferentiel` à `null` — ce sont les valeurs **normatives**, et elles le restent ; `indiceProtection` à `null` ; `courantEmploi` à **32**, qui est une donnée du besoin. **Révisé le 2026-09-22** : `section` vaut **10** et `chuteTensionCumulee` **2,31** depuis la décision du maître d'ouvrage, et le diamètre du conduit est passé de majorant à **arrêté**, `diametre` à 0,025. La frontière tient : ce qui se décide est décidé, ce qui se confirme reste vide |
| 5 — la maquette | ⏳ **non exécuté** — demande un navigateur. `dist/garage.html` est construit et porte les trois circuits, la borne en `#d62728` (T047) |
| 6 — valeurs normatives | ⏳ **non exécuté** — demande le texte de la NF C 15-100, dont la clause **7-722** (T008, T048) |
| 7 — essais du Principe V | ⏳ chantier. Les six vérifications figurent pour ce circuit : les cinq hors tension aux rangs **33 à 37**, et le déclenchement du différentiel au rang **43**, après la levée — un différentiel ne s'éprouve pas hors tension |
| 8 — charge de quatre heures | ⏳ chantier. Déclarée, étape `br-charge`, après la levée. **Le seul essai qui éprouve la durée** |
| 9 — absence de connexion dans les boîtes | ⏳ chantier, **avant fermeture définitive**. Repérage vérifié à l'étape `br-boites`, constat des conducteurs à l'étape `br-connexions` — dont l'instruction entière tient en « rien à raccorder » |
| 10 — le dépassement | ⏳ chantier. **Cet essai coupe le logement** et doit être annoncé (T050) |

### Séquence composée

**44 étapes**, empreinte `efc87fc8`, dont **14** apportées par la borne. Levée de consignation au
**rang 38**, et aucune étape sous tension ne la précède (V8).

La séquence lit les **six étapes de l'ordre de montage** arrêté le 2026-09-22, chaque phase
regroupant les trois circuits : consignation, **perçage** de tous les trous, pose des **boîtes**,
**colliers et tubes**, **tirage**, **connexions en boîte**, **appareillage**, puis les **départs
au tableau** — en dernier. Le motif est unique : ne jamais percer ni fixer un élément déjà câblé.

### Contrôles de collision

**175 contrôles** sur les trois circuits, **74 conformes**, **zéro collision établie**. Sur les 56
contrôles de la ligne de la borne :

| Obstacle | Verdict |
|----------|---------|
| Rail fermé, rail ouvert | **8 conformes** chacun |
| **Tablier ouvert** | **8 conformes**, par majorant — la ligne est entièrement au nord et au-dessus de sa borne |
| Vantail, tablier fermé, gabarit véhicule, débattement portières | **8 non concluants** chacun |

Les 32 non concluants portent sur les quatre encombrements non relevés. Aucun ne ressort vert.

### Ce que l'implémentation a trouvé, et qui n'était pas prévu

**Une instruction de sécurité était silencieusement perdue.** Le socle ne garde qu'**une** étape
de consignation pour tout le site — ce qui est juste, le geste étant unique — mais il écartait les
autres **avec leur instruction**. Or la borne se consigne au **disjoncteur d'abonné** et non à
l'interrupteur du tableau, puisqu'elle en part en amont : la seule consigne qui dise où couper
disparaissait.

Aucune règle ne pouvait le voir. V3 contrôle les objets posés, et une étape de consignation n'en
pose aucun. La déduplication **reprend désormais les instructions écartées** au lieu de les
jeter, et un test garde le fond autant que la forme — la consignation doit nommer le disjoncteur
d'abonné tant que la borne est au dossier.

**Un champ manquait au socle.** FR-017 interdit d'arrêter le diamètre du conduit d'avance, mais la
géométrie a besoin d'un calibre pour que V20 et la condition de bande soient vérifiables. Déclarer
un diamètre « provisoire » aurait fait passer une hypothèse pour une cote relevée, ce que le
Principe VI interdit. Le champ **`diametreMajorant`** a donc été ajouté, sur le modèle de
`volumeMajorant` : une forme distincte, qui n'autorise qu'un sens de conclusion — vérifier au plus
gros calibre admissible vaut a fortiori pour tout calibre inférieur. Les cotes des deux boîtes en
découlent, et c'est ce qui permet de les **acheter avant** que la section soit arrêtée.

**Deux tests sont devenus faux par construction**, et c'était le but : *« les deux étapes de
tirage se suivent »* supposait exactement deux circuits, tous deux sur le tronc partagé — la borne
en ajoute un troisième dont le conduit n'est partagé avec rien. Réécrit en distinguant les deux
cas. Et le vocabulaire du contrôle des instructions ne connaissait pas le mot « borne ».
