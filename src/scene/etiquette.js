/**
 * Les étiquettes de la maquette, peintes sur un canevas.
 *
 * Aucun caractère n'est chargé et aucun réseau n'est appelé : une étiquette est une
 * image, ce qui la rend lisible à l'échelle du local sans resource. La même fonction
 * sert aux cotes et au rangement — deux usages, une seule implémentation, parce
 * qu'une seconde copie divergerait sur la taille ou sur le décalage, et que la
 * divergence n'apparaît qu'à l'écran.
 */

import { Sprite, SpriteMaterial, CanvasTexture } from '../../vendor/three/three.module.js';

function etiquette(texte, couleur) {
  const echelle = 2;
  const canevas = document.createElement('canvas');
  const ctx = canevas.getContext('2d');
  const police = `${13 * echelle}px system-ui, sans-serif`;
  ctx.font = police;
  const largeur = Math.ceil(ctx.measureText(texte).width) + 12 * echelle;
  const hauteur = 20 * echelle;
  canevas.width = largeur;
  canevas.height = hauteur;

  ctx.font = police;
  ctx.fillStyle = 'rgba(255,255,255,0.92)';
  ctx.fillRect(0, 0, largeur, hauteur);
  ctx.strokeStyle = couleur;
  ctx.lineWidth = echelle;
  ctx.strokeRect(0, 0, largeur, hauteur);
  ctx.fillStyle = couleur;
  ctx.textBaseline = 'middle';
  ctx.fillText(texte, 6 * echelle, hauteur / 2);

  const materiau = new SpriteMaterial({ map: new CanvasTexture(canevas), depthTest: false, transparent: true });
  const sprite = new Sprite(materiau);
  // Le texte sur le `userData` : une étiquette peinte est illisible hors écran, et une
  // étiquette qu'on ne peut pas interroger ne se teste pas. Le porter ici permet
  // d'affirmer qu'aucune mention n'est inventée par le code — ce qui était
  // impossible tant que le texte n'existait que dans les pixels du canevas.
  sprite.userData.texte = texte;
  sprite.userData.couleur = couleur;
  // Taille en mètres : l'étiquette doit rester lisible sans écraser le local.
  const h = 0.11;
  sprite.scale.set((h * largeur) / hauteur, h, 1);
  sprite.renderOrder = 10;
  return sprite;
}

export { etiquette };
