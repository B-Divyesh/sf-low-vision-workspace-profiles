import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test('@claim:demo-isolation opens seeded data and keeps real storage untouched', async ({ page }) => {
  await page.addInitScript(() => localStorage.setItem('workspace-profiles:real', 'keep-me'));
  await page.goto('/?demo=1');
  await expect(page).toHaveURL(/\/demo\/$/);
  await expect(page.getByText('Demo — sample data, nothing is saved to your real profiles')).toBeVisible();
  await expect(page.getByText('Quarterly service report')).toBeVisible();
  await page.locator('#text-scale').fill('160');
  const keys = await page.evaluate(() => Object.keys(localStorage));
  expect(keys.filter((key) => key !== 'workspace-profiles:real')).toEqual(['demo:workspace-profiles:reports-example']);
  expect(await page.evaluate(() => localStorage.getItem('workspace-profiles:real'))).toBe('keep-me');
  await page.getByRole('button', { name: 'Reset demo' }).click();
  expect(await page.evaluate(() => localStorage.getItem('demo:workspace-profiles:reports-example'))).toBeNull();
});

test('@claim:reading-controls applies the stated text and spacing ranges', async ({ page }) => {
  await page.goto('/demo/');
  const text = page.locator('#text-scale'); const spacing = page.locator('#line-height'); const reading = page.locator('.sample-reading').first();
  await text.fill('180'); await spacing.fill('2');
  await expect(page.locator('#text-value')).toHaveText('180%'); await expect(page.locator('#line-value')).toHaveText('2.00×');
  const computed = await reading.evaluate((node) => ({ size: getComputedStyle(node).fontSize, line: getComputedStyle(node).lineHeight }));
  expect(parseFloat(computed.size)).toBeGreaterThanOrEqual(28); expect(parseFloat(computed.line)).toBeGreaterThan(parseFloat(computed.size));
  await page.getByRole('button', { name: 'Share report' }).click();
  await expect(page.locator('#sample-action-status')).toHaveText('Sample report shared with your workspace.');
  await page.getByRole('button', { name: 'More actions' }).click();
  await expect(page.getByRole('button', { name: 'Copy summary' })).toBeVisible();
  await page.getByRole('button', { name: 'Copy summary' }).click();
  await expect(page.locator('#copy-status')).toHaveText('Sample summary copied.');
  expect(await page.locator('.sample-toolbar button').first().evaluate((node) => getComputedStyle(node).fontSize)).toBe('18px');
});

test('@claim:profile-persistence reloads settings and pause restores the original view', async ({ page }) => {
  await page.goto('/demo/'); await page.locator('#text-scale').fill('170'); await page.reload();
  await expect(page.locator('#text-scale')).toHaveValue('170');
  await page.locator('#profile-active').uncheck();
  await expect(page.locator('#active-label')).toHaveText('Original view');
  expect(await page.locator('#sample-document').evaluate((node) => getComputedStyle(node.querySelector('.sample-reading')!).fontSize)).toBe('18px');
});

test('@claim:json-export downloads the current sample profile', async ({ page }) => {
  await page.goto('/demo/'); const downloadPromise = page.waitForEvent('download'); await page.getByRole('button', { name: 'Export sample profile' }).click(); const download = await downloadPromise;
  expect(download.suggestedFilename()).toBe('workspace-profile-demo.json');
  const content = await (await import('node:fs/promises')).readFile(await download.path() as string, 'utf8');
  expect(JSON.parse(content)).toMatchObject({ profile: 'Quarterly reports', site: 'reports.example', textScale: 140 });
});

test('@claim:first-party-only-demo makes no cross-origin requests or analytics calls', async ({ page }) => {
  const requests: string[] = []; page.on('request', (request) => requests.push(request.url()));
  await page.goto('/demo/'); await page.locator('#color-option').selectOption('night'); await page.getByRole('button', { name: 'Reset demo' }).click();
  expect(requests.length).toBeGreaterThan(0); expect(requests.every((url) => new URL(url).origin === 'http://127.0.0.1:4173')).toBe(true);
  expect(requests.some((url) => /analytics|telemetry|doubleclick/i.test(url))).toBe(false);
});

