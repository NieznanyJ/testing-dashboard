import fs from 'fs/promises';
import { resolveArtifactPath } from '@/lib/artifacts';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const fullPath = resolveArtifactPath(searchParams.get('path'), '.png');

  if (!fullPath) {
    return new Response('Invalid screenshot path', { status: 400 });
  }

  try {
    const file = await fs.readFile(fullPath);

    return new Response(file, {
      headers: {
        'Content-Type': 'image/png',
      },
    });
  } catch {
    return new Response('Screenshot not found', { status: 404 });
  }
}
