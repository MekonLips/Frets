import React from 'react';
import { useRecoilState } from 'recoil';
import { showNavAtom } from '../../recoil/frets.recoil';
import { Overlay } from './Overlay.styled';

const OverlayComponent = () => {
    const [ visible, setVisible ] = useRecoilState(showNavAtom);
    const clickHandler = () => setVisible(false);
    return <Overlay visible={visible} onClick={clickHandler}></Overlay>
};

export default OverlayComponent;