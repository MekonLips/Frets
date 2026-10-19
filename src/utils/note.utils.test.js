import { describe, expect, it, vi } from 'vitest';
import { ACCIDENTALS, FRETS_NUM, INSTRUMENTS, NATURALS, NOTES, NOTES_NUM } from '../config/frets.config.js';
import {
  getAccidentalIdxs,
  getFretInRange,
  getNaturalIdxs,
  getNoteByIdx,
  getNoteFrequency,
  getNotesFromIdxs,
  getNoteIdxs,
  getPattern,
  getRandomNoteSequence,
  isAccidental,
  isNatural,
  noteName,
  noteIndexAtFret,
  repeat,
} from './note.utils.js';

describe('fretboard note helpers', () => {
  it('wraps note names through the twelve-note chromatic set', () => {
    expect(noteName(0)).toBe('A');
    expect(noteName(12)).toBe('A');
    expect(noteName(-1)).toBe('G#');
    expect(noteIndexAtFret(7, 5)).toBe(0);
  });

  it('looks up note indices, names, and natural/accidental classifications', () => {
    expect(getNoteIdxs()).toEqual(Array.from({ length: NOTES_NUM }, (_, index) => index));
    expect(getNoteByIdx(0)).toBe('A');
    expect(getNoteByIdx(11)).toBe('G#');
    expect(getNotesFromIdxs([0, 3, 7])).toEqual(['A', 'C', 'E']);
    expect(getNaturalIdxs()).toEqual(NATURALS);
    expect(getAccidentalIdxs()).toEqual(ACCIDENTALS);

    for (let index = 0; index < NOTES_NUM; index++) {
      expect(isNatural(index)).toBe(NATURALS.includes(index));
      expect(isAccidental(index)).toBe(ACCIDENTALS.includes(index));
    }
  });

  it('finds the next matching fret at or above the requested start fret', () => {
    expect(getFretInRange(0, 7, 1)).toBe(5);
    expect(getFretInRange(7, 7, 1)).toBe(12);
    expect(getFretInRange(0, 7, 6)).toBe(17);
    expect(getFretInRange(0, 7, 13)).toBe(17);
  });

  it('converts semitone offsets from A4 to note frequencies', () => {
    expect(getNoteFrequency()).toBeCloseTo(440, 8);
    expect(getNoteFrequency(-12)).toBeCloseTo(220, 8);
    expect(getNoteFrequency(12)).toBeCloseTo(880, 8);
  });

  it('creates ascending and descending positions for each note', () => {
    const strings = INSTRUMENTS[0].strings;
    const pattern = getPattern({ exercise: 1, noteIdxs: [0, 2], strings, start: 1 });

    expect(pattern).toHaveLength(2 * strings.length * 2);
    expect(pattern[0]).toMatchObject({ noteIdx: 0, string: 6, dir: 'up' });
    expect(pattern[strings.length]).toMatchObject({ noteIdx: 0, string: 1, dir: 'down' });
    expect(pattern.every((position) => position.fret >= 1 && position.fret <= FRETS_NUM)).toBe(true);
  });

  it('alternates direction by note for exercises 4 and 5', () => {
    const strings = INSTRUMENTS[0].strings;
    const pattern = getPattern({ exercise: 4, noteIdxs: [0, 2, 4], strings, start: 1 });

    expect(pattern).toHaveLength(3 * strings.length);
    expect(pattern[0].dir).toBe('up');
    expect(pattern[strings.length].dir).toBe('down');
    expect(pattern[strings.length * 2].dir).toBe('up');
  });

  it('supports ascending and descending patterns across different string counts', () => {
    for (const stringCount of [4, 6, 7, 8]) {
      const strings = Array.from({ length: stringCount }, (_, index) => index % NOTES_NUM);
      const pattern = getPattern({ exercise: 1, noteIdxs: [0], strings, start: 1 });

      expect(pattern).toHaveLength(stringCount * 2);
      expect(pattern.slice(0, stringCount).map(({ string }) => string))
        .toEqual(Array.from({ length: stringCount }, (_, index) => stringCount - index));
      expect(pattern.slice(stringCount).map(({ string }) => string))
        .toEqual(Array.from({ length: stringCount }, (_, index) => index + 1));
      expect(pattern.every(({ fret }) => fret >= 1 && fret <= FRETS_NUM)).toBe(true);
    }
  });

  it('keeps generated frets at or above the requested start fret and wraps by octaves', () => {
    const strings = [0, 0, 0, 0, 0, 0];
    const atFirstFret = getPattern({ exercise: 1, noteIdxs: [1], strings, start: 1 });
    const atTwelfthFret = getPattern({ exercise: 1, noteIdxs: [0], strings, start: 13 });
    const aboveFirstOctave = getPattern({ exercise: 1, noteIdxs: [1], strings, start: 13 });

    expect(atFirstFret.every(({ fret }) => fret === 1)).toBe(true);
    expect(atTwelfthFret.every(({ fret }) => fret === 24)).toBe(true);
    expect(aboveFirstOctave.every(({ fret }) => fret === 13)).toBe(true);
  });

  it('returns an empty pattern for empty note or string lists', () => {
    expect(getPattern({ exercise: 1, noteIdxs: [], strings: [0, 2, 4] })).toEqual([]);
    expect(getPattern({ exercise: 1, noteIdxs: [0, 2, 4], strings: [] })).toEqual([]);
    expect(getPattern({ exercise: 1, noteIdxs: [], strings: [] })).toEqual([]);
  });

  it('handles a single note and one-string pattern without adding extra positions', () => {
    expect(getPattern({ exercise: 1, noteIdxs: [3], strings: [3], start: 1 })).toEqual([
      { noteIdx: 3, string: 1, fret: 12, dir: 'up' },
      { noteIdx: 3, string: 1, fret: 12, dir: 'down' },
    ]);
  });

  it('repeats a supplied value sequence the requested number of times', () => {
    expect(repeat(3, 'A', 'B')).toEqual(['A', 'B', 'A', 'B', 'A', 'B']);
    expect(repeat(0, 'A', 'B')).toEqual([]);
    expect(repeat(2)).toEqual([]);
  });

  it('selects notes from the correct exercise family without mutating constants', () => {
    const originalNaturals = [...NATURALS];
    const originalAccidentals = [...ACCIDENTALS];

    const naturals = getRandomNoteSequence({ exercise: 1, accidentals: false, shuffle: true });
    const accidentals = getRandomNoteSequence({ exercise: 3 });

    expect(naturals).toHaveLength(NATURALS.length);
    expect(naturals.every((note) => NATURALS.includes(note))).toBe(true);
    expect(accidentals).toHaveLength(ACCIDENTALS.length);
    expect(accidentals.every((note) => ACCIDENTALS.includes(note))).toBe(true);
    expect(NATURALS).toEqual(originalNaturals);
    expect(ACCIDENTALS).toEqual(originalAccidentals);
    expect(NOTES).toHaveLength(12);
  });

  it('generates the expected ordered sequence for each exercise type', () => {
    const naturals = [3, 5, 7, 8, 10, 0, 2];
    const accidentals = [4, 6, 9, 11, 1];
    const chromatic = [3, 4, 5, 6, 7, 8, 9, 10, 11, 0, 1, 2];

    expect(getRandomNoteSequence({ exercise: 1, accidentals: false })).toEqual(naturals);
    expect(getRandomNoteSequence({ exercise: 2, accidentals: false })).toEqual(naturals);
    expect(getRandomNoteSequence({ exercise: 3 })).toEqual(accidentals);
    expect(getRandomNoteSequence({ exercise: 4 })).toEqual(chromatic);
    expect(getRandomNoteSequence({ exercise: 6 })).toEqual(chromatic);
  });

  it('uses all chromatic notes when accidentals are enabled outside exercise 3', () => {
    for (const exercise of [1, 2, 4, 5, 6]) {
      const sequence = getRandomNoteSequence({ exercise, accidentals: true, shuffle: false });

      expect(sequence).toHaveLength(NOTES_NUM);
      expect(sequence).toEqual([3, 4, 5, 6, 7, 8, 9, 10, 11, 0, 1, 2]);
    }
  });

  it('keeps exercise 3 restricted to accidentals even when accidentals are explicitly disabled', () => {
    expect(getRandomNoteSequence({ exercise: 3, accidentals: false })).toEqual([4, 6, 9, 11, 1]);
  });

  it('shuffles only when requested or when exercise 5 starts, preserving every note exactly once', () => {
    const random = vi.spyOn(Math, 'random').mockReturnValue(0.25);

    try {
      const ordered = getRandomNoteSequence({ exercise: 4, accidentals: true });
      const explicitlyShuffled = getRandomNoteSequence({ exercise: 4, accidentals: true, shuffle: true });
      const exerciseFive = getRandomNoteSequence({ exercise: 5, accidentals: true });

      expect(ordered).toEqual([3, 4, 5, 6, 7, 8, 9, 10, 11, 0, 1, 2]);
      expect(explicitlyShuffled).not.toEqual(ordered);
      expect([...explicitlyShuffled].sort((a, b) => a - b)).toEqual([...ordered].sort((a, b) => a - b));
      expect([...exerciseFive].sort((a, b) => a - b)).toEqual([...ordered].sort((a, b) => a - b));
    } finally {
      random.mockRestore();
    }
  });

  it('returns an empty sequence for a requested length of zero and handles lengths larger than the source', () => {
    expect(getRandomNoteSequence({ exercise: 1, accidentals: false, length: 0 })).toEqual([3, 5, 7, 8, 10, 0, 2]);
    expect(getRandomNoteSequence({ exercise: 1, accidentals: false, length: 20 })).toEqual([3, 5, 7, 8, 10, 0, 2]);
  });

  it('limits a note sequence to the requested number of trailing notes', () => {
    expect(getRandomNoteSequence({ exercise: 1, accidentals: false, length: 3 })).toEqual([10, 0, 2]);
    expect(getRandomNoteSequence({ exercise: 1, accidentals: false, length: 7 })).toEqual([3, 5, 7, 8, 10, 0, 2]);
  });

  it('shuffles exercise 5 notes deterministically without accidentals', () => {
    const random = vi.spyOn(Math, 'random').mockReturnValue(0);

    try {
      expect(getRandomNoteSequence({ exercise: 5, accidentals: false })).toEqual([5, 7, 8, 10, 0, 2, 3]);
      expect(getRandomNoteSequence({ exercise: 5, accidentals: true })).not.toEqual([...Array(12).keys()]);
    } finally {
      random.mockRestore();
    }
  });

  it('lets exercises 4 and 5 include or exclude accidentals', () => {
    for (const exercise of [4, 5]) {
      const naturalsOnly = getRandomNoteSequence({ exercise, accidentals: false });
      expect(naturalsOnly).toHaveLength(NATURALS.length);
      expect(naturalsOnly.every((note) => NATURALS.includes(note))).toBe(true);

      const allNotes = getRandomNoteSequence({ exercise, accidentals: true });
      expect(allNotes).toHaveLength(NOTES_NUM);
      expect(allNotes).toEqual(expect.arrayContaining([...NATURALS, ...ACCIDENTALS]));
    }
  });

  it('keeps MIDI pitch data alongside each instrument tuning', () => {
    expect(INSTRUMENTS.every((instrument) => instrument.openStringMidi.length === instrument.strings.length)).toBe(true);
  });
});
