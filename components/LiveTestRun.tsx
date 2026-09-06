'use client';

import { TestStatusBadge } from './TestStatusBadge';

import { TestFileCard } from './TestFileCard';
import { useEffect, useState } from 'react';
import { TestRun } from '@/types/test-run';
import { Progress } from './ui/progress';
import { Spinner } from './ui/spinner';
import { Input } from './ui/input';
import { Field, FieldLabel } from './ui/field';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import { TestStatus } from '@/types/test-result';

interface LiveTestRunProps {
  runId: string;
}
async function fetchTestRun(runId: string): Promise<TestRun> {
  const response = await fetch(`/api/runs/${runId}`);
  const data = response.json();
  return data;
}

export default function LiveTestRun({ runId }: LiveTestRunProps) {
  const [run, setRun] = useState<TestRun>();
  const [search, setSearch] = useState<string>('');
  const [status, setStatus] = useState<TestStatus | null>(null);

  useEffect(() => {
    const loadRun = async () => {
      const newRun = await fetchTestRun(runId);
      setRun(newRun);
    };

    loadRun();

    const source = new EventSource(`/api/runs/${runId}/stream`);

    source.onmessage = (event) => {
      const updatedRun: TestRun = JSON.parse(event.data);

      if (updatedRun.id === runId) {
        setRun(updatedRun);
      }
    };

    return () => source.close();
  }, [runId]);

  const completed = run ? run.passed + run.failed + run.skipped : 0;
  const progress = run ? (completed / run.total) * 100 : 0;

  if (!run) {
    return (
      <div className="w-max h-max flex justify-center align-middle">
        <Spinner />
      </div>
    );
  }

  const items: { label: string; value: TestStatus | null }[] = [
    { label: 'All', value: null },
    { label: 'Passed', value: 'passed' },
    { label: 'Failed', value: 'failed' },
    { label: 'Skipped', value: 'skipped' },
  ];

  return (
    <div className="mx-auto max-w-5xl space-y-8 p-8">
      <header className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Run #{run.id}</h1>

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
        <div className="flex items-center justify-between gap-4">
          <Field className="w-4/5">
            <FieldLabel htmlFor="input-field-search">Search</FieldLabel>
            <Input
              id="input-field-search"
              type="text"
              placeholder="Enter feature file name"
              onChange={(e) => setSearch(e.target.value)}
            />
          </Field>

          <Field className="flex-1">
            <FieldLabel htmlFor="select-field-filter">Status</FieldLabel>
            <Select items={items} id="select-field-filter">
              <SelectTrigger className="w-full max-w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Status</SelectLabel>
                  {items.map((item) => (
                    <SelectItem
                      key={item.value}
                      value={item.value}
                      onClick={() => setStatus(item.value)}
                    >
                      {item.label}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </Field>
        </div>

        {run.files
          .filter((file) => file.name.toLowerCase().includes(search.toLowerCase()))
          .filter((file) => status === null || file.tests.some((test) => test.status === status))
          .map((file) => (
            <TestFileCard key={file.id} file={file} projectId={run.projectId} runId={run.id} />
          ))}
      </section>
    </div>
  );
}
