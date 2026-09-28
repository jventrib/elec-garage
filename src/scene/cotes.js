/**
 * Le tracé des cotes d'implantation dans la maquette.
 *
 * Ce module **dessine**, il ne décide pas : les cotes elles-mêmes sont dérivées
 * par `src/geometrie/cotes.js`, qui se teste sans navigateur. Ici il n'y a que
 * des traits pointillés, des étiquettes, et la règle d'affichage — **une cote
 * n'apparaît qu'à l'étape qui pose l'objet qu'elle cote**.
 *
 * C'est la raison d'être de la chose. Des cotes affichées en permanence
 * deviendraient un quadrillage illisible, et l'on cesserait de les regarder ;
 * affichées à l'étape qui pose l'élément, elles répondent à la seule question
 * qu'on se pose à ce moment-là : où est-ce que je perce.
 */

import {
  Group,
  BufferGeometry,
  Vector3,
  Line,
  LineDashedMaterial,
} from '../../vendor/three/three.module.js';
import { coterCheminement, coterComposant, coterTraversee, libelleDeCote } from '../geometrie/cotes.js';
import { GENRES_POSABLES } from '../sequence/etat.js';
import { etiquette } from './etiquette.js';

export function construireCotes(modele) {
  const groupe = new Group();
  groupe.name = 'cotes';
  const { local, presentation } = modele;
  const couleur = presentation.couleurs.contourAjout ?? '#11181d';
  const options = {
    libelles: presentation.libelles?.baies ?? {},
    libellesObstacles: presentation.libelles?.obstacles ?? {},
    portee: presentation.porteeDeCote ?? Infinity,
  };

  // Le centre du local, pour décoller les traits de la paroi du bon côté.
  const centre = { x: local.oeuvre.x / 2, y: local.oeuvre.y / 2, z: local.hauteurSousPlafond / 2 };
  const DECALAGE = 0.04;

  function dessiner(cote) {
    const depart = { ...cote.point };
    const arrivee = { ...cote.point, [cote.axe]: cote.vers };
    // Décoller de la paroi : un trait dans le plan du mur disparaît dedans.
    const n = cote.normale;
    if (n) {
      const sens = Math.sign(centre[n] - cote.point[n]) || 1;
      depart[n] += sens * DECALAGE;
      arrivee[n] += sens * DECALAGE;
    }
    const noeud = new Group();
    // La scène est en z-up, comme le repère du relevé : aucune conversion.
    const geo = new BufferGeometry().setFromPoints([
      new Vector3(depart.x, depart.y, depart.z),
      new Vector3(arrivee.x, arrivee.y, arrivee.z),
    ]);
    const ligne = new Line(geo, new LineDashedMaterial({ color: couleur, dashSize: 0.05, gapSize: 0.035, depthTest: false }));
    ligne.computeLineDistances();
    ligne.renderOrder = 9;
    noeud.add(ligne);

    const milieu = {};
    for (const a of ['x', 'y', 'z']) milieu[a] = (depart[a] + arrivee[a]) / 2;
    const texte = etiquette(libelleDeCote(cote), couleur);
    texte.position.set(milieu.x, milieu.y, milieu.z);
    noeud.add(texte);
    return noeud;
  }

  // Les cotes sont calculées une fois, à la construction : elles ne dépendent
  // que du relevé et de l'implantation, dont aucun ne bouge à l'exécution.
  const parObjet = new Map();
  const ajouter = (id, cotes) => {
    if (cotes.length === 0) return;
    const noeud = new Group();
    for (const c of cotes) noeud.add(dessiner(c));
    noeud.visible = false;
    groupe.add(noeud);
    parObjet.set(id, noeud);
  };

  for (const ch of modele.cheminements ?? []) ajouter(ch.id, coterCheminement(local, ch, options));
  for (const c of modele.composants ?? []) ajouter(c.id, coterComposant(local, c, options));
  // Les traversées en dernier, et ce sont les plus utiles : un trou mal placé
  // dans 0,20 m de béton ne se rattrape pas.
  for (const t of modele.traversees ?? []) ajouter(t.id, coterTraversee(local, t, options));

  /**
   * N'afficher que les cotes des objets que l'étape courante POSE. Les objets
   * déjà en place n'ont plus besoin d'être tracés : ils le sont.
   */
  function appliquerEtat(partition) {
    for (const n of parObjet.values()) n.visible = false;
    // La liste des genres posables est lue, pas recopiée : une seconde liste
    // divergerait au prochain apport, et les cotes manqueraient à un objet posé.
    for (const genre of GENRES_POSABLES) {
      for (const o of partition[genre]?.ajoutes ?? []) {
        const n = parObjet.get(o.id);
        if (n) n.visible = true;
      }
    }
  }

  /** Les cotes se coupent d'un geste : elles aident à tracer, pas à regarder. */
  function basculer(visible) {
    groupe.visible = visible;
  }

  return { groupe, appliquerEtat, basculer, compte: () => parObjet.size };
}
