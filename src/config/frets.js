export const NOTES = ['A', 'Bb', 'B', 'C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#'];
export const NATURAL_NOTE_INDICES = [0, 2, 3, 5, 7, 8, 10];
export const ACCIDENTAL_NOTE_INDICES = [1, 4, 6, 9, 11];
export const FRETS = 24;
export const START_FRET = 1;
export const SESSION_MS = 5 * 60 * 1000;

export const INSTRUMENTS = [
  { id: 1, name: '6 String Guitar Standard', strings: [7, 2, 10, 5, 0, 7] },
  { id: 2, name: '6 String Guitar Eb', strings: [6, 1, 9, 4, 11, 6] },
  { id: 3, name: '6 String Guitar Open D', strings: [5, 0, 9, 5, 0, 5] },
  { id: 4, name: '4 String Bass Standard', strings: [10, 5, 0, 7] },
  { id: 5, name: '4 String Bass Eb', strings: [9, 4, 11, 6] },
];

export const EXERCISES = [
  { id: 1, title: 'Natural notes', description: 'Play each natural note up and down the strings, slowly and without mistakes.', accidentals: false },
  { id: 2, title: 'Natural notes + metronome', description: 'Play natural notes up and down in time with the metronome.', accidentals: false },
  { id: 3, title: 'Accidentals', description: 'Focus on the accidental notes (sharps and flats) across the fretboard.', accidentals: true },
  { id: 4, title: 'Mixed notes', description: 'Practise a short sequence of notes, ascending and descending.', accidentals: null },
  { id: 5, title: 'Randomised notes', description: 'Work through a shuffled sequence of notes in both directions.', accidentals: null },
  { id: 6, title: 'Review', description: 'Review the note patterns from the previous exercises.', accidentals: null },
];

export const noteName = (index) => NOTES[((index % NOTES.length) + NOTES.length) % NOTES.length];
export const noteIndexAtFret = (openNoteIndex, fret) => (openNoteIndex + fret) % NOTES.length;
export const getFretInRange = (noteIndex, openNoteIndex, start = START_FRET) => {
  const difference = (noteIndex - openNoteIndex + NOTES.length) % NOTES.length;
  const fret = difference || NOTES.length;
  return fret < start ? fret + NOTES.length : fret;
};
export const shuffle = (items) => {
  const result = [...items];
  for (let i = result.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
};
export const getSequence = (exercise) => {
  const notes = exercise === 3
    ? ACCIDENTAL_NOTE_INDICES
    : exercise === 1 || exercise === 2
      ? NATURAL_NOTE_INDICES
      : NOTES.map((_, index) => index);
  return shuffle(notes);
};
export const getPattern = (sequence, strings, start = START_FRET) => sequence.flatMap((noteIdx) => [
  ...[...strings].reverse().map((open, i) => ({ noteIdx, string: strings.length - i, fret: getFretInRange(noteIdx, open, start), direction: 'up' })),
  ...strings.map((open, i) => ({ noteIdx, string: i + 1, fret: getFretInRange(noteIdx, open, start), direction: 'down' })),
]);