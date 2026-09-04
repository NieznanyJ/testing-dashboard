import { TestRun } from './test-run';

export interface TestProject {
  id: string;
  name: string;
  repo: string;
  defaultBranch: string;
  testCommand: string;
  createdAt: string;
  runs: TestRun[];
}
