import React from 'react';
import { useParams } from 'react-router';

import { useFretsStore } from '../../../store/useFretsStore';
import useExercise from '../../../hooks/useExercise.hook';

const AccidentalsToggleComponent = () => {
    const { exercise } = useParams();
    const isExercise = Boolean(exercise);
    const exerciseNumber = Number(exercise);
    const useAccidentals = useFretsStore(state => state.useAccidentals);
    const setUseAccidentals = useFretsStore(state => state.setUseAccidentals);
    const { createSequence } = useExercise();

    if (isExercise)
        return <div className="accidentals-toggle">
            {(exerciseNumber === 4 || exerciseNumber === 5 || exerciseNumber === 6) && 
                <label className="legacy-accidentals-toggle">
                    <span>Use accidentals?</span>
                    <input
                        type="checkbox"
                        checked={useAccidentals}
                        onChange={event => {
                            const enabled = event.target.checked;
                            setUseAccidentals(enabled);
                            createSequence(enabled);
                        }}
                    />
                </label>}
        </div>
    return null;
};

export default AccidentalsToggleComponent;