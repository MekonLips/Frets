import { useState, useEffect } from 'react';
import { useRecoilState } from 'recoil';

import { timerRemainingAtom, timerRunningAtom } from '../recoil/frets.recoil';
import { TIME_LIMIT, ACTIONS } from '../config/frets.config';
const { START, STOP, TICK } = ACTIONS.TIMER;

const worker = new Worker(new URL('../workers/timer.worker.js', import.meta.url), { type: 'module' });

const useTimer = () => {
    const [ remaining, setRemaining ] = useRecoilState(timerRemainingAtom);
    const [ running, setRunning ] = useRecoilState(timerRunningAtom);
    const [ expired, setExpired ] = useState(false);

    const onmessage = async e => {
        switch (e.data) {
            case TICK:
                setRemaining(time => {
                    if (time > 0)
                        return time - 1000;
                    setExpired(true);
                    return time;
                });
                break;
            default:
                console.log(`%ctype ${e.data} not recognised`, 'color: red;');
        }
    };

    const onerror = async e => console.log('%cworker.onerror', 'color: red;', e);

    useEffect(() => {
        worker.onmessage = onmessage;
        worker.onerror = onerror;
    }, [worker]);

    useEffect(() => {
        if (running)
            worker.postMessage({ type: START, interval: 1000 });
        else
            worker.postMessage({ type: STOP });
    }, [running]);

    useEffect(() => {
        if (expired) {
            setExpired(false);
            setRemaining(TIME_LIMIT);
            setRunning(false);
        }
    }, [expired]);

    return { running, remaining, expired };
};

export default useTimer;