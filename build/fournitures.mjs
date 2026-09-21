/**
 * Génère `dossier/fournitures.md`, la liste totale des fournitures.
 *
 * Le document est **produit**, jamais tenu à la main : trois nomenclatures
 * séparées ne s'additionnent pas, et celles qui se recomptent mal sont
 * justement les mètres de conduit par calibre et de conducteur par section.
 * Un test vérifie que le fichier commité est bien celui que ce script produit.
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { fusionner } from '../src/donnees/chargement.js';
import { fournitures } from '../src/donnees/fournitures.js';

const RACINE = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const lire = (f) => JSON.parse(fs.readFileSync(path.join(RACINE, f), 'utf8'));

export function modeleComplet() {
  const socle = {
    local: lire('data/local.json'),
    chantier: lire('data/chantier.json'),
    types: lire('data/types-composants.json'),
    presentation: lire('data/presentation.json'),
  };
  const noms = lire('data/apports/index.json');
  return fusionner(socle, noms.map((n) => lire(`data/apports/${n}.json`)));
}

const nb = (v, u = '') => (v === null || v === undefined ? '*à arrêter*' : `**${String(v).replace('.', ',')}**${u}`);

export function rendre(f, modele) {
  const l = [];
  l.push('# Liste totale des fournitures');
  l.push('');
  l.push(`**Date** : 2026-09-22 | **Circuits** : ${f.circuits.length} | **Généré** par \`npm run fournitures\``);
  l.push('');
  l.push('> **Ce document est produit, pas rédigé.** Les quantités sont dérivées du tracé et des');
  l.push('> circuits, jamais recopiées : trois nomenclatures tenues séparément ne s\'additionnent');
  l.push('> pas, et les deux qui se recomptent le plus mal — les mètres de conduit par calibre et');
  l.push('> les mètres de conducteur par section — dépendent du nombre de fils dans chaque tube.');
  l.push('>');
  l.push('> Ce qui **ne se calcule pas** y figure comme *à arrêter*, jamais estimé : une liste');
  l.push('> d\'achat n\'est pas le bon endroit pour qu\'un chiffre plausible se déguise en chiffre');
  l.push('> vérifié.');
  l.push('');

  l.push('## Conduit');
  l.push('');
  l.push('| Contenant | Longueur | Références | Remarque |');
  l.push('|-----------|----------|------------|----------|');
  for (const c of f.conduits) {
    const m = (v) => `${v.toFixed(2).replace('.', ',')} m`;
    const combien = c.circuitsPartages > 2 ? `${c.circuitsPartages} circuits` : 'deux circuits';
    const designation =
      c.calibre === null
        ? '*à arrêter*'
        : c.forme === 'rectangulaire'
          ? `goulotte ${c.largeur} × ${c.profondeur}`
          : `IRL ${c.calibre}`;
    const remarque = c.majore
      ? '**calibre majorant, non arrêté** — la note de calcul le tranchera ; la bande contrainte l\'admet jusque-là'
      : c.partage && c.dedie
        ? `**mixte** — ${m(c.longueurPartagee)} de **tronc partagé** entre ${combien} et ${m(c.longueurDediee)} de ligne **dédiée** : même article à l'achat, deux natures. Le partage ne change pas le calibre, il change le **remplissage** — c'est là qu'il se paie`
        : c.partage
          ? `**tronc partagé** entre ${combien} — remplissage à justifier sur la fiche produit`
          : 'branches propres à un seul circuit';
    l.push(`| ${designation} | ${nb(c.longueur, ' m')} | ${c.references.join(', ')} | ${remarque} |`);
  }
  const totalConduit = f.conduits.reduce((t, c) => t + c.longueur, 0);
  // La mention du calibre non arrêté ne s'écrit que s'il en reste : annoncer
  // « dont 0,00 m au calibre non arrêté » laisserait croire qu'il reste une
  // question ouverte là où il n'y en a plus.
  const majores = f.conduits.filter((c) => c.majore).reduce((t, c) => t + c.longueur, 0);
  const reste = majores > 0
    ? `dont ${majores.toFixed(2).replace('.', ',')} m au calibre non encore arrêté`
    : '**tous les calibres sont arrêtés**';
  l.push(`| **Total** | **${totalConduit.toFixed(2).replace('.', ',')} m** | | ${reste} |`);
  l.push('');
  l.push(`**${f.coudes.total} changements de direction** se traitent par accessoire, jamais par pincement du tube : ` +
    f.coudes.detail.map((d) => `${d.nombre} sur ${d.reference}`).join(', ') + '.');
  l.push('');

  l.push('## Conducteurs');
  l.push('');
  l.push('| Section | Longueur à acheter | Circuit | État |');
  l.push('|---------|------------------------|---------|------|');
  for (const c of f.conducteurs) {
    const etat = c.majore
      ? '**majorée** — le pilotage de ce circuit n\'est pas déclaré, la longueur retombe sur le produit `n × tracé`'
      : 'dérivée du trajet de chaque conducteur';
    const section = c.section === null ? '*à arrêter*' : `${String(c.section).replace('.', ',')} mm²`;
    const quoi = c.cable ? `câble ${c.cable}` : 'conducteur';
    l.push(`| ${c.cable ? `**câble ${c.cable}**, ${section}` : section} | ${nb(c.longueur, ' m')} de ${quoi} | ${c.circuits.join(', ')} | ${etat} |`);
  }
  l.push('');
  l.push('**Ces longueurs suivent le tracé, et il faut les majorer de deux façons :**');
  l.push('');
  l.push(`- la **réserve en boîte**, 10 à 15 cm par conducteur et par boîte traversée — l'ordre de`);
  l.push(`  montage l'exige, et il y a ${f.boites.length} boîtes de dérivation ;`);
  l.push(`- l'**épaisseur de paroi** à chaque traversée, ${nb(f.traversees.epaisseur, ' m')}, sur ${f.traversees.nombre} traversées.`);
  l.push('');
  l.push('Elles partent en outre du **dessus du tableau** et s\'arrêtent à l\'**entrée des appareils** :');
  l.push('le cheminement dans le coffret jusqu\'au bornier ou à la protection, et la longueur de');
  l.push('raccordement dans chaque appareil — la borne au premier chef —, se relèvent sur place.');
  l.push('');
  l.push('*Une longueur de conducteur n\'est pas une longueur de tracé : un conduit qui porte trois');
  l.push('fils en consomme trois fois sa longueur. C\'est le calcul que des nomenclatures séparées');
  l.push('rendaient faux dès la première mutualisation.*');
  l.push('');
  l.push('*Ce n\'est pas non plus `n × longueur de tracé`, et c\'est la correction du 2026-09-22 :');
  l.push('`n` est le cas le plus chargé du circuit, pas ce que chaque tube porte. Le 1,5 mm² était');
  l.push('ainsi annoncé à 80,40 m pour 51,24 m réels — la phase non commutée s\'arrête à la commande');
  l.push('du plafonnier, et le retour de l\'interrupteur extérieur ne monte jamais au plafond. Depuis');
  l.push('que le **pilotage** est déclaré — quelle commande agit sur quel point —, chaque conducteur');
  l.push('est suivi sur son trajet réel et compté **une fois par conduit**. Les circuits sans');
  l.push('commande, les prises et la borne, n\'ont jamais eu ce défaut : leurs longueurs sont');
  l.push('inchangées.*');
  l.push('');

  l.push('## Boîtes de dérivation');
  l.push('');
  l.push('| Repère | Côté minimal | Entrées | Circuits portés |');
  l.push('|--------|--------------|---------|-----------------|');
  for (const b of f.boites) {
    l.push(`| ${b.reference} | ${b.cote === null ? '*courant*' : `**${b.cote} mm**`} | ${b.entrees === null ? '*courant*' : `**${b.entrees}**`} | ${b.circuits} |`);
  }
  l.push('');
  l.push('*Les côtés et les nombres d\'entrées indiqués sont des **minimums dérivés du tracé**, non');
  l.push('des références de catalogue. Une boîte plus grande convient ; une plus petite ne se');
  l.push('rattrape pas, car ces boîtes sont posées avant les circuits qui les traversent.*');
  l.push('');
  const multi = f.boites.filter((b) => b.circuits > 1);
  if (multi.length) {
    l.push(`**${multi.length} boîtes portent plusieurs circuits** et DOIVENT être repérées comme telles, de`);
    l.push('façon lisible sans les ouvrir : consigner un seul des circuits n\'y met pas les autres hors');
    l.push('tension.');
    l.push('');
  }

  l.push('## Appareillage');
  l.push('');
  l.push('| Article | Nombre | Repères | Indice de protection |');
  l.push('|---------|--------|---------|----------------------|');
  for (const a of f.appareillage) {
    const ip = a.indicesInconnus === a.nombre
      ? '*à arrêter*'
      : a.indicesInconnus > 0
        ? `*${a.indicesInconnus} sur ${a.nombre} à arrêter*`
        : 'établi';
    const ext = a.exterieurs > 0 ? ` — dont **${a.exterieurs} à l'extérieur**` : '';
    l.push(`| ${a.libelle}${ext} | **${a.nombre}** | ${a.references.join(', ')} | ${ip} |`);
  }
  l.push('');

  l.push('## Traversées de paroi');
  l.push('');
  l.push(`**${f.traversees.nombre}** — ${f.traversees.references.join(', ')}. Épaisseur de paroi ${nb(f.traversees.epaisseur, ' m')}.`);
  l.push('');
  l.push('Chacune demande une **scie cloche béton**, du **mastic d\'étanchéité**, et se perce **en');
  l.push('biais vers le bas**. Elles se percent toutes à la phase de perçage, avant que les boîtes');
  l.push('qui les couvrent ne soient posées.');
  l.push('');

  l.push('## Protections, par circuit');
  l.push('');
  l.push('| Circuit | Section | Calibre | Différentiel | Sensibilité |');
  l.push('|---------|---------|---------|--------------|-------------|');
  for (const c of f.circuits) {
    l.push(`| ${c.libelle} | ${c.section === null ? '*à arrêter*' : `${String(c.section).replace('.', ',')} mm²`} | ${c.calibre === null ? '*à arrêter*' : c.calibre} | ${c.typeDifferentiel === null ? '*à arrêter*' : c.typeDifferentiel} | ${nb(c.sensibilite, ' mA')} |`);
  }
  l.push('');

  l.push('## Ce qui ne se dérive pas, et qu\'il faut arrêter');
  l.push('');
  l.push('| Fourniture | Pourquoi elle n\'est pas chiffrée ici |');
  l.push('|------------|--------------------------------------|');
  l.push('| **Condition de remplissage `D ≥ d·√(3n)`** | Elle se calcule, mais elle se **tranche** sur deux cotes produit que le relevé ne comporte pas : diamètre intérieur du conduit et diamètre extérieur isolé du conducteur. À vérifier **avant de commander le conduit**, et non à la pose. **Quatre cas sont serrés.** **CH-L1**, huit conducteurs en IRL 20 dans la composition de l’ancien CH-05 — trois de 2,5 mm², cinq de 1,5 mm² —, qui exige au moins **14,69 mm** intérieurs : un IRL 20 de 14,0 ou 14,5 mm ne convient pas. **CH-07**, sept conducteurs en IRL 20 dont quatre de 2,5 mm² : son seuil reste à calculer sur les cotes produit. **CH-05**, neuf conducteurs, en **IRL 25** : la condition s’y vérifie aussi, elle n’est pas acquise par le calibre. Et la **descente de la borne** : le câble 3G10 en IRL 25, où la règle ne tient pas — **dérogation au Principe III** du 2026-09-24, à résorber, et essai de tirage avant l’achat. Les **goulottes** n’y sont pas soumises : leur remplissage se justifie sur la fiche produit — GL-02 porte onze conducteurs et le câble de la borne |');
  l.push('| **Colliers de fixation** | L\'entraxe est une donnée du fabricant, pas une cote de projet |');
  l.push('| **Chevilles béton** | Une par collier, plus les fixations d\'appareillage : suit le choix des colliers |');
  l.push('| **Sections, calibres, types de différentiel** | Valeurs normatives, à confirmer sur le texte de la NF C 15-100 |');
  l.push('| **Indices de protection** | Dépendent des produits retenus, et de l\'exposition réelle de chacun |');
  l.push('| **Dispositif de détection 6 mA** | Intégré à la borne ou module distinct au tableau : la voie n\'est pas arrêtée |');
  l.push('| **Bornes automatiques** | Une par connexion ; le décompte suit le schéma de raccordement, pas le tracé |');
  l.push('');
  l.push('Les nomenclatures par fonctionnalité restent la référence de détail :');
  l.push('[`002`](./002-prises-de-courant/nomenclature.md), [`003`](./003-eclairage/nomenclature.md),');
  l.push('[`004`](./004-borne-recharge/nomenclature.md).');
  return l.join('\n') + '\n';
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const modele = modeleComplet();
  const texte = rendre(fournitures(modele), modele);
  fs.writeFileSync(path.join(RACINE, 'dossier/fournitures.md'), texte);
  console.log('dossier/fournitures.md écrit —', texte.split('\n').length, 'lignes');
}
