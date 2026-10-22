import React from 'react';
import { useParams } from 'react-router';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlay, faPause } from '@fortawesome/free-solid-svg-icons';

import { useFretsStore } from '../../../store/useFretsStore';
import { resumeTimerWarningAudio } from '../../../utils/timerWarningAudio.utils';

const ExerciseToggleButton = () => {
    const { exercise } = useParams();
    const sequencePlaying = useFretsStore(state => state.sequencePlaying);
    const toggleSequencePlayback = useFretsStore(state => state.toggleSequencePlayback);

    if (!exercise) return null;

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
