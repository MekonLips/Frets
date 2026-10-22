import React from 'react';
import { useLocation, useHistory } from 'react-router';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlay } from '@fortawesome/free-solid-svg-icons';

import { useFretsStore } from '../../store/useFretsStore';
import { resumeTimerWarningAudio, playTimerToggleChime } from '../../utils/timerWarningAudio.utils';

const LearnYourFretsButton = ({ forceView = false }) => {
  const location = useLocation();
  const history = useHistory();
  const visible = useFretsStore(state => state.showNav || state.showInstruments);
  const setShowNav = useFretsStore(state => state.setShowNav);
  const setShowInstruments = useFretsStore(state => state.setShowInstruments);
  const timerRunning = useFretsStore(state => state.timerRunning);
  const setTimerRunning = useFretsStore(state => state.setTimerRunning);
  const isViewingExercise = location.pathname.startsWith('/exercises/');
  return <button
        type="button"
        className={`control-button control-button-large learn-your-frets-button ${(isViewingExercise && !forceView) ? `hidden` : ``}`}
        onClick={() => {
            resumeTimerWarningAudio();
            if (!timerRunning) {
                playTimerToggleChime(true);
                setTimerRunning(true);
            }
            history.push('/exercises/1');
            if (visible) {
                setShowNav(false);
                setShowInstruments(false);
            }
        }}
    >
        Learn Your Frets
        <FontAwesomeIcon icon={faPlay} />
    </button>
};

export default LearnYourFretsButton;
