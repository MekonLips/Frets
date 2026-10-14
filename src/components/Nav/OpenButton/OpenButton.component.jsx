import React, { useRef } from 'react';
import { useSetRecoilState } from 'recoil';

import { showNavAtom } from '../../../recoil/frets.recoil';

const OpenButton = ({ children }) => {
    const setVisible = useSetRecoilState(showNavAtom);
    const ref = useRef();
    const clickHandler = () => {
        ref.current.blur();
        setVisible(true);
    };
    return <button ref={ref} onClick={clickHandler}>{children}</button>
};

export default OpenButton;