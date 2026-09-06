import Link from 'next/link';
import {
  ArrowRight,
  CheckCircle2,
  Circle,
  CircleAlert,
  GitBranch,
  RotateCw,
  SkipForward,
  XCircle,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import type { TestRun, TestRunStatus } from '@/types/test-run';
const statusStyles: Record<TestRunStatus, string> = {
  pending:
    'border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-900 dark:bg-amber-950/40 dark:text-amber-400',
  running:
    'border-blue-200 bg-blue-50 text-blue-700 dark:border-blue-900 dark:bg-blue-950/40 dark:text-blue-400',
  passed:
    'border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-400',
  failed:
    'border-red-200 bg-red-50 text-red-700 dark:border-red-900 dark:bg-red-950/40 dark:text-red-400',
};

function StatusIcon({ status }: { status: TestRunStatus }) {
  if (status === 'passed') return <CheckCircle2 className="size-4" />;
  if (status === 'failed') return <XCircle className="size-4" />;
  if (status === 'running') return <RotateCw className="size-4 animate-spin" />;
  return <Circle className="size-4" />;
}
function formatDuration(duration?: number) {
  if (duration === undefined) return 'In progress';
  const minutes = Math.floor(duration / 60000);
  const seconds = Math.floor((duration % 60000) / 1000);
  return `${minutes}m ${seconds}s`;
}

export function TestResultRow({ run }: { run: TestRun }) {
  const completed = run.passed + run.failed + run.skipped;
  const progress = run.total ? Math.round((completed / run.total) * 100) : 0;
  return (
    <Link
      href={`/projects/${run.projectId}/runs/${run.id}`}
      className="group grid gap-4 px-5 py-4 transition-colors hover:bg-muted/45 md:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)_auto] md:items-center"
    >
      <div className="flex min-w-0 items-center gap-3">
        <span
          className={`flex size-9 shrink-0 items-center justify-center rounded-full border ${statusStyles[run.status]}`}
        >
          <StatusIcon status={run.status} />
        </span>
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <p className="font-mono text-sm font-semibold">{run.id}</p>
            <Badge variant="outline" className={statusStyles[run.status]}>
              {run.status}
            </Badge>
          </div>
          <p className="mt-1 flex items-center gap-2 truncate text-xs text-muted-foreground">
            <GitBranch className="size-3" />
            <span className="truncate">{run.branch}</span>
            <span>·</span>
            <span className="font-mono">{run.commitSha}</span>
          </p>
        </div>
      </div>

      <div>
        <div className="mb-2 flex items-center justify-between text-xs">
          <span className="text-muted-foreground">
            {completed}/{run.total} tests
          </span>
          <span className="font-medium tabular-nums">{progress}%</span>
        </div>
        <Progress value={progress} />
        <div className="mt-2 flex gap-3 text-xs text-muted-foreground">
          <span className="flex items-center gap-1 text-emerald-600">
            <CheckCircle2 className="size-3" />
            {run.passed}
          </span>
          <span className="flex items-center gap-1 text-red-600">
            <CircleAlert className="size-3" />
            {run.failed}
          </span>
          <span className="flex items-center gap-1">
            <SkipForward className="size-3" />
            {run.skipped}
          </span>
        </div>
      </div>

      <div className="flex items-center justify-between gap-5 md:justify-end">
        <div className="text-right">
          <p className="text-sm font-medium">{formatDuration(run.duration)}</p>
          <p className="mt-1 text-xs text-muted-foreground">
            {new Date(run.startedAt).toLocaleDateString('en-GB', {
              day: '2-digit',
              month: 'short',
            })}
          </p>
        </div>
        <ArrowRight className="size-4 text-muted-foreground transition-transform group-hover:translate-x-1 group-hover:text-foreground" />
      </div>
    </Link>
  );
}
