import { notFound } from 'next/navigation';

import { Progress } from '@/components/ui/progress';
import { TestFileCard } from '@/components/TestFileCard';
import { TestStatusBadge } from '@/components/TestStatusBadge';
import { getTestRunById } from '@/lib/test-runs';

interface RunPageProps {
    params: Promise<{
        testId: string;
    }>;
}

export default async function RunPage({ params }: RunPageProps) {
    const { testId } = await params;

    const run = await getTestRunById(runId);

    if (!run) {
        notFound();
    }

    const completed = run.passed + run.failed + run.skipped;
    const progress = (completed / run.total) * 100;

    return (
        <main className="min-h-screen bg-muted/40">
            <div className="mx-auto max-w-5xl space-y-8 p-8">

                <header className="space-y-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-bold">
                                Run #{run.id}
                            </h1>

                            <p className="text-muted-foreground">
                                {run.branch} · {run.commitSha}
                            </p>
                        </div>

                        <TestStatusBadge status={run.status} />
                    </div>

                    <div className="space-y-2">
                        <Progress value={progress} />

                        <p className="text-sm text-muted-foreground">
                            {completed} / {run.total} tests completed
                        </p>
                    </div>
                </header>

                <section className="space-y-4">
                    {run.files.map((file) => (
                        <TestFileCard
                            key={file.id}
                            file={file}
                        />
                    ))}
                </section>

            </div>
        </main>
    );
}