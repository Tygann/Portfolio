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
