/**
 * Graphe des cheminements : nœuds, degrés, continuité des circuits.
 *
 * Deux questions que l'œil ne voit pas. Une rupture de continuité de trois
 * millimètres enverrait l'installateur percer au mauvais endroit ; un piquage au
 * milieu d'un conduit est une connexion inaccessible, donc invérifiable à vie.
 */

import { sortieDeTraversee, entreeDeTraversee } from '../donnees/chargement.js';
import { memePoint, pointDansSegment, pointDansProfile, cotesDeProfile, pointsDeCheminement } from './cheminement.js';
import { enveloppeDeBoite, boiteCouvrant } from './enveloppe.js';

const cle = (p) => `${p.x.toFixed(4)}|${p.y.toFixed(4)}|${p.z.toFixed(4)}`;

/**
 * Construit le graphe. Les nœuds sont obtenus par agglomération linéaire à la
 * tolérance déclarée, et non par quantification : deux points séparés par moins
 * que la tolérance doivent se rejoindre même s'ils tombent de part et d'autre
 * d'une frontière de grille.
 */
export function construireGraphe(modele) {
  const tol = modele.presentation.toleranceRaccordement;
  const noeuds = [];

  // Les boîtes qui déclarent un volume ramènent à leur centre tout point qui
  // tombe dedans. C'est ce qui rend vraie la continuité d'un conduit interrompu
  // par une boîte sans arriver à son centre exact : la ligne de la borne entre
  // dans BD-01 à 0,04 m au-dessus de son axe, ce qu'un nœud-point ne savait pas
  // dire. Une boîte sans `dimensions` ne ramène rien, et les apports déjà
  // écrits sont donc inchangés.
  const boitesAVolume = (modele.composants ?? []).filter(
    (c) => c.type === 'boite-derivation' && enveloppeDeBoite(modele.local, c),
  );

  // Une boîte à volume NE RAMÈNE PLUS À SON CENTRE les points qui tombent dedans :
  // elle les RELIE entre eux, à leur distance réelle. Le ramener au centre était
  // sans conséquence tant qu'une boîte mesurait treize centimètres ; une goulotte
  // de 1,12 m raccourcissait de 0,37 m toute longueur qui la traversait, et
  // faussait deux chutes de tension déclarées dans le sens flatteur.
  const boiteDe = (point) => boiteCouvrant(modele.local, boitesAVolume, point, tol);

  function noeudPour(point) {
    for (const n of noeuds) if (memePoint(n.point, point, tol)) return n;
    const n = {
      cle: cle(point),
      point: { ...point },
      degre: 0,
      composants: [],
      boites: [],
      traversees: [],
      aretes: [],
    };
    noeuds.push(n);
    return n;
  }

  // Les extrémités de segments d'abord : elles définissent la trame.
  const segments = [];
  for (const ch of modele.cheminements ?? []) {
    for (const s of ch.segments ?? []) {
      const a = noeudPour(s.de);
      const b = noeudPour(s.a);
      a.degre += 1;
      b.degre += 1;
      a.aretes.push({ vers: b, cheminement: ch.id, circuits: ch.circuits ?? [] });
      b.aretes.push({ vers: a, cheminement: ch.id, circuits: ch.circuits ?? [] });
      segments.push({ segment: s, cheminement: ch.id });
    }
  }

  // Puis les composants et les traversées, rattachés au nœud qui les porte.
  //
  // Un composant peut déclarer ses points de RACCORDEMENT — `raccords` — plutôt
  // qu'un point unique. C'est le cas d'un appareil dont les conducteurs entrent et
  // sortent par ses extrémités : un tube de LED passe-montant se raccorde à ses
  // DEUX bouts, et le rattacher à son centre aurait fait courtoiser la dérivation
  // par l'intérieur de l'appareil — 1,20 m de câble que personne n'a tirés, et
  // surtout une continuité qui ne correspond à rien de réel.
  //
  // Ces points sont RELIÉS entre eux : l'appareil est un organe de connexion, les
  // conducteurs le traversent d'un bout à l'autre. L'arête porte leur distance
  // réelle, qui est la longueur du câblage interne — celle que la chute de tension
  // doit compter, et qu'aucun conduit ne portera à la place.
  //
  // L'ordre de déclaration n'est pas normatif : le graphe ne distingue pas l'entrée
  // de la sortie. C'est le trajet le plus court depuis le tableau qui résout la
  // question, et une polarité qu'il faudrait maintenir à la main serait une
  // donnée de plus à tenir juste.
  for (const c of modele.composants ?? []) {
    const points = Array.isArray(c.raccords) && c.raccords.length > 0 ? c.raccords : [c.position];
    const siens = points.map((p) => noeudPour(p));
    for (const n of siens) {
      n.composants.push(c.id);
      if (c.type === 'boite-derivation') n.boites.push(c.id);
    }
    if (siens.length < 2) continue;
    for (const a of siens) {
      for (const b of siens) {
        if (a === b) continue;
        if (a.aretes.some((x) => x.vers === b && x.appareil === c.id)) continue;
        a.aretes.push({ vers: b, appareil: c.id, circuits: c.circuit ? [c.circuit] : null });
        b.aretes.push({ vers: a, appareil: c.id, circuits: c.circuit ? [c.circuit] : null });
      }
    }
  }
  // Une traversée se raccorde par son AXE, là où un boîtier la reçoit : la mèche entre
  // au-dessus et sort au-dessous, dans la même enveloppe. Celle qui part du FOND d'un
  // profilé à capot n'a pas de boîtier à son axe ; c'est son ENTRÉE qui débouche dans le
  // profilé, et c'est par elle qu'elle s'y raccorde — même quand l'axe frôle le
  // profilé à la tolérance près : il fusionnerait alors avec le bout d'un conduit
  // voisin, qu'il ne rejoint pas. Sans dénivelé, les deux se confondent.
  const lateraux = (modele.cheminements ?? []).filter((ch) => ch.raccordement === 'lateral');
  const cotePar = new Map(lateraux.map((ch) => [ch.id, cotesDeProfile(ch.section)]));
  const dansUnProfile = (p) => lateraux.some((ch) => (ch.segments ?? []).some((s) => pointDansProfile(p, s, cotePar.get(ch.id), tol)));
  for (const t of modele.traversees ?? []) {
    const entree = entreeDeTraversee(modele.local, t);
    const raccord = entree && dansUnProfile(entree) ? entree : t.position;
    noeudPour(raccord).traversees.push(t.id);
    const sortie = sortieDeTraversee(modele.local, t);
    if (sortie) {
      const dedans = noeudPour(raccord);
      const dehors = noeudPour(sortie);
      dehors.traverseesSortie = [...(dehors.traverseesSortie ?? []), t.id];
      // Une traversée ponte les deux nus sans être une jonction : elle ne compte
      // pas dans le degré, car aucun conduit ne s'y raccorde à un autre.
      dedans.aretes.push({ vers: dehors, traversee: t.id, circuits: null });
      dehors.aretes.push({ vers: dedans, traversee: t.id, circuits: null });
    }
  }

  // Chaque boîte à volume rend mutuellement joignables les nœuds qu'elle contient.
  // Posée APRÈS les composants et les traversées : un module logé dans une boîte est
  // un composant, et son nœud n'existe qu'à ce moment-là.
  // C'est ce qui se passe dedans : les conducteurs vont d'une entrée à l'autre, et
  // la distance qu'ils parcourent est celle qui sépare ces entrées — négligeable
  // dans une boîte, réelle dans une goulotte.
  for (const b of boitesAVolume) {
    const dedans = [noeudPour(b.position), ...noeuds.filter((n) => boiteDe(n.point) === b)];
    const membres = [...new Set(dedans)];
    for (const a of membres) {
      for (const c of membres) {
        if (a === c) continue;
        a.aretes.push({ vers: c, boite: b.id, circuits: null });
      }
    }
  }

  // La CONTIGUÏTÉ DÉCLARÉE : deux enceintes qui se touchent sans se recouvrir, et
  // entre lesquelles les conducteurs passent directement — une goulotte posée sur
  // le dessus d'un tableau. Aucun conduit ne les relie, et il n'y en a pas à
  // inventer : l'arête porte la distance réelle entre les deux enceintes.
  //
  // Elle est DÉCLARÉE et jamais déduite de la proximité. Deux enveloppes qui se
  // touchent sans rien dire restent étrangères l'une à l'autre — même discipline
  // que « boitier », et une continuité qui se déduirait de la géométrie rendrait
  // la déclaration facultative, donc inutile.
  const parId = new Map((modele.composants ?? []).map((c) => [c.id, c]));
  for (const c of modele.composants ?? []) {
    for (const id of c.contigu ?? []) {
      const autre = parId.get(id);
      if (!autre) continue;
      const a = noeudPour(c.position);
      const b = noeudPour(autre.position);
      if (a === b) continue;
      // Un circuit qui QUITTE l'enceinte par un conduit l'emprunte : la contiguïté
      // n'est offerte qu'à ceux qui n'en ont pas. Sans cette restriction, la ligne
      // de la borne — qui garde son conduit dans la goulotte — prenait le raccourci
      // et ressortait à 10,43 m pour un tube de 10,44. Un chemin électrique plus
      // court que le conduit qui le porte est absurde, et c'est ce qui l'a révélé.
      const enConduit = new Set();
      for (const n of [a, b]) {
        for (const arete of n.aretes) {
          if (!arete.cheminement) continue;
          for (const id of arete.circuits ?? []) enConduit.add(id);
        }
      }
      const offerte = (modele.circuits ?? []).map((x) => x.id).filter((x) => !enConduit.has(x));
      a.aretes.push({ vers: b, contiguite: id, circuits: offerte });
      b.aretes.push({ vers: a, contiguite: c.id, circuits: offerte });
    }
  }

  // La contiguïté d'un CHEMINEMENT : son extrémité joint une enceinte sans conduit
  // entre les deux — une goulotte posée sur le dessus d'un tableau. On relie
  // l'extrémité la PLUS PROCHE de l'enceinte visée, et l'arête porte leur distance
  // réelle. Déclarée, jamais déduite, comme celle des composants.
  for (const ch of modele.cheminements ?? []) {
    for (const id of ch.contigu ?? []) {
      const autre = parId.get(id);
      if (!autre) continue;
      const b = noeudPour(autre.position);
      const bouts = [];
      for (const s of ch.segments ?? []) bouts.push(s.de, s.a);
      if (bouts.length === 0) continue;
      const dist = (p) => Math.hypot(p.x - autre.position.x, p.y - autre.position.y, p.z - autre.position.z);
      const plusProche = bouts.reduce((m, p) => (dist(p) < dist(m) ? p : m), bouts[0]);
      const a = noeudPour(plusProche);
      if (a === b) continue;
      a.aretes.push({ vers: b, contiguite: id, circuits: ch.circuits ?? [] });
      b.aretes.push({ vers: a, contiguite: ch.id, circuits: ch.circuits ?? [] });
    }
  }

  // LE RACCORDEMENT LATÉRAL. Un conduit se raccorde par ses bouts ; un profilé à
  // capot démontable se laisse aborder sur toute sa longueur. Tout nœud posé sur
  // le parcours d'un tel cheminement y est donc RELIÉ, et non simplement voisin.
  // Sans cela, un module logé dans la goulotte ou un conduit qui l'aborde en son
  // milieu resterait injoignable depuis le tableau.
  //
  // Le profilé s'aborde par ses FACES, et non sur son seul axe : un conduit qui
  // sort par le dessous d'une goulotte horizontale part à six centimètres de l'axe.
  // Est relié tout nœud posé dans le volume de sa section.
  //
  // Les nœuds se relient EN CHAÎNE le long de l'axe, dans l'ordre du parcours, et
  // un nœud posé sur une face rejoint sa projection sur l'axe. C'est ce que font
  // les conducteurs sous le capot : ils courent le long du profilé, puis en
  // sortent. Les relier chacun aux deux bouts, en étoile, raccourcissait un peu les
  // longueurs, et surtout faisait entrer dans l'organe de connexion autant de
  // brins d'un même conducteur qu'il en sortait de départs — trois connecteurs de
  // trop sur la jonction principale.
  for (const ch of modele.cheminements ?? []) {
    if (ch.raccordement !== 'lateral') continue;
    const cotes = cotesDeProfile(ch.section);
    for (const s of ch.segments ?? []) {
      const a = noeudPour(s.de);
      const b = noeudPour(s.a);
      const membres = noeuds.filter((n) => n !== a && n !== b && pointDansProfile(n.point, s, cotes, tol));
      const long = ['x', 'y', 'z'].find((axe) => Math.abs(s.a[axe] - s.de[axe]) > 1e-9);
      if (!long) continue;
      const surAxe = new Set([a, b]);
      for (const n of membres) {
        const projete = { ...s.de, [long]: Math.min(Math.max(n.point[long], Math.min(s.de[long], s.a[long])), Math.max(s.de[long], s.a[long])) };
        const m = noeudPour(projete);
        surAxe.add(m);
        if (m === n) continue;
        n.aretes.push({ vers: m, cheminement: ch.id, circuits: ch.circuits ?? [] });
        m.aretes.push({ vers: n, cheminement: ch.id, circuits: ch.circuits ?? [] });
      }
      const sens = Math.sign(s.a[long] - s.de[long]);
      const chaine = [...surAxe].sort((p, q) => sens * (p.point[long] - q.point[long]));
      // La chaîne remplace l'arête directe du segment, qui court-circuiterait ses
      // maillons à longueur égale.
      if (chaine.length > 2) {
        a.aretes = a.aretes.filter((x) => !(x.vers === b && x.cheminement === ch.id));
        b.aretes = b.aretes.filter((x) => !(x.vers === a && x.cheminement === ch.id));
      }
      for (let i = 1; i < chaine.length; i += 1) {
        chaine[i - 1].aretes.push({ vers: chaine[i], cheminement: ch.id, circuits: ch.circuits ?? [] });
        chaine[i].aretes.push({ vers: chaine[i - 1], cheminement: ch.id, circuits: ch.circuits ?? [] });
      }
    }
  }

  // Un piquage au milieu d'un conduit : le conduit traversé y passe, donc il
  // compte pour deux dans le degré du nœud.
  for (const n of noeuds) {
    for (const { segment } of segments) {
      if (pointDansSegment(n.point, segment, tol)) n.degre += 2;
    }
  }

  return {
    noeuds,
    noeudAu(point) {
      return noeuds.find((n) => memePoint(n.point, point, tol)) ?? null;
    },
    /** Les nœuds qu'une boîte à volume contient, le sien compris. */
    noeudsDansBoite(boite) {
      const n = noeuds.find((x) => memePoint(x.point, boite.position, tol));
      const dedans = noeuds.filter((x) => boiteDe(x.point) === boite);
      return [...new Set([...(n ? [n] : []), ...dedans])];
    },
    /** Les nœuds où un composant se raccorde : les siens, ou son point unique. */
    noeudsDeComposant(id) {
      return noeuds.filter((x) => x.composants.includes(id));
    },
    noeudsDeDegreAuMoins(n) {
      return noeuds.filter((x) => x.degre >= n);
    },
  };
}

