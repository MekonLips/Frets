import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlay, faPause } from '@fortawesome/free-solid-svg-icons';

import { getExerciseControlConfig } from '../../../config/frets.config';
import { useFretsStore } from '../../../store/useFretsStore';
import { resumeTimerWarningAudio } from '../../../utils/timerWarningAudio.utils';

const ExerciseToggleButton = () => {
    const { exercise } = useParams();
    const sequencePlaying = useFretsStore(state => state.sequencePlaying);
    const toggleSequencePlayback = useFretsStore(state => state.toggleSequencePlayback);
    if (!exercise) return null;

    if (!getExerciseControlConfig(exercise).showPlayback)
        return <Link to="/exercises/2" className="exercise-toggle-button control-button">
            Continue <FontAwesomeIcon icon={faPlay} />
        </Link>;

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
