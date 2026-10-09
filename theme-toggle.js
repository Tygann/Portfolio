// Development helper: a floating Auto / Light / Dark segmented picker.
// It rewrites the stylesheet's prefers-color-scheme media rules, so the CSS needs no changes.
// To remove it, delete this file and the <script src="/theme-toggle.js"> tag on each page.
(() => {
  const DARK = '(prefers-color-scheme: dark)';
  const svg = body => `<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${body}</svg>`;
  const options = [
    { mode: 'auto', label: 'Auto', icon: svg('<circle cx="12" cy="12" r="8"/><path d="M12 4a8 8 0 0 1 0 16z" fill="currentColor"/>') },
    { mode: 'light', label: 'Light', icon: svg('<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>') },
    { mode: 'dark', label: 'Dark', icon: svg('<path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z"/>') },
  ];
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

  const picker = document.createElement('div');
  picker.className = 'theme-toggle';
  picker.setAttribute('role', 'radiogroup');
  picker.setAttribute('aria-label', 'Appearance');
  const buttons = options.map(option => {
    const button = document.createElement('button');
    button.type = 'button';
    button.setAttribute('role', 'radio');
    button.setAttribute('aria-label', option.label);
    button.title = option.label;
    button.innerHTML = option.icon;
    button.addEventListener('click', () => {
      mode = option.mode;
      localStorage.setItem('theme', mode);
      apply();
    });
    picker.append(button);
    return button;
  });

  function apply() {
    darkRules.forEach(rule => { rule.media.mediaText = media(mode); });
    darkSources.forEach(source => { source.media = media(mode); });
    document.documentElement.style.colorScheme = mode === 'auto' ? '' : mode;
    buttons.forEach((button, i) => button.setAttribute('aria-checked', options[i].mode === mode));
  }

  document.body.append(picker);
  apply();
})();
