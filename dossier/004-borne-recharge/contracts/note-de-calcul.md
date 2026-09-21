# Contrat — note de calcul de la borne

**Fonctionnalité**: `004-borne-recharge` | **Date**: 2026-09-22

Ce contrat dit ce que la note de calcul DOIT contenir. Il reprend celui de
`002-prises-de-courant` et n'en retient que les différences.

## Ce qui change par rapport au contrat des prises

| Point | Prises | Borne |
|-------|--------|-------|
| Courant d'emploi | décision d'usage | **32 A, donnée du besoin**, non une hypothèse |
| Durée d'appel | intermittent | **continu, plusieurs heures** — aucun coefficient de simultanéité à la baisse (FR-014) |
| Groupement | exigible depuis la mutualisation | **sans objet** — conduit entièrement propre, Principe IV |
| Limite de chute de tension | 5 % | **5 %**, inchangée |
| Différentiel | type A à statuer | **propre au circuit** (FR-010), et de **type A ou F** — orientation du 2026-09-22, type B écarté. La détection du courant continu reste à trancher séparément (FR-039) |
| Bilan de puissance | sans enjeu | **le sujet** : 82 % de la puissance souscrite |

## Les sept lignes obligatoires du Principe III

| Grandeur | Origine attendue | État |
|----------|------------------|------|
| Courant d'emploi | **32 A**, donnée du besoin | acquis |
| Mode de pose | apparent sous conduit IRL, conducteurs isolés — catégorie B1 | acquis |
| Courant admissible du conducteur | **Norme** — table, pour ce mode de pose et la lettre de sélection | **à confirmer** |
| Facteurs de correction | température ambiante. **Groupement sans objet**, et c'est démontré par le tracé : aucun mètre partagé | partiellement à confirmer |
| Calibre de protection | **Norme** — appariement avec la section, et `IB ≤ In ≤ Iz` | **à confirmer** |
| Longueur du chemin le plus long | **10,49 m**, calculée par le socle sur le tracé réel | acquis |
| Chute de tension, terminale et cumulée | **Calculée** — donnée en fonction de la section, voir R5 | acquis |

## Vérifications obligatoires en plus

- Le **taux de remplissage** du conduit, pour trois conducteurs : condition exacte `D ≥ d·√9`,
  soit `D ≥ 3d`. À lire sur deux cotes de fiche produit.
- L'**axe du conduit** dans la bande contrainte : `2,6125 + 0,010 + d/2 ≤ axe ≤ 2,740 − d/2`,
  condition de FR-036 qui tient jusqu'à l'IRL 32.
- Les **cotes d'encombrement de BD-01 et BD-02**, qui conditionnent la traversée : `h ≥ 0,112 m`
  et `h ≥ 0,132 m` respectivement, dérivées du **majorant** de calibre.
- Le **volume intérieur de BD-01**, pour la totalité de ce qu'elle porte (FR-038). Distinct de la
  cote d'encombrement, et distinct du nombre d'entrées.
- La **résistance de la prise de terre**, `R ≤ 50/IΔn`, sans changement : le garage n'a pas de
  prise propre, la terre arrive par le PE du 3G16.

## Conclusions explicites exigées par le contrat

