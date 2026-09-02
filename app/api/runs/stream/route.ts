import { subscribe } from '@/lib/run-events';

export async function GET() {
  let unsubscribe: (() => void) | undefined;

  const stream = new ReadableStream({
    start(controller) {
      controller.enqueue(`data: ${JSON.stringify({ message: 'connected' })}\n\n`);

      unsubscribe = subscribe((data) => {
        controller.enqueue(`data: ${JSON.stringify(data)}\n\n`);
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
