import { spawn } from 'child_process';

export async function POST(request: Request) {
  const { path } = await request.json();

  const child = spawn('npx', ['playwright', 'show-trace', path], {
    shell: true,
    detached: true,
    stdio: 'ignore',
  });

  child.unref();

  return Response.json({ ok: true });
}
