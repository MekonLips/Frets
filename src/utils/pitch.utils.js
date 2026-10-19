import { INSTRUMENTS } from '../config/frets.config.js';

export const getOpenStringMidi = (instrument, stringNumber) => {
  const openStringMidi = instrument?.openStringMidi
    ?? INSTRUMENTS.find(({ id }) => id === instrument?.id)?.openStringMidi;
  if (!openStringMidi || !Number.isInteger(stringNumber) || stringNumber < 1 || stringNumber > openStringMidi.length) {
    throw new RangeError('String number is outside the selected instrument tuning.');
  }
  return openStringMidi[stringNumber - 1];
};

export const getMidiPitch = (instrument, stringNumber, fret = 0) => {
  if (!Number.isInteger(fret) || fret < 0 || fret > 24) {
    throw new RangeError('Fret must be an integer between 0 and 24.');
  }
  return getOpenStringMidi(instrument, stringNumber) + fret;
};

export const midiToFrequency = (midiNote) => {
  if (!Number.isFinite(midiNote)) {
    throw new TypeError('MIDI note must be a finite number.');
  }
  return 440 * (2 ** ((midiNote - 69) / 12));
};
