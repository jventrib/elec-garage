import test from 'node:test';
import assert from 'node:assert/strict';
import { DEMO, SOCLE, RANGEMENT, PRISES, ECLAIRAGE, BORNE } from './_aides.js';
import { fusionner } from '../src/donnees/chargement.js';
import { creerFiche, caracteristiques, provenanceLisible, INCONNU } from '../src/ui/fiche-composant.js';
import { couleurDeCircuit } from '../src/scene/composants.js';

/** Le modèle qui porte les rangements, distinct de celui du reste du fichier. */
const modeleAvecRangements = () => fusionner(SOCLE(), [PRISES(), ECLAIRAGE(), BORNE(), RANGEMENT()]);

/**
 * Une fiche dans un élément de fortune.
 *
 * La fiche n'a besoin que de `innerHTML`, `hidden` et d'un `querySelector` qui rend
 * le bouton de fermeture. Un vrai DOM pour trois propriétés n'apporterait rien, et
 * le test resterait dépendant d'un environnement qu'il n'a pas à utiliser.
 */
function ficheDans() {
  const element = { hidden: true, innerHTML: '', querySelector: () => ({ addEventListener() {} }) };
  return { element, fiche: creerFiche(element) };
}

const apport = DEMO();
const socle = SOCLE();
const VOCA = { ...socle.presentation.libelles, types: socle.types.types };
const trouver = (id) => apport.composants.find((c) => c.id === id);

test('toutes les caractéristiques attendues sont présentes', () => {
  const libelles = caracteristiques(trouver('pc-01'), apport.circuits, VOCA).map((l) => l.libelle);
  for (const attendu of ['Référence', 'Type', 'Paroi', 'Face', "Hauteur d'axe", 'Indice de protection', 'Circuit']) {
    assert.ok(libelles.includes(attendu), `${attendu} manque`);
  }
});

test('une valeur nulle ressort comme inconnue, jamais comblée', () => {
  // PC-05 est au plafond : sa hauteur d'axe dépend du rail, non relevé.
  const lignes = caracteristiques(trouver('pc-05'), apport.circuits, VOCA);
  const hauteur = lignes.find((l) => l.libelle === "Hauteur d'axe");
  assert.equal(hauteur.texte, INCONNU);
  assert.equal(hauteur.inconnu, true);

  const ip = lignes.find((l) => l.libelle === 'Indice de protection');
  assert.equal(ip.texte, INCONNU);
  assert.equal(ip.inconnu, true);
});

test('aucune caractéristique inconnue ne porte de valeur de remplacement', () => {
  for (const composant of apport.composants) {
    for (const ligne of caracteristiques(composant, apport.circuits, VOCA)) {
      if (ligne.inconnu) assert.equal(ligne.texte, INCONNU);
      else assert.notEqual(ligne.texte, INCONNU);
    }
  }
});

test('une valeur connue est rendue avec son unité', () => {
  const composant = trouver('pc-01');
  const ligne = caracteristiques(composant, apport.circuits, VOCA).find(
    (l) => l.libelle === "Hauteur d'axe",
  );
  assert.equal(ligne.texte, `${composant.hauteurAxe} m`, 'la valeur affichée vient des données');
  assert.equal(ligne.inconnu, false);
});

test('la face extérieure est nommée comme telle', () => {
  const dehors = caracteristiques(trouver('pc-02'), apport.circuits, VOCA).find((l) => l.libelle === 'Face');
  const dedans = caracteristiques(trouver('pc-01'), apport.circuits, VOCA).find((l) => l.libelle === 'Face');
  assert.equal(dehors.texte, 'extérieur');
  assert.equal(dedans.texte, 'intérieur');
});

test('un composant sans circuit affiche inconnu et non une valeur vide', () => {
  const ligne = caracteristiques(trouver('tableau'), apport.circuits, VOCA).find((l) => l.libelle === 'Circuit');
  assert.equal(ligne.texte, INCONNU);
  assert.equal(ligne.inconnu, true);
});

test('la provenance annonce l’absence de schéma et de note de calcul', () => {
  const lignes = provenanceLisible(apport.provenance);
  assert.equal(lignes.find((l) => l.libelle === 'Schéma unifilaire').texte, INCONNU);
  assert.equal(lignes.find((l) => l.libelle === 'Note de calcul').texte, INCONNU);
  assert.equal(lignes.find((l) => l.libelle === 'Relevé géométrique').inconnu, false);
});

