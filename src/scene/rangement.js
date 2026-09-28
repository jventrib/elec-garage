/**
 * Le rangement : étagères et rack, rendus dans la maquette.
 *
 * Ce module **dessine**, il ne décide pas. Il n'a ni séquence, ni étape, ni
 * `appliquerEtat` — le rangement n'est pas posé par la séquence et personne ne
 * l'attend à une étape du chantier. C'est ce qui le distingue d'un composant : celui-ci
 * apparaît quand son étape le pose, celui-ci est là ou il n'est pas là.
 *
 * **Le volume dessiné vient toujours du gabarit, jamais des cotes.** Les cotes
 * décrivent ce que la source affirme, et cette affirmation peut être contradictoire
 * ou inconnue ; le gabarit est l'enveloppe de représentation, déclarée comme telle.
 * Dessiner depuis les cotes reviendrait à trancher à la place du maître d'ouvrage,
 * et il n'y a pas de version de cette figure qui soit innocente quand on ne sait
 * pas : soit on n dessine rien, soit on dessine une convention en le disant.
 *
 * La convention est donc **dite à l'écran**, sur chaque élément, par une étiquette
 * non escamotable. Un volume plausible sans étiquette redeviendrait une donnée
 * présentée comme établie, ce qui est précisément ce que la constitution interdit.
 *
 * Deux teintes, et non une : un élément dont les cotes sont toutes établies se
 * rend dans la teinte du rangement ; un élément qui porte au moins une cote
 * contradictoire ou inconnue se rend dans la teinte du doute. La figure se lit
 * contestée avant même qu'on clique.
 */

import {
  Group,
  Mesh,
  BoxGeometry,
  MeshStandardMaterial,
  EdgesGeometry,
  LineSegments,
  LineBasicMaterial,
} from '../../vendor/three/three.module.js';
import { etiquette } from './etiquette.js';

/** Un élément est « contesté » dès qu'une seule de ses cotes ne l'est pas. */
function conteste(rangement) {
  return Object.values(rangement.cotes ?? {}).some((c) => c.etat !== 'releve');
}

/**
 * La forme que le cadrage attend : celle d'un composant.
 *
 * Le rangement n'a pas de `position` — il a un VOLUME, parce qu'il est mural et se
 * pose en hauteur. Et le volume à cadrer est celui du GABARIT, pas celui qu'on
 * pourrait lire dans les cotes : cadrer la déclaration promettrait qu'on voit
 * l'encombrement du fabricant, alors qu'on voit une convention. C'est donc ici, dans
 * le seul module qui connaît les deux, que la substitution se fait et se nomme.
 *
 * Fonction de données pures, hors de la fabrique : le cadrage se teste sans
 * WebGL, et une dépendance de canevas ici n'aurait rien à voir avec ce qu'elle fait.
 */
export function descripteurDe(rangement) {
  return {
    id: rangement.id,
    paroi: rangement.paroi,
    face: rangement.face,
    volume: rangement.gabarit?.volume ?? null,
    libelle: rangement.libelle,
  };
}

