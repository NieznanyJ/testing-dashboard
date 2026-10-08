import path from 'path';
import { describe, expect, it } from 'vitest';

import { ARTIFACTS_DIR, resolveArtifactPath } from './artifacts';

describe('resolveArtifactPath', () => {
  it('accepts a file inside the test results directory', () => {
    expect(resolveArtifactPath('test-results/login/test-failed-1.png', '.png')).toBe(
      path.join(ARTIFACTS_DIR, 'login', 'test-failed-1.png'),
    );
  });

  it.each([
    ['path traversal', 'test-results/../package.json'],
    ['a file outside the results directory', 'data/mock-project.ts'],
    ['an absolute path', path.resolve('/etc/passwd')],
    ['the results directory itself', 'test-results'],
    ['a wrong extension', 'test-results/login/trace.zip'],
    ['an empty value', ''],
    ['a non-string value', 42],
  ])('rejects %s', (_case, requestedPath) => {
    expect(resolveArtifactPath(requestedPath, '.png')).toBeNull();
  });
});
