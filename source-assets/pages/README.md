# Retired collaboration pages

The previous Reeve Money and DishFork marketing pages are preserved here unchanged
as source backups. They are excluded from the Astro build and deployment.

The portfolio cards now describe Tyler's role as Design Lead at Peach Byte Labs
and link directly to each official product website. Existing `/reeve` and
`/dishfork` URLs redirect there with HTTP 301 and are removed from the sitemap.

To restore a page, move its `index.astro` back to its original
`src/pages/<app>/index.astro` location, remove the corresponding redirects, and
review its copy, metadata, sitemap entry, and tests before publishing.
