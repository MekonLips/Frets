import { useCallback } from 'react';
import { useParams } from 'react-router';

import { useFretsStore, getSelectedInstrument } from '../store/useFretsStore';
import { ACTIONS } from '../config/frets.config';
import { postExerciseWorkerMessage, worker } from '../workers/exerciseWorkerClient';

const { SEQUENCE, NOTES, PATTERN } = ACTIONS.PATTERNS;
const EMPTY_ARRAY = Object.freeze([]);

export const useExercise = () => {
    const { exercise } = useParams();
    const isExercise = exercise ? true : false;
    const sequence = useFretsStore(state => state.exercises[String(exercise ?? '')]?.sequence ?? EMPTY_ARRAY);
    const notes = useFretsStore(state => state.exercises[String(exercise ?? '')]?.notes ?? EMPTY_ARRAY);
    const pattern = useFretsStore(state => state.exercises[String(exercise ?? '')]?.pattern ?? EMPTY_ARRAY);
    const selectedInstrumentId = useFretsStore(state => state.selectedInstrumentId);
    const instrument = getSelectedInstrument(selectedInstrumentId);
    const start = useFretsStore(state => state.startFret);
    const useAccidentals = useFretsStore(state => state.exerciseAccidentals[String(exercise ?? '')] ?? false);

    const createSequence = useCallback((accidentalsOverride, shuffle = false) => {
        const exerciseNumber = parseInt(exercise);
        const accidentals = exerciseNumber === 3
            ? true
            : (exerciseNumber === 4 || exerciseNumber === 5)
                ? (accidentalsOverride ?? useAccidentals) ? null : false
                : false;
        postExerciseWorkerMessage({
            type: SEQUENCE,
            payload: { exercise, strings: instrument.strings, start, accidentals, shuffle },
        });
    }, [exercise, instrument.strings, start, useAccidentals]);

    const createNotes = useCallback(() =>
        postExerciseWorkerMessage({
            type: NOTES,
            payload: { exercise, strings: instrument.strings, start, sequence },
        }), [exercise, instrument.strings, start, sequence]);

    const createPattern = useCallback(() =>
        postExerciseWorkerMessage({
            type: PATTERN,
            payload: { exercise, strings: instrument.strings, start, sequence },
        }), [exercise, instrument.strings, start, sequence]);

    return { worker, isExercise, exercise, sequence, notes, pattern, instrument, start, createSequence, createNotes, createPattern };
};

export default useExercise;
