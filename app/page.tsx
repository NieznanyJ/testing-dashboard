import LiveTestRuns from '@/components/LiveTestRuns';
import StartRunButton from '@/components/StartRunButton';


export default async function Home() {

  return (
    <main className="min-h-screen bg-muted/40">
      <div className="mx-auto max-w-7xl space-y-8 p-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Cloud Test Dashboard
          </h1>

          <p className="text-muted-foreground">
            Monitor automated test executions and results.
          </p>

          <StartRunButton />
        </div>

        <section>
          <h2 className="mb-4 text-xl font-semibold">
            Recent test runs
          </h2>
          <LiveTestRuns />

        </section>
      </div>
    </main>
  );
}