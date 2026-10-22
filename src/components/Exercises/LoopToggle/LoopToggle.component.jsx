import React from 'react';
import { useParams } from 'react-router';

import { getExerciseControlConfig } from '../../../config/frets.config';
import { useFretsStore } from '../../../store/useFretsStore';

const LoopToggleComponent = () => {
    const { exercise } = useParams();
    const loopExercises = useFretsStore(state => state.loopExercises);
    const setLoopExercise = useFretsStore(state => state.setLoopExercise);
    if (!exercise) return null;

    const config = getExerciseControlConfig(exercise).loop;
    const checked = loopExercises[String(exercise)] ?? config.defaultValue;
    return <div className="loop-toggle">
        <label className={`legacy-loop-toggle${config.enabled ? '' : ' is-disabled'}`}>
            <span>Loop exercise?</span>
            <input type="checkbox" checked={checked} disabled={!config.enabled}
                onChange={event => setLoopExercise(exercise, event.target.checked)} />
        </label>
    </div>;
};

export default LoopToggleComponent;
