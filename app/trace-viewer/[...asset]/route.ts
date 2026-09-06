import { readFile } from 'node:fs/promises';
import path from 'node:path';

export const runtime = 'nodejs';
const mimeTypes: Record<string, string> = {
  '.html': 'text/html',
  '.js': 'text/javascript',
  '.css': 'text/css',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.ttf': 'font/ttf',
  '.woff2': 'font/woff2',
  '.webmanifest': 'application/manifest+json',
};

export async function GET(_request: Request, { params }: { params: Promise<{ asset: string[] }> }) {
  const { asset } = await params;
  if (asset.some((part) => !/^[a-zA-Z0-9_.-]+$/.test(part) || part === '..' || part === '.')) {
    return new Response('Not found', { status: 404 });
  }
  const root = path.join(process.cwd(), 'node_modules/playwright-core/lib/vite/traceViewer');
  try {
    const file = await readFile(path.join(root, ...asset));
    return new Response(file, {
      headers: {
        'Content-Type': mimeTypes[path.extname(asset.at(-1)!)] ?? 'application/octet-stream',
        'Cache-Control': 'no-cache',
        'X-Content-Type-Options': 'nosniff',
      },
    });
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === 'ENOENT')
      return new Response('Not found', { status: 404 });
    throw error;
  }
}
