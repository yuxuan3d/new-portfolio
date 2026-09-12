import { defineConfig } from 'playwright/test';

export default defineConfig({
  testDir: './tests/e2e',
  timeout: 30_000,
  fullyParallel: false,
  reporter: 'list',
  outputDir: 'playwright-artifacts',
  use: {
    baseURL: 'http://localhost:5173',
    screenshot: 'only-on-failure',
    trace: 'retain-on-failure',
  },
  webServer: {
    command: 'npm run dev -- --host 127.0.0.1',
    url: 'http://127.0.0.1:5173',
    reuseExistingServer: !process.env.CI,
    env: {
      ...process.env,
      VITE_EMAILJS_SERVICE_ID: 'test-service',
      VITE_EMAILJS_TEMPLATE_ID: 'test-template',
      VITE_EMAILJS_PUBLIC_KEY: 'test-key',
    },
  },
});
