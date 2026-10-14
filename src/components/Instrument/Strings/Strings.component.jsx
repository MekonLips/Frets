import React from 'react';
import { useRecoilValue } from 'recoil';

import { selectedInstrumentIdAtom, getInstrumentSelector } from '../../../recoil/frets.recoil';
import { Strings, String } from './Strings.styled';

const StringsComponent = () => {
    const selectedInstrumentId = useRecoilValue(selectedInstrumentIdAtom);
    const instrument = useRecoilValue(getInstrumentSelector(selectedInstrumentId));
    const strings = [];
    for (let i = 0; i < instrument.strings.length; i++)
        strings.push(<String key={`String/${i}`} string={i} />);
    return <Strings strings={strings.length}>
        {strings}
    </Strings>
};

export default StringsComponent;