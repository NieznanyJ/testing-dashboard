import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';

import { TestFile } from '@/types/test-file';
import { TestResultRow } from '@/components/TestResultRow';
import { TestStatusBadge } from './TestStatusBadge';

interface TestFileCardProps {
    file: TestFile;
}

export function TestFileCard({ file }: TestFileCardProps) {

    const hasFailed = file.tests.some(test => test.status === 'failed');
    const hasRunning = file.tests.some(test => test.status === 'running');

    const fileStatus = hasFailed ? 'failed' : hasRunning ? 'running' : 'passed';

    return (
        <Card>
            <CardHeader className='flex gap-4 items-center'>
                <CardTitle className="text-base">
                    {file.name}
                </CardTitle>
                <TestStatusBadge status={fileStatus} />
            </CardHeader>

            <CardContent>
                {file.tests.map((test) => (
                    <TestResultRow
                        key={test.id}
                        test={test}
                    />
                ))}
            </CardContent>
        </Card>
    );
}