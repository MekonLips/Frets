import { NOTES, NOTES_NUM, NATURALS, ACCIDENTALS, START_FRET } from '../config/frets.config';
import { arrayShuffle } from './array.utils';

export const isNatural = idx => NATURALS.find(_ => _ === idx) ? true : false;

export const isAccidental = idx => ACCIDENTALS.find(_ => _ === idx) ? true : false;

export const getNoteByIdx = idx => NOTES[idx];

export const getNoteIdxs = () => NOTES.map((note, idx) => idx);

export const noteName = (index) => NOTES[((index % NOTES_NUM) + NOTES_NUM) % NOTES_NUM];

export const noteIndexAtFret = (openNoteIndex, fret) => (openNoteIndex + fret) % NOTES_NUM;

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
const ACCIDENTAL_NOTE_ORDER = [4, 6, 9, 11, 1];
const CHROMATIC_NOTE_ORDER = [3, 4, 5, 6, 7, 8, 9, 10, 11, 0, 1, 2];

export const getRandomNoteSequence = ({ exercise, accidentals = null, length = null, shuffle = false } = {}) => {
    const exerciseNumber = Number(exercise);
    const sequence = [];

    if (exerciseNumber === 3 || accidentals === true) {
        // Exercise 3 uses accidentals only; other accidental-enabled exercises
        // use the full chromatic sequence.
        sequence.push(...(exerciseNumber === 3 ? ACCIDENTAL_NOTE_ORDER : CHROMATIC_NOTE_ORDER));
    } else if (accidentals === false) {
        sequence.push(...NATURAL_NOTE_ORDER);
    } else {
        sequence.push(...CHROMATIC_NOTE_ORDER);
    }

    // Exercise 5 is the only exercise that starts randomized. Other exercises
    // follow the musical order unless the user explicitly presses Shuffle.
    if (exerciseNumber === 5 || shuffle)
        arrayShuffle(sequence);

    if (length)
        sequence.splice(0, sequence.length - length);
    return sequence;
};

export const getFretInRange = (noteIndex, openNoteIndex, start = START_FRET) => {
    const difference = (noteIndex - openNoteIndex + NOTES_NUM) % NOTES_NUM;
    const fret = difference || NOTES_NUM;
    return fret < start ? fret + NOTES_NUM : fret;
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