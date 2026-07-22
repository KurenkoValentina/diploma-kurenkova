import { test } from '../../src/helpers/fixtures/fixture';
import { expect } from '@playwright/test';
import { TodoBuilder } from '../../src/helpers/builders/todo.builder';

test.describe('API Tests', () => {
  let token;

  test.beforeEach(async ({ api }) => {
    const response = await api.challenger.post();
    token = response.headers['x-challenger'];
    // Базовая проверка, что токен получен
    expect(token).toBeDefined();
  });
  // Тест 1: Проверка токена на тип данных, на непустоту
  test('POST /challenger - проверка токена на валидность @POST', async ({ api }) => {
    expect(typeof token).toBe('string');
    expect(token.length).toBeGreaterThan(0);
    expect(token.trim()).not.toBe('');
  });

  // Тест 2: Проверка создания новой задачи todo POST /todos (201)
  test('POST /todos - создание новой задачи (201) @POST', async ({ api }) => {
    const todo = new TodoBuilder().addTitle().addDoneStatus(true).addDescription().build();
    const { body } = await api.todos.post(token, todo);

    expect(body.title).toEqual(todo.title);
    expect(body.doneStatus).toEqual(true);
    expect(body.description).toEqual(todo.description);
    expect(body.id).toBeDefined();
  });
  // Тест 3 Получение всех задач GET /todos
  test('GET /todos (200) - получение списка всех задач @GET', async ({ api }) => {
    const { body, status } = await api.todos.getAllTodos(token);

    expect(status).toBe(200);
    expect(body.todos.length).toBe(10);
  });
  // тест 4 получаем задачу todo по id GET /todos/{id}
  test('GET /todos/{id} (200) - получение задачи по id @GET', async ({ api }) => {
    const todo = new TodoBuilder().addTitle(2).addDoneStatus(true).addDescription(2).build();
    const { body: created } = await api.todos.post(token, todo);
    const localTodoId = created.id;
    const { body } = await api.todos.getTodoById(token, localTodoId);

    const todoId = body.todos[0].id;
    expect(todoId).toBe(localTodoId);
    expect(body.todos[0].title).toBe(todo.title);
  });

  // тест 5 - фильтруем задачи по статусу true
  test('GET /todos?filter (200) - получение задач по фильтру doneStatus=true @GET', async ({
    api,
  }) => {
    const doneTodo = new TodoBuilder().addTitle(2).addDoneStatus(true).addDescription(2).build();
    await api.todos.post(token, doneTodo);

    const { body } = await api.todos.getDoneTodos(token);
    // const doneStatus = body.todos[0].doneStatus;
    // expect(doneStatus).toBe(true);
    expect(body.todos.every((t) => t.doneStatus === true)).toBe(true);
    expect(body.todos.map((t) => t.title)).toContain(doneTodo.title);
  });

  // тест 6 обновить заголовок задачи по id POST /todos/{id} (200)
  test('POST /todos/{id} - обновление задачи(заголовка) по id @POST', async ({ api }) => {
    const todo = new TodoBuilder().addTitle(2).addDoneStatus(true).addDescription(3).build();
    const { body: created } = await api.todos.post(token, todo);
    const localTodoId = created.id;

    const newTitle = new TodoBuilder().addTitle().build();

    const { body } = await api.todos.postById(token, newTitle, localTodoId);
    expect(body.title).toEqual(newTitle.title);
    expect(body.doneStatus).toEqual(true);
    expect(body.description).toEqual(todo.description);
  });

  // тест 7 полное обновление задачи PUT /todos/{id} (200)
  test('PUT /todos/{id} - обновление задачи целиком по id @PUT', async ({ api }) => {
    const todo = new TodoBuilder().addTitle(2).addDoneStatus(false).addDescription(3).build();
    const { body: created } = await api.todos.post(token, todo);
    const localTodoId = created.id;

    const newToDo = new TodoBuilder().addTitle(3).addDoneStatus(true).addDescription(3).build();

    const { body } = await api.todos.putById(token, newToDo, localTodoId);
    expect(body.title).toEqual(newToDo.title);
    expect(body.doneStatus).toEqual(true);
    expect(body.description).toEqual(newToDo.description);
  });

  // тест 8 удаление задачи DELETE /todos/{id} (200)
  test('DELETE /todos/{id} - удаление задачи по id @DELETE', async ({ api }) => {
    const todo = new TodoBuilder().addTitle(2).addDoneStatus(false).build();
    const { body: created } = await api.todos.post(token, todo);
    const localTodoId = created.id;

    // проверка до удаления
    const { body: beforeDeleted } = await api.todos.getAllTodos(token);
    const beforeCount = beforeDeleted.todos.length;

    // удаляем
    const { status } = await api.todos.delete(token, localTodoId);
    expect(status).toBe(200);

    // проверяем после удаления
    const { body: afterDeleted } = await api.todos.getAllTodos(token);
    expect(afterDeleted.todos.length).toBe(beforeCount - 1);
  });
});
