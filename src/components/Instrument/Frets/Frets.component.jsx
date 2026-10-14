import React from 'react';
import { useRecoilValue } from 'recoil';

import { selectedInstrumentIdAtom, getInstrumentSelector, startFretAtom } from '../../../recoil/frets.recoil';
import { FRETS_NUM } from '../../../config/frets.config';
import { Frets, Fret } from './Frets.styled';

const FretsComponent = () => {
    const selectedInstrumentId = useRecoilValue(selectedInstrumentIdAtom);
    const instrument = useRecoilValue(getInstrumentSelector(selectedInstrumentId));
    const startFret = useRecoilValue(startFretAtom);
    const frets = [];
    for (let idx = 0; idx < FRETS_NUM + 2; idx++)
      frets.push(<Fret key={`Fret/${idx}`} start={startFret} fret={idx} />);
    return <Frets strings={instrument.strings.length}>
        {frets}
    </Frets>
};

export default FretsComponent;