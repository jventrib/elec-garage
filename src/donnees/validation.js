/**
 * Contrôles de cohérence (FR-026). Tant qu'un seul échoue, la séquence n'est pas
 * présentée comme utilisable au chantier (FR-027).
 *
 * Les contrôles structurels sont écrits à la main, en miroir des schémas de
 * dossier/001-visualisation-3d/contracts/, pour ne pas introduire de dépendance.
 * Toute évolution d'un schéma doit être répercutée ici.
 */

import { phases, naturesEtape, verifications, verificationsExigees, rangPhase, libelleDe } from '../sequence/phases.js';
import { segmentBaie, sortieDeTraversee, entreeDeTraversee } from './chargement.js';
import {
  estOrthogonal,
  appuiSurFace,
  extremites,
  croiseBaie,
  memePoint,
  plusProchesPoints,
  partagentUneExtremite,
  recouvrementParallele,
} from '../geometrie/cheminement.js';
import { enveloppeDeBoite, boiteCouvrant, pointDansBoite } from '../geometrie/enveloppe.js';
import { FORMES, COTES_DE_FORME, calibreDe, sectionArretee } from '../geometrie/section.js';

const RACCORDEMENTS = ['extremites', 'lateral'];
import { construireGraphe, atteignablesDepuisTableau } from '../geometrie/graphe.js';
import { pointSurProfile } from '../geometrie/cheminement.js';

/**
 * Rôle d'un type, lu au catalogue. Le code ne porte aucune liste de types :
 * `appareillage` enveloppe ses propres connexions, `jonction` est une enveloppe
 * de cheminement et compte ses entrées, `accessoire` n'en reçoit aucune.
 */
/** Gabarit d'un type, lu au catalogue — repli quand l'objet n'a pas de volume. */
function gabaritDeType(modele, idType) {
  return (modele.types?.types ?? []).find((t) => t.id === idType)?.gabarit ?? modele.types?.gabaritParDefaut;
}

/**
 * Les deux paramètres PRODUIT du perçage : l'entraxe des colliers et la cheville.
 *
 * Le projet a toujours refusé d'arrêter l'entraxe — « l'entraxe est une donnée du
 * fabricant, pas une cote de projet ». Ce module ne revient pas là-dessus : il lui
 * donne un emplacement au lieu d'un vide, et rend explicite ce qui devient inconnu
 * quand il manque.
 *
 * L'entraxe admet une surcharge par forme de section : un IRL 20 et un profilé de
 * 120 × 60 n'appellent pas le même espacement.
 */
export function entraxeDe(socle, cheminement = null) {
  const f = socle?.chantier?.fixations;
  if (!f) return null;
  const forme = cheminement?.section?.forme;
  const parSection = forme ? f.entraxeParSection?.[forme] : undefined;
  const v = parSection ?? f.entraxe;
  return typeof v === 'number' && v > 0 ? v : null;
}

/** La cheville retenue : diamètre et profondeur de perçage, ou null. */
export function chevilleDe(socle) {
  const c = socle?.chantier?.fixations?.cheville;
  if (!c) return null;
  const ok = (v) => (typeof v === 'number' && v > 0 ? v : null);
  const d = ok(c.diametre);
  const p = ok(c.profondeur);
  return d === null && p === null ? null : { diametre: d, profondeur: p };
}

export function roleDeType(socle, idType) {
  return (socle?.types?.types ?? []).find((t) => t.id === idType)?.role ?? null;
}

const PAROIS = ['sud', 'nord', 'est', 'ouest'];
const PAROIS_COMPOSANT = [...PAROIS, 'plafond'];
const FACES = ['interieur', 'exterieur'];
const COMMUTATIONS = ['retour-commande', 'sur-place', 'entree-module'];
const CLES_RELEVE = ['oeuvre', 'epaisseurParois', 'hauteurSousPlafond', 'repere', 'baies', 'obstacles'];

// Le rangement n'est pas un composant : il n'est ni branché, ni percé, ni séquencé.
// Les trois vocabulaires ci-dessous ne sont pas des variantes de ceux des
// composants — ce sont les trois questions que la constitution oblige à poser sur
// toute cote affichée : qui l'a dit, et dans quel état elle se trouve.
const ORIGINES_COTE = ['releve', 'declaration-fabricant', 'gabarit-catalogue'];
const ETATS_COTE = ['releve', 'inconnu', 'contradictoire'];
/** Parois auxquelles un rangement peut s'accrocher : jamais au plafond. */
const PAROIS_RANGEMENT = PAROIS;

const defaut = (regle, cible, message) => ({ regle, cible, message });

/** Un volume est une boîte alignée sur les axes, bien ordonnée. */
function defautsDeVolume(volume, cible, champ) {
  const d = [];
  for (const borne of ['min', 'max']) {
    if (!volume[borne] || typeof volume[borne] !== 'object') {
      d.push(defaut('STRUCT', cible, `${champ}.${borne} absent.`));
      return d;
    }
  }
  for (const axe of ['x', 'y', 'z']) {
    for (const borne of ['min', 'max'])
      if (typeof volume[borne][axe] !== 'number' || !Number.isFinite(volume[borne][axe]))
        d.push(defaut('STRUCT', cible, `${champ}.${borne}.${axe} doit être un nombre.`));
    if (volume.min[axe] > volume.max[axe])
      d.push(defaut('STRUCT', cible, `${champ} : min.${axe} dépasse max.${axe}.`));
  }
  return d;
}

const estTexte = (v) => typeof v === 'string' && v.length > 0;
const estNombre = (v) => typeof v === 'number' && Number.isFinite(v);
const estNombreOuNul = (v) => v === null || estNombre(v);
const estTexteOuNul = (v) => v === null || estTexte(v);

/* ------------------------------------------------------------------ */
/* Contrôles structurels                                               */
/* ------------------------------------------------------------------ */

export function validerLocal(local) {
  const d = [];
  if (!local || typeof local !== 'object') return [defaut('STRUCT', 'local', 'Relevé absent.')];
  if (!local.oeuvre || !estNombre(local.oeuvre.x) || !estNombre(local.oeuvre.y))
    d.push(defaut('STRUCT', 'local.oeuvre', 'oeuvre.x et oeuvre.y doivent être des nombres.'));
  if (!estNombre(local.hauteurSousPlafond) || local.hauteurSousPlafond <= 0)
    d.push(defaut('STRUCT', 'local.hauteurSousPlafond', 'Hauteur sous plafond absente ou non positive.'));
  if (!estNombre(local.epaisseurParois) || local.epaisseurParois <= 0)
    d.push(defaut('STRUCT', 'local.epaisseurParois', 'Épaisseur des parois absente ou non positive.'));
  if (!local.repere || local.repere.origine !== 'angle-sud-ouest-interieur-sol-fini')
    d.push(defaut('STRUCT', 'local.repere', "Le repère doit être celui fixé par la constitution."));
  if (!local.provenance || !('schemaUnifilaire' in local.provenance) || !('noteDeCalcul' in local.provenance))
    d.push(defaut('STRUCT', 'local.provenance', 'Le bloc provenance est obligatoire (FR-009).'));

  const ids = new Set();
  for (const b of local.baies ?? []) {
    if (!estTexte(b.id)) d.push(defaut('STRUCT', 'baie', 'Baie sans identifiant.'));
    if (ids.has(b.id)) d.push(defaut('STRUCT', b.id, 'Identifiant de baie en double.'));
    ids.add(b.id);
    if (!PAROIS.includes(b.paroi)) d.push(defaut('STRUCT', b.id, `Paroi inconnue : ${b.paroi}.`));
    if (!estNombre(b.debut) || b.debut < 0) d.push(defaut('STRUCT', b.id, 'debut absent ou négatif.'));
    if (!estNombre(b.largeur) || b.largeur <= 0) d.push(defaut('STRUCT', b.id, 'largeur absente ou non positive.'));
    if (!estNombreOuNul(b.hauteur)) d.push(defaut('STRUCT', b.id, 'hauteur doit être un nombre ou null.'));
    if (!estNombre(b.allege) || b.allege < 0)
      d.push(defaut('STRUCT', b.id, "allege doit être un nombre positif ou nul — 0 pour une porte."));
    if (estNombre(b.allege) && estNombre(b.hauteur) && estNombre(local.hauteurSousPlafond)) {
      const haut = b.allege + b.hauteur;
      if (haut > local.hauteurSousPlafond + 1e-6)
        d.push(defaut('STRUCT', b.id, `La baie monte à ${haut} m, au-delà de la hauteur sous plafond.`));
    }
    if (typeof b.incertain !== 'boolean') d.push(defaut('STRUCT', b.id, 'incertain doit être un booléen.'));
    if (estNombre(b.debut) && estNombre(b.largeur) && local.oeuvre && segmentBaie(local, b).deborde)
      d.push(defaut('STRUCT', b.id, 'La baie déborde de sa paroi.'));
  }
  for (const o of local.obstacles ?? []) {
    if (!estTexte(o.id)) d.push(defaut('STRUCT', 'obstacle', 'Obstacle sans identifiant.'));
    // Le rattachement à une baie est facultatif : un obstacle sans baie décrit un
    // volume libre du local, comme le gabarit de manœuvre du véhicule.
    if (o.baie !== undefined && !ids.has(o.baie))
      d.push(defaut('STRUCT', o.id, `L'obstacle vise la baie « ${o.baie} », inconnue.`));
    if (!['ouvert', 'ferme'].includes(o.etat)) d.push(defaut('STRUCT', o.id, `État inconnu : ${o.etat}.`));
    if (typeof o.incertain !== 'boolean') d.push(defaut('STRUCT', o.id, 'incertain doit être un booléen.'));
    // Le libellé est ce qu'un humain lit dans le panneau d'incertitudes. Sans lui,
    // l'interface retomberait sur l'identifiant machine, et un installateur
    // lirait « debattement-portieres » au lieu de « Débattement des portières ».
    if (!estTexte(o.libelle))
      d.push(defaut('STRUCT', o.id, 'libelle absent : un obstacle doit porter une désignation lisible.'));
    if (o.volume) d.push(...defautsDeVolume(o.volume, o.id, 'volume'));
    if (o.volumeMajorant) d.push(...defautsDeVolume(o.volumeMajorant, o.id, 'volumeMajorant'));
    // Les deux champs disent deux choses différentes, et ne se cumulent pas :
    // un encombrement est relevé, ou il est seulement borné.
    if (o.volume && o.volumeMajorant)
      d.push(defaut('STRUCT', o.id, 'volume et volumeMajorant sont exclusifs : un encombrement est relevé, ou seulement borné.'));
    // Un majorant n'est pas un relevé. Le déclarer certain ferait passer une borne
    // pour une mesure, et le verdict « conforme » cesserait d'être démontré.
    if (o.volumeMajorant && !estTexte(o.raisonMajorant))
      d.push(defaut('STRUCT', o.id, 'raisonMajorant absent : un majorant doit dire ce qui le borne.'));
    if (o.raisonMajorant !== undefined && !o.volumeMajorant)
      d.push(defaut('STRUCT', o.id, 'raisonMajorant sans volumeMajorant : il ne borne rien.'));
    if (o.volumeMajorant && o.incertain !== true)
      d.push(defaut('STRUCT', o.id, "Un obstacle porteur d'un volumeMajorant doit rester incertain : la borne n'est pas une mesure."));
  }
  return d;
}

