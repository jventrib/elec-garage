# Phase 0 — Décisions de conception

**Fonctionnalité** : `005-automatisation-locale` | **Date** : 2026-09-22

Ce document porte les décisions, avec ce qui les motive et ce qui a été écarté. Les valeurs
conclues vivent ailleurs — dans les données et dans la note de calcul. Trois des huit décisions
ci-dessous ont été **découvertes en vérifiant**, non déduites : elles sont signalées comme telles,
parce qu'une décision constatée vaut mieux qu'une décision raisonnée.

---

## R1 — L'état réel de la porte : deux branches, et une seule dépendance bloquante

**Décision** : l'installation connaît l'**ouverture réelle** de la porte, non les seuls ordres
qu'elle a émis (FR-031, décision Q1 du maître d'ouvrage).

**Motif** : le scénario principal est de rentrer de nuit **en voiture**, donc à la télécommande.
Une installation qui n'observerait que son propre bouton mural le manquerait à chaque fois — elle
fonctionnerait exactement dans les cas où l'on n'en a pas besoin.

**Ce que cela coûte** : un relevé sur le moteur, et il est **bloquant** (U1). Trois voies existent,
et le dossier ne peut pas choisir avant d'avoir constaté ce que le ProCom 4 offre :

| Voie | Ce qu'elle suppose | Ce qu'elle coûte |
|------|--------------------|------------------|
| **Sortie d'éclairage de courtoisie** | Que le moteur en ait une, et son domaine de tension | Rien de plus à poser. Mais la sortie suit la temporisation du moteur, non l'ouverture — à vérifier |
| **Contact auxiliaire de position** | Que le moteur en offre un | Rien de plus à poser, et c'est le signal le plus juste |
| **Capteur de position indépendant** | Rien du moteur | Un organe de plus, son alimentation, et sa fixation — mais aucune dépendance à une caractéristique non relevée |

**Écarté** : déduire l'ouverture du seul bouton mural. C'est ce que la demande initiale décrivait,
et c'est ce que la décision Q1 a renversé.

### Recherche documentaire du 2026-09-22 — ce qu'elle établit, et ce qu'elle ne remplace pas

**Elle ne remplace pas T001.** Ce qui suit vient de la documentation du constructeur et de
descriptions de revendeurs, pas de l'appareil installé. Le dossier traite ces sources comme il a
traité la clause 7-722 en R10 de `004` : **rapportées, utiles, et à confirmer sur l'appareil**.
Elle fait néanmoins passer T001 de « trois voies inconnues » à « une voie à confirmer et un
accessoire à acheter ».

**Trois constats, du plus structurant au plus fin.**

**1. « ProCom 4 » n'est pas un modèle, c'est une série.** La gamme Tubauto se décline en ProCom
7-4, 10-4, 20-4 — le « -4 » est la génération. **Le modèle exact est à lire sur l'appareil**, et il
compte : les fonctions ne sont pas les mêmes d'un bout à l'autre de la gamme.

**2. La gamme est du Hörmann rebadgé**, ce qui ouvre toute la documentation du constructeur
d'origine. L'indice est dans les fichiers publiés par Tubauto eux-mêmes : la notice du ProCom 7-4
est un document `…horfr…` intitulé **ProMatic 4**, celle des ProCom 10-4 / 20-4 un document
`…horfr…` intitulé **SupraMatic 4**. *Correspondance déduite des noms de fichiers et des titres, à
confirmer sur la plaque de l'appareil.*

**3. Le bouton-poussoir externe est en TBTS, et c'est la découverte qui compte.** Notice Hörmann
**TR10A379-D**, § 4.2.1 « Boutons avec fonction d'impulsion » :

> « Un ou plusieurs boutons avec contacts de fermeture (**en contact sec**), tel que bouton-poussoir
> ou contacteur à clé, peuvent être raccordés **en parallèle**. Affectation des bornes : **23**
> signal canal 2 / ouverture partielle — **5** +24 V CC — **21** signal canal 1 / impulsion —
> **20** 0 V. »

Et aux caractéristiques techniques : « Borne à vis pour appareils externes à **très basse tension de
sécurité**, par ex. boutons-poussoirs internes et externes avec commande à impulsion. »

**Ce que cela change pour FR-022 et pour R5.** Le circuit de commande du moteur est en **TBTS
24 V**, pas en 230 V. Deux conséquences immédiates :

