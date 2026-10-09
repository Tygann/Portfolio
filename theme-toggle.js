// Shared header appearance menu. Auto follows the system preference.
(() => {
  const DARK = '(prefers-color-scheme: dark)';
  const svg = body => `<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${body}</svg>`;
  const options = [
    { mode: 'auto', label: 'Auto', icon: svg('<circle cx="12" cy="12" r="8"/><path d="M12 4a8 8 0 0 1 0 16z" fill="currentColor"/>') },
    { mode: 'light', label: 'Light', icon: svg('<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>') },
    { mode: 'dark', label: 'Dark', icon: svg('<path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z"/>') },
  ];
  let mode = 'auto';
  try { mode = localStorage.getItem('theme') || 'auto'; } catch { /* Storage may be disabled. */ }
  if (!options.some(option => option.mode === mode)) mode = 'auto';

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

  const nav = document.querySelector('.nav-links');
  if (!nav) return;
  const picker = document.createElement('div');
  picker.className = 'appearance';
  const trigger = document.createElement('button');
  trigger.type = 'button';
  trigger.className = 'appearance-trigger';
  trigger.setAttribute('aria-label', 'Appearance');
  trigger.setAttribute('aria-haspopup', 'menu');
  trigger.setAttribute('aria-expanded', 'false');
  trigger.setAttribute('aria-controls', 'appearance-menu');
  trigger.title = 'Appearance';
  const menu = document.createElement('div');
  menu.id = 'appearance-menu';
  menu.className = 'appearance-menu';
  menu.setAttribute('role', 'menu');
  menu.setAttribute('aria-label', 'Appearance');
  menu.hidden = true;
  const buttons = options.map(option => {
    const button = document.createElement('button');
    button.type = 'button';
    button.setAttribute('role', 'menuitemradio');
    button.tabIndex = -1;
    button.innerHTML = '<span class="appearance-check" aria-hidden="true">✓</span>' + option.icon + '<span>' + option.label + '</span>';
    button.addEventListener('click', () => {
      mode = option.mode;
      try { localStorage.setItem('theme', mode); } catch { /* Keep the choice for this page. */ }
      apply();
      close(true);
    });
    menu.append(button);
    return button;
  });
  function close(focus = false) {
    menu.hidden = true;
    trigger.setAttribute('aria-expanded', 'false');
    if (focus) trigger.focus();
  }
  function open(index = options.findIndex(option => option.mode === mode)) {
    menu.hidden = false;
    trigger.setAttribute('aria-expanded', 'true');
    buttons[index].focus();
  }
  trigger.addEventListener('click', () => menu.hidden ? open() : close());
  trigger.addEventListener('keydown', event => {
    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      event.preventDefault();
      open(event.key === 'ArrowDown' ? 0 : buttons.length - 1);
    }
  });
  menu.addEventListener('keydown', event => {
    const index = buttons.indexOf(document.activeElement);
    if (event.key === 'Escape') { event.preventDefault(); close(true); }
    if (['ArrowDown', 'ArrowUp', 'Home', 'End'].includes(event.key)) {
      event.preventDefault();
      const next = event.key === 'Home' ? 0 : event.key === 'End' ? buttons.length - 1 : (index + (event.key === 'ArrowDown' ? 1 : -1) + buttons.length) % buttons.length;
      buttons[next].focus();
    }
  });
  document.addEventListener('click', event => { if (!picker.contains(event.target)) close(); });
  picker.addEventListener('focusout', event => { if (!picker.contains(event.relatedTarget)) close(); });
  picker.append(trigger, menu);
  nav.insertBefore(picker, nav.querySelector('.pill'));

  function apply() {
    darkRules.forEach(rule => { rule.media.mediaText = media(mode); });
    darkSources.forEach(source => { source.media = media(mode); });
    document.documentElement.style.colorScheme = mode === 'auto' ? '' : mode;
    trigger.innerHTML = options.find(option => option.mode === mode).icon;
    buttons.forEach((button, i) => button.setAttribute('aria-checked', options[i].mode === mode));
  }

  apply();
})();
