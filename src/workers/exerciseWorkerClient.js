import { useFretsStore, getSelectedInstrument } from '../store/useFretsStore';
import { ACTIONS } from '../config/frets.config';

const { SEQUENCE, NOTES, PATTERN } = ACTIONS.PATTERNS;

export const worker = new Worker(new URL('./exercise.worker.js', import.meta.url), { type: 'module' });

const sameSequence = (left, right) =>
    Array.isArray(left) &&
    Array.isArray(right) &&
    left.length === right.length &&
    left.every((note, index) => note === right[index]);

export const handleExerciseWorkerMessage = (event, store = useFretsStore) => {
    const { type, payload = {} } = event.data;
    const targetExercise = payload.exercise;
    const state = store.getState();
    const selectedInstrument = getSelectedInstrument(state.activeInstrumentDefinition || state.selectedInstrumentId);
    const currentInstrumentKey = `${selectedInstrument.id}:${selectedInstrument.openStringMidi.join(',')}`;
    if (payload.instrumentKey && payload.instrumentKey !== currentInstrumentKey) return;

    switch (type) {
        case SEQUENCE:
            store.getState().setExerciseResults(targetExercise, {
                ...(payload.sequence ? { sequence: payload.sequence } : {}),
                ...(payload.notes ? { notes: payload.notes } : {}),
                ...(payload.pattern ? { pattern: payload.pattern } : {}),
            });
            break;
        case NOTES: {
            // A NOTES response can arrive after a newer SEQUENCE response. Do not
            // let positions calculated for the old sequence overwrite its tabs.
            const currentSequence = state.exercises?.[String(targetExercise ?? '')]?.sequence;
            if (payload.notes && (!payload.sequence || !currentSequence || sameSequence(payload.sequence, currentSequence))) {
                store.getState().setExerciseNotes(targetExercise, payload.notes);
            }
            break;
        }
        case PATTERN:
            if (payload.pattern) store.getState().setExercisePattern(targetExercise, payload.pattern);
            break;
        default:
            console.log(`%ctype ${type} not recognised`, 'color: red;');
    }
};

worker.onmessage = handleExerciseWorkerMessage;
worker.onerror = event => console.log('%cworker.onerror', 'color: red;', event);

export const postExerciseWorkerMessage = message => worker.postMessage(message);
