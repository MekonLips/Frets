import React from 'react';
import { Link, useHistory } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlay } from '@fortawesome/free-solid-svg-icons';

import { useFretsStore } from '../../store/useFretsStore';
import Portal from '../Portal/Portal.component';
import Panel from '../Panel/Panel.component';
import CloseButton from './NavCloseButton/NavCloseButton.component';
import { PORTALS } from '../../config/frets.config';
import { APP_SECTION_DESCRIPTIONS, APP_SECTION_TITLES, APP_SECTIONS } from '../../config/appSections.config';

const NavComponent = () => {
    const show = useFretsStore(state => state.showNav);
    const setShow = useFretsStore(state => state.setShowNav);
    const setRange = useFretsStore(state => state.setShowRange);
    const history = useHistory();
    const clickHandler = () => {
        setRange(true);
        setShow(false);
    };
    return <Portal id={PORTALS.NAV}>
        <Panel show={show}>
            <div className="legacy-nav-content">
                <ul className="legacy-nav-list">
                    <li className="legacy-nav-welcome">
                        <h1>Welcome to Frets!</h1>
                        <p>Frets helps you learn the notes across your instrument’s fretboard through short, focused daily exercises. Build familiarity, accuracy and confidence one note at a time.</p>
                        <button type="button" className="button button-primary legacy-nav-begin" onClick={() => {
                            clickHandler();
                            history.push('/exercises/1');
                        }}>
                            Begin <FontAwesomeIcon icon={faPlay} />
                        </button>
                    </li>
                    <li className="legacy-nav-separator" aria-hidden="true" />
                    {Object.values(APP_SECTIONS).map(section =>
                        <li className="legacy-nav-item legacy-nav-description" key={`Nav/Section/${section}`}>
                            <div className="legacy-nav-link">
                                <h2>{APP_SECTION_TITLES[section]}</h2>
                                <p>{APP_SECTION_DESCRIPTIONS[section]}</p>
                            </div>
                        </li>)}
                </ul>
            </div>
            <CloseButton />
        </Panel>
    </Portal>;
};

export default NavComponent;