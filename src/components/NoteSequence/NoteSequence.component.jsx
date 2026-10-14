import React from 'react';
import { useParams } from 'react-router';
import { useRecoilValue, useRecoilState } from 'recoil';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCaretLeft, faCaretRight } from '@fortawesome/free-solid-svg-icons';

import { exerciseStageAtom, exerciseSequenceAtom } from '../../recoil/frets.recoil';
import { getNoteByIdx } from '../../utils/note.utils';
import { Container, Sequence, Note, Button } from './NoteSequence.styled.js';

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
            <Container>
                <Button onClick={prevClickHandler} disabled={isFirstStage(stage)}><FontAwesomeIcon icon={faCaretLeft} /></Button>
                <Sequence>{sequence.map((noteIdx, idx) => <Note key={`NoteSequence/Note/${idx}`} to='#' onClick={e => clickNoteHandler(e, idx)} current={idx === stage - 1 ? true : false}>{getNoteByIdx(noteIdx)}</Note>)}</Sequence>
                <Button onClick={nextClickHandler} disabled={isLastStage(stage)}><FontAwesomeIcon icon={faCaretRight} /></Button>
            </Container>
        </>
    else
        return null;
};

export default NoteSequenceComponent;