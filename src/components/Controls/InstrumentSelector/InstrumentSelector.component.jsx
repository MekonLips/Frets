import React from 'react';
import { useRecoilValue, useRecoilState } from 'recoil';

import { instrumentsAtom, selectedInstrumentIdAtom } from '../../../recoil/frets.recoil';
import { Select } from '../../../styles/form.styles';

const InstrumentSelector = () => {
    const instruments = useRecoilValue(instrumentsAtom);
    const [ selectedId, setSelected ] = useRecoilState(selectedInstrumentIdAtom);
    const changeHandler = e => setSelected(parseInt(e.target.value));
    return <label>
        <Select onChange={changeHandler} value={selectedId}>
            {instruments.map(({ id, name }) =>
                <option key={`InstrumentSelector/Option/${id}`} value={id}>{name}</option>)}
        </Select>
    </label>
};

export default InstrumentSelector;