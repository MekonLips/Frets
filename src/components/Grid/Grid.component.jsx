import React from 'react';
import { useRecoilValue } from 'recoil';

import { selectedInstrumentIdAtom, getInstrumentSelector } from '../../recoil/frets.recoil';
import { Grid } from './Grid.styled';

const GridComponent = ({ children }) => {
    const selectedInstrumentId = useRecoilValue(selectedInstrumentIdAtom);
    const instrument = useRecoilValue(getInstrumentSelector(selectedInstrumentId));
    return <Grid strings={instrument.strings.length}>{children}</Grid>
}

export default GridComponent;