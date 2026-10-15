import { NOTES, NOTES_NUM, NATURALS, ACCIDENTALS } from '../config/frets.config';
import { arrayShuffle } from './array.utils';

export const isNatural = idx => NATURALS.find(_ => _ === idx) ? true : false;

export const isAccidental = idx => ACCIDENTALS.find(_ => _ === idx) ? true : false;

export const getNoteByIdx = idx => NOTES[idx];

export const getNoteIdxs = () => NOTES.map((note, idx) => idx);

export const getNaturalIdxs = () => getNoteIdxs().reduce((arr, note, idx) => {
    if (!isAccidental(idx))
        arr.push(note);
    return arr;
}, []);

export const getAccidentalIdxs = () => getNoteIdxs().reduce((arr, note, idx) => {
    if (isAccidental(idx))
        arr.push(note);
    return arr;
}, []);

export const getNotesFromIdxs = arr => arr.map(idx => getNoteByIdx(idx));

const NATURAL_NOTE_ORDER = [3, 5, 7, 8, 10, 0, 2];
const CHROMATIC_NOTE_ORDER = [3, 4, 5, 6, 7, 8, 9, 10, 11, 0, 1, 2];

export const getRandomNoteSequence = ({ exercise, accidentals = null, length = null, shuffle = false } = {}) => {
    const sequence = [];
    if (exercise === '4' || exercise === 4) {
        sequence.push(...(accidentals === false ? NATURAL_NOTE_ORDER : CHROMATIC_NOTE_ORDER));
        if (shuffle) arrayShuffle(sequence);
    } else {
        if (accidentals === false)
            sequence.push(...getNaturalIdxs());
        else if (accidentals === true)
            sequence.push(...getAccidentalIdxs());
        else
            sequence.push(...getNoteIdxs());
        arrayShuffle(sequence);
    }
    if (length)
        sequence.splice(0, sequence.length - length);
    return sequence;
};

export const getFretInRange = (noteIdx, stringNoteIdx, start = 1) => {
    return noteIdx <= stringNoteIdx ? 
        NOTES_NUM - stringNoteIdx + noteIdx + (NOTES_NUM - stringNoteIdx + noteIdx < start ? NOTES_NUM : 0) : 
        noteIdx - stringNoteIdx + (noteIdx - stringNoteIdx < start ? NOTES_NUM : 0);
};

export const getAscendingNotes = (noteIdx, strings, start = 1) => {
    const pattern = [];
    for (let string = strings.length; string >= 1; string--)
        pattern.push({ noteIdx, string, fret: getFretInRange(noteIdx, strings[string - 1], start), dir: 'up' });
    return pattern;
};

export const getDescendingNotes = (noteIdx, strings, start = 1) => {
    const pattern = [];
    for (let string = 1; string <= strings.length; string++)
        pattern.push({ noteIdx, string, fret: getFretInRange(noteIdx, strings[string - 1], start), dir: 'down' });
    return pattern;
};

export const repeat = (repeats, ...rest) => new Array(repeats).fill(rest).flat();

export const getExercisePattern = ({ exercise, noteIdxs, strings, start = 1 }) => {
    const pattern = [];
    switch (exercise) {
        case 1:
            // play each note up and down 3x
            // repeat 2x
            // const upSeq = getAscendingNotes(noteIdxs[0], strings, start);
            // const downSeq = getDescendingNotes(noteIdxs[0], strings, start);
            // pattern.push(...repeat(2, ...repeat(3, ...upSeq, ...downSeq)));
            pattern.push(...noteIdxs.reduce((arr, noteIdx) => {
                arr.push(
                    ...getAscendingNotes(noteIdx, strings, start), 
                    ...getDescendingNotes(noteIdx, strings, start)
                );
                return arr;
            }, []));
            break;
        case 2:
        case 3:
            // play note up and down
            pattern.push(...noteIdxs.reduce((arr, noteIdx) => {
                arr.push(
                    ...getAscendingNotes(noteIdx, strings, start), 
                    ...getDescendingNotes(noteIdx, strings, start)
                );
                return arr;
            }, []));
            break;
        case 4:
        case 5:
            // Alternate direction by note: first note ascends, second descends.
            pattern.push(...noteIdxs.reduce((arr, noteIdx, idx) => {
                arr.push(...(idx % 2 === 0
                    ? getAscendingNotes(noteIdx, strings, start)
                    : getDescendingNotes(noteIdx, strings, start)));
                return arr;
            }, []));
            break;
        case 6:
            // Exercise 6 retains the previous up-and-down pattern.
            pattern.push(...noteIdxs.reduce((arr, noteIdx) => {
                arr.push(
                    ...getAscendingNotes(noteIdx, strings, start),
                    ...getDescendingNotes(noteIdx, strings, start)
                );
                return arr;
            }, []));
            break;
        default:
            break;
    }
    return pattern;
};

const BASE_FREQ = 440;

const TWELTH_ROOT_OF_TWO = Math.pow(2, 1/12);

export const getNoteFrequency = idx => {
    const halfSteps = idx ? idx : 0; // number of half steps from A4 to target note;
    return BASE_FREQ * Math.pow(TWELTH_ROOT_OF_TWO, halfSteps);
};