import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShuffle } from '@fortawesome/free-solid-svg-icons';

import { useFretsStore } from '../../../store/useFretsStore';
import useExercise from '../../../hooks/useExercise.hook';

const ShuffleButton = ({ label = false } = {}) => {
    const { exercise, isExercise, createSequence } = useExercise();
    const setStage = useFretsStore(state => state.setExerciseStage);
    const clickHandler = () => {
        setStage(exercise, 1);
        createSequence(undefined, true);
    };
    if (isExercise)
        return <button className="control-button" onClick={clickHandler}>Shuffle note sequence <FontAwesomeIcon icon={faShuffle} /></button>
    return null;
};

export default ShuffleButton;