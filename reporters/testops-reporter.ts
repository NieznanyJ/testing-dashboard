import { addTestRun, updateTestRun } from '@/lib/test-results';
import { TestRun } from '@/types/test-run';
import type {
  FullConfig,
  FullResult,
  Reporter,
  Suite,
  TestCase,
  TestResult,
} from '@playwright/test/reporter';
import type { TestResult as AppTestResult } from '@/types/test-result';
import { formatErrors, getArtifacts, mapStatus } from '@/lib/playwright-report-mapper';
import { execFileSync } from 'child_process';
import path from 'path';

const TESTOPS_URL = process.env.TESTOPS_URL ?? 'http://localhost:3000';

function readGit(args: string[], fallback: string) {
  try {
    return execFileSync('git', args, { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }).trim();
  } catch {
    return fallback;
  }
}

function getFileInfo(test: TestCase) {
  const id = path.relative(process.cwd(), test.location.file);

  let suite = test.parent;
  while (suite.parent?.type === 'describe') {
    suite = suite.parent;
  }

  return { id, name: suite.type === 'describe' ? suite.title : path.basename(id) };
}

class TestOpsReporter implements Reporter {
  private run: TestRun;
  private dashboardWarningShown = false;

  constructor() {
    this.run = {
      id: crypto.randomUUID(),
      projectId: process.env.TESTOPS_PROJECT_ID ?? 'local',
      branch: readGit(['rev-parse', '--abbrev-ref', 'HEAD'], 'local'),
      commitSha: readGit(['rev-parse', '--short', 'HEAD'], 'local'),
      status: 'running',
      startedAt: new Date().toISOString(),
      passed: 0,
      failed: 0,
      skipped: 0,
      total: 0,
      files: [],
    };
  }

  // The dashboard is optional: if it is not running, warn once and let the tests continue.
  private async broadcastRun() {
    try {
      await fetch(`${TESTOPS_URL}/api/run-events`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(this.run),
      });
    } catch {
      if (!this.dashboardWarningShown) {
        console.warn(`[testops-reporter] Dashboard not reachable at ${TESTOPS_URL}, live updates disabled.`);
        this.dashboardWarningShown = true;
      }
    }
  }

  async onBegin(_config: FullConfig, suite: Suite): Promise<void> {
    this.run.total = suite.allTests().length;
    await addTestRun(this.run);
    await this.broadcastRun();
  }

  async onTestBegin(test: TestCase): Promise<void> {
    const testResult: AppTestResult = {
      id: test.id,
      name: test.title,
      status: 'running',
    };

    const { id, name } = getFileInfo(test);
    const existingFile = this.run.files.find((file) => file.id === id);

    if (existingFile) {
      existingFile.tests.push(testResult);
    } else {
      this.run.files.push({ id, name, tests: [testResult] });
    }

    await updateTestRun(this.run);
    await this.broadcastRun();
  }

  async onTestEnd(test: TestCase, result: TestResult): Promise<void> {
    const file = this.run.files.find((file) =>
      file.tests.some((existingTest) => existingTest.id === test.id),
    );

    const testResult = file?.tests.find((existingTest) => existingTest.id === test.id);

    if (testResult) {
      testResult.status = mapStatus(result.status);
      testResult.duration = result.duration;
      testResult.error = formatErrors(result.errors);
      testResult.artifacts = getArtifacts(result);
    }

    const tests = this.run.files.flatMap((file) => file.tests);
    const stats = tests.reduce(
      (acc, test) => {
        if (test.status === 'passed') acc.passed++;
        if (test.status === 'failed') acc.failed++;
        if (test.status === 'skipped') acc.skipped++;

        return acc;
      },
      {
        passed: 0,
        failed: 0,
        skipped: 0,
      },
    );
    this.run.passed = stats.passed;
    this.run.failed = stats.failed;
    this.run.skipped = stats.skipped;

    await updateTestRun(this.run);
    await this.broadcastRun();
  }

  async onEnd(result: FullResult): Promise<void> {
    this.run.finishedAt = new Date().toISOString();
    this.run.duration = result.duration;
    this.run.status = result.status === 'passed' ? 'passed' : 'failed';
    await updateTestRun(this.run);
    await this.broadcastRun();
  }
}

export default TestOpsReporter;
