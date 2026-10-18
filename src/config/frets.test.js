import { describe, expect, it } from 'vitest';
import { ACCIDENTALS, FRETS_NUM, INSTRUMENTS, NATURALS, NOTES } from './frets.config.js';
import {
  getFretInRange,
  getPattern,
  getSequence,
  noteIndexAtFret,
  noteName,
} from './frets.js';

describe('fretboard note helpers', () => {
  it('wraps note names through the twelve-note chromatic set', () => {
    expect(noteName(0)).toBe('A');
    expect(noteName(12)).toBe('A');
    expect(noteName(-1)).toBe('G#');
    expect(noteIndexAtFret(7, 5)).toBe(0);
  });

  it('finds the next matching fret at or above the requested start fret', () => {
    expect(getFretInRange(0, 7, 1)).toBe(5);
    expect(getFretInRange(7, 7, 1)).toBe(12);
    expect(getFretInRange(0, 7, 6)).toBe(17);
    expect(getFretInRange(0, 7, 13)).toBe(17);
  });

  it('creates a full ascending and descending string pattern per note', () => {
    const pattern = getPattern([0, 2], INSTRUMENTS[0].strings, 1);
    expect(pattern).toHaveLength(2 * INSTRUMENTS[0].strings.length * 2);
    expect(pattern[0].string).toBe(6);
    expect(pattern[INSTRUMENTS[0].strings.length].direction).toBe('down');
    expect(pattern.every((position) => position.fret >= 1 && position.fret <= FRETS_NUM)).toBe(true);
  });

  it('shuffles only notes belonging to the selected exercise family', () => {
    const naturals = getSequence(1);
    const accidentals = getSequence(3);
    expect(naturals).toHaveLength(NATURALS.length);
    expect(naturals.every((note) => NATURALS.includes(note))).toBe(true);
    expect(accidentals).toHaveLength(ACCIDENTALS.length);
    expect(accidentals.every((note) => ACCIDENTALS.includes(note))).toBe(true);
    expect(NOTES).toHaveLength(12);
  });

  it('lets exercises 4 and 5 include or exclude accidentals', () => {
    for (const exercise of [4, 5]) {
      const naturalsOnly = getSequence(exercise, false);
      expect(naturalsOnly).toHaveLength(NATURALS.length);
      expect(naturalsOnly.every((note) => NATURALS.includes(note))).toBe(true);

      const allNotes = getSequence(exercise, true);
      expect(allNotes).toHaveLength(NOTES.length);
      expect(allNotes).toEqual(expect.arrayContaining([...NATURALS, ...ACCIDENTALS]));
    }
  });

  it('keeps MIDI pitch data alongside each instrument tuning', () => {
    expect(INSTRUMENTS.every((instrument) => instrument.openStringMidi.length === instrument.strings.length)).toBe(true);
  });
});
