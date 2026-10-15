import { ACTIONS } from '../config/frets.config';

const { START, STOP, UPDATE, TICK } = ACTIONS.TIMER;

let timer = null;

self.onmessage = async e => {
    const type = e.data.type;
    switch (type) {
        case START:
            timer = setInterval(() => self.postMessage(TICK), e.data.interval);
            break;
        case STOP:
            clearInterval(timer);
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