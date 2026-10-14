import React from 'react';
import { useParams } from 'react-router';
import { useRecoilState } from 'recoil';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlay, faPause } from '@fortawesome/free-solid-svg-icons';

import { timerRunningAtom } from '../../../recoil/frets.recoil';

const ToggleButton = ({ children, show = true }) => {
    const { exercise } = useParams();
    const isExercise = exercise ? true : false;
    const [ timerRunning, setTimerRunning ] = useRecoilState(timerRunningAtom);
    const clickHandler = () => setTimerRunning(!timerRunning);
    if (isExercise && show)
        return <button onClick={clickHandler}>{children ? children : <FontAwesomeIcon icon={timerRunning ? faPause : faPlay} />}</button>
    else
        return null;
};

export default ToggleButton;