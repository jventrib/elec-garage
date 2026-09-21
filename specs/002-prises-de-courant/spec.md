# Feature Specification: Prises de Courant du Garage

**Feature Branch**: `002-prises-de-courant` (répertoire de spécification ; le dépôt n'est pas sous git, aucune branche créée ; renumérotée depuis `001` le 2026-09-21 pour laisser `001` à la visualisation 3D, qui lui est antérieure dans l'ordre de réalisation)

**Created**: 2026-09-21

**Status**: Draft — clarifications résolues le 2026-09-21, prêt pour `/speckit-plan`

**Input**: User description: "Je veux des prises de courant: une double intérieur après la porte de service sur le mur droite, une double au même emplacement à l'extérieur. Une simple à l'intérieur dans l'angle mur du fond / mur droite. Une double au même endroit à l'extérieur. Une prise simple au plafond pour le moteur de porte sectionnelle."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Alimenter l'outillage à l'intérieur du garage (Priority: P1)

L'utilisateur entre par la porte de service, branche un outil portatif ou un chargeur sans
avoir à traverser le garage, et dispose d'un second point d'alimentation au fond du local
pour l'établi ou le matériel qui y stationne.

**Why this priority**: c'est l'usage quotidien et le besoin d'origine. Sans les points
intérieurs, le garage reste dépendant d'une rallonge tirée depuis l'habitation, ce qui est
précisément la situation que le projet corrige.

**Independent Test**: se vérifie seul, en branchant une charge de test successivement sur
chaque socle intérieur, porte de service ouverte puis fermée, sans qu'aucun autre lot
(extérieur, plafond) ne soit réalisé.

**Acceptance Scenarios**:

1. **Given** l'utilisateur vient d'entrer par la porte de service, **When** il cherche à
   brancher un outil, **Then** un socle double est atteignable sans s'écarter de plus de
   1,5 m de l'encadrement de la porte.
2. **Given** la porte de service est en position grande ouverte, **When** l'utilisateur
   accède au socle double du mur droit, **Then** le vantail ne masque ni n'obstrue le socle.
3. **Given** un appareil est en service sur le socle de l'angle fond/droit, **When** le
   bouton test du dispositif différentiel est actionné, **Then** l'alimentation du socle est
   coupée.

---

### User Story 2 - Motoriser la porte sectionnelle (Priority: P2)

Le moteur de la porte sectionnelle dispose d'un point d'alimentation au plafond, à sa
verticale, sans rallonge ni alimentation provisoire.

**Why this priority**: la porte sectionnelle est l'accès principal du garage. Le point
d'alimentation conditionne la motorisation, mais l'accès reste assuré par la porte de
service et par le déverrouillage manuel du moteur, ce qui le rend moins critique que le
lot P1.

**Independent Test**: se vérifie seul, en branchant le moteur (ou une charge de test
équivalente) sur le socle de plafond et en effectuant un cycle complet d'ouverture et de
fermeture.

**Acceptance Scenarios**:

1. **Given** le moteur est installé au plafond, **When** son cordon est branché sur le socle
   de plafond, **Then** la longueur du cordon d'origine suffit, sans rallonge.
2. **Given** la porte sectionnelle est en position grande ouverte, **When** on observe le
   tablier et son rail, **Then** ni le socle de plafond ni la fiche branchée ne se trouvent
   dans la trajectoire du tablier.
3. **Given** l'alimentation du garage est coupée, **When** l'utilisateur actionne le
   déverrouillage manuel du moteur, **Then** la porte s'ouvre manuellement.

---

### User Story 3 - Alimenter du matériel à l'extérieur du garage (Priority: P3)

L'utilisateur branche un appareil à l'extérieur (tondeuse, nettoyeur, outillage de jardin,
éclairage d'appoint) depuis des socles extérieurs, sans faire passer de câble par une porte
entrebâillée.

**Why this priority**: c'est un gain de confort et de sécurité réel, mais le garage reste
pleinement fonctionnel sans ce lot. Il dépend en outre de la clarification sur l'exposition
aux intempéries.

**Independent Test**: se vérifie seul, en branchant une charge de test sur chaque socle
extérieur, toutes portes du garage fermées.

**Acceptance Scenarios**:

1. **Given** toutes les portes du garage sont fermées, **When** l'utilisateur branche un
   appareil sur un socle extérieur, **Then** aucun câble ne traverse une ouverture du
   bâtiment.
2. **Given** un socle extérieur n'est pas utilisé, **When** on l'observe, **Then** son
   couvercle est refermé et l'étanchéité annoncée est effective.
3. **Given** un appareil est branché sur un socle extérieur sous la pluie, **When** le
   couvercle est rabattu sur le cordon, **Then** l'indice de protection reste assuré en
   usage.

---

### Edge Cases

- Que se passe-t-il si le dispositif différentiel déclenche alors que la porte sectionnelle
  est fermée et motorisée ? Le déverrouillage manuel du moteur DOIT rester accessible depuis
  l'intérieur sans outil.
- Que se passe-t-il si un socle extérieur est utilisé sous la pluie ou exposé à un jet ?
  Le couvercle DOIT permettre l'usage cordon branché sans perte d'étanchéité.
- Que se passe-t-il si un socle extérieur est exposé au gel, au soleil et au ruissellement
  toute l'année ? Les entrées de câble et la jonction au mur DOIVENT rester étanches dans la
  durée, et l'eau NE DOIT PAS pouvoir être retenue dans le boîtier.
- Que se passe-t-il si le gros consommateur occasionnel est mis en route alors que de
  l'outillage est déjà branché ? Le circuit unique DOIT couper proprement sans échauffement
  du câblage, et l'utilisateur DOIT pouvoir identifier la cause du déclenchement.
- Que se passe-t-il si un défaut survient sur un socle extérieur ? Le circuit étant unique,
  la coupure emporte aussi les socles intérieurs et le moteur de la porte sectionnelle : le
  déverrouillage manuel DOIT rester utilisable et connu de l'utilisateur.
- Que se passe-t-il si le vantail de la porte de service, en position ouverte, vient devant
  le socle PC-01 ? L'implantation DOIT être décalée pour conserver l'accès.
- Que se passe-t-il si le tablier de la porte sectionnelle, en position ouverte, occupe le
  plafond au droit du socle PC-05 ? L'implantation DOIT être décalée hors trajectoire.
- Que se passe-t-il en cas de condensation ou de ruissellement sur le sol du garage ?
  La hauteur de pose DOIT mettre les socles hors d'atteinte d'une lame d'eau au sol.
- Que se passe-t-il si un socle intérieur est heurté par un véhicule à la manœuvre ?
  L'implantation DOIT tenir compte du gabarit de stationnement et du débattement des portières.

## Requirements *(mandatory)*

### Functional Requirements

**Points d'utilisation**

- **FR-001**: L'installation DOIT comporter exactement cinq points de prise, référencés
  PC-01 à PC-05, et aucun autre point de prise dans le cadre de cette fonctionnalité.
- **FR-002**: PC-01 DOIT être un socle double, posé à l'intérieur, sur le mur droit, au-delà
  de la porte de service en venant de la façade, et DOIT rester accessible lorsque le
  vantail de la porte de service est en position grande ouverte.
- **FR-003**: PC-02 DOIT être un socle double, posé à l'extérieur, sur la face extérieure du
  mur droit, au droit de PC-01.
- **FR-004**: PC-03 DOIT être un socle simple, posé à l'intérieur, dans l'angle formé par le
  mur du fond et le mur droit.
- **FR-005**: PC-04 DOIT être un socle double, posé à l'extérieur, au droit de PC-03.
- **FR-006**: PC-05 DOIT être un socle simple, posé au plafond, destiné au moteur de la
  porte sectionnelle, et DOIT se situer hors de la trajectoire du tablier et de son rail en
  position ouverte comme en position fermée.
- **FR-007**: Chaque point DOIT être atteignable par le cordon d'origine de l'appareil qu'il
  dessert, sans rallonge permanente. Pour PC-05, cela se vérifie avec le cordon du moteur
  effectivement retenu.

**Sécurité et conformité**

- **FR-008**: Tous les socles DOIVENT être du type 2P+T, avec le conducteur de protection
  raccordé et sa continuité vérifiée jusqu'à chaque point.
- **FR-009**: Tous les points PC-01 à PC-05 DOIVENT être protégés par un dispositif
  différentiel résiduel de sensibilité 30 mA au maximum.
- **FR-010**: Les points extérieurs PC-02 et PC-04 DOIVENT présenter un indice de protection
  adapté à leur exposition réelle, et DOIVENT conserver cet indice en usage, couvercle
  rabattu sur un cordon branché.
- **FR-011**: Les points intérieurs PC-01, PC-03 et PC-05 DOIVENT présenter un indice de
  protection adapté à l'ambiance du garage (poussière, humidité, projections).
- **FR-012**: Les hauteurs de pose DOIVENT respecter les plages admises par la NF C 15-100
  pour les socles de prise de courant, et mettre les socles hors d'atteinte d'une lame d'eau
  ruisselant au sol.
- **FR-013**: Le circuit unique de FR-020 dessert cinq socles comptés au sens de la
  NF C 15-100, un socle double comptant pour un. Ce décompte DOIT rester dans la limite
  fixée par la norme pour la section et le calibre retenus, et toute extension ultérieure
  DOIT être vérifiée au regard de cette même limite.

**Exploitation**

- **FR-014**: Chaque point DOIT être rattaché à un circuit identifié, et le repérage du
  tableau divisionnaire DOIT permettre de retrouver le circuit desservant un point donné
  sans essai par tâtonnement.
- **FR-015**: La coupure du circuit desservant les points, quelle qu'en soit la cause,
  NE DOIT PAS empêcher le déverrouillage manuel de la porte sectionnelle.
- **FR-016**: Les socles extérieurs DOIVENT être alimentés en permanence, sans commande ni
  interrupteur intermédiaire, sauf décision contraire explicite.

**Exposition extérieure**

- **FR-017**: PC-02 et PC-04 sont exposés en plein vent et à la pluie, sur un terrain clos.
  Ils DOIVENT présenter un indice de protection tenant l'exposition directe aux intempéries,
  et conserver cet indice en usage, couvercle rabattu sur un cordon branché.
- **FR-018**: Les entrées de câble et la jonction au mur de PC-02 et PC-04 DOIVENT être
  étanches, et le boîtier DOIT être orienté et percé de façon à ne pas retenir l'eau.
- **FR-019**: Le terrain étant clos, PC-02 et PC-04 NE NÉCESSITENT PAS de coffret
  verrouillable ni de dispositif de sectionnement commandé depuis l'intérieur. Toute
  évolution de la clôture du terrain remettrait cette exigence en cause.

**Découpage des circuits**

- **FR-020**: Les cinq points PC-01 à PC-05 DOIVENT être alimentés par un circuit unique,
  protégé par un seul dispositif contre les surintensités et un seul différentiel 30 mA.
- **FR-021**: La conséquence de FR-020 est assumée : un défaut sur un socle extérieur coupe
  également les socles intérieurs et le moteur de la porte sectionnelle. De ce fait, FR-015
  devient une exigence critique, et le mode d'emploi du déverrouillage manuel DOIT être porté
  à la connaissance de l'utilisateur et consigné au dossier final.

**Charges desservies**

- **FR-022**: Le circuit unique DOIT être dimensionné pour l'outillage portatif courant et,
  en usage occasionnel et non simultané, pour un gros consommateur unique de type compresseur
  ou poste à souder.
- **FR-023**: La note de calcul DOIT établir le courant d'emploi du gros consommateur
  effectivement retenu, et vérifier que le circuit unique de FR-020 l'admet sans échauffement
  ni déclenchement en usage normal.
- **FR-024**: Si le gros consommateur retenu dépasse la capacité admissible du circuit unique,
  un circuit spécialisé dédié DOIT être créé pour lui. Ce cas constitue une évolution du
  périmètre de cette fonctionnalité et DOIT être signalé explicitement avant toute
  réalisation, conformément à la constitution du projet.

### Key Entities

- **Point de prise (PC-01 à PC-05)** : emplacement physique délivrant l'énergie. Attributs :
  référence, type (simple ou double), local (intérieur ou extérieur), paroi de rattachement,
  hauteur de pose, indice de protection, circuit de rattachement.
- **Circuit de prises** : circuit unique desservant les cinq points, partageant une
  protection contre les surintensités et un différentiel 30 mA. Attributs : identifiant,
  points desservis, nombre de socles comptés, courant d'emploi retenu. Le détail de son
  dimensionnement relève de la note de calcul.
- **Gros consommateur occasionnel** : appareil de type compresseur ou poste à souder, utilisé
  ponctuellement et jamais en simultané avec un autre appareil de même classe. Attribut
  déterminant : son courant d'emploi, qui conditionne l'application de FR-024.
- **Tableau divisionnaire du garage** : point de départ des circuits, déjà posé comme
  contrainte du projet par la constitution. Il porte le repérage exigé par FR-014. Son
  dimensionnement n'appartient pas à cette fonctionnalité.
- **Moteur de porte sectionnelle** : charge desservie par PC-05. Attributs pertinents ici :
  position au plafond, longueur du cordon, présence d'un déverrouillage manuel.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Depuis l'encadrement de la porte de service, l'utilisateur atteint un socle
  sans s'écarter de plus de 1,5 m et sans traverser le garage.
- **SC-002**: Depuis n'importe quel point du sol des 31,4 m² du garage, un socle intérieur
  est utilisable avec une rallonge de 10 m au maximum.
- **SC-003**: 100 % des usages extérieurs prévus se font toutes portes fermées, sans qu'aucun
  câble ne traverse une ouverture du bâtiment.
- **SC-004**: 100 % des cinq points coupent effectivement lors de l'essai du dispositif
  différentiel, et le résultat est consigné au procès-verbal d'essais.
- **SC-005**: La porte sectionnelle effectue un cycle complet d'ouverture et de fermeture
  motorisé sans alimentation provisoire ni rallonge.
- **SC-006**: Un tiers non familier de l'installation retrouve, en moins de 30 secondes et à
  la seule lecture du repérage du tableau, le circuit desservant un socle désigné.
- **SC-007**: Aucun des cinq points n'est masqué, obstrué ou rendu inaccessible lorsque la
  porte de service et la porte sectionnelle sont toutes deux en position grande ouverte.
- **SC-008**: Le dossier final comporte, pour chacun des cinq points, sa position cotée et
  son circuit de rattachement.
- **SC-009**: Le gros consommateur occasionnel retenu fonctionne à pleine charge pendant au
  moins 15 minutes sans déclenchement de la protection ni échauffement anormal constaté aux
  connexions.
- **SC-010**: Un socle extérieur, cordon branché et couvercle rabattu, résiste à un arrosage
  d'essai représentatif d'une pluie battante sans trace d'eau à l'intérieur du boîtier.

## Assumptions

**Convention d'orientation** (à confirmer)

La gauche et la droite s'entendent d'un observateur placé à l'extérieur, devant la façade,
regardant vers le mur du fond. Sa droite est le « mur droit » portant la porte de service.

```
                      Mur du fond
          +-----------------------------------+
   PC-03  |  o                              o | PC-04   (extérieur)
 (simple, |                                   |
  angle)  |        GARAGE  5,60 x 5,60 m      |
          |                                   |   Mur
   Mur    |            PC-05 (plafond)        |  droit
  gauche  |                 o                 |
          |                                 o | PC-01   (intérieur, double)
          |                                 o | PC-02   (extérieur, double)
          |                                 [] porte de service
          +---------====================------+
                    porte sectionnelle
                      Façade (avant)

              vue de dessus, observateur en bas
```

**Clarifications résolues** (2026-09-21)

- *Exposition des socles extérieurs* : PC-02 et PC-04 sont exposés en plein vent et à la
  pluie, sur un terrain clos. Traduit en FR-017, FR-018 et FR-019.
- *Découpage des circuits* : circuit unique pour les cinq points. Traduit en FR-020 et
  FR-021. Le compromis est assumé : simplicité et coût contre perte du moteur de porte en cas
  de défaut extérieur.
- *Charges prévues* : outillage portatif courant, plus un gros consommateur occasionnel de
  type compresseur ou poste à souder. Traduit en FR-022, FR-023 et FR-024.

**Point de vigilance issu du croisement des réponses**

Le circuit unique retenu et la présence d'un gros consommateur occasionnel tirent dans des
sens opposés. Le circuit unique reste défendable tant que le gros consommateur est utilisé
seul et que son courant d'emploi entre dans la capacité du circuit. La note de calcul est le
point où cette hypothèse se valide ou s'effondre : si elle s'effondre, FR-024 s'applique et
un circuit spécialisé devra être ajouté au périmètre.

**Hypothèses retenues faute de précision**

- Le garage est alimenté en monophasé 230 V par l'arrivée 3G16 existante, et dispose d'un
  tableau divisionnaire propre, conformément aux contraintes posées par la constitution du
  projet.
- Les socles sont des socles de prise de courant 16 A 2P+T de type domestique courant.
- Un socle double s'entend de deux prises réunies dans une même boîte d'encastrement ou un
  même boîtier saillie, alimentées par la même dérivation.
- « Au même emplacement à l'extérieur » et « au même endroit à l'extérieur » s'entendent au
  droit du point intérieur correspondant, sur la face extérieure de la même paroi, ce qui
  permet une traversée de mur directe.
- PC-04, situé à l'angle, est posé sur la face extérieure du mur droit et non sur celle du
  mur du fond, par cohérence avec PC-02.
- Les socles extérieurs sont alimentés en permanence et ne sont pas commandés.
- Le moteur de la porte sectionnelle est livré avec un cordon et une fiche, ce qui justifie
  un socle plutôt qu'un raccordement fixe.
- Le moteur comporte un dispositif de déverrouillage manuel, conformément à l'usage courant
  des motorisations de porte sectionnelle.
- L'ambiance du garage est sèche à humide, sans local mouillé ni zone de lavage sous jet.
- Le gros consommateur occasionnel est utilisé seul, jamais en parallèle d'un autre appareil
  de puissance comparable.
- Le terrain entourant le garage est clos et son statut ne changera pas.
- Aucune commande à distance, minuterie, mesure de consommation ou fonction domotique n'est
  demandée sur ces points.

**Hors périmètre de cette fonctionnalité**

- L'éclairage du garage, qui fera l'objet d'une spécification distincte.
- La borne de recharge pour véhicule électrique, qui fera l'objet d'une spécification
  distincte et dispose d'un circuit dédié imposé par la constitution.
- Le dimensionnement du tableau divisionnaire et de l'arrivée 3G16.
- Les démarches de conformité administrative postérieures à la mise en service.

**Dépendances**

- Le tableau divisionnaire du garage doit exister et disposer de modules libres avant la
  réalisation de ces circuits.
- Les points ouverts bloquants listés dans la constitution du projet, en particulier le
  calibre de la protection amont, la longueur de l'arrivée 3G16 et le régime de neutre,
  doivent être levés avant la note de calcul.
- L'implantation définitive de PC-05 dépend du modèle de motorisation retenu et de la
  position de son rail.
