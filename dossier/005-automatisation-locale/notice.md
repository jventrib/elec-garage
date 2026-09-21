# Notice d'exploitation — l'éclairage automatique et le bouton de porte

**Fonctionnalité** : `005-automatisation-locale` | **Date** : 2026-09-23

Cette notice s'adresse à **qui occupe le garage**, et non à l'installateur. Elle dit quand
l'éclairage s'allume et s'éteint seul, ce qui se passe quand quelque chose tombe en panne, et
comment retrouver les réglages après le remplacement d'un module. *Une logique qui ne vit que
dans la configuration d'un module est perdue au premier remplacement* : c'est ici qu'elle vit.

## 1. Ce qui a changé, et qu'il faut savoir avant tout

**L'éclairage intérieur peut désormais s'allumer sans que personne n'ait rien touché** — à
l'ouverture de la porte sectionnelle. **L'absence de lumière ne vaut donc pas absence de
tension.** Avant cette installation, un éclairage éteint l'était toujours par un geste humain ; ce
n'est plus vrai. Avant toute intervention, **consigner** le circuit au tableau : c'est la seule
coupure qui compte, elle se fait en amont des modules, et aucun automatisme, aucune minuterie,
aucun ordre réseau ne peut la lever.

**Le boîtier double de l'entrée de la sectionnelle porte deux circuits.** Le bouton d'éclairage
relève de l'éclairage, le bouton de porte des prises. Consigner l'éclairage **ne met pas le bouton
de porte hors tension.** Il en va de même de la goulotte au-dessus du tableau et de la boîte BD-06.

**La porte sectionnelle peut se mettre en mouvement sans personne sur place.** Elle se commande
depuis Internet, par l'application du fabricant du module de porte. Avant toute intervention sur
la porte, son rail ou son moteur, **en couper l'alimentation**, et avec elle le module MC-02 :
consigner le circuit des **prises** au tableau, ou déposer la prise PC-05. Ne jamais se fier à ce
qu'aucune commande ne soit à portée de main.

## 2. Quand l'éclairage s'allume et s'éteint seul

**Il s'allume seul** quand la porte sectionnelle s'ouvre, **quel que soit le moyen** : bouton
mural, télécommande, ou organe du moteur. C'est le cas de la rentrée en voiture, de nuit.

**Il s'éteint seul** après un délai — *(valeur consignée : .............. — voir la note de calcul
du changement)* — compté depuis la **dernière** ouverture. Rouvrir la porte pendant ce délai le
**relance**, sans extinction entre-temps.

**Il ne s'éteint jamais seul s'il a été allumé à la main.** Allumé à l'interrupteur, il reste
allumé jusqu'à ce qu'on l'éteigne, **même si la porte est ouverte ensuite** : travailler à l'établi
porte ouverte ne finit pas dans le noir.

**La main l'emporte toujours.** Pendant le délai, un appui sur l'un des deux boutons d'éclairage
abandonne le décompte et impose l'état demandé. On peut éteindre sans attendre.

**Les deux commandes d'éclairage se valent** : l'interrupteur près de la porte de service, CM-01,
et le bouton du boîtier double, CM-04. Chacun bascule l'état courant, sans qu'il faille savoir ce
que l'autre a fait.

**Les éclairages extérieurs ne sont pas concernés.** Le point de façade garde son détecteur, le
point de l'accès piéton son interrupteur extérieur.

**Au retour du courant après une coupure**, l'éclairage revient **éteint**. Jamais un allumage
inopiné.

## 3. Qui commande la porte, et ce qu'elle ne fera jamais

- **La porte ne se met jamais en mouvement toute seule.** Aucun automatisme ne l'ouvre :
  l'éclairage n'agit pas sur la porte, seule la porte agit sur l'éclairage. Il faut toujours
  l'action d'une personne.
- **Elle se commande aussi à distance**, par l'**application du fabricant** du module de porte,
  sur place ou depuis Internet — *décision du maître d'ouvrage du 2026-09-23*. Les autres moyens
  restent le bouton mural, la télécommande et les organes du moteur.
- **L'application affiche l'état réel de la porte**, ouverte ou fermée, quel que soit le moyen qui
  l'a manœuvrée. Qui commande la porte sans la voir **vérifie dans quel état il la laisse**.
- **Commander à distance, c'est commander sans voir.** Personne ne peut garantir depuis
  l'application qu'il n'y a ni personne, ni véhicule, ni objet sous le tablier : seules les
  sécurités du moteur y veillent.
- **Les sécurités du moteur sont intactes** — détection d'obstacle et arrêt. Leur comportement a
  été constaté avant et après la pose, et doit rester identique.

