import LiveTestRuns from "@/components/LiveTestRuns";

interface RunsPageProps {
  params: Promise<{
    projectId: string;
  }>;
}

export default async function Runs({ params }: RunsPageProps) {
  const { projectId } = await params;

  return (
    <LiveTestRuns projectId={projectId} />
  )
}