export function validerApport(apport, socle) {
  const d = [];
  const chantier = socle.chantier;
  const typesConnus = socle.types.types.map((t) => t.id);
  if (!apport || typeof apport !== 'object') return [defaut('STRUCT', 'apport', 'Apport absent.')];
  if (!/^[0-9]{3}-[a-z0-9-]+$/.test(apport.fonctionnalite ?? ''))
    d.push(defaut('STRUCT', 'fonctionnalite', `Nom de fonctionnalité invalide : ${apport.fonctionnalite}.`));
  if (!apport.provenance) d.push(defaut('STRUCT', 'provenance', 'Le bloc provenance est obligatoire (FR-009).'));

  for (const c of apport.circuits ?? []) {
    const ou = c.id ?? '(sans id)';
    // Le nombre de conducteurs qu'un circuit met dans un tube. Facultatif, mais
    // dès qu'il est là il doit être un entier positif : c'est lui qui donne la
    // condition de remplissage lue sur la fiche d'un conduit, et un décompte
    // faux y produirait une condition fausse d'apparence exacte.
    if (c.conducteurs !== undefined && c.conducteurs !== null) {
      if (!Number.isInteger(c.conducteurs) || c.conducteurs < 1)
        d.push(defaut('STRUCT', ou, 'conducteurs doit être un entier au moins égal à 1.'));
      if (!estTexteOuNul(c.detailConducteurs ?? null))
        d.push(defaut('STRUCT', ou, 'detailConducteurs doit être un texte ou null.'));
    } else if (c.detailConducteurs !== undefined && c.detailConducteurs !== null) {
      d.push(defaut('STRUCT', ou, 'detailConducteurs est déclaré sans conducteurs : un détail sans décompte ne se vérifie pas.'));
    }
    // Un circuit tiré en CÂBLE le déclare par sa désignation : ses conducteurs sont
    // sous une même gaine, et un tube le reçoit comme un seul objet. Facultatif ; s'il
    // est là, c'est un texte, et le décompte des conducteurs reste exigé.
    if (c.cable !== undefined && c.cable !== null) {
      if (!estTexteOuNul(c.cable) || c.cable === '') d.push(defaut('STRUCT', ou, 'cable doit être une désignation de câble ou null.'));
      if (typeof c.conducteurs !== 'number') d.push(defaut('STRUCT', ou, 'cable est déclaré sans conducteurs : un câble compte ses conducteurs.'));
    }
  }

  for (const c of apport.composants ?? []) {
    const ou = c.id ?? '(sans id)';
    if (!estTexte(c.id)) d.push(defaut('STRUCT', ou, 'Composant sans identifiant.'));
    if (!estTexte(c.reference)) d.push(defaut('STRUCT', ou, 'Composant sans référence.'));
    if (!estTexte(c.type)) d.push(defaut('STRUCT', ou, 'Composant sans type.'));
    else if (!typesConnus.includes(c.type))
      d.push(defaut('STRUCT', ou, `Type « ${c.type} » absent du catalogue data/types-composants.json.`));
    if (!PAROIS_COMPOSANT.includes(c.paroi)) d.push(defaut('STRUCT', ou, `Paroi inconnue : ${c.paroi}.`));
    if (!FACES.includes(c.face)) d.push(defaut('STRUCT', ou, `Face inconnue : ${c.face}.`));
    if (!c.position || !estNombre(c.position.x) || !estNombre(c.position.y) || !estNombre(c.position.z))
      d.push(defaut('STRUCT', ou, 'Position incomplète.'));
    if (!estNombreOuNul(c.hauteurAxe)) d.push(defaut('STRUCT', ou, 'hauteurAxe doit être un nombre ou null.'));
    if (!estTexteOuNul(c.indiceProtection)) d.push(defaut('STRUCT', ou, 'indiceProtection doit être un texte ou null.'));
    // Volume et nombre d'entrées d'une boîte : facultatifs, mais INSÉPARABLES.
    // Un volume déclaré sans son décompte d'entrées serait une exemption sans
    // contrepartie, et c'est justement ce que V21 est là pour empêcher.
    const aVolume = c.dimensions !== undefined && c.dimensions !== null;
    const aEntrees = c.entrees !== undefined && c.entrees !== null;
    if (aVolume || aEntrees) {
      // Le rôle vient du catalogue, jamais d'une liste de types écrite ici.
      // Seule une JONCTION — boîte de dérivation ou organe de connexion — est une
      // enveloppe de cheminement : elle seule compte des entrées. Un appareillage
      // enveloppe ses propres connexions sans en compter, et un accessoire n'en
      // reçoit aucune.
      if (roleDeType(socle, c.type) !== 'jonction')
        d.push(defaut('STRUCT', ou, 'dimensions et entrees ne se déclarent que sur une jonction — boîte de dérivation ou organe de connexion.'));
      if (!aVolume) d.push(defaut('STRUCT', ou, 'entrees est déclaré sans dimensions : un décompte sans volume ne prouve rien.'));
      if (!aEntrees) d.push(defaut('STRUCT', ou, 'dimensions est déclaré sans entrees : un volume sans décompte est une exemption sans contrepartie.'));
      if (aVolume) {
        for (const cote of ['largeur', 'hauteur', 'profondeur']) {
          if (typeof c.dimensions?.[cote] !== 'number' || !(c.dimensions[cote] > 0))
            d.push(defaut('STRUCT', ou, `dimensions.${cote} doit être un nombre strictement positif.`));
        }
      }
      if (aEntrees && (!Number.isInteger(c.entrees) || c.entrees < 1))
        d.push(defaut('STRUCT', ou, 'entrees doit être un entier au moins égal à 1.'));
    }
    if (!estTexteOuNul(c.circuit)) d.push(defaut('STRUCT', ou, 'circuit doit être un texte ou null.'));
    // La contiguïté : une liste non vide d'identifiants. Le fait qu'ils existent
    // et que la géométrie les soutienne est l'objet de V22.
    if (c.contigu !== undefined && c.contigu !== null) {
      if (!Array.isArray(c.contigu) || c.contigu.length === 0 || !c.contigu.every(estTexte))
        d.push(defaut('STRUCT', ou, 'contigu doit être une liste non vide d’identifiants de composants.'));
      else if (c.contigu.includes(c.id))
        d.push(defaut('STRUCT', ou, 'contigu ne peut pas désigner le composant lui-même.'));
    }
  }

  // Le rangement (006). Il ne touche à aucun calcul électrique : ce qui suit ne
  // contrôle que ce qui sera *affiché*, parce qu'une cote fausse affichée comme
  // juste est le seul défaut que ce genre puisse introduire.
  for (const r of apport.rangements ?? []) {
    const ou = r.id ?? '(sans id)';
    if (!estTexte(r.id)) d.push(defaut('STRUCT', ou, 'Rangement sans identifiant.'));
    if (!estTexte(r.libelle)) d.push(defaut('STRUCT', ou, 'Rangement sans libellé.'));
    if (!PAROIS_RANGEMENT.includes(r.paroi)) d.push(defaut('STRUCT', ou, `Paroi inconnue : ${r.paroi}.`));
    if (!FACES.includes(r.face)) d.push(defaut('STRUCT', ou, `Face inconnue : ${r.face}.`));

    for (const [nom, c] of Object.entries(r.cotes ?? {})) {
      if (!c || typeof c !== 'object') {
        d.push(defaut('STRUCT', ou, `cotes.${nom} doit être un objet { valeur, origine, etat, reserves }.`));
        continue;
      }
      // Une cote « inconnue » n'a pas d'origine : c'est sa définition. La valider
      // quand même rendrait impossible d'exprimer la seule chose que cet état dit.
      if (c.etat !== 'inconnu' && !ORIGINES_COTE.includes(c.origine))
        d.push(defaut('STRUCT', ou, `cotes.${nom}.origine inconnue : ${c.origine}.`));
      if (!ETATS_COTE.includes(c.etat))
        d.push(defaut('STRUCT', ou, `cotes.${nom}.etat hors des trois valeurs : ${c.etat}.`));
      if (!Array.isArray(c.reserves))
        d.push(defaut('STRUCT', ou, `cotes.${nom}.reserves doit être une liste.`));
      // Les trois états ne sont pas trois graduations d'un même doute : chacun
      // implique ce que les deux autres excluent. Une cote « inconnue » qui
      // porterait une valeur s'affiche comme mesurée ; une cote « contradictoire »
      // sans réserve n'est plus une contradiction, c'est une affirmation.
      if (c.etat === 'inconnu' && c.valeur !== null)
        d.push(defaut('STRUCT', ou, `cotes.${nom} est « inconnue » mais porte une valeur : ${c.valeur}.`));
      if (c.etat === 'inconnu' && c.origine !== null)
        d.push(defaut('STRUCT', ou, `cotes.${nom} est « inconnue » mais déclare une origine : ${c.origine}.`));
      if (c.etat !== 'inconnu' && !estNombreOuNul(c.valeur))
        d.push(defaut('STRUCT', ou, `cotes.${nom}.valeur doit être un nombre pour un état « ${c.etat} ».`));
      if (c.etat === 'releve' && (c.reserves?.length ?? 0) > 0)
        d.push(defaut('STRUCT', ou, `cotes.${nom} est « relevée » mais porte des réserves.`));
      if (c.etat === 'contradictoire' && (c.reserves?.length ?? 0) === 0)
        d.push(defaut('STRUCT', ou, `cotes.${nom} est « contradictoire » sans réserve : il faut en nommer les deux termes.`));
    }

    // Le volume dessiné vient TOUJOURS du gabarit, jamais des cotes : c'est ce qui
    // permet de dessiner un élément dont la déclaration est contradictoire sans
    // jamais trancher à sa place.
    const g = r.gabarit;
    if (!g || typeof g !== 'object') {
      d.push(defaut('STRUCT', ou, 'Rangement sans gabarit : le volume dessiné ne peut pas venir des cotes.'));
    } else {
      if (!ORIGINES_COTE.includes(g.origine))
        d.push(defaut('STRUCT', ou, `gabarit.origine inconnue : ${g.origine}.`));
      if (!estTexte(g.mention))
        d.push(defaut('STRUCT', ou, 'gabarit.mention doit dire que le volume est conventionnel.'));
      if (!g.volume || typeof g.volume !== 'object')
        d.push(defaut('STRUCT', ou, 'gabarit.volume doit être une boîte alignée sur les axes, bien ordonnée.'));
      else d.push(...defautsDeVolume(g.volume, ou, 'gabarit.volume'));
    }
  }

  // Le pilotage : quelle commande agit sur quel point, et par quelle topologie.
  //
  // C'est la donnée qui manquait au socle pour dériver le trajet réel d'un
  // conducteur — elle ne vivait que dans la prose de FR-038. Les deux champs sont
  // facultatifs et INSÉPARABLES, comme l'ont été `dimensions` et `entrees` :
  // `pilote` sans `commutation` ne dit pas si la phase descend à la commande ou
  // si elle va au point, et les deux topologies sont inverses l'une de l'autre.
  const parId = new Map((apport.composants ?? []).map((c) => [c.id, c]));
  const pilotesVus = new Map();
  for (const c of apport.composants ?? []) {
    const ou = c.id ?? '(sans id)';
    const aPilote = c.pilote !== undefined && c.pilote !== null;
    const aCommutation = c.commutation !== undefined && c.commutation !== null;
    const aModule = c.module !== undefined && c.module !== null;
    if (!aPilote && !aCommutation && !aModule) continue;
    if (c.type !== 'commande') {
      d.push(defaut('STRUCT', ou, 'pilote, commutation et module ne se déclarent que sur une commande.'));
      continue;
    }
    // Une commande sur module nomme le module qui reçoit son ordre. Son `pilote`
    // devient facultatif : le bouton de porte commande un moteur qui n'est pas un
    // point de l'installation. L'existence du module se vérifie sur le modèle
    // fusionné — CM-01 est déclarée par l'éclairage, son module par l'automatisation.
    const surModule = c.commutation === 'entree-module';
    if (surModule && !estTexte(c.module))
      d.push(defaut('STRUCT', ou, 'une commande sur module doit nommer son module : sans lui, l’ordre ne va nulle part.'));
    if (aModule && !surModule)
      d.push(defaut('STRUCT', ou, 'module ne se déclare qu’avec la commutation « entree-module ».'));
    if (!aPilote && !surModule)
      d.push(defaut('STRUCT', ou, 'commutation est déclarée sans pilote : une topologie sans point piloté ne se vérifie pas.'));
    if (!aCommutation)
      d.push(defaut('STRUCT', ou, 'pilote est déclaré sans commutation : rien ne dit alors où passe la phase.'));
    if (aCommutation && !COMMUTATIONS.includes(c.commutation))
      d.push(defaut('STRUCT', ou, `Commutation inconnue : ${c.commutation}. Attendu ${COMMUTATIONS.join(' ou ')}.`));
    if (!aPilote) continue;
    if (!Array.isArray(c.pilote) || c.pilote.length === 0 || !c.pilote.every(estTexte)) {
      d.push(defaut('STRUCT', ou, 'pilote doit être une liste non vide d’identifiants de composants.'));
      continue;
    }
    for (const id of c.pilote) {
      const cible = parId.get(id);
      // Un point piloté est du MÊME circuit : une commande ne franchit pas la
      // protection d'un autre circuit, et un pilotage qui prétendrait le contraire
      // ferait dériver des conducteurs là où il n'en passe aucun.
      if (!cible) {
        d.push(defaut('STRUCT', ou, `« ${id} » est piloté par ${c.reference ?? ou} mais n'existe pas dans cet apport.`));
        continue;
      }
      if (cible.circuit !== c.circuit)
        d.push(defaut('STRUCT', ou, `« ${id} » est piloté par ${c.reference ?? ou} mais n'est pas du même circuit.`));
      if (cible.type === 'commande')
        d.push(defaut('STRUCT', ou, `« ${id} » est une commande : une commande ne se pilote pas.`));
      // Deux commandes sur un même point seraient un va-et-vient, que ce modèle
      // ne sait pas décrire — et qui produirait deux retours pour un seul fil.
      // Sauf si elles adressent le MÊME module : chacune a alors sa propre paire
      // d'ordre, aucun retour n'est partagé, et c'est FR-009 — deux points de
      // commande équivalents.
      const vu = pilotesVus.get(id);
      if (vu && !(surModule && vu.module === c.module))
        d.push(defaut('STRUCT', ou, `« ${id} » est piloté deux fois : par ${vu.reference} et par ${c.reference ?? ou}.`));
      else if (!vu) pilotesVus.set(id, { reference: c.reference ?? ou, module: surModule ? c.module : null });
    }
  }
  for (const e of apport.etapes ?? []) {
    const ou = e.id ?? '(sans id)';
    if (!estTexte(e.id)) d.push(defaut('STRUCT', ou, 'Étape sans identifiant.'));
    if (!phases(chantier).includes(e.phase)) d.push(defaut('STRUCT', ou, `Phase inconnue : ${e.phase}.`));
    if (!naturesEtape(chantier).includes(e.nature)) d.push(defaut('STRUCT', ou, `Nature inconnue : ${e.nature}.`));
    if (typeof e.sousTension !== 'boolean') d.push(defaut('STRUCT', ou, 'sousTension doit être un booléen.'));
    if (!Array.isArray(e.composants)) d.push(defaut('STRUCT', ou, 'composants doit être une liste.'));
    if (!Array.isArray(e.cheminements)) d.push(defaut('STRUCT', ou, 'cheminements doit être une liste.'));
    if (!Array.isArray(e.traversees)) d.push(defaut('STRUCT', ou, 'traversees doit être une liste.'));
    // `fixations` : les objets dont l'étape fait percer les chevilles. DISTINCT de
    // `composants` et `cheminements`, qui signifient POSER — les y mettre ferait
    // apparaître socles et conduits en place pendant qu'on perce, ce que le
    // registre visuel interdit.
    if (e.fixations !== undefined && !Array.isArray(e.fixations))
      d.push(defaut('STRUCT', ou, 'fixations doit être une liste d’identifiants.'));
    if (!Array.isArray(e.materiel)) d.push(defaut('STRUCT', ou, 'materiel doit être une liste.'));
    if (!Array.isArray(e.dependances)) d.push(defaut('STRUCT', ou, 'dependances doit être une liste.'));
    if (e.nature === 'verification') {
      if (!estTexte(e.verification))
        d.push(defaut('STRUCT', ou, "Une étape de vérification doit déclarer laquelle elle réalise."));
      else if (!verifications(chantier).includes(e.verification))
        d.push(defaut('STRUCT', ou, `Vérification « ${e.verification} » absente du catalogue.`));
    }
  }

  for (const ch of apport.cheminements ?? []) {
    const ou = ch.id ?? '(sans id)';
    if (!estTexte(ch.id)) d.push(defaut('STRUCT', ou, 'Cheminement sans identifiant.'));
    if (!estTexte(ch.reference)) d.push(defaut('STRUCT', ou, 'Cheminement sans référence.'));
    if (!Array.isArray(ch.circuits) || ch.circuits.length === 0)
      d.push(defaut('STRUCT', ou, 'Un cheminement doit déclarer au moins un circuit porté.'));
    // La SECTION, discriminée par sa forme. Un cheminement n'est plus forcément
    // un tube : depuis la constitution v1.13.0 une goulotte peut tenir lieu de
    // conduit, et sa section rectangulaire ne se ramène pas à un diamètre.
    const sec = ch.section;
    if (!sec || typeof sec !== 'object') {
      d.push(defaut('STRUCT', ou, 'section absente : un cheminement doit déclarer sa forme et ses cotes.'));
    } else if (!FORMES.includes(sec.forme)) {
      d.push(defaut('STRUCT', ou, `section.forme inconnue : ${sec.forme}. Formes admises : ${FORMES.join(', ')}.`));
    } else {
      const cotes = COTES_DE_FORME[sec.forme];
      for (const cote of cotes) {
        if (!estNombreOuNul(sec[cote]))
          d.push(defaut('STRUCT', ou, `section.${cote} doit être un nombre ou null.`));
      }
      for (const cote of Object.keys(sec)) {
        if (cote !== 'forme' && cote !== 'majorant' && !cotes.includes(cote))
          d.push(defaut('STRUCT', ou, `section.${cote} n’appartient pas à la forme « ${sec.forme} ».`));
      }
      // Une cote encore indécise peut être BORNÉE. Le majorant se déclare dans une
      // forme distincte d'un relevé, comme le Principe VI l'exige : on ne le
      // présente pas comme une cote établie, et il n'autorise qu'un sens de
      // conclusion — vérifier le tracé au plus gros calibre admissible le valide
      // a fortiori pour tout calibre inférieur.
      if (sec.majorant !== undefined && sec.majorant !== null) {
        if (typeof sec.majorant !== 'object') {
          d.push(defaut('STRUCT', ou, 'section.majorant doit être un objet portant les cotes de la forme.'));
        } else {
          for (const cote of cotes) {
            if (!estNombre(sec.majorant[cote]) || !(sec.majorant[cote] > 0))
              d.push(defaut('STRUCT', ou, `section.majorant.${cote} doit être un nombre strictement positif.`));
            if (sec[cote] !== null && sec[cote] !== undefined)
              d.push(defaut('STRUCT', ou, `section.${cote} et son majorant sont exclusifs : une cote arrêtée n’a pas de majorant.`));
          }
        }
      }
    }
    // Le MODE DE RACCORDEMENT. Un conduit se raccorde par ses bouts ; une
    // goulotte à capot démontable se raccorde par ses côtés, sur toute sa
    // longueur. C'est ce qui décide si une extrémité libre est un défaut.
    if (ch.raccordement !== undefined && !RACCORDEMENTS.includes(ch.raccordement))
      d.push(defaut('STRUCT', ou, `raccordement inconnu : ${ch.raccordement}. Admis : ${RACCORDEMENTS.join(', ')}.`));
    // La contiguïté d'un cheminement : son extrémité joint une enceinte sans
    // conduit intermédiaire. Déclarée, jamais déduite de la proximité — même
    // discipline que celle des composants.
    if (ch.contigu !== undefined && ch.contigu !== null) {
      if (!Array.isArray(ch.contigu) || ch.contigu.length === 0 || !ch.contigu.every(estTexte))
        d.push(defaut('STRUCT', ou, 'contigu doit être une liste non vide d’identifiants de composants.'));
    }
    if (!Array.isArray(ch.segments) || ch.segments.length === 0) {
      d.push(defaut('STRUCT', ou, 'Un cheminement doit comporter au moins un segment.'));
      continue;
    }
    for (const [i, seg] of ch.segments.entries()) {
      if (!PAROIS_COMPOSANT.includes(seg.face))
        d.push(defaut('STRUCT', ou, `Segment ${i + 1} : face inconnue « ${seg.face} ».`));
      for (const bout of ['de', 'a']) {
        const pt = seg[bout];
        if (!pt || !estNombre(pt.x) || !estNombre(pt.y) || !estNombre(pt.z))
          d.push(defaut('STRUCT', ou, `Segment ${i + 1} : extrémité « ${bout} » incomplète.`));
      }
    }
  }

  for (const t of apport.traversees ?? []) {
    const ou = t.id ?? '(sans id)';
    if (!estTexte(t.id)) d.push(defaut('STRUCT', ou, 'Traversée sans identifiant.'));
    if (!estTexte(t.reference)) d.push(defaut('STRUCT', ou, 'Traversée sans référence.'));
    if (!PAROIS.includes(t.paroi)) d.push(defaut('STRUCT', ou, `Paroi inconnue : ${t.paroi}.`));
    if (!t.position || !estNombre(t.position.x) || !estNombre(t.position.y) || !estNombre(t.position.z))
      d.push(defaut('STRUCT', ou, 'Position de traversée incomplète.'));
    if (!['interieur-vers-exterieur', 'exterieur-vers-interieur'].includes(t.sens))
      d.push(defaut('STRUCT', ou, `Sens inconnu : ${t.sens}.`));
    if (typeof t.penteVersExterieur !== 'boolean')
      d.push(defaut('STRUCT', ou, 'penteVersExterieur doit être un booléen.'));
    // Le DÉNIVELÉ : une cote, pas un sens. `position` est l'axe du perçage ;
    // l'entrée et la sortie l'encadrent d'un demi-dénivelé chacune.
    if (t.denivele === undefined)
      d.push(defaut('STRUCT', ou, 'denivele absent : une traversée doit porter sa cote de perçage, fût-elle inconnue.'));
    else if (t.denivele !== null && (!estNombre(t.denivele) || t.denivele < 0))
      d.push(defaut('STRUCT', ou, 'denivele doit être un nombre positif ou null.'));
  }

  // V12 — aucune cote du relevé ne doit réapparaître dans un apport.
  const cherche = (valeur, chemin = '') => {
    if (!valeur || typeof valeur !== 'object') return;
    for (const [cle, sous] of Object.entries(valeur)) {
      if (CLES_RELEVE.includes(cle))
        d.push(defaut('V12', `${chemin}${cle}`, `« ${cle} » appartient au relevé et ne doit pas figurer dans un apport.`));
      cherche(sous, `${chemin}${cle}.`);
    }
  };
  cherche(apport);
  return d;
}

