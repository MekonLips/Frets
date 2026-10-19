import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { ACTIONS } from '../config/frets.config.js';

const { START, STOP, UPDATE, TICK } = ACTIONS.TIMER;

describe('timer worker message handling', () => {
  let workerSelf;
  let sendMessage;

  beforeEach(async () => {
    vi.useFakeTimers();
    workerSelf = { postMessage: vi.fn(), onmessage: null };
    vi.stubGlobal('self', workerSelf);
    vi.resetModules();
    await import('./timer.worker.js');
    sendMessage = (data) => workerSelf.onmessage({ data });
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.useRealTimers();
  });

  it('posts a tick at the requested interval after START', () => {
    sendMessage({ type: START, interval: 1000 });

    vi.advanceTimersByTime(999);
    expect(workerSelf.postMessage).not.toHaveBeenCalled();

    vi.advanceTimersByTime(1);
    expect(workerSelf.postMessage).toHaveBeenCalledOnce();
    expect(workerSelf.postMessage).toHaveBeenCalledWith(TICK);
  });

  it('replaces the existing interval when START is received again', () => {
    sendMessage({ type: START, interval: 1000 });
    vi.advanceTimersByTime(500);

    sendMessage({ type: START, interval: 2000 });
    expect(vi.getTimerCount()).toBe(1);

    vi.advanceTimersByTime(1500);
    expect(workerSelf.postMessage).not.toHaveBeenCalled();

    vi.advanceTimersByTime(500);
    expect(workerSelf.postMessage).toHaveBeenCalledOnce();
    expect(workerSelf.postMessage).toHaveBeenCalledWith(TICK);
  });

  it('stops posting ticks after STOP', () => {
    sendMessage({ type: START, interval: 1000 });
    vi.advanceTimersByTime(500);

    sendMessage({ type: STOP });
    expect(vi.getTimerCount()).toBe(0);

    vi.advanceTimersByTime(5000);
    expect(workerSelf.postMessage).not.toHaveBeenCalled();
  });

  it('updates the interval only when the timer is running', () => {
    sendMessage({ type: UPDATE, interval: 2500 });
    expect(vi.getTimerCount()).toBe(0);

    sendMessage({ type: START, interval: 1000 });
    vi.advanceTimersByTime(500);
    sendMessage({ type: UPDATE, interval: 2500 });

    vi.advanceTimersByTime(2499);
    expect(workerSelf.postMessage).not.toHaveBeenCalled();

    vi.advanceTimersByTime(1);
    expect(workerSelf.postMessage).toHaveBeenCalledOnce();
    expect(workerSelf.postMessage).toHaveBeenCalledWith(TICK);
  });

  it('posts an error response for an unknown message type', () => {
    sendMessage({ type: 'UNKNOWN_ACTION' });

    expect(workerSelf.postMessage).toHaveBeenCalledWith({
      error: true,
      message: 'type UNKNOWN_ACTION not recognised',
    });
  });
});
