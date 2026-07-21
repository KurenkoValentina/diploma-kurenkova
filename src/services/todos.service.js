import { test } from '@playwright/test';

export class TodosService {
  constructor(request) {
    this.request = request;
  }

  // Создать задачу
  async post(token, todo) {
    return test.step('post /todos', async () => {
      let response = await this.request.post('/todos', {
        headers: {
          'x-challenger': token,
        },
        data: todo,
      });

      const headers = await response.headers();
      const body = await response.json();
      const status = await response.status();

      return { body, headers, status };
    });
  }

  // Получить список всех задач
  async getAllTodos(token) {
    return test.step('get /todos', async () => {
      let response = await this.request.get('/todos', {
        headers: {
          'x-challenger': token,
        },
      });

      const headers = await response.headers();
      const body = await response.json();
      const status = await response.status();
      return { body, headers, status };
    });
  }
  // Получить задачу по id
  async getTodoById(token, id) {
    return test.step(`GET /todos/${id}`, async () => {
      let response = await this.request.get(`/todos/${id}`, {
        headers: {
          'x-challenger': token,
        },
      });

      const headers = await response.headers();
      const body = await response.json();
      return { body, headers };
    });
  }
  // Получить все сделанные задачи
  async getDoneTodos(token) {
    return test.step('get /todos?doneStatus=true', async () => {
      let response = await this.request.get('/todos?doneStatus=true', {
        headers: {
          'x-challenger': token,
        },
      });
      const headers = await response.headers();
      const body = await response.json();
      return { body, headers };
    });
  }
  // Обновить задачу по id
  async postById(token, todo, id) {
    return test.step(`POST /todos/${id}`, async () => {
      let response = await this.request.post(`/todos/${id}`, {
        headers: {
          'x-challenger': token,
        },
        data: todo,
      });
      const headers = await response.headers();
      const body = await response.json();
      const status = await response.status();
      return { body, headers, status };
    });
  }
  // Обновить все поля задачи
  async putById(token, todo, id) {
    return test.step(`PUT /todos/${id}`, async () => {
      let response = await this.request.put(`/todos/${id}`, {
        headers: {
          'x-challenger': token,
        },
        data: todo,
      });

      const headers = await response.headers();
      const body = await response.json();
      const status = await response.status();

      return { body, headers, status };
    });
  }
  // Удалить задачу
  async delete(token, id) {
    return test.step(`DELETE /todos/${id}`, async () => {
      let response = await this.request.delete(`/todos/${id}`, {
        headers: {
          'x-challenger': token,
        },
      });
      const status = await response.status();
      return { status };
    });
  }
}
