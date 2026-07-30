import { test } from '@playwright/test';
export class ArticlePage {
  constructor(page) {
    this.page = page;
    this.articleTitle = page.locator('div.container h1');
    this.articleText = page.getByRole('paragraph');
    this.EditButton = page.getByRole('link', { name: 'Edit Article' }).first();
    this.deleteArticleButton = page
      .locator('.banner')
      .getByRole('button', { name: /Delete Article/ });
    this.comment = page.getByPlaceholder('Write a comment...');
    this.postCommentButton = page.getByRole('button', { name: 'Post Comment' });
    this.yourComment = page.locator('.card-block .card-text');
  }
  getArticleTitle() {
    return this.articleTitle;
  }
  getArticleText() {
    return this.articleText;
  }
  async updateArticle() {
    return test.step('Переход к редактированию статьи', async () => {
      await this.EditButton.click();
    });
  }
  async postComment(commentText) {
    return test.step('Публикация комментария', async () => {
      await this.comment.click();
      await this.comment.fill(commentText);
      await this.postCommentButton.click();
    });
  }
  getyourComment() {
    return this.yourComment;
  }
  async deleteArticle() {
    return test.step('Удаление статьи', async () => {
      this.page.once('dialog', (dialog) => dialog.accept());
      await this.deleteArticleButton.click();
    });
  }
}
