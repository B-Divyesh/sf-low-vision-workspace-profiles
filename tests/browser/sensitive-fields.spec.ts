import { expect, test, chromium, type BrowserContext, type Page } from '@playwright/test';
import { createServer, type Server } from 'node:http';
import { mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { resolve } from 'node:path';

const extensionPath = resolve('dist/extension/chrome-mv3');
const profile = {
  id: 'maximum-reading',
  name: 'Maximum reading',
  textScale: 180,
  lineSpacing: 2,
  contrast: 'site' as const,
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
    response.end(`<!doctype html><html><body>
      <main><p id="reading">Reading sample</p>
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

test('maximum profile scale never changes sensitive payment field styles', async () => {
  await page.goto(origin);
  const baseline = await fontSizes(page);

  const worker = context.serviceWorkers()[0] ?? await context.waitForEvent('serviceworker');
  await worker.evaluate(({ value, hostname }) => chrome.storage.local.set({
    workspaceProfilesData: {
      version: 1,
      profiles: [value],
      assignments: { [hostname]: value.id }
    }
  }), { value: profile, hostname: '127.0.0.1' });

  await page.reload();
  await expect(page.locator('html')).toHaveAttribute('data-wp-active', 'true');
  const scaled = await fontSizes(page);

  expect(Number.parseFloat(scaled.plain!)).toBeGreaterThan(Number.parseFloat(baseline.plain!));
  for (const id of fieldIds) expect(scaled[id]!).toBe(baseline[id]!);
  for (const id of fieldIds) await expect(page.locator(`#${id}`)).toHaveAttribute('data-workspace-profiles-sensitive', '');
});

async function fontSizes(target: Page): Promise<Record<string, string>> {
  return target.evaluate((ids) => Object.fromEntries(ids.map((id) => [id, getComputedStyle(document.querySelector(`#${id}`)!).fontSize])), ['plain', ...fieldIds]);
}
