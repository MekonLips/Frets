import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlay, faPause } from '@fortawesome/free-solid-svg-icons';

import { getExerciseControlConfig } from '../../../config/frets.config';
import { useFretsStore } from '../../../store/useFretsStore';
import { resumeTimerWarningAudio } from '../../../utils/timerWarningAudio.utils';

const ExerciseToggleButton = () => {
    const { exercise } = useParams();
    const navigate = useNavigate();
    const sequencePlaying = useFretsStore(state => state.sequencePlaying);
    const toggleSequencePlayback = useFretsStore(state => state.toggleSequencePlayback);
    if (!exercise) return null;

    if (!getExerciseControlConfig(exercise).showPlayback)
        return <button type="button" className="exercise-toggle-button control-button" onClick={() => navigate('/exercises/2')}>
            Continue <FontAwesomeIcon icon={faPlay} />
        </button>;

    return <button
        type="button"
        className="exercise-toggle-button control-button"
        onClick={() => {
            resumeTimerWarningAudio();
            toggleSequencePlayback();
        }}
        aria-label={sequencePlaying ? 'Pause note sequence' : 'Play note sequence'}
    >
        {sequencePlaying ? 'Pause' : 'Play'}
        <FontAwesomeIcon icon={sequencePlaying ? faPause : faPlay} />
    </button>;
};

export default ExerciseToggleButton;
