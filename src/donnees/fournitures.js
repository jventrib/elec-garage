/**
 * La liste des fournitures, **dérivée** et non recopiée.
 *
 * Demandée le 2026-09-22 : « la liste totale des fournitures ». Chaque
 * fonctionnalité avait déjà sa nomenclature, mais trois listes tenues à la main
 * ne s'additionnent pas — et ce qui se recompte mal, ce sont précisément les
 * mètres de conduit par calibre et les mètres de conducteur par section, qui
 * dépendent du nombre de fils dans chaque tube.
 *
 * Tout ce qui se calcule est calculé ici. Ce qui ne se calcule pas — l'entraxe
 * des colliers, les références produit, les calibres normatifs — est **nommé
 * comme non établi** plutôt qu'estimé. Une liste d'achat n'est pas le bon endroit
 * pour qu'un chiffre plausible se déguise en chiffre vérifié.
 */

import { longueurCheminement } from '../geometrie/cheminement.js';
import { construireGraphe } from '../geometrie/graphe.js';
import { longueurParConducteur } from '../geometrie/conducteurs.js';

import { sectionArretee, calibreDe } from '../geometrie/section.js';

const arrondi = (v) => Math.round(v * 100) / 100;
const mm = (v) => (v === null || v === undefined ? null : Math.round(v * 1000));

/** Regroupe en préservant l'ordre de première apparition. */
function grouper(liste, cle) {
  const par = new Map();
  for (const x of liste) {
    const k = cle(x);
    if (!par.has(k)) par.set(k, []);
    par.get(k).push(x);
  }
  return par;
}

/**
 * Une JONCTION est une enveloppe de cheminement : boîte de dérivation ou organe de
 * connexion. La condition 3 de la constitution v1.13.0 veut les emplacements de
 * connexion sous capot énumérés « au même titre que les boîtes de dérivation », et
 * un relevé qui n'en compterait qu'une sorte les rendrait invisibles à l'achat.
 */
function estJonction(modele, composant) {
  return (modele.types?.types ?? []).find((t) => t.id === composant.type)?.role === 'jonction';
}

/**
 * Les conduits, par calibre. Un calibre **majorant** est compté à part : il n'a
 * pas la même valeur d'achat qu'un calibre arrêté, et les confondre ferait
 * commander un tube sur une hypothèse.
 *
 * Un calibre peut être **mixte** depuis que la ligne de la borne est arrêtée à
 * l'IRL 25 : le même tube sert le tronc partagé et une ligne entièrement dédiée.
 * Les mètres s'additionnent — c'est le même article à l'achat — mais les deux
 * natures se comptent séparément, sans quoi le relevé présenterait dix mètres de
 * ligne dédiée comme du tronc partagé.
 */
export function conduitsParCalibre(modele) {
  const lignes = [];
  for (const [cle, groupe] of grouper(modele.cheminements ?? [], (ch) => {
    const f = ch.section?.forme ?? 'circulaire';
    if (sectionArretee(ch.section)) return `arrete:${f}:${calibreDe(ch.section)}`;
    return `majorant:${f}:${calibreDe(ch.section) ?? 'inconnu'}`;
  })) {
    const [etat, forme, valeur] = cle.split(':');
    const metre = (filtre) => arrondi(groupe.filter(filtre).reduce((t, ch) => t + longueurCheminement(ch), 0));
    const plusieurs = (ch) => (ch.circuits ?? []).length > 1;
    // La FORME suit la ligne jusqu'au relevé : un profilé de 120 mm n'est pas un
    // « IRL 120 », désignation qui n'existe pas et ferait une ligne d'achat
    // absurde. C'est le contenant qu'on commande, pas un calibre abstrait.
    const cotes = groupe[0]?.section ?? {};
    lignes.push({
      calibre: valeur === 'inconnu' ? null : mm(Number(valeur)),
      forme,
      largeur: mm(cotes.largeur ?? null),
      profondeur: mm(cotes.profondeur ?? null),
      circuits: [...new Set(groupe.flatMap((ch) => ch.circuits ?? []))].length,
      // Ceux du seul tronc partagé : un calibre mixte ne partage pas entre eux les
      // circuits de ses lignes dédiées — la borne en IRL 25 ne rejoint pas le tronc.
      circuitsPartages: [...new Set(groupe.filter(plusieurs).flatMap((ch) => ch.circuits ?? []))].length,
      majore: etat === 'majorant',
      longueur: metre(() => true),
      references: groupe.map((ch) => ch.reference).sort(),
      partage: groupe.some(plusieurs),
      dedie: groupe.some((ch) => !plusieurs(ch)),
      longueurPartagee: metre(plusieurs),
      longueurDediee: metre((ch) => !plusieurs(ch)),
    });
  }
  return lignes.sort((a, b) => (b.calibre ?? 0) - (a.calibre ?? 0));
}

/**
 * Les conducteurs, par section.
 *
 * La longueur d'un circuit n'est pas celle de son tracé : un conduit qui porte
 * cinq de ses fils en consomme cinq fois sa longueur. C'est le calcul que trois
 * nomenclatures tenues séparément rendaient faux dès la première mutualisation.
 *
 * Ce n'est pas non plus `n × longueur de tracé`, et c'est la correction du
 * 2026-09-22 : `n` est le cas le plus chargé, pas ce que chaque tube porte. Le
 * 1,5 mm² était ainsi surestimé de 57 % — 80,40 m annoncés pour 51,24 m réels —
 * parce que la phase non commutée et le retour de CM-03 étaient comptés sur toute
 * la longueur du circuit alors qu'ils s'arrêtent aux commandes. Ce n'est plus de
 * la réserve, c'est une erreur de métré.
 *
 * Chaque conducteur est donc suivi sur son trajet réel, et compté une fois par
 * conduit. Un circuit dont le pilotage n'est pas déclaré retombe sur le produit
 * majorant, et la ligne le dit.
 */
