import { test, expect } from '@playwright/test';
import { createRequire } from 'node:module';
import { mkdir } from 'node:fs/promises';
const require = createRequire(import.meta.url);
const axePath = require.resolve('axe-core/axe.min.js');
const routes = ['', 'renfo/', 'homestead/', 'iwatch/', 'reeve/', 'dishfork/', 'renfo/support/', 'renfo/privacy/', 'renfo/legal/', 'homestead/support/', 'homestead/privacy/'];

for (const width of [1440, 390, 320]) for (const theme of ['light', 'dark']) for (const route of routes) {
  test(`${route || 'portfolio'} ${width}px ${theme}`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.emulateMedia({ colorScheme: theme });
    await page.goto(route || '/');
    await expect(page.locator('h1')).toHaveCount(1);
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
    await page.screenshot({ path: `.codex-previews/${route.replaceAll('/', '-') || 'portfolio-'}${width}-${theme}.png` });
  });
}

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
  await page.getByRole('button', { name: 'Navigation', exact: true }).click();
  await page.getByRole('button', { name: 'Appearance', exact: true }).click();
  await page.getByRole('menuitemradio', { name: 'Dark', exact: true }).click();
  await page.keyboard.press('Escape');
  await expect(page.getByRole('button', { name: 'Navigation', exact: true })).toHaveAttribute('aria-expanded', 'false');
  await page.setViewportSize({ width: 1440, height: 900 });
  await expect(page.getByRole('button', { name: 'Appearance', exact: true })).toBeVisible();
  await page.evaluate(() => scrollTo({ top: 0, behavior: 'instant' }));
  await expect(page.locator('.nav')).not.toHaveClass(/nav-floating/);
  await page.emulateMedia({ reducedMotion: 'reduce' });
  expect(await page.evaluate(() => getComputedStyle(document.documentElement).scrollBehavior)).toBe('auto');
});

test('download action stays available without competing with the visible hero', async ({ page }) => {
  for (const width of [1440, 390, 320]) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto('/renfo/');
    const action = page.locator('.nav-links > .pill');
    await expect(action).toBeHidden();
    const left = await page.locator('.nav-name').evaluate(el => el.getBoundingClientRect().left);
    await page.evaluate(() => scrollTo(0, 1500));
    await expect(action).toBeVisible();
    await expect.poll(() => page.locator('.nav-name').evaluate(el => el.getBoundingClientRect().left)).toBe(left);
    await action.focus();
    await page.evaluate(() => scrollTo(0, 0));
    await expect(page.locator('.hero .store-badge')).toBeInViewport({ ratio: 0.5 });
    await expect(action).toBeVisible();
    await action.evaluate(el => el.blur());
    await expect(action).toBeHidden();
  }
  await page.emulateMedia({ reducedMotion: 'reduce' });
  expect(await page.locator('.nav-inner').evaluate(el => getComputedStyle(el).transitionDuration)).toBe('0s');
});
