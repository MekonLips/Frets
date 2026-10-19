import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { ACTIONS } from '../config/frets.config.js';

const { SEQUENCE, NOTES, PATTERN } = ACTIONS.PATTERNS;

describe('exercise worker message handling', () => {
  let workerSelf;

  beforeEach(() => {
    workerSelf = { postMessage: vi.fn(), onmessage: null };
    vi.stubGlobal('self', workerSelf);
    vi.resetModules();
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  const sendMessage = async (type, payload = {}) => {
    await import('./exercise.worker.js');
    await workerSelf.onmessage({ data: { type, payload } });
    return workerSelf.postMessage.mock.calls.at(-1)?.[0];
  };

  it('returns note positions for each requested note', async () => {
    const response = await sendMessage(NOTES, {
      exercise: 1,
      strings: [0],
      sequence: [1],
      start: 1,
    });

    expect(response.type).toBe(NOTES);
    expect(response.payload.success).toBe(true);
    expect(response.payload.notes).toEqual([
      [
        { string: 1, fret: 1, note: 'A#' },
        { string: 1, fret: 13, note: 'A#' },
      ],
    ]);
    expect(response.payload.sequence).toEqual([1]);
  });

  it('returns a pattern with the requested exercise and fret start', async () => {
    const response = await sendMessage(PATTERN, {
      exercise: 1,
      strings: [0],
      sequence: [1],
      start: 13,
    });

    expect(response.type).toBe(PATTERN);
    expect(response.payload.success).toBe(true);
    expect(response.payload.pattern).toEqual([
      { noteIdx: 1, string: 1, fret: 13, dir: 'up' },
      { noteIdx: 1, string: 1, fret: 13, dir: 'down' },
    ]);
  });

  it('returns a sequence together with its note positions and pattern', async () => {
    const response = await sendMessage(SEQUENCE, {
      exercise: 1,
      strings: [0, 5, 9, 2],
      start: 1,
      accidentals: false,
      shuffle: false,
    });

    expect(response.type).toBe(SEQUENCE);
    expect(response.payload.success).toBe(true);
    expect(response.payload.sequence).toEqual(expect.any(Array));
    expect(response.payload.sequence.length).toBeGreaterThan(0);
    expect(response.payload.notes).toHaveLength(response.payload.sequence.length);
    expect(response.payload.pattern).toHaveLength(response.payload.sequence.length * 8);
    expect(response.payload.exercise).toBe(1);
    expect(response.payload.strings).toEqual([0, 5, 9, 2]);
  });

  it('returns an error response for an unknown message type', async () => {
    const response = await sendMessage('UNKNOWN_ACTION', { exercise: 1 });

    expect(response).toEqual({
      type: 'UNKNOWN_ACTION',
      payload: {
        error: true,
        message: 'type UNKNOWN_ACTION not recognised',
      },
    });
  });
});
