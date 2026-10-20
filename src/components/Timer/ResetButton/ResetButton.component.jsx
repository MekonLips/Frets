import React from 'react';
import { useParams } from 'react-router';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUndo } from '@fortawesome/free-solid-svg-icons';

import { useFretsStore } from '../../../store/useFretsStore';
import { TIME_LIMIT } from '../../../config/frets.config';

const ResetButton = ({ children }) => {
    const { exercise } = useParams();
    const isExercise = exercise ? true : false;
    const setTimerRemaining = useFretsStore(state => state.setSessionRemaining);
    const setTimerRunning = useFretsStore(state => state.setTimerRunning);
    const clickHandler = () => {
        setTimerRemaining(TIME_LIMIT);
        setTimerRunning(false);
    };
    if (isExercise)
        return <button className="control-button control-button-icon" aria-label="Reset timer" onClick={clickHandler}>{children ? children : <FontAwesomeIcon icon={faUndo} />}</button>;
    return null;
};

export default ResetButton;