import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests/site',
  fullyParallel: false,
  workers: 1,
  timeout: 45_000,
  reporter: 'list',
  use: { baseURL: 'http://127.0.0.1:4173', browserName: 'chromium', trace: 'retain-on-failure', screenshot: 'only-on-failure' },
  webServer: { command: 'npm run build:site && npx vite preview --config site/vite.config.ts --host 127.0.0.1', url: 'http://127.0.0.1:4173', reuseExistingServer: false, timeout: 120_000 }
});
