import React from 'react';

import { useFretsStore } from '../../store/useFretsStore';
import Portal from '../Portal/Portal.component';
import Panel from '../Panel/Panel.component';
import CloseButton from './NavCloseButton/NavCloseButton.component';
import { PORTALS } from '../../config/frets.config';
import { APP_SECTION_DESCRIPTIONS, APP_SECTION_TITLES, APP_SECTIONS } from '../../config/appSections.config';
import LearnYourFretsButton from '../LearnYourFretsButton/LearnYourFretsButton.component';

const NavComponent = () => {
    const show = useFretsStore(state => state.showNav);
    return <Portal id={PORTALS.NAV}>
        <Panel show={show}>
            <div>
                <h1>Welcome to Frets!</h1>
                <p>Frets helps you learn the notes across your instrument’s fretboard through short, focused daily exercises. Build familiarity, accuracy and confidence one note at a time.</p>
                <LearnYourFretsButton forceView />
                <div className="overlay-separator" />
                <ul className="app-sections">
                    {Object.values(APP_SECTIONS).map(section =>
                        <li key={`Nav/Section/${section}`}>
                            <div>
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