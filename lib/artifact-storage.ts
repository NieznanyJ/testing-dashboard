import { copyFileSync, mkdirSync } from 'node:fs';
import path from 'node:path';
import { randomUUID } from 'node:crypto';
import type { TestArtifact } from '@/types/test-result';

export function archiveArtifacts(runId: string, artifacts: TestArtifact[]): TestArtifact[] {
  if (!/^[a-zA-Z0-9-]+$/.test(runId)) throw new Error('Invalid run ID');
  if (!artifacts.length) return [];
  const directory = path.join('.testops-artifacts', runId);
  mkdirSync(directory, { recursive: true });
  return artifacts.map((artifact) => {
    const extension = { screenshot: '.png', trace: '.zip', video: '.webm' }[artifact.type];
    const destination = path.join(directory, `${randomUUID()}${extension}`);
    copyFileSync(path.resolve(artifact.url), destination);
    return { ...artifact, url: destination.split(path.sep).join('/') };
  });
}
