import { ACTIONS } from '../config/frets.config';

const { START, STOP, UPDATE, TICK } = ACTIONS.TIMER;

let timer = null;

onmessage = async e => {
    const type = e.data.type;
    switch (type) {
        case START:
            timer = setInterval(() => postMessage(TICK), e.data.interval);
            break;
        case STOP:
            clearInterval(timer);
            timer = null;
            break;
        case UPDATE:
            if (timer) {
                clearInterval(timer);
                timer = setInterval(() => postMessage(TICK), e.data.interval);
            }
            break;
        default:
            postMessage({ error: true, message: `type ${type} not recognised` });
    }
};