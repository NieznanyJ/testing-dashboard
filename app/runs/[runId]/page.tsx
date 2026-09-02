import LiveTestRun from '@/components/LiveTestRun';

interface RunPageProps {
    params: Promise<{
        runId: string;
    }>;
}

export default async function RunPage({ params }: RunPageProps) {
    const { runId } = await params;

    return (
        <main className="min-h-screen bg-muted/40">
            <LiveTestRun runId={runId} />
        </main>
    );
}