| Question | Réponse attendue | État |
|----------|------------------|------|
| `IB ≤ In ≤ Iz` avec l'`Iz` du mode de pose **réel** ? | Structure posée ; `Iz` et `In` **normatifs** | **ouverte** |
| La chute de tension cumulée reste-t-elle sous 5 % ? | **Oui pour 4, 6 et 10 mm²** — 3,29 %, 2,75 %, 2,31 % | acquis |
| Le type de différentiel satisfait-il le Principe II ? | **Oui** : le circuit part du **bornier**, en amont du type AC (R9). La contradiction est levée sans attendre FR-050 de `002` | acquis |
| Où se trouve le dispositif de **détection 6 mA** ? | **La question dont tout dépend** (FR-039, FR-042). Intégré à la borne, ou **module distinct au tableau** — aucun type de différentiel n'en dispense | **ouverte** |
| Un **type F** répond-il à l'exigence ? | Rapporté comme admis par des sources secondaires citées en R10, clause **7-722** | **à confirmer sur le texte** |
| La consignation de la borne est-elle écrite ? | Ouvrir l'interrupteur du tableau **ne la coupe pas** : mention exigée au dossier, sur le tableau et sur les deux boîtes traversées (FR-040) | acquis, à porter au matériel |
| Le **bornier** accepte-t-il un départ de 32 A ? | Constat de relevé, avant la pose (FR-041) | **ouverte** |
| Quelle **voie** de maîtrise de la puissance ? | **Restriction d'usage écrite**, sans dispositif (FR-012) | acquis |
| Quels **usages incompatibles**, nommément ? | Liste à établir par le maître d'ouvrage | **ouverte** |
| Quel **mode de défaillance** en cas de dépassement ? | Déclenchement du **disjoncteur d'abonné**, coupure de toute l'habitation | acquis |
| Le conduit est-il entièrement propre ? | **Oui — 10,44 m, aucun mètre partagé.** Démontré par le tracé | acquis |

## Le bilan de puissance, qui ne peut pas être passé sous silence

La borne appelle **32 A** sur une puissance souscrite de **9 kVA**, soit 39 A. Elle consomme donc
**82 %** de la capacité souscrite et ne laisse que **7 A**, environ 1,6 kW, pour toute
l'habitation pendant une charge.

La note DOIT énoncer :

1. la **voie retenue** — restriction d'usage écrite, sans modulation ni délestage (FR-012) ;
2. la **liste nominative** des usages tenus pour incompatibles (FR-031) ;
3. le **mode d'usage** qui rend la restriction tenable — charge conduite habitation au repos
   (FR-033) ;
4. le **mode de défaillance** — déclenchement du disjoncteur d'abonné, coupure générale, et
   réarmement manuel au tableau principal (FR-034).

Ces quatre points sont des **conditions de validité du dimensionnement**, non des recommandations.
Non écrits, ils sont perdus au premier changement d'occupant, et le Principe IV l'interdit.

## Facteur de correction de groupement — portion en goulotte

*Ajouté le 2026-09-22, amendement v1.14.0 de la constitution.*

La dédicace du conduit a été retirée du Principe IV : le câble de la borne emprunte la
**goulotte GL-01 sur 1,12 m**, entre le dessus du tableau et sa sortie vers CH-B2, en
cohabitation avec les circuits des prises et de l'éclairage. Le conduit dédié CH-B1, qui
doublait ce parcours sur 1,10 m, est supprimé.

L'exemption de facteur de groupement que le principe tirait de la dédicace **ne vaut plus sur
cette portion**. Elle reste entière sur `CH-B2` et `CH-B3`, où la ligne est seule dans son
conduit.

| Portion | Longueur | Contenant | Circuits | Facteur de groupement |
|---------|----------|-----------|----------|------------------------|
| GL-01 | 1,12 m | goulotte 120 × 60 | 3 — prises, éclairage, borne | **à confirmer** — exigible |
| CH-B2, CH-B3 | 9,34 m | IRL 25 dédié | borne seule | sans objet |

**Deux valeurs restent à confirmer sur le texte**, et NE DOIVENT PAS être renseignées de
mémoire : la **catégorie de pose** d'un câble en goulotte, qui décide de son courant
admissible — la catégorie B1 est celle des conducteurs isolés en conduit et ne s'applique pas
ici —, et le **seuil en deçà duquel une portion courte se néglige**, qui pourrait rendre la
question sans objet sur 1,12 m. Tant que les deux ne sont pas établies, le facteur applicable
reste **inconnu**, et il NE DOIT PAS être présumé égal à 1.