/**
 * Composants d'un circuit atteignables depuis le tableau, en n'empruntant que des
 * cheminements portant ce circuit. Les traversées sont franchissables sans
 * condition : ce sont des passages, pas des conducteurs.
 */
export function atteignablesDepuisTableau(graphe, modele, idCircuit) {
  const tableaux = (modele.composants ?? []).filter((c) => c.type === 'tableau');
  const depart = tableaux
    .map((t) => graphe.noeudAu(t.position))
    .filter(Boolean);

  const vus = new Set();
  const aVoir = [...depart];
  for (const n of depart) vus.add(n.cle);
  while (aVoir.length) {
    const n = aVoir.shift();
    for (const arete of n.aretes) {
      const passable = arete.circuits === null || arete.circuits.includes(idCircuit);
      if (!passable) continue;
      if (vus.has(arete.vers.cle)) continue;
      vus.add(arete.vers.cle);
      aVoir.push(arete.vers);
    }
  }

  const atteignables = new Set();
  for (const n of graphe.noeuds) {
    if (!vus.has(n.cle)) continue;
    for (const id of n.composants) atteignables.add(id);
  }

  // Un appareil peut partager le BOÎTIER d'un autre : c'est le cas d'un boîtier à
  // deux postes, dont les deux mécanismes sont distants de quelques centimètres.
  // Le second n'est l'extrémité d'aucun conduit, et serait donc déclaré orphelin —
  // alors qu'il est raccordé aux bornes de son voisin, dans une enceinte
  // accessible, ce que la constitution admet depuis sa v1.8.0.
  //
  // La propagation se fait sur le boîtier DÉCLARÉ, non sur la proximité : deux
  // appareils voisins sans boîtier commun restent distincts, et un boîtier dont
  // aucun membre n'est raccordé reste orphelin tout entier. C'est ce qui évite que
  // l'extension fabrique de l'atteignabilité à partir de rien.
  const parBoitier = new Map();
  for (const c of modele.composants ?? []) {
    if (!c.boitier) continue;
    if (!parBoitier.has(c.boitier)) parBoitier.set(c.boitier, []);
    parBoitier.get(c.boitier).push(c.id);
  }
  for (const membres of parBoitier.values()) {
    if (membres.some((id) => atteignables.has(id))) for (const id of membres) atteignables.add(id);
  }

  const orphelins = (modele.composants ?? [])
    .filter((c) => c.circuit === idCircuit && !atteignables.has(c.id))
    .map((c) => c.id);

  return { atteignables, orphelins, sansTableau: depart.length === 0 };
}

