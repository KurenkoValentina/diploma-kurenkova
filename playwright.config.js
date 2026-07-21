// @ts-check
import { defineConfig, devices } from '@playwright/test';
import dotenv from 'dotenv';
import path from 'path';

// Загружаем .env  локально
if (!process.env.CI) {
  dotenv.config({ path: path.resolve(__dirname, '.env') });
}

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: [['html'], ['line'], ['allure-playwright']],

  // Глобальные настройки
  use: {
    screenshot: 'only-on-failure',
    trace: 'on-first-retry',
  },

  // UI и API
  projects: [
    {
      name: 'UI',
      testDir: './tests/ui',
      use: {
        ...devices['Desktop Chrome'],
        // baseURL будет  для page.goto('/')
        baseURL: process.env.UI_URL || 'https://realworld.qa.guru/',
      },
    },
    {
      name: 'API',
      testDir: './tests/api',
      use: {
        //  baseURL  для request.get('/')
        baseURL: process.env.API_URL || 'https://apichallenges.eviltester.com/',
      },
    },
  ],
});
