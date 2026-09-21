# Specification Quality Checklist: Prises de Courant du Garage

**Purpose**: Validate specification completeness and quality before proceeding to planning
**Created**: 2026-09-21
**Feature**: [spec.md](../spec.md)

## Content Quality

- [x] No implementation details (languages, frameworks, APIs)
- [x] Focused on user value and business needs
- [x] Written for non-technical stakeholders
- [x] All mandatory sections completed

## Requirement Completeness

- [x] No [NEEDS CLARIFICATION] markers remain
- [x] Requirements are testable and unambiguous
- [x] Success criteria are measurable
- [x] Success criteria are technology-agnostic (no implementation details)
- [x] All acceptance scenarios are defined
- [x] Edge cases are identified
- [x] Scope is clearly bounded
- [x] Dependencies and assumptions identified

## Feature Readiness

- [x] All functional requirements have clear acceptance criteria
- [x] User scenarios cover primary flows
- [x] Feature meets measurable outcomes defined in Success Criteria
- [x] No implementation details leak into specification

## Notes

- Items marked incomplete require spec updates before `/speckit-clarify` or `/speckit-plan`

**Iteration 1 — 2026-09-21**

Deux items en échec, tous deux dus aux mêmes trois clarifications ouvertes : exposition des
socles extérieurs, découpage des circuits, nature des charges prévues. Aucun autre écart.

**Iteration 2 — 2026-09-21 (clôture)**

Les trois clarifications ont été tranchées par l'utilisateur et intégrées :

- Socles extérieurs exposés en plein vent, terrain clos → FR-017 à FR-019.
- Circuit unique pour les cinq points → FR-020, FR-021.
- Outillage courant plus un gros consommateur occasionnel → FR-022 à FR-024.

Deux incohérences introduites par le passage au circuit unique ont été détectées et
corrigées dans la même itération :

- FR-013 raisonnait sur « un même circuit » indéterminé ; il énonce désormais le décompte
  réel de cinq socles comptés sur le circuit unique, socle double compté pour un.
- FR-015 ne visait que PC-01 à PC-04 ; avec un circuit unique la coupure emporte aussi
  PC-05, l'exigence vise donc désormais la coupure du circuit quelle qu'en soit la cause.

Inventaire vérifié : FR-001 à FR-024 sans trou ni doublon, SC-001 à SC-010, zéro marqueur
[NEEDS CLARIFICATION], toutes les références croisées internes résolvent.

**15 / 15 items satisfaits. Spécification prête pour `/speckit-plan`.**

Un point de vigilance est consigné dans la section Assumptions du spec plutôt que traité
comme un défaut : le circuit unique et le gros consommateur occasionnel sont en tension. La
note de calcul est le point de décision ; si le courant d'emploi de l'appareil retenu excède
la capacité du circuit unique, FR-024 impose un circuit spécialisé, ce qui élargira le
périmètre de la fonctionnalité.
