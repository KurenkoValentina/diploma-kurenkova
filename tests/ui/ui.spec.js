import { UserBuilder, ArticleBuilder, CommentBuilder } from '../../src/helpers/builders';
import { expect } from '@playwright/test';
import { test } from '../../src/helpers/fixtures/fixture';

test.describe('UI Tests', () => {
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
    await test.step('Действие: Обновление имени в настройках', async () => {
      await webApp.main.gotoSettings();
      await webApp.settings.updateName(newUsername.username);
      await webApp.settings.saveChanges();
    });
    await test.step('Проверка: Отображение нового имени и скрытие кнопки настроек', async () => {
      await expect(webApp.settings.settingsButton).toBeHidden();
      await expect(webApp.settings.newProfile).toContainText(newUsername.username);
    });
  });

  // тест 2 - проверка успешной смены пароля пользователя и логина с новым паролем
  test('Пользователь может поменять пароль и залогиниться с новым паролем', async ({ webApp }) => {
    const newPassword = new UserBuilder().withPassword().build();
    // меняем в настройках пароль
    await test.step('Изменение пароля в настройках профиля', async () => {
      await webApp.main.gotoSettings();
      await webApp.settings.updatePassword(newPassword.password);
      await webApp.settings.saveChanges();
      await expect(webApp.settings.settingsButton).toBeHidden();
    });
    //логаут и успешный логин с новым паролем
    await test.step('Выход из системы и авторизация с новым паролем', async () => {
      await webApp.main.gotologout();
      await webApp.main.gotologin();
      await webApp.login.login(testUser.email, newPassword.password);
      await expect(webApp.yourfeed.getProfileName()).toContainText(testUser.username);
    });
  });

  // тест 3 - пользователь может поменять email и авторизоваться потом с новым email
  test('Пользователь может поменять email и залогиниться потом с новым email', async ({
    webApp,
  }) => {
    const newEmail = new UserBuilder().withEmail().build();
    // меняем в настройках email + заполняем пароль старый, чтобы он не был пустым
    await test.step('Обновление email и подтверждение текущего пароля в настройках', async () => {
      await webApp.main.gotoSettings();
      await webApp.settings.updateEmail(newEmail.email);
      await webApp.settings.updatePassword(testUser.password);
      await webApp.settings.saveChanges();

      await expect(webApp.settings.settingsButton).toBeHidden();
    });
    //логаут и логин с новым email и старым паролем
    await test.step('Выход из системы и авторизация с новым email', async () => {
      await webApp.main.gotologout();
      await webApp.main.gotologin();
      await webApp.login.login(newEmail.email, testUser.password);
      await expect(webApp.yourfeed.getProfileName()).toContainText(testUser.username);
    });
  });

  // тест 4 - пользователь может создать статью
  test('Пользователь может создать статью', async ({ webApp }) => {
    //генерируем название статьи итд
    const article = new ArticleBuilder().withTitle().withDesc().withText().build();
    // заходим на создание статьи
    await test.step('Переход к созданию статьи и заполнение формы', async () => {
      await webApp.yourfeed.createArticle();
      // создаем статью
      await webApp.createArticle.makeArticle(article.title, article.desc, article.text);
    });
    // проверяем наличие нашей статьи
    await test.step('Проверка успешного создания и корректного отображения данных', async () => {
      await expect(webApp.article.getArticleTitle()).toContainText(article.title);
      await expect(webApp.article.getArticleText()).toContainText(article.text);
    });
  });

  //Тест 5  - пользователь может поменять текст статьи
  test('Пользователь может изменить текст статьи', async ({ webApp }) => {
    //генерируем название статьи итд
    const article = new ArticleBuilder().withTitle().withDesc().withText().build();
    const newText = new ArticleBuilder().withText().build();
    await test.step('Переход к созданию статьи и заполнение формы', async () => {
      await webApp.yourfeed.createArticle();
      await webApp.createArticle.makeArticle(article.title, article.desc, article.text);
    });
    // проверяем наличие нашей статьи
    await test.step('Проверка успешного создания и корректного отображения данных', async () => {
      await expect(webApp.article.getArticleTitle()).toContainText(article.title);
      await expect(webApp.article.getArticleText()).toContainText(article.text);
    });
    // нажимаем на "edit article", вносим правки и сохраняем
    await test.step('Редактирование текста статьи', async () => {
      await webApp.article.updateArticle();
      // на новой странице редактирования меняем текст статьи
      await webApp.editArticle.updateArticle(article.title, article.desc, newText.text);
    });
    //проверяем измененный текст
    await test.step('Проверка успешного изменения и корректного отображения данных', async () => {
      await expect(webApp.article.getArticleTitle()).toContainText(article.title);
      await expect(webApp.article.getArticleText()).toContainText(newText.text);
    });
  });

  // тест 6 - пользователь может оставить комментарий к статье
  test('Пользователь может оставить комментарий', async ({ webApp }) => {
    //генерируем название статьи итд
    const article = new ArticleBuilder().withTitle().withDesc().withText().build();
    const comment = new CommentBuilder().withComment().build();
    // заходим на создание статьи
    await test.step('Создание статьи (предусловие для комментирования)', async () => {
      await webApp.yourfeed.createArticle();
      await webApp.createArticle.makeArticle(article.title, article.desc, article.text);
      // проверяем наличие нашей статьи перед добавлением комментария
      await expect(webApp.article.getArticleTitle()).toContainText(article.title);
      await expect(webApp.article.getArticleText()).toContainText(article.text);
    });
    //добавляем комментарий
    await test.step('Публикация комментария под статьей', async () => {
      await webApp.article.postComment(comment.comment);
    });
    //проверяем комментарий
    await test.step('Проверка корректного отображения текста комментария', async () => {
      await expect(webApp.article.getyourComment()).toContainText(comment.comment);
    });
  });

  // тест 7 - пользователь может удалить статью
  test('Пользователь может удалить статью', async ({ webApp }) => {
    //генерируем название статьи итд
    const article = new ArticleBuilder().withTitle().withDesc().withText().build();

    await test.step('Переход к созданию статьи и заполнение формы', async () => {
      await webApp.yourfeed.createArticle();
      await webApp.createArticle.makeArticle(article.title, article.desc, article.text);
    });
    // проверяем наличие нашей статьи
    await test.step('Проверка успешного создания и корректного отображения данных', async () => {
      await expect(webApp.article.getArticleTitle()).toContainText(article.title);
      await expect(webApp.article.getArticleText()).toContainText(article.text);
    });
    // удаляем
    await test.step('Удаление статьи', async () => {
      await webApp.article.deleteArticle();
    });
    //проверяем переход на главную после удаления статьи
    await test.step('Проверка перехода на главную после удаления статьи', async () => {
      await expect(webApp.yourfeed.getYourFeed()).toContainText('Your Feed');
    });
  });

  // тест 8 - при клике на тэг - отображается статья с этим тэгом
  test('При клике на тэг отображаются статьи с соответствующей меткой', async ({ webApp }) => {
    let tagName;
    //кликаем на тэг, сохраняем его имя
    await test.step('Получение имени тэга из ленты и переход к отфильтрованным статьям', async () => {
      tagName = await webApp.yourfeed.getArticlesWithTags();
      expect(tagName).toBeTruthy();
    });
    // Проверяем, что тег есть в статьях
    await test.step('Проверка наличия тэга в отфильтрованном списке статей', async () => {
      await expect(webApp.yourfeed.getArticleTag()).toContainText(tagName);
    });
  });
});
