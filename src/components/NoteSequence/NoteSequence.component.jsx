import React, { useLayoutEffect, useRef, useState } from 'react';
import { useParams } from 'react-router';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCaretLeft, faCaretRight } from '@fortawesome/free-solid-svg-icons';

import { useFretsStore } from '../../store/useFretsStore';
import { getNoteByIdx, getNoteSequenceMidiPitch } from '../../utils/note.utils';
import { playPluckedNote } from '../../utils/audio.utils';

const NoteSequenceComponent = () => {
    const { exercise } = useParams();
    const isExercise = exercise ? true : false;
    const exerciseState = useFretsStore(state => state.exercises[String(exercise ?? '')]);
    const stage = exerciseState?.stage ?? 1;
    const sequence = exerciseState?.sequence ?? [];
    const setStage = useFretsStore(state => state.setExerciseStage);
    const containerRef = useRef(null);
    const highlightRef = useRef(null);
    const [highlightPosition, setHighlightPosition] = useState(null);

    useLayoutEffect(() => {
        const container = containerRef.current;
        if (!container || !sequence.length) {
            setHighlightPosition(null);
            return undefined;
        }

        const updatePosition = () => {
            const currentNote = container.querySelectorAll('.legacy-sequence-note')[stage - 1];
            if (!currentNote) return;
            const containerRect = container.getBoundingClientRect();
            const noteRect = currentNote.getBoundingClientRect();
            setHighlightPosition({
                x: noteRect.left + noteRect.width / 2 - containerRect.left,
                y: noteRect.top + noteRect.height / 2 - containerRect.top
            });
        };

        updatePosition();
        const resizeObserver = typeof ResizeObserver !== 'undefined'
            ? new ResizeObserver(updatePosition)
            : null;
        resizeObserver?.observe(container);
        window.addEventListener('resize', updatePosition);

        return () => {
            resizeObserver?.disconnect();
            window.removeEventListener('resize', updatePosition);
        };
    }, [stage, sequence]);

    const isFirstStage = value => value === 1;
    const isLastStage = value => value === sequence.length;
    const prevClickHandler = () => setStage(exercise, stage => !isFirstStage(stage) ? stage - 1 : stage);
    const nextClickHandler = () => setStage(exercise, stage => !isLastStage(stage) ? stage + 1 : stage);
    const clickNoteHandler = (e, idx) => {
        e.preventDefault();
        try {
            playPluckedNote(getNoteSequenceMidiPitch(sequence[idx]));
        } catch (error) {
            // Audio is optional; note selection should still work if unsupported.
        }
        setStage(exercise, idx + 1);
    };

    if (isExercise && sequence.length)
        return <div className="legacy-sequence-container" ref={containerRef} style={{ position: 'relative' }}>
            {highlightPosition && <span
                ref={highlightRef}
                aria-hidden="true"
                style={{
                    position: 'absolute',
                    zIndex: 0,
                    pointerEvents: 'none',
                    left: highlightPosition.x,
                    top: highlightPosition.y,
                    width: '2.5rem',
                    height: '2.5rem',
                    borderRadius: '50%',
                    backgroundColor: 'orange',
                    transform: 'translate(-50%, -50%)',
                    transition: typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
                        ? 'none'
                        : 'left 180ms ease, top 180ms ease'
                }}
            />}
            {/* <button className="legacy-sequence-button" onClick={prevClickHandler} disabled={isFirstStage(stage)}><FontAwesomeIcon icon={faCaretLeft} /></button> */}
            <h1 className="legacy-sequence">{sequence.map((noteIdx, idx) => <a className={`legacy-sequence-note ${idx === stage - 1 ? 'is-current' : ''}`} key={`NoteSequence/Note/${idx}`} href="#" onClick={e => clickNoteHandler(e, idx)}>{getNoteByIdx(noteIdx)}</a>)}</h1>
            {/* <button className="legacy-sequence-button" onClick={nextClickHandler} disabled={isLastStage(stage)}><FontAwesomeIcon icon={faCaretRight} /></button> */}
        </div>;
    return null;
};

export default NoteSequenceComponent;