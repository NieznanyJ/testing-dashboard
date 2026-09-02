import { mockProjects } from '@/data/mock-project';
import { spawn } from 'child_process';

export async function POST(req: Request) {
  let body: unknown;

  try {
    body = await req.json();
  } catch {
    return Response.json({ error: 'Request body must contain valid JSON' }, { status: 400 });
  }

  const { projectId } = body as { projectId?: string };

  if (!projectId) return Response.json({ error: 'projectId is required' }, { status: 400 });

  const project = mockProjects.find((project) => project.id === projectId);

  if (!project)
    return Response.json(
      { error: `Project with id ${projectId} not found. Make sure the project exists` },
      { status: 404 },
    );

  const child = spawn(project.testCommand, {
    cwd: process.cwd(),
    shell: true,
    detached: true,
    stdio: 'ignore',
    env: {
      ...process.env,
      TESTOPS_PROJECT_ID: project.id,
    },
  });

  child.unref();

  return Response.json({ message: 'Run started' }, { status: 202 });
}
