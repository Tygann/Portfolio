# Homestead website hosting

The Portfolio Pages project remains the source of the current website. `homestead-site`
proxies its Homestead pages and assets; it never handles app API or OAuth traffic.

| Host | Owner |
| --- | --- |
| homesteadcontrol.com, www.homesteadcontrol.com | homestead-site |
| legacy.homesteadcontrol.com | homestead-legacy (static snapshot) |
| api.homesteadcontrol.com, connect.homesteadcontrol.com | Homestead repository: api/wrangler.jsonc |
| review.homesteadcontrol.com | Existing Cloudflare tunnel |

The legacy HTML and og.png were captured from the live old website on October 9,
2026. The archive is excluded from indexing. It contains no API or notification code.
Email DNS records and the review tunnel are independent and must remain unchanged.

## Deployment

Use an authenticated Wrangler CLI. Run routing tests before deploying:

```
node --test cloudflare/homestead-site/worker.test.mjs
wrangler deploy --config cloudflare/homestead-legacy/wrangler.jsonc
wrangler deploy --config cloudflare/homestead-site/wrangler.jsonc
```

The Homestead API deployment must retain only its api and connect custom domains.
Never add the root/www website domains back to its Wrangler configuration.

## Verification and rollback

Check root, support, privacy, screenshots, styles, and appearance on the branded
website. Check API GET /health and the connect page's OAuth metadata. Use existing
API tests for push behavior without registering production devices or sending pushes.

For rollback, move root/www back to homestead-api and restore those two entries in
its Wrangler configuration. The preserved old sitePage.ts remains available there.
Do not move api/connect, edit secrets, delete KV data, or change email/tunnel DNS.

## Renfo website routing

`renfo-site` is captured in `cloudflare/renfo-site/`. It serves the Portfolio Renfo
landing page, `/support`, and `/privacy` while preserving the existing API, well-known,
festival deep-link, and web-app routing. Deploy with:

```
node --test cloudflare/renfo-site/worker.test.mjs
wrangler deploy --config cloudflare/renfo-site/wrangler.jsonc
```

Publish the Portfolio page first, then verify `https://renfo.app/support` and `https://renfo.app/privacy`.
