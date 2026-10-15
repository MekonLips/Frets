import React from 'react';
import { Link } from 'react-router-dom';
import { useRecoilState, useSetRecoilState } from 'recoil';

import { showNavAtom, showRangeAtom } from '../../recoil/frets.recoil';
import Portal from '../Portal/Portal.component';
import Panel from '../Panel/Panel.component';
import CloseButton from './NavCloseButton/NavCloseButton.component';
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
            <div className="legacy-nav-content">
                <ul className="legacy-nav-list">
                    {EXERCISE_INSTRUCTIONS.map((instructions, exerciseIdx) => 
                        <li className="legacy-nav-item" key={`Nav/Exercise/${exerciseIdx}`}>
                            <Link className="legacy-nav-link" onClick={clickHandler} to={`/exercises/${exerciseIdx + 1}`}>
                                <h1>Exercise {exerciseIdx + 1}</h1>
                                {instructions.map((text, lineIdx) =>
                                    <p key={`Nav/Exercise/${exerciseIdx}/Line/${lineIdx}`}>{text}</p>)}
                            </Link>
                        </li>)}
                </ul>
            </div>
            <CloseButton />
        </Panel>
    </Portal>
};

export default NavComponent;