import React from 'react';
import { useParams } from 'react-router';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome } from '@fortawesome/free-solid-svg-icons';

import NavHomeButton from '../HomeButton/HomeButton.component';
import { Button } from './NavHomeButton.styled';

const HomeButton = () => {
    const { exercise } = useParams();
    const isExercise = exercise ? true : false;
    if (isExercise)
        return <Button>
            <NavHomeButton show={isExercise}>
                <FontAwesomeIcon icon={faHome} />
            </NavHomeButton>
        </Button>
    else
        return null;
};

export default HomeButton;