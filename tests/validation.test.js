import test from 'node:test';
import assert from 'node:assert/strict';
import { LOCAL, DEMO, SOCLE, copie, regles } from './_aides.js';
import { fusionner } from '../src/donnees/chargement.js';
import { composerSequence } from '../src/sequence/ordonnancement.js';
import { validerApport, validerTout, validerLocal } from '../src/donnees/validation.js';

const modeleDe = (apport) => fusionner(SOCLE(), [apport]);
const defautsDe = (apport) => {
  const m = modeleDe(apport);
  return validerTout(m, composerSequence(m), [apport]);
};

test("l'apport de démonstration ne présente aucun défaut", () => {
  assert.deepEqual(defautsDe(DEMO()), []);
});

test('V1 — une étape sans instruction est rejetée', () => {
  const a = copie(DEMO());
  a.etapes.find((e) => e.id === 'd-tirage').instruction = '';
  assert.ok(regles(defautsDe(a)).includes('V1'));
});

test('V2 — une étape référençant un composant absent est rejetée', () => {
  const a = copie(DEMO());
  a.etapes.find((e) => e.id === 'd-appareillage').composants.push('pc-99');
  assert.ok(regles(defautsDe(a)).includes('V2'));
});

test('V3 — un composant que nulle étape ne pose est rejeté', () => {
  const a = copie(DEMO());
  a.etapes.find((e) => e.id === 'd-appareillage').composants = ['pc-01'];
  const d = defautsDe(a);
  assert.ok(regles(d).includes('V3'));
  assert.ok(d.some((x) => /PC-05/.test(x.message)));
});

test('V4 — une dépendance vers une étape inexistante est rejetée', () => {
  const a = copie(DEMO());
  a.etapes.find((e) => e.id === 'd-tirage').dependances = ['d-inexistante'];
  assert.ok(regles(defautsDe(a)).includes('V4'));
});

test('V5 — une boucle de dépendances est détectée, sans erreur levée', () => {
  const a = copie(DEMO());
  a.etapes.find((e) => e.id === 'd-boites').dependances = ['d-tirage'];
  a.etapes.find((e) => e.id === 'd-tirage').dependances = ['d-boites'];
  const d = defautsDe(a);
  assert.ok(regles(d).includes('V5'));
});

test('V6 — une dépendance vers une phase postérieure est rejetée', () => {
  const a = copie(DEMO());
  // Dépendance à rebours mais acyclique : sans cela V5 tronquerait la séquence
  // et V6 n'aurait rien à évaluer.
  a.etapes.push({
    id: 'd-anomalie',
    phase: 'boites',
    nature: 'pose',
    sousTension: false,
    instruction: 'Étape de phase boites dépendant à tort d’une étape d’appareillage.',
    composants: [],
    materiel: [],
    dependances: ['d-appareillage'],
  });
  const d = defautsDe(a);
  assert.ok(regles(d).includes('V6'));
  assert.ok(!regles(d).includes('V5'), 'le cas doit rester acyclique');
});

test('V7 — l’absence de consignation est rejetée', () => {
  const a = copie(DEMO());
  a.etapes = a.etapes.filter((e) => e.nature !== 'consignation');
  assert.ok(regles(defautsDe(a)).includes('V7'));
});

test('V8 — une étape sous tension avant la levée de consignation est rejetée', () => {
  const a = copie(DEMO());
  a.etapes.find((e) => e.id === 'd-appareillage').sousTension = true;
  const d = defautsDe(a);
  assert.ok(regles(d).includes('V8'));
  assert.ok(d.some((x) => /avant la levée de consignation/.test(x.message)));
});

test('V9 — après la levée, une étape hors tension doit se justifier', () => {
  const a = copie(DEMO());
  a.etapes.find((e) => e.id === 'd-differentiels').sousTension = false;
  assert.ok(regles(defautsDe(a)).includes('V9'));
});

test('V10 — l’absence d’une des six vérifications du Principe V est rejetée', () => {
  const a = copie(DEMO());
  a.etapes = a.etapes.filter((e) => e.verification !== 'isolement');
  const d = defautsDe(a);
  assert.ok(regles(d).includes('V10'));
  assert.ok(d.some((x) => /isolement/.test(x.message)));
});

test('V11 — un identifiant de composant en double est rejeté', () => {
  const a = copie(DEMO());
  a.composants.push({ ...a.composants[1] });
  assert.ok(regles(defautsDe(a)).includes('V11'));
});

test('V12 — une cote du relevé dans un apport est rejetée', () => {
  const a = copie(DEMO());
  a.oeuvre = { x: 5.6, y: 5.6 };
  assert.ok(regles(validerApport(a, SOCLE())).includes('V12'));
});

test('STRUCT — une étape de vérification doit dire laquelle elle réalise', () => {
  const a = copie(DEMO());
  delete a.etapes.find((e) => e.id === 'd-terre').verification;
  assert.ok(validerApport(a, SOCLE()).some((d) => /vérification doit déclarer/.test(d.message)));
});

test('STRUCT — une paroi inconnue sur un composant est rejetée', () => {
  const a = copie(DEMO());
  a.composants[1].paroi = 'haut';
  assert.ok(validerApport(a, SOCLE()).some((d) => /Paroi inconnue/.test(d.message)));
});

/* ---------------- Extension « pose en apparent » ---------------- */

const pt = (x, y, z) => ({ x, y, z });

