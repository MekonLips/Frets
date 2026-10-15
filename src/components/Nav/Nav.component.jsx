import React from 'react';
import { Link } from 'react-router-dom';

import { useFretsStore } from '../../store/useFretsStore';
import Portal from '../Portal/Portal.component';
import Panel from '../Panel/Panel.component';
import CloseButton from './NavCloseButton/NavCloseButton.component';
import { PORTALS, EXERCISE_INSTRUCTIONS } from '../../config/frets.config';

const NavComponent = () => {
    const show = useFretsStore(state => state.showNav);
    const setShow = useFretsStore(state => state.setShowNav);
    const setRange = useFretsStore(state => state.setShowRange);
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
    </Portal>;
};

export default NavComponent;