import { serveArtifact, type ArtifactContext } from '@/lib/serve-artifact';
export const runtime = 'nodejs';
export async function GET(request: Request, context: ArtifactContext) {
  return serveArtifact(request, context, 'screenshot');
}
