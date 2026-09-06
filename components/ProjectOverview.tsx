'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { useEffect, useState } from 'react';
import type { TestRun } from '@/types/test-run';
import StartRunButton from '@/components/StartRunButton';
import { overviewStats, overviewDuration } from '@/lib/project-overview';
import {
  ArrowRight,
  CheckCircle2,
  Clock3,
  ExternalLink,
  FolderGit2,
  GitBranch,
  Terminal,
  TestTubeDiagonal,
  TrendingUp,
  XCircle,
} from 'lucide-react';
import Link from 'next/link';

interface ProjectOverviewProps {
  project: { id: string; name: string; repo: string; defaultBranch: string; testCommand: string };
  initialRuns: TestRun[];
  now: number;
}

export default function ProjectOverview({ project, initialRuns, now }: ProjectOverviewProps) {
  const projectId = project.id;
  const [runs, setRuns] = useState(initialRuns);
  const [updatedAt, setUpdatedAt] = useState(now);
  const [error, setError] = useState('');
  const stats = overviewStats(runs, updatedAt);
  const { latest, recentRuns, trend } = stats;

  useEffect(() => {
    const controller = new AbortController();
    let loading = false;
    async function refresh() {
      if (loading) return;
      loading = true;
      try {
        const response = await fetch(`/api/projects/${encodeURIComponent(projectId)}/runs`, {
          signal: controller.signal,
          cache: 'no-store',
        });
        if (!response.ok) throw new Error('Failed to refresh project runs');
        const data: TestRun[] = await response.json();
        if (!controller.signal.aborted) {
          setRuns(data);
          setUpdatedAt(Date.now());
          setError('');
        }
      } catch (error) {
        if (!controller.signal.aborted)
          setError(error instanceof Error ? error.message : 'Failed to refresh project');
      } finally {
        loading = false;
      }
    }
    const timer = setInterval(() => void refresh(), 5000);
    const source = new EventSource(`/api/projects/${encodeURIComponent(projectId)}/runs/stream`);
    source.onmessage = () => void refresh();
    return () => {
      controller.abort();
      clearInterval(timer);
      source.close();
    };
  }, [projectId]);
  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto w-full max-w-7xl px-5 py-8 sm:px-8 lg:px-10 lg:py-10">
        <header className="flex flex-col gap-6 border-b pb-8 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="mb-3 flex items-center gap-2 text-sm text-muted-foreground">
              <FolderGit2 className="size-4" />
              Project overview
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">{project.name}</h1>
              <Badge variant="outline">
                {latest ? `Latest run: ${latest.status}` : 'No runs yet'}
              </Badge>
            </div>
            <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <FolderGit2 className="size-4" />
                {project.repo}
              </span>
              <span className="flex items-center gap-1.5">
                <GitBranch className="size-4" />
                {project.defaultBranch}
              </span>
            </div>
          </div>
          <div className="flex gap-2 self-start lg:self-auto">
            <StartRunButton projectId={projectId} />{' '}
          </div>
        </header>
        {error && (
          <p role="alert" className="mt-4 text-sm text-destructive">
            {error}
          </p>
        )}

        <section className="grid gap-4 py-7 sm:grid-cols-2 xl:grid-cols-4">
          <Card className="py-4">
            <CardContent>
              <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
                Pass rate
              </p>
              <div className="mt-3 flex items-end justify-between">
                <p className="text-3xl font-semibold">
                  {stats.passRate === null ? '0' : `${stats.passRate}%`}
                </p>
                <TrendingUp className="size-5 text-emerald-600" />
              </div>
              <p className="mt-2 text-xs text-emerald-600">
                Last 7 days of completed runs, excluding skipped tests
              </p>
            </CardContent>
          </Card>
          <Card className="py-4">
            <CardContent>
              <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
                Runs in last 7 days
              </p>
              <div className="mt-3 flex items-end justify-between">
                <p className="text-3xl font-semibold">{stats.runCount}</p>
                <TestTubeDiagonal className="size-5 text-muted-foreground" />
              </div>
              <p className="mt-2 text-xs text-muted-foreground">
                {stats.passedRuns} passed  {stats.failedRuns} failed
              </p>
            </CardContent>
          </Card>
          <Card className="py-4">
            <CardContent>
              <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
                Average duration
              </p>
              <div className="mt-3 flex items-end justify-between">
                <p className="text-3xl font-semibold">{overviewDuration(stats.averageDuration)}</p>
                <Clock3 className="size-5 text-muted-foreground" />
              </div>
              <p className="mt-2 text-xs text-emerald-600">Completed runs in the last 7 days</p>
            </CardContent>
          </Card>
          <Card className="py-4">
            <CardContent>
              <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
                Tests in latest run
              </p>
              <div className="mt-3 flex items-end justify-between">
                <p className="text-3xl font-semibold">{latest?.total ?? 0}</p>
                <CheckCircle2 className="size-5 text-muted-foreground" />
              </div>
              <p className="mt-2 text-xs text-muted-foreground">
                Across {latest?.files.length ?? 0} spec files
              </p>
            </CardContent>
          </Card>
        </section>

        <div className="grid gap-6 xl:grid-cols-[minmax(0,1.6fr)_minmax(18rem,0.7fr)]">
          <Card>
            <CardContent>
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="font-semibold">Test health</h2>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Passed and failed tests over seven UTC days; gray means no results
                  </p>
                </div>
                <Badge variant="secondary">7 days</Badge>
              </div>
              <div className="mt-8 flex h-52 items-end gap-3 sm:gap-5">
                {trend.map((day) => (
                  <div
                    key={day.label}
                    className="flex h-full min-w-0 flex-1 flex-col justify-end gap-2"
                  >
                    <div className="group relative flex flex-1 flex-col justify-end overflow-hidden rounded-md bg-muted">
                      <div
                        className="w-full bg-emerald-500/80 transition-colors group-hover:bg-emerald-500"
                        style={{ height: `${day.passed}%` }}
                      />
                      <div className="w-full bg-red-500/80" style={{ height: `${day.failed}%` }} />
                    </div>
                    <span className="truncate text-center text-[10px] text-muted-foreground sm:text-xs">
                      {day.label}
                    </span>
                  </div>
                ))}
              </div>
              <div className="mt-5 flex gap-5 border-t pt-4 text-xs text-muted-foreground">
                <span className="flex items-center gap-2">
                  <span className="size-2 rounded-full bg-emerald-500" />
                  Passed
                </span>
                <span className="flex items-center gap-2">
                  <span className="size-2 rounded-full bg-red-500" />
                  Failed
                </span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent>
              <div className="flex items-center justify-between">
                <h2 className="font-semibold">Latest run</h2>
                <Badge variant="outline">{latest?.status ?? 'No runs'}</Badge>
              </div>
              {latest ? (
                <Link
                  href={`/projects/${projectId}/runs/${latest.id}`}
                  className="group mt-6 block rounded-xl border bg-muted/20 p-4 transition-colors hover:bg-muted/50"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-sm font-semibold">{latest.id}</span>
                    <ArrowRight className="size-4 text-muted-foreground transition-transform group-hover:translate-x-1" />
                  </div>
                  <div className="mt-4 flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Tests passed</span>
                    <span className="font-medium">
                      {latest.passed} / {latest.total}
                    </span>
                  </div>
                  <Progress
                    value={latest.total ? (100 * latest.passed) / latest.total : 0}
                    className="mt-2"
                  />
                  <div className="mt-4 grid grid-cols-2 gap-3 border-t pt-4 text-xs">
                    <div>
                      <p className="text-muted-foreground">Duration</p>
                      <p className="mt-1 font-medium">{overviewDuration(latest.duration)}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Completed</p>
                      <p className="mt-1 font-medium">
                        {latest.finishedAt
                          ? new Date(latest.finishedAt).toLocaleString()
                          : 'Not finished'}
                      </p>
                    </div>
                  </div>
                </Link>
              ) : (
                <p className="py-6 text-sm text-muted-foreground">
                  No runs yet. Start your first run above.
                </p>
              )}
              <Button
                variant="ghost"
                className="mt-3 w-full"
                render={<Link href={`/projects/${projectId}/runs`} />}
              >
                View all runs <ArrowRight />
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="mt-6 grid gap-6 xl:grid-cols-[minmax(0,1.6fr)_minmax(18rem,0.7fr)]">
          <Card className="gap-0 py-0">
            <div className="flex items-center justify-between border-b px-5 py-5">
              <div>
                <h2 className="font-semibold">Recent runs</h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  Latest activity from your test suite
                </p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                render={<Link href={`/projects/${projectId}/runs`} />}
              >
                View all <ArrowRight />
              </Button>
            </div>
            <div className="divide-y">
              {recentRuns.length === 0 && (
                <p className="p-5 text-sm text-muted-foreground">No recent runs.</p>
              )}
              {recentRuns.map((run) => (
                <Link
                  key={run.id}
                  href={`/projects/${projectId}/runs/${run.id}`}
                  className="grid gap-3 px-5 py-4 transition-colors hover:bg-muted/35 sm:grid-cols-[1fr_auto_auto] sm:items-center"
                >
                  <div className="flex min-w-0 items-center gap-3">
                    {run.status === 'passed' ? (
                      <CheckCircle2 className="size-5 shrink-0 text-emerald-600" />
                    ) : run.status === 'failed' ? (
                      <XCircle className="size-5 shrink-0 text-red-600" />
                    ) : (
                      <Clock3 className="size-5 shrink-0 text-blue-600" />
                    )}
                    <div className="min-w-0">
                      <p className="font-mono text-sm font-semibold">{run.id}</p>
                      <p className="mt-1 flex items-center gap-1.5 truncate text-xs text-muted-foreground">
                        <GitBranch className="size-3" />
                        {run.branch}
                        <span>·</span>
                        <span className="font-mono">{run.commitSha}</span>
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-5 text-xs">
                    <div>
                      <p className="text-muted-foreground">Tests</p>
                      <p className="mt-1 font-medium">
                        {run.passed}/{run.total}
                      </p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Duration</p>
                      <p className="mt-1 font-medium">{overviewDuration(run.duration)}</p>
                    </div>
                  </div>
                  <span className="text-xs text-muted-foreground sm:text-right">
                    {new Date(run.startedAt).toLocaleString()}
                  </span>
                </Link>
              ))}
            </div>
          </Card>

          <div className="space-y-6">
            <Card>
              <CardContent>
                <div className="flex items-center justify-between">
                  <h2 className="font-semibold">Configuration</h2>
                </div>
                <dl className="mt-5 space-y-4 text-sm">
                  <div>
                    <dt className="text-xs text-muted-foreground">Repository</dt>
                    <dd className="mt-1 flex items-center justify-between gap-2 font-medium">
                      <span className="truncate">{project.repo}</span>
                      <ExternalLink className="size-3.5 text-muted-foreground" />
                    </dd>
                  </div>
                  <div>
                    <dt className="text-xs text-muted-foreground">Default branch</dt>
                    <dd className="mt-1 flex items-center gap-2 font-mono">
                      <GitBranch className="size-3.5 text-muted-foreground" />
                      {project.defaultBranch}
                    </dd>
                  </div>
                </dl>
              </CardContent>
            </Card>
            <Card className="bg-zinc-950 text-zinc-100 ring-zinc-800">
              <CardContent>
                <div className="flex items-center gap-2 text-xs font-medium text-zinc-400">
                  <Terminal className="size-4" />
                  Test command
                </div>
                <code className="mt-3 block break-all font-mono text-xs leading-6">
                  {project.testCommand}
                </code>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
