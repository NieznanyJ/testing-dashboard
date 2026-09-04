import { NextResponse } from 'next/server';
import { mockProjects } from '@/data/mock-project';

export async function GET() {
  return NextResponse.json(mockProjects);
}
