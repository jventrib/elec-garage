import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { join } from 'node:path';
import { RACINE, ECLAIRAGE } from './_aides.js';

/*
 * Le schéma d'apport est un DOCUMENT, pas un garde-fou : rien dans le dépôt ne
 * l'applique aux données. Il a donc pris du retard sans bruit — il exigeait un
 * champ « diametre » que les données ne portent plus et refusait, par
 * additionalProperties, tout « nature », le jour où un cordage est apparu.
 *
 * Ces tests referment la boucle sans dépendance : ils relisent les MÊMES définitions
 * que les données et vérifient qu'elles se parlent encore. Ils ne remplacent pas un
 * validateur JSON Schema — ils n'en contrôlent que la partie qui peut mentir en
 * silence, celle qui décrit la forme des objets.
 */

const lireJson = (p) => JSON.parse(fs.readFileSync(join(RACINE, p), 'utf8'));
const schema = () => lireJson('dossier/001-visualisation-3d/contracts/apport.schema.json');

/** Résout un $ref local — le schéma n'a que des pointeurs de la forme #/$defs/x. */
function resoudre(schema, noeud) {
  const chemin = noeud.$ref.replace(/^#\//, '').split('/');
  return chemin.reduce((n, cle) => n?.[cle], schema);
}

test('le schéma déclare les mêmes champs que les apports en portent', () => {
  // La dérive qui coûte le plus cher est celle-ci : un champ que la donnée utilise
  // et que le schéma ignore. Comme additionalProperties est false partout, elle ne
  // se voit pas au chargement — elle se voit quand quelqu'un finit par appliquer le
  // schéma et que les données réelles sont refusées.
  const s = schema();
  const apport = ECLAIRAGE();
  const champs = (nom) => new Set(Object.keys(s.$defs[nom].properties));

  const compose = champs('composant');
  for (const c of apport.composants) {
    for (const k of Object.keys(c)) {
      assert.ok(compose.has(k), `${c.reference} porte « ${k} », absent de $defs/composant`);
    }
  }
  for (const k of compose) {
    assert.ok(
      apport.composants.some((c) => k in c) || !s.$defs.composant.required.includes(k),
      `$defs/composant décrit « ${k} », qu'aucun composant ne porte`,
    );
  }

  const chemine = champs('cheminement');
  for (const c of apport.cheminements) {
    for (const k of Object.keys(c)) {
      assert.ok(chemine.has(k), `${c.reference} porte « ${k} », absent de $defs/cheminement`);
    }
  }
});

test('les champs exigés par le schéma sont présents dans toutes les données', () => {
  // Le converse du précédent : exiger un champ que personne ne porte reviendrait à
  // rendre le modèle invalide sans qu'aucune règle ne l'ait décidé. Chaque
  // définition est confrontée à SA collection — une étape n'a pas de `reference`,
  // et il n'a pas à en avoir.
  const s = schema();
  const apport = ECLAIRAGE();
  for (const [def, collection] of [
    ['composant', apport.composants],
    ['cheminement', apport.cheminements],
    ['etape', apport.etapes],
    ['traversee', apport.traversees ?? []],
  ]) {
    for (const champ of s.$defs[def].required) {
      assert.ok(
        collection.every((o) => champ in o),
        `$defs/${def} exige « ${champ} », qu'au moins un objet de la collection ne porte pas`,
      );
    }
  }
});

test('nature est une énumération, et section s’y oppose', () => {
  // Les deux règles que la NATURE porte tiennent en une seule ligne de schéma. Les
  // écrire ici, plutôt que de les laisser dans le code, les rend visibles à qui relit
  // le contrat — et le test échoue si quelqu'un élargit l'énumération sans y penser.
  const s = schema();
  const ch = s.$defs.cheminement;
  assert.deepEqual(ch.properties.nature.enum, ['conduit', 'cordage']);
  assert.ok(!ch.required.includes('nature'), 'la nature reste facultative : l’absence vaut conduit');
  assert.ok(!ch.required.includes('section'), 'la section ne peut pas être exigée : un cordage n’en a pas');
  assert.equal(ch.properties.section.additionalProperties, false);
  assert.deepEqual(ch.properties.section.required, ['forme', 'diametre']);

  const co = s.$defs.composant;
  assert.equal(co.properties.raccords.minItems, 2, 'un raccord unique ne relierait rien');
  assert.equal(co.properties.raccords.items.$ref, '#/$defs/point');
  assert.ok(!co.required.includes('raccords'), 'raccords reste facultatif : la plupart des appareils n’en ont qu’un');
});

test('chaque segment pointe vers le segment du schéma', () => {
  // Un $ref cassé ne lève rien : il ne se voit qu’au moment où quelqu’un valide
  // quelque chose. Le résoudre ici, sur toutes les définitions, coûte trois lignes.
  const s = schema();
  const visiter = (noeud, chemin = '$') => {
    if (Array.isArray(noeud)) return noeud.forEach((n, i) => visiter(n, `${chemin}[${i}]`));
    if (!noeud || typeof noeud !== 'object') return;
    if (typeof noeud.$ref === 'string') {
      assert.ok(resoudre(s, noeud), `${chemin} pointe vers ${noeud.$ref}, qui n’existe pas`);
      return;
    }
    for (const [k, v] of Object.entries(noeud)) visiter(v, `${chemin}.${k}`);
  };
  visiter(s);
});
