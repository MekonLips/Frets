import React from 'react';

import { useFretsStore, getSelectedInstrument } from '../../store/useFretsStore';
import { gridHeight } from '../../utils/grid.utils';
import { Z_INDEX } from '../../config/frets.config';

const GridComponent = ({ children }) => {
    const selectedInstrumentId = useFretsStore(state => state.selectedInstrumentId);
    const activeInstrumentDefinition = useFretsStore(state => state.activeInstrumentDefinition);
    const instrument = getSelectedInstrument(activeInstrumentDefinition || selectedInstrumentId);
    return <div className="legacy-grid" style={{ '--grid-board-height': `calc(${gridHeight(instrument.strings.length)} + ${gridHeight(1)} * 2)`, '--grid-z': Z_INDEX.Grid }}>{children}</div>;
};

export default GridComponent;