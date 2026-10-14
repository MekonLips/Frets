import { atom, atomFamily, selector, selectorFamily } from 'recoil';
import { NOTES_NUM, START_FRET, SHOW_NAV, SHOW_RANGE, INSTRUMENTS, SELECTED_INSTRUMENT, SELECTED_NOTES, SELECTED_NOTE, TIME_LIMIT } from '../config/frets.config';
import { getNoteFrequency } from '../utils/note.utils';

export const startFretAtom = atom({
    key: 'startFret',
    default: START_FRET,
});

export const endFretAtom = selector({
    key: 'endFret',
    get: ({ get }) => get(startFretAtom) + NOTES_NUM - 1,
});

export const showNavAtom = atom({
    key: 'showNav',
    default: SHOW_NAV,
});

export const showRangeAtom = atom({
    key: 'showRange',
    default: SHOW_RANGE,
});

export const instrumentsAtom = atom({
    key: 'instruments',
    default: INSTRUMENTS,
});

export const selectedInstrumentIdAtom = atom({
    key: 'selectedInstrumentId',
    default: SELECTED_INSTRUMENT,
});

export const selectedNoteIdxAtom = atom({
    key: 'selectedNoteIdx',
    default: SELECTED_NOTE,
});

export const selectedNotesAtom = atom({
    key: 'selectedNotes',
    default: SELECTED_NOTES,
});

export const getInstrumentSelector = selectorFamily({
    key: 'getInstrument',
    get: id => ({ get }) => get(instrumentsAtom).find(obj => obj.id === id),
});

export const fretsAtom = atom({
    key: 'frets',
    default: [],
});

export const timerRemainingAtom = atom({
    key: 'timerRemaining',
    default: TIME_LIMIT,
});

export const timerRunningAtom = atom({
    key: 'timerRunning',
    default: false,
});

export const exerciseSequenceAtom = atomFamily({
    key: 'exerciseSequence',
    default: [],
});

export const exerciseNotesAtom = atomFamily({
    key: 'exerciseNotes',
    default: [],
});

export const exercisePatternAtom = atomFamily({
    key: 'exercisePattern',
    default: [],
});

export const exerciseStageAtom = atomFamily({
    key: 'exerciseStage',
    default: 1,
});

export const exerciseBeatAtom = atomFamily({
    key: 'exerciseBeat',
    default: 0,
});

// export const exerciseSubdivisionFrequencySelector = selectorFamily({
//     key: 'exerciseSubdivisionFrequency',
//     get: id => ({ get }) => getNoteFrequency(get(exerciseSequenceAtom(id))[get(exerciseStageAtom(id)) - 1]),
// });