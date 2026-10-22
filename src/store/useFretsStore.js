import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { INSTRUMENTS, TIME_LIMIT, START_FRET, SELECTED_INSTRUMENT, SELECTED_NOTES, SELECTED_NOTE, SHOW_RANGE, SHOW_NAV } from '../config/frets.config.js';

const initialExerciseState = () => ({ sequence: [], notes: [], pattern: [], stage: 1, beat: 0 });

export const useFretsStore = create(persist((set) => ({
  selectedInstrumentId: SELECTED_INSTRUMENT,
  activeInstrumentDefinition: null,
  startFret: START_FRET,
  showRange: SHOW_RANGE,
  showNav: SHOW_NAV,
  showInstruments: false,
  selectedNoteIdx: SELECTED_NOTE,
  selectedNotesMode: SELECTED_NOTES,
  selectedNotesModeIndex: SELECTED_NOTES,
  sessionRemaining: TIME_LIMIT,
  timerRunning: false,
  sequencePlaying: false,
  tempoBpm: 40,
  useAccidentals: false,
  exercises: {},
  setInstrument: (selectedInstrumentId) => set({ selectedInstrumentId, activeInstrumentDefinition: null, timerRunning: false, sequencePlaying: false, exercises: {} }),
  setInstrumentDefinition: (activeInstrumentDefinition) => set((state) => {
    const instrumentKey = (instrument) => instrument
      ? JSON.stringify([instrument.id, instrument.type, instrument.strings, instrument.openStringMidi])
      : null;
    const instrumentChanged = instrumentKey(state.activeInstrumentDefinition) !== instrumentKey(activeInstrumentDefinition);
    return {
      activeInstrumentDefinition,
      ...(instrumentChanged ? { timerRunning: false, sequencePlaying: false, exercises: {} } : {}),
    };
  }),
  setStartFret: (startFret) => set({ startFret }),
  setShowRange: (showRange) => set({ showRange }),
  setShowNav: (showNav) => set(state => ({ showNav, ...(showNav ? { showInstruments: false } : {}) })),
  setShowInstruments: (showInstruments) => set(state => ({ showInstruments, ...(showInstruments ? { showNav: false } : {}) })),
  setSelectedNote: (selectedNoteIdx) => set({ selectedNoteIdx }),
  setSelectedNotesMode: (selectedNotesMode) => set({ selectedNotesMode, selectedNotesModeIndex: selectedNotesMode, selectedNoteIdx: null }),
  setExerciseField: (exercise, field, value) => set((state) => {
    const key = String(exercise ?? '');
    const current = state.exercises[key] ?? initialExerciseState();
    const nextValue = typeof value === 'function' ? value(current[field]) : value;
    return { exercises: { ...state.exercises, [key]: { ...current, [field]: nextValue } } };
  }),
  setExerciseResults: (exercise, results) => set((state) => {
    const key = String(exercise ?? '');
    const current = state.exercises[key] ?? initialExerciseState();
    return {
      exercises: {
        ...state.exercises,
        [key]: {
          ...current,
          ...results,
          ...(Object.hasOwn(results, 'sequence') ? { stage: 1, beat: 0 } : {}),
        },
      },
    };
  }),
  setExerciseSequence: (exercise, sequence) => set((state) => {
    const key = String(exercise ?? '');
    const current = state.exercises[key] ?? initialExerciseState();
    return { exercises: { ...state.exercises, [key]: { ...current, sequence, stage: 1, beat: 0 } } };
  }),
  setExerciseNotes: (exercise, notes) => set((state) => {
    const key = String(exercise ?? '');
    const current = state.exercises[key] ?? initialExerciseState();
    return { exercises: { ...state.exercises, [key]: { ...current, notes } } };
  }),
  setExercisePattern: (exercise, pattern) => set((state) => {
    const key = String(exercise ?? '');
    const current = state.exercises[key] ?? initialExerciseState();
    return { exercises: { ...state.exercises, [key]: { ...current, pattern } } };
  }),
  setExerciseStage: (exercise, stage) => set((state) => {
    const key = String(exercise ?? '');
    const current = state.exercises[key] ?? initialExerciseState();
    const nextStage = typeof stage === 'function' ? stage(current.stage) : stage;
    return { exercises: { ...state.exercises, [key]: { ...current, stage: nextStage } } };
  }),
  setExerciseBeat: (exercise, beat) => set((state) => {
    const key = String(exercise ?? '');
    const current = state.exercises[key] ?? initialExerciseState();
    const nextBeat = typeof beat === 'function' ? beat(current.beat) : beat;
    return { exercises: { ...state.exercises, [key]: { ...current, beat: nextBeat } } };
  }),
  setTimerRunning: (timerRunning) => set({ timerRunning }),
  setSequencePlaying: (sequencePlaying) => set({ sequencePlaying }),
  setTempoBpm: (tempoBpm) => set({ tempoBpm: Math.min(200, Math.max(40, Number(tempoBpm) || 40)) }),
  setUseAccidentals: (useAccidentals) => set({ useAccidentals }),
  setSessionRemaining: (sessionRemaining) => set((state) => ({ sessionRemaining: typeof sessionRemaining === 'function' ? sessionRemaining(state.sessionRemaining) : sessionRemaining })),
  resetSession: () => set({ sessionRemaining: TIME_LIMIT, timerRunning: false }),
}), {
  name: 'frets-preferences',
  storage: createJSONStorage(() => localStorage),
  partialize: (state) => ({
    selectedInstrumentId: state.selectedInstrumentId,
    ...(state.activeInstrumentDefinition ? { activeInstrumentDefinition: state.activeInstrumentDefinition } : {}),
    startFret: state.startFret,
    showRange: state.showRange,
    tempoBpm: state.tempoBpm,
    useAccidentals: state.useAccidentals,
  }),
}));

export const getSelectedInstrument = (selection) => {
  if (selection && typeof selection === 'object' && Array.isArray(selection.stringDefinitions)) {
    return selection;
  }
  return INSTRUMENTS.find((item) => item.id === selection) ?? INSTRUMENTS[0];
};
