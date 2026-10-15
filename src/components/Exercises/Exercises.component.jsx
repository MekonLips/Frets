import { useEffect, useRef } from 'react';

import useExercise from '../../hooks/useExercise.hook';

const ExercisesComponent = () => {
    const { exercise, sequence, instrument, start, createSequence, createNotes, createPattern } = useExercise();
    const lastRequestedExercise = useRef(null);
    
    useEffect(() => {
        // React StrictMode replays effects in development. Avoid racing duplicate worker requests.
        if (!sequence.length && lastRequestedExercise.current !== exercise) {
            lastRequestedExercise.current = exercise;
            createSequence();
        }
    }, [exercise, sequence.length, createSequence]);

    useEffect(() => {
        if (sequence.length) {
            createNotes();
            createPattern();
        }
    }, [exercise, instrument, sequence, start]);

    return null;
};

export default ExercisesComponent;