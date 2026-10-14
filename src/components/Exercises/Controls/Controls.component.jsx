import React from 'react';
import { useParams } from 'react-router';
import { useRecoilValue } from 'recoil';

import { timerRunningAtom } from '../../../recoil/frets.recoil';
import TimerToggleButton from '../../Timer/ToggleButton/ToggleButton.component';
import ExerciseRefreshButton from '../../Exercises/RefreshButton/RefreshButton.component';
import { EXERCISES_NUM } from '../../../config/frets.config';

const ControlsComponent = () => {
    const { exercise } = useParams();
    const isExercise = exercise ? true : false;
    const timerRunning = useRecoilValue(timerRunningAtom);
    if (isExercise && parseInt(exercise) !== EXERCISES_NUM)
        return <>
            <TimerToggleButton>{!timerRunning ? 'Start timer' : 'Pause timer'}</TimerToggleButton>
            <ExerciseRefreshButton>Shuffle notes</ExerciseRefreshButton>
        </>
    else
        return null;
};

export default ControlsComponent;