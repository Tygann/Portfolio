import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { resolve, extname, sep } from 'node:path';

const root = fileURLToPath(new URL('../dist/', import.meta.url));
const mime = { '.html': 'text/html', '.css': 'text/css', '.js': 'text/javascript', '.png': 'image/png', '.svg': 'image/svg+xml', '.webp': 'image/webp', '.jpg': 'image/jpeg', '.xml': 'application/xml', '.txt': 'text/plain', '.pdf': 'application/pdf' };
const redirects = new Map((await readFile(resolve(root, '_redirects'), 'utf8'))
  .split(/\r?\n/).filter(line => line && !line.startsWith('#'))
  .map(line => { const [from, to, status] = line.split(/\s+/); return [from.slice(1), { to, status: Number(status) }]; }));

createServer(async (req, res) => {
  try {
    if (!['GET', 'HEAD'].includes(req.method)) { res.writeHead(405).end(); return; }
    let path = decodeURIComponent(new URL(req.url, 'http://localhost').pathname).slice(1);
    if (redirects.has(path)) {
      const { to, status } = redirects.get(path);
      res.writeHead(status, { Location: to }).end();
      return;
    }
    if (path === '__tools/social/preview.html' && process.argv.includes('--social')) {
      const data = await readFile(new URL('../source-assets/social/preview.html', import.meta.url));
      res.writeHead(200, { 'Content-Type': 'text/html', 'Cache-Control': 'no-store' });
      res.end(req.method === 'HEAD' ? undefined : data);
      return;
    }
    if (!path || path.endsWith('/')) path += 'index.html';
    const parts = path.split('/');
    const target = resolve(root, path);
    if (parts.some(part => part.startsWith('.') || part.includes('\\')) ||
        !target.startsWith(root.endsWith(sep) ? root : root + sep) ||
        !mime[extname(path)]) {
      res.writeHead(404).end(); return;
    }
    const data = await readFile(target);
    res.writeHead(200, { 'Content-Type': mime[extname(path)], 'Cache-Control': 'no-store' });
    res.end(req.method === 'HEAD' ? undefined : data);
  } catch { res.writeHead(404).end(); }
}).listen(8766, '127.0.0.1', () => console.log('Preview: http://127.0.0.1:8766'));
