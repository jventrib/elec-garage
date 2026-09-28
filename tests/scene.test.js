import test from 'node:test';
import assert from 'node:assert/strict';
import { SOCLE, DEMO, copie, socleAvecInconnus } from './_aides.js';
import { fusionner } from '../src/donnees/chargement.js';
import { composerSequence } from '../src/sequence/ordonnancement.js';
import { etatParGenre } from '../src/sequence/etat.js';
import { construireLocal } from '../src/scene/local.js';
import { construireObstacles } from '../src/scene/obstacles.js';
import { construireComposants, couleurDeCircuit, gabarit } from '../src/scene/composants.js';
import { construireCheminements } from '../src/scene/cheminements.js';
import * as encombrement from '../src/geometrie/section.js';

/*
 * Ces constructeurs n'emploient que des classes pures de three.js — géométries,
 * matériaux, groupes — et aucun contexte WebGL. Seul creerVue en a besoin. Les
 * exclure des tests était un angle mort injustifié : c'est lui qui a laissé passer
 * un appel de fonction privé de son second argument, et deux identifiants
 * référencés sans être déclarés. `node --check` ne voit ni l'un ni l'autre.
 */

// Les cas « inconnu » se construisent, sans dépendre du relevé (voir _aides.js).
const socle = socleAvecInconnus(SOCLE());
const modele = fusionner(socle, [DEMO()]);
const sequence = composerSequence(modele);

test('le local se construit et porte sol, plafond et parois', () => {
  const { groupe, plafond, sol } = construireLocal(modele.local, modele.presentation);
  assert.ok(groupe.children.length > 0);
  assert.equal(plafond.name, 'plafond');
  assert.equal(sol.name, 'sol');
  assert.ok(groupe.children.some((c) => c.name === 'paroi-est'));
  assert.ok(groupe.children.some((c) => c.name?.startsWith('linteau-')), 'la porte de service a une hauteur relevée, donc un linteau');
});

test('les obstacles se construisent, y compris ceux sans baie', () => {
  const o = construireObstacles(modele.local, modele.presentation);
  assert.ok(o.groupe.children.length > 0);
  const ids = o.incertains.map((x) => x.id);
  assert.ok(ids.includes('inconnu-zone'), 'une zone libre sans volume ne se rattache à aucune baie');
  assert.ok(ids.includes('tablier-sectionnelle-ouvert'));
});

test('chaque incertitude déclare ce qui est réellement dessiné pour elle', () => {
  // Le panneau d'incertitudes annonçait « Obstacles non relevés (5) » en ajoutant
  // « le contour montre la baie de rattachement ». C'était faux pour trois des
  // cinq : le tablier ouvert est dessiné à son MAJORANT, et les deux zones libres
  // ne sont pas dessinées du tout. Un message d'honnêteté qui se trompe sur ce
  // qu'il montre est pire que pas de message.
  const o = construireObstacles(modele.local, modele.presentation);
  const parId = new Map(modele.local.obstacles.map((x) => [x.id, x]));

  for (const inc of o.incertains) {
    const obstacle = parId.get(inc.id);
    assert.ok(obstacle, `${inc.id} doit correspondre à un obstacle déclaré`);
    assert.ok(['aucun', 'baie', 'majorant'].includes(inc.rendu), `rendu inconnu : ${inc.rendu}`);
    assert.equal(typeof inc.borne, 'boolean');
    assert.ok(inc.raison && inc.raison.length > 0);

    // Le rendu annoncé doit être celui que la géométrie a produit.
    if (inc.rendu === 'majorant') {
      assert.ok(obstacle.volumeMajorant, `${inc.id} annonce un majorant sans en avoir`);
      assert.equal(inc.borne, true, 'un majorant est une borne');
    }
    if (inc.rendu === 'aucun') {
      assert.equal(obstacle.baie, undefined, `${inc.id} n'est dessiné nulle part : il ne doit viser aucune baie`);
      assert.equal(o.groupe.children.some((c) => c.name === inc.id), false, `${inc.id} ne doit rien dessiner`);
    }
    if (inc.rendu === 'baie') {
      assert.equal(inc.borne, false);
      assert.ok(o.groupe.children.some((c) => c.name === inc.id), `${inc.id} doit dessiner un contour`);
    }
  }
});