/**
 * Dijkstra sur les arêtes franchissables par un circuit, avec MÉMORISATION DU
 * PRÉDÉCESSEUR.
 *
 * Le prédécesseur ne coûte rien à garder et change ce que le socle sait dire : les
 * distances seules répondent « à quelle longueur », le prédécesseur répond « par
 * où » — donc quels conduits un conducteur emprunte réellement, ce dont dépendent
 * le décompte des fils d'un tube et le métré des conducteurs.
 */
function parcourir(graphe, idCircuit, departs) {
  const distances = new Map();
  const venantDe = new Map();
  for (const n of departs) distances.set(n.cle, 0);
  const aVoir = [...departs];
  while (aVoir.length) {
    aVoir.sort((a, b) => distances.get(a.cle) - distances.get(b.cle));
    const n = aVoir.shift();
    for (const arete of n.aretes) {
      const passable = arete.circuits === null || arete.circuits.includes(idCircuit);
      if (!passable) continue;
      const pas = Math.hypot(
        arete.vers.point.x - n.point.x,
        arete.vers.point.y - n.point.y,
        arete.vers.point.z - n.point.z,
      );
      const candidate = distances.get(n.cle) + pas;
      if (!distances.has(arete.vers.cle) || candidate < distances.get(arete.vers.cle) - 1e-9) {
        distances.set(arete.vers.cle, candidate);
        venantDe.set(arete.vers.cle, { noeud: n, arete });
        aVoir.push(arete.vers);
      }
    }
  }
  return { distances, venantDe };
}

