import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { ArrowRight, Check, CircleCheck, Clock3, Play, Sparkles, TestTube2 } from 'lucide-react';
import Link from 'next/link';

interface HomePageCTAProps {
    heading?: string;
    description?: string;
    button?: {
        text: string;
        url: string;
    };
    className?: string;
}

export default function HomePageCTA({
    heading = 'Cloud Test Dashboard',
    description = 'Monitor automated test executions and results.',
    button = {
        text: 'Create project',
        url: '/projects/new',
    },
    className,
}: HomePageCTAProps) {
    return (
        <section
            className={cn(
                'relative isolate min-h-screen overflow-hidden px-5 py-20 sm:px-8 lg:px-12',
                className,
            )}
        >
            <div className="pointer-events-none absolute inset-0 -z-20 bg-background" />
            <div className="pointer-events-none absolute -top-60 -left-48 -z-10 size-136 rounded-full bg-indigo-300/25 blur-3xl dark:bg-indigo-500/10" />
            <div className="pointer-events-none absolute -right-56 -bottom-72 -z-10 size-152 rounded-full bg-emerald-200/35 blur-3xl dark:bg-emerald-500/10" />
            <div className="pointer-events-none absolute inset-0 -z-10 bg-[linear-gradient(to_right,transparent_0%,oklch(0.5_0_0/.06)_1px,transparent_1px),linear-gradient(to_bottom,transparent_0%,oklch(0.5_0_0/.06)_1px,transparent_1px)] bg-[size:48px_48px] [mask-image:linear-gradient(to_bottom,black,transparent_75%)]" />

            <div className="mx-auto grid w-full max-w-6xl items-center gap-16 lg:grid-cols-[1fr_0.9fr] lg:gap-20">
                <div className="max-w-2xl">
                    <div className="mb-7 inline-flex items-center gap-2 rounded-full border bg-background/70 px-3 py-1.5 text-xs font-medium shadow-sm backdrop-blur">
                        <Sparkles className="size-3.5 text-indigo-500" />
                        Test orchestration, simplified
                    </div>

                    <h1 className="text-balance text-5xl leading-[1.02] font-semibold tracking-[-0.045em] sm:text-6xl lg:text-7xl">
                        {heading}
                        <span className="mt-2 block text-muted-foreground/55">Every run. One clear view.</span>
                    </h1>

                    <p className="mt-7 max-w-xl text-pretty text-base leading-7 text-muted-foreground sm:text-lg">
                        {description} Catch failures faster, inspect every test, and keep your team moving
                        without digging through CI logs.
                    </p>

                    <div className="mt-9 flex flex-col items-start gap-4 sm:flex-row sm:items-center">
                        <Button
                            render={<Link href={button.url} />}
                            size="lg"
                            className="h-12 rounded-xl px-6 text-base shadow-lg shadow-primary/15"
                        >
                            {button.text}
                            <ArrowRight className="transition-transform group-hover/button:translate-x-0.5" />
                        </Button>
                        <p className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Check className="size-4 text-emerald-600" />
                            Set up in under a minute
                        </p>
                    </div>

                    <div className="mt-12 flex flex-wrap gap-x-7 gap-y-3 border-t pt-6 text-sm text-muted-foreground">
                        {['Live results', 'Trace artifacts', 'Run history'].map((feature) => (
                            <span key={feature} className="flex items-center gap-2">
                                <CircleCheck className="size-4" />
                                {feature}
                            </span>
                        ))}
                    </div>
                </div>

                <div className="relative mx-auto w-full max-w-lg lg:mx-0">
                    <div className="absolute -inset-5 -z-10 rounded-[2rem] bg-linear-to-br from-indigo-500/15 via-transparent to-emerald-500/15 blur-2xl" />
                    <div className="overflow-hidden rounded-2xl border bg-card/90 shadow-2xl shadow-black/10 backdrop-blur-xl">
                        <div className="flex items-center justify-between border-b px-5 py-4">
                            <div className="flex items-center gap-3">
                                <div className="flex size-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                                    <TestTube2 className="size-4" />
                                </div>
                                <div>
                                    <p className="text-sm font-medium">Checkout E2E</p>
                                    <p className="font-mono text-xs text-muted-foreground">main · a8f3c21</p>
                                </div>
                            </div>
                            <span className="flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-2.5 py-1 text-xs font-medium text-emerald-700 dark:text-emerald-400">
                                <span className="size-1.5 rounded-full bg-emerald-500" />
                                Passed
                            </span>
                        </div>

                        <div className="p-5">
                            <div className="grid grid-cols-3 gap-3">
                                {[
                                    ['Passed', '24', 'text-emerald-600'],
                                    ['Failed', '0', 'text-foreground'],
                                    ['Duration', '1m 42s', 'text-foreground'],
                                ].map(([label, value, color]) => (
                                    <div key={label} className="rounded-xl bg-muted/60 p-3.5">
                                        <p className="text-xs text-muted-foreground">{label}</p>
                                        <p className={cn('mt-1 text-lg font-semibold', color)}>{value}</p>
                                    </div>
                                ))}
                            </div>

                            <div className="mt-5 space-y-2.5">
                                {[
                                    ['User can complete checkout', '8.4s'],
                                    ['Cart preserves selected items', '4.1s'],
                                    ['Payment confirmation is shown', '6.7s'],
                                ].map(([test, duration]) => (
                                    <div key={test} className="flex items-center gap-3 rounded-lg border px-3.5 py-3">
                                        <CircleCheck className="size-4 shrink-0 text-emerald-600" />
                                        <p className="min-w-0 flex-1 truncate text-sm">{test}</p>
                                        <span className="font-mono text-xs text-muted-foreground">{duration}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="absolute -right-4 -bottom-5 hidden items-center gap-3 rounded-xl border bg-background/95 p-3.5 shadow-xl backdrop-blur sm:flex">
                        <div className="flex size-9 items-center justify-center rounded-lg bg-indigo-500/10 text-indigo-600">
                            <Play className="size-4 fill-current" />
                        </div>
                        <div>
                            <p className="text-xs font-medium">Run completed</p>
                            <p className="mt-0.5 flex items-center gap-1 text-xs text-muted-foreground">
                                <Clock3 className="size-3" /> Just now
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
