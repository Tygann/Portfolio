# Search and sharing — October 9, 2026

- All ten current public pages have an explicit title, description, absolute canonical URL, Open Graph tags, and large-image Twitter card metadata.
- Renfo uses renfo.app and Homestead uses homesteadcontrol.com as their canonical website domains, including support and privacy. Portfolio copies carry the same canonical tags. Reeve and DishFork canonicals remain portfolio contribution pages.
- Six branded 1200 × 630 PNG sharing cards use existing icons, headlines, and palettes. Support/privacy pages reuse their app card with page-specific titles and descriptions. App pages use app favicons.
- The portfolio, Renfo, and Homestead each publish a same-domain sitemap and robots.txt. No fabricated modification dates, ratings, or pricing were added.
- `python3 scripts/check-search.py` validates page metadata, PNG formats/dimensions, and sitemap coverage. Worker tests cover sitemap, robots, and social-image routing alongside existing service routes.

Search engines and sharing services choose when to refresh cached previews. Search Console submission and third-party share-debugger refreshes were not performed.

References: [Google canonical guidance](https://developers.google.com/search/docs/crawling-indexing/consolidate-duplicate-urls), [Google sitemap guidance](https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap), and [Open Graph protocol](https://ogp.me/).
