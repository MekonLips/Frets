import React from 'react';
import { useFretsStore, getSelectedInstrument } from '../../../store/useFretsStore';
import { Z_INDEX, GRID_ROW_HEIGHT, GRID_ROW_HEIGHT_MIN } from '../../../config/frets.config';
import { minmax } from '../../../utils/math.utils';

const StringsComponent = () => {
    const selectedInstrumentId = useFretsStore(state => state.selectedInstrumentId);
    const activeInstrumentDefinition = useFretsStore(state => state.activeInstrumentDefinition);
    const instrument = getSelectedInstrument(activeInstrumentDefinition || selectedInstrumentId);
    const stringCount = instrument.strings.length;
    return <div className="legacy-strings" style={{ '--string-count': stringCount, '--strings-height': `${GRID_ROW_HEIGHT * stringCount}vh`, '--strings-min-height': `${GRID_ROW_HEIGHT_MIN * stringCount}px` }}>
        {Array.from({ length: stringCount }, (_, i) => {
            const isBass = instrument.name.toLowerCase().includes('bass');
            const isWound = isBass || i >= 3;
            return <div className={`legacy-string-row${isWound ? ' legacy-string-row-wound' : ''}`} key={`String/${i}`} style={{ '--string-thickness': `${minmax(i, 2, 5)}px`, zIndex: Z_INDEX.String }} />;
        })}
    </div>
};

export default StringsComponent;