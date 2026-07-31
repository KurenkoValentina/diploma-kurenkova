import { expect } from '@playwright/test';
import { test } from '../../src/helpers/fixtures/fixture';

test.describe('Фильтрация статей по тегам незарегистрированным пользователем', () => {
  test('При клике на тэг отображаются статьи с соответствующей меткой', async ({ webApp }) => {
    //кликаем на тэг, сохраняем его имя
    const tagName = await webApp.main.getArticlesWithTags();
    expect(tagName).toBeTruthy();
    // Проверяем, что тег есть в статьях
    const tagLists = webApp.main.getArticleTagList();
    const count = await tagLists.count();
    for (let i = 0; i < count; i++) {
      await expect(tagLists.nth(i)).toContainText(tagName);
    }
  });
});
