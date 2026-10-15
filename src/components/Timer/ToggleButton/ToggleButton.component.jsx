import React from 'react';
import { useParams } from 'react-router';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlay, faPause } from '@fortawesome/free-solid-svg-icons';

import { useFretsStore } from '../../../store/useFretsStore';

const ToggleButton = ({ children, show = true }) => {
    const { exercise } = useParams();
    const isExercise = exercise ? true : false;
    const timerRunning = useFretsStore(state => state.timerRunning);
    const setTimerRunning = useFretsStore(state => state.setTimerRunning);
    const clickHandler = () => setTimerRunning(!timerRunning);
    if (isExercise && show)
        return <button onClick={clickHandler}>{children ? children : <FontAwesomeIcon icon={timerRunning ? faPause : faPlay} />}</button>;
    return null;
};

export default ToggleButton;
