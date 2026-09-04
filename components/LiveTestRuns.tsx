'use client'

import { TestRun } from "@/types/test-run"
import { TestRunCard } from "./TestRunCard"
import { useEffect, useState } from "react";
import { Input } from "./ui/input";
import StartRunButton from "./StartRunButton";

// TODO add try catch + loading 
async function fetchTestRuns(projectId: string): Promise<TestRun[]> {
    const response = await fetch(`/api/projects/${projectId}/runs`);
    const data = response.json()
    return data;
}

interface LiveTestRunsProps {
    projectId: string;
}

export default function LiveTestRuns({ projectId }: LiveTestRunsProps) {
    const [runs, setRuns] = useState<TestRun[]>([]);

    useEffect(() => {
        const loadRuns = async () => {
            const newRuns = await fetchTestRuns(projectId);
            setRuns(newRuns);
        };

        loadRuns();

        const source = new EventSource(`/api/projects/${projectId}/runs/stream`);

        source.onmessage = (event) => {
            const updatedRun: TestRun = JSON.parse(event.data);
            if (!updatedRun.id) return;

            setRuns((prev) => {
                const exists = prev.some((run) => run.id === updatedRun.id);

                if (exists) {
                    return prev.map((run) =>
                        run.id === updatedRun.id ? updatedRun : run
                    );
                }

                return [updatedRun, ...prev];
            });
        };

        return () => source.close();
    }, [projectId]);

    if (!runs?.length) {
        return <div>
            <h1>No runs for this project</h1>
        </div>
    }

    const sortedRuns = runs.sort(
        (a, b) => new Date(b.startedAt).getTime() - new Date(a.startedAt).getTime()
    );
    return (
        <div className="flex flex-col gap-4 md:grid-cols-2 xl:grid-cols-3">
            <StartRunButton projectId="project-2" />
            {sortedRuns.map((run: TestRun) => (
                <TestRunCard key={run.id} run={run} />
            ))}
        </div>
    )
}

