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
interface StartRunButton {
    projectId: string
}
export default function StartRunButton({ projectId }: StartRunButton) {
    return <Button onClick={() => startRun(projectId)}>run test</Button>
}
