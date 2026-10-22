import { NOTES, NOTES_NUM, NATURALS, ACCIDENTALS, START_FRET } from '../config/frets.config';
import { arrayShuffle } from './array.utils';
import { midiToFrequency } from './pitch.utils';

export const isNatural = idx => NATURALS.includes(idx);

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

const getAscendingNotes = (noteIdx, strings, start) => {
    const pattern = [];
    for (let string = strings.length; string >= 1; string--)
        pattern.push({ noteIdx, string, fret: getFretInRange(noteIdx, strings[string - 1], start), dir: 'up' });
    return pattern;
};

const getDescendingNotes = (noteIdx, strings, start) => {
    const pattern = [];
    for (let string = 1; string <= strings.length; string++)
        pattern.push({ noteIdx, string, fret: getFretInRange(noteIdx, strings[string - 1], start), dir: 'down' });
    return pattern;
};

// Build every exercise pattern from one place. Exercises 4, 5, and 6 alternate
// direction per note; the other exercises play each note ascending and descending.
export const getPattern = ({ exercise, noteIdxs = [], strings = [], start = START_FRET }) => {
    const exerciseNumber = Number(exercise);
    return noteIdxs.flatMap((noteIdx, index) => {
        if (exerciseNumber === 4 || exerciseNumber === 5 || exerciseNumber === 6) {
            return index % 2 === 0
                ? getAscendingNotes(noteIdx, strings, start)
                : getDescendingNotes(noteIdx, strings, start);
        }

        return [
            ...getAscendingNotes(noteIdx, strings, start),
            ...getDescendingNotes(noteIdx, strings, start),
        ];
    });
};

export const repeat = (repeats, ...rest) => new Array(repeats).fill(rest).flat();

// Map the displayed A-to-G# note indices to the corresponding pitch in octave 3.
// MIDI note 48 is C3; accidentals are represented by their semitone offsets.
export const getNoteSequenceMidiPitch = (noteIdx) => {
    if (!Number.isInteger(noteIdx) || noteIdx < 0 || noteIdx >= NOTES_NUM) {
        throw new RangeError('Note index must be an integer between 0 and 11.');
    }
    return 48 + ((noteIdx + 9) % NOTES_NUM);
};

export const getNoteFrequency = (halfSteps = 0) => midiToFrequency(69 + halfSteps);
