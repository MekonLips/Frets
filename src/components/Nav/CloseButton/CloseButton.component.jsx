import React, { useRef } from 'react';
import { useFretsStore } from '../../../store/useFretsStore';

const CloseButton = ({ children, className = '' }) => {
    const setVisible = useFretsStore(state => state.setShowNav);
    const ref = useRef();
    const clickHandler = () => {
        ref.current.blur();
        setVisible(false);
    };
    return <button className={className} ref={ref} onClick={clickHandler}>{children}</button>;
};

export default CloseButton;