/* ------------------------------------------------------------------ */
/* Contrôles de cohérence V1 à V12                                     */
/* ------------------------------------------------------------------ */

export function validerModele(modele, sequence) {
  const d = [];
  const etapes = sequence.etapes;
  const composantsParId = new Map(modele.composants.map((c) => [c.id, c]));

  // V1 — instruction non vide
  for (const e of etapes) {
    if (!estTexte(e.instruction)) d.push(defaut('V1', e.id, `L'étape « ${e.id} » n'a pas d'instruction.`));
  }

  // V2 — toute référence d'étape désigne un objet existant
  const cheminementsParId = new Map((modele.cheminements ?? []).map((c) => [c.id, c]));
  const traverseesParId = new Map((modele.traversees ?? []).map((t) => [t.id, t]));
  const registres = {
    composants: [composantsParId, 'composant'],
    cheminements: [cheminementsParId, 'cheminement'],
    traversees: [traverseesParId, 'traversée'],
  };
  for (const e of etapes) {
    for (const [genre, [registre, libelle]] of Object.entries(registres)) {
      for (const id of e[genre] ?? []) {
        if (!registre.has(id))
          d.push(defaut('V2', e.id, `L'étape « ${e.id} » référence le ${libelle} « ${id} », absent de la maquette.`));
      }
    }
  }

  // V3 — tout objet posable est posé par au moins une étape, qu'il s'agisse d'un
  // socle ou de quinze mètres de conduit.
  const poses = new Set();
  for (const e of etapes) {
    if (e.nature !== 'pose') continue;
    for (const genre of ['composants', 'cheminements', 'traversees']) {
      for (const id of e[genre] ?? []) poses.add(id);
    }
  }
  const aPoser = [
    ...modele.composants.map((c) => [c, 'Le composant']),
    ...(modele.cheminements ?? []).map((c) => [c, 'Le cheminement']),
    ...(modele.traversees ?? []).map((t) => [t, 'La traversée']),
  ];
  // V23 — une étape de perçage déclare ce qu'elle fait percer
  //
  // Les trois étapes de la phase `percage` déclaraient `composants: []` et
  // `cheminements: []` : pour la seule opération irréversible du chantier, la vue
  // était vide et l'instruction écrite portait tout. Le Principe VI veut chaque
  // étape illustrée ; sur le perçage, la moitié manquait.
  const idsPosables = new Set([
    ...(modele.composants ?? []).map((c) => c.id),
    ...(modele.cheminements ?? []).map((c) => c.id),
  ]);
  for (const etape of sequence?.etapes ?? []) {
    if (etape.phase !== 'percage') continue;
    const fix = etape.fixations ?? [];
    const trav = etape.traversees ?? [];
    if (fix.length === 0 && trav.length === 0) {
      d.push(
        defaut('V23', etape.id, `« ${etape.id} » fait percer sans rien déclarer : une étape de perçage sans objet ne s'illustre pas, et l'installateur n'a qu'un texte pour un geste irréversible.`),
      );
    }
    for (const id of fix) {
      if (!idsPosables.has(id))
        d.push(defaut('V23', etape.id, `« ${etape.id} » déclare percer pour « ${id} », qui n'est ni un composant ni un cheminement.`));
    }
  }

  for (const [objet, libelle] of aPoser) {
    if (!poses.has(objet.id))
      d.push(defaut('V3', objet.id, `${libelle} « ${objet.reference} » n'est posé par aucune étape : il ne serait jamais monté.`));
  }

  // V4 et V5 remontent de la composition de la séquence.
  d.push(...(sequence.defauts ?? []));

  // V6 — une dépendance ne doit pas contredire l'ordre des phases
  const parId = new Map(etapes.map((e) => [e.id, e]));
  for (const e of etapes) {
    for (const id of e.dependances ?? []) {
      const amont = parId.get(id);
      if (amont && rangPhase(modele.chantier, amont.phase) > rangPhase(modele.chantier, e.phase))
        d.push(
          defaut('V6', e.id, `« ${e.id} » (phase ${e.phase}) dépend de « ${id} » (phase ${amont.phase}), postérieure.`),
        );
    }
  }

  // V7 — exactement une consignation et une levée
  for (const nature of ['consignation', 'levee-consignation']) {
    const n = etapes.filter((e) => e.nature === nature).length;
    if (n !== 1) d.push(defaut('V7', nature, `Il doit y avoir exactement une étape « ${nature} », il y en a ${n}.`));
  }

  // V8 — aucun travail sous tension avant la levée de consignation.
  // La règle qui porte de la sécurité des personnes, et la seule qui se vérifie
  // par une simple comparaison de rangs.
  const levee = etapes.find((e) => e.nature === 'levee-consignation');
  if (levee) {
    for (const e of etapes) {
      if (e.sousTension && e.rang < levee.rang)
        d.push(
          defaut('V8', e.id, `L'étape « ${e.id} » est sous tension au rang ${e.rang}, avant la levée de consignation (rang ${levee.rang}).`),
        );
    }
  }

  // V9 — après la levée, une étape déclarée hors tension doit se justifier
  if (levee) {
    for (const e of etapes) {
      if (e.rang > levee.rang && !e.sousTension && !estTexte(e.justificationSousTension))
        d.push(defaut('V9', e.id, `« ${e.id} » suit la levée de consignation sans être sous tension, sans justification.`));
    }
  }

  // V10 — les six vérifications du Principe V sont présentes
  const presentes = new Set(etapes.filter((e) => e.nature === 'verification').map((e) => e.verification));
  for (const v of verificationsExigees(modele.chantier)) {
    if (!presentes.has(v))
      d.push(
        defaut('V10', v, `La vérification « ${libelleDe(modele.chantier.verifications, v)} » (${v}) exigée par le Principe V ne figure pas dans la séquence.`),
      );
  }

  // V11 — identifiants uniques, tous apports confondus
  const compte = (liste) => {
    const vus = new Set();
    const doubles = [];
    for (const x of liste) {
      if (vus.has(x.id)) doubles.push(x.id);
      vus.add(x.id);
    }
    return doubles;
  };
  for (const id of compte(modele.composants)) d.push(defaut('V11', id, `Identifiant de composant en double : ${id}.`));
  for (const id of compte(modele.etapes)) d.push(defaut('V11', id, `Identifiant d'étape en double : ${id}.`));
  for (const id of compte(modele.cheminements ?? [])) d.push(defaut('V11', id, `Identifiant de cheminement en double : ${id}.`));
  for (const id of compte(modele.traversees ?? [])) d.push(defaut('V11', id, `Identifiant de traversée en double : ${id}.`));
  // Les rangements partagent l'espace d'identifiants des composants : ils
  // apparaissent dans la même vue et la même fiche, et deux objets de même
  // référence y seraient indiscernables.
  for (const id of compte([...(modele.composants ?? []), ...(modele.rangements ?? [])]))
    d.push(defaut('V11', id, `Identifiant de composant ou de rangement en double : ${id}.`));

  // Le module d'une commande sur module existe, est un module, et du même
  // circuit : un ordre ne franchit pas la protection d'un autre circuit.
  for (const c of modele.composants) {
    // Ce qu'une entrée attend d'un bouton est une propriété du module, et de lui seul.
    if (c.entree !== undefined && c.type !== 'module-commande')
      d.push(defaut('STRUCT', c.id, `« ${c.reference} » déclare « entree », qui ne vaut que pour un module de commande.`));
    else if (c.entree !== undefined && !['phase', 'boucle'].includes(c.entree))
      d.push(defaut('STRUCT', c.id, `« ${c.reference} » : entree inconnue, « ${c.entree} ».`));
  }
  for (const c of modele.composants) {
    if (c.commutation !== 'entree-module' || !estTexte(c.module)) continue;
    const module = composantsParId.get(c.module);
    if (!module) d.push(defaut('STRUCT', c.id, `« ${c.reference} » adresse son ordre à « ${c.module} », qui n'existe pas.`));
    else if (module.type !== 'module-commande')
      d.push(defaut('STRUCT', c.id, `« ${c.reference} » adresse son ordre à « ${module.reference} », qui n'est pas un module de commande.`));
    else if (module.circuit !== c.circuit)
      d.push(defaut('STRUCT', c.id, `« ${c.reference} » adresse son ordre à « ${module.reference} », qui n'est pas du même circuit.`));
  }

  d.push(...validerCheminements(modele));

  return d;
}

