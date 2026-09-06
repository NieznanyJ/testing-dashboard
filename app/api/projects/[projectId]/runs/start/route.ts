import { getProjectById } from '@/lib/prisma';
import { spawn } from 'node:child_process';
import { once } from 'node:events';

export const runtime = 'nodejs';

export async function POST(
  _request: Request,
  { params }: { params: Promise<{ projectId: string }> },
) {
  const { projectId } = await params;
  try {
    const project = await getProjectById(projectId);
    if (!project) {
      return Response.json({ error: 'Project not found' }, { status: 404 });
    }
    if (!project.testCommand.trim()) {
      return Response.json({ error: 'Configure a test command for this project' }, { status: 400 });
    }
    const child = spawn(project.testCommand, {
      cwd: process.cwd(),
      shell: true,
      detached: true,
      windowsHide: true,
      stdio: 'ignore',
      env: { ...process.env, TESTOPS_PROJECT_ID: project.id },
    });
    await once(child, 'spawn');
    child.unref();
    return Response.json({ message: 'Test process started' }, { status: 202 });
  } catch (error) {
    console.error('Failed to start run:', error);
    return Response.json({ error: 'Failed to start run' }, { status: 500 });
  }
}
