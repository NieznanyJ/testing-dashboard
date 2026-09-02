import { PlaywrightReport, PlaywrightResult, PlaywrightSuite } from '@/types/playwright-report';

import { TestRun } from '@/types/test-run';
import { TestFile } from '@/types/test-file';
import { TestArtifact, TestResult, TestStatus } from '@/types/test-result';
import stripAnsi from 'strip-ansi';
import type { TestResult as PlaywrightTestResult } from '@playwright/test/reporter';
import path from 'path';

interface RunMetadata {
  id: string;
  branch: string;
  commitSha: string;
}

export function mapPlaywrightReportToTestRun(
  report: PlaywrightReport,
  metadata: RunMetadata,
): TestRun {
  const files = extractTestFiles(report.suites);
  const tests = files.flatMap((file) => file.tests);

  const passed = tests.filter((test) => test.status === 'passed').length;
  const failed = tests.filter((test) => test.status === 'failed').length;
  const skipped = tests.filter((test) => test.status === 'skipped').length;

  return {
    id: metadata.id,
    status: failed > 0 ? 'failed' : 'passed',
    branch: metadata.branch,
    commitSha: metadata.commitSha,
    startedAt: report.stats.startTime,
    finishedAt: new Date(
      new Date(report.stats.startTime).getTime() + report.stats.duration,
    ).toISOString(),
    duration: report.stats.duration,
    passed,
    failed,
    skipped,
    total: tests.length,
    files,
  };
}

function extractTestFiles(suites: PlaywrightSuite[]): TestFile[] {
  const files: TestFile[] = [];

  for (const rootSuite of suites) {
    const featureSuites = rootSuite.suites ?? [];

    for (const featureSuite of featureSuites) {
      const tests: TestResult[] = featureSuite.specs.flatMap((spec) =>
        spec.tests.map((test) => {
          const result = test.results.at(-1);

          return {
            id: spec.id,
            name: spec.title,
            status: mapStatus(result?.status),
            duration: result?.duration,
            error: getError(result),
            artifacts: getArtifacts(result),
          };
        }),
      );

      files.push({
        id: featureSuite.file,
        name: featureSuite.title,
        tests,
      });
    }
  }

  return files;
}

export function mapStatus(status?: string): TestStatus {
  switch (status) {
    case 'passed':
      return 'passed';

    case 'skipped':
      return 'skipped';

    case 'failed':
    case 'timedOut':
    case 'interrupted':
      return 'failed';

    default:
      return 'pending';
  }
}

function getError(result?: PlaywrightResult): string | undefined {
  if (!result?.errors?.length) {
    return undefined;
  }

  return result.errors
    .map((error) => error.message)
    .filter((message): message is string => Boolean(message))
    .map((message) => stripAnsi(message))
    .join('\n');
}

export function getArtifacts(result?: PlaywrightTestResult): TestArtifact[] {
  if (!result) {
    return [];
  }

  return result.attachments.flatMap((attachment) => {
    if (!attachment.path) {
      return [];
    }

    let type: TestArtifact['type'] | undefined;

    if (attachment.contentType === 'image/png') {
      type = 'screenshot';
    } else if (attachment.name === 'trace') {
      type = 'trace';
    } else if (attachment.contentType === 'video/webm') {
      type = 'video';
    }

    if (!type) {
      return [];
    }

    const relativePath = path.relative(process.cwd(), attachment.path);
    return [
      {
        type,
        name: attachment.name,
        url: relativePath,
      },
    ];
  });
}
