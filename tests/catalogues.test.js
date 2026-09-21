import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { SOCLE, DEMO, copie, RACINE } from './_aides.js';
import { join } from 'node:path';
import { fusionner } from '../src/donnees/chargement.js';
import { composerSequence } from '../src/sequence/ordonnancement.js';
import { validerCatalogues, validerTout } from '../src/donnees/validation.js';
import { phases, rangPhase, verificationsExigees, naturesEtape, libelleDe } from '../src/sequence/phases.js';

test('les catalogues du dépôt sont valides', () => {
  assert.deepEqual(validerCatalogues(SOCLE()), []);
});

test('la consignation précède sa levée dans l’ordre des phases', () => {
  const c = SOCLE().chantier;
  assert.ok(rangPhase(c, 'consignation') < rangPhase(c, 'levee-consignation'));
});

test('les essais sont scindés de part et d’autre de la levée de consignation', () => {
  const c = SOCLE().chantier;
  assert.ok(rangPhase(c, 'essais-hors-tension') < rangPhase(c, 'levee-consignation'));
  assert.ok(rangPhase(c, 'essais-sous-tension') > rangPhase(c, 'levee-consignation'));
});

test('les six vérifications du Principe V sont déclarées', () => {
  assert.equal(verificationsExigees(SOCLE().chantier).length, 6);
});

test('un catalogue de phases sans levée de consignation est rejeté', () => {
  const s = copie(SOCLE());
  s.chantier.phases = s.chantier.phases.filter((p) => p.id !== 'levee-consignation');
  assert.ok(validerCatalogues(s).some((d) => /levee-consignation/.test(d.message)));
});

test('un catalogue où la levée précède la consignation est rejeté', () => {
  const s = copie(SOCLE());
  s.chantier.phases.reverse();
  assert.ok(validerCatalogues(s).some((d) => /précéder sa levée/.test(d.message)));
});

test('un gabarit de type non positif est rejeté', () => {
  const s = copie(SOCLE());
  s.types.types[0].gabarit.largeur = 0;
  assert.ok(validerCatalogues(s).some((d) => /Gabarit invalide/.test(d.message)));
});

test('une épaisseur de dalle absente est rejetée', () => {
  const s = copie(SOCLE());
  delete s.presentation.epaisseurDalle;
  assert.ok(validerCatalogues(s).some((d) => /epaisseurDalle/.test(d.message)));
});

test('un composant d’un type absent du catalogue est rejeté', () => {
  const socle = SOCLE();
  const a = copie(DEMO());
  a.composants[1].type = 'type-inexistant';
  const m = fusionner(socle, [a]);
  const d = validerTout(m, composerSequence(m), [a]);
  assert.ok(d.some((x) => /absent du catalogue/.test(x.message)));
});

test('ajouter une phase dans les données suffit à la rendre utilisable', () => {
  const socle = copie(SOCLE());
  socle.chantier.phases.splice(rangPhase(socle.chantier, 'tirage'), 0, {
    id: 'reperage-prealable',
    libelle: 'Repérage préalable',
  });
  const a = copie(DEMO());
  a.etapes.push({
    id: 'd-reperage-prealable',
    phase: 'reperage-prealable',
    nature: 'pose',
    sousTension: false,
    instruction: 'Tracer l’implantation au mur avant de percer.',
    composants: [],
    cheminements: [],
    traversees: [],
    materiel: ['Cordeau', 'Niveau'],
    dependances: [],
  });
  const m = fusionner(socle, [a]);
  const seq = composerSequence(m);
  assert.deepEqual(validerTout(m, seq, [a]), []);
  const inseree = seq.etapes.find((e) => e.id === 'd-reperage-prealable');
  const tirage = seq.etapes.find((e) => e.id === 'd-tirage');
  assert.ok(inseree.rang < tirage.rang, 'la nouvelle phase s’insère avant le tirage');
});

test('aucune dimension ni libellé de composant ne subsiste dans src/', () => {
  // Le code ne doit plus porter ni gabarit, ni liste de phases, ni libellé.
  const fichiers = [
    'src/scene/composants.js',
    'src/scene/local.js',
    'src/scene/obstacles.js',
    'src/scene/vue.js',
    'src/ui/fiche-composant.js',
    'src/ui/panneau-etape.js',
    'src/sequence/phases.js',
    'src/donnees/validation.js',
  ];
  const interdits = [
    /['"]socle-double['"]\s*:/,
    /const\s+GABARITS\b/,
    /const\s+PALETTE\b/,
    /const\s+PHASES\s*=\s*\[/,
    /const\s+VUES\s*=\s*\{/,
    /LISIBLES\s*=/,
    /0x[0-9a-f]{6}/i,
  ];
  for (const f of fichiers) {
    const source = readFileSync(join(RACINE, f), 'utf8');
    for (const motif of interdits) {
      assert.equal(motif.test(source), false, `${f} contient encore ${motif}`);
    }
  }
});

test('les libellés viennent des données et retombent sur l’identifiant', () => {
  const c = SOCLE().chantier;
  assert.equal(libelleDe(c.phases, 'tirage'), 'Tirage des conducteurs');
  assert.equal(libelleDe(c.phases, 'inconnue'), 'inconnue');
  assert.ok(naturesEtape(c).includes('pose'));
  assert.equal(phases(c).length, c.phases.length);
});
