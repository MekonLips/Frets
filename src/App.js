import React from 'react';
import { Route } from 'react-router';

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

// change pitch of metronome to match note in sequence

/*
    // Components
        // CurrentNote - display the current note
        // NoteSequence - display note sequence pagination style
        // BeginButton - begin exercise
        // NextStageButton - proceed to next stage of exercise
        // NextExerciseButton - proceed to next exercise
        // ConfigButton - access selectors i.e. instrument, range, include accidentals
        // IntroductionMessage - Play the note up and down 3x, then move onto the next.
        //                       Play slowly with no mistakes.
        //                       When you have completed all notes, repeat 1x.
        // TimerExpiredMessage - You have completed your 5 minutes of practice for today.
        // ExerciseCompletedMessage - You completed the exercise and can proceed to the next.
        // Metronome

    // exercise 1
        // exerciseSequenceAtom - random natural notes
        // exerciseNotesAtom - positions for all notes in sequence
        // exercisePatternAtom - up then down for each note
        // Instructions
            // Timer
            // ConfigButton
            // introduction
                // BeginButton - "Go"
                // NextStageButton - "Next note"
            // message if all exercises completed
                // NextExerciseButton - "Proceed to next exercise"
            // message if timer runs out
        // Tab
            // output pattern
            // show pattern[currentStage] and pattern[currentStage + 1]
            // slide left on progressing to next
*/
/*
Controls
  Nav
    NavOpenButton
    NavCloseButton
  Timer
    Timer
    TimerToggleButton
    TimerResetButton
  Instrument
    InstrumentSelector
  Range    
    RangeSelector
  Exercise
    Instructions
    ToggleAccidentalsButton
    ProceedButton
    ResetButton
    RefreshButton
*/
/*
state persistence
highlight current note on fretboard, mute other notes
play sequence of notes in time with metronome - allow looping
create tab for any note going up or down and allow any combination to be displayed
update tab for metronome note sequences so next section is always visible - slide sections left
modal for all notes completed / timer expiry notification / etcetera
*/
/*
Modal

Nav
  Exercises
    menu leading to each exercise
  Controls
    InstrumentControls
      InstrumentSelector
      RangeSelecctor
    ExerciseControls
      ToggleAccidentalsButton
        toggle inclusion of accidentals in note selection
        fixed in some exercises, optional in others
      ExerciseResetButton
        start over with same sequence
      ExerciseRefreshButton
        start over with new sequence
      ExerciseProceedButton
        displayed on completing an exercise
    Timer
      show time remaining on hover
      trigger start on beginning an exercise
      can be paused or cancelled
      run in web worker
    TimerToggleButton
    TimerCancelButton
NavOpenButton
NavCloseButton

TabSection
TabPrefix

Sequence
  display a list of notes as pagination
  SequenceNote
    individual notes - highlight current note

Metronome
  play one note per beat
  start at 40 bpm
  run in web worker
MetronomeIncreaseButton
MetronomeDecreaseButton
*/
/*
Exercise 1
  play slowly, no mistakes
  const sequence = getRandomNoteSequence(false);
  const pattern = getExercisePattern(1, sequence);
  continue until pattern completed or until timer runs out
Exercise 2
  metronome
  const sequence = getRandomNoteSequence(false);
  const pattern = getExercisePattern(2, sequence);
  continue until pattern completed or until timer runs out
Exercise 3
  metronome
  const sequence = getRandomNoteSequence(true, 2);
  const pattern = getExercisePattern(3, sequence);
  continue until pattern completed or until timer runs out
Exercise 4
  metronome
  optional accidentals
  const sequence = getRandomNoteSequence(accidentals, 2);
  const pattern = getExercisePattern(4, sequence);
  continue until feels easy or until timer runs out
Exercise 5
  metronome
  const sequence = getRandomNoteSequence(false);
  const pattern = getExercisePattern(5, sequence);
  continue until pattern completed or until timer runs out
Exercise 6
  metronome
  increase / decrease speed buttons
  repeat exercises 2 - 5
  repeat until able to complete at 80bpm or until timer runs out
*/

const App = () => {
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
            <div>
            </div>
          </Grid>
        </>} />
};

export default App;