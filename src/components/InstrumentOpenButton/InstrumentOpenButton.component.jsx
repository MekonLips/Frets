import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGear } from '@fortawesome/free-solid-svg-icons';

import { useFretsStore, getSelectedInstrument } from '../../store/useFretsStore';

const InstrumentOpenButton = () => {
    const selectedId = useFretsStore(state => state.selectedInstrumentId);
    const setShow = useFretsStore(state => state.setShowInstruments);
    const instrument = getSelectedInstrument(selectedId);

    return <div className="legacy-nav-icon-button-wrapper">
        <button
            type="button"
            aria-label="Open instrument settings"
            title="Instrument settings"
            onClick={() => setShow(true)}
        >
            <FontAwesomeIcon icon={faGear} />
        </button>
        <span className="legacy-instrument-label">{instrument.name}</span>
    </div>;
};

export default InstrumentOpenButton;
