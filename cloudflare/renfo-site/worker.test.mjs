import test from 'node:test';
import assert from 'node:assert/strict';
import worker from './worker.js';

test('privacy routes while preserving API and website routing', async () => {
  const original = globalThis.fetch;
  const calls = [];
  globalThis.fetch = async input => {
    calls.push(typeof input === 'string' ? input : input.url);
    return new Response('ok');
  };
  try {
    for (const [path, upstream] of [
      ['/navigation.js', 'https://tylerkeegan.com/navigation.js'],
      ['/robots.txt', 'https://tylerkeegan.com/renfo/robots.txt'],
      ['/sitemap.xml', 'https://tylerkeegan.com/renfo/sitemap.xml'],
      ['/social/renfo.png', 'https://tylerkeegan.com/social/renfo.png'],
      ['/support', 'https://tylerkeegan.com/renfo/support/'],
      ['/support/?source=app', 'https://tylerkeegan.com/renfo/support/?source=app'],
      ['/privacy', 'https://tylerkeegan.com/renfo/privacy/'],
      ['/privacy/?source=app', 'https://tylerkeegan.com/renfo/privacy/?source=app'],
      ['/legal', 'https://tylerkeegan.com/renfo/legal/'],
      ['/legal/?source=footer', 'https://tylerkeegan.com/renfo/legal/?source=footer'],
      ['/', 'https://tylerkeegan.com/renfo/'],
      ['/api/v1/festivals', 'https://web.renfo.app/api/v1/festivals'],
      ['/.well-known/apple-app-site-association', 'https://web.renfo.app/.well-known/apple-app-site-association'],
      ['/styles.css', 'https://tylerkeegan.com/styles.css'],
    ]) {
      await worker.fetch(new Request('https://renfo.app' + path));
      assert.equal(calls.at(-1), upstream);
    }
    for (const [url, target] of [
      ['https://www.renfo.app/support', 'https://renfo.app/support'],
      ['https://www.renfo.app/privacy', 'https://renfo.app/privacy'],
      ['https://renfo.app/?festival=123', 'https://web.renfo.app/?festival=123'],
      ['https://renfo.app/account', 'https://web.renfo.app/account'],
    ]) {
      const response = await worker.fetch(new Request(url));
      assert.equal(response.status, 301);
      assert.equal(response.headers.get('Location'), target);
    }
  } finally {
    globalThis.fetch = original;
  }
});

test('explicit error page returns 404 while web-app routes keep their redirects', async () => {
  const original = globalThis.fetch;
  globalThis.fetch = async input => {
    assert.equal(input.url, 'https://tylerkeegan.com/renfo/404/');
    return new Response(input.method === 'HEAD' ? null : '<h1>Page not found.</h1>', { headers: { 'Content-Type': 'text/html' } });
  };
  try {
    for (const method of ['GET', 'HEAD']) {
      const response = await worker.fetch(new Request('https://renfo.app/404', { method }));
      assert.equal(response.status, 404);
      assert.equal(response.headers.get('X-Robots-Tag'), 'noindex');
      assert.equal(await response.text(), method === 'HEAD' ? '' : '<h1>Page not found.</h1>');
    }
    assert.equal((await worker.fetch(new Request('https://renfo.app/account'))).headers.get('Location'), 'https://web.renfo.app/account');
  } finally { globalThis.fetch = original; }
});
