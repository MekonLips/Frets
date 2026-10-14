import React, { useEffect } from 'react';
import { useParams } from 'react-router';
import { useRecoilValue, useRecoilState } from 'recoil';

import { selectedInstrumentIdAtom, getInstrumentSelector, timerRunningAtom, exerciseSequenceAtom, exerciseStageAtom } from '../../recoil/frets.recoil';
import useMetronome from '../../hooks/useMetronome.hook';

const MetronomeComponent = () => {
    const { exercise } = useParams();
    const isExercise = exercise ? true : false;
    const { beat, reset, skip } = useMetronome();
    const sequence = useRecoilValue(exerciseSequenceAtom(exercise));
    const [ running, setRunning ] = useRecoilState(timerRunningAtom);
    const selectedInstrumentId = useRecoilValue(selectedInstrumentIdAtom);
    const instrument = useRecoilValue(getInstrumentSelector(selectedInstrumentId));
    const lastBeat = instrument.strings.length * 2 * sequence.length;
    const [ stage, setStage ] = useRecoilState(exerciseStageAtom(exercise));

    // stage change
    useEffect(() => {
        const length = instrument.strings.length * 2;
        const start = stage * length;
        const end = start + length;
        const newStage = (beat - 1) % length === 0;
        if (beat > start && beat < end && newStage)
            setStage(stage => {
                if (stage < sequence.length)
                    return stage + 1;
                return stage;
            });
    }, [beat, instrument.strings.length]);

    useEffect(() => {
        if (!running)
            skip((stage - 1) * instrument.strings.length * 2);
    }, [stage, running]);

    // end reached
    useEffect(() => {
        if (beat >= lastBeat) {
            reset();
            setRunning(false);
        }
    }, [beat, lastBeat]);

    if (isExercise)
        return <p>{beat}</p>
    else
        return null;
};

export default MetronomeComponent;