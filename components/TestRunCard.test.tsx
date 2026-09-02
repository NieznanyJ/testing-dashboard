import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { TestRunCard } from './TestRunCard';
import { TestRun } from '@/types/test-run';

describe('TestRunCard', () => {
    it('displays test run information', () => {
        const run: TestRun = {
            id: '123',
            status: 'failed',
            branch: 'main',
            commitSha: 'abc123',
            startedAt: '2026-09-01T08:00:00Z',

            passed: 8,
            failed: 2,
            skipped: 0,
            total: 10,

            files: [],
        };

        render(<TestRunCard run={run} />);

        expect(screen.getByText('Run #123')).toBeInTheDocument();
        expect(screen.getByText('main · abc123')).toBeInTheDocument();
        expect(screen.getByText('FAILED')).toBeInTheDocument();
        expect(screen.getByText('10/10 completed')).toBeInTheDocument();
        expect(screen.getByText('2 failed')).toBeInTheDocument();

        const link = screen.getByRole('link');
        expect(link).toHaveAttribute('href', '/runs/123');
    });
});