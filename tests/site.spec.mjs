import { test, expect } from '@playwright/test';
import { createRequire } from 'node:module';
import { mkdir } from 'node:fs/promises';
const require = createRequire(import.meta.url);
const axePath = require.resolve('axe-core/axe.min.js');
const routes = ['', 'renfo/', 'homestead/', 'iwatch/', 'iwatch/privacy/', 'iwatch/support/', 'reeve/', 'dishfork/', 'renfo/support/', 'renfo/privacy/', 'renfo/legal/', 'homestead/support/', 'homestead/privacy/', 'homestead/legal/'];

for (const width of [1440, 390, 320]) for (const theme of ['light', 'dark']) for (const route of routes) {
  test(`${route || 'portfolio'} ${width}px ${theme}`, async ({ page }, testInfo) => {
    await page.setViewportSize({ width, height: 900 });
    await page.emulateMedia({ colorScheme: theme });
    await page.goto(route || '/');
    await expect(page.locator('h1')).toHaveCount(1);
    if (!route) {
      const links = page.getByRole('navigation', { name: 'Professional background' });
      await expect(links.getByRole('link', { name: 'GitHub', exact: true })).toHaveAttribute('href', 'https://github.com/Tygann');
      await expect(links.getByRole('link')).toHaveCount(3);
    }
    if (await page.locator('body.app-site').count()) {
      await expect(page.getByRole('button', { name: 'Navigation', exact: true })).toHaveCount(0);
      const appearance = page.locator('.nav-links > .appearance');
      const action = page.locator('.nav-links > .pill');
      await expect(appearance).toBeVisible();
      await expect(action).toBeVisible();
      const pickerBox = await appearance.boundingBox();
      const actionBox = await action.boundingBox();
      expect(pickerBox.x + pickerBox.width).toBeLessThanOrEqual(actionBox.x);
      expect(Math.abs(pickerBox.y + pickerBox.height / 2 - actionBox.y - actionBox.height / 2)).toBeLessThan(2);
    }
    await page.evaluate(async () => Promise.all([...document.images].filter(i => new URL(i.src).origin === location.origin).map(i => {
      i.loading = 'eager'; return i.decode();
    })));
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    await page.addScriptTag({ path: axePath });
    const violations = await page.evaluate(async () => (await axe.run(document, {
      runOnly: { type: 'tag', values: ['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa'] },
    })).violations.map(v => ({ id: v.id, targets: v.nodes.map(n => n.target) })));
    expect(violations).toEqual([]);
    await mkdir('.codex-previews', { recursive: true });
    await page.screenshot({ path: `.codex-previews/${testInfo.project.name}-${route.replaceAll('/', '-') || 'portfolio-'}${width}-${theme}.png` });
    if (!route) {
      await page.locator('#about').evaluate(el => scrollTo({ top: el.offsetTop - 100, behavior: 'instant' }));
      await page.screenshot({ path: `.codex-previews/${testInfo.project.name}-portfolio-about-${width}-${theme}.png` });
    }
  });
}

test('preview excludes repository documents, source artwork, and authoring tools', async ({ request }) => {
  for (const path of ['/AGENTS.md', '/package.json', '/docs/resume/tyler-keegan-resume.docx',
    '/source-assets/icons/me.png', '/cloudflare/homestead-legacy/public/', '/__tools/social/preview.html']) {
    expect((await request.get(path)).status()).toBe(404);
  }
  expect((await request.get('/assets/tyler-keegan-resume.pdf')).status()).toBe(200);
});

test('professional artwork and surfaces follow manual appearance overrides and Auto', async ({ page }) => {
  for (const system of ['light', 'dark']) {
    await page.emulateMedia({ colorScheme: system });
    await page.goto('/');
    const links = page.getByRole('navigation', { name: 'Professional background' });
    const github = links.getByRole('link', { name: 'GitHub', exact: true });
    const linkedin = links.getByRole('link', { name: 'LinkedIn', exact: true });
    const verify = async appearance => {
      await expect.poll(() => github.locator('img').evaluate(img => img.currentSrc ? new URL(img.currentSrc).pathname : ''))
        .toBe(`/icons/github-lockup-${appearance === 'dark' ? 'white' : 'black'}.svg`);
      await expect.poll(() => linkedin.locator('img').evaluate(img => img.currentSrc ? new URL(img.currentSrc).pathname : ''))
        .toBe(appearance === 'dark' ? '/icons/linkedin-wordmark-white.svg' : '/icons/linkedin-wordmark-blue.svg');
      await expect(github).toHaveCSS('background-color', appearance === 'dark' ? 'rgb(36, 38, 41)' : 'rgb(255, 255, 255)');
      const heights = await links.getByRole('link').evaluateAll(elements => elements.map(el => el.getBoundingClientRect().height));
      expect(Math.max(...heights) - Math.min(...heights)).toBeLessThan(1);
    };
    for (const mode of ['Dark', 'Light', 'Auto']) {
      await page.getByRole('button', { name: 'Appearance', exact: true }).click();
      await page.getByRole('menuitemradio', { name: mode, exact: true }).click();
      await verify(mode === 'Auto' ? system : mode.toLowerCase());
    }
  }
});

