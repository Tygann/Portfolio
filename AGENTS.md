# Working preferences

- Complete requested updates, run checks appropriate to the change, then commit and push changes that are suitable for the repository. The user has authorized this workflow; do not ask again for routine commits and pushes.
- Before committing, review the diff and keep unrelated changes, secrets, generated previews, and temporary files out of the commit. Never force-push or overwrite unrelated work to complete this workflow.
- For visual changes, include relevant desktop and mobile screenshots and briefly explain the changes they demonstrate. Use project-local preview files where practical. If the user's client cannot display them, acknowledge that limitation rather than claiming successful delivery.
- Keep placeholder device frames on app pages that do not yet have screenshots so the app-page layouts remain consistent.
- Report what changed, the checks performed, and whether the commit and push succeeded. Report any blocked push plainly.

# Repository context

- This repository contains static portfolio and app marketing pages with shared styling in `styles.css`.
- Renfo and Homestead branded sites use the page sources here through the Cloudflare routing described in `cloudflare/README.md`.
- Keep archived files in `cloudflare/homestead-legacy` unchanged unless the user specifically requests archive changes.
- When shared CSS changes, update its version query in the active HTML pages to avoid stale cached styling.
- Validate metadata with `scripts/check-search.py`. When relevant, run the Cloudflare Worker routing tests with `node --test cloudflare/renfo-site/worker.test.mjs cloudflare/homestead-site/worker.test.mjs`.
