import React from 'react';
import { useParams } from 'react-router';
import { useRecoilValue } from 'recoil';

import { startFretAtom } from '../../recoil/frets.recoil';
import { Range, Focus, Blur } from './Range.styled';

const RangeComponent = () => {
    const { exercise } = useParams();
    const isExercise = exercise ? true : false;
    const start = useRecoilValue(startFretAtom);
    return <>
        <Focus show={isExercise} start={start} />
        <Range start={start}>
            <Blur show={isExercise} start={start} />
            <Blur show={isExercise} start={start} />
        </Range>
    </>
};

export default RangeComponent;