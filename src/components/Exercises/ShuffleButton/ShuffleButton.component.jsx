import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShuffle } from '@fortawesome/free-solid-svg-icons';

import { getExerciseControlConfig } from '../../../config/frets.config';
import { useFretsStore } from '../../../store/useFretsStore';
import useExercise from '../../../hooks/useExercise.hook';

const ShuffleButton = () => {
    const { exercise, isExercise, createSequence } = useExercise();
    const setStage = useFretsStore(state => state.setExerciseStage);
    const enabled = getExerciseControlConfig(exercise).shuffle;
    const clickHandler = () => {
        if (!enabled) return;
        setStage(exercise, 1);
        createSequence(undefined, true);
    };
    if (!isExercise) return null;
    return <button type="button" className={`control-button${enabled ? '' : ' is-disabled'}`} disabled={!enabled} onClick={clickHandler}>Shuffle note sequence <FontAwesomeIcon icon={faShuffle} /></button>;
};

export default ShuffleButton;