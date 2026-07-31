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
    this.popularTag = page.locator('aside .tag-list .tag-pill').first();
    this.articleTags = page.locator('.article-preview .tag-list '); // блог тэгов для каждой статьи
    this.errorMessages = page.locator('main .error-messages');
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
      await this.dropdownLogout.click();
      // для обхода detached from DOM принудительная очистка сессии - ui работает нестабильно
      /*await this.page.context().clearCookies();
      await this.page.evaluate(() => {
        localStorage.clear();
        sessionStorage.clear();
      });
      // Принудительная перезагрузка для перерисовки шапки
      await this.page.goto('/');
      await this.page.waitForLoadState('networkidle'); */
      await this.signupButton.waitFor({ state: 'visible' });
    });
  }

  async goto() {
    return test.step('Переход на главную страницу', async () => {
      await this.page.goto('/');
    });
  }
  async getArticlesWithTags() {
    return test.step('Получение популярного тэга и переход по нему', async () => {
      const tagName = await this.popularTag.textContent();
      await this.popularTag.click();
      return tagName;
    });
  }
  getArticleTagList() {
    // возвращаем все тэги в статьях
    return this.articleTags;
  }
  getError() {
    return this.errorMessages;
  }
}
