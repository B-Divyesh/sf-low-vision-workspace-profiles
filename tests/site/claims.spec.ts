import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test('@claim:demo-isolation opens seeded data and keeps real storage untouched', async ({ page, context }) => {
  await context.grantPermissions(['clipboard-read', 'clipboard-write'], { origin: 'http://127.0.0.1:4173' });
  await page.addInitScript(() => localStorage.setItem('workspace-profiles:real', 'keep-me'));
  await page.goto('/?demo=1');
  await expect(page).toHaveURL(/\/demo\/$/);
  await expect(page.getByText('Demo — sample data, nothing is saved to your real profiles')).toBeVisible();
  await expect(page.getByText('Quarterly service report')).toBeVisible();
  await page.locator('#text-scale').fill('160');
  await page.locator('#sample-note').fill('Changed demo note');
  await page.getByRole('button', { name: 'Show report actions' }).click();
  await page.getByRole('button', { name: 'Copy summary' }).click();
  await expect(page.locator('#copy-status')).toHaveText('Sample report summary copied.');
  const keys = await page.evaluate(() => Object.keys(localStorage));
  expect(keys.filter((key) => key !== 'workspace-profiles:real')).toEqual(['demo:workspace-profiles:reports-example']);
  expect(await page.evaluate(() => localStorage.getItem('workspace-profiles:real'))).toBe('keep-me');
  await page.getByRole('button', { name: 'Reset demo' }).click();
  expect(await page.evaluate(() => localStorage.getItem('demo:workspace-profiles:reports-example'))).toBeNull();
  await expect(page.locator('#text-scale')).toHaveValue('140');
  await expect(page.locator('#sample-note')).toHaveValue('Review June follow-up');
  await expect(page.locator('#sample-actions')).toBeHidden();
  await expect(page.locator('#sample-action-status')).toBeEmpty();
  await expect(page.locator('#copy-status')).toBeEmpty();
  await page.locator('#text-scale').fill('150');
  await expect.poll(() => page.evaluate(() => localStorage.getItem('demo:workspace-profiles:reports-example'))).not.toBeNull();
  await page.getByRole('link', { name: 'Start for real' }).click();
  await expect(page).toHaveURL('http://127.0.0.1:4173/');
  expect(await page.evaluate(() => localStorage.getItem('demo:workspace-profiles:reports-example'))).toBeNull();
  expect(await page.evaluate(() => localStorage.getItem('workspace-profiles:real'))).toBe('keep-me');
});

test('@claim:reading-controls applies the stated text and spacing ranges', async ({ page }) => {
  await page.goto('/demo/');
  const text = page.locator('#text-scale'); const spacing = page.locator('#line-height'); const reading = page.locator('.sample-reading').first();
  await text.fill('100'); await spacing.fill('1.2');
  await expect(page.locator('#text-value')).toHaveText('100%'); await expect(page.locator('#line-value')).toHaveText('1.20×');
  const minimum = await reading.evaluate((node) => ({
    root: parseFloat(getComputedStyle(document.documentElement).fontSize),
    size: parseFloat(getComputedStyle(node).fontSize),
    line: parseFloat(getComputedStyle(node).lineHeight)
  }));
  expect(minimum.size / minimum.root).toBeCloseTo(1, 2); expect(minimum.line / minimum.size).toBeCloseTo(1.2, 2);
  await page.getByRole('button', { name: 'Show report actions' }).click();
  await expect(page.locator('#sample-actions')).toBeVisible();
  await text.fill('180'); await spacing.fill('2');
  await expect(page.locator('#text-value')).toHaveText('180%'); await expect(page.locator('#line-value')).toHaveText('2.00×');
  const maximum = await reading.evaluate((node) => ({
    root: parseFloat(getComputedStyle(document.documentElement).fontSize),
    size: parseFloat(getComputedStyle(node).fontSize),
    line: parseFloat(getComputedStyle(node).lineHeight)
  }));
  expect(maximum.size / maximum.root).toBeCloseTo(1.8, 2); expect(maximum.line / maximum.size).toBeCloseTo(2, 2);
  await page.getByRole('button', { name: 'Show report actions' }).click();
  await expect(page.locator('#sample-actions')).toBeHidden();
  expect(await page.getByRole('button', { name: 'Show report actions' }).evaluate((node) => getComputedStyle(node).fontSize)).toBe('18px');
});

