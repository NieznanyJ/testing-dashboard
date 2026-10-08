import { Locator, Page } from '@playwright/test';

export class NewProjectPage {
  readonly heading: Locator;
  readonly nameInput: Locator;
  readonly repositoryInput: Locator;
  readonly submitButton: Locator;

  constructor(private readonly page: Page) {
    this.heading = page.getByText('Create a project', { exact: true });
    this.nameInput = page.getByLabel('Project name');
    this.repositoryInput = page.getByLabel('Repository');
    this.submitButton = page.getByRole('button', { name: 'Create project' });
  }

  async goto() {
    await this.page.goto('/projects/new');
  }

  async createProject(name: string, repository: string) {
    await this.nameInput.fill(name);
    await this.repositoryInput.fill(repository);
    await this.submitButton.click();
  }
}