/**
 * Le nœud par lequel un point est effectivement raccordé.
 *
 * Un appareil peut ne toucher aucun conduit et n'être rattaché que par le BOÎTIER
 * qu'il déclare — c'est le cas de la commande intérieure, à quelques centimètres
 * de la boîte qui la porte. Sans ce report, un chemin partant d'elle n'existerait
 * pas, et le socle conclurait à l'absence de trajet là où il y a seulement un
 * raccordement en enceinte accessible. Même mécanisme que celui de
 * `atteignablesDepuisTableau`, et fondé sur la même déclaration : le boîtier, non
 * la proximité.
 */
function noeudRaccorde(graphe, modele, point) {
  const n = graphe.noeudAu(point);
  if (n && n.aretes.length > 0) return n;
  const tol = modele.presentation?.toleranceRaccordement ?? 0;
  const ici = (modele.composants ?? []).find((c) => memePoint(c.position, point, tol));
  // Un appareil raccordé par ses EXTRÉMITÉS n'a pas de nœud à son centre : il se
  // rejoint par les points qu'il déclare. On rend d'abord ceux qui sont le siège
  // d'une arête — le parcours le plus court départagera ensuite, et un point
  // d'arrivée arbitraire ne ferait qu'allonger le trajet sans le changer.
  const siens = ici && Array.isArray(ici.raccords) && ici.raccords.length > 0 ? graphe.noeudsDeComposant(ici.id) : [];
  if (siens.length > 0) {
    const relies = siens.filter((x) => x.aretes.length > 0);
    return (relies.length > 0 ? relies : siens)[0];
  }
  if (!ici?.boitier) return n;
  for (const autre of modele.composants ?? []) {
    if (autre.id === ici.id || autre.boitier !== ici.boitier) continue;
    const m = graphe.noeudAu(autre.position);
    if (m && m.aretes.length > 0) return m;
  }
  return n;
}

