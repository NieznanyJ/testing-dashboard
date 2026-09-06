import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

import { TestFile } from '@/types/test-file';
import { TestCaseResultRow } from '@/components/TestCaseResultRow';
import { TestStatusBadge } from './TestStatusBadge';

interface TestFileCardProps {
  file: TestFile;
  projectId: string;
  runId: string;
}

export function TestFileCard({ file, projectId, runId }: TestFileCardProps) {
  const hasFailed = file.tests.some((test) => test.status === 'failed');
  const hasRunning = file.tests.some((test) => test.status === 'running');

  const fileStatus = hasFailed ? 'failed' : hasRunning ? 'running' : 'passed';

  return (
    <Card>
      <CardHeader className="flex gap-4 items-center">
        <CardTitle className="text-base">{file.name}</CardTitle>
        <TestStatusBadge status={fileStatus} />
      </CardHeader>

      <CardContent>
        {file.tests.map((test) => (
          <TestCaseResultRow key={test.id} test={test} projectId={projectId} runId={runId} />
        ))}
      </CardContent>
    </Card>
  );
}