export function conducteursParSection(modele) {
  const longueurs = longueurParConducteur(modele);
  const par = new Map();
  for (const circuit of modele.circuits ?? []) {
    if (typeof circuit.conducteurs !== 'number') continue;
    const metre = longueurs.get(circuit.id);
    if (!metre || metre.total === null) continue;
    // Un câble s'achète au mètre de câble, et non au mètre de conducteur : ses
    // conducteurs courent ensemble, sous la même gaine, d'un bout à l'autre.
    const cle = circuit.cable ? `cable:${circuit.cable}` : circuit.section ?? null;
    if (!par.has(cle)) par.set(cle, { section: circuit.section ?? null, cable: circuit.cable ?? null, longueur: 0, majore: false, circuits: new Set() });
    const e = par.get(cle);
    e.longueur += circuit.cable ? metre.total / circuit.conducteurs : metre.total;
    e.majore = e.majore || metre.majore;
    e.circuits.add(circuit.libelle ?? circuit.id);
  }
  return [...par.values()]
    .map((e) => ({
      section: e.section,
      cable: e.cable,
      longueur: arrondi(e.longueur),
      majore: e.majore,
      circuits: [...e.circuits].sort(),
    }))
    .sort((a, b) => (b.section ?? 0) - (a.section ?? 0));
}

/** Les boîtes de dérivation, avec ce qui les distingue à l'achat. */
export function boites(modele) {
  // Le décompte des circuits passe par le GRAPHE, et non par une comparaison de
  // coordonnées faite ici. Une première version testait la proximité à 0,20 m et
  // attribuait la ligne de la borne à BD-03, qu'elle frôle à 0,11 m sans y
  // entrer. Le graphe, lui, sait déjà ce qu'est « arriver dans une boîte » :
  // il ancre un bout de conduit sur l'enveloppe déclarée, pas sur une distance
  // choisie au jugé.
  const graphe = construireGraphe(modele);
  return (modele.composants ?? [])
    .filter((c) => estJonction(modele, c))
    .map((c) => {
      // Sur TOUS les nœuds de l'enveloppe quand la boîte en déclare une : le graphe
      // ne ramène plus les bouts de conduit au centre, et s'en tenir au nœud central
      // ne verrait plus aucun circuit.
      const noeuds = c.dimensions ? graphe.noeudsDansBoite(c) : [graphe.noeudAu(c.position)];
      const circuits = new Set();
      for (const n of noeuds) for (const a of n?.aretes ?? []) for (const id of a.circuits ?? []) circuits.add(id);
      return {
        reference: c.reference,
        cote: c.dimensions ? mm(c.dimensions.largeur) : null,
        entrees: c.entrees ?? null,
        circuits: circuits.size,
      };
    })
    .sort((a, b) => a.reference.localeCompare(b.reference));
}

/** L'appareillage, par type déclaré au catalogue du socle. */
export function appareillage(modele) {
  const libelle = (id) => (modele.types?.types ?? []).find((t) => t.id === id)?.libelle ?? id;
  const lignes = [];
  for (const [type, groupe] of grouper(
    (modele.composants ?? []).filter((c) => !estJonction(modele, c)),
    (c) => c.type,
  )) {
    lignes.push({
      type,
      libelle: libelle(type),
      nombre: groupe.length,
      references: groupe.map((c) => c.reference).sort(),
      indicesInconnus: groupe.filter((c) => c.indiceProtection === null || c.indiceProtection === undefined).length,
      exterieurs: groupe.filter((c) => c.face === 'exterieur').length,
    });
  }
  return lignes.sort((a, b) => b.nombre - a.nombre || a.libelle.localeCompare(b.libelle));
}

/** Les changements de direction, qui se traitent par accessoire. */
export function coudes(modele) {
  let n = 0;
  const detail = [];
  for (const ch of modele.cheminements ?? []) {
    const segs = ch.segments ?? [];
    let pour = 0;
    for (let i = 1; i < segs.length; i += 1) {
      const dir = (s) => ['x', 'y', 'z'].map((a) => Math.sign(Math.round((s.a[a] - s.de[a]) * 1e6))).join(',');
      if (dir(segs[i]) !== dir(segs[i - 1])) pour += 1;
    }
    if (pour > 0) detail.push({ reference: ch.reference, nombre: pour });
    n += pour;
  }
  return { total: n, detail };
}

/** Le relevé complet, prêt à être rendu. */
export function fournitures(modele) {
  return {
    conduits: conduitsParCalibre(modele),
    conducteurs: conducteursParSection(modele),
    boites: boites(modele),
    appareillage: appareillage(modele),
    traversees: {
      nombre: (modele.traversees ?? []).length,
      epaisseur: modele.local?.epaisseurParois ?? null,
      references: (modele.traversees ?? []).map((t) => t.reference).sort(),
    },
    coudes: coudes(modele),
    circuits: (modele.circuits ?? []).map((c) => ({
      libelle: c.libelle,
      section: c.section,
      calibre: c.calibreProtection,
      typeDifferentiel: c.typeDifferentiel,
      sensibilite: c.sensibiliteDifferentielle,
      conducteurs: c.conducteurs ?? null,
    })),
  };
}
