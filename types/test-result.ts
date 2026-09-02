export type TestStatus = 'pending' | 'running' | 'passed' | 'failed' | 'skipped';

export interface TestArtifact {
  type: 'screenshot' | 'trace' | 'video';
  name: string;
  url: string;
}

export interface TestResult {
  id: string;
  name: string;
  status: TestStatus;
  duration?: number;
  error?: string;
  artifacts?: TestArtifact[];
}
