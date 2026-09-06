import { expect, it } from 'vitest';
import { overviewStats, overviewDuration } from './project-overview';
import type { TestRun } from '@/types/test-run';
const now = Date.parse('2026-09-05T12:00:00Z');
const run: TestRun = {
  id: 'r1',
  projectId: 'p1',
  status: 'passed',
  branch: 'main',
  commitSha: 'abc',
  startedAt: '2026-09-05T10:00:00Z',
  duration: 60000,
  passed: 8,
  failed: 2,
  skipped: 5,
  total: 15,
  files: [],
};
it('handles a project with no runs', () => {
  const stats = overviewStats([], now);
  expect(stats.passRate).toBeNull();
  expect(stats.latest).toBeUndefined();
  expect(stats.runCount).toBe(0);
  expect(stats.trend).toHaveLength(7);
  expect(stats.trend.every((day) => day.passed === 0 && day.failed === 0)).toBe(true);
});
it('excludes skipped tests and active runs from pass rate and average duration', () => {
  const stats = overviewStats(
    [
      run,
      {
        ...run,
        id: 'r2',
        status: 'running',
        duration: undefined,
        startedAt: '2026-09-05T11:00:00Z',
      },
    ],
    now,
  );
  expect(stats.passRate).toBe(80);
  expect(stats.averageDuration).toBe(60000);
  expect(stats.runCount).toBe(2);
  expect(stats.passedRuns).toBe(1);
  expect(stats.latest?.id).toBe('r2');
  expect(stats.trend.at(-1)).toMatchObject({ passed: 80, failed: 20 });
});
it('ignores old runs in weekly metrics but keeps them in recent history', () => {
  const stats = overviewStats([{ ...run, startedAt: '2026-08-01T10:00:00Z' }], now);
  expect(stats.runCount).toBe(0);
  expect(stats.passRate).toBeNull();
  expect(stats.recentRuns).toHaveLength(1);
  expect(overviewDuration(0)).toBe('0m 0s');
  expect(overviewDuration(undefined)).toBe('�');
});
