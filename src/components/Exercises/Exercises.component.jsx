import { useEffect } from 'react';

import useExercise from '../../hooks/useExercise.hook';

const ExercisesComponent = () => {
    const { exercise, sequence, instrument, start, createSequence, createNotes, createPattern } = useExercise();
    
    useEffect(() => {
        if (!sequence.length)
            createSequence();
    }, [exercise]);

    useEffect(() => {
        if (sequence.length) {
            createNotes();
            createPattern();
        }
    }, [exercise, instrument.strings.length, start]);

    return null;
};

export default ExercisesComponent;