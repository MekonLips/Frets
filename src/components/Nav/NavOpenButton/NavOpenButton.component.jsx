import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars } from '@fortawesome/free-solid-svg-icons';

import NavOpenButton from '../OpenButton/OpenButton.component';

export const OpenButton = () => {
    return <div className="legacy-nav-icon-button-wrapper">
        <NavOpenButton>
            <FontAwesomeIcon icon={faBars} />
        </NavOpenButton>
    </div>
};

export default OpenButton;