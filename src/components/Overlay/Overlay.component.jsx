import React from 'react';
import { useFretsStore } from '../../store/useFretsStore';
import { Z_INDEX } from '../../config/frets.config';

const OverlayComponent = () => {
    const visible = useFretsStore(state => state.showNav || state.showInstruments);
    const setShowNav = useFretsStore(state => state.setShowNav);
    const setShowInstruments = useFretsStore(state => state.setShowInstruments);
    const clickHandler = () => {
        setShowNav(false);
        setShowInstruments(false);
    };
    return <div className={`legacy-overlay ${visible ? 'legacy-overlay-visible' : ''}`} style={{ zIndex: Z_INDEX.Overlay }} onClick={clickHandler} />;
};

export default OverlayComponent;