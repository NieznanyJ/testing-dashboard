'use client'

import { Button } from "./ui/button"


async function startRun(projectId: string) {
    await fetch('/api/runs/start', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ projectId }),
    });
}

export default function StartRunButton() {


    return (
        <Button onClick={() => startRun('project-1')}>run test</Button>
    )
}
