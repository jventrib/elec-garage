# Quickstart — valider l'automatisation locale

**Fonctionnalité** : `005-automatisation-locale` | **Date** : 2026-09-22

Dix scénarios. Les quatre premiers se passent au clavier, les six autres au garage — et c'est
l'inverse des fonctionnalités précédentes, où presque tout se démontrait sur les données. **Aucune
des vingt-deux règles ne vérifie une minuterie**, et c'est dit plutôt que masqué.

## Prérequis

- Node.js, pour la suite de tests du socle.
- Un navigateur, pour `dist/garage.html`.
- **Le relevé du moteur** (U1) pour les scénarios 6 et suivants.
- **Un point d'accès réseau** coupable à volonté, et l'**accès Internet** coupable séparément,
  pour le scénario 8.
- **L'application du fabricant** de MC-02, installée et appairée, pour les scénarios 8 et 9.

```bash
npm test                 # les vingt-deux règles et la suite complète
npm run fournitures      # régénère dossier/fournitures.md
npm run build            # dist/garage.html
```

---

### 1. Les vingt-deux règles ne rendent aucun défaut sur les quatre apports fusionnés

```bash
npm test
```

**Attendu** : zéro défaut. C'est la porte de qualité de l'étape 4 du processus, et elle est
**bloquante** — l'implantation de `data-model.md` n'a pas encore été soumise aux règles, ce qui la
distingue de celles de `002`, `003` et `004`.

**À surveiller en particulier** : V16 sur les **trois** circuits. Sans la contiguïté déclarée entre
le tableau et la goulotte, plus rien n'est continu depuis le tableau — c'est le mode de défaillance
que R3 décrit, et il est spectaculaire plutôt que discret.

### 2. La contiguïté ne fabrique pas de continuité à partir de rien

**Attendu** : trois refus, chacun sur un cas fautif construit pour lui.

| Cas | Verdict attendu |
|-----|------------------|
| Contiguïté entre deux objets **sans volume déclaré** | refusée — V22 |
| Contiguïté entre deux volumes **qui ne se touchent pas** | refusée — V22 |
| Deux enveloppes qui se touchent **sans déclaration** | **aucune continuité** : le rattachement se déclare, il ne se déduit pas de la proximité |

Le troisième est le plus important. C'est la discipline que `boitier` a établie, et une permission
qui se déduirait de la géométrie la ruinerait.

### 3. Les trois apports existants sont rigoureusement inchangés

**Attendu** : aucune des longueurs, aucun des décomptes, aucun des verdicts de collision des
circuits `c-prises`, `c-eclairage` et `c-borne` ne bouge du fait de l'extension du socle. Les
apports existants ne déclarent aucune contiguïté ; ils ne doivent rien ressentir.

*C'est le contrat qu'avait tenu l'extension des boîtes-volumes de `004`, et il n'y a pas de raison
de le relâcher.*

### 4. Le décompte des conducteurs est dérivé, pas recopié

```bash
npm run fournitures
```

**Attendu** : la fiche d'un conduit montre les rôles, et le **rôle « ordre »** apparaît là où un
interrupteur commande un module — jamais « retour commandé », qui serait faux.

**À vérifier nommément**, parce que ce sont les deux conditions que la conception a découvertes :

- **CH-04 et CH-07 passent de six à sept** conducteurs, CH-08 de trois à quatre ;
- **CH-02 passe à dix et CH-05 à neuf** — la dérivation a démenti ici le décompte manuel de
  `data-model.md`, qui oubliait la sortie de MC-01 et la paire d'ordre de CM-01. Tous deux sont en
  **IRL 25** depuis la décision du maître d'ouvrage du 2026-09-23 ;
- **CH-L1 porte huit conducteurs**, sept au décompte manuel plus le PE du bouton de porte. Il reste
  en IRL 20 sous la condition d'achat de 14,69 mm, sa composition étant celle de l'ancien CH-05.

*Révisé le 2026-09-23 : la dérivation fait foi, et c'est elle qui a trouvé l'écart. Voir
`openspec/changes/automatisation-locale-mise-en-oeuvre/design.md`.*

### 5. La maquette montre la goulotte pour ce qu'elle est

```bash
npm run build
```

**Attendu** : GL-01 se lit comme une **goulotte** et non comme une boîte de dérivation démesurée.
BD-02 a disparu. Le boîtier double à l'entrée de la sectionnelle porte sa mention de **deux
circuits**.

### Résultats au clavier — 2026-09-23

| Scénario | Résultat |
|----------|----------|
| 1 — les vingt-deux règles | ✅ **zéro défaut** sur les quatre apports fusionnés. Suite complète : **427 tests**, 427 passés |
| 2 — la contiguïté ne fabrique rien | ✅ les trois refus, par `tests/contiguite.test.js` |
| 3 — non-régression du socle | ✅ l'extension de la dérivation à la commande sur module a laissé les 399 tests d'avant passer **avant** toute modification des données ; et sans commande sur module, les décomptes de `003` reviennent — huit sur CH-05, six ailleurs (`tests/apport-005.test.js`). *Les apports `002` et `003` ont ensuite changé par décision, et non par effet du socle* |
| 4 — le décompte dérivé | ✅ rôle « ordre » et « sortie de module » affichés ; décomptes ci-dessus, **qui démentent le décompte manuel** sur CH-02 et CH-05 |
| 5 — la maquette | ⚠️ **partiel.** `dist/garage.html` construit, version `50-automatisation-locale`. GL-01 est dessinée à sa longueur et à sa section réelles, BD-02 a disparu — vérifié par `tests/scene.test.js`, **pas encore à l'œil dans un navigateur**. **La fiche d'un composant n'affiche pas le boîtier partagé** : la mention « deux circuits » du boîtier double n'est portée que par les instructions de montage, pas par la maquette |

