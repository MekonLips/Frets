import React, { useRef } from 'react';
import { useFretsStore } from '../../../store/useFretsStore';

const OpenButton = ({ children }) => {
    const setVisible = useFretsStore(state => state.setShowNav);
    const ref = useRef();
    const clickHandler = () => {
        ref.current.blur();
        setVisible(true);
    };
    return <button ref={ref} onClick={clickHandler}>{children}</button>;
};

export default OpenButton;