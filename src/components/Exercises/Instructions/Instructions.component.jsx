import React from 'react';
import { useParams } from 'react-router';

import { useFretsStore } from '../../../store/useFretsStore';
import { EXERCISE_INSTRUCTIONS } from '../../../config/frets.config';

const InstructionsComponent = () => {
    const { exercise } = useParams();
    const isExercise = Boolean(exercise);
    const start = useFretsStore(state => state.startFret);
    const end = start + 11;
    if (isExercise)
        return <div className="legacy-instructions">
            <div>
                <h1>Exercise {exercise}</h1>
                {EXERCISE_INSTRUCTIONS[exercise - 1].map((text, idx) =>
                    <p key={`Instructions/${idx}`}>{text.replace(/Frets? \d+(?: to \d+)?/g, `Frets ${start} to ${end}`)}</p>)}
            </div>
        </div>;
    return null;
};

export default InstructionsComponent;