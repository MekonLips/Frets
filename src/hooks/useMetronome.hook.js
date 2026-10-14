import { useRef, useState, useEffect } from 'react';
import { useParams } from 'react-router';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';

import { exerciseSubdivisionFrequencySelector, exerciseStageAtom, exerciseSequenceAtom, exerciseBeatAtom, timerRunningAtom, selectedInstrumentIdAtom, getInstrumentSelector } from '../recoil/frets.recoil';
import { ACTIONS, TICKS_PER_BEAT_BINARY, TICKS_PER_BEAT_TERNARY, SECONDS_IN_MINUTE, SCHEDULE_AHEAD_TIME, NOTE_LENGTH } from '../config/frets.config';
import { getNoteFrequency } from '../utils/note.utils';
import Worker from '../workers/timer.worker';

const { START, STOP, UPDATE, TICK } = ACTIONS.TIMER;

const worker = new Worker();

const useMetronome = ({ tempo = 120, subdivision = 1, beatVolume = 0.5, subdivisionVolume = 0.25 } = {}) => {
    const { exercise } = useParams();
    const [ running, setRunning ] = useRecoilState(timerRunningAtom);
    const selectedInstrumentId = useRecoilValue(selectedInstrumentIdAtom);
    const instrument = useRecoilValue(getInstrumentSelector(selectedInstrumentId));
    const [ state, setState ] = useState({
        beat: 0,
        subBeat: 0,
        tempo,
        subdivision,
    });
    const [ beatsPerMeasure, setBeatsPerMeasure ] = useState(instrument.strings.length);
    const [ beat, setBeat ] = useState(0);
    const ticksPerBeat = beatsPerMeasure % 3 === 0 || state.subdivision % 3 === 0 ? TICKS_PER_BEAT_TERNARY : TICKS_PER_BEAT_BINARY;
    const audioContext = useRef(new (window.AudioContext || window.webkitAudioContext)());
    const nextNoteTime = useRef(0);
    const currentBeat = useRef(0);
    const setExerciseBeat = useSetRecoilState(exerciseBeatAtom(exercise));
    const stage = useRecoilValue(exerciseStageAtom(exercise));
    const sequence = useRecoilValue(exerciseSequenceAtom(exercise));
    // const subdivisionFrequency = useRecoilValue(exerciseSubdivisionFrequencySelector(exercise));
    // const beatFrequency = subdivisionFrequency * 2;
    const subdivisionFrequency = useRef(getNoteFrequency(sequence[stage - 1]));
    const beatFrequency = useRef(subdivisionFrequency.current * 2);

    const runScheduler = () => {
        while (nextNoteTime.current < audioContext.current.currentTime + SCHEDULE_AHEAD_TIME) {
            tick(currentBeat.current, nextNoteTime.current);
            const secondsPerBeat = SECONDS_IN_MINUTE / state.tempo;
            nextNoteTime.current = nextNoteTime.current + beatsPerMeasure / ticksPerBeat * secondsPerBeat;
            currentBeat.current = currentBeat.current + 1;
            if (currentBeat.current === ticksPerBeat)
                currentBeat.current = 0;
        }
    };

    const tick = (beat, time) => {
        const isFirstBeat = beat === 0;
        const isQuarterBeat = beat % (ticksPerBeat / beatsPerMeasure) === 0;
        const isTripletBeat = ticksPerBeat === TICKS_PER_BEAT_TERNARY && beat % (ticksPerBeat / beatsPerMeasure) !== 0;
        const isEighthBeat = beat % (ticksPerBeat / (beatsPerMeasure * 2)) === 0;
        
        let playTick = false;

        const osc = audioContext.current.createOscillator();
        const gainNode = audioContext.current.createGain();
        osc.connect(gainNode);
        gainNode.connect(audioContext.current.destination);

        if (state.subdivision === 4) {
            playTick = true;
            osc.frequency.setTargetAtTime(subdivisionFrequency.current, audioContext.current.currentTime, 0.001);
            gainNode.gain.setTargetAtTime(subdivisionVolume, audioContext.current.currentTime, 0.001);
        }
        if (state.subdivision === 3 && isTripletBeat) {
            playTick = true;
            osc.frequency.setTargetAtTime(subdivisionFrequency.current, audioContext.current.currentTime, 0.001);
            gainNode.gain.setTargetAtTime(subdivisionVolume, audioContext.current.currentTime, 0.001);
        }
        if (state.subdivision === 2 && isEighthBeat) {
            playTick = true;
            osc.frequency.setTargetAtTime(subdivisionFrequency.current, audioContext.current.currentTime, 0.001);
            gainNode.gain.setTargetAtTime(subdivisionVolume, audioContext.current.currentTime, 0.001);
        }
      
        if (isQuarterBeat) {
            playTick = true;
            osc.frequency.setTargetAtTime(subdivisionFrequency.current, audioContext.current.currentTime, 0.001);
            gainNode.gain.setTargetAtTime(beatVolume, audioContext.current.currentTime, 0.001);
        }
        if (isFirstBeat) {
            playTick = true;
            osc.frequency.setTargetAtTime(beatFrequency.current, audioContext.current.currentTime, 0.0001);
            gainNode.gain.setTargetAtTime(beatVolume, audioContext.current.currentTime, 0.001);
        }

        if (isFirstBeat || isQuarterBeat) {
            setState(prevState => ({
                ...state,
                beat: prevState.beat === beatsPerMeasure ? 1 : prevState.beat + 1 || 1,
            }));
        }
        if (playTick) {
            osc.start(time);
            osc.stop(time + NOTE_LENGTH);
            setState(prevState => ({
                ...state,
                subBeat: prevState.subBeat === state.subdivision ? 1 : prevState.subBeat + 1 || 1,
            }));
            setBeat(beat => beat + 1);
        }
    };

    const start = () => {
        setBeat(beat => Math.floor(beat / beatsPerMeasure) * beatsPerMeasure);
        currentBeat.current = 0;
        nextNoteTime.current = audioContext.current.currentTime;
        worker.postMessage({ type: START, interval: 25, ...state });
        setState({
            ...state,
            beat: 0,
        });
    };

    const stop = () => {
        worker.postMessage({ type: STOP });
        setBeat(beat => Math.floor(beat / beatsPerMeasure) * beatsPerMeasure);
    };

    const reset = () => {
        worker.postMessage({ type: STOP });
        setBeat(0);
        currentBeat.current = 0;
        setState({
            ...state,
            beat: 0,
        });
    };

    const skip = num => {
        setBeat(num);
        currentBeat.current = 0;
        setState({
            ...state,
            beat: 0,
        });
    };

    const onmessage = async e => {
        switch (e.data) {
            case TICK:
                runScheduler();
                break;
            default:
                console.log(`%ctype ${e.data} not recognised`, 'color: red;');
        }
    };

    const onerror = async e => console.log('%cworker.onerror', 'color: red;', e);

    useEffect(() => {

        // only works on first run as change doesn't get processed
        // on subsequent runs due to beat === 0
        // shuffling does reset properly - check what shuffle does and duplicate

        // need to make notes unclikcable while timer is running

        // tab is upside down e.g. c shows 8 > 1 > 5 > 10 > 3 > 8 but should show reverse
        // right hand tab is correct, left hand tab is incorrect

        if (beat && beat % (instrument.strings.length * 2) === 0) {
            subdivisionFrequency.current = getNoteFrequency(sequence[stage + 1]);
            beatFrequency.current = subdivisionFrequency.current * 2;
        }
    }, [beat, stage, sequence, instrument.strings.length]);

    useEffect(() => {
        worker.onerror = onerror;
        return () => worker.terminate();
    }, [worker]);

    useEffect(() => {
        worker.onmessage = onmessage;
    }, [runScheduler]);

    useEffect(() => {
        if (running)
            start();
        else
            stop();
    }, [running]);

    useEffect(() => {
        worker.postMessage({ type: UPDATE, interval: 25 });
        setState(state => ({
            ...state,
            tempo,
        }));
    }, [tempo]);

    useEffect(() => {
        stop();
        setRunning(false);
        setBeat(beat => 0);
        setBeatsPerMeasure(instrument.strings.length);
    }, [instrument.strings.length]);

    useEffect(() => {
        setExerciseBeat(beat);
    }, [beat]);

    return { beat, running, stop, reset, skip };
};

export default useMetronome;