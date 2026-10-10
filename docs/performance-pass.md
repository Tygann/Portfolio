# Performance pass — October 9, 2026

Scope: ten current portfolio and app website pages. App APIs, the legacy archive, and social preview assets were not changed.

## Changes

- Added 264px PNG web variants for six icons, sufficient for the existing 88px tiles at 3x density. Original artwork remains available.
- Replaced Reeve and DishFork runtime icon requests with local optimized copies of the same artwork.
- Kept hero icons eager and prioritized; made the five portfolio card icons lazy. Existing feature screenshots retain their WebP format and lazy loading.
- Added explicit dimensions and asynchronous decoding to all images. Reserved the official App Store badge's rendered size without altering its artwork.
- Added content-versioned shared CSS/script URLs to avoid retaining stale assets across releases.

## Payload evidence

| Existing local icon | Original bytes | Web variant bytes | Reduction |
| --- | ---: | ---: | ---: |
| Tyler | 418207 | 58715 | 86.0% |
| Homestead | 1960466 | 67232 | 96.6% |
| iWatch | 948725 | 38706 | 95.9% |
| Renfo | 121175 | 60526 | 50.1% |

These four assets total 3,448,573 bytes before and 225,179 bytes after: 93.5% smaller. This is an asset-size comparison, not a claim about measured load-time improvement.

## Verification and limits

Checked all ten pages for explicit image dimensions, local icon assets under 100 KB, and successful eager image loads. Verified portfolio lazy icons load at the work section at their original 88px rendered size. Search metadata validation and whitespace checks pass. Existing screenshots already have fixed-aspect device containers; dimensions provide additional intrinsic sizing.

Shared CSS remains roughly 20 KB and the appearance script roughly 5 KB, with no framework runtime or web-font downloads. No throttled Lighthouse score or real-user Core Web Vitals were measured in this pass; device/network-specific LCP and CLS remain follow-up measurements.

Reference: [Google image-loading guidance](https://web.dev/learn/design/responsive-images).
