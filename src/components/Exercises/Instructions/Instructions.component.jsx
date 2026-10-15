import React from 'react';
import { useParams } from 'react-router';
import { useRecoilValue } from 'recoil';

import { startFretAtom, endFretAtom } from '../../../recoil/frets.recoil';
import { EXERCISE_INSTRUCTIONS } from '../../../config/frets.config';

const InstructionsComponent = () => {
    const { exercise } = useParams();
    const isExercise = exercise ? true : false;
    const start = useRecoilValue(startFretAtom);
    const end = useRecoilValue(endFretAtom);
    if (isExercise)
        return <div className="legacy-instructions">
            <div>
                <h1>Exercise {exercise}</h1>
                    {EXERCISE_INSTRUCTIONS[exercise - 1].map((text, idx) =>
                <p key={`Instructions/${idx}`}>{text}</p>)}
            </div>
        </div>
    else
        return null;
};

export default InstructionsComponent;