import { TestResult } from './test-result';

export interface TestFile {
  id: string;
  name: string;
  tests: TestResult[];
}
