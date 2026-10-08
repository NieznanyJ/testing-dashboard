import { NextResponse } from 'next/server';

import { getTestRuns } from '@/lib/test-runs';

interface RouteContext {
  params: Promise<{
    projectId: string;
  }>;
}

export async function GET(_request: Request, { params }: RouteContext) {
  const { projectId } = await params;

  const runs = await getTestRuns(projectId);

  if (!runs) {
    return NextResponse.json({ message: 'Test run not found' }, { status: 404 });
  }

  return NextResponse.json(runs);
}
