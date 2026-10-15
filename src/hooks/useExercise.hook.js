import { useCallback, useEffect } from 'react';
import { useParams } from 'react-router';

import { useFretsStore, getSelectedInstrument } from '../store/useFretsStore';
import { ACTIONS } from '../config/frets.config';

const { SEQUENCE, NOTES, PATTERN } = ACTIONS.PATTERNS;
const EMPTY_ARRAY = Object.freeze([]);

const worker = new Worker(new URL('../workers/exercise.worker.js', import.meta.url), { type: 'module' });

export const useExercise = () => {
    const { exercise } = useParams();
    const isExercise = exercise ? true : false;
    const sequence = useFretsStore(state => state.exercises[String(exercise ?? '')]?.sequence ?? EMPTY_ARRAY);
    const notes = useFretsStore(state => state.exercises[String(exercise ?? '')]?.notes ?? EMPTY_ARRAY);
    const pattern = useFretsStore(state => state.exercises[String(exercise ?? '')]?.pattern ?? EMPTY_ARRAY);
    const setSequence = useFretsStore(state => state.setExerciseSequence);
    const setNotes = useFretsStore(state => state.setExerciseNotes);
    const setPattern = useFretsStore(state => state.setExercisePattern);
    const selectedInstrumentId = useFretsStore(state => state.selectedInstrumentId);
    const instrument = getSelectedInstrument(selectedInstrumentId);
    const start = useFretsStore(state => state.startFret);
    const useAccidentals = useFretsStore(state => state.exerciseAccidentals[String(exercise ?? '')] ?? false);

    const createSequence = useCallback((accidentalsOverride) => {
        const exerciseNumber = parseInt(exercise);
        const accidentals = exerciseNumber === 3
            ? true
            : (exerciseNumber === 4 || exerciseNumber === 5)
                ? (accidentalsOverride ?? useAccidentals) ? null : false
                : false;
        worker.postMessage({
            type: SEQUENCE,
            payload: { exercise, strings: instrument.strings, start, accidentals },
        });
    }, [exercise, instrument.strings, start, useAccidentals]);

    const createNotes = useCallback(() =>
        worker.postMessage({
            type: NOTES,
            payload: { exercise, strings: instrument.strings, start, sequence },
        }), [exercise, instrument.strings, start, sequence]);

    const createPattern = useCallback(() =>
        worker.postMessage({
            type: PATTERN,
            payload: { exercise, strings: instrument.strings, start, sequence },
        }), [exercise, instrument.strings, start, sequence]);

    useEffect(() => {
        worker.onerror = e => console.log('%cworker.onerror', 'color: red;', e);
    }, []);

    useEffect(() => {
        worker.onmessage = e => {
            const { type, payload } = e.data;
            // Worker responses can arrive after navigation; route each result to its originating exercise.
            const targetExercise = payload?.exercise ?? exercise;
            switch (type) {
                case SEQUENCE:
                    if (payload.sequence) setSequence(targetExercise, payload.sequence);
                    if (payload.notes) setNotes(targetExercise, payload.notes);
                    if (payload.pattern) setPattern(targetExercise, payload.pattern);
                    break;
                case NOTES:
                    if (payload.notes) setNotes(targetExercise, payload.notes);
                    break;
                case PATTERN:
                    if (payload.pattern) setPattern(targetExercise, payload.pattern);
                    break;
                default:
                    console.log(`%ctype ${type} not recognised`, 'color: red;');
            }
        };
    }, [exercise, setSequence, setNotes, setPattern]);

    return { worker, isExercise, exercise, sequence, notes, pattern, instrument, start, createSequence, createNotes, createPattern };
};

export default useExercise;