test('@claim:sample-share passes sample report details to the browser share action', async ({ page }) => {
  await page.addInitScript(() => {
    const shareWindow = window as typeof window & { __shareCalls: ShareData[] };
    shareWindow.__shareCalls = [];
    Object.defineProperty(navigator, 'share', {
      configurable: true,
      value: async (data: ShareData) => { shareWindow.__shareCalls.push(data); }
    });
  });
  await page.goto('/demo/');
  await page.getByRole('button', { name: 'Share report' }).click();
  expect(await page.evaluate(() => (window as typeof window & { __shareCalls: ShareData[] }).__shareCalls)).toEqual([{
    title: 'Quarterly service report',
    text: 'Quarterly service report — North region, Q2. Requests were resolved faster while the open queue fell.',
    url: 'http://127.0.0.1:4173/demo/'
  }]);
  await expect(page.locator('#sample-action-status')).toHaveText('Sharing options opened for the sample report.');
});

test('@claim:sample-copy writes the report summary to the clipboard', async ({ page, context }) => {
  await context.grantPermissions(['clipboard-read', 'clipboard-write'], { origin: 'http://127.0.0.1:4173' });
  await page.goto('/demo/');
  await page.evaluate(() => navigator.clipboard.writeText('unchanged-marker'));
  await page.getByRole('button', { name: 'Show report actions' }).click();
  await page.getByRole('button', { name: 'Copy summary' }).click();
  expect(await page.evaluate(() => navigator.clipboard.readText())).toBe('Quarterly service report — North region, Q2. Requests were resolved faster while the open queue fell.');
  await expect(page.locator('#copy-status')).toHaveText('Sample report summary copied.');
});

test('demo actions report cancellation and clipboard errors without false success', async ({ page }) => {
  await page.addInitScript(() => {
    Object.defineProperty(navigator, 'share', { configurable: true, value: async () => { throw new DOMException('Canceled', 'AbortError'); } });
    Object.defineProperty(navigator, 'clipboard', { configurable: true, value: { writeText: async () => { throw new DOMException('Denied', 'NotAllowedError'); } } });
  });
  await page.goto('/demo/');
  await page.getByRole('button', { name: 'Share report' }).click();
  await expect(page.locator('#sample-action-status')).toHaveText('Sharing canceled. Nothing was shared.');
  await page.getByRole('button', { name: 'Show report actions' }).click();
  await page.getByRole('button', { name: 'Copy summary' }).click();
  await expect(page.locator('#copy-status')).toHaveText('Copy failed. Allow clipboard access, then try again.');
});

