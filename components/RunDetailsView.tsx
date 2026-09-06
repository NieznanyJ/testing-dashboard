'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import type { TestRun } from '@/types/test-run';
import StartRunButton from '@/components/StartRunButton';
import RunArtifact from '@/components/RunArtifact';
import type { TestStatus } from '@/types/test-result';
import {
  ArrowLeft,
  CheckCircle2,
  ChevronDown,
  CircleAlert,
  Clock3,
  Copy,
  Download,
  FileCode2,
  GitBranch,
  GitCommitHorizontal,
  Search,
  SkipForward,
  XCircle,
} from 'lucide-react';
import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';

interface RunDetailsViewProps {
  initialRun: TestRun;
}

const statusFilters: Array<{ label: string; value: TestStatus | 'all' }> = [
  { label: 'All', value: 'all' },
  { label: 'Passed', value: 'passed' },
  { label: 'Failed', value: 'failed' },
  { label: 'Skipped', value: 'skipped' },
];

function TestIcon({ status }: { status: TestStatus }) {
  if (status === 'passed') return <CheckCircle2 className="size-4 text-emerald-600" />;
  if (status === 'failed') return <XCircle className="size-4 text-red-600" />;
  if (status === 'skipped') return <SkipForward className="size-4 text-muted-foreground" />;
  return <Clock3 className="size-4 text-blue-600" />;
}

function StatusBadge({ status }: { status: TestStatus }) {
  const className =
    status === 'passed'
      ? 'border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-400'
      : status === 'failed'
        ? 'border-red-200 bg-red-50 text-red-700 dark:border-red-900 dark:bg-red-950/40 dark:text-red-400'
        : 'text-muted-foreground';

  return (
    <Badge variant="outline" className={className}>
      {status}
    </Badge>
  );
}

