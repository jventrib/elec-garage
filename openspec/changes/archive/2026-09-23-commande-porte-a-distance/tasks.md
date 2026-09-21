# Tasks

## 1. Spécification

- [x] 1.1 Réécrire le **Purpose** de `openspec/specs/installation/automatisation/spec.md` : retirer « aucun service distant, aucune commande hors de la vue de la porte », énoncer que la porte ne se commande que par une personne et que la commande manuelle ne dépend d'aucun réseau. *Un delta ne porte pas le Purpose d'une capacité existante.* Vérifier par `grep` que le Purpose ne contient plus ces deux formules
- [x] 1.2 `openspec validate commande-porte-a-distance` sans erreur

## 2. Données d'apport — instructions seulement (design D3, D5)

- [x] 2.1 **Inverser** l'étape `au-essai-reseau` de `data/apports/005-automatisation-locale.json` : constater que la commande à distance, depuis l'application du fabricant, **ouvre** la porte — **porte et abords en vue la première fois** — et que l'état ouverte / fermée **remonte juste**, y compris à la télécommande ; constater que les deux interrupteurs et le bouton de porte marchent **point d'accès éteint** puis **Internet coupé**. Garder le retour du courant
- [x] 2.2 Réécrire le constat de `au-essai-porte` : la porte ne se met en mouvement qu'à l'action délibérée d'une personne — bouton mural, télécommande, organe du moteur **ou application** — et jamais par un automatisme
- [x] 2.3 Ajouter à `au-levee` la réserve nouvelle : **LA PORTE PEUT SE METTRE EN MOUVEMENT SANS PERSONNE SUR PLACE**. Toute intervention sur la porte ou le moteur exige d'en couper l'alimentation, et donc MC-02 — consigner les prises ou déposer PC-05. Mettre à jour le compte des réserves annoncé
- [x] 2.4 Ajouter à `tests/apport-005.test.js` les assertions sur ces instructions — la réserve de `au-levee`, la commande à distance et la remontée d'état dans `au-essai-reseau` — et vérifier par `npm test` : suite verte, zéro défaut sur les vingt-deux règles, **aucun décompte ni longueur changé**

## 3. Dossier `005-automatisation-locale` (design D4)

- [x] 3.1 `notice.md` : réécrire le § 3 — la porte ne se met jamais en mouvement toute seule, elle se commande aussi à distance par l'application, qui en affiche l'état ; réécrire le § 4 — sans réseau ni Internet, **seule la commande à distance cesse**, et l'allumage automatique sans réseau local ; ajouter au § 1 la réserve : avant d'intervenir sur la porte, en couper l'alimentation
- [x] 3.2 `notice.md`, fiche de réglages : « Commande par le réseau » **oui, par le cloud du fabricant** pour MC-02, **aucune** pour MC-01 ; « Service distant, compte en ligne » : le compte et l'application à consigner, **aucun identifiant secret au dossier** ; état de la porte remonté par l'entrée 2
- [x] 3.3 `quickstart.md` : scénario 8 — Internet coupé en plus du point d'accès ; scénario 9 — l'essai « depuis un téléphone » devient « la commande à distance ouvre la porte, porte en vue, et l'état remonte juste » ; réserves connues — la commande hors vue, **réserve ouverte**
- [x] 3.4 `research.md`, R8 : note datée « **Révisé le 2026-09-23 par décision du maître d'ouvrage** » en tête de section, qui renvoie à ce changement, sans réécrire le raisonnement d'origine

## 4. Changements voisins

- [x] 4.1 `automatisation-locale-mise-en-oeuvre` : la tâche 3.7 renvoie à ce changement ; `design.md` le cite ; `nomenclature.md` exige de MC-02 la commande par le cloud du fabricant **et** la remontée de l'état de son entrée, MC-01 restant sans service distant
- [x] 4.2 `reserves-maitre-ouvrage` : ajouter la **réserve ouverte, non bloquante** — identifier sur le texte les exigences propres aux portes motorisées applicables à une commande hors vue, et constater au relevé du moteur (tâche 1.1 de `automatisation-locale-mise-en-oeuvre`) le niveau de protection du ProCom. Aucune clause ni valeur de mémoire

## 5. Construction et vérification

- [x] 5.1 `npm run build` : `src/version.js` incrémenté, et les instructions nouvelles de `au-essai-reseau` et `au-levee` présentes dans `dist/garage.html`
- [x] 5.2 `grep -rn "hors de sa vue\|aucun service distant"` sur `openspec/specs` et `dossier/005-automatisation-locale` : plus aucune affirmation contraire à la décision, hors notes historiques datées
- [x] 5.3 Archiver ce changement et vérifier que le delta s'est appliqué à `openspec/specs/installation/automatisation/spec.md` — exigence renommée, « Fonctionnement sans réseau local » réécrite
