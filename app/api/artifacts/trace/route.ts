import { spawn } from 'child_process';
import path from 'path';
import { resolveArtifactPath } from '@/lib/artifacts';

export async function POST(request: Request) {
  let body: { path?: unknown };

  try {
    body = await request.json();
  } catch {
    return Response.json({ error: 'Request body must contain valid JSON' }, { status: 400 });
  }

  const tracePath = resolveArtifactPath(body.path, '.zip');

  if (!tracePath) {
    return Response.json({ error: 'Invalid trace path' }, { status: 400 });
  }

  // Run the Playwright CLI through Node directly, so no shell parses the path.
  const playwrightCli = path.join(process.cwd(), 'node_modules', '@playwright', 'test', 'cli.js');

  const child = spawn(process.execPath, [playwrightCli, 'show-trace', tracePath], {
    detached: true,
    stdio: 'ignore',
  });

  child.unref();

  return Response.json({ ok: true });
}
