import React from 'react';
import { useRecoilValue } from 'recoil';

import { selectedInstrumentIdAtom, getInstrumentSelector, startFretAtom } from '../../recoil/frets.recoil';
import Numbers from './Numbers/Numbers.component';
import Frets from './Frets/Frets.component';
import Strings from './Strings/Strings.component';
import { Instrument, FretGrid } from './Instrument.styled';
import { PORTALS } from '../../config/frets.config';

const InstrumentComponent = () => {
    const selectedInstrumentId = useRecoilValue(selectedInstrumentIdAtom);
    const instrument = useRecoilValue(getInstrumentSelector(selectedInstrumentId));
    const startFret = useRecoilValue(startFretAtom);
    return <Instrument strings={instrument.strings.length}>
        <FretGrid id={PORTALS.FRET_GRID} start={startFret}>
            <Numbers />
            <Frets />
            <Strings />
        </FretGrid>
    </Instrument>
};

export default InstrumentComponent;