import type { TestRun } from '@/types/test-run';

export function overviewStats(runs: TestRun[], now = Date.now()) {
  const today = new Date(now);
  today.setUTCHours(0, 0, 0, 0);
  const start = today.getTime() - 6 * 86400000;
  const recent = runs.filter(
    (run) => Date.parse(run.startedAt) >= start && Date.parse(run.startedAt) <= now,
  );
  const completed = recent.filter((run) => run.status === 'passed' || run.status === 'failed');
  const passed = completed.reduce((sum, run) => sum + run.passed, 0);
  const failed = completed.reduce((sum, run) => sum + run.failed, 0);
  const durations = completed.flatMap((run) => (run.duration === undefined ? [] : [run.duration]));
  const sorted = [...runs].sort((a, b) => Date.parse(b.startedAt) - Date.parse(a.startedAt));
  return {
    latest: sorted[0],
    recentRuns: sorted.slice(0, 3),
    runCount: recent.length,
    passedRuns: completed.filter((run) => run.status === 'passed').length,
    failedRuns: completed.filter((run) => run.status === 'failed').length,
    passRate: passed + failed ? Math.round((1000 * passed) / (passed + failed)) / 10 : null,
    averageDuration: durations.length
      ? durations.reduce((a, b) => a + b, 0) / durations.length
      : undefined,
    trend: Array.from({ length: 7 }, (_, index) => {
      const date = new Date(start + index * 86400000);
      const dayRuns = completed.filter(
        (run) => run.startedAt.slice(0, 10) === date.toISOString().slice(0, 10),
      );
      const passed = dayRuns.reduce((sum, run) => sum + run.passed, 0);
      const failed = dayRuns.reduce((sum, run) => sum + run.failed, 0);
      const total = passed + failed;
      return {
        label: date.toLocaleDateString('en-GB', {
          month: 'short',
          day: 'numeric',
          timeZone: 'UTC',
        }),
        passed: total ? (100 * passed) / total : 0,
        failed: total ? (100 * failed) / total : 0,
      };
    }),
  };
}

export function overviewDuration(duration?: number) {
  if (duration === undefined) return '0';
  const seconds = Math.round(duration / 1000);
  return `${Math.floor(seconds / 60)}m ${seconds % 60}s`;
}
