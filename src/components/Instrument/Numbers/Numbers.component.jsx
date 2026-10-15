import React from 'react';
import { useRecoilValue } from 'recoil';

import { startFretAtom, selectedInstrumentIdAtom, getInstrumentSelector } from '../../../recoil/frets.recoil';
import { gridColumns, gridHeight, gridMinHeight } from '../../../utils/grid.utils';
import { Z_INDEX, GRID_MARGIN } from '../../../config/frets.config';
import { MARKERS } from '../../../config/frets.config';

const NumbersComponent = () => {
    const selectedInstrument = useRecoilValue(selectedInstrumentIdAtom);
    const instrument = useRecoilValue(getInstrumentSelector(selectedInstrument));
    const startFret = useRecoilValue(startFretAtom);
    const numbers = MARKERS.map(idx =>
        <div className="legacy-fret-number" key={`Number/${idx}`} style={{ '--number-column': idx + 1 }}>{idx}</div>);
    return <div className="legacy-fret-numbers" style={{ '--numbers-height': gridHeight(1), '--numbers-min-height': gridMinHeight(1), '--numbers-columns': `${GRID_MARGIN}vw ${gridColumns(24)} ${GRID_MARGIN}vw`, '--numbers-z': Z_INDEX.Fretboard }}>
        {numbers}
    </div>
};

export default NumbersComponent;