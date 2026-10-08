import { Locator, Page } from '@playwright/test';

export class HomePage {
  readonly heading: Locator;
  readonly createProjectButton: Locator;

  constructor(private readonly page: Page) {
    this.heading = page.getByRole('heading', { level: 1 });
    this.createProjectButton = page.getByRole('main').getByRole('link', { name: 'Create project' });
  }

  async goto() {
    await this.page.goto('/');
  }
}
