import { getFretInRange } from '../utils/note.utils.js';
import { START_FRET } from './frets.config.js';

export const getPattern = (sequence, strings, start = START_FRET) => sequence.flatMap((noteIdx) => [
  ...[...strings].reverse().map((open, i) => ({ noteIdx, string: strings.length - i, fret: getFretInRange(noteIdx, open, start), direction: 'up' })),
  ...strings.map((open, i) => ({ noteIdx, string: i + 1, fret: getFretInRange(noteIdx, open, start), direction: 'down' })),
]);

