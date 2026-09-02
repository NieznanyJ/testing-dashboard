import { createBdd } from 'playwright-bdd';

const { Given, Then } = createBdd();

Given('I open the dashboard', async ({ page }) => {
  await page.goto('/');
});

Then('the dashboard should be visible', async ({ page }) => {
  await page.getByRole('heading', { name: 'Cloud Test Dashboard' }).waitFor();
});

Then('the dashboard should be not visible', async ({ page }) => {
  await page.getByRole('heading', { name: 'fff Test Dashboard' }).waitFor();
});
