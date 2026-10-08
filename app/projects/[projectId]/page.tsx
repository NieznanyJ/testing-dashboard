import { Button } from "@/components/ui/button";
import Link from "next/link";

interface ProjectPageProps {
  params: Promise<{
    projectId: string;
  }>;
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { projectId } = await params;

  return <Button render={<Link href={`/projects/${projectId}/runs`} />}>Runs</Button>
}
