import React from 'react';
import { useParams } from 'react-router';

import { useFretsStore } from '../../../store/useFretsStore';
import TimerToggleButton from '../../Timer/ToggleButton/ToggleButton.component';
import ExerciseRefreshButton from '../../Exercises/RefreshButton/RefreshButton.component';
import { EXERCISES_NUM } from '../../../config/frets.config';

const ControlsComponent = () => {
    const { exercise } = useParams();
    const isExercise = exercise ? true : false;
    const timerRunning = useFretsStore(state => state.timerRunning);
    if (isExercise && parseInt(exercise) !== EXERCISES_NUM)
        return <>
            <TimerToggleButton>{!timerRunning ? 'Start timer' : 'Pause timer'}</TimerToggleButton>
            <ExerciseRefreshButton>Shuffle notes</ExerciseRefreshButton>
        </>;
    return null;
};

export default ControlsComponent;