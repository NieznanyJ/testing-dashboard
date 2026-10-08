'use client'

import { TestRun } from "@/types/test-run"
import { TestRunCard } from "./TestRunCard"
import { useEffect, useState } from "react";
import StartRunButton from "./StartRunButton";
import { Spinner } from "./ui/spinner";

async function fetchTestRuns(projectId: string): Promise<TestRun[]> {
    const response = await fetch(`/api/projects/${projectId}/runs`);

    if (!response.ok) {
        throw new Error(`HTTP error: ${response.status}`);
    }

    return response.json();
}

interface LiveTestRunsProps {
    projectId: string;
}

export default function LiveTestRuns({ projectId }: LiveTestRunsProps) {
    const [runs, setRuns] = useState<TestRun[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchTestRuns(projectId)
            .then((newRuns) => {
                setRuns(newRuns);
                setError(null);
            })
            .catch(() => setError('Could not load test runs.'))
            .finally(() => setIsLoading(false));

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

    const sortedRuns = [...runs].sort(
        (a, b) => new Date(b.startedAt).getTime() - new Date(a.startedAt).getTime()
    );

    return (
        <div className="flex flex-col gap-4 p-8">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-semibold">Test runs</h1>
                <StartRunButton projectId={projectId} />
            </div>

            {isLoading && <Spinner />}

            {error && <p role="alert" className="text-destructive">{error}</p>}

            {!isLoading && !error && sortedRuns.length === 0 && (
                <p className="text-muted-foreground">No runs for this project yet.</p>
            )}

            {sortedRuns.map((run: TestRun) => (
                <TestRunCard key={run.id} run={run} />
            ))}
        </div>
    )
}
