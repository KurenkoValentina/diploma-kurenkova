import { UserBuilder, ArticleBuilder, CommentBuilder } from '../../src/helpers/builders';
import { expect } from '@playwright/test';
import { test } from '../../src/helpers/fixtures/fixture';

test.describe('Тесты на действия со статьей', () => {
  let testUser;

  test.beforeEach(async ({ webApp }) => {
    //создали через билдер объект юзера
    testUser = new UserBuilder().withEmail().withPassword().withUsername().build();
    //  Переходим на сайт и регистрируемся
    await webApp.main.gotoRegister();
    await webApp.register.signup(testUser.username, testUser.email, testUser.password);
    await expect(webApp.yourfeed.getProfileName()).toContainText(testUser.username);
  });
  // тест 4 - пользователь может создать статью
  test('Пользователь может создать статью', async ({ webApp }) => {
    //генерируем название статьи итд
    const article = new ArticleBuilder().withTitle().withDesc().withText().build();
    // заходим на создание статьи
    await webApp.yourfeed.createArticle();
    // создаем статью
    await webApp.createArticle.makeArticle(article.title, article.desc, article.text);
    // проверяем наличие нашей статьи
    await expect(webApp.article.getArticleTitle()).toContainText(article.title);
    await expect(webApp.article.getArticleText()).toContainText(article.text);
  });

  //Тест 5  - пользователь может поменять текст статьи
  test('Пользователь может изменить текст статьи', async ({ webApp }) => {
    //генерируем название статьи итд
    const article = new ArticleBuilder().withTitle().withDesc().withText().build();
    const newText = new ArticleBuilder().withText().build();
    await webApp.yourfeed.createArticle();
    await webApp.createArticle.makeArticle(article.title, article.desc, article.text);
    // проверяем наличие нашей статьи
    await expect(webApp.article.getArticleTitle()).toContainText(article.title);
    await expect(webApp.article.getArticleText()).toContainText(article.text);
    // нажимаем на "edit article", вносим правки и сохраняем
    await webApp.article.updateArticle();
    // на новой странице редактирования меняем текст статьи
    await webApp.editArticle.updateArticle(article.title, article.desc, newText.text);
    //проверяем измененный текст
    await expect(webApp.article.getArticleTitle()).toContainText(article.title);
    await expect(webApp.article.getArticleText()).toContainText(newText.text);
  });
  // тест 6 - пользователь может оставить комментарий к статье
  test('Пользователь может оставить комментарий', async ({ webApp }) => {
    const article = new ArticleBuilder().withTitle().withDesc().withText().build();
    const comment = new CommentBuilder().withComment().build();
    await webApp.yourfeed.createArticle();
    await webApp.createArticle.makeArticle(article.title, article.desc, article.text);
    await expect(webApp.article.getArticleTitle()).toContainText(article.title);
    await expect(webApp.article.getArticleText()).toContainText(article.text);
    //добавляем комментарий
    await webApp.article.postComment(comment.comment);
    //проверяем комментарий
    await expect(webApp.article.getyourComment()).toContainText(comment.comment);
  });
  // тест 7 - пользователь может удалить статью
  test('Пользователь может удалить статью', async ({ webApp }) => {
    const article = new ArticleBuilder().withTitle().withDesc().withText().build();
    await webApp.yourfeed.createArticle();
    await webApp.createArticle.makeArticle(article.title, article.desc, article.text);
    // проверяем наличие нашей статьи
    await expect(webApp.article.getArticleTitle()).toContainText(article.title);
    await expect(webApp.article.getArticleText()).toContainText(article.text);
    // удаляем
    await webApp.article.deleteArticle();
    //проверяем переход на главную после удаления статьи
    await expect(webApp.yourfeed.getYourFeed()).toContainText('Your Feed');
  });
});
