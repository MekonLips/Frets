import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars } from '@fortawesome/free-solid-svg-icons';

import NavOpenButton from '../OpenButton/OpenButton.component';
import { Button } from './NavOpenButton.styled';

export const OpenButton = () => {
    return <Button>
        <NavOpenButton>
            <FontAwesomeIcon icon={faBars} />
        </NavOpenButton>
    </Button>
};

export default OpenButton;