test('un obstacle dont le volume est relevé ne figure pas parmi les incertitudes', () => {
  const o = construireObstacles(modele.local, modele.presentation);
  const releves = modele.local.obstacles.filter((x) => x.volume && !x.incertain).map((x) => x.id);
  assert.ok(releves.length > 0, 'le relevé doit comporter au moins un obstacle mesuré');
  for (const id of releves) {
    assert.equal(
      o.incertains.some((i) => i.id === id),
      false,
      `${id} est relevé : il ne doit pas être présenté comme une incertitude`,
    );
  }
});

test('un encombrement borné se distingue d’un encombrement inconnu', () => {
  // C'est la distinction que le message confondait. Elle doit être portée par les
  // données, pas reconstituée par l'interface.
  const o = construireObstacles(modele.local, modele.presentation);
  const bornes = o.incertains.filter((i) => i.borne);
  const inconnus = o.incertains.filter((i) => !i.borne);
  assert.ok(bornes.length > 0, 'le relevé comporte des obstacles bornés : le tablier et le vantail');
  assert.ok(inconnus.length > 0, 'et des obstacles sans aucune borne');
  for (const i of bornes) assert.equal(i.rendu, 'majorant');
  for (const i of inconnus) assert.notEqual(i.rendu, 'majorant');
});

test('les composants se construisent — un marqueur par composant', () => {
  const c = construireComposants(modele);
  assert.equal(c.groupe.children.length, modele.composants.length);
  for (const composant of modele.composants) {
    assert.ok(c.parId.has(composant.id), `${composant.reference} absent de la scène`);
  }
  // `meshes()` ne retourne que ce qui est visible : rien n'est posé avant la
  // première étape, et un composant non posé ne doit pas être désignable.
  assert.equal(c.meshes().length, 0);
  c.appliquerEtat(etatParGenre(sequence, modele, sequence.total).composants);
  assert.equal(c.meshes().length, modele.composants.length);
});

test('les cheminements se construisent — un nœud par cheminement et par traversée', () => {
  const ch = construireCheminements(modele);
  assert.equal(ch.groupe.children.length, modele.cheminements.length + modele.traversees.length);
  assert.equal(ch.meshes().length, 0);
  ch.appliquerEtat(etatParGenre(sequence, modele, sequence.total));
  assert.ok(ch.meshes().length >= modele.cheminements.length);
});

test('appliquerEtat traverse tous les rangs sans erreur', () => {
  // Le parcours complet de la séquence, sur les deux constructeurs qui réagissent
  // au rang. C'est ce qui exerce les identifiants du corps des fonctions.
  const composants = construireComposants(modele);
  const cheminements = construireCheminements(modele);
  for (let r = 1; r <= sequence.total; r++) {
    const partition = etatParGenre(sequence, modele, r);
    assert.doesNotThrow(() => composants.appliquerEtat(partition.composants));
    assert.doesNotThrow(() => cheminements.appliquerEtat(partition));
  }
});

test('souligner un circuit ne lève pas, sur les composants comme sur les tracés', () => {
  const composants = construireComposants(modele);
  const cheminements = construireCheminements(modele);
  const partition = etatParGenre(sequence, modele, sequence.total);
  composants.appliquerEtat(partition.composants);
  cheminements.appliquerEtat(partition);
  assert.doesNotThrow(() => composants.souligner('c-demo'));
  assert.doesNotThrow(() => cheminements.souligner('c-demo'));
  assert.doesNotThrow(() => composants.souligner(null));
});

test('au dernier rang, tout composant et tout conduit est visible', () => {
  const composants = construireComposants(modele);
  const cheminements = construireCheminements(modele);
  const partition = etatParGenre(sequence, modele, sequence.total);
  composants.appliquerEtat(partition.composants);
  cheminements.appliquerEtat(partition);
  const visibles = composants.groupe.children.filter((n) => n.visible).length;
  assert.equal(visibles, modele.composants.length);
  assert.equal(cheminements.groupe.children.filter((n) => n.visible).length,
    modele.cheminements.length + modele.traversees.length);
});

test('gabarit retient le VOLUME DÉCLARÉ avant le gabarit du type', () => {
  // Contrat inversé, et il faut dire pourquoi : le catalogue primait, si bien qu'un
  // objet déclarant son propre volume se dessinait au gabarit conventionnel de son
  // type. GL-01, qui déclarait 1,12 m, sortait à 0,10 m — onze fois trop court —
  // et la fiche affichait « 1120 mm » à côté d'un objet qui en faisait 100.
  //
  // Le gabarit de type reste le repli, pour les objets sans volume déclaré. Ne pas
  // rétablir l'ordre inverse : une cote déclarée est une cote relevée.
  const propre = { type: 'boite-derivation', paroi: 'est', face: 'interieur',
    dimensions: { largeur: 0.112, hauteur: 0.112, profondeur: 0.032 } };
  const g = gabarit(propre, modele.types);
  assert.deepEqual(g.dims, [0.032, 0.112, 0.112], 'le volume déclaré, et non le gabarit du type');
});

