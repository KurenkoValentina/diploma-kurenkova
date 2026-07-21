import { test } from '@playwright/test';

export class ChallengerService {
  constructor(request) {
    this.request = request;
  }

  // Бизнес-сценарии для эндпоинта
  async post() {
    return test.step('post /challenger', async () => {
      let response = await this.request.post('/challenger');

      const headers = await response.headers();
      const status = await response.status();
      return { headers, status };
    });
  }
}