test('demo recovers from malformed sample storage with the seeded profile', async ({ page }) => {
  await page.addInitScript(() => localStorage.setItem('demo:workspace-profiles:reports-example', '{not valid json'));
  await page.goto('/demo/');
  await expect(page.locator('#text-scale')).toHaveValue('140');
  await expect(page.locator('#line-height')).toHaveValue('1.65');
  await expect(page.locator('#color-option')).toHaveValue('warm');
  await expect(page.locator('#profile-active')).toBeChecked();
  await page.locator('#text-scale').fill('150');
  expect(JSON.parse(await page.evaluate(() => localStorage.getItem('demo:workspace-profiles:reports-example')) as string)).toMatchObject({ textScale: 150 });
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
  const consoleErrors: string[] = []; page.on('console', (message) => { if (message.type() === 'error') consoleErrors.push(message.text()); }); page.on('pageerror', (error) => consoleErrors.push(error.message));
  const routes = { '/': 'Workspace Profiles — save reading settings per site', '/demo/': 'Demo — Workspace Profiles', '/privacy/': 'Privacy — Workspace Profiles', '/terms/': 'Terms — Workspace Profiles' };
  for (const [route, title] of Object.entries(routes)) {
    await page.goto(route); expect(await page.title()).toBe(title); await expect(page.locator('main')).toHaveCount(1); await expect(page.locator('h1')).toHaveCount(1);
    await expect(page.locator('meta[name="description"]')).toHaveCount(1); await expect(page.locator('link[rel="canonical"]')).toHaveCount(1); await expect(page.locator('meta[property="og:title"]')).toHaveCount(1); await expect(page.locator('meta[property="og:image"]')).toHaveCount(1); await expect(page.locator('meta[name="twitter:card"]')).toHaveCount(1); await expect(page.locator('link[rel="apple-touch-icon"]')).toHaveCount(1); await expect(page.locator('#route-status[aria-live="polite"]')).toHaveCount(1);
    await expect(page.locator('header nav').getByRole('link', { name: 'Demo' })).toHaveCount(1); await expect(page.locator('footer').getByRole('link', { name: 'Privacy' })).toHaveCount(1); await expect(page.locator('footer').getByRole('link', { name: 'Terms' })).toHaveCount(1); await expect(page.locator('footer')).toContainText('Built by Param Factory'); await expect(page.locator('footer')).toContainText('Version 1.0.1');
    const results = await new AxeBuilder({ page }).analyze(); expect(results.violations).toEqual([]);
    await page.emulateMedia({ colorScheme: 'dark', reducedMotion: 'reduce' }); const darkResults = await new AxeBuilder({ page }).analyze(); expect(darkResults.violations).toEqual([]);
    const buttonContrast = await page.locator('.button').evaluateAll((nodes) => {
      function luminance(value: string) {
        const channels = (value.match(/[\d.]+/g) ?? []).slice(0, 3).map(Number).map((channel) => {
          const normalized = channel / 255;
          return normalized <= 0.04045 ? normalized / 12.92 : ((normalized + 0.055) / 1.055) ** 2.4;
        });
        return 0.2126 * channels[0]! + 0.7152 * channels[1]! + 0.0722 * channels[2]!;
      }
      return nodes.filter((node) => (node as HTMLElement).offsetParent !== null).map((node) => {
        const style = getComputedStyle(node);
        const lighter = Math.max(luminance(style.color), luminance(style.backgroundColor));
        const darker = Math.min(luminance(style.color), luminance(style.backgroundColor));
        return (lighter + 0.05) / (darker + 0.05);
      });
    });
    expect(buttonContrast.every((ratio) => ratio >= 4.5)).toBe(true);
    await page.emulateMedia({ colorScheme: 'light' });
  }
  await page.setViewportSize({ width: 390, height: 844 }); await page.goto('/'); expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBe(390);
  await expect(page.getByRole('heading', { level: 1 })).toBeInViewport(); await expect(page.getByRole('link', { name: 'Try it with sample data' }).first()).toBeInViewport(); await expect(page.getByRole('link', { name: 'Download the extension' }).first()).toBeInViewport(); await expect(page.locator('.action-note')).toBeInViewport(); await expect(page.locator('.plain-facts')).toBeInViewport();
  for (const route of ['/', '/demo/', '/privacy/', '/terms/', '/404.html']) {
    await page.goto(route);
    const undersized = await page.locator('a, button, summary, input, select').evaluateAll((nodes) => nodes.flatMap((node) => {
      const element = node as HTMLElement;
      if (element.offsetParent === null || element.matches('.skip-link:not(:focus)')) return [];
      const target = element instanceof HTMLInputElement && element.type === 'checkbox' && element.labels?.[0]
        ? element.labels[0]
        : element;
      const box = target.getBoundingClientRect();
      return box.width + 0.01 < 44 || box.height + 0.01 < 44
        ? [`${element.tagName.toLowerCase()}#${element.id || '-'}:${box.width.toFixed(1)}x${box.height.toFixed(1)}`]
        : [];
    }));
    expect(undersized, `${route} has undersized touch targets`).toEqual([]);
  }
  await page.setViewportSize({ width: 1440, height: 900 }); await page.goto('/');
  await expect(page.getByRole('heading', { level: 1 })).toBeInViewport(); await expect(page.locator('.hero-lede')).toBeInViewport();
  await expect(page.getByRole('link', { name: 'Try it with sample data' }).first()).toBeInViewport(); await expect(page.locator('.action-note')).toBeInViewport(); await expect(page.locator('.plain-facts')).toBeInViewport();
  await page.keyboard.press('Tab'); await expect(page.getByRole('link', { name: 'Skip to main content' })).toBeFocused();
  await page.getByRole('link', { name: 'Demo' }).click(); await expect(page.getByRole('heading', { level: 1 })).toBeFocused(); await expect(page.locator('#route-status')).toHaveText('Try a reading profile on a sample report');
  await page.goBack(); await expect(page.getByRole('link', { name: 'Demo' })).toBeFocused(); await expect(page.locator('#route-status')).toHaveText('Save readable settings for each work site');
  expect(consoleErrors).toEqual([]);
  const response = await page.goto('/not-a-real-page'); expect(response?.status()).toBe(404);
  await page.goto('/404.html'); expect(await page.title()).toBe('404 — Workspace Profiles'); await expect(page.locator('main')).toHaveCount(1); await expect(page.locator('h1')).toHaveText('Page not found'); await expect(page.locator('meta[property="og:title"]')).toHaveAttribute('content', '404 — Workspace Profiles'); await expect(page.locator('meta[property="og:image"]')).toHaveCount(1); await expect(page.locator('meta[name="twitter:card"]')).toHaveAttribute('content', 'summary_large_image'); expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([]);
});
