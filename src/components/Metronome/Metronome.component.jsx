import React, { useEffect } from 'react';
import { useParams } from 'react-router';

import { useFretsStore, getSelectedInstrument } from '../../store/useFretsStore';
import useMetronome from '../../hooks/useMetronome.hook';

const MetronomeComponent = () => {
    const { exercise } = useParams();
    const isExercise = exercise ? true : false;
    const { beat, reset, skip } = useMetronome();
    const exerciseState = useFretsStore(state => state.exercises[String(exercise ?? '')]);
    const sequence = exerciseState?.sequence ?? [];
    const running = useFretsStore(state => state.timerRunning);
    const setRunning = useFretsStore(state => state.setTimerRunning);
    const selectedInstrumentId = useFretsStore(state => state.selectedInstrumentId);
    const instrument = getSelectedInstrument(selectedInstrumentId);
    const lastBeat = instrument.strings.length * 2 * sequence.length;
    const stage = exerciseState?.stage ?? 1;
    const setStage = useFretsStore(state => state.setExerciseStage);

    useEffect(() => {
        const length = instrument.strings.length * 2;
        const start = stage * length;
        const end = start + length;
        const newStage = (beat - 1) % length === 0;
        if (beat > start && beat < end && newStage)
            setStage(exercise, value => value < sequence.length ? value + 1 : value);
    }, [beat, instrument.strings.length, stage, sequence.length, exercise, setStage]);

    useEffect(() => {
        if (!running) skip((stage - 1) * instrument.strings.length * 2);
    }, [stage, running, instrument.strings.length, skip]);

    useEffect(() => {
        if (lastBeat > 0 && beat >= lastBeat) {
            reset();
            setRunning(false);
        }
    }, [beat, lastBeat, reset, setRunning]);

    if (isExercise) return <p>{beat}</p>;
    return null;
};

export default MetronomeComponent;