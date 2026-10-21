import React from 'react';
import { useParams } from 'react-router';

import { useFretsStore } from '../../../store/useFretsStore';
import { EXERCISES_NUM } from '../../../config/frets.config';

const TempoControlsComponent = () => {
    const { exercise } = useParams();
    const exerciseNumber = Number(exercise);
    const isExercise = Boolean(exercise);
    const tempoBpm = useFretsStore(state => state.tempoBpm ?? 40);
    const setTempoBpm = useFretsStore(state => state.setTempoBpm);

    if (!isExercise || exerciseNumber === EXERCISES_NUM) return null;

    return <>
        <div className="tempo-controls legacy-practice-controls">
            <label className="legacy-tempo-control">
                <input
                    aria-label="Tempo in beats per minute"
                    type="range"
                    min="40"
                    max="200"
                    step="1"
                    value={tempoBpm}
                    style={{ '--tempo-progress': ((tempoBpm - 40) / 160) * 100 + '%' }}
                    onChange={event => setTempoBpm(Number(event.target.value))}
                />
                <strong>{tempoBpm} BPM</strong>
            </label>
        </div>
    </>
};

export default TempoControlsComponent;
