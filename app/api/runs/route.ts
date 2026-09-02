import { NextResponse } from 'next/server';
import { getTestRuns } from '@/lib/test-runs';

export async function GET() {
  return NextResponse.json(await getTestRuns());
}