test('V13 — un segment en diagonale est rejeté', () => {
  const a = copie(DEMO());
  a.cheminements.find((c) => c.id === 'ch-03').segments[0].a = pt(5.6, 5.4, 1.8);
  const d = defautsDe(a);
  assert.ok(regles(d).includes('V13'));
  assert.ok(d.some((x) => /orthogonal/.test(x.message)));
});

test('V14 — un segment qui flotte entre les deux nus est rejeté', () => {
  const a = copie(DEMO());
  for (const s of a.cheminements.find((c) => c.id === 'ch-03').segments) {
    s.de.x = 5.7;
    s.a.x = 5.7;
  }
  assert.ok(regles(defautsDe(a)).includes('V14'));
});

test('V14 — un segment qui sort des limites de sa face est rejeté', () => {
  const a = copie(DEMO());
  a.cheminements.find((c) => c.id === 'ch-03').segments[0].a = pt(5.6, 6.2, 2.5);
  assert.ok(regles(defautsDe(a)).includes('V14'));
});

test('V15 — une extrémité pendante est rejetée', () => {
  const a = copie(DEMO());
  a.cheminements.push({
    id: 'ch-pendant',
    reference: 'CH-PENDANT',
    circuits: ['c-demo'],
    segments: [{ face: 'est', de: pt(5.6, 1.5, 0.8), a: pt(5.6, 2.0, 0.8) }],
    diametre: null,
  });
  a.etapes.find((e) => e.id === 'd-cheminement').cheminements.push('ch-pendant');
  const d = defautsDe(a);
  assert.ok(regles(d).includes('V15'));
  assert.ok(d.some((x) => /ne rejoint ni composant/.test(x.message)));
});

test('V16 — un composant coupé de son tableau est nommé', () => {
  const a = copie(DEMO());
  a.cheminements = a.cheminements.filter((c) => c.id !== 'ch-09');
  a.etapes.find((e) => e.id === 'd-cheminement').cheminements = a.cheminements.map((c) => c.id);
  const d = defautsDe(a);
  assert.ok(regles(d).includes('V16'));
  assert.ok(d.some((x) => /PC-05/.test(x.message)), 'le défaut doit nommer le composant');
});

test('V17 — un piquage hors boîte est rejeté', () => {
  const a = copie(DEMO());
  a.cheminements.push({
    id: 'ch-piquage',
    reference: 'CH-PIQUAGE',
    circuits: ['c-demo'],
    segments: [{ face: 'est', de: pt(5.6, 4.0, 2.5), a: pt(5.6, 4.0, 1.8) }],
    diametre: null,
  });
  a.etapes.find((e) => e.id === 'd-cheminement').cheminements.push('ch-piquage');
  const d = defautsDe(a);
  assert.ok(regles(d).includes('V17'));
  assert.ok(d.some((x) => /connexion inaccessible/.test(x.message)));
});

test('V17 — retirer une boîte de jonction rend la jonction fautive', () => {
  const a = copie(DEMO());
  a.composants = a.composants.filter((c) => c.id !== 'bd-03');
  a.etapes.find((e) => e.id === 'd-boites').composants =
    a.etapes.find((e) => e.id === 'd-boites').composants.filter((x) => x !== 'bd-03');
  assert.ok(regles(defautsDe(a)).includes('V17'));
});

test('V18 — une traversée vers l’extérieur sans pente est rejetée', () => {
  const a = copie(DEMO());
  a.traversees[0].penteVersExterieur = false;
  const d = defautsDe(a);
  assert.ok(regles(d).includes('V18'));
  assert.ok(d.some((x) => /eau pourrait cheminer/.test(x.message)));
});

test('V3 — un cheminement que nulle étape ne pose est rejeté', () => {
  const a = copie(DEMO());
  a.etapes.find((e) => e.id === 'd-cheminement').cheminements = ['ch-01'];
  const d = defautsDe(a);
  assert.ok(regles(d).includes('V3'));
  assert.ok(d.some((x) => /CH-03/.test(x.message)));
});

test('V3 — une traversée que nulle étape ne pose est rejetée', () => {
  const a = copie(DEMO());
  a.etapes.find((e) => e.id === 'd-boites').traversees = [];
  const d = defautsDe(a);
  assert.ok(regles(d).includes('V3'));
  assert.ok(d.some((x) => /TV-01/.test(x.message)));
});

test('V2 — une étape référençant un cheminement absent est rejetée', () => {
  const a = copie(DEMO());
  a.etapes.find((e) => e.id === 'd-cheminement').cheminements.push('ch-99');
  const d = defautsDe(a);
  assert.ok(regles(d).includes('V2'));
  assert.ok(d.some((x) => /cheminement « ch-99 »/.test(x.message)));
});

test('STRUCT — un cheminement sans circuit porté est rejeté', () => {
  const a = copie(DEMO());
  a.cheminements[0].circuits = [];
  assert.ok(validerApport(a, SOCLE()).some((x) => /au moins un circuit/.test(x.message)));
});

test('STRUCT — une traversée de sens inconnu est rejetée', () => {
  const a = copie(DEMO());
  a.traversees[0].sens = 'en-biais';
  assert.ok(validerApport(a, SOCLE()).some((x) => /Sens inconnu/.test(x.message)));
});

test('STRUCT — un obstacle sans baie est accepté', () => {
  // Le gabarit de manœuvre du véhicule ne se rattache à aucune ouverture.
  const local = LOCAL();
  assert.ok(local.obstacles.some((o) => o.baie === undefined));
  assert.deepEqual(validerLocal(local), []);
});
