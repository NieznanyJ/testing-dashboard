import { addTestRun, updateTestRun } from '@/lib/test-results';
import { createRun, updateRun } from '@/lib/prisma';
import { db } from '@/src/prisma/db';
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
import { archiveArtifacts } from '@/lib/artifact-storage';

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
  private writeQueue: Promise<void> = Promise.resolve();

  private saveRun(create = false) {
    const snapshot = structuredClone(this.run);
    this.writeQueue = this.writeQueue.then(async () => {
      if (create) {
        await createRun(snapshot);
        await addTestRun(snapshot);
      } else {
        await updateRun(snapshot.id, {
          status: snapshot.status,
          finishedAt: snapshot.finishedAt,
          duration: snapshot.duration,
          passed: snapshot.passed,
          failed: snapshot.failed,
          skipped: snapshot.skipped,
          total: snapshot.total,
          files: snapshot.files,
        });
        await updateTestRun(snapshot);
      }
      await broadcastRun(snapshot).catch((error: unknown) => {
        console.error('Failed to broadcast TestOps run:', error);
      });
    });
    // Playwright does not await onBegin/onTestEnd; onEnd drains this queue.
    void this.writeQueue.catch(() => {});
    return this.writeQueue;
  }

  constructor() {
    const projectId = process.env.TESTOPS_PROJECT_ID;
    if (!projectId) {
      throw new Error('Set TESTOPS_PROJECT_ID to an existing project ID before running tests.');
    }
    this.run = {
      id: crypto.randomUUID(),
      projectId,
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

  onBegin(_config: FullConfig, suite: Suite) {
    this.run.total = suite.allTests().length;
    void this.saveRun(true);
  }
  onTestBegin(test: TestCase) {
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
      const tests = this.run.files[fileIndex].tests;
      const existingIndex = tests.findIndex((existingTest) => existingTest.id === test.id);
      if (existingIndex === -1) tests.push(testResult);
      else tests[existingIndex] = testResult;
    }

    void this.saveRun();
  }

  onTestEnd(test: TestCase, result: TestResult) {
    const file = this.run.files.find((file) =>
      file.tests.some((existingTest) => existingTest.id === test.id),
    );

    const testResult = file?.tests.find((existingTest) => existingTest.id === test.id);

    if (testResult) {
      testResult.status = mapStatus(result.status);
      testResult.duration = result.duration;
      testResult.error = result.errors.map((error) => stripAnsi(error.message ?? '')).join('\n');
      testResult.artifacts = archiveArtifacts(this.run.id, getArtifacts(result));
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

    void this.saveRun();
  }

  async onEnd(result: FullResult) {
    console.log(`Finished the run: ${result.status}`);
    this.run.finishedAt = new Date().toISOString();
    this.run.duration = result.duration;
    this.run.status = result.status === 'passed' ? 'passed' : 'failed';
    await this.saveRun();
  }
  async onExit() {
    try {
      await this.writeQueue;
    } finally {
      await db.close();
    }
  }
}

export default TestOpsReporter;
