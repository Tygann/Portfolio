# Portfolio cloud environment

Repository: `Tygann/Portfolio`. Use a private environment named `Portfolio`.
The website remains static; the Node dependencies are development tools only.

## Create the environment

In Codex on desktop or web, choose **Work in > Cloud > Select environment > Create environment**.
Select `Tygann/Portfolio`, then ask the setup task to:

> Prepare this static portfolio repository using AGENTS.md and CLOUD_WORKFLOW.md. Install Node.js 22 or newer and Python 3, run npm ci, and install Playwright Chromium with its Linux system dependencies using npx playwright install --with-deps chromium. Verify the preview server and run the routing, metadata, and visual checks. Configure repository access for commits and pushes requested by the user. Keep the environment private. Do not change hosting, DNS, API credentials, or production services.

Review the setup report and publish only after the cloud checks pass. Then select
the published environment for a new task on mobile. An existing local chat is not
automatically moved into that environment.

## Installation and checks

```sh
npm ci
npx playwright install --with-deps chromium
npm run check:routing
python3 scripts/check-search.py
npm run check:visual
```

`npm run preview` serves the active website at `http://127.0.0.1:8766`.
Playwright starts and stops that server automatically when running tests. Screenshots
are saved to `.codex-previews/`, which is excluded from Git. Use those screenshots
in visual-change reports, while confirming whether they display on the user's client.

The visual checks cover eleven active pages at 1440, 390, and 320 pixels in light and
dark appearance, including local image decoding, horizontal overflow, automated
accessibility checks, and floating-header/menu behavior. These checks do not establish
full accessibility certification or validate third-party artwork rights.

Allow package and browser downloads during setup. Renfo's official App Store badge
is served from `toolbox.marketingtools.apple.com`; allow that host for visual previews.
The checks deliberately validate local image assets, without treating external-service
availability as a repository failure.

GitHub authentication must be configured in the cloud environment; a local Git login
does not supply it. No production credentials are needed for the preview and checks.
Keep any required access in the environment's credential settings, never repository files.

## Routine tasks

Read AGENTS.md, update from the latest repository state, implement the request,
run relevant checks, present screenshots for visual changes, and commit and push
the requested changes. Coordinate concurrent tasks through branches or pull requests
to avoid overwriting work. Do not force-push.

Cloud environment publication and a first cloud task must be verified separately
from local validation. See the official setup documentation:
https://learn.chatgpt.com/docs/environments/cloud-environments
