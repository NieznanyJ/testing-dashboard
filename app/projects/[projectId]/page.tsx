import ProjectOverview from '@/components/ProjectOverview';
import { getProjectById, getRunsByProjectId } from '@/lib/prisma';
import { notFound } from 'next/navigation';

export default async function ProjectPage({ params }: { params: Promise<{ projectId: string }> }) {
  const { projectId } = await params;
  const project = await getProjectById(projectId);
  if (!project) notFound();
  const runs = await getRunsByProjectId(projectId);
  // Capture the request time once on the server for consistent initial chart dates.
  // eslint-disable-next-line react-hooks/purity
  const now = Date.now();
  return <ProjectOverview key={projectId} project={project} initialRuns={runs} now={now} />;
}