## 4. Sans réseau, ce qui marche encore

Le point d'accès éteint, la liaison sans fil perdue ou les modules non appairés, **les deux
commandes d'éclairage et le bouton de porte fonctionnent** exactement comme avant. L'allumage
automatique et la commande à distance cessent, et reviennent seuls quand le réseau revient.

**Sans Internet** — ou si le service du fabricant est injoignable, ou disparaît —, **seule la
commande à distance de la porte cesse.** Les commandes manuelles et l'allumage automatique ne
passent pas par Internet. Seul le module de porte parle au service du fabricant ; le module
d'éclairage ne dépend d'aucun service distant.

## 5. Mode dégradé — quand un module tombe en panne

### MC-01, le module de l'éclairage, dans la goulotte

**Ce qu'on constate** : plus aucun bouton n'allume le plafonnier, et l'ouverture de la porte non
plus. Les points extérieurs fonctionnent toujours.

**Le geste qui rétablit l'éclairage, en attendant un module neuf** — à faire faire par une personne
habilitée :

1. **Consigner le circuit d'éclairage** au tableau, et vérifier l'absence de tension.
2. Déposer le capot de la goulotte et **déposer MC-01**.
3. Dans un organe de connexion à enveloppe propre, relier le brin d'**aller** de la paire de CM-01
   à la **phase** de l'éclairage, et le brin de **retour** au conducteur de **sortie** vers le
   plafonnier. Isoler chacun des deux brins de la paire de CM-04.
4. Repérer le montage provisoire, reposer le capot, lever la consignation.

**Ce qu'on obtient** : **CM-01 redevient un interrupteur ordinaire** du plafonnier. CM-04 est hors
service, et l'automatisme aussi. *C'est possible parce que la paire de CM-01 est en 1,5 mm², sur
la protection du circuit d'éclairage : elle peut porter la phase du plafonnier.*

### MC-02, le module de la porte, au droit du moteur

**Ce qu'on constate** : le bouton de porte du boîtier double n'agit plus, l'application ne commande
plus la porte ni n'en affiche l'état, et l'éclairage ne s'allume plus à l'ouverture. **La porte s'ouvre toujours** à la télécommande et par les organes du
moteur, et l'éclairage se commande toujours à la main.

**Il n'y a pas de geste de contournement, et il ne faut pas en improviser un.** NE PAS relier la
phase ou le fil d'ordre du bouton de porte directement aux bornes du moteur : ce sont des conducteurs de 230 V, dans
les conduits du 230 V, et l'entrée du moteur est en très basse tension de sécurité. Le rétablissement
est le remplacement du module. **La dépose de PC-05 coupe aussi MC-02.**

## 6. Restituer les réglages après remplacement d'un module

Un module neuf se règle **à partir de cette fiche**, et non par essais successifs. Ce qui n'y
figure pas est réputé non réglé.

| Réglage | MC-01 — éclairage | MC-02 — porte |
|---------|-------------------|---------------|
| Référence du produit | .............. | .............. |
| Entrée 1 | CM-01, **interrupteur** — bascule à chaque changement de position | CM-05, **bouton poussoir** — impulsion ; l'entrée **commute la phase** des prises, un seul fil d'ordre |
| Entrée 2 | CM-04, **bouton poussoir** — bascule à chaque appui | contact « Ouvert » de la platine UAP 1-HCP |
| Sortie | plafonnier EL-01a et EL-01b | contact sec, bornes 21 / 20 du moteur |
| Délai d'extinction automatique | .............. — **valeur de la note de calcul** | — |
| Allumage manuel | **aucun décompte**, même sur ouverture de porte | — |
| Ouverture de porte | allume **par minuterie** si éteint ; **relance** le décompte si allumé par minuterie ; **sans effet** si allumé à la main | émise vers MC-01, et vers rien d'autre |
| État au retour du courant | **éteint** | sortie **ouverte** |
| Commande par le réseau | **aucune** | **oui, par le cloud du fabricant** — ouverture et fermeture depuis l'application, sur place ou depuis Internet |
| État remonté à l'application | — | état de l'**entrée 2** — porte ouverte / fermée |
| Service distant, compte en ligne | **aucun** | application : .............. ; compte : .............. *(titulaire et adresse du compte seulement — **aucun mot de passe ni secret dans ce dossier**)* |
| Réglages relevés le | .............. par .............. | .............. par .............. |

**Après tout remplacement**, refaire les essais de la séquence de montage : l'ouverture à la
télécommande, la minuterie et la priorité de la main, le fonctionnement sans réseau, et, pour
MC-02, **les sécurités du moteur**, la **commande à distance porte en vue** et la **remontée de
l'état** dans l'application.
