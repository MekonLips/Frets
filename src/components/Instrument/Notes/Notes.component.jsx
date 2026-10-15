import React from 'react';
import { useParams } from 'react-router';

import { useFretsStore, getSelectedInstrument } from '../../../store/useFretsStore';
import { gridColumns } from '../../../utils/grid.utils';
import { Z_INDEX, GRID_MARGIN, COLORS } from '../../../config/frets.config';
import Portal from '../../Portal/Portal.component';
import { PORTALS } from '../../../config/frets.config';

const NotesComponent = () => {
    const { exercise } = useParams();
    const isExercise = Boolean(exercise);
    const exerciseState = useFretsStore(state => state.exercises[String(exercise ?? '')]);
    const beat = exerciseState?.beat ?? 0;
    const pattern = exerciseState?.pattern ?? [];
    const stage = exerciseState?.stage ?? 1;
    const notes = exerciseState?.notes ?? [];
    const sequence = exerciseState?.sequence ?? [];
    const selectedInstrumentId = useFretsStore(state => state.selectedInstrumentId);
    const instrument = getSelectedInstrument(selectedInstrumentId);
    const running = useFretsStore(state => state.timerRunning);
    const activeIndex = running && beat > 0 ? beat - 1 : beat;
    const activeString = pattern.length && beat < instrument.strings.length * 2 * sequence.length ? pattern[activeIndex]?.string ?? '' : '';
    const activeFret = pattern.length && beat < instrument.strings.length * 2 * sequence.length ? pattern[activeIndex]?.fret ?? '' : '';
    return <Portal id={PORTALS.FRET_GRID}>
        <div className="legacy-notes" style={{ '--string-count': instrument.strings.length, '--notes-min-height': `${instrument.strings.length}px`, '--grid-columns': `${GRID_MARGIN}vw ${gridColumns(24)} ${GRID_MARGIN}vw`, '--note-z': Z_INDEX.Note, '--note-color': COLORS.Note.color, '--note-border': COLORS.Note.borderColor, '--note-bg': COLORS.Note.backgroundColor, '--note-active-color': COLORS.Note.colorAlt, '--note-active-border': COLORS.Note.borderColorAlt, '--note-active-bg': COLORS.Note.backgroundColorAlt }}>
            {stage && notes.length && notes[stage - 1]?.map((obj, idx) =>
                <div className={`legacy-note ${obj.string === activeString && obj.fret === activeFret ? 'legacy-note-active' : ''}`} key={`Notes/${idx}`} style={{ '--note-column': obj.fret + 1, '--note-row': obj.string }}>
                    <span>{isExercise ? obj.fret : obj.note}</span>
                </div>)}
        </div>
    </Portal>;
};

export default NotesComponent;