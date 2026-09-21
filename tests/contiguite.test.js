/**
 * La **contiguïté déclarée**, et l'ancrage des boîtes qu'elle a obligé à revoir.
 *
 * Une goulotte posée sur le dessus du tableau divisionnaire touche son enveloppe
 * sans la recouvrir, et aucun conduit ne les relie : les conducteurs sortent du
 * tableau par le haut et entrent dans la goulotte. Le graphe ne voyait aucune
 * arête, donc plus aucun circuit n'était continu depuis le tableau.
 *
 * Deux replis ont été écartés, et les deux méritaient de l'être : déclarer la
 * goulotte plus haute qu'elle n'est pour que son volume englobe l'axe du tableau
 * — une cote fausse —, et déclarer un conduit de 0,13 m qui n'existe pas.
 *
 * Ce fichier vérifie les deux moitiés de l'extension :
 *
 *  - la **contiguïté** crée une continuité, et **seulement quand elle est
 *    déclarée**. Deux enveloppes qui se touchent sans rien dire restent
 *    étrangères l'une à l'autre — c'est la discipline établie par `boitier`, et
 *    une permission qui se déduirait de la géométrie la ruinerait ;
 *  - une boîte à volume **relie** les points qu'elle contient à leur distance
 *    réelle, au lieu de les **ramener à son centre**. Sur une boîte de 13 cm la
 *    différence était invisible ; sur une goulotte de 1,12 m elle raccourcit de
 *    0,37 m toute longueur qui la traverse, et fausserait deux chutes de tension
 *    déclarées.
 */

import test from 'node:test';
import assert from 'node:assert/strict';
import { SOCLE, PRISES, ECLAIRAGE, BORNE, copie } from './_aides.js';
import { fusionner } from '../src/donnees/chargement.js';
import { validerCheminements, validerApport } from '../src/donnees/validation.js';
import { construireGraphe, atteignablesDepuisTableau, longueursDepuisTableau } from '../src/geometrie/graphe.js';

const socle = () => SOCLE();

/**
 * Le projet réel de `005` : BD-02 remplacée par la goulotte qui la contient, et
 * **CH-01 qui cesse d'être un conduit** — les conducteurs du tronc vont du
 * tableau à la goulotte sans tube. C'est ce second point qui rend la contiguïté
 * nécessaire ; tant que CH-01 subsiste, il relie les deux et masque le problème.
 */
function avecGoulotte({ contigu = ['pr-td-01'] } = {}) {
  const pr = copie(PRISES());
  const gl = pr.cheminements.find((c) => c.reference === 'GL-01');
  if (contigu) gl.contigu = contigu;
  else delete gl.contigu;
  return fusionner(socle(), [pr, ECLAIRAGE(), BORNE()]);
}

test('sans contiguïté déclarée, le tableau ne dessert plus AUCUN des trois circuits', () => {
  // Le mode de défaillance que l'extension existe pour éviter, et il est
  // spectaculaire plutôt que discret.
  //
  // La borne y est entrée depuis : l'amendement v1.14.0 a retiré la dédicace du
  // conduit, CH-B1 a disparu, et son câble emprunte désormais la goulotte comme
  // les deux autres. Elle n'a donc plus de tube pour la sauver, et les trois
  // circuits tombent ensemble.
  const m = avecGoulotte({ contigu: null });
  const g = construireGraphe(m);
  const coupes = m.circuits
    .filter((c) => atteignablesDepuisTableau(g, m, c.id).orphelins.length > 0)
    .map((c) => c.id)
    .sort();
  assert.deepEqual(coupes, ['c-borne', 'c-eclairage', 'c-prises']);
});

test('la contiguïté déclarée rétablit la continuité des trois circuits', () => {
  const m = avecGoulotte();
  const g = construireGraphe(m);
  for (const c of m.circuits) {
    const acces = atteignablesDepuisTableau(g, m, c.id);
    assert.deepEqual(acces.orphelins, [], `« ${c.libelle} » doit rester continu depuis le tableau`);
  }
});

test('la proximité ne suffit pas : deux enveloppes qui se touchent sans le dire restent étrangères', () => {
  // La discipline de `boitier`, transposée. Une continuité qui se déduirait de la
  // géométrie rendrait la déclaration facultative, donc inutile — et ferait taire
  // V16 par accident plutôt que par décision.
  const sans = avecGoulotte({ contigu: null });
  const avec = avecGoulotte();
  const orphelins = (m) => atteignablesDepuisTableau(construireGraphe(m), m, 'c-prises').orphelins.length;
  assert.ok(orphelins(sans) > 0, 'sans déclaration, rien ne passe');
  assert.equal(orphelins(avec), 0, 'avec déclaration, tout passe');
});

