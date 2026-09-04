import { TestProject } from '@/types/test-project';

export const mockProjects: TestProject[] = [
  {
    id: 'project-1',
    name: 'E-commerce E2E',
    repo: 'ecommerce-tests',
    defaultBranch: 'main',
    testCommand: 'npm run test:e2e',
    createdAt: '2026-08-12T10:30:00Z',
    runs: [],
  },
  {
    id: 'project-2',
    name: 'Banking App',
    repo: 'banking-e2e-tests',
    defaultBranch: 'develop',
    testCommand: 'npm run test:e2e',
    createdAt: '2026-08-19T14:15:00Z',
    runs: [],
  },
  {
    id: 'project-3',
    name: 'Customer Portal',
    repo: 'customer-portal-tests',
    defaultBranch: 'main',
    testCommand: 'npx playwright test',
    createdAt: '2026-08-25T08:45:00Z',
    runs: [],
  },
  {
    id: 'project-4',
    name: 'Admin Dashboard',
    repo: 'admin-dashboard-tests',
    defaultBranch: 'main',
    testCommand: 'npm run test:e2e',
    createdAt: '2026-09-01T16:20:00Z',
    runs: [],
  },
];
