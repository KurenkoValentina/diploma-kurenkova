import { test } from '@playwright/test';
export class YourfeedPage {
  constructor(page) {
    this.page = page;
    this.profileName = page.getByRole('navigation');
    this.article = page.getByRole('link', { name: 'New Article' });
    this.yourFeedButton = page.getByRole('button', { name: 'Your feed' });
  }

  getProfileName() {
    return this.profileName;
  }
  async createArticle() {
    return test.step('Переход к созданию новой статьи', async () => {
      await this.article.click();
    });
  }
  getYourFeed() {
    return this.yourFeedButton;
  }
}
