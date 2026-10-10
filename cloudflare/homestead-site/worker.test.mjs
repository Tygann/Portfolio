import { test } from 'node:test';
import assert from 'node:assert/strict';
import worker from './worker.js';
const request = (path, options) => new Request('https://homesteadcontrol.com' + path, options);
test('maps website pages and assets while dropping credentials', async () => {
  const original = globalThis.fetch;
  const seen = [];
  globalThis.fetch = async request => { seen.push(request); return new Response('ok'); };
  try {
    for (const [path, expected] of [['/legal', '/homestead/legal/'], ['/legal/', '/homestead/legal/'], ['/navigation.js', '/navigation.js'], ['/robots.txt', '/homestead/robots.txt'], ['/sitemap.xml', '/homestead/sitemap.xml'], ['/social/homestead.png', '/social/homestead.png'], ['/', '/homestead/'], ['/support', '/homestead/support/'], ['/privacy/', '/homestead/privacy/'], ['/styles.css', '/styles.css'], ['/homestead/screens/1-dark.webp', '/homestead/screens/1-dark.webp']]) {
      await worker.fetch(request(path + '?test=1', { headers: { Authorization: 'Bearer test', Cookie: 'test=1' } }));
      const upstream = seen.at(-1);
      assert.equal(upstream.url, 'https://tylerkeegan.com' + expected + '?test=1');
      assert.equal(upstream.headers.has('Authorization'), false);
      assert.equal(upstream.headers.has('Cookie'), false);
    }
    await worker.fetch(request('/privacy', { method: 'HEAD' }));
    assert.equal(seen.at(-1).method, 'HEAD');
  } finally { globalThis.fetch = original; }
});
test('canonicalizes www and existing portfolio links', async () => {
  const r = await worker.fetch(new Request('https://www.homesteadcontrol.com/privacy?x=1'));
  assert.equal(r.status, 308);
  assert.equal(r.headers.get('Location'), 'https://homesteadcontrol.com/privacy?x=1');
  assert.equal((await worker.fetch(request('/homestead/legal/'))).headers.get('Location'), 'https://homesteadcontrol.com/legal');
  assert.equal((await worker.fetch(request('/homestead/support/'))).headers.get('Location'), 'https://homesteadcontrol.com/support');
});
test('does not serve API, OAuth, or unrelated routes', async () => {
  for (const host of ['api.homesteadcontrol.com', 'connect.homesteadcontrol.com', 'review.homesteadcontrol.com']) {
    assert.equal((await worker.fetch(new Request('https://' + host + '/'))).status, 404);
  }
  for (const path of ['/mobile-app/push', '/admin/test-push', '/unknown', '/.well-known/apple-app-site-association']) {
    assert.equal((await worker.fetch(request(path))).status, 404);
  }
  assert.equal((await worker.fetch(request('/', { method: 'POST' }))).status, 405);
});
