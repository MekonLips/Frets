import React from 'react';
import { useParams } from 'react-router';

import { EXERCISE_INSTRUCTIONS } from '../../../config/frets.config';
import { useFretsStore } from '../../../store/useFretsStore';
import useExercise from '../../../hooks/useExercise.hook';

const InstructionsComponent = () => {
    const { exercise } = useParams();
    const isExercise = Boolean(exercise);
    const exerciseNumber = Number(exercise);
    const useAccidentals = useFretsStore(state => state.exerciseAccidentals[String(exercise ?? '')] ?? false);
    const setExerciseAccidentals = useFretsStore(state => state.setExerciseAccidentals);
    const { createSequence } = useExercise();

    if (isExercise)
        return <div className="legacy-instructions">
            <div>
                <h1>Exercise {exercise}</h1>
                {(exerciseNumber === 4 || exerciseNumber === 5) && <label className="legacy-accidentals-toggle">
                    <span>Use accidentals?</span>
                    <input
                        type="checkbox"
                        checked={useAccidentals}
                        onChange={event => {
                            const enabled = event.target.checked;
                            setExerciseAccidentals(exerciseNumber, enabled);
                            createSequence(enabled);
                        }}
                    />
                </label>}
                {EXERCISE_INSTRUCTIONS[exercise - 1].map((text, idx) =>
                    <p key={`Instructions/${idx}`}>{text}</p>)}
            </div>
        </div>;
    return null;
};

export default InstructionsComponent;