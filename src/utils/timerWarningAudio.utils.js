let audioContext;

const C5_MIDI = 72;
const NOTE_NAMES = ['A', 'A#', 'B', 'C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#'];

export const getTimerWarningMidiNote = (sequencePlaying, sequence, stage) => {
    if (!sequencePlaying || !sequence?.length) return C5_MIDI;
    const noteIndex = sequence[stage - 1];
    return Number.isInteger(noteIndex) && noteIndex >= 0 && noteIndex < NOTE_NAMES.length
        ? 69 + noteIndex
        : C5_MIDI;
};

export const getTimerWarningAudioContext = () => {
    if (audioContext) return audioContext;

    const AudioContextConstructor = globalThis.AudioContext ?? globalThis.webkitAudioContext;
    if (!AudioContextConstructor) return null;

    audioContext = new AudioContextConstructor();
    return audioContext;
};

// Call directly from a user interaction so browsers can unlock audio playback.
export const resumeTimerWarningAudio = () => {
    const context = getTimerWarningAudioContext();
    if (context?.state === 'suspended') {
        context.resume().catch(() => {
            // Audio will be attempted again on the next user interaction.
        });
    }
};

export const getTimerToggleFrequencies = (isStarting, midiNote = C5_MIDI) => {
    const baseFrequency = 440 * (2 ** ((midiNote - 69) / 12));
    return isStarting
        ? { startFrequency: baseFrequency, endFrequency: baseFrequency * 2 }
        : { startFrequency: baseFrequency * 2, endFrequency: baseFrequency };
};

// Play a short, bell-like octave glide when the session timer starts or pauses.
export const playTimerToggleChime = (isStarting, midiNote = C5_MIDI) => {
    const context = getTimerWarningAudioContext();
    if (!context) return;

    if (context.state === 'suspended') {
        context.resume().catch(() => {
            // Audio will be attempted again on the next user interaction.
        });
    }

    const { startFrequency, endFrequency } = getTimerToggleFrequencies(isStarting, midiNote);
    const startAt = context.currentTime;
    const glideDuration = 0.18;
    const oscillator = context.createOscillator();
    const gain = context.createGain();

    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(startFrequency, startAt);
    oscillator.frequency.exponentialRampToValueAtTime(endFrequency, startAt + glideDuration);
    gain.gain.setValueAtTime(0.0001, startAt);
    gain.gain.exponentialRampToValueAtTime(0.022, startAt + 0.012);
    gain.gain.exponentialRampToValueAtTime(0.0001, startAt + 0.32);

    oscillator.connect(gain);
    gain.connect(context.destination);
    oscillator.start(startAt);
    oscillator.stop(startAt + 0.34);
};
