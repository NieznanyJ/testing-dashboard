import { expect } from '@playwright/test';

import { Given, Then, When } from '../support/fixtures';

Given('I am on the home page', async ({ homePage }) => {
  await homePage.goto();
});

When('I choose to create a project', async ({ homePage }) => {
  await homePage.createProjectButton.click();
});

Given('I am on the new project page', async ({ newProjectPage }) => {
  await newProjectPage.goto();
});

Then('I should see the new project form', async ({ page, newProjectPage }) => {
  await expect(page).toHaveURL(/\/projects\/new$/);
  await expect(newProjectPage.heading).toBeVisible();
});

When(
  'I create a project named {string} for repository {string}',
  async ({ newProjectPage }, name: string, repository: string) => {
    await newProjectPage.createProject(name, repository);
  },
);

Then(
  'I should be on the runs page of the new {string} project',
  async ({ page, runsPage }, slug: string) => {
    await expect(page).toHaveURL(new RegExp(`/projects/${slug}-[a-z0-9]+/runs$`));
    await expect(runsPage.heading).toBeVisible();
  },
);

Then('I should see that the project has no runs yet', async ({ runsPage }) => {
  await expect(runsPage.emptyState).toBeVisible();
});

Then('I should be able to start a test run', async ({ runsPage }) => {
  await expect(runsPage.runTestsButton).toBeEnabled();
});

Then('I should still be on the new project page', async ({ page, newProjectPage }) => {
  await expect(page).toHaveURL(/\/projects\/new$/);
  await expect(newProjectPage.nameInput).toBeFocused();
});
