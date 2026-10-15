import React from 'react';
import { useParams } from 'react-router';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome } from '@fortawesome/free-solid-svg-icons';

import NavHomeButton from '../HomeButton/HomeButton.component';

const HomeButton = () => {
    const { exercise } = useParams();
    const isExercise = exercise ? true : false;
    if (isExercise)
        return <div className="legacy-nav-icon-button-wrapper">
            <NavHomeButton show={isExercise}>
                <FontAwesomeIcon icon={faHome} />
            </NavHomeButton>
        </div>
    else
        return null;
};

export default HomeButton;