test('gabarit retombe sur le catalogue pour un objet sans volume déclaré', () => {
  const socleDouble = modele.composants.find((c) => c.type === 'socle-double');
  const g = gabarit(socleDouble, modele.types);
  const attendu = modele.types.types.find((t) => t.id === 'socle-double').gabarit;
  assert.ok(g.dims.includes(attendu.largeur));
  assert.ok(g.dims.includes(attendu.hauteur));
});

test('gabarit retombe sur le gabarit par défaut pour un type inconnu', () => {
  const g = gabarit({ type: 'inexistant', paroi: 'est', face: 'interieur' }, modele.types);
  const d = modele.types.gabaritParDefaut;
  assert.ok(g.dims.includes(d.largeur));
});

test('le décalage sort le marqueur du bon côté du nu', () => {
  const dedans = gabarit({ type: 'socle-simple', paroi: 'est', face: 'interieur' }, modele.types);
  const dehors = gabarit({ type: 'socle-simple', paroi: 'est', face: 'exterieur' }, modele.types);
  // Sur la paroi est, l'intérieur est du côté des x décroissants.
  assert.ok(dedans.decalage[0] < 0);
  assert.ok(dehors.decalage[0] > 0);
});

test('couleurDeCircuit exige sa présentation et ne la devine pas', () => {
  assert.equal(couleurDeCircuit(modele.circuits, 'c-demo', modele.presentation), '#1f77b4');
  assert.equal(
    couleurDeCircuit(modele.circuits, null, modele.presentation),
    modele.presentation.couleurs.composantSansCircuit,
  );
});

test('un modèle privé de son catalogue de types échoue au montage, sans silence', () => {
  const casse = { ...modele, types: undefined };
  assert.throws(() => construireComposants(casse));
});

/*
 * Les cotes de tracé. Elles se dessinent avec une étiquette peinte sur un
 * canevas — la seule chose de la maquette qui touche au DOM hors de `creerVue`.
 * Un double suffit à l'exercer, et il attrape ce que `node --check` ne voit pas :
 * une classe three.js mal importée, un repère inversé, ou la règle d'affichage
 * prise à l'envers.
 */

import { construireCotes } from '../src/scene/cotes.js';
import { PRISES, ECLAIRAGE, BORNE } from './_aides.js';

/** Un canevas de papier : il mesure, il ne peint pas. */
function doublerLeDom() {
  const ancien = globalThis.document;
  globalThis.document = {
    createElement: () => ({
      width: 0,
      height: 0,
      getContext: () => ({
        font: '', fillStyle: '', strokeStyle: '', lineWidth: 0, textBaseline: '',
        measureText: (t) => ({ width: t.length * 7 }),
        fillRect() {}, strokeRect() {}, fillText() {},
      }),
    }),
  };
  return () => { globalThis.document = ancien; };
}

test('les cotes se construisent, une par objet cotable', () => {
  const rendre = doublerLeDom();
  try {
    const m = fusionner(socle, [PRISES(), ECLAIRAGE(), BORNE()]);
    const cotes = construireCotes(m);
    assert.ok(cotes.compte() > 20, `attendu plus de vingt objets cotés, obtenu ${cotes.compte()}`);
    assert.equal(cotes.groupe.name, 'cotes');
    // Rien n'est visible tant qu'aucune étape n'est jouée : une cote sans étape
    // ne répond à aucune question.
    for (const n of cotes.groupe.children) assert.equal(n.visible, false);
  } finally {
    rendre();
  }
});

