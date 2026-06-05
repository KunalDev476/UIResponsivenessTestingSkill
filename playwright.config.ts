import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests/ui-responsive',
  outputDir: '.playwright-output',
  timeout: 300_000,
  expect: { timeout: 15_000 },
  use: {
    headless: true,
    screenshot: 'off',
    video: 'off',
    trace: 'off',
  },
  reporter: [['list'], ['html', { open: 'never' }]],
});
