import fs from 'fs/promises';
import { mapPlaywrightReportToTestRun } from './playwright-report-mapper';
import { TestRun } from '@/types/test-run';

export async function readTestResultsFromJSON() {
  const testResults = JSON.parse(await fs.readFile('./test-results/test-results.json', 'utf8'));

  const metadata = {
    id: crypto.randomUUID(),
    branch: 'local',
    commitSha: 'local',
  };
  return mapPlaywrightReportToTestRun(testResults, metadata);
}

export async function addTestRun(run: TestRun) {
  await fs.writeFile(
    './data/test-runs.json',
    JSON.stringify([...(await getTestResultsFromJSON()), run], null, 2),
    'utf-8',
  );
}

export async function writeTestRunsToJSON(runs: TestRun[]) {
  await fs.writeFile('./data/test-runs.json', JSON.stringify(runs, null, 2), 'utf-8');
}

export async function getTestResultsFromJSON(): Promise<TestRun[]> {
  return JSON.parse(await fs.readFile('./data/test-runs.json', 'utf8'));
}

export async function saveCurrentTestRun() {
  await addTestRun(await readTestResultsFromJSON());
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
