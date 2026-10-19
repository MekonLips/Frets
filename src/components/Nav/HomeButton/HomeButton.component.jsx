import React, { useRef } from 'react';
import { useHistory } from 'react-router';

const HomeButton = ({ children, show }) => {
    const history = useHistory();
    const ref = useRef();
    const clickHandler = e => {
        e.preventDefault();
        ref.current.blur();
        history.push('/');
    };
    if (show)
        return <button ref={ref} onClick={clickHandler}>{children}</button>
    else
        return null;
};

export default HomeButton;