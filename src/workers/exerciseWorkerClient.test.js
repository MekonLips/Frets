import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { ACTIONS } from '../config/frets.config.js';

const { SEQUENCE, NOTES, PATTERN } = ACTIONS.PATTERNS;

describe('exercise worker client', () => {
    let createdWorkers;
    let handleExerciseWorkerMessage;
    let worker;
    let store;
    let state;

    beforeEach(async () => {
        createdWorkers = [];
        vi.stubGlobal('Worker', class MockWorker {
            constructor(url, options) {
                this.url = url;
                this.options = options;
                this.postMessage = vi.fn();
                this.onmessage = null;
                this.onerror = null;
                createdWorkers.push(this);
            }
        });
        vi.resetModules();
        ({ handleExerciseWorkerMessage, worker } = await import('./exerciseWorkerClient.js'));
        state = {
            exercises: {},
            setExerciseResults: vi.fn(),
            setExerciseNotes: vi.fn(),
            setExercisePattern: vi.fn(),
        };
        store = { getState: () => state };
    });

    afterEach(() => {
        vi.unstubAllGlobals();
        vi.restoreAllMocks();
    });

    it('registers one stable message handler on the shared worker', () => {
        expect(createdWorkers).toHaveLength(1);
        expect(worker.onmessage).toBe(handleExerciseWorkerMessage);
        expect(worker.onerror).toEqual(expect.any(Function));
    });

    it('commits sequence, notes and pattern together to the originating exercise', () => {
        const sequence = [1, 2];
        const notes = [[{ string: 1, fret: 1 }], [{ string: 2, fret: 3 }]];
        const pattern = [{ noteIdx: 1 }, { noteIdx: 2 }];

        handleExerciseWorkerMessage({
            data: { type: SEQUENCE, payload: { exercise: 4, sequence, notes, pattern } },
        }, store);

        expect(state.setExerciseResults).toHaveBeenCalledOnce();
        expect(state.setExerciseResults).toHaveBeenCalledWith(4, { sequence, notes, pattern });
        expect(state.setExerciseNotes).not.toHaveBeenCalled();
        expect(state.setExercisePattern).not.toHaveBeenCalled();
    });

    it('ignores results generated for a previous instrument tuning', () => {
        state.selectedInstrumentId = 4;
        state.activeInstrumentDefinition = null;

        handleExerciseWorkerMessage({
            data: {
                type: SEQUENCE,
                payload: {
                    exercise: 2,
                    instrumentKey: '1:64,59,55,50,45,40',
                    sequence: [1, 2],
                    notes: [],
                    pattern: [],
                },
            },
        }, store);

        expect(state.setExerciseResults).not.toHaveBeenCalled();
    });

    it('accepts results generated for the currently selected legacy instrument', () => {
        state.selectedInstrumentId = 4;
        state.activeInstrumentDefinition = null;

        handleExerciseWorkerMessage({
            data: {
                type: SEQUENCE,
                payload: {
                    exercise: 2,
                    instrumentKey: '4:43,38,33,28',
                    sequence: [1, 2],
                    notes: [],
                    pattern: [],
                },
            },
        }, store);

        expect(state.setExerciseResults).toHaveBeenCalledWith(2, {
            sequence: [1, 2],
            notes: [],
            pattern: [],
        });
    });

    it('ignores stale note positions when a newer sequence is already active', () => {
        state.exercises['6'] = { sequence: [3, 4, 5, 6, 7, 8, 9, 10, 11, 0, 1, 2] };
        const staleNotes = Array.from({ length: 7 }, (_, index) => [{ string: 1, fret: index + 1 }]);

        handleExerciseWorkerMessage({
            data: {
                type: NOTES,
                payload: {
                    exercise: 6,
                    sequence: [3, 5, 7, 8, 10, 0, 2],
                    notes: staleNotes,
                },
            },
        }, store);

        expect(state.setExerciseNotes).not.toHaveBeenCalled();
    });

    it('accepts note positions when their sequence still matches the active sequence', () => {
        const sequence = [3, 4, 5, 6, 7, 8, 9, 10, 11, 0, 1, 2];
        const notes = sequence.map((note, index) => [{ string: 1, fret: index + 1, note }]);
        state.exercises['6'] = { sequence: [...sequence] };

        handleExerciseWorkerMessage({
            data: { type: NOTES, payload: { exercise: 6, sequence: [...sequence], notes } },
        }, store);

        expect(state.setExerciseNotes).toHaveBeenCalledWith(6, notes);
    });

    it('routes notes and patterns to their originating exercise', () => {
        const notes = [[{ string: 1, fret: 4 }]];
        const pattern = [{ noteIdx: 3 }];

        handleExerciseWorkerMessage({
            data: { type: NOTES, payload: { exercise: 2, notes } },
        }, store);
        handleExerciseWorkerMessage({
            data: { type: PATTERN, payload: { exercise: 5, pattern } },
        }, store);

        expect(state.setExerciseNotes).toHaveBeenCalledWith(2, notes);
        expect(state.setExercisePattern).toHaveBeenCalledWith(5, pattern);
        expect(state.setExerciseResults).not.toHaveBeenCalled();
    });

    it('ignores missing result fields and logs unknown message types', () => {
        const log = vi.spyOn(console, 'log').mockImplementation(() => {});

        handleExerciseWorkerMessage({
            data: { type: NOTES, payload: { exercise: 1 } },
        }, store);
        handleExerciseWorkerMessage({
            data: { type: 'UNKNOWN_ACTION', payload: { exercise: 1 } },
        }, store);

        expect(state.setExerciseNotes).not.toHaveBeenCalled();
        expect(state.setExercisePattern).not.toHaveBeenCalled();
        expect(state.setExerciseResults).not.toHaveBeenCalled();
        expect(log).toHaveBeenCalledOnce();
    });
});
