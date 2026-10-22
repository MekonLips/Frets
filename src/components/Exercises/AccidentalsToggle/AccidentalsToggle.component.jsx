import React from 'react';
import { useParams } from 'react-router';

import { getExerciseControlConfig } from '../../../config/frets.config';
import { useFretsStore } from '../../../store/useFretsStore';

const AccidentalsToggleComponent = () => {
    const { exercise } = useParams();
    const useAccidentals = useFretsStore(state => state.useAccidentals);
    const setUseAccidentals = useFretsStore(state => state.setUseAccidentals);
    if (!exercise) return null;

    const config = getExerciseControlConfig(exercise).accidentals;
    const checked = config.enabled ? useAccidentals : config.defaultValue;
    return <div className="accidentals-toggle">
        <label className={`legacy-accidentals-toggle${config.enabled ? '' : ' is-disabled'}`}>
            <span>Use accidentals?</span>
            <input type="checkbox" checked={checked} disabled={!config.enabled}
                onChange={event => setUseAccidentals(event.target.checked)} />
        </label>
    </div>;
};

export default AccidentalsToggleComponent;