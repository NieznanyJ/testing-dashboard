import { getRunById } from '@/lib/prisma';

export async function GET(request: Request, { params }: { params: Promise<{ runId: string }> }) {
  const { runId } = await params;
  const projectId = new URL(request.url).searchParams.get('projectId') ?? undefined;
  try {
    const run = await getRunById(runId, projectId);
    if (!run) return Response.json({ error: 'Run not found' }, { status: 404 });
    return Response.json(run);
  } catch (error) {
    console.error('Failed to load run:', error);
    return Response.json({ error: 'Failed to load run' }, { status: 500 });
  }
}