/**
 * Règles V13 à V18 : la géométrie de la pose apparente.
 * V17 est celle qui porte le plus de sécurité de pose — un piquage hors boîte est
 * une connexion inaccessible, donc invérifiable à vie.
 */
export function validerCheminements(modele) {
  const d = [];
  const local = modele.local;
  // La même tolérance de raccordement que le graphe : deux contrôles qui ne
  // s'accordent pas sur ce qu'est « le même point » se contredisent.
  const tol = modele.presentation.toleranceRaccordement;
  const arrondi = (v) => Math.round(v * 1000) / 1000;

  // V13 et V14 — orthogonalité et appui sur une face
  for (const ch of modele.cheminements ?? []) {
    for (const [i, segment] of (ch.segments ?? []).entries()) {
      if (!estOrthogonal(segment)) {
        d.push(
          defaut('V13', ch.id, `« ${ch.reference} » segment ${i + 1} n'est pas orthogonal : la constitution impose des parcours horizontaux ou verticaux.`),
        );
      }
      const appui = appuiSurFace(local, segment);
      if (!appui.ok) d.push(defaut('V14', ch.id, `« ${ch.reference} » segment ${i + 1} : ${appui.message}`));
    }
  }

  if ((modele.cheminements ?? []).length === 0) return d;
  const graphe = construireGraphe(modele);

  // Une boîte à VOLUME couvre ce qu'elle contient. Le graphe ramenait autrefois au
  // centre de la boîte tout point tombé dedans, et V15 comme V17 y lisaient les
  // boîtes du nœud. Il ne le fait plus — un tel report faussait les longueurs dès
  // que l'enceinte était grande — et les deux règles doivent donc consulter
  // l'enveloppe elles-mêmes.
  const boitesAVolume = (modele.composants ?? []).filter(
    (c) => roleDeType(modele, c.type) === 'jonction' && enveloppeDeBoite(local, c),
  );
  const boiteCouvrantLe = (point) => boiteCouvrant(local, boitesAVolume, point, tol);

  // Un point est sur un profilé latéral quand il tombe dans le volume de sa
  // section, extrémités comprises : un sommet du profilé est sur le profilé, et un
  // conduit qui sort par sa face la plus basse part à une demi-largeur de l'axe.
  const surUnProfilLateral = (point) =>
    (modele.cheminements ?? []).some((ch) => ch.raccordement === 'lateral' && pointSurProfile(point, ch, tol));

  // V15 — aucune extrémité pendante
  //
  // La règle vise les CONDUITS : une extrémité pendante, ce sont des conducteurs
  // qui débouchent sans enveloppe ni destination. Un cheminement à raccordement
  // LATÉRAL ne la connaît pas — ses conducteurs entrent et sortent par ses côtés,
  // et son extrémité marque l'endroit où le profilé s'arrête. Lui appliquer la
  // règle obligerait à tronquer le profilé dans le modèle, ou à inventer un objet
  // à son bout.
  const contiguDeCheminement = new Set();
  for (const ch of modele.cheminements) for (const id of ch.contigu ?? []) contiguDeCheminement.add(ch.id);
  for (const ch of modele.cheminements) {
    if (ch.raccordement === 'lateral') continue;
    for (const [rang, bout] of extremites(ch).entries()) {
      const n = graphe.noeudAu(bout);
      const raccorde =
        n &&
        (n.composants.length > 0 ||
          n.traversees.length > 0 ||
          (n.traverseesSortie ?? []).length > 0 ||
          n.degre >= 2 ||
          boiteCouvrantLe(n.point) !== null ||
          // Un conduit qui débouche DANS un profilé à capot y entre : ses conducteurs
          // ne sortent pas dans le vide, le profilé les reçoit par sa face.
          surUnProfilLateral(n.point));
      if (!raccorde) {
        d.push(
          defaut('V15', ch.id, `« ${ch.reference} » a une extrémité ${rang === 0 ? 'de départ' : "d'arrivée"} qui ne rejoint ni composant, ni boîte, ni traversée, ni autre conduit.`),
        );
      }
    }
  }

  // V16 — continuité de chaque circuit depuis le tableau
  for (const circuit of modele.circuits ?? []) {
    const r = atteignablesDepuisTableau(graphe, modele, circuit.id);
    if (r.sansTableau) {
      d.push(defaut('V16', circuit.id, "Aucun composant de type « tableau » n'est déclaré : la continuité des circuits est invérifiable."));
      break;
    }
    for (const id of r.orphelins) {
      const c = modele.composants.find((x) => x.id === id);
      d.push(
        defaut('V16', id, `« ${c?.reference ?? id} » n'est atteignable depuis le tableau par aucun cheminement portant le circuit « ${circuit.libelle} ».`),
      );
    }
  }

  // V17 — toute jonction de trois conduits ou plus porte une boîte
  // Une JONCTION y répond, quel que soit son rôle de produit : une boîte de
  // dérivation comme un organe de connexion sous capot. Ce qui compte n'est pas
  // le profil de l'objet mais que la connexion y soit enveloppée et atteignable.
  const parIdComposantJ = new Map((modele.composants ?? []).map((c) => [c.id, c]));
  const estJonction = (id) => roleDeType(modele, parIdComposantJ.get(id)?.type) === 'jonction';

  // Un cheminement à raccordement LATÉRAL y répond aussi, sur toute sa longueur.
  // Ce que V17 protège est énoncé plus haut : « un piquage hors boîte est une
  // connexion inaccessible ». Sous un capot démontable, rien n'est inaccessible —
  // c'est la première des six conditions de la constitution v1.13.0, et elle est
  // vérifiée à la pose. La règle énonce donc, comme V15, une vérité des conduits.
  //
  // Elle ne dispense de rien : une CONNEXION abritée par un profilé reste soumise
  // à la condition 2 — un dispositif de connexion, sans épissure, IP2X si le capot
  // se dépose sans outil (constitution v1.15.0) — et se déclare comme organe de
  // connexion, pour son repère. Ce que la présente exemption admet est le TRANSIT.

  for (const n of graphe.noeudsDeDegreAuMoins(3)) {
    const porteUneJonction = n.composants.some(estJonction);
    if (!porteUneJonction && boiteCouvrantLe(n.point) === null && !surUnProfilLateral(n.point)) {
      d.push(
        defaut('V17', n.cle, `Jonction de ${n.degre} conduits en (${n.point.x} ; ${n.point.y} ; ${n.point.z}) sans boîte de dérivation : ce serait une connexion inaccessible.`),
      );
    }
  }

  // V20 — deux conduits ne se recouvrent pas
  //
  // Ajoutée le 2026-09-22. Pendant dix-neuf règles, le socle n'a opposé les
  // conduits qu'aux OBSTACLES relevés, jamais entre eux : deux tubes pouvaient
  // se traverser en plein vol sans qu'aucun contrôle ne le voie. La lacune était
  // connue et écrite (R4 de `003-eclairage`), ce qui ne l'a pas empêchée de
  // produire une recommandation fausse sur le tracé de la borne.
  //
  // Trois précisions sur ce que la règle établit, et sur ce qu'elle n'établit pas :
  //
  //  - Deux segments qui PARTAGENT UNE EXTRÉMITÉ ne sont pas en cause : c'est une
  //    jonction, et V17 a la charge de lui exiger une boîte.
  //  - Un contact au droit d'une BOÎTE DÉCLARÉE n'est pas en cause non plus : le
  //    piquage au milieu d'un conduit est admis quand il est enfermé.
  //  - La garde exigée est la demi-somme des diamètres. Quand l'un des deux n'est
  //    PAS DÉCLARÉ, elle retombe à zéro et la règle ne détecte plus que le
  //    croisement franc des axes. Elle est alors plus faible, et le message le
  //    dit — un contrôle affaibli qui se tait comme un contrôle réussi est
  //    exactement ce que le Principe VI interdit.
  const aPlat = [];
  for (const ch of modele.cheminements) {
    for (const [i, segment] of (ch.segments ?? []).entries()) aPlat.push({ ch, segment, rang: i + 1 });
  }
  const boites = (modele.composants ?? []).filter((c) => c.type === 'boite-derivation');
  const aVolume = boites.filter((b) => enveloppeDeBoite(local, b));
  // Une boîte couvre son point, et son VOLUME quand elle en déclare un. La
  // seconde forme est ce qui permet à un conduit de franchir un autre conduit
  // à l'abri d'une boîte, sans arriver à son centre exact.
  const surUneBoite = (point) =>
    boites.some((b) => memePoint(b.position, point, tol)) ||
    boiteCouvrant(local, aVolume, point, tol) !== null;

  for (let i = 0; i < aPlat.length; i += 1) {
    for (let j = i + 1; j < aPlat.length; j += 1) {
      const A = aPlat[i];
      const B = aPlat[j];
      // Un cheminement est UN objet physique : ses propres segments ne se
      // disputent pas la place. La question ne se posait pas tant qu'un
      // cheminement était un tube mince ; la largeur d'un profilé de 0,12 m fait
      // que deux de ses sommets distants de 0,04 m se déclarent en conflit.
      if (A.ch.id === B.ch.id) continue;
      // Un majorant vaut ici autant qu'une cote arrêtée, et même mieux : il
      // élargit la garde exigée, donc il ne peut que resserrer le contrôle.
      const calibre = (ch) => calibreDe(ch.section);
      const dA = calibre(A.ch);
      const dB = calibre(B.ch);
      const mesure = dA !== null && dB !== null;
      const majore = mesure && (!sectionArretee(A.ch.section) || !sectionArretee(B.ch.section));
      const garde = mesure ? (dA + dB) / 2 : 0;
      const nomme = `« ${A.ch.reference} » segment ${A.rang} et « ${B.ch.reference} » segment ${B.rang}`;

      // D'abord la SUPERPOSITION, qui n'est jamais excusable — pas même par une
      // extrémité partagée. Deux conduits qui partent du même point dans la même
      // direction partagent bien une extrémité, et occupent bien le même tube d'air.
      const superpose = recouvrementParallele(A.segment, B.segment, garde, tol);
      if (superpose) {
        const p = superpose.point;
        d.push(
          defaut(
            'V20',
            A.ch.id,
            `${nomme} sont SUPERPOSÉS sur ${arrondi(superpose.longueur)} m, à ${arrondi(superpose.ecart)} m d'écart, autour de (${arrondi(p.x)} ; ${arrondi(p.y)} ; ${arrondi(p.z)})${mesure ? ` pour une garde de ${arrondi(garde)} m${majore ? ', prise sur un majorant' : ''}` : ' — un diamètre au moins n’est pas déclaré'}. Deux conduits parallèles doivent chacun avoir leur place.`,
          ),
        );
        continue;
      }

      // Ensuite le contact ponctuel, dont une jonction ou une boîte peut répondre.
      //
      // Un cheminement à raccordement LATÉRAL y répond aussi, et par construction :
      // un conduit qui le touche en un point n'occupe pas sa place, il y entre.
      // C'est tout l'objet d'un profilé à capot — se faire aborder sur ses côtés.
      // La SUPERPOSITION reste refusée au-dessus : longer un profilé sur un mètre
      // n'est pas y entrer, et cette distinction est le seul garde-fou qui reste.
      if (A.ch.raccordement === 'lateral' || B.ch.raccordement === 'lateral') continue;
      if (partagentUneExtremite(A.segment, B.segment, tol)) continue;
      const { p1, p2, distance } = plusProchesPoints(A.segment, B.segment);
      if (distance > garde - 1e-9) continue;
      if (surUneBoite(p1) || surUneBoite(p2)) continue;

      const ou = `(${arrondi(p1.x)} ; ${arrondi(p1.y)} ; ${arrondi(p1.z)})`;
      const comment = mesure
        ? `${arrondi(distance)} m entre axes pour une garde de ${arrondi(garde)} m${majore ? ', prise sur un majorant de diamètre' : ''}`
        : `axes confondus — contrôle affaibli, un diamètre au moins n'est pas déclaré`;
      d.push(
        defaut(
          'V20',
          A.ch.id,
          `${nomme} se recouvrent en ${ou} : ${comment}. Deux conduits ne peuvent pas occuper le même point, et aucune boîte n'y est déclarée.`,
        ),
      );
    }
  }

  // V21 — une boîte dimensionnée ne reçoit pas plus d'entrées qu'elle n'en a
  //
  // La contrepartie de l'enveloppe. Déclarer un volume exempte des points de
  // V17 et de V20 ; sans contrepartie, il suffirait de déclarer une boîte
  // énorme pour faire taire les deux règles à la fois. Le décompte des entrées
  // est ce qui empêche l'enveloppe de devenir une porte de sortie : une boîte
  // qui gagne de la place gagne aussi une obligation.
  //
  // Un conduit qui se termine dans l'enveloppe occupe UNE entrée, un conduit qui
  // la traverse en occupe DEUX. Une traversée de paroi n'en occupe aucune : elle
  // sort par le fond, qui n'est pas une entrée.
  //
  // Le décompte se lisait sur le DEGRÉ du nœud central, ce qui était exact tant
  // que le graphe y ramenait tout point tombé dans la boîte. Il ne le fait plus —
  // un tel report faussait les longueurs dès que l'enceinte était grande — et le
  // raccourci s'est alors mis à compter deux fois la montée de la borne, qui coupe
  // l'antenne du tronc à 0,05 m de l'axe de BD-02. C'est un croisement, pas une
  // entrée de plus. Le décompte se lit donc sur la géométrie des conduits.
  const entreesOccupees = (b) => {
    const e = enveloppeDeBoite(local, b);
    let n = 0;
    for (const ch of modele.cheminements ?? []) {
      const bouts = extremites(ch).filter((p) => pointDansBoite(local, b, p, tol)).length;
      if (bouts > 0) {
        n += bouts;
        continue;
      }
      const traverse = (ch.segments ?? []).some((seg) =>
        ['x', 'y', 'z'].every(
          (axe) =>
            Math.max(seg.de[axe], seg.a[axe]) >= e.min[axe] - tol &&
            Math.min(seg.de[axe], seg.a[axe]) <= e.max[axe] + tol,
        ),
      );
      if (traverse) n += 2;
    }
    return n;
  };

  for (const b of aVolume) {
    const occupees = entreesOccupees(b);
    if (occupees > b.entrees) {
      d.push(
        defaut(
          'V21',
          b.id,
          `« ${b.reference} » déclare ${b.entrees} entrées et en reçoit ${occupees} : un conduit qui traverse la boîte en occupe deux. Déclarer un volume ne dispense pas de compter les trous.`,
        ),
      );
    }
  }

  // V22 — une contiguïté déclarée doit être soutenue par la géométrie
  //
  // La contrepartie de la permission, sur le modèle de V21. Sans elle, il
  // suffirait de déclarer une contiguïté entre deux objets quelconques pour
  // fabriquer de la continuité et faire taire V16 — la même faiblesse que le
  // volume d'une boîte présentait avant qu'on ne compte ses entrées.
  //
  // L'enveloppe retenue est le volume DÉCLARÉ, à défaut le gabarit du type : un
  // tableau divisionnaire n'a pas de `dimensions`, mais son encombrement est au
  // catalogue et il est aussi réel qu'une cote relevée.
  const gabarit = (c) =>
    (modele.types?.types ?? []).find((t) => t.id === c.type)?.gabarit ?? modele.types?.gabaritParDefaut;
  const enveloppeDe = (c) => enveloppeDeBoite(local, c.dimensions ? c : { ...c, dimensions: gabarit(c) });
  const parIdComposant = new Map((modele.composants ?? []).map((c) => [c.id, c]));

  for (const c of modele.composants ?? []) {
    for (const id of c.contigu ?? []) {
      const autre = parIdComposant.get(id);
      if (!autre) {
        d.push(defaut('V22', c.id, `« ${c.reference} » se déclare contigu à « ${id} », qui n'existe pas.`));
        continue;
      }
      const a = enveloppeDe(c);
      const b = enveloppeDe(autre);
      if (!a || !b) {
        d.push(defaut('V22', c.id, `« ${c.reference} » et « ${autre.reference} » ne portent pas tous deux un volume : la contiguïté ne se vérifie pas.`));
        continue;
      }
      // Séparées dès qu'un seul axe les écarte de plus que la tolérance.
      const ecart = ['x', 'y', 'z']
        .map((axe) => Math.max(a.min[axe], b.min[axe]) - Math.min(a.max[axe], b.max[axe]))
        .reduce((m, v) => Math.max(m, v), -Infinity);
      if (ecart > tol) {
        d.push(
          defaut('V22', c.id, `« ${c.reference} » se déclare contigu à « ${autre.reference} », mais leurs enveloppes sont écartées de ${arrondi(ecart)} m : une contiguïté se constate, elle ne se décrète pas.`),
        );
      }
    }
  }

  // La contiguïté d'un CHEMINEMENT répond de la même exigence : son extrémité la
  // plus proche doit toucher l'enveloppe visée. Un profilé posé sur le dessus d'un
  // tableau le touche ; un profilé qui s'arrête trente centimètres plus haut ne le
  // touche pas, et le déclarer ne le rapproche pas.
  for (const ch of modele.cheminements ?? []) {
    for (const id of ch.contigu ?? []) {
      const autre = parIdComposant.get(id);
      if (!autre) {
        d.push(defaut('V22', ch.id, `« ${ch.reference} » se déclare contigu à « ${id} », qui n'existe pas.`));
        continue;
      }
      const b = enveloppeDe(autre);
      if (!b) {
        d.push(defaut('V22', ch.id, `« ${ch.reference} » se déclare contigu à « ${autre.reference} », qui ne porte aucun volume : la contiguïté ne se vérifie pas.`));
        continue;
      }
      const bouts = [];
      for (const seg of ch.segments ?? []) bouts.push(seg.de, seg.a);
      if (bouts.length === 0) continue;
      const ecartDe = (p) =>
        ['x', 'y', 'z']
          .map((axe) => Math.max(b.min[axe] - p[axe], p[axe] - b.max[axe], 0))
          .reduce((m, v) => Math.max(m, v), 0);
      const ecart = bouts.map(ecartDe).reduce((m, v) => Math.min(m, v), Infinity);
      if (ecart > tol) {
        d.push(
          defaut('V22', ch.id, `« ${ch.reference} » se déclare contigu à « ${autre.reference} », mais son extrémité la plus proche en est écartée de ${arrondi(ecart)} m : une contiguïté se constate, elle ne se décrète pas.`),
        );
      }
    }
  }

  // V19 — un conduit ne traverse pas une baie de sa paroi
  for (const ch of modele.cheminements) {
    for (const [i, segment] of (ch.segments ?? []).entries()) {
      for (const baie of local.baies ?? []) {
        if (croiseBaie(local, segment, baie))
          d.push(
            defaut('V19', ch.id, `« ${ch.reference} » segment ${i + 1} traverse la baie « ${baie.id} » : un conduit ne peut pas passer en travers d'une ouverture.`),
          );
      }
    }
  }

  // V18 — pente des traversées desservant l'extérieur
  //
  // La règle portait sur un BOOLÉEN, et un booléen se vérifie après coup, à l'eau.
  // Elle porte désormais sur la GÉOMÉTRIE : l'entrée doit être plus haute que la
  // sortie. Une intention ne se perce pas — deux personnes lisant « pente vers
  // l'extérieur » en tireront deux angles, dont l'un peut être nul.
  for (const t of modele.traversees ?? []) {
    if (t.sens === 'interieur-vers-exterieur' && t.penteVersExterieur !== true) {
      d.push(
        defaut('V18', t.id, `« ${t.reference} » dessert l'extérieur sans pente vers l'extérieur : l'eau pourrait cheminer vers l'intérieur.`),
      );
    }
    if (t.sens === 'interieur-vers-exterieur' && typeof t.denivele === 'number') {
      const entree = entreeDeTraversee(local, t);
      const sortie = sortieDeTraversee(local, t);
      if (entree && sortie && !(sortie.z < entree.z - 1e-9)) {
        d.push(
          defaut('V18', t.id, `« ${t.reference} » déclare un dénivelé de ${arrondi(t.denivele)} m qui ne fait pas descendre sa sortie : entrée à ${arrondi(entree.z)} m, sortie à ${arrondi(sortie.z)} m. Un percement horizontal annule la pente.`),
        );
      }
      // Le dénivelé est borné par la RÉSERVE D'ALTITUDE du boîtier qui reçoit la
      // traversée : la mèche entre au-dessus de l'axe et sort au-dessous, et les
      // deux doivent rester dans l'enveloppe. Sans boîte au droit, rien à borner.
      const recu = (modele.composants ?? []).find(
        (c) => enveloppeDeBoite(local, c.dimensions ? c : { ...c, dimensions: gabaritDeType(modele, c.type) })
          && memePoint({ x: c.position.x, y: c.position.y, z: c.position.z }, { x: t.position.x, y: t.position.y, z: t.position.z }, tol),
      );
      // Une traversée qui part du FOND d'un profilé à capot n'a pas de boîtier à son
      // axe : c'est le profilé qui reçoit l'entrée, et elle doit y tomber. Seule
      // l'entrée est bornée — la sortie débouche à l'extérieur, sous l'appareil
      // qu'elle dessert, et la réserve symétrique d'une boîte n'a pas d'objet. Le
      // profilé se reconnaît à ce qu'il contient l'axe ou l'entrée.
      const profil = recu ? null : (modele.cheminements ?? []).find(
        (ch) => ch.raccordement === 'lateral'
          && (pointSurProfile(t.position, ch, tol) || (entree && pointSurProfile(entree, ch, tol))),
      );
      if (profil && entree && !pointSurProfile(entree, profil, tol)) {
        d.push(
          defaut('V18', t.id, `« ${t.reference} » déclare un dénivelé de ${arrondi(t.denivele)} m dont l'entrée, à ${arrondi(entree.z)} m, sort de « ${profil.reference} » : le perçage déboucherait hors du profilé.`),
        );
      }
      if (recu) {
        const env = enveloppeDeBoite(local, recu.dimensions ? recu : { ...recu, dimensions: gabaritDeType(modele, recu.type) });
        const reserve = env ? Math.min(env.max.z - t.position.z, t.position.z - env.min.z) * 2 : null;
        if (reserve !== null && t.denivele > reserve + 1e-9) {
          d.push(
            defaut('V18', t.id, `« ${t.reference} » déclare un dénivelé de ${arrondi(t.denivele)} m, supérieur à la réserve de ${arrondi(reserve)} m qu'offre « ${recu.reference} » : le perçage sortirait de l'enveloppe.`),
          );
        }
      }
    }
    if (!sortieDeTraversee(local, t)) {
      d.push(defaut('V18', t.id, `« ${t.reference} » est déclarée sur une face sans nu extérieur.`));
    }
  }

  return d;
}

