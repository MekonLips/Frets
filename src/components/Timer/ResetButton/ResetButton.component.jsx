import React from 'react';
import { useParams } from 'react-router';
import { useSetRecoilState } from 'recoil';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUndo } from '@fortawesome/free-solid-svg-icons';

import { timerRemainingAtom, timerRunningAtom } from '../../../recoil/frets.recoil';
import { TIME_LIMIT } from '../../../config/frets.config';

const ResetButton = ({ children }) => {
    const { exercise } = useParams();
    const isExercise = exercise ? true : false;
    const setTimerRemaining = useSetRecoilState(timerRemainingAtom);
    const setTimerRunning = useSetRecoilState(timerRunningAtom);
    const clickHandler = () => {
        setTimerRemaining(TIME_LIMIT);
        setTimerRunning(false);
    };
    if (isExercise)
        return <button onClick={clickHandler}>{children ? children : <FontAwesomeIcon icon={faUndo} />}</button>
    else
        return null;
};

export default ResetButton;