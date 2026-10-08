import { test as base, createBdd } from 'playwright-bdd';

import { HomePage } from '../pages/HomePage';
import { NewProjectPage } from '../pages/NewProjectPage';
import { RunsPage } from '../pages/RunsPage';
import { TestRun } from '@/types/test-run';

interface Fixtures {
  homePage: HomePage;
  newProjectPage: NewProjectPage;
  runsPage: RunsPage;
  // Unique per scenario, so scenarios never see each other's runs.
  projectId: string;
  // The run the scenario sends to the dashboard, as the reporter would.
  currentRun: { value?: TestRun };
}

export const test = base.extend<Fixtures>({
  homePage: async ({ page }, use) => use(new HomePage(page)),
  newProjectPage: async ({ page }, use) => use(new NewProjectPage(page)),
  runsPage: async ({ page }, use) => use(new RunsPage(page)),
  projectId: async ({}, use) => use(`e2e-${crypto.randomUUID()}`),
  currentRun: async ({}, use) => use({}),
});

export const { Given, When, Then } = createBdd(test);
