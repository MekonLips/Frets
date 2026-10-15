import React from 'react';
import { useRecoilValue } from 'recoil';

import { selectedInstrumentIdAtom, getInstrumentSelector } from '../../recoil/frets.recoil';
import { gridHeight } from '../../utils/grid.utils';
import { Z_INDEX } from '../../config/frets.config';

const GridComponent = ({ children }) => {
    const selectedInstrumentId = useFretsStore(state => state.selectedInstrumentId);
    const instrument = getSelectedInstrument(selectedInstrumentId);
    return <div className="legacy-grid" style={{ '--grid-board-height': `calc(${gridHeight(instrument.strings.length)} + ${gridHeight(1)} * 2)`, '--grid-z': Z_INDEX.Grid }}>{children}</div>
}

export default GridComponent;