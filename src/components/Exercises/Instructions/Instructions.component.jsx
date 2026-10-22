import React from 'react';
import { useParams } from 'react-router-dom';

import { EXERCISE_INSTRUCTIONS } from '../../../config/frets.config';

const InstructionsComponent = () => {
    const { exercise } = useParams();
    const isExercise = Boolean(exercise);

    if (isExercise)
        return <div className="legacy-instructions">
            {EXERCISE_INSTRUCTIONS[exercise - 1].map((text, idx) =>
                <p key={`Instructions/${idx}`}>{text}</p>)}
        </div>
    return null;
};

export default InstructionsComponent;