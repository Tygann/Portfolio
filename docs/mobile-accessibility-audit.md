# Mobile and accessibility audit — October 9, 2026

Scope: portfolio, Reeve, DishFork, Renfo, Homestead, iWatch, and current Homestead/Renfo support and privacy pages. The frozen legacy archive was excluded.

## Findings and fixes

- Added a keyboard-visible Skip to content link and focusable main landmark on all ten pages, with sticky-header anchor clearance.
- Added consistent visible focus outlines and respected reduced motion for smooth scrolling.
- Increased appearance controls, mobile navigation/action links, and footer links to 44px-high targets. Inline links in prose remain inline.
- Made the card grid fit containers narrower than 300px; shortened contributor-page header buttons to Visit site and supplied destination-specific accessible names.
- Darkened the portfolio iWatch light-mode button from #0A84FF to #0A74DC: white-label contrast improved from 3.65:1 to 4.62:1.
- Darkened Reeve secondary light-mode text to #4C6972 to improve contrast over the hero gradient.
- Kept appearance selection working when browser local storage is unavailable.

## Verification

- Inspected all ten pages at measured CSS widths of 320, 390, and 760 pixels. Rechecked the narrow Reeve header after its label fix; no horizontal overflow remained.
- Checked light/dark palette values, one h1 per page, image alternative text, main landmarks, and skip links.
- Exercised menu keyboard opening, End navigation, Enter selection, Escape dismissal, and focus return. Verified Skip to content moves focus to main.
- Ran a blocked-storage script check, JavaScript syntax check, and git diff whitespace check.
- Reviewed representative mobile screenshots. Reduced-motion behavior was checked in CSS.

This is a targeted code and browser audit, not a formal WCAG certification. Physical-device testing and a full VoiceOver walkthrough remain useful follow-up checks.
