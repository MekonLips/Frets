import { useEffect } from 'react';

import { useFretsStore } from '../store/useFretsStore';
import { ACTIONS } from '../config/frets.config';
const { START, STOP, TICK } = ACTIONS.TIMER;

const worker = new Worker(new URL('../workers/timer.worker.js', import.meta.url), { type: 'module' });

const useTimer = () => {
    const remaining = useFretsStore(state => state.sessionRemaining);
    const setRemaining = useFretsStore(state => state.setSessionRemaining);
    const running = useFretsStore(state => state.timerRunning);
    const setRunning = useFretsStore(state => state.setTimerRunning);

    const onmessage = async e => {
        switch (e.data) {
            case TICK:
                // Continue counting below zero so overtime is visible while practice continues.
                setRemaining(time => time - 1000);
                break;
            default:
                console.log(`%ctype ${e.data} not recognised`, 'color: red;');
        }
    };

    const onerror = async e => console.log('%cworker.onerror', 'color: red;', e);

    useEffect(() => {
        worker.onmessage = onmessage;
        worker.onerror = onerror;
    }, []);

    useEffect(() => {
        if (running) worker.postMessage({ type: START, interval: 1000 });
        else worker.postMessage({ type: STOP });
    }, [running]);

    return { running, remaining };
};

export default useTimer;