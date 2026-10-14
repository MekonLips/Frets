import React from 'react';
import { useParams } from 'react-router';
import { useRecoilValue } from 'recoil';

import { startFretAtom, endFretAtom } from '../../../recoil/frets.recoil';
import { Container, Content } from './Instructions.styled';
import { EXERCISE_INSTRUCTIONS } from '../../../config/frets.config';

const InstructionsComponent = () => {
    const { exercise } = useParams();
    const isExercise = exercise ? true : false;
    const start = useRecoilValue(startFretAtom);
    const end = useRecoilValue(endFretAtom);
    if (isExercise)
        return <Container>
            <Content start={start} end={end}>
                <h1>Exercise {exercise}</h1>
                    {EXERCISE_INSTRUCTIONS[exercise - 1].map((text, idx) =>
                <p key={`Instructions/${idx}`}>{text}</p>)}
            </Content>
        </Container>
    else
        return null;
};

export default InstructionsComponent;