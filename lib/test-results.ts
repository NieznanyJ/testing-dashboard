import fs from 'fs/promises';
import { TestRun } from '@/types/test-run';

const TEST_RUNS_FILE = './data/test-runs.json';

export async function addTestRun(run: TestRun) {
  await writeTestRunsToJSON([...(await getTestResultsFromJSON()), run]);
}

export async function writeTestRunsToJSON(runs: TestRun[]) {
  await fs.writeFile(TEST_RUNS_FILE, JSON.stringify(runs, null, 2), 'utf-8');
}

export async function getTestResultsFromJSON(): Promise<TestRun[]> {
  try {
    return JSON.parse(await fs.readFile(TEST_RUNS_FILE, 'utf8'));
  } catch (error) {
    // The file is created by the reporter on the first run.
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') return [];
    throw error;
  }
}

let writeQueue = Promise.resolve();

export function updateTestRun(updatedRun: TestRun) {
  writeQueue = writeQueue.then(async () => {
    const runs = await getTestResultsFromJSON();

    const index = runs.findIndex((run) => run.id === updatedRun.id);

    if (index === -1) return;

    runs[index] = structuredClone(updatedRun);

    await writeTestRunsToJSON(runs);
  });

  return writeQueue;
}
