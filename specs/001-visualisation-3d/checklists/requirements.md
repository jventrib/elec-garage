# Specification Quality Checklist: Visualisation 3D du Garage et Guide de Montage

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

Deux items en échec, imputables aux trois mêmes clarifications ouvertes : composition des
apports, appareil cible sur chantier, mémorisation de la progression.

**Iteration 2 — 2026-09-21**

Les trois clarifications tranchées et intégrées. Tous les items passent. FR-001 à FR-031,
SC-001 à SC-016.

**Iteration 3 — 2026-09-21 — amendement « pose en apparent »**

La constitution est passée en v1.3.0 : parois en béton non isolé, pose apparente, conduits
IRL, boîtes de dérivation aux intersections, appareillage en saillie. La spécification est
amendée en conséquence.

Ajouts : FR-032 à FR-043 (cheminements apparents et boîtes de dérivation), SC-017 à SC-022,
quatre entités — Cheminement, Segment de cheminement, Boîte de dérivation, Traversée de
paroi. Deux scénarios d'acceptation ajoutés à l'histoire 1, trois à l'histoire 3, et leurs
tests indépendants élargis. Six cas limites ajoutés.

Tous les items passent. Inventaire vérifié : FR-001 à FR-043 sans trou ni doublon, SC-001 à
SC-022, zéro marqueur de clarification, tous les renvois internes résolvent.

Aucun marqueur de clarification n'a été nécessaire : la constitution ayant figé le mode de
pose, il ne restait aucune question de périmètre. Les deux inconnues introduites sont des
cotes non relevées — gabarit de manœuvre du véhicule et débattement de ses portières — et
figurent en dépendances, traitées comme obstacles incertains à l'image du rail de la porte
sectionnelle.

### Conséquence en aval, hors périmètre de cette checklist

`plan.md` et `tasks.md` de cette fonctionnalité sont antérieurs à l'amendement et ne couvrent
ni les cheminements, ni les boîtes, ni les traversées. Ils doivent être régénérés avant toute
reprise de l'implémentation. Le contrat d'apport `contracts/apport.schema.json` devra lui
aussi accueillir les nouvelles entités.
