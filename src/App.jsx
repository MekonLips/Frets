import React, { useEffect } from 'react';
import { Route, useLocation } from 'react-router';

import { useFretsStore } from './store/useFretsStore';
import Overlay from './components/Overlay/Overlay.component';
import Nav from './components/Nav/Nav.component';
import NavOpenButton from './components/Nav/NavOpenButton/NavOpenButton.component';
import NavHomeButton from './components/Nav/NavHomeButton/NavHomeButton.component';
import Tab from './components/Tab/Tab.component';
import Instrument from './components/Instrument/Instrument.component';
import Notes from './components/Instrument/Notes/Notes.component';
import InstrumentSelector from './components/Controls/InstrumentSelector/InstrumentSelector.component';
import RangeSelector from './components/Controls/RangeSelector/RangeSelector.component';
import Range from './components/Range/Range.component';
import Timer from './components/Timer/Timer.component';
import TimerToggleButton from './components/Timer/ToggleButton/ToggleButton.component';
import TimerResetButton from './components/Timer/ResetButton/ResetButton.component';
import Metronome from './components/Metronome/Metronome.component';
import Exercises from './components/Exercises/Exercises.component';
import Instructions from './components/Exercises/Instructions/Instructions.component';
import Controls from './components/Exercises/Controls/Controls.component';
import NoteSequence from './components/NoteSequence/NoteSequence.component';
import Grid from './components/Grid/Grid.component';

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
          <Range />
          <Grid>
            <div>
              <NavOpenButton />
              <NavHomeButton />
            </div>
            <div>
              <div>
                <Instructions />
                <Controls />
              </div>
              <div>
                <Timer />
                <TimerToggleButton />
                <TimerResetButton />
                <Metronome />
              </div>
            </div>
            <div>
              <InstrumentSelector />
              <RangeSelector />
            </div>
            <div>
              <Instrument />
              <Notes />
            </div>
            <div></div>
            <div>
              <Tab />
              <NoteSequence />
            </div>
            <div></div>
          </Grid>
        </>}
    />;
};

export default App;
