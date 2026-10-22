import React, { useEffect, useRef } from 'react';
import { useParams } from 'react-router';

import { useFretsStore } from '../../store/useFretsStore';
import { getTimerWarningAudioContext } from '../../utils/timerWarningAudio.utils';

export const TIMER_WARNING_DURATION_MS = 5000;
const SWELL_PEAK_GAIN = 0.009;
const CHIME_GAIN = 0.035;
const CHIME_DURATION_SECONDS = 0.75;
const C5_MIDI = 72;
const NOTE_NAMES = ['A', 'A#', 'B', 'C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#'];

export const getTimerWarningMidiNote = (sequencePlaying, sequence, stage) => {
    if (!sequencePlaying || !sequence?.length) return C5_MIDI;
    const noteIndex = sequence[stage - 1];
    return Number.isInteger(noteIndex) && noteIndex >= 0 && noteIndex < NOTE_NAMES.length
        ? 69 + noteIndex
        : C5_MIDI;
};

const TimerWarning = () => {
    const { exercise } = useParams();
    const remaining = useFretsStore(state => state.sessionRemaining);
    const running = useFretsStore(state => state.timerRunning);
    const sequencePlaying = useFretsStore(state => state.sequencePlaying);
    const exerciseState = useFretsStore(state => state.exercises[String(exercise ?? '')]);
    const sequence = exerciseState?.sequence ?? [];
    const stage = exerciseState?.stage ?? 1;
    const midiNote = getTimerWarningMidiNote(sequencePlaying, sequence, stage);

    const triggered = useRef(false);
    const previousRemaining = useRef(remaining);
    const activeSound = useRef(null);

    const stopSound = () => {
        const sound = activeSound.current;
        activeSound.current = null;
        if (!sound) return;

        const now = sound.context.currentTime;
        sound.nodes.forEach(node => {
            try {
                if (node.frequency) node.frequency.cancelScheduledValues(now);
                if (node.gain) {
                    node.gain.cancelScheduledValues(now);
                    node.gain.setTargetAtTime(0.0001, now, 0.015);
                }
                node.stop(now + 0.06);
            } catch {
                // The node may already have reached its scheduled end.
            }
        });
    };

    useEffect(() => () => stopSound(), []);

    // A reset increases the remaining time; clear the warning latch for the next run.
    useEffect(() => {
        if (remaining > previousRemaining.current) {
            stopSound();
            triggered.current = false;
        }
        previousRemaining.current = remaining;
    }, [remaining]);

    // Option 1: stopping the timer cancels the sound and never replays this warning
    // until the session timer is reset.
    useEffect(() => {
        if (!running && activeSound.current) {
            stopSound();
            triggered.current = true;
        }
    }, [running]);

    useEffect(() => {
        if (!running || triggered.current || remaining <= 0 || remaining > TIMER_WARNING_DURATION_MS) return;

        const context = getTimerWarningAudioContext();
        if (!context) {
            triggered.current = true;
            return;
        }

        triggered.current = true;
        const startAt = context.currentTime;
        const duration = Math.max(0.05, remaining / 1000);
        const frequency = 440 * (2 ** ((midiNote - 69) / 12));
        const oscillator = context.createOscillator();
        const gain = context.createGain();
        const nodes = [oscillator, gain];

        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(frequency, startAt);
        gain.gain.setValueAtTime(0.0001, startAt);
        gain.gain.exponentialRampToValueAtTime(SWELL_PEAK_GAIN, startAt + Math.max(0.05, duration - 0.1));
        gain.gain.setValueAtTime(SWELL_PEAK_GAIN, startAt + duration);
        gain.gain.exponentialRampToValueAtTime(0.0001, startAt + duration + 0.12);

        oscillator.connect(gain);
        gain.connect(context.destination);
        oscillator.start(startAt);
        oscillator.stop(startAt + duration + 0.14);

        // A gentle two-partial chime starts at expiry. Keep all nodes cancellable
        // so pausing the timer cannot leave a scheduled chime playing in the background.
        [1, 2.01].forEach((partial, index) => {
            const chime = context.createOscillator();
            const chimeGain = context.createGain();
            const chimeStart = startAt + duration;
            nodes.push(chime, chimeGain);
            chime.type = 'sine';
            chime.frequency.setValueAtTime(frequency * partial, chimeStart);
            chimeGain.gain.setValueAtTime(0.0001, chimeStart);
            chimeGain.gain.exponentialRampToValueAtTime(CHIME_GAIN / (index + 1), chimeStart + 0.012);
            chimeGain.gain.exponentialRampToValueAtTime(0.0001, chimeStart + CHIME_DURATION_SECONDS);
            chime.connect(chimeGain);
            chimeGain.connect(context.destination);
            chime.start(chimeStart);
            chime.stop(chimeStart + CHIME_DURATION_SECONDS + 0.02);
        });

        const sound = { context, oscillator, gain, nodes };
        activeSound.current = sound;
        nodes[nodes.length - 2].onended = () => {
            if (activeSound.current === sound) activeSound.current = null;
        };
    }, [running, remaining, midiNote]);

    // Pitch follows live sequence changes without restarting the swell envelope.
    useEffect(() => {
        const sound = activeSound.current;
        if (!sound) return;
        const frequency = 440 * (2 ** ((midiNote - 69) / 12));
        sound.oscillator.frequency.setTargetAtTime(frequency, sound.context.currentTime, 0.025);
        // Also retune the already-scheduled chime so it matches the current note at expiry.
        sound.nodes.filter(node => node !== sound.oscillator && node.frequency).forEach((node, index) => {
            node.frequency.setTargetAtTime(frequency * (index === 0 ? 1 : 2.01), sound.context.currentTime, 0.025);
        });
    }, [midiNote]);

    return null;
};

export default TimerWarning;
