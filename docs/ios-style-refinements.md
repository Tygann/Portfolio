# iOS-inspired shared styling

Applied across the portfolio and app sites: clearer system-text typography, capsule buttons and press states, softer project chips, refined cards, selective header/popover translucency, and a mobile navigation disclosure with keyboard and focus support. Motion respects reduced-motion preferences.

## Backup

Before these changes, commit `4935cd9` was preserved as the pushed tag `portfolio-before-ios-2026-10-09`. A source ZIP is also saved at `/Users/tyler/Developer/Portfolio-backups/portfolio-before-ios-2026-10-09.zip`. To undo this styling pass without discarding later work, revert the commit that adds this document and redeploy the two website Workers.

## Verification

All ten pages checked at 320, 390, 760, and 1024 CSS pixels without horizontal overflow. Browser checks covered navigation links, keyboard opening, Escape dismissal and focus return, appearance selection, and mutually exclusive popovers. JavaScript syntax, search metadata, Worker routing tests, and whitespace checks passed. No formal screen-reader audit was performed in this pass.

The website Worker asset allowlists include navigation.js; API and authentication routing is unchanged.

## Second pass

Standard system headings and semibold hierarchy; visually smaller header actions with 44px hit areas; side-by-side Homestead/Renfo desktop heroes with shorter copy; quieter contribution labels; lower icon shadows; featured customization/festival panels; and removal of empty screenshot frames. Added reduced-transparency and increased-contrast CSS fallbacks. Original backup tag and ZIP retained.

Validated all ten pages at 320, 390, 760, and 1024 CSS pixels with no horizontal overflow. Mobile navigation opening and focus were checked again. Search metadata and Worker routing tests passed. Screen-reader and browser zoom verification remain outstanding; CSS media fallbacks are implemented but were not tested against OS accessibility settings.

## Typography and spacing polish

Defined shared 8/16/24/32/48/64/96px spacing values, eased body tracking, distinguished section and card heading sizes/leading, tightened project metadata spacing, and retained the 8px card action gap and 44px link targets. Light cards use subtle outlines without shadows; dark mode slightly strengthens outline separation. Shared decorative chevrons and an SVG menu checkmark align control details. Content, screenshots, app palettes, and the original backup are retained.

Checks: all ten pages at 320/390/760/1024 CSS pixels without horizontal overflow, light/dark appearance switching and visual inspection, JavaScript syntax, search metadata, and whitespace validation.

## Consistency pass

Shared corner tokens: 8px control rows, 16px menus, 24px cards, 32px feature panels. Hover feedback is limited to fine pointers; menu rows share pressed and focus states, with reduced-motion support. Featured panels stack at intermediate 761–1000px widths to avoid crowding the device imagery.

Validation: ten pages at eight widths (320, 390, 740, 760, 780, 900, 1000, 1024 CSS pixels), no horizontal overflow; all ten pages switched between Light and Dark without overflow. Metadata and whitespace checks passed. This was not a new formal contrast or screen-reader audit.

## Unified app landing pages

This supersedes the split-hero and selected cropped-panel designs above. All five app landing pages use the app-site class: centered icon/headline/copy, stacked primary and secondary actions, full device frames below the hero, and alternating screenshot feature rows that stack at 900px. Shared sizing and spacing live in CSS; palettes and actual content remain app-specific.

Reeve, DishFork, and iWatch retain placeholder hero frames; iWatch also retains two feature frames until screenshots are available. No blank frames were added to support/privacy pages.

Verified all five app pages in Light and Dark at measured 320, 390, 760, 900, and 1280 CSS pixel widths: 50 checks passed without horizontal overflow, with centered heroes and stacked actions. Metadata validation and whitespace checks passed. The original backup remains unchanged.
