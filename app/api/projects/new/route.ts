import { createProject } from '@/lib/prisma';
import type { CreateProjectInput } from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const input = (await request.json()) as CreateProjectInput;

    if (
      !input.name?.trim() ||
      !input.repo?.trim() ||
      !input.defaultBranch?.trim() ||
      !input.testCommand?.trim()
    ) {
      return Response.json({ error: 'All project information is required' }, { status: 400 });
    }

    const project = await createProject({
      name: input.name.trim(),
      repo: input.repo.trim(),
      defaultBranch: input.defaultBranch.trim(),
      testCommand: input.testCommand.trim(),
    });

    return Response.json(project, { status: 201 });
  } catch (error) {
    console.error('Failed to create project:', error);

    return Response.json({ error: 'Failed to create project' }, { status: 500 });
  }
}
