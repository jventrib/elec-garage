/**
 * Les couches d'affichage : ce que la bascule « électricité / rangement » governa.
 *
 * **Un seul endroit déclare à quelle couche appartient un groupe.** Pas deux, pas
 * trois : dès qu'une liste existe à deux endroits, elle diverge au prochain module,
 * et un groupe oublié reste visible dans les deux cas sans que rien ne le signale.
 * C'est pour cela que `cotes.js` lit `GENRES_POSABLES` au lieu de recopier la liste,
 * et que ce fichier est le pendant de scène de cette règle.
 *
 * **Les exclusions sont le motif de la déclaration, pas un oubli.** Trois groupes ne
 * sont dans aucune couche, et chacun pour une raison qui n'est pas la même :
 *
 *  - `local` et `obstacles` décrivent la **pièce**. Ce n'est pas une installation à
 *    poser : c'est ce dans quoi on pose, et cela reste toujours visible.
 *  - `cotes` est un **calque d'annotation**. Il ne se coupe pas, il se subordonne à
 *    l'électricité : les cotes d'un objet absent n'ont plus de sens à l'écran, et
 *    les afficher quand même promettrait un tracé qu'on ne voit pas.
 *  - `plafond` est **piloté par la caméra**. Il s'escamote de lui-même quand la vue
 *    passe au-dessus (FR-004) ; le donner à une bascule créerait deux commandes
 *    pour le même geste, et la caméra gagnerait toujours.
 *
 * `couches` ne décrit que ce qui est affichable. Le reste du groupe — le local, sa
 * coque, ses baies — n'y figure pas davantage : il n'y a rien à y cacher.
 */

/** Les deux couches basculables, dans l'ordre où les boutons les présentent. */
export const COUCHES = ['electricite', 'rangement'];

/**
 * L'appartenance de chaque groupe de scène.
 *
 * `couches` liste les couches dont ce groupe fait partie. Un groupe absent de cette
 * table n'est dans AUCUNE couche : il est alors piloté autrement (la caméra) ou il
 * n'a rien à cacher (le local).
 *
 * `portee` distingue les groupes de premier niveau dans la scène — la seule chose
 * comparable au décor — des groupes **enfants**, qui existent mais ne sont pas posés
 * dans la scène eux-mêmes. `plafond` est de ceux-là : c'est un enfant de `local`, et
 * le dire évite de le chercher au niveau du décor.
 */
export const GROUPES = [
  { nom: 'composants', couches: ['electricite'], pourquoi: 'appareillage de l\'installation' },
  { nom: 'cheminements', couches: ['electricite'], pourquoi: 'conducteurs de l\'installation' },
  { nom: 'percages', couches: ['electricite'], pourquoi: 'trous de l\'installation' },
  { nom: 'trajets', couches: ['electricite'], pourquoi: 'dérivation des conducteurs' },
  { nom: 'rangements', couches: ['rangement'], pourquoi: 'équipement de la pièce, hors installation' },

  // Les exclusions, et leur motif. `local` et `plafond` sont deux entrées pour une
  // seule chose : le plafond est un ENFANT du groupe `local`, piloté à part par la
  // caméra. Les déclarer tous deux empêche de croire que l'un des deux a été oublié.
  { nom: 'local', couches: [], pourquoi: 'la pièce elle-même : rien à y cacher' },
  { nom: 'obstacles', couches: [], pourquoi: 'contraint la pièce, ne s\'y pose pas' },
  { nom: 'cotes', couches: [], pourquoi: 'calque d\'annotation, subordonné à l\'électricité' },
  { nom: 'plafond', portee: 'enfant', parent: 'local', couches: [], pourquoi: 'piloté par la caméra (FR-004)' },
];

/** Les modules de `main.js` à basculer pour une couche donnée. */
export function modulesDe(couche) {
  return GROUPES.filter((g) => g.couches.includes(couche)).map((g) => g.nom);
}

/** Les groupes de la scène qui ne sont déclarés nulle part : ceux qu'on a oubliés. */
export function nonDeclares(nomsPresents) {
  const declares = new Set(groupesDeScene());
  return [...nomsPresents].filter((n) => !declares.has(n));
}

/** Les groupes de premier niveau de la scène : la seule chose à comparer au décor. */
export const groupesDeScene = () => GROUPES.filter((g) => g.portee !== 'enfant').map((g) => g.nom);

/** Les entrées déclarées « enfant », avec le parent où elles doivent se trouver. */
export const groupesEnfants = () =>
  GROUPES.filter((g) => g.portee === 'enfant').map((g) => ({ nom: g.nom, parent: g.parent }));

/** Les groupes de premier niveau déclarés mais absents : ceux qu'on a retirés. */
export function declaresInabsents(nomsPresents) {
  const presents = new Set(nomsPresents);
  return groupesDeScene().filter((n) => !presents.has(n));
}
