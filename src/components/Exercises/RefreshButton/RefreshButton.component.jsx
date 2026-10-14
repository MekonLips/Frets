import React from 'react';
import { useSetRecoilState } from 'recoil';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUndo } from '@fortawesome/free-solid-svg-icons';

import { exerciseStageAtom } from '../../../recoil/frets.recoil';
import { EXERCISES_NUM } from '../../../config/frets.config';
import useExercise from '../../../hooks/useExercise.hook';

const RefreshButton = ({ children }) => {
    const { exercise, isExercise, createSequence } = useExercise();
    const setStage = useSetRecoilState(exerciseStageAtom(exercise));
    const clickHandler = () => {
        setStage(1);
        createSequence();
    };
    if (isExercise && parseInt(exercise) !== EXERCISES_NUM)
        return <button onClick={clickHandler}>{children ? children : <FontAwesomeIcon icon={faUndo} />}</button>
    else
        return null;
};

export default RefreshButton;