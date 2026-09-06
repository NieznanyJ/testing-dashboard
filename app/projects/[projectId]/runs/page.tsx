'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import StartRunButton from '@/components/StartRunButton';
import { Progress } from '@/components/ui/progress';
import { useCurrentProject } from '@/stores/project-store';
import type { TestRun } from '@/types/test-run';
import {
  CheckCircle2,
  Clock3,
  Code2,
  GitBranch,
  MoreHorizontal,
  TestTubeDiagonal,
} from 'lucide-react';
import { TestResultRow } from '@/components/TestResultRow';
import { useParams } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';

function formatDuration(duration?: number) {
  if (!duration) return 'In progress';
  const minutes = Math.floor(duration / 60000);
  const seconds = Math.floor((duration % 60000) / 1000);
  return `${minutes}m ${seconds}s`;
}

export default function RunsPage() {
  const { projectId } = useParams<{ projectId: string }>();
  const currentProject = useCurrentProject();
  const [runs, setRuns] = useState<TestRun[]>([]);
  const [loadError, setLoadError] = useState('');
  const [loading, setLoading] = useState(false);
  const branch = currentProject?.defaultBranch ?? '�';
  const command = currentProject?.testCommand ?? '�';

  useEffect(() => {
    const controller = new AbortController();
    const url = `/api/projects/${encodeURIComponent(projectId)}/runs`;
    async function loadRuns() {
      setLoading(true);
      try {
        const response = await fetch(url, { signal: controller.signal, cache: 'no-store' });
        if (!response.ok) throw new Error('Failed to load runs');
        const data: TestRun[] = await response.json();
        if (!controller.signal.aborted) {
          setRuns(data);
          setLoadError('');
        }
      } catch (error) {
        if (!controller.signal.aborted) {
          setLoadError(error instanceof Error ? error.message : 'Failed to load runs');
        }
      } finally {
        setLoading(false);
      }
    }
    void loadRuns();
    // Refresh from the database also after reconnects or missed live events.
    const timer = setInterval(() => void loadRuns(), 5000);
    const source = new EventSource(`${url}/stream`);
    source.onmessage = () => void loadRuns();
    return () => {
      controller.abort();
      clearInterval(timer);
      source.close();
    };
  }, [projectId]);
  const summary = useMemo(() => {
    const completed = runs.filter((run) => run.status === 'passed' || run.status === 'failed');
    const passed = completed.filter((run) => run.status === 'passed').length;
    const totalTests = completed.reduce((total, run) => total + run.total, 0);
    const passedTests = completed.reduce((total, run) => total + run.passed, 0);

    return {
      passRate: totalTests ? Math.round((passedTests / totalTests) * 100) : 0,
      successfulRuns: `${passed}/${completed.length}`,
      averageDuration: completed.length
        ? formatDuration(
            completed.reduce((total, run) => total + (run.duration ?? 0), 0) / completed.length,
          )
        : '—',
    };
  }, [runs]);

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto w-full max-w-7xl px-5 py-8 sm:px-8 lg:px-10 lg:py-10">
        <header className="flex flex-col gap-6 border-b pb-8 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="mb-3 flex items-center gap-2 text-sm text-muted-foreground">
              <TestTubeDiagonal className="size-4" />
              <span>{currentProject?.name ?? 'Project'}</span>
              <span>/</span>
              <span className="text-foreground">Test runs</span>
            </div>
            <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">Test runs</h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground sm:text-base">
              Trigger your Playwright suite and track every result from commit to completion.
            </p>
          </div>

          <StartRunButton key={projectId} projectId={projectId} />
        </header>

        {loadError && (
          <p role="alert" className="mt-4 text-sm text-destructive">
            {loadError}
          </p>
        )}

        <section className="grid gap-4 py-7 sm:grid-cols-2 xl:grid-cols-4">
          <Card className="gap-3 py-4">
            <CardContent>
              <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
                Pass rate
              </p>
              <div className="mt-3 flex items-end justify-between gap-3">
                <p className="text-3xl font-semibold tracking-tight">{summary.passRate}%</p>
                <CheckCircle2 className="size-5 text-emerald-600" />
              </div>
              <Progress value={summary.passRate} className="mt-3" />
            </CardContent>
          </Card>
          <Card className="gap-3 py-4">
            <CardContent>
              <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
                Successful runs
              </p>
              <div className="mt-3 flex items-end justify-between gap-3">
                <p className="text-3xl font-semibold tracking-tight">{summary.successfulRuns}</p>
                <Code2 className="size-5 text-muted-foreground" />
              </div>
              <p className="mt-3 text-xs text-muted-foreground">Across recent executions</p>
            </CardContent>
          </Card>
          <Card className="gap-3 py-4">
            <CardContent>
              <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
                Average duration
              </p>
              <div className="mt-3 flex items-end justify-between gap-3">
                <p className="text-3xl font-semibold tracking-tight">{summary.averageDuration}</p>
                <Clock3 className="size-5 text-muted-foreground" />
              </div>
              <p className="mt-3 text-xs text-muted-foreground">Last completed runs</p>
            </CardContent>
          </Card>
          <Card className="gap-3 py-4">
            <CardContent>
              <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
                Default branch
              </p>
              <div className="mt-3 flex items-end justify-between gap-3">
                <p className="truncate font-mono text-xl font-semibold">{branch}</p>
                <GitBranch className="size-5 text-muted-foreground" />
              </div>
              <p className="mt-3 truncate text-xs text-muted-foreground">{command}</p>
            </CardContent>
          </Card>
        </section>

        <Card className="gap-0 py-0">
          <div className="flex flex-col gap-3 border-b px-5 py-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="font-semibold">Recent runs</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Latest executions for this project
              </p>
            </div>
            <Badge variant="outline">{runs.length} runs</Badge>
          </div>

          <div className="divide-y">
            {runs.length === 0 && (
              <p className="p-5 text-sm text-muted-foreground">
                No runs yet. Start your first run above.
              </p>
            )}
            {runs.map((run) => (
              <TestResultRow key={run.id} run={run} />
            ))}
          </div>

          <div className="flex items-center justify-center border-t bg-muted/20 p-3">
            <Button variant="ghost" size="sm">
              View all runs <MoreHorizontal />
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
