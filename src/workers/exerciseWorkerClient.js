import { useFretsStore } from '../store/useFretsStore';
import { ACTIONS } from '../config/frets.config';

const { SEQUENCE, NOTES, PATTERN } = ACTIONS.PATTERNS;

export const worker = new Worker(new URL('./exercise.worker.js', import.meta.url), { type: 'module' });

export const handleExerciseWorkerMessage = (event, store = useFretsStore) => {
    const { type, payload = {} } = event.data;
    const targetExercise = payload.exercise;

    switch (type) {
        case SEQUENCE:
            store.getState().setExerciseResults(targetExercise, {
                ...(payload.sequence ? { sequence: payload.sequence } : {}),
                ...(payload.notes ? { notes: payload.notes } : {}),
                ...(payload.pattern ? { pattern: payload.pattern } : {}),
            });
            break;
        case NOTES:
            if (payload.notes) store.getState().setExerciseNotes(targetExercise, payload.notes);
            break;
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
