import type { TestArtifact } from '@/types/test-result';

export function artifactUrl(projectId: string, runId: string, artifact: TestArtifact) {
  return `/api/projects/${encodeURIComponent(projectId)}/runs/${encodeURIComponent(runId)}/artifacts?path=${encodeURIComponent(artifact.url)}`;
}

export function traceViewerUrl(traceUrl: string) {
  return `/trace-viewer/index.html?trace=${encodeURIComponent(traceUrl)}`;
}
