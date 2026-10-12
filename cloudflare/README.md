# Homestead website hosting

The `portfolio-site` Pages project remains the source of the current website. `homestead-site`
proxies its Homestead pages and assets; it never handles app API or OAuth traffic.

Portfolio source pages live in `src/pages/`; browser assets live in `public/`.
Pages builds with `npm run build` and publishes only `dist/`. Repository folders
do not change the public `/homestead/`, `/renfo/`, `/icons/`, or shared script URLs.
Content hashes version shared CSS/scripts without changing Worker asset paths.

| Host | Owner |
| --- | --- |
| homesteadcontrol.com, www.homesteadcontrol.com | homestead-site |
| api.homesteadcontrol.com, connect.homesteadcontrol.com | Homestead repository: api/wrangler.jsonc |
| review.homesteadcontrol.com | Existing Cloudflare tunnel |

Email DNS records and the review tunnel are independent and must remain unchanged.

## Deployment

Use an authenticated Wrangler CLI. Run routing tests before deploying:

```
node --test cloudflare/homestead-site/worker.test.mjs
wrangler deploy --config cloudflare/homestead-site/wrangler.jsonc
```

The Homestead API deployment must retain only its api and connect custom domains.
Never add the root/www website domains back to its Wrangler configuration.

## Verification and rollback

Check root, support, privacy, screenshots, styles, and appearance on the branded
website. Check API GET /health and the connect page's OAuth metadata. Use existing
API tests for push behavior without registering production devices or sending pushes.

For website rollback, restore a known-good Portfolio build or homestead-site Worker
version. The retired API website handler remains recoverable from Homestead Git
history, but is no longer packaged or deployed by homestead-api.
Do not move api/connect, edit secrets, delete KV data, or change email/tunnel DNS.

## Renfo website routing

`renfo-site` is captured in `cloudflare/renfo-site/`. It serves the Portfolio Renfo
landing page, `/support`, `/privacy`, and `/legal` while preserving the existing API, well-known,
festival deep-link, and web-app routing. Deploy with:

```
node --test cloudflare/renfo-site/worker.test.mjs
wrangler deploy --config cloudflare/renfo-site/wrangler.jsonc
```

Publish the Portfolio page first, then verify `https://renfo.app/support` and `https://renfo.app/privacy`.

## Search and sharing

Each public domain exposes its own `/robots.txt` and `/sitemap.xml`. Portfolio
app copies canonicalize to the branded domains for Renfo and Homestead. Website
Workers also proxy `/social/` assets; API, OAuth, and festival routing stay separate.
Validate with `python3 scripts/check-search.py` and both Worker routing tests.

Social preview sources are in `source-assets/social/preview.html`; rendered 1200 × 630
PNG files are in `public/social/`. `npm run preview:social` exposes the noindex
renderer locally; it is excluded from the production build.

Homestead legal information is served from `/homestead/legal/` on Portfolio. Deploy the updated homestead-site Worker to enable the branded `/legal` route and its aliases; footer links use the Portfolio URL so they remain usable before that deployment.

## Missing pages

Portfolio Pages serves `dist/404.html` for missing URLs. Homestead's Worker fetches
the noindex page at `/homestead/404/` and returns it with HTTP 404 for unknown
website paths. It continues to reject unrelated hosts and unsupported methods.
Renfo exposes a branded HTTP 404 at `/404` while retaining its existing redirects
for unrecognized paths to the web app; this preserves account and festival routes.
Publish the Pages build before deploying these Worker changes.
