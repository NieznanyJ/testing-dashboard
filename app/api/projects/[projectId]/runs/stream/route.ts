import { subscribe } from '@/lib/run-events';
import { TestRun } from '@/types/test-run';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ projectId: string }> },
) {
  const { projectId } = await params;

  let unsubscribe: (() => void) | undefined;

  const stream = new ReadableStream({
    start(controller) {
      controller.enqueue(`data: ${JSON.stringify({ message: 'connected' })}\n\n`);

      unsubscribe = subscribe((data) => {
        const run = data as TestRun;

        if (run.projectId !== projectId) return;

        controller.enqueue(`data: ${JSON.stringify(run)}\n\n`);
      });
    },

    cancel() {
      unsubscribe?.();
    },
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      Connection: 'keep-alive',
    },
  });
}
