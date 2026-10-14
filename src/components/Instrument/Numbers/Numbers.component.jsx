import React from 'react';
import { useRecoilValue } from 'recoil';

import { startFretAtom, selectedInstrumentIdAtom, getInstrumentSelector } from '../../../recoil/frets.recoil';
import { Numbers, Number } from './Numbers.styled';
import { MARKERS } from '../../../config/frets.config';

const NumbersComponent = () => {
    const selectedInstrument = useRecoilValue(selectedInstrumentIdAtom);
    const instrument = useRecoilValue(getInstrumentSelector(selectedInstrument));
    const startFret = useRecoilValue(startFretAtom);
    const numbers = MARKERS.map(idx => 
        <Number key={`Number/${idx}`} fret={idx}>{idx}</Number>);
    return <Numbers strings={instrument.strings.length} start={startFret}>
        {numbers}
    </Numbers>
};

export default NumbersComponent;