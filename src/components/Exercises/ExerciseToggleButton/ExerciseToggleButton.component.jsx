import React, { useEffect, useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlay, faPause } from '@fortawesome/free-solid-svg-icons';

import { getExerciseControlConfig } from '../../../config/frets.config';
import { useFretsStore } from '../../../store/useFretsStore';
import { getNoteSequenceMidiPitch } from '../../../utils/note.utils';
import { playPluckedNote } from '../../../utils/audio.utils';
import { resumeTimerWarningAudio } from '../../../utils/timerWarningAudio.utils';

const EMPTY_SEQUENCE = Object.freeze([]);

const ExerciseToggleButton = () => {
    const { exercise } = useParams();
    const history = useHistory();
    const sequencePlaying = useFretsStore(state => state.sequencePlaying);
    const toggleSequencePlayback = useFretsStore(state => state.toggleSequencePlayback);
    const sequence = useFretsStore(state => state.exercises[String(exercise ?? '')]?.sequence ?? EMPTY_SEQUENCE);
    const tempoBpm = useFretsStore(state => state.tempoBpm ?? 40);
    const [countIn, setCountIn] = useState(null);

    useEffect(() => {
        if (countIn === null) return undefined;

        // Use the same first sequence note for each count-in beat.
        if (sequence.length) {
            try {
                playPluckedNote(getNoteSequenceMidiPitch(sequence[0]));
            } catch (error) {
                // Keep the countdown usable if audio is unavailable.
            }
        }

        const timeout = setTimeout(() => {
            if (countIn > 1) {
                setCountIn(countIn - 1);
                return;
            }

            setCountIn(null);
            toggleSequencePlayback();
        }, 60000 / tempoBpm);

        return () => clearTimeout(timeout);
    }, [countIn, sequence, tempoBpm, toggleSequencePlayback]);

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
        {isCountingIn ? countIn : sequencePlaying ? 'Pause' : 'Play'}
        {!isCountingIn && <FontAwesomeIcon icon={sequencePlaying ? faPause : faPlay} />}
    </button>;
};

export default ExerciseToggleButton;
