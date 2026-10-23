import { afterEach, describe, expect, it, vi } from 'vitest';
import { playCountInClick, playPluckedNote } from './audio.utils.js';

const createAudioContext = (state = 'running', currentTime = 2) => {
  const makeParam = () => ({
    setValueAtTime: vi.fn(),
    linearRampToValueAtTime: vi.fn(),
    exponentialRampToValueAtTime: vi.fn(),
  });
  const makeNode = () => ({ connect: vi.fn(), disconnect: vi.fn() });
  const gain = () => ({ ...makeNode(), gain: makeParam() });
  const oscillator = () => ({
    ...makeNode(),
    frequency: makeParam(),
    start: vi.fn(),
    stop: vi.fn(),
    type: '',
    onended: null,
  });
  const filter = { ...makeNode(), type: '', frequency: makeParam() };
  return {
    state,
    currentTime,
    destination: {},
    resume: vi.fn(),
    createGain: vi.fn(gain),
    createBiquadFilter: vi.fn(() => filter),
    createOscillator: vi.fn(oscillator),
  };
};

afterEach(() => {
  vi.unstubAllGlobals();
});

describe('playPluckedNote', () => {
  it('returns false when no browser audio context is available', () => {
    vi.stubGlobal('window', undefined);
    expect(playPluckedNote(69)).toBe(false);
  });

  it('returns false for a closed context', () => {
    expect(playPluckedNote(69, { context: createAudioContext('closed') })).toBe(false);
  });

  it('schedules a fundamental and second harmonic at the requested time', () => {
    const context = createAudioContext('running', 3);
    expect(playPluckedNote(69, { context, time: 5, duration: 0.2, volume: 0.4 })).toBe(true);

    expect(context.createOscillator).toHaveBeenCalledTimes(2);
    const [fundamental, harmonic] = context.createOscillator.mock.results.map(({ value }) => value);
    expect(fundamental.type).toBe('triangle');
    expect(harmonic.type).toBe('sine');
    expect(fundamental.frequency.setValueAtTime).toHaveBeenCalledWith(440, 5);
    expect(harmonic.frequency.setValueAtTime).toHaveBeenCalledWith(880, 5);
    expect(fundamental.start).toHaveBeenCalledWith(5);
    expect(fundamental.stop).toHaveBeenCalledWith(5.21);
  });

  it('resumes a suspended context and clamps very short note durations', () => {
    const context = createAudioContext('suspended', 4);
    expect(playPluckedNote(69, { context, duration: 0.01 })).toBe(true);

    expect(context.resume).toHaveBeenCalledOnce();
    const [fundamental] = context.createOscillator.mock.results.map(({ value }) => value);
    expect(fundamental.start).toHaveBeenCalledWith(4);
    expect(fundamental.stop).toHaveBeenCalledWith(4.09);
  });

  it('disconnects the audio nodes when the fundamental finishes', () => {
    const context = createAudioContext();
    playPluckedNote(69, { context });
    const [master, harmonicGain] = context.createGain.mock.results.map(({ value }) => value);
    const [filter] = context.createBiquadFilter.mock.results.map(({ value }) => value);
    const [fundamental, harmonic] = context.createOscillator.mock.results.map(({ value }) => value);

    fundamental.onended();

    expect(fundamental.disconnect).toHaveBeenCalledOnce();
    expect(harmonic.disconnect).toHaveBeenCalledOnce();
    expect(harmonicGain.disconnect).toHaveBeenCalledOnce();
    expect(filter.disconnect).toHaveBeenCalledOnce();
    expect(master.disconnect).toHaveBeenCalledOnce();
  });
});

describe('playCountInClick', () => {
  it('waits for a suspended audio context to resume before scheduling the click', async () => {
    const context = createAudioContext('suspended', 4);
    context.resume.mockImplementation(async () => {
      await Promise.resolve();
      context.state = 'running';
    });
    vi.stubGlobal('window', { AudioContext: vi.fn(() => context) });

    await expect(playCountInClick()).resolves.toBe(true);

    expect(context.resume).toHaveBeenCalledOnce();
    expect(context.createOscillator).toHaveBeenCalledTimes(2);
    for (const { value: oscillator } of context.createOscillator.mock.results) {
      expect(oscillator.start).toHaveBeenCalledWith(4);
    }
  });

  it('returns false when the audio context cannot run', async () => {
    const context = createAudioContext('suspended', 4);
    context.resume.mockRejectedValue(new Error('resume failed'));
    vi.stubGlobal('window', { AudioContext: vi.fn(() => context) });

    await expect(playCountInClick()).rejects.toThrow('resume failed');
  });
});