export default function RunDetailsView({ initialRun }: RunDetailsViewProps) {
  const [run, setRun] = useState(initialRun);
  const [loadError, setLoadError] = useState('');
  const { projectId, id: runId } = run;

  useEffect(() => {
    if (run.status === 'passed' || run.status === 'failed') return;
    const controller = new AbortController();
    let loading = false;
    async function refresh() {
      if (loading) return;
      loading = true;
      try {
        const response = await fetch(
          `/api/runs/${encodeURIComponent(runId)}?projectId=${encodeURIComponent(projectId)}`,
          { signal: controller.signal, cache: 'no-store' },
        );
        if (!response.ok)
          throw new Error(response.status === 404 ? 'Run not found' : 'Failed to refresh run');
        const updated: TestRun = await response.json();
        if (!controller.signal.aborted) {
          setRun(updated);
          setLoadError('');
        }
      } catch (error) {
        if (!controller.signal.aborted)
          setLoadError(error instanceof Error ? error.message : 'Failed to refresh run');
      } finally {
        loading = false;
      }
    }
    void refresh();
    const timer = setInterval(() => void refresh(), 3000);
    const source = new EventSource(`/api/projects/${encodeURIComponent(projectId)}/runs/stream`);
    source.onmessage = () => void refresh();
    return () => {
      controller.abort();
      clearInterval(timer);
      source.close();
    };
  }, [projectId, runId, run.status]);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState<TestStatus | 'all'>('all');
  const [expandedTest, setExpandedTest] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const tests = run.files.flatMap((file) => file.tests);
  const passed = run.passed;
  const failed = run.failed;
  const skipped = run.skipped;
  const completed = passed + failed + skipped;
  const progress = run.total ? Math.min(100, Math.round((completed / run.total) * 100)) : 0;

  const visibleFiles = useMemo(() => {
    const query = search.trim().toLowerCase();

    return run.files
      .map((file) => ({
        ...file,
        tests: file.tests.filter(
          (test) =>
            (status === 'all' || test.status === status) &&
            (!query ||
              test.name.toLowerCase().includes(query) ||
              file.name.toLowerCase().includes(query)),
        ),
      }))
      .filter((file) => file.tests.length > 0);
  }, [run.files, search, status]);

  function downloadReport() {
    const url = URL.createObjectURL(
      new Blob([JSON.stringify(run, null, 2)], { type: 'application/json' }),
    );
    const link = document.createElement('a');
    link.href = url;
    link.download = `run-${runId}.json`;
    link.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  async function copyRunId() {
    await navigator.clipboard.writeText(runId);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1500);
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto w-full max-w-7xl px-5 py-8 sm:px-8 lg:px-10 lg:py-10">
        <Link
          href={`/projects/${projectId}/runs`}
          className="mb-6 inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="size-4" />
          Back to test runs
        </Link>

        <header className="flex flex-col gap-6 border-b pb-8 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="mb-3 flex items-center gap-2">
              <StatusBadge status={run.status} />
              <span className="text-sm text-muted-foreground">
                {run.finishedAt
                  ? `Completed ${new Date(run.finishedAt).toLocaleString()}`
                  : `Started ${new Date(run.startedAt).toLocaleString()}`}
              </span>{' '}
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">Run {runId}</h1>
              <Button variant="ghost" size="icon-sm" onClick={copyRunId} aria-label="Copy run ID">
                {copied ? <CheckCircle2 className="text-emerald-600" /> : <Copy />}
              </Button>
            </div>
            <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <GitBranch className="size-4" /> {run.branch}
              </span>
              <span className="flex items-center gap-1.5 font-mono">
                <GitCommitHorizontal className="size-4" /> {run.commitSha}
              </span>
              <span className="flex items-center gap-1.5">
                <Clock3 className="size-4" />{' '}
                {run.duration === undefined
                  ? 'In progress'
                  : `${(run.duration / 1000).toFixed(2)}s`}
              </span>
            </div>
          </div>

          <div className="flex gap-2 self-start lg:self-auto">
            <Button variant="outline" onClick={downloadReport}>
              <Download /> Download report
            </Button>
            <StartRunButton projectId={projectId} />
          </div>
        </header>
        {loadError && (
          <p role="alert" className="mt-4 text-sm text-destructive">
            {loadError}
          </p>
        )}

        <section className="grid gap-4 py-7 sm:grid-cols-2 xl:grid-cols-4">
          <Card className="py-4">
            <CardContent>
              <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
                Total tests
              </p>
              <p className="mt-3 text-3xl font-semibold">{run.total}</p>
              <p className="mt-2 text-xs text-muted-foreground">
                Across {run.files.length} spec files
              </p>
            </CardContent>
          </Card>
          <Card className="py-4">
            <CardContent>
              <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
                Passed
              </p>
              <div className="mt-3 flex items-center justify-between">
                <p className="text-3xl font-semibold">{passed}</p>
                <CheckCircle2 className="size-5 text-emerald-600" />
              </div>
              <p className="mt-2 text-xs text-muted-foreground">
                {run.total ? Math.round((passed / run.total) * 100) : 0}% of the suite
              </p>
            </CardContent>
          </Card>
          <Card className="py-4">
            <CardContent>
              <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
                Failed
              </p>
              <div className="mt-3 flex items-center justify-between">
                <p className="text-3xl font-semibold">{failed}</p>
                <CircleAlert className="size-5 text-red-600" />
              </div>
              <p className="mt-2 text-xs text-muted-foreground">Needs your attention</p>
            </CardContent>
          </Card>
          <Card className="py-4">
            <CardContent>
              <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
                Skipped
              </p>
              <div className="mt-3 flex items-center justify-between">
                <p className="text-3xl font-semibold">{skipped}</p>
                <SkipForward className="size-5 text-muted-foreground" />
              </div>
              <p className="mt-2 text-xs text-muted-foreground">Not included in pass rate</p>
            </CardContent>
          </Card>
        </section>

        <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_19rem]">
          <main className="min-w-0 space-y-5">
            <Card className="gap-4">
              <CardContent>
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium">Run progress</span>
                  <span className="text-muted-foreground">
                    {completed} of {run.total} completed
                  </span>
                </div>
                <Progress value={progress} className="mt-3" />
                <div className="mt-3 flex flex-wrap gap-4 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1.5">
                    <span className="size-2 rounded-full bg-emerald-500" />
                    {passed} passed
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="size-2 rounded-full bg-red-500" />
                    {failed} failed
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="size-2 rounded-full bg-muted-foreground/40" />
                    {skipped} skipped
                  </span>
                </div>
              </CardContent>
            </Card>

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-lg font-semibold">Test results</h2>
                <p className="text-sm text-muted-foreground">
                  Inspect results grouped by spec file.
                </p>
              </div>
              <div className="relative w-full sm:w-72">
                <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Search tests…"
                  className="pl-9"
                />
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              {statusFilters.map((filter) => (
                <Button
                  key={filter.value}
                  size="sm"
                  variant={status === filter.value ? 'secondary' : 'ghost'}
                  onClick={() => setStatus(filter.value)}
                >
                  {filter.label}
                  {filter.value !== 'all' && (
                    <span className="ml-1 text-muted-foreground">
                      {tests.filter((test) => test.status === filter.value).length}
                    </span>
                  )}
                </Button>
              ))}
            </div>

            {visibleFiles.map((file) => (
              <Card key={file.id} className="gap-0 py-0">
                <div className="flex items-center justify-between border-b bg-muted/25 px-5 py-4">
                  <div className="flex min-w-0 items-center gap-3">
                    <FileCode2 className="size-4 shrink-0 text-muted-foreground" />
                    <span className="truncate font-mono text-sm font-medium">{file.name}</span>
                  </div>
                  <span className="ml-4 text-xs text-muted-foreground">
                    {file.tests.length} tests
                  </span>
                </div>
                <div className="divide-y">
                  {file.tests.map((test) => {
                    const isExpanded = expandedTest === test.id;
                    const hasDetails = Boolean(test.error || test.artifacts?.length);

                    return (
                      <div key={test.id}>
                        <button
                          type="button"
                          disabled={!hasDetails}
                          onClick={() => setExpandedTest(isExpanded ? null : test.id)}
                          className="flex w-full items-center gap-3 px-5 py-4 text-left transition-colors enabled:cursor-pointer enabled:hover:bg-muted/35"
                        >
                          <TestIcon status={test.status} />
                          <span className="min-w-0 flex-1 truncate text-sm font-medium">
                            {test.name}
                          </span>
                          {test.duration !== undefined && (
                            <span className="text-xs text-muted-foreground tabular-nums">
                              {(test.duration / 1000).toFixed(2)}s
                            </span>
                          )}
                          <StatusBadge status={test.status} />
                          {hasDetails && (
                            <ChevronDown
                              className={`size-4 text-muted-foreground transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                            />
                          )}
                        </button>

                        {isExpanded && hasDetails && (
                          <div className="border-t bg-red-50/40 px-5 py-5 dark:bg-red-950/10">
                            {test.error && (
                              <div>
                                <p className="mb-2 text-xs font-semibold tracking-wide text-red-700 uppercase dark:text-red-400">
                                  Error output
                                </p>
                                <pre className="overflow-x-auto rounded-lg bg-zinc-950 p-4 font-mono text-xs leading-6 text-zinc-200">
                                  {test.error}
                                </pre>
                              </div>
                            )}
                            {test.artifacts && test.artifacts.length > 0 && (
                              <div className="mt-4 flex flex-wrap gap-2">
                                {test.artifacts.map((artifact) => (
                                  <RunArtifact
                                    key={artifact.url}
                                    projectId={projectId}
                                    runId={runId}
                                    artifact={artifact}
                                  />
                                ))}
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </Card>
            ))}

            {visibleFiles.length === 0 && (
              <Card>
                <CardContent className="py-10 text-center">
                  <Search className="mx-auto size-6 text-muted-foreground" />
                  <p className="mt-3 font-medium">No matching tests</p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Try another search or status filter.
                  </p>
                </CardContent>
              </Card>
            )}
          </main>

          <aside className="space-y-4">
            <Card>
              <CardContent>
                <h2 className="font-semibold">Run details</h2>
                <dl className="mt-5 space-y-4 text-sm">
                  <div>
                    <dt className="text-xs text-muted-foreground">Started</dt>
                    <dd className="mt-1 font-medium">{new Date(run.startedAt).toLocaleString()}</dd>
                  </div>
                  <div>
                    <dt className="text-xs text-muted-foreground">Finished</dt>
                    <dd className="mt-1 font-medium">
                      {run.finishedAt ? new Date(run.finishedAt).toLocaleString() : 'Not finished'}
                    </dd>
                  </div>
                </dl>
              </CardContent>
            </Card>
          </aside>
        </div>
      </div>
    </div>
  );
}