---

## Au garage — ce qu'aucune règle ne vérifie

### 6. L'ouverture à la télécommande allume l'éclairage

**De nuit, véhicule à l'extérieur.** Ouvrir la porte à la télécommande **sans toucher aucun organe
du garage**. **Attendu** : l'éclairage intérieur s'allume — **10 essais sur 10** (SC-013).

C'est le scénario que la décision Q1 a rendu possible et qu'une installation observant ses seuls
ordres manquerait à chaque fois.

### 7. La minuterie s'éteint, et la main l'emporte toujours

| Essai | Attendu |
|-------|---------|
| Laisser courir le délai sans rien toucher | extinction seule, dans le délai consigné à ±10 % (SC-002) |
| Réouvrir la porte pendant le décompte | décompte relancé, **aucune extinction intermédiaire** (FR-004) |
| Allumer à la main, porte fermée, attendre **une heure** | **aucune extinction** (SC-003) |
| Allumer à la main, **puis** ouvrir la porte, attendre le délai | **la lumière reste allumée** (FR-008) |
| Actionner l'interrupteur pendant le décompte | le décompte est abandonné, dans les deux sens (FR-007) |

**L'avant-dernier est le plus important de toute la fonctionnalité.** Sans lui, travailler à
l'établi porte ouverte finit dans le noir.

### 8. Réseau coupé, Internet coupé : la main marche encore

*Révisé le 2026-09-23 par décision du maître d'ouvrage — changement `commande-porte-a-distance`.*

| Essai | Attendu |
|-------|---------|
| **Point d'accès éteint** — actionner les deux interrupteurs d'éclairage et le bouton de porte | les trois fonctionnent — **100 % des essais** (SC-005). L'allumage automatique et la commande à distance cessent |
| **Réseau local présent, Internet coupé** — mêmes essais, puis ouvrir la porte | les trois fonctionnent, et l'éclairage **s'allume** à l'ouverture. **Seule la commande à distance cesse** |
| Réseau et Internet rétablis | automatisme et commande à distance reviennent **sans intervention** |
| Trafic observé | les seules requêtes vers Internet sont celles de **MC-02** vers le service du fabricant ; **MC-01 n'en émet aucune** (SC-006) |

### 9. La porte ne bouge jamais toute seule, et ses sécurités sont intactes

| Essai | Attendu |
|-------|---------|
| Obstacle pendant le mouvement | les dispositifs du moteur agissent **à l'identique** qu'avant la modification (SC-008) |
| Toute la durée des essais | la porte ne se met en mouvement **à aucun moment** sans action délibérée (SC-009) |
| Commande depuis l'application du fabricant, **porte et abords en vue la première fois** | la porte se met en mouvement **comme au bouton mural**, et rien d'autre — *révisé le 2026-09-23 : la commande à distance est admise par décision* |
| Porte manœuvrée au bouton, puis à la télécommande | l'application affiche l'**état réel**, ouverte ou fermée, à chaque fois |

### 10. Consignation, et ce que l'éclairage automatique y change

**Le scénario le plus important pour la sécurité, et le seul qui soit nouveau dans ce dossier.**

| Essai | Attendu |
|-------|---------|
| Éclairage consigné, ouvrir la porte | **aucune remise sous tension** (SC-007) |
| Éclairage consigné, actionner les interrupteurs | rien |
| Ouvrir le boîtier double, éclairage consigné | le bouton de **porte reste sous tension** — il relève des prises |
| Coupure puis retour du courant, garage vide, porte fermée | l'état écrit au dossier, **jamais un allumage inopiné** — 10 essais sur 10 (SC-010) |

**À rappeler à l'exploitant, et à écrire au dossier** : l'éclairage peut désormais s'allumer sans
que personne n'ait rien touché. **L'absence de lumière ne vaut plus absence de tension** (FR-020).

---

## Réserves connues

| Réserve | Effet |
|---------|-------|
| ~~Implantation non validée~~ | **Levée le 2026-09-23** : les vingt-deux règles ne rendent aucun défaut sur les quatre apports fusionnés, l'extension du socle faite |
| ~~Remplissage de CH-L1~~ | **Levée le 2026-09-22** par l'abandon de l'IRL 16 : les branches passent en IRL 20 et la condition tient à toutes les valeurs produit. Le bouton de porte reste à l'entrée de la sectionnelle |
| **Remplissage du tronc** | **Révisé le 2026-09-23**, deux fois. CH-02 et CH-05, dix et neuf conducteurs, en IRL 25. En IRL 20, CH-L1 sous le seuil de 14,69 mm, et CH-04, CH-07 — sept conducteurs dont quatre de 2,5 mm² depuis que l'entrée de MC-02 commute la phase — sous un seuil à calculer |
| **Relevé du moteur** | U1, bloquant pour FR-031. Trois voies, aucune choisie |
| **Valeurs normatives** | Deux de plus (U2), sur le tronc seul. La borne y échappe |
| **Commande hors vue de la porte** | **Réserve ouverte, non bloquante**, née de la décision du 2026-09-23. Les exigences propres aux portes motorisées commandées hors vue sont à identifier **sur le texte** ; le niveau de protection du moteur en l'absence d'opérateur est à constater au relevé du moteur |
| **Décision FR-050** | Aggravée une troisième fois : deux alimentations à découpage permanentes de plus, sur un différentiel de type AC |
