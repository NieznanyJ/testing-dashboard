import {
  PlaywrightAttachment,
  PlaywrightError,
  PlaywrightReport,
  PlaywrightSuite,
} from '@/types/playwright-report';

import { TestRun } from '@/types/test-run';
import { TestFile } from '@/types/test-file';
import { TestArtifact, TestResult, TestStatus } from '@/types/test-result';
import stripAnsi from 'strip-ansi';
import path from 'path';

interface RunMetadata {
  id: string;
  projectId: string;
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
    projectId: metadata.projectId,
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
            error: formatErrors(result?.errors),
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

export function formatErrors(errors?: PlaywrightError[]): string | undefined {
  const messages = (errors ?? [])
    .map((error) => error.message)
    .filter((message): message is string => Boolean(message))
    .map((message) => stripAnsi(message));

  return messages.length ? messages.join('\n') : undefined;
}

// Accepts both a result from the JSON report and a live reporter result.
export function getArtifacts(result?: { attachments: PlaywrightAttachment[] }): TestArtifact[] {
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
