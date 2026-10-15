import React from 'react';
import { useRecoilValue } from 'recoil';

import { selectedInstrumentIdAtom, getInstrumentSelector, startFretAtom } from '../../recoil/frets.recoil';
import Numbers from './Numbers/Numbers.component';
import Frets from './Frets/Frets.component';
import Strings from './Strings/Strings.component';
import { calcWidth } from '../../utils/grid.utils';
import { Z_INDEX, NOTES_NUM, GRID_ROW_HEIGHT, GRID_ROW_HEIGHT_MIN, COLORS } from '../../config/frets.config';
import { PORTALS } from '../../config/frets.config';

const InstrumentComponent = () => {
    const selectedInstrumentId = useFretsStore(state => state.selectedInstrumentId);
    const instrument = getSelectedInstrument(selectedInstrumentId);
    const startFret = useFretsStore(state => state.startFret);
    return <div className="legacy-instrument" style={{ '--instrument-strings': instrument.strings.length, '--instrument-height': `${GRID_ROW_HEIGHT * instrument.strings.length}vh`, '--instrument-min-height': `${GRID_ROW_HEIGHT_MIN * instrument.strings.length}px`, '--instrument-bg': COLORS.Neck.backgroundColor, zIndex: Z_INDEX.Guitar }}>
        <div className="legacy-fret-grid" id={PORTALS.FRET_GRID} style={{ transform: `translateX(calc(-${calcWidth(startFret - 1) * calcWidth(NOTES_NUM + 2) / 100}vw + ${(calcWidth(startFret - 1 + NOTES_NUM) - calcWidth(NOTES_NUM)) * calcWidth(NOTES_NUM + 2) / 100 / 2}vw))` }}>
            <Numbers />
            <Frets />
            <Strings />
        </div>
    </div>
};

export default InstrumentComponent;