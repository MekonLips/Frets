import React from 'react';
import { useFretsStore } from '../../../store/useFretsStore';
import { INSTRUMENTS } from '../../../config/frets.config.js';

const InstrumentSelector = () => {
    const instruments = useFretsStore(state => state.instruments) || INSTRUMENTS;
    const selectedId = useFretsStore(state => state.selectedInstrumentId);
    const activeInstrumentDefinition = useFretsStore(state => state.activeInstrumentDefinition);
    const setSelected = useFretsStore(state => state.setInstrument);
    const changeHandler = e => {
        if (e.target.value === 'active-builder') return;
        setSelected(parseInt(e.target.value));
    };
    const selectedValue = activeInstrumentDefinition ? 'active-builder' : selectedId;
    return <label>
        <select className="legacy-form-select" onChange={changeHandler} value={selectedValue}>
            {activeInstrumentDefinition && <option value="active-builder">{activeInstrumentDefinition.name} (builder)</option>}
            {instruments.map(({ id, name }) =>
                <option key={`InstrumentSelector/Option/${id}`} value={id}>{name}</option>)}
        </select>
    </label>
};

export default InstrumentSelector;
