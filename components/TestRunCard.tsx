import Link from 'next/link';

import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

import { TestRun } from '@/types/test-run';
import { TestStatusBadge } from './TestStatusBadge';
import { Button } from './ui/button';
import { CheckIcon, CopyIcon } from 'lucide-react';
import CopyButon from './CopyButton';

interface TestRunCardProps {
    run: TestRun;
}

export function TestRunCard({ run }: TestRunCardProps) {
    const completed = run.passed + run.failed + run.skipped;
    const progress = (completed / run.total) * 100;

    return (
        <Link href={`/runs/${run.id}`} className="block">
            <Card className="h-full transition-shadow hover:shadow-md">
                <CardHeader>
                    <div className='flex items-center justify-between w-full flex-1'>
                        <CardTitle className='text-xl'>{run.projectId}</CardTitle>
                        <div className='flex items-center gap-2'>
                            <CardDescription>
                                {run.id}
                            </CardDescription>
                            <CopyButon text={run.id} />
                        </div>
                    </div>
                    <div className="flex items-center justify-between">
                        <div>

                            <CardDescription>
                                Branch: {run.branch} · {run.commitSha}
                            </CardDescription>
                            <CardDescription>
                                Started at: {new Date(run.startedAt).toLocaleString('en-EN')}
                            </CardDescription>
                            {run.finishedAt &&
                                <CardDescription>
                                    Finished at: {new Date(run.finishedAt).toLocaleString('en-EN')}
                                </CardDescription>
                            }
                            {run.duration &&
                                <CardDescription>
                                    Duration: {(run.duration / 1000).toFixed(2)}s

                                </CardDescription>
                            }
                        </div>

                        <Badge
                            variant={
                                run.status === 'failed'
                                    ? 'destructive'
                                    : 'secondary'
                            }
                        >
                            {run.status.toUpperCase()}
                        </Badge>
                    </div>
                </CardHeader>

                <CardContent className="space-y-4">
                    <Progress value={progress} />

                    <div className="flex justify-between text-sm">
                        <span>
                            {completed}/{run.total} completed
                        </span>
                        <span className="text-sm text-muted-foreground flex gap-2 items-center">
                            {run.passed} / {run.total}
                            <TestStatusBadge status={'passed'} />
                        </span>
                        <span className="text-sm text-muted-foreground flex gap-2 items-center">
                            {run.failed} / {run.total}
                            <TestStatusBadge status={'failed'} />
                        </span>
                        <span className="text-sm text-muted-foreground flex gap-2 items-center">
                            {run.skipped} / {run.total}
                            <TestStatusBadge status={'skipped'} />
                        </span>

                    </div>
                </CardContent>
            </Card>
        </Link>
    );
}