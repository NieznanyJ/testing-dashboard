import { fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { TestResultRow } from './TestResultRow';
import { TestResult } from '@/types/test-result';

const failedTest: TestResult = {
    id: 'test-1',
    name: 'User logs in with valid credentials',
    status: 'failed',
    duration: 1500,
    error: 'Expected heading "Dashboard" to be visible',
    artifacts: [
        { type: 'screenshot', name: 'screenshot', url: 'test-results/login/test-failed-1.png' },
        { type: 'trace', name: 'trace', url: 'test-results/login/trace.zip' },
    ],
};

describe('TestResultRow', () => {
    afterEach(() => {
        vi.unstubAllGlobals();
    });

    it('shows name, duration and status', () => {
        render(<TestResultRow test={failedTest} />);

        expect(screen.getByText('User logs in with valid credentials')).toBeInTheDocument();
        expect(screen.getByText('1.50s')).toBeInTheDocument();
        expect(screen.getByText('FAILED')).toBeInTheDocument();
    });

    it('does not offer details for a passed test', () => {
        render(<TestResultRow test={{ id: 'test-2', name: 'Passing test', status: 'passed' }} />);

        expect(screen.queryByRole('button', { name: 'View details' })).not.toBeInTheDocument();
    });

    it('expands and collapses the error and artifacts of a failed test', () => {
        render(<TestResultRow test={failedTest} />);

        expect(screen.queryByText(failedTest.error!)).not.toBeInTheDocument();

        fireEvent.click(screen.getByRole('button', { name: 'View details' }));

        expect(screen.getByText(failedTest.error!)).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'screenshot' })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'trace' })).toBeInTheDocument();

        fireEvent.click(screen.getByRole('button', { name: 'Hide details' }));

        expect(screen.queryByText(failedTest.error!)).not.toBeInTheDocument();
    });

    it('asks the server to open the trace viewer for the trace artifact', () => {
        const fetchMock = vi.fn().mockResolvedValue(new Response('{}'));
        vi.stubGlobal('fetch', fetchMock);

        render(<TestResultRow test={failedTest} />);
        fireEvent.click(screen.getByRole('button', { name: 'View details' }));
        fireEvent.click(screen.getByRole('button', { name: 'trace' }));

        expect(fetchMock).toHaveBeenCalledWith(
            '/api/artifacts/trace',
            expect.objectContaining({
                method: 'POST',
                body: JSON.stringify({ path: 'test-results/login/trace.zip' }),
            }),
        );
    });
});
