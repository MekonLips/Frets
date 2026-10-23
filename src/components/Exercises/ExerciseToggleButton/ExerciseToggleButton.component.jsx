import React, { useEffect, useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlay, faPause } from '@fortawesome/free-solid-svg-icons';

import { getExerciseControlConfig } from '../../../config/frets.config';
import { useFretsStore } from '../../../store/useFretsStore';
import { scheduleCountInClicks } from '../../../utils/audio.utils';
import { resumeTimerWarningAudio } from '../../../utils/timerWarningAudio.utils';

const EMPTY_SEQUENCE = Object.freeze([]);

const ExerciseToggleButton = () => {
    const { exercise } = useParams();
    const history = useHistory();
    const sequencePlaying = useFretsStore(state => state.sequencePlaying);
    const toggleSequencePlayback = useFretsStore(state => state.toggleSequencePlayback);
    const tempoBpm = useFretsStore(state => state.tempoBpm ?? 40);
    const [countIn, setCountIn] = useState(null);

    useEffect(() => {
        if (countIn === null) return undefined;

        let cancelled = false;
        let timeout;

        const scheduleNextCount = async () => {
            // Schedule all clicks against one audio-clock timeline. Only do
            // this once, at the start of a new count-in.
            if (countIn === 4) {
                try {
                    await scheduleCountInClicks({
                        count: 4,
                        intervalSeconds: 60 / tempoBpm,
                    });
                } catch (error) {
                    // Keep the countdown usable if audio is unavailable.
                }
            }

            // The count-in may have been cancelled while audio resumed.
            if (cancelled) return;

            timeout = setTimeout(() => {
                if (countIn > 1) {
                    setCountIn(countIn - 1);
                    return;
                }

                setCountIn(null);
                toggleSequencePlayback();
            }, 60000 / tempoBpm);
        };

        scheduleNextCount();

        return () => {
            cancelled = true;
            clearTimeout(timeout);
        };
    }, [countIn, tempoBpm, toggleSequencePlayback]);

    if (!exercise) return null;

    if (!getExerciseControlConfig(exercise).showPlayback)
        return <button type="button" className="exercise-toggle-button control-button" onClick={() => history.push('/exercises/2')}>
            Continue <FontAwesomeIcon icon={faPlay} />
        </button>;

    const handlePlaybackToggle = () => {
        resumeTimerWarningAudio();

        if (countIn !== null) {
            setCountIn(null);
            return;
        }

        if (sequencePlaying) {
            toggleSequencePlayback();
            return;
        }

        setCountIn(4);
    };

    const isCountingIn = countIn !== null;

    return <button
        type="button"
        className="exercise-toggle-button control-button"
        onClick={handlePlaybackToggle}
        aria-label={isCountingIn ? 'Cancel count in' : sequencePlaying ? 'Pause note sequence' : 'Play note sequence'}
    >
        {isCountingIn ? `Playing in ${countIn}...` : sequencePlaying ? 'Pause' : 'Play'}
        {!isCountingIn && <FontAwesomeIcon icon={sequencePlaying ? faPause : faPlay} />}
    </button>;
};

export default ExerciseToggleButton;
