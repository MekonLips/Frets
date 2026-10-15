import React, { useEffect } from 'react';
import { useParams } from 'react-router';

import { useFretsStore, getSelectedInstrument } from '../../store/useFretsStore';
import useMetronome from '../../hooks/useMetronome.hook';

const MetronomeComponent = () => {
    const { exercise } = useParams();
    const isExercise = exercise ? true : false;
    const tempoBpm = useFretsStore(state => state.tempoBpm ?? 40);
    const { beat, reset, skip } = useMetronome({ tempo: tempoBpm });
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
            if (Number(exercise) === 4) {
                // Exercise 4 repeats the ordered note sequence until the timer stops.
                setStage(exercise, 1);
                skip(0);
            } else {
                // Exercises with a finite pattern stop after one pass.
                reset();
                setRunning(false);
            }
        }
    }, [beat, lastBeat, exercise, reset, skip, setRunning, setStage]);

    if (isExercise) return <p>{beat}</p>;
    return null;
};

export default MetronomeComponent;