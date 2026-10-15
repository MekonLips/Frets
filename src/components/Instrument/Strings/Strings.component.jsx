import React from 'react';
import { useRecoilValue } from 'recoil';

import { selectedInstrumentIdAtom, getInstrumentSelector } from '../../../recoil/frets.recoil';
import { Z_INDEX, GRID_ROW_HEIGHT, GRID_ROW_HEIGHT_MIN } from '../../../config/frets.config';
import { minmax } from '../../../utils/math.utils';

const StringsComponent = () => {
    const selectedInstrumentId = useRecoilValue(selectedInstrumentIdAtom);
    const instrument = useRecoilValue(getInstrumentSelector(selectedInstrumentId));
    const stringCount = instrument.strings.length;
    return <div className="legacy-strings" style={{ '--string-count': stringCount, '--strings-height': `${GRID_ROW_HEIGHT * stringCount}vh`, '--strings-min-height': `${GRID_ROW_HEIGHT_MIN * stringCount}px` }}>
        {Array.from({ length: stringCount }, (_, i) => <div className="legacy-string-row" key={`String/${i}`} style={{ '--string-thickness': `${minmax(i, 2, 5)}px`, zIndex: Z_INDEX.String }} />)}
    </div>
};

export default StringsComponent;