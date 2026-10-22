import { describe, expect, it } from 'vitest';

import { TIMER_WARNING_DURATION_MS } from './TimerWarning.component.jsx';
import { getTimerWarningMidiNote, getTimerToggleFrequencies } from '../../utils/timerWarningAudio.utils';

describe('session timer warning', () => {
    it('uses a five-second warning threshold by default', () => {
        expect(TIMER_WARNING_DURATION_MS).toBe(5000);
    });

    it('uses C when sequence playback is stopped or there is no sequence', () => {
        expect(getTimerWarningMidiNote(false, [0, 4], 2)).toBe(72);
        expect(getTimerWarningMidiNote(true, [], 1)).toBe(72);
    });

    it('uses the current sequence note when playback is active', () => {
        expect(getTimerWarningMidiNote(true, [0, 3, 7], 2)).toBe(72);
        expect(getTimerWarningMidiNote(true, [0, 3, 7], 3)).toBe(76);
    });

    it('falls back to C for invalid sequence positions', () => {
        expect(getTimerWarningMidiNote(true, [0, 3], 0)).toBe(72);
        expect(getTimerWarningMidiNote(true, [0, 3], 9)).toBe(72);
    });
});


describe('session timer toggle chime', () => {
    it('slides from the selected note up one octave when starting', () => {
        const { startFrequency, endFrequency } = getTimerToggleFrequencies(true, 72);
        expect(startFrequency).toBeCloseTo(523.25, 1);
        expect(endFrequency).toBeCloseTo(startFrequency * 2);
    });

    it('slides from one octave above the selected note down when pausing', () => {
        const { startFrequency, endFrequency } = getTimerToggleFrequencies(false, 72);
        expect(startFrequency).toBeCloseTo(1046.5, 1);
        expect(endFrequency).toBeCloseTo(startFrequency / 2);
    });

    it('defaults to C when no sequence note is supplied', () => {
        const { startFrequency, endFrequency } = getTimerToggleFrequencies(true);
        expect(startFrequency).toBeCloseTo(523.25, 1);
        expect(endFrequency).toBeCloseTo(startFrequency * 2);
    });
});
