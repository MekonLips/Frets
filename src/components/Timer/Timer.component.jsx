import React from 'react';
import { useParams } from 'react-router';

import { formatTime } from '../../utils/datetime.utils';
import useTimer from '../../hooks/useTimer.hook';

const TimerComponent = () => {
    const { exercise } = useParams();
    const isExercise = exercise ? true : false;
    const { remaining } = useTimer();
    if (isExercise)
        return <code>
            {formatTime(remaining)}
        </code>
    else
        return null;
};

export default TimerComponent;