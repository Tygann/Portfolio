# Deployment naming and ownership

Use lowercase `<product>-<role>` names: `site` for marketing/informational
websites, `web` for browser applications, and `api` for application backends.
Use an environment suffix only for separate deployments, such as
`renfo-api-staging`, with separate credentials and storage.

| Name | Platform | Source | Public domains |
| --- | --- | --- | --- |
| portfolio-site | Pages | Tygann/Portfolio | tylerkeegan.com |
| renfo-site | Worker | Portfolio/cloudflare/renfo-site | renfo.app, www.renfo.app |
| renfo-web | Pages | Tygann/Renfo/web | web.renfo.app |
| renfo-api | Worker | Tygann/Renfo/api | Explicit /api/* routes on renfo.app, www.renfo.app, web.renfo.app, dev.renfo.app |
| homestead-site | Worker | Portfolio/cloudflare/homestead-site | homesteadcontrol.com, www.homesteadcontrol.com |
| homestead-api | Worker | Tygann/Homestead/api | api.homesteadcontrol.com, connect.homesteadcontrol.com |
| keegdom-site | Pages | Tygann/Keegdom | keegan.me, www.keegan.me |

Pages project renames preserve existing hostnames: portfolio-8gp.pages.dev,
renfo.pages.dev, and keegdom.pages.dev. Use the new project names in CLI commands.
The Renfo Pages project publishes the static web directory without a build step
and watches only web/**. Its development tunnel explicitly uses the production
API today; a future staging hostname must not inherit that routing.

Keep web clients, APIs, and marketing sites separately deployable. Homestead's
small connect metadata page remains with its API. Branded website Workers share
Portfolio content but keep their distinct routing and rollback boundaries.
