import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { INSTRUMENTS, SESSION_MS, START_FRET } from '../config/frets.js';

export const useFretsStore = create(persist((set) => ({
  selectedInstrumentId: 1,
  startFret: START_FRET,
  showRange: false,
  showNav: false,
  selectedNoteIdx: null,
  selectedNotesMode: 'single',
  sessionRemaining: SESSION_MS,
  timerRunning: false,
  tempo: 120,
  beat: 0,
  stage: 1,
  sequence: [],
  pattern: [],
  setInstrument: (selectedInstrumentId) => set({ selectedInstrumentId, sequence: [], pattern: [], stage: 1, beat: 0, timerRunning: false }),
  setStartFret: (startFret) => set({ startFret, sequence: [], pattern: [], stage: 1, beat: 0 }),
  setShowRange: (showRange) => set({ showRange }),
  setShowNav: (showNav) => set({ showNav }),
  setSelectedNote: (selectedNoteIdx) => set({ selectedNoteIdx }),
  setSelectedNotesMode: (selectedNotesMode) => set({ selectedNotesMode, selectedNoteIdx: null }),
  setSequence: (sequence) => set({ sequence, stage: 1, beat: 0 }),
  setPattern: (pattern) => set({ pattern }),
  setStage: (stage) => set({ stage, beat: 0 }),
  setBeat: (beat) => set((state) => ({ beat: typeof beat === 'function' ? beat(state.beat) : beat })),
  setTempo: (tempo) => set({ tempo }),
  setTimerRunning: (timerRunning) => set({ timerRunning }),
  setSessionRemaining: (sessionRemaining) => set((state) => ({ sessionRemaining: typeof sessionRemaining === 'function' ? sessionRemaining(state.sessionRemaining) : sessionRemaining })),
  resetSession: () => set({ sessionRemaining: SESSION_MS, timerRunning: false, beat: 0, stage: 1 }),
}), {
  name: 'frets-preferences',
  storage: createJSONStorage(() => localStorage),
  partialize: (state) => ({
    selectedInstrumentId: state.selectedInstrumentId,
    startFret: state.startFret,
    showRange: state.showRange,
    tempo: state.tempo,
  }),
}));

export const getSelectedInstrument = (id) => INSTRUMENTS.find((item) => item.id === id) ?? INSTRUMENTS[0];