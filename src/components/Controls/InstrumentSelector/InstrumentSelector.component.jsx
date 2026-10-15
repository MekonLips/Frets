import React from 'react';
import { useFretsStore } from '../../../store/useFretsStore';
import { INSTRUMENTS } from '../../../config/frets.js';

const InstrumentSelector = () => {
    const instruments = useFretsStore(state => state.instruments) || INSTRUMENTS;
    const selectedId = useFretsStore(state => state.selectedInstrumentId);
    const setSelected = useFretsStore(state => state.setInstrument);
    const changeHandler = e => setSelected(parseInt(e.target.value));
    return <label>
        <select className="legacy-form-select" onChange={changeHandler} value={selectedId}>
            {instruments.map(({ id, name }) =>
                <option key={`InstrumentSelector/Option/${id}`} value={id}>{name}</option>)}
        </select>
    </label>
};

export default InstrumentSelector;