import { NextResponse } from 'next/server';

import { getProjectById } from '@/lib/prisma';

interface RouteContext {
  params: Promise<{
    projectId: string;
  }>;
}

export async function GET(_request: Request, { params }: RouteContext) {
  const { projectId } = await params;

  try {
    const project = await getProjectById(projectId);

    if (!project) {
      return NextResponse.json({ message: 'Project not found' }, { status: 404 });
    }
    return NextResponse.json(project);
  } catch (e) {
    throw new Error(`Something went wrond -> ${e}`);
  }
}
