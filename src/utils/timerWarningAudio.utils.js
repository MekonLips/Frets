let audioContext;

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
