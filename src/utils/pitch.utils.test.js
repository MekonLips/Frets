import { describe, expect, it } from 'vitest';
import { INSTRUMENTS } from '../config/frets.js';
import { getMidiPitch, getOpenStringMidi, midiToFrequency } from './pitch.utils.js';

describe('instrument string pitch', () => {
  it('defines an exact open-string MIDI pitch for every supported tuning', () => {
    expect(INSTRUMENTS.map(({ openStringMidi }) => openStringMidi)).toEqual([
      [40, 45, 50, 55, 59, 64], // Standard guitar: E2 A2 D3 G3 B3 E4
      [39, 44, 49, 54, 58, 63], // Eb guitar
      [38, 45, 50, 54, 57, 62], // Open D guitar: D2 A2 D3 F#3 A3 D4
      [43, 38, 33, 28],         // Standard bass: G2 D2 A1 E1
      [42, 37, 32, 27],         // Eb bass
    ]);
    INSTRUMENTS.forEach((instrument) => {
      expect(instrument.openStringMidi).toHaveLength(instrument.strings.length);
    });
  });

  it('calculates pitch from the selected string and fret', () => {
    const guitar = INSTRUMENTS[0];
    expect(getOpenStringMidi(guitar, 1)).toBe(40);
    expect(getMidiPitch(guitar, 1, 0)).toBe(40);
    expect(getMidiPitch(guitar, 1, 5)).toBe(45);
    expect(getMidiPitch(guitar, 6, 12)).toBe(76);
    expect(getMidiPitch(INSTRUMENTS[3], 4, 0)).toBe(28);
  });

  it('converts MIDI pitches to equal-tempered frequencies', () => {
    expect(midiToFrequency(69)).toBeCloseTo(440, 8);
    expect(midiToFrequency(57)).toBeCloseTo(220, 8);
    expect(midiToFrequency(81)).toBeCloseTo(880, 8);
    expect(midiToFrequency(70) / midiToFrequency(69)).toBeCloseTo(2 ** (1 / 12), 8);
  });

  it('rejects invalid string and fret values instead of playing a misleading pitch', () => {
    expect(() => getOpenStringMidi(INSTRUMENTS[0], 0)).toThrow(RangeError);
    expect(() => getOpenStringMidi(INSTRUMENTS[0], 7)).toThrow(RangeError);
    expect(() => getMidiPitch(INSTRUMENTS[0], 1, -1)).toThrow(RangeError);
    expect(() => getMidiPitch(INSTRUMENTS[0], 1, 25)).toThrow(RangeError);
    expect(() => midiToFrequency(Number.NaN)).toThrow(TypeError);
  });
});
