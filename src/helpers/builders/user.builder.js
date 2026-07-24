import { faker } from '@faker-js/faker';
export class UserBuilder {
  withEmail() {
    const uniqueId = Date.now().toString().slice(-6);
    this.email = faker.internet.email({ lastName: `BIN${uniqueId}` });
    return this;
  }
  withPassword(length = 10) {
    this.password = faker.internet.password({ length: length });
    return this;
  }

  withUsername(name) {
    this.username = name ?? faker.person.fullName();
    return this;
  }
  build() {
    return {
      email: this.email,
      password: this.password,
      username: this.username,
    };
  }
}
