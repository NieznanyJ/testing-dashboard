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
import { getArtifacts, mapStatus } from '@/lib/playwright-report-mapper';
import stripAnsi from 'strip-ansi';
import { broadcast } from '@/lib/run-events';

async function broadcastRun(run: TestRun) {
  await fetch('http://localhost:3000/api/run-events', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(run),
  });
}

class TestOpsReporter implements Reporter {
  private run: TestRun;

  constructor() {
    this.run = {
      id: crypto.randomUUID(),
      projectId: process.env.TESTOPS_PROJECT_ID ?? 'local',
      branch: 'local',
      commitSha: 'local',
      status: 'running',
      startedAt: new Date().toISOString(),
      passed: 0,
      failed: 0,
      skipped: 0,
      total: 0,
      files: [],
    };
  }

  async onBegin(config: FullConfig, suite: Suite): void {
    console.log('>>>>>>>>>>>>>>>>>>>>run started');
    this.run.total = suite.allTests().length;
    await addTestRun(this.run);

    await fetch('http://localhost:3000/api/run-events', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(this.run),
    });
  }

  async onTestBegin(test: TestCase, result: TestResult): void {
    console.log(`>>>>>>>>>>>>${test.title} running`);
    const testResult: AppTestResult = {
      id: test.id,
      name: test.title,
      status: 'running',
    };

    const file = {
      id: test.titlePath()[2],
      name: test.titlePath()[3],
      tests: [testResult],
    };

    const fileIndex = this.run.files.findIndex((existingFile) => existingFile.id === file.id);
    if (fileIndex === -1) {
      this.run.files.push(file);
    } else {
      this.run.files[fileIndex].tests.push(testResult);
    }

    await updateTestRun(this.run);
    await broadcastRun(this.run);
  }

  async onTestEnd(test: TestCase, result: TestResult) {
    const file = this.run.files.find((file) =>
      file.tests.some((existingTest) => existingTest.id === test.id),
    );

    const testResult = file?.tests.find((existingTest) => existingTest.id === test.id);

    if (testResult) {
      testResult.status = mapStatus(result.status);
      testResult.duration = result.duration;
      testResult.error = result.errors[1]?.message ? stripAnsi(result.errors[1].message) : '';
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
    await broadcastRun(this.run);
  }

  async onEnd(result: FullResult) {
    console.log(`Finished the run: ${result.status}`);
    this.run.finishedAt = new Date().toISOString();
    this.run.duration = result.duration;
    this.run.status = result.status === 'passed' ? 'passed' : 'failed';
    await updateTestRun(this.run);
    await broadcastRun(this.run);
  }
}

export default TestOpsReporter;
