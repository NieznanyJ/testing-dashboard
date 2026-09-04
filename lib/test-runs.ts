import { TestRun } from '@/types/test-run';
import { getTestResultsFromJSON } from './test-results';

export async function getTestRuns(projectId: string): Promise<TestRun[]> {
  const runs = await getTestResultsFromJSON();
  return runs.filter((run) => run.projectId === projectId);
}
