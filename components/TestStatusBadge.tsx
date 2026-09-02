import { Badge } from '@/components/ui/badge';
import { TestStatus } from '@/types/test-result';

interface TestStatusBadgeProps {
    status: TestStatus;
}

export function TestStatusBadge({ status }: TestStatusBadgeProps) {
    if (status === 'failed') {
        return <Badge variant="destructive">FAILED</Badge>;
    }

    if (status === 'passed') {
        return <Badge>PASSED</Badge>;
    }

    if (status === 'running') {
        return <Badge variant="secondary">RUNNING</Badge>;
    }

    if (status === 'skipped') {
        return <Badge variant="outline">SKIPPED</Badge>;
    }

    return <Badge variant="outline">PENDING</Badge>;
}