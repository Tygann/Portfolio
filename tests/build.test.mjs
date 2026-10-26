import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile, readdir, stat } from 'node:fs/promises';
import { resolve } from 'node:path';
import { createHash } from 'node:crypto';
import homestead from '../cloudflare/homestead-site/worker.js';
import renfo from '../cloudflare/renfo-site/worker.js';

const root = resolve('dist');
async function files(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  return (await Promise.all(entries.map(entry => entry.isDirectory()
    ? files(resolve(directory, entry.name)) : resolve(directory, entry.name)))).flat();
}

test('static output contains twelve content pages, three error pages, and an OAuth fallback, without authoring files', async () => {
  const output = await files(root);
  assert.equal(output.filter(path => path.endsWith('.html')).length, 16);
  for (const path of output) {
    const relative = path.slice(root.length + 1).replaceAll('\\', '/');
    assert.ok(!/^(src|docs|scripts|source-assets|cloudflare|node_modules|_astro)\//.test(relative), relative);
    assert.ok(!/\.(astro|docx|mjs|rtf)$/.test(relative), relative);
  }
});

test('generated pages resolve local assets, links, and content-versioned shared files', async () => {
  for (const path of (await files(root)).filter(path => path.endsWith('.html'))) {
    const html = await readFile(path, 'utf8');
    for (const [, attribute, value] of html.matchAll(/\b(src|srcset|href)="([^"]*)"/g)) {
      for (const url of (attribute === 'srcset' ? value.split(',').map(item => item.trim().split(/\s+/)[0]) : [value]).filter(url => url.startsWith('/'))) {
        const pathname = url.split(/[?#]/)[0];
        let target = resolve(root, '.' + pathname);
        if (pathname.endsWith('/')) target = resolve(target, 'index.html');
        assert.ok((await stat(target)).isFile(), `${path}: ${attribute}=${url}`);
      }
    }
    // The OAuth fallback intentionally loads no shared scripts or navigation.
    if (path.endsWith('/iwatch/oauth/trakt/index.html')) continue;
    for (const name of ['styles.css', 'theme-toggle.js', 'navigation.js']) {
      const version = createHash('sha256').update(await readFile(resolve(root, name))).digest('hex').slice(0, 12);
      assert.ok(html.includes(`/${name}?v=${version}`), `${path}: ${name} version`);
    }
  }
});

test('asset compatibility and retired collaboration redirects have valid destinations', async () => {
  const redirects = await readFile(resolve(root, '_redirects'), 'utf8');
  const lines = redirects.split(/\r?\n/).filter(line => line && !line.startsWith('#'));
  assert.equal(lines.length, 40);
  for (const line of lines) {
    const [from, to, status] = line.split(/\s+/);
    assert.ok(from.startsWith('/'));
    assert.equal(status, '301');
    if (to.startsWith('/')) assert.ok((await stat(resolve(root, '.' + to))).isFile(), to);
    else assert.equal(to, from.startsWith('/reeve') ? 'https://reevemoney.com' : 'https://dishfork.com');
  }
});

test('branded Workers serve the assets referenced by generated landing pages', async () => {
  const originalFetch = globalThis.fetch;
  globalThis.fetch = async request => {
    const url = new URL(typeof request === 'string' ? request : request.url);
    assert.equal(url.hostname, 'tylerkeegan.com');
    assert.ok((await stat(resolve(root, '.' + url.pathname))).isFile(), url.pathname);
    return new Response('ok');
  };
  try {
    for (const [app, host, worker] of [['homestead', 'homesteadcontrol.com', homestead], ['renfo', 'renfo.app', renfo]]) {
      const html = await readFile(resolve(root, app, 'index.html'), 'utf8');
      for (const [, url] of html.matchAll(/\b(?:src|srcset)="(\/[^"\s]*)"/g)) {
        assert.equal((await worker.fetch(new Request(`https://${host}${url}`))).status, 200);
      }
      assert.equal((await worker.fetch(new Request(`https://${host}/styles.css`))).status, 200);
    }
  } finally { globalThis.fetch = originalFetch; }
});


test('iWatch callback association is restricted to the app and OAuth path', async () => {
  const association = JSON.parse(await readFile(resolve(root, '.well-known/apple-app-site-association'), 'utf8'));
  assert.deepEqual(association.webcredentials.apps, ['XKQ424HQ33.com.tyler.iWatch']);
  assert.deepEqual(association.applinks.details[0].appIDs, ['XKQ424HQ33.com.tyler.iWatch']);
  assert.deepEqual(association.applinks.details[0].components, [{'/': '/iwatch/oauth/trakt'}, {'/': '/iwatch/oauth/trakt/'}]);
  const html = await readFile(resolve(root, 'iwatch/oauth/trakt/index.html'), 'utf8');
  assert.ok(html.includes('noindex, nofollow'));
  assert.ok(html.includes('no-referrer'));
  assert.ok(!html.includes('<script'));
});
