import { useEffect, useRef } from 'react';

import useExercise from '../../hooks/useExercise.hook';

const ExercisesComponent = () => {
    const { exercise, sequence, instrument, start, useAccidentals, createSequence, createNotes, createPattern } = useExercise();
    const lastRequestedExercise = useRef(null);
    const instrumentKey = `${instrument.id}:${instrument.openStringMidi.join(',')}`;
    const requestKey = `${exercise}:${instrumentKey}:${useAccidentals}`;
    
    useEffect(() => {
        // React StrictMode replays effects in development. Avoid racing duplicate worker requests.
        const accidentalsAffectExercise = [4, 5, 6].includes(Number(exercise));
        if ((!sequence.length || accidentalsAffectExercise) && lastRequestedExercise.current !== requestKey) {
            lastRequestedExercise.current = requestKey;
            createSequence();
        }
    }, [exercise, instrumentKey, sequence.length, createSequence, requestKey]);

    useEffect(() => {
        if (sequence.length) {
            createNotes();
            createPattern();
        }
    }, [exercise, instrument, sequence, start]);

    return null;
};

export default ExercisesComponent;