test('floating navigation and appearance survive scrolling and resizing', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 900 });
  await page.goto('/renfo/');
  await page.evaluate(() => scrollTo({ top: 650, behavior: 'instant' }));
  await expect(page.locator('.nav')).toHaveClass(/nav-floating/);
  await expect(page.locator('.nav-links > .pill')).toBeVisible();
  await page.locator('#features').evaluate(el => { location.hash = el.id; });
  await expect.poll(() => page.locator('#features').evaluate(el => el.getBoundingClientRect().top)).toBeGreaterThanOrEqual(90);
  await page.locator('.contact .button').evaluate(el => { scrollTo(0, el.getBoundingClientRect().top + scrollY - 20); el.focus({ preventScroll: true }); });
  expect(await page.locator('.contact .button').evaluate(el => el.getBoundingClientRect().top)).toBeGreaterThanOrEqual(80);
  await page.getByRole('button', { name: 'Appearance', exact: true }).click();
  await page.getByRole('menuitemradio', { name: 'Dark', exact: true }).click();
  await page.keyboard.press('Escape');
  await expect(page.getByRole('button', { name: 'Appearance', exact: true })).toHaveAttribute('aria-expanded', 'false');
  await expect(page.getByRole('button', { name: 'Appearance', exact: true })).toBeFocused();
  await page.setViewportSize({ width: 1440, height: 900 });
  await expect(page.getByRole('button', { name: 'Appearance', exact: true })).toBeVisible();
  await page.evaluate(() => scrollTo({ top: 0, behavior: 'instant' }));
  await expect(page.locator('.nav')).not.toHaveClass(/nav-floating/);
  await page.emulateMedia({ reducedMotion: 'reduce' });
  expect(await page.evaluate(() => getComputedStyle(document.documentElement).scrollBehavior)).toBe('auto');
});

test('header download action stays visible and aligned while scrolling', async ({ page }) => {
  for (const width of [1440, 390, 320]) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto('/renfo/');
    const action = page.locator('.nav-links > .pill');
    await expect(action).toBeVisible();
    const left = await page.locator('.nav-name').evaluate(el => el.getBoundingClientRect().left);
    await page.evaluate(() => scrollTo(0, 1500));
    await expect(action).toBeVisible();
    await expect.poll(() => page.locator('.nav-name').evaluate(el => el.getBoundingClientRect().left)).toBe(left);
    await action.focus();
    await page.evaluate(() => scrollTo(0, 0));
    await expect(page.locator('.hero .store-badge')).toBeInViewport({ ratio: 0.5 });
    await expect(action).toBeVisible();
    await action.evaluate(el => el.blur());
    await expect(action).toBeVisible();
  }
  await page.emulateMedia({ reducedMotion: 'reduce' });
  expect(await page.locator('.nav-inner').evaluate(el => getComputedStyle(el).transitionDuration)).toBe('0s');
});

test.describe('mobile appearance dismissal', () => {
  test.use({ hasTouch: true, isMobile: true, viewport: { width: 390, height: 900 } });

  test('outside taps, selection, and Escape preserve the reading position', async ({ page }) => {
    // Use screen taps so the test does not scroll controls into view before touching them.
    const tap = async locator => {
      await expect(locator).toBeVisible();
      const box = await locator.boundingBox();
      await page.touchscreen.tap(box.x + box.width / 2, box.y + box.height / 2);
    };
    for (const route of ['renfo/', 'homestead/', 'iwatch/', 'reeve/', 'dishfork/']) {
      await page.goto(route);
      await page.evaluate(() => scrollTo({ top: 650, behavior: 'instant' }));
      await expect(page.locator('.nav')).toHaveClass(/nav-floating/);
      const position = await page.evaluate(() => scrollY);
      const trigger = page.getByRole('button', { name: 'Appearance', exact: true });
      await tap(trigger);
      await expect(trigger).toHaveAttribute('aria-expanded', 'true');
      expect(await page.evaluate(() => scrollY)).toBe(position);
      // Tap noninteractive content: mobile browsers focus its tabindex=-1 main ancestor.
      await page.touchscreen.tap(30, 450);
      await expect(trigger).toHaveAttribute('aria-expanded', 'false');
      expect(await page.evaluate(() => scrollY)).toBe(position);
      await tap(trigger);
      // Re-select the current mode to isolate focus scrolling from theme/image layout changes.
      await tap(page.getByRole('menuitemradio', { name: 'Auto', exact: true }));
      await expect(trigger).toBeFocused();
      expect(await page.evaluate(() => scrollY)).toBe(position);
      await tap(trigger);
      await page.keyboard.press('Escape');
      await expect(trigger).toHaveAttribute('aria-expanded', 'false');
      await expect(trigger).toBeFocused();
      expect(await page.evaluate(() => scrollY)).toBe(position);
    }
  });
});
