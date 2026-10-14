import React from 'react';
import { useParams } from 'react-router';
import { useRecoilValue } from 'recoil';

import { exerciseSequenceAtom, timerRunningAtom, exercisePatternAtom, exerciseBeatAtom, exerciseStageAtom, exerciseNotesAtom, selectedInstrumentIdAtom, getInstrumentSelector, startFretAtom } from '../../../recoil/frets.recoil';
import { Notes, Note } from './Notes.styled';
import Portal from '../../Portal/Portal.component';
import { PORTALS } from '../../../config/frets.config';

const NotesComponent = () => {
    const { exercise } = useParams();
    const isExercise = exercise ? true : false;
    const beat = useRecoilValue(exerciseBeatAtom(exercise));
    const pattern = useRecoilValue(exercisePatternAtom(exercise));
    const selectedInstrumentId = useRecoilValue(selectedInstrumentIdAtom);
    const instrument = useRecoilValue(getInstrumentSelector(selectedInstrumentId));
    const startFret = useRecoilValue(startFretAtom);
    const stage = useRecoilValue(exerciseStageAtom(exercise));
    const notes = useRecoilValue(exerciseNotesAtom(exercise));
    const sequence = useRecoilValue(exerciseSequenceAtom(exercise));
    const running = useRecoilValue(timerRunningAtom);
    const activeString = pattern.length && beat < instrument.strings.length * 2 * sequence.length ? running ? pattern[beat > 0 ? beat - 1 : beat].string : pattern[beat].string : '';
    const activeFret = pattern.length && beat < instrument.strings.length * 2 * sequence.length ? running ? pattern[beat > 0 ? beat - 1 : beat].fret : pattern[beat].fret : '';
    return <Portal id={PORTALS.FRET_GRID}>
        <Notes strings={instrument.strings.length} start={startFret}>
            {stage && notes.length && notes[stage - 1].map((obj, idx) => 
                <Note key={`Notes/${idx}`} activeString={activeString} activeFret={activeFret} {...obj}>
                    <span>{isExercise ? obj.fret : obj.note}</span>
                </Note>)}
        </Notes>
    </Portal>
};

export default NotesComponent;