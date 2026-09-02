import { TestRun } from '@/types/test-run';

export const mockTestRuns: TestRun[] = [
  {
    id: '103',
    status: 'running',
    branch: 'main',
    commitSha: 'c18f42b',
    startedAt: '2026-09-01T09:30:00Z',
    passed: 3,
    failed: 1,
    skipped: 0,
    total: 6,
    files: [
      {
        id: 'checkout',
        name: 'checkout.feature',
        tests: [
          {
            id: 'checkout-1',
            name: 'User opens checkout',
            status: 'passed',
            duration: 1200,
          },
          {
            id: 'checkout-2',
            name: 'User enters address',
            status: 'passed',
            duration: 1800,
          },
          {
            id: 'checkout-3',
            name: 'User completes payment',
            status: 'running',
          },
          {
            id: 'checkout-4',
            name: 'User sees confirmation',
            status: 'pending',
          },
        ],
      },
      {
        id: 'login',
        name: 'login.feature',
        tests: [
          {
            id: 'login-1',
            name: 'User logs in',
            status: 'passed',
            duration: 900,
          },
          {
            id: 'login-2',
            name: 'Invalid login shows error',
            status: 'failed',
            duration: 1100,
            error: 'Expected login error message to be visible',
            artifacts: [
              {
                type: 'screenshot',
                name: 'failure.png',
                url: '/mock/failure.png',
              },
            ],
          },
        ],
      },
    ],
  },
];
