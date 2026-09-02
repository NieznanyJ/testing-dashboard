import { TestProject } from '@/types/test-project';

export const mockProjects: TestProject[] = [
  {
    id: 'project-1',
    name: 'E-commerce E2E',
    repo: 'ecommerce-tests',
    defaultBranch: 'main',
    testCommand: 'npm run test:e2e',
  },
  {
    id: 'project-2',
    name: 'Banking App',
    repo: 'banking-e2e-tests',
    defaultBranch: 'develop',
    testCommand: 'npm run test:e2e',
  },
  {
    id: 'project-3',
    name: 'Customer Portal',
    repo: 'customer-portal-tests',
    defaultBranch: 'main',
    testCommand: 'npx playwright test',
  },
  {
    id: 'project-4',
    name: 'Admin Dashboard',
    repo: 'admin-dashboard-tests',
    defaultBranch: 'main',
    testCommand: 'npm run test:e2e',
  },
];
