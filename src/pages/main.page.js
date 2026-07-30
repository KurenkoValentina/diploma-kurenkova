import { test } from '@playwright/test';
export class MainPage {
  constructor(page) {
    // это браузер
    this.page = page;
    //  элементы
    this.signupButton = page.getByRole('link', { name: 'Sign up' });
    this.loginButton = page.getByRole('link', { name: 'Login' });
    this.dropdownMenu = page.locator('div.nav-link.dropdown-toggle.cursor-pointer');
    this.dropdownProfile = page.locator('a.dropdown-item').filter({ hasText: 'Profile' });
    this.settingsButton = page.locator('a.dropdown-item').filter({ hasText: 'Settings' });
    this.dropdownLogout = page.locator('a.dropdown-item').filter({ hasText: 'Logout' });
  }

  // Бизнес-сценарии на страничке
  async gotoRegister() {
    return test.step('Переход на страницу регистрации', async () => {
      await this.signupButton.click();
    });
  }
  async gotoSettings() {
    return test.step('Переход в настройки профиля', async () => {
      await this.dropdownMenu.click();
      await this.settingsButton.click();
    });
  }

  async gotologin() {
    return test.step('Переход на страницу авторизации', async () => {
      // await this.loginButton.click();
      // кнопка в меню нестабильна  - приходится так
      await this.page.goto('/#/login');
      await this.page.waitForLoadState('domcontentloaded');
    });
  }

  async gotologout() {
    return test.step('Выход из системы и очистка сессии', async () => {
      await this.dropdownMenu.click();
      await this.dropdownLogout.waitFor({ state: 'visible' }); // ждем видимость
      await this.dropdownLogout.click();
      // для обхода detached from DOM принудительная очистка сессии - ui работает нестабильно
      // await this.page.waitForURL('**/#/');
      await this.page.context().clearCookies();
      await this.page.evaluate(() => {
        localStorage.clear();
        sessionStorage.clear();
      });
      // Принудительная перезагрузка для перерисовки шапки
      await this.page.goto('/');
      await this.page.waitForLoadState('networkidle');
    });
  }

  async goto() {
    return test.step('Переход на главную страницу', async () => {
      await this.page.goto('/');
    });
  }
}
