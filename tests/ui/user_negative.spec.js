import { UserBuilder } from '../../src/helpers/builders';
import { expect } from '@playwright/test';
import { test } from '../../src/helpers/fixtures/fixture';

test.describe('Негативные сценарии авторизации', () => {
  let testUser;

  test.beforeEach(async ({ webApp }) => {
    testUser = new UserBuilder().withEmail().withPassword().withUsername().build();
    await webApp.main.gotoRegister();
    await webApp.register.signup(testUser.username, testUser.email, testUser.password);
    await expect(webApp.yourfeed.getProfileName()).toContainText(testUser.username);
  });
  test('Получение ошибки при  регистрации с существующим email', async ({ webApp }) => {
    await webApp.main.gotologout();
    await webApp.main.gotoRegister();
    await webApp.register.signup(testUser.username, testUser.email, testUser.password);
    await expect(webApp.main.getError()).toContainText('Email already exists.. try logging in');
  });
  test('Получение ошибки при авторизации с неверным паролем', async ({ webApp }) => {
    const newPas = new UserBuilder().withPassword().build();
    await webApp.main.gotologout();
    await webApp.main.gotologin();
    await webApp.login.login(testUser.email, newPas.password);
    await expect(webApp.main.getError()).toContainText('Wrong email/password combination');
  });
});
