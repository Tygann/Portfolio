# LinkedIn wordmarks

The portfolio profile link uses adapted LinkedIn wordmark artwork in a picture:

- Light appearance: `public/icons/linkedin-wordmark-blue.svg`, official brand-site
  vector paths with blue lettering and icon square, and white icon lettering.
- Dark appearance: `public/icons/linkedin-wordmark-white.svg`, vector paths from
  the `linkedin-logo-full` symbol embedded in LinkedIn's official brand homepage.
  The letter paths and proportions are preserved. Lettering and
  the icon square are white; a mask cuts the “in” lettering out of the square
  so the button background shows through, matching the treatment in the
  user’s screenshot of LinkedIn’s dark appearance.
  This is a color-adapted vector from LinkedIn's own artwork, not an unchanged
  downloadable white SVG. The extracted original is in
  `source-assets/logos/linkedin-logo-full.svg`.

The trademark symbol is removed from both displayed variants at the user's request.
The original source SVG and previously published blue PNG remain unchanged.

Both assets are displayed proportionally at 88px wide. Their alternative text is
LinkedIn and the button links to https://www.linkedin.com/in/tylerbkeegan. There is
no separate text recreating the wordmark. System appearance and the manual picker
select the matching artwork and button surface.

## Sources

Blue wordmark downloaded October 12, 2026:
https://content.linkedin.com/content/dam/me/business/en-us/amp/xbu/linkedin-revised-brand-guidelines/logos/linkedin-logo.zip

Official download page: https://brand.linkedin.com/downloads
Wordmark usage guidance: https://brand.linkedin.com/linkedin-logo

Vector wordmark source, retrieved October 12, 2026:
https://brand.linkedin.com/ (inline symbol `linkedin-logo-full`, viewBox 0 0 103 24).

Previously published 83 Ã— 20 white-lettered bitmap source:
https://github.com/linkedin/linkedin.github.com/blob/f22504bc48a280ee5dd76bd693166d5dbe03c3fe/images/linkedin-logo.png

## Previously published standalone marks

`public/icons/linkedin-mark-blue.png` and `public/icons/linkedin-mark-white.png`
remain available at their published URLs for compatibility. They are the unmodified
`LI-In-Bug.png` and `InBug-White.png` from:
https://content.linkedin.com/content/dam/me/business/en-us/amp/xbu/linkedin-revised-brand-guidelines/logos/in-logo.zip

The current button uses the adapted vector wordmarks, as requested by the user.
`public/icons/linkedin-wordmark.png` is also retained at its published URL, but is
no longer used by the button because its small raster canvas looked soft on
high-density displays.
