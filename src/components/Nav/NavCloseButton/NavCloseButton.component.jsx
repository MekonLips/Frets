import React from 'react';
import { useRecoilValue } from 'recoil';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCaretLeft } from '@fortawesome/free-solid-svg-icons';

import { showNavAtom } from '../../../recoil/frets.recoil';
import { Button } from './NavCloseButton.styled';
import NavCloseButton from '../CloseButton/CloseButton.component';

export const CloseButton = () => {
    const show = useRecoilValue(showNavAtom);
    return <Button show={show}>
        <NavCloseButton>
            <FontAwesomeIcon icon={faCaretLeft} />
        </NavCloseButton>
    </Button>
};

export default CloseButton;