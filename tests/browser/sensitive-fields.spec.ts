import { expect, test, chromium, type BrowserContext, type Page } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { createServer, type Server } from 'node:http';
import { mkdtempSync, readFileSync, readdirSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { resolve } from 'node:path';
import type { WorkspaceProfile } from '../../shared/profiles';

const extensionPath = resolve('dist/extension/chrome-mv3');
const profile: WorkspaceProfile = {
  id: 'maximum-reading',
  name: 'Maximum reading',
  textScale: 180,
  lineSpacing: 2,
  contrast: 'site',
  cursorHalo: false,
  focusMagnification: 140,
  createdAt: 1,
  updatedAt: 1
};

const fieldIds = ['password', 'payment', 'card', 'cc-name', 'cvc', 'cvv', 'autocomplete', 'payment-text'];

let server: Server;
let origin = '';
let context: BrowserContext;
let page: Page;
let userDataDir = '';

test.beforeAll(async () => {
  server = createServer((_request, response) => {
    response.writeHead(200, { 'content-type': 'text/html' });
    response.end(`<!doctype html><html><head><style>
      body { background-color: rgb(239, 243, 246); color: rgb(33, 44, 55); }
      #focus-region { width: min(400px, 80vw); }
    </style></head><body>
      <main><p id="reading">Reading sample</p>
      <p id="focus-region"><a id="reading-link" href="#details">Review report details</a> before the meeting.</p>
      <input id="plain" name="plain" value="ordinary input">
      <input id="password" type="password" value="secret">
      <input id="payment" name="payment" value="card data">
      <input id="card" name="card-number" value="4111">
      <input id="cc-name" name="cc-number" value="4111">
      <input id="cvc" name="cvc" value="123">
      <input id="cvv" name="cvv" value="123">
      <input id="autocomplete" autocomplete="cc-number" value="4111">
      <textarea id="payment-text" name="payment">payment notes</textarea>
      </main></body></html>`);
  });
  await new Promise<void>((resolveServer) => server.listen(0, '127.0.0.1', resolveServer));
  const address = server.address();
  if (!address || typeof address === 'string') throw new Error('Fixture server did not bind a port.');
  origin = `http://127.0.0.1:${address.port}`;

  userDataDir = mkdtempSync(resolve(tmpdir(), 'workspace-profiles-sensitive-'));
  context = await chromium.launchPersistentContext(userDataDir, {
    headless: false,
    args: [`--disable-extensions-except=${extensionPath}`, `--load-extension=${extensionPath}`]
  });
  page = await context.newPage();
});

test.afterAll(async () => {
  await context?.close();
  await new Promise<void>((resolveServer, rejectServer) => server.close((error) => error ? rejectServer(error) : resolveServer()));
  if (userDataDir) rmSync(userDataDir, { recursive: true, force: true });
});

async function saveAssignedProfile(hostname = '127.0.0.1', overrides: Partial<WorkspaceProfile> = {}) {
  const worker = context.serviceWorkers()[0] ?? await context.waitForEvent('serviceworker');
  await worker.evaluate(({ value, host }) => chrome.storage.local.set({
    workspaceProfilesData: { version: 1, profiles: [value], assignments: { [host]: value.id } }
  }), { value: { ...profile, ...overrides }, host: hostname });
}

async function clearProfiles() {
  const worker = context.serviceWorkers()[0] ?? await context.waitForEvent('serviceworker');
  await worker.evaluate(() => chrome.storage.local.remove('workspaceProfilesData'));
}

test('@claim:sensitive-fields maximum profile scale never changes sensitive payment field styles', async () => {
  await page.goto(origin);
  const baseline = await fontSizes(page);
  const baselineReading = await page.locator('#reading').evaluate((node) => ({
    fontSize: Number.parseFloat(getComputedStyle(node).fontSize),
    lineHeight: Number.parseFloat(getComputedStyle(node).lineHeight)
  }));

  await saveAssignedProfile();

  await page.reload();
  await expect(page.locator('html')).toHaveAttribute('data-wp-active', 'true');
  const scaled = await fontSizes(page);
  const scaledReading = await page.locator('#reading').evaluate((node) => ({
    fontSize: Number.parseFloat(getComputedStyle(node).fontSize),
    lineHeight: Number.parseFloat(getComputedStyle(node).lineHeight)
  }));

  expect(Number.parseFloat(scaled.plain!)).toBeGreaterThan(Number.parseFloat(baseline.plain!));
  expect(scaledReading.fontSize).toBeGreaterThan(baselineReading.fontSize);
  expect(scaledReading.lineHeight / scaledReading.fontSize).toBeCloseTo(2, 1);
  for (const id of fieldIds) expect(scaled[id]!).toBe(baseline[id]!);
  for (const id of fieldIds) await expect(page.locator(`#${id}`)).toHaveAttribute('data-workspace-profiles-sensitive', '');
});

test('@claim:color-options applies every advertised color treatment', async () => {
  const expected = {
    site: { background: 'rgb(239, 243, 246)', color: 'rgb(33, 44, 55)' },
    soft: { background: 'rgb(255, 249, 237)', color: 'rgb(24, 42, 53)' },
    high: { background: 'rgb(0, 0, 0)', color: 'rgb(255, 255, 255)' },
    night: { background: 'rgb(16, 28, 37)', color: 'rgb(255, 245, 226)' }
  } satisfies Record<WorkspaceProfile['contrast'], { background: string; color: string }>;

  for (const contrast of Object.keys(expected) as WorkspaceProfile['contrast'][]) {
    await clearProfiles();
    await saveAssignedProfile('127.0.0.1', { contrast });
    await page.goto(origin);
    await expect(page.locator('html')).toHaveAttribute('data-wp-contrast', contrast);
    const colors = await page.locator('body').evaluate((node) => ({
      background: getComputedStyle(node).backgroundColor,
      color: getComputedStyle(node).color
    }));
    expect(colors).toEqual(expected[contrast]);
  }
});

test('@claim:cursor-ring follows the pointer and keyboard focus', async () => {
  await clearProfiles();
  await saveAssignedProfile('127.0.0.1', { cursorHalo: true });
  await page.goto(origin);
  const ring = page.locator('#workspace-profiles-cursor-halo');
  await expect(ring).toHaveAttribute('aria-hidden', 'true');

  await page.mouse.move(120, 140);
  await expect(ring).toHaveAttribute('data-visible', 'true');
  await expect(ring).toHaveCSS('opacity', '1');
  await expect(ring).toHaveCSS('left', '120px');
  await expect(ring).toHaveCSS('top', '140px');

  await page.keyboard.press('Tab');
  await expect(page.locator('#reading-link')).toBeFocused();
  const focusPosition = await ring.evaluate((node) => ({
    x: getComputedStyle(node).getPropertyValue('--wp-halo-x'),
    y: getComputedStyle(node).getPropertyValue('--wp-halo-y')
  }));
  expect(focusPosition.x).not.toBe('120px');
  expect(focusPosition.y).not.toBe('140px');
});

test('@claim:hold-focus enlarges focus only while Alt Shift M is held', async () => {
  await clearProfiles();
  await saveAssignedProfile('127.0.0.1', { focusMagnification: 140 });
  await page.goto(origin);
  await page.locator('#reading-link').focus();
  const region = page.locator('#focus-region');

  await page.keyboard.down('Alt');
  await page.keyboard.down('Shift');
  await page.keyboard.down('m');
  await expect(region).toHaveClass(/workspace-profiles-magnified/);
  await expect.poll(() => region.evaluate((node) => getComputedStyle(node).transform)).not.toBe('none');

  await page.keyboard.up('m');
  await page.keyboard.up('Shift');
  await page.keyboard.up('Alt');
  await expect(region).not.toHaveClass(/workspace-profiles-magnified/);
  await expect(region).toHaveCSS('transform', 'none');
});

async function fontSizes(target: Page): Promise<Record<string, string>> {
  return target.evaluate((ids) => Object.fromEntries(ids.map((id) => [id, getComputedStyle(document.querySelector(`#${id}`)!).fontSize])), ['plain', ...fieldIds]);
}

test('@claim:extension-storage keeps an assigned profile in Chromium extension storage', async () => {
  await clearProfiles();
  await saveAssignedProfile();
  const worker = context.serviceWorkers()[0] ?? await context.waitForEvent('serviceworker');
  const stored = await worker.evaluate(() => chrome.storage.local.get('workspaceProfilesData'));
  expect(stored.workspaceProfilesData).toMatchObject({
    profiles: [{ id: 'maximum-reading', textScale: 180 }],
    assignments: { '127.0.0.1': 'maximum-reading' }
  });
  await page.goto(origin); await page.reload();
  await expect(page.locator('html')).toHaveAttribute('data-wp-active', 'true');
});

test('@claim:extension-no-account uses no account permission or sign-in flow', async () => {
  const manifest = JSON.parse(readFileSync(resolve(extensionPath, 'manifest.json'), 'utf8'));
  expect(manifest.permissions ?? []).not.toContain('identity');
  expect(manifest.oauth2).toBeUndefined();
  await clearProfiles(); await saveAssignedProfile(); await page.goto(origin); await page.reload();
  await expect(page.locator('html')).toHaveAttribute('data-wp-active', 'true');
});

test('@claim:extension-no-analytics has no third-party runtime script or network request', async () => {
  const files = readdirSync(extensionPath, { recursive: true }).filter((entry) => String(entry).endsWith('.js'));
  for (const file of files) expect(readFileSync(resolve(extensionPath, String(file)), 'utf8')).not.toMatch(/https?:\/\/(?!127\.0\.0\.1)/);
  const requested: string[] = [];
  page.on('request', (request) => requested.push(request.url()));
  await clearProfiles(); await saveAssignedProfile(); await page.goto(origin); await page.reload();
  expect(requested.filter((url) => url.startsWith('http')).every((url) => new URL(url).origin === origin)).toBe(true);
});

test('@claim:extension-reversible applies and removes visual reading settings', async () => {
  await clearProfiles(); await page.goto(origin);
  const baseline = await page.locator('#reading').evaluate((node) => getComputedStyle(node).fontSize);
  await saveAssignedProfile(); await page.reload();
  await expect(page.locator('html')).toHaveAttribute('data-wp-active', 'true');
  expect(await page.locator('#reading').evaluate((node) => getComputedStyle(node).fontSize)).not.toBe(baseline);
  await clearProfiles(); await page.reload();
  await expect(page.locator('html')).not.toHaveAttribute('data-wp-active');
  expect(await page.locator('#reading').evaluate((node) => getComputedStyle(node).fontSize)).toBe(baseline);
});

test('@claim:extension-assignment applies only on the assigned site address', async () => {
  await clearProfiles(); await saveAssignedProfile('127.0.0.1');
  await page.goto(origin); await page.reload();
  await expect(page.locator('html')).toHaveAttribute('data-wp-active', 'true');
  const other = await context.newPage();
  await other.goto(`http://localhost:${new URL(origin).port}`);
  await expect(other.locator('html')).not.toHaveAttribute('data-wp-active');
  await other.close();
});

test('@claim:extension-privacy applies a profile without a remote request', async () => {
  const requested: string[] = [];
  page.on('request', (request) => requested.push(request.url()));
  await clearProfiles(); await saveAssignedProfile(); await page.goto(origin);
  await page.waitForTimeout(250);
  expect(requested.length).toBeGreaterThan(0);
  expect(requested.every((url) => new URL(url).origin === origin)).toBe(true);
});

test('packaged popup has landmarks, keyboard focus, and no axe violations', async () => {
  const worker = context.serviceWorkers()[0] ?? await context.waitForEvent('serviceworker');
  const extensionId = new URL(worker.url()).host;
  const popup = await context.newPage();
  const errors: string[] = [];
  popup.on('console', (message) => { if (message.type() === 'error') errors.push(message.text()); });
  popup.on('pageerror', (error) => errors.push(error.message));
  await popup.goto(`chrome-extension://${extensionId}/popup.html`);
  await expect(popup.locator('html')).toHaveAttribute('lang', 'en');
  await expect(popup.locator('main')).toHaveCount(1);
  await expect(popup.locator('h1')).toHaveCount(1);
  await popup.keyboard.press('Tab');
  await expect(popup.getByRole('link', { name: 'Skip to controls' })).toBeFocused();
  expect((await new AxeBuilder({ page: popup }).analyze()).violations).toEqual([]);
  expect(errors).toEqual([]);
  await popup.close();
});
