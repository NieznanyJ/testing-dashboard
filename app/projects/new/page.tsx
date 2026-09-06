'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Field, FieldDescription, FieldGroup, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { createProject } from '@/lib/projects';
import { useProjectsStore } from '@/stores/project-store';
import {
    ArrowLeft,
    ArrowRight,
    Check,
    GitBranch,
    FolderGit2,
    LoaderCircle,
    Sparkles,
    Terminal,
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { SubmitEvent, useMemo, useState } from 'react';

const slugify = (value: string) =>
    value
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '');

export default function NewProjectPage() {
    const router = useRouter();
    const addProject = useProjectsStore((state) => state.addProject);
    const setCurrentProject = useProjectsStore((state) => state.setCurrentProject);
    const [name, setName] = useState('');
    const [repository, setRepository] = useState('');
    const [defaultBranch, setDefaultBranch] = useState('main');
    const [testCommand, setTestCommand] = useState('npx playwright test');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const projectId = useMemo(() => slugify(name) || 'your-project', [name]);

    async function handleSubmit(event: SubmitEvent) {
        event.preventDefault();
        setIsSubmitting(true);

        try {
            const project = await createProject({
                name: name.trim(),
                repo: repository.trim(),
                defaultBranch: defaultBranch.trim(),
                testCommand: testCommand.trim(),
            });

            addProject({
                ...project,
                runs: [],
            });

            setCurrentProject(project.id);
            router.push(`/projects/${project.id}/runs`);
        } catch (error) {
            console.error(error);
            setIsSubmitting(false);
        }
    }

    return (
        <div className="relative min-h-screen overflow-hidden bg-background">
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,oklch(0.92_0.04_260/.55),transparent_32%),radial-gradient(circle_at_85%_15%,oklch(0.95_0.035_160/.5),transparent_26%)]" />
            <div className="relative mx-auto flex min-h-screen w-full max-w-6xl flex-col px-5 py-6 sm:px-8 lg:px-12 lg:py-10">
                <Button
                    variant="ghost"
                    className="mb-10 w-fit -translate-x-2 text-muted-foreground"
                    render={<Link href="/" />}
                >
                    <ArrowLeft /> Back to dashboard
                </Button>

                <div className="grid flex-1 items-center gap-12 pb-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
                    <section className="max-w-md">
                        <div className="mb-6 flex size-11 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-lg shadow-primary/15">
                            <Sparkles className="size-5" />
                        </div>
                        <p className="mb-3 font-mono text-xs font-medium tracking-[0.18em] text-muted-foreground uppercase">
                            Project setup
                        </p>
                        <h1 className="text-balance text-4xl font-semibold tracking-tight sm:text-5xl">
                            Ship tests with confidence.
                        </h1>
                        <p className="mt-5 text-pretty text-base leading-7 text-muted-foreground">
                            Connect your test repository and tell us how to run it. You can fine-tune environments
                            and notifications later.
                        </p>
                        <div className="mt-10 space-y-5 border-l pl-6">
                            {[
                                ['01', 'Connect repository', 'Point to the source of your test suite.'],
                                ['02', 'Set the command', 'Choose the command that starts your tests.'],
                                ['03', 'Start testing', 'Run and monitor results from one place.'],
                            ].map(([step, title, description]) => (
                                <div key={step} className="grid grid-cols-[2rem_1fr] gap-3">
                                    <span className="font-mono text-xs text-muted-foreground">{step}</span>
                                    <div>
                                        <p className="text-sm font-medium">{title}</p>
                                        <p className="mt-0.5 text-sm text-muted-foreground">{description}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>

                    <Card className="border-0 bg-card/90 shadow-2xl shadow-black/8 ring-1 ring-foreground/10 backdrop-blur-sm">
                        <CardHeader className="border-b px-6 pb-5 sm:px-8">
                            <div className="flex items-start justify-between gap-4">
                                <div>
                                    <CardTitle className="text-xl">Create a project</CardTitle>
                                    <CardDescription className="mt-1.5">
                                        Add the essentials for your first test run.
                                    </CardDescription>
                                </div>
                                <div className="hidden rounded-full bg-emerald-500/10 px-3 py-1.5 text-xs font-medium text-emerald-700 sm:flex dark:text-emerald-400">
                                    <Check className="mr-1.5 size-3.5" /> Ready to configure
                                </div>
                            </div>
                        </CardHeader>

                        <CardContent className="px-6 pt-2 sm:px-8">
                            <form onSubmit={handleSubmit}>
                                <FieldGroup>
                                    <Field>
                                        <FieldLabel htmlFor="name">Project name</FieldLabel>
                                        <Input
                                            id="name"
                                            name="name"
                                            value={name}
                                            onChange={(event) => setName(event.target.value)}
                                            placeholder="Checkout end-to-end tests"
                                            className="h-11 px-3.5"
                                            autoFocus
                                            required
                                        />
                                        <FieldDescription>
                                            This is how the project appears across your dashboard.
                                        </FieldDescription>
                                    </Field>
                                    <Field>
                                        <FieldLabel htmlFor="repository">Repository</FieldLabel>
                                        <div className="relative">
                                            <FolderGit2 className="absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-muted-foreground" />
                                            <Input
                                                id="repository"
                                                name="repository"
                                                value={repository}
                                                onChange={(event) => setRepository(event.target.value)}
                                                placeholder="acme/checkout-tests"
                                                className="h-11 pr-3.5 pl-10 font-mono"
                                                required
                                            />
                                        </div>
                                        <FieldDescription>
                                            Use an owner/repository name or paste a Git URL.
                                        </FieldDescription>
                                    </Field>
                                    <div className="grid gap-5 sm:grid-cols-2">
                                        <Field>
                                            <FieldLabel htmlFor="branch">Default branch</FieldLabel>
                                            <div className="relative">
                                                <GitBranch className="absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-muted-foreground" />
                                                <Input
                                                    id="branch"
                                                    name="branch"
                                                    value={defaultBranch}
                                                    onChange={(event) => setDefaultBranch(event.target.value)}
                                                    className="h-11 pr-3.5 pl-10 font-mono"
                                                    required
                                                />
                                            </div>
                                        </Field>
                                        <Field>
                                            <FieldLabel htmlFor="command">Test command</FieldLabel>
                                            <div className="relative">
                                                <Terminal className="absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-muted-foreground" />
                                                <Input
                                                    id="command"
                                                    name="command"
                                                    value={testCommand}
                                                    onChange={(event) => setTestCommand(event.target.value)}
                                                    className="h-11 pr-3.5 pl-10 font-mono"
                                                    required
                                                />
                                            </div>
                                        </Field>
                                    </div>
                                    <div className="rounded-lg border bg-muted/45 px-4 py-3.5">
                                        <p className="text-xs font-medium text-muted-foreground">Project URL</p>
                                        <p className="mt-1 truncate font-mono text-sm">/projects/{projectId}</p>
                                    </div>
                                </FieldGroup>

                                <div className="mt-7 flex flex-col-reverse gap-3 border-t pt-6 sm:flex-row sm:items-center sm:justify-between">
                                    <p className="text-xs text-muted-foreground">
                                        All settings can be changed later.
                                    </p>
                                    <div className="flex gap-2">
                                        <Button type="button" variant="outline" render={<Link href="/" />}>
                                            Cancel
                                        </Button>
                                        <Button type="submit" disabled={isSubmitting} className="min-w-35 hover:cursor-pointer">
                                            {isSubmitting ? <LoaderCircle className="animate-spin" /> : <ArrowRight />}
                                            {isSubmitting ? 'Creating…' : 'Create project'}
                                        </Button>
                                    </div>
                                </div>
                            </form>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
