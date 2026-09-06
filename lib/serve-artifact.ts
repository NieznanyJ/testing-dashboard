import { readFile, realpath } from 'node:fs/promises';
import path from 'node:path';
import { getRunById } from '@/lib/prisma';
import { artifactUrl } from '@/lib/artifact-urls';
import type { TestArtifact } from '@/types/test-result';

export type ArtifactContext = { params: Promise<{ projectId: string; runId: string }> };
const contentTypes = { screenshot: 'image/png', trace: 'application/zip', video: 'video/webm' };

function isInside(root: string, file: string) {
  const relative = path.relative(root, file);
  return (
    relative !== '' &&
    !relative.startsWith(`..${path.sep}`) &&
    relative !== '..' &&
    !path.isAbsolute(relative)
  );
}

export async function serveArtifact(
  request: Request,
  context: ArtifactContext,
  type?: TestArtifact['type'],
) {
  const { projectId, runId } = await context.params;
  try {
    const run = await getRunById(runId, projectId);
    if (!run) return Response.json({ error: 'Run not found' }, { status: 404 });
    const artifacts = run.files.flatMap((file) =>
      file.tests.flatMap((test) => test.artifacts ?? []),
    );
    const requestedPath = new URL(request.url).searchParams.get('path');
    if (!requestedPath) {
      if (type) return Response.json({ error: 'Missing artifact path' }, { status: 400 });
      return Response.json(
        artifacts.map((artifact) => ({
          ...artifact,
          url: artifactUrl(projectId, runId, artifact),
        })),
      );
    }
    const artifact = artifacts.find(
      (item) => item.url === requestedPath && (!type || item.type === type),
    );
    if (!artifact) return Response.json({ error: 'Artifact not found' }, { status: 404 });
    const fullPath = await realpath(
      path.resolve(process.cwd(), artifact.url.replaceAll('\\', '/')),
    );
    // Allow archived runs and legacy Playwright output, including symlink resolution.
    const roots = await Promise.all(
      ['.testops-artifacts', 'test-results'].map((dir) =>
        realpath(path.resolve(process.cwd(), dir)).catch(() => null),
      ),
    );
    if (!roots.some((root) => root && isInside(root, fullPath))) {
      return Response.json({ error: 'Artifact not found' }, { status: 404 });
    }
    const file = await readFile(fullPath);
    return new Response(file, {
      headers: {
        'Content-Type': contentTypes[artifact.type],
        'Content-Length': String(file.length),
        'Cache-Control': 'private, no-store',
        'X-Content-Type-Options': 'nosniff',
      },
    });
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
      return Response.json({ error: 'Artifact file no longer exists' }, { status: 404 });
    }
    console.error('Failed to read artifact:', error);
    return Response.json({ error: 'Failed to read artifact' }, { status: 500 });
  }
}
