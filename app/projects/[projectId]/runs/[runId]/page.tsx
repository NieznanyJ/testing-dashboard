import RunDetailsView from '@/components/RunDetailsView';
import { getRunById } from '@/lib/prisma';
import { notFound } from 'next/navigation';

export default async function RunPage({
  params,
}: {
  params: Promise<{ projectId: string; runId: string }>;
}) {
  const { projectId, runId } = await params;
  const run = await getRunById(runId, projectId);
  if (!run) notFound();
  return <RunDetailsView key={run.id} initialRun={run} />;
}
