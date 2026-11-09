import { defineConfig, devices } from '@playwright/test';

// https://playwright.dev/docs/test-configuration
export default defineConfig({
  testDir: 'src/scenarios',
  timeout: 120000,
  fullyParallel: true,
  // impede que um test.only esquecido passe despercebido no CI
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: [
    ['list'],
    ['html', { outputFolder: 'artifacts/report', open: 'never' }]
  ],
  expect: {
    timeout: 30000
  },
  use: {
    baseURL: 'https://www.americanas.com.br',
    locale: 'pt-BR',
    headless: true,
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    video: 'off'
  },
  projects: [
    {
      name: 'Microsoft Edge',
      use: {
        ...devices['Desktop Edge'],
        channel: 'msedge',
        viewport: { width: 1280, height: 720 }
      }
    }
  ]
});
