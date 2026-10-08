import { describe, expect, it, vi } from 'vitest';

import { broadcast, subscribe } from './run-events';

describe('run events', () => {
  it('delivers a broadcast to every subscriber', () => {
    const first = vi.fn();
    const second = vi.fn();
    const unsubscribeFirst = subscribe(first);
    const unsubscribeSecond = subscribe(second);

    broadcast({ id: 'run-1' });

    expect(first).toHaveBeenCalledWith({ id: 'run-1' });
    expect(second).toHaveBeenCalledWith({ id: 'run-1' });

    unsubscribeFirst();
    unsubscribeSecond();
  });

  it('stops delivering events after unsubscribing', () => {
    const listener = vi.fn();
    const unsubscribe = subscribe(listener);

    unsubscribe();
    broadcast({ id: 'run-2' });

    expect(listener).not.toHaveBeenCalled();
  });
});
