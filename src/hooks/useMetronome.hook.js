import { useRef, useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router';
import { useFretsStore, getSelectedInstrument } from '../store/useFretsStore';
import { ACTIONS, TICKS_PER_BEAT_BINARY, TICKS_PER_BEAT_TERNARY, SECONDS_IN_MINUTE, SCHEDULE_AHEAD_TIME } from '../config/frets.config';
import { getMidiPitch } from '../utils/pitch.utils';
import { playPluckedNote } from '../utils/audio.utils';
const { START, STOP, UPDATE, TICK } = ACTIONS.TIMER;
const EMPTY_ARRAY = Object.freeze([]);

const worker = new Worker(new URL('../workers/timer.worker.js', import.meta.url), { type: 'module' });

const useMetronome = ({ tempo = 120, subdivision = 1 } = {}) => {
    const { exercise } = useParams();
    const running = useFretsStore(state => state.timerRunning);
    const setRunning = useFretsStore(state => state.setTimerRunning);
    const selectedInstrumentId = useFretsStore(state => state.selectedInstrumentId);
    const instrument = getSelectedInstrument(selectedInstrumentId);
    const [ state, setState ] = useState({
        beat: 0,
        subBeat: 0,
        tempo,
        subdivision,
    });
    const [ beatsPerMeasure, setBeatsPerMeasure ] = useState(instrument.strings.length);
    const [ beat, setBeat ] = useState(0);
    const ticksPerBeat = beatsPerMeasure % 3 === 0 || state.subdivision % 3 === 0 ? TICKS_PER_BEAT_TERNARY : TICKS_PER_BEAT_BINARY;
    const audioContext = useRef(null);
    const nextNoteTime = useRef(0);
    const currentBeat = useRef(0);
    const setExerciseBeat = useFretsStore(state => state.setExerciseBeat);
    const pattern = useFretsStore(state => state.exercises[String(exercise ?? '')]?.pattern ?? EMPTY_ARRAY);
    const exerciseStep = useRef(0);

    const runScheduler = () => {
        const context = audioContext.current;
        if (!context || context.state === 'closed') return;
        while (nextNoteTime.current < context.currentTime + SCHEDULE_AHEAD_TIME) {
            const loopCompleted = tick(currentBeat.current, nextNoteTime.current);
            const secondsPerBeat = SECONDS_IN_MINUTE / state.tempo;
            nextNoteTime.current = nextNoteTime.current + beatsPerMeasure / ticksPerBeat * secondsPerBeat;

            // Leave one extra beat after the final exercise note so the last
            // tablature position remains visible before the next loop begins.
            if (loopCompleted)
                nextNoteTime.current += secondsPerBeat * 2;

            currentBeat.current = currentBeat.current + 1;
            if (currentBeat.current === ticksPerBeat)
                currentBeat.current = 0;
        }
    };

    const tick = (beat, time) => {
        const isFirstBeat = beat === 0;
        const isQuarterBeat = beat % (ticksPerBeat / beatsPerMeasure) === 0;

        // Exercise notes are the audible beat; do not layer the old click track over them.
        if (isFirstBeat || isQuarterBeat) {
            let loopCompleted = false;
            let scheduledExerciseIndex = null;
            if (exercise && pattern.length) {
                scheduledExerciseIndex = exerciseStep.current % pattern.length;
                const position = pattern[scheduledExerciseIndex];
                if (position) {
                    try {
                        playPluckedNote(getMidiPitch(instrument, position.string, position.fret), {
                            context: audioContext.current,
                            time,
                            duration: 0.42,
                            volume: 0.22,
                        });
                    } catch (error) {
                        // Keep the scheduler running if note playback is unavailable.
                    }
                }
                exerciseStep.current = (exerciseStep.current + 1) % pattern.length;
                loopCompleted = exerciseStep.current === 0;
            }

            // Audio is scheduled ahead; update the visible beat when that note
            // reaches the audio timeline, not when it is merely queued.
            const context = audioContext.current;
            const delay = context ? Math.max(0, (time - context.currentTime) * 1000) : 0;
            setTimeout(() => {
                setState(prevState => ({
                    ...prevState,
                    beat: prevState.beat === beatsPerMeasure ? 1 : prevState.beat + 1 || 1,
                }));
                const nextExerciseBeat = scheduledExerciseIndex === null
                    ? null
                    : scheduledExerciseIndex + 1;
                if (nextExerciseBeat !== null)
                    setExerciseBeat(exercise, nextExerciseBeat);
                setBeat(prevBeat => nextExerciseBeat === null
                    ? prevBeat + 1
                    : nextExerciseBeat);
            }, delay);
            return loopCompleted;
        }

        return false;
    };

    const start = () => {
        if (!audioContext.current) {
            const AudioContextClass = window.AudioContext || window.webkitAudioContext;
            if (AudioContextClass) audioContext.current = new AudioContextClass();
        }
        if (!audioContext.current) return;
        if (audioContext.current.state === 'suspended') audioContext.current.resume();

        // Do not restart the audio timeline at "now" if a note has already
        // been queued just ahead of it. Otherwise a resumed note can overtake
        // that queued note and the displayed string no longer matches audio.
        if (nextNoteTime.current <= audioContext.current.currentTime) {
            currentBeat.current = 0;
            nextNoteTime.current = audioContext.current.currentTime;
        }

        worker.postMessage({ type: START, interval: 25, ...state });
        setState({
            ...state,
            beat: 0,
        });
    };

    const stop = () => {
        // Keep the scheduled audio and exercise cursor intact for a clean resume.
        worker.postMessage({ type: STOP });
    };

    const reset = useCallback(() => {
        worker.postMessage({ type: STOP });
        setBeat(0);
        currentBeat.current = 0;
        exerciseStep.current = 0;
        nextNoteTime.current = audioContext.current?.currentTime ?? 0;
        setState(prevState => ({ ...prevState, beat: 0 }));
    }, []);

    const skip = useCallback(num => {
        setBeat(num);
        exerciseStep.current = num;
        currentBeat.current = 0;
        nextNoteTime.current = audioContext.current?.currentTime ?? 0;
        setState(prevState => ({ ...prevState, beat: 0 }));
    }, []);

    const onmessage = async e => {
        switch (e.data) {
            case TICK:
                runScheduler();
                break;
            default:
                console.log(`%ctype ${e.data} not recognised`, 'color: red;',);
        }
    };

    const onerror = async e => console.log('%cworker.onerror', 'color: red;', e);

    useEffect(() => {
        worker.onerror = onerror;
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
        currentBeat.current = 0;
        exerciseStep.current = 0;
        nextNoteTime.current = audioContext.current?.currentTime ?? 0;
        setBeatsPerMeasure(instrument.strings.length);
    }, [instrument.strings.length]);

    return { beat, running, stop, reset, skip };
};

export default useMetronome;
