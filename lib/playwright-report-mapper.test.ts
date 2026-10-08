import path from 'path';
import { describe, expect, it } from 'vitest';

import {
  formatErrors,
  getArtifacts,
  mapPlaywrightReportToTestRun,
  mapStatus,
} from './playwright-report-mapper';
import { PlaywrightReport, PlaywrightResult } from '@/types/playwright-report';

function result(overrides: Partial<PlaywrightResult> = {}): PlaywrightResult {
  return {
    status: 'passed',
    duration: 100,
    errors: [],
    retry: 0,
    steps: [],
    startTime: '2026-09-01T08:00:00.000Z',
    attachments: [],
    ...overrides,
  };
}

function spec(id: string, title: string, results: PlaywrightResult[]) {
  return {
    id,
    title,
    ok: true,
    tags: [],
    tests: [
      {
        expectedStatus: 'passed',
        projectId: 'chromium',
        projectName: 'chromium',
        status: 'expected',
        results,
      },
    ],
  };
}

describe('mapStatus', () => {
  it.each([
    ['passed', 'passed'],
    ['skipped', 'skipped'],
    ['failed', 'failed'],
    ['timedOut', 'failed'],
    ['interrupted', 'failed'],
    [undefined, 'pending'],
  ])('maps Playwright status %s to %s', (input, expected) => {
    expect(mapStatus(input)).toBe(expected);
  });
});

describe('formatErrors', () => {
  it('joins all error messages and strips ANSI colours', () => {
    const errors = [{ message: '\u001b[31mfirst\u001b[39m' }, {}, { message: 'second' }];

    expect(formatErrors(errors)).toBe('first\nsecond');
  });

  it('returns undefined when there are no messages', () => {
    expect(formatErrors([])).toBeUndefined();
    expect(formatErrors(undefined)).toBeUndefined();
  });
});

describe('getArtifacts', () => {
  it('keeps screenshots, traces and videos as paths relative to the project', () => {
    const screenshotPath = path.join(process.cwd(), 'test-results', 'login', 'test-failed-1.png');

    const artifacts = getArtifacts({
      attachments: [
        { name: 'screenshot', contentType: 'image/png', path: screenshotPath },
        { name: 'trace', contentType: 'application/zip', path: '/tmp/trace.zip' },
        { name: 'video', contentType: 'video/webm', path: '/tmp/video.webm' },
      ],
    });

    expect(artifacts.map((artifact) => artifact.type)).toEqual(['screenshot', 'trace', 'video']);
    expect(artifacts[0].url).toBe(path.join('test-results', 'login', 'test-failed-1.png'));
  });

  it('skips inline attachments and unknown content types', () => {
    const artifacts = getArtifacts({
      attachments: [
        { name: 'stdout', contentType: 'text/plain' },
        { name: 'log', contentType: 'text/plain', path: '/tmp/log.txt' },
      ],
    });

    expect(artifacts).toEqual([]);
  });

  it('returns no artifacts without a result', () => {
    expect(getArtifacts(undefined)).toEqual([]);
  });
});

describe('mapPlaywrightReportToTestRun', () => {
  const report: PlaywrightReport = {
    stats: {
      startTime: '2026-09-01T08:00:00.000Z',
      duration: 5000,
      expected: 1,
      skipped: 1,
      unexpected: 1,
      flaky: 0,
    },
    suites: [
      {
        title: 'login.feature.spec.js',
        file: 'login.feature.spec.js',
        specs: [],
        suites: [
          {
            title: 'Login',
            file: 'login.feature.spec.js',
            specs: [
              spec('a', 'Valid login', [result()]),
              spec('b', 'Invalid login', [
                result({ status: 'failed' }),
                result({ status: 'timedOut', errors: [{ message: 'Timeout 5000ms exceeded' }] }),
              ]),
              spec('c', 'Remember me', [result({ status: 'skipped' })]),
            ],
          },
        ],
      },
    ],
  };

  const run = mapPlaywrightReportToTestRun(report, {
    id: 'run-1',
    projectId: 'project-1',
    branch: 'main',
    commitSha: 'abc123',
  });

  it('copies the run metadata', () => {
    expect(run).toMatchObject({
      id: 'run-1',
      projectId: 'project-1',
      branch: 'main',
      commitSha: 'abc123',
      startedAt: '2026-09-01T08:00:00.000Z',
      finishedAt: '2026-09-01T08:00:05.000Z',
      duration: 5000,
    });
  });

  it('groups tests by feature and counts their statuses', () => {
    expect(run.files).toHaveLength(1);
    expect(run.files[0].name).toBe('Login');
    expect(run).toMatchObject({ total: 3, passed: 1, failed: 1, skipped: 1, status: 'failed' });
  });

  it('uses the last retry of each test', () => {
    const invalidLogin = run.files[0].tests.find((test) => test.id === 'b');

    expect(invalidLogin).toMatchObject({ status: 'failed', error: 'Timeout 5000ms exceeded' });
  });
});
