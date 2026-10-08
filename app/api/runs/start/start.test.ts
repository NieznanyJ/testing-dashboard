// @vitest-environment node
import { describe, expect, it, vi } from 'vitest';

const { spawnMock } = vi.hoisted(() => ({
  spawnMock: vi.fn(() => ({ unref: vi.fn() })),
}));

vi.mock('child_process', () => ({ spawn: spawnMock, default: { spawn: spawnMock } }));

import { POST } from './route';

function startRequest(body: string) {
  return new Request('http://localhost/api/runs/start', { method: 'POST', body });
}

describe('POST /api/runs/start', () => {
  it('returns 400 for a body that is not JSON', async () => {
    const response = await POST(startRequest('not json'));

    expect(response.status).toBe(400);
  });

  it('returns 400 when projectId is missing', async () => {
    const response = await POST(startRequest('{}'));

    expect(response.status).toBe(400);
    expect(await response.json()).toEqual({ error: 'projectId is required' });
  });

  it('returns 404 for an unknown project', async () => {
    const response = await POST(startRequest(JSON.stringify({ projectId: 'does-not-exist' })));

    expect(response.status).toBe(404);
    expect(spawnMock).not.toHaveBeenCalled();
  });

  it('starts the project test command with its project id', async () => {
    const response = await POST(startRequest(JSON.stringify({ projectId: 'project-1' })));

    expect(response.status).toBe(202);
    expect(spawnMock).toHaveBeenCalledWith(
      'npm run test:e2e',
      expect.objectContaining({
        env: expect.objectContaining({ TESTOPS_PROJECT_ID: 'project-1' }),
      }),
    );
  });
});
