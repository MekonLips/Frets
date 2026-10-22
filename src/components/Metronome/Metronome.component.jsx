import React, { useEffect } from 'react';
import { useParams } from 'react-router';

import { useFretsStore, getSelectedInstrument } from '../../store/useFretsStore';
import { getExerciseControlConfig } from '../../config/frets.config';
import useMetronome from '../../hooks/useMetronome.hook';

const MetronomeComponent = () => {
    const { exercise } = useParams();
    const isExercise = exercise ? true : false;
    const tempoBpm = useFretsStore(state => state.tempoBpm ?? 40);
    const { beat, reset, skip } = useMetronome({ tempo: tempoBpm });
    const exerciseState = useFretsStore(state => state.exercises[String(exercise ?? '')]);
    const sequence = exerciseState?.sequence ?? [];
    const pattern = exerciseState?.pattern ?? [];
    const running = useFretsStore(state => state.sequencePlaying);
    const setRunning = useFretsStore(state => state.setSequencePlaying);
    const selectedInstrumentId = useFretsStore(state => state.selectedInstrumentId);
    const activeInstrumentDefinition = useFretsStore(state => state.activeInstrumentDefinition);
    const instrument = getSelectedInstrument(activeInstrumentDefinition || selectedInstrumentId);
    // Exercises 4 and 5 play one pass across the strings per note; other exercises
    // retain their existing up-and-down pattern (two passes per note).
    const stringsPerNote = instrument.strings.length * ([4, 5].includes(Number(exercise)) ? 1 : 2);
    const lastBeat = pattern.length;
    const stage = exerciseState?.stage ?? 1;
    const setStage = useFretsStore(state => state.setExerciseStage);
    const loopExercises = useFretsStore(state => state.loopExercises);
    const loopActive = loopExercises[String(exercise)] ?? getExerciseControlConfig(exercise).loop.defaultValue;

    useEffect(() => {
        // The stage should switch on the first beat of the next note, not
        // on the final string of the previous note.
        const newStage = beat > 0 && (beat - 1) % stringsPerNote === 0;
        const completedStage = Math.floor((beat - 1) / stringsPerNote);
        if (running && newStage && completedStage > stage - 1 && completedStage < sequence.length)
            setStage(exercise, completedStage + 1);
    }, [beat, stringsPerNote, stage, sequence.length, exercise, setStage, running]);

    useEffect(() => {
        if (!running) skip((stage - 1) * stringsPerNote);
    }, [stage, running, stringsPerNote, skip]);

    useEffect(() => {
        if (lastBeat > 0 && beat >= lastBeat) {
            if (loopActive) {
                // The scheduler already wraps its exercise cursor. Resetting
                // it here would also reset nextNoteTime and erase the loop pause.
                setStage(exercise, 1);
            } else {
                // Exercises with a finite pattern stop after one pass.
                reset();
                setRunning(false);
            }
        }
    }, [beat, lastBeat, exercise, reset, skip, setRunning, setStage, loopActive]);

    // if (isExercise) return <p>{beat}</p>;
    return null;
};

export default MetronomeComponent;
