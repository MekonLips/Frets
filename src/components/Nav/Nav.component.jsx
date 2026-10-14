import React from 'react';
import { Link } from 'react-router-dom';
import { useRecoilState, useSetRecoilState } from 'recoil';

import { showNavAtom, showRangeAtom } from '../../recoil/frets.recoil';
import Portal from '../Portal/Portal.component';
import Panel from '../Panel/Panel.component';
import CloseButton from './NavCloseButton/NavCloseButton.component';
import { Content } from './Nav.styled';
import { PORTALS, EXERCISE_INSTRUCTIONS } from '../../config/frets.config';

const NavComponent = () => {
    const [ show, setShow ] = useRecoilState(showNavAtom);
    const setRange = useSetRecoilState(showRangeAtom);
    const clickHandler = () => {
        setRange(true);
        setShow(false);
    };
    return <Portal id={PORTALS.NAV}>
        <Panel show={show}>
            <Content>
                <ul>
                    {EXERCISE_INSTRUCTIONS.map((instructions, exerciseIdx) => 
                        <li key={`Nav/Exercise/${exerciseIdx}`}>
                            <Link onClick={clickHandler} to={`/exercises/${exerciseIdx + 1}`}>
                                <h1>Exercise {exerciseIdx + 1}</h1>
                                {instructions.map((text, lineIdx) =>
                                    <p key={`Nav/Exercise/${exerciseIdx}/Line/${lineIdx}`}>{text}</p>)}
                            </Link>
                        </li>)}
                </ul>
            </Content>
            <CloseButton />
        </Panel>
    </Portal>
};

export default NavComponent;