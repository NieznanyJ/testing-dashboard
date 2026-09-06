// @vitest-environment node
import { afterEach, beforeEach, expect, it, vi } from 'vitest';
import type {
  FullConfig,
  FullResult,
  Suite,
  TestCase,
  TestResult,
} from '@playwright/test/reporter';

const mocks = vi.hoisted(() => ({
  create: vi.fn(),
  update: vi.fn(),
  addJson: vi.fn(),
  updateJson: vi.fn(),
  close: vi.fn(),
}));
vi.mock('@/lib/prisma', () => ({ createRun: mocks.create, updateRun: mocks.update }));
vi.mock('@/lib/test-results', () => ({
  addTestRun: mocks.addJson,
  updateTestRun: mocks.updateJson,
}));
vi.mock('@/src/prisma/db', () => ({ db: { close: mocks.close } }));
import TestOpsReporter from '../reporters/testops-reporter';

const testCase = {
  id: 'test-1',
  title: 'passes',
  titlePath: () => ['', 'chromium', 'feature.ts', 'Feature', 'passes'],
} as TestCase;
const suite = { allTests: () => [testCase] } as unknown as Suite;
const result = {
  status: 'passed',
  duration: 12,
  errors: [],
  attachments: [],
} as unknown as TestResult;
const fullResult = { status: 'passed', duration: 30 } as FullResult;

beforeEach(() => {
  vi.resetAllMocks();
  vi.stubEnv('TESTOPS_PROJECT_ID', 'project-1');
  vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: true }));
});
afterEach(() => {
  vi.unstubAllEnvs();
  vi.unstubAllGlobals();
});

it('queues immutable snapshots behind creation and drains them before onEnd resolves', async () => {
  let release!: () => void;
  mocks.create.mockImplementation(
    () =>
      new Promise<void>((resolve) => {
        release = resolve;
      }),
  );
  const reporter = new TestOpsReporter();
  reporter.onBegin({} as FullConfig, suite);
  reporter.onTestBegin(testCase);
  reporter.onTestEnd(testCase, result);
  const finished = reporter.onEnd(fullResult);
  await Promise.resolve();
  expect(mocks.update).not.toHaveBeenCalled();
  expect(mocks.create.mock.calls[0][0]).toMatchObject({ status: 'running', total: 1, files: [] });
  release();
  await finished;
  const updates = mocks.update.mock.calls;
  expect(updates).toHaveLength(3);
  expect(updates[0][1].files[0].tests[0].status).toBe('running');
  expect(updates[1][1]).toMatchObject({ status: 'running', passed: 1 });
  expect(updates[2][1]).toMatchObject({ status: 'passed', passed: 1, duration: 30 });
  expect(updates[2][1].finishedAt).toBeDefined();
  expect(updates.every(([id]) => id === mocks.create.mock.calls[0][0].id)).toBe(true);
  await reporter.onExit();
  expect(mocks.close).toHaveBeenCalledOnce();
});

it('replaces retry results without counting the same test twice', async () => {
  const reporter = new TestOpsReporter();
  reporter.onBegin({} as FullConfig, suite);
  reporter.onTestBegin(testCase);
  reporter.onTestEnd(testCase, { ...result, status: 'failed' });
  reporter.onTestBegin(testCase);
  reporter.onTestEnd(testCase, result);
  await reporter.onEnd(fullResult);
  const final = mocks.update.mock.calls.at(-1)![1];
  expect(final).toMatchObject({ passed: 1, failed: 0, total: 1 });
  expect(final.files[0].tests).toHaveLength(1);
});

it('surfaces a failed create at onEnd and closes the database on exit', async () => {
  mocks.create.mockRejectedValue(new Error('database unavailable'));
  const reporter = new TestOpsReporter();
  reporter.onBegin({} as FullConfig, suite);
  await expect(reporter.onEnd(fullResult)).rejects.toThrow('database unavailable');
  expect(mocks.update).not.toHaveBeenCalled();
  await expect(reporter.onExit()).rejects.toThrow('database unavailable');
  expect(mocks.close).toHaveBeenCalledOnce();
});

it('requires a real project ID to be configured', () => {
  vi.stubEnv('TESTOPS_PROJECT_ID', '');
  expect(() => new TestOpsReporter()).toThrow('TESTOPS_PROJECT_ID');
});
