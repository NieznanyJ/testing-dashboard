// @vitest-environment node
import { EventEmitter } from 'node:events';
import { beforeEach, expect, it, vi } from 'vitest';

const mocks = vi.hoisted(() => ({ getProjectById: vi.fn(), spawn: vi.fn() }));
vi.mock('@/lib/prisma', () => ({ getProjectById: mocks.getProjectById }));
vi.mock('node:child_process', () => ({ spawn: mocks.spawn }));
import { POST } from './route';

const context = { params: Promise.resolve({ projectId: 'project-1' }) };
const request = () =>
  new Request('http://localhost/api/projects/project-1/runs/start', { method: 'POST' });

beforeEach(() => vi.resetAllMocks());

it('starts the saved command with the URL project ID and waits for spawn', async () => {
  mocks.getProjectById.mockResolvedValue({ id: 'project-1', testCommand: 'npm run test:e2e' });
  const child = Object.assign(new EventEmitter(), { unref: vi.fn() });
  mocks.spawn.mockImplementation(() => {
    queueMicrotask(() => child.emit('spawn'));
    return child;
  });
  const response = await POST(request(), context);
  expect(response.status).toBe(202);
  expect(mocks.getProjectById).toHaveBeenCalledWith('project-1');
  expect(mocks.spawn).toHaveBeenCalledWith(
    'npm run test:e2e',
    expect.objectContaining({
      cwd: process.cwd(),
      windowsHide: true,
      env: expect.objectContaining({ TESTOPS_PROJECT_ID: 'project-1' }),
    }),
  );
  expect(child.unref).toHaveBeenCalledOnce();
});

it('does not spawn tests for a missing project', async () => {
  mocks.getProjectById.mockResolvedValue(null);
  expect((await POST(request(), context)).status).toBe(404);
  expect(mocks.spawn).not.toHaveBeenCalled();
});

it('rejects an empty command', async () => {
  mocks.getProjectById.mockResolvedValue({ id: 'project-1', testCommand: ' ' });
  expect((await POST(request(), context)).status).toBe(400);
  expect(mocks.spawn).not.toHaveBeenCalled();
});

it('returns an error when the process cannot spawn', async () => {
  mocks.getProjectById.mockResolvedValue({ id: 'project-1', testCommand: 'npm run test:e2e' });
  const child = Object.assign(new EventEmitter(), { unref: vi.fn() });
  mocks.spawn.mockImplementation(() => {
    queueMicrotask(() => child.emit('error', new Error('spawn failed')));
    return child;
  });
  expect((await POST(request(), context)).status).toBe(500);
  expect(child.unref).not.toHaveBeenCalled();
});
