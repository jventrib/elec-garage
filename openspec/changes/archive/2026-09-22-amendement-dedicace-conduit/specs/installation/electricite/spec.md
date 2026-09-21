# Spec Delta

## MODIFIED Requirements

### Requirement: Circuit de la borne entièrement dédié

*Origine : `004-borne-recharge` FR-008 et FR-009. Principe IV de la constitution.
Amendé : la dédicace du conduit y était énoncée sans référence de clause, et le tracé arrêté la
contredisait sur 0,04 m.*

BR-01 DOIT être alimentée par un **circuit entièrement dédié**, sans aucun autre
point d'utilisation raccordé, conformément au Principe IV de la constitution. Ce circuit DOIT
posséder sa propre protection contre les surintensités et son propre dispositif différentiel.
**Cette dédicace est entière et n'est pas amendée.**

La dédicace NE S'ÉTEND PAS au **contenant**. La ligne de la borne PEUT cohabiter avec d'autres
circuits dans un profilé de goulotte, à deux conditions :

1. elle y est un **câble à enveloppe propre**, et non des conducteurs isolés nus ;
2. elle y **transite sans être coupée** — aucune connexion du circuit de la borne n'est faite
   dans un organe de connexion partagé.

Là où elle emprunte un **conduit**, celui-ci lui reste dédié : un conduit n'a pas d'enveloppe
propre par conducteur, et y mêler deux circuits reviendrait à la situation que la condition 1
écarte.

Le **facteur de correction de groupement** DOIT être appliqué à son courant admissible sur les
portions où elle cohabite, et écrit. L'exemption que le principe en tirait ne vaut plus que sur
les portions restées en conduit dédié.

*Valeurs normatives à confirmer sur le texte, et non de mémoire : la clause qui fonderait —
ou non — une exigence de contenant dédié pour un point de charge, et la catégorie de pose d'un
câble en goulotte, qui décide de son courant admissible.*

#### Scenario: Recensement des points du circuit de la borne
- **WHEN** le circuit de BR-01 est parcouru
- **THEN** aucun autre point d'utilisation n'y est raccordé, et il porte ses propres protections

#### Scenario: Cohabitation en goulotte
- **WHEN** la ligne de la borne emprunte un profilé partagé avec d'autres circuits
- **THEN** elle y est un câble à enveloppe propre, elle y transite sans être coupée, et le facteur de groupement est appliqué à son courant admissible sur cette portion

#### Scenario: Portion en conduit
- **WHEN** la ligne de la borne emprunte un conduit
- **THEN** ce conduit ne porte aucun autre circuit
