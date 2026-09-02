import fs from 'fs/promises';
import path from 'path';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const artifactPath = searchParams.get('path');

  if (!artifactPath) {
    return new Response('Missing path', { status: 400 });
  }

  const fullPath = path.join(process.cwd(), artifactPath);

  const file = await fs.readFile(fullPath);

  return new Response(file, {
    headers: {
      'Content-Type': 'image/png',
    },
  });
}