/** Tous les contrôles. Une séquence n'est utilisable que si la liste est vide. */
export function validerTout(modele, sequence, apports = []) {
  return [
    ...validerLocal(modele.local),
    ...validerCatalogues(modele),
    ...apports.flatMap((a) => validerApport(a, modele)),
    ...validerModele(modele, sequence),
  ];
}

/**
 * Le catalogue des connecteurs est une donnée PRODUIT : facultatif — absent, tout
 * connecteur est inconnu —, mais s'il est déclaré, il dit d'où il vient, et chaque
 * référence porte un nombre d'entrées et une plage de section qui se tiennent.
 */
export function defautsDuCatalogueDeConnecteurs(cat) {
  const d = [];
  if (cat === undefined) return d;
  const ici = 'connecteurs';
  if (!estTexte(cat?.gamme)) d.push(defaut('STRUCT', ici, 'La gamme des connecteurs doit être nommée.'));
  if (!estTexte(cat?.source))
    d.push(defaut('STRUCT', ici, 'Le catalogue des connecteurs doit citer sa source : c’est une donnée produit.'));
  if (!Array.isArray(cat?.references) || cat.references.length === 0) {
    d.push(defaut('STRUCT', ici, 'Le catalogue des connecteurs ne déclare aucune référence.'));
    return d;
  }
  const vues = new Set();
  for (const r of cat.references) {
    const nom = estTexte(r?.reference) ? r.reference : '?';
    if (!estTexte(r?.reference)) d.push(defaut('STRUCT', ici, 'Une référence de connecteur est sans nom.'));
    else if (vues.has(r.reference)) d.push(defaut('STRUCT', ici, `Référence de connecteur en double : ${r.reference}.`));
    vues.add(r?.reference);
    if (!Number.isInteger(r?.entrees) || r.entrees < 2)
      d.push(defaut('STRUCT', ici, `${nom} : le nombre d'entrées doit être un entier d'au moins 2.`));
    if (!estNombre(r?.sectionMin) || !estNombre(r?.sectionMax) || r.sectionMin <= 0 || r.sectionMin > r.sectionMax)
      d.push(defaut('STRUCT', ici, `${nom} : la plage de section doit être positive et ordonnée.`));
  }
  return d;
}

