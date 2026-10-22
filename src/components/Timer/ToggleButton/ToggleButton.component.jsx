import React from 'react';
import { useParams } from 'react-router';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlay, faPause } from '@fortawesome/free-solid-svg-icons';

import { useFretsStore } from '../../../store/useFretsStore';
import { getTimerWarningMidiNote, playTimerToggleChime, resumeTimerWarningAudio } from '../../../utils/timerWarningAudio.utils';

const ToggleButton = ({ children, show = true }) => {
    const { exercise } = useParams();
    const isExercise = exercise ? true : false;
    const timerRunning = useFretsStore(state => state.timerRunning);
    const setTimerRunning = useFretsStore(state => state.setTimerRunning);
    const sequencePlaying = useFretsStore(state => state.sequencePlaying);
    const exerciseState = useFretsStore(state => state.exercises[String(exercise ?? '')]);
    const midiNote = getTimerWarningMidiNote(sequencePlaying, exerciseState?.sequence ?? [], exerciseState?.stage ?? 1);
    const clickHandler = () => {
        resumeTimerWarningAudio();
        playTimerToggleChime(!timerRunning, midiNote);
        setTimerRunning(!timerRunning);
    };
    if (isExercise && show)
        return <button className={`timer-toggle-button control-button ${children ? "" : "control-button-icon"}`} onClick={clickHandler}>{children ? children : <FontAwesomeIcon icon={timerRunning ? faPause : faPlay} />}</button>;
    return null;
};

export default ToggleButton;
