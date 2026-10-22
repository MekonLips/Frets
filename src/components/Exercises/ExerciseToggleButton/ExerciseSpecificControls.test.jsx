import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { MemoryRouter, Route } from 'react-router-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { useFretsStore } from '../../../store/useFretsStore';
import useExercise from '../../../hooks/useExercise.hook';
import TempoControls from '../TempoControls/TempoControls.component.jsx';
import ShuffleButton from '../ShuffleButton/ShuffleButton.component.jsx';
import AccidentalsToggle from '../AccidentalsToggle/AccidentalsToggle.component.jsx';
import LoopToggle from '../LoopToggle/LoopToggle.component.jsx';
import ExerciseToggleButton from './ExerciseToggleButton.component.jsx';

vi.mock('../../../hooks/useExercise.hook', () => ({
    default: vi.fn(),
    useExercise: vi.fn(),
}));

const renderForExercise = (exercise, component) => renderToStaticMarkup(
    <MemoryRouter initialEntries={[`/exercises/${exercise}`]}>
        <Route path="/exercises/:exercise" render={() => component} />
    </MemoryRouter>,
);

describe('exercise-specific controls', () => {
    beforeEach(() => {
        useFretsStore.setState({
            tempoBpm: 40,
            useAccidentals: false,
            loopExercises: {},
            sequencePlaying: false,
        });
        useExercise.mockReturnValue({
            exercise: '1',
            isExercise: true,
            createSequence: vi.fn(),
        });
    });

    it('disables tempo on Exercise 1 and enables it on Exercise 2', () => {
        const exerciseOne = renderForExercise(1, <TempoControls />);
        const exerciseTwo = renderForExercise(2, <TempoControls />);

        expect(exerciseOne).toContain('disabled=""');
        expect(exerciseOne).toContain('40 BPM');
        expect(exerciseTwo).not.toContain('disabled=""');
        expect(exerciseTwo).toContain('40 BPM');
    });

    it('keeps shuffle visible but disabled for Exercises 1–4', () => {
        for (const exercise of [1, 2, 3, 4]) {
            useExercise.mockReturnValue({
                exercise: String(exercise),
                isExercise: true,
                createSequence: vi.fn(),
            });
            const markup = renderForExercise(exercise, <ShuffleButton />);
            expect(markup).toContain('Shuffle note sequence');
            expect(markup).toContain('disabled=""');
        }
    });

    it('enables shuffle only for Exercises 5 and 6', () => {
        for (const exercise of [5, 6]) {
            useExercise.mockReturnValue({
                exercise: String(exercise),
                isExercise: true,
                createSequence: vi.fn(),
            });
            const markup = renderForExercise(exercise, <ShuffleButton />);
            expect(markup).toContain('Shuffle note sequence');
            expect(markup).not.toContain('disabled=""');
        }
    });

    it('shows accidentals checked and disabled for Exercise 3', () => {
        const markup = renderForExercise(3, <AccidentalsToggle />);
        expect(markup).toContain('Use accidentals?');
        expect(markup).toContain('checked=""');
        expect(markup).toContain('disabled=""');
    });

    it('lets users control accidentals in Exercise 4', () => {
        const markup = renderForExercise(4, <AccidentalsToggle />);
        expect(markup).toContain('Use accidentals?');
        expect(markup).not.toContain('checked=""');
        expect(markup).not.toContain('disabled=""');
    });

    it('keeps Exercise 4 loop checked but disabled, while Exercise 6 is enabled and unchecked by default', () => {
        const exerciseFour = renderForExercise(4, <LoopToggle />);
        const exerciseSix = renderForExercise(6, <LoopToggle />);

        expect(exerciseFour).toContain('Loop exercise?');
        expect(exerciseFour).toContain('checked=""');
        expect(exerciseFour).toContain('disabled=""');

        expect(exerciseSix).toContain('Loop exercise?');
        expect(exerciseSix).not.toContain('checked=""');
        expect(exerciseSix).not.toContain('disabled=""');
    });

    it('renders Continue for Exercise 1 and playback controls for later exercises', () => {
        const exerciseOne = renderForExercise(1, <ExerciseToggleButton />);
        const exerciseTwo = renderForExercise(2, <ExerciseToggleButton />);

        expect(exerciseOne).toContain('Continue');
        expect(exerciseOne).not.toContain('Pause note sequence');
        expect(exerciseTwo).toContain('Play');
        expect(exerciseTwo).toContain('Play note sequence');
    });
});
