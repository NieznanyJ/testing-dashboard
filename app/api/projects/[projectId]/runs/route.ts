import { NextResponse } from 'next/server';

import { getTestRuns } from '@/lib/test-runs';

interface RouteContext {
  params: Promise<{
    projectId: string;
  }>;
}

export async function GET(_request: Request, { params }: RouteContext) {
  const { projectId } = await params;

  return NextResponse.json(await getTestRuns(projectId));
}
