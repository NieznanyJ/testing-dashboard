// @vitest-environment node
import { beforeEach, describe, expect, it, vi } from 'vitest';

const { spawnMock } = vi.hoisted(() => ({
  spawnMock: vi.fn(() => ({ unref: vi.fn() })),
}));

vi.mock('child_process', () => ({ spawn: spawnMock, default: { spawn: spawnMock } }));

import { GET as getScreenshot } from './screenshot/route';
import { POST as openTrace } from './trace/route';

function traceRequest(body: unknown) {
  return new Request('http://localhost/api/artifacts/trace', {
    method: 'POST',
    body: typeof body === 'string' ? body : JSON.stringify(body),
  });
}

describe('GET /api/artifacts/screenshot', () => {
  it.each([
    ['missing path', ''],
    ['path traversal', '?path=test-results/../../package.json'],
    ['file outside the results directory', '?path=package.json'],
    ['non-image file', '?path=test-results/run/trace.zip'],
  ])('returns 400 for %s', async (_case, query) => {
    const response = await getScreenshot(new Request(`http://localhost/api/artifacts/screenshot${query}`));

    expect(response.status).toBe(400);
  });

  it('returns 404 for a screenshot that does not exist', async () => {
    const response = await getScreenshot(
      new Request('http://localhost/api/artifacts/screenshot?path=test-results/missing/nope.png'),
    );

    expect(response.status).toBe(404);
  });
});

describe('POST /api/artifacts/trace', () => {
  beforeEach(() => {
    spawnMock.mockClear();
  });

  it.each([
    ['invalid JSON', 'not json'],
    ['missing path', {}],
    ['path traversal', { path: 'test-results/../../secret.zip' }],
    ['command appended to the path', { path: 'test-results/trace.zip & calc.exe' }],
  ])('returns 400 for %s and starts nothing', async (_case, body) => {
    const response = await openTrace(traceRequest(body));

    expect(response.status).toBe(400);
    expect(spawnMock).not.toHaveBeenCalled();
  });

  it('opens the trace viewer without a shell, passing the path as a single argument', async () => {
    const tracePath = 'test-results/$(touch pwned)/trace.zip';

    const response = await openTrace(traceRequest({ path: tracePath }));

    expect(response.status).toBe(200);
    expect(spawnMock).toHaveBeenCalledTimes(1);

    const [, args, options] = spawnMock.mock.calls[0] as unknown as [string, string[], { shell?: boolean }];
    expect(args.slice(1, 2)).toEqual(['show-trace']);
    expect(args[2]).toMatch(/\$\(touch pwned\)[\\/]trace\.zip$/);
    expect(options.shell).toBeUndefined();
  });
});
