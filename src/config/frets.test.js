import { describe, expect, it, vi } from 'vitest';
import { arrayShuffle } from '../utils/array.utils.js';
import { ACCIDENTALS, FRETS_NUM, INSTRUMENTS, NATURALS, NOTES, NOTES_NUM } from './frets.config.js';
import {
  getFretInRange,
  getPattern,
  getSequence,
  noteIndexAtFret,
  noteName,
} from './frets.js';

describe('arrayShuffle', () => {
  it('shuffles the supplied array in place and returns it', () => {
    const items = [1, 2, 3, 4, 5];
    const original = [...items];

    const result = arrayShuffle(items);

    expect(result).toBe(items);
    expect(items).toHaveLength(original.length);
    expect([...items].sort()).toEqual(original);
  });

  it('handles empty and single-item arrays', () => {
    const empty = [];
    const single = [42];

    expect(arrayShuffle(empty)).toBe(empty);
    expect(arrayShuffle(empty)).toEqual([]);
    expect(arrayShuffle(single)).toBe(single);
    expect(arrayShuffle(single)).toEqual([42]);
  });
});

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

  it('shuffles only notes belonging to the selected exercise family without mutating constants', () => {
    const originalNaturals = [...NATURALS];
    const originalAccidentals = [...ACCIDENTALS];

    const naturals = getSequence(1);
    const accidentals = getSequence(3);

    expect(naturals).toHaveLength(NATURALS.length);
    expect(naturals.every((note) => NATURALS.includes(note))).toBe(true);
    expect(accidentals).toHaveLength(ACCIDENTALS.length);
    expect(accidentals.every((note) => ACCIDENTALS.includes(note))).toBe(true);
    expect(NATURALS).toEqual(originalNaturals);
    expect(ACCIDENTALS).toEqual(originalAccidentals);
    expect(NOTES).toHaveLength(12);
  });

  it('shuffles exercise 5 notes deterministically without accidentals', () => {
    const random = vi.spyOn(Math, 'random').mockReturnValue(0);

    try {
      expect(getSequence(5, false)).toEqual([2, 3, 5, 7, 8, 10, 0]);
      expect(getSequence(5, true)).not.toEqual([...Array(12).keys()]);
    } finally {
      random.mockRestore();
    }
  });

  it('lets exercises 4 and 5 include or exclude accidentals', () => {
    for (const exercise of [4, 5]) {
      const naturalsOnly = getSequence(exercise, false);
      expect(naturalsOnly).toHaveLength(NATURALS.length);
      expect(naturalsOnly.every((note) => NATURALS.includes(note))).toBe(true);

      const allNotes = getSequence(exercise, true);
      expect(allNotes).toHaveLength(NOTES_NUM);
      expect(allNotes).toEqual(expect.arrayContaining([...NATURALS, ...ACCIDENTALS]));
    }
  });

  it('keeps MIDI pitch data alongside each instrument tuning', () => {
    expect(INSTRUMENTS.every((instrument) => instrument.openStringMidi.length === instrument.strings.length)).toBe(true);
  });
});
