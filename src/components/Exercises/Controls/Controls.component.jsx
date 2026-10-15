import React from 'react';
import { useParams } from 'react-router';

import { useFretsStore } from '../../../store/useFretsStore';
import TimerToggleButton from '../../Timer/ToggleButton/ToggleButton.component';
import ExerciseRefreshButton from '../../Exercises/RefreshButton/RefreshButton.component';
import { EXERCISES_NUM } from '../../../config/frets.config';
import useExercise from '../../../hooks/useExercise.hook';

const ControlsComponent = () => {
    const { exercise } = useParams();
    const exerciseNumber = Number(exercise);
    const isExercise = Boolean(exercise);
    const timerRunning = useFretsStore(state => state.timerRunning);
    const tempoBpm = useFretsStore(state => state.tempoBpm ?? 40);
    const setTempoBpm = useFretsStore(state => state.setTempoBpm);
    const useAccidentals = useFretsStore(state => state.exerciseAccidentals[String(exercise ?? '')] ?? false);
    const setExerciseAccidentals = useFretsStore(state => state.setExerciseAccidentals);
    const { createSequence } = useExercise();

    if (isExercise && exerciseNumber === EXERCISES_NUM) return null;

    return <>
        <div className="legacy-practice-controls">
            <label>
                Tempo: <strong>{tempoBpm} BPM</strong>
                <input
                    aria-label="Tempo in beats per minute"
                    type="range"
                    min="40"
                    max="200"
                    step="1"
                    value={tempoBpm}
                    onChange={event => setTempoBpm(Number(event.target.value))}
                />
            </label>
            {(exerciseNumber === 4 || exerciseNumber === 5) && <label>
                <input
                    type="checkbox"
                    checked={useAccidentals}
                    onChange={event => {
                        const enabled = event.target.checked;
                        setExerciseAccidentals(exerciseNumber, enabled);
                        createSequence(enabled);
                    }}
                />
                Use accidentals?
            </label>}
        </div>
        {isExercise && <>
            <TimerToggleButton>{!timerRunning ? 'Start timer' : 'Pause timer'}</TimerToggleButton>
            <ExerciseRefreshButton>Shuffle notes</ExerciseRefreshButton>
        </>}
    </>;
};

export default ControlsComponent;
