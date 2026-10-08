import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { TestRunCard } from './TestRunCard';
import { TestRun } from '@/types/test-run';

const run: TestRun = {
    id: 'run-123',
    projectId: 'project-1',
    status: 'failed',
    branch: 'main',
    commitSha: 'abc123',
    startedAt: '2026-09-01T08:00:00Z',
    finishedAt: '2026-09-01T08:00:12Z',
    duration: 12_000,

    passed: 7,
    failed: 2,
    skipped: 1,
    total: 10,

    files: [],
};

describe('TestRunCard', () => {
    it('shows the run summary', () => {
        render(<TestRunCard run={run} />);

        expect(screen.getByText('project-1')).toBeInTheDocument();
        expect(screen.getByText('run-123')).toBeInTheDocument();
        expect(screen.getByText('Branch: main · abc123')).toBeInTheDocument();
        expect(screen.getByText('Duration: 12.00s')).toBeInTheDocument();
        expect(screen.getByText('10/10 completed')).toBeInTheDocument();
        expect(screen.getByText('2 / 10')).toBeInTheDocument();
    });

    it('marks a failed run with a FAILED badge', () => {
        render(<TestRunCard run={run} />);

        // One badge for the run status and one next to the failed counter.
        expect(screen.getAllByText('FAILED')).toHaveLength(2);
    });

    it('links to the run details page of its project', () => {
        render(<TestRunCard run={run} />);

        expect(screen.getByRole('link')).toHaveAttribute('href', '/projects/project-1/runs/run-123');
    });

    it('counts only finished tests as completed while the run is in progress', () => {
        render(
            <TestRunCard
                run={{ ...run, status: 'running', passed: 3, failed: 1, skipped: 0, finishedAt: undefined, duration: undefined }}
            />,
        );

        expect(screen.getByText('4/10 completed')).toBeInTheDocument();
        expect(screen.queryByText(/Finished at/)).not.toBeInTheDocument();
        expect(screen.queryByText(/Duration/)).not.toBeInTheDocument();
    });
});
