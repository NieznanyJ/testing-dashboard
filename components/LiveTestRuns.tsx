'use client'

import { TestRun } from "@/types/test-run"
import { TestRunCard } from "./TestRunCard"
import { useEffect, useState } from "react";
import { Input } from "./ui/input";

// TODO add try catch + loading 
async function fetchTestRuns(): Promise<TestRun[]> {
    const response = await fetch('/api/runs');
    const data = response.json()
    return data;
}

export default function LiveTestRuns() {
    const [runs, setRuns] = useState<TestRun[]>([]);

    useEffect(() => {
        const loadRuns = async () => {
            const newRuns = await fetchTestRuns();
            setRuns(newRuns);
        };

        loadRuns();

        const source = new EventSource(`/api/runs/stream`);

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
    }, []);

    const sortedRuns = runs.sort(
        (a, b) => new Date(b.startedAt).getTime() - new Date(a.startedAt).getTime()
    );
    return (
        <div className="flex flex-col gap-4 md:grid-cols-2 xl:grid-cols-3">
            {sortedRuns.map((run: TestRun) => (
                <TestRunCard key={run.id} run={run} />
            ))}
        </div>
    )
}

