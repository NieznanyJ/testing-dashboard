export interface PlaywrightReport {
  suites: PlaywrightSuite[];
  stats: PlaywrightStats;
}

export interface PlaywrightSuite {
  title: string;
  file: string;
  specs: PlaywrightSpec[];
  suites?: PlaywrightSuite[];
}

export interface PlaywrightSpec {
  id: string;
  title: string;
  ok: boolean;
  tags: string[];
  tests: PlaywrightTest[];
}

export interface PlaywrightTest {
  expectedStatus: string;
  projectId: string;
  projectName: string;
  status: string;
  results: PlaywrightResult[];
}

export interface PlaywrightResult {
  status: string;
  duration: number;
  errors: PlaywrightError[];
  retry: number;
  steps: PlaywrightStep[];
  startTime: string;
  attachments: PlaywrightAttachment[];
}

export interface PlaywrightError {
  message?: string;
  stack?: string;
  location?: {
    file: string;
    line: number;
    column: number;
  };
}

export interface PlaywrightStep {
  title: string;
  duration: number;
  error?: PlaywrightError;
}

export interface PlaywrightAttachment {
  name: string;
  contentType: string;
  path?: string;
}

export interface PlaywrightStats {
  startTime: string;
  duration: number;
  expected: number;
  skipped: number;
  unexpected: number;
  flaky: number;
}
