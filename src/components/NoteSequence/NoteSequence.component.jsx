import React from 'react';
import { useParams } from 'react-router';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCaretLeft, faCaretRight } from '@fortawesome/free-solid-svg-icons';

import { useFretsStore } from '../../store/useFretsStore';
import { getNoteByIdx } from '../../utils/note.utils';

const NoteSequenceComponent = () => {
    const { exercise } = useParams();
    const isExercise = exercise ? true : false;
    const exerciseState = useFretsStore(state => state.exercises[String(exercise ?? '')]);
    const stage = exerciseState?.stage ?? 1;
    const sequence = exerciseState?.sequence ?? [];
    const setStage = useFretsStore(state => state.setExerciseStage);

    const isFirstStage = value => value === 1;
    const isLastStage = value => value === sequence.length;
    const prevClickHandler = () => setStage(exercise, stage => !isFirstStage(stage) ? stage - 1 : stage);
    const nextClickHandler = () => setStage(exercise, stage => !isLastStage(stage) ? stage + 1 : stage);
    const clickNoteHandler = (e, idx) => {
        e.preventDefault();
        setStage(exercise, idx + 1);
    };

    if (isExercise && sequence.length && parseInt(exercise) !== 6)
        return <div className="legacy-sequence-container">
            <button className="legacy-sequence-button" onClick={prevClickHandler} disabled={isFirstStage(stage)}><FontAwesomeIcon icon={faCaretLeft} /></button>
            <h1 className="legacy-sequence">{sequence.map((noteIdx, idx) => <a className={`legacy-sequence-note ${idx === stage - 1 ? 'is-current' : ''}`} key={`NoteSequence/Note/${idx}`} href="#" onClick={e => clickNoteHandler(e, idx)}>{getNoteByIdx(noteIdx)}</a>)}</h1>
            <button className="legacy-sequence-button" onClick={nextClickHandler} disabled={isLastStage(stage)}><FontAwesomeIcon icon={faCaretRight} /></button>
        </div>;
    return null;
};

export default NoteSequenceComponent;