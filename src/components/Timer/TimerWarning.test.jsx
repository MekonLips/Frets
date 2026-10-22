import { describe, expect, it } from 'vitest';

import { TIMER_WARNING_DURATION_MS } from './TimerWarning.component.jsx';
import { getTimerWarningMidiNote } from '../../utils/timerWarningAudio.utils';

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