- le module de porte NE PEUT PAS commander le moteur par une sortie sous tension. Il lui faut une
  **sortie à contact sec** refermant les bornes 21 / 20. C'est exactement ce que FR-022 exigeait de
  justifier sur la fiche produit, et la question devient concrète ;
- l'alternative écartée en R5 — un bouton à contact sec câblé directement sur l'entrée du moteur —
  est **confirmée comme le câblage prévu par le constructeur**, plusieurs boutons pouvant même se
  mettre en parallèle. Sa seule objection tient : elle ferait cheminer une paire TBTS dans les
  conduits du 230 V, et la règle de séparation applicable est une valeur normative que le dossier
  ne tranchera pas de mémoire.

### L'état de la porte est disponible — mais par un accessoire, et il y a deux candidats

La notice cite deux platines, **aucune des deux n'étant dans l'équipement standard** :

| Accessoire | Ce qu'il offre | Ce qu'il vaut pour FR-031 |
|------------|----------------|----------------------------|
| **UAP 1-HCP** *(platine d'adaptation universelle)* | « Contacts inverseurs secs supplémentaires : pour **signaux de fins de course (ouvert / fermé)** et relais d'option. » Pouvoir de coupure 30 V CC / 2,5 A ou 250 V CA / 500 W | **C'est la voie 2, et c'est la bonne.** Un contact sec qui suit la **position** de la porte |
| **HOR 1-HCP** *(relais d'option)* | Contact inverseur sec, réglable en **clignotant ou permanent**, pour un feu ou un éclairage. Même pouvoir de coupure | C'est la voie 1, et elle est **moins bonne** : elle suit la lampe de motorisation, donc la temporisation propre du moteur |

**Pourquoi la voie 2 l'emporte, et ce n'est pas qu'une question de justesse.** Le relais d'option
signale que *la lampe du moteur est allumée* — soit une temporisation de moteur, qui viendrait
s'ajouter à la nôtre. Deux temporisations imbriquées sur le même point produiraient un comportement
que personne ne saurait diagnostiquer, et c'est exactement ce que la décision Q3 a refusé en
écartant le point de façade de l'automatisme. Le contact de fin de course, lui, dit ce qu'il dit.

**Décision proposée, sous réserve de T001** : retenir le **UAP 1-HCP** et raccorder son contact de
fin de course « Ouvert » à l'entrée d'état du module de porte. Le pouvoir de coupure annoncé —
250 V CA — admet une entrée de module sous tension réseau sans adaptation.

### Constat du maître d'ouvrage — **Hörmann ProCom Série 4**

**Relevé le 2026-09-22. T001a est close.** La correspondance déduite des noms de fichiers est
confirmée à la source : l'appareil est un **Hörmann**, gamme **ProCom**, **série 4**.

**Ce que ce constat suffit à établir, et c'est plus qu'attendu.** Il restait à savoir quelle taille
— 7-4, 10-4 ou 20-4 —, donc si l'appareil relevait du ProMatic ou du SupraMatic. Vérification
faite, **la distinction est sans effet sur cette conception** :

- **l'affectation des bornes est identique** sur toute la série 4. Terminal **21** signal canal 1 /
  impulsion, **20** 0 V, **5** +24 V CC — les mêmes sur le SupraMatic 4 (TR10A361-B) que sur le
  ProMatic 4 (TR10A379-D) ;
- **les deux platines sont données pour la série entière** : UAP 1-HCP et HOR-HCP sont annoncées
  « uniquement pour SupraMatic et ProMatic de la série 4 », ce qui couvre les deux branches.

*La conception de US1 est donc déterminée : platine **UAP 1-HCP**, contact de fin de course
« Ouvert » vers l'entrée d'état du module de porte, et sortie du module en **contact sec** sur les
bornes 21 / 20.*

**Ce qui reste à constater sur place**, et qui ne change plus la conception mais sa faisabilité :

1. ~~le modèle exact et sa série~~ — **fait : ProCom Série 4** ;
2. la présence d'un **emplacement libre** pour la platine, et le type de raccordement — la notice
   mentionne un adaptateur **HAP 1-HCP** pour les composants de série 3 ;
3. la **nature du contact** effectivement disponible sur l'exemplaire posé, la documentation
   consultée étant celle d'une gamme.

*Cette recherche ajoute un article à la nomenclature — la platine — et ne dispense d'aucun
relevé. Elle évite en revanche de partir sur la voie 3, le capteur indépendant, qui aurait ajouté
un organe et son alimentation là où le moteur sait déjà répondre.*

---

## R2 — La goulotte est une boîte très allongée, et le socle n'a rien à apprendre pour ça

**Décision** : déclarer la goulotte comme une **`boite-derivation` à volume**, `dimensions`
0,12 × 1,12 × 0,06, position (5,60 ; 0,70 ; 2,19) sur la paroi est.

**Découvert en vérifiant.** L'enveloppe produite par le socle a été calculée, non supposée :

```
enveloppe GL-01 : x 5,54 → 5,60 | y 0,64 → 0,76 | z 1,63 → 2,75
```

Elle contient exactement ce qu'il faut : la fin de CH-01, la fin de CH-B1, le début de CH-B2, et la
position de BD-02 qu'elle remplace. Le mécanisme d'enveloppe introduit pour la borne (R2 de `004`)
**s'applique sans une ligne de code nouvelle** : V17 y trouve sa boîte, V20 son exemption, V21 sa
contrepartie.

**Motif** : une goulotte n'est pas un conduit dans le modèle — elle n'a pas de section circulaire,
et la règle du tiers ne s'y transpose pas. Mais elle est, très exactement, **une enceinte de volume
déclaré dans laquelle des conduits entrent et des connexions se font**. C'est la définition d'une
boîte.

**Écarté** : un genre nouveau de `cheminement`. Il aurait fallu réécrire V13, V14, V15, V17 et V20
pour une forme, alors qu'une forme existante décrit déjà l'objet.

### Correction du 2026-09-22 — « sans une ligne de code nouvelle » était faux

**Cette section affirmait que le mécanisme d'enveloppe s'appliquait tel quel. Vérification faite,
il ne s'applique pas : il fausse toutes les longueurs qui traversent la goulotte.**

Une boîte à volume **ramène à son centre** tout point qui tombe dans son enveloppe. Sur une boîte de
0,132 m, la distorsion est de quelques centimètres et personne ne l'a jamais vue. Sur une goulotte
de **1,12 m**, elle est massive. Mesurée sur le modèle, en donnant à BD-02 l'enveloppe de la
goulotte :

| Point | Aujourd'hui | Avec une boîte de 1,12 m | Écart |
|-------|-------------|---------------------------|-------|
| EL-01b, point dimensionnant de l'éclairage | 9,000 m | 8,634 m | **−0,366** |
| EL-02 | 5,280 m | 4,981 m | −0,299 |
| BR-01 | 10,491 m | 10,126 m | **−0,365** |

Ces longueurs décident des chutes de tension **déclarées** de deux circuits. Les adopter aurait
falsifié le § 2.2 de la note d'éclairage et le § 2.2 de celle de la borne, silencieusement, et dans
le sens flatteur.

**Le correctif, et il est principiel** : une boîte ne doit pas **collapser** son contenu sur son
centre, elle doit **relier** les points qu'elle contient à leur distance réelle. C'est d'ailleurs
ce qui se passe physiquement — dans une boîte, les conducteurs vont d'une entrée à l'autre, et cette
distance est négligeable dans une boîte de 13 cm mais pas dans une goulotte de 1,12 m.

**Ce que le correctif coûte au dossier existant, mesuré et non supposé** : rien, sauf six
centimètres sur la borne, seul circuit qui **transite** une boîte hors de son axe.

| Circuit | Aujourd'hui | Après correctif |
|---------|-------------|------------------|
| Éclairage — les quatre points | inchangés | **inchangés** |
| Prises — les cinq socles | inchangés | **inchangés** |
| Borne — BR-01 | 10,491 m | 10,554 m |

Les 6 cm ne déplacent pas la chute de tension déclarée de la borne : 2,31 % avant, 2,31 % après.
*Le § 2.1 de sa note écrivait déjà que « les 0,05 m d'écart sont parcourus dans BD-02 et BD-01, où
il n'y a pas de conduit mais des conducteurs » — le correctif ne fait que compter ce trajet sur sa
vraie longueur au lieu d'un aller-retour par le centre.*

**Réserve honnête** : le **rendu** de la maquette dessinera un objet de 1,12 m de haut avec la
convention des boîtes. Il faudra vérifier qu'il ne se lit pas comme une boîte ordinaire démesurée.

---

## R3 — La contiguïté tableau ↔ goulotte : la seule extension nécessaire, et elle en répare une autre

**Décision** : étendre le socle d'une **contiguïté déclarée** entre deux enceintes, qui crée une
**arête de longueur nulle** dans le graphe.

**Le problème, constaté et non supposé** : la goulotte part du **dessus** du tableau, à z = 1,63.
L'axe du tableau est à z = 1,50. Le socle a été interrogé :

```
TD-01 axe (5,60 ; 0,70 ; 1,50)  →  dehors
haut du tableau, z = 1,63       →  DEDANS, exactement sur le plancher de l'enveloppe
```

Les deux enceintes **se touchent** sans se recouvrir. Aucun conduit ne les relie, parce qu'il n'y en
a pas : les conducteurs sortent du tableau par le haut et entrent dans la goulotte. Le graphe, lui,
ne voit aucune arête — donc plus aucun circuit n'est continu depuis le tableau, et **V16 tomberait
sur les trois circuits à la fois**.

**Deux replis ont été écartés, et ils méritent de l'être :**

- **déclarer la goulotte plus haute qu'elle n'est**, pour que son volume englobe l'axe du tableau.
  C'est une **cote fausse** — 13 cm de goulotte qui n'existent pas. Le Principe VI l'interdit, et
  c'est précisément le genre de facilité que le dossier a refusée quatre fois ;
- **déclarer un conduit de 0,13 m** entre les deux. Ce conduit n'existe pas non plus.

**Ce que l'extension répare au passage.** Le socle porte déjà un cas de cette famille : la commande
CM-01, qui ne touche aucun conduit et n'est rattachée que par le `boitier` qu'elle déclare. Ce
rattachement a été traité **deux fois, séparément** — une fois dans `atteignablesDepuisTableau`, où
il ajoute à l'ensemble des atteignables, et une fois dans `cheminEntre`, où il reporte le nœud de
départ. Aucune des deux ne crée d'arête, si bien que `longueursDepuisTableau` ne sait toujours pas
dire à quelle distance est CM-01.

Une arête de longueur nulle, posée une fois dans le graphe, sert les trois parcours. **L'extension
n'ajoute pas un mécanisme : elle en unifie deux qui existaient déjà mal.**

**Contrepartie, sur le modèle de V21.** Une contiguïté déclarée ne doit pas devenir un moyen de
relier n'importe quoi à n'importe quoi. Elle est soumise à deux conditions vérifiables : les deux
enveloppes déclarées doivent **effectivement se toucher** à la tolérance de raccordement près, et
chacune doit porter un volume déclaré. Une contiguïté entre deux points, ou entre deux volumes
distants, est un défaut.

---

## R4 — Où vivent les deux modules

**Décision** : le module d'éclairage **dans la goulotte** ; celui de la porte **au droit du
moteur**, alimenté par le socle de plafond déjà posé.

**Pour l'éclairage** : la goulotte est la « boîte de dérivation principale » de la demande, et c'est
désormais vrai au sens propre — elle a repris les cinq entrées de BD-02. Le module y trouve le
neutre, la phase, le PE, les départs vers les points et les retours des interrupteurs.

**Pour la porte** : constaté sur les données, **PC-05 est à (2,70 ; 2,70 ; 2,75)**, soit 0,20 m au
nord du bout du rail. Ce socle de plafond est là pour la motorisation ; le module s'y raccorde. La
constitution admet le **repiquage** sur les bornes d'un appareil en saillie depuis sa v1.8.0, sous
quatre conditions dont la troisième — que les bornes acceptent sans contrainte les conducteurs — est
à vérifier à la pose.

**Réserve** : un module logé dans une enceinte sur paroi froide doit admettre la condensation
(FR-026), et sa portée radio depuis l'intérieur d'une goulotte métallique ou d'un boîtier est un
constat à faire (U3). Aucune des deux ne bloque la conception, FR-015 imposant que tout fonctionne
sans réseau.

---

## R5 — Le bouton de porte à l'entrée de la sectionnelle charge le tronc de deux conducteurs

**C'est la découverte la plus coûteuse de cette phase, et elle n'était pas prévisible sans le
calcul.**

La demande place un interrupteur double à l'entrée de la porte sectionnelle : un bouton pour
l'éclairage, un pour la porte. Le module de porte, lui, est **au droit du moteur** (R4). Les
conducteurs du bouton doivent donc aller de l'un à l'autre.

**La route directe est fermée.** Le moteur est à (2,70 ; 2,50) au plafond ; le majorant du tablier
ouvert occupe `x 0,20→5,20 | y 0→2,50 | z 2,31→2,75`. Tout parcours de plafond vers le moteur le
recoupe — et le dossier vient justement de rendre ce majorant concluant en relevant sa sous-face à
2,31 m. Rouvrir un contrôle non concluant pour un bouton serait un mauvais échange.

**Il reste le tronc**, qui contourne par y = 3,00. Le coût a été calculé, non estimé :

| Conduit | Aujourd'hui | Avec le bouton de porte |
|---------|-------------|--------------------------|
| CH-L1 | 3 | **5** |
| CH-02 | 6 | **8** |
| CH-04 | 6 | **8** |
| CH-07 | 6 | **8** |
| CH-08 | 3 | **5** |
| CH-05 | 8 | 8 — inchangé |

**Ce que cela change, et ce que cela ne change pas.** Le **seuil** ne bouge pas : huit conducteurs
exigent 14,69 mm intérieurs, et c'était déjà la condition d'achat née de la décision du tronc en
IRL 20. Ce qui change est le **nombre de conduits** qui y sont soumis — de un à quatre — et la
difficulté de tirage, qui cesse d'être concentrée sur 1,50 m.

**Trois alternatives, toutes écartées, et il faut dire pourquoi :**

| Alternative | Pourquoi écartée |
|-------------|-------------------|
| Placer le bouton de porte **près de la porte de service**, où le tronc descend déjà | La demande le veut à l'entrée de la sectionnelle, et c'est là qu'il sert : on commande la porte d'où on la voit |
| Un bouton **à contact sec** câblé directement sur l'entrée du moteur, sans module | Élégant — c'est le câblage prévu par le fabricant, et les dispositifs de sécurité restent intouchés. Mais il fait cheminer un circuit **TBTS** dans les mêmes conduits que du 230 V, ce qui pose une question de séparation que le dossier ne peut pas trancher de mémoire |
| Relayer le bouton par le **réseau** jusqu'au module de porte | Contredit FR-015 : la commande manuelle doit survivre à la perte du réseau |

**Décision** : accepter le coût, et le porter à la note de calcul. *Cette décision est
réversible à peu de frais tant que rien n'est posé — c'est le moment de la contester.*

---

## R6 — Un module inverse le sens de l'interrupteur : la troisième commutation

**Décision** : ajouter une troisième valeur à `commutation`, pour l'interrupteur qui **commande un
module** au lieu de couper la phase.

**Motif** : le socle sait décrire deux topologies. En `retour-commande`, la phase descend à
l'interrupteur et un retour commandé remonte vers les points. En `sur-place`, le point est alimenté
en permanence et commuté chez lui. Un module en tient une troisième : **le module détient la phase
et la sortie ; l'interrupteur est une entrée**, qui ne porte aucune puissance.

**Le décompte ne change pas, le rôle si.** Entre la goulotte et l'interrupteur, il faut toujours
deux conducteurs — ce qui descend et ce qui remonte changent de rôle, non de nombre. Mais la fiche
d'un conduit afficherait « 1 retour commandé » là où passe un **ordre**, et c'est faux. Le socle
dérive désormais les rôles et les affiche : il doit dire le bon.

**Écarté** : réutiliser `retour-commande`. Le total serait juste par coïncidence, et la
répartition par rôle serait fausse — exactement la faute que la dérivation du 2026-09-22 a corrigée.

---

## R7 — Ce que le changement de mode de pose coûte à `Iz`, et ce qu'il ne coûte pas

**Décision** : le tronc chemine **nu** dans la goulotte sur 1,10 m ; la ligne de la borne **y garde
son conduit** (décision du maître d'ouvrage).

**Ce que cela ne coûte pas** : rien à la borne. Sa catégorie **B1** est préservée, et `Iz` — seule
ligne dont dépend sa section de 10 mm² — n'est pas rouvert. C'est tout l'objet du choix mixte, et il
satisfait *a fortiori* les quatre conditions du Principe IV : les conducteurs de la borne ne
quittent jamais leur enveloppe propre, donc ne peuvent pas recevoir de connexion dans une enceinte
partagée.

**Ce que cela coûte** : deux valeurs **normatives** de plus, sur le tronc seul (U2). Quelle lettre
de sélection pour un conducteur isolé en goulotte ? Et une portion de **1,10 m sur 14,20** peut-elle
être négligée dans la détermination d'`Iz` ? Aucune des deux ne se renseigne de mémoire ; elles
rejoignent T006 des deux circuits.

---

## R8 — Ce que le réseau ne doit jamais pouvoir faire

> **Révisé le 2026-09-23 par décision du maître d'ouvrage** — changement
> [`commande-porte-a-distance`](../../openspec/changes/archive/2026-09-23-commande-porte-a-distance/proposal.md).
> La commande de la porte à distance, par le cloud du fabricant de MC-02, est **permise et
> voulue** ; un service distant est admis pour cette seule commande et la remontée de l'état de
> la porte. *Motif* : l'accessibilité à distance est précieuse, et le risque d'écrasement est
> jugé exagéré. Le premier et le troisième interdits ci-dessous sont levés dans cette mesure ;
> le deuxième et le quatrième restent entiers. Le raisonnement d'origine est conservé tel quel :
> il fonde l'avis contraire consigné.

**Décision** : le réseau local ne porte **qu'un seul** message, dans **un seul** sens — la porte
signale son ouverture à l'éclairage.

Tout le reste est filaire. Il en découle quatre interdits, qui sont des exigences du spec et non des
préférences de conception :

- **aucune commande de porte** par le réseau (FR-013), ni depuis un téléphone, ni depuis un
  navigateur. Une porte motorisée qui bouge hors de la vue de l'opérateur est un risque
  d'écrasement, et rien dans le besoin ne l'exige ;
- **aucun automatisme dans l'autre sens** (FR-014) : l'éclairage n'agit jamais sur la porte ;
- **aucune dépendance à un service distant** (FR-017), ni pour fonctionner, ni pour se configurer
  après la pose ;
- **aucune remise sous tension** d'un circuit consigné par un ordre réseau ou une minuterie
  (FR-019). La consignation coupe **en amont** des modules.

**La conséquence la moins intuitive, et celle qui doit être écrite pour l'exploitant** : l'éclairage
peut désormais s'allumer **sans que personne n'ait rien touché**. L'absence de lumière cesse de
valoir absence de tension (FR-020). Avant cette fonctionnalité, l'état éteint résultait toujours
d'un geste humain.

---

## Sources de la recherche documentaire du 2026-09-22

Consultées pour R1. **Aucune n'est un relevé** : elles décrivent une gamme, pas l'appareil installé.

- [Documentation technique des produits TUBAUTO](https://www.tubauto.fr/documentations/) — la gamme ProCom et ses notices
- [Notice Tubauto ProCom 7-4, document `horfr` intitulé « ProMatic 4 »](https://www.tubauto.fr/app/uploads/2020/12/nge-mot-procom-7-4-complement-horfr-2018-a-1.pdf)
- [Notice Tubauto ProCom 10-4 / 20-4, document `horfr` intitulé « SupraMatic 4 »](https://www.tubauto.fr/app/uploads/2020/10/nge-mot-procom-10-4-procom-20-4-2019-horfr-1789-a.pdf)
- [**Notice Hörmann ProMatic 4, TR10A379-D**](https://www.hormann.fr/mediacenter/download/185626fr/TR10A379_D_ProMatic_4_FR.pdf) — **source principale** : § 4.2.1 pour l'affectation des bornes 20 / 21 / 5 / 23 et la très basse tension de sécurité
- [Platine d'adaptation universelle UAP 1-HCP](https://www.automatic-center.fr/hormann/578-hormann-uap-platine-d-adaptation-universelle-.html) — contacts inverseurs secs pour signaux de fins de course
- [Relais d'option HOR 1-HCP](https://www.automatic-center.fr/hormann/576-hormann-relais-d-option-hor-1-.html) — clignotant ou permanent, pouvoir de coupure
- [**Notice Hörmann SupraMatic 4, TR10A361-B**](https://asset-center.com/original/517/185517_originalfile.pdf?response-content-disposition=attachment%3B+filename%3D%22TR10A361-B_SupraMatic_4_FR.pdf%22) — confirme que l'affectation des bornes 20 / 21 / 5 est **commune à la série 4**
- [Hörmann France — motorisations de porte de garage](https://www.hormann.fr/habitat-maitre-doeuvre-marche-residentiel/motorisations/motorisations-de-porte-de-garage/)