test('V22 refuse une contiguïté que la géométrie ne soutient pas', () => {
  const regles = (m) => [...new Set(validerCheminements(m).map((d) => d.regle))];

  // a) la goulotte privée de ses dimensions retombe sur le gabarit du type, bien
  //    trop petit pour rejoindre le dessus du tableau
  // a) une goulotte qui ne descend pas jusqu'au tableau ne le touche plus
  const court = copie(PRISES());
  const glA = court.cheminements.find((c) => c.reference === 'GL-01');
  glA.segments[0].de.z = 2.0;
  assert.ok(regles(fusionner(socle(), [court, ECLAIRAGE(), BORNE()])).includes('V22'),
    'une goulotte qui s’arrête en l’air n’atteint plus le tableau');

  // b) une goulotte déplacée latéralement ne touche plus rien non plus
  const loin = copie(PRISES());
  for (const seg of loin.cheminements.find((c) => c.reference === 'GL-01').segments) {
    seg.de.y = 3.0;
    seg.a.y = 3.0;
  }
  assert.ok(regles(fusionner(socle(), [loin, ECLAIRAGE(), BORNE()])).includes('V22'),
    'deux enveloppes distantes ne sont pas contiguës');

  // c) le cas juste ne rend aucun défaut de cette règle
  assert.ok(!regles(avecGoulotte()).includes('V22'), 'la goulotte réelle touche bien le tableau');
});

test('une contiguïté visant un composant inexistant est refusée', () => {
  // L'existence se vérifie sur le modèle FUSIONNÉ, et non apport par apport : la
  // goulotte est déclarée par `005` et le tableau par `002`, une contiguïté est
  // donc légitimement inter-apports. La contrôler dans un seul apport rejetterait
  // le cas réel.
  const a = copie(PRISES());
  a.cheminements.find((c) => c.reference === 'GL-01').contigu = ['fantome'];
  const m = fusionner(socle(), [a, ECLAIRAGE(), BORNE()]);
  assert.ok(
    validerCheminements(m).some((x) => x.regle === 'V22' && /n'existe pas/.test(x.message)),
    'un objet contigu doit exister',
  );
});

test('une contiguïté mal formée est refusée dès la structure de l’apport', () => {
  const socleLu = socle();
  const vide = copie(PRISES());
  vide.cheminements.find((c) => c.reference === 'GL-01').contigu = [];
  assert.ok(validerApport(vide, socleLu).some((x) => /contigu doit être une liste/.test(x.message)));

  // Un composant, lui, ne peut pas se déclarer contigu à lui-même.
  const soi = copie(PRISES());
  const bd = soi.composants.find((c) => c.reference === 'OC-01');
  bd.contigu = [bd.id];
  assert.ok(validerApport(soi, socleLu).some((x) => /lui-même/.test(x.message)));
});

test('un profilé porte la longueur de son parcours, il ne raccourcit rien', () => {
  // C'est ce que le volume assurait avant que la goulotte devienne un cheminement,
  // et qu'un cheminement donne gratuitement : ses segments portent la distance.
  // Une enceinte de 1,12 m qui ramènerait ses points à son centre raccourcirait de
  // 0,37 m toute longueur qui la traverse — et deux chutes de tension en dépendent.
  const m = avecGoulotte();
  const long = longueursDepuisTableau(construireGraphe(m), m, 'c-eclairage');

  // EL-01b dimensionne l'éclairage. Sa longueur ne doit pas se mettre à rétrécir
  // du fait qu'une boîte a grandi : le conduit, lui, n'a pas bougé.
  const el01b = [...long.parComposant.entries()].find(([id]) => id === 'ec-el-01b')?.[1];
  assert.ok(el01b !== undefined, 'EL-01b doit rester atteignable');
  assert.ok(
    el01b > 8.1,
    `EL-01b mesure ${el01b?.toFixed(3)} m : une goulotte de 1,12 m ne doit pas raccourcir le chemin`,
  );
});

test('les apports existants, qui ne déclarent aucune contiguïté, sont intacts', () => {
  // Le contrat de non-régression, celui qu'avait tenu l'extension des
  // boîtes-volumes de `004`. Les longueurs de l'éclairage et des prises sont
  // celles que les notes de calcul déclarent.
  const m = fusionner(socle(), [PRISES(), ECLAIRAGE(), BORNE()]);
  const g = construireGraphe(m);
  const par = (circuit, id) => longueursDepuisTableau(g, m, circuit).parComposant.get(id);
  const proche = (v, attendu, quoi) =>
    assert.ok(Math.abs(v - attendu) < 1e-6, `${quoi} : ${v?.toFixed(4)} au lieu de ${attendu}`);

  // Depuis la goulotte GL-02 (2026-09-24), le tronc court sous son capot, sur
  // l'axe à 2,705 m, et en sort par une face : EL-01b et PC-05 perdent 0,025 m,
  // PC-03 en gagne 0,21 — sa descente part de 2,66 m au lieu de 2,60, et les
  // conducteurs montent d'abord à l'axe du profilé.
  proche(par('c-eclairage', 'ec-el-01b'), 8.115 + Math.hypot(0.04, 0.045), 'EL-01b, point dimensionnant de l’éclairage');
  proche(par('c-eclairage', 'ec-el-02'), 5.28, 'EL-02');
  proche(par('c-prises', 'pr-pc-03'), 8.66, 'PC-03');
  proche(par('c-prises', 'pr-pc-05'), 6.115 + Math.hypot(0.04, 0.045), 'PC-05');

  for (const c of m.circuits) {
    assert.deepEqual(atteignablesDepuisTableau(g, m, c.id).orphelins, [], c.libelle);
  }
});
