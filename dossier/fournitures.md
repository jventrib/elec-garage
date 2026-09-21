# Liste totale des fournitures

**Date** : 2026-09-22 | **Circuits** : 3 | **Généré** par `npm run fournitures`

> **Ce document est produit, pas rédigé.** Les quantités sont dérivées du tracé et des
> circuits, jamais recopiées : trois nomenclatures tenues séparément ne s'additionnent
> pas, et les deux qui se recomptent le plus mal — les mètres de conduit par calibre et
> les mètres de conducteur par section — dépendent du nombre de fils dans chaque tube.
>
> Ce qui **ne se calcule pas** y figure comme *à arrêter*, jamais estimé : une liste
> d'achat n'est pas le bon endroit pour qu'un chiffre plausible se déguise en chiffre
> vérifié.

## Conduit

| Contenant | Longueur | Références | Remarque |
|-----------|----------|------------|----------|
| goulotte 120 × 60 | **1,12** m | GL-01 | **tronc partagé** entre 3 circuits — remplissage à justifier sur la fiche produit |
| goulotte 90 × 40 | **6** m | GL-02 | **tronc partagé** entre 3 circuits — remplissage à justifier sur la fiche produit |
| IRL 25 | **4,92** m | CH-05, CH-B3 | **mixte** — 1,56 m de **tronc partagé** entre deux circuits et 3,36 m de ligne **dédiée** : même article à l'achat, deux natures. Le partage ne change pas le calibre, il change le **remplissage** — c'est là qu'il se paie |
| IRL 20 | **15,02** m | CH-03, CH-06, CH-07, CH-08, CH-A1, CH-L1, CH-L2, CH-L3, CH-L4, CH-L6 | **mixte** — 7,96 m de **tronc partagé** entre deux circuits et 7,06 m de ligne **dédiée** : même article à l'achat, deux natures. Le partage ne change pas le calibre, il change le **remplissage** — c'est là qu'il se paie |
| **Total** | **27,06 m** | | **tous les calibres sont arrêtés** |

**5 changements de direction** se traitent par accessoire, jamais par pincement du tube : 1 sur GL-02, 2 sur CH-L1, 2 sur CH-B3.

## Conducteurs

| Section | Longueur à acheter | Circuit | État |
|---------|------------------------|---------|------|
| **câble 3G10**, 10 mm² | **10,48** m de câble 3G10 | Borne de recharge | dérivée du trajet de chaque conducteur |
| 2,5 mm² | **62,39** m de conducteur | Prises garage | dérivée du trajet de chaque conducteur |
| 1,5 mm² | **69,34** m de conducteur | Éclairage garage | dérivée du trajet de chaque conducteur |

**Ces longueurs suivent le tracé, et il faut les majorer de deux façons :**

- la **réserve en boîte**, 10 à 15 cm par conducteur et par boîte traversée — l'ordre de
  montage l'exige, et il y a 6 boîtes de dérivation ;
- l'**épaisseur de paroi** à chaque traversée, **0,2** m, sur 5 traversées.

Elles partent en outre du **dessus du tableau** et s'arrêtent à l'**entrée des appareils** :
le cheminement dans le coffret jusqu'au bornier ou à la protection, et la longueur de
raccordement dans chaque appareil — la borne au premier chef —, se relèvent sur place.

*Une longueur de conducteur n'est pas une longueur de tracé : un conduit qui porte trois
fils en consomme trois fois sa longueur. C'est le calcul que des nomenclatures séparées
rendaient faux dès la première mutualisation.*

*Ce n'est pas non plus `n × longueur de tracé`, et c'est la correction du 2026-09-22 :
`n` est le cas le plus chargé du circuit, pas ce que chaque tube porte. Le 1,5 mm² était
ainsi annoncé à 80,40 m pour 51,24 m réels — la phase non commutée s'arrête à la commande
du plafonnier, et le retour de l'interrupteur extérieur ne monte jamais au plafond. Depuis
que le **pilotage** est déclaré — quelle commande agit sur quel point —, chaque conducteur
est suivi sur son trajet réel et compté **une fois par conduit**. Les circuits sans
commande, les prises et la borne, n'ont jamais eu ce défaut : leurs longueurs sont
inchangées.*

## Boîtes de dérivation

| Repère | Côté minimal | Entrées | Circuits portés |
|--------|--------------|---------|-----------------|
| BD-04 | *courant* | *courant* | 2 |
| BD-05 | *courant* | *courant* | 2 |
| BD-06 | *courant* | *courant* | 2 |
| BL-01 | *courant* | *courant* | 1 |
| OC-01 | *courant* | *courant* | 3 |
| OC-02 | *courant* | *courant* | 3 |

