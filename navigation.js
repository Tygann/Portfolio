// Mobile navigation uses ordinary links and a nonmodal disclosure.
(() => {
  const header = document.querySelector('.nav');
  const nav = header?.querySelector('.nav-links');
  if (!nav) return;
  const appPage = document.body.classList.contains('app-site');
  if (appPage) {
    // Keep one prominent download action while the hero action is on screen.
    // Preserve the header slot and never hide a keyboard-focused link.
    const heroAction = document.querySelector('.hero .actions > .store-badge, .hero .actions > .button');
    const headerAction = nav.querySelector(':scope > .pill');
    if (heroAction && headerAction) {
      let heroVisible = false;
      const updateAction = () => header.classList.toggle('hero-action-visible', heroVisible && document.activeElement !== headerAction);
      const actionObserver = new IntersectionObserver(([entry]) => {
        heroVisible = entry.intersectionRatio >= 0.5;
        updateAction();
      }, { rootMargin: '-92px 0px 0px 0px', threshold: [0, 0.5, 1] });
      actionObserver.observe(heroAction);
      headerAction.addEventListener('focus', updateAction);
      headerAction.addEventListener('blur', updateAction);
    }
    // Observe the original header position while keeping its space in the layout.
    const marker = document.createElement('div');
    marker.setAttribute('aria-hidden', 'true');
    marker.style.cssText = 'height:1px;margin-bottom:-1px;pointer-events:none';
    header.before(marker);
    const observer = new IntersectionObserver(([entry]) => {
      header.classList.toggle('nav-floating', !entry.isIntersecting);
    }, { rootMargin: '56px 0px 0px 0px' });
    observer.observe(marker);
    // Keep keyboard-focused content clear of the persistent floating bar.
    document.addEventListener('focusin', event => {
      if (header.contains(event.target) || !event.target.closest('main')) return;
      const top = event.target.getBoundingClientRect().top;
      const clearance = header.getBoundingClientRect().bottom + 16;
      if (top < clearance) window.scrollBy({ top: top - clearance, behavior: 'instant' });
    });
  }
  const links = [...nav.children].filter(element => element.tagName === 'A');
  if (!links.length) return;
  const trigger = document.createElement('button');
  trigger.type = 'button';
  trigger.className = 'navigation-toggle';
  trigger.setAttribute('aria-label', 'Navigation');
  trigger.setAttribute('aria-expanded', 'false');
  trigger.setAttribute('aria-controls', 'mobile-navigation');
  trigger.innerHTML = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M4 8h16M4 16h16"/></svg>';
  const panel = document.createElement('nav');
  panel.id = 'mobile-navigation';
  panel.className = 'navigation-panel';
  panel.setAttribute('aria-label', 'Site navigation');
  panel.hidden = true;
  links.forEach(link => {
    const copy = link.cloneNode(true);
    copy.removeAttribute('class');
    copy.removeAttribute('id');
    panel.append(copy);
  });
  function close(focus = false) {
    panel.hidden = true;
    trigger.setAttribute('aria-expanded', 'false');
    if (focus) trigger.focus();
  }
  trigger.addEventListener('click', () => {
    if (!panel.hidden) return close();
    document.dispatchEvent(new Event('site-navigation-open'));
    panel.hidden = false;
    trigger.setAttribute('aria-expanded', 'true');
    panel.querySelector('a').focus();
  });
  panel.addEventListener('click', event => { if (event.target.closest('a')) setTimeout(() => close(), 0); });
  header.addEventListener('keydown', event => {
    if (event.key === 'Escape' && !event.defaultPrevented && !panel.hidden) { event.preventDefault(); close(true); }
  });
  document.addEventListener('click', event => {
    if (!panel.contains(event.target) && !trigger.contains(event.target)) close();
  });
  // Touch Safari can blur a focused link before delivering its click.
  // Dismiss keyboard focus departures after Tab, not during pointer focus changes.
  header.addEventListener('keydown', event => {
    if (event.key === 'Tab') setTimeout(() => {
      if (!panel.contains(document.activeElement) && document.activeElement !== trigger) close();
    }, 0);
  });
  document.addEventListener('site-appearance-open', () => { if (!appPage) close(); });
  const mobile = matchMedia('(max-width: 760px)');
  function updateLayout() {
    close();
    if (!appPage) return;
    const picker = header.querySelector('.appearance');
    if (!picker) return;
    document.dispatchEvent(new Event('site-navigation-open'));
    if (mobile.matches) panel.append(picker);
    else nav.insertBefore(picker, nav.querySelector('.pill'));
  }
  mobile.addEventListener('change', updateLayout);
  nav.append(trigger);
  header.append(panel);
  header.classList.add('nav-ready');
  updateLayout();
})();
