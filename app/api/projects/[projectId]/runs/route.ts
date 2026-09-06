import { getProjectById, getRunsByProjectId } from '@/lib/prisma';

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ projectId: string }> },
) {
  const { projectId } = await params;
  try {
    if (!(await getProjectById(projectId))) {
      return Response.json({ error: 'Project not found' }, { status: 404 });
    }
    return Response.json(await getRunsByProjectId(projectId));
  } catch (error) {
    console.error('Failed to load runs:', error);
    return Response.json({ error: 'Failed to load runs' }, { status: 500 });
  }
}
