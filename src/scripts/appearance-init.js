// Inline in the head so a stored preference controls the first paint.
(() => {
  const system = matchMedia('(prefers-color-scheme: dark)');
  let mode = 'auto';
  try { mode = localStorage.getItem('theme') || 'auto'; } catch { /* Storage is optional. */ }
  if (!['auto', 'light', 'dark'].includes(mode)) mode = 'auto';
  function syncPictures(root = document) {
    root.querySelectorAll('picture source[data-dark], picture source[media*="prefers-color-scheme: dark"]').forEach(source => {
      source.dataset.dark = '';
      source.media = document.documentElement.dataset.theme === 'dark' ? 'all' : 'not all';
    });
  }
  function apply() {
    const theme = mode === 'auto' ? (system.matches ? 'dark' : 'light') : mode;
    document.documentElement.dataset.theme = theme;
    document.querySelectorAll('meta[data-theme-color]').forEach(meta => {
      meta.media = meta.dataset.themeColor === theme ? 'all' : 'not all';
    });
    syncPictures();
  }
  window.siteAppearance = {
    get mode() { return mode; },
    set(value) { mode = value; apply(); },
  };
  apply();
  // Theme-aware pictures enter the document after this head script executes.
  const observer = new MutationObserver(() => syncPictures());
  observer.observe(document.documentElement, { childList: true, subtree: true });
  document.addEventListener('DOMContentLoaded', () => { apply(); observer.disconnect(); }, { once: true });
  system.addEventListener('change', () => { if (mode === 'auto') apply(); });
})();