/** Les catalogues du socle sont des données : ils se valident comme le reste. */
export function validerCatalogues(socle) {
  const d = [];
  const c = socle.chantier;
  if (!c || !Array.isArray(c.phases) || c.phases.length === 0)
    d.push(defaut('STRUCT', 'chantier', 'Le catalogue des phases est absent ou vide.'));
  if (!c || !Array.isArray(c.naturesEtape) || c.naturesEtape.length === 0)
    d.push(defaut('STRUCT', 'chantier', "Le catalogue des natures d'étape est absent ou vide."));
  if (!c || !Array.isArray(c.verifications) || verificationsExigees(c).length === 0)
    d.push(defaut('STRUCT', 'chantier', 'Aucune vérification exigée par le Principe V n’est déclarée.'));
  if (c?.phases) {
    for (const obligatoire of ['consignation', 'levee-consignation']) {
      if (!phases(c).includes(obligatoire))
        d.push(defaut('STRUCT', 'chantier', `La phase « ${obligatoire} » est obligatoire.`));
    }
    if (rangPhase(c, 'consignation') > rangPhase(c, 'levee-consignation'))
      d.push(defaut('STRUCT', 'chantier', 'La consignation doit précéder sa levée dans l’ordre des phases.'));
  }
  d.push(...defautsDuCatalogueDeConnecteurs(c?.connecteurs));
  const t = socle.types;
  if (!t || !Array.isArray(t.types) || !t.gabaritParDefaut)
    d.push(defaut('STRUCT', 'types', 'Le catalogue des types de composants est incomplet.'));
  for (const type of t?.types ?? []) {
    const g = type.gabarit;
    if (!g || !(g.largeur > 0) || !(g.hauteur > 0) || !(g.profondeur > 0))
      d.push(defaut('STRUCT', type.id, `Gabarit invalide pour le type « ${type.id} ».`));
  }
  const p = socle.presentation;
  if (!p || !p.couleurs || !Array.isArray(p.paletteCircuits) || p.paletteCircuits.length === 0)
    d.push(defaut('STRUCT', 'presentation', 'La présentation est incomplète.'));
  if (p && !(p.epaisseurDalle > 0))
    d.push(defaut('STRUCT', 'presentation', 'epaisseurDalle doit être un nombre positif.'));
  if (p && (!p.eclairage?.hemispherique || !p.eclairage?.directionnel))
    d.push(defaut('STRUCT', 'presentation', "Les réglages d'éclairage sont incomplets."));
  if (p && (!Array.isArray(p.vues) || p.vues.length === 0 || !p.camera))
    d.push(defaut('STRUCT', 'presentation', 'Les vues prédéfinies ou les réglages de caméra manquent.'));
  // Le mode de déplacement libre a ses propres réglages, et ils sont des DONNÉES.
  // Une vitesse se règle à l'usage, et un fichier source est le mauvais endroit
  // pour ça — c'est la même discipline que celle des gabarits et des phases.
  if (p?.camera) {
    for (const cle of [
      'vitesseDeplacement', 'vitesseRotation', 'pitchMin', 'pitchMax',
      // Réglages du focus : une durée et une marge se jugent à l'œil, et un
      // fichier source est le mauvais endroit pour les régler.
      'dureeTransition', 'lissageTransition', 'margeCadrage',
    ]) {
      if (!(p.camera[cle] > 0))
        d.push(defaut('STRUCT', 'presentation', `camera.${cle} doit être un nombre positif.`));
    }
    if (p.camera.pitchMin >= p.camera.pitchMax)
      d.push(defaut('STRUCT', 'presentation', 'camera.pitchMin doit être inférieur à camera.pitchMax.'));
    const b = p.camera.bornesVol;
    if (!b?.min || !b?.max) {
      d.push(defaut('STRUCT', 'presentation', 'camera.bornesVol doit porter un min et un max.'));
    } else {
      for (const axe of ['x', 'y', 'z']) {
        if (!(b.max[axe] > b.min[axe]))
          d.push(defaut('STRUCT', 'presentation', `camera.bornesVol : max.${axe} doit dépasser min.${axe}.`));
      }
    }
  }
  return d;
}