test('la couleur de circuit déclarée est reprise, et le repli est déterministe', () => {
  const pres = socle.presentation;
  assert.equal(couleurDeCircuit(apport.circuits, 'c-demo', pres), '#1f77b4');
  const a = couleurDeCircuit([{ id: 'c-x', libelle: 'X' }], 'c-x', pres);
  const b = couleurDeCircuit([{ id: 'c-x', libelle: 'X' }], 'c-x', pres);
  assert.equal(a, b);
  assert.ok(pres.paletteCircuits.includes(a));
  // Sans circuit, la couleur vient aussi des données.
  assert.equal(couleurDeCircuit([], null, pres), pres.couleurs.composantSansCircuit);
});

// ─── La fiche d'un rangement : ce qu'il est, et ce qu'on ne sait pas ────────────

test('la fiche d\'un rangement nomme le produit et sa source, distingués d\'un relevé', () => {
  const m = modeleAvecRangements();
  const r = m.rangements.find((x) => x.id === 'rg-01');
  const { element, fiche } = ficheDans();
  fiche.afficherRangement(r, m.presentation.libelles);
  const html = element.innerHTML;

  assert.match(html, /VEVOR/, 'le fabricant est nommé');
  assert.match(html, /TC0513/, 'la référence produit est nommée');
  assert.match(html, /Amazon/, 'le document source est nommé');
  // La distinction qui compte : ce n'est PAS un relevé, et la fiche ne doit pas
  // laisser croire que ça l'est.
  assert.match(html, /gabarit de dessin/);
  assert.doesNotMatch(html, /relevé sur place/);
});

test('la fiche du rack porte ses deux déclarations en conflit', () => {
  const m = modeleAvecRangements();
  const r = m.rangements.find((x) => x.id === 'rg-01');
  const { element, fiche } = ficheDans();
  fiche.afficherRangement(r, m.presentation.libelles);
  const html = element.innerHTML;

  const cotes = Object.entries(r.cotes).filter(([, c]) => c.etat === 'contradictoire');
  assert.ok(cotes.length >= 2, 'le rack a au moins deux cotes en conflit');
  for (const [nom, c] of cotes) {
    assert.ok(html.includes(nom), `${nom} absent de la fiche`);
    for (const reserve of c.reserves) {
      assert.ok(html.includes(reserve), `réserve de ${nom} absente : ${reserve.slice(0, 40)}…`);
    }
  }
});

test('la fiche ne présente pas l\'encombrement du gabarit comme un encombrement établi', () => {
  const m = modeleAvecRangements();
  const r = m.rangements.find((x) => x.id === 'rg-01');
  const { element, fiche } = ficheDans();
  fiche.afficherRangement(r, m.presentation.libelles);
  const html = element.innerHTML;

  assert.match(html, /conventionnel — non relevé/, 'la mention du gabarit est affichée');
  assert.match(html, /gabarit-catalogue|gabarit de dessin/);
  // Le volume affiché est bien celui du gabarit, pas celui qu'on pourrait lire dans
  // les cotes contradictoires.
  const { min, max } = r.gabarit.volume;
  assert.ok(html.includes(String(max.y)), 'la hauteur du gabarit est celle affichée');
});

test('chaque cote de la fiche porte son origine et son état', () => {
  const m = modeleAvecRangements();
  const r = m.rangements.find((x) => x.id === 'rg-01');
  const { element, fiche } = ficheDans();
  fiche.afficherRangement(r, m.presentation.libelles);
  const html = element.innerHTML;

  const etats = m.presentation.libelles.etatsCote;
  const origines = m.presentation.libelles.originesCote;
  const inconnues = Object.values(r.cotes).filter((c) => c.etat === 'inconnu');
  assert.ok(inconnues.length > 0, 'le rack a au moins une cote inconnue');
  for (const c of Object.values(r.cotes)) {
    assert.ok(html.includes(etats[c.etat]), `état « ${c.etat} » absent de la fiche`);
    // Une origine nulle n'a pas de libellé à trouver : elle doit rester inconnue, et
    // surtout ne pas hériter de l'origine d'une autre cote.
    if (c.origine === null) continue;
    assert.ok(html.includes(origines[c.origine]), `origine « ${c.origine} » absente de la fiche`);
  }
});

test('le mode de fixation inconnu du rack est dit tel quel, sans solution inventée', () => {
  const m = modeleAvecRangements();
  const r = m.rangements.find((x) => x.id === 'rg-01');
  const { element, fiche } = ficheDans();
  fiche.afficherRangement(r, m.presentation.libelles);
  const html = element.innerHTML;

  assert.ok(r.fixation.etat === 'inconnu', 'la fixation est bien inconnue dans les données');
  assert.match(html, /non résolu/i);
  // Aucune méthode de fixation ne doit apparaître : le dossier n'en connaît aucune.
  assert.doesNotMatch(html, /cheville|tige|vis/i);
});
