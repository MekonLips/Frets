import React from 'react';
import { useRecoilValue } from 'recoil';

import { selectedInstrumentIdAtom, getInstrumentSelector, startFretAtom } from '../../../recoil/frets.recoil';
import { gridColumns } from '../../../utils/grid.utils';
import { FRETS_NUM, GRID_MARGIN, GRID_ROW_HEIGHT, GRID_ROW_HEIGHT_MIN, Z_INDEX, NOTES_NUM, COLORS } from '../../../config/frets.config';

const FretsComponent = () => {
    const selectedInstrumentId = useRecoilValue(selectedInstrumentIdAtom);
    const instrument = useRecoilValue(getInstrumentSelector(selectedInstrumentId));
    const startFret = useRecoilValue(startFretAtom);
    const frets = Array.from({ length: FRETS_NUM + 2 }, (_, idx) =>
      <div className={`legacy-fret ${idx === 1 ? 'legacy-fret-first-real' : ''} ${idx === FRETS_NUM + 1 ? 'legacy-fret-last' : ''} ${[3,5,7,9,12,15,17,19,21,24].includes(idx) ? 'legacy-fret-marker' : ''} ${idx > 0 && idx % NOTES_NUM === 0 ? 'legacy-fret-double-marker' : ''}`} key={`Fret/${idx}`} style={{ '--fret-column': idx + 1, '--fret-index': idx, '--fret-z': Z_INDEX.Fret, '--fret-border-light': COLORS.Fret.gradientColor1, '--fret-border-dark': COLORS.Fret.gradientColor2, '--fret-bg': COLORS.Fretboard.backgroundColorDark, '--nut-bg': COLORS.Nut.backgroundColor, '--neck-bg': COLORS.Fretboard.backgroundColor, '--dot-bg': COLORS.Dot.backgroundColor, '--notes-num': NOTES_NUM }} />);
    return <div className="legacy-frets" style={{ '--string-count': instrument.strings.length, '--frets-height': `${GRID_ROW_HEIGHT * instrument.strings.length}vh`, '--frets-min-height': `${GRID_ROW_HEIGHT_MIN * instrument.strings.length}px`, '--frets-columns': `${GRID_MARGIN}vw ${gridColumns(24)} ${GRID_MARGIN}vw`, '--frets-z': Z_INDEX.Fretboard }}>
        {frets}
    </div>
};

export default FretsComponent;