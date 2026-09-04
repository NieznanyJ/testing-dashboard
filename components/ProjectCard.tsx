import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TestProject } from '@/types/test-project';

interface ProjectCardProps {
    project: TestProject;
}

export default function ProjectCard({ project }: ProjectCardProps) {
    return (
        <Link href={`/projects/${project.id}`}>
            <Card className="h-full cursor-pointer transition-shadow hover:shadow-md">
                <CardHeader>
                    <CardTitle>{project.name}</CardTitle>
                    <p className="text-sm text-muted-foreground">{project.id}</p>
                </CardHeader>

                <CardContent className="flex justify-between text-sm text-muted-foreground">
                    <span>{project.runs.length} runs</span>

                    <span>
                        Created {new Date(project.createdAt).toLocaleDateString('pl-PL')}
                    </span>
                </CardContent>
            </Card>
        </Link>
    );
}