export function construireRangements(modele) {
  const groupe = new Group();
  groupe.name = 'rangements';
  const { presentation } = modele;
  const couleurs = presentation.couleurs ?? {};
  const opacites = presentation.opacites ?? {};
  const teinte = couleurs.rangement ?? '#3f7d6b';
  const teinteDoute = couleurs.rangementGabarit ?? '#8a6d3b';
  const opacite = opacites.rangement ?? 0.35;
  const opaciteDoute = opacites.rangementGabarit ?? 0.22;

  const parId = new Map();

  for (const r of modele.rangements ?? []) {
    const { min, max } = r.gabarit.volume;
    // Les axes de three.js ne sont pas les nôtres : la scène est en z-up, comme le
    // repère du relevé, et c'est l'orientation de la caméra qui fait le reste.
    // On passe donc x, y, z dans l'ordre, comme `obstacles.js`.
    const taille = [max.x - min.x, max.y - min.y, max.z - min.z];
    // Un gabarit d'épaisseur nulle ne produirait pas une boîte mais un dégénéré,
    // invisible et sélectionnable : on lui donne une épaisseur minimale.
    const cote = taille.map((t) => Math.max(t, 1e-3));
    const contesté = conteste(r);

    const noeud = new Group();
    noeud.name = `rangement-${r.id}`;

    const materiau = new MeshStandardMaterial({
      color: contesté ? teinteDoute : teinte,
      transparent: true,
      opacity: contesté ? opaciteDoute : opacite,
    });
    const corps = new Mesh(new BoxGeometry(...cote), materiau);
    corps.position.set(min.x + taille[0] / 2, min.y + taille[1] / 2, min.z + taille[2] / 2);
    corps.userData.rangement = r;
    noeud.add(corps);

    // Le contour porte la contradiction autant que le fond : il reste lisible
    // quand la transparence s'accumule et quand deux éléments se touchent.
    const aretes = new LineSegments(
      new EdgesGeometry(new BoxGeometry(...cote)),
      new LineBasicMaterial({ color: contesté ? teinteDoute : teinte }),
    );
    aretes.position.copy(corps.position);
    noeud.add(aretes);

    // L'étiquette porte la mention de convention, et la contestedité quand elle
    // existe. Elle est attachée au noeud : masquer la couche l'emportera.
    const texts = [r.libelle];
    if (contesté) {
      const nom = Object.entries(presentation.libelles?.etatsCote ?? {})
        .filter(([cle]) => Object.values(r.cotes ?? {}).some((c) => c.etat === cle))
        .map(([, mot]) => mot);
      if (nom.length) texts.push(`contesté — ${nom.join(', ')}`);
    }
    // La mention vient de l'ÉLÉMENT, pas d'un libellé global : deux rangements
    // peuvent être dessinés par deux conventions différentes, et la mention doit
    // suivre le volume qu'elle qualifie. `validation.js` exige qu'elle existe, donc
    // rien n'est ici inventé à défaut — pas de phrase de repli dans le code, qui
    // finirait par dire « conventionnel » d'un volume qui ne l'est peut-être pas.
    if (r.gabarit?.mention) texts.push(r.gabarit.mention);

    texts.forEach((texte, rang) => {
      const sprite = etiquette(texte, contesté ? teinteDoute : teinte);
      // Empilées au-dessus de l'élément : la dernière ligne, la plus basse, est
      // la mention de convention — celle qu'on ne doit pas manquer.
      sprite.position.set(min.x + taille[0] / 2, min.y + taille[1] / 2, max.z + 0.06 + rang * 0.12);
      noeud.add(sprite);
    });

    groupe.add(noeud);
    parId.set(r.id, { noeud, corps, rangement: r, conteste: contesté });
  }

  /**
   * Une couche se coupe d'un geste. Le rangement n'a pas d'état de pose à
   * suspendre : le masquer ne fige rien, et le réafficher ne recalcule rien.
   */
  function basculer(visible) {
    groupe.visible = visible;
  }

  /**
   * Corps sélectionnables, restreints à ceux réellement visibles. Le rayon de
   * three.js ne teste PAS la visibilité : sans ce filtre, on pourrait désigner un
   * rangement masqué — le défaut que `obstacles.js` documente déjà.
   */
  // Les deux filtres sont nécessaires : un noeud peut rester `visible` alors que
  // son groupe parent ne l'est pas, et c'est le parent qui porte la bascule.
  const meshes = () => (groupe.visible ? [...parId.values()] : []).filter((e) => e.noeud.visible).map((e) => e.corps);

  const rangementDe = (objet) => objet?.userData?.rangement ?? null;

  return { groupe, basculer, meshes, rangementDe, descripteurDe, parId };
}
