import { test, expect } from '@playwright/test';

test('DishFork icon follows saved appearance and system changes', async ({ page }) => {
  await page.emulateMedia({ colorScheme: 'light' });
  await page.addInitScript(() => localStorage.setItem('theme', 'dark'));
  await page.goto('/');
  const icon = page.locator('.tile-dishfork img');
  await icon.scrollIntoViewIfNeeded();
  const selectedIcon = () => icon.evaluate(img => new URL(img.currentSrc).pathname);
  await expect.poll(selectedIcon).toBe('/icons/dishfork-dark-web.png');
  await page.evaluate(() => window.siteAppearance.set('light'));
  await expect.poll(selectedIcon).toBe('/icons/dishfork-light-web.png');
  await page.evaluate(() => window.siteAppearance.set('auto'));
  await page.emulateMedia({ colorScheme: 'dark' });
  await expect.poll(selectedIcon).toBe('/icons/dishfork-dark-web.png');
  await icon.evaluate(img => img.decode());
});

test('stored appearance controls rendering before the footer scripts load', async ({ page }) => {
  await page.emulateMedia({ colorScheme: 'light' });
  await page.addInitScript(() => localStorage.setItem('theme', 'dark'));
  await page.route('**/theme-toggle.js*', route => route.abort());
  await page.goto('/');
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
  await expect(page.locator('body')).toHaveCSS('background-color', 'rgb(25, 26, 28)');
  await expect(page.locator('meta[data-theme-color="dark"]')).toHaveAttribute('media', 'all');
  await expect.poll(() => page.getByRole('link', { name: 'LinkedIn', exact: true }).locator('img').evaluate(img => new URL(img.currentSrc).pathname)).toBe('/icons/linkedin-wordmark-white.svg');
});

test('Auto updates colors, pictures, and browser chrome when the system changes', async ({ page }) => {
  await page.emulateMedia({ colorScheme: 'light' });
  await page.goto('/renfo/');
  await page.emulateMedia({ colorScheme: 'dark' });
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
  await expect(page.locator('body')).toHaveCSS('background-color', 'rgb(28, 9, 11)');
  await expect(page.locator('meta[data-theme-color="dark"]')).toHaveAttribute('media', 'all');
  await expect.poll(() => page.locator('.device img').first().evaluate(img => img.currentSrc)).toContain('dark');
});

test('without JavaScript the system theme and navigation remain usable', async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false, colorScheme: 'dark', viewport: { width: 390, height: 900 } });
  const page = await context.newPage();
  try {
    await page.goto('http://127.0.0.1:8766/');
    await expect(page.locator('body')).toHaveCSS('background-color', 'rgb(25, 26, 28)');
    await expect(page.getByRole('link', { name: 'Contact', exact: true })).toBeVisible();
    await page.goto('http://127.0.0.1:8766/iwatch/');
    await expect(page.locator('body')).toHaveCSS('background-color', 'rgb(12, 22, 40)');
  } finally { await context.close(); }
});

test('missing pages offer recovery links and return an actual 404', async ({ page }, testInfo) => {
  for (const [path, home] of [['/missing-page', '/'], ['/homestead/missing-page', 'https://homesteadcontrol.com/'], ['/renfo/missing-page', 'https://renfo.app/']]) {
    const response = await page.goto(path);
    expect(response.status()).toBe(404);
    await expect(page.getByRole('heading', { name: 'Page not found.', exact: true })).toBeVisible();
    await expect(page.getByRole('link', { name: /^Back to/ })).toHaveAttribute('href', home);
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', 'noindex');
    for (const width of [1440, 390]) {
      await page.setViewportSize({ width, height: 900 });
      await page.screenshot({ path: `.codex-previews/${testInfo.project.name}-404-${path.split('/')[1]}-${width}.png` });
    }
  }
});

test('screenshots select a smaller delivery asset at standard screen density', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 900 });
  await page.goto('/iwatch/');
  await expect.poll(() => page.locator('.device img').first().evaluate(img => img.currentSrc)).toContain('-360w.webp');
});

test('landscape, enlarged text, and forced colors keep navigation and content accessible', async ({ page }, testInfo) => {
  for (const route of ['/', '/renfo/', '/homestead/', '/iwatch/']) {
    await page.setViewportSize({ width: 844, height: 390 });
    await page.goto(route);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    await page.setViewportSize({ width: 390, height: 900 });
    await page.addStyleTag({ content: 'html { font-size: 200%; }' });
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    await page.emulateMedia({ forcedColors: 'active' });
    if (route === '/') {
      // WebKit can lack forced-colors emulation; verify this treatment where supported.
      if (await page.evaluate(() => matchMedia('(forced-colors: active)').matches)) {
        await expect(page.getByRole('link', { name: 'GitHub', exact: true }).locator('.brand-label')).toBeVisible();
        await expect(page.getByRole('link', { name: 'LinkedIn', exact: true }).locator('.brand-label')).toBeVisible();
      }
    }
    await page.getByRole('button', { name: 'Appearance', exact: true }).focus();
    await expect(page.getByRole('button', { name: 'Appearance', exact: true })).toBeFocused();
    await expect(page.getByRole('button', { name: 'Appearance', exact: true })).toBeVisible();
    await page.emulateMedia({ forcedColors: 'none' });
  }
});
