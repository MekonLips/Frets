import React from 'react';
import { useRecoilValue } from 'recoil';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCaretLeft } from '@fortawesome/free-solid-svg-icons';

import { showNavAtom } from '../../../recoil/frets.recoil';
import NavCloseButton from '../CloseButton/CloseButton.component';

export const CloseButton = () => {
    const show = useRecoilValue(showNavAtom);
    return <span className="legacy-nav-close-wrapper">
        <NavCloseButton className={'legacy-nav-close-button ' + (show ? 'is-visible' : '')}>
            <FontAwesomeIcon icon={faCaretLeft} />
        </NavCloseButton>
    </span>
};

export default CloseButton;