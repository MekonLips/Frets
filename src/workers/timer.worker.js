import { ACTIONS } from '../config/frets.config';

const { START, STOP, UPDATE, TICK } = ACTIONS.TIMER;

let timer = null;

self.onmessage = async e => {
    const type = e.data.type;
    switch (type) {
        case START:
            // START may be posted more than once during React StrictMode effect replay.
            // Keep the worker idempotent so duplicate starts never accelerate the timer.
            if (timer) clearInterval(timer);
            timer = setInterval(() => self.postMessage(TICK), e.data.interval);
            break;
        case STOP:
            if (timer) clearInterval(timer);
            timer = null;
            break;
        case UPDATE:
            if (timer) {
                clearInterval(timer);
                timer = setInterval(() => self.postMessage(TICK), e.data.interval);
            }
            break;
        default:
            self.postMessage({ error: true, message: `type ${type} not recognised` });
    }
};