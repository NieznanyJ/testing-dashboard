import { Button } from "@/components/ui/button";
import { Link } from "lucide-react";

interface ProjectPageProps {
  params: Promise<{
    projectId: string;
  }>;
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { projectId } = await params;

  return <Link href={`/projects/${projectId}/runs`}><Button>Runs</Button></Link>
}