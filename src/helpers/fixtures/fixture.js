import { test as base } from '@playwright/test';
import { App } from '../../pages/app';
import { Api } from '../../services/api';
//фикстура по открытию страницы и созданию юзера и регистрации
export const test = base.extend({
  webApp: async ({ page }, use) => {
    const app = new App(page);
    await app.main.goto();
    await use(app);
  },
  // фикстура по апи
  api: async ({ request }, use) => {
    const api = new Api(request);
    await use(api);
  },
});
