import { test } from '@playwright/test';
export class SettingsPage {
  constructor(page) {
    this.page = page;
    this.nameInput = page.getByPlaceholder('Your Name');
    this.passwordInput = page.getByPlaceholder('Password');
    this.emailInput = page.getByPlaceholder('Email');
    this.settingsButton = page.getByRole('button', { name: 'Update Settings' });
    this.newProfile = page.getByRole('navigation');
  }

  // Бизнес-сценарии на страничке
  // Изменение имени пользователя
  async updateName(username) {
    return test.step('Изменение пароля пользователя', async () => {
      await this.nameInput.click();
      await this.nameInput.fill(username);
      await this.settingsButton.click();
    });
  }
  //  Изменение пароля пользователя
  async updatePassword(password) {
    return test.step('Изменение пароля пользователя', async () => {
      await this.passwordInput.click();
      await this.passwordInput.fill(password);
      await this.settingsButton.click();
    });
  }
  // Изменение email с подтверждением текущего пароля
  async updateEmail(email, password) {
    return test.step('Изменение email пользователя', async () => {
      await this.emailInput.click();
      await this.emailInput.fill(email);
      await this.passwordInput.click();
      await this.passwordInput.fill(password);
      await this.settingsButton.click();
    });
  }
}
