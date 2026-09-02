import { TestFile } from './test-file';

export type TestRunStatus = 'pending' | 'running' | 'passed' | 'failed';

export interface TestRun {
  id: string;
  projectId: string;
  status: TestRunStatus;
  branch: string;
  commitSha: string;
  startedAt: string;
  finishedAt?: string;
  duration?: number;

  passed: number;
  failed: number;
  skipped: number;
  total: number;

  files: TestFile[];
}
