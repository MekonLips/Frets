import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGear } from '@fortawesome/free-solid-svg-icons';

import { useFretsStore, getSelectedInstrument } from '../../store/useFretsStore';
import { INSTRUMENT_TYPES } from '../../config/frets.config';

import guitarIcon from '../../assets/instruments/guitar.png';
import bassIcon from '../../assets/instruments/bass.png';
import mandolinIcon from '../../assets/instruments/mandolin.png';
import ukuleleIcon from '../../assets/instruments/ukulele.png';
import banjoIcon from '../../assets/instruments/banjo.png';

const INSTRUMENT_TYPE_ICONS = {
    [INSTRUMENT_TYPES.GUITAR]: guitarIcon,
    [INSTRUMENT_TYPES.BASS]: bassIcon,
    [INSTRUMENT_TYPES.MANDOLIN]: mandolinIcon,
    [INSTRUMENT_TYPES.UKULELE]: ukuleleIcon,
    [INSTRUMENT_TYPES.BANJO]: banjoIcon,
};

const InstrumentOpenButton = () => {
    const selectedId = useFretsStore(state => state.selectedInstrumentId);
    const setShow = useFretsStore(state => state.setShowInstruments);
    const instrument = getSelectedInstrument(selectedId);

    return <div className="legacy-nav-icon-button-wrapper">
        <button
            type="button"
            className="legacy-instrument-open-button"
            aria-label="Open instrument settings"
            title="Instrument settings"
            onClick={() => setShow(true)}
        >
            <FontAwesomeIcon icon={faGear} />
            <img
                className="legacy-instrument-icon"
                src={INSTRUMENT_TYPE_ICONS[instrument.type]}
                alt=""
                aria-hidden="true"
            />
        </button>
    </div>;
};

export default InstrumentOpenButton;
