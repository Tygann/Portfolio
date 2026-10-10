import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { resolve, extname, sep } from 'node:path';

const root = fileURLToPath(new URL('../', import.meta.url));
const mime = { '.html': 'text/html', '.css': 'text/css', '.js': 'text/javascript', '.png': 'image/png', '.webp': 'image/webp', '.jpg': 'image/jpeg', '.xml': 'application/xml', '.txt': 'text/plain' };
const publicRoots = new Set(['renfo', 'homestead', 'iwatch', 'reeve', 'dishfork', 'icons', 'social']);
const publicFiles = new Set(['index.html', 'styles.css', 'theme-toggle.js', 'navigation.js', 'robots.txt', 'sitemap.xml']);

createServer(async (req, res) => {
  try {
    if (!['GET', 'HEAD'].includes(req.method)) { res.writeHead(405).end(); return; }
    let path = decodeURIComponent(new URL(req.url, 'http://localhost').pathname).slice(1);
    if (!path || path.endsWith('/')) path += 'index.html';
    const parts = path.split('/');
    const target = resolve(root, path);
    if (parts.some(part => part.startsWith('.') || part.includes('\\')) ||
        !target.startsWith(root.endsWith(sep) ? root : root + sep) ||
        !(publicFiles.has(path) || publicRoots.has(parts[0])) || !mime[extname(path)]) {
      res.writeHead(404).end(); return;
    }
    const data = await readFile(target);
    res.writeHead(200, { 'Content-Type': mime[extname(path)], 'Cache-Control': 'no-store' });
    res.end(req.method === 'HEAD' ? undefined : data);
  } catch { res.writeHead(404).end(); }
}).listen(8766, '127.0.0.1', () => console.log('Preview: http://127.0.0.1:8766'));
