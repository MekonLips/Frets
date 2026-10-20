import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCaretRight } from '@fortawesome/free-solid-svg-icons';

import { useFretsStore } from '../../store/useFretsStore';
import Portal from '../Portal/Portal.component';
import Panel from '../Panel/Panel.component';
import InstrumentBuilder from './InstrumentBuilder.component';

const InstrumentsOverlay = () => {
    const show = useFretsStore(state => state.showInstruments);
    const setShow = useFretsStore(state => state.setShowInstruments);

    return <Portal id="instruments">
        <Panel show={show} className="legacy-instruments-panel">
            <div className="legacy-instruments-content">
                <h1>Instruments</h1>
                <InstrumentBuilder />
            </div>
            <button
                type="button"
                aria-label="Close instruments"
                className={`legacy-instruments-close-button ${show ? 'is-visible' : ''}`}
                onClick={() => setShow(false)}
            >
                <FontAwesomeIcon icon={faCaretRight} />
            </button>
        </Panel>
    </Portal>;
};

export default InstrumentsOverlay;
