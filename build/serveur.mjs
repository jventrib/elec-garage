/**
 * Serveur de développement. Sans dépendance, et surtout **sans cache**.
 *
 * Pourquoi remplacer `python3 -m http.server` : les modules ES sont mis en cache
 * par le navigateur, et un seul module périmé suffit à produire une panne
 * incompréhensible — par exemple un `chargement.js` d'avant un changement de
 * signature, chargé avec un `main.js` d'après. Ici tout est servi en `no-store` :
 * la classe de problème disparaît au lieu de se diagnostiquer.
 *
 * Usage : node build/serveur.mjs [port]
 */

import { createServer } from 'node:http';
import { createReadStream, statSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join, normalize, extname } from 'node:path';
import { readFileSync } from 'node:fs';

const RACINE = join(dirname(fileURLToPath(import.meta.url)), '..');
const PORT = Number(process.argv[2] ?? 8080);

const TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.map': 'application/json; charset=utf-8',
};

const serveur = createServer((requete, reponse) => {
  const chemin = decodeURIComponent(new URL(requete.url, 'http://localhost').pathname);
  const relatif = normalize(chemin === '/' ? '/index.html' : chemin).replace(/^(\.\.[/\\])+/, '');
  const fichier = join(RACINE, relatif);

  // Le serveur ne doit pas sortir du dépôt, même en développement.
  if (!fichier.startsWith(RACINE)) {
    reponse.writeHead(403).end('Hors du dépôt');
    return;
  }

  let stat;
  try {
    stat = statSync(fichier);
  } catch {
    reponse.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
    reponse.end(`404 — ${relatif} introuvable`);
    console.log(`404 ${relatif}`);
    return;
  }
  if (stat.isDirectory()) {
    reponse.writeHead(404).end('404 — répertoire');
    return;
  }

  reponse.writeHead(200, {
    'Content-Type': TYPES[extname(fichier)] ?? 'application/octet-stream',
    'Content-Length': stat.size,
    // La ligne qui compte : aucun module périmé ne peut survivre à un rechargement.
    'Cache-Control': 'no-store, must-revalidate',
  });
  createReadStream(fichier).pipe(reponse);
});

serveur.on('error', (e) => {
  if (e.code === 'EADDRINUSE') {
    console.error(`Le port ${PORT} est déjà occupé — souvent par un serveur lancé précédemment.`);
    console.error(`Relancez sur un autre port : node build/serveur.mjs ${PORT + 11}`);
    console.error("Changer de port change aussi d'origine, donc vide le cache de modules du navigateur.");
    process.exit(1);
  }
  throw e;
});

serveur.listen(PORT, () => {
  let version = 'inconnue';
  try {
    version = /VERSION = '([^']+)'/.exec(readFileSync(join(RACINE, 'src/version.js'), 'utf8'))?.[1] ?? version;
  } catch {
    /* sans importance ici */
  }
  console.log(`Développement : http://localhost:${PORT}`);
  console.log(`Version servie depuis le disque : ${version}`);
  console.log('Servi sans cache. Si la page annonce une autre version, elle vient du cache du');
  console.log('navigateur : relancez sur un autre port pour changer d’origine.');
});
