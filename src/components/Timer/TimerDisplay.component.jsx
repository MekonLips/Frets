import React from 'react';
import { useParams } from 'react-router';

import { formatTime } from '../../utils/datetime.utils';
import useTimer from '../../hooks/useTimer.hook';

const TimerDisplayComponent = () => {
    const { exercise } = useParams();
    const isExercise = exercise ? true : false;
    const { remaining } = useTimer();
    if (isExercise)
        return <code className={`timer-display${remaining < 0 ? ' is-overtime' : ''}`}>
            {formatTime(remaining)}
        </code>
    else
        return null;
};

export default TimerDisplayComponent;