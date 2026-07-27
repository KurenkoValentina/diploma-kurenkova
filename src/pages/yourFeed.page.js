export class YourfeedPage {
  constructor(page) {
    this.page = page;

    this.profileName = page.getByRole('navigation');
    this.article = page.getByRole('link', { name: 'New Article' });
    this.popularTag = page.locator('aside .tag-list .tag-pill').first();
    this.articleTags = page.locator('.article-preview .tag-list '); // блог тэгов для каждой статьи
    this.yourFeedButton = page.getByRole('button', { name: 'Your feed' });
  }

  getProfileName() {
    return this.profileName;
  }
  async createArticle() {
    await this.article.click();
  }
  async getArticlesWithTags() {
    const tagName = await this.popularTag.textContent();
    await this.popularTag.click();
    return tagName;
  }
  getArticleTagList() {
    // возвращаем все тэги в статьях
    return this.articleTags;
  }
  getYourFeed() {
    return this.yourFeedButton;
  }
}
