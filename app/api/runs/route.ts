import { NextResponse } from 'next/server';
import { getTestRuns } from '@/lib/test-runs';

export async function GET(request: Request) {
  const projectId = new URL(request.url).searchParams.get('projectId') ?? undefined;

  return NextResponse.json(await getTestRuns(projectId));
}