test('une cote n’apparaît qu’à l’étape qui pose l’objet qu’elle cote', () => {
  const rendre = doublerLeDom();
  try {
    const m = fusionner(socle, [PRISES(), ECLAIRAGE(), BORNE()]);
    const seq = composerSequence(m);
    const cotes = construireCotes(m);

    // C'est la règle qui rend la chose lisible : affichées en permanence, les
    // cotes de vingt-deux objets feraient un quadrillage qu'on cesserait de lire.
    let vuAuMoinsUneFois = 0;
    for (let rang = 0; rang < seq.total; rang += 1) {
      const partition = etatParGenre(seq, m, rang);
      cotes.appliquerEtat(partition);
      const visibles = cotes.groupe.children.filter((n) => n.visible).length;
      const poses = ['composants', 'cheminements', 'traversees'].reduce(
        (n, genre) => n + (partition[genre].ajoutes?.length ?? 0),
        0,
      );
      assert.ok(visibles <= poses, `rang ${rang} : ${visibles} cotes pour ${poses} objets posés`);
      if (visibles > 0) vuAuMoinsUneFois += 1;
    }
    assert.ok(vuAuMoinsUneFois >= 3, 'plusieurs étapes doivent afficher des cotes');

    // Et le cas qui compte le plus : l'étape de perçage doit coter ses
    // traversées. Un trou mal placé dans 0,20 m de béton ne se rattrape pas.
    const percage = seq.etapes.findIndex((e) => e.phase === 'percage' && (e.traversees ?? []).length > 0);
    assert.ok(percage >= 0, 'une étape de perçage doit poser des traversées');
    cotes.appliquerEtat(etatParGenre(seq, m, percage + 1));
    assert.ok(
      cotes.groupe.children.some((n) => n.visible),
      'le perçage doit montrer les cotes de ses traversées',
    );
  } finally {
    rendre();
  }
});

test('la bascule coupe tout le groupe d’un geste', () => {
  const rendre = doublerLeDom();
  try {
    const cotes = construireCotes(fusionner(socle, [PRISES()]));
    cotes.basculer(false);
    assert.equal(cotes.groupe.visible, false);
    cotes.basculer(true);
    assert.equal(cotes.groupe.visible, true);
  } finally {
    rendre();
  }
});

test('la goulotte est dessinée à sa longueur réelle, 1,12 m', () => {
  // LE test qui manquait. GL-01 déclarait 0,12 × 1,12 × 0,06 et se dessinait en
  // cube de 0,10 m : onze fois trop court, avec 0,51 m de vide au-dessus du
  // tableau et autant sous le plafond. Rien ne le voyait — la fiche, la
  // validation, la contiguïté et les fournitures lisaient tous la bonne cote, et
  // le rendu était le seul consommateur à l'ignorer.
  //
  // Si ce test tombe, la maquette a recommencé à montrer autre chose que ce qui
  // est posé, et le suivi de circuit est rompu au premier mètre.
  const m = fusionner(SOCLE(), [PRISES(), ECLAIRAGE(), BORNE()]);
  const gl = m.cheminements.find((c) => c.reference === 'GL-01');
  assert.ok(gl, 'la goulotte doit exister au modèle');

  const bas = Math.min(...gl.segments.flatMap((s) => [s.de.z, s.a.z]));
  const haut = Math.max(...gl.segments.flatMap((s) => [s.de.z, s.a.z]));
  assert.ok(Math.abs(haut - bas - 1.12) < 1e-9, `le profilé mesure ${(haut - bas).toFixed(3)} m, et non 1,12`);

  const { encombrementDe } = encombrement;
  const e = encombrementDe(gl.section, m.presentation.sectionConventionnelle.rectangulaire);
  assert.equal(e.transversal, 0.12, 'largeur du profilé');
  assert.equal(e.saillie, 0.06, 'profondeur du profilé');

  // Et il joint bien le dessus du tableau au plafond, sans intervalle.
  const td = m.composants.find((c) => c.reference === 'TD-01');
  const gTd = gabarit(td, m.types);
  const dessusDuTableau = td.position.z + gTd.dims[2] / 2;
  assert.ok(Math.abs(bas - dessusDuTableau) < 1e-9, 'le bas du profilé joint le dessus du tableau');
  assert.ok(Math.abs(haut - m.local.hauteurSousPlafond) < 1e-9, 'le haut joint le plafond');
});

test('la vue initiale regarde l’angle sud-est', () => {
  // Décision du maître d'ouvrage du 2026-09-23. C'est là que tout se passe : le
  // tableau et la goulotte sur la paroi est, le boîtier double sur la paroi sud.
  // La caméra se place en cible + r·(sin φ cos θ, sin φ sin θ, cos φ) : pour que le
  // regard aille vers le sud-est, elle doit être au nord-ouest de sa cible.
  const p = modele.presentation;
  const v = p.vues.find((x) => x.id === p.vueInitiale);
  assert.ok(v, 'la vue initiale doit exister');
  const regard = { x: -Math.cos(v.theta), y: -Math.sin(v.theta) };
  assert.ok(regard.x > 0, 'le regard va vers l’est');
  assert.ok(regard.y < 0, 'et vers le sud');
  assert.ok(Math.abs(regard.x + regard.y) < 1e-6, 'à égale distance des deux, droit sur l’angle');
});
