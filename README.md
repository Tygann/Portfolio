# Tyler Keegan portfolio and app websites

One repository maintains the portfolio at **tylerkeegan.com** and the marketing,
support, privacy, and legal pages for Renfo, Homestead, and iWatch. Reeve Money and
DishFork appear as collaboration cards linking to their official sites; Peach Byte Labs owns their policies.

Astro builds twelve content pages and three error pages into static HTML. No Astro browser runtime, server
adapter, or production Node service is required. Renfo and Homestead Workers
proxy the appropriate Portfolio pages while keeping app services separate.

## Repository layout

| Directory | Purpose |
| --- | --- |
| `src/pages/` | Public routes, page metadata, and explicit product copy |
| `src/components/` | Shared metadata, header, footer, and device frames |
| `src/layouts/` | Document shell, skip link, main landmark, and shared scripts |
| `src/data/` | Brand identity, primary actions, and content-versioned asset URLs |
| `public/` | Unprocessed browser assets, downloads, robots files, and sitemaps |
| `source-assets/` | Original icon artwork and social-preview authoring source |
| `dist/` | Generated deployment output; ignored by Git |
| `cloudflare/` | Branded-domain Workers, routing tests, and deployment instructions |
| `docs/` | Design decisions, audits, asset attribution/licenses, and editable resume |
| `scripts/` | Preview server, metadata validator, and preview authoring tools |
| `tests/` | Static-output checks and responsive browser/accessibility checks |

## Local development and verification

Use Node **22.12+** (24 LTS recommended) and Python 3. Install from the lockfile:

```sh
npm ci
npm run setup:browser
npm run dev
```

For a production-equivalent preview at `http://127.0.0.1:8766`:

```sh
npm run preview
```

Before publishing:

```sh
npm run build
npm run check:build
npm run check:routing
npm run check:metadata
npm run check:visual
```

Browser checks build and start their own preview server. They cover all twelve content
pages at desktop and two mobile widths, in light/dark appearance across Chromium,
Firefox, and WebKit, plus interaction
checks. Results go to ignored `.codex-previews/` and `test-results/` directories.
GitHub Actions runs these checks and retains browser artifacts for seven days.

## Making changes

- Edit page copy in `src/pages/`. The route folders keep existing public URLs.
- Edit shared styling and client behavior in `public/styles.css`,
  `public/theme-toggle.js`, and `public/navigation.js`. The build derives their
  version query strings from file contents; manual version bumps are unnecessary.
- Device screenshots stay under `public/<app>/screens/`, with descriptive names
  and matching `-light.webp` / `-dark.webp` pairs. Use the shared `Device` component;
  `hero` prioritizes the first screenshot and other screenshots load lazily.
- Keep originals in `source-assets/`; only optimized browser assets go in `public/`.
- Keep editable resume/PDF updates synchronized; see `docs/resume/README.md`.
- Use `npm run preview:social` and open `/__tools/social/preview.html?app=renfo`
  for the local-only social card renderer. Generated
  public sharing cards remain in `public/social/`.
- Preserve canonical branded domains and the provisional iWatch policy notice.

## Hosting

The Portfolio Cloudflare Pages build command is **`npm run build`** and its output
directory must be **`dist`**. The project root remains the repository root. Do not
publish the repository root or `public/`: page HTML is generated into `dist/`.
Development tooling, editable originals, documentation, and the legacy archive
are excluded from the active site output.
`public/_redirects` preserves previously published numbered screenshots and
original-icon URLs while serving their renamed or optimized replacements. It also
redirects the retired Reeve and DishFork routes to their official product sites.

Publish Portfolio before any required branded Worker deployment. See
`cloudflare/README.md` for routing, service boundaries, and rollback guidance, and
`CLOUD_WORKFLOW.md` for portable environment setup.
