import { afterEach, expect, it } from 'vitest';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import RunArtifact from './RunArtifact';
import { artifactUrl } from '@/lib/artifact-urls';
afterEach(cleanup);
it('opens a screenshot in an accessible dialog through the run API', async () => {
  const artifact = {
    type: 'screenshot' as const,
    name: 'failure.png',
    url: 'test-results/a b.png',
  };
  render(<RunArtifact projectId="p1" runId="r1" artifact={artifact} />);
  fireEvent.click(screen.getByRole('button', { name: 'failure.png' }));
  expect(await screen.findByRole('dialog')).toBeInTheDocument();
  expect(screen.getByRole('img', { name: 'failure.png' })).toHaveAttribute(
    'src',
    artifactUrl('p1', 'r1', artifact),
  );
});
it('opens traces in the local Playwright viewer with the scoped artifact URL', () => {
  const artifact = { type: 'trace' as const, name: 'trace.zip', url: 'test-results/trace.zip' };
  render(<RunArtifact projectId="p1" runId="r1" artifact={artifact} />);
  const link = screen.getByRole('link');
  const viewer = new URL(link.getAttribute('href')!, 'http://localhost');
  expect(viewer.pathname).toBe('/trace-viewer/index.html');
  expect(viewer.searchParams.get('trace')).toBe(artifactUrl('p1', 'r1', artifact));
  expect(link).toHaveAttribute('target', '_blank');
});
