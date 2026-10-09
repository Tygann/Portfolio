// Development helper: a floating Auto / Light / Dark switch.
// It rewrites the stylesheet's prefers-color-scheme media rules, so the CSS needs no changes.
// To remove it, delete this file and the <script src="/theme-toggle.js"> tag on each page.
(() => {
  const DARK = '(prefers-color-scheme: dark)';
  const modes = ['auto', 'light', 'dark'];
  const labels = { auto: 'Auto', light: 'Light', dark: 'Dark' };
  let mode = localStorage.getItem('theme') || 'auto';

  const media = mode => (mode === 'auto' ? DARK : mode === 'dark' ? 'all' : 'not all');

  // Find the dark-mode rules and <picture> sources once, before any are rewritten
  const darkRules = [];
  for (const sheet of document.styleSheets) {
    let rules;
    try { rules = sheet.cssRules; } catch { continue; }
    for (const rule of rules) {
      if (rule instanceof CSSMediaRule && rule.conditionText.includes('prefers-color-scheme: dark')) darkRules.push(rule);
    }
  }
  const darkSources = [...document.querySelectorAll('picture source[media*="prefers-color-scheme: dark"]')];

  function apply() {
    darkRules.forEach(rule => { rule.media.mediaText = media(mode); });
    darkSources.forEach(source => { source.media = media(mode); });
    document.documentElement.style.colorScheme = mode === 'auto' ? '' : mode;
    button.textContent = labels[mode];
    button.setAttribute('aria-label', `Appearance: ${labels[mode]}. Click to change.`);
  }

  const button = document.createElement('button');
  button.className = 'theme-toggle';
  button.addEventListener('click', () => {
    mode = modes[(modes.indexOf(mode) + 1) % modes.length];
    localStorage.setItem('theme', mode);
    apply();
  });
  document.body.append(button);
  apply();
})();
