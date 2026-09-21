# Design

## Context

Voir [proposal.md](proposal.md) — *Why*. Les exigences révisées sont dans le
[delta de spec](specs/installation/automatisation/spec.md).

Ce qui est déjà arrêté, et que la décision ne touche pas :

- **MC-02**, au droit du moteur dans le boîtier de PC-05, sur le circuit des prises. Sa sortie
  est un **contact sec** qui referme les bornes 21 / 20 du moteur, en TBTS 24 V.
- Son entrée 1 reçoit **CM-05**, bouton poussoir du boîtier double ; son entrée 2 le contact
  « Ouvert » de la platine **UAP 1-HCP**, qui donne l'état réel de la porte (tâche 1.2 de
  `automatisation-locale-mise-en-oeuvre`, suspendue au relevé 1.1).
- MC-02 émet l'ouverture vers **MC-01** par le réseau local : c'est le seul message du réseau
  local dans le dossier actuel (R8).

La commande à distance n'ajoute donc **ni conducteur, ni boîte, ni conduit** : le chemin
électrique vers le moteur est celui du bouton mural. Ce qui change est ce que le module
**accepte comme ordre**, et d'où.

## Goals / Non-Goals

**Goals :**
- Que la notice, la recette et les instructions de montage disent la même chose que le
  delta, et que plus aucune affirmation contraire à la décision ne subsiste hors des notes
  historiques datées.
- Que l'exploitant et l'intervenant sachent que **la porte peut se mettre en mouvement sans
  personne sur place**, et le geste qui l'empêche.

**Non-Goals :**
- Modifier le socle, la géométrie ou un décompte : les données d'apport ne changent que par
  leurs **instructions**.
- Choisir la référence de MC-02. La nomenclature énonce l'exigence nouvelle ; le produit reste
  à retenir.
- Trancher la réserve réglementaire sur la commande hors vue : elle est portée ouverte, avec
  ce qu'il faut constater.

## Decisions

### D1 — Le cloud du fabricant, pas un serveur local

La commande à distance passe par **l'application et le service du fabricant** du module,
comme le maître d'ouvrage l'a décidé. *Écarté* : une passerelle locale avec accès distant
propre (VPN, domotique auto-hébergée) — elle ajouterait un équipement à maintenir et un
point de défaillance, sans que la décision le demande.

Conséquence : **MC-02 seul** parle au cloud. MC-01 reste sans service distant ; l'éclairage
et son automatisme ne dépendent que du réseau local.

### D2 — L'état remonté est l'état réel, par l'entrée 2 de MC-02

L'application affiche l'état tiré du contact « Ouvert » de l'UAP 1-HCP, déjà raccordé à
l'entrée 2 de MC-02 pour l'éclairage. *Écarté* : un état déduit des ordres émis — il serait
faux dès l'emploi de la télécommande, précisément le défaut que la décision Q1 avait écarté
pour l'éclairage.

Le module retenu DOIT donc offrir, **dans la même application**, la commande de sa sortie et
l'affichage de l'état de son entrée 2. C'est l'exigence nouvelle de la nomenclature.

### D3 — La coupure qui empêche un mouvement à distance

Avant cette décision, une intervention sur la porte se faisait en vue de toutes ses
commandes. Ce n'est plus vrai : **un tiers peut la mettre en mouvement depuis Internet**.
L'intervenant DOIT couper l'alimentation du moteur, et avec elle MC-02 : consigner le circuit
des prises, ou déposer PC-05, qui coupe MC-02. La réserve est écrite à l'étape `au-levee`,
dans la notice et dans les réserves de la recette.

### D4 — Réécrire le présent, dater le passé

La notice, le quickstart et les instructions sont **réécrits** : ce sont des documents
d'exploitation, qui décrivent l'installation telle qu'elle doit être. `research.md` R8 reçoit
une **note datée** « révisé le 2026-09-23 par décision », sans réécrire le raisonnement
d'origine : c'est lui qui fonde l'avis contraire consigné.

### D5 — L'essai réseau est inversé, porte en vue la première fois

L'étape `au-essai-reseau` constate que la commande à distance **ouvre** la porte, et que
l'état remonte juste. Le **premier** essai se fait **porte et abords en vue**, pour constater
que l'ordre distant produit le mouvement attendu et rien d'autre. Elle constate aussi que les
commandes manuelles marchent **réseau et Internet coupés**.

## Risks / Trade-offs

- **[Mise en mouvement hors de la vue de l'opérateur]** — le risque que le dossier jugeait
  inacceptable est désormais **accepté par décision**. → Consigné avec la date et le motif ;
  la réserve d'intervention (D3) est écrite partout où l'on touche la porte ; les sécurités du
  moteur restent vérifiées à l'identique.
- **[Exigences propres aux portes motorisées]** — la commande hors vue peut y être encadrée.
  → Réserve ouverte portée au changement `reserves-maitre-ouvrage`, à identifier **sur le
  texte** ; le niveau de protection du ProCom est à constater au relevé du moteur (tâche 1.1
  de `automatisation-locale-mise-en-oeuvre`). Aucune valeur ni clause n'est écrite de
  mémoire.
- **[Compte en ligne et identifiants]** — le cloud exige un compte. → Le compte et le moyen
  d'y accéder se consignent dans la fiche de réglages ; **aucun secret** n'entre au dossier.
- **[Disparition du service du fabricant]** — seule la commande à distance cesse. → Exigé
  par le delta : les commandes manuelles et l'éclairage n'en dépendent pas.

## Open Questions

- La référence de MC-02, qui doit désormais satisfaire à la fois le contact sec, la séparation
  des domaines de tension et la commande par le cloud avec remontée d'état — sans effet sur le
  câblage.
