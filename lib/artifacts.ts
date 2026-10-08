import path from 'path';

export const ARTIFACTS_DIR = path.resolve(process.cwd(), 'test-results');

/**
 * Resolves an artifact path sent by the client and returns it only if it points
 * inside the Playwright results directory and has the expected extension.
 */
export function resolveArtifactPath(requestedPath: unknown, extension: string): string | null {
  if (typeof requestedPath !== 'string' || !requestedPath) return null;

  const fullPath = path.resolve(/* turbopackIgnore: true */ process.cwd(), requestedPath);
  const relativePath = path.relative(ARTIFACTS_DIR, fullPath);

  const isInside = relativePath !== '' && !relativePath.startsWith('..') && !path.isAbsolute(relativePath);

  if (!isInside || path.extname(fullPath).toLowerCase() !== extension) return null;

  return fullPath;
}
