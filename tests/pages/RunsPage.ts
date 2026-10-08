import { Locator, Page } from '@playwright/test';

export class RunsPage {
  readonly heading: Locator;
  readonly runTestsButton: Locator;
  readonly emptyState: Locator;

  constructor(private readonly page: Page) {
    this.heading = page.getByRole('heading', { name: 'Test runs' });
    this.runTestsButton = page.getByRole('button', { name: 'Run tests' });
    this.emptyState = page.getByText('No runs for this project yet.');
  }

  /**
   * Opens the runs page and waits until the live stream is connected,
   * so events sent afterwards are guaranteed to reach the page.
   */
  async goto(projectId: string) {
    const streamConnected = this.page.waitForResponse((response) =>
      response.url().endsWith(`/api/projects/${projectId}/runs/stream`),
    );

    await this.page.goto(`/projects/${projectId}/runs`);
    await streamConnected;
  }

  runCard(runId: string): Locator {
    return this.page.getByRole('link').filter({ hasText: runId });
  }
}
