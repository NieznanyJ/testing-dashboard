import { NextResponse } from 'next/server';

import { getTestRunById } from '@/lib/test-runs';

interface RouteContext {
  params: Promise<{
    runId: string;
  }>;
}

export async function GET(_request: Request, { params }: RouteContext) {
  const { runId } = await params;

  const run = await getTestRunById(runId);

  if (!run) {
    return NextResponse.json({ message: 'Test run not found' }, { status: 404 });
  }

  return NextResponse.json(run);
}
