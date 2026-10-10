# Working preferences

- All site design, layout, styling, and interaction changes should follow current best practices and familiar user behavior and expectations. Prioritize clear hierarchy, responsive layouts, accessibility, readable typography, consistent controls, and performance.
- Follow Apple's design guidelines as closely as practical for the web, including relevant Human Interface Guidelines and App Store marketing asset requirements. Adapt platform guidance thoughtfully to website behavior and each app's identity; verify current official guidance when needed.
- Complete requested updates, run checks appropriate to the change, then commit and push changes that are suitable for the repository. The user has authorized this workflow; do not ask again for routine commits and pushes.
- Before committing, review the diff and keep unrelated changes, secrets, generated previews, and temporary files out of the commit. Never force-push or overwrite unrelated work to complete this workflow.
- For visual changes, include relevant desktop and mobile screenshots and briefly explain the changes they demonstrate. Use project-local preview files where practical. If the user's client cannot display them, acknowledge that limitation rather than claiming successful delivery.
- Default app marketing pages to five device screenshots: one hero and four feature rows, each explaining a distinct benefit. Use consistent device sizes, spacing, and alternating desktop columns, with copy before devices on mobile. Keep placeholder frames when screenshots are unavailable; use fewer rows when an app has fewer meaningful benefits rather than adding repetitive or invented content. This is a site convention, not an Apple requirement.
- Keep placeholder device frames on app pages that do not yet have screenshots so the app-page layouts remain consistent.
- Report what changed, the checks performed, and whether the commit and push succeeded. Report any blocked push plainly.

# Repository context

- For cloud environment setup and portable preview/browser checks, follow `CLOUD_WORKFLOW.md`. Use `npm ci` and the checked-in lockfile; development tooling is not part of the deployed static site.
- This repository contains static portfolio and app marketing pages with shared styling in `styles.css`.
- Renfo and Homestead branded sites use the page sources here through the Cloudflare routing described in `cloudflare/README.md`.
- Keep archived files in `cloudflare/homestead-legacy` unchanged unless the user specifically requests archive changes.
- When shared CSS changes, update its version query in the active HTML pages to avoid stale cached styling.
- Validate metadata with `scripts/check-search.py`. When relevant, run the Cloudflare Worker routing tests with `node --test cloudflare/renfo-site/worker.test.mjs cloudflare/homestead-site/worker.test.mjs`.
