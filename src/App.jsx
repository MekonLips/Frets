import React, { useEffect } from 'react';
import { Route, useLocation } from 'react-router';

import { useFretsStore } from './store/useFretsStore';
import Overlay from './components/Overlay/Overlay.component';
import Nav from './components/Nav/Nav.component';
import NavOpenButton from './components/Nav/NavOpenButton/NavOpenButton.component';
import NavHomeButton from './components/Nav/NavHomeButton/NavHomeButton.component';
import InstrumentsOverlay from './components/InstrumentsOverlay/InstrumentsOverlay.component';
import InstrumentOpenButton from './components/InstrumentOpenButton/InstrumentOpenButton.component';
import Tab from './components/Tab/Tab.component';
import Instrument from './components/Instrument/Instrument.component';
import Notes from './components/Instrument/Notes/Notes.component';
import RangeSelector from './components/Controls/RangeSelector/RangeSelector.component';
import Range from './components/Range/Range.component';
import TimerDisplay from './components/Timer/TimerDisplay.component';
import TimerToggleButton from './components/Timer/ToggleButton/ToggleButton.component';
import TimerResetButton from './components/Timer/ResetButton/ResetButton.component';
import Metronome from './components/Metronome/Metronome.component';
import Exercises from './components/Exercises/Exercises.component';
import Instructions from './components/Exercises/Instructions/Instructions.component';
import TempoControls from './components/Exercises/TempoControls/TempoControls.component';
import NoteSequence from './components/NoteSequence/NoteSequence.component';
import Grid from './components/Grid/Grid.component';
import ShuffleButton from './components/Exercises/ShuffleButton/ShuffleButton.component';
import AccidentalsToggle from './components/Exercises/AccidentalsToggle/AccidentalsToggle.component';

const App = () => {
  const location = useLocation();
  const setTimerRunning = useFretsStore(state => state.setTimerRunning);

  useEffect(() => {
    setTimerRunning(false);
  }, [location.pathname, setTimerRunning]);

  return <Route
      path={['/exercises/:exercise', '/']}
      render={({ match }) =>
        <>
          {match.params.exercise && <Exercises />}
          <Overlay />
          <Nav />
          <InstrumentsOverlay />
          <Range />
          <Grid>
            <div>
              <NavOpenButton />
              <NavHomeButton />
            </div>
            <div className="exercise-panel">
              <div className="exercise-instructions">
                <Instructions />
              </div>
              <div className="exercise-controls">
                <TempoControls />
                <div className="timer">
                  <TimerDisplay />
                  <div class="timer-controls">
                    <TimerToggleButton />
                    <TimerResetButton />
                  </div>
                </div>
                <ShuffleButton />
                <AccidentalsToggle />
                <Metronome />
              </div>
            </div>
            <div className="legacy-instrument-menu-trigger">
              <InstrumentOpenButton />
            </div>
            <div>
              <Instrument />
              <Notes />
            </div>
            <div></div>
            <div className="legacy-tab-sequence-cell">
              <div className="legacy-tab-range-container">
                <Tab />
                <div className="legacy-range-selector-container"><RangeSelector /></div>
              </div>
              <NoteSequence />
            </div>
            <div></div>
          </Grid>
        </>}
    />;
};

export default App;
