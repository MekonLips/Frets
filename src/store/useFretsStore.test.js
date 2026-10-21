import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { TIME_LIMIT, START_FRET, SELECTED_INSTRUMENT, SELECTED_NOTES, SELECTED_NOTE, SHOW_RANGE, SHOW_NAV } from '../config/frets.config.js';

describe('Frets store state transitions', () => {
  let store;
  let storage;

  beforeEach(async () => {
    storage = {
      getItem: vi.fn(() => null),
      setItem: vi.fn(),
      removeItem: vi.fn(),
    };
    vi.stubGlobal('localStorage', storage);
    vi.resetModules();
    ({ useFretsStore: store } = await import('./useFretsStore.js'));
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('initializes the main preferences and session state from configuration defaults', () => {
    const state = store.getState();

    expect(state.selectedInstrumentId).toBe(SELECTED_INSTRUMENT);
    expect(state.startFret).toBe(START_FRET);
    expect(state.tempoBpm).toBe(40);
    expect(state.sessionRemaining).toBe(TIME_LIMIT);
    expect(state.timerRunning).toBe(false);
    expect(state.selectedNotesMode).toBe(SELECTED_NOTES);
    expect(state.selectedNotesModeIndex).toBe(SELECTED_NOTES);
    expect(state.selectedNoteIdx).toBe(SELECTED_NOTE);
    expect(state.showRange).toBe(SHOW_RANGE);
    expect(state.showNav).toBe(SHOW_NAV);
    expect(state.exercises).toEqual({});
  });

  it('stops the timer when the selected instrument changes', () => {
    store.getState().setTimerRunning(true);
    store.getState().setInstrument(4);

    expect(store.getState().selectedInstrumentId).toBe(4);
    expect(store.getState().timerRunning).toBe(false);
  });

  it('uses an active builder instrument definition and returns to legacy selection when cleared', async () => {
    const { getSelectedInstrument } = await import('./useFretsStore.js');
    const definition = {
      id: 'user-seven-string',
      name: 'Seven String Guitar',
      type: 'guitar',
      strings: [7, 7, 7, 7, 7, 7, 7],
      openStringMidi: [64, 59, 55, 50, 45, 40, 35],
      stringDefinitions: [
        { id: 's1', midi: 64, winding: { mode: 'manual', value: false } },
        { id: 's2', midi: 59, winding: { mode: 'auto', value: false } },
        { id: 's3', midi: 55, winding: { mode: 'auto', value: false } },
        { id: 's4', midi: 50, winding: { mode: 'auto', value: false } },
        { id: 's5', midi: 45, winding: { mode: 'auto', value: true } },
        { id: 's6', midi: 40, winding: { mode: 'auto', value: true } },
        { id: 's7', midi: 35, winding: { mode: 'auto', value: true } },
      ],
    };

    store.getState().setInstrumentDefinition(definition);
    expect(getSelectedInstrument(store.getState().activeInstrumentDefinition)).toBe(definition);
    expect(getSelectedInstrument(store.getState().activeInstrumentDefinition).strings).toHaveLength(7);

    store.getState().setInstrument(4);
    expect(store.getState().activeInstrumentDefinition).toBeNull();
    expect(getSelectedInstrument(store.getState().selectedInstrumentId).id).toBe(4);
  });

  it('updates start fret and view preferences independently', () => {
    const state = store.getState();
    state.setStartFret(7);
    state.setShowRange(true);
    state.setShowNav(true);

    expect(store.getState()).toMatchObject({
      startFret: 7,
      showRange: true,
      showNav: true,
    });
  });

  it('clears the selected note when the selected-note mode changes', () => {
    const state = store.getState();
    state.setSelectedNote(5);
    state.setSelectedNotesMode(3);

    expect(store.getState()).toMatchObject({
      selectedNotesMode: 3,
      selectedNotesModeIndex: 3,
      selectedNoteIdx: null,
    });
  });

  it('updates individual exercise fields without overwriting other exercises or fields', () => {
    const state = store.getState();
    state.setExerciseField(1, 'stage', 3);
    state.setExerciseField(1, 'beat', 2);
    state.setExerciseField(2, 'stage', 4);

    expect(store.getState().exercises).toMatchObject({
      1: { sequence: [], notes: [], pattern: [], stage: 3, beat: 2 },
      2: { sequence: [], notes: [], pattern: [], stage: 4, beat: 0 },
    });
  });

  it('supports functional updates to exercise stage and beat', () => {
    const state = store.getState();
    state.setExerciseStage(1, 2);
    state.setExerciseStage(1, (stage) => stage + 1);
    state.setExerciseBeat(1, 3);
    state.setExerciseBeat(1, (beat) => beat + 1);

    expect(store.getState().exercises['1']).toMatchObject({ stage: 3, beat: 4 });
  });

  it('resets stage and beat when a new exercise sequence is set', () => {
    const state = store.getState();
    state.setExerciseStage(2, 4);
    state.setExerciseBeat(2, 7);
    state.setExerciseSequence(2, [0, 3, 5]);

    expect(store.getState().exercises['2']).toMatchObject({
      sequence: [0, 3, 5],
      stage: 1,
      beat: 0,
    });
  });

  it('clamps tempo to the supported 40–200 BPM range', () => {
    const setTempo = store.getState().setTempoBpm;

    setTempo(120);
    expect(store.getState().tempoBpm).toBe(120);

    setTempo(20);
    expect(store.getState().tempoBpm).toBe(40);

    setTempo(240);
    expect(store.getState().tempoBpm).toBe(200);

    setTempo('not a number');
    expect(store.getState().tempoBpm).toBe(40);
  });

  it('keeps exercise progress scoped to each exercise instead of global legacy fields', () => {
    const state = store.getState();

    expect(state).not.toHaveProperty('sequence');
    expect(state).not.toHaveProperty('pattern');
    expect(state).not.toHaveProperty('stage');
    expect(state).not.toHaveProperty('beat');
    expect(state).not.toHaveProperty('setSequence');
    expect(state).not.toHaveProperty('setPattern');
    expect(state).not.toHaveProperty('setStage');
    expect(state).not.toHaveProperty('setBeat');

    state.setExerciseSequence(1, [0, 2, 4]);
    state.setExerciseSequence(2, [5, 7, 9]);
    state.setExerciseStage(1, 2);
    state.setExerciseBeat(2, 3);

    expect(store.getState().exercises).toMatchObject({
      1: { sequence: [0, 2, 4], stage: 2, beat: 0 },
      2: { sequence: [5, 7, 9], stage: 1, beat: 3 },
    });
  });

  it('shares the accidentals preference across exercises', () => {
    store.getState().setUseAccidentals(true);

    expect(store.getState().useAccidentals).toBe(true);
    expect(store.getState()).not.toHaveProperty('exerciseAccidentals');
  });

  it('supports functional updates to the session timer', () => {
    const state = store.getState();
    state.setSessionRemaining(90000);
    state.setSessionRemaining((remaining) => remaining - 1000);

    expect(store.getState().sessionRemaining).toBe(89000);
  });

  it('resets the session timer and stops a running timer', () => {
    const state = store.getState();
    state.setSessionRemaining(1000);
    state.setTimerRunning(true);
    state.resetSession();

    expect(store.getState().sessionRemaining).toBe(TIME_LIMIT);
    expect(store.getState().timerRunning).toBe(false);
  });

  it('persists preferences but excludes transient exercise and session state', () => {
    const state = store.getState();
    state.setInstrument(4);
    state.setStartFret(5);
    state.setShowRange(true);
    state.setTempoBpm(90);
    state.setUseAccidentals(true);
    state.setExerciseSequence(4, [0, 2, 4]);
    state.setSessionRemaining(1234);
    state.setTimerRunning(true);

    const [key, serialized] = storage.setItem.mock.calls.at(-1);
    const persisted = JSON.parse(serialized);

    expect(key).toBe('frets-preferences');
    expect(persisted.state).toEqual({
      selectedInstrumentId: 4,
      startFret: 5,
      showRange: true,
      tempoBpm: 90,
      useAccidentals: true,
    });
    expect(persisted.state).not.toHaveProperty('exercises');
    expect(persisted.state).not.toHaveProperty('sessionRemaining');
    expect(persisted.state).not.toHaveProperty('timerRunning');
  });
});
