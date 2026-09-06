// @vitest-environment node
import { beforeEach, expect, it, vi } from 'vitest';
import path from 'node:path';
const mocks = vi.hoisted(() => ({ getRun: vi.fn(), readFile: vi.fn(), realpath: vi.fn() }));
vi.mock('@/lib/prisma', () => ({ getRunById: mocks.getRun }));
vi.mock('node:fs/promises', () => ({ readFile: mocks.readFile, realpath: mocks.realpath }));
import { serveArtifact } from './serve-artifact';
const context = { params: Promise.resolve({ projectId: 'p1', runId: 'r1' }) };
const screenshot = { type: 'screenshot', name: 'failure.png', url: 'test-results/failure.png' };
const request = (file: string) =>
  new Request(`http://localhost/artifacts?path=${encodeURIComponent(file)}`);
beforeEach(() => {
  vi.resetAllMocks();
  mocks.getRun.mockResolvedValue({ files: [{ tests: [{ artifacts: [screenshot] }] }] });
  mocks.realpath.mockImplementation(async (file: string) => file);
  mocks.readFile.mockResolvedValue(Buffer.from('image'));
});
it('serves only a registered artifact and scopes the lookup to project and run', async () => {
  const response = await serveArtifact(request(screenshot.url), context);
  expect(mocks.getRun).toHaveBeenCalledWith('r1', 'p1');
  expect(response.status).toBe(200);
  expect(response.headers.get('content-type')).toBe('image/png');
  expect(await response.text()).toBe('image');
});
it('rejects a path that is not registered on the run', async () => {
  expect((await serveArtifact(request('.env'), context)).status).toBe(404);
  expect(mocks.readFile).not.toHaveBeenCalled();
});
it('rejects a registered path that resolves outside artifact directories', async () => {
  mocks.realpath.mockImplementation(async (file: string) =>
    file.endsWith('failure.png') ? path.resolve('.env') : file,
  );
  expect((await serveArtifact(request(screenshot.url), context)).status).toBe(404);
  expect(mocks.readFile).not.toHaveBeenCalled();
});
it('returns 404 for a run outside the project', async () => {
  mocks.getRun.mockResolvedValue(null);
  expect((await serveArtifact(request(screenshot.url), context)).status).toBe(404);
});
it('handles removed files and mismatched artifact types', async () => {
  expect((await serveArtifact(request(screenshot.url), context, 'trace')).status).toBe(404);
  mocks.readFile.mockRejectedValue(Object.assign(new Error('missing'), { code: 'ENOENT' }));
  expect((await serveArtifact(request(screenshot.url), context)).status).toBe(404);
});
