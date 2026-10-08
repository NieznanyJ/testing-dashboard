'use client';

import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { TestArtifact, TestResult } from '@/types/test-result';
import { TestStatusBadge } from '@/components/TestStatusBadge';
import { Dialog, DialogContent, DialogTrigger } from './ui/dialog';

interface TestResultRowProps {
    test: TestResult;
}

async function openTrace(url: string) {
    await fetch('/api/artifacts/trace', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            path: url,
        }),
    });
}

export function TestResultRow({ test }: TestResultRowProps) {
    const [expanded, setExpanded] = useState(false);

    const hasDetails =
        test.status === 'failed' &&
        (test.error || (test.artifacts && test.artifacts.length > 0));

    async function handleArtifacts(artifact: TestArtifact) {
        if (artifact.type === 'trace') await openTrace(artifact.url)
    }


    return (
        <div className="border-b py-3 last:border-b-0">
            <div className="flex items-center justify-between gap-4">
                <div>
                    <p className="font-medium">{test.name}</p>

                    {test.duration !== undefined && (
                        <p className="text-sm text-muted-foreground">
                            {(test.duration / 1000).toFixed(2)}s
                        </p>
                    )}
                </div>

                <div className="flex items-center gap-2">
                    <TestStatusBadge status={test.status} />

                    {hasDetails && (
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setExpanded((value) => !value)}
                        >
                            {expanded ? 'Hide details' : 'View details'}
                        </Button>
                    )}
                </div>
            </div>

            {expanded && hasDetails && (
                <div className="mt-4 space-y-4 rounded-md border bg-muted/40 p-4">
                    {test.error && (
                        <div>
                            <p className="mb-1 text-sm font-semibold">Error</p>

                            <pre className="overflow-x-auto whitespace-pre-wrap text-sm text-destructive">
                                {test.error}
                            </pre>
                        </div>
                    )}

                    {test.artifacts && test.artifacts.length > 0 && (
                        <div>
                            <p className="mb-2 text-sm font-semibold">Artifacts</p>

                            <div className="flex flex-wrap gap-2">
                                {test.artifacts.map((artifact) => (
                                    <div className='flex flex-col items-start gap-4' key={`${artifact.type}-${artifact.name}`}
                                    >
                                        {artifact.type === 'screenshot' ?
                                            <Dialog>

                                                <DialogTrigger render={<Button
                                                    className='capitalize'
                                                    variant="outline"
                                                    size="sm"
                                                >
                                                    {artifact.name}
                                                </Button>} />

                                                <DialogContent className="min-w-6xl max-w-8xl flex flex-col items-start justify-center p-8 pt-10">
                                                    {/* eslint-disable-next-line @next/next/no-img-element -- served by a local API route */}
                                                    <img
                                                        src={`/api/artifacts/screenshot?path=${encodeURIComponent(artifact.url)}`}
                                                        alt={artifact.name}
                                                        className="w-auto h-auto rounded-md border object-contain"
                                                    />
                                                    {test.error && (
                                                        <div>
                                                            <p className="mb-1 text-sm font-semibold">Error</p>

                                                            <pre className="overflow-x-auto whitespace-pre-wrap text-sm text-destructive">
                                                                {test.error}
                                                            </pre>
                                                        </div>
                                                    )}
                                                </DialogContent>
                                            </Dialog> : <Button
                                                className='capitalize'
                                                onClick={() => handleArtifacts(artifact)}
                                                variant="outline"
                                                size="sm"
                                            >
                                                {artifact.name}
                                            </Button>
                                        }
                                    </div>
                                )
                                )}
                            </div>
                        </div>
                    )}
                </div>
            )
            }
        </div >
    );
}