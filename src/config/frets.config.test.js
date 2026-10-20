import { describe, expect, it } from 'vitest';
import {
  ACCIDENTALS,
  ACTIONS,
  EXERCISES,
  EXERCISE_INSTRUCTIONS,
  EXERCISES_NUM,
  FRETS_NUM,
  INSTRUMENTS,
  MARKERS,
  NATURALS,
  NOTES,
  NOTES_NUM,
  SELECTED_INSTRUMENT,
  SELECTED_NOTES,
  SELECTED_NOTE,
  SHOW_RANGE,
  SHOW_NAV,
  START_FRET,
} from './frets.config.js';

describe('fretboard configuration', () => {
  it('keeps the chromatic note set and natural/accidental groups consistent', () => {
    expect(NOTES).toHaveLength(NOTES_NUM);
    expect(new Set(NOTES).size).toBe(NOTES_NUM);
    expect(NATURALS).toHaveLength(7);
    expect(ACCIDENTALS).toHaveLength(5);
    expect([...NATURALS, ...ACCIDENTALS].sort((a, b) => a - b))
      .toEqual(Array.from({ length: NOTES_NUM }, (_, index) => index));
    expect(NATURALS.filter((index) => ACCIDENTALS.includes(index))).toEqual([]);
    expect(FRETS_NUM).toBe(NOTES_NUM * 2);
  });

  it('keeps fret markers within the supported fretboard range', () => {
    expect(MARKERS.length).toBeGreaterThan(0);
    expect(MARKERS.every((fret) => Number.isInteger(fret) && fret > 0 && fret <= FRETS_NUM)).toBe(true);
  });

  it('defines unique instruments with valid note indices and matching MIDI tunings', () => {
    expect(new Set(INSTRUMENTS.map(({ id }) => id)).size).toBe(INSTRUMENTS.length);

    for (const instrument of INSTRUMENTS) {
      expect(instrument.strings.length).toBeGreaterThan(0);
      expect(instrument.openStringMidi).toHaveLength(instrument.strings.length);
      expect(instrument.strings.every((noteIndex) => Number.isInteger(noteIndex) && noteIndex >= 0 && noteIndex < NOTES_NUM)).toBe(true);

      expect(instrument.openStringMidi.every((midiNote) => Number.isInteger(midiNote))).toBe(true);
    }
  });

  it('keeps exercise definitions, instructions and action codes consistent', () => {
    expect(EXERCISES).toHaveLength(EXERCISES_NUM);
    expect(EXERCISE_INSTRUCTIONS).toHaveLength(EXERCISES_NUM);
    expect(new Set(EXERCISES.map(({ id }) => id)).size).toBe(EXERCISES_NUM);
    expect(EXERCISES.map(({ id }) => id)).toEqual(Array.from({ length: EXERCISES_NUM }, (_, index) => index + 1));
    expect(EXERCISES.every(({ title, description }) => title.length > 0 && description.length > 0)).toBe(true);
    expect(EXERCISE_INSTRUCTIONS.every((instructions) => instructions.length > 0)).toBe(true);

    for (const actionGroup of Object.values(ACTIONS)) {
      expect(new Set(Object.values(actionGroup)).size).toBe(Object.values(actionGroup).length);
    }
  });

  it('defines valid GUI state defaults', () => {
    expect(INSTRUMENTS.some(({ id }) => id === SELECTED_INSTRUMENT)).toBe(true);
    expect(Object.values(ACTIONS.NOTES)).toContain(SELECTED_NOTES);
    expect(SELECTED_NOTE === null || (Number.isInteger(SELECTED_NOTE) && SELECTED_NOTE >= 0 && SELECTED_NOTE < NOTES_NUM)).toBe(true);
    expect(typeof SHOW_RANGE).toBe('boolean');
    expect(typeof SHOW_NAV).toBe('boolean');
  });

  it('uses a configured default instrument and a valid starting fret', () => {
    expect(INSTRUMENTS.some(({ id }) => id === SELECTED_INSTRUMENT)).toBe(true);
    expect(Number.isInteger(START_FRET)).toBe(true);
    expect(START_FRET).toBeGreaterThanOrEqual(1);
    expect(START_FRET).toBeLessThanOrEqual(FRETS_NUM);
  });
});
