import { broadcast } from '@/lib/run-events';

export async function POST(request: Request) {
  const run = await request.json();

  broadcast(run);

  return Response.json({ ok: true });
}
