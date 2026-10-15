import React from 'react';
import { useParams } from 'react-router';
import { useRecoilValue } from 'recoil';

import { exerciseSequenceAtom, timerRunningAtom, exercisePatternAtom, exerciseBeatAtom, exerciseStageAtom, exerciseNotesAtom, selectedInstrumentIdAtom, getInstrumentSelector, startFretAtom } from '../../../recoil/frets.recoil';
import { gridColumns } from '../../../utils/grid.utils';
import { Z_INDEX, GRID_MARGIN, COLORS } from '../../../config/frets.config';
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
        <div className="legacy-notes" style={{ '--string-count': instrument.strings.length, '--grid-columns': `${GRID_MARGIN}vw ${gridColumns(24)} ${GRID_MARGIN}vw`, '--note-z': Z_INDEX.Note, '--note-color': COLORS.Note.color, '--note-border': COLORS.Note.borderColor, '--note-bg': COLORS.Note.backgroundColor, '--note-active-color': COLORS.Note.colorAlt, '--note-active-border': COLORS.Note.borderColorAlt, '--note-active-bg': COLORS.Note.backgroundColorAlt }}>
            {stage && notes.length && notes[stage - 1].map((obj, idx) => 
                <div className={`legacy-note ${obj.string === activeString && obj.fret === activeFret ? 'legacy-note-active' : ''}`} key={`Notes/${idx}`} style={{ '--note-column': obj.fret + 1, '--note-row': obj.string }}>
                    <span>{isExercise ? obj.fret : obj.note}</span>
                </div>)}
        </div>
    </Portal>
};

export default NotesComponent;