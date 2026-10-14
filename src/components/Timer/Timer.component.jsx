import React from 'react';
import { useParams } from 'react-router';

import { Timer } from './Timer.styled';
import { formatTime } from '../../utils/datetime.utils';
import useTimer from '../../hooks/useTimer.hook';

const TimerComponent = () => {
    const { exercise } = useParams();
    const isExercise = exercise ? true : false;
    const { remaining } = useTimer();
    if (isExercise)
        return <Timer>
            {formatTime(remaining)}
        </Timer>
    else
        return null;
};

export default TimerComponent;