test('@claim:no-account-demo performs the full sample flow without authentication', async ({ page }) => {
  await page.goto('/demo/'); await expect(page.locator('#sample-document')).toBeVisible();
  await page.locator('#color-option').selectOption('contrast'); await expect(page.locator('#sample-document')).toHaveAttribute('data-color', 'contrast');
  await expect(page.locator('input[type="email"], input[type="password"]')).toHaveCount(0);
});

test('@claim:free-core offers the demo and extension without a checkout', async ({ page, request }) => {
  await page.goto('/'); await expect(page.getByRole('link', { name: 'Try it with sample data' }).first()).toHaveAttribute('href', '/demo/');
  const download = page.getByRole('link', { name: 'Download the extension' }).first(); await expect(download).toHaveAttribute('href', '/downloads/workspace-profiles-chrome.zip');
  expect((await request.get('/downloads/workspace-profiles-chrome.zip')).ok()).toBe(true); await expect(page.locator('a[href*="checkout"]')).toHaveCount(0);
});

test('@claim:offline-demo reloads the installed sample while offline', async ({ page, context }) => {
  await page.goto('/demo/'); await page.evaluate(async () => { await navigator.serviceWorker.register('/sw.js'); await navigator.serviceWorker.ready; }); await page.reload();
  await expect.poll(() => page.evaluate(() => Boolean(navigator.serviceWorker.controller))).toBe(true);
  await context.setOffline(true); await page.reload(); await expect(page.getByRole('heading', { level: 1 })).toHaveText('Try a reading profile on a sample report');
});

test('routes, metadata, mobile first screen, keyboard, and accessibility', async ({ page }) => {
  for (const route of ['/', '/demo/', '/privacy/', '/terms/']) {
    await page.goto(route); expect((await page.title()).length).toBeGreaterThan(5); await expect(page.locator('main')).toHaveCount(1); await expect(page.locator('h1')).toHaveCount(1);
    await expect(page.locator('link[rel="canonical"]')).toHaveCount(1); await expect(page.locator('meta[property="og:image"]')).toHaveCount(1); await expect(page.locator('link[rel="apple-touch-icon"]')).toHaveCount(1);
    const results = await new AxeBuilder({ page }).analyze(); expect(results.violations).toEqual([]);
    await page.emulateMedia({ colorScheme: 'dark', reducedMotion: 'reduce' }); const darkResults = await new AxeBuilder({ page }).analyze(); expect(darkResults.violations).toEqual([]); await page.emulateMedia({ colorScheme: 'light' });
  }
  await page.setViewportSize({ width: 390, height: 844 }); await page.goto('/');
  await expect(page.getByRole('heading', { level: 1 })).toBeInViewport(); await expect(page.getByRole('link', { name: 'Try it with sample data' }).first()).toBeInViewport(); await expect(page.getByRole('link', { name: 'Download the extension' }).first()).toBeVisible();
  await page.setViewportSize({ width: 1440, height: 900 }); await page.goto('/');
  await expect(page.getByRole('heading', { level: 1 })).toBeInViewport(); await expect(page.locator('.hero-lede')).toBeInViewport();
  await expect(page.getByRole('link', { name: 'Try it with sample data' }).first()).toBeInViewport(); await expect(page.locator('.action-note')).toBeInViewport(); await expect(page.locator('.plain-facts')).toBeInViewport();
  await page.keyboard.press('Tab'); await expect(page.getByRole('link', { name: 'Skip to main content' })).toBeFocused();
  await page.getByRole('link', { name: 'Demo' }).click(); await expect(page.getByRole('heading', { level: 1 })).toBeFocused(); await page.goBack(); await expect(page.getByRole('link', { name: 'Demo' })).toBeFocused();
  const response = await page.goto('/not-a-real-page'); expect(response?.status()).toBe(404);
});
