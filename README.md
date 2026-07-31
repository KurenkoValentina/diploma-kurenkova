# 🎓 Дипломная работа QA.GURU | JS + Playwright | Автоматизация тестирования UI и API | 7 поток

[![Playwright](https://img.shields.io/badge/Playwright-2EAD33?style=for-the-badge&logo=playwright&logoColor=white)](https://playwright.dev/)
[![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)](https://developer.mozilla.org/ru/docs/Web/JavaScript)
[![Allure](https://img.shields.io/badge/Allure-000000?style=for-the-badge&logo=allure&logoColor=white)](https://docs.qameta.io/allure/)
[![GitHub Actions](https://img.shields.io/badge/GitHub_Actions-2088FF?style=for-the-badge&logo=github-actions&logoColor=white)](https://github.com/features/actions)
[![Jenkins](https://img.shields.io/badge/Jenkins-D24939?style=for-the-badge&logo=jenkins&logoColor=white)](https://www.jenkins.io/)

## 📑 Содержание

- [📝 Описание](#-описание)
- [🛠️ Технологический стек](#-технологический-стек)
- [📂 Структура проекта](#-структура-проекта)
- [🚀 Запуск тестов](#-запуск-тестов)
- [🔄 Запуск в CI/CD](#-запуск-в-cicd)
- [📊 Отчетность](#-отчетность)
- [🔔 Уведомления](#-уведомления)

---

## 📝 Описание

Дипломный проект, выполненный в рамках курса по автоматизации тестирования на JavaScript + Playwright. Проект включает UI и API тесты с интеграцией в CI/CD pipeline.

UI тесты — 10 функциональных автотестов (8 позитивных и 2 негативных) для приложения [realworld.qa.guru](https://realworld.qa.guru/).
API тесты — 8 функциональных автотестов для сервиса [apichallenges.eviltester.com](https://apichallenges.eviltester.com/gui/challenges).
Применённые паттерны:

- **Page Object Model** — для UI тестов
- **Service Object Model** — для API тестов
- **Builder Pattern** — для генерации тестовых данных
- **Fixtures** — для переиспользования настроек
- **Facade (Фасад)** — агрегация Page Objects и сервисов
- **Barrel (Баррель / `index.js`)** — централизованный экспорт модулей через файлы-агрегаторы для упрощения, чистоты импортов и удобства рефакторинга

---

## 🛠️ Технологический стек

Данный проект был написан на языке программирования JavaScript с использованием фреймворка Playwright. Для хранения исходного кода и запуска рабочих процессов используется облачная платформа GitHub с GitHub Actions.
Генерация отчетов о пройденных тестах формируется в Allure с отправкой отчетности в тест-менеджмент TestOps для анализа результатов и управления дефектами.
Уведомления о статусе выполнения тестов отправляются в чат Telegram посредством бота.

- **Фреймворк:** Playwright (JavaScript)
- **Архитектура:** Page Object Model (POM), Builder Pattern, Custom Fixtures
- **Отчетность:** Allure Report, Allure TestOps, HTML Report Playwright
- **CI/CD:** GitHub Actions / Jenkins
- **Уведомления:** Allure Notifications (Telegram)
- **Линтинг:** ESLint, Prettier

---

## 📂 Структура проекта

```text
diploma-kurenkova/
├── .github/
│   └── workflows/
│       └── main.yml                  # Конфигурация CI/CD (включая динамическую генерацию config.json для Telegram-уведомлений)
├── notifications
│
├── src/
│   ├── helpers/
│   │   ├── builders/                 # Builder Pattern (UserBuilder, ArticleBuilder и т.д.)
│   │   └── fixtures/                 # Кастомные фикстуры Playwright
│   ├── pages/                        # Page Objects для UI-тестов (MainPage, YourfeedPage и др.)
│   └── services/                     # API-клиенты и обертки для запросов
├── tests/
│   ├── api/
│   │   └── api.spec.js               # API-тесты
│   └── ui/
│       └── ui.spec.js                # UI-тесты
├── .gitignore                        # Игнорируемые файлы Git
├── Dockerfile                        # Образ Docker для запуска тестов в изолированном окружении
├── package.json                      # Зависимости и npm-скрипты
├── playwright.config.js              # Конфигурация Playwright (проекты, ретраи, репортеры)
└── README.md                         # Документация проекта
```

---

## 🚀 Запуск тестов

### 1. Предварительные требования

Перед запуском убедись, что у тебя установлены:

- **Node.js** >= 20.x ([скачать](https://nodejs.org/))
- **npm** >= 10.x (идет в комплекте с Node.js)
- **Git** ([скачать](https://git-scm.com/))

### 2. Установка

```bash
# Клонирование репозитория
git clone https://github.com/KurenkoValentina/diploma-kurenkova.git
cd diploma-kurenkova

# Установка зависимостей
npm install

# Установка браузеров Playwright
npx playwright install --with-deps
```

### 3️. Настройка переменных окружения

Скопируй файл с примером и заполни своими данными:

```bash
cp .env.example .env
```

Открой файл `.env` и укажи необходимые URL:

```env
UI_URL=https://realworld.qa.guru
API_URL=https://apichallenges.eviltester.com
```

Для связи с Allure TestOps через Git Hub actions нужно знать значения из env:  
ALLURE_TOKEN  
ALLURE_PROJECT_ID

Для настройки уведомлений в телеграмм через Git Hub actions нужно знать значения из env:  
TELEGRAM_CHAT_ID  
TELEGRAM_BOT_TOKEN

### 4️. Запуск тестов

| Команда            | Описание                                  |
| ------------------ | ----------------------------------------- |
| `npm run test`     | Запуск всех тестов (UI + API)             |
| `npm run t1`       | Запуск только UI-тестов                   |
| `npm run t2`       | Запуск только API-тестов                  |
| `npm run t:headed` | Запуск с открытым браузером (для отладки) |
| `npm run t:debug`  | Запуск в режиме отладки (пошагово)        |

### 5️. Просмотр отчетов

| Команда           | Описание                                  |
| ----------------- | ----------------------------------------- |
| `npm run report`  | Открыть встроенный HTML-отчет Playwright  |
| `npm run allureG` | Сгенерировать отчет Allure из результатов |
| `npm run allureO` | Открыть отчет Allure в браузере           |

---

## 🔄 Запуск в CI/CD

### GitHub Actions

Тесты автоматически запускаются при push в ветку main.
[Ссылка на GitHub Actions](https://github.com/KurenkoValentina/diploma-kurenkova/actions/)
![Успешный билд в GitHub Actions](media/GH.png)

### Jenkins

Проект настроен для запуска в Jenkins CI/CD.
Для доступа в [Jenkins](https://jenkins.qa.guru/) необходимо пройти регистрацию на платформе Jenkins.
Для запуска сборки нужно нажать кнопку Build now.

[Ссылка на сборку](https://jenkins.qa.guru/job/008-kuren-JSPW/)

![Jenkins ](media/jenkins.png)

## 📊 Отчетность

Для построения отчетов о пройденных тестах в данном проекте использовался Allure.

### Allure (Jenkins)

Отчет: https://jenkins.qa.guru/job/008-kuren-JSPW/allure-report/

![Уведомление в allure1](media/allurej.png)
![Уведомление в allure2](media/allurej1.png)

### Allure (GitHub Actions / локально)

![Уведомление в allure](media/allure1.png)

### Allure TestOps

Результаты тестов автоматически передаются в Allure TestOps как через GitHub Actions (при push в репозиторий), так и через Jenkins (по завершении сборки) в [Allure TestOps](https://allure.autotests.cloud/).
![Уведомление в testops1](media/testops2.png)
[Ссылка на проект](https://allure.qa.guru/project/5294/launches)
![Уведомление в testops](media/testops1.png)

## 🔔 Уведомления

После каждого запуска тестов приходит уведомление с результатами:
![Уведомление в Telegram](media/telegram-notification.png)
