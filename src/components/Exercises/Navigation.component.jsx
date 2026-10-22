import React from 'react';
import { Link, useParams } from 'react-router-dom';

import { EXERCISE_INSTRUCTIONS } from '../../config/frets.config';

const NavigationComponent = () => {
    const { exercise } = useParams();
    const isExercise = Boolean(exercise);

    if (isExercise)
        return <nav className="exercise-navigation" aria-label="Choose exercise">
            {EXERCISE_INSTRUCTIONS.map((_, idx) => {
                const number = idx + 1;
                const isCurrentExercise = String(number) === exercise;

                return <Link
                    key={`ExerciseNavigation/${number}`}
                    className={`exercise-navigation-link${isCurrentExercise ? ' is-current' : ''}`}
                    to={`/exercises/${number}`}
                    aria-current={isCurrentExercise ? 'page' : undefined}
                >
                    {number}
                </Link>;
            })}
        </nav>
    return null;
};

export default NavigationComponent;