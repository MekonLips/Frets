import { midiToFrequency } from './pitch.utils.js';

let sharedAudioContext = null;

const getSharedAudioContext = () => {
  if (typeof window === 'undefined') return null;
  const AudioContextClass = window.AudioContext || window.webkitAudioContext;
  if (!AudioContextClass) return null;
  if (!sharedAudioContext || sharedAudioContext.state === 'closed') {
    sharedAudioContext = new AudioContextClass();
  }
  return sharedAudioContext;
};

/**
 * Plays a short, percussive woodblock-like click for exercise count-ins.
 */
export const playCountInClick = ({ volume = 0.2 } = {}) => {
  const audioContext = getSharedAudioContext();
  if (!audioContext || audioContext.state === 'closed') return false;
  if (audioContext.state === 'suspended') audioContext.resume();

  const startAt = audioContext.currentTime;
  const endAt = startAt + 0.11;
  const master = audioContext.createGain();
  master.gain.setValueAtTime(Math.max(0.001, volume), startAt);
  master.gain.exponentialRampToValueAtTime(0.0001, endAt);
  master.connect(audioContext.destination);

  // Slightly inharmonic, high-pitched partials give the click a wooden tone.
  [1180, 1730].forEach((frequency, index) => {
    const oscillator = audioContext.createOscillator();
    const partialGain = audioContext.createGain();
    oscillator.type = index === 0 ? 'sine' : 'triangle';
    oscillator.frequency.setValueAtTime(frequency, startAt);
    partialGain.gain.setValueAtTime(index === 0 ? 1 : 0.32, startAt);
    oscillator.connect(partialGain);
    partialGain.connect(master);
    oscillator.start(startAt);
    oscillator.stop(endAt);
    oscillator.onended = () => {
      oscillator.disconnect();
      partialGain.disconnect();
    };
  });

  master.onended = undefined;
  return true;
};

/**
 * Plays a short, plucked-string-like note using a triangle fundamental and a
 * quieter second harmonic. Pass an existing context/time to schedule notes
 * accurately alongside the metronome.
 */
export const playPluckedNote = (midiNote, {
  context = null,
  time,
  duration = 0.45,
  volume = 0.28,
} = {}) => {
  const audioContext = context ?? getSharedAudioContext();
  if (!audioContext || audioContext.state === 'closed') return false;
  if (audioContext.state === 'suspended') audioContext.resume();

  const startAt = Number.isFinite(time) ? time : audioContext.currentTime;
  const endAt = startAt + Math.max(0.08, duration);
  const frequency = midiToFrequency(midiNote);
  const master = audioContext.createGain();
  const filter = audioContext.createBiquadFilter();
  filter.type = 'lowpass';
  filter.frequency.setValueAtTime(Math.min(7000, frequency * 8), startAt);
  master.gain.setValueAtTime(0.0001, startAt);
  master.gain.linearRampToValueAtTime(Math.max(0.001, volume), startAt + 0.006);
  master.gain.exponentialRampToValueAtTime(0.0001, endAt);
  filter.connect(master);
  master.connect(audioContext.destination);

  const fundamental = audioContext.createOscillator();
  fundamental.type = 'triangle';
  fundamental.frequency.setValueAtTime(frequency, startAt);
  fundamental.connect(filter);
  fundamental.start(startAt);
  fundamental.stop(endAt + 0.01);

  const harmonic = audioContext.createOscillator();
  const harmonicGain = audioContext.createGain();
  harmonic.type = 'sine';
  harmonic.frequency.setValueAtTime(frequency * 2, startAt);
  harmonicGain.gain.setValueAtTime(0.18, startAt);
  harmonic.connect(harmonicGain);
  harmonicGain.connect(filter);
  harmonic.start(startAt);
  harmonic.stop(endAt + 0.01);

  fundamental.onended = () => {
    fundamental.disconnect();
    harmonic.disconnect();
    harmonicGain.disconnect();
    filter.disconnect();
    master.disconnect();
  };
  return true;
};
