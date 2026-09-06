import { getAllProjects } from '@/lib/prisma';

export async function GET() {
  try {
    const projects = await getAllProjects();

    return Response.json(
      projects.map((project) => ({
        ...project,
        runs: [],
      })),
    );
  } catch (error) {
    console.error('GET /api/projects failed:', error);

    return Response.json({ error: 'Failed to load projects' }, { status: 500 });
  }
}
