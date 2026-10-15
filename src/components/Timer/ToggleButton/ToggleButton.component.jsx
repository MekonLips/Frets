import React from 'react';
import { useParams } from 'react-router';
import { Play, Pause } from 'lucide-react';

import { useFretsStore } from '../../../store/useFretsStore';

const ToggleButton = ({ children, show = true }) => {
    const { exercise } = useParams();
    const isExercise = exercise ? true : false;
    const timerRunning = useFretsStore(state => state.timerRunning);
    const setTimerRunning = useFretsStore(state => state.setTimerRunning);
    const clickHandler = () => setTimerRunning(!timerRunning);
    if (isExercise && show)
        return <button onClick={clickHandler}>{children ? children : timerRunning ? <Pause size={16} /> : <Play size={16} />}</button>;
    return null;
};

export default ToggleButton;
