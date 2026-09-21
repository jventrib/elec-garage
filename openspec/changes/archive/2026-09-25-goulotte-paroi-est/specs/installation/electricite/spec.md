# Spec Delta

## MODIFIED Requirements

### Requirement: Dimensionnement de la ligne de la borne

*Origine : `004-borne-recharge` FR-014, FR-015, FR-016, FR-017. Principe III de la
constitution. Étendue le 2026-09-24 : la ligne court 7,12 m en goulotte avec les deux autres
circuits (changement `goulotte-paroi-est`).*

Le dimensionnement DOIT prendre en compte la **durée** de la charge : une borne
appelle son courant nominal pendant plusieurs heures d'affilée, sans coefficient de
simultanéité à la baisse comme pour un usage domestique intermittent.

La section des conducteurs DOIT être établie par la note de calcul pour **32 A**, dans la
**catégorie de pose réelle de chaque portion**, et non pour un mode de pose plus favorable. La
ligne en compte deux : 7,12 m de câble en goulotte, avec les prises et l'éclairage, et 3,36 m en
conduit dédié. Sur la portion en goulotte, le courant admissible DOIT retenir la lettre de
sélection d'un câble en goulotte **et** le facteur de groupement des trois circuits.

**Réserve bloquante d'achat** : tant que ce courant admissible n'est pas confirmé sur le texte, la
section de 10 mm² n'est pas démontrée sur la portion en goulotte, et elle pourrait en dépendre. Le
tracé s'applique à la maquette ; le câble et le tube NE DOIVENT PAS être achetés avant.

La chute de tension cumulée DOIT respecter la limite de **5 %** applicable aux
usages autres que l'éclairage, l'arrivée de 30 m en 16 mm² en consommant déjà une part. Le
calcul DOIT s'appuyer sur la longueur du **chemin le plus long** du tracé, que la maquette
fournit.

Le diamètre du conduit DOIT être établi par la note de calcul à partir de la
section **et de la forme** retenues — câble ou conducteurs isolés —, et non décidé d'avance. Il
sera **supérieur à l'IRL 20 des prises**, la section des conducteurs d'un circuit à 32 A étant plus
grande.

*Dérogation du 2026-09-24, décision du maître d'ouvrage* : la forme retenue est un **câble 3G10**,
et la descente CH-B3 reste en **IRL 25**, que ce câble ne tient pas au taux de remplissage. La
dérogation au Principe III est écrite à la note de calcul ; elle DOIT être résorbée avant la
clôture du dossier.

#### Scenario: Charge de quatre heures
- **WHEN** une charge se poursuit pendant au moins quatre heures
- **THEN** elle se déroule sans déclenchement et sans échauffement anormal

#### Scenario: Diamètre déduit de la section
- **WHEN** le diamètre du conduit de la borne est établi
- **THEN** il est déduit de la section et de la forme retenues, et non décidé d'avance

#### Scenario: Portion en goulotte
- **WHEN** le courant admissible de la ligne de la borne est établi
- **THEN** il l'est portion par portion, et sur la goulotte avec la lettre de sélection du câble et le facteur de groupement de trois circuits

#### Scenario: Forme retenue contre le calibre
- **WHEN** la forme retenue ne tient pas le taux de remplissage du conduit arrêté
- **THEN** la dérogation est écrite, datée et motivée, et le dossier ne peut être clos qu'une fois résorbée

#### Scenario: Achat avant confirmation
- **WHEN** le courant admissible en goulotte n'est pas confirmé sur le texte
- **THEN** le câble et le tube de la borne ne sont pas achetés, la réserve étant bloquante
