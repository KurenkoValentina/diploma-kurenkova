import { UserBuilder } from '../../src/helpers/builders';
import { expect } from '@playwright/test';
import { test } from '../../src/helpers/fixtures/fixture';

test.describe('Управление учетной записью пользователя', () => {
  //регистрация перед каждым тестом
  let testUser;

  test.beforeEach(async ({ webApp }) => {
    //создали через билдер объект юзера
    testUser = new UserBuilder().withEmail().withPassword().withUsername().build();
    // Деструктуризация объекта - разбираем объект на переменные
    //const { email, password, username } = testUser;
    //  Переходим на сайт и регистрируемся
    await webApp.main.gotoRegister();
    await webApp.register.signup(testUser.username, testUser.email, testUser.password);
    await expect(webApp.yourfeed.getProfileName()).toContainText(testUser.username);
  });

  // тест 1 - проверка успешной смены имени пользователя
  test('Пользователь может поменять имя', async ({ webApp }) => {
    const newUsername = new UserBuilder().withUsername().build();
    // меняем в настройках имя и проверяем отображение
    await webApp.main.gotoSettings();
    await webApp.settings.updateName(newUsername.username);
    await expect(webApp.settings.settingsButton).toBeHidden();
    await expect(webApp.settings.newProfile).toContainText(newUsername.username);
  });

  // тест 2 - проверка успешной смены пароля пользователя и логина с новым паролем
  test('Пользователь может поменять пароль и залогиниться с новым паролем', async ({ webApp }) => {
    const newPassword = new UserBuilder().withPassword().build();
    // меняем в настройках пароль
    await webApp.main.gotoSettings();
    await webApp.settings.updatePassword(newPassword.password);
    await expect(webApp.settings.settingsButton).toBeHidden();
    //логаут и успешный логин с новым паролем
    await webApp.main.gotologout();
    await webApp.main.gotologin();
    await webApp.login.login(testUser.email, newPassword.password);
    await expect(webApp.yourfeed.getProfileName()).toContainText(testUser.username);
  });

  // тест 3 - пользователь может поменять email и авторизоваться потом с новым email
  test('Пользователь может поменять email и залогиниться потом с новым email', async ({
    webApp,
  }) => {
    const newEmail = new UserBuilder().withEmail().build();
    // меняем в настройках email + заполняем пароль старый, чтобы он не был пустым
    await webApp.main.gotoSettings();
    await webApp.settings.updateEmail(newEmail.email, testUser.password);
    await expect(webApp.settings.settingsButton).toBeHidden();
    //логаут и логин с новым email и старым паролем
    await webApp.main.gotologout();
    await webApp.main.gotologin();
    await webApp.login.login(newEmail.email, testUser.password);
    await expect(webApp.yourfeed.getProfileName()).toContainText(testUser.username);
  });
});
