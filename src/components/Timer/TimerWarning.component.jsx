import React, { useEffect, useRef } from 'react';
import { useParams } from 'react-router';

import { NOTES } from '../../config/frets.config';
import { useFretsStore } from '../../store/useFretsStore';
import { getTimerWarningAudioContext } from '../../utils/timerWarningAudio.utils';

const WARNING_DURATION_MS = 5000;
const SWELL_PEAK_GAIN = 0.035;
const CHIME_GAIN = 0.035;
const CHIME_DURATION_SECONDS = 0.75;
const NOTE_MIDI_BASE = 69; // NOTES[0] is A; C is therefore MIDI 72 (C5).

const TimerWarning = () => {
    const { exercise } = useParams();
    const remaining = useFretsStore(state => state.sessionRemaining);
    const running = useFretsStore(state => state.timerRunning);
    const sequencePlaying = useFretsStore(state => state.sequencePlaying);
    const exerciseState = useFretsStore(state => state.exercises[String(exercise ?? '')]);
    const sequence = exerciseState?.sequence ?? [];
    const stage = exerciseState?.stage ?? 1;
    const noteIndex = sequencePlaying && sequence.length
        ? sequence[stage - 1]
        : 3; // C when no sequence is playing.
    const midiNote = NOTE_MIDI_BASE + (Number.isInteger(noteIndex) ? noteIndex : 3);

    const triggered = useRef(false);
    const previousRemaining = useRef(remaining);
    const activeSound = useRef(null);

    const stopSound = () => {
        const sound = activeSound.current;
        activeSound.current = null;
        if (!sound) return;

        try {
            const now = sound.context.currentTime;
            sound.gain.gain.cancelScheduledValues(now);
            sound.gain.gain.setTargetAtTime(0, now, 0.025);
            sound.oscillator.stop(now + 0.12);
        } catch {
            // The sound may already have reached its scheduled end.
        }
    };

    useEffect(() => () => stopSound(), []);

    // A timer reset increases the remaining time. Clear the warning latch so it
    // can trigger normally during the next session.
    useEffect(() => {
        if (remaining > previousRemaining.current) {
            stopSound();
            triggered.current = false;
        }
        previousRemaining.current = remaining;
    }, [remaining]);

    // Once the warning has started, pausing cancels it and latches it as spent.
    // Resuming therefore does not replay either the swell or its expiry chime.
    useEffect(() => {
        if (!running && activeSound.current) {
            stopSound();
            triggered.current = true;
        }
    }, [running]);

    useEffect(() => {
        if (!running || triggered.current || remaining <= 0 || remaining > WARNING_DURATION_MS) return;

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

        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(frequency, startAt);
        gain.gain.setValueAtTime(0.0001, startAt);
        gain.gain.exponentialRampToValueAtTime(SWELL_PEAK_GAIN, startAt + duration * 0.82);
        gain.gain.setValueAtTime(SWELL_PEAK_GAIN, startAt + duration * 0.82);
        gain.gain.exponentialRampToValueAtTime(0.0001, startAt + duration);

        oscillator.connect(gain);
        gain.connect(context.destination);
        oscillator.start(startAt);
        oscillator.stop(startAt + duration + 0.02);

        // A quiet two-partial chime, scheduled to land at the timer's expiry.
        [1, 2.01].forEach((partial, index) => {
            const chime = context.createOscillator();
            const chimeGain = context.createGain();
            const chimeStart = startAt + duration;
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

        activeSound.current = { context, oscillator, gain };
        const cleanupId = globalThis.setTimeout(() => {
            if (activeSound.current?.oscillator === oscillator) activeSound.current = null;
        }, remaining + 1000);

        return () => globalThis.clearTimeout(cleanupId);
    }, [running, remaining, midiNote]);

    // Keep the swell's pitch aligned with the live sequence note without
    // restarting the envelope when the user advances, shuffles, or changes exercise.
    useEffect(() => {
        const sound = activeSound.current;
        if (!sound) return;
        const frequency = 440 * (2 ** ((midiNote - 69) / 12));
        sound.oscillator.frequency.setTargetAtTime(frequency, sound.context.currentTime, 0.025);
    }, [midiNote]);

    return null;
};

export default TimerWarning;
