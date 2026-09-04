'use client'

import LiveTestRuns from "@/components/LiveTestRuns";
import { useCurrentProject } from "@/stores/project-store"
import { notFound } from "next/navigation";

export default function Runs() {

  const currentProject = useCurrentProject();

  if (!currentProject) {
    return notFound();
  }

  return (
    <LiveTestRuns projectId={currentProject?.id} />
  )
}
