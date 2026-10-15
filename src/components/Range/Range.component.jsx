import React from 'react';
import { useParams } from 'react-router';
import { useRecoilValue } from 'recoil';

import { startFretAtom } from '../../recoil/frets.recoil';
import { calcWidth } from '../../utils/grid.utils';
import { Z_INDEX, NOTES_NUM, GRID_MARGIN, COLORS } from '../../config/frets.config';

const RangeComponent = () => {
    const { exercise } = useParams();
    const isExercise = exercise ? true : false;
    const start = useFretsStore(state => state.startFret);
    const edge = GRID_MARGIN + (calcWidth(start - 1 + NOTES_NUM) - calcWidth(NOTES_NUM)) * calcWidth(NOTES_NUM + 2) / 100 / 2;
    return <>
        <div className={`legacy-range-focus ${isExercise ? 'is-visible' : ''}`} style={{ '--focus-edge': `${edge}vw`, '--focus-z': Z_INDEX.Focus, '--range-focus-bg': COLORS.Range.backgroundColor }} />
        <div className="legacy-range" style={{ '--range-z': Z_INDEX.Range, '--blur-z': Z_INDEX.Blur, '--blur-edge': `${edge}vw` }}>
            <div className={`legacy-range-blur legacy-range-blur-left ${isExercise ? 'is-visible' : ''}`} />
            <div className={`legacy-range-blur legacy-range-blur-right ${isExercise ? 'is-visible' : ''}`} />
        </div>
    </>
};

export default RangeComponent;