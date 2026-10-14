import React, { useRef } from 'react';
import { useSetRecoilState } from 'recoil';

import { showNavAtom } from '../../../recoil/frets.recoil';

const CloseButton = ({ children }) => {
    const setVisible = useSetRecoilState(showNavAtom);
    const ref = useRef();
    const clickHandler = () => {
        ref.current.blur();
        setVisible(false);
    };
    return <button ref={ref} onClick={clickHandler}>{children}</button>
};

export default CloseButton;