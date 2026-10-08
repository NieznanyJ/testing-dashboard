'use client'

import { useState } from "react"
import { Button } from "./ui/button"

async function startRun(projectId: string) {
    const response = await fetch('/api/runs/start', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ projectId }),
    });

    if (!response.ok) {
        const { error } = await response.json().catch(() => ({}));
        throw new Error(error ?? `HTTP error: ${response.status}`);
    }
}

interface StartRunButtonProps {
    projectId: string
}

export default function StartRunButton({ projectId }: StartRunButtonProps) {
    const [isStarting, setIsStarting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    async function handleClick() {
        setIsStarting(true);
        setError(null);

        try {
            await startRun(projectId);
        } catch (e) {
            setError(e instanceof Error ? e.message : 'Could not start the run.');
        } finally {
            setIsStarting(false);
        }
    }

    return (
        <div className="flex items-center gap-3">
            {error && <p role="alert" className="text-sm text-destructive">{error}</p>}
            <Button onClick={handleClick} disabled={isStarting}>
                {isStarting ? 'Starting…' : 'Run tests'}
            </Button>
        </div>
    )
}
