import { arrayShuffle } from '../utils/array.utils.js';
import { NOTES, NOTES_NUM, NATURALS, ACCIDENTALS, START_FRET } from './frets.config.js';

export const getFretInRange = (noteIndex, openNoteIndex, start = START_FRET) => {
  const difference = (noteIndex - openNoteIndex + NOTES_NUM) % NOTES_NUM;
  const fret = difference || NOTES_NUM;
  return fret < start ? fret + NOTES_NUM : fret;
};

export const getSequence = (exercise, useAccidentals = false) => {
  const notes = exercise === 3
    ? ACCIDENTALS
    : exercise === 1 || exercise === 2 || ((exercise === 4 || exercise === 5) && !useAccidentals)
      ? NATURALS
      : NOTES.map((_, index) => index);
  return arrayShuffle([...notes]);
};

export const getPattern = (sequence, strings, start = START_FRET) => sequence.flatMap((noteIdx) => [
  ...[...strings].reverse().map((open, i) => ({ noteIdx, string: strings.length - i, fret: getFretInRange(noteIdx, open, start), direction: 'up' })),
  ...strings.map((open, i) => ({ noteIdx, string: i + 1, fret: getFretInRange(noteIdx, open, start), direction: 'down' })),
]);

export const getNoteFrequency = (index) => 440 * Math.pow(2, index / 12);
