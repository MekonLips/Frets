import { NOTES, NATURALS, ACCIDENTALS, START_FRET } from './frets.config.js';

export const noteName = (index) => NOTES[((index % NOTES.length) + NOTES.length) % NOTES.length];

export const noteIndexAtFret = (openNoteIndex, fret) => (openNoteIndex + fret) % NOTES.length;

export const getFretInRange = (noteIndex, openNoteIndex, start = START_FRET) => {
  const difference = (noteIndex - openNoteIndex + NOTES.length) % NOTES.length;
  const fret = difference || NOTES.length;
  return fret < start ? fret + NOTES.length : fret;
};

export const shuffle = (items) => {
  const result = [...items];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
};

export const getSequence = (exercise, useAccidentals = false) => {
  const notes = exercise === 3
    ? ACCIDENTALS
    : exercise === 1 || exercise === 2 || ((exercise === 4 || exercise === 5) && !useAccidentals)
      ? NATURALS
      : NOTES.map((_, index) => index);
  return shuffle(notes);
};

export const getPattern = (sequence, strings, start = START_FRET) => sequence.flatMap((noteIdx) => [
  ...[...strings].reverse().map((open, i) => ({ noteIdx, string: strings.length - i, fret: getFretInRange(noteIdx, open, start), direction: 'up' })),
  ...strings.map((open, i) => ({ noteIdx, string: i + 1, fret: getFretInRange(noteIdx, open, start), direction: 'down' })),
]);

export const getNoteFrequency = (index) => 440 * Math.pow(2, index / 12);
