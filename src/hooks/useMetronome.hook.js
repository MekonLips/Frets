import { useRef, useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router';
import { useFretsStore, getSelectedInstrument } from '../store/useFretsStore';
import { ACTIONS, TICKS_PER_BEAT_BINARY, TICKS_PER_BEAT_TERNARY, SECONDS_IN_MINUTE, SCHEDULE_AHEAD_TIME, NOTE_LENGTH } from '../config/frets.config';
import { getMidiPitch } from '../utils/pitch.utils';
import { playPluckedNote } from '../utils/audio.utils';
const { START, STOP, UPDATE, TICK } = ACTIONS.TIMER;
const EMPTY_ARRAY = Object.freeze([]);

const worker = new Worker(new URL('../workers/timer.worker.js', import.meta.url), { type: 'module' });

const useMetronome = ({ tempo = 120, subdivision = 1, beatVolume = 0.5, subdivisionVolume = 0.25 } = {}) => {
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
    // Create AudioContext on demand: a constructor inside useRef still runs on every render.
    const audioContext = useRef(null);
    const nextNoteTime = useRef(0);
    const currentBeat = useRef(0);
    const setExerciseBeat = useFretsStore(state => state.setExerciseBeat);
    const stage = useFretsStore(state => state.exercises[String(exercise ?? '')]?.stage ?? 1);
    const pattern = useFretsStore(state => state.exercises[String(exercise ?? '')]?.pattern ?? EMPTY_ARRAY);
    const exerciseStep = useRef(0);

    const runScheduler = () => {
        const context = audioContext.current;
        if (!context || context.state === 'closed') return;
        while (nextNoteTime.current < context.currentTime + SCHEDULE_AHEAD_TIME) {
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
            osc.frequency.setValueAtTime(900, time);
            gainNode.gain.setValueAtTime(subdivisionVolume, time);
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
            gainNode.gain.setValueAtTime(beatVolume, time);
        }
        if (isFirstBeat) {
            playTick = true;
            osc.frequency.setValueAtTime(1400, time);
            gainNode.gain.setTargetAtTime(beatVolume, audioContext.current.currentTime, 0.001);
        }

        if (isFirstBeat || isQuarterBeat) {
            if (exercise && pattern.length) {
                const position = pattern[exerciseStep.current % pattern.length];
                if (position) {
                    try {
                        playPluckedNote(getMidiPitch(instrument, position.string, position.fret), {
                            context: audioContext.current,
                            time,
                            duration: 0.42,
                            volume: 0.22,
                        });
                    } catch (error) {
                        // Keep the metronome running if note playback is unavailable.
                    }
                }
                exerciseStep.current = (exerciseStep.current + 1) % pattern.length;
            }
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
        exerciseStep.current = 0;
        if (!audioContext.current) {
            const AudioContextClass = window.AudioContext || window.webkitAudioContext;
            if (AudioContextClass) audioContext.current = new AudioContextClass();
        }
        if (!audioContext.current) return;
        if (audioContext.current.state === 'suspended') audioContext.current.resume();
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

    const reset = useCallback(() => {
        worker.postMessage({ type: STOP });
        setBeat(0);
        currentBeat.current = 0;
        exerciseStep.current = 0;
        setState(prevState => ({ ...prevState, beat: 0 }));
    }, []);

    const skip = useCallback(num => {
        setBeat(num);
        exerciseStep.current = pattern.length ? num % pattern.length : 0;
        currentBeat.current = 0;
        setState(prevState => ({ ...prevState, beat: 0 }));
    }, []);

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
        worker.onerror = onerror;
        // Keep the module-level worker alive across React StrictMode's development
        // effect cleanup/re-run cycle. It is shared for the lifetime of this app.
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
        setExerciseBeat(exercise, beat);
    }, [beat]);

    return { beat, running, stop, reset, skip };
};

export default useMetronome;