import React from 'react';
import { useParams } from 'react-router';
import { useRecoilValue, useRecoilState } from 'recoil';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCaretLeft, faCaretRight } from '@fortawesome/free-solid-svg-icons';

import { exerciseStageAtom, exerciseSequenceAtom } from '../../recoil/frets.recoil';
import { getNoteByIdx } from '../../utils/note.utils';

const NoteSequenceComponent = () => {
    const { exercise } = useParams();
    const isExercise = exercise ? true : false;
    const [ stage, setStage ] = useRecoilState(exerciseStageAtom(exercise));
    const sequence = useRecoilValue(exerciseSequenceAtom(exercise));

    const isFirstStage = stage => stage === 1 ? true : false;

    const isLastStage = stage => stage === sequence.length ? true : false;

    const prevClickHandler = e => setStage(stage => !isFirstStage(stage) ? stage - 1 : stage);

    const nextClickHandler = e => setStage(stage => !isLastStage(stage) ? stage + 1 : stage);

    const clickNoteHandler = (e, idx) => {
        e.preventDefault();
        setStage(_ => idx + 1);
    };

    if (isExercise && sequence && parseInt(exercise) !== 6)
        return <>
            <div className="legacy-sequence-container">
                <button className="legacy-sequence-button" onClick={prevClickHandler} disabled={isFirstStage(stage)}><FontAwesomeIcon icon={faCaretLeft} /></button>
                <h1 className="legacy-sequence">{sequence.map((noteIdx, idx) => <a className={`legacy-sequence-note ${idx === stage - 1 ? 'is-current' : ''}`} key={`NoteSequence/Note/${idx}`} href='#' onClick={e => clickNoteHandler(e, idx)}>{getNoteByIdx(noteIdx)}</a>)}</h1>
                <button className="legacy-sequence-button" onClick={nextClickHandler} disabled={isLastStage(stage)}><FontAwesomeIcon icon={faCaretRight} /></Button>
            </div>
        </>
    else
        return null;
};

export default NoteSequenceComponent;