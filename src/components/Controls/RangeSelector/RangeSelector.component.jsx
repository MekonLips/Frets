import React, { useState } from 'react';
import { useRecoilState } from 'recoil';

import { startFretAtom } from '../../../recoil/frets.recoil';
import { NOTES_NUM } from '../../../config/frets.config';

const RangeSelector = () => {
    const [ options ] = useState(() => new Array(NOTES_NUM + 1).fill(1).map((_, idx) => _ + idx));
    const [ start, setStartFret ] = useRecoilState(startFretAtom);
    const changeHandler = e => setStartFret(parseInt(e.target.value));
    return <label>
        <select className="legacy-form-select" onChange={changeHandler} value={start}>
            {options.map((idx) =>
                <option key={`RangeSelector/Option/${idx}`} value={idx}>Frets {idx} to {idx + NOTES_NUM - 1}</option>)}
        </select>
    </label>
};

export default RangeSelector;