/**
 * Le chemin d'un point à un autre, en n'empruntant que des cheminements portant le
 * circuit : les conduits traversés, dans l'ordre, et la longueur parcourue.
 *
 * Rend `null` quand il n'y a pas de chemin — un conducteur dont une destination
 * n'est pas joignable ne se devine pas.
 */
export function cheminEntre(graphe, modele, idCircuit, depart, arrivee) {
  const a = noeudRaccorde(graphe, modele, depart);
  const b = noeudRaccorde(graphe, modele, arrivee);
  if (!a || !b) return null;
  if (a.cle === b.cle) return { cheminements: [], longueur: 0, pas: [], depart: a, arrivee: b };

  const { distances, venantDe } = parcourir(graphe, idCircuit, [a]);
  if (!distances.has(b.cle)) return null;

  // Les pas parcourus, du départ à l'arrivée : c'est la topologie du chemin — par
  // où il passe, et donc où deux chemins d'un même conducteur se séparent. Les
  // conduits seuls ne le disent pas.
  const cheminements = [];
  const pasParcourus = [];
  let n = b;
  while (n.cle !== a.cle) {
    const pas = venantDe.get(n.cle);
    if (!pas) return null;
    pasParcourus.unshift({ de: pas.noeud, vers: n, arete: pas.arete });
    // Une traversée de paroi est un passage, non un conduit : elle compte dans la
    // longueur et n'apparaît dans aucune liste de tubes.
    if (pas.arete.cheminement && !cheminements.includes(pas.arete.cheminement))
      cheminements.unshift(pas.arete.cheminement);
    n = pas.noeud;
  }
  return { cheminements, longueur: distances.get(b.cle), pas: pasParcourus, depart: a, arrivee: b };
}

/**
 * Longueur de conduit entre le tableau et chaque composant d'un circuit, en
 * suivant le tracé réel.
 *
 * Le socle ne calcule rien d'électrique : il fournit une **longueur**, qui est une
 * grandeur géométrique. C'est la note de calcul qui en tire une chute de tension.
 * Mais cette longueur était jusqu'ici à relever au mètre ruban ou à estimer, alors
 * que le tracé la contient — et c'est la longueur du chemin le plus long, non le
 * métré total, qui décide de la chute de tension.
 */
export function longueursDepuisTableau(graphe, modele, idCircuit) {
  const tableaux = (modele.composants ?? []).filter((c) => c.type === 'tableau');
  const depart = tableaux.map((t) => graphe.noeudAu(t.position)).filter(Boolean);
  if (depart.length === 0) return { parComposant: new Map(), plusLong: null };

  // Dijkstra : les arêtes ont une longueur, donc un parcours en largeur ne suffit pas.
  const { distances } = parcourir(graphe, idCircuit, depart);

  const parComposant = new Map();
  for (const n of graphe.noeuds) {
    if (!distances.has(n.cle)) continue;
    for (const id of n.composants) parComposant.set(id, distances.get(n.cle));
  }

  let plusLong = null;
  for (const c of modele.composants ?? []) {
    if (c.circuit !== idCircuit) continue;
    const l = parComposant.get(c.id);
    if (l === undefined) continue;
    if (!plusLong || l > plusLong.longueur) plusLong = { id: c.id, reference: c.reference, longueur: l };
  }
  return { parComposant, plusLong };
}

/** Points de tous les cheminements, utile au rendu comme aux contrôles. */
export { pointsDeCheminement };
