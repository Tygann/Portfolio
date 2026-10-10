# iOS-inspired shared styling

Applied across the portfolio and app sites: clearer system-text typography, capsule buttons and press states, softer project chips, refined cards, selective header/popover translucency, and a mobile navigation disclosure with keyboard and focus support. Motion respects reduced-motion preferences.

## Backup

Before these changes, commit `4935cd9` was preserved as the pushed tag `portfolio-before-ios-2026-10-09`. A source ZIP is also saved at `/Users/tyler/Developer/Portfolio-backups/portfolio-before-ios-2026-10-09.zip`. To undo this styling pass without discarding later work, revert the commit that adds this document and redeploy the two website Workers.

## Verification

All ten pages checked at 320, 390, 760, and 1024 CSS pixels without horizontal overflow. Browser checks covered navigation links, keyboard opening, Escape dismissal and focus return, appearance selection, and mutually exclusive popovers. JavaScript syntax, search metadata, Worker routing tests, and whitespace checks passed. No formal screen-reader audit was performed in this pass.

The website Worker asset allowlists include navigation.js; API and authentication routing is unchanged.
