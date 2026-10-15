import React from 'react';
import { useRecoilState } from 'recoil';
import { showNavAtom } from '../../recoil/frets.recoil';
import { Z_INDEX } from '../../config/frets.config';

const OverlayComponent = () => {
    const [ visible, setVisible ] = useRecoilState(showNavAtom);
    const clickHandler = () => setVisible(false);
    return <div className={`legacy-overlay ${visible ? 'legacy-overlay-visible' : ''}`} style={{ zIndex: Z_INDEX.Overlay }} onClick={clickHandler} />
};

export default OverlayComponent;