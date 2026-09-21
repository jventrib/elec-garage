/**
 * Le guide de perçage n'enregistre rien.
 *
 * Décision du maître d'ouvrage, et elle a un motif plutôt qu'une préférence : la
 * consignation écrite qu'exige le Principe V couvre SIX vérifications électriques
 * — continuité PE, terre, isolement, déclenchement, serrage, concordance — et le
 * perçage n'en fait pas partie. Le dossier ne réclame donc aucun registre des
 * trous. Y ajouter des coches créerait un second registre qui ne répond à rien, et
 * qui mentirait dès qu'un tracé serait révisé.
 *
 * Une exigence NÉGATIVE sans test se perd au premier ajout de confort : quelqu'un
 * trouvera commode de cocher, et rien ne l'arrêtera. C'est tout l'objet de ce
 * fichier.
 */

import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { RACINE, SOCLE, PRISES, ECLAIRAGE, BORNE } from './_aides.js';
import { fusionner } from '../src/donnees/chargement.js';
import { composerSequence } from '../src/sequence/ordonnancement.js';
import { percagesDeLEtape } from '../src/scene/percages.js';

const sources = () => {
  const out = [];
  const parcourir = (d) => {
    for (const e of readdirSync(join(RACINE, d), { withFileTypes: true })) {
      const p = `${d}/${e.name}`;
      if (e.isDirectory()) parcourir(p);
      else if (e.name.endsWith('.js')) out.push(p);
    }
  };
  parcourir('src');
  return out;
};

test('aucun marquage d’exécution n’existe dans le code', () => {
  // Les formes que prendrait une coche. Si l'une apparaît, c'est qu'un registre
  // s'est installé — et il faudra le justifier contre le Principe V, pas contre
  // ce test.
  const interdits = [
    /\bperceExecute\b/i,
    /\btrouPerce\b/i,
    /\bpercages?Faits?\b/i,
    /\bcoche(e|s)?\b/i,
    /\bchecklist\b/i,
    /\bavancement(Travaux|DesTravaux)\b/i,
  ];
  for (const f of sources()) {
    const src = readFileSync(join(RACINE, f), 'utf8');
    for (const motif of interdits) {
      assert.equal(motif.test(src), false, `${f} porte ${motif} : le guide de perçage ne doit rien enregistrer`);
    }
  }
});

test('un perçage ne porte aucun état d’exécution', () => {
  const m = fusionner(SOCLE(), [PRISES(), ECLAIRAGE(), BORNE()]);
  const e = composerSequence(m).etapes.find((x) => x.phase === 'percage');
  for (const p of percagesDeLEtape(m, SOCLE(), e)) {
    for (const cle of Object.keys(p)) {
      assert.equal(
        /fait|execut|coch|termin/i.test(cle),
        false,
        `un perçage porte « ${cle} » : c'est un état d'avancement, et le guide n'en tient pas`,
      );
    }
  }
});

test('aucune traversée ni étape ne porte de marquage d’exécution dans les données', () => {
  const m = fusionner(SOCLE(), [PRISES(), ECLAIRAGE(), BORNE()]);
  const objets = [...m.traversees, ...composerSequence(m).etapes];
  for (const o of objets) {
    for (const cle of Object.keys(o)) {
      assert.equal(
        /^(fait|execute|coche|termine)$/i.test(cle),
        false,
        `« ${o.id} » porte « ${cle} » : le lecteur mémorise une position, pas un état d'avancement`,
      );
    }
  }
});
