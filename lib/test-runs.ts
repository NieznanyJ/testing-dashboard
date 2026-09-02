import { TestRun } from '@/types/test-run';
import { getTestResultsFromJSON } from './test-results';

export async function getTestRuns(): Promise<TestRun[]> {
  const runs = await getTestResultsFromJSON();
  return runs;
}

export async function getTestRunById(id: string): Promise<TestRun | undefined> {
  const run = await getTestRuns();
  return run.find((run) => run.id === id);
}

export async function getTestsByRunId(id: string): Promise<TestRun | undefined> {
  const run = await getTestRunById(id);
}
