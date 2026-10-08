import { expect } from '@playwright/test';

import { Given, Then, When } from '../support/fixtures';
import { TestRun } from '@/types/test-run';
import { TestResult } from '@/types/test-result';

function testResults(count: number, status: TestResult['status']): TestResult[] {
  return Array.from({ length: count }, () => ({
    id: crypto.randomUUID(),
    name: `${status} test`,
    status,
    duration: 100,
  }));
}

Given('I am on the runs page of a new project', async ({ runsPage, projectId }) => {
  await runsPage.goto(projectId);
  await expect(runsPage.emptyState).toBeVisible();
});

Given(
  'the reporter starts a run with {int} tests',
  async ({ request, projectId, currentRun }, total: number) => {
    currentRun.value = {
      id: crypto.randomUUID(),
      projectId,
      status: 'running',
      branch: 'main',
      commitSha: 'abc1234',
      startedAt: new Date().toISOString(),
      passed: 0,
      failed: 0,
      skipped: 0,
      total,
      files: [{ id: 'login.feature', name: 'Login', tests: [] }],
    };

    await request.post('/api/run-events', { data: currentRun.value });
  },
);

When(
  'the reporter reports {int} passed and {int} failed tests',
  async ({ request, currentRun }, passed: number, failed: number) => {
    const run = currentRun.value!;
    run.passed = passed;
    run.failed = failed;
    run.files[0].tests = [...testResults(passed, 'passed'), ...testResults(failed, 'failed')];

    await request.post('/api/run-events', { data: run });
  },
);

When(
  'the reporter finishes the run with {int} passed tests in {int} ms',
  async ({ request, currentRun }, passed: number, duration: number) => {
    const run: TestRun = {
      ...currentRun.value!,
      status: 'passed',
      passed,
      duration,
      finishedAt: new Date().toISOString(),
    };

    await request.post('/api/run-events', { data: run });
  },
);

Then('I should see the run with {string}', async ({ runsPage, currentRun }, text: string) => {
  await expect(runsPage.runCard(currentRun.value!.id)).toContainText(text);
});

Then('the run should link to its details page', async ({ runsPage, projectId, currentRun }) => {
  const runId = currentRun.value!.id;

  await expect(runsPage.runCard(runId)).toHaveAttribute('href', `/projects/${projectId}/runs/${runId}`);
});

Then(
  'the run should show {int} passed and {int} failed tests',
  async ({ runsPage, currentRun }, passed: number, failed: number) => {
    const card = runsPage.runCard(currentRun.value!.id);
    const total = currentRun.value!.total;

    await expect(card.getByText(`${passed} / ${total}`)).toBeVisible();
    await expect(card.getByText(`${failed} / ${total}`)).toBeVisible();
  },
);
