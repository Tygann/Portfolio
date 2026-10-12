# Shared borders

The active styles in `styles.css` use two component variants. Both remain uniform 1px solid edges; keyboard focus is a separate outline.

- **Surface:** app cards, contact panels, Resume/LinkedIn pills, appearance/navigation popovers, and the floating app header. Each supplies its base surface color through `--surface-border-color`. `--border-surface` uses a bounded OKLCH lightness shift, with a small chroma boost. A subtle color-mix fallback supports browsers without relative colors.
- **Filled control:** primary `.button` links and header `.pill` links, including Explore, Email, TestFlight, and app-site actions. They supply `--button` and `--on-button`; `--border-filled` mixes the fill with 16% of its foreground, preserving the preferred Explore treatment.

`--surface-border` selects the appropriate variant for each component. Hover and press affect the fill and edge together. Increased-contrast preferences strengthen panel/control outlines; reduced-motion preferences disable control scaling and transitions.

Open hero/About/feature sections stay borderless. Footer separators remain separators, and official App Store badges and device artwork are not altered. Preserve button dimensions when accounting for border width. Bump active HTML stylesheet versions after shared CSS changes.
