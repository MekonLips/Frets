import React, { useEffect, useRef } from 'react';
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
import TimerWarning from './components/Timer/TimerWarning.component';
import TimerToggleButton from './components/Timer/ToggleButton/ToggleButton.component';
import TimerResetButton from './components/Timer/ResetButton/ResetButton.component';
import ExerciseToggleButton from './components/Exercises/ExerciseToggleButton/ExerciseToggleButton.component';
import Metronome from './components/Metronome/Metronome.component';
import Exercises from './components/Exercises/Exercises.component';
import Instructions from './components/Exercises/Instructions/Instructions.component';
import TempoControls from './components/Exercises/TempoControls/TempoControls.component';
import NoteSequence from './components/NoteSequence/NoteSequence.component';
import Grid from './components/Grid/Grid.component';
import ShuffleButton from './components/Exercises/ShuffleButton/ShuffleButton.component';
import AccidentalsToggle from './components/Exercises/AccidentalsToggle/AccidentalsToggle.component';
import LoopToggle from './components/Exercises/LoopToggle/LoopToggle.component';
import ExercisesNavigation from './components/Exercises/Navigation.component';
import LearnYourFretsButton from './components/LearnYourFretsButton/LearnYourFretsButton.component';
import InstallFretsButton from './components/InstallFretsButton/InstallFretsButton.component';

const App = () => {
  const location = useLocation();
  const setSequencePlaying = useFretsStore(state => state.setSequencePlaying);
  const startFret = useFretsStore(state => state.startFret);
  const setStartFret = useFretsStore(state => state.setStartFret);
  const previousPathname = useRef(location.pathname);
  const savedExerciseStartFret = useRef(null);

  useEffect(() => {
    setSequencePlaying(false);

    const wasViewingExercise = previousPathname.current.startsWith('/exercises/');
    const isViewingExercise = location.pathname.startsWith('/exercises/');

    if (wasViewingExercise && !isViewingExercise) {
      savedExerciseStartFret.current = startFret;
      setStartFret(1);
    } else if (!wasViewingExercise && isViewingExercise && savedExerciseStartFret.current !== null) {
      setStartFret(savedExerciseStartFret.current);
    }

    previousPathname.current = location.pathname;
  }, [location.pathname, setSequencePlaying, setStartFret, startFret]);

  return <Route
      path={['/exercises/:exercise', '/']}
      render={({ match }) =>
        <>
          {match.params.exercise && <Exercises />}
          {match.params.exercise && <TimerWarning />}
          <Overlay />
          <Nav />
          <InstrumentsOverlay />
          <Range />
          <Grid>
            <div>
              <NavOpenButton />
              <NavHomeButton />
            </div>
            <div className={`exercise-panel ${!match.params.exercise ? 'home-exercise-panel' : ''}`}>
              <div className="exercise-instructions">
                <ExercisesNavigation />
                <Instructions />
                <ExerciseToggleButton />
                <LearnYourFretsButton />
                {!match.params.exercise && <InstallFretsButton />}
              </div>
              <div className="exercise-controls">
                <div className="timer">
                  <TimerDisplay />
                  <div className="timer-controls">
                    <TimerToggleButton />
                    <TimerResetButton />
                  </div>
                </div>
                <TempoControls />
                <ShuffleButton />
                <AccidentalsToggle />
                <LoopToggle />
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
                {match.params.exercise && <div className="legacy-range-selector-container"><RangeSelector /></div>}
              </div>
              <NoteSequence />
            </div>
            <div></div>
          </Grid>
        </>}
    />;
};

export default App;