*Les côtés et les nombres d'entrées indiqués sont des **minimums dérivés du tracé**, non
des références de catalogue. Une boîte plus grande convient ; une plus petite ne se
rattrape pas, car ces boîtes sont posées avant les circuits qui les traversent.*

**5 boîtes portent plusieurs circuits** et DOIVENT être repérées comme telles, de
façon lisible sans les ouvrir : consigner un seul des circuits n'y met pas les autres hors
tension.

## Appareillage

| Article | Nombre | Repères | Indice de protection |
|---------|--------|---------|----------------------|
| commande — dont **2 à l'extérieur** | **5** | CM-01, CM-02, CM-03, CM-04, CM-05 | *à arrêter* |
| luminaire — dont **2 à l'extérieur** | **4** | EL-01a, EL-01b, EL-02, EL-03 | *à arrêter* |
| socle double — dont **2 à l'extérieur** | **3** | PC-01, PC-02, PC-04 | *à arrêter* |
| module de commande | **2** | MC-01, MC-02 | *à arrêter* |
| socle simple | **2** | PC-03, PC-05 | *à arrêter* |
| accessoire de conduit | **1** | AC-01 | *à arrêter* |
| borne de recharge | **1** | BR-01 | *à arrêter* |
| tableau divisionnaire | **1** | TD-01 | *à arrêter* |

## Traversées de paroi

**5** — TV-01, TV-02, TV-L1, TV-L2, TV-L3. Épaisseur de paroi **0,2** m.

Chacune demande une **scie cloche béton**, du **mastic d'étanchéité**, et se perce **en
biais vers le bas**. Elles se percent toutes à la phase de perçage, avant que les boîtes
qui les couvrent ne soient posées.

## Protections, par circuit

| Circuit | Section | Calibre | Différentiel | Sensibilité |
|---------|---------|---------|--------------|-------------|
| Prises garage | 2,5 mm² | *à arrêter* | *à arrêter* | **30** mA |
| Éclairage garage | 1,5 mm² | *à arrêter* | *à arrêter* | **30** mA |
| Borne de recharge | 10 mm² | *à arrêter* | *à arrêter* | **30** mA |

## Ce qui ne se dérive pas, et qu'il faut arrêter

| Fourniture | Pourquoi elle n'est pas chiffrée ici |
|------------|--------------------------------------|
| **Condition de remplissage `D ≥ d·√(3n)`** | Elle se calcule, mais elle se **tranche** sur deux cotes produit que le relevé ne comporte pas : diamètre intérieur du conduit et diamètre extérieur isolé du conducteur. À vérifier **avant de commander le conduit**, et non à la pose. **Quatre cas sont serrés.** **CH-L1**, huit conducteurs en IRL 20 dans la composition de l’ancien CH-05 — trois de 2,5 mm², cinq de 1,5 mm² —, qui exige au moins **14,69 mm** intérieurs : un IRL 20 de 14,0 ou 14,5 mm ne convient pas. **CH-07**, sept conducteurs en IRL 20 dont quatre de 2,5 mm² : son seuil reste à calculer sur les cotes produit. **CH-05**, neuf conducteurs, en **IRL 25** : la condition s’y vérifie aussi, elle n’est pas acquise par le calibre. Et la **descente de la borne** : le câble 3G10 en IRL 25, où la règle ne tient pas — **dérogation au Principe III** du 2026-09-24, à résorber, et essai de tirage avant l’achat. Les **goulottes** n’y sont pas soumises : leur remplissage se justifie sur la fiche produit — GL-02 porte onze conducteurs et le câble de la borne |
| **Colliers de fixation** | L'entraxe est une donnée du fabricant, pas une cote de projet |
| **Chevilles béton** | Une par collier, plus les fixations d'appareillage : suit le choix des colliers |
| **Sections, calibres, types de différentiel** | Valeurs normatives, à confirmer sur le texte de la NF C 15-100 |
| **Indices de protection** | Dépendent des produits retenus, et de l'exposition réelle de chacun |
| **Dispositif de détection 6 mA** | Intégré à la borne ou module distinct au tableau : la voie n'est pas arrêtée |
| **Bornes automatiques** | Une par connexion ; le décompte suit le schéma de raccordement, pas le tracé |

Les nomenclatures par fonctionnalité restent la référence de détail :
[`002`](./002-prises-de-courant/nomenclature.md), [`003`](./003-eclairage/nomenclature.md),
[`004`](./004-borne-recharge/nomenclature.md).
