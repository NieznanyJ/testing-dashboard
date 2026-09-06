import { afterEach, expect, it, vi } from 'vitest';
import { cleanup, render, screen, waitFor } from '@testing-library/react';
import RunDetailsView from './RunDetailsView';
import type { TestRun } from '@/types/test-run';

vi.mock('@/components/StartRunButton', () => ({ default: () => <button>Start run</button> }));
const run: TestRun = {
  id: 'real-run',
  projectId: 'real-project',
  status: 'passed',
  branch: 'feature/real',
  commitSha: 'abc1234',
  startedAt: '2026-09-05T10:00:00Z',
  finishedAt: '2026-09-05T10:00:01Z',
  duration: 1000,
  passed: 1,
  failed: 0,
  skipped: 0,
  total: 1,
  files: [
    {
      id: 'real-file',
      name: 'real.spec.ts',
      tests: [{ id: 'real-test', name: 'actual test result', status: 'passed' }],
    },
  ],
};
afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
});

it('renders persisted run data instead of mock values', () => {
  render(<RunDetailsView initialRun={run} />);
  expect(screen.getByText('feature/real')).toBeInTheDocument();
  expect(screen.getByText('abc1234')).toBeInTheDocument();
  expect(screen.getByText('real.spec.ts')).toBeInTheDocument();
  expect(screen.getByText('actual test result')).toBeInTheDocument();
  expect(screen.queryByText(/checkout/)).not.toBeInTheDocument();
});

it('refreshes an active run and closes the stream when completed', async () => {
  const close = vi.fn();
  vi.stubGlobal(
    'EventSource',
    class {
      onmessage = null;
      close = close;
    },
  );
  const fetchMock = vi.fn().mockResolvedValue({ ok: true, json: async () => run });
  vi.stubGlobal('fetch', fetchMock);
  render(
    <RunDetailsView
      initialRun={{
        ...run,
        status: 'running',
        finishedAt: undefined,
        duration: undefined,
        files: [],
        passed: 0,
        total: 0,
      }}
    />,
  );
  expect(screen.queryByText(/NaN/)).not.toBeInTheDocument();
  await waitFor(() => expect(screen.getByText('actual test result')).toBeInTheDocument());
  expect(fetchMock).toHaveBeenCalledWith(
    '/api/runs/real-run?projectId=real-project',
    expect.any(Object),
  );
  await waitFor(() => expect(close).toHaveBeenCalled());
});
