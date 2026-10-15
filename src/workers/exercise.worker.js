import { NOTES_NUM, FRETS_NUM, ACTIONS } from '../config/frets.config';
import { getRandomNoteSequence, getExercisePattern, getNoteByIdx } from '../utils/note.utils';

const { SEQUENCE, NOTES, PATTERN } = ACTIONS.PATTERNS;

const createNotes = ({ sequence, strings }) => {
    const notes = [];
    sequence.map(note => {
        const arr = [];
        for (let string = 1; string <= strings.length; string++) {
            for (let fret = 1; fret <= FRETS_NUM; fret++) {
                const idx = (strings[string - 1] + fret) % NOTES_NUM;
                if (idx === note)
                    arr.push({ string, fret, note: getNoteByIdx(idx) });
            }
        }
        notes.push(arr);
    });
    return notes;
};

const createPattern = ({ exercise, sequence, strings, start }) => 
    getExercisePattern({ exercise: parseInt(exercise), noteIdxs: sequence, strings, start });

self.onmessage = async e => {
    const type = e.data.type;
    let sequence, notes, pattern;
    switch (type) {
        case SEQUENCE:
            sequence = getRandomNoteSequence(e.data.payload);
            notes = createNotes({ sequence, ...e.data.payload });
            pattern = createPattern({ sequence, ...e.data.payload });
            self.postMessage({ type, payload: { success: true, sequence, notes, pattern, ...e.data.payload } });
            break;
        case NOTES:
            notes = createNotes(e.data.payload);
            self.postMessage({ type, payload: { success: true, notes, ...e.data.payload } });
            break;
        case PATTERN:
            pattern = createPattern(e.data.payload);
            self.postMessage({ type, payload: { success: true, pattern, ...e.data.payload } });
            break;
        default:
            self.postMessage({ type, payload: { error: true, message: `type ${type} not recognised` } });
    }
};