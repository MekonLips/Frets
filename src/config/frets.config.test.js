import { describe, expect, it } from 'vitest';
import {
  ACCIDENTALS,
  ACTIONS,
  EXERCISE_INSTRUCTIONS,
  EXERCISE_CONTROL_CONFIG,
  getExerciseControlConfig,
  isExerciseLoopActive,
  EXERCISES_NUM,
  FRETS_NUM,
  INSTRUMENTS,
  INSTRUMENT_TYPES,
  INSTRUMENT_TYPE_NAMES,
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
    expect(Object.values(INSTRUMENT_TYPES)).toEqual([1, 2, 3, 4, 5]);
    expect(Object.keys(INSTRUMENT_TYPE_NAMES).map(Number)).toEqual(Object.values(INSTRUMENT_TYPES));
    expect(new Set(Object.values(INSTRUMENT_TYPE_NAMES)).size).toBe(Object.values(INSTRUMENT_TYPES).length);

    for (const instrument of INSTRUMENTS) {
      expect(Object.values(INSTRUMENT_TYPES)).toContain(instrument.type);
      expect(instrument.strings.length).toBeGreaterThan(0);
      expect(instrument.openStringMidi).toHaveLength(instrument.strings.length);
      expect(instrument.strings.every((noteIndex) => Number.isInteger(noteIndex) && noteIndex >= 0 && noteIndex < NOTES_NUM)).toBe(true);

      expect(instrument.openStringMidi.every((midiNote) => Number.isInteger(midiNote))).toBe(true);
    }
  });

  it('keeps exercise definitions, instructions and action codes consistent', () => {
    expect(EXERCISE_INSTRUCTIONS).toHaveLength(EXERCISES_NUM);
    expect(EXERCISE_INSTRUCTIONS.every((instructions) => instructions.length > 0)).toBe(true);

    for (const actionGroup of Object.values(ACTIONS)) {
      expect(new Set(Object.values(actionGroup)).size).toBe(Object.values(actionGroup).length);
    }
  });


  it('configures control availability and defaults for every exercise', () => {
    expect(Object.keys(EXERCISE_CONTROL_CONFIG).map(Number)).toEqual([1, 2, 3, 4, 5, 6]);
    expect(getExerciseControlConfig(1)).toMatchObject({
      tempo: false, shuffle: false, showPlayback: false,
      loop: { enabled: false, defaultValue: false },
      accidentals: { enabled: false, defaultValue: false },
    });
    expect(getExerciseControlConfig(2)).toMatchObject({ tempo: true, shuffle: false });
    expect(getExerciseControlConfig(3)).toMatchObject({
      tempo: true, shuffle: false,
      loop: { enabled: true, defaultValue: false },
      accidentals: { enabled: false, defaultValue: true },
    });
    expect(getExerciseControlConfig(4)).toMatchObject({
      tempo: true, shuffle: false,
      loop: { enabled: false, defaultValue: true },
      accidentals: { enabled: true, defaultValue: false },
    });
    expect(getExerciseControlConfig(5)).toMatchObject({
      tempo: true, shuffle: true,
      loop: { enabled: false, defaultValue: false },
      accidentals: { enabled: true, defaultValue: false },
    });
    expect(getExerciseControlConfig(6)).toMatchObject({
      tempo: true, shuffle: true,
      loop: { enabled: true, defaultValue: false },
      accidentals: { enabled: true, defaultValue: false },
    });
  });


  it('resolves loop activation from per-exercise state and configured defaults', () => {
    expect(isExerciseLoopActive(1)).toBe(false);
    expect(isExerciseLoopActive(3)).toBe(false);
    expect(isExerciseLoopActive(4)).toBe(true);
    expect(isExerciseLoopActive(6)).toBe(false);

    expect(isExerciseLoopActive(4, { 4: false })).toBe(false);
    expect(isExerciseLoopActive(3, { 3: true })).toBe(true);
    expect(isExerciseLoopActive(6, { 6: true })).toBe(true);
  });

  it('uses the same configured loop default for numeric and string exercise IDs', () => {
    for (const exercise of [1, 2, 3, 4, 5, 6]) {
      expect(isExerciseLoopActive(String(exercise))).toBe(
        getExerciseControlConfig(exercise).loop.defaultValue,
      );
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
