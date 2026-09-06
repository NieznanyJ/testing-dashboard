'use client';

import { useState } from 'react';
import type { TestResult } from '@/types/test-result';
import { Button } from '@/components/ui/button';
import { TestStatusBadge } from '@/components/TestStatusBadge';
import RunArtifact from '@/components/RunArtifact';

export function TestCaseResultRow({
  test,
  projectId,
  runId,
}: {
  test: TestResult;
  projectId: string;
  runId: string;
}) {
  const [expanded, setExpanded] = useState(false);
  const hasDetails = Boolean(test.error || test.artifacts?.length);
  return (
    <div className="border-b py-3 last:border-b-0">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="font-medium">{test.name}</p>
          {test.duration !== undefined && (
            <p className="text-sm text-muted-foreground">{(test.duration / 1000).toFixed(2)}s</p>
          )}
        </div>
        <div className="flex items-center gap-2">
          <TestStatusBadge status={test.status} />
          {hasDetails && (
            <Button variant="ghost" size="sm" onClick={() => setExpanded(!expanded)}>
              {expanded ? 'Hide details' : 'View details'}
            </Button>
          )}
        </div>
      </div>
      {expanded && hasDetails && (
        <div className="mt-3 space-y-3">
          {test.error && (
            <pre className="overflow-x-auto whitespace-pre-wrap text-sm text-destructive">
              {test.error}
            </pre>
          )}
          <div className="flex flex-wrap gap-2">
            {test.artifacts?.map((artifact) => (
              <RunArtifact
                key={artifact.url}
                projectId={projectId}
                runId={runId}
                artifact={artifact}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
