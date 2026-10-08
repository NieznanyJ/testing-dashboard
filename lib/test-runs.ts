import { TestRun } from '@/types/test-run';
import { getTestResultsFromJSON } from './test-results';

export async function getTestRuns(projectId?: string): Promise<TestRun[]> {
  const runs = await getTestResultsFromJSON();
  return projectId ? runs.filter((run) => run.projectId === projectId) : runs;
}

export async function getTestRunById(runId: string): Promise<TestRun | undefined> {
  const runs = await getTestResultsFromJSON();
  return runs.find((run) => run